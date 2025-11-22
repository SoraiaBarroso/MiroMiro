// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-nodemailer', '@nuxtjs/supabase', '@nuxt/image', '@unlok-co/nuxt-stripe', '@vueuse/motion/nuxt'],
  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  ui: {
    colorMode: false
  },

  runtimeConfig: {
    stripe: {
      key: process.env.STRIPE_SECRET_KEY,
      discountCouponId: process.env.STRIPE_DISCOUNT_COUPON_ID
    },
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    cronSecret: process.env.CRON_SECRET,
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY,
        starterPriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_1STjbEAaZdcZr0Eum9VuWWJ6',
        proPriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_1STjdMAaZdcZr0Eu9hu7u4a4'
      }
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  nodemailer: {
    from: '"MiroMiro" <noreply@miromiro.com>',
    host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
    port: Number(process.env.NODEMAILER_PORT) || 465,
    secure: process.env.NODEMAILER_SECURE === 'true',
    auth: {
      user: process.env.NODEMAILER_USER || '',
      pass: process.env.NODEMAILER_PASS || ''
    }
  },
  supabase: {
    types: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SECRET_KEY,
    redirectOptions: {
      login: '/signup', // User will be redirected to this path if not authenticated or after logout.
      callback: '/confirm', // This is the path the user will be redirect to after supabase login redirection.
      exclude: ['/signin', '/', '/compare-plans', '/forgot-password', '/reset-password', '/privacy-policy', '/contact'], // These paths won't be protected and require no authentication.
      cookieRedirect: false
    }
  }
})
