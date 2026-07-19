import type { Metadata } from "next";
import Link from "next/link";
import { AccountNav } from "@/app/components/AccountNav";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy di Research Radar Italy: preferenze locali e analytics.",
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
            Nella release statica non usiamo cookie di login o sessione. Le liste salvate usano memoria locale del browser e restano sul dispositivo dell'utente.
          </p>

          <h2>Analytics</h2>
          <p className="summary">
            Usiamo strumenti di analytics e performance per misurare traffico e interazioni aggregate. I dati aiutano a capire quali percorsi aiutano gli utenti a trovare opportunita rilevanti.
          </p>

          <h2>Cookie di terze parti</h2>
          <p className="summary">
            I servizi di terze parti possono essere introdotti in futuro per autenticazione, notifiche o pagamenti. In quel caso questa policy sara aggiornata prima del rilascio.
          </p>

          <h2>Gestione</h2>
          <p className="summary">
            L'utente puo cancellare preferiti locali e dati del sito dalle impostazioni del browser. La cancellazione rimuove le liste salvate su quel dispositivo.
          </p>
        </article>
      </section>
    </main>
  );
}
