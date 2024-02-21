import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  plugins: [
    // laravel({
    //   // detectTls: 'my-app.test',
    //   input: [
    //     // 'resources/css/app.css',
    //     'resources/js/index.ts',
    //   ],
    //   buildDirectory: './build',
    // }),
    vue()
  ],

  // build: {
  //   sourcemap: true,
  //   rollupOptions: {
  //     input: "resources/js/index.ts",
  //   },
  //   outDir: "public/dist",
  //   manifest: true,
  // },
  // publicDir: "resources/js/assets",
  // server: {
  //   port: 3000,
  // },
  //
  // build: {
  //   // generate .vite/manifest.json in outDir
  //   manifest: true,
  //   rollupOptions: {
  //     // overwrite default .html entry
  //     input: 'resources/js/index.ts',
  //   },
  // },

  resolve: {
    alias: {
      '@': '/resources/ts',
    },
  }
})
