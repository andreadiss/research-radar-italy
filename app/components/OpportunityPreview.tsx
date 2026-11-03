"use client";

import Link from "next/link";
import type { Route } from "next";
import { ExternalLink, X } from "lucide-react";
import { track } from "@/lib/client-analytics";
import { useEffect, useRef, useState } from "react";
import { activateDialogKeyboard } from "@/lib/dialog-keyboard.mjs";

type OpportunityPreviewProps = {
  children: React.ReactNode;
  detailHref: Route;
  meta: string;
  sourceHref?: string;
  summary: string;
  title: string;
  triggerClassName?: string;
};

export function OpportunityPreview({
  children,
  detailHref,
  meta,
  sourceHref,
  summary,
  title,
  triggerClassName
}: OpportunityPreviewProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    return activateDialogKeyboard(dialogRef.current, triggerRef.current, () => setOpen(false));
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className={triggerClassName ?? "preview-trigger"}
        onClick={() => {
          track("opportunity_preview_opened", {
            detail_href: detailHref,
            has_source: Boolean(sourceHref)
          });
          setOpen(true);
        }}
        type="button"
      >
        {children}
      </button>
      {open ? (
        <div ref={dialogRef} tabIndex={-1} className="preview-overlay" role="dialog" aria-modal="true" aria-labelledby="opportunity-preview-title">
          <div className="preview-card">
            <button className="modal-close" onClick={() => setOpen(false)} type="button" aria-label="Chiudi anteprima">
              <X size={18} />
            </button>
            <span className="preview-kicker">Anteprima bando</span>
            <h2 id="opportunity-preview-title">{title}</h2>
            <p className="preview-meta">{meta}</p>
            <p>{summary}</p>
            <div className="preview-actions">
              <Link
                className="button primary"
                href={detailHref}
                onClick={() => track("opportunity_detail_opened", { detail_href: detailHref })}
              >
                Apri pagina
              </Link>
              {sourceHref ? (
                <a
                  className="button secondary"
                  href={sourceHref}
                  onClick={() => track("official_source_opened", { source_href: sourceHref })}
                >
                  <ExternalLink size={16} />
                  Sito ufficiale
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
