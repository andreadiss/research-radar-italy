## Prioritized backlog

18 settembre 2026 — Task scelto: aumentare la precisione della tassonomia PhD prima di creare percorsi pubblici. Impact medio sull'utilità e pertinenza futura; Confidence alta sui falsi positivi osservati, bassa sull'effetto traffico; Effort piccolo; Risk basso. Il prossimo sync ordinario deve confermare la distribuzione; fino ad allora non esporre filtri Dottorati.

17 settembre 2026 — Task scelto: correggere la classificazione disciplinare dei PhD prima di esporla nella landing. Impact alto su pertinenza di filtri/schede e ricerche tematiche; Confidence alta sulla causa e sul guardrail, bassa sull'effetto traffico; Effort piccolo; Risk basso. Il prossimo sync ordinario deve confermare la nuova distribuzione senza interventi manuali sui dati. Solo dopo questa verifica rivalutare i percorsi disciplinari Dottorati.

16 settembre 2026 — Revisione settimanale completata. Crescita non dimostrabile con dati aggiornati: GSC è indisponibile e l'ultima baseline ha volumi minimi. Riprogrammazione per i prossimi sette giorni: P1 migliorare contenuti e percorsi di una sola landing esistente alla volta usando dati verificati del catalogo; P1 correggere titoli/requisiti soltanto quando la fonte ufficiale prova il difetto; P2 mantenere brevi smoke check su sito/deploy; P2 riprendere misurazione e indicizzazione solo quando torna un accesso gratuito/autorizzato. Impact potenziale medio-alto sul traffico qualificato, Confidence alta sull'utilità ma bassa sull'effetto SEO, Effort 30–90 minuti, Risk basso. Niente nuove landing, A/B test o tracking.

15 settembre 2026 — Task scelto: rendere esplorabili le discipline nella landing Postdoc. Impact medio-alto potenziale su utilità e ricerche specifiche; Confidence alta sul bisogno informativo e sul dato, bassa sull’effetto traffico; Effort piccolo; Risk basso. Nove filtri esistenti, nessuna pagina duplicata. Prossima priorità: bilancio esplicito il 16 settembre, poi scegliere una landing sulla base dei dati disponibili.

14 settembre 2026 — Task scelto: completare il guardrail della PR #14, non aprire un’altra modifica. Impact medio (preserva i percorsi di scoperta), Confidence alta sul controllo/bassa sul traffico, Effort piccolo, Risk basso. Pubblicazione subordinata ai controlli remoti; non intervenire sulle integrazioni escluse. GSC ancora payment_required. Bilancio del 16 settembre confermato anche senza nuovi dati.

13 settembre 2026 — Terza sessione — Link contestuale dalla scheda alla categoria: Impact medio su esplorazione e scoperta landing, Confidence alta sul percorso/bassa sull’effetto traffico, Effort piccolo, Risk basso. Sostituito un link esistente usando la mappa SEO già presente. Nessuna nuova landing o filtro. Prossimo intervento: contenuto specifico verificato in una landing esistente; evitare nuove sessioni di sola documentazione.

13 settembre 2026 — Sessione aggiuntiva — Requisiti non troncati: Impact medio per completezza e ricerche specifiche, Confidence alta sul difetto/bassa sul traffico, Effort piccolo, Risk basso. Due schede attive corrette e causa rimossa nel normalizzatore. Prossimo task: un ulteriore contenuto verificato o collegamento contestuale utile, senza duplicare landing e senza nuovi dati GSC oggi.

13 settembre 2026 — Task scelto: riesame indicizzazione (Impact alto per diagnosi della visibilità, Confidence alta sulle evidenze tecniche ma indicizzazione non osservabile, Effort piccolo, Risk basso/sola lettura). Blocco GSC Wizard payment_required: sospendere le estrazioni tramite questo connettore fino a ripristino dell’accesso, senza abbonamenti o richieste quotidiane. Non fermare i piccoli task gratuiti su contenuti verificati. Conservare 296467 come controllo archivio; usare le tre schede Postdoc già verificate come ulteriore campione attivo. Prossimo task utile: verificare requisiti sulla fonte ufficiale di una scheda Postdoc e valutare un miglioramento circoscritto. Bilancio 16 settembre confermato, dichiarando eventuale indisponibilità di dati aggiornati.

