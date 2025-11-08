<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
const supabase = useSupabaseClient()

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const toast = useToast()
const isSubmitting = ref(false)

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

const plans = ref([
  {
    title: 'Free Plan',
    description: '  Perfect for designers and developers getting started.',
    price: '$0',
    features: [
      'Extract images and videos from any website',
      'Download SVGs and icons in original format',
      'Instant page overview (colors, fonts, typography)',
      'Manual color picking and copying',
    ],
    button: {
      label: 'Coming Soon...'
    }
  },
  {
    title: 'Pro Plan',
    description: 'For professionals who need production-ready exports',
    price: '$3.99/mo',
    features: [
      'Everything in Free, plus:',
      'AI-powered brand analysis',
      'Automatic design system generation',
      'Export to CSS Variables or Tailwind',
      'WCAG accessibility validation',
      'More coming soon!',
    ],
    button: {
      label: 'Coming Soon...'
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
    </UPageHero>
    
   
    <UPageSection
      id="features"
      title="Instant Page Overview"
      description="The moment you open a website, MiroMiro analyzes everything: background colors, text colors, font families and color usage frequency. Get a complete snapshot of any site's visual language in seconds."
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
    >
      <img
        src="assets/overview.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageSection
      title="Smart Element Inspector"
      description="Hover over any element to see its complete style breakdown. Colors, fonts, spacing, shadows, borders—all displayed in
  real-time. Copy values instantly or inspect design patterns as you browse."
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
      reverse
    >
      <img
        src="assets/inspector.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

    <UPageSection
      title="One-Click Media Extraction"
      description="Download all images and videos from any website instantly. No more digging for assets—MiroMiro captures every visual asset on the page with a single click. "
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
    >
      <img
        src="assets/images1.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageSection
      title="SVG & Icon Capture"
      description=" Extract SVG graphics and icons in their original vector format. Download them individually or in bulk, preserving full editability. Perfect for designers who need clean, scalable assets without
  digging through page source."
      orientation="horizontal"
      reverse
    >
      <img
        src="assets/svg.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageSection
      icon="i-lucide:sparkles"
      title="AI Design System Generator"
      description="AI that converts any website into production-ready code.
It detects hero colors, brand accents, and builds complete color scales with WCAG-validated accessibility.
Export as CSS variables or Tailwind configs instantly."
      orientation="horizontal"
      :ui="{
        leadingIcon: 'text-[#B6A5CC]'
      }"

    >
      <img
        src="assets/AI.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageCTA
      id="waitlist"
      title="Be the First to Know"
      description="Sign up for our waitlist and be among the first to enjoy our premium features."
      variant="subtle"
      :ui="{
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

    <UPageSection id="pricing" title="Pricing" description="Find the plan that works best for you. You can upgrade, downgrade, or cancel anytime">
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
