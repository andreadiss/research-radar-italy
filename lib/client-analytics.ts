"use client";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, properties?: AnalyticsProperties) {
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, compactProperties(properties));
  }
}

function compactProperties(properties?: AnalyticsProperties) {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean | null>;
}
