# Istruzioni per le sessioni Claude Code su questo repo

## Tenere README.md e issue GitHub aggiornati — non è opzionale

Questa repo ha già avuto un incidente concreto per README e issue lasciate indietro: il branch `ds-restyle` è stato dichiarato "riconciliato con `main`, manca solo il sottodominio" nel README e nell'issue #11, mentre nel frattempo `main` proseguiva da solo con lavoro che rendeva quella dichiarazione falsa — è successo **due volte di fila**. Chi è arrivato dopo (umano o un'altra sessione Claude) si è fidato di quello scritto e ha perso tempo a ricostruire lo stato reale da zero con `git log`/`git diff`.

Quindi, ogni volta che una sessione su questo repo:

- **finisce una feature, un fix o un merge rilevante** → aggiorna `README.md` (sezione `Struttura` se sono cambiati file, sezione `Funzionalità principali` se è cambiato comportamento, sezione `Stato del repo e dei branch` se è cambiato lo stato di un branch/deploy). Non aspettare che te lo chieda esplicitamente Francesco: fallo come parte del lavoro, nello stesso commit o in uno immediatamente successivo.
- **apre, chiude o rende obsoleta un'issue GitHub** → aggiorna lo stato reale (`gh issue close`, `gh issue comment`) invece di lasciarla aperta/ambigua. Se un'issue descrive uno stato ("X è pronto, manca solo Y") che il lavoro appena fatto ha superato o smentito, commentalo subito — non lasciare che sia un'altra sessione a scoprirlo mesi dopo confrontando commit a mano.
- **lavora su un branch diverso da `main` che rischia di divergere** (restyle, feature lunghe) → nota nel README o nell'issue collegata *quando* è stato riconciliato l'ultima volta con `main`, così chi legge sa se l'informazione è ancora fresca invece di darla per buona a tempo indeterminato.

Prima di dichiarare un branch "pronto per il merge" o un'issue "risolta", verifica lo stato reale con `git log`/`git diff` contro `origin/main` aggiornato (non fidarti di un README/issue non toccati da un po' — potrebbero essere già superati, come è successo qui) e ricontrolla che `git status`/`git fetch` riflettano davvero il remote prima di fare affermazioni sullo stato dei branch.
