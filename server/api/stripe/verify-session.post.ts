import { defineEventHandler, readBody } from 'h3'
import { useServerStripe } from '#stripe/server'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const supabase = serverSupabaseServiceRole(event)
  const { sessionId } = await readBody(event)

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Payment not completed'
      })
    }

    // Get customer email
    const customerEmail = session.customer_details?.email || session.customer_email

    if (!customerEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No customer email found'
      })
    }

    // Determine the plan tier from the price ID
    const config = useRuntimeConfig()
    let premiumTier = 'free'
    const priceId = session.line_items?.data?.[0]?.price?.id || session.metadata?.price_id

    // Check against all price IDs (monthly and yearly)
    if (
      priceId === config.public.stripe.starterPriceId ||
      priceId === config.public.stripe.starterYearlyPriceId
    ) {
      premiumTier = 'starter'
    } else if (
      priceId === config.public.stripe.proPriceId ||
      priceId === config.public.stripe.proYearlyPriceId
    ) {
      premiumTier = 'pro'
    }

    // Check if user exists and get current status
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, premium_status, premium_tier, stripe_subscription_id')
      .eq('email', customerEmail)
      .single()

    if (fetchError || !profile) {
      console.error('User not found:', customerEmail, fetchError)
      throw createError({
        statusCode: 404,
        statusMessage: 'User profile not found'
      })
    }

    // If webhook already updated the profile, just return success
    if (profile.stripe_subscription_id === session.subscription && profile.premium_status) {
      console.log(`✅ Profile already updated by webhook for ${customerEmail}`)
      return {
        success: true,
        tier: profile.premium_tier,
        email: customerEmail,
        alreadyProcessed: true
      }
    }

    // Get subscription details for period dates
    let currentPeriodStart = null
    let currentPeriodEnd = null

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      if (subscription.current_period_start) {
        currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString()
      }
      if (subscription.current_period_end) {
        currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
      }
    }

    const updateData = {
      premium_status: true,
      premium_tier: premiumTier,
      stripe_subscription_id: session.subscription,
      stripe_customer_id: session.customer,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString()
    }

    console.log(`Updating profile for ${customerEmail}:`, {
      tier: premiumTier,
      subscriptionId: session.subscription,
      customerId: session.customer
    })

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', profile.id)

    if (updateError) {
      console.error('❌ Failed to update user profile:', updateError)
      console.error('Update error details:', JSON.stringify(updateError, null, 2))
      console.error('Attempted update data:', updateData)
      console.error('Session ID:', session.id)
      console.error('Subscription ID:', session.subscription)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update user profile: ${updateError.message || updateError.code || 'Unknown error'}`
      })
    }

    console.log(`✅ Updated ${customerEmail} to ${premiumTier} tier via session verification (fallback)`)

    return {
      success: true,
      tier: premiumTier,
      email: customerEmail
    }
  } catch (error: any) {
    console.error('Session verification error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to verify session'
    })
  }
})
