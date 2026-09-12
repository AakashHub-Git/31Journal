import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sweety's Journal ✨",
    short_name: 'Journal',
    description: 'A private, beautiful digital journal and memory application',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F9',
    theme_color: '#F4A5AE',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
