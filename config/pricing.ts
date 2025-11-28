// config/pricing.ts

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    tagline: 'Launch Price',
    description: 'Best for: Freelancers working on 5-10 projects/month',
    price: {
      month: 9,
      year: 86, // €7.17/month when billed yearly (20% savings)
      originalPrice: 15,
      currency: 'EUR'
    },
    features: [
      'Everything in Free Plan, plus:',
      '500 asset extractions/month',
      'Bulk Export',
      '50 Lottie Animation Extractions/month',
      '50 Design System Extractions/month',
      '50 Contrast Checks'
    ],
    limits: {
      assetExtractions: 500,
      lottieExtractions: 50,
      designSystemExtractions: 50,
      contrastChecks: 50,
      bulkExport: true,
      prioritySupport: false
    },
    badge: 'Launch Price',
    comingSoon: false
  },
  pro: {
    name: 'Pro',
    tagline: 'Launch Price',
    description: 'Best for: Agencies, product teams, and daily users',
    price: {
      month: 19,
      year: 182, // €15.17/month when billed yearly (20% savings)
      originalPrice: 24,
      currency: 'EUR'
    },
    features: [
      'Everything in Starter Plan, plus:',
      '2,000 asset extractions/month',
      'Unlimited Lottie extractions',
      'Unlimited Design System extractions',
      'Priority support'
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
