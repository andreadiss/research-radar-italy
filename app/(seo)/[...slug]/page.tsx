import type { Metadata, Route } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
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

function landingItems(page: SeoLandingPage) {
  if (page.kind === "positions") {
    return positions
      .filter((position) => position.positionType === page.filter.type && !isPast(position.deadline))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map((position) => ({
        href: `/positions/${position.id}`,
        title: position.title,
        meta: `${position.institution} - ${position.discipline} - scadenza ${formatDate(position.deadline)}`
      }));
  }

  return grants
    .filter((grant) => grant.program === page.filter.program && (grant.status === "open" || grant.status === "upcoming"))
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
        itemListElement: items.slice(0, 20).map((item, index) => ({
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
