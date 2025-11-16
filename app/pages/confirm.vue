<script setup lang="ts">
  const supabase = useSupabaseClient()

  onMounted(async () => {
    console.log('Confirm page loaded')

    // Supabase will automatically handle the OAuth callback from the URL
    // We just need to wait for the auth state to change

    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)

      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully')

        // Check if this auth was initiated from the extension
        const extensionRedirect = sessionStorage.getItem('extensionRedirect')

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
  })
  </script>

  <template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <UIcon name="i-lucide-loader-2" class="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p class="text-lg">Completing authentication...</p>
      </div>
    </div>
  </template>