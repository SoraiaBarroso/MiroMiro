import { defineEventHandler } from 'h3'
import { useServerStripe } from '#stripe/server'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const supabase = serverSupabaseServiceRole(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userId = user.id || user.sub

  try {
    // Get user profile to find subscription ID
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_subscription_id, stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      throw createError({
        statusCode: 404,
        statusMessage: `User profile not found: ${profileError.message}`
      })
    }

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User profile not found'
      })
    }

    // If no subscription ID stored, try to find it by customer email
    let subscriptionId = profile.stripe_subscription_id

    if (!subscriptionId) {
      // Search for active subscriptions by customer email
      const customers = await stripe.customers.list({
        email: profile.email,
        limit: 1
      })

      if (customers.data.length > 0) {
        const customer = customers.data[0]
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          subscriptionId = subscriptions.data[0].id

          // Store the subscription ID for future use
          await supabase
            .from('user_profiles')
            .update({
              stripe_subscription_id: subscriptionId,
              stripe_customer_id: customer.id
            })
            .eq('id', userId)
        }
      }
    }

    if (!subscriptionId) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No active subscription found'
      })
    }

    // Cancel the subscription at period end (so they keep access until the end of billing period)
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })

    console.log(`✅ Subscription ${subscriptionId} will be canceled at period end for user ${profile.email}`)

    return {
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: canceledSubscription.cancel_at,
      currentPeriodEnd: canceledSubscription.current_period_end
    }
  } catch (error: unknown) {
    console.error('Subscription cancellation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription'
    const statusCode = (error as { statusCode?: number }).statusCode || 500
    throw createError({
      statusCode,
      statusMessage: errorMessage
    })
  }
})
