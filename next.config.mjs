/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '/**',
      },
      // Discogs image domains (for album art)
      {
        protocol: 'https',
        hostname: 'i.discogs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.discogs.com',
        pathname: '/**',
      },
      // Spotify image domains (for artist images)
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
