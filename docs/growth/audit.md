# Research Radar Italy — Audit iniziale

11 settembre 2026 — PR #9 shipped e ricontrollata: titolo Trento non ripete l'ente; ultimo deploy 34472792088 riuscito, smoke live home/posizioni/indice/funding/schede/sitemap superato. Nuovo difetto: extractCallTitles non riconosce «Titolo del progetto in italiano/inglese». Dataset main 695c7e5: 97 Postdoc con titolo generico, 68 con scadenza non trascorsa (non equivale a disponibilità confermata). Tre pagine MUR lette direttamente via HTTP: 314470, 316445, 316620; tutte contengono titoli specifici recuperati dal parser corretto. Nessuna modifica manuale al dataset o al timestamp fonte.

Aggiornamento 10 settembre 2026 — Main bbc6cd0 e nessuna PR aperta al controllo iniziale; ultimo deploy Pages 34347244711 riuscito. Home HTTP 200 e duplicazione del nome dell'ente riprodotta live nella scheda mur-postdoc-assignments-315906. Misurazione sul dataset: 106/838 titoli metadata aggiungono inutilmente l'ente già presente come suffisso. Correzione conservativa sul titolo già troncato, senza cambiare schede, URL, canonical, indicizzazione o date. Test 44/44, build 892 route, TypeScript, audit dati 0 errori e audit statico 887 HTML/667 sitemap/0 link rotti-orfani superati. Nessun incremento traffico dimostrato.

Aggiornamento 9 settembre 2026 — Il sync MUR dell'8 settembre è riuscito: 704 record correnti e 791 posizioni complessive persistite, build e deploy riusciti. L'audit freshness generava 662 falsi warning usando `updatedAt` delle singole schede; corretto per usare `lastSuccessfulCheckAt` della fonte. Risultato: MUR fresh, età 21,4 ore al controllo, 0 warning freshness.

Aggiornamento 8 settembre 2026 — Il badge della PR #5 è verificato live nel browser come “Dati MUR 8 set”. Il sync MUR del 7 settembre è fallito su HTTP 502 del portale sorgente; un singolo errore transitorio interrompe oggi l'intero import. Build al giorno corrente: 663 posizioni aperte per scadenza, 87 scadute, 707 URL sitemap, 0 link rotti/orfani.

Aggiornamento 7 settembre 2026 — Il badge usava max(updatedAt), non l'ultimo controllo. Il run 34110861661 del 7 settembre è fallito con HTTP 502 MUR. Separare controllo riuscito e modifica delle schede.

Data: 6 settembre 2026. Repository analizzato: bb6ed27815f2c6ca93efb2e5fbe5b561220f058f.
Audit tecnico e pubblico eseguito; baseline privata, Core Web Vitals e verifica mobile interattiva ancora da completare. Nessuna stima di traffico sostituisce i dati mancanti.

## Aggiornamento post-deploy — 7 settembre 2026
- La PR #1 è stata mergiata il 6 settembre nel commit e325c3315d495f861cf1ebeb3341938ccf5e6352; `main` è poi avanzato con il solo aggiornamento automatico del dataset MUR c1f9c98b41632d0ab33b127bc03b049a567b7aa5.
- Nessuna PR è aperta. Produzione verificata: home, landing Postdoc, landing MSCA e destinazioni filtrate rispondono HTTP 200.
- Le due CTA Postdoc puntano a `/posizioni/?type=Postdoc`; le due CTA MSCA puntano a `/funding/?program=MSCA`. Le landing mantengono canonical univoci corretti.
- GSC, finestra 8 agosto–4 settembre: 11 impression, 0 click, CTR 0%, posizione media 15,73. Finestra 29 agosto–4 settembre: 7 impression, 0 click, posizione 13,29. Dati maturi fino al 5 settembre; finestre mobili, nessuna crescita attribuita alla PR.

