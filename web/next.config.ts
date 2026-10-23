import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Interní nástroj: data se čtou z databáze při každém požadavku,
  // proto zůstává klasický dynamický model bez Cache Components.
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
