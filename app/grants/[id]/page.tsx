import type { Metadata } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { notFound } from "next/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { getGrantById, grants } from "@/lib/grants";
import { absoluteUrl, isoDate, jsonLd, truncateText } from "@/lib/seo";
import type { GrantOpportunity } from "@/lib/types";

export function generateStaticParams() {
  return grants.map((grant) => ({ id: grant.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const grant = getGrantById(params.id);

  if (!grant) {
    return {
      title: "Grant non trovato",
      robots: { index: false, follow: false }
    };
  }

  const title = `${grant.title} - ${grant.program}`;
  const description = truncateText(
    `${grant.summary} Scadenza: ${formatGrantDeadline(grant.deadline)}. Fonte: ${grant.sourceName}.`
  );
  const url = `/grants/${grant.id}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(url) },
    robots: isIndexableGrant(grant) ? undefined : { index: false, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default function GrantDetailPage({ params }: { params: { id: string } }) {
  const grant = getGrantById(params.id);

  if (!grant) {
    notFound();
  }

  const grantStructuredData = {
    "@context": "https://schema.org",
    "@type": "Grant",
    "@id": absoluteUrl(`/grants/${grant.id}#grant`),
    name: grant.title,
    description: truncateText(grant.summary, 4000),
    inLanguage: "it-IT",
    funder: {
      "@type": "Organization",
      name: grant.funder
    },
    sponsor: {
      "@type": "Organization",
      name: grant.sourceName
    },
    keywords: [grant.program, grant.discipline].filter(Boolean),
    applicationDeadline: isoDate(grant.deadline),
    url: absoluteUrl(`/grants/${grant.id}`),
    sameAs: grant.sourceUrl,
    mainEntityOfPage: absoluteUrl(`/grants/${grant.id}`),
    isAccessibleForFree: true
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: grant.title, item: absoluteUrl(`/grants/${grant.id}`) }
    ]
  };
  const structuredData = isIndexableGrant(grant) ? {
    "@context": "https://schema.org",
    "@graph": [
      grantStructuredData,
      breadcrumbs
    ]
  } : breadcrumbs;

  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <SiteTopbar />

      <section className="detail-page">
        <Link className="back-link" href="/?intent=bandi">
          Torna a Grants & Funding
        </Link>
        <article className="detail-card">
          <div className="job-card-top">
            <div className="badges">
              <span className="badge type">{grant.program}</span>
              <span className="badge funding">{grant.funder}</span>
              <span className="badge">{grant.discipline}</span>
            </div>
            <span className="deadline-pill grant-status">
              <FileText size={15} />
              {grantStatusLabel(grant)}
            </span>
          </div>

          <div className="detail-hero">
            <h1>{grant.title}</h1>
            <p>{grant.summary}</p>
          </div>

          <div className="detail-grid">
            <DetailItem label="Scadenza" value={formatGrantDeadline(grant.deadline)} />
            <DetailItem label="Programma" value={grant.program} />
            <DetailItem label="Ente" value={grant.funder} />
            <DetailItem label="Importo" value={grant.amount ?? "Da fonte ufficiale"} />
            <DetailItem label="Ammissibilita" value={grant.eligibility} />
            <DetailItem label="Fonte" value={grant.sourceName} />
          </div>

          <section className="detail-section">
            <h2>Come usare questa fonte</h2>
            <p>
              Questa scheda porta alla fonte ufficiale del grant. Nel prossimo passaggio gli importer
              estrarranno automaticamente call, scadenze, eligibility e allegati quando la fonte espone dati
              strutturati o pagine stabili.
            </p>
          </section>

          <div className="detail-actions">
            <a className="button primary" href={grant.sourceUrl} rel="noreferrer" target="_blank">
              Apri fonte ufficiale
              <ExternalLink size={16} />
            </a>
            <Link className="button secondary" href={`/?intent=bandi&program=${encodeURIComponent(grant.program)}`}>
              Vedi grants simili
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatGrantDeadline(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(`${value}T00:00:00`));
  }

  return value;
}

function grantStatusLabel(grant: GrantOpportunity) {
  if (grant.status === "open") return "Aperto";
  if (grant.status === "upcoming") return "In apertura";
  if (grant.status === "closed") return "Chiuso";
  return "Da verificare";
}

function isIndexableGrant(grant: GrantOpportunity) {
  return grant.status === "open" || grant.status === "upcoming";
}
