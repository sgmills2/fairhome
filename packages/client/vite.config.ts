import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: '/',
    publicDir: 'public',
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_MAPBOX_TOKEN': JSON.stringify(env.VITE_MAPBOX_TOKEN)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'mapbox': ['mapbox-gl'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-query'],
            'mui': ['@mui/joy', '@mui/joy/styles'],
            'utils': ['lodash'],
            'map-feature': [
              './src/features/map/Map.tsx',
              './src/features/map/MapFilters.tsx'
            ],
            'search-feature': [
              './src/features/search/SearchBar.tsx',
              './src/features/search/AlderpersonSearch.tsx'
            ],
            'listings-feature': [
              './src/features/listings/ListingsSidebar.tsx'
            ]
          }
        }
      }
    }
  }
}) 