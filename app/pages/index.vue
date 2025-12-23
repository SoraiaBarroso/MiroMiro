<script setup lang="ts">
import { STRIPE_PLANS, FREE_LIMITS } from '../../config/pricing'

const config = useRuntimeConfig()
const toast = useToast()
const checkoutLoading = ref(false)
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userProfile = ref<any>(null)
const hoveredCard = ref<string | null>(null)

// Billing cycle toggle
const isYearly = ref('0')

const id = "2000802594604904612";
const id2 = "2000673997713764527";
const id3 = "2000543455009996839";
const id4 = "2000795479693779422";
const id5 = "2000925048069349528";
const id6 = "2000626087001559120";
const id7 = "2000938450342830224";
const id8 = "2001258705128665303";
const id9 = "2001372792487579736";
const id10 = "2001711166263878052";
const id11 = "2000914381002170585";

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

// Load user profile to check for waitlist discount
onMounted(async () => {
  if (user.value?.sub) {
    const { data } = await supabase
      .from('user_profiles')
      .select('has_waitlist_discount')
      .eq('id', user.value.sub)
      .single()

    if (data) {
      userProfile.value = data
    }
  }
})

async function handleCheckout(priceId: string) {
  console.log('Initiating checkout for priceId:', priceId)
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
    const { url, error } = await $fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: {
        priceId,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/#pricing`
      }
    })

    if (error) {
      throw new Error(error)
    }

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

const plans = computed(() => {
  const yearly = isYearly.value === '1'

  return [
    {
      title: 'Free Plan',
      description: 'See if MiroMiro fits your workflow',
      price: '€0',
      billingCycle: '/month',
      features: [
        'Inspect any element, skip DevTools',
        'See the exact CSS behind any design',
        'Preview any site\'s full color system',
        'Test on a few projects (15 extractions)',
        'Check key contrasts (3 checks/month)'
      ],
      button: {
        label: 'Get Started Free',
        to: 'https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl'
      }
    },
    {
      id: 'starter',
      title: STRIPE_PLANS.starter.name,
      description: STRIPE_PLANS.starter.description,
      price: yearly ? `€${STRIPE_PLANS.starter.price.year}` : `€${STRIPE_PLANS.starter.price.originalPrice}`,
      discount: yearly ? undefined : `€${STRIPE_PLANS.starter.price.month}`,
      billingCycle: yearly ? '/year' : '/month',
      scale: !yearly,
      highlight: !yearly,
      badge: yearly ? undefined : 'Recommended',
      features: STRIPE_PLANS.starter.features,
      button: {
        label: 'Upgrade to Starter',
        onClick: () => {
          handleCheckout(
            yearly ? config.public.stripe.starterYearlyPriceId : config.public.stripe.starterPriceId
          )
        }
      }
    },
    {
      id: 'pro',
      title: STRIPE_PLANS.pro.name,
      description: yearly ? 'Save €88/year compared to monthly' : STRIPE_PLANS.pro.description,
      price: yearly ? `€${STRIPE_PLANS.pro.price.year}` : `€${STRIPE_PLANS.pro.price.originalPrice}`,
      discount: yearly ? undefined : `€${STRIPE_PLANS.pro.price.month}`,
      billingCycle: yearly ? '/year' : '/month',
      scale: yearly,
      highlight: yearly,
      features: STRIPE_PLANS.pro.features,
      badge: yearly ? 'Best Deal' : undefined,
      button: {
        label: 'Upgrade to Pro',
        onClick: () => {
          handleCheckout(
            yearly ? config.public.stripe.proYearlyPriceId : config.public.stripe.proPriceId
          )
        }
      }
    }
  ]
})
</script>

