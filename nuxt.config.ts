// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/': { redirect: '/admin' }
  },
  icon: {
    provider: 'server',
    serverBundle: 'local',
    clientBundle: {
      scan: true
    }
  },
  experimental: {
    appManifest: false
  }
})

