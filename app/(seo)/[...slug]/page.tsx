import type { Metadata, Route } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { isAvailableGrant, isOpenPosition } from "@/lib/opportunity-status";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { getSeoLandingPage, seoLandingPages, type SeoLandingPage } from "@/lib/seo-landing-pages";

type PageProps = { params: { slug: string[] } };

export const dynamicParams = false;

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({ slug: page.segments }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getSeoLandingPage(params.slug);
  if (!page) return { title: "Pagina non trovata", robots: { index: false, follow: false } };

  return {
    title: page.metaTitle,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: absoluteUrl(page.path),
      languages: { "it-IT": absoluteUrl(page.path) }
    },
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: absoluteUrl(page.path),
      title: page.metaTitle,
      description: page.description
    },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.description }
  };
}

export default function SeoLandingRoute({ params }: PageProps) {
  const page = getSeoLandingPage(params.slug);
  if (!page) notFound();

  const items = landingItems(page);
  const disciplines = landingDisciplines(page);
  const disciplineSection = landingDisciplineSection(page);
  const regions = landingRegions(page);
  const regionSection = landingRegionSection(page);
  const structuredData = buildStructuredData(page, items);

  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <SiteTopbar />

      <section className="detail-shell seo-landing-shell">
        <nav className="seo-breadcrumbs" aria-label="Percorso">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{page.kind === "positions" ? "Posizioni" : "Funding"}</span>
          <span>/</span>
          <strong>{page.shortLabel}</strong>
        </nav>

        <article className="seo-landing-card">
          <header className="seo-landing-hero">
            <p className="legal-kicker">Research Radar Italy</p>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <div className="seo-count-line">
              <strong>{items.length} opportunita nel radar</strong>
              <Link className="button primary" href={page.primaryHref as Route}>
                {page.primaryLabel}
                <ArrowRight size={17} />
              </Link>
            </div>
          </header>

          <div className="seo-content-grid">
            <section className="seo-opportunity-list">
              <h2>Opportunita disponibili</h2>
              {items.slice(0, 8).map((item) => (
                <Link className="seo-result-link" href={item.href as Route} key={item.href}>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </Link>
              ))}
              {items.length === 0 ? (
                <p className="summary">Non ci sono call aperte in questa categoria. Il radar continua a monitorare le fonti ufficiali.</p>
              ) : null}
              <Link className="back-link" href={page.primaryHref as Route}>
                Esplora la vista completa
                <ExternalLink size={15} />
              </Link>
            </section>

            <section className="seo-copy-block">
              <h2>{page.guideTitle}</h2>
              {page.guide.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p><strong>Nota:</strong> Research Radar facilita la scoperta e il confronto. La fonte ufficiale resta il riferimento per requisiti, allegati e candidatura.</p>
            </section>
          </div>

          {disciplines.length > 0 && disciplineSection ? (
            <section className="seo-faq" aria-labelledby="disciplines-title">
              <h2 id="disciplines-title">{disciplineSection.title}</h2>
              <p>{disciplineSection.description}</p>
              <nav className="seo-related-links" aria-label={disciplineSection.ariaLabel}>
                {disciplines.map((discipline) => (
                  <Link href={discipline.href as Route} key={discipline.name}>
                    {discipline.name} ({discipline.count})
                  </Link>
                ))}
              </nav>
            </section>
          ) : null}

          {regions.length > 0 && regionSection ? (
            <section className="seo-faq" aria-labelledby="regions-title">
              <h2 id="regions-title">{regionSection.title}</h2>
              <p>{regionSection.description}</p>
              <nav className="seo-related-links" aria-label={regionSection.ariaLabel}>
                {regions.map((region) => (
                  <Link href={region.href as Route} key={region.name}>
                    {region.name} ({region.count})
                  </Link>
                ))}
              </nav>
            </section>
          ) : null}

          <section className="seo-faq">
            <h2>Domande frequenti</h2>
            {page.faqs.map((faq) => (
              <div className="seo-faq-item" key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>

          <nav className="seo-related-links" aria-label="Altre ricerche utili">
            {seoLandingPages.filter((related) => related.path !== page.path).map((related) => (
              <Link href={related.path as Route} key={related.path}>{related.shortLabel}</Link>
            ))}
          </nav>
        </article>
      </section>
    </main>
  );
}

function landingRegions(page: SeoLandingPage) {
  const positionType = page.path === "/posizioni/postdoc"
    ? "Postdoc"
    : page.path === "/posizioni/dottorati"
      ? "PhD"
      : null;
  if (!positionType) return [];

  const counts = positions
    .filter((position) => position.positionType === positionType && isOpenPosition(position))
    .filter((position) => position.region && position.region !== "Italia")
    .reduce((byRegion, position) => {
      byRegion.set(position.region, (byRegion.get(position.region) ?? 0) + 1);
      return byRegion;
    }, new Map<string, number>());

  return Array.from(counts, ([name, count]) => ({
    name,
    count,
    href: `/posizioni/?type=${positionType}&region=${encodeURIComponent(name)}`
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "it"));
}

function landingRegionSection(page: SeoLandingPage) {
  if (page.path === "/posizioni/postdoc") return {
    title: "Postdoc per regione",
    description: "Scegli una regione per vedere le posizioni postdoc attualmente disponibili nel radar.",
    ariaLabel: "Regioni con posizioni postdoc aperte"
  };
  if (page.path === "/posizioni/dottorati") return {
    title: "Dottorati per regione",
    description: "Scegli una regione per vedere i bandi di dottorato attualmente disponibili nel radar.",
    ariaLabel: "Regioni con bandi di dottorato aperti"
  };
  return null;
}

function landingDisciplines(page: SeoLandingPage) {
  const positionType = page.path === "/posizioni/postdoc"
    ? "Postdoc"
    : page.path === "/posizioni/dottorati"
      ? "PhD"
      : null;
  if (!positionType) return [];

  const counts = positions
    .filter((position) => position.positionType === positionType && isOpenPosition(position))
    .filter((position) => positionType !== "PhD" || position.discipline !== "Altro / interdisciplinare")
    .reduce((byDiscipline, position) => {
      byDiscipline.set(position.discipline, (byDiscipline.get(position.discipline) ?? 0) + 1);
      return byDiscipline;
    }, new Map<string, number>());

  return Array.from(counts, ([name, count]) => ({
    name,
    count,
    href: `/posizioni/?type=${positionType}&discipline=${encodeURIComponent(name)}`
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "it"));
}

function landingDisciplineSection(page: SeoLandingPage) {
  if (page.path === "/posizioni/postdoc") return {
    title: "Postdoc per area disciplinare",
    description: "Scegli un’area per vedere le posizioni postdoc attualmente disponibili nel radar.",
    ariaLabel: "Aree disciplinari postdoc"
  };
  if (page.path === "/posizioni/dottorati") return {
    title: "Dottorati per area disciplinare",
    description: "Scegli un’area per vedere i bandi di dottorato attualmente disponibili nel radar.",
    ariaLabel: "Aree disciplinari dottorati"
  };
  return null;
}

function landingItems(page: SeoLandingPage) {
  if (page.kind === "positions") {
    return positions
      .filter((position) => position.positionType === page.filter.type && isOpenPosition(position))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map((position) => ({
        href: `/positions/${position.id}`,
        title: position.title,
        meta: `${position.institution} - ${position.discipline} - scadenza ${formatDate(position.deadline)}`
      }));
  }

  return grants
    .filter((grant) => grant.program === page.filter.program && isAvailableGrant(grant))
    .map((grant) => ({
      href: `/grants/${grant.id}`,
      title: grant.title,
      meta: `${grant.funder} - ${grant.discipline} - scadenza ${formatDate(grant.deadline)}`
    }));
}

function buildStructuredData(page: SeoLandingPage, items: ReturnType<typeof landingItems>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl(`${page.path}#page`),
        url: absoluteUrl(page.path),
        name: page.title,
        description: page.description,
        inLanguage: "it-IT",
        isPartOf: { "@id": absoluteUrl("/#website") },
        mainEntity: { "@id": absoluteUrl(`${page.path}#items`) }
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl(`${page.path}#items`),
        numberOfItems: items.length,
        itemListElement: items.slice(0, 8).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: absoluteUrl(item.href)
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: page.shortLabel, item: absoluteUrl(page.path) }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    ]
  };
}

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function isPast(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T23:59:59`).getTime() < Date.now();
}
