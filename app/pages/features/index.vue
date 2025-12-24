<script setup lang="ts">
import { FEATURES } from '../../../config/seo'

// SEO Meta
const { setSeoMeta, setBreadcrumbs } = useSeo()

setSeoMeta({
  title: 'Features',
  description: 'Explore MiroMiro features: CSS Inspector, Asset Extractor, SVG & Lottie extraction, Color Palette, Contrast Checker, and Design Tokens. Everything you need to inspect and extract from any website.',
  keywords: ['miromiro features', 'css inspector', 'asset extractor', 'design tools', 'chrome extension features']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Features', url: '/features' }
])

// Transform features to the UPageSection format
const features = FEATURES.map(feature => ({
  title: feature.title,
  description: feature.description,
  icon: feature.icon,
}))

// CTA links
const ctaLinks = [
  {
    label: 'Add to Chrome',
    to: 'https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl',
    target: '_blank',
    trailingIcon: 'i-logos:chrome'
  },
  {
    label: 'View Pricing',
    to: '/compare-plans',
    color: 'neutral',
    variant: 'outline'
  }
]
</script>

<template>
  <UPage>
    <UPageSection
      title="MiroMiro Features"
      description="Explore the comprehensive set of tools that make MiroMiro an essential extension for designers and developers."
      :features="features"
    />

    <!-- CTA Section -->
    <UPageSection
      title="Ready to speed up your workflow?"
      description="Join 500+ designers and developers who save hours every week with MiroMiro."
      :links="ctaLinks"
      class="bg-zinc-50"
    />
  </UPage>
</template>
