import Link from "next/link";
import type { ReactNode } from "react";
import { SiteTopbar } from "@/app/components/SiteTopbar";

export function EditorialArticle({ title, category, children }: { title: string; category: string; children: ReactNode }) {
  return <main className="shell">
    <SiteTopbar />
    <article className="editorial-article">
      <nav className="editorial-nav" aria-label="Percorsi editoriali"><Link href="/">Home</Link><Link href="/guide">Guide</Link><Link href="/insights">Insights del mese</Link></nav>
      <header><p className="editorial-kicker">{category}</p><h1>{title}</h1><p className="editorial-date">Pubblicato il 26 ottobre 2026</p></header>
      {children}
      <div className="detail-actions"><Link className="button primary" href="/posizioni">Esplora le opportunità aperte</Link></div>
    </article>
  </main>;
}

export function HomeEditorialLinks() {
  return <section className="home-editorial" aria-label="Guide e analisi sulla ricerca universitaria">
    <Link className="editorial-entry" href="/guide/cercare-opportunita-ricerca">
      <span className="editorial-kicker">Guida alla ricerca</span><h2>Non cercare soltanto “Postdoc”</h2>
      <p>Come ampliare la ricerca e confrontare le opportunità pertinenti.</p><strong>Leggi la guida →</strong>
    </Link>
    <Link className="editorial-entry editorial-entry-insights" href="/insights/2026-09">
      <span className="editorial-kicker">Insights del mese · Settembre 2026</span><h2>Un mese di ricerca, in 984 schede</h2>
      <p>Le posizioni, i settori e i temi presenti nel nostro catalogo.</p><strong>Leggi gli insight →</strong>
    </Link>
  </section>;
}
