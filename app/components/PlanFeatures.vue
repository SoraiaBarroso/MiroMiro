<script setup lang="ts">
interface PlanLimits {
  assetExtractions: number
  lottieExtractions: number
  aiGenerations: number
  bulkExport: boolean
  prioritySupport: boolean
}

interface Props {
  limits: PlanLimits | null
}

const props = defineProps<Props>()

const features = computed(() => {
  if (!props.limits) return []

  return [
    {
      icon: 'i-lucide-download',
      label: `${props.limits.assetExtractions === -1 ? 'Unlimited' : props.limits.assetExtractions} asset extractions/month`,
      available: true,
      highlight: true
    },
    {
      icon: 'i-lucide-package',
      label: 'Bulk Export',
      available: props.limits.bulkExport
    },
    {
      icon: 'i-lucide-play-circle',
      label: `${props.limits.lottieExtractions === -1 ? 'Unlimited' : props.limits.lottieExtractions} Lottie extractions/month`,
      available: props.limits.lottieExtractions > 0 || props.limits.lottieExtractions === -1
    },
    {
      icon: 'i-lucide-sparkles',
      label: `${props.limits.aiGenerations === -1 ? 'Unlimited' : props.limits.aiGenerations} AI design system generations/month`,
      available: props.limits.aiGenerations > 0 || props.limits.aiGenerations === -1
    },
    {
      icon: 'i-lucide-headphones',
      label: 'Priority support',
      available: props.limits.prioritySupport
    }
  ]
})
</script>

<template>
  <div class="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
    <h5 class="font-semibold mb-3 flex items-center gap-2">
      <UIcon name="i-lucide-sparkles" />
      Your Plan Includes
    </h5>
    <ul class="space-y-2 text-sm">
      <li
        v-for="(feature, index) in features"
        :key="index"
        class="flex items-start gap-2"
      >
        <UIcon
          :name="feature.available ? 'i-lucide-check' : 'i-lucide-x'"
          :class="feature.available ? 'text-primary' : 'text-muted'"
          class="mt-0.5 flex-shrink-0"
        />
        <span :class="!feature.available ? 'text-muted' : ''">
          <strong v-if="feature.highlight && feature.available">{{ feature.label }}</strong>
          <template v-else>{{ feature.label }}</template>
        </span>
      </li>
    </ul>
  </div>
</template>
