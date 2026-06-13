import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.yaml'],
  base: process.env.NODE_ENV === 'production' ? '/github-nav/' : '/',
})
