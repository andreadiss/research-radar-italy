# Registro operativo

| Data | Operazione | Risultato | Verifica / rollback |
|---|---|---|---|
| 2026-09-05 | Audit pubblico + codice sul commit 062703f | Baseline tecnica e dati salvata; GA4 richiede autenticazione | Snapshot in questa cartella |
| 2026-09-05 | Prima tranche P0/P1 | Rendering, indice, scadenze, URL, metadata, schema, CTA, guardie dati | Build riuscita; test archivio 4/4; audit statico senza errori |
| 2026-09-05 | Controllo budget Work | Vincolo richiesto 60%/60% e riserva 40% registrati; limite piattaforma non impostabile | Nessuna nuova schedulazione Work attiva; sync GitHub esistenti mantenute |
| 2026-09-05 | Preview browser locale | Launcher incompatibile con Next.js esistente | Nessuna migrazione/modifica dev imposta per l'anteprima; build statica verificata |

Pubblicazione completata: commit applicativo `35d60e50bf0c394ce7a07e4930c61d728982e928`, [deploy riuscito](https://github.com/andreadiss/research-radar-italy/actions/runs/33952746925). HTTP 200 per homepage, indice, pagina 2 e scheda archiviata. Sitemap live: 741 URL. Browser: homepage 696 posizioni/6 grant; filtro PhD 198 schede e 198 link diretti. Rollback: revert del solo commit applicativo, mantenendo gli eventuali successivi aggiornamenti dati. Il primo sync reale con archiviazione sarà controllato nel prossimo ciclo autorizzato. I risultati SEO/di traffico richiedono una baseline e tempo di osservazione; non sono inferiti dal successo della build.


## Mini sessione 2026-09-05 — avvio ciclo giornaliero

- Avvio osservato circa 11:05 Europe/Rome; budget massimo 30 minuti, ultimi 10 riservati a chiusura.
- Microtask: [x] pianificare ciclo giornaliero; [x] limitare evidenza funding ai campi del bando; [x] test mirati; [x] verificare deploy/live; [ ] revisione dei dati funding già in cache.
- Automazione attiva da 6 settembre mattina (fascia circa 08:00 Europe/Rome), massimo una sessione al giorno, senza recuperi extra.
- Rimossi testo pagina intera e campi arbitrari dall’input del classificatore funding. La classificazione resta euristica; fallback MUR e ambiguità da rivedere, nessuna riclassificazione massiva della cache effettuata.
- Verifica locale: 7/7 test (3 funding, 4 archiviazione), controllo sintassi importer superato.
- Prossima sessione: controllare primo sync con nuovo classificatore, verificare FANDEMIA e campione MSCA su fonti già autorizzate; distinguere fallback MUR da finanziatore verificato. GA/GSC restano bloccati dall’accesso.

- Deploy del commit aff74ff sostituito dal sync concorrente bac09e2 (che conserva aff74ff come parent). Run 33957273977 concluso con successo; HTTP homepage 200, brand e H1 presenti.
- Osservati 404 temporanei durante pubblicazioni concorrenti. OPS-025 aggiunto: indagare flusso Pages dinamico e workflow statico. Rimossa esclusione docs dal deploy affinché anche gli aggiornamenti documentali attivino la pubblicazione statica; questa salvaguardia non certifica risolta la causa dei 404.
- Token effettivi non accessibili; durata operativa registrata, nessuna conversione tempo/token.


## Mini sessione extra 2026-09-05 — autorizzata esplicitamente dall’utente

- Avvio 11:19 Europe/Rome; massimo 30 minuti. Eccezione richiesta dall’utente, nessuna variazione alla ricorrenza giornaliera.
- Microtask: [x] diagnosi 404; [x] controllo live esteso; [x] verifica e correzione FANDEMIA; [x] test e audit dati; [ ] cambiare Pages Source (accesso admin necessario).
- Evidenza P0: run dinamico 33957444089, job build 101283225613, step `Build with Jekyll`, input `source: ./docs`, destinazione `./docs/_site`. Il suo job deploy 101283272372 pubblica quell’artefatto; in parallelo il workflow Next.js pubblica `out`. Questo conflitto spiega i 404 osservati e può ripresentarsi.
- Rimedio raccomandato: repository Settings → Pages → Build and deployment → Source → GitHub Actions. Costo €0, stesso dominio/hosting/workflow, nessuna migrazione; rollback alla precedente selezione disponibile ma ripristinerebbe il conflitto. Impostazione non modificata: capacità amministrativa non esposta dal connector GitHub.
- Salvaguardia aggiunta: `scripts/verify-live.py` controlla H1/canonical dei 4 percorsi principali, collegamenti indice→schede, sitemap valida e una scheda per posizioni/grant. Timeout e retry limitati; gate nel job deploy. È rilevazione del problema, non soluzione alla configurazione concorrente.
- Correzione puntuale `mur-technologists-151225`: fonte https://bandi.mur.gov.it/tecno.php/public/job/id_job/151225 consultata il 5 settembre. Titolo indica MUR/Fondo Italiano per la Scienza FIS3; campo Marie Curie Actions=No. Funding MSCA→MUR, updatedAt aggiornato; archivio, deadline, URL e tutti gli altri dati conservati. Nessun contatto/email copiato.
- Test locali 7/7; audit dati 0 errori. Cache dopo sync precedente: 750 record, 717 non scaduti, 33 archiviati, 232 da revisionare, 77 possibili duplicati. Non sono metriche di traffico o indicizzazione Google.
- Residui prioritari: impostazione Pages; validare un campione di funding ancora MSCA; distinguere finanziatore verificato da fallback; GA4/GSC quando accessibili. Token effettivi non esposti.


## Conferma impostazione Pages — 2026-09-05

Utente conferma selezione GitHub Actions come Source. Questo commit documentale avvia il workflow statico per verificare la pubblicazione e l’assenza del precedente deploy Jekyll concorrente. Non confondere la conferma dell’utente con lettura diretta dell’impostazione amministrativa.


## Sessione richiesta 2026-09-05 — revisione MSCA e finanziamento incerto

- Avvio osservato 14:07 Europe/Rome; budget massimo 30 minuti. Sessione extra esplicitamente richiesta, ricorrenza invariata.
- Microtask: [x] leggere backlog e main; [x] verificare sei fonti MUR; [x] correggere solo il campione verificato; [x] eliminare fallback MUR non comprovato nei futuri import; [x] test; pubblicazione e controlli live tracciati dal workflow del commit.
- Sei opportunità non archiviate classificate MSCA, selezionate per prossimità della deadline, hanno il campo Marie Curie Actions=No e nessun programma identificato nei contenuti letti. Funding corretto a Non specificato, mantenendo fonte, URL, date di pubblicazione/deadline e altri campi. Provenienza e timestamp in funding-review-2026-09-05.json. Campione non rappresentativo; restano 199 MSCA non archiviati da revisionare, nessuna conclusione estesa agli altri.
- Importer e normalizzatore ora conservano Non specificato quando mancano indicazioni; la semplice presenza sul portale MUR non implica finanziamento MUR. MUR rimane riconosciuto per indicazioni esplicite di finanziamento/FIS3 nel contenuto. Nessuna modifica a database, servizi o privacy.
- Test locali: 9/9. Audit dati: 0 errori e 6 funding_unspecified, esplicitati come warning; 750 record, 717 non scaduti/non archiviati, 33 archiviati, 77 possibili duplicati. Nessuna eliminazione.
- OPS-025 chiuso: precedente verifica 33958301072 riuscita con solo workflow Next.js e 7 controlli live superati dopo correzione Pages Source.
- Prossima sessione: campione MSCA successivo (partire dai non archiviati con deadline vicina), distinguere menzioni descrittive da finanziamento reale, revisionare vecchi fallback MUR senza rietichettature massive. Metriche GA/GSC ancora bloccate dall’accesso.

- Prima pubblicazione della sessione verificata: commit 4e0ead3, run 33965348195 riuscito (build e pubblicazione). Build locale e audit HTML: 762 URL sitemap, zero link interni rotti, zero URL sitemap orfani; non sono pagine indicizzate da Google.
- Aggiunto `npm run audit:funding`: genera una coda offline di 199 candidati, ordinata per deadline/ID, con fonte e verifiche precedenti. Non modifica dati pubblicati e non considera l’assenza di una sigla nel riassunto come prova di errore. Output riproducibile in data/store/funding-review-queue.json.
- Prossimi 6 ID nella coda: mur-fixed-term-researchers-150806, 150809, 151043, 151114, 151115, 151246 (tutti con scadenza 7 settembre). Nessuna correzione applicata a questi casi senza lettura della fonte.


## Ciclo di tre sessioni aggiuntive — sessione 1

Timestamp checkpoint: 2026-09-05T12:24:34.420Z. Autorizzate esplicitamente tre sessioni consecutive, massimo 30 minuti ciascuna; ricorrenza giornaliera invariata.
Microtask completati: lettura coda, verifica sei fonti ufficiali MUR, correzione MSCA→Non specificato dei sei casi, registro evidenze funding-review-2026-09-05-batch1.json. Restano 193 MSCA non archiviati da revisionare. Nessuna cancellazione o variazione di deadline/URL. Validazione dati e deploy nel workflow del commit.
Sessioni successive: denominazioni/ambiguità funding; conservazione dei campi GSD/SSD ripetuti.


## Ciclo aggiuntivo — sessione 2

Sessione 1 chiusa con run 33966004443 riuscito e 7/7 controlli live. Sessione 2: esteso riconoscimento MSCA alle denominazioni Marie Skłodowska-Curie con varianti Unicode/trattini. Se il contenuto cita più programmi distinti, restituisce Non specificato anziché scegliere per precedenza arbitraria. Horizon insieme a MSCA/ERC conserva la categoria specifica. Fonte terminologica MSCA: https://rea.ec.europa.eu/funding-and-grants/horizon-europe-marie-sklodowska-curie-actions_en . Nessuna nuova fonte acquisita nel prodotto e nessun link aggiunto al sito.
Tre nuovi test di regressione; nessuna riclassificazione automatica della cache. Limite: un’unica menzione nel testo resta un’euristica e non prova da sola il finanziamento; la coda richiede revisione ufficiale. Residuo prioritario: settori GSD/SSD ripetuti, attualmente persi dopo il primo nell’importer.


## Ciclo aggiuntivo — sessione 3

Sessione 2 chiusa con run 33966172547 riuscito e 7/7 controlli live. Sessione 3: estrattore HTML isolato in mur-html.mjs e testato; i campi GSD/SSD ripetuti e i loro alias conservano tutti i valori distinti in ordine, separati da newline. Gli altri campi conservano il primo valore, evitando fusione dell’ente con i contatti.
Normalizzazione: bandi multi-settore in Altro / interdisciplinare e needs_review, con motivo multiple_scientific_sectors; conservati GSD e SSD completi. Nessuna modifica al modello database. Limite: non è ancora una ricerca multi-disciplina per ogni settore.
Verifica su HTML ufficiale https://bandi.mur.gov.it/jobs.php/public/job/id_job/151246 : 12 GSD e 12 SSD estratti, contro il solo primo precedentemente conservato. Aggiornata anche questa singola scheda in cache: settori completi, classificazione prudente, flag revisione e updatedAt; fonte/URL/deadline conservati. Nessun contatto della fonte copiato nel registro.
Test complessivi 16/16 e audit dati 0 errori. Checkpoint delle tre sessioni: sei ulteriori correzioni funding (MSCA attivi da rivedere 199→193), gestione denominazioni/ambiguità, recupero di 11 ulteriori GSD e 11 SSD sulla scheda verificata. Residui: revisione coda funding, bandi multi-settore preesistenti, filtri multi-disciplina; GA4/GSC quando accessibili. Nessuna spesa; ricorrenza invariata. Pubblicazione e controlli live finali nel workflow del commit di questa sessione.


## Nuovo ciclo — sessione 1 di 6

Checkpoint 2026-09-05T17:17:14.076Z. L’utente ha richiesto tre sessioni e altre tre durante l’esecuzione: sei sessioni consecutive, massimo 30 minuti ciascuna, ricorrenza invariata.
Verificate sei fonti: cinque correzioni MSCA→Non specificato; MET2ADAPT (mur-research-assignments-316042) confermato MSCA da titolo e campo HE / MSCA. Evidenze in funding-review-2026-09-05-batch2.json. Aggiunti i campi specifici incarichi alla whitelist funding per preservare questo caso autentico nei futuri import. Restano 188 MSCA attivi, di cui uno verificato e 187 da verificare.
Prossime sessioni: falsi duplicati tra settori diversi; opportunità correlate; coda che conserva conferme valide; titoli specifici per incarichi; qualità requisiti/metadata delle schede.


## Nuovo ciclo — sessione 2 di 6

Checkpoint 2026-09-05T17:22:25.846Z; sessione 1 chiusa con run 33980584728 e 7/7 controlli live.
Risolto falso duplicato tra https://bandi.mur.gov.it/jobs.php/public/job/id_job/151114 (GIUR-06/A) e https://bandi.mur.gov.it/jobs.php/public/job/id_job/151043 (MEDF-01/A), fonti già lette e verificate in questa conversazione. Rimossi solo i riferimenti reciproci del falso positivo e ricalcolati i segnali della scheda interessata. Nessun record eliminato.
Prevenzione: nel confronto per titolo/ente/deadline, SSD moderni espliciti e disgiunti distinguono i bandi; tutti i candidati precedenti del gruppo sono conservati per non perdere corrispondenze successive. Se SSD ignoto il sospetto rimane; identità per URL resta prioritaria. Tre test di regressione. Restano 76 possibili duplicati da rivedere, non 76 duplicati confermati.

## Nuovo ciclo — sessione 3 di 6

2026-09-05T17:29:24.662260+00:00

- Sessione 2 live: run 33981017049, build/deploy riusciti, 7 controlli pubblici superati.
- Aggiunti fino a tre collegamenti statici verso opportunità aperte dello stesso ruolo e disciplina, ordinati per scadenza. Nessun fallback generico; esclusi archivi, deadline ignote e candidati duplicati.
- Tre test mirati superati; typecheck superato. Pubblicazione e verifica affidate al workflow esistente.

## Nuovo ciclo — sessione 4 di 6

2026-09-05T17:32:08.820599+00:00

- Sessione 3 live: run 33981145142, build/deploy riusciti, 7 controlli pubblici superati.
- La coda di revisione separa conferme valide da verifiche pendenti: 188 MSCA attive, 1 confermata, 187 da verificare.
- Conferma riutilizzata solo con stessa fonte, stesso funding e aggiornamento non successivo alla verifica; dati mancanti o modificati riaprono la revisione. Tre test mirati superati.
