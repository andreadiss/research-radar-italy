import Link from "next/link";
import { CalendarClock, FileText, MapPin, Search } from "lucide-react";
import { AccountNav } from "@/app/components/AccountNav";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { positionTypes } from "@/lib/filters";
import type { GrantOpportunity } from "@/lib/types";

type BackdropIntent = "home" | "posizioni" | "bandi";

const subjectChips = [
  "Medicina e salute",
  "Biologia, biotech e farmacia",
  "Ingegneria, informatica e AI",
  "Matematica, fisica e chimica",
  "Ambiente, agraria e veterinaria",
  "Architettura, design e territorio",
  "Economia, diritto e politica",
  "Filosofia, storia, lingue, pedagogia e psicologia"
];
const visibleGrants = grants.filter(isVisibleGrant);
const grantPrograms = Array.from(new Set(visibleGrants.map((grant) => grant.program))).sort();

export function AuthBackdrop({ returnTo }: { returnTo?: string }) {
  const backdropUrl = parseReturnTo(returnTo);
  const intent = backdropIntent(backdropUrl);
  const filteredPositions = positions.filter((position) => {
    const type = backdropUrl.searchParams.get("type");
    const discipline = backdropUrl.searchParams.get("discipline");

    return (!type || position.positionType === type) && (!discipline || position.discipline === discipline);
  });
  const filteredGrants = visibleGrants.filter((grant) => {
    const program = backdropUrl.searchParams.get("program");
    const discipline = backdropUrl.searchParams.get("discipline");

    return (
      (!program || grant.program === program) &&
      (!discipline || grant.discipline === discipline || grant.discipline === "Tutte le discipline")
    );
  });

  return (
    <div className="auth-backdrop-page" aria-hidden="true">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">R</span>
          <span>Research Radar Italy</span>
        </Link>
        <AccountNav />
      </header>
      <section className="hero">
        <div className="hero-main">
          <h1>{heroTitle(intent)}</h1>
          {intent === "home" ? <HomeEntryPoints /> : null}
        </div>
      </section>
      {intent === "posizioni" ? <PositionsBackdrop count={filteredPositions.length} /> : null}
      {intent === "bandi" ? <GrantsBackdrop count={filteredGrants.length} /> : null}
    </div>
  );
}

function HomeEntryPoints() {
  return (
    <div className="entry-points" aria-label="Scegli percorso">
      <Link className="entry-point" href="/?intent=posizioni">
        <Search size={20} />
        <span>
          <strong>Posizioni aperte</strong>
          <small>Dottorati, RTT, postdoc, professori e contratti</small>
        </span>
        <em>{positions.length}</em>
      </Link>
      <Link className="entry-point" href="/?intent=bandi">
        <FileText size={20} />
        <span>
          <strong>Grants & Funding</strong>
          <small>PRIN/PNRR, ERC e funding calls</small>
        </span>
        <em>{visibleGrants.length}</em>
      </Link>
    </div>
  );
}

function PositionsBackdrop({ count }: { count: number }) {
  return (
    <section className="workspace">
      <div className="results">
        <div className="results-chips">
          <div className="quick-filter-group">
            <span className="quick-filter-label">Tipo</span>
            <div className="chip-row">
              {positionTypes.slice(0, 6).map((type) => (
                <span className="quick-chip" key={type}>
                  {type}
                </span>
              ))}
            </div>
          </div>
          <SubjectChips />
        </div>
        <div className="results-header">
          <h2>
            Posizioni aperte <span className="results-count">{count} su {positions.length}</span>
          </h2>
        </div>
        <div className="jobs-list">
          {positions.slice(0, 2).map((position) => (
            <article className="job-card" key={position.id}>
              <div className="job-card-top">
                <div className="badges">
                  <span className="badge type">{position.positionType}</span>
                  <span className="badge funding">{position.fundingType}</span>
                  <span className="badge">{position.discipline}</span>
                </div>
                <span className="deadline-pill">
                  <CalendarClock size={15} />
                  Scadenza
                </span>
              </div>
              <h3 className="job-title">{position.title}</h3>
              <p className="job-summary">{position.summary}</p>
              <div className="job-meta">
                <span>{position.institution}</span>
                <span className="meta-with-icon"><MapPin size={14} />{position.location}</span>
                <span>{position.sourceName}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GrantsBackdrop({ count }: { count: number }) {
  return (
    <section className="workspace">
      <div className="results">
        <div className="results-chips">
          <div className="quick-filter-group">
            <span className="quick-filter-label">Programma</span>
            <div className="chip-row">
              {grantPrograms.map((program) => (
                <span className="quick-chip" key={program}>
                  {program}
                </span>
              ))}
            </div>
          </div>
          <SubjectChips />
        </div>
        <div className="results-header">
          <h2>
            Grants & Funding <span className="results-count">{count} su {visibleGrants.length}</span>
          </h2>
        </div>
        <div className="jobs-list">
          {visibleGrants.slice(0, 2).map((grant) => (
            <article className="job-card grant-card" key={grant.id}>
              <div className="job-card-top">
                <div className="badges">
                  <span className="badge type">{grant.program}</span>
                  <span className="badge funding">{grant.funder}</span>
                  <span className="badge">{grant.discipline}</span>
                </div>
                <span className="deadline-pill grant-status">
                  <FileText size={15} />
                  {grant.status === "upcoming" ? "In apertura" : "Aperto"}
                </span>
              </div>
              <h3 className="job-title">{grant.title}</h3>
              <p className="job-summary">{grant.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubjectChips() {
  return (
    <div className="quick-filter-group">
      <span className="quick-filter-label">Materia</span>
      <div className="chip-row subject-chip-row">
        {subjectChips.map((subject) => (
          <span className="quick-chip" key={subject}>
            {subject}
          </span>
        ))}
      </div>
    </div>
  );
}

function heroTitle(intent: BackdropIntent) {
  if (intent === "posizioni") return "Tutte le opportunita di lavoro";
  if (intent === "bandi") return "Grants & Funding";
  return "Trova opportunita accademiche in Italia.";
}

function backdropIntent(url: URL): BackdropIntent {
  const intent = url.searchParams.get("intent");
  if (intent === "posizioni" || intent === "bandi") return intent;
  return "home";
}

function parseReturnTo(returnTo: string | undefined) {
  try {
    return new URL(returnTo ?? "/", "http://research-radar.local");
  } catch {
    return new URL("/", "http://research-radar.local");
  }
}

function isVisibleGrant(grant: GrantOpportunity) {
  return grant.status === "open" || grant.status === "upcoming";
}
