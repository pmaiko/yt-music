import ViteExpress from 'vite-express'
ViteExpress.config({
  mode: 'production',
  inlineViteConfig: {
    base: '/'
  }
})
ViteExpress.build()
