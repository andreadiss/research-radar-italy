import Link from "next/link";
import type { Metadata, Route } from "next";
import { CalendarClock, FileText, MapPin, Search } from "lucide-react";
import { AccountNav } from "@/app/components/AccountNav";
import { FloatingIntentMenu } from "@/app/components/FloatingIntentMenu";
import { HomeFavoritesPreview } from "@/app/components/HomeFavoritesPreview";
import { NextBestActions } from "@/app/components/NextBestActions";
import { OpportunityActions } from "@/app/components/OpportunityActions";
import { OpportunityPreview } from "@/app/components/OpportunityPreview";
import { TrackedLink } from "@/app/components/TrackedLink";
import { positionTypes } from "@/lib/filters";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { getCurrentAccount } from "@/lib/server/session";
import { selectSupabase } from "@/lib/server/supabase-rest";
import type { GrantOpportunity } from "@/lib/types";
import { absoluteUrl, jsonLd } from "@/lib/seo";

type SearchParams = {
  q?: string;
  type?: string;
  discipline?: string;
  region?: string;
  funding?: string;
  program?: string;
  intent?: string;
  auth?: string;
};

type Intent = "home" | "posizioni" | "bandi";

type SubjectChip = {
  label: string;
  filters: Pick<SearchParams, "q" | "discipline">;
};

type SavedOpportunityRow = {
  opportunity_id: string;
  opportunity_type: "position" | "grant";
};

const subjectChips: SubjectChip[] = [
  { label: "Medicina e salute", filters: { discipline: "Medicina e salute" } },
  { label: "Biologia, biotech e farmacia", filters: { discipline: "Biologia, biotech e farmacia" } },
  { label: "Ingegneria, informatica e AI", filters: { discipline: "Ingegneria, informatica e AI" } },
  { label: "Matematica, fisica e chimica", filters: { discipline: "Matematica, fisica e chimica" } },
  { label: "Ambiente, agraria e veterinaria", filters: { discipline: "Ambiente, agraria e veterinaria" } },
  { label: "Architettura, design e territorio", filters: { discipline: "Architettura, design e territorio" } },
  { label: "Economia, diritto e politica", filters: { discipline: "Economia, diritto e politica" } },
  {
    label: "Filosofia, storia, lingue, pedagogia e psicologia",
    filters: { discipline: "Filosofia, storia, lingue, pedagogia e psicologia" }
  }
];

const visibleGrants = grants.filter(isVisibleGrant);
const grantPrograms = Array.from(new Set(visibleGrants.map((grant) => grant.program))).sort();

export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  const intent: Intent =
    searchParams.intent === "bandi" ? "bandi" : searchParams.intent === "posizioni" ? "posizioni" : "home";

  if (intent === "posizioni") {
    return {
      title: "Posizioni accademiche aperte in Italia",
      description:
        "Cerca posizioni accademiche aperte in Italia: dottorati, RTT, postdoc, contratti, incarichi di ricerca, tecnologi e professori da fonti MUR/Cineca.",
      alternates: { canonical: absoluteUrl("/?intent=posizioni") },
      openGraph: {
        title: "Posizioni accademiche aperte in Italia",
        description:
          "Filtra bandi MUR/Cineca per tipo di posizione e materia, con scadenze e fonti ufficiali.",
        url: absoluteUrl("/?intent=posizioni")
      }
    };
  }

  if (intent === "bandi") {
    return {
      title: "Grants & Funding per ricerca in Italia",
      description:
        "Trova grant e funding call per la ricerca: PRIN, PNRR, ERC, MSCA e Horizon Europe, con link alle fonti ufficiali.",
      alternates: { canonical: absoluteUrl("/?intent=bandi") },
      openGraph: {
        title: "Grants & Funding per ricerca in Italia",
        description: "Funding call e fonti ufficiali per ricercatori, dottorandi e team accademici.",
        url: absoluteUrl("/?intent=bandi")
      }
    };
  }

  return {
    title: "Research Radar Italy | Posizioni accademiche e grant in Italia",
    description:
      "Trova posizioni accademiche, dottorati, postdoc, contratti di ricerca e grants in Italia da fonti ufficiali.",
    alternates: { canonical: absoluteUrl("/") }
  };
}

