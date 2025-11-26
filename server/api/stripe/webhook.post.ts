import { defineEventHandler, readRawBody, getHeader } from 'h3'
import { useServerStripe } from '#stripe/server'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const config = useRuntimeConfig()
  const supabase = serverSupabaseServiceRole(event)

  // Get raw body for signature verification - MUST be raw, not parsed
  const rawBody = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')

  console.log('🔔 Webhook received')
  console.log('   Has signature header:', !!signature)
  console.log('   Has raw body:', !!rawBody)
  console.log('   Raw body length:', rawBody?.length || 0)
  console.log('   Webhook secret configured:', !!config.stripeWebhookSecret)
  console.log('   Webhook secret prefix:', config.stripeWebhookSecret?.substring(0, 7))

  if (!signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing stripe signature'
    })
  }

  if (!rawBody) {
    throw createError({
      statusCode: 400,
      message: 'Missing request body'
    })
  }

  let stripeEvent

  try {
    // Verify webhook signature
    const webhookSecret = config.stripeWebhookSecret

    if (webhookSecret) {
      // Production: Verify signature with webhook secret
      // IMPORTANT: Must use raw body string exactly as received from Stripe
      console.log('🔐 Attempting signature verification...')
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      )
      console.log('✅ Webhook signature verified successfully')
    } else {
      // Development: Skip verification (NOT recommended for production)
      console.warn('⚠️ Webhook signature verification skipped - no STRIPE_WEBHOOK_SECRET configured')
      stripeEvent = JSON.parse(rawBody)
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('❌ Webhook signature verification failed:', errorMessage)
    console.error('   Signature header:', signature)
    console.error('   Webhook secret starts with whsec_:', config.stripeWebhookSecret?.startsWith('whsec_'))
    console.error('   Raw body first 100 chars:', rawBody?.substring(0, 100))
    throw createError({
      statusCode: 400,
      message: `Webhook Error: ${errorMessage}`
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

      // Get subscription details for period end date
      let currentPeriodEnd = null

      if (session.subscription) {
        try {
          console.log(`📡 Retrieving subscription ${session.subscription} from checkout session...`)
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          console.log(`   Subscription status: ${subscription.status}`)
          if (subscription.current_period_end) {
            currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
            console.log(`   Period end: ${currentPeriodEnd}`)
          } else {
            console.warn(`   ⚠️ No current_period_end found on subscription`)
          }
        } catch (err) {
          console.error('❌ Failed to retrieve subscription details:', err)
        }
      } else {
        console.warn('⚠️ No subscription ID found in checkout session - this might be a one-time payment')
      }

      const updateData = {
        premium_status: true,
        premium_tier: premiumTier,
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
        updated_at: new Date().toISOString(),
        current_period_end: currentPeriodEnd
      }

      console.log(`Updating profile for ${customerEmail} via checkout.session.completed:`, {
        tier: premiumTier,
        subscriptionId: session.subscription,
        customerId: session.customer,
        periodEnd: currentPeriodEnd
      })

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', profile.id)

      if (updateError) {
        console.error('❌ Failed to update user profile:', updateError)
        console.error('Update error details:', JSON.stringify(updateError, null, 2))
      } else {
        console.log(`✅ Updated ${customerEmail} to ${premiumTier} tier via checkout.session.completed`)
        if (!currentPeriodEnd) {
          console.warn(`   ⚠️ WARNING: current_period_end was not set! Waiting for subscription.created webhook...`)
        }
      }

      break
    }

    case 'customer.subscription.created': {
      const subscription = stripeEvent.data.object

      // Get customer email
      let customerEmail = null
      if (subscription.customer) {
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if ('email' in customer) {
          customerEmail = customer.email
        }
      }

      if (!customerEmail) {
        console.error('No customer email found in subscription.created event')
        break
      }

      // Determine the plan tier from the price ID
      let premiumTier = 'free'
      const priceId = subscription.items.data[0]?.price.id

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

      // Get period end date
      let currentPeriodEnd = null
      if (subscription.current_period_end) {
        currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
      }

      // Find user by email
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (fetchError || !profile) {
        console.error('User not found:', customerEmail, fetchError)
        break
      }

      // Update user profile with subscription details
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          premium_status: true,
          premium_tier: premiumTier,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Failed to update user profile in subscription.created:', updateError)
        console.error('Update error details:', JSON.stringify(updateError, null, 2))
      } else {
        console.log(`✅ Created subscription for ${customerEmail} - ${premiumTier} tier (ends: ${currentPeriodEnd})`)
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
        .select('id, email, asset_extractions, contrast_checks, lottie_extractions, ai_generations')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (profile) {
        console.log(`🔄 Processing subscription cancellation for ${profile.email}`)
        console.log(`   Previous usage: ${profile.asset_extractions} assets, ${profile.contrast_checks} contrast checks, ${profile.lottie_extractions} lottie, ${profile.ai_generations} AI`)

        // Downgrade to free tier AND reset all usage counters
        await supabase
          .from('user_profiles')
          .update({
            premium_status: false,
            premium_tier: 'free',
            stripe_subscription_id: null,
            subscription_cancel_at: null,
            current_period_end: null,
            // Reset all usage counters to 0
            asset_extractions: 0,
            contrast_checks: 0,
            lottie_extractions: 0,
            ai_generations: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)

        console.log(`✅ Downgraded ${profile.email} to free tier (subscription ended)`)
        console.log(`   All usage counters reset to 0`)
      } else {
        console.error('User not found for subscription:', subscription.id)
      }

      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = stripeEvent.data.object

      // Update billing period when subscription renews
      // This event fires on both initial subscription and renewals
      if (invoice.subscription) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, email')
          .eq('stripe_subscription_id', invoice.subscription)
          .single()

        if (profile) {
          // Get the subscription to fetch period end date
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

          let currentPeriodEnd = null

          if (subscription.current_period_end) {
            currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
          }

          await supabase
            .from('user_profiles')
            .update({
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)

          console.log(`🔄 Updated billing period for ${profile.email}`)
          if (currentPeriodEnd) {
            console.log(`   Period ends: ${currentPeriodEnd}`)
          }
        }
      }

      break
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  return { received: true }
})
