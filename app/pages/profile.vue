<script setup lang="ts">
import * as z from 'zod'
import { STRIPE_PLANS } from '../../config/pricing'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Use shared avatar state
const { updateAvatar } = useUserAvatar()

// Profile state
const loading = ref(false)
const uploadingAvatar = ref(false)
const profile = ref<any>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const cancelingSubscription = ref(false)
const showCancelModal = ref(false)

// Form schema
const schema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50)
})

type Schema = z.output<typeof schema>

// Form state
const formState = reactive<Partial<Schema>>({
  first_name: '',
  last_name: ''
})

// Load profile data
async function loadProfile() {
  if (!user.value?.sub) {
    console.log('User not loaded yet, skipping profile load')
    return
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.value.sub)
      .single()
    
    if (error) throw error
    profile.value = data
    // Populate form state
    formState.first_name = data.first_name || ''
    formState.last_name = data.last_name || ''
  } catch (error: any) {
    console.error('Error loading profile:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load profile',
      color: 'error'
    })
  }
}

// Update profile
async function onSubmit(event: any) {
  loading.value = true
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: formState.first_name,
        last_name: formState.last_name
      })
      .eq('id', user.value!.sub)

    if (error) throw error

    toast.add({
      title: 'Success',
      description: 'Profile updated successfully',
      color: 'success'
    })

    // Reload profile to get updated data
    await loadProfile()
  } catch (error: any) {
    console.error('Error updating profile:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update profile',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const changeProfilePicture = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      title: 'Error',
      description: 'File size exceeds 5MB limit.',
      color: 'error'
    })
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.add({
      title: 'Error',
      description: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
      color: 'error'
    })
    return
  }

  uploadingAvatar.value = true

  try {
    // Create FormData and upload via API endpoint
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch('/api/profile/upload-avatar', {
      method: 'POST',
      body: formData
    })

    toast.add({
      title: 'Success',
      description: 'Profile picture updated successfully.',
      color: 'success'
    })

    // Update local profile data
    if (profile.value) {
      profile.value.avatar_url = response.avatar_url
    }

    // Update global avatar state (this updates the navigation bar)
    updateAvatar(response.avatar_url)

    // Clear the input
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (error: any) {
    console.error('Error uploading profile picture:', error)
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Failed to upload profile picture.',
      color: 'error'
    })
  } finally {
    uploadingAvatar.value = false
  }
}
// Get plan limits based on user's tier
const planLimits = computed(() => {
  if (!profile.value) return null

  const tier = profile.value.premium_tier
  if (tier === 'starter') return STRIPE_PLANS.starter.limits
  if (tier === 'pro') return STRIPE_PLANS.pro.limits

  // Free tier limits
  return {
    assetExtractions: 50,
    lottieExtractions: 0,
    designSystemExtractions: 0,
    contrastChecks: 10,
    bulkExport: false,
    prioritySupport: false
  }
})

// Cancel subscription
const cancelSubscription = async () => {
  cancelingSubscription.value = true

  try {
    const response = await $fetch('/api/stripe/cancel-subscription', {
      method: 'POST'
    })

    toast.add({
      title: 'Subscription Canceled',
      description: 'Your subscription will be canceled at the end of the billing period.',
      color: 'success'
    })

    // Close modal and reload profile
    showCancelModal.value = false
    await loadProfile()
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Failed to cancel subscription',
      color: 'error'
    })
  } finally {
    cancelingSubscription.value = false
  }
}

// Check if subscription is cancelled
const subscriptionCancelled = computed(() => {
  return profile.value?.subscription_cancel_at !== null
})

