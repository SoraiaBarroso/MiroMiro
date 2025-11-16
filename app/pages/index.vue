<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { STRIPE_PLANS } from '../../config/pricing'

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
    billingCycle: "/month",
    features: [
      'Page Overview',
      'Inspect Mode',
      'Individual Downloads',
      'Color Palette Viewer',
      '50 asset extractions/month',
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
    billingCycle: "/month",
    scale: true,
    badge: STRIPE_PLANS.starter.badge,
    features: STRIPE_PLANS.starter.features,
    button: {
      disabled: true,
      label: 'Upgrade to Starter',
      onClick: () => {
        handleCheckout(STRIPE_PLANS.starter.priceId)
      }
    }
  },
  {
    title: STRIPE_PLANS.pro.name,
    description: STRIPE_PLANS.pro.description,
    price: `$${STRIPE_PLANS.pro.price.monthly}`,
    billingCycle: "/month",
    badge: STRIPE_PLANS.pro.badge,
    features: STRIPE_PLANS.pro.features,
    button: {
      disabled: true,
      label: 'Upgrade to Pro',
      onClick: () => {
        handleCheckout(STRIPE_PLANS.pro.priceId)
      }
    }
  },
])
</script>

<template>
  <div>
    <UPageHero
      title="Inspect. Extract. Build Faster."
      class="relative z-10 py-20"
      description="The ultimate Chrome extension for one-click asset extraction. Hover to inspect colors, fonts, and spacing—then export images, videos, and SVGs production-ready."
      :links="[{
        label: 'Join the Waitlist',
        to: '#waitlist',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        variant: 'soft',
        class: 'rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 focus:bg-purple-300'
      }, {
        label: 'See how It Works',
        to: '#features',
        size: 'xl',
        color: 'neutral',
        variant: 'soft',
        class: 'rounded-full'
      }]"
    >
      <img src="/assets/bg.svg" class="absolute inset-0 w-full h-full object-cover -z-10" alt="">
      <!-- <img src="/assets/ex1.png" alt="" class="absolute w-100 hover:scale-110 transition duration-200 ease-in-out right-10 top-1/4 -translate-y-1/2 ">
      <img src="/assets/ex2.png" alt="" class="absolute w-80 hover:scale-110 transition duration-200 ease-in-out left-10 bottom-10 ">
      <img src="/assets/ex4.png" alt="" class="absolute w-80 hover:scale-110 transition duration-200 ease-in-out left-0 top-10 "> -->

    </UPageHero>
    
   
    <UPageSection id="features">
      <UPageGrid>
        <UPageCard
          spotlight
          title="Instant Page Overview"
          description="The moment you open a website, MiroMiro analyzes everything: background colors, text colors, font families and color usage frequency. Get a complete snapshot of any site's visual language in seconds."
          class="col-span-1! lg:col-span-1"
        >
          <img
            src="assets/overview.png"
            alt="Page Overview"
            class="w-full border border-neutral-200 bg-[#fefcf4] object-contain rounded-xl"
          />
        </UPageCard>

        <UPageCard
          spotlight
          title="Smart Element Inspector"
          description="Hover over any element to see its complete style breakdown. Colors, fonts, spacing, shadows, borders—all displayed in real-time. Copy values instantly or inspect design patterns as you browse."
          class="col-span-2! lg:col-span-1"
        >
          <img
            src="assets/inspector.png"
            alt="Element Inspector"
            class="w-full border h-80 border-neutral-200 bg-[#fefcf4] object-cover rounded-xl"
          />
        </UPageCard>

        <UPageCard
          spotlight
          title="One-Click Media Extraction"
          description="Download all images and videos from any website instantly. No more digging for assets—MiroMiro captures every visual asset on the page with a single click."
          class="col-span-2"
        >
          <img
            src="assets/images1.png"
            alt="Media Extraction"
            class="w-full border border-neutral-200 bg-[#fefcf4] rounded-xl h-120 object-cover"
          />
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
            class="w-full border h-full border-neutral-200 bg-[#fefcf4] object-cover rounded-xl"
          />
        </UPageCard>

        <UPageCard
          spotlight
          title="Lottie Animation Export"
          description="Capture and export Lottie animations directly from websites. MiroMiro identifies embedded Lottie files and lets you download them in JSON format, ready for use in your projects."
          class="col-span-2 lg:col-span-1"
        >
          <template #icon>
            <UBadge color="primary" variant="subtle" class="mb-4">New</UBadge>
          </template>
          <img
            src="assets/test.gif"
            alt="Lottie Export"
            class="w-full border border-neutral-200 object-cover rounded-xl"
          />
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
            class="w-full border border-neutral-200 h-90 bg-[#fefcf4] object-contain rounded-xl"
          />
        </UPageCard>
          <UPageCard
          spotlight
          title="See MiroMiro in Action"
          description="Watch how we inspect a button element with its embedded image, extract exact styles, spacing, and assets—then recreate a pixel-perfect copy in Figma. From hover to export in seconds."
          class="col-span-3!"
        >
         <video src="/assets/demo.mp4" controls autoplay class="w-full border h-100 object-contain border-neutral-200 bg-[#fefcf4] rounded-xl"></video>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageCTA
      id="waitlist"
      title="Be the First to Know"
      description="Sign up for our waitlist and be among the first to enjoy our premium features."
      variant="subtle"
      :ui="{
        title: 'relative',  
        container: 'flex flex-col items-center justify-center !gap-8',
      }"
    >
      <UForm :schema="schema" :state="state" class="space-y-4 w-xs sm:w-sm md:w-xl lg:w-auto 2xl:w-auto" @submit="onSubmit">
        <UFormField  name="email" class="w-full">
          <UInput placeholder="name@mail.com" v-model="state.email" class="w-full" />
        </UFormField>
        <UButton type="submit" class="w-full flex justify-center items-center cursor-pointer focus:bg-purple-600! disabled:bg-purple-200! bg-purple-400 hover:bg-purple-500" :disabled="!state.email || isSubmitting" :loading="isSubmitting">
          Join Waitlist
        </UButton>
      </UForm>
    </UPageCTA>

    <UPageSection
     :ui="{container: '!gap-6'}"
     id="pricing" title="Pricing" description="Try it for free and upgrade to unlock advanced features that will boost your efficiency.">
        <NuxtLink to="/compare-plans" class="text-purple-600 hover:underline mb-7 text-center inline-block">Compare Plans</NuxtLink>  
        <UPricingPlans>
             <UPricingPlan
                v-for="(plan, index) in plans"
                :key="index"
                v-bind="plan"
                :ui="{button: 'bg-purple-400 hover:bg-purple-500 disabled:bg-purple-200! focus:bg-purple-600!', featureIcon: '!bg-purple-300'}"
              />
          </UPricingPlans>
    </UPageSection>
  </div>
</template>
