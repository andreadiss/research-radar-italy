"use client";

import { Copy, Send, X } from "lucide-react";
import { useRef, useState } from "react";

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
    <section className="next-best-actions" aria-label="Condividi Research Radar">
      <div className="next-best-banner">
        <span className="next-best-icon" aria-hidden="true"><Send size={22} /></span>
        <strong>Passa il radar al tuo gruppo</strong>
        <button className="next-best-share-button" onClick={openShareModal} type="button">
          Condividi
        </button>
      </div>
      {shareOpen ? (
        <div className="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
          <div className="preview-card share-modal-card">
            <button className="modal-close" onClick={() => setShareOpen(false)} type="button" aria-label="Chiudi">
              <X size={18} />
            </button>
            <h2 id="share-modal-title">Condividi Research Radar</h2>
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
