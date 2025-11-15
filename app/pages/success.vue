<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const confetti = ref<any>(null)
const verifying = ref(true)
const error = ref<string | null>(null)

const sessionId = route.query.session_id

onMounted(async () => {
  // Verify the session and update database
  if (sessionId) {
    try {
      const response = await $fetch('/api/stripe/verify-session', {
        method: 'POST',
        body: { sessionId }
      })
      console.log('Payment verified:', response)
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
    <UPageCard class="w-full max-w-md text-center">
      <div v-if="verifying" class="flex flex-col items-center gap-6 py-8">
        <UIcon name="i-lucide-loader-2" class="w-20 h-20 text-primary animate-spin" />
        <div class="space-y-2">
          <h1 class="text-3xl font-bold">Verifying Payment...</h1>
          <p class="text-muted">Please wait while we confirm your subscription</p>
        </div>
      </div>

      <div v-else-if="error" class="flex flex-col items-center gap-6 py-8">
        <UIcon name="i-lucide-alert-circle" class="w-20 h-20 text-red-500" />
        <div class="space-y-2">
          <h1 class="text-3xl font-bold">Verification Failed</h1>
          <p class="text-muted">{{ error }}</p>
        </div>
        <UButton to="/profile" color="neutral" variant="solid" size="lg">
          Go to Profile
        </UButton>
      </div>

      <div v-else class="flex flex-col items-center gap-6 py-8">
        <UIcon name="i-lucide-check-circle-2" class="w-20 h-20 text-green-500" />

        <div class="space-y-2">
          <h1 class="text-3xl font-bold">Payment Successful!</h1>
          <p class="text-muted">
            Thank you for subscribing to MiroMiro Premium
          </p>
        </div>

        <UAlert
          color="primary"
          variant="soft"
          icon="i-lucide-sparkles"
          title="Welcome to Premium!"
          description="You now have access to all premium features including unlimited asset extractions, Lottie animations, and AI Design System generation."
        />

        <div class="space-y-3 w-full">
          <p class="text-sm text-muted">
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
      </div>
    </UPageCard>
  </div>
</template>
