# Istruzioni per le sessioni Claude Code su questo repo

Chi ti ha avviato **non è per forza un programmatore**, e spesso non sa quale
delle regole qui sotto sta per infrangere. Parla in italiano, senza gergo, e
**spiega cosa stai per fare prima di farlo**. Se una richiesta va contro una
di queste regole, non la eseguire «intanto»: dillo, spiega perché, e proponi la
strada giusta. Non è maleducazione, è il lavoro.

---

## Fermati e leggi — le cinque cose da sapere prima di toccare un file

Da dire alla persona **all'inizio di ogni sessione**, in due righe, prima di
qualsiasi modifica.

### 1. Questa è un'app-evento viva, non il template

Questa repo è la guida del **Trentino Gravel** (26 settembre 2026). `main` va
online da solo su <https://trentinogravel.bikeadventureseries.com> e dentro ci
sono **partecipanti veri**, che l'hanno installata sul telefono.

Le app-evento di BAS hanno tutte lo stesso motore, e il motore vive in un posto
solo — la repo **`advlabbik/event-app-template`**. Questa è una delle tre app
nate **prima** che il template esistesse (con `tuscany-trail-app` e
`northcape4000-app`), quindi qui il motore sta ancora dentro `index.html` e non
in una cartella `motore/`. Non cambia la regola, cambia solo che qui **non c'è
un controllo automatico che ti fermi**: ci sei tu.

### 2. Qui si cambiano solo contenuti e veste grafica

| Si tocca qui | Non si tocca qui — è motore |
|---|---|
| `content.js` (testi, IT **e** EN) | `index.html`, tranne `<title>`, `<html lang>`, logo e `theme-color` |
| `config.js` (dati secchi, chiavi pubbliche) | `styles.css` (tranne colori e caratteri) |
| `tracks.js`, `poi.js`, `gpx/`, `docs/liste-poi/` (generati dagli script) | `sw.js`, tranne il numero in `CACHE` |
| `assets/`, `icons/icon-*.png`, `fonts/` | `staff.html`, `icons.js`, `icons/sprite.svg`, `uso.js` |
| `manifest.webmanifest` (nome, descrizione, colori) | `scripts/`, `supabase/` |
| `README.md`, `docs/` | |

«Motore» è tutto ciò che decide **come funziona** una schermata — il cancello
d'accesso, il GPS, la ricerca, le mappe, le notifiche, l'installazione. Un
testo, una data, un colore, un logo, una traccia sono contenuto.

### 3. Se serve cambiare il motore, non si fa qui. Mai. Nemmeno «solo per questa volta»

Succede, ed è legittimo: manca una funzione, c'è un bug, una schermata non
regge. Il giro è sempre lo stesso:

1. **Fermati e dillo alla persona.** Spiega che è una modifica al motore.
2. La modifica si fa in **`advlabbik/event-app-template`**, dove vale per tutte
   le app. Se hai i permessi apri la sessione lì, altrimenti scrivilo in
   `#segnalazioni-test` (vedi punto 5) e fermati.
3. Da lì Francesco la porta giù in ogni app. **Portare giù** vuol dire
   ricopiare i file cambiati **dal template**; **copiare un pezzo da un'altra
   app-evento non è un porting**, è un'altra versione in più.

Perché è così rigido — prima del template, la stessa correzione fatta a mano in
tre app ha prodotto tre motori che oggi differiscono di centinaia di righe. Ogni
volta che si tocca il motore qui dentro, questa app si stacca un po' di più
dal template e la migrazione (punto 4) diventa più lunga. La PR #30 di
settembre 2026 è l'esempio da non ripetere: chiedeva di «portare a mano» in
`index.html` la funzione `?code=` che nel template era già fatta.

**Una PR che tocca i file della colonna destra della tabella non si merge**:
si chiude, e la modifica si rifà nel template.

### 4. Lo stato di questa app rispetto al template

