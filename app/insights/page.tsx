import type { Metadata } from "next";
import Link from "next/link";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { insightEditions } from "@/lib/insight-editions";
import { absoluteUrl } from "@/lib/site-url";
export const metadata: Metadata = { title: "Insights del mese sulla ricerca universitaria", description: "Dati mensili dal catalogo Research Radar: posizioni, settori, sedi e temi della ricerca universitaria.", alternates: {canonical:absoluteUrl('/insights')} };
export default function Insights() {
  return <EditorialArticle category="Archivio mensile" title="Insights del mese">
    <p>Una fotografia mensile delle pubblicazioni nel nostro catalogo, con dati, fonti e metodo. I confronti nel tempo vengono presentati quando il perimetro è comparabile.</p>
    {insightEditions.map((edition) => <Link className="editorial-entry" key={edition.path} href={edition.path}>
      <div className="editorial-entry-copy"><span className="editorial-kicker">{edition.month}</span>
        <h2>{edition.title}</h2><p>{edition.summary}</p></div>
      <strong>Leggi gli insight →</strong>
    </Link>)}
  </EditorialArticle>;
}
