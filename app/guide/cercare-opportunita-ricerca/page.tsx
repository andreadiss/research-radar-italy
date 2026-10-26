import type { Metadata } from "next";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Non cercare soltanto Postdoc: trovare opportunità nella ricerca",
  description: "Come orientarsi tra incarichi, Postdoc, contratti e RTT: argomento, settore scientifico, sede e scadenza da confrontare.",
  alternates: { canonical: absoluteUrl("/guide/cercare-opportunita-ricerca") }
};

export default function Guide() {
  return <EditorialArticle category="Guida alla ricerca" title="Non cercare soltanto “Postdoc”: come trovare più opportunità nella ricerca">
    <p>Cercare una posizione nella ricerca universitaria partendo da una sola parola può farti perdere opportunità pertinenti. Nel catalogo analizzato, <strong>incarichi di ricerca e Postdoc rappresentano insieme circa due schede su tre</strong>.</p>
    <p>Abbiamo analizzato 588 schede con scadenza dal 26 ottobre 2026 in avanti:</p>
    <table><caption>Tipologie nel catalogo analizzato il 26 ottobre 2026</caption><thead><tr><th scope="col">Tipologia</th><th scope="col">Schede</th></tr></thead><tbody>
      {[['Incarichi di ricerca',233],['Postdoc',168],['Ricercatori RTT',64],['Contratti di ricerca',64],['Altre tipologie',59]].map(([label,count])=><tr key={label}><th scope="row">{label}</th><td>{count}</td></tr>)}
    </tbody></table>
    <p>Le categorie hanno requisiti e condizioni differenti: vale la pena esplorarle, verificando quali siano compatibili con il proprio profilo.</p>
    <p>Per orientarti, controlla subito <strong>argomento, settore scientifico, sede e scadenza</strong>. Approfondisci poi attività, requisiti e condizioni nel bando ufficiale.</p>
    <p>Lombardia e Lazio raccolgono il 43,5% delle schede analizzate. Se puoi trasferirti, cercare in più regioni amplia le opportunità da valutare.</p>
    <aside className="editorial-method"><h2>Fonte e metodo</h2><p>Questa analisi descrive il nostro catalogo, non l’intero mercato italiano. I dati MUR/Cineca sono stati controllati il 21 ottobre 2026: nuove pubblicazioni, proroghe e ritiri successivi non sono confermati. Verifica sempre la fonte ufficiale. Una scheda può includere più posti; eventuali duplicazioni tra procedure non sono consolidate.</p>
    <p>Incluse schede non archiviate, pubblicate entro il 26 ottobre e con scadenza valida dal 26 ottobre in avanti. <a href="https://github.com/andreadiss/research-radar-italy/blob/main/scripts/market-snapshot.mjs">Calcolo riproducibile</a> sulla <a href="https://github.com/andreadiss/research-radar-italy/blob/7d79b65d2756053732e2fa9a0ae445cf77cac5a0/lib/generated/mur-positions.json">fonte versionata</a>.</p></aside>
  </EditorialArticle>;
}