12 settembre 2026 — Verifica recupero titoli Postdoc completata: Impact contenuto alto, Confidence alta, Effort piccolo, Risk basso. Tre schede su tre corrette live; titoli generici con scadenza non trascorsa 68→0. Nessun nuovo intervento applicativo. Prossima priorità: dal 13 settembre riesaminare in GSC il campione di indicizzazione già definito; bilancio traffico il 16 settembre.

11 settembre 2026 — Task scelto: riconoscere le etichette ufficiali dei titoli Postdoc. Impact alto potenziale per ricerche tematiche; Confidence alta sulla causa, bassa sull'effetto traffico; Effort piccolo, Risk basso. Due alias e tre test, niente workflow/persistenza. Dopo merge verificare il primo sync ordinario che usa il nuovo parser e i titoli del campione; non forzare import né modificare Supabase. Indicizzazione dal 13 settembre, bilancio clic il 16.

Aggiornamento 10 settembre 2026 — Titoli metadata senza doppio ente: Impact medio potenziale sui clic, Confidence alta sul difetto/bassa sull'effetto traffico, Effort 30 min, Risk basso. Correzione pronta per PR, 106 titoli interessati su 838; nessuna riscrittura dei dati. Obiettivo principale: clic organici, non numero di modifiche. Prossimo task: verificare 3 schede con titolo generico e contenuto ufficiale utile; campione indicizzazione dal 13 settembre, bilancio il 16. GA4 resta escluso dalle estrazioni automatiche.

Aggiornamento 9 settembre 2026 — Correzione audit freshness: Impact medio, Confidence alta, Effort piccolo, Risk basso. Eliminati 662 falsi warning; la fonte è ora segnalata una sola volta solo oltre 48 ore dall'ultimo controllo completo riuscito.

Aggiornamento 8 settembre 2026 — Fatto in PR #6: retry limitato per HTTP 429/500/502/503/504 ed errori di rete nell'import MUR. Impact alto, Confidence alta, Effort piccolo, Risk basso. Nessun cambio a schedule, segreti, persistenza o servizi.

Aggiornamento 7 settembre 2026 — Correzione richiesta dall'utente: timestamp ultimo controllo MUR riuscito. Impact medio, Confidence alta, Effort piccolo, Risk basso; PR in preparazione. Retry degli errori MUR fuori da questa modifica.

Tutti i task proposti usano strumenti esistenti; costo previsto €0, senza garanzia sui piani già attivi.
| Priorità | Task | Impact | Confidence | Effort | Risk | KPI |
|---|---|---|---|---|---|---|
| P0 | Estrarre baseline GA4/GSC e diagnosticare pageview | Alto | Alta sul bisogno; media sul bug | 30 min | Basso in lettura; tracking richiede approvazione | Copertura pageview, organic sessions |
| Fatto 2026-09-06 | CTA canoniche delle landing | Medio | Alta | ≤30 min | Basso; revert singolo file | 14 link corretti e verificati live |
| P1 | Verificare sync del giorno e discrepanza scadenze | Alto | Alta sul sintomo | 30 min | Basso diagnosi; workflow da valutare | Zero scaduti presentati aperti |
| P1 | Verificare 3–5 record needs_review | Alto | Alta | 30 min | Basso con fonti; revert lotto | Warning risolti, click fonte |
| P2 | Misurare CWV e UX mobile | Medio | Media | 30 min | Basso in lettura | LCP, INP, CLS |
| P2 | Selezionare landing da query GSC | Alto potenziale | Da stabilire | 30 min | Basso analisi | Click organici qualificati |
| P2 | Migliorare title su un campione | Medio | Media | 30 min | Basso e reversibile | CTR per query/pagina |
| P3 | Rendere breadcrumb genitore cliccabile | Basso-medio | Alta | 15 min | Basso e reversibile | Percorso verso categoria |
