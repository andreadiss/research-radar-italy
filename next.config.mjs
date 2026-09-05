import { readFileSync } from "node:fs";

const positionSnapshot = JSON.parse(readFileSync(new URL("./lib/generated/mur-positions.json", import.meta.url), "utf8"));
const latestMurUpdate = positionSnapshot.map((item) => item.updatedAt).filter(Boolean).sort().at(-1) ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MUR_UPDATED_AT: latestMurUpdate,
    NEXT_PUBLIC_BUILD_DATE: new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
  },
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
