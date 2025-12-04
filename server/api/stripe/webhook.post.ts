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
    // Verify webhook signature - SECURITY: Only Stripe can trigger these updates
    const webhookSecret = config.stripeWebhookSecret

    if (webhookSecret) {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      )
      console.log('✅ Webhook signature verified')
    } else {
      // Development: Skip verification (NOT recommended for production)
      console.warn('⚠️ Webhook signature verification skipped - no STRIPE_WEBHOOK_SECRET configured')
      stripeEvent = JSON.parse(rawBody)
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('❌ Webhook signature verification failed:', errorMessage)
    throw createError({
      statusCode: 400,
      message: `Webhook Error: ${errorMessage}`
    })
  }

  console.log(`📨 Processing webhook: ${stripeEvent.type}`)

  // Handle subscription lifecycle events
  switch (stripeEvent.type) {
    case 'customer.subscription.created': {
      // User subscribed - grant access
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

      // Determine plan tier from price ID
      let premiumTier = 'free'
      const priceId = subscription.items.data[0]?.price.id

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

      // Find user by email
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customerEmail)
        .single()

      if (fetchError || !profile) {
        console.error('❌ User not found:', customerEmail, fetchError)
        break
      }

      // Grant premium access and clear any cancellation date
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          premium_status: true,
          premium_tier: premiumTier,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          subscription_cancel_at: null, // Clear cancellation date for new subscription
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('❌ Failed to grant access:', updateError)
      } else {
        console.log(`✅ Granted ${premiumTier} access to ${customerEmail}`)
      }

      break
    }

    case 'customer.subscription.updated': {
      // User cancelled (cancel_at_period_end = true)
      // DO NOTHING - they keep access until subscription.deleted fires
      const subscription = stripeEvent.data.object

      if (subscription.cancel_at_period_end) {
        console.log(`⏳ Subscription ${subscription.id} will be canceled at period end`)
        console.log('   User keeps premium access until then')

        // Store cancellation info for display to user
        const { data: profile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('id, email')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (fetchError) {
          console.error('❌ Failed to find user for subscription:', subscription.id, fetchError)
        } else if (profile) {
          const cancelAt = subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toISOString()
            : null

          console.log(`📅 Setting cancel_at to ${cancelAt} for user ${profile.email}`)

          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              subscription_cancel_at: cancelAt,
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)

          if (updateError) {
            console.error('❌ Failed to update subscription_cancel_at:', updateError)
          } else {
            console.log(`✅ Subscription sub_${subscription.id} will be canceled at period end for user ${profile.email}`)
            console.log(`   Access ends: ${cancelAt}`)
          }
        } else {
          console.error('❌ User not found for subscription:', subscription.id)
        }
      }

      break
    }

    case 'customer.subscription.deleted': {
      // Billing period ended - revoke access
      const subscription = stripeEvent.data.object

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, email, asset_extractions, contrast_checks, lottie_extractions, ai_generations')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (profile) {
        console.log(`🔄 Subscription ended for ${profile.email}`)
        console.log(`   Previous usage: ${profile.asset_extractions} assets, ${profile.contrast_checks} contrast checks`)

        // Revoke access AND reset usage counters
        await supabase
          .from('user_profiles')
          .update({
            premium_status: false,
            premium_tier: 'free',
            stripe_subscription_id: null,
            subscription_cancel_at: null,
            asset_extractions: 0,
            contrast_checks: 0,
            lottie_extractions: 0,
            ai_generations: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)

        console.log(`✅ Revoked access for ${profile.email} - downgraded to free`)
      } else {
        console.error('❌ User not found for subscription:', subscription.id)
      }

      break
    }

    case 'invoice.payment_succeeded': {
      // Subscription renewed - reset usage counters
      const invoice = stripeEvent.data.object

      if (invoice.subscription) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, email')
          .eq('stripe_subscription_id', invoice.subscription)
          .single()

        if (profile) {
          // Reset usage counters for new billing period
          await supabase
            .from('user_profiles')
            .update({
              asset_extractions: 0,
              contrast_checks: 0,
              lottie_extractions: 0,
              ai_generations: 0,
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)

          console.log(`🔄 Reset usage counters for ${profile.email} (subscription renewed)`)
        }
      }

      break
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${stripeEvent.type}`)
  }

  return { received: true }
})