Il motore di questa guida va **sostituito con quello del template**. È un
lavoro di Francesco, ancora da fare, e finché non è fatto ogni riga di motore
scritta qui è una riga in più da riconciliare. Le funzioni che il template ha e
questa app no (per esempio `?code=` nel cancello, il QR personale del ritiro
pacco) **arrivano con quella migrazione**, non con un porting a mano.

Se ti accorgi che questa nota è vecchia — cioè il motore è già stato portato e
c'è una cartella `motore/` — aggiorna questa sezione e il README, come parte
del lavoro.

### 5. Come si lavora, in una riga

**Ramo → modifiche → verifica in locale, guardata con gli occhi → commit → push
→ merge.** Mai direttamente su `main`. Se sei su `main`, crea un ramo con un
nome che dica di cosa si tratta, poi dillo alla persona: non serve chiedere il
permesso per creare il ramo.

Per i contenuti e la veste grafica il ramo ha vita breve e si merge appena è
verificato, come si è sempre fatto qui. Nel dubbio se una cosa sia contenuto o
motore, **chiedi prima in `#segnalazioni-test`**, non dopo.

**Tutto quello che deve arrivare a Francesco** — una PR che aspetta lui, un
dato che manca, un motore da portare giù, una cosa rotta — va scritto nel
canale Slack **`#segnalazioni-test`**, dove legge la sua sessione Claude sempre
accesa. Non in messaggio diretto, non in altri canali, non solo in un commento
GitHub: lì non lo vede nessuno finché non è tardi.

---

## La bussola — a cosa serve quest'app

Prima di aggiungere, togliere o riprogettare qualcosa, rileggere «A cosa servono le app degli eventi» nel `README.md`. In breve — l'app tiene il filo col cliente dall'iscrizione alla fine dell'evento, e trasforma quell'attenzione **bilanciando utilità e vendita**: utilità = tutto ciò che serve per arrivare preparati e vivere al meglio l'avventura; vendita = solo tre strade (scoprire un altro evento, agganciarsi alla serie BAS, i due insieme con un contenuto utile come veicolo); più la superficie B2B, dove sponsor e territori entrano **dentro** una funzione utile (lista della spesa, POI partner) e mai come cartellone. L'utilità non arretra mai per far posto a chi paga.

## Regole editoriali (decisioni di Andrea — bloccanti)

Sono le stesse del template, e valgono anche qui.

1. **Mai i due punti `:` nella prosa** rivolta ai partecipanti, in nessuna
   lingua (ok negli orari tipo 17:00).
2. Nell'app c'è **solo quello che è stato comunicato**. Niente informazioni non
   decise, niente segnaposto visibili. Se una cosa deve esserci ma non è ancora
   nota, si scrive "Da definire" ben visibile: non si inventa e non si toglie in
   silenzio.
3. Ogni testo va scritto in **tutte e due le lingue**, `CONTENT.it` e
   `CONTENT.en`, sempre.
4. **Niente link o pulsanti verso Airbnb**, in nessuna forma.
5. L'account Stay22 è `adventurelabsrl` e non si cambia. Cambia solo la
   campagna, che è dell'evento.
6. Km e dislivello ufficiali **non si ricalcolano mai dal GPX**. Stanno in
   `content.js` e li dà l'organizzazione.

## Cose che non si fanno mai

- `git push --force`, `git reset --hard`, riscrivere la storia, cancellare rami
  altrui.
- Committare **dati personali dei partecipanti** — elenchi, email, telefoni,
  CSV di iscritti. Non passano da questa repo.
- Committare password o chiavi private. La anon key di Supabase in `config.js`
  è pubblica per costruzione; la service role key e la chiave privata VAPID no,
  mai, nemmeno in chat.
- Rendere privata la repo: GitHub Pages sul piano Free si spegne da solo e la
  guida va offline (è già successo il 31/8/2026, vedi README).

## Tenere README.md e issue GitHub aggiornati — non è opzionale

