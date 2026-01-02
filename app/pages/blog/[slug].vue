<script setup lang="ts">
import { getBlogPost, getRelatedPosts } from '../../../config/blog'

const route = useRoute()
const slug = route.params.slug as string
const { setSeoMeta, setBreadcrumbs, setArticleSchema } = useSeo()

const post = getBlogPost(slug)

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}

// Set SEO meta
setSeoMeta({
  title: post.title,
  description: post.description,
  keywords: post.tags,
  image: post.image,
  type: 'article',
  publishedTime: post.date,
  author: post.author
})

// Set breadcrumbs
setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: post.title, url: `/blog/${slug}` }
])

// Set article structured data
setArticleSchema({
  headline: post.title,
  description: post.description,
  image: post.image,
  datePublished: post.date,
  author: post.author
})

// Get related posts
const relatedPosts = getRelatedPosts(slug, 3)

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
  <div v-if="post">
    <!-- Hero Section -->
    <div class="bg-gradient-to-b from-purple-50 to-white py-12 md:py-20">
      <UContainer>
        <div class="max-w-4xl mx-auto">
          <!-- Back Link -->
          <div class="mb-4">
            <NuxtLink
              to="/blog"
              class="inline-flex items-center gap-2 text-purple-800 hover:text-purple-700 font-medium text-sm"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
              Back to Blog
            </NuxtLink>
          </div>

          <!-- Category Badge -->
          <span
            v-if="post.category"
            class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 mb-4"
          >
            {{ post.category }}
          </span>

          <!-- Title -->
          <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {{ post.title }}
          </h1>

          <!-- Description -->
          <p class="text-xl text-muted leading-relaxed mb-6">
            {{ post.description }}
          </p>

          <!-- Meta -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
              <span>{{ post.author }}</span>
            </div>
            <div v-if="post.date" class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
              <span>{{ new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
            </div>
            <div v-if="post.readingTime" class="flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
              <span>{{ post.readingTime }} min read</span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Featured Image -->
    <UContainer v-if="post.image">
      <div class="max-w-4xl mx-auto -mt-8 mb-12">
        <div class="aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-100 to-purple-50">
          <NuxtImg
            :src="post.image"
            :alt="post.title"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </UContainer>

    <!-- Article Content -->
    <UContainer>
      <article class="max-w-4xl mx-auto">
        <div
          class="prose prose-lg space-y-4 prose-purple max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-pre:bg-zinc-900 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          v-html="post.content"
        />

        <!-- Tags -->
        <div v-if="post.tags && post.tags.length" class="mt-12 pt-8 border-t border-muted">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1 text-sm rounded-full bg-zinc-100 text-zinc-700"
            >
              #{{ tag }}
            </span>
          </div>
        </div>     
      </article>
    </UContainer>

    <!-- CTA Section -->
    <UPageSection
      title="Ready to try MiroMiro?"
      description="Start extracting CSS, colors, and assets from any website today."
      :links="ctaLinks"
      class="bg-zinc-50 my-10"
    />
  </div>
</template>

<style>
/* Video embeds in blog posts */
.prose iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.prose .video-embed {
  margin: 2rem 0;
}
</style>
