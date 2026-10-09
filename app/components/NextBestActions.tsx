"use client";

import type { Route } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, Copy, Send, X } from "lucide-react";
import { useRef, useState } from "react";

type LinkAction = {
  label: string;
  title: string;
  description: string;
  cta: string;
  href: Route;
};

// Future editorial recommendations can use the same card with their real URLs.
const exploreAction: LinkAction = {
  label: "Esplora",
  title: "Trova la tua area di ricerca",
  description: "Sfoglia le opportunità per disciplina e tipologia, poi apri quelle pertinenti.",
  cta: "Apri l’indice",
  href: "/posizioni/indice/" as Route
};

export function NextBestActions() {
  const shareInputRef = useRef<HTMLInputElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function openShareModal() {
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
    setCopied(true);
  }

  return (
    <section className="next-best-actions" aria-labelledby="next-best-title">
      <div className="next-best-heading">
        <span>Continua la ricerca</span>
        <h2 id="next-best-title">Il prossimo passo</h2>
      </div>
      <div className="next-best-grid">
        <Link
          className="next-best-card next-best-card-explore"
          href={exploreAction.href}
        >
          <span className="next-best-icon" aria-hidden="true"><BookOpenText size={22} /></span>
          <span className="next-best-copy">
            <small>{exploreAction.label}</small>
            <strong>{exploreAction.title}</strong>
            <span>{exploreAction.description}</span>
          </span>
          <span className="next-best-cta">{exploreAction.cta} <ArrowUpRight size={17} aria-hidden="true" /></span>
        </Link>
        <button className="next-best-card next-best-card-share" onClick={openShareModal} type="button">
          <span className="next-best-icon" aria-hidden="true"><Send size={22} /></span>
          <span className="next-best-copy">
            <small>Condividi</small>
            <strong>Porta il radar nel tuo gruppo</strong>
            <span>Passa il link a colleghi e dottorandi che cercano nuove opportunità.</span>
          </span>
          <span className="next-best-cta">Apri condivisione <ArrowUpRight size={17} aria-hidden="true" /></span>
        </button>
      </div>
      {shareOpen ? (
        <div className="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
          <div className="preview-card share-modal-card">
            <button className="modal-close" onClick={() => setShareOpen(false)} type="button" aria-label="Chiudi">
              <X size={18} />
            </button>
            <span className="preview-kicker">Condividi Research Radar</span>
            <h2 id="share-modal-title">Passa il radar al tuo gruppo</h2>
            <p>Copia il link e invialo a colleghi, dottorandi o persone del tuo lab che stanno cercando opportunità accademiche in Italia.</p>
            <div className="share-link-box">
              <input aria-label="Link da condividere" readOnly ref={shareInputRef} value={typeof window === "undefined" ? "https://rritaly.com" : window.location.origin} />
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
