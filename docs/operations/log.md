# Registro operativo

| Data | Operazione | Risultato | Verifica / rollback |
|---|---|---|---|
| 2026-09-05 | Audit pubblico + codice sul commit 062703f | Baseline tecnica e dati salvata; GA4 richiede autenticazione | Snapshot in questa cartella |
| 2026-09-05 | Prima tranche P0/P1 | Rendering, indice, scadenze, URL, metadata, schema, CTA, guardie dati | Build riuscita; test archivio 4/4; audit statico senza errori |
| 2026-09-05 | Controllo budget Work | Vincolo richiesto 60%/60% e riserva 40% registrati; limite piattaforma non impostabile | Nessuna nuova schedulazione Work attiva; sync GitHub esistenti mantenute |
| 2026-09-05 | Preview browser locale | Launcher incompatibile con Next.js esistente | Nessuna migrazione/modifica dev imposta per l'anteprima; build statica verificata |

Pubblicazione e controlli live vengono aggiunti dopo l'esito del deploy. I risultati SEO/di traffico richiedono una baseline e tempo di osservazione; non sono inferiti dal successo della build.
