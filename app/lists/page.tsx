import type { Metadata } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { Bookmark } from "lucide-react";
import { LocalFavoritesList } from "@/app/components/LocalFavoritesList";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Le mie liste",
  description: "Preferiti salvati nel browser per riprendere posizioni e grants su Research Radar Italy.",
  alternates: { canonical: absoluteUrl("/lists") },
  robots: { index: false, follow: false }
};

export default function ListsPage() {
  return (
    <main className="shell">
      <SiteTopbar />

      <section className="detail-shell lists-shell">
        <div className="lists-heading">
          <Bookmark size={22} />
          <span>
            <h1>Le mie liste</h1>
            <p>Le opportunità salvate su questo browser.</p>
          </span>
        </div>

        <LocalFavoritesList excludedKeys={[]} showEmptyState />
      </section>
    </main>
  );
}
