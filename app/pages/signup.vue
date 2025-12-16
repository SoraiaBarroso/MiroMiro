<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const supabase = useSupabaseClient()
const toast = useToast()
const route = useRoute()
const loading = ref(false)
const config = useRuntimeConfig()
const { gtag } = useGtag()

// Check if signup was initiated from extension
const extensionRedirect = ref<string | null>(null)

onMounted(async () => {
  // Check for extension redirect parameter
  if (route.query.extensionRedirect) {
    extensionRedirect.value = decodeURIComponent(route.query.extensionRedirect as string)
    sessionStorage.setItem('extensionRedirect', extensionRedirect.value)
    console.log('Signup initiated from extension:', extensionRedirect.value)
    
    // AUTO-REDIRECT: If user is already logged in, send them back to extension
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      console.log('User already logged in, redirecting to extension...')
      const redirectUrl = `${extensionRedirect.value}#access_token=${session.access_token}&refresh_token=${session.refresh_token}&token_type=bearer`
      window.location.href = redirectUrl
      return
    }
  } else {
    // Check if it was stored from OAuth flow
    const stored = sessionStorage.getItem('extensionRedirect')
    if (stored) {
      extensionRedirect.value = stored
    }
  }
})


const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: async () => {
    // Track OAuth signup attempt
    gtag('event', 'sign_up', {
      method: 'google'
    })

    // Preserve extensionRedirect for OAuth flow
    const redirectUrl = new URL(`${config.public.siteUrl}/confirm`)
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
    // Track OAuth signup attempt
    gtag('event', 'sign_up', {
      method: 'github'
    })

    // Preserve extensionRedirect for OAuth flow
    const redirectUrl = new URL(`${config.public.siteUrl}/confirm`)
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
  placeholder: 'Enter your password (min 8 characters)',
  required: true
}, {
  name: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
  placeholder: 'Confirm your password',
  required: true
}]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const showConfirmation = ref(false)
const userEmail = ref('')
const hasDiscount = ref(false)
const resendingEmail = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const response = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: payload.data.email.toLowerCase(),
        password: payload.data.password
      }
    })

    userEmail.value = payload.data.email
    hasDiscount.value = response.has_waitlist_discount
    showConfirmation.value = true

    // Track signup event in Google Analytics
    gtag('event', 'sign_up', {
      method: 'email'
    })

    toast.add({
      title: 'Success!',
      description: 'Please check your email to confirm your account.',
      color: 'success'
    })
  } catch (error: any) {
    console.error('Signup error:', error)

    // Handle duplicate email specially
    if (error.status === 409 || error.data?.data?.errorType === 'duplicate_email') {
      toast.add({
        title: 'Account Already Exists',
        description: error.data?.statusMessage || 'An account with this email already exists.',
        color: 'warning'
      })
    } else {
      toast.add({
        title: 'Error',
        description: error.data?.statusMessage || error.message || 'Failed to create account',
        color: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

async function resendConfirmation() {
  resendingEmail.value = true
  try {
    await $fetch('/api/auth/resend-confirmation', {
      method: 'POST',
      body: {
        email: userEmail.value
      }
    })

    toast.add({
      title: 'Email Sent!',
      description: 'Confirmation email has been resent. Please check your inbox.',
      color: 'success'
    })
  } catch (error: any) {
    console.error('Resend error:', error)
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || error.message || 'Failed to resend email',
      color: 'error'
    })
  } finally {
    resendingEmail.value = false
  }
}


</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
    <UPageCard class="w-full max-w-md">
      <!-- Show confirmation message after signup -->
      <div
        v-if="showConfirmation"
        class="flex flex-col items-center gap-6 py-8 text-center"
      >
        <UIcon
          name="i-lucide-mail-check"
          class="w-16 h-16 text-primary"
        />

        <div class="space-y-2">
          <h2 class="text-2xl font-bold">
            Check Your Email
          </h2>
          <p class="text-muted">
            We've sent a confirmation email to <strong>{{ userEmail }}</strong>
          </p>
        </div>

        <UAlert
          v-if="hasDiscount"
          color="primary"
          variant="soft"
          icon="i-lucide-gift"
          title="Special Discount!"
          description="As a waitlist member, you'll receive a 20% discount on all premium features!"
        />

        <div class="space-y-3 w-full">
          <p class="text-sm text-muted">
            Please click the confirmation link in the email to activate your account.
          </p>

          <!-- <UDivider label="OR" /> -->

          <div class="text-sm text-center">
            Already confirmed?
            <NuxtLink
              to="/signin"
              class="text-primary font-medium hover:underline"
            >
              Sign in here
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Show signup form by default -->
      <UAuthForm
        v-else
        :schema="schema"
        :loading="loading"
        title="Sign Up"
        description="Create your account to get started."
        icon="i-lucide-user-plus"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="text-sm text-center mt-4">
            Already have an account?
            <NuxtLink
              :to="extensionRedirect ? `/signin?extensionRedirect=${encodeURIComponent(extensionRedirect)}` : '/signin'"
              class="text-primary font-medium hover:underline"
            >
              Sign in
            </NuxtLink>
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>