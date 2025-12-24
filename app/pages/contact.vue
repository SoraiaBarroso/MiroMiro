<script setup lang="ts">
import * as z from 'zod'

const user = useSupabaseUser()
const message = ref('')
const email = ref('')
const loading = ref(false)
const toast = useToast()

// Fetch user email if logged in
onMounted(async () => {
  if (user.value?.email) {
    email.value = user.value.email
  }
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser?.email) {
    email.value = newUser.email
  }
})

// Email validation
const isEmailValid = computed(() => {
  if (!email.value) return false
  try {
    z.string().email().parse(email.value)
    return true
  } catch {
    return false
  }
})

const handleSubmit = async () => {
  if (!message.value.trim()) {
    toast.add({
      title: 'Error',
      description: 'Please enter a message',
      color: 'error'
    })
    return
  }

  if (!isEmailValid.value) {
    toast.add({
      title: 'Error',
      description: 'Please enter a valid email address',
      color: 'error'
    })
    return
  }

  loading.value = true

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        email: email.value.toLowerCase(),
        message: message.value
      }
    })

    toast.add({
      title: 'Message Sent',
      description: 'Thank you for your feedback! We\'ll get back to you soon.',
      color: 'success'
    })

    message.value = ''
    // Reset email only if user is not logged in
    if (!user.value) {
      email.value = ''
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to send message. Please try again.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// SEO Meta
const { setSeoMeta, setBreadcrumbs } = useSeo()

setSeoMeta({
  title: 'Contact Us',
  description: 'Get in touch with the MiroMiro team. Report bugs, request features, ask questions, or share your feedback about our CSS inspector and asset extractor.',
  keywords: ['contact miromiro', 'miromiro support', 'report bug', 'feature request', 'chrome extension support']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Contact', url: '/contact' }
])
</script>

<template>
  <UContainer class="py-12">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">
          Contact Us
        </h1>
        <p class="text-muted">
          Have a question or found a bug? Let us know and we'll get back to you as soon as possible.
        </p>
      </div>

      <UCard>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <UFormField
              label="Your Email"
              name="email"
              required
              :hint="user ? 'Using your account email' : ''"
            >
              <UInput
                v-model="email"
                type="email"
                placeholder="your.email@example.com"
                :disabled="loading || !!user"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Your Message"
              name="message"
              required
            >
              <UTextarea
                v-model="message"
                placeholder="Describe your issue, question, or feedback..."
                :rows="8"
                :disabled="loading"
                class="w-full"
              />
            </UFormField>

            <div class="flex justify-end">
              <UButton
                type="submit"
                :loading="loading"
                :disabled="loading || !message.trim() || !isEmailValid"
              >
                Send Message
              </UButton>
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UContainer>
</template>
