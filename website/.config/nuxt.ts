// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  experimental: { inlineRouteRules: true, typedPages: true },
  future: { compatibilityVersion: 4 },
  router: { options: { strict: true } },
  app: {
    head: {
      meta: [{ name: 'version', content: import.meta.env.npm_package_version }],
      templateParams: { separator: '·', siteName: 'Website' },
      titleTemplate: '%s %separator %siteName',
    },
    rootTag: 'body',
    rootAttrs: { id: 'app' },
  },
  modules: ['@nuxt/ui-pro', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  $development: {
    vite: {
      server: {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        },
      },
      worker: { format: 'es' },
    },
    app: {
      head: {
        templateParams: { environment: '🔥' },
        titleTemplate: '%environment %s %separator %siteName',
      },
    },
  },
})
