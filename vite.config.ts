import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    vue(),
    checker({
      stylelint: {
        lintCommand: 'stylelint ./frontend/**/*.{css,sass,vue}',
      },
      eslint: {
        lintCommand: 'eslint "./frontend/**/*.{ts,tsx,vue}"'
      },
      typescript: true,
    })
  ],
  envPrefix: 'APP_',
  build: {
    target: 'esnext',
    outDir: 'build',
    copyPublicDir: false
  },
  resolve: {
    alias: {
      '~': '/frontend',
      '@': '/frontend',
    }
  },
  publicDir: 'static'
})
