## Baseline

Aggiornamento 9 settembre 2026 — GSC consolidata fino al 6 settembre: 10 agosto–6 settembre **17 impression, 3 clic, CTR 17,65%, posizione 11**; 31 agosto–6 settembre **12 impression, 3 clic, CTR 25%, posizione 4**. Tutti i clic visibili per pagina sono sulla home; le query mostrate non contengono i clic, coerentemente con anonimizzazione GSC. Nessuna attribuzione causale.

Freshness operativa: ultimo controllo MUR riuscito `2026-09-08T09:47:24.871Z`; stato fresh a 21,4 ore. L'audit non usa più `updatedAt` delle schede come proxy del controllo fonte.

Aggiornamento GSC 8 settembre 2026, dati consolidati fino al 5 settembre: 9 agosto–5 settembre **17 impression, 3 clic, CTR 17,65%, posizione 11**; 30 agosto–5 settembre **13 impression, 3 clic, CTR 23,08%, posizione 8,23**. Volumi troppo piccoli e finestre sovrapposte: nessuna attribuzione causale alle modifiche. GA4 non estratto.

Guardrail retry MUR: massimo 3 tentativi; retry solo per errori di rete e HTTP 429/5xx selezionati; HTTP 4xx permanenti falliscono subito; nessuna pubblicazione se tutti i tentativi falliscono.

Aggiornamento 7 settembre 2026 — Baseline controllo verificata: 2026-09-06T09:31:24Z, fine step Sync all open MUR positions, run https://github.com/andreadiss/research-radar-italy/actions/runs/34024680219. Non è una nuova scansione; nessuna nuova metrica traffico estratta.

Periodi da estrarre secondo timezone della proprietà, escludendo oggi:
- 7 giorni: 30 agosto–5 settembre; confronto 23–29 agosto 2026.
- 28 giorni: 9 agosto–5 settembre; confronto 12 luglio–8 agosto 2026.
GA4: utenti, sessioni, canali, organic/referral/direct, landing, pagine, engagement, returning, device, country, eventi: **non disponibili**.
GSC Wizard è disponibile in sola lettura per `sc-domain:rritaly.com`. Ultima estrazione 7 settembre 2026, dati maturi fino al 5 settembre:

| Finestra | Impression | Click | CTR | Posizione media |
|---|---:|---:|---:|---:|
| 8 agosto–4 settembre 2026 | 11 | 0 | 0% | 15,73 |
| 29 agosto–4 settembre 2026 | 7 | 0 | 0% | 13,29 |

Le finestre sono mobili e si sovrappongono alle baseline precedenti; non usare le differenze come prova di crescita o di effetto della PR #1. GA4 resta non disponibile e non va inferito da GSC.

Baseline tecnica riproducibile:
| Indicatore | Risultato |
|---|---:|
| Record posizioni totali | 750 |
| Posizioni aperte per audit al 6 settembre | 711 |
| Grants totali / disponibili | 11 / 6 |
| Test operativi | 32 superati |
| HTML controllati nell'export locale | 802 |
| URL sitemap locale | 756 |
| URL sitemap orfani / link interni rotti | 0 / 0 |
| Errori audit dati | 0 |
| First Load JS build home/posizioni/funding | 254 kB |
| First Load JS landing SEO | 97,4 kB |

I kB della build non sono una misura di Core Web Vitals. Nessun dato CrUX/Lighthouse raccolto.