## Executive summary
1. Homepage e percorsi core rispondono; HTTPS e redirect da HTTP e www convergono su https://rritaly.com/.
2. robots.txt, sitemap, manifest, favicon e immagine OpenGraph rispondono HTTP 200. Una URL inesistente restituisce 404.
3. Ultimo deploy pre-intervento riuscito; nessuna PR aperta al controllo iniziale. main non protetto secondo API branch; regole aggiuntive non verificate.
4. Stack confermato: Next.js 14.2.35 installato dal lockfile, TypeScript, export statico, GitHub Pages. Il sync MUR prevede già persistenza Supabase; disponibilità, piano e costi non verificati.
5. Esistono già sette landing SEO, indice paginato, schede permanenti, link correlati e structured data. Evitare di ricreare funzionalità già presenti.
6. HTML iniziale e browser idratato differiscono dopo il cambio di giorno: 717 contro 711 posizioni; Postdoc 63 contro 61. Lo stato statico resta quello della build.
7. Le CTA delle landing utilizzavano vecchie URL della homepage con intent. Correzione completata e verificata in produzione il 7 settembre: puntano alle sezioni esistenti conservando i filtri.
8. Qualità contenuti: audit locale su 750 posizioni segnala 350 requisiti non estratti, 140 titoli generici e 217 record needs_review. Segnalazioni su tutto il dataset, non soltanto bandi aperti; possono sovrapporsi.
9. Analytics richiede verifica: inizializzazione con send_page_view:false e un effetto che può terminare se gtag non è pronto; assenza di retry. Rischio di pageview mancanti/duplicati da verificare con configurazione GA4 e DebugView, non guasto misurato.
10. Nessuna crescita dimostrata. A/B test rinviati finché volume e attendibilità del tracking non sono noti.

## Baseline
Periodi da estrarre secondo timezone della proprietà, escludendo oggi:
- 7 giorni: 30 agosto–5 settembre; confronto 23–29 agosto 2026.
- 28 giorni: 9 agosto–5 settembre; confronto 12 luglio–8 agosto 2026.
GA4: utenti, sessioni, canali, organic/referral/direct, landing, pagine, engagement, returning, device, country, eventi: **non disponibili**.
GSC: query, impression, click, CTR, posizione, pagine, indicizzazione e sitemap: **non disponibili**.
GSC Wizard è stato collegato dall'utente, ma nessuna funzione richiamabile è stata esposta al controllo in questa sessione. Non chiedere una nuova connessione e non dedurre che la proprietà non esista. Un file di verifica Google è già nel repository, ma non dimostra una proprietà attiva.

Baseline tecnica riproducibile:
| Indicatore | Risultato |
|---|---:|
| Record posizioni totali | 750 |
| Posizioni aperte per audit al 6 settembre | 711 |
| Grants totali / disponibili | 11 / 6 |
| Test operativi | 32 superati |
| HTML controllati nell'export locale | 802 |
| URL sitemap locale | 756 |
| URL sitemap orfani / link interni rotti | 0 / 0 |
| Errori audit dati | 0 |
| First Load JS build home/posizioni/funding | 254 kB |
| First Load JS landing SEO | 97,4 kB |

I kB della build non sono una misura di Core Web Vitals. Nessun dato CrUX/Lighthouse raccolto.

## Production health e SEO tecnica
Verificati via HTTP: home, robots, sitemap, manifest, favicon, OpenGraph, redirect HTTP e www e risposta 404 di controllo. Navigazione browser: home → Postdoc → CTA; destinazioni /posizioni/?type=Postdoc e /funding/?program=MSCA restituiscono rispettivamente 61 e 2 risultati dopo caricamento.
Homepage: H1, lingua italiana, index/follow e canonical corretto. Nei log campionati compare un errore dell'estensione del browser, non attribuibile al sito.
Indice: 24 pagine, 30 elementi per pagina; paginazione con link HTML e canonical specifici, verificati nel codice e audit statico.
Schede: canonical univoci, permanenza delle URL archiviate e noindex per scadute al momento della build. Nessun JobPosting forzato: il codice usa WebPage per estratti incompleti, scelta prudente.
Landing: contenuto e otto link a schede disponibili nell'HTML, FAQ visibili e markup corrispondente. Breadcrumb visivo con genitore non cliccabile; miglioramento secondario.
Sitemap: esclude archiviate/scadute alla build; lastmod omesso deliberatamente in assenza di provenance affidabile.
Filtri: pagine parametriche canoniche sulla sezione; non servono migliaia di URL indicizzabili per combinazioni arbitrarie.
Non effettuato un crawl HTTP completo di tutte le schede; il controllo completo link è sull'export locale. Mobile reale, tastiera, screen reader, contrasto e caricamento di tutti gli asset restano non verificati.

