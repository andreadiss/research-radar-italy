import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bell, ExternalLink } from "lucide-react";
import { AccountNav } from "@/app/components/AccountNav";
import { getPositionById, positions } from "@/lib/positions";

export function generateStaticParams() {
  return positions.map((position) => ({ id: position.id }));
}

export default function PositionDetail({ params }: { params: { id: string } }) {
  const position = getPositionById(params.id);

  if (!position) {
    notFound();
  }

  return (
    <main className="shell">
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
            <span className="badge funding">{position.fundingType}</span>
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
            <button className="button secondary" title="Crea alert simile">
              <Bell size={17} />
              Alert simili
            </button>
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
