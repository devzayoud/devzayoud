import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode !== 'development' ? [VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pexels-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      includeAssets: ['golden-lion-with-crown-logo-vector-45981373.png'],
      manifest: {
        name: 'LEOIPTV - Professional IPTV Player',
        short_name: 'LEOIPTV',
        description: 'Professional IPTV streaming application with M3U playlist support',
        theme_color: '#eab308',
        background_color: '#000000',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '/',
        icons: [
          {
            src: 'golden-lion-with-crown-logo-vector-45981373.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })] : [])
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
