import type { MetadataRoute } from "next";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentDate = latestDate([
    ...positions.map((position) => position.publishedAt),
    ...grants.map((grant) => grant.publishedAt ?? grant.firstSeenAt ?? grant.deadline)
  ]) ?? new Date("2026-07-19");
  const editorialDate = new Date("2026-07-19");
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: contentDate,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteUrl}/about`,
      lastModified: editorialDate,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: editorialDate,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${siteUrl}/cookie`,
      lastModified: editorialDate,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: editorialDate,
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: editorialDate,
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];
  const landingRoutes: MetadataRoute.Sitemap = seoLandingPages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: page.kind === "positions" ? latestPositionDate() : latestGrantDate(),
    changeFrequency: "daily",
    priority: 0.85
  }));

  const positionRoutes: MetadataRoute.Sitemap = positions
    .filter((position) => !isExpiredDate(position.deadline))
    .map((position) => ({
      url: `${siteUrl}/positions/${encodeURIComponent(position.id)}`,
      lastModified: safeDate(position.publishedAt) ?? contentDate,
      changeFrequency: "weekly",
      priority: 0.8
    }));

  const grantRoutes: MetadataRoute.Sitemap = grants
    .filter((grant) => grant.status === "open" || grant.status === "upcoming")
    .map((grant) => ({
      url: `${siteUrl}/grants/${encodeURIComponent(grant.id)}`,
      lastModified: safeDate(grant.publishedAt ?? grant.firstSeenAt ?? grant.deadline) ?? contentDate,
      changeFrequency: "weekly",
      priority: 0.75
    }));

  return [...staticRoutes, ...landingRoutes, ...positionRoutes, ...grantRoutes];
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

function isExpiredDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T23:59:59`).getTime() < Date.now();
}
