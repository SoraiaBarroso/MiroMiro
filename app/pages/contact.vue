<script setup lang="ts">
const message = ref('')
const loading = ref(false)
const toast = useToast()

const handleSubmit = async () => {
  if (!message.value.trim()) {
    toast.add({
      title: 'Error',
      description: 'Please enter a message',
      color: 'error'
    })
    return
  }

  loading.value = true

  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        message: message.value
      }
    })

    toast.add({
      title: 'Message Sent',
      description: 'Thank you for your feedback! We\'ll get back to you soon.',
      color: 'success'
    })

    message.value = ''
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

useHead({
  title: 'Contact Us - MiroMiro',
  meta: [
    { name: 'description', content: 'Get in touch with the MiroMiro team. Report bugs, ask questions, or share your feedback.' }
  ]
})
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
                :disabled="loading || !message.trim()"
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
