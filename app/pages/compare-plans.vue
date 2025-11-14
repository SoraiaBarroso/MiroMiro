<script setup lang="ts">
const tiers = ref([
  {
    id: 'free',
    title: 'Free Plan',
    price: '$0',
    description: 'Perfect for trying MiroMiro and occasional use',
    billingCycle: '/month',
    button: {
      label: 'Coming Soon...',
      variant: 'subtle'
    }
  },
  {
    id: 'starter',
    title: 'Starter',
    price: '$9',
    description: 'Best for: Freelancers working on 5-10 projects/month',
    billingCycle: '/month',
    scale: true,
    badge: 'Launch Price',
    button: {
      label: 'Coming Soon...'
    }
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '$24',
    description: 'Best for: Agencies, product teams, and daily users',
    billingCycle: '/month',
    button: {
      label: 'Coming Soon...',
      color: 'neutral'
    }
  }
])
const sections = ref([
  {
    title: 'Core Features',
    features: [
      {
        title: 'Page Overview',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Inspect Mode',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Individual Downloads',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Color Palette Viewer',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Smart Inspector (Contrast Checker)',
        tiers: {
          free: '5/month',
          starter: 'Unlimited',
          pro: 'Unlimited'
        }
      }
    ]
  },
  {
    title: 'Asset Extraction',
    features: [
      {
        title: 'Total Asset Extractions (Images, Videos, SVGs)',
        tiers: {
          free: '50/month',
          starter: '500/month',
          pro: '2,000/month'
        }
      },
      {
        title: 'Image Extractions',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Video Extractions',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'SVG Extractions',
        tiers: {
          free: true,
          starter: true,
          pro: true
        }
      },
      {
        title: 'Lottie Animation Extractions',
        tiers: {
          free: false,
          starter: '20/month',
          pro: 'Unlimited'
        }
      },
      {
        title: 'Bulk Export',
        tiers: {
          free: false,
          starter: true,
          pro: true
        }
      }
    ]
  },
  {
    title: 'AI Features',
    features: [
      {
        title: 'AI Design System Generations',
        tiers: {
          free: false,
          starter: '50/month',
          pro: 'Unlimited'
        }
      }
    ]
  },
  {
    title: 'Support',
    features: [
      {
        title: 'Priority Support',
        tiers: {
          free: false,
          starter: false,
          pro: true
        }
      }
    ]
  }
])
</script>

<template>
    <UPage>
        <UPageSection>
          <!-- <h1 class="text-highlighted text-4xl font-semibold">Compare plans</h1> -->
          <UPricingTable :tiers="tiers" :sections="sections" />
        </UPageSection>
    </UPage>
</template>


 