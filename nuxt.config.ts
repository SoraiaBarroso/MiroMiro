// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-nodemailer', '@nuxtjs/supabase', '@nuxt/image', '@unlok-co/nuxt-stripe', '@vueuse/motion/nuxt'],

  runtimeConfig: {
    stripe: {
      key: process.env.STRIPE_SECRET_KEY,
    },
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY,
      }
    }
  },

  ui: {
    colorMode: false,
  },
  supabase: {
    types: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SECRET_KEY,
    redirectOptions: {
      login: "/signup", // User will be redirected to this path if not authenticated or after logout.
      callback: "/confirm", // This is the path the user will be redirect to after supabase login redirection.
      exclude: ["/signin", "/", "/compare-plans", "/forgot-password", "/reset-password"], // These paths won't be protected and require no authentication.
      cookieRedirect: false,
    },
  },
  nodemailer: {
    from: '"MiroMiro" <noreply@miromiro.com>',
    host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
    port: Number(process.env.NODEMAILER_PORT) || 465,
    secure: process.env.NODEMAILER_SECURE === 'true',
    auth: {
      user: process.env.NODEMAILER_USER || '',
      pass: process.env.NODEMAILER_PASS || '',
    },
  },
  devtools: {
    enabled: true
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  css: ['~/assets/css/main.css'],

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
  }
})