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
