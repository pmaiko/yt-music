import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [
    vue(),
    checker({
      stylelint: {
        // lintCommand: 'stylelint ./frontend/**/*.{css,sass,scss,vue}',
        lintCommand: 'stylelint ./frontend/**/*.{sass,scss,vue}',
      },
      eslint: {
        lintCommand: 'eslint "./frontend/**/*.{ts,tsx,vue}"'
      },
      vueTsc: true
    }),
    Components({
      dts: './frontend/components.d.ts',
      dirs: [
        './frontend/components/base'
      ],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],

      imports: [
        'vue',
        {
          'vue-final-modal': [
            'useModal'
          ]
        },
        {
          '@kyvg/vue3-notification': [
            'notify'
          ]
        }
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
  publicDir: 'static',
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "~/assets/sass/global.scss";'
      }
    }
  }
})