<template>
  <div>
    <CustomPageHero orientation="vertical" headline-link="https://x.com/SoraiaDev/status/2000625339068731586">
      <template #headline> 
        2M views on launch 
      </template>

      <template #title>
        Copy Any Website's Design & Assets, <span class="bg-linear-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">In One Click</span>
      </template>

      <template #description>
        Inspect any site's design system in one click. Copy CSS, grab fonts, colors, spacing, SVGs, images and Lottie animations — no DevTools needed.
      </template>

      <template #links>
        <UButton
          to="https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl"
          trailing-icon="i-logos:chrome"
          size="xl"
          target="_blank"
          class="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        >
          Add to Chrome — Free
        </UButton>
        <UButton
          to="#features"
          size="xl"
          color="neutral"
          variant="outline"
          class="rounded-xl "
        >
          See How It Works
        </UButton>
      </template>

   
      <template #video-demo>
        <ScriptYouTubePlayer
          video-id="gSf-PhTplJ0"
          above-the-fold
          class="w-full aspect-video rounded-xl overflow-hidden shadow-xl"
        >
          <template #awaitingLoad>
            <div class="absolute inset-0 flex items-center justify-center bg-black/20">
              <div class="bg-red-600 rounded-full p-4 shadow-lg">
                <UIcon name="i-heroicons-play-solid" class="w-8 h-8 text-white" />
              </div>
            </div>
          </template>
          <template #loading>
            <div class="absolute inset-0 flex items-center justify-center bg-black/30">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-white animate-spin" />
            </div>
          </template>
        </ScriptYouTubePlayer>
      </template>
    </CustomPageHero>

    <!-- Tech-Noir Features Section -->
    <section id="features" class="py-16 md:py-24 px-6 md:px-12 selection:bg-black selection:text-white">
      <div class="max-w-6xl mx-auto">
        
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-4">Powerful Features</h2>
          <p class="text-lg text-zinc-500 max-w-2xl mx-auto">Everything you need to inspect, extract, and build faster</p>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <FeaturesFeatureInspector v-model:hovered-card="hoveredCard" />
          <FeaturesFeatureAssetSnatcher v-model:hovered-card="hoveredCard" />
          <FeaturesFeatureSvgExtractor v-model:hovered-card="hoveredCard" />
          <FeaturesFeatureLottie v-model:hovered-card="hoveredCard" />
          <FeaturesFeatureSaveAssets v-model:hovered-card="hoveredCard" />
          <FeaturesFeatureContrastCheck v-model:hovered-card="hoveredCard" />
          <FeaturesFeatureDesignTokens v-model:hovered-card="hoveredCard" />
        </div>

      </div>
    </section>
    
    <UPageSection
      id="testimonials"
      title="Trusted by 500+ Builders"
      description="Designers and developers who've made MiroMiro part of their daily workflow."
    >
      <UPageColumns>
        <NuxtTweet :id="id" :show-media="false"/>
        <NuxtTweet :id="id2" :show-media="false" />
        <NuxtTweet :id="id3" :show-media="false" />
        <NuxtTweet :id="id4" :show-media="false" />
        <NuxtTweet :id="id5" :show-media="false" />
        <NuxtTweet :id="id6" :show-media="false" />
        <NuxtTweet :id="id7" :show-media="false" />
        <NuxtTweet :id="id8" :show-media="false" />
        <NuxtTweet :id="id9" :show-media="false" />
        <NuxtTweet :id="id10" :show-media="false" />
        <NuxtTweet :id="id11" :show-media="false" />
      </UPageColumns>
    </UPageSection>
 
    <UPageSection
      id="pricing"
      title="Pricing"
      description="Try it for free and upgrade to unlock advanced features that will boost your efficiency."
      :ui="{
        headline: 'rounded-full border border-purple-500 bg-purple-50 text-purple-700 shadow-lg w-fit mx-auto font-medium',
      }"
    >
      <template #links>
        <UTabs
          v-model="isYearly"
          :items="billingItems"
          color="primary"
          size="xs"
          class="w-48"
          :ui="{
            list: 'ring ring-accented rounded-full',
            indicator: 'rounded-full',
            trigger: 'w-1/2',
          }"
        />
      </template>

      <UPricingPlans>
        <UPricingPlan
          v-for="(plan, index) in plans"
          :key="index"
          v-bind="plan"
          :ui="{
            root: plan.highlight ? 'overflow-visible bg-gradient-to-r from-(--ui-primary)/10 to-(--ui-secondary)/10' : (plan.badge ? 'overflow-visible' : ''),
            badge: plan.badge ? 'absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-lg' : '',
            button: plan.highlight ? 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-700! focus:bg-purple-600! rounded-2xl ring-4 ring-purple-500/20' : 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-700! focus:bg-purple-600! rounded-2xl',
            featureIcon: '!bg-purple-300'
          }"
        />
      </UPricingPlans>
    </UPageSection>
  </div>
</template>
