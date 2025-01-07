import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  root: path.resolve(__dirname, './src/renderer'), // 指定渲染进程目录
  base: './', // 生产模式下的基础路径
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'), // 打包输出目录
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
    },
  }
});
