<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { STRIPE_PLANS } from '../../config/pricing'
const config = useRuntimeConfig()

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const toast = useToast()
const isSubmitting = ref(false)
const checkoutLoading = ref(false)
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userProfile = ref<any>(null)

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

// Check if email is valid
const isEmailValid = computed(() => {
  if (!state.email) return false
  try {
    schema.parse({ email: state.email })
    return true
  } catch {
    return false
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/waitlist', {
      method: 'POST',
      body: {
        email: event.data.email.toLowerCase()
      }
    })

    toast.add({
      title: 'Success!',
      description: 'You\'ve been added to the waitlist. Check your email!',
      color: 'success'
    })

    // Reset the form
    state.email = undefined
  } catch (error: any) {
    // Check if it's a duplicate email error (409)
    if (error.statusCode === 409) {
      toast.add({
        title: 'Already Registered',
        description: error.data?.message || 'You are already on the waitlist!',
        color: 'warning'
      })
    } else {
      toast.add({
        title: 'Error',
        description: error.data?.message || 'Failed to join waitlist. Please try again.',
        color: 'error'
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

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
        'Page Overview',
        'Inspect Mode',
        'Individual Downloads',
        'Color Palette Viewer',
        'Design System Preview',
        '50 asset extractions/month',
        '10 contrast checks/month'
      ],
      button: {
        disabled: true,
        label: 'Current Plan',
      }
    },
    {
      title: STRIPE_PLANS.starter.name,
      description: STRIPE_PLANS.starter.description,
      price: yearly ? `€${STRIPE_PLANS.starter.price.year}` : `€${STRIPE_PLANS.starter.price.originalPrice}`,
      discount: yearly ? undefined : `€${STRIPE_PLANS.starter.price.month}`,
      billingCycle: yearly ? '/year' : '/month',
      scale: true,
      badge: STRIPE_PLANS.starter.badge,
      features: STRIPE_PLANS.starter.features,
      button: {
        disabled: true,
        label: 'Upgrade to Starter',
        onClick: () => {
          handleCheckout(
            yearly ? config.public.stripe.starterYearlyPriceId : config.public.stripe.starterPriceId
          )
        }
      }
    },
    {
      title: STRIPE_PLANS.pro.name,
      description: STRIPE_PLANS.pro.description,
      price: yearly ? `€${STRIPE_PLANS.pro.price.year}` : `€${STRIPE_PLANS.pro.price.originalPrice}`,
      discount: yearly ? undefined : `€${STRIPE_PLANS.pro.price.month}`,
      billingCycle: yearly ? '/year' : '/month',
      features: STRIPE_PLANS.pro.features,
      button: {
        disabled: true,
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
    <CustomPageHero orientation="vertical">
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
        On the Chrome Store
      </template>

      <template #title>
        <span class="relative inline-block px-3 py-2">Copy<svg class="absolute w-full h-full left-0 top-0 z-10 pointer-events-none" viewBox="0 0 1299 626" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
<path d="M49.8276 50.1697L49.8438 574.941L1249 575.02L1248.98 50.2493L49.8276 50.1697Z" fill="#3491FF" fill-opacity="0.06" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M1205.35 6.31239L1205.36 93.6847L1292.73 93.6906L1292.72 6.31833L1205.35 6.31239Z" fill="#F5F5F5"/>
<path d="M1205.35 6.31239L1205.36 93.6847L1292.73 93.6906L1292.72 6.31834L1205.35 6.31239Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M6.35031 5.99989L6.35352 93.3722L93.7258 93.3781L93.7226 6.00583L6.35031 5.99989Z" fill="#F5F5F5"/>
<path d="M6.35031 5.99989L6.35352 93.3722L93.7258 93.3781L93.7226 6.00584L6.35031 5.99989Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M1205.35 532.313L1205.35 619.685L1292.73 619.691L1292.72 532.319L1205.35 532.313Z" fill="#F5F5F5"/>
<path d="M1205.35 532.313L1205.35 619.685L1292.73 619.691L1292.72 532.319L1205.35 532.313Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M6.35031 526.312L6.35352 613.685L93.7258 613.691L93.7226 526.318L6.35031 526.312Z" fill="#F5F5F5"/>
<path d="M6.35031 526.312L6.35352 613.685L93.7258 613.691L93.7226 526.318L6.35031 526.312Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
</svg></span> Any Website's Design & Assets, In One Click
      </template>

      <template #description>
The Chrome Extension that lets you grab CSS, colors, fonts, spacing, and all media files (SVGs, Lottie, images) with one click. No more digging through DevTools.      </template>

      <template #links>
        <UButton
          to="#waitlist"
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          variant="soft"
          class="rounded-lg bg-purple-800 text-white hover:bg-purple-700 focus:bg-purple-300"
        >
          Join Waitlist
        </UButton>
        <UButton
          to="#features"
          size="xl"
          color="primary"
          variant="outline"
          class="rounded-lg bg-white border-primary-900 text-primary-900 hover:bg-purple-50 focus:bg-purple-100"
        >
          See how It Works
        </UButton>
      </template>
    </CustomPageHero>

    <UPageSection id="features">
      <UPageGrid>
        <UPageCard
          spotlight
          title="See Any Site's Entire Visual System"
          description="Click once and see every color, font, shadow, and spacing value instantly. No more guessing what makes a design work. Get the complete visual breakdown the moment you land, ready to reference or export."
          class="col-span-2 lg:col-span-1"
        >
          <NuxtImg
            src="/Overview.png"
            alt="Page Overview showing complete visual system breakdown with colors, fonts, and spacing"
            width="800"
            height="800"
            format="webp"
            quality="100"
            class="border border-neutral-200 rounded-xl"
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
            src="/InspectorDemo.mp4"
            autoplay
            loop
            muted
            playsinline
            class="w-full border border-neutral-200 bg-whiterounded-xl h-fit rounded-xl object-contain lg:h-100 lg:object-cover"
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
            src="/AssetExtractDemo.mp4"
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
            src="/svg.png"
            alt="SVG icon extraction interface showing clean, editable vector graphics"
            width="800"
            height="900"
            format="webp"
            quality="100"
            class="border border-neutral-200 rounded-xl"
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
            src="/LottieDemo.mp4"
            autoplay
            loop
            muted
            playsinline
            class="border border-neutral-200 rounded-xl"
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
            src="/DesignSystem.png"
            alt="Semantic CSS pattern extraction showing design system breakdown with naming conventions"
            width="1200"
            height="800"
            format="webp"
            quality="100"
            class="border border-neutral-200 rounded-xl"
            loading="lazy"
          />
        </UPageCard>
        <UPageCard
          spotlight
          title="See MiroMiro in Action"
          description="Watch how we inspect a button element with its embedded image, extract exact styles, spacing, and assets—then recreate a pixel-perfect copy in Figma. From hover to export in seconds."
          class="col-span-2 lg:col-span-3!"
        >
          <video
            src="/demo.mp4"
            controls
            autoplay
            class="w-full border h-fit lg:h-100 object-cover border-neutral-200 bg-[#fefcf4] rounded-xl"
          >
            Your browser doesn't support video.
          </video>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    
    <UPageSection
      id="waitlist"
      :ui="{container: '!gap-4', root: 'bg-muted'}"
    >
        <div class="w-fit mx-auto rounded-full px-3 py-1.5 border border-white text-muted shadow-lg mb-2">45+ users waiting 🎉</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted text-center">Be First to Know</h2>
        <p class="text-base sm:text-lg text-muted text-center text-balance mt-6">Sign up for our waitlist and get 20% off of any plan forever!</p>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4 w-sm sm:w-xl md:w-xl lg:w-xl 2xl:w-xl mx-auto mt-4"
          @submit="onSubmit"
        >
          <UFormField
            name="email"
            class="w-full"
          >
            <UInput
              v-model="state.email"
              placeholder="name@mail.com"
              class="w-full"
              :ui="{base: 'placeholder:text-muted'}"
            />
          </UFormField>
          <UButton
            type="submit"
            label="Join Waitlist"
            class="w-full flex justify-center items-center cursor-pointer rounded-lg  disabled:bg-purple-700! bg-purple-700 text-white hover:bg-purple-500 focus:bg-purple-300"
            :disabled="!isEmailValid || isSubmitting"
            :loading="isSubmitting"
          />
      </UForm>
    </UPageSection>
   
    <UPageSection
      id="pricing"
      title="Pricing"
      description="Try it for free and upgrade to unlock advanced features that will boost your efficiency."
      :ui="{
        headline: 'rounded-full border border-white bg-muted shadow-lg w-fit mx-auto',
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
          :ui="{ badge: '!text-primary-800', button: 'bg-purple-700 hover:bg-purple-500 disabled:bg-purple-700! focus:bg-purple-600!', featureIcon: '!bg-purple-300' }"
        />
      </UPricingPlans>
    </UPageSection>
  </div>
</template>
