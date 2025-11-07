// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-nodemailer'
  ],
  ui: {
    colorMode: false,
  },
  nodemailer: {
    from: '"MiroMiro" <noreply@miromiro.com>',
    host: process.env.NUXT_NODEMAILER_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.NUXT_NODEMAILER_PORT) || 465,
    secure: process.env.NUXT_NODEMAILER_SECURE === 'true',
    auth: {
      user: process.env.NUXT_NODEMAILER_USER || '',
      pass: process.env.NUXT_NODEMAILER_PASS || '',
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
