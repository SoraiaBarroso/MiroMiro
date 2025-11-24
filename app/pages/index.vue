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
  const user = useSupabaseUser()
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

const plans = computed(() => [
  {
    title: 'Free Plan',
    description: 'Perfect for trying MiroMiro and occasional use',
    price: '$0',
    billingCycle: '/month',
    features: [
      'Page Overview',
      'Inspect Mode',
      'Individual Downloads',
      'Color Palette Viewer',
      '50 asset extractions/month',
      '5 smart inspections/day'
    ],
    button: {
      label: 'Current Plan',
      disabled: true
    }
  },
  {
    title: STRIPE_PLANS.starter.name,
    description: STRIPE_PLANS.starter.description,
    price: `$${STRIPE_PLANS.starter.price.originalPrice}`,
    discount: `$${STRIPE_PLANS.starter.price.monthly}`,
    billingCycle: '/month',
    scale: true,
    badge: STRIPE_PLANS.starter.badge,
    features: STRIPE_PLANS.starter.features,
    button: {
      disabled: true,
      label: 'Upgrade to Starter',
      onClick: () => {
        handleCheckout(config.public.stripe.starterPriceId)
      }
    }
  },
  {
    title: STRIPE_PLANS.pro.name,
    description: STRIPE_PLANS.pro.description,
    price: `$${STRIPE_PLANS.pro.price.monthly}`,
    billingCycle: '/month',
    features: STRIPE_PLANS.pro.features,
    button: {
      disabled: true,
      label: 'Upgrade to Pro',
      onClick: () => {
        handleCheckout(config.public.stripe.proPriceId)
      }
    }
  }
])

// const headline = `Soon on the Chrome Store ${i-logos:chrome-web-store}`

</script>

<template>
  <div>
    <CustomPageHero orientation="vertical">
      <template #background>
        <img
          src="/assets/bg.svg"
          class="absolute inset-0 w-full h-full object-cover -z-10"
          alt=""
        >
      </template>

      <template #headline>
        On the Chrome Store
      </template>

      <template #title>
        Reverse-Engineer Any Website: <span class="relative inline-block px-3 py-2">Inspect UI<svg class="absolute w-full h-full left-0 top-0 z-10 pointer-events-none" viewBox="0 0 2727 626" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
<path d="M49.828 50.1708L49.8633 574.942L2675.17 575.066L2675.14 50.2952L49.828 50.1708Z" fill="#3491FF" fill-opacity="0.06" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M29.0002 40.0084L29.0371 585.102L2696 585.229L2695.96 40.1349L29.0002 40.0084Z" fill="#3491FF" fill-opacity="0.06"/>
<path d="M2633.35 6.31239L2633.36 93.6847L2720.73 93.6906L2720.72 6.31833L2633.35 6.31239Z" fill="#F5F5F5"/>
<path d="M2633.35 6.31239L2633.36 93.6847L2720.73 93.6906L2720.72 6.31834L2633.35 6.31239Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M6.35031 5.99989L6.35352 93.3722L93.7258 93.3781L93.7226 6.00583L6.35031 5.99989Z" fill="#F5F5F5"/>
<path d="M6.35031 5.99989L6.35352 93.3722L93.7258 93.3781L93.7226 6.00584L6.35031 5.99989Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M2633.35 532.313L2633.35 619.685L2720.73 619.691L2720.72 532.319L2633.35 532.313Z" fill="#F5F5F5"/>
<path d="M2633.35 532.313L2633.35 619.685L2720.73 619.691L2720.72 532.319L2633.35 532.313Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M6.35031 526.312L6.35352 613.685L93.7258 613.691L93.7226 526.318L6.35031 526.312Z" fill="#F5F5F5"/>
<path d="M6.35031 526.312L6.35352 613.685L93.7258 613.691L93.7226 526.318L6.35031 526.312Z" stroke="#3491FF" stroke-width="7.919" stroke-miterlimit="10" stroke-linecap="round"/>
</svg></span> & Extract Assets Instantly
      </template>

      <template #description>
