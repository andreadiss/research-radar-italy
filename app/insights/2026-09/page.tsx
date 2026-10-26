import type { Metadata } from "next";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Ricerca universitaria: settembre 2026 in 984 schede",
  description: "Insights di settembre: tipologie, settori, sedi e temi di 984 schede nel catalogo Research Radar. Dati, metodo e limiti del confronto mensile.",
  alternates: { canonical: absoluteUrl("/insights/2026-09") }
};

function DataTable({caption, rows}: {caption: string; rows: [string, number][]}) {
  return <table><caption>{caption}</caption><thead><tr><th scope="col">Categoria</th><th scope="col">Schede</th></tr></thead><tbody>{rows.map(([label,count])=><tr key={label}><th scope="row">{label}</th><td>{count}</td></tr>)}</tbody></table>;
}

export default function September() {
  return <EditorialArticle category="Insights del mese · Settembre 2026" title="Ricerca universitaria: settembre in 984 schede">
    <p><strong>Ingegneria e informatica guidano le pubblicazioni del nostro catalogo. Gli incarichi di ricerca rappresentano oltre metà delle schede. L’AI compare anche in progetti dedicati a energia ed educazione.</strong></p>
    <p>Abbiamo analizzato 984 schede pubblicate a settembre 2026, comprese quelle oggi scadute. Questa fotografia descrive il catalogo Research Radar, non l’intero mercato italiano.</p>
    <h2>Quali posizioni sono state pubblicate?</h2>
    <DataTable caption="Schede pubblicate dal 1° al 30 settembre 2026" rows={[["Incarichi di ricerca",537],["Postdoc",173],["Contratti di ricerca",105],["Ricercatori RTT",104],["Dottorati",23],["Professore II fascia",21],["Tecnologi",13],["Professore I fascia",8]]}/>
    <p>Gli incarichi rappresentano il 54,6% delle schede. Insieme a Postdoc e contratti arrivano all’82,8%: chi cerca opportunità dovrebbe esplorare più tipologie, verificando i requisiti di ciascun bando.</p>
    <h2>I settori più presenti</h2>
    <DataTable caption="Le cinque aree più rappresentate nel catalogo di settembre" rows={[["Ingegneria, informatica e AI",229],["Matematica, fisica e chimica",175],["Economia, diritto e politica",107],["Biologia, biotech e farmacia",92],["Medicina e salute",90]]}/>
    <p>Le prime due aree raccolgono il 41,1% delle schede. Tra i singoli SSD spiccano Sistemi di elaborazione delle informazioni (26), Fisica sperimentale della materia e applicazioni (23) e Informatica (18). In 149 schede il campo SSD non è specificato.</p>
    <h2>Quali temi emergono?</h2>
    <DataTable caption="Schede con almeno una menzione nelle cinque famiglie lessicali cercate" rows={[["Intelligenza artificiale e machine learning",65],["Energia",37],["Riferimenti neuro-",34],["Tumori e oncologia",34],["Clima",29]]}/>
    <p>I temi possono sovrapporsi. Nel catalogo troviamo, per esempio, “Energy Informatics per i sistemi energetici” e “Tecnologia, AI e trasformazione educativa”. Questi conteggi riguardano parole esplicite nei titoli e nelle descrizioni: non costituiscono una classifica completa dei temi della ricerca.</p>
    <h2>Dove si concentrano le pubblicazioni?</h2>
    <p>Lombardia, Lazio, Piemonte ed Emilia-Romagna raccolgono il 58,7% delle schede: rispettivamente 154, 152, 144 e 128.</p>
    <h2>Quali settori stanno crescendo?</h2>
    <p>Settembre è la nostra prima baseline mensile. Il catalogo contiene anche schede di agosto, ma la comparabilità della raccolta non è ancora verificata. Dai prossimi numeri confronteremo volumi e quote sullo stesso perimetro, distinguendo i cambiamenti osservati da variazioni nella raccolta.</p>
    <aside className="editorial-method"><h2>Fonte e metodo</h2><p>Fonte: dati MUR/Cineca raccolti da Research Radar, ultimo controllo riuscito il 21 ottobre 2026. Incluse tutte le schede presenti nella cache con pubblicazione dal 1° al 30 settembre, anche archiviate o scadute. Conteggio per ID, non per posti o assunzioni; eventuali duplicazioni tra procedure non consolidate. Le aree seguono la tassonomia del catalogo.</p>
    <p>Temi: ricerca testuale di “intelligenza artificiale”, “artificial intelligence”, “machine learning”, “deep learning”; parole che iniziano con “energ”, “climat”, “neuro”, “tumor”, “oncolog”, “cancer”, e “climate”. Famiglie sovrapposte, con possibili omissioni e riferimenti di contesto. <a href="https://github.com/andreadiss/research-radar-italy/blob/main/scripts/monthly-insights.mjs">Regole e calcolo riproducibile</a> sulla <a href="https://github.com/andreadiss/research-radar-italy/blob/7d79b65d2756053732e2fa9a0ae445cf77cac5a0/lib/generated/mur-positions.json">fonte versionata</a>.</p></aside>
  </EditorialArticle>;
}
