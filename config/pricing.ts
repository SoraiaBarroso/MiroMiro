// config/pricing.ts

// Free tier limits - centralized here for easy updates
export const FREE_LIMITS = {
  assetExtractions: 15,
  lottieExtractions: 0,
  designSystemExtractions: 0,
  contrastChecks: 3,
  bulkExport: false,
  prioritySupport: false
}

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    tagline: 'Less than a coffee',
    description: 'Ship side projects without design bottlenecks',
    price: {
      month: 4,
      year: 38, // €3.17/month when billed yearly (20% savings)
      originalPrice: 9,
      currency: 'EUR'
    },
    features: [
      'Handle 10+ projects/month (500 extractions)',
      'Grab entire asset folders in seconds',
      'Ship with pro animations (50 Lottie exports)',
      'Match any brand instantly (50 token exports)',
      'Never guess on accessibility (50 contrast checks)'
    ],
    limits: {
      assetExtractions: 500,
      lottieExtractions: 50,
      designSystemExtractions: 50,
      contrastChecks: 50,
      bulkExport: true,
      prioritySupport: false
    },
    badge: 'Recommended',
    comingSoon: false
  },
  pro: {
    name: 'Pro',
    tagline: 'Most Popular',
    description: 'Run an agency without tool limitations',
    price: {
      month: 19,
      year: 140, // €11.67/month when billed yearly (39% savings)
      originalPrice: 24,
      currency: 'EUR'
    },
    features: [
      'Never hit limits mid-project (2,000 extractions)',
      'Handle unlimited client design systems',
      'Grab every animation, no restrictions',
      'Export tokens for entire brand portfolios',
      'Get unstuck fast with priority support'
    ],
    limits: {
      assetExtractions: 2000,
      lottieExtractions: -1, // -1 means unlimited
      designSystemExtractions: -1, // -1 means unlimited
      contrastChecks: -1, // -1 means unlimited
      bulkExport: true,
      prioritySupport: true
    },
    badge: 'Popular',
    featured: true,
    comingSoon: false
  }
} as const

export type PlanTier = keyof typeof STRIPE_PLANS
