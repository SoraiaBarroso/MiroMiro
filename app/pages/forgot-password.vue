<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const supabase = useSupabaseClient()
const toast = useToast()
const loading = ref(false)
const emailSent = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const config = useRuntimeConfig()
    const { data, error } = await supabase.auth.resetPasswordForEmail(state.email!, {
      redirectTo: `${config.public.siteUrl}/reset-password`
    })

    if (error) throw error

    emailSent.value = true
    toast.add({
      title: 'Email Sent!',
      description: 'Check your inbox for the password reset link.',
      color: 'success'
    })
  } catch (error: any) {
    console.error('Password reset error:', error)
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to send reset email. Please try again.',
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
      <div v-if="!emailSent">
        <div class="text-center mb-6">
          <UIcon
            name="i-lucide-lock-keyhole"
            class="w-12 h-12 mx-auto mb-4 text-purple-500"
          />
          <h1 class="text-2xl font-bold mb-2">
            Forgot your password?
          </h1>
          <p class="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            name="email"
            label="Email"
            class="w-full"
            required
          >
            <UInput
              v-model="state.email"
              type="email"
              placeholder="Enter your email"
              icon="i-lucide-mail"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            class="w-full bg-purple-400 hover:bg-purple-500 focus:bg-purple-600 flex justify-center"
            :loading="loading"
            :disabled="!state.email"
          >
            Send Reset Link
          </UButton>
        </UForm>

        <div class="text-sm text-center mt-6">
          Remember your password?
          <NuxtLink
            to="/signin"
            class="text-purple-600 font-medium hover:underline"
          >
            Sign in
          </NuxtLink>
        </div>
      </div>

      <div
        v-else
        class="text-center py-8"
      >
        <UIcon
          name="i-lucide-mail-check"
          class="w-16 h-16 mx-auto mb-4 text-green-500"
        />
        <h2 class="text-2xl font-bold mb-2">
          Check Your Email
        </h2>
        <p class="text-sm text-gray-600 mb-6">
          We've sent a password reset link to <strong>{{ state.email }}</strong>.
          Click the link in the email to reset your password.
        </p>
        <p class="text-xs text-gray-500 mb-6">
          Didn't receive the email? Check your spam folder or try again.
        </p>
        <UButton
          variant="outline"
          color="neutral"
          class="w-full flex justify-center"
          @click="emailSent = false"
        >
          Try Again
        </UButton>
      </div>
    </UPageCard>
  </div>
</template>
