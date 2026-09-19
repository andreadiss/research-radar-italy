# Decision log

19 settembre 2026 — Pubblicare nella landing Dottorati soltanto le aree specifiche dei PhD aperti; non promuovere «Altro / interdisciplinare». Riutilizzare `/posizioni/?type=PhD&discipline=…`, senza nuove landing, canonical, sitemap, tracking o tassonomie. Rendere il componente condiviso con Postdoc e aggiungere un audit esatto dei collegamenti generati.

18 settembre 2026 — Non aggiungere ancora percorsi disciplinari alla landing Dottorati: il sync conferma la risoluzione dell'errore principale, ma il campione mostra nuovi falsi positivi. Dare priorità a settore e titolo, rimuovere `design` e `management` come segnali generici, distinguere `neuromorphic` da neuroscienze e lasciare i testi multi-area in «Altro / interdisciplinare». Applicazione tramite prossimo sync ordinario; nessun import forzato o modifica manuale della cache.

17 settembre 2026 — Non pubblicare percorsi disciplinari Dottorati finché la tassonomia corrente è distorta. Correggere il normalizzatore includendo il titolo nelle evidenze e sostituendo la keyword generica `letter` con riferimenti espliciti a letteratura/literature. In assenza di evidenza specifica usare «Altro / interdisciplinare», non dedurre una categoria. Lasciare che il prossimo sync ordinario aggiorni la cache; nessun import forzato, modifica manuale dei dati o intervento sulla pipeline.

16 settembre 2026 — Considerare il bilancio della settimana inconcludente sul traffico: i dati disponibili mostrano un segnale direzionale ma non consentono attribuzione o conferma. Riprogrammare il lavoro privilegiando contenuti verificati e percorsi interni sulle landing già esistenti; limitare i controlli operativi a guardrail brevi. Non creare nuove landing, non avviare A/B test, tracking, servizi o costi. Riprovare la misurazione solo con accesso gratuito/autorizzato e mantenere un bilancio esplicito ogni mercoledì.

15 settembre 2026 — Usare esclusivamente i Postdoc aperti del dataset per generare discipline e conteggi nella landing esistente. Ordinare per numerosità e poi alfabeticamente; collegare alla vista /posizioni con tipo Postdoc e disciplina. Non creare URL canoniche o landing aggiuntive per disciplina, non modificare sitemap, title, tracking o pipeline. I numeri descrivono il contenuto della build, non traffico né disponibilità confermata oltre la fonte.

14 settembre 2026 — Preservare la PR #14 e incorporare main 342542b senza force push; aggiungere solo il controllo di regressione nello script audit già eseguito dalla build, senza cambiare workflow o integrazioni. Tre check remoti falliti sul vecchio head: non ignorarli né forzare merge. Nuovo head da ricontrollare; se il blocco persiste lasciare la PR reviewable.

13 settembre 2026 — Terza sessione autorizzata dall’utente — Sostituire soltanto la CTA finale della scheda, riutilizzando seoLandingPages e il tipo esatto del record. Testo «Altre opportunità: [categoria]», stesso stile; fallback indice quando manca una landing corrispondente. Valido anche sulle schede archiviate per trovare alternative; noindex e canonical restano invariati. Nessuna nuova categoria, pagina, tracking o dipendenza. Non usare GSC oggi. Nessun intervento sulle integrazioni escluse.

13 settembre 2026 — Sessione aggiuntiva autorizzata dall’utente — Rimuovere il limite di 180 caratteri dai requisiti conservando filtro placeholder/link e deduplicazione. Ripristinare nella cache soltanto i requisiti di 147663 e 151146 dalla fonte verificata, così il miglioramento può essere pubblicato senza attendere un sync. Non forzare import né modificare persistenza, workflow, timestamp o infrastruttura. Conservare nella stessa PR gli aggiornamenti documentali della PR #12 aperta. Merge subordinato ai guardrail, verifica deploy nel report e nella PR.

