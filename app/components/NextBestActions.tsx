"use client";

import type { Route } from "next";
import { BookmarkCheck, ChevronLeft, ChevronRight, Search, Send, Sparkles, Star } from "lucide-react";
import { useRef, useState } from "react";
import { TrackedLink } from "@/app/components/TrackedLink";

type NextBestAction = {
  id: string;
  title: string;
  copy: string;
  cta: string;
  href: Route;
  event: string;
  asset: "signup" | "favorite" | "share";
  visualTitle: string;
  visualMeta: string;
  visualQuery: string;
};

export function NextBestActions({ isAuthenticated }: { isAuthenticated: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const actions: NextBestAction[] = [];

  if (!isAuthenticated) {
    actions.push({
      id: "signup-save-searches",
      title: "Riparti da dove eri arrivato",
      copy: "Salva ricerche, posizioni e grant. Li ritrovi appena torni.",
      cta: "Attiva il tuo radar",
      href: "/signup?returnTo=%2F" as Route,
      event: "next_best_action_clicked",
      asset: "signup",
      visualTitle: "Medicina e salute",
      visualMeta: "12 opportunità",
      visualQuery: "contratti a Milano"
    });
  }

  actions.push(
    {
      id: "browser-favorite",
      title: "Tienilo a portata di mano",
      copy: "Salva Research Radar nei preferiti del browser e torna qui quando cerchi nuovi bandi.",
      cta: "Salvalo nei preferiti",
      href: "/" as Route,
      event: "next_best_action_clicked",
      asset: "favorite",
      visualTitle: "Preferiti",
      visualMeta: "Research Radar",
      visualQuery: "ritorna in un tap"
    },
    {
      id: "share-colleagues",
      title: "Condividilo con il tuo gruppo",
      copy: "Mandalo a colleghi, dottorandi o lab: aiuta tutti a non perdere nuove call.",
      cta: "Condividi il link",
      href: "/" as Route,
      event: "next_best_action_clicked",
      asset: "share",
      visualTitle: "Lab update",
      visualMeta: "nuove call",
      visualQuery: "inoltra ai colleghi"
    }
  );

  if (actions.length === 0) return null;

  const orderedActions = actions.map((_, offset) => {
    const index = (activeIndex + offset) % actions.length;
    return {
      action: actions[index],
      originalIndex: index
    };
  });

  function scrollActions(direction: "left" | "right") {
    const nextIndex = direction === "right"
      ? Math.min(activeIndex + 1, actions.length - 1)
      : Math.max(activeIndex - 1, 0);

    setActiveIndex(nextIndex);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const deltaX = event.changedTouches[0]?.clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 36) return;
    scrollActions(deltaX < 0 ? "right" : "left");
  }

  return (
    <section className="next-best-actions" aria-label="Azioni consigliate">
      <button
        aria-label="Mostra azione precedente"
        className="next-best-arrow next-best-arrow-left"
        onClick={() => scrollActions("left")}
        type="button"
      >
        <ChevronLeft size={17} />
      </button>
      <div
        className="next-best-track"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        ref={trackRef}
      >
        {orderedActions.map(({ action, originalIndex }, index) => (
          <TrackedLink
            className={`next-best-card${index === 0 ? " is-active" : ""}`}
            event={action.event}
            href={action.href}
            key={action.id}
            properties={{ action_id: action.id, position: originalIndex + 1 }}
          >
            <span className={`next-best-asset asset-${action.asset}`} aria-hidden="true">
              <span className="asset-glow" />
              <span className="asset-window asset-window-main">
                <span />
                <strong>{action.visualTitle}</strong>
                <small>{action.visualMeta}</small>
              </span>
              <span className="asset-window asset-window-secondary">
                {action.asset === "share" ? <Send size={16} /> : <Search size={16} />}
                <span>{action.visualQuery}</span>
              </span>
              <span className="asset-token asset-token-bookmark">
                {action.asset === "favorite" ? <Star size={17} /> : <BookmarkCheck size={17} />}
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
      <button
        aria-label="Mostra azione successiva"
        className="next-best-arrow next-best-arrow-right"
        onClick={() => scrollActions("right")}
        type="button"
      >
        <ChevronRight size={17} />
      </button>
    </section>
  );
}
