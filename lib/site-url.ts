export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://rritaly.com");

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}
