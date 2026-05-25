import type { MetadataRoute } from "next";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteUrl}/?intent=posizioni`,
      lastModified: latestPositionDate(),
      changeFrequency: "daily",
      priority: 0.95
    },
    {
      url: `${siteUrl}/?intent=bandi`,
      lastModified: latestGrantDate(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${siteUrl}/cookie`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];

  const positionRoutes: MetadataRoute.Sitemap = positions.map((position) => ({
    url: `${siteUrl}/positions/${encodeURIComponent(position.id)}`,
    lastModified: safeDate(position.publishedAt) ?? now,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const grantRoutes: MetadataRoute.Sitemap = grants.map((grant) => ({
    url: `${siteUrl}/grants/${encodeURIComponent(grant.id)}`,
    lastModified: safeDate(grant.publishedAt ?? grant.firstSeenAt ?? grant.deadline) ?? now,
    changeFrequency: "weekly",
    priority: 0.75
  }));

  return [...staticRoutes, ...positionRoutes, ...grantRoutes];
}

function latestPositionDate() {
  return latestDate(positions.map((position) => position.publishedAt)) ?? new Date();
}

function latestGrantDate() {
  return latestDate(grants.map((grant) => grant.publishedAt ?? grant.firstSeenAt ?? grant.deadline)) ?? new Date();
}

function latestDate(values: string[]) {
  const timestamps = values
    .map((value) => safeDate(value)?.getTime())
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (timestamps.length === 0) return null;

  return new Date(Math.max(...timestamps));
}

function safeDate(value?: string) {
  if (!value || value === "monitoraggio fonte") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
