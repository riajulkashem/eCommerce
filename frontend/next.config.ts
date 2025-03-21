import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        dangerouslyAllowSVG: true, // Allow Image type SVG or if you are loading image from placeholder
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
            },
            {
                protocol: "http",
                hostname: "nginx",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
            },
        ],
    },

    async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:8000',
          },
        ],
      },
    ];
  },

};

export default nextConfig;

