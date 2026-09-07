import { readFileSync } from "node:fs";

const murCheckStatus = JSON.parse(readFileSync(new URL("./lib/generated/mur-check-status.json", import.meta.url), "utf8"));
const lastMurCheck = murCheckStatus.lastSuccessfulCheckAt ?? "";
if (lastMurCheck && !Number.isFinite(Date.parse(lastMurCheck))) throw new Error("Invalid MUR check timestamp");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MUR_CHECKED_AT: lastMurCheck,
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
