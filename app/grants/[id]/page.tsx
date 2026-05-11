import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ExternalLink, FileText } from "lucide-react";
import { AccountNav } from "@/app/components/AccountNav";
import { getGrantById, grants } from "@/lib/grants";
import type { GrantOpportunity } from "@/lib/types";

export function generateStaticParams() {
  return grants.map((grant) => ({ id: grant.id }));
}

export default function GrantDetailPage({ params }: { params: { id: string } }) {
  const grant = getGrantById(params.id);

  if (!grant) {
    notFound();
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Torna alla home page">
          <span className="brand-mark">R</span>
          <span>Research Radar Italy</span>
        </Link>
        <AccountNav />
      </header>

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
