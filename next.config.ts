import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Source assets are already delivery-sized WebP/JPEG files. Keeping them
  // unoptimized avoids a Cloudflare Images binding in local previews and
  // lets the CDN cache the originals directly in production.
  images: { unoptimized: true },
};

export default nextConfig;
