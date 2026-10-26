import type { Metadata } from "next";
import Link from "next/link";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { absoluteUrl } from "@/lib/site-url";
export const metadata: Metadata = { title: "Insights del mese sulla ricerca universitaria", description: "Dati mensili dal catalogo Research Radar: posizioni, settori, sedi e temi della ricerca universitaria.", alternates: {canonical:absoluteUrl('/insights')} };
export default function Insights() {
  return <EditorialArticle category="Archivio mensile" title="Insights del mese"><p>Una fotografia mensile delle pubblicazioni nel nostro catalogo, con dati, fonti e metodo. I confronti nel tempo vengono presentati quando il perimetro è comparabile.</p><Link className="editorial-entry" href="/insights/2026-09"><span className="editorial-kicker">Settembre 2026</span><h2>Ricerca universitaria: settembre in 984 schede</h2><p>Posizioni, settori e temi del mese.</p><strong>Leggi gli insight →</strong></Link></EditorialArticle>;
}