Questa repo ha già avuto un incidente concreto per README e issue lasciate indietro: il branch `ds-restyle` è stato dichiarato "riconciliato con `main`, manca solo il sottodominio" nel README e nell'issue #11, mentre nel frattempo `main` proseguiva da solo con lavoro che rendeva quella dichiarazione falsa — è successo **due volte di fila**. Chi è arrivato dopo (umano o un'altra sessione Claude) si è fidato di quello scritto e ha perso tempo a ricostruire lo stato reale da zero con `git log`/`git diff`.

Quindi, ogni volta che una sessione su questo repo:

- **finisce una feature, un fix o un merge rilevante** → aggiorna `README.md` (sezione `Struttura` se sono cambiati file, sezione `Funzionalità principali` se è cambiato comportamento, sezione `Stato del repo e dei branch` se è cambiato lo stato di un branch/deploy). Non aspettare che te lo chieda esplicitamente Francesco: fallo come parte del lavoro, nello stesso commit o in uno immediatamente successivo.
- **apre, chiude o rende obsoleta un'issue GitHub** → aggiorna lo stato reale (`gh issue close`, `gh issue comment`) invece di lasciarla aperta/ambigua. Se un'issue descrive uno stato ("X è pronto, manca solo Y") che il lavoro appena fatto ha superato o smentito, commentalo subito — non lasciare che sia un'altra sessione a scoprirlo mesi dopo confrontando commit a mano.
- **lavora su un branch diverso da `main` che rischia di divergere** (restyle, feature lunghe) → nota nel README o nell'issue collegata *quando* è stato riconciliato l'ultima volta con `main`, così chi legge sa se l'informazione è ancora fresca invece di darla per buona a tempo indeterminato.

Prima di dichiarare un branch "pronto per il merge" o un'issue "risolta", verifica lo stato reale con `git log`/`git diff` contro `origin/main` aggiornato (non fidarti di un README/issue non toccati da un po' — potrebbero essere già superati, come è successo qui) e ricontrolla che `git status`/`git fetch` riflettano davvero il remote prima di fare affermazioni sullo stato dei branch.

## Verificare in locale prima di pushare — non serve pushare per "vedere se funziona"

`main` fa deploy automatico su GitHub Pages (produzione, vedi "Stato del repo e dei branch" nel README) ed è già usato da persone reali. Non c'è bisogno di pushare e aspettare il deploy per controllare l'effetto di una modifica: basta un server statico locale, già documentato nel README sotto "Come si apre" (`npx serve .` o `python3 -m http.server 8000` — serve HTTPS/localhost per geolocalizzazione e service worker). Apri `index.html` lì, verifica la modifica a occhio, e pusha solo dopo. Il push su `main` non è l'ambiente di anteprima: se lo si usa come tale, ogni tentativo/errore diventa un deploy in produzione visibile a chiunque stia usando l'app in quel momento.

E un «fatto» non è una verifica: la verifica è la pagina guardata con gli occhi,
anche dal telefono.

Per modifiche a `sw.js` o alla cache: il service worker resta appiccicato alla versione precedente finché non bumpi `CACHE`, e nel browser locale i DevTools (Application → Service Workers → "Update on reload", oppure "Bypass for network") permettono di verificare il comportamento offline/cache senza dover pushare più volte per trovare il numero giusto. **Incrementa `CACHE` in `sw.js` a ogni modifica dei file dell'app**, o chi ha la guida installata resta sulla versione precedente e non se ne accorge nessuno.

Se in locale l'app è bianca o mostra il nome di un altro evento, è la cache del
browser condivisa fra le app-evento sullo stesso `localhost`, non il tuo codice.
Usa una porta diversa per ogni app (`8001`, `8002`) e, se non basta, dalla
console del browser smonta service worker e cache e ricarica con
`Cmd+Shift+R`. La spiegazione per esteso è nel `CLAUDE.md` del template.

Questo non cambia lo stile di lavoro già in uso su questo repo (branch di vita breve → merge appena pronto, niente PR ferme in attesa di review) — riguarda solo *cosa* si verifica prima di quel merge/push, non *come* si brancha.
