import Link from "next/link";
import type { ReactNode } from "react";
import { Compass, ChartNoAxesCombined } from "lucide-react";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { latestInsight } from "@/lib/insight-editions";

export function EditorialArticle({ title, category, children, publishedOn = "26 ottobre 2026" }: { title: string; category: string; children: ReactNode; publishedOn?: string }) {
  return <main className="shell">
    <SiteTopbar />
    <article className="editorial-article">
      <nav className="editorial-nav" aria-label="Percorsi editoriali"><Link href="/">Home</Link><Link href="/guide">Guide</Link><Link href="/insights">Insights del mese</Link></nav>
      <header><p className="editorial-kicker">{category}</p><h1>{title}</h1><p className="editorial-date">Pubblicato il {publishedOn}</p></header>
      {children}
      <div className="detail-actions"><Link className="button primary" href="/posizioni">Esplora le opportunità aperte</Link></div>
    </article>
  </main>;
}

export function HomeEditorialLinks() {
  return <section className="home-editorial" aria-label="Guide e analisi sulla ricerca universitaria">
    <Link className="editorial-entry" href="/guide/cercare-opportunita-ricerca">
      <Compass className="editorial-entry-icon" size={23} aria-hidden="true" />
      <div className="editorial-entry-copy"><span className="editorial-kicker">Guida alla ricerca</span><h2>Stai cercando solo Postdoc?</h2>
      <p>Scopri quali altre opportunità valutare</p></div><strong><span className="editorial-entry-cta">Leggi la guida </span><span aria-hidden="true">→</span></strong>
    </Link>
    <Link className="editorial-entry editorial-entry-insights" href={latestInsight.path}>
      <ChartNoAxesCombined className="editorial-entry-icon" size={23} aria-hidden="true" />
      <div className="editorial-entry-copy"><span className="editorial-kicker">Insights · {latestInsight.month}</span><h2>{latestInsight.title}</h2>
      <p>{latestInsight.summary}</p></div><strong><span className="editorial-entry-cta">Leggi gli insight </span><span aria-hidden="true">→</span></strong>
    </Link>
  </section>;
}
