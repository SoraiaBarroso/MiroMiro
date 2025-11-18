// config/pricing.ts

// Use environment variable to determine which price IDs to use
// In production, set STRIPE_STARTER_PRICE_ID and STRIPE_PRO_PRICE_ID with live price IDs
const getEnv = (key: string, fallback: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback
  }
  return fallback
}

export const STRIPE_PLANS = {
  starter: {
    name: 'Starter',
    tagline: 'Launch Price',
    description: 'Best for: Freelancers working on 5-10 projects/month',
    priceId: getEnv('STRIPE_STARTER_PRICE_ID', 'price_1STjbEAaZdcZr0Eum9VuWWJ6'), // Test: price_1STjbEAaZdcZr0Eum9VuWWJ6
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
    priceId: getEnv('STRIPE_PRO_PRICE_ID', 'price_1STjdMAaZdcZr0Eu9hu7u4a4'), // Test: price_1STjdMAaZdcZr0Eu9hu7u4a4
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

// Helper function to get plan by tier
export function getPlan(tier: PlanTier) {
  return STRIPE_PLANS[tier]
}

// Helper function to format price
export function formatPrice(plan: typeof STRIPE_PLANS[PlanTier]) {
  return `$${plan.price.monthly}`
}

// Helper function to check if user has feature access
export function hasFeatureAccess(
  userPlan: PlanTier | 'free',
  requiredPlan: PlanTier
): boolean {
  const planHierarchy = ['free', 'starter', 'pro']
  const userLevel = planHierarchy.indexOf(userPlan)
  const requiredLevel = planHierarchy.indexOf(requiredPlan)
  return userLevel >= requiredLevel
}
