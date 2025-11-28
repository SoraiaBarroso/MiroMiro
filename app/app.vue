<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { Analytics } from '@vercel/analytics/nuxt'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const config = useRuntimeConfig()
const baseUrl = config.public.siteUrl

// Use shared avatar state
const { avatarUrl, updateAvatar } = useUserAvatar()

// Fetch avatar when user logs in or changes
const fetchAvatar = async () => {
  if (!user.value?.sub) {
    updateAvatar('') // Clear avatar when logged out
    return
  }

  const { data } = await supabase
    .from('user_profiles')
    .select('avatar_url')
    .eq('id', user.value.sub)
    .single()

  if (data?.avatar_url) {
    updateAvatar(data.avatar_url)
  }
}

// Watch user changes to update avatar
watch(user, fetchAvatar, { immediate: true })

const imgUser = computed(() => {
  return avatarUrl.value
})

const itemsDropdown = ref<DropdownMenuItem[]>([
  {
    label: 'Profile',
    icon: 'i-lucide-user',
    onSelect: () => {
      // Navigate to profile page
      navigateTo('/profile')
    }
  },
  {
    label: 'Sign Out',
    icon: 'i-lucide-cog',
    onSelect: async () => {
      const supabase = useSupabaseClient()
      await supabase.auth.signOut()
      toast.add({
        title: 'Signed Out',
        description: 'You have been signed out successfully.',
        color: 'success'
      })
      navigateTo('/')
    }
  }
])

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/logo.png' }
  ],
  script: [
    {
      defer: true,
      'data-website-id': 'dfid_1dUh3lMSsn8sGRnb3Rnac',
      'data-domain': 'miromiro.app',
      'data-allow-localhost': 'true',
      src: 'https://datafa.st/js/script.js'
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'MiroMiro',
        'applicationCategory': 'BrowserApplication',
        'applicationSubCategory': 'DesignTool',
        'operatingSystem': 'Chrome',
        'offers': {
          '@type': 'AggregateOffer',
          'lowPrice': '0',
          'highPrice': '9',
          'priceCurrency': 'EUR',
          'offerCount': '3'
        },
        'description': 'Chrome extension for designers, developers, and low-code users to copy CSS, colors, fonts, spacing, and download all media files (images, videos, SVGs, Lottie) from any website in one click. Extracts semantic CSS patterns from design files automatically.',
        'featureList': [
          'One-click CSS extraction for any element',
          'Instant color, font, and spacing detection',
          'Bulk media downloads: images, videos, SVGs, Lottie',
          'Automatic semantic CSS pattern extraction',
          'Design token discovery from CSS files',
          'No DevTools needed - hover and copy',
          'Complete asset library export',
          'Design inspiration and competitor analysis'
        ],
        'screenshot': `${baseUrl}/og-image.png`,
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '5.0',
          'reviewCount': '1'
        },
        'author': {
          '@type': 'Person',
          'name': 'Soraia',
          'url': 'https://x.com/SoraiaDev'
        }
      })
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = `MiroMiro - Copy Any Website's Design & Assets in One Click`;
const description = `Chrome Extension that grabs CSS, colors, fonts, spacing, and all media files (SVGs, Lottie, images) instantly. No more digging through DevTools. For designers, developers, and low-code users.`;

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: `${baseUrl}/og-image.png`,
  ogImageWidth: '1919',
  ogImageHeight: '957',
  ogImageType: 'image/png',
  ogUrl: baseUrl,
  ogType: 'website',
  ogSiteName: 'MiroMiro',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `${baseUrl}/og-image.png`,
  twitterSite: '@SoraiaDev',
  twitterCreator: '@SoraiaDev'
})

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Features',
  to: '#features'
},
{
  label: 'Waitlist',
  to: '#waitlist'
},
{
  label: 'Pricing',
  to: '#pricing'
}])

const itemsFooter: NavigationMenuItem[] = [{
  label: 'Privacy Policy',
  to: '/privacy-policy',
}, 
{
  label: 'Terms of Service',
  to: '/terms-of-service',
},
{
  label: 'Contact',
  to: '/contact'
}]
</script>

<template>
  <UApp>
    <Analytics />

    <UHeader
      to="/"
      mode="drawer"
    >
      <template #title>
        <NuxtImg src="/logo.png" class="w-8 h-8" alt="MiroMiro Logo" />
        <h1>MiroMiro</h1>
      </template>
      
      <UNavigationMenu :items="items"/>

      <template #right>
        <!-- <UColorModeButton /> -->
        <UButton
          v-if="!user"
          to="/signin"
          variant="outline"
          color="neutral"
          disabled
        >
          Sign In
        </UButton>
        <UButton
          v-if="!user"
          to="/signup"
          color="neutral"
          disabled
        >
          Sign Up
        </UButton>

        <UDropdownMenu
          v-if="user"
          :items="itemsDropdown"
        >
        
          <UAvatar
            :src="imgUser"
            class=" cursor-pointer"
            alt="User profile"
          />
        </UDropdownMenu>
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator
      icon="i-typcn:heart-outline"
      :ui="{ icon: 'text-purple-400' }"
    />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built by Soraia with ❤️ • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <UNavigationMenu :items="itemsFooter" variant="link" />

      <template #right>
        <UButton
          to="https://x.com/SoraiaDev"
          target="_blank"
          icon="i-simple-icons-x"
          aria-label="Twitter"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
