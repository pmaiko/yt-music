import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
// @ts-ignore
import autoprefixer from 'autoprefixer'

export default defineConfig((configEnv: ConfigEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), '')
  return {
    define: {
      'import.meta.env.VITE_SERVER_PORT': JSON.stringify(env.VITE_SERVER_PORT),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_SERVER_PORT) || 3000,
    },
    plugins: [
      vue(),
      checker({
        stylelint: {
          lintCommand: 'stylelint ./src/**/*.{sass,scss,vue}',
        },
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"'
        },
        vueTsc: true
      }),
      Components({
        dts: './src/components.d.ts',
        dirs: [
          './src/components/base'
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
          'vue-router',
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
          './src/composables'
        ],
        dts: './src/auto-imports.d.ts',
        vueTemplate: false,
        injectAtEnd: true
      })
    ],
    envPrefix: 'APP_',
    build: {
      target: 'esnext',
      outDir: 'dist',
      // copyPublicDir: false
    },
    resolve: {
      alias: {
        '~': '/src',
        '@': '/src',
      }
    },
    publicDir: 'public',
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
  }
})
