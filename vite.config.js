import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Para ma-access sa local network (cellphone testing)
    https: false // Hindi natin kailangan ng https sa local, pero sa production (Vercel) automatic na 'yon
  }
})