import type { Metadata } from "next";
import Link from "next/link";
import { AccountNav } from "@/app/components/AccountNav";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Termini di utilizzo",
  description: "Termini di utilizzo di Research Radar Italy.",
  alternates: { canonical: absoluteUrl("/terms") }
};

export default function TermsPage() {
  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Torna alla home page">
          <span className="brand-mark">R</span>
          <span>Research Radar Italy</span>
        </Link>
        <AccountNav />
      </header>
      <section className="detail-shell legal-shell">
        <article className="detail-card legal-card">
          <p className="legal-kicker">Ultimo aggiornamento: 16 maggio 2026</p>
          <h1>Termini di utilizzo</h1>
          <p className="summary">Usando Research Radar Italy accetti questi termini essenziali.</p>

          <h2>Servizio</h2>
          <p className="summary">
            Research Radar Italy aggrega, normalizza e rende consultabili opportunita accademiche, posizioni di ricerca e funding call provenienti da fonti pubbliche e ufficiali.
          </p>

          <h2>Accuratezza</h2>
          <p className="summary">
            Facciamo il possibile per mantenere dati aggiornati e link alle fonti ufficiali, ma l'utente deve sempre verificare requisiti, scadenze, allegati e modalita di candidatura sulla fonte ufficiale prima di prendere decisioni.
          </p>

          <h2>Account e preferiti</h2>
          <p className="summary">
            Le funzionalita di account, preferiti, liste e notifiche servono a organizzare opportunita e ricerche. L'utente e responsabile della correttezza delle informazioni inserite e della sicurezza delle proprie credenziali.
          </p>

          <h2>Limitazioni</h2>
          <p className="summary">
            Research Radar Italy non e affiliato al MUR, a Cineca o ad altri enti citati salvo indicazione esplicita. I marchi e i contenuti delle fonti ufficiali restano dei rispettivi titolari.
          </p>
        </article>
      </section>
    </main>
  );
}
