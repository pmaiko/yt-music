import ViteExpress from 'vite-express'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

ViteExpress.config({
  inlineViteConfig: {
    build: { outDir: resolve(__dirname, 'dist') }
  },
  mode: 'production'
})
ViteExpress.build()
