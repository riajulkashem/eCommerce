import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },{
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },

};

export default nextConfig;

