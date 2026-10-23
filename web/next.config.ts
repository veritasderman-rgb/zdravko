import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Interní nástroj: data se čtou z databáze při každém požadavku,
  // proto zůstává klasický dynamický model bez Cache Components.
  cacheComponents: false,
  // Vercel obnovuje Turbopack cache z minulého buildu a Tailwind CSS se pak
  // nepřegeneruje (na produkci chyběly nové třídy). Pro build cache vypínáme.
  experimental: { turbopackFileSystemCacheForBuild: false },
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
