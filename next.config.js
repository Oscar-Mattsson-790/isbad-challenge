/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cubyhoatatmrldwltxfx.supabase.co",
        pathname: "/storage/v1/object/public/bathproofs/**",
      },
      {
        protocol: "https",
        hostname: "cubyhoatatmrldwltxfx.supabase.co",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
};

module.exports = nextConfig;
