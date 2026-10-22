import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/tools/',
  server: {
    host: '0.0.0.0',
    port: 5174,
    open: true,
    cors: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/tools/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/tools\/api/, '/api')
      }
    }
  }
})
