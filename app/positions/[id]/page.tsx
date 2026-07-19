import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AccountNav } from "@/app/components/AccountNav";
import { getPositionById, positions } from "@/lib/positions";
import { absoluteUrl, isoDate, jsonLd, truncateText } from "@/lib/seo";

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

  const title = `${position.positionType} - ${position.institution}`;
  const description = truncateText(
    `${position.title}. ${position.discipline}${position.ssd ? `, ${position.ssd}` : ""}. Scadenza: ${formatDate(position.deadline)}. Fonte: ${position.sourceName}.`
  );
  const url = `/positions/${position.id}`;
  const expired = isExpired(position.deadline);

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

  const jobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": absoluteUrl(`/positions/${position.id}#job`),
    title: position.title,
    description: `${position.summary}\n\nRequisiti principali: ${position.requirements.join("; ")}`,
    datePosted: isoDate(position.publishedAt),
    validThrough: isoDate(position.deadline),
    employmentType: position.positionType,
    occupationalCategory: [position.discipline, position.ssd].filter(Boolean).join(" - "),
    identifier: {
      "@type": "PropertyValue",
      name: position.sourceName,
      value: position.id
    },
    hiringOrganization: {
      "@type": "Organization",
      name: position.institution,
      logo: absoluteUrl("/favicon.svg")
    },
    industry: "Ricerca e universita",
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: position.location,
        addressRegion: position.region,
        addressCountry: "IT"
      }
    },
    url: absoluteUrl(`/positions/${position.id}`),
    sameAs: position.sourceUrl,
    mainEntityOfPage: absoluteUrl(`/positions/${position.id}`),
    directApply: false
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: position.title, item: absoluteUrl(`/positions/${position.id}`) }
    ]
  };
  const structuredData = isExpired(position.deadline)
    ? breadcrumbs
    : {
        "@context": "https://schema.org",
        "@graph": [jobPosting, breadcrumbs]
      };

  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">R</span>
          <span>Research Radar Italy</span>
        </Link>
        <AccountNav />
      </header>

      <section className="detail-shell">
        <Link className="back-link" href="/?intent=posizioni">
          <ArrowLeft size={17} />
          Torna alle posizioni aperte
        </Link>
        <article className="detail-card">
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
            <a className="button primary" href={position.sourceUrl}>
              <ExternalLink size={17} />
              Apri fonte ufficiale
            </a>
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function isExpired(value: string) {
  const deadline = new Date(`${value}T23:59:59`);
  return Number.isFinite(deadline.getTime()) && deadline.getTime() < Date.now();
}
