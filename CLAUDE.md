# Istruzioni per le sessioni Claude Code su questo repo

## La bussola — a cosa serve quest'app

Prima di aggiungere, togliere o riprogettare qualcosa, rileggere «A cosa servono le app degli eventi» nel `README.md`. In breve — l'app tiene il filo col cliente dall'iscrizione alla fine dell'evento, e trasforma quell'attenzione **bilanciando utilità e vendita**: utilità = tutto ciò che serve per arrivare preparati e vivere al meglio l'avventura; vendita = solo tre strade (scoprire un altro evento, agganciarsi alla serie BAS, i due insieme con un contenuto utile come veicolo); più la superficie B2B, dove sponsor e territori entrano **dentro** una funzione utile (lista della spesa, POI partner) e mai come cartellone. L'utilità non arretra mai per far posto a chi paga.

## Tenere README.md e issue GitHub aggiornati — non è opzionale

Questa repo ha già avuto un incidente concreto per README e issue lasciate indietro: il branch `ds-restyle` è stato dichiarato "riconciliato con `main`, manca solo il sottodominio" nel README e nell'issue #11, mentre nel frattempo `main` proseguiva da solo con lavoro che rendeva quella dichiarazione falsa — è successo **due volte di fila**. Chi è arrivato dopo (umano o un'altra sessione Claude) si è fidato di quello scritto e ha perso tempo a ricostruire lo stato reale da zero con `git log`/`git diff`.

Quindi, ogni volta che una sessione su questo repo:

- **finisce una feature, un fix o un merge rilevante** → aggiorna `README.md` (sezione `Struttura` se sono cambiati file, sezione `Funzionalità principali` se è cambiato comportamento, sezione `Stato del repo e dei branch` se è cambiato lo stato di un branch/deploy). Non aspettare che te lo chieda esplicitamente Francesco: fallo come parte del lavoro, nello stesso commit o in uno immediatamente successivo.
- **apre, chiude o rende obsoleta un'issue GitHub** → aggiorna lo stato reale (`gh issue close`, `gh issue comment`) invece di lasciarla aperta/ambigua. Se un'issue descrive uno stato ("X è pronto, manca solo Y") che il lavoro appena fatto ha superato o smentito, commentalo subito — non lasciare che sia un'altra sessione a scoprirlo mesi dopo confrontando commit a mano.
- **lavora su un branch diverso da `main` che rischia di divergere** (restyle, feature lunghe) → nota nel README o nell'issue collegata *quando* è stato riconciliato l'ultima volta con `main`, così chi legge sa se l'informazione è ancora fresca invece di darla per buona a tempo indeterminato.

Prima di dichiarare un branch "pronto per il merge" o un'issue "risolta", verifica lo stato reale con `git log`/`git diff` contro `origin/main` aggiornato (non fidarti di un README/issue non toccati da un po' — potrebbero essere già superati, come è successo qui) e ricontrolla che `git status`/`git fetch` riflettano davvero il remote prima di fare affermazioni sullo stato dei branch.

## Verificare in locale prima di pushare — non serve pushare per "vedere se funziona"

`main` fa deploy automatico su GitHub Pages (produzione, vedi "Stato del repo e dei branch" nel README) ed è già usato da persone reali. Non c'è bisogno di pushare e aspettare il deploy per controllare l'effetto di una modifica: basta un server statico locale, già documentato nel README sotto "Come si apre" (`npx serve .` o `python3 -m http.server 8000` — serve HTTPS/localhost per geolocalizzazione e service worker). Apri `index.html` lì, verifica la modifica a occhio, e pusha solo dopo. Il push su `main` non è l'ambiente di anteprima: se lo si usa come tale, ogni tentativo/errore diventa un deploy in produzione visibile a chiunque stia usando l'app in quel momento.

Per modifiche a `sw.js` o alla cache: il service worker resta appiccicato alla versione precedente finché non bumpi `CACHE`, e nel browser locale i DevTools (Application → Service Workers → "Update on reload", oppure "Bypass for network") permettono di verificare il comportamento offline/cache senza dover pushare più volte per trovare il numero giusto.

Questo non cambia lo stile di lavoro già in uso su questo repo (branch di vita breve → merge appena pronto, niente PR ferme in attesa di review) — riguarda solo *cosa* si verifica prima di quel merge/push, non *come* si brancha.
