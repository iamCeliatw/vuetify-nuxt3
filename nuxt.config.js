// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  css: ["@/assets/main.sass"],
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
    analyze: true,
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt', '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
    '@zadigetvoltaire/nuxt-gtm',
    'nuxt-gtag',
  ],
  gtag: {
    id: 'G-D5BG0PXWCQ'
  },
  gtm: {
    id: `GTM-KCZKSVHP`,
    enabled: true,
    pageTracking: true
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  app: {
    head: {
      title: `Celia's Blog`,
    },
  },
  supabase:{
    redirectOptions: {
      login: '/login',
      callback: '/admin',
      // include: ['/admin'],
      exclude: ['/','/admin(/*)?','/article(/*)?','/about','/category(/*)?'],
      cookieRedirect: false,
    }
  },
})
