import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`),
      new URL('https://images.spr.so/cdn-cgi/imagedelivery/**'),
      { hostname: 'res.cloudinary.com' }
    ],
  },
};

export default nextConfig;