export default async function Home({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const account = await getCurrentAccount();
  const savedPreview = account?.profileId ? await getSavedPreview(account.profileId) : undefined;
  const intent: Intent =
    searchParams.intent === "bandi" ? "bandi" : searchParams.intent === "posizioni" ? "posizioni" : "home";
  const intentPositions = positions;
  const filtered = intentPositions.filter((position) => matchesFilters(position, searchParams));
  const filteredGrants = visibleGrants.filter((grant) => matchesGrantFilters(grant, searchParams));
  const closingSoon = filtered.filter((position) => daysUntil(position.deadline) <= 14).length;
  const newPositionsToday = intentPositions.filter((position) => isToday(position.publishedAt)).length;
  const newGrantsToday = visibleGrants.filter((grant) => grant.firstSeenAt && isToday(grant.firstSeenAt)).length;
  const canShowPositionResults = selectedValues(searchParams.type).length > 0 || selectedValues(searchParams.discipline).length > 0;
  const heroTitle =
    intent === "home"
      ? "Trova opportunità accademiche in Italia."
      : intent === "posizioni"
        ? "Tutte le opportunità di lavoro"
        : "Grants & Funding";
  const homeStructuredData = buildHomeStructuredData();

  return (
    <main className="shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeStructuredData) }} />
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Torna alla home page">
          <span className="brand-mark">R</span>
          <span>Research Radar Italy</span>
        </Link>
        <AccountNav />
      </header>

      <section className={heroClass(intent)}>
        <div className="hero-main">
          <h1>{heroTitle}</h1>
          <AuthFeedback status={searchParams.auth} />
          {intent === "home" ? (
            <div className="entry-points" aria-label="Scegli percorso">
              <TrackedLink
                className="entry-point"
                event="home_intent_clicked"
                href={intentHref(searchParams, "posizioni")}
                properties={{ intent: "posizioni", count: positions.length }}
              >
                <Search size={20} />
                <span>
                  <strong>Posizioni aperte</strong>
                  <small>Dottorati, RTT, postdoc, professori e contratti</small>
                </span>
                {newPositionsToday > 0 ? <span className="fresh-badge">{newPositionsToday} nuove oggi</span> : null}
                <em>{positions.length}</em>
              </TrackedLink>
              <TrackedLink
                className="entry-point"
                event="home_intent_clicked"
                href={intentHref(searchParams, "bandi")}
                properties={{ intent: "bandi", count: visibleGrants.length }}
              >
                <FileText size={20} />
                <span>
                  <strong>Grants & Funding</strong>
                  <small>PRIN/PNRR, ERC e funding calls</small>
                </span>
                {newGrantsToday > 0 ? <span className="fresh-badge">{newGrantsToday} nuovi oggi</span> : null}
                <em>{visibleGrants.length}</em>
              </TrackedLink>
            </div>
          ) : null}
          {intent === "home" ? <NextBestActions isAuthenticated={Boolean(account)} /> : null}
          {intent === "home" && account ? (
            <HomeFavoritesPreview count={savedPreview?.count ?? 0} items={savedPreview?.items ?? []} />
          ) : null}
        </div>
      </section>

      {intent !== "home" ? (
        <FloatingIntentMenu
          grantsCount={visibleGrants.length}
          grantsHref={intentHref(searchParams, "bandi")}
          intent={intent}
          positionsCount={positions.length}
          positionsHref={intentHref(searchParams, "posizioni")}
        />
      ) : null}

      {intent === "posizioni" ? (
      <section className="workspace">
        <div className="results">
          <div className="results-chips" aria-label="Filtri rapidi per posizioni aperte">
              <div className="quick-filter-group">
                <span className="quick-filter-label">Tipo</span>
                <div className="chip-row">
                  {positionTypes.map((type) => {
                    const count = filterCount(intentPositions, searchParams, { type });
                    const freshCount = freshPositionCount(intentPositions, searchParams, { type });

                    return (
                      <TrackedLink
                        className={chipClass(paramHasValue(searchParams.type, type))}
                        event="position_filter_clicked"
                        href={filterHref(searchParams, "type", type)}
                        key={type}
                        properties={{ filter_group: "type", filter_value: type, result_count: count }}
                      >
                        {type}
                        <small>{count}</small>
                        {freshCount > 0 ? (
                          <span className="fresh-chip-badge" aria-label={freshLabel(freshCount)} title={freshLabel(freshCount)} />
                        ) : null}
                      </TrackedLink>
                    );
                  })}
                </div>
              </div>
              <div className="quick-filter-group subject-picker">
                <span className="quick-filter-label">Materia</span>
                <div className="chip-row subject-chip-row">
                  {subjectChips.map((chip) => {
                    const freshCount = freshPositionCount(intentPositions, searchParams, chip.filters);

                    return (
                      <TrackedLink
                        className={chipClass(subjectActive(searchParams, chip.filters))}
                        event="position_filter_clicked"
                        href={subjectHref(searchParams, chip.filters)}
                        key={chip.label}
                        properties={{
                          filter_group: "discipline",
                          filter_value: chip.label,
                          result_count: subjectCount(intentPositions, searchParams, chip.filters)
                        }}
                      >
                        {chip.label}
                        <small>{subjectCount(intentPositions, searchParams, chip.filters)}</small>
                        {freshCount > 0 ? (
                          <span className="fresh-chip-badge" aria-label={freshLabel(freshCount)} title={freshLabel(freshCount)} />
                        ) : null}
                      </TrackedLink>
                    );
                  })}
                </div>
              </div>
          </div>
          {canShowPositionResults ? (
            <>
              <div className="results-header">
                <div>
                  <h2>
                    Posizioni aperte
                    <span className="results-count">{filtered.length} su {intentPositions.length}</span>
                    <span className="results-deadline-count">{closingSoon} scadenze entro 14 giorni</span>
                  </h2>
                </div>
              </div>
            </>
          ) : null}
          {!canShowPositionResults ? (
            <div className="empty-state guided-filter-state">
              <Search size={24} />
              <h3>Scegli un filtro per vedere le posizioni</h3>
              <p>
                Parti da un tipo di posizione o da una materia: mostreremo solo opportunità rilevanti, senza affollare la pagina.
              </p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="jobs-list">
              {filtered.map((position) => (
                <article className="job-card" key={position.id}>
                  <div className="job-card-top">
                    <div className="badges">
                      <span className="badge type">{position.positionType}</span>
                      <span className="badge">{position.discipline}</span>
                    </div>
                    <div className="card-side-actions">
                      <span className={deadlineClass(position.deadline)}>
                        <CalendarClock size={15} />
                        {deadlineLabel(position.deadline)}
                      </span>
                      <OpportunityActions
                        detailHref={`/positions/${position.id}`}
                        opportunityId={position.id}
                        opportunityType="position"
                        title={position.title}
                      />
                    </div>
                  </div>
                  <OpportunityPreview
                    detailHref={`/positions/${position.id}` as Route}
                    meta={`${position.institution} / ${position.ssd} / ${position.location}`}
                    sourceHref={position.sourceUrl}
                    summary={position.summary}
                    title={position.title}
                    triggerClassName="card-main-link preview-title-button"
                  >
                    <h3 className="job-title">{position.title}</h3>
                  </OpportunityPreview>
                  <p className="job-summary">{position.summary}</p>
                  <div className="job-meta">
                    <span>
                      <strong>{position.institution}</strong>
                    </span>
                    <span className="meta-with-icon"><MapPin size={14} />{position.location}</span>
                    <span>
                      <strong>{position.ssd}</strong>
                    </span>
                    <span>Pubblicato {formatDate(position.publishedAt)}</span>
                    <span>{position.sourceName}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={24} />
              <h3>Nessun bando trovato</h3>
              <p>
                  Il dataset MUR attuale non contiene risultati con questi filtri.
                Rimuovi un filtro o lancia un nuovo sync per aggiornare i dati.
              </p>
              <div className="empty-actions">
                <Link className="button secondary" href="/?intent=posizioni">
                  Mostra tutte le posizioni
                </Link>
                <Link className="button secondary" href="/?intent=posizioni&type=Contratto+di+ricerca">
                  Contratti di ricerca
                </Link>
                <Link className="button secondary" href="/?intent=posizioni&type=PhD">
                  PhD
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      ) : null}


      {intent === "bandi" ? (
      <section className="workspace">
        <div className="results">
          <div className="results-chips" aria-label="Filtri rapidi per grants">
            <div className="quick-filter-group">
              <span className="quick-filter-label">Programma</span>
              <div className="chip-row">
                {grantPrograms.map((program) => {
                  const count = grantCount(visibleGrants, searchParams, { program });

                  return (
                    <TrackedLink
                      className={chipClass(searchParams.program === program)}
                      event="grant_filter_clicked"
                      href={filterHref(searchParams, "program", program)}
                      key={program}
                      properties={{ filter_group: "program", filter_value: program, result_count: count }}
                    >
                      {program}
                      <small>{count}</small>
                    </TrackedLink>
                  );
                })}
              </div>
            </div>
            <div className="quick-filter-group">
              <span className="quick-filter-label">Materia</span>
              <div className="chip-row subject-chip-row">
                {subjectChips.map((chip) => (
                  <TrackedLink
                    className={chipClass(subjectActive(searchParams, chip.filters))}
                    event="grant_filter_clicked"
                    href={subjectHref(searchParams, chip.filters)}
                    key={chip.label}
                    properties={{
                      filter_group: "discipline",
                      filter_value: chip.label,
                      result_count: grantCount(visibleGrants, searchParams, chip.filters)
                    }}
                  >
                    {chip.label}
                    <small>{grantCount(visibleGrants, searchParams, chip.filters)}</small>
                  </TrackedLink>
                ))}
              </div>
            </div>
          </div>
          <div className="results-header">
            <div>
              <h2>
                Grants & Funding
                <span className="results-count">{filteredGrants.length} su {visibleGrants.length}</span>
              </h2>
            </div>
          </div>
          {filteredGrants.length > 0 ? (
            <div className="jobs-list">
              {filteredGrants.map((grant) => (
                <GrantCard grant={grant} key={grant.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={24} />
              <h3>Nessun grant trovato</h3>
              <p>Rimuovi un filtro o prova uno dei programmi principali.</p>
              <div className="empty-actions">
                <Link className="button secondary" href="/?intent=bandi">
                  Tutti i grants
                </Link>
                <Link className="button secondary" href="/?intent=bandi&program=PRIN">
                  PRIN
                </Link>
                <Link className="button secondary" href="/?intent=bandi&program=MSCA">
                  MSCA
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      ) : null}
      <footer className="site-footer" aria-label="Informazioni sul sito">
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/cookie">Cookie</Link>
        <Link href="/terms">Terms</Link>
      </footer>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function isVisibleGrant(grant: GrantOpportunity) {
  return grant.status === "open" || grant.status === "upcoming";
}

function isToday(value: string) {
  const today = new Date().toISOString().slice(0, 10);
  return value === today;
}

function daysUntil(value: string) {
  const today = new Date("2026-05-04T00:00:00");
  const deadline = new Date(`${value}T00:00:00`);
  return Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
}

function deadlineLabel(value: string) {
  const days = daysUntil(value);

  if (days < 0) {
    return "Scaduto";
  }

  if (days === 0) {
    return "Scade oggi";
  }

  if (days === 1) {
    return "Scade domani";
  }

  return `${days} giorni`;
}

function deadlineClass(value: string) {
  const days = daysUntil(value);

  if (days <= 7) {
    return "deadline-pill urgent";
  }

  if (days <= 14) {
    return "deadline-pill soon";
  }

  return "deadline-pill";
}

function grantStatusLabel(grant: GrantOpportunity) {
  if (grant.status === "open") {
    return "Aperto";
  }

  if (grant.status === "upcoming") {
    return "In apertura";
  }

  if (grant.status === "closed") {
    return "Chiuso";
  }

  return "Da verificare";
}

function GrantCard({ grant }: { grant: GrantOpportunity }) {
  return (
    <article className="job-card grant-card">
      <div className="job-card-top">
        <div className="badges">
          <span className="badge type">{grant.program}</span>
          <span className="badge funding">{grant.funder}</span>
          <span className="badge">{grant.discipline}</span>
        </div>
        <div className="card-side-actions">
          <span className="deadline-pill grant-status">
            <FileText size={15} />
            {grantStatusLabel(grant)}
          </span>
          <OpportunityActions
            detailHref={`/grants/${grant.id}`}
            opportunityId={grant.id}
            opportunityType="grant"
            title={grant.title}
          />
        </div>
      </div>
      <Link className="card-main-link" href={`/grants/${grant.id}`}>
        <h3 className="job-title">{grant.title}</h3>
      </Link>
      <p className="job-summary">{grant.summary}</p>
      <div className="grant-facts" aria-label="Informazioni grant">
        <span>
          <strong>Scadenza</strong>
          {formatGrantDeadline(grant.deadline)}
        </span>
        <span>
          <strong>Budget</strong>
          {grant.amount ?? "Da fonte ufficiale"}
        </span>
        <span>
          <strong>Eligibility</strong>
          {grant.eligibility}
        </span>
      </div>
      <div className="job-meta">
        <span>{grant.sourceName}</span>
        <span>{grant.sourceType === "official_call" ? "Call ufficiale" : "Fonte ufficiale"}</span>
      </div>
    </article>
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

function filterHref(searchParams: SearchParams, key: keyof SearchParams, value: string) {
  const params = new URLSearchParams();

  for (const [paramKey, paramValue] of Object.entries(searchParams)) {
    if (paramValue) {
      params.set(paramKey, paramValue);
    }
  }

  const currentValue = searchParams[key];

  if (key === "type" || key === "discipline") {
    const nextValues = toggleValue(currentValue, value);
    if (nextValues.length > 0) {
      params.set(key, nextValues.join("|"));
    } else {
      params.delete(key);
    }
  } else if (currentValue === value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  const query = params.toString();
  return (query ? `/?${query}` : "/") as Route;
}

function chipClass(active: boolean) {
  return active ? "quick-chip active" : "quick-chip";
}

function subjectHref(searchParams: SearchParams, filters: SubjectChip["filters"]) {
  const params = new URLSearchParams();

  for (const [paramKey, paramValue] of Object.entries(searchParams)) {
    if (paramValue && paramKey !== "q") {
      params.set(paramKey, paramValue);
    }
  }

  if (filters.discipline) {
    const nextValues = toggleValue(searchParams.discipline, filters.discipline);
    if (nextValues.length > 0) {
      params.set("discipline", nextValues.join("|"));
    } else {
      params.delete("discipline");
    }
  }

  const query = params.toString();
  return (query ? `/?${query}` : "/") as Route;
}

function subjectActive(searchParams: SearchParams, filters: SubjectChip["filters"]) {
  return (
    (!filters.q || searchParams.q === filters.q) &&
    (!filters.discipline || paramHasValue(searchParams.discipline, filters.discipline))
  );
}

function AuthFeedback({ status }: { status?: string }) {
  if (status === "signup-complete") {
    return (
      <div className="auth-feedback" role="status">
        <strong>Account creato.</strong>
        <span>Ora puoi salvare opportunità e ritrovarle in Le mie liste.</span>
      </div>
    );
  }

  if (status === "check-email") {
    return (
      <div className="auth-feedback" role="status">
        <strong>Account creato.</strong>
        <span>Controlla la mail per confermare l'accesso.</span>
      </div>
    );
  }

  return null;
}

function subjectCount(
  candidatePositions: typeof positions,
  searchParams: SearchParams,
  filters: SubjectChip["filters"]
) {
  return filterCount(candidatePositions, searchParams, filters);
}

function filterCount(
  candidatePositions: typeof positions,
  searchParams: SearchParams,
  overrides: Partial<SearchParams>
) {
  const candidateFilters = { ...searchParams, ...overrides };

  return candidatePositions.filter((position) => matchesFilters(position, candidateFilters)).length;
}

function freshPositionCount(
  candidatePositions: typeof positions,
  searchParams: SearchParams,
  overrides: Partial<SearchParams>
) {
  const candidateFilters = { ...searchParams, ...overrides };

  return candidatePositions.filter((position) => isToday(position.publishedAt) && matchesFilters(position, candidateFilters))
    .length;
}

function freshLabel(count: number) {
  return count === 1 ? "1 nuova oggi" : `${count} nuove oggi`;
}

function matchesFilters(position: (typeof positions)[number], searchParams: SearchParams) {
  const query = searchParams.q?.trim().toLowerCase() ?? "";
  const haystack = buildHaystack(position);

  return (
    (!query || haystack.includes(query)) &&
    (selectedValues(searchParams.type).length === 0 || selectedValues(searchParams.type).includes(position.positionType)) &&
    (selectedValues(searchParams.discipline).length === 0 || selectedValues(searchParams.discipline).includes(position.discipline)) &&
    (!searchParams.region || position.region === searchParams.region) &&
    (!searchParams.funding || position.fundingType === searchParams.funding)
  );
}

function selectedValues(value?: string) {
  return String(value ?? "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function heroClass(intent: Intent) {
  return intent === "posizioni"
    ? "hero detail-hero positions-hero"
    : intent === "bandi"
      ? "hero detail-hero grants-hero"
      : "hero";
}

async function getSavedPreview(profileId: string) {
  const result = await selectSupabase<SavedOpportunityRow>("saved_opportunities", {
    select: "opportunity_id,opportunity_type",
    profile_id: `eq.${profileId}`,
    order: "created_at.desc",
    limit: "20"
  });

  if (!result.ok || result.data.length === 0) return { count: 0, items: [] };

  const items = result.data
    .map((row) => {
      const match =
        row.opportunity_type === "grant"
          ? grants.find((grant) => grant.id === row.opportunity_id)
          : positions.find((position) => position.id === row.opportunity_id);

      if (!match) return undefined;

      return {
        label: row.opportunity_type === "grant" ? "Grant" : "Posizione",
        title: match.title
      };
    })
    .filter((item): item is { label: string; title: string } => Boolean(item));

  return {
    count: result.data.length,
    items
  };
}

function paramHasValue(currentValue: string | undefined, value: string) {
  return selectedValues(currentValue).includes(value);
}

function toggleValue(currentValue: string | undefined, value: string) {
  const values = selectedValues(currentValue);
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function grantCount(
  candidateGrants: GrantOpportunity[],
  searchParams: SearchParams,
  overrides: Partial<SearchParams>
) {
  const candidateFilters = { ...searchParams, ...overrides };

  return candidateGrants.filter((grant) => matchesGrantFilters(grant, candidateFilters)).length;
}

function matchesGrantFilters(grant: GrantOpportunity, searchParams: SearchParams) {
  const query = searchParams.q?.trim().toLowerCase() ?? "";
  const haystack = [
    grant.title,
    grant.program,
    grant.funder,
    grant.discipline,
    grant.status,
    grant.summary,
    grant.sourceName
  ]
    .join(" ")
    .toLowerCase();

  return (
    (!query || haystack.includes(query)) &&
    (!searchParams.program || grant.program === searchParams.program) &&
    (!searchParams.discipline ||
      grant.discipline === searchParams.discipline ||
      grant.discipline === "Tutte le discipline")
  );
}

function intentHref(searchParams: SearchParams, intent: "posizioni" | "bandi") {
  const params = new URLSearchParams();
  const excludedKeys =
    intent === "bandi" ? new Set(["intent", "type", "region", "funding"]) : new Set(["intent", "program"]);

  for (const [paramKey, paramValue] of Object.entries(searchParams)) {
    if (paramValue && !excludedKeys.has(paramKey)) {
      params.set(paramKey, paramValue);
    }
  }

  params.set("intent", intent);

  const query = params.toString();
  return (query ? `/?${query}` : "/") as Route;
}

function buildHaystack(position: (typeof positions)[number]) {
  return [
    position.title,
    position.institution,
    position.department,
    position.location,
    position.region,
    position.discipline,
    position.ssd,
    position.gsd,
    position.fundingType,
    position.summary,
    ...(position.requirements ?? [])
  ]
    .join(" ")
    .toLowerCase();
}

function buildHomeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: "Research Radar Italy",
        url: absoluteUrl("/"),
        description:
          "Research Radar Italy aggrega opportunita accademiche, posizioni di ricerca e funding call in Italia da fonti ufficiali."
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: "Research Radar Italy",
        url: absoluteUrl("/"),
        inLanguage: "it-IT",
        publisher: { "@id": absoluteUrl("/#organization") },
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/")}?intent=posizioni&q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebApplication",
        "@id": absoluteUrl("/#app"),
        name: "Research Radar Italy",
        url: absoluteUrl("/"),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        inLanguage: "it-IT",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR"
        },
        featureList: [
          "Ricerca posizioni accademiche in Italia",
          "Filtri per tipo di posizione e materia",
          "Grants & Funding da fonti ufficiali",
          "Preferiti e liste personali"
        ]
      }
    ]
  };
}










