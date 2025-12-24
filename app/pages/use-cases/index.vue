<script setup lang="ts">
import { USE_CASES, FEATURES } from '../../../config/seo'

// SEO Meta
const { setSeoMeta, setBreadcrumbs } = useSeo()

setSeoMeta({
  title: 'Use Cases',
  description: 'Discover how designers, developers, agencies, and no-code builders use MiroMiro to speed up their workflow. Real-world applications for every creative professional.',
  keywords: ['miromiro use cases', 'design workflow', 'developer tools', 'agency tools', 'no-code design']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Use Cases', url: '/use-cases' }
])
</script>

<template>
  <UPage>
    <UPageSection
      title="Who Uses MiroMiro?"
      description="Whether you're a designer, developer, agency, or no-code builder, MiroMiro helps you work faster and smarter."
    >
      <UPageGrid >
        <UPageCard
          v-for="useCase in USE_CASES"
          :key="useCase.slug"
          :title="useCase.audience"
          :description="useCase.description"
          :icon="useCase.icon"
          :to="`/use-cases/${useCase.slug}`"
          spotlight
          spotlight-color="primary"
        >
          <div class="space-y-3">
            <div
              v-for="benefit in useCase.benefits"
              :key="benefit"
              
              class="flex items-center gap-2"
            >
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary flex-shrink-0" />
              <span class="text-sm">{{ benefit }}</span>
            </div>
          </div>
        </UPageCard>
      </UPageGrid>
    </UPageSection>
  </UPage>
</template>
