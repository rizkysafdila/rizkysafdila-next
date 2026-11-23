import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/careers", destination: "/#career", permanent: false }];
  },
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`),
      new URL('https://images.spr.so/cdn-cgi/imagedelivery/**'),
      { hostname: 'res.cloudinary.com' }
    ],
  },
};

export default nextConfig;
