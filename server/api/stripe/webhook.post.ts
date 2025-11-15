import { defineEventHandler, readBody, getHeader } from 'h3'
import { useServerStripe } from '#stripe/server'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const config = useRuntimeConfig()
  const supabase = serverSupabaseServiceRole(event)

  // Get raw body for signature verification
  const body = await readBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!signature) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing stripe signature'
    })
  }

  let stripeEvent

  try {
    // Verify webhook signature
    const webhookSecret = config.stripeWebhookSecret

    if (webhookSecret) {
      // Production: Verify signature with webhook secret
      // Note: We need the raw body as a string for signature verification
      const rawBody = typeof body === 'string' ? body : JSON.stringify(body)

      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      )
      console.log('✅ Webhook signature verified')
    } else {
      // Development: Skip verification (NOT recommended for production)
      console.warn('⚠️ Webhook signature verification skipped - no STRIPE_WEBHOOK_SECRET configured')
      stripeEvent = body
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook Error: ${err.message}`
    })
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object

      // Get the customer email from the session
      const customerEmail = session.customer_details?.email || session.customer_email

      if (!customerEmail) {
        console.error('No customer email found in session')
        break
      }

      // Determine the plan tier from the price ID
      let premiumTier = 'free'
      const priceId = session.line_items?.data?.[0]?.price?.id || session.metadata?.price_id

      // Import pricing config to match price IDs
      const { STRIPE_PLANS } = await import('../../../config/pricing')

      if (priceId === STRIPE_PLANS.starter.priceId) {
        premiumTier = 'starter'
      } else if (priceId === STRIPE_PLANS.pro.priceId) {
        premiumTier = 'pro'
      }

      // Update user profile in database
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (fetchError || !profile) {
        console.error('User not found:', customerEmail, fetchError)
        break
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          premium_status: true,
          premium_tier: premiumTier,
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Failed to update user profile:', updateError)
      } else {
        console.log(`✅ Updated ${customerEmail} to ${premiumTier} tier`)
      }

      break
    }

    case 'customer.subscription.updated': {
      const subscription = stripeEvent.data.object

      // This event fires when cancel_at_period_end is set
      // We don't downgrade yet - user keeps access until period end
      if (subscription.cancel_at_period_end) {
        console.log(`⏳ Subscription ${subscription.id} will be canceled at period end`)

        // Optionally store cancellation info in database
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (profile) {
          await supabase
            .from('user_profiles')
            .update({
              subscription_cancel_at: subscription.cancel_at,
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)
        }
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object

      // Downgrade to free tier when subscription actually ends
      // Find user by subscription ID (more reliable than email)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (profile) {
        await supabase
          .from('user_profiles')
          .update({
            premium_status: false,
            premium_tier: 'free',
            stripe_subscription_id: null,
            subscription_cancel_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)

        console.log(`✅ Downgraded ${profile.email} to free tier (subscription ended)`)
      } else {
        console.error('User not found for subscription:', subscription.id)
      }

      break
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  return { received: true }
})
