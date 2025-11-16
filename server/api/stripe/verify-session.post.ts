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
      throw createError({
        statusCode: 404,
        statusMessage: 'User profile not found'
      })
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
      console.error('Update error details:', JSON.stringify(updateError, null, 2))
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update user profile: ${updateError.message || updateError.code || 'Unknown error'}`
      })
    }

    console.log(`✅ Updated ${customerEmail} to ${premiumTier} tier via session verification`)

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
