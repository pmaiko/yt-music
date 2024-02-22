import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import AutoImport from 'unplugin-auto-import/vite'

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
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],

      imports: [
        'vue'
      ],
      dirs: [
        './frontend/composables'
      ],
      dts: './frontend/auto-imports.d.ts',
      vueTemplate: false,
      injectAtEnd: true
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
