import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      '5173-i2zt4kr4prd8slql64532-02b9cc79.sandbox.novita.ai',
      'localhost',
      '.sandbox.novita.ai'
    ]
  }
})