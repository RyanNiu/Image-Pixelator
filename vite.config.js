import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        examples: resolve(__dirname, 'examples.html'),
        'en/index': resolve(__dirname, 'en/index.html'),
        'en/examples': resolve(__dirname, 'en/examples.html'),
        'zh/index': resolve(__dirname, 'zh/index.html'),
        'zh/examples': resolve(__dirname, 'zh/examples.html'),
        'es/index': resolve(__dirname, 'es/index.html'),
        'es/examples': resolve(__dirname, 'es/examples.html'),
        'fr/index': resolve(__dirname, 'fr/index.html'),
        'fr/examples': resolve(__dirname, 'fr/examples.html'),
        'ru/index': resolve(__dirname, 'ru/index.html'),
        'ru/examples': resolve(__dirname, 'ru/examples.html')
      }
    }
  },
  publicDir: 'public'
})