## Critical issues
- **Misurazione, priorità P0:** baseline assente e possibile race all'avvio di gtag. Prima di esperimenti verificare una pageview per caricamento e navigazione, comprese Enhanced Measurement e privacy. Nessuna modifica al tracking in questa sessione.
- **Freshness, P1:** l'indice statico include il 6 settembre sei schede con scadenza 5 settembre; il browser della home le esclude. Il workflow MUR è programmato alle 05:15 UTC; ultima esecuzione del giorno non confermata. Verificare sync/deploy e aggiornamento dopo mezzanotte prima di cambiare pipeline.
- **Contenuto, P1:** i warning sono una coda di revisione, non prova automatica di errori. Validare pochi record ad alto valore con fonte originale, evitando cancellazioni o riscritture massive.
Non è emerso un blocco globale al crawling. Presenza nella sitemap non equivale a indicizzazione Google.

## SEO opportunities
| Attività | Impatto atteso | Effort | Evidenza |
|---|---|---|---|
| CTA delle sette landing verso sezioni corrette | Medio, coerenza navigazione e URL | ≤30 min | Riprodotto nel browser e codice |
| Recuperare requisiti e titoli da fonti su 3–5 schede | Alto potenziale, utilità e long-tail | 30 min per lotto | Audit dati |
| Migliorare title che ripetono ente e nome generico | Medio, leggibilità snippet | 30 min | Scheda Pisa e generatore metadata |
| Scegliere una landing con query posizioni 4–20 | Alto potenziale | 30 min di analisi | Dipende da GSC |
| Verificare stale HTML dopo cambio data | Medio-alto | 30 min diagnosi | Discrepanza 717/711 |

## GEO opportunities
| Attività | Impatto atteso | Effort |
|---|---|---|
| Aggiungere informazioni fattuali mancanti con fonte e data | Alto potenziale | 30 min per piccolo lotto |
| Esplicitare copertura, frequenza e limiti MUR rispetto a funding | Medio | 30 min |
| Collegare descrizioni tematiche a fonti ufficiali pertinenti | Medio | 30 min |
llms.txt è già presente nel repository; non viene trattato come prova di visibilità AI. Niente nuove tattiche speculative. Citation, date e contenuti statici sono già un punto di partenza.

## Product opportunities
Value proposition chiara; categorie e filtri immediatamente riconoscibili. La sezione posizioni inizialmente richiede un filtro, con alternativa dell'indice: scelta da misurare, non bug da rimuovere.
| Attività | Impatto atteso | Effort / rischio |
|---|---|---|
| Chiarire differenza fra ultimo aggiornamento e disponibilità attuale | Fiducia | 30 min / basso per copy |
| Ridurre placeholder e migliorare sintesi di schede | Utilità, click fonte | 30 min / basso con verifica |
| Valutare CTA verso indice nell'empty state | Scoperta | 30 min analisi; cambi visibili da approvare se sostanziali |
| Verificare preferiti e condivisione su mobile | Retention | 30 min / sola diagnosi |
La home dedica spazio significativo alle azioni salva/condividi: nessun redesign senza evidenza e approvazione. Non sono stati inviati messaggi o condivisi contenuti.

## SERP e contenuti
Ricerca esplorativa per postdoc Italia e dottorati Italia: compaiono portale MUR, università e Academic Jobs Italy. Il portale MUR separa i bandi per tipologia; Academic Jobs Italy espone elenchi con SSD e scadenze. Inferenza: requisiti affidabili, confronto trasversale e chiarezza delle scadenze sono opportunità più concrete di nuove pagine generiche.
Non sono state misurate posizioni, volumi o quote di traffico di RR Italy. Ricerca non localizzata e non esaustiva; Euraxess, inPA e altri cluster da approfondire dopo GSC. Nessun outreach.

## Experiment opportunities
Al massimo cinque, tutti senza piattaforme a pagamento:
1. CTA canoniche: se eliminiamo il passaggio dalla homepage, la destinazione resta coerente con il contesto. Metrica tecnica: 14 CTA delle sette landing corrette; KPI successivo: click fonte da sessioni organiche. Guardrail: stessi filtri e nessun 404. Controllo immediato, osservazione 28 giorni; baseline traffico assente, nessuna inferenza causale.
2. Titoli specifici su 3–5 schede: CTR GSC per pagine interessate; guardrail accuratezza; prima/dopo 28 giorni, solo con impression sufficienti. Non avviato.
3. Requisiti verificati su 3–5 schede: official_source_opened per sessione interessata; guardrail zero requisiti non documentati; 28 giorni. Non avviato.
4. Copy di freshness: completamento percorso verso fonte; guardrail nessuna falsa dichiarazione di disponibilità; validazione qualitativa prima delle metriche. Non avviato.
5. Una landing scelta da GSC: click organici e CTR; guardrail cannibalizzazione e accuratezza; 28–56 giorni. Non avviato.
Con traffico ignoto non assegnare campioni o significatività arbitrari. Prima/dopo non dimostra da solo causalità.

