/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/jpform' : '',
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@haro/jpform-core',
    '@haro/jpform-postal',
    '@haro/jpform-react',
    '@haro/jpform-zod',
    '@haro/jpform-testing',
  ],
}

module.exports = nextConfig
