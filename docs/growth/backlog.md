## Prioritized backlog

Aggiornamento 8 settembre 2026 — In lavorazione retry limitato per HTTP 429/500/502/503/504 ed errori di rete nell'import MUR: Impact alto, Confidence alta, Effort piccolo, Risk basso. Nessun cambio a schedule, segreti, persistenza o servizi.

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
