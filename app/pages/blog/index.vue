<script setup lang="ts">
import { getBlogPosts } from '../../../config/blog'

const { setSeoMeta, setBreadcrumbs } = useSeo()

setSeoMeta({
  title: 'Blog - Design Tips & Tutorials',
  description: 'Learn how to speed up your design workflow with MiroMiro. Tutorials for Figma, Framer, and web designers on extracting CSS, colors, assets, and more.',
  keywords: ['design tutorials', 'figma tips', 'framer tutorials', 'css extraction', 'web design workflow', 'design tools']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' }
])

const posts = getBlogPosts()

const ctaLinks = [
  {
    label: 'Add to Chrome',
    to: 'https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl',
    target: '_blank',
    icon: 'i-logos:chrome',
    size: 'lg' as const
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <UPageSection
      title="Design Tips & Tutorials"
      description="Learn how to speed up your design workflow. Tutorials for Figma, Framer, and web designers."
    />

    <!-- Blog Posts Grid -->
    <UPageSection>
      <div class="max-w-6xl mx-auto">
        <div v-if="posts && posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="post in posts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="group"
          >
            <UCard 
            :ui="{
              header: '!p-0'
            }"
            class="h-full transition-all duration-300 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 overflow-hidden">
              <!-- Featured Image -->
              <template #header>
                 <NuxtImg
                    v-if="post.image"
                    :src="post.image"
                    :alt="post.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
              </template>

              <!-- Category Badge -->
              <div class="mb-3">
                <span
                  v-if="post.category"
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700"
                >
                  {{ post.category }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                {{ post.title }}
              </h2>

              <!-- Description -->
              <p class="text-muted text-sm line-clamp-3 mb-4">
                {{ post.description }}
              </p>

              <!-- Meta -->
              <div class="flex items-center gap-3 text-xs text-muted">
                <span v-if="post.date">
                  {{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                </span>
                <span v-if="post.readingTime">· {{ post.readingTime }} min read</span>
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 class="text-2xl font-bold mb-2">Coming Soon</h2>
          <p class="text-muted">We're working on some great content for you. Check back soon!</p>
        </div>
      </div>
    </UPageSection>

    <!-- CTA Section -->
    <UPageSection
      title="Ready to speed up your workflow?"
      description="Join 500+ designers and developers who save hours every week with MiroMiro."
      :links="ctaLinks"
      class="bg-zinc-50 my-10"
    />
  </div>
</template>
