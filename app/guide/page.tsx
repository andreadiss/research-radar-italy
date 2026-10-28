import type { Metadata } from "next";
import Link from "next/link";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { absoluteUrl } from "@/lib/site-url";
export const metadata: Metadata = { title: "Guide per cercare opportunità nella ricerca", description: "Guide pratiche per orientarsi tra bandi, requisiti e opportunità nella ricerca universitaria.", alternates:{canonical:absoluteUrl('/guide')} };
export default function Guides() {
  return <EditorialArticle category="Orientarsi nella ricerca" title="Guide alla ricerca"><p>Indicazioni pratiche per trovare e confrontare opportunità pertinenti al tuo profilo.</p><Link className="editorial-entry" href="/guide/cercare-opportunita-ricerca"><h2>Non cercare soltanto “Postdoc”</h2><p>Come ampliare la ricerca e confrontare le opportunità.</p><strong>Leggi la guida →</strong></Link><Link className="editorial-entry" href="/guide/leggere-bando-ricerca"><h2>Come leggere un bando di ricerca</h2><p>Otto controlli prima di preparare la candidatura.</p><strong>Leggi la guida →</strong></Link></EditorialArticle>;
}
