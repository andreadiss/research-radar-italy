"use client";

import type { Route } from "next";
import { BookmarkCheck, ChevronLeft, ChevronRight, Copy, Search, Send, Sparkles, Star, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { useRef, useState, type PointerEvent } from "react";
import { TrackedLink } from "@/app/components/TrackedLink";

type NextBestAction = {
  id: string;
  title: string;
  copy: string;
  href: Route;
  event: string;
  asset: "signup" | "favorite" | "share";
  visualTitle: string;
  visualMeta: string;
  visualQuery: string;
};

export function NextBestActions({ isAuthenticated }: { isAuthenticated: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const actions: NextBestAction[] = [];

  if (!isAuthenticated) {
    actions.push({
      id: "signup-save-searches",
      title: "Riparti da dove eri arrivato",
      copy: "Salva ricerche, posizioni e grant. Li ritrovi appena torni.",
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

  function handlePointerStart(event: PointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;

    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(deltaX) < 36) return;
    scrollActions(deltaX < 0 ? "right" : "left");
  }

  function openShareModal() {
    track("next_best_action_clicked", {
      action_id: "share-colleagues",
      position: activeIndex + 1
    });
    setCopied(false);
    setShareOpen(true);
  }

  async function copyShareLink() {
    const shareUrl = window.location.origin;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      shareInputRef.current?.select();
      document.execCommand("copy");
    }
    track("share_link_copied", { share_url: shareUrl });
    setCopied(true);
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
        onPointerDown={handlePointerStart}
        onPointerUp={handlePointerEnd}
        ref={trackRef}
      >
        {orderedActions.map(({ action, originalIndex }, index) => {
          const cardContent = (
            <>
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
            </span>
            </>
          );

          return action.asset === "share" ? (
            <button
              className={`next-best-card next-best-card-button${index === 0 ? " is-active" : ""}`}
              key={action.id}
              onClick={openShareModal}
              type="button"
            >
              {cardContent}
            </button>
          ) : (
            <TrackedLink
              className={`next-best-card${index === 0 ? " is-active" : ""}`}
              event={action.event}
              href={action.href}
              key={action.id}
              properties={{ action_id: action.id, position: originalIndex + 1 }}
            >
              {cardContent}
            </TrackedLink>
          );
        })}
      </div>
      <button
        aria-label="Mostra azione successiva"
        className="next-best-arrow next-best-arrow-right"
        onClick={() => scrollActions("right")}
        type="button"
      >
        <ChevronRight size={17} />
      </button>
      {shareOpen ? (
        <div className="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
          <div className="preview-card share-modal-card">
            <button className="modal-close" onClick={() => setShareOpen(false)} type="button" aria-label="Chiudi">
              <X size={18} />
            </button>
            <span className="preview-kicker">Condividi Research Radar</span>
            <h2 id="share-modal-title">Passa il radar al tuo gruppo</h2>
            <p>
              Copia il link e invialo a colleghi, dottorandi o persone del tuo lab che stanno cercando opportunità
              accademiche in Italia.
            </p>
            <div className="share-link-box">
              <input
                aria-label="Link da condividere"
                readOnly
                ref={shareInputRef}
                value={typeof window === "undefined" ? "https://research-radar-italy.vercel.app" : window.location.origin}
              />
              <button className="button primary" onClick={copyShareLink} type="button">
                <Copy size={16} />
                {copied ? "Copiato" : "Copia link"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
