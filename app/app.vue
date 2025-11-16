<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { Analytics } from '@vercel/analytics/nuxt'
import type { DropdownMenuItem } from '@nuxt/ui'

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
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'MiroMiro – Chrome Extension for Designers & Developers';
const description = 'Inspect elements, extract assets, and generate design systems effortlessly. MiroMiro lets you analyze any website\'s visuals, reveal brand identity insights, and export everything in production-ready formats.';

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

const items = computed<NavigationMenuItem[]>(() => [ {
  label: 'Features',
  to: '#features',
},
{
  label: 'Waitlist',
  to: '#waitlist',
},
{
  label: 'Pricing',
  to: '#pricing',
}])
</script>

<template>
  <UApp>
    <Analytics />

    <UHeader title="MiroMiro" to="/" mode="drawer">
      <UNavigationMenu :items="items" />

      <template #right>
        <!-- <UColorModeButton /> -->
         <UButton
          to="/signin"
          variant="outline"
          color="neutral"
          v-if="!user"
          disabled
        >
          Sign In
        </UButton>
          <UButton
          to="/signup"
          color="neutral"
          v-if="!user"
          disabled
        >
          Sign Up
        </UButton>
        
        <UDropdownMenu :items="itemsDropdown" v-if="user" class="cursor-pointer">
          <UAvatar :src="imgUser" class="ml-2"/>
        </UDropdownMenu>
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-typcn:heart-outline" :ui="{icon: 'text-purple-400'}" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built by Soraia with ❤️ • © {{ new Date().getFullYear() }}
        </p>
      </template>

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
