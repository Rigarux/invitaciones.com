import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5151,
    host: true, // Allow binding to all interfaces (like 0.0.0.0)
    allowedHosts: ['rigaru.online', 'invitacionescumple.rigaru.online']
  }
})
