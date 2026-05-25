"use client";

import Link from "next/link";
import type { Route } from "next";
import { FileText, Search } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

type FloatingIntentMenuProps = {
  grantsCount: number;
  grantsHref: Route;
  intent: "posizioni" | "bandi";
  positionsCount: number;
  positionsHref: Route;
};

export function FloatingIntentMenu({
  grantsCount,
  grantsHref,
  intent,
  positionsCount,
  positionsHref
}: FloatingIntentMenuProps) {
  const [visible, setVisible] = useState(false);
  const [viewportBottom, setViewportBottom] = useState(18);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 24);
    const updateViewportBottom = () => {
      const viewport = window.visualViewport;
      const dynamicInset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;

      setViewportBottom(Math.max(12, Math.round(dynamicInset + 12)));
    };

    updateVisibility();
    updateViewportBottom();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateViewportBottom);
    window.visualViewport?.addEventListener("resize", updateViewportBottom);
    window.visualViewport?.addEventListener("scroll", updateViewportBottom);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateViewportBottom);
      window.visualViewport?.removeEventListener("resize", updateViewportBottom);
      window.visualViewport?.removeEventListener("scroll", updateViewportBottom);
    };
  }, []);

  return (
    <nav
      aria-hidden={!visible}
      aria-label="Passa tra posizioni aperte e grants"
      className={visible ? "floating-menu visible" : "floating-menu"}
      style={{ "--floating-menu-bottom": `${viewportBottom}px` } as CSSProperties}
    >
      <Link className={floatingMenuClass(intent === "posizioni")} href={positionsHref}>
        <Search size={16} />
        <span>Posizioni aperte</span>
        <em>{positionsCount}</em>
      </Link>
      <Link className={floatingMenuClass(intent === "bandi")} href={grantsHref}>
        <FileText size={16} />
        <span>Grants & Funding</span>
        <em>{grantsCount}</em>
      </Link>
    </nav>
  );
}

function floatingMenuClass(active: boolean) {
  return active ? "floating-menu-link active" : "floating-menu-link";
}
