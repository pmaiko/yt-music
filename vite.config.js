import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export const config = {
  plugins: [
    vue()
  ],
  build: {
    // rollupOptions: {
    //   input: '/index.html'
    // },
    index: '/frontend/index.html',
    outDir: 'build',
    copyPublicDir: false
    // resolve: {
    //   alias: {
    //     '/': './static',
    //     '~': 'frontend',
    //     '@': 'frontend',
    //   }
    // }
  },
  publicDir: 'static'
}
// https://vitejs.dev/config/
export default defineConfig(config)
