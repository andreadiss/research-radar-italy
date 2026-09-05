import type { Metadata, Route } from "next";
import Link from "next/link";
import { SiteTopbar } from "@/app/components/SiteTopbar";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { directoryItems, directoryPageCount, directoryPageSize, directoryPath } from "@/lib/opportunity-directory";

export function directoryMetadata(page: number): Metadata {
  return {
    title: `Opportunità accademiche per scadenza${page > 1 ? ` – pagina ${page}` : ""}`,
    description: `Consulta le posizioni accademiche aperte in Italia in ordine di scadenza, con ente, disciplina e link alle schede. Pagina ${page}.`,
    alternates: { canonical: absoluteUrl(directoryPath(page)) }
  };
}

export function OpportunityDirectory({ page = 1 }: { page?: number }) {
  const all = directoryItems();
  const pageCount = directoryPageCount();
  const items = all.slice((page - 1) * directoryPageSize, page * directoryPageSize);
  return <main className="shell">
    <SiteTopbar />
    <section className="detail-shell seo-landing-shell">
      <Link href="/posizioni" className="back-link">Torna ai filtri delle posizioni</Link>
      <article className="seo-landing-card">
        <h1>Opportunità accademiche per scadenza{page > 1 ? ` – pagina ${page}` : ""}</h1>
        <p>{all.length} schede con scadenza non trascorsa nell'ultima raccolta MUR/Cineca. Pagina {page} di {pageCount}. Requisiti e disponibilità vanno confermati sul bando ufficiale.</p>
        <section className="seo-opportunity-list" aria-label="Opportunità aperte">
          {items.map((item) => <Link className="seo-result-link" key={item.id} href={`/positions/${item.id}`}>
            <strong>{item.title}</strong>
            <small>{item.institution} · {item.positionType} · {item.discipline} · Scadenza <time dateTime={item.deadline}>{item.deadline}</time></small>
          </Link>)}
          {!items.length ? <p>Non risultano opportunità aperte nell'ultima raccolta.</p> : null}
        </section>
        <nav className="seo-related-links" aria-label="Pagine delle opportunità">
          {page > 1 ? <Link href={directoryPath(page - 1) as Route}>Pagina precedente</Link> : null}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => number === page
            ? <strong key={number} aria-current="page">{number}</strong>
            : <Link key={number} href={directoryPath(number) as Route} aria-label={`Pagina ${number}`}>{number}</Link>)}
          {page < pageCount ? <Link href={directoryPath(page + 1) as Route}>Pagina successiva</Link> : null}
        </nav>
      </article>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
      "@context": "https://schema.org", "@type": "CollectionPage", name: "Opportunità accademiche per scadenza", url: absoluteUrl(directoryPath(page)),
      mainEntity: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: absoluteUrl(`/positions/${item.id}`) })) }
    }) }} />
  </main>;
}
