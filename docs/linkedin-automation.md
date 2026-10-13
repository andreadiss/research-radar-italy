# LinkedIn Research Radar Italy — senza Buffer, costo zero

## Flusso
Ogni lunedì il workflow GitHub Actions **Prepare LinkedIn draft (approval required)** legge le opportunità già importate da MUR, seleziona fino a cinque posizioni pubblicate negli ultimi sette giorni e con scadenza futura e crea una **GitHub Issue** con una proposta di post. Le posizioni contrassegnate per revisione sono escluse.

## Come approvare e pubblicare
1. Vai in GitHub → **Issues** → **LinkedIn draft approval — YYYY-Www**.
2. Controlla uno per uno i link ufficiali, le scadenze, il settore e i dettagli della posizione.
3. Copia la sezione **Testo proposto** (senza i titoli Markdown) nel composer della pagina LinkedIn **Research Radar Italy**.
4. Modifica o programma il post usando le funzionalità native di LinkedIn.
5. Chiudi la GitHub Issue per segnare l'operazione come completata.

Il workflow **non accede a LinkedIn, non pubblica e non programma nulla**. L'ultima azione richiede sempre una persona. Nessun account Buffer e nessuna API a pagamento.

## Attivazione e prova
Dopo il merge della pull request, apri GitHub → Actions → **Prepare LinkedIn draft (approval required)** → **Run workflow**. Il job pianificato parte ogni lunedì alle 08:30 UTC (10:30 in Italia con ora legale / 09:30 con ora solare). Se non ci sono posizioni recenti valide, non apre alcuna issue. Una sola issue a settimana; i run pianificati di GitHub possono subire ritardi.

## Limiti e metriche
- Tutti i dati sono presenti in un repository GitHub pubblico: la bozza è visibile pubblicamente nelle issue.
- Le bozze contengono link UTM; per misurare conversioni e visite servono analytics del sito.
- Le opportunità di categorie non incluse nella cache MUR non vengono coperte.
- È consigliabile correggere o integrare il testo prima di pubblicarlo: il copy viene generato con un modello testuale senza AI e senza costi.
