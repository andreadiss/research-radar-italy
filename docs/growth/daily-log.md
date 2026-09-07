# Daily log

2026-09-07 — Aggiornamento semantica badge richiesto dall'utente: “Dati MUR” con data corrente lato browser, timezone Europa/Roma. La distinzione rispetto alla freshness effettiva sarà oggetto di usability test.

Aggiornamento 7 settembre 2026 — Preparata correzione ultimo controllo MUR su main 0ccc595. 33 test passati (inclusi invarianti su timestamp), build production 807 route, TypeScript OK, audit dati 0 errori, audit statico 802 HTML e 0 link rotti/orfani. PR/deploy da verificare; nessun nuovo controllo live MUR eseguito.


2026-09-06 — Audit iniziale e correzione CTA SEO (LOW RISK).
PR: https://github.com/andreadiss/research-radar-italy/pull/1
Modifica: 5 definizioni URL, 7 landing, 14 CTA. Build static 807 route; TypeScript OK; 32 test OK; audit dati 0 errori; audit static 802 HTML, 0 broken link, 0 orphan sitemap. Verificati nel browser filtri Postdoc (61) e MSCA (2) e canonical delle sezioni. Stato al commit: PR pronta, preview in corso; merge e verifica finale produzione da registrare nel report di sessione. Baseline privata e mobile/CWV incompleti. Prossimo task: baseline GA4/GSC e diagnosi pageview. Nessuna crescita misurata.

2026-09-07 — Verifica post-deploy PR #1 (LOW RISK, research only).
PR #1 mergiata il 6 settembre; nessuna PR aperta. `main` corrente c1f9c98 contiene anche il successivo aggiornamento automatico MUR. Verificati HTTP 200 per home, Postdoc, MSCA e destinazioni filtrate; 2/2 CTA campionate per landing usano le sezioni canoniche; canonical delle landing corretti. GSC: 11 impression/0 click/posizione 15,73 su 28 giorni mobili e 7 impression/0 click/posizione 13,29 su 7 giorni, fino al 4 settembre. Nessuna attribuzione alla modifica: deploy troppo recente e finestre sovrapposte. Prossimo task: verificare freshness e discrepanza delle scadenze nel sito statico.