## Technical risks
- Deploy automatico su push a main; build, test dati/operativi, audit HTML e smoke test live già configurati.
- Il workflow non prevede trigger pull_request: i gate pre-merge devono essere eseguiti localmente o in un meccanismo approvato.
- main non protetto nel risultato API; nessuna modifica alle regole o al workflow.
- Static export: scadenze e noindex possono restare fermi fino al deploy. Considerare orario di scadenza, oltre alla sola data, in un task separato.
- Dataset importato dal client: home e filtri hanno 254 kB First Load JS. Misurare mobile prima di refactoring.
- Supabase già previsto; piano e quota non verificati. Nessun servizio attivato o costo autorizzato.
- Script analytics caricato globalmente nel codice; verificare consenso/configurazione senza formulare conclusioni legali o introdurre tracking.
- Warning ulteriori audit: 61 possibili duplicati, 19 regioni ignote, 7 enti generici, 35 funding non specificati, 5 pubblicazioni future. Non correggere automaticamente.

## Prioritized backlog
Tutti i task proposti usano strumenti esistenti; costo previsto €0, senza garanzia sui piani già attivi.
| Priorità | Task | Impact | Confidence | Effort | Risk | KPI |
|---|---|---|---|---|---|---|
| P0 | Estrarre baseline GA4/GSC e diagnosticare pageview | Alto | Alta sul bisogno; media sul bug | 30 min | Basso in lettura; tracking richiede approvazione | Copertura pageview, organic sessions |
| P1 | CTA canoniche delle landing | Medio | Alta | ≤30 min | Basso; revert singolo file | 14 link corretti |
| P1 | Verificare sync del giorno e discrepanza scadenze | Alto | Alta sul sintomo | 30 min | Basso diagnosi; workflow da valutare | Zero scaduti presentati aperti |
| P1 | Verificare 3–5 record needs_review | Alto | Alta | 30 min | Basso con fonti; revert lotto | Warning risolti, click fonte |
| P2 | Misurare CWV e UX mobile | Medio | Media | 30 min | Basso in lettura | LCP, INP, CLS |
| P2 | Selezionare landing da query GSC | Alto potenziale | Da stabilire | 30 min | Basso analisi | Click organici qualificati |
| P2 | Migliorare title su un campione | Medio | Media | 30 min | Basso e reversibile | CTR per query/pagina |
| P3 | Rendere breadcrumb genitore cliccabile | Basso-medio | Alta | 15 min | Basso e reversibile | Percorso verso categoria |

## Recommended first intervention
Correggere solo primaryHref in lib/seo-landing-pages.ts: quattro definizioni posizioni e il generatore funding, per sette landing e due CTA per landing. Destinazioni /posizioni/?type=… e /funding/?program=…; parametri e risultati preservati.
Rischio basso; nessun cambiamento di design, tracking, dipendenze o dati. Rollback: revert del commit applicativo. Build production, TypeScript, 32 test, audit dati e audit statico richiesti prima del merge; smoke test HTTP e click reale dopo deploy.

## Fonti
- [Produzione](https://rritaly.com/), [indice](https://rritaly.com/posizioni/indice/), [landing Postdoc](https://rritaly.com/posizioni/postdoc/).
- [Repository al commit analizzato](https://github.com/andreadiss/research-radar-italy/tree/bb6ed27815f2c6ca93efb2e5fbe5b561220f058f).
- [Deploy precedente](https://github.com/andreadiss/research-radar-italy/actions/runs/33982696802).
- [Pageview GA4: documentazione Google](https://developers.google.com/analytics/devguides/collection/ga4/views).
- [MUR Postdoc](https://bandi.mur.gov.it/incarichipostdoc.php/public/cercaFellowship), [MUR Dottorati](https://bandi.mur.gov.it/doctorate.php/public/cercaFellowship), [Academic Jobs Italy](https://academicjobsitaly.com/it/jobs).
