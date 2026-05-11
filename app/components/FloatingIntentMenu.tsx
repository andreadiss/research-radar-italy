"use client";

import Link from "next/link";
import type { Route } from "next";
import { FileText, Search } from "lucide-react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 24);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <nav
      aria-hidden={!visible}
      aria-label="Passa tra posizioni aperte e grants"
      className={visible ? "floating-menu visible" : "floating-menu"}
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
