import { defineEventHandler, readBody } from 'h3'
import { useServerStripe } from '#stripe/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Get authenticated user
  const user = await serverSupabaseUser(event)

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
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: user.email, // Pass user email to Stripe
      metadata: {
        user_id: user.id,
        price_id: priceId
      },
      success_url: successUrl || `${config.public.siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${config.public.siteUrl}/#pricing`
    })

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
