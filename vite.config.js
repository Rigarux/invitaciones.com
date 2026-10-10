import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Allow binding to all interfaces (like 0.0.0.0)
    strictPort: true,
    allowedHosts: ['rigaru.online', 'invitacionescumple.rigaru.online']
  }
})
