// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-nodemailer', '@nuxtjs/supabase', '@nuxt/image', '@unlok-co/nuxt-stripe', '@vueuse/motion/nuxt', 'nuxt-gtag', '@nuxtjs/robots', '@nuxtjs/sitemap', 'nuxt-testimonial', '@nuxt/scripts'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Añade esto para Cloudflare Pages
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },

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
      // Allowlist for Chrome extension redirects
      // Set CHROME_EXTENSION_ID to your published extension ID
      chromeExtensionId: process.env.CHROME_EXTENSION_ID || 'npkpdkeiibipngipdoohnjhniodgppik',
      stripe: {
        key: process.env.STRIPE_PUBLIC_KEY,
        starterPriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_1SiJQqADtW7SyLlw6r6FFRsQ',
        starterYearlyPriceId: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || 'price_1SiJRCADtW7SyLlwdXOn8VeR',
        proPriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_1STjdMAaZdcZr0Eu9hu7u4a4',
        proYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_1SYSVxADtW7SyLlw2bU2bBfO'
      },
      posthogPublicKey: 'phc_I1oHHIswVhcLg8QLAFQIbmSe6wUSnqluJkNdS8A8qsH',
      posthogHost: 'https://eu.i.posthog.com',
      posthogDefaults: '2025-05-24'
    }
  },

  // Prerender static pages for better SEO and performance
  routeRules: {
    '/': { prerender: true },
    '/features': { prerender: true },
    '/features/**': { prerender: true },
    '/use-cases': { prerender: true },
    '/use-cases/**': { prerender: true },
    '/faq': { prerender: true },
    '/compare-plans': { prerender: true },
    '/contact': { prerender: true },
    '/privacy-policy': { prerender: true },
    '/terms-of-service': { prerender: true }
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
      login: '/signup',
      callback: '/confirm',
      // Public pages that don't require authentication
      exclude: [
        '/signin',
        '/',
        '/compare-plans',
        '/forgot-password',
        '/reset-password',
        '/privacy-policy',
        '/contact',
        '/terms-of-service',
        '/features',
        '/features/**',
        '/use-cases',
        '/use-cases/**',
        '/faq'
      ],
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
    ],
    // Define static routes for programmatic SEO pages
    sources: [
      // Manually define feature pages for sitemap
      '/api/__sitemap__/urls'
    ]
  },
})