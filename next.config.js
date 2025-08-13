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
  async redirects() {
    return [
      // www -> isbad.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.isbad.com" }],
        destination: "https://isbad.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
