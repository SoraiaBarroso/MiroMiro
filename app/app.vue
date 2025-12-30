<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { Analytics } from '@vercel/analytics/nuxt'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const config = useRuntimeConfig()
const baseUrl = config.public.siteUrl

// Google Analytics tracking
const { gtag } = useGtag()

function trackSignUpClick() {
  gtag('event', 'signup_button_click', {
    event_category: 'conversion',
    event_label: 'header_signup',
    value: 1
  })
}

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
  title: 'MiroMiro – UI Inspector & Asset Extractor',

  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: description },
    { name: 'keywords', content: 'ui inspector, asset extractor, css viewer, chrome extension, web design tool, extract images, copy css, tailwind generator' },
    { name: 'robots', content: 'index, follow' }
  ],

  link: [
    { rel: 'icon', href: '/logo.png' },
    { rel: 'canonical', href: baseUrl },
    // Resource hints for performance
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'dns-prefetch', href: 'https://datafa.st' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    { rel: 'dns-prefetch', href: 'https://chromewebstore.google.com' }
  ],

  script: [
    {
      defer: true,
      'data-website-id': 'dfid_1dUh3lMSsn8sGRnb3Rnac',
      'data-domain': 'miromiro.app',
      'data-allow-localhost': 'true',
      src: 'https://datafa.st/js/script.js'
    },

    // Organization schema
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'MiroMiro',
        'url': baseUrl,
        'logo': `${baseUrl}/logo.png`,
        'sameAs': [
          'https://x.com/SoraiaDev',
          'https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl'
        ],
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer support',
          'email': 'sorilc@hotmail.com',
          'url': `${baseUrl}/contact`
        }
      })
    },

    // SoftwareApplication schema
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'MiroMiro',
        'applicationCategory': 'BrowserExtension',
        'applicationSubCategory': 'DesignTool',
        'operatingSystem': 'Chrome',
        'browserRequirements': 'Requires Chrome browser',
        'downloadUrl': 'https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl',
        'installUrl': 'https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl',
        'offers': {
          '@type': 'AggregateOffer',
          'lowPrice': '0',
          'highPrice': '19',
          'priceCurrency': 'EUR',
          'offerCount': '3',
          'offers': [
            {
              '@type': 'Offer',
              'name': 'Free',
              'price': '0',
              'priceCurrency': 'EUR'
            },
            {
              '@type': 'Offer',
              'name': 'Starter',
              'price': '4',
              'priceCurrency': 'EUR',
              'priceValidUntil': '2025-12-31'
            },
            {
              '@type': 'Offer',
              'name': 'Pro',
              'price': '19',
              'priceCurrency': 'EUR',
              'priceValidUntil': '2025-12-31'
            }
          ]
        },
        'description': description,
        'featureList': [
          'One-click CSS extraction for any element',
          'Instant color, font, and spacing detection',
          'Bulk media downloads: images, videos, SVGs, Lottie',
          'Automatic semantic CSS pattern extraction',
          'Design token discovery from CSS files',
          'No DevTools needed - hover and copy',
          'Complete asset library export',
          'WCAG contrast checking',
          'Export to CSS and Tailwind'
        ],
        'screenshot': `${baseUrl}/og-image.png`,
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '5.0',
          'ratingCount': '50',
          'reviewCount': '12'
        },
        'author': {
          '@type': 'Person',
          'name': 'Soraia',
          'url': 'https://x.com/SoraiaDev'
        }
      })
    },

    // Website schema with sitelinks search
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'MiroMiro',
        'alternateName': ['MiroMiro Chrome Extension', 'MiroMiro CSS Inspector'],
        'url': baseUrl,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${baseUrl}/features?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ],

  htmlAttrs: { lang: 'en' }
})

const title = `MiroMiro - Copy Any Website's Design & Assets in One Click`;
const description = `Inspect CSS, extract images, SVGs, and Lottie animations from any website. No DevTools needed.`;

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

// Detect current route
const route = useRoute()

// Hide navigation menu on profile page
const showNavigation = computed(() => {
  return route.path !== '/profile'
})

// Navigation items - contextual based on current page
const items = computed<NavigationMenuItem[]>(() => {
  // On homepage, use anchor links
  if (route.path === '/') {
    return [
      { label: 'Features', to: '#features' },
      { label: 'Testimonials', to: '#testimonials' },
      { label: 'Pricing', to: '#pricing' }
    ]
  }
  // On other pages, use page links for better internal linking
  return [
    { label: 'Features', to: '/features' },
    { label: 'Use Cases', to: '/use-cases' },
    { label: 'Pricing', to: '/compare-plans' },
    { label: 'FAQ', to: '/faq' }
  ]
})

const footerColumns = [
  {
    label: 'Product',
    children: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/compare-plans' },
      { label: 'FAQ', to: '/faq' }
    ]
  },
  {
    label: 'Company',
    children: [
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' }
    ]
  },
  {
    label: 'Connect',
    children: [
      { label: 'Twitter / X', to: 'https://x.com/SoraiaDev', target: '_blank', icon: 'i-simple-icons-x' },
      { label: 'sorilc@hotmail.com', to: 'mailto:sorilc@hotmail.com', icon: 'i-heroicons-envelope' }
    ]
  }
]
</script>

<template>
  <UApp>
    <Analytics />

    <UHeader
      to="/"
      mode="drawer"
    >
      <template #title>
        <NuxtImg
          src="/logo.png"
          width="32"
          height="32"
          alt="MiroMiro Logo"
          loading="eager"
          preload
        />
        <span class="font-semibold text-lg">MiroMiro</span>
      </template>

      <UNavigationMenu v-if="showNavigation" :items="items"/>

      <template #right>
        <!-- <UColorModeButton /> -->
        <UButton
          v-if="!user"
          to="/signin"
          variant="outline"
          color="neutral"
        >
          Sign In
        </UButton>
        <UButton
          v-if="!user"
          to="/signup"
          color="primary"
          @click="trackSignUpClick"
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
          v-if="showNavigation"
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
      <template #top>
        <UContainer>
          <UFooterColumns :columns="footerColumns" />
        </UContainer>
      </template>

      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} MiroMiro. All rights reserved.
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
