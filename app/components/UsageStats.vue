<script setup lang="ts">
const props = defineProps<{
  profile: any
  planLimits: any
}>()

// Calculate usage percentages
const assetUsagePercent = computed(() => {
  if (!props.profile || !props.planLimits) return 0
  const limit = props.planLimits.assetExtractions
  if (limit === -1) return 0 // unlimited
  return Math.min((props.profile.asset_extractions / limit) * 100, 100)
})

const contrastUsagePercent = computed(() => {
  if (!props.profile || !props.planLimits) return 0
  const limit = props.planLimits.contrastChecks || 5
  if (limit === -1) return 0 // unlimited
  return Math.min((props.profile.contrast_checks / limit) * 100, 100)
})

const lottieUsagePercent = computed(() => {
  if (!props.profile || !props.planLimits) return 0
  const limit = props.planLimits.lottieExtractions
  if (limit === -1 || limit === 0) return 0 // unlimited or not available
  return Math.min(((props.profile.lottie_extractions || 0) / limit) * 100, 100)
})

const aiGenerationsUsagePercent = computed(() => {
  if (!props.profile || !props.planLimits) return 0
  const limit = props.planLimits.aiGenerations
  if (limit === -1 || limit === 0) return 0 // unlimited or not available
  return Math.min(((props.profile.ai_generations || 0) / limit) * 100, 100)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Asset Extractions -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="font-medium">Asset Extractions</span>
        </div>
        <span class="text-sm text-muted">
          {{ profile.asset_extractions || 0 }} /
          {{ planLimits?.assetExtractions === -1 ? 'Unlimited' : planLimits?.assetExtractions || 50 }}
        </span>
      </div>
      <UProgress
        v-model="assetUsagePercent"
        :color="assetUsagePercent >= 80 ? 'error' : 'primary'"
      />
      <p
        v-if="assetUsagePercent >= 80 && planLimits?.assetExtractions !== -1"
        class="text-xs text-error mt-1"
      >
        You're running low on extractions. Consider upgrading!
      </p>
    </div>

    <!-- Contrast Checks -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="font-medium">Contrast Checks</span>
        </div>
        <span class="text-sm text-muted">
          {{ profile.contrast_checks || 0 }} /
          {{ profile.premium_tier === 'free' ? 5 : 'Unlimited' }}
        </span>
      </div>
      <UProgress
        v-model="contrastUsagePercent"
        :color="contrastUsagePercent >= 80 ? 'error' : 'primary'"
      />
      <p
        v-if="contrastUsagePercent >= 80 && profile.premium_tier === 'free'"
        class="text-xs text-error mt-1"
      >
        You've used most of your contrast checks. Upgrade for unlimited!
      </p>
    </div>

    <!-- Lottie Extractions -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="font-medium">Lottie Extractions</span>
        </div>
        <span class="text-sm text-muted">
          {{ profile.lottie_extractions || 0 }} /
          {{ planLimits?.lottieExtractions === -1 ? 'Unlimited' : planLimits?.lottieExtractions === 0 ? 'Not Available' : planLimits?.lottieExtractions || 0 }}
        </span>
      </div>
      <UProgress
        v-if="planLimits?.lottieExtractions !== 0"
        v-model="lottieUsagePercent"
        :color="lottieUsagePercent >= 80 ? 'error' : 'primary'"
      />
      <p
        v-if="lottieUsagePercent >= 80 && planLimits?.lottieExtractions !== -1 && planLimits?.lottieExtractions !== 0"
        class="text-xs text-error mt-1"
      >
        You're running low on Lottie extractions. Consider upgrading!
      </p>
      <p
        v-if="planLimits?.lottieExtractions === 0"
        class="text-xs text-muted mt-1"
      >
        Upgrade to Starter or Pro to unlock Lottie extractions
      </p>
    </div>

    <!-- Design System Extractions -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="font-medium">Design System Extractions</span>
        </div>
        <span class="text-sm text-muted">
          {{ profile.ai_generations || 0 }} /
          {{ planLimits?.designSystemExtractions === -1 ? 'Unlimited' : planLimits?.designSystemExtractions === 0 ? 'Not Available' : planLimits?.designSystemExtractions || 0 }}
        </span>
      </div>
      <UProgress
        v-if="planLimits?.designSystemExtractions !== 0"
        v-model="aiGenerationsUsagePercent"
        :color="aiGenerationsUsagePercent >= 80 ? 'error' : 'primary'"
      />
      <p
        v-if="aiGenerationsUsagePercent >= 80 && planLimits?.designSystemExtractions !== -1 && planLimits?.designSystemExtractions !== 0"
        class="text-xs text-error mt-1"
      >
        You're running low on design system extractions. Consider upgrading!
      </p>
      <p
        v-if="planLimits?.designSystemExtractions === 0"
        class="text-xs text-muted mt-1"
      >
        Upgrade to Starter or Pro to unlock Design System extractions
      </p>
    </div>

    <!-- Plan Features Summary -->
    <PlanFeatures
      :limits="planLimits"
      class="mt-6"
    />
  </div>
</template>
