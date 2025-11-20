  <script setup lang="ts">
  import * as z from 'zod'
  import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

  const supabase = useSupabaseClient()
  const toast = useToast()
  const router = useRouter()
  const route = useRoute() // Add this
  const loading = ref(false)

  // Add extension redirect handling
  const extensionRedirect = ref<string | null>(null)

  onMounted(() => {
    // Check for extension redirect parameter
    if (route.query.extensionRedirect) {
      extensionRedirect.value = decodeURIComponent(route.query.extensionRedirect as string)
      sessionStorage.setItem('extensionRedirect', extensionRedirect.value)
      console.log('Sign-in initiated from extension:', extensionRedirect.value)
    } else {
      // Check if it was stored from OAuth flow
      const stored = sessionStorage.getItem('extensionRedirect')
      if (stored) {
        extensionRedirect.value = stored
      }
    }
  })

  const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }, {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox'
  }]

  const providers = [{
    label: 'Google',
    icon: 'i-simple-icons-google',
    onClick: async () => {
      // Preserve extensionRedirect for OAuth flow
      const redirectUrl = new URL(`${window.location.origin}/confirm`)
      if (extensionRedirect.value) {
        redirectUrl.searchParams.set('extensionRedirect', extensionRedirect.value)
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl.toString()
        }
      })
      if (error) {
        toast.add({
          title: 'Error',
          description: error.message,
          color: 'error'
        })
      }
    }
  }, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: async () => {
      // Preserve extensionRedirect for OAuth flow
      const redirectUrl = new URL(`${window.location.origin}/confirm`)
      if (extensionRedirect.value) {
        redirectUrl.searchParams.set('extensionRedirect', extensionRedirect.value)
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl.toString()
        }
      })
      if (error) {
        toast.add({
          title: 'Error',
          description: error.message,
          color: 'error'
        })
      }
    }
  }]

  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
  })

  type Schema = z.output<typeof schema>

  const resendingEmail = ref(false)

  async function resendConfirmationEmail(email: string) {
    resendingEmail.value = true
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) throw error

      toast.add({
        title: 'Email sent!',
        description: 'Check your inbox for the confirmation link.',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message || 'Failed to resend email',
        color: 'error'
      })
    } finally {
      resendingEmail.value = false
    }
  }

  async function onSubmit(payload: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: payload.data.email.toLowerCase(),
        password: payload.data.password
      })

      if (error) {
        throw error
      }

      toast.add({
        title: 'Success!',
        description: 'Welcome back!',
        color: 'success'
      })

      // Check for extension redirect
      if (extensionRedirect.value) {
        console.log('Redirecting back to extension:', extensionRedirect.value)
        sessionStorage.removeItem('extensionRedirect')
        window.location.href = extensionRedirect.value
      } else {
        // Normal redirect to home
        router.push('/')
      }
    } catch (error: any) {
      console.error('Sign in error:', error)

      // Handle email not confirmed error
      if (error.message === 'Email not confirmed') {
        toast.add({
          title: 'Email Not Confirmed',
          description: 'Please check your email and click the confirmation link.',
          color: 'error',
          actions: [{
            label: 'Resend Email',
            click: () => resendConfirmationEmail(payload.data.email.toLowerCase())
          }]
        })
      } else {
        toast.add({
          title: 'Error',
          description: error.message || 'Invalid email or password',
          color: 'error'
        })
      }
    } finally {
      loading.value = false
    }
  }
  </script>

  <template>
    <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :schema="schema"
          :loading="loading"
          title="Sign In"
          description="Enter your credentials to access your account."
          icon="i-lucide-user"
          :fields="fields"
          :providers="providers"
          @submit="onSubmit"
        >
          <template #footer>
            <div class="text-sm text-center mt-4">
              <NuxtLink
                to="/forgot-password"
                class="text-purple-600 font-medium hover:underline block mb-3"
              >
                Forgot your password?
              </NuxtLink>
              Don't have an account?
              <NuxtLink
                :to="extensionRedirect ? `/signup?extensionRedirect=${encodeURIComponent(extensionRedirect)}` : '/signup'"
                class="text-primary font-medium hover:underline"
              >
                Sign up
              </NuxtLink>
            </div>
          </template>
        </UAuthForm>
      </UPageCard>
    </div>
  </template>