# Decision log

2026-09-11: aggiungere esclusivamente gli alias «Titolo del progetto in italiano» e «Titolo del progetto in inglese» al parser. Preservare precedenza delle etichette specifiche preesistenti, fallback e separazione delle lingue. Il cambiamento entrerà nei dati tramite il prossimo sync ordinario riuscito; non modificare cache, date, workflow, segreti o persistenza. PR #9 confermata shipped.

2026-09-10: eliminare soltanto l'ente aggiunto quando il titolo metadata già troncato termina con lo stesso nome, confrontando maiuscole/spazi e separatori trattino/en dash/em dash. Preservare identificatore, contenuti, canonical, robots e date; nessun nuovo dato né infrastruttura. Priorità ai clic organici; niente A/B test né controlli reiterati su problemi risolti. Il nome troncato o parziale continua a ricevere l'ente completo.

2026-09-09: misurare freshness MUR a livello di fonte con `lastSuccessfulCheckAt`; non usare la modifica delle singole schede come prova di scansione. Soglia 48 ore, un solo warning di fonte quando stale; timestamp assente, futuro o malformato è errore. Nessuna modifica a dati, import, schedule, hosting o interfaccia.

2026-09-08: introdurre nel solo client HTTP dell'import MUR fino a 3 tentativi con attese 1s/3s per rete, 429, 500, 502, 503 e 504. Non ritentare altri 4xx. Nessuna modifica a workflow, schedule, segreti, Supabase o Netlify. Se tutti i tentativi falliscono, il job resta fallito e non pubblica dati parziali.

2026-09-07: su indicazione esplicita dell'utente, il badge espone “Dati MUR” con la data corrente in Europa/Roma. La comprensione del significato sarà verificata con un usability test; la data non rappresenta più l'ultimo controllo riuscito né l'ultima modifica delle schede.

Aggiornamento 7 settembre 2026 — Su richiesta esplicita, il badge mostra l'ultimo controllo MUR completo riuscito, non max(updatedAt). File metadati separato; commit anche a schede invariate. Date schede, sitemap lastmod, schedule, permessi e persistenza invariati. Seed documentato dal run 34024680219, fine step riuscito al 6 settembre 09:31:24 UTC.


2026-09-06: privilegiare correttezza dei link esistenti. Nessun redesign, tracking, servizio o dipendenza aggiunti. Rimandare A/B test fino a baseline attendibile. GSC Wizard collegato ma funzioni non esposte in questa sessione. Non considerare la sitemap prova di indicizzazione. Richiedere approvazione per tracking, costi, strategia e terzi secondo mandato.

2026-09-07: considerare conclusa la correzione CTA dopo verifica del merge e della produzione. Non introdurre ulteriori modifiche alle landing prima di dati sufficienti; i piccoli movimenti GSC su finestre mobili non dimostrano impatto. Per decisione dell'utente, Netlify è fuori scope: non analizzarlo, non modificarlo e non proporre interventi relativi nei task growth.
