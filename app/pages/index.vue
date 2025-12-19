<script setup lang="ts">
import { STRIPE_PLANS, FREE_LIMITS } from '../../config/pricing'

const config = useRuntimeConfig()
const toast = useToast()
const checkoutLoading = ref(false)
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userProfile = ref<any>(null)

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
      description: 'Perfect for trying MiroMiro and occasional use',
      price: '€0',
      billingCycle: '/month',
      features: [
        'Inspect Mode',
        'Color Palette Viewer',
        'Design System Preview',
        `${FREE_LIMITS.assetExtractions} asset extractions/month`,
        `${FREE_LIMITS.contrastChecks} contrast checks/month`
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
      <template #background>
        <NuxtImg
          src="/bg.svg"
          class="absolute inset-0 w-full h-full object-cover -z-10"
          alt="Decorative background pattern"
          width="1920"
          height="1080"
          loading="eager"
          fetchpriority="high"
          preload
        />
      </template>

      <template #headline>
        2M views on X
      </template>

      <template #title>
        Copy Any Website's Design & Assets, In One Click
      </template>

      <template #description>
        Inspect any site's design system in one click. Copy CSS, grab fonts, colors, spacing, SVGs, images and Lottie animations, no DevTools needed.
      </template>

      <template #links>
        <UButton
          to="https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl"
          trailing-icon="i-logos:chrome"
          size="xl"
          variant="soft"
          target="_blank"
          class="rounded-lg bg-linear-to-r from-primary to-secondary/80 text-white hover:opacity-90 shadow-lg"
        >
          Add to Chrome - Free
        </UButton>
        <UButton
          to="#features"
          size="xl"
          variant="outline"
          color="neutral"
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

    <UPageSection id="features" title="Powerful Features" description="Everything you need to inspect, extract, and build faster">
      <UPageGrid>
        <UPageCard
          spotlight
          title="See Any Site's Entire Visual System"
          description="Click once and see every color, font, shadow, and spacing value instantly. No more guessing what makes a design work."
          class="col-span-2 lg:col-span-1"
        >
          <NuxtImg
            src="landing//Overview.png"
            alt="Page Overview showing complete visual system breakdown with colors, fonts, and spacing"
            sizes="100vw sm:90vw md:80vw lg:70vw xl:2000vw"
            quality="100"
            class="border border-neutral-200 rounded-xl w-full lg:h-full"
            loading="lazy"
          />
        </UPageCard>

        <UPageCard
          spotlight
          title="Skip DevTools, Get Clean, Readable CSS"
          description="Hover anything, see the exact rules behind it. Copy the CSS you actually want without digging through inspector hell. Full breakdown: spacing, shadows, borders, computed styles, all clean and ready to use."
          class="col-span-2! lg:col-span-1"
        >
           <video
            src="/landing/InspectorDemo.mp4"
            autoplay
            loop
            muted
            playsinline
            class="w-full border border-neutral-200 bg-whiterounded-xl rounded-xl object-contain lg:h-100 lg:object-cover"
          >
            Your browser doesn't support video.
          </video>
        </UPageCard>

        <UPageCard
          spotlight
          title="Grab Every Asset to Show Your Team"
          description="Never right-click, save-as again. Download all images, videos, and GIFs in one click. Build a reference library instantly or grab exactly what you need to say: 'Make it like this.'"
          class="col-span-2"
        >
          <video
            src="/landing/AssetExtractDemo.mp4"
            autoplay
            loop
            muted
            playsinline
            class="w-full border border-neutral-200 bg-whiterounded-xl h-fit rounded-xl object-contain lg:h-110 lg:object-cover"
          >
            Your browser doesn't support video.
          </video>
        </UPageCard>

        <UPageCard
          spotlight
          title="Copy Icons & Logos Straight Off the Page"
          description="Grab icons as clean, editable vectors. Extract SVGs individually or in bulk, fully scalable for Figma, Sketch, or code. Make your MVP look legit by borrowing what already works."
          class="col-span-2 lg:col-span-1"
        >
          <NuxtImg
            src="/landing/svg.png"
            alt="SVG icon extraction interface showing clean, editable vector graphics"
            width="800"
            height="900"
            format="webp"
            quality="100"
            class="border border-neutral-200 rounded-xl w-full"
            loading="lazy"
          />
        </UPageCard>

        <UPageCard
          spotlight
          title="Export Lottie Animations, Ready to Drop In"
          description="Capture motion design effortlessly. Find and export Lottie animations as JSON files, ready for your project. No digging through network tabs, just hover, click, and download working animations."
          class="col-span-2 lg:col-span-1"
        >
          <video
            src="/landing/LottieDemo.mp4"
            autoplay
            loop
            muted
            playsinline
            class="border border-neutral-200 rounded-xl h-100 bg-white"
          >
            Your browser doesn't support video.
          </video>
        </UPageCard>

        <UPageCard
          spotlight
          title="Turn Any Site Into a Shareable Style Guide"
          description="Instantly generate a color design system from any site and export organized tokens you can use right away"
          class="col-span-2"
        >
          <NuxtImg
            src="/landing/DesignSystem.png"
            alt="Semantic CSS pattern extraction showing design system breakdown with naming conventions"
            width="1200"
            height="800"
            format="webp"
            quality="100"
            class="border border-neutral-200 rounded-xl"
            loading="lazy"
          />
        </UPageCard>
      </UPageGrid>
    </UPageSection>
    
    <UPageSection
      id="testimonials"
      title="What Our Users Say"
      description="See what our community is saying"
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
