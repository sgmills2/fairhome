import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_MAPBOX_TOKEN: process.env.VITE_MAPBOX_TOKEN,
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    },
  },
}) 