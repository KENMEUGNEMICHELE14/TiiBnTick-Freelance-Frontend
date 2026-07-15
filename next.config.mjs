/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['[::1]', 'preview-chat-59a33209-4e30-4a43-8291-f6fe52d191f5.space-z.ai'],
}

export default nextConfig