import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // demo/stock imagery in dev only — replaced by Cloudinary before launch
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
