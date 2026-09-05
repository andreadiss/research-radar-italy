# Registro operativo

| Data | Operazione | Risultato | Verifica / rollback |
|---|---|---|---|
| 2026-09-05 | Audit pubblico + codice sul commit 062703f | Baseline tecnica e dati salvata; GA4 richiede autenticazione | Snapshot in questa cartella |
| 2026-09-05 | Prima tranche P0/P1 | Rendering, indice, scadenze, URL, metadata, schema, CTA, guardie dati | Build riuscita; test archivio 4/4; audit statico senza errori |
| 2026-09-05 | Controllo budget Work | Vincolo richiesto 60%/60% e riserva 40% registrati; limite piattaforma non impostabile | Nessuna nuova schedulazione Work attiva; sync GitHub esistenti mantenute |
| 2026-09-05 | Preview browser locale | Launcher incompatibile con Next.js esistente | Nessuna migrazione/modifica dev imposta per l'anteprima; build statica verificata |

Pubblicazione completata: commit applicativo `35d60e50bf0c394ce7a07e4930c61d728982e928`, [deploy riuscito](https://github.com/andreadiss/research-radar-italy/actions/runs/33952746925). HTTP 200 per homepage, indice, pagina 2 e scheda archiviata. Sitemap live: 741 URL. Browser: homepage 696 posizioni/6 grant; filtro PhD 198 schede e 198 link diretti. Rollback: revert del solo commit applicativo, mantenendo gli eventuali successivi aggiornamenti dati. Il primo sync reale con archiviazione sarà controllato nel prossimo ciclo autorizzato. I risultati SEO/di traffico richiedono una baseline e tempo di osservazione; non sono inferiti dal successo della build.
