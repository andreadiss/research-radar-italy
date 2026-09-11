## Prioritized backlog

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
