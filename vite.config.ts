import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [react(), tsconfigPaths()],
  preview: {
    port: 3003,
    strictPort: true
  },
  server: {
    port: 3003,
    strictPort: true,
    host: true,
    origin: 'http://localhost:3003'
  },
  resolve: {
    alias: {
      '@app': path.resolve('src/app'),
      '@entities': path.resolve('src/entities'),
      '@features': path.resolve('src/features'),
      '@pages': path.resolve('src/pages'),
      '@shared': path.resolve('src/shared'),
      '@widgets': path.resolve('src/widgets'),
      },
    }
})
