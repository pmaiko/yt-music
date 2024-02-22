import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default ({}: ConfigEnv): UserConfig => {
  return defineConfig({
    plugins: [vue()],
    envPrefix: 'APP_',
    build: {
      target: 'esnext',
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
  } as UserConfig);
};