13 settembre 2026 — Non attivare abbonamenti GSC Wizard né aggirare il blocco payment_required. Rimandare URL Inspection e nuove estrazioni finché l’accesso non torna disponibile; proseguire i task gratuiti utili sul sito. Non rimuovere noindex dalla scheda 296467 archiviata per inseguire indicizzazione. Nessuna modifica applicativa o infrastrutturale. Registrare il limite nei sei documenti in una PR reviewable senza merge/deploy: questa sessione non esegue i gate completi richiesti per il merge. Revisione settimanale del 16 settembre resta obbligatoria anche senza nuovi dati.

2026-09-12: considerare conclusa la correzione dei titoli Postdoc dopo il primo sync ordinario riuscito e verifica live 3/3. Non modificare manualmente i 29 titoli generici residui: hanno scadenza precedente al controllo e le URL restano archiviate. Non iniziare un'altra modifica prima del riesame indicizzazione previsto dal 13 settembre.

2026-09-11: aggiungere esclusivamente gli alias «Titolo del progetto in italiano» e «Titolo del progetto in inglese» al parser. Preservare precedenza delle etichette specifiche preesistenti, fallback e separazione delle lingue. Il cambiamento entrerà nei dati tramite il prossimo sync ordinario riuscito; non modificare cache, date, workflow, segreti o persistenza. PR #9 confermata shipped.

2026-09-10: eliminare soltanto l'ente aggiunto quando il titolo metadata già troncato termina con lo stesso nome, confrontando maiuscole/spazi e separatori trattino/en dash/em dash. Preservare identificatore, contenuti, canonical, robots e date; nessun nuovo dato né infrastruttura. Priorità ai clic organici; niente A/B test né controlli reiterati su problemi risolti. Il nome troncato o parziale continua a ricevere l'ente completo.

2026-09-09: misurare freshness MUR a livello di fonte con `lastSuccessfulCheckAt`; non usare la modifica delle singole schede come prova di scansione. Soglia 48 ore, un solo warning di fonte quando stale; timestamp assente, futuro o malformato è errore. Nessuna modifica a dati, import, schedule, hosting o interfaccia.

2026-09-08: introdurre nel solo client HTTP dell'import MUR fino a 3 tentativi con attese 1s/3s per rete, 429, 500, 502, 503 e 504. Non ritentare altri 4xx. Nessuna modifica a workflow, schedule, segreti, Supabase o Netlify. Se tutti i tentativi falliscono, il job resta fallito e non pubblica dati parziali.

2026-09-07: su indicazione esplicita dell'utente, il badge espone “Dati MUR” con la data corrente in Europa/Roma. La comprensione del significato sarà verificata con un usability test; la data non rappresenta più l'ultimo controllo riuscito né l'ultima modifica delle schede.

Aggiornamento 7 settembre 2026 — Su richiesta esplicita, il badge mostra l'ultimo controllo MUR completo riuscito, non max(updatedAt). File metadati separato; commit anche a schede invariate. Date schede, sitemap lastmod, schedule, permessi e persistenza invariati. Seed documentato dal run 34024680219, fine step riuscito al 6 settembre 09:31:24 UTC.


2026-09-06: privilegiare correttezza dei link esistenti. Nessun redesign, tracking, servizio o dipendenza aggiunti. Rimandare A/B test fino a baseline attendibile. GSC Wizard collegato ma funzioni non esposte in questa sessione. Non considerare la sitemap prova di indicizzazione. Richiedere approvazione per tracking, costi, strategia e terzi secondo mandato.

2026-09-07: considerare conclusa la correzione CTA dopo verifica del merge e della produzione. Non introdurre ulteriori modifiche alle landing prima di dati sufficienti; i piccoli movimenti GSC su finestre mobili non dimostrano impatto. Per decisione dell'utente, Netlify è fuori scope: non analizzarlo, non modificarlo e non proporre interventi relativi nei task growth.
