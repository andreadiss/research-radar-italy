"use client";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;
type GtagProperties = Record<string, string | number | boolean | null>;
type Gtag = {
  (command: "event", eventName: string, params?: GtagProperties): void;
  (command: "config", targetId: string, params?: GtagProperties): void;
};

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function track(event: string, properties?: AnalyticsProperties) {
  const compactedProperties = compactProperties(properties);

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, compactedProperties);
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, compactedProperties ?? {});
  }
}

function compactProperties(properties?: AnalyticsProperties) {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean | null>;
}