import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mmnexus/core", "@mmnexus/digital", "@mmnexus/pod"],
};

export default nextConfig;
