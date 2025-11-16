<script setup lang="ts">
import { STRIPE_PLANS } from '../../config/pricing'

const route = useRoute()
const router = useRouter()
const confetti = ref<any>(null)
const verifying = ref(true)
const error = ref<string | null>(null)
const planTier = ref<string>('free')

const sessionId = route.query.session_id

// Get plan details based on tier
const planDetails = computed(() => {
  if (planTier.value === 'starter') {
    return {
      name: STRIPE_PLANS.starter.name,
      features: STRIPE_PLANS.starter.features,
      price: `$${STRIPE_PLANS.starter.price.monthly}/month`
    }
  } else if (planTier.value === 'pro') {
    return {
      name: STRIPE_PLANS.pro.name,
      features: STRIPE_PLANS.pro.features,
      price: `$${STRIPE_PLANS.pro.price.monthly}/month`
    }
  }
  return null
})

onMounted(async () => {
  // Verify the session and update database
  if (sessionId) {
    try {
      const response = await $fetch('/api/stripe/verify-session', {
        method: 'POST',
        body: { sessionId }
      })
      console.log('Payment verified:', response)
      planTier.value = response.tier || 'free'
      verifying.value = false
    } catch (err: any) {
      console.error('Verification failed:', err)
      error.value = err.data?.statusMessage || 'Failed to verify payment'
      verifying.value = false
      return
    }
  } else {
    verifying.value = false
  }

  // Dynamically import js-confetti
  const JSConfetti = (await import('js-confetti')).default
  confetti.value = new JSConfetti()

  // Trigger confetti animation
  confetti.value.addConfetti({
    emojis: ['🎉', '✨', '💜', '🚀'],
    emojiSize: 50,
    confettiNumber: 50,
  })

  // Redirect to dashboard after 5 seconds
  setTimeout(() => {
    router.push('/profile')
  }, 5000)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <UCard v-if="verifying"
      :ui="{
        body: 'flex flex-col items-center gap-4'
      }"
    >
        <UIcon name="i-lucide-loader-2" class="w-20 h-20 text-primary animate-spin" />
        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-center">Verifying Payment...</h1>
          <p class="text-muted text-center">Please wait while we confirm your subscription</p>
        </div>
    </UCard>

    <UCard v-else-if="error" 
      :ui="{
        body: 'flex flex-col items-center gap-4'
      }"
    >
        <UIcon name="i-lucide-alert-circle" class="w-20 h-20 text-red-500" />
        <div class="space-y-2">
          <h1 class="text-3xl font-bold">Verification Failed</h1>
          <p class="text-muted">{{ error }}</p>
        </div>
        <UButton to="/profile" color="neutral" variant="solid" size="lg">
          Go to Profile
        </UButton>
    </UCard>
    
    <UCard 
      v-else
      :ui="{
        body: 'flex flex-col items-center gap-4'
      }"
    >
        <UIcon name="i-lucide-check-circle-2" class="w-20 h-20 text-green-500" />

        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-center">Payment Successful!</h1>
          <p class="text-muted text-center">
            Thank you for subscribing to <strong>{{ planDetails?.name || 'MiroMiro Premium' }}</strong>
          </p>
          <p v-if="planDetails" class="text-sm text-muted text-center">
            {{ planDetails.price }}
          </p>
        </div>

        <UAlert
          color="primary"
          variant="soft"
          icon="i-lucide-sparkles"
          :title="`Welcome to ${planDetails?.name || 'Premium'}!`"
        >
          <template #description>
            <div v-if="planDetails">
              <p class="mb-2">You now have access to:</p>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="(feature, index) in planDetails.features.slice(0, 5)" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
            <p v-else>
              You now have access to all premium features including unlimited asset extractions, Lottie animations, and AI Design System generation.
            </p>
          </template>
        </UAlert>

        <div class="space-y-3 w-full">
          <p class="text-sm text-muted text-center">
            Redirecting you to your profile in 5 seconds...
          </p>

          <UButton
            to="/profile"
            color="neutral"
            variant="solid"
            block
            size="lg"
          >
            Go to Profile Now
          </UButton>

          <UDivider label="OR" />

          <UButton
            to="/"
            color="neutral"
            variant="outline"
            block
          >
            Back to Home
          </UButton>
        </div>

        <p v-if="sessionId" class="text-xs text-muted mt-4">
          Session ID: {{ sessionId }}
        </p>
    </UCard>     
  </div>
</template>
