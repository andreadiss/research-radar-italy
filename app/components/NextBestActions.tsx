import type { Route } from "next";
import { BookmarkCheck, Search, Sparkles } from "lucide-react";
import { TrackedLink } from "@/app/components/TrackedLink";

type NextBestAction = {
  id: string;
  title: string;
  copy: string;
  cta: string;
  href: Route;
  event: string;
  asset: "signup";
};

export function NextBestActions({ isAuthenticated }: { isAuthenticated: boolean }) {
  const actions: NextBestAction[] = [];

  if (!isAuthenticated) {
    actions.push({
      id: "signup-save-searches",
      title: "Riparti da dove eri arrivato",
      copy: "Salva ricerche, posizioni e grant. Li ritrovi appena torni.",
      cta: "Attiva il tuo radar",
      href: "/signup?returnTo=%2F" as Route,
      event: "next_best_action_clicked",
      asset: "signup"
    });
  }

  if (actions.length === 0) return null;

  return (
    <section className="next-best-actions" aria-label="Azioni consigliate">
      <div className="next-best-track">
        {actions.map((action, index) => (
          <TrackedLink
            className="next-best-card"
            event={action.event}
            href={action.href}
            key={action.id}
            properties={{ action_id: action.id, position: index + 1 }}
          >
            <span className="next-best-asset" aria-hidden="true">
              <span className="asset-glow" />
              <span className="asset-window asset-window-main">
                <span />
                <strong>Medicina e salute</strong>
                <small>12 opportunità</small>
              </span>
              <span className="asset-window asset-window-secondary">
                <Search size={16} />
                <span>contratti a Milano</span>
              </span>
              <span className="asset-token asset-token-bookmark">
                <BookmarkCheck size={17} />
              </span>
              <span className="asset-token asset-token-spark">
                <Sparkles size={15} />
              </span>
            </span>
            <span className="next-best-copy">
              <small>Prossima azione</small>
              <strong>{action.title}</strong>
              <span>{action.copy}</span>
              <em>{action.cta}</em>
            </span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
