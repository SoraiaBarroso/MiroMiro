import { defineEventHandler, readBody } from 'h3'
import { useServerStripe } from '#stripe/server'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Get authenticated user
  const user = await serverSupabaseUser(event)
  console.log('Authenticated user:', user)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please sign in to subscribe'
    })
  }

  const { priceId, successUrl, cancelUrl } = body

  if (!priceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Price ID is required'
    })
  }

  try {
    // Fetch user profile to get discount information
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('discount_percentage, has_waitlist_discount')
      .eq('id', user.sub)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
    }

    // Prepare checkout session options
    const sessionOptions: any = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: user.email, // Pass user email to Stripe
      allow_promotion_codes: true, // Enable promotion code field at checkout
      metadata: {
        user_id: user.id,
        price_id: priceId
      },
      success_url: successUrl || `${config.public.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${config.public.siteUrl}/#pricing`
    }

    // Apply discount if user has one
    if (profile && profile.discount_percentage && profile.discount_percentage > 0) {
      const discountPercentage = profile.discount_percentage

      // Use the coupon ID from environment variable if available
      const couponId = config.stripe.discountCouponId || `discount-${discountPercentage}`

      // Only create dynamic coupon if no specific coupon ID is configured
      if (!config.stripe.discountCouponId) {
        // Try to retrieve existing coupon or create a new one
        let coupon
        try {
          coupon = await stripe.coupons.retrieve(couponId)
        } catch (error: any) {
          // Coupon doesn't exist, create it
          if (error.statusCode === 404) {
            coupon = await stripe.coupons.create({
              id: couponId,
              percent_off: discountPercentage,
              duration: 'forever',
              name: `${discountPercentage}% Discount`
            })
          } else {
            throw error
          }
        }
      }

      // Apply the coupon to the checkout session
      sessionOptions.discounts = [{ coupon: couponId }]

      // Add discount info to metadata
      sessionOptions.metadata.discount_percentage = discountPercentage
      sessionOptions.metadata.has_waitlist_discount = profile.has_waitlist_discount
    }

    const session = await stripe.checkout.sessions.create(sessionOptions)

    return {
      sessionId: session.id,
      url: session.url
    }
  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create checkout session'
    })
  }
})
