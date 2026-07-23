import type { Metadata } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Termini di utilizzo",
  description: "Termini di utilizzo di Research Radar Italy.",
  alternates: { canonical: absoluteUrl("/terms") }
};

export default function TermsPage() {
  return (
    <main className="shell">
      <SiteTopbar />
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

          <h2>Preferiti locali</h2>
          <p className="summary">
            Le liste salvate nella release statica restano nel browser dell'utente e servono solo a organizzare opportunita e ricerche su quel dispositivo. Account, notifiche e preferiti cross-device saranno disponibili solo dopo l'attivazione di un backend dedicato.
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
