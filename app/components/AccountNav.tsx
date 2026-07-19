"use client";

import Link from "next/link";
import { ListChecks } from "lucide-react";

export const accountChangedEvent = "rr:account-changed";

export function AccountNav() {
  return (
    <nav className="account-actions" aria-label="Liste salvate">
      <Link className="account-icon-link" href="/lists" aria-label="Le mie liste salvate in questo browser" title="Le mie liste">
        <ListChecks size={17} />
        <span>Le mie liste</span>
      </Link>
    </nav>
  );
}
