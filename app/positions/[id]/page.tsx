import type { Metadata } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { OfficialSourceLink } from "@/app/components/OfficialSourceLink";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPositionById, positions } from "@/lib/positions";
import { absoluteUrl, jsonLd, truncateText } from "@/lib/seo";
import { isOpenPosition } from "@/lib/opportunity-status";

export function generateStaticParams() {
  return positions.map((position) => ({ id: position.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const position = getPositionById(params.id);

  if (!position) {
    return {
      title: "Posizione non trovata",
      robots: { index: false, follow: false }
    };
  }

  const title = `${truncateText(position.title, 100)} – ${position.institution} (${position.id.split("-").at(-1)})`;
  const description = truncateText(
    `${position.title}. ${position.discipline}${position.ssd ? `, ${position.ssd}` : ""}. Scadenza: ${formatDate(position.deadline)}. Fonte: ${position.sourceName}.`
  );
  const url = `/positions/${position.id}`;
  const expired = !isOpenPosition(position);

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(url) },
    robots: expired ? { index: false, follow: true } : undefined,
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

export default function PositionDetail({ params }: { params: { id: string } }) {
  const position = getPositionById(params.id);

  if (!position) {
    notFound();
  }

  // These records contain short source extracts, not complete job descriptions.
  // Use WebPage until the requirements for truthful JobPosting markup are met.
  const opportunityPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`/positions/${position.id}#page`),
    name: position.title,
    description: position.summary,
    inLanguage: "it-IT",
    dateModified: position.updatedAt,
    citation: position.sourceUrl,
    about: { "@type": "Organization", name: position.institution },
    url: absoluteUrl(`/positions/${position.id}`),
    sameAs: position.sourceUrl,
    isPartOf: { "@id": absoluteUrl("/#website") }
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Posizioni", item: absoluteUrl("/posizioni") },
      { "@type": "ListItem", position: 3, name: position.title, item: absoluteUrl(`/positions/${position.id}`) }
    ]
  };
  const structuredData = !isOpenPosition(position)
    ? breadcrumbs
    : {
        "@context": "https://schema.org",
        "@graph": [opportunityPage, breadcrumbs]
      };

  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <SiteTopbar />

      <section className="detail-shell">
        <Link className="back-link" href="/posizioni">
          <ArrowLeft size={17} />
          Torna alle posizioni aperte
        </Link>
        <article className="detail-card">
          {!isOpenPosition(position) ? <p role="status"><strong>Opportunità archiviata.</strong> La scadenza è trascorsa oppure il bando non compare più nell'ultima raccolta della fonte. Verifica eventuali aggiornamenti sulla fonte ufficiale.</p> : null}
          <div className="badges">
            <span className="badge type">{position.positionType}</span>
            <span className="badge">{position.discipline}</span>
          </div>
          <h1>{position.title}</h1>
          <div className="job-meta">
            <span>{position.institution}</span>
            <span>{position.department}</span>
            <span>{position.location}</span>
          </div>

          <div className="detail-grid">
            <DetailItem label="Deadline" value={formatDate(position.deadline)} />
            <DetailItem label="Pubblicato" value={formatDate(position.publishedAt)} />
            {position.updatedAt ? <DetailItem label="Aggiornamento scheda" value={formatDate(position.updatedAt)} /> : null}
            <DetailItem label="SSD/GSD" value={position.ssd} />
            <DetailItem label="Durata" value={position.duration} />
            <DetailItem label="Importo" value={position.salaryOrAmount} />
            <DetailItem label="Lingua" value={position.language} />
          </div>

          <h2>Sintesi</h2>
          <p className="summary">{position.summary}</p>

          <h2>Requisiti principali</h2>
          <ul className="summary">
            {position.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>

          <div className="topbar-actions">
            <OfficialSourceLink className="button primary" href={position.sourceUrl}>
              <ExternalLink size={17} />
              Apri fonte ufficiale
            </OfficialSourceLink>
          </div>
          <Link className="back-link" href="/posizioni/indice">Esplora altre opportunità aperte</Link>
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

function formatDate(value: string) {
  if (!value || !Number.isFinite(new Date(value).getTime())) return "Da verificare sulla fonte ufficiale";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}
