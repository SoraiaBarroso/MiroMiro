// config/pricing.ts

// Free tier limits - centralized here for easy updates
export const FREE_LIMITS = {
  assetExtractions: 15,
  lottieExtractions: 0,
  designSystemExtractions: 0,
  contrastChecks: 5,
  saveItems: 10,
  bulkExport: false,
  prioritySupport: false
}

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    tagline: 'Less than a coffee',
    description: 'Perfect for freelancers shipping 10+ projects per month.',
    price: {
      month: 7,
      year: 59, // €4.92/month when billed yearly (20% savings)
      originalPrice: 9,
      currency: 'EUR'
    },
    features: [
      '150 instant CSS & asset grabs',
      '10 Pro Lottie animation exports',
      '20 Design System & Token exports',
      'Unlimited accessibility & contrast audits',
      'Personal Library (Save up to 100 items)'
    ],
    limits: {
      assetExtractions: 150,
      lottieExtractions: 10,
      designSystemExtractions: 20,
      contrastChecks: -1,
      saveItems: 100,
      bulkExport: false,
      prioritySupport: false
    },
    badge: 'Recommended',
    comingSoon: false
  },
  pro: {
    name: 'Pro',
    tagline: 'Most Popular',
    description: 'Scale your design-to-code workflow with zero limits.',
    price: {
      month: 19,
      year: 140, // €11.67/month when billed yearly (39% savings)
      originalPrice: 24,
      currency: 'EUR'
    },
    features: [
      'High-volume capacity (2,000 grabs)',
      'Unlimited client design systems',
      'Unrestricted Lottie & Animation exports',
      'Full brand portfolio token exports',
      'Priority VIP support & chat',
      'Infinite Library (Save unlimited items)'
    ],
    limits: {
      assetExtractions: 2000,
      lottieExtractions: -1, // -1 means unlimited
      designSystemExtractions: -1, // -1 means unlimited
      contrastChecks: -1, // -1 means unlimited
      saveItems: -1, // -1 means unlimited
      bulkExport: true,
      prioritySupport: true
    },
    badge: 'Popular',
    featured: true,
    comingSoon: false
  }
} as const

export type PlanTier = keyof typeof STRIPE_PLANS
