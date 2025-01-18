// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  css: ['@/assets/main.sass'],
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
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
    '@zadigetvoltaire/nuxt-gtm',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    ['@nuxtjs/robots', { configPath: '~/robots.config' }],
  ],
  sitemap: {
    hostname: 'https://celia-blog.vercel.app/',
    routes: async () => {
      // 返回應該包含在 Sitemap 中的路由列表
      // 這裡可以動態生成，例如從 API 獲取
      const routes = ['/']
      return routes
    },
  },
  gtag: {
    id: 'G-D5BG0PXWCQ',
  },
  gtm: {
    id: `GTM-KCZKSVHP`,
    enabled: true,
    pageTracking: true,
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
    esbuild: {
      drop: process.env.VITE_DEBUG_MODE ? [] : ['console', 'debugger'],
    },
  },
  app: {
    head: {
      title: `Celia's Note`,
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            '主要記錄工作遇到的問題以及技術筆記，也希望能幫助到偶然來到這的人！',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '個人網站, Nuxt 3, SEO, 前端, frontend',
        },
        {
          name: 'google-site-verification',
          content: 'RxsAX-B4Wx58KvSm9bLHxM7AwMSsw3SvJnwoSrcgg1I',
        },
        {
          property: 'og:image',
          content:
            'https://celia-portfolio-website.vercel.app/project/project_3.jpg',
        },
      ],
      link: [{ rel: 'canonical', href: 'https://celia-blog.vercel.app/' }],
      script: [],
    },
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/admin',
      // include: ['/admin'],
      exclude: [
        '/',
        '/sitemap.xml',
        '/admin(/*)?',
        '/article(/*)?',
        '/about',
        '/category(/*)?',
      ],
      cookieRedirect: false,
    },
  },
})
