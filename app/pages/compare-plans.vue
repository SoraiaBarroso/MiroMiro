<script setup lang="ts">
import { STRIPE_PLANS } from '../../config/pricing'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const checkoutLoading = ref(false)
const userProfile = ref<any>(null)
const config = useRuntimeConfig()

// Load user profile to check current plan
onMounted(async () => {
  if (user.value?.sub) {
    const { data } = await supabase
      .from('user_profiles')
      .select('premium_tier, discount_percentage')
      .eq('id', user.value.sub)
      .single()

    if (data) {
      userProfile.value = data
    }
  }
})

async function handleCheckout(priceId: string, planName: string) {
  if (checkoutLoading.value) return

  // Check if user is authenticated
  if (!user.value) {
    toast.add({
      title: 'Authentication Required',
      description: 'Please sign in or create an account to subscribe.',
      color: 'warning'
    })
    navigateTo('/signup')
    return
  }

  checkoutLoading.value = true

  try {
    const { url } = await $fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: {
        priceId,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/compare-plans`,
      }
    })

    // Redirect to Stripe Checkout
    if (url) {
      window.location.href = url
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to start checkout. Please try again.',
      color: 'error'
    })
  } finally {
    checkoutLoading.value = false
  }
}

const tiers = computed(() => {
  const currentTier = userProfile.value?.premium_tier || 'free'

  return [
    {
      id: 'free',
      title: 'Free Plan',
      price: '$0',
      description: 'Perfect for trying MiroMiro and occasional use',
      billingCycle: '/month',
      button: {
        label: currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free',
        variant: 'subtle',
        disabled: true
      }
    },
    {
      id: 'starter',
      title: STRIPE_PLANS.starter.name,
      price: `$${STRIPE_PLANS.starter.price.monthly}`,
      originalPrice: `$${STRIPE_PLANS.starter.price.originalPrice}`,
      description: STRIPE_PLANS.starter.description,
      billingCycle: '/month',
      scale: true,
      badge: STRIPE_PLANS.starter.badge,
      button: {
        label: currentTier === 'starter' ? 'Current Plan' : 'Upgrade to Starter',
        // disabled: currentTier === 'starter',
        disabled: true,
        onClick: () => handleCheckout(config.public.stripe.starterPriceId, 'Starter')
      }
    },
    {
      id: 'pro',
      title: STRIPE_PLANS.pro.name,
      price: `$${STRIPE_PLANS.pro.price.monthly}`,
      description: STRIPE_PLANS.pro.description,
      billingCycle: '/month',
      badge: STRIPE_PLANS.pro.badge,
      button: {
        label: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
        color: 'neutral',
        // disabled: currentTier === 'pro',
        disabled: true,
        onClick: () => handleCheckout(config.public.stripe.proPriceId, 'Pro')
      }
    }
  ]
})

const sections = ref([
  {
    title: 'Core Features',
    features: [
      {
        title: 'Page Overview',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Inspect Mode',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Individual Downloads',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Color Palette Viewer',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Smart Inspector (Contrast Checker)',
        tiers: {
          free: '5/day',
          starter: 'Unlimited',
          pro: 'Unlimited'
        }
      }
    ]
  },
  {
    title: 'Asset Extraction',
    features: [
      {
        title: 'Total Asset Extractions (Images, Videos, SVGs)',
        tiers: {
          free: '50/month',
          starter: `${STRIPE_PLANS.starter.limits.assetExtractions}/month`,
          pro: `${STRIPE_PLANS.pro.limits.assetExtractions === -1 ? 'Unlimited' : STRIPE_PLANS.pro.limits.assetExtractions + '/month'}`
        }
      },
      {
        title: 'Image Extractions',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Video Extractions',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'SVG Extractions',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Lottie Animation Extractions',
        tiers: {
          free: false,
          starter: `${STRIPE_PLANS.starter.limits.lottieExtractions}/month`,
          pro: STRIPE_PLANS.pro.limits.lottieExtractions === -1 ? 'Unlimited' : `${STRIPE_PLANS.pro.limits.lottieExtractions}/month`
        }
      },
      {
        title: 'Bulk Export',
        tiers: {
          free: false,
          starter: STRIPE_PLANS.starter.limits.bulkExport,
          pro: STRIPE_PLANS.pro.limits.bulkExport
        }
      }
    ]
  },
  {
    title: 'AI Features',
    features: [
      {
        title: 'AI Design System Generations',
        tiers: {
          free: false,
          starter: `${STRIPE_PLANS.starter.limits.aiGenerations}/month`,
          pro: STRIPE_PLANS.pro.limits.aiGenerations === -1 ? 'Unlimited' : `${STRIPE_PLANS.pro.limits.aiGenerations}/month`
        }
      }
    ]
  },
  {
    title: 'Support',
    features: [
      {
        title: 'Priority Support',
        tiers: {
          free: false,
          starter: STRIPE_PLANS.starter.limits.prioritySupport,
          pro: STRIPE_PLANS.pro.limits.prioritySupport
        }
      }
    ]
  }
])
</script>

<template>
  <UPage>
    <UPageSection>
      <!-- <h1 class="text-highlighted text-4xl font-semibold">Compare plans</h1> -->
      <UPricingTable
        :tiers="tiers"
        :sections="sections"
      />
    </UPageSection>
  </UPage>
</template>
