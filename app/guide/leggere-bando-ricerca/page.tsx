import type { Metadata } from "next";
import Link from "next/link";
import { EditorialArticle } from "@/app/components/EditorialArticle";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Come leggere un bando di ricerca: 8 controlli prima di candidarti",
  description: "Una checklist pratica per confrontare argomento, requisiti, scadenza, documenti e condizioni di un bando di ricerca, partendo dalle fonti ufficiali.",
  alternates: { canonical: absoluteUrl("/guide/leggere-bando-ricerca") }
};

export default function ReadingCallGuide() {
  return <EditorialArticle category="Guida alla candidatura" title="Come leggere un bando di ricerca" publishedOn="28 ottobre 2026">
    <p>Un titolo interessante è un punto di partenza, non basta per decidere se candidarti. Apri la pagina ufficiale dell’ente, scarica il bando con gli allegati e usa questi otto controlli per confrontare le opportunità.</p>
    <h2>Prima di preparare i documenti</h2>
    <ol>
      <li><strong>Identifica la procedura.</strong> Annota ente, codice, tipologia e numero di posti. Non confondere un incarico di ricerca con un Postdoc o un contratto di ricerca.</li>
      <li><strong>Leggi il progetto, non solo il settore.</strong> Il SSD aiuta a orientarti nella disciplina; cerca anche argomento, attività previste e sede. Se manca un’informazione decisiva, segnala il dubbio agli uffici indicati nel bando prima di fare supposizioni.</li>
      <li><strong>Confronta i requisiti con il tuo profilo.</strong> Controlla titoli richiesti, eventuali condizioni per titoli esteri, termini di possesso dei requisiti e incompatibilità. Non trasferire automaticamente le regole di una procedura a un’altra.</li>
      <li><strong>Segna data e ora.</strong> Cerca il termine completo, l’eventuale fuso orario e le modalità di invio. Pianifica un margine per completare la procedura: la sola data nel calendario non basta.</li>
    </ol>
    <h2>Prima di inviare la domanda</h2>
    <ol start={5}>
      <li><strong>Prepara una lista degli allegati.</strong> Controlla moduli, firme, formati e limiti richiesti per curriculum, titoli e pubblicazioni; verifica se è previsto un contributo e come documentarlo.</li>
      <li><strong>Leggi come sarai valutato.</strong> Cerca criteri, punteggi, eventuali soglie, prove o colloquio, lingua e modalità di comunicazione delle convocazioni.</li>
      <li><strong>Confronta le condizioni.</strong> Annota durata, attività e trattamento economico. Prima di confrontare due importi, verifica se sono annuali o complessivi e quale lordo indicano: non considerarli automaticamente il netto disponibile.</li>
      <li><strong>Ricontrolla gli aggiornamenti e conserva la ricevuta.</strong> Torna alla pagina ufficiale per eventuali rettifiche o proroghe. Dopo l’invio, verifica la conferma prevista dalla procedura: salvare una bozza non equivale necessariamente a presentare la candidatura.</li>
    </ol>
    <h2>Un esempio: l’ora cambia la scadenza</h2>
    <p>La procedura UniMi 700059 indicava il <strong>5 ottobre 2026 alle 12:00</strong> e l’invio online tramite Sicon. Il Postdoc UniFi D.R. 1297/2026 riportava invece il <strong>21 ottobre 2026 alle 13:00</strong>. Sono esempi già scaduti, non opportunità attualmente aperte: mostrano perché controllare ogni singola procedura, senza assumere un orario universale.</p>
    <aside className="editorial-method"><h2>Fonti e limiti</h2>
      <p>Fonti ufficiali consultate il 28 ottobre 2026: <a href="https://www.unimi.it/it/ateneo/lavora-con-noi/reclutamento-ricercatori/selezioni-ricercatori/incarico-post-doc-gsd-10/asia-01-ssd-asia-01/codice-700059">UniMi, codice 700059: bando, allegati e partecipazione</a>; <a href="https://www.unifi.it/it/ateneo/lavora-con-noi/reclutamento-bandi-di-concorso/1-incarico-post-doc-dr-12972026">UniFi, D.R. 1297/2026: documenti e termine</a>.</p>
      <p>Questa è una checklist orientativa, non una verifica di ammissibilità né consulenza legale. Fanno fede il bando ufficiale, gli allegati e le successive comunicazioni dell’ente.</p>
    </aside>
    <p>Devi ancora scegliere cosa cercare? <Link href="/guide/cercare-opportunita-ricerca">Esplora anche le tipologie diverse dai Postdoc</Link>.</p>
  </EditorialArticle>;
}
