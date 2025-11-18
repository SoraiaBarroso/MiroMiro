<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const supabase = useSupabaseClient()
const toast = useToast()
const router = useRouter()
const loading = ref(false)
const passwordReset = ref(false)
const show = ref(false)
const showConfirmation = ref(false)

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  password: undefined,
  confirmPassword: undefined
})

// Check if user has a valid session (from the reset link)
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    toast.add({
      title: 'Invalid Reset Link',
      description: 'The password reset link is invalid or has expired.',
      color: 'error'
    })
    router.push('/forgot-password')
  }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: event.data.password
    })

    if (error) throw error

    passwordReset.value = true
    toast.add({
      title: 'Password Reset!',
      description: 'Your password has been successfully reset.',
      color: 'success'
    })

    // Redirect to signin after 2 seconds
    setTimeout(() => {
      router.push('/signin')
    }, 2000)
  } catch (error: any) {
    console.error('Password reset error:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to reset password. Please try again.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
    <UPageCard class="w-full max-w-md">
      <div v-if="!passwordReset">
        <div class="text-center mb-6">
          <UIcon
            name="i-lucide-key-round"
            class="w-12 h-12 mx-auto mb-4 text-purple-500"
          />
          <h1 class="text-2xl font-bold mb-2">
            Reset Password
          </h1>
          <p class="text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            name="password"
            label="New Password"
          >
            <UInput
              v-model="state.password"
              :type="show ? 'text' : 'password'"
              placeholder="Enter new password"
              icon="i-lucide-lock"
              class="w-full"
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="show ? 'Hide password' : 'Show password'"
                  :aria-pressed="show"
                  aria-controls="password"
                  @click="show = !show"
                />
              </template>
            </UInput>
          </UFormField>

          <UFormField
            name="confirmPassword"
            label="Confirm Password"
          >
            <UInput
              v-model="state.confirmPassword"
              :type="showConfirmation ? 'text' : 'password'"
              placeholder="Confirm new password"
              icon="i-lucide-lock"
              class="w-full"
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showConfirmation ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showConfirmation ? 'Hide password' : 'Show password'"
                  :aria-pressed="showConfirmation"
                  aria-controls="password"
                  @click="showConfirmation = !showConfirmation"
                />
              </template>
            </UInput>
          </UFormField>

          <div class="text-xs text-gray-500 space-y-1">
            <p>Password must:</p>
            <ul class="list-disc list-inside ml-2">
              <li>Be at least 8 characters long</li>
              <li>Contain uppercase and lowercase letters (recommended)</li>
              <li>Include numbers and special characters (recommended)</li>
            </ul>
          </div>

          <UButton
            type="submit"
            class="w-full bg-purple-400 hover:bg-purple-500 focus:bg-purple-600 flex justify-center"
            :loading="loading"
            :disabled="!state.password || !state.confirmPassword || state.password !== state.confirmPassword"
          >
            Reset Password
          </UButton>
        </UForm>

        <div class="text-sm text-center mt-6">
          <NuxtLink
            to="/signin"
            class="text-purple-600 font-medium hover:underline"
          >
            Back to Sign In
          </NuxtLink>
        </div>
      </div>

      <div
        v-else
        class="text-center py-8"
      >
        <UIcon
          name="i-lucide-check-circle"
          class="w-16 h-16 mx-auto mb-4 text-green-500"
        />
        <h2 class="text-2xl font-bold mb-2">
          Password Reset Successful!
        </h2>
        <p class="text-sm text-gray-600 mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <p class="text-xs text-gray-500">
          Redirecting to sign in page...
        </p>
      </div>
    </UPageCard>
  </div>
</template>
