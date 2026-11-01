# Ottobre 2026: una fotografia parziale delle opportunità di ricerca

**Bozza interna del 1° novembre 2026. Non pubblicata, non collegata al sito.** Il mese è terminato, ma la raccolta disponibile si ferma al 21 ottobre. Prima della pubblicazione occorre scegliere e verificare un perimetro esplicitamente parziale oppure aggiornare e validare la copertura. Non presentare questa bozza come il bilancio completo di ottobre.

## Il dato da cui partire

Nel catalogo Research Radar Italy sono presenti **647 schede con data di pubblicazione dal 1° al 21 ottobre 2026**. Sono comprese quelle oggi scadute o archiviate: il conteggio riguarda le pubblicazioni registrate, non le opportunità ancora aperte, i posti disponibili o le assunzioni.

Mancano verifiche complete successive al 21 ottobre. Non sappiamo quante pubblicazioni del 22–31 ottobre siano assenti, né se la raccolta precedente sia esaustiva. L'assenza di schede per quei giorni non significa assenza di bandi.

## 1. Non cercare soltanto la parola «Postdoc»

| Tipologia registrata | Schede |
|---|---:|
| Incarico di ricerca | 288 |
| Postdoc | 177 |
| Contratto di ricerca | 100 |
| RTT | 39 |
| Professore I fascia | 14 |
| Tecnologo | 11 |
| PhD | 9 |
| Professore II fascia | 9 |
| **Totale** | **647** |

Incarichi, Postdoc e contratti raccolgono **565 schede su 647, l'87,3%** del campione. Le tre denominazioni non sono equivalenti: requisiti, durata e attività vanno letti nel singolo bando. Il dato suggerisce un metodo pratico di ricerca, non una scelta di carriera: esplorare più tipologie compatibili con il proprio profilo prima di restringere la selezione.

Percorsi già disponibili: [Postdoc](/posizioni/postdoc/), [contratti di ricerca](/posizioni/contratti-di-ricerca/), [tutte le opportunità per scadenza](/posizioni/indice/). I risultati correnti non coincidono con il campione storico del mese; una scheda inclusa nei conteggi può essere scaduta.

## 2. Due aree raccolgono 252 schede del campione

| Area del catalogo | Schede |
|---|---:|
| Ingegneria, informatica e AI | 145 |
| Matematica, fisica e chimica | 107 |
| Economia, diritto e politica | 67 |
| Medicina e salute | 67 |
| Biologia, biotech e farmacia | 62 |
| Ambiente, agraria e veterinaria | 53 |
| Architettura, design e territorio | 48 |
| Filosofia, storia, lingue e pedagogia | 46 |
| Altro / interdisciplinare | 33 |
| Psicologia | 19 |

Le prime due aree rappresentano **252/647 schede, il 38,9%** del campione. Sono categorie del radar, non una graduatoria dell'intera ricerca italiana. Psicologia resta separata dalle discipline filosofiche, storiche, linguistiche e pedagogiche. Per decidere se candidarsi, l'area è un punto di partenza: occorre verificare SSD e argomento specifico del progetto nella fonte ufficiale.

## 3. La sede aiuta a restringere la ricerca, non a stimare le probabilità

| Localizzazione registrata | Schede |
|---|---:|
| Lazio | 128 |
| Lombardia | 102 |
| Emilia-Romagna | 67 |
| Piemonte | 58 |
| Veneto | 57 |

Queste cinque regioni raccolgono **412/647 schede, il 63,7%** del campione. Altre 25 schede riportano la localizzazione generica «Italia»: non sono attribuite a una regione. Sede dell'ente e luogo effettivo di lavoro possono richiedere una verifica del bando; questi numeri non misurano concorrenza o probabilità di selezione.

## I temi citati nei testi: un'indicazione, non una classifica

| Famiglia lessicale predefinita | Schede con almeno una menzione |
|---|---:|
| IA e machine learning | 48 |
| Energia | 30 |
| Riferimenti «neuro-» | 26 |
| Tumori e oncologia | 18 |
| Clima | 16 |

La ricerca è eseguita su titoli e sintesi MUR con cinque famiglie lessicali fisse. Un progetto può comparire in più righe. I risultati possono includere riferimenti di contesto e omettere sinonimi: non identificano tutti i temi né dimostrano una crescita della domanda. Quando una sintesi è troncata, non ne ricostruiamo il seguito.

## Come usare questa fotografia

1. Esplora più tipologie compatibili con i requisiti che possiedi.
2. Restringi per disciplina e sede, poi confronta il progetto effettivo, non soltanto il titolo dell'incarico.
3. Controlla scadenza, requisiti e modalità di invio nella fonte ufficiale: il campione storico non conferma l'apertura attuale.

[Cerca le opportunità](/posizioni/) · [Come leggere un bando](/guide/leggere-bando-ricerca/).

## Perché non mostriamo un confronto con settembre

Settembre e ottobre non hanno una copertura comparabile verificata. Confrontare 647 schede di una raccolta parziale con il numero del mese precedente farebbe sembrare una lacuna dei dati un cambiamento del mercato. Non calcoliamo variazioni mensili, né concludiamo che un settore cresca o diminuisca.

### Fonte e riproduzione

Cache MUR/Cineca `lib/generated/mur-positions.json` su main `c5945707d6f6a9481b7184d18d08371b81623261`; ultimo controllo completo riuscito `2026-10-21T10:16:40.979Z`. SHA256 `2a7b1ba0f3388e4101f5f2e6e159b4d2618aa425c41ef9cc9c5522a216a5890a`.

Comando: `node scripts/monthly-insights.mjs 2026-10 2026-11-01T08:11:35Z`. ID univoci per scheda, inclusi record scaduti/archiviati; possibili procedure distinte con più posti, nessuna equivalenza schede=posti. Quote calcolate sui conteggi restituiti dallo script e arrotondate a un decimale. Aree e sedi sono quelle registrate nel catalogo, non nuove classificazioni editoriali.

Readiness: `monthClosed=true`, `checkedAfterMonthEnd=false`, `historicalCoverageVerified=false`, `marketComparisonAllowed=false`. Blocker: `source-check-before-month-end`, `historical-coverage-not-validated`.

### Gate prima di un eventuale rilascio

- Verificare la copertura storica e l'ultimo controllo fonte; un sync successivo, da solo, non certifica la completezza.
- Se si mantiene il perimetro parziale, confermare esplicitamente titolo, date e limiti anche nella card homepage; non sostituire silenziosamente il numero completo previsto.
- Ricontrollare conteggi, hash, tutti i percorsi e tre evidenze numeriche; niente confronto mensile finché non valido.
- Integrare articolo, archivio e accesso homepage nella stessa PR di pubblicazione, dopo i guardrail. Questa bozza non crea route, sitemap o nuove promesse editoriali pubbliche.
