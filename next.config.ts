import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      }
    ],
    domains: ["lh3.googleusercontent.com", "https://avatars.githubusercontent.com", "cdn.discordapp.com"]
  }
};

export default nextConfig;
