/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me'], // Разрешаем загрузку изображений с randomuser.me
  }
};

export default nextConfig;
