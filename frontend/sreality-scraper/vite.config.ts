import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true
    },
    proxy: {
      "/api": {
        target: "http://backend:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      }
    },
  },
  plugins: [react()],
})
