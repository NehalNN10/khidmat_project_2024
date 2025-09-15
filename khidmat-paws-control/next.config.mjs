/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com',
      'images.unsplash.com',
    ],
  },
};

export default nextConfig;
