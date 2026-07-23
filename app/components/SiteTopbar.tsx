"use client";

import Link from "next/link";
import { AccountNav } from "@/app/components/AccountNav";
import { LastUpdateBadge } from "@/app/components/LastUpdateBadge";

export function SiteTopbar() {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Torna alla home page">
        <span className="brand-mark">R</span>
        <span>Research Radar Italy</span>
      </Link>
      <div className="topbar-actions">
        <LastUpdateBadge />
        <AccountNav />
      </div>
    </header>
  );
}