export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://rritaly.com");

export function absoluteUrl(path = "/") {
  const url = new URL(path, siteUrl);
  if (!url.pathname.endsWith("/") && !url.pathname.split("/").at(-1)?.includes(".")) {
    url.pathname += "/";
  }
  return url.toString();
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}
