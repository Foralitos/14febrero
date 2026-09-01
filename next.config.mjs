/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Sin optimizador de Vercel: la cuota gratuita de transformaciones (5K/mes) se agoto.
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