// Format the cancellation date
const accessEndsDate = computed(() => {
  console.log('Calculating access ends date:', profile.value?.subscription_cancel_at)
  if (!profile.value?.subscription_cancel_at) return null
  const date = new Date(profile.value.subscription_cancel_at)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Watch for user to load, then load profile
watch(user, loadProfile, { immediate: true })
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="max-w-4xl mx-auto">
        <h1 class="text-highlighted font-semibold text-3xl mb-8">
          Profile Settings
        </h1>

        <div class="grid gap-6">
          <!-- Profile Picture Section -->
          <UPageCard>
            <template #title>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-image"
                  class="text-xl"
                />
                <span>Profile Picture</span>
              </div>
            </template>

            <div class="flex items-center gap-4">
              <div class="relative">
                <UAvatar
                  :src="profile?.avatar_url"
                  size="xl"
                  class="hover:opacity-80 transition duration-200 cursor-pointer"
                  :class="{ 'opacity-50': uploadingAvatar }"
                  @click="fileInputRef?.click()"
                />
                <div
                  v-if="uploadingAvatar"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-loader-2"
                    class="text-2xl animate-spin text-primary"
                  />
                </div>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                class="hidden"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                :disabled="uploadingAvatar"
                @change="changeProfilePicture"
              >
              <div>
                <h1 class="text-highlighted font-semibold">
                  Update Profile Picture
                </h1>
                <p class="text-muted">
                  Click avatar to upload. Recommended: Square image, at least 400x400px. Max size: 5MB
                </p>
                <p class="text-xs text-muted mt-1">
                  Supported formats: JPEG, PNG, GIF, WebP
                </p>
              </div>
            </div>
          </UPageCard>

          <!-- Personal Information Section -->
          <UPageCard>
            <template #title>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-user"
                  class="text-xl"
                />
                <span>Personal Information</span>
              </div>
            </template>

            <UForm
              v-if="profile"
              :schema="schema"
              :state="formState"
              @submit="onSubmit"
            >
              <div class="grid gap-4">
                <UFormField
                  label="Email"
                  name="email"
                  class="w-full"
                  description="Email cannot be changed"
                >
                  <UInput
                    :model-value="profile.email"
                    disabled
                    icon="i-lucide-mail"
                    class="w-1/2"
                  />
                </UFormField>

                <UFormField
                  label="First Name"
                  name="first_name"
                  required
                  class="w-full"
                >
                  <UInput
                    v-model="formState.first_name"
                    icon="i-lucide-user"
                    placeholder="Enter your first name"
                    class="w-1/2"
                  />
                </UFormField>

                <UFormField
                  label="Last Name"
                  name="last_name"
                  required
                  class="w-full"
                >
                  <UInput
                    v-model="formState.last_name"
                    icon="i-lucide-user"
                    placeholder="Enter your last name"
                    class="w-1/2"
                  />
                </UFormField>

                <div class="flex justify-end pt-4 mr-auto">
                  <UButton
                    type="submit"
                    color="primary"
                    :loading="loading"
                  >
                    Save Changes
                  </UButton>
                </div>
              </div>
            </UForm>
          </UPageCard>

          <!-- Plan & Billing Section -->
          <UPageCard
            :ui="{
              title: 'flex flex-col items-start gap-4'
            }"
          >
            <template #title>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-credit-card"
                  class="text-xl"
                />
                <span class="text-nowrap">Plan & Billing</span>
              </div>
            </template>

            <div
              v-if="profile"
              class="space-y-6"
            >
              <!-- Current Plan -->
              <div class="flex flex-col items-start gap-1">
                <h3 class="font-semibold mb-1">
                  Current Plan
                </h3>
                <div class="flex items-center gap-2">
                  <UBadge
                    :color="profile.premium_tier === 'free' ? 'neutral' : 'primary'"
                    size="lg"
                    class="capitalize"
                    variant="soft"
                  >
                    {{ profile.premium_tier || 'free' }}
                  </UBadge>
                </div>
              </div>

              <!-- Subscription Cancelled Notice -->
              <UAlert
                v-if="subscriptionCancelled && profile.premium_status"
                color="warning"
                variant="soft"
                icon="i-lucide-alert-triangle"
                title="Subscription Cancelled"
                class="mt-2"
              >
                <template #description>
                  <p class="mt-1 text-sm">
                    Your subscription has been cancelled. You'll retain access to all premium features until <strong>{{ accessEndsDate }}</strong>.
                  </p>
                </template>
              </UAlert>

              <!-- Waitlist Discount Code -->
              <UAlert
                v-if="profile.has_waitlist_discount"
                title="Discount Code"
                color="primary"
                variant="soft"
                icon="i-heroicons-gift"
                class="mt-2"
              >
                <template #description>
                  <p class="mt-1 text-sm">
                    Use code <span class="font-mono font-semibold bg-primary-100 border border-primary-200 dark:bg-primary-900 px-2.5 mx-1 py-1 rounded">WAITLIST20</span> at checkout to get 20% off forever when upgrading.
                  </p>
                </template>
              </UAlert>

              <!-- Usage Statistics -->
              <div class="border-t border-muted pt-6">
                <h4 class="font-semibold mb-4">
                  Usage This Month
                </h4>
                <UsageStats
                  :profile="profile"
                  :plan-limits="planLimits"
                />
              </div>

              <div
                v-if="profile"
                class="flex items-center gap-2 w-full"
              >
                <UModal
                  title="Cancel Subscription"
                  :ui="{ footer: 'justify-end' }"
                >
                  <UButton
                    v-if="profile.premium_tier !== 'free' && profile.premium_status && !subscriptionCancelled"
                    color="neutral"
                    variant="subtle"
                    label="Cancel Subscription"
                    icon="i-lucide-x-circle"
                    class="w-full py-2 flex justify-center"
                  />

                  <template #body>
                    <p class="text-muted">
                      Are you sure you want to cancel your subscription?
                    </p>

                    <UAlert
                      color="primary"
                      variant="soft"
                      icon="i-lucide-info"
                      title="Important"
                      class="mt-4"
                      description="You will retain access to all premium features until the end of your current billing period. After that, your account will be downgraded to the free plan."
                    />
                  </template>

                  <template #footer>
                    <UButton
                      color="neutral"
                      variant="outline"
                      :disabled="cancelingSubscription"
                      label="Go Back"
                      @click="showCancelModal = false"
                    />

                    <UButton
                      color="neutral"
                      variant="solid"
                      label="Cancel Subscription"
                      :loading="cancelingSubscription"
                      @click="cancelSubscription"
                    />
                  </template>
                </UModal>

                <UButton
                  to="/compare-plans"
                  color="primary"
                  class="w-full py-2 flex justify-center"
                  variant="subtle"
                  :disabled="profile.premium_tier === 'pro'"
                  icon="i-lucide-sparkles"
                  :label="profile.premium_tier === 'pro' ? 'Max Plan' : 'Upgrade Plan'"
                />
              </div>
            </div>
          </UPageCard>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>
