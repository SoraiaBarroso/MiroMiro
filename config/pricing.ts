// config/pricing.ts

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    tagline: 'Launch Price',
    description: 'Best for: Freelancers working on 5-10 projects/month',
    price: {
      monthly: 9,
      originalPrice: 15,
      currency: 'USD'
    },
    features: [
      'Everything in Free Plan, plus:',
      '500 asset extractions/month',
      'Bulk Export',
      '50 Lottie Animation Extractions/month',
      '50 AI Design System Generations/month',
      '50 Contrast Checks'
    ],
    limits: {
      assetExtractions: 500,
      lottieExtractions: 50,
      aiGenerations: 50,
      contrastChecks: 50,
      bulkExport: true,
      prioritySupport: false
    },
    badge: 'Launch Price',
    comingSoon: false
  },
  pro: {
    name: 'Pro',
    description: 'Best for: Agencies, product teams, and daily users',
    price: {
      monthly: 24,
      currency: 'USD'
    },
    features: [
      'Everything in Starter Plan, plus:',
      '2,000 asset extractions/month',
      'Unlimited Lottie extractions',
      'Unlimited AI Design System generations',
      'Priority support'
    ],
    limits: {
      assetExtractions: 2000,
      lottieExtractions: -1, // -1 means unlimited
      aiGenerations: -1, // -1 means unlimited
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
