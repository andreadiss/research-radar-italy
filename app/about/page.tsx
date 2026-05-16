import type { Metadata } from "next";
import Link from "next/link";
import { AccountNav } from "@/app/components/AccountNav";

export const metadata: Metadata = {
  title: "About",
  description: "Cos'e Research Radar Italy e perche aiuta ricercatori, dottorandi e candidati a trovare opportunita accademiche in Italia.",
  alternates: { canonical: "https://research-radar-italy.vercel.app/about" }
};

export default function AboutPage() {
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
          <p className="legal-kicker">Research Radar Italy</p>
          <h1>Academic jobs e funding in Italia, piu facili da trovare.</h1>
          <p className="summary">
            Research Radar Italy nasce per aiutare dottorandi, postdoc, ricercatori early-career e candidati internazionali a trovare rapidamente posizioni accademiche, contratti di ricerca e grant in Italia.
          </p>

          <h2>Cosa facciamo</h2>
          <p className="summary">
            Aggreghiamo opportunita da fonti ufficiali, partendo da MUR/Cineca e dai principali programmi di funding. Normalizziamo titoli, enti, materie, scadenze e link alle fonti per ridurre il tempo perso tra portali diversi.
          </p>

          <h2>Per chi e utile</h2>
          <p className="summary">
            Il prodotto e pensato per chi deve valutare molte opportunita in poco tempo: PhD candidates, assegnisti, postdoc, ricercatori, candidati a grant e persone che seguono call PRIN, PNRR, ERC, MSCA o Horizon.
          </p>

          <h2>Principio guida</h2>
          <p className="summary">
            Le informazioni devono essere leggibili, filtrabili e collegate alla fonte ufficiale. Research Radar non sostituisce il bando ufficiale: lo rende piu facile da scoprire e confrontare.
          </p>

          <div className="detail-actions">
            <Link className="button primary" href="/?intent=posizioni">Vedi posizioni aperte</Link>
            <Link className="button secondary" href="/?intent=bandi">Vedi Grants & Funding</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
