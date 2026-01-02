<script setup lang="ts">
import { STRIPE_PLANS, FREE_LIMITS } from '../../config/pricing'

// Currency localization
const { formatPrice, disclaimer } = useCurrency()

// SEO Meta
const { setSeoMeta, setBreadcrumbs, setProductSchema } = useSeo()

setSeoMeta({
  title: 'Compare Plans & Pricing',
  description: 'Compare MiroMiro pricing plans. Free, Starter (€4/mo), and Pro (€19/mo) plans for designers and developers. Extract CSS, assets, colors, and more.',
  keywords: ['miromiro pricing', 'css inspector pricing', 'asset extractor plans', 'design tool pricing', 'chrome extension plans']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Compare Plans', url: '/compare-plans' }
])

setProductSchema({
  name: 'MiroMiro Chrome Extension',
  description: 'UI Inspector & Asset Extractor for designers and developers',
  offers: [
    { name: 'Free Plan', price: 0, priceCurrency: 'EUR' },
    { name: 'Starter Plan', price: 4, priceCurrency: 'EUR' },
    { name: 'Pro Plan', price: 19, priceCurrency: 'EUR' }
  ]
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const checkoutLoading = ref(false)
const userProfile = ref<any>(null)
const config = useRuntimeConfig()
const { gtag } = useGtag()

// Billing cycle toggle
const isYearly = ref('0')

const billingItems = ref([
  {
    label: 'Monthly',
    value: '0'
  },
  {
    label: 'Yearly',
    value: '1'
  }
])

// Load user profile to check current plan
onMounted(async () => {
  // Track plan viewing
  gtag('event', 'view_item_list', {
    event_category: 'ecommerce',
    event_label: 'pricing_plans'
  })

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

  // Track checkout initiation
  const billingCycle = isYearly.value === '1' ? 'yearly' : 'monthly'
  const planPrice = planName === 'Starter'
    ? (billingCycle === 'yearly' ? STRIPE_PLANS.starter.price.year : STRIPE_PLANS.starter.price.month)
    : (billingCycle === 'yearly' ? STRIPE_PLANS.pro.price.year : STRIPE_PLANS.pro.price.month)

  gtag('event', 'begin_checkout', {
    event_category: 'ecommerce',
    plan_tier: planName.toLowerCase(),
    billing_cycle: billingCycle,
    value: planPrice,
    currency: 'EUR'
  })

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
  const yearly = isYearly.value === '1'

  return [
    {
      id: 'free',
      title: 'Free Plan',
      price: formatPrice(0),
      description: 'Perfect for trying MiroMiro and occasional use',
      billingCycle: '/month',
      button: {
        label: currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free',
        variant: 'subtle' as const,
        disabled: true
      }
    },
    {
      id: 'starter',
      title: STRIPE_PLANS.starter.name,
      price: yearly ? formatPrice(STRIPE_PLANS.starter.price.year) : formatPrice(STRIPE_PLANS.starter.price.month),
      originalPrice: yearly ? undefined : formatPrice(STRIPE_PLANS.starter.price.originalPrice),
      description: STRIPE_PLANS.starter.description,
      billingCycle: yearly ? '/year' : '/month',
      scale: true,
      badge: STRIPE_PLANS.starter.badge,
      button: {
        label: currentTier === 'starter' ? 'Current Plan' : 'Upgrade to Starter',
        disabled: currentTier === 'starter',
        onClick: () => handleCheckout(
          yearly ? config.public.stripe.starterYearlyPriceId : config.public.stripe.starterPriceId,
          'Starter'
        )
      }
    },
    {
      id: 'pro',
      title: STRIPE_PLANS.pro.name,
      price: yearly ? formatPrice(STRIPE_PLANS.pro.price.year) : formatPrice(STRIPE_PLANS.pro.price.month),
      originalPrice: yearly ? undefined : (STRIPE_PLANS.pro.price.originalPrice ? formatPrice(STRIPE_PLANS.pro.price.originalPrice) : undefined),
      description: STRIPE_PLANS.pro.description,
      billingCycle: yearly ? '/year' : '/month',
      scale: true,
      badge: STRIPE_PLANS.pro.tagline || STRIPE_PLANS.pro.badge,
      highlight: true,
      button: {
        label: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
        color: 'primary' as const,
        disabled: currentTier === 'pro',
        onClick: () => handleCheckout(
          yearly ? config.public.stripe.proYearlyPriceId : config.public.stripe.proPriceId,
          'Pro'
        )
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
        title: 'Inspect Mode (Hover for CSS)',
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
        title: 'Contrast Checks',
        tiers: {
          free: `${FREE_LIMITS.contrastChecks}/month`,
          starter: '50/month',
          pro: 'Unlimited'
        }
      }
    ]
  },
  {
    title: 'Design System Tools',
    features: [
      {
        title: 'Design System Extraction',
        description: 'Extract semantic CSS variables and export to CSS or Tailwind',
        tiers: {
          free: 'Preview only',
          starter: `${STRIPE_PLANS.starter.limits.designSystemExtractions}/month`,
          pro: STRIPE_PLANS.pro.limits.designSystemExtractions === -1 ? 'Unlimited' : `${STRIPE_PLANS.pro.limits.designSystemExtractions}/month`
        }
      },
      {
        title: 'Export to CSS',
        tiers: {
          free: false,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Export to Tailwind Config',
        tiers: {
          free: false,
          starter: true,
          pro: true
        }
      }
    ]
  },
  {
    title: 'Asset Extraction',
    features: [
      {
        title: 'Total Asset Extractions',
        description: 'Images, Videos, SVGs per month',
        tiers: {
          free: `${FREE_LIMITS.assetExtractions}/month`,
          starter: `${STRIPE_PLANS.starter.limits.assetExtractions}/month`,
          pro: `${STRIPE_PLANS.pro.limits.assetExtractions}/month`
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
        title: 'Bulk Export (All Assets at Once)',
        tiers: {
          free: false,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Lottie Animation Extractions',
        tiers: {
          free: false,
          starter: `${STRIPE_PLANS.starter.limits.lottieExtractions}/month`,
          pro: 'Unlimited'
        }
      }
    ]
  },
  {
    title: 'Personal Library',
    features: [
      {
        title: 'Saved Items',
        description: 'Save your favorite assets, icons, colors, and design tokens',
        tiers: {
          free: `${FREE_LIMITS.saveItems}/items`,
          starter: `${STRIPE_PLANS.starter.limits.saveItems}/items`,
          pro: STRIPE_PLANS.pro.limits.saveItems === -1 ? 'Unlimited' : `${STRIPE_PLANS.pro.limits.saveItems}/items`
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
          starter: false,
          pro: true
        }
      }
    ]
  }
])
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="flex flex-col items-center gap-6 mb-8 sm:ml-36">
        <h2 class="text-highlighted text-4xl font-semibold">Compare plans</h2>
        <p class="text-muted text-center max-w-md">
          Join designers and developers who save hours every week. Cancel anytime.
        </p>
        <UTabs
          v-model="isYearly"
          :items="billingItems"
          color="primary"
          size="xs"
          class="w-48"
          :ui="{
            list: 'ring ring-accented rounded-full',
            indicator: 'rounded-full',
            trigger: 'w-1/2'
          }"
        />
      </div>
      <UPricingTable
        :tiers="tiers"
        :sections="sections"
      />

      <!-- Currency disclaimer -->
      <p v-if="disclaimer" class="text-center text-sm text-muted mt-6">
        {{ disclaimer }}
      </p>
    </UPageSection>
  </UPage>
</template>
