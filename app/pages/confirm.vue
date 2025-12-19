<script setup lang="ts">
const supabase = useSupabaseClient()
const route = useRoute()
const hasProcessedSignIn = ref(false)

onMounted(async () => {
  console.log('Confirm page loaded')

  // Check for extensionRedirect in URL query params FIRST (from OAuth flow)
  // Then fall back to sessionStorage
  let extensionRedirect = route.query.extensionRedirect as string | null
  if (!extensionRedirect) {
    extensionRedirect = sessionStorage.getItem('extensionRedirect')
  }

  console.log('Extension redirect:', extensionRedirect)

  // Supabase will automatically handle the OAuth callback from the URL
  // We just need to wait for the auth state to change

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event)

    if (event === 'SIGNED_IN' && session && !hasProcessedSignIn.value) {
      // Prevent duplicate processing
      hasProcessedSignIn.value = true
      console.log('User signed in successfully')

      // Check waitlist and apply discount if applicable (non-blocking)
      $fetch('/api/auth/check-waitlist', {
        method: 'POST'
      }).catch(err => console.error('Failed to check waitlist:', err))

      // Send notification to admin (non-blocking)
      $fetch('/api/auth/notify-signin', {
        method: 'POST',
        body: { method: 'oauth' }
      }).catch(err => console.error('Failed to send signin notification:', err))

      if (extensionRedirect) {
        console.log('Redirecting to extension with tokens...')

        // Clear the stored redirect
        sessionStorage.removeItem('extensionRedirect')

        // Manually redirect to extension with tokens in hash
        const params = `access_token=${session.access_token}&refresh_token=${session.refresh_token}`
        window.location.href = `${extensionRedirect}#${params}`
      } else {
        // Normal website flow
        console.log('Normal flow - redirecting to profile')
        await navigateTo('/profile')
      }
    } else if (event === 'PASSWORD_RECOVERY') {
      // Handle password recovery
      await navigateTo('/reset-password')
    }
  })

  // Clean up subscription on unmount
  onUnmounted(() => {
    subscription?.unsubscribe()
  })
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="w-12 h-12 animate-spin text-primary mx-auto mb-4"
      />
      <p class="text-lg">
        Completing authentication...
      </p>
    </div>
  </div>
</template>
