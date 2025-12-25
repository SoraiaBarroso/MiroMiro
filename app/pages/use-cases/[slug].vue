<script setup lang="ts">
import { USE_CASES, FEATURES } from '../../../config/seo'

const route = useRoute()
const slug = route.params.slug as string

// Find the use case by slug
const useCase = computed(() => USE_CASES.find(uc => uc.slug === slug))

// 404 if use case not found
if (!useCase.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Use case not found'
  })
}

// SEO Meta
const { setSeoMeta, setBreadcrumbs } = useSeo()

setSeoMeta({
  title: useCase.value.title,
  description: useCase.value.description,
  keywords: useCase.value.keywords
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Use Cases', url: '/use-cases' },
  { name: useCase.value.audience, url: `/use-cases/${slug}` }
])

// Get other use cases (exclude current)
const otherUseCases = computed(() =>
  USE_CASES.filter(uc => uc.slug !== slug)
)

// Recommended features for this audience
const recommendedFeatures = computed(() => {
  // Map use cases to relevant features
  const featureMap: Record<string, string[]> = {
    designers: ['css-inspector', 'color-palette', 'asset-extractor', 'svg-extractor'],
    developers: ['css-inspector', 'design-tokens', 'contrast-checker', 'lottie-extractor'],
    agencies: ['asset-extractor', 'design-tokens', 'color-palette', 'css-inspector'],
    'no-code': ['css-inspector', 'color-palette', 'asset-extractor', 'svg-extractor']
  }
  const slugs = featureMap[slug] || featureMap.designers
  return FEATURES.filter(f => slugs.includes(f.slug))
})
</script>

<template>
  <UPage v-if="useCase">
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-purple-50 to-white py-16 md:py-24">
      <UContainer>
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center justify-center p-4 rounded-2xl bg-purple-100 text-purple-600 mb-6">
            <UIcon :name="useCase.icon" class="w-12 h-12" />
          </div>

          <p class="text-purple-600 font-semibold mb-2">MiroMiro for</p>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {{ useCase.audience }}
          </h2>

          <p class="text-xl text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            {{ useCase.description }}
          </p>

          <div class="flex flex-wrap justify-center gap-4">
            <UButton
              to="https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl"
              target="_blank"
              size="lg"
              trailing-icon="i-logos:chrome"
            >
              Get Started Free
            </UButton>
            <UButton
              to="/compare-plans"
              size="lg"
              color="neutral"
              variant="outline"
            >
              View Pricing
            </UButton>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Benefits Section -->
    <UPageSection>
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          How {{ useCase.audience }} Use MiroMiro
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="(benefit, index) in useCase.benefits"
            :key="index"
            class="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
              {{ index + 1 }}
            </div>
            <div>
              <p class="text-lg font-medium">{{ benefit }}</p>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- Recommended Features -->
    <UPageSection class="bg-zinc-50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">
          Recommended Features for {{ useCase.audience }}
        </h2>
        <p class="text-muted text-center mb-12 max-w-2xl mx-auto">
          These MiroMiro tools are especially useful for your workflow.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="feature in recommendedFeatures"
            :key="feature.slug"
            :to="`/features/${feature.slug}`"
            class="group"
          >
            <UCard class="h-full transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1">
              <div class="text-center">
                <div class="inline-flex p-3 rounded-xl bg-purple-100 text-purple-600 mb-4">
                  <UIcon :name="feature.icon" class="w-6 h-6" />
                </div>
                <h3 class="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                  {{ feature.title }}
                </h3>
                <p class="text-sm text-muted line-clamp-2">
                  {{ feature.description }}
                </p>
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <div class="text-center mt-8">
          <UButton to="/features" variant="outline" color="neutral">
            Explore All Features
          </UButton>
        </div>
      </div>
    </UPageSection>

    <!-- Other Use Cases -->
    <UPageSection>
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-4">Explore Other Use Cases</h2>
        <p class="text-muted text-center mb-12">
          See how other professionals use MiroMiro
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="other in otherUseCases"
            :key="other.slug"
            :to="`/use-cases/${other.slug}`"
            class="group"
          >
            <UCard class="h-full transition-all duration-300 hover:shadow-lg hover:border-purple-300">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <UIcon :name="other.icon" class="w-5 h-5" />
                </div>
                <h3 class="font-semibold group-hover:text-purple-600 transition-colors">
                  {{ other.audience }}
                </h3>
              </div>
              <p class="text-sm text-muted">{{ other.description }}</p>
            </UCard>
          </NuxtLink>
        </div>
      </div>
    </UPageSection>

    <!-- CTA Section -->
    <UPageSection class="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-4">
          Ready to supercharge your workflow?
        </h2>
        <p class="text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of {{ useCase.audience.toLowerCase() }} who save hours every week with MiroMiro.
        </p>
        <UButton
          to="https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl"
          target="_blank"
          size="lg"
          color="white"
          trailing-icon="i-logos:chrome"
        >
          Add to Chrome — Free
        </UButton>
      </div>
    </UPageSection>
  </UPage>
</template>
