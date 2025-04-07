import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qcty518ndn.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
