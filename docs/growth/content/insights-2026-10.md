# Ottobre 2026: una fotografia parziale delle opportunità di ricerca

**Bozza storica del 4 novembre 2026, sostituita dalla versione approvata del 7 novembre.** I numeri qui sotto appartengono allo snapshot precedente. La versione destinata al sito è in `app/insights/2026-10/page.tsx`: 929 schede dal 1° al 31 ottobre, snapshot `340f35f854a88886e784bd823dfe487e4d963c0a`, ultimo controllo 7 novembre 2026, SHA256 `d9a673542868bb6df3488788c03025f0e0fedeeb11935da844914b2266de2610`. Riproduzione: `node scripts/monthly-insights.mjs 2026-10 2026-11-07T10:00:00Z` sullo snapshot indicato. Approvata la fotografia del catalogo osservato, non un bilancio completo né un confronto di mercato.

## Il dato da cui partire

Nel catalogo Research Radar Italy sono presenti **828 schede con data di pubblicazione dal 1° al 31 ottobre 2026**. Sono comprese quelle oggi scadute o archiviate: il conteggio riguarda le pubblicazioni registrate, non le opportunità ancora aperte, i posti disponibili o le assunzioni.

L'ultimo controllo completo riuscito è del 3 novembre. Non sappiamo se bandi scaduti prima del controllo siano assenti dalla cache: un sync dopo fine mese e la presenza di date fino al 31 non dimostrano una raccolta esaustiva. L'aumento rispetto alla precedente bozza riflette il diverso snapshot, non una crescita del mercato.

## 1. Non cercare soltanto la parola «Postdoc»

| Tipologia registrata | Schede |
|---|---:|
| Incarico di ricerca | 352 |
| Postdoc | 207 |
| Contratto di ricerca | 117 |
| RTT | 92 |
| Professore I fascia | 19 |
| Tecnologo | 19 |
| Professore II fascia | 12 |
| PhD | 10 |
| **Totale** | **828** |

Incarichi, Postdoc e contratti raccolgono **676 schede su 828, l'81,6%** del campione. Le tre denominazioni non sono equivalenti: requisiti, durata e attività vanno letti nel singolo bando. Il dato suggerisce un metodo pratico di ricerca, non una scelta di carriera: esplorare più tipologie compatibili con il proprio profilo prima di restringere la selezione.

Percorsi già disponibili: [Postdoc](/posizioni/postdoc/), [contratti di ricerca](/posizioni/contratti-di-ricerca/), [tutte le opportunità per scadenza](/posizioni/indice/). I risultati correnti non coincidono con il campione storico del mese; una scheda inclusa nei conteggi può essere scaduta.

## 2. Due aree raccolgono 316 schede del campione

| Area del catalogo | Schede |
|---|---:|
| Ingegneria, informatica e AI | 181 |
| Matematica, fisica e chimica | 135 |
| Medicina e salute | 87 |
| Economia, diritto e politica | 85 |
| Biologia, biotech e farmacia | 80 |
| Ambiente, agraria e veterinaria | 73 |
| Filosofia, storia, lingue e pedagogia | 64 |
| Architettura, design e territorio | 55 |
| Altro / interdisciplinare | 43 |
| Psicologia | 25 |

Le prime due aree rappresentano **316/828 schede, il 38,2%** del campione. Sono categorie del radar, non una graduatoria dell'intera ricerca italiana. Psicologia resta separata dalle discipline filosofiche, storiche, linguistiche e pedagogiche. Per decidere se candidarsi, l'area è un punto di partenza: occorre verificare SSD e argomento specifico del progetto nella fonte ufficiale.

## 3. La sede aiuta a restringere la ricerca, non a stimare le probabilità

| Localizzazione registrata | Schede |
|---|---:|
| Lazio | 147 |
| Emilia-Romagna | 132 |
| Lombardia | 123 |
| Veneto | 73 |
| Piemonte | 68 |

Queste cinque regioni raccolgono **543/828 schede, il 65,6%** del campione. Altre 25 schede riportano la localizzazione generica «Italia»: non sono attribuite a una regione. Sede dell'ente e luogo effettivo di lavoro possono richiedere una verifica del bando; questi numeri non misurano concorrenza o probabilità di selezione.

## I temi citati nei testi: un'indicazione, non una classifica

| Famiglia lessicale predefinita | Schede con almeno una menzione |
|---|---:|
| IA e machine learning | 56 |
| Energia | 40 |
| Riferimenti «neuro-» | 32 |
| Tumori e oncologia | 20 |
| Clima | 22 |

La ricerca è eseguita su titoli e sintesi MUR con cinque famiglie lessicali fisse. Un progetto può comparire in più righe. I risultati possono includere riferimenti di contesto e omettere sinonimi: non identificano tutti i temi né dimostrano una crescita della domanda. Quando una sintesi è troncata, non ne ricostruiamo il seguito.

## Come usare questa fotografia

1. Esplora più tipologie compatibili con i requisiti che possiedi.
2. Restringi per disciplina e sede, poi confronta il progetto effettivo, non soltanto il titolo dell'incarico.
3. Controlla scadenza, requisiti e modalità di invio nella fonte ufficiale: il campione storico non conferma l'apertura attuale.

[Cerca le opportunità](/posizioni/) · [Come leggere un bando](/guide/leggere-bando-ricerca/).

## Perché non mostriamo un confronto con settembre

Settembre e ottobre non hanno una copertura comparabile verificata. Confrontare 828 schede del catalogo osservato con il numero del mese precedente potrebbe far sembrare una lacuna dei dati un cambiamento del mercato. Non calcoliamo variazioni mensili, né concludiamo che un settore cresca o diminuisca.

### Fonte e riproduzione

Cache MUR/Cineca `lib/generated/mur-positions.json` su main `27360a8d39d021142c57f01df33239b57fcc35f0`; ultimo controllo completo riuscito `2026-11-03T12:54:12.531Z`. SHA256 `a83533f98a10b3ceef52f425d681508624b6e15cfd113d6e5493accf9a78745c`.

Comando: `node scripts/monthly-insights.mjs 2026-10 2026-11-04T08:44:16Z`. ID univoci per scheda, inclusi record scaduti/archiviati; possibili procedure distinte con più posti, nessuna equivalenza schede=posti. Quote calcolate sui conteggi restituiti dallo script e arrotondate a un decimale. Aree e sedi sono quelle registrate nel catalogo, non nuove classificazioni editoriali.

Readiness: `monthClosed=true`, `checkedAfterMonthEnd=true`, `historicalCoverageVerified=false`, `marketComparisonAllowed=false`. Blocker residuo: `historical-coverage-not-validated`.

### Gate prima di un eventuale rilascio

- Verificare la copertura storica e l'ultimo controllo fonte; un sync successivo, da solo, non certifica la completezza.
- Se si mantiene il perimetro parziale, confermare esplicitamente titolo, date e limiti anche nella card homepage; non sostituire silenziosamente il numero completo previsto.
- Ricontrollare conteggi, hash, tutti i percorsi e tre evidenze numeriche; niente confronto mensile finché non valido.
- Integrare articolo, archivio e accesso homepage nella stessa PR di pubblicazione, dopo i guardrail. Questa bozza non crea route, sitemap o nuove promesse editoriali pubbliche.
