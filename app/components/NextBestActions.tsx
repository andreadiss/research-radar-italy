"use client";

import { Copy, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { activateDialogKeyboard } from "@/lib/dialog-keyboard.mjs";

export function NextBestActions() {
  const shareInputRef = useRef<HTMLInputElement>(null);
  const shareTriggerRef = useRef<HTMLButtonElement>(null);
  const shareDialogRef = useRef<HTMLDivElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    if (!shareOpen || !shareDialogRef.current) return;
    return activateDialogKeyboard(shareDialogRef.current, shareTriggerRef.current, () => setShareOpen(false));
  }, [shareOpen]);

  function openShareModal() {
    setCopied(false);
    setCopyFailed(false);
    setShareOpen(true);
  }

  async function copyShareLink() {
    const shareUrl = window.location.origin;
    let success = false;
    try {
      await navigator.clipboard.writeText(shareUrl);
      success = true;
    } catch {
      shareInputRef.current?.select();
      try {
        success = document.execCommand("copy");
      } catch {
        success = false;
      }
    }
    setCopied(success);
    setCopyFailed(!success);
  }

  return (
    <section className="next-best-actions" aria-label="Condividi Research Radar">
      <div className="next-best-banner">
        <span className="next-best-icon" aria-hidden="true"><Send size={22} /></span>
        <strong>Passa il radar al tuo gruppo</strong>
        <button ref={shareTriggerRef} className="next-best-share-button" onClick={openShareModal} type="button">
          Condividi
        </button>
      </div>
      {shareOpen ? (
        <div ref={shareDialogRef} tabIndex={-1} className="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
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
            {copyFailed ? <p role="status">Seleziona il link e copialo manualmente.</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
