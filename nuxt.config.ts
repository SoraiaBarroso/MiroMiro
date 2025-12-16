// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-nodemailer', '@nuxtjs/supabase', '@nuxt/image', '@unlok-co/nuxt-stripe', '@vueuse/motion/nuxt', 'nuxt-gtag', '@nuxtjs/robots', '@nuxtjs/sitemap', 'nuxt-testimonial'],
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

  gtag: {
    id: "G-YK82YXF0VX" 
  },
  
  runtimeConfig: {
    stripe: {
      key: process.env.STRIPE_SECRET_KEY,
    },
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    cronSecret: process.env.CRON_SECRET,
    public: {
      siteUrl: process.env.SITE_URL || 'https://miromiro.app',
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY,
        starterPriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_1STjbEAaZdcZr0Eum9VuWWJ6',
        starterYearlyPriceId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || 'price_starter_yearly',
        proPriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_1STjdMAaZdcZr0Eu9hu7u4a4',
        proYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly'
      },
      posthogPublicKey: 'phc_I1oHHIswVhcLg8QLAFQIbmSe6wUSnqluJkNdS8A8qsH',
      posthogHost: 'https://eu.i.posthog.com',
      posthogDefaults: '2025-05-24'
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
      exclude: ['/signin', '/', '/compare-plans', '/forgot-password', '/reset-password', '/privacy-policy', '/contact', '/terms-of-service'], // These paths won't be protected and require no authentication.
      cookieRedirect: false
    }
  },
  robots: {
    // Disallow routes that require authentication or are not useful for SEO
    disallow: [
      '/signup',
      '/signin',
      '/success',
      '/reset-password',
      '/forgot-password',
      '/profile',
      '/confirm' 
    ],
    // Add sitemap reference for search engines
    sitemap: '/sitemap.xml'
  },
  site: {
    url: process.env.SITE_URL || 'https://miromiro.app',
    name: 'MiroMiro',
  },
  sitemap: {
     exclude: [
      '/signup',
      '/signin',
      '/success',
      '/reset-password',
      '/forgot-password',
      '/confirm',
      '/profile'
    ]
  },
})