import type { Metadata } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa privacy di Research Radar Italy: dati raccolti, finalita e diritti degli utenti.",
  alternates: { canonical: absoluteUrl("/privacy") }
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" subtitle="Come trattiamo i dati personali su Research Radar Italy." />;
}

function LegalPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <main className="shell">
      <SiteTopbar />
      <section className="detail-shell legal-shell">
        <article className="detail-card legal-card">
          <p className="legal-kicker">Ultimo aggiornamento: 16 maggio 2026</p>
          <h1>{title}</h1>
          <p className="summary">{subtitle}</p>

          <h2>Dati che raccogliamo</h2>
          <p className="summary">
            Nella release statica non raccogliamo account, password o sessioni di login. I preferiti sono salvati nel browser dell'utente. Possiamo raccogliere dati tecnici e aggregati tramite strumenti di analytics privacy-friendly per capire come viene usato il servizio.
          </p>

          <h2>Perche li usiamo</h2>
          <p className="summary">
            Usiamo i dati aggregati per migliorare navigazione, filtri, performance e qualita delle informazioni. Account, notifiche email e liste cross-device saranno introdotti solo dopo l'attivazione di un backend dedicato.
          </p>

          <h2>Fonti e dati pubblici</h2>
          <p className="summary">
            Le opportunita mostrate provengono da fonti pubbliche e ufficiali, incluse pagine MUR/Cineca e fonti istituzionali collegate. Research Radar Italy normalizza e organizza queste informazioni per renderle piu facili da consultare.
          </p>

          <h2>Diritti dell'utente</h2>
          <p className="summary">
            L'utente puo cancellare i preferiti locali dalle impostazioni del browser. Per richieste privacy, usare i contatti indicati nella pagina About fino all'attivazione di un indirizzo dedicato.
          </p>
        </article>
      </section>
    </main>
  );
}
