<script setup lang="ts">
import { FEATURES } from '../config/seo'

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message?: string
  }
}>()

// SEO - noindex error pages
useHead({
  title: props.error.statusCode === 404 ? 'Page Not Found | MiroMiro' : 'Error | MiroMiro',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const is404 = computed(() => props.error.statusCode === 404)

// Popular features for suggestions
const popularFeatures = FEATURES.slice(0, 3)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b border-zinc-200 bg-white">
      <UContainer class="py-4">
        <NuxtLink to="/" class="flex items-center gap-2">
          <NuxtImg
            src="/logo.png"
            width="32"
            height="32"
            alt="MiroMiro Logo"
          />
          <span class="font-bold text-xl">MiroMiro</span>
        </NuxtLink>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center py-16">
      <UContainer>
        <div class="max-w-2xl mx-auto text-center">
          <!-- Error Icon -->
          <div class="mb-8">
            <div
              v-if="is404"
              class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-100 text-purple-600"
            >
              <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12" />
            </div>
            <div
              v-else
              class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600"
            >
              <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12" />
            </div>
          </div>

          <!-- Error Message -->
          <h1 class="text-6xl font-bold text-zinc-900 mb-4">
            {{ error.statusCode }}
          </h1>

          <h2 class="text-2xl font-semibold text-zinc-700 mb-4">
            {{ is404 ? 'Page Not Found' : 'Something went wrong' }}
          </h2>

          <p class="text-lg text-muted mb-8">
            {{ is404
              ? "The page you're looking for doesn't exist or has been moved."
              : error.message || 'An unexpected error occurred. Please try again.'
            }}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center gap-4 mb-12">
            <UButton
              size="lg"
              @click="handleError"
            >
              Go to Homepage
            </UButton>
            <UButton
              to="/features"
              size="lg"
              color="neutral"
              variant="outline"
            >
              Explore Features
            </UButton>
          </div>

          <!-- Helpful Links for 404 -->
          <div v-if="is404" class="border-t border-zinc-200 pt-8">
            <p class="text-sm text-muted mb-6">Or try one of these popular pages:</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NuxtLink
                v-for="feature in popularFeatures"
                :key="feature.slug"
                :to="`/features/${feature.slug}`"
                class="group p-4 rounded-xl border border-zinc-200 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div class="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                    <UIcon :name="feature.icon" class="w-4 h-4" />
                  </div>
                  <span class="font-medium group-hover:text-purple-600 transition-colors">
                    {{ feature.shortTitle }}
                  </span>
                </div>
              </NuxtLink>
            </div>

            <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <NuxtLink to="/compare-plans" class="text-purple-600 hover:underline">
                View Pricing
              </NuxtLink>
              <NuxtLink to="/faq" class="text-purple-600 hover:underline">
                FAQ
              </NuxtLink>
              <NuxtLink to="/contact" class="text-purple-600 hover:underline">
                Contact Support
              </NuxtLink>
            </div>
          </div>
        </div>
      </UContainer>
    </main>

    <!-- Footer -->
    <footer class="border-t border-zinc-200 py-6">
      <UContainer>
        <p class="text-center text-sm text-muted">
          © {{ new Date().getFullYear() }} MiroMiro. All rights reserved.
        </p>
      </UContainer>
    </footer>
  </div>
</template>
