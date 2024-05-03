// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  css: ["@/assets/main.sass"],
  // runtimeConfig: {
  //   public: {
  //     serverUrl: process.env.NUXT_SUPABASE_URL,
  //     clientUrl: process.env.NUXT_SUPABASE_KEY,
  //   },
  // },
  
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
    '@nuxtjs/color-mode'

  ],
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
    // css: {
    //   preprocessorOptions: {
    //     sass: {
    //       additionalData: `@import "@/assets/main.sass"`,
    //     },
    //   },
    // },
  },
  app: {
    head: {
      title: 'supabase-nuxt',
    },
  },
  supabase:{
    redirectOptions: {
      login: '/login',
      callback: '/admin',
      // include: ['/admin'],
      exclude: ['/','/admin(/*)?','/article(/*)?'],
      cookieRedirect: false,
    }
  },
})
