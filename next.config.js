/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me'], // Разрешаем загрузку изображений с randomuser.me
  },
  eslint: {
    // Игнорируем ошибки ESLint при сборке
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорируем ошибки TypeScript при сборке
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
