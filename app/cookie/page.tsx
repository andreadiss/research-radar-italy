import type { Metadata } from "next";
import Link from "next/link";
import { AccountNav } from "@/app/components/AccountNav";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy di Research Radar Italy: cookie tecnici, sessione e analytics.",
  alternates: { canonical: absoluteUrl("/cookie") }
};

export default function CookiePage() {
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
          <h1>Cookie Policy</h1>
          <p className="summary">Questa pagina spiega quali cookie e tecnologie simili possono essere usati da Research Radar Italy.</p>

          <h2>Cookie tecnici</h2>
          <p className="summary">
            Usiamo cookie tecnici necessari per login, sessione, sicurezza e preferenze dell'interfaccia. Questi cookie servono al funzionamento del servizio e non richiedono consenso opzionale.
          </p>

          <h2>Analytics</h2>
          <p className="summary">
            Usiamo Vercel Web Analytics e Speed Insights per misurare traffico, performance e interazioni aggregate. I dati aiutano a capire quali percorsi aiutano gli utenti a trovare opportunita rilevanti.
          </p>

          <h2>Cookie di terze parti</h2>
          <p className="summary">
            Il login con Google e i servizi Supabase/Vercel possono impostare cookie o gestire identificatori necessari al completamento dell'autenticazione e alla sicurezza del servizio.
          </p>

          <h2>Gestione</h2>
          <p className="summary">
            L'utente puo gestire o cancellare i cookie dalle impostazioni del browser. La rimozione dei cookie tecnici puo impedire il corretto funzionamento del login e delle liste salvate.
          </p>
        </article>
      </section>
    </main>
  );
}
