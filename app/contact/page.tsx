import type { Metadata } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { ExternalLink } from "lucide-react";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Contatta Research Radar Italy per segnalare una fonte, correggere una scheda o proporre una collaborazione.",
  alternates: { canonical: absoluteUrl("/contact") }
};

export default function ContactPage() {
  return (
    <main className="shell">
      <SiteTopbar />
      <section className="detail-shell legal-shell">
        <article className="detail-card legal-card">
          <p className="legal-kicker">Contatti</p>
          <h1>Segnala una fonte o una correzione</h1>
          <p className="summary">Research Radar Italy migliora anche grazie alle segnalazioni di ricercatori, universita ed enti. Puoi indicare un bando mancante, un dato da correggere o una nuova fonte ufficiale.</p>
          <h2>Cosa includere</h2>
          <p className="summary">Inserisci il link alla fonte ufficiale, una breve descrizione e, se possibile, la categoria corretta dell'opportunita. Non inviare dati personali o documenti di candidatura.</p>
          <div className="detail-actions">
            <a className="button primary" href="https://github.com/andreadiss/research-radar-italy/issues/new" rel="noreferrer" target="_blank">
              Apri una segnalazione
              <ExternalLink size={16} />
            </a>
            <Link className="button secondary" href="/about">Come funziona il radar</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
