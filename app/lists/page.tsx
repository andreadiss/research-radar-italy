import Link from "next/link";
import type { Route } from "next";
import { Bookmark, ExternalLink } from "lucide-react";
import { AccountNav } from "@/app/components/AccountNav";
import { grants } from "@/lib/grants";
import { positions } from "@/lib/positions";
import { getCurrentAccount } from "@/lib/server/session";
import { selectSupabase } from "@/lib/server/supabase-rest";

type SavedOpportunityRow = {
  opportunity_id: string;
  opportunity_type: "position" | "grant";
  status: string;
  created_at: string;
};

type SavedListItem = {
  detailHref: Route;
  label: string;
  meta: string;
  savedAt: string;
  title: string;
};

export default async function ListsPage() {
  const account = await getCurrentAccount();
  const items = account?.profileId ? await getSavedItems(account.profileId) : [];

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Torna alla home page">
          <span className="brand-mark">R</span>
          <span>Research Radar Italy</span>
        </Link>
        <AccountNav />
      </header>

      <section className="detail-shell lists-shell">
        <div className="lists-heading">
          <Bookmark size={22} />
          <span>
            <h1>Le mie liste</h1>
            <p>Le opportunità che hai salvato per riprenderle senza cercarle di nuovo.</p>
          </span>
        </div>

        {!account ? (
          <div className="empty-state">
            <Bookmark size={24} />
            <h3>Accedi per vedere i preferiti</h3>
            <p>Salva posizioni e grant nel tuo account e ritrovali qui.</p>
            <Link className="button primary" href="/login?returnTo=/lists">
              Login
            </Link>
          </div>
        ) : items.length > 0 ? (
          <div className="saved-list">
            {items.map((item) => (
              <article className="saved-list-card" key={`${item.label}-${item.detailHref}`}>
                <div>
                  <span className="badge type">{item.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.meta}</p>
                  <small>Salvata il {formatDate(item.savedAt)}</small>
                </div>
                <Link className="button secondary" href={item.detailHref}>
                  <ExternalLink size={16} />
                  Apri
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Bookmark size={24} />
            <h3>Nessun preferito salvato</h3>
            <p>Apri una posizione o un grant e usa l'icona bookmark per aggiungerlo alla lista.</p>
            <Link className="button primary" href="/?intent=posizioni">
              Trova opportunità
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

async function getSavedItems(profileId: string): Promise<SavedListItem[]> {
  const result = await selectSupabase<SavedOpportunityRow>("saved_opportunities", {
    select: "opportunity_id,opportunity_type,status,created_at",
    profile_id: `eq.${profileId}`,
    order: "created_at.desc"
  });

  if (!result.ok) return [];

  return result.data
    .map((row) => {
      if (row.opportunity_type === "grant") {
        const grant = grants.find((item) => item.id === row.opportunity_id);
        if (!grant) return undefined;

        return {
          detailHref: `/grants/${grant.id}` as Route,
          label: "Grant",
          meta: `${grant.program} / ${grant.funder}`,
          savedAt: row.created_at,
          title: grant.title
        };
      }

      const position = positions.find((item) => item.id === row.opportunity_id);
      if (!position) return undefined;

      return {
        detailHref: `/positions/${position.id}` as Route,
        label: "Posizione",
        meta: `${position.institution} / ${position.ssd}`,
        savedAt: row.created_at,
        title: position.title
      };
    })
    .filter((item): item is SavedListItem => Boolean(item));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
