import type { MetadataRoute } from "next";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { absoluteUrl } from "@/lib/site-url";
import { isAvailableGrant, isOpenPosition } from "@/lib/opportunity-status";
import { directoryPageCount, directoryPath } from "@/lib/opportunity-directory";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = ["/", "/posizioni", "/funding", "/about", "/privacy", "/cookie", "/terms", "/contact"]
    .map((path) => ({ url: absoluteUrl(path) }));
  // Position updatedAt changes only when reconciled source content changes.
  // Keep lastmod off aggregate/static routes until they have equivalent provenance.
  return [
    ...routes,
    ...seoLandingPages.map((page) => ({ url: absoluteUrl(page.path) })),
    ...Array.from({ length: directoryPageCount() }, (_, i) => ({ url: absoluteUrl(directoryPath(i + 1)) })),
    ...positions.filter((position) => isOpenPosition(position)).map((position) => ({
      url: absoluteUrl(`/positions/${encodeURIComponent(position.id)}`),
      ...(position.updatedAt ? { lastModified: new Date(position.updatedAt) } : {})
    })),
    ...grants.filter((grant) => isAvailableGrant(grant)).map((grant) => ({ url: absoluteUrl(`/grants/${encodeURIComponent(grant.id)}`) }))
  ];
}
