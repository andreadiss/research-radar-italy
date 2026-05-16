const siteUrl = "https://research-radar-italy.vercel.app";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function truncateText(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

export function isoDate(value: string) {
  if (!value || value === "monitoraggio fonte") return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

export function jsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