Hover over any element to see its complete CSS breakdown. Extract entire design systems, color       
  palettes, typography, spacing, and all media assets in one click. Turn any website into your
  design reference and asset library instantly.      </template>

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
          class="rounded-lg border-primary-600 text-primary-600 hover:bg-purple-50 focus:bg-purple-100"
        >
          See how It Works
        </UButton>
      </template>
    </CustomPageHero>

    <UPageSection id="features">
      <UPageGrid>
        <UPageCard
          spotlight
          title="Instant Page Overview"
          description="The moment you open a website, MiroMiro analyzes everything: background colors, text colors, font families and color usage frequency. Get a complete snapshot of any site's visual language in seconds."
          class="col-span-2 lg:col-span-1"
        >
          <img
            src="assets/overview.png"
            alt="Page Overview"
            class="w-full border h-70 border-neutral-200 object-cover rounded-xl"
          >
        </UPageCard>

        <UPageCard
          spotlight
          title="Smart Element Inspector"
          description="Hover over any element to see its complete style breakdown. Colors, fonts, spacing, shadows, borders—all displayed in real-time. Copy values instantly or inspect design patterns as you browse."
          class="col-span-2! lg:col-span-1"
        >
          <img
            src="assets/InspectorImg.png"
            alt="Element Inspector"
            class="w-full border lg:h-90 border-neutral-200 h-fit object-cover rounded-xl"
          >
        </UPageCard>

        <UPageCard
          spotlight
          title="One-Click Media Extraction"
          description="Download all images, videos, gifs from any website instantly. No more digging for assets—MiroMiro captures every visual asset on the page with a single click."
          class="col-span-2"
        >
          <img
            src="assets/demoImg.gif"
            alt="Media Extraction"
            class="w-full border border-neutral-200 bg-whiterounded-xl h-fit rounded-xl object-contain lg:h-120 lg:object-cover"
          >
        </UPageCard>

        <UPageCard
          spotlight
          title="SVG & Icon Capture"
          description="Extract SVG graphics and icons in their original vector format. Download them individually or in bulk, preserving full editability. Perfect for designers who need clean, scalable assets."
          class="col-span-2 lg:col-span-1"
        >
          <img
            src="assets/svg.png"
            alt="SVG Capture"
            class="w-full border h-full border-neutral-200 object-cover rounded-xl"
          >
        </UPageCard>

        <UPageCard
          spotlight
          title="Lottie Animation Export"
          description="Capture and export Lottie animations directly from websites. MiroMiro identifies embedded Lottie files and lets you download them in JSON format, ready for use in your projects."
          class="col-span-2 lg:col-span-1"
        >
          <template #icon>
            <UBadge
              color="primary"
              variant="subtle"
              class="mb-4"
            >
              New
            </UBadge>
          </template>
          <img
            src="assets/test.gif"
            alt="Lottie Export"
            class="w-full border border-neutral-200 object-cover rounded-xl h-80"
          >
        </UPageCard>

        <UPageCard
          spotlight
          icon="i-lucide-sparkles"
          title="AI Design System Generator"
          description="AI that converts any website into production-ready code. It detects hero colors, brand accents, and builds complete color scales with WCAG-validated accessibility. Export as CSS variables or Tailwind configs instantly."
          class="col-span-2"
          :ui="{ icon: 'text-purple-500' }"
        >
          <img
            src="assets/AI.png"
            alt="AI Design System"
            class="w-full border border-neutral-200 h-80 object-cover rounded-xl"
          >
        </UPageCard>
        <UPageCard
          spotlight
          title="See MiroMiro in Action"
          description="Watch how we inspect a button element with its embedded image, extract exact styles, spacing, and assets—then recreate a pixel-perfect copy in Figma. From hover to export in seconds."
          class="col-span-2 lg:col-span-3!"
        >
          <video
            src="/assets/demo.mp4"
            controls
            autoplay
            class="w-full border h-fit lg:h-100 object-cover border-neutral-200 bg-[#fefcf4] rounded-xl"
          />
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageCTA
      id="waitlist"
      title="Be First to Know"
      description="Sign up for our waitlist and get 20% off of any plan forever!"
      variant="subtle"
      :ui="{
        title: 'relative',
        container: 'flex flex-col items-center justify-center !gap-8'
      }"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 w-xs sm:w-sm md:w-xl lg:w-auto 2xl:w-auto"
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
          />
        </UFormField>
        <UButton
          type="submit"
          class="w-full flex justify-center items-center cursor-pointer rounded-lg bg-purple-800 text-white hover:bg-purple-700 focus:bg-purple-300"
          :disabled="!isEmailValid || isSubmitting"
          :loading="isSubmitting"
        >
          Join Waitlist
        </UButton>
      </UForm>
    </UPageCTA>

    <UPageSection
      id="pricing"
      title="Pricing"
      description="Try it for free and upgrade to unlock advanced features that will boost your efficiency."
    >
      <UPricingPlans>
        <UPricingPlan
          v-for="(plan, index) in plans"
          :key="index"
          v-bind="plan"
          :ui="{ button: 'bg-purple-400 hover:bg-purple-500 disabled:bg-purple-200! focus:bg-purple-600!', featureIcon: '!bg-purple-300' }"
        />
      </UPricingPlans>
    </UPageSection>
  </div>
</template>
