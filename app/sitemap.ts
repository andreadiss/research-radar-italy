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
  // Omit lastmod until content-level modification provenance is available.
  // Publication dates, deadlines and build dates are not modification dates.
  return [
    ...routes,
    ...seoLandingPages.map((page) => ({ url: absoluteUrl(page.path) })),
    ...Array.from({ length: directoryPageCount() }, (_, i) => ({ url: absoluteUrl(directoryPath(i + 1)) })),
    ...positions.filter((position) => isOpenPosition(position)).map((position) => ({ url: absoluteUrl(`/positions/${encodeURIComponent(position.id)}`) })),
    ...grants.filter((grant) => isAvailableGrant(grant)).map((grant) => ({ url: absoluteUrl(`/grants/${encodeURIComponent(grant.id)}`) }))
  ];
}
