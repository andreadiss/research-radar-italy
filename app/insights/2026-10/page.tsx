import type { Metadata } from "next";
import Link from "next/link";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { october2026Insight as edition } from "@/lib/insight-editions";
import { absoluteUrl } from "@/lib/site-url";

const source = "https://github.com/andreadiss/research-radar-italy/blob/340f35f854a88886e784bd823dfe487e4d963c0a";

export const metadata: Metadata = {
  title: edition.title,
  description: "Insights di ottobre 2026: tipi di posizione, settori e temi in 929 schede di ricerca universitaria raccolte da Research Radar Italy.",
  alternates: { canonical: absoluteUrl(edition.path) }
};

function DataTable({ caption, label, rows }: {
  caption: string;
  label: string;
  rows: [string, number][];
}) {
  return <table>
    <caption>{caption}</caption>
    <thead><tr><th scope="col">{label}</th><th scope="col">Schede</th></tr></thead>
    <tbody>{rows.map(([name, count]) => <tr key={name}><th scope="row">{name}</th><td>{count}</td></tr>)}</tbody>
  </table>;
}

export default function October() {
  return <EditorialArticle category="Insights del mese · Ottobre 2026" title={edition.title} publishedOn="7 novembre 2026">
    <p><strong>Gli incarichi di ricerca sono la tipologia più frequente. L’area più rappresentata è «Ingegneria, informatica e AI». Tra i cinque temi cercati nei testi, l’intelligenza artificiale e il machine learning sono i più citati.</strong></p>
    <p>Abbiamo analizzato 929 schede con data di pubblicazione a ottobre, incluse quelle oggi scadute. È una fotografia dei bandi raccolti da Research Radar Italy, non un censimento del mercato italiano.</p>

    <h2>Le posizioni: non solo Postdoc</h2>
    <DataTable caption="Schede per tipologia, 1–31 ottobre 2026" label="Tipologia" rows={[
      ["Incarichi di ricerca", 375], ["Postdoc", 236], ["Contratti di ricerca", 134],
      ["Ricercatori RTT", 108], ["Professore II fascia", 27], ["Professore I fascia", 19],
      ["Tecnologi", 19], ["Dottorati", 11]
    ]} />
    <p>Incarichi, postdoc e contratti sono 745 schede su 929, circa l’80%. Se cerchi per tema, vale la pena controllare più di una tipologia: attività e requisiti cambiano da bando a bando.</p>

    <h2>I settori più presenti</h2>
    <DataTable caption="Le cinque aree più rappresentate nel catalogo" label="Area" rows={[
      ["Ingegneria, informatica e AI", 200], ["Matematica, fisica e chimica", 147],
      ["Medicina e salute", 99], ["Biologia, biotech e farmacia", 94], ["Economia, diritto e politica", 94]
    ]} />
    <p>Le prime due aree raccolgono 347 schede, il 37,4%. Tra i settori scientifico-disciplinari (SSD) registrati compaiono più spesso Sistemi di elaborazione delle informazioni (20), Elettronica (18) e Fisica sperimentale della materia e applicazioni (16). In 126 schede il campo SSD non è indicato nel catalogo.</p>

    <h2>I temi che ricorrono nei testi</h2>
    <DataTable caption="Schede con almeno una menzione, per tema cercato" label="Tema" rows={[
      ["IA e machine learning", 60], ["Energia", 44], ["Riferimenti «neuro-»", 40],
      ["Tumori e oncologia", 25], ["Clima", 23]
    ]} />
    <p>Una scheda può comparire in più righe. Sono menzioni nei titoli e nelle sintesi, non una misura di quanti progetti siano dedicati principalmente a ciascun tema.</p>

    <h2>Dove si concentrano le schede</h2>
    <p>Lazio (168), Emilia-Romagna (147) e Lombardia (145) sono le regioni più rappresentate nel catalogo di ottobre. La localizzazione registrata va verificata nel bando se la sede è un criterio di scelta.</p>

    <h2>Possiamo dire cosa cresce?</h2>
    <p>Non ancora. L’<Link href="/insights/2026-09">edizione di settembre</Link> resta consultabile, ma non abbiamo verificato che la raccolta copra i due mesi allo stesso modo. Un divario nei conteggi potrebbe riflettere bandi mancanti, non un cambiamento del mercato.</p>

    <aside className="editorial-method">
      <h2>Fonte e metodo</h2>
      <p>Dati MUR/Cineca raccolti da Research Radar Italy, ultimo controllo riuscito il 7 novembre 2026. Abbiamo contato gli ID delle schede presenti nel catalogo con data di pubblicazione dal 1° al 31 ottobre, anche se scadute o archiviate. Non sono conteggi di posti, assunzioni o bandi ancora aperti. Il controllo dopo fine mese non garantisce una raccolta esaustiva.</p>
      <p>Per i temi abbiamo cercato «intelligenza artificiale», «artificial intelligence», «machine learning» e «deep learning», oltre alle radici energ-, climat-, neuro-, tumor-, oncolog-, cancer- e al termine «climate». La ricerca può includere riferimenti di contesto e perdere sinonimi. Consulta <a href={source + "/lib/generated/mur-positions.json"}>lo snapshot dei dati</a> e <a href={source + "/scripts/monthly-insights.mjs"}>lo script di calcolo</a>.</p>
    </aside>
    <p>Per candidarti, verifica scadenza e requisiti nel bando ufficiale. <Link href="/guide/leggere-bando-ricerca">Come leggere un bando</Link>.</p>
  </EditorialArticle>;
}
