# TG Guida — Trentino Gravel

Web app (PWA) che accompagna i partecipanti del **Trentino Gravel — Pioneer Edition** (26 settembre 2026, partenza/arrivo da Manifattura Tabacchi, Rovereto) prima, durante e dopo l'evento.

Vanilla JS, nessun build step: `index.html` + file dati/logica/stile caricati come script/link globali. Nessun bundler, nessuna dipendenza npm.

Design system: verde + logo/icone disegnate su misura ("veste grafica di Alessio"), tipografia e componenti in `styles.css`. Contenuti bilingue IT/EN (`content.js → CONTENT.it` / `CONTENT.en`).

## Come si apre

Serve un server statico qualsiasi (serve HTTPS/localhost per geolocalizzazione e service worker):

```bash
npx serve .
# oppure
python3 -m http.server 8000
```

Poi apri `index.html`. Il codice di accesso demo è `PIONEER26` (vedi `#gate` in `index.html`).

**Usa questo per vedere l'effetto di una modifica prima di pushare.** `main` fa deploy automatico su GitHub Pages, cioè in produzione — non serve pushare per "controllare se funziona": basta questo server locale, il risultato è identico e non rischi di far vedere a chi sta usando l'app in quel momento una versione a metà.

## Struttura

| File/cartella | Contenuto |
|---|---|
| `index.html` | Markup + tutta la logica dell'app (tab, gate d'accesso, vista percorso con mappa e altimetria, GPS live, meteo, mappe Leaflet, ricerca, installazione PWA, opt-in notifiche push, feed Comunicazioni) |
| `staff.html` | Pagina riservata allo staff per inviare comunicazioni push a tutti i partecipanti iscritti (gate separato da `index.html`, chiama la Edge Function `tg-send-broadcast`) |
| `config.js` | Unica fonte per `TG_SUPABASE_URL`, caricato sia da `index.html` sia da `staff.html` — evita di tenere sincronizzato a mano lo stesso URL in più file |
| `styles.css` | Tutto il CSS del design system (token in `:root`, componenti, schermate) |
| `icons.js` | Helper `icon(name, size)` per le icone (sprite SVG) e mappa id-scheda-info → nome icona |
| `icons/sprite.svg` | Sprite SVG con i simboli usati nell'app (referenziato via `<use>`) |
| `fonts/` | Font del design system self-hosted in woff2 — mai da CDN, per restare offline-first |
| `assets/` | Loghi SVG/PNG (compreso quello degli sponsor) |
| `content.js` | `window.CONTENT.it` / `window.CONTENT.en` — tutti i testi editoriali (checklist, percorsi, info-card, sponsor, meteo, fasi prima/durante/dopo, live tracking), bilingue con switch in alto |
| `tracks.js` | `window.TRACKS` — coordinate GPX dei tre percorsi (corto/medio/lungo), usate per le mappe e per il calcolo posizione GPS |
| `poi.js` | `window.POI` — punti di interesse lungo il percorso (acqua, cibo, alloggi) per km, fonte OpenStreetMap, generati con `scripts/gen_poi.py` (procedura in `docs/generazione-poi.md`) |
| `docs/liste-poi/` | Liste POI grezze per percorso, output intermedio dello script di generazione |
| `manifest.webmanifest` | Manifest PWA (nome, icone, colori del brand, `display: standalone`) |
| `sw.js` | Service worker: **network-first** per i file dell'app (chi ha rete vede sempre l'ultima versione), cache come rete di salvataggio quando il segnale manca. Mappe/meteo/Stay22 non passano di qui. Versione cache attuale: vedi costante `CACHE` in cima al file — **va incrementata a ogni modifica di `sw.js`** o dell'elenco asset, altrimenti i client con la PWA installata restano bloccati sulla versione precedente |
| `icons/icon-192.png`, `icons/icon-512.png` | Icone PWA |
| `supabase/` | Migrazioni e Edge Function (`tg-send-broadcast`) per le notifiche push — unica dipendenza runtime da un backend (progetto Supabase `kqsrtuzeeiljozdnjott`), il resto dell'app gira senza backend |
| `scripts/gen_poi.py` | Script per rigenerare `poi.js` da OpenStreetMap quando cambia una traccia |
| `scripts/gen_frecce.py` | Genera `assets/frecce/f000.svg` … `f345.svg`, una freccia ogni 15°, usate **solo** dalla mappa Stay22 (vedi sotto). Da rilanciare solo se cambia il disegno o il colore della freccia |
| `anteprima-francesco/` | Snapshot statico storico di un branch di restyle (vedi sezione "Stato del repo e dei branch" sotto) — non è codice attivo, non editarlo pensando che finisca in produzione |

## Funzionalità principali

- **Tre fasi dell'evento** (`prima` / `durante` / `dopo`), calcolate automaticamente da `content.js → meta.fasi` in base alla data, con una home diversa per fase. C'è un demobar per forzare manualmente la fase durante lo sviluppo/demo (dietro `?demo=1`, nascosta di default).
- **Percorso**: tre tracciati (Corto 216 km, Medio 360 km, Lungo 374 km) con mappa Leaflet, download GPX, lista servizi lungo la traccia filtrabile (acqua/cibo/dormire) e avviso automatico dei tratti senza rifornimenti.
- **Vista percorso** (`#routeview`, il bottone "Mappa + altimetria"): schermata a tutto schermo **dentro l'app** con mappa Esri e profilo altimetrico sincronizzati, punti di interesse disegnati sul profilo alla loro quota e filtrabili per categoria, e uscita garantita da tre strade — il tasto "Percorsi" in alto a sinistra, il tasto indietro del telefono (`history.pushState` + `popstate`) e il tasto Esc. Trascinando il dito sul profilo si muove il cursore sulla mappa; toccando un'icona si legge nome, km, quota e quanto manca all'arrivo in km e in dislivello. Prima questo bottone apriva `percorso-{id}.html` del repo mappe in una scheda esterna che non aveva nessun link di ritorno.
- **Info**: schede a tema (prima di partire, arrivare a Rovereto, sul percorso, durante l'evento, regole e vantaggi) con ricerca full-text.
- **Dormire**: mappa alloggi via iframe Stay22 (account aziendale reale `adventurelabsrl`, campagna `tgguida2026`), con frecce direzionali ogni 30 km sulla traccia.
- **Live**: geolocalizzazione in tempo reale con calcolo del km percorso, POI davanti, condivisione posizione (WhatsApp/Web Share API), meteo (Open-Meteo, gratuito) per le località dell'evento, orario del tramonto, e una sezione per il live tracking WHIP (in stato "in arrivo" finché non arriva il link reale).
- **Offline-first**: service worker network-first con fallback su cache, font e icone self-hosted, così le info restano consultabili anche senza segnale in montagna.
- **Installabile**: prompt "aggiungi a schermata Home" per Android (`beforeinstallprompt`) e istruzioni guidate per iOS.
- **Notifiche push e Comunicazioni**: opt-in Web Push (VAPID) nella tab Live, ricevute da `sw.js` anche ad app chiusa, più un feed in-app "Comunicazioni" come fallback per chi non riceve il push (es. iOS senza PWA installata). Lo staff invia i messaggi da `staff.html`.

## Da sapere

- I dati marcati con `✱` in `content.js` sono segnaposto residui da confermare prima della pubblicazione reale (orari, numeri di telefono, link, codici sconto, traccia GPX definitiva) — la maggior parte è già stata sostituita con dati reali, controllare `grep -n '✱' content.js` prima del go-live per l'elenco aggiornato.
- Il gate d'accesso (`GATE_CODE` in `index.html`) è un deterrente, non sicurezza vera — verrà sostituito da un'autenticazione legata all'account BAS.
- `<meta name="robots" content="noindex, nofollow">`: la pagina non deve essere indicizzata, è riservata ai partecipanti.
- Le mappe usano tile Esri (minimappa percorsi e vista percorso) e CyclOSM (mappa GPS live); Leaflet è caricato da unpkg via CDN.
- **La traccia di `tracks.js` è semplificata e misura il 2-3% in meno del GPX completo** (211,9 / 348,7 / 362,6 km contro i 216 / 360 / 374 ufficiali), mentre i km dei POI di `poi.js` vengono dal GPX completo. Scalando i due riferimenti in modo lineare un punto finirebbe fino a 2,7 km più avanti di dov'è davvero, cioè dalla parte sbagliata di una salita. `routeGeom()` in `index.html` risolve usando come ancore i POI che hanno le coordinate (paesi e alloggi, 63-88 per percorso): trova il punto traccia più vicino a ciascuno, ottiene la coppia km-POI ↔ km-traccia e interpola in mezzo. Errore residuo misurato — mediano 0 km, peggiore 0,5 km. **Se un giorno `tracks.js` verrà rigenerato con la traccia completa, questa correzione diventa inutile ma resta innocua.**
- **`percorsi[].dplus` in `content.js` è testo già formattato e cambia con la lingua** (`"7.900"` in italiano, `"7,900"` in inglese), non è un numero. Va letto con `parseInt(String(p.dplus).replace(/\D/g,''), 10)` — moltiplicarlo direttamente dà risultati assurdi. `p.km` invece è un numero vero.
- Il dislivello residuo mostrato nella vista percorso è la somma grezza dei dislivelli della traccia **riportata in scala sul D+ ufficiale** del percorso, così il numero resta coerente con quello comunicato ai partecipanti. I km e i D+ ufficiali non si ricalcolano mai dal GPX.
- **Le frecce direzionali sulla mappa Stay22 funzionano in modo diverso da quelle sulle nostre mappe.** Sulle mappe Leaflet (`arrowLayer()`) le disegniamo al volo ruotando un SVG inline. Dentro Stay22 non si può: la traccia la disegna Stay22 nel suo iframe cross-origin, e i soli parametri disponibili sono `gpx`, `gpxlinecolor`, `gpxlinethickness`, `gpxlineopacity` — nessuno riguarda le frecce. L'unico aggancio è `poi`, un array JSON di marcatori con immagine ma **senza rotazione**, quindi la rotazione è cotta nei file (`assets/frecce/`, uno ogni 15°). Conseguenze da conoscere prima di toccare questa parte: ogni freccia è resa da Stay22 come un **pallino bianco tondo di 30×36 px con la coda**, immagine ritagliata a cerchio e ingrandita al 125% (per questo la freccia è disegnata al centro del riquadro), `size` minimo è 1 e non si può rimpicciolire; l'URL dell'immagine deve essere **pubblico in HTTPS** perché la scarica Stay22, non il telefono, quindi da `localhost` non funziona e `FRECCE_BASE` ripiega sul sito pubblicato; il tutto viaggia nella query string dell'iframe, che con 12 frecce arriva a circa 2.700 caratteri.

### Checklist go-live notifiche push

Prima della pubblicazione reale, da fare in quest'ordine:

- [ ] Sostituire `STAFF_CODE` nel secret dell'Edge Function `tg-send-broadcast` su Supabase (`npx supabase secrets set STAFF_CODE=... --project-ref kqsrtuzeeiljozdnjott`) con il codice reale. `staff.html` non ha più una copia locale del codice (fix #16): valida solo il server, e su 403 pulisce da sola il codice salvato in `localStorage` e riapre il gate — non serve coordinare un secondo update né avvisare chi ha già sbloccato il gate col placeholder.
- [ ] Se si tocca di nuovo `sw.js`, incrementare `CACHE` — altrimenti i client con la PWA installata restano sulla versione cache precedente.
- [ ] Verificare il fallback iOS su un iPhone reale — finora testato solo per via statica/logica.

## Stato del repo e dei branch

Deploy automatico su GitHub Pages da `main` (`https://advlabbik.github.io/tg-guida/`).

**Branch attivo: solo `main`.** Tutto lo sviluppo corrente (design system, bilingue, POI, notifiche push, staff.html) procede direttamente qui.

**`ds-restyle` è congelato, tenuto solo come reference storico — non va mergiato.** Era nato come branch di redesign parallelo (piano `docs/superpowers/plans/2026-08-12-golive-restyle.md`, non presente su `main`), ed è stato riconciliato più volte con `main` mentre entrambi i rami andavano avanti in parallelo sugli stessi file (vedi la storia di [issue #11](https://github.com/advlabbik/tg-guida/issues/11)). L'ultima riconciliazione risale al 12/08: da allora `main` ha ricevuto in autonomia la veste grafica ufficiale ("veste grafica di Alessio", 13/08) e i contenuti bilingue/POI/copy che la superano — `ds-restyle` non li ha. Le parti tecniche che aveva di utile (notifiche push, `staff.html`, service worker network-first) sono già presenti identiche su `main`. **Prima di considerare di nuovo un merge di `ds-restyle`, verificare a mano se `main` non l'ha già superato** — è già successo due volte che sembrasse "pronto, manca solo il subdominio" mentre nel frattempo `main` era andato avanti per conto suo.

## Vista percorso dentro l'app (13 agosto 2026)

Il bottone "Mappa + altimetria" apriva `percorso-{id}.html` del repo
`trentino-gravel-mappe` con `target="_blank"`, e quella pagina non ha nessun link di
ritorno: chi aveva la guida salvata in home ci finiva in una finestra senza barra del
browser, quindi senza nemmeno il tasto indietro. Vicolo cieco, segnalato da Andrea.

Ora mappa e altimetria vivono dentro l'app. La schermata aggiunge quello che la pagina
esterna non aveva — i punti di interesse sul profilo altimetrico, i filtri per categoria
e il conto di quanto manca all'arrivo da un punto qualsiasi.

Le pagine `percorso-*.html` del repo mappe **restano** perché servono agli embed su
Notion, ma non sono più raggiungibili dalla guida. Il piano completo da cui nasce questo
lavoro è in [`docs/confronto-wise-pilgrim.md`](docs/confronto-wise-pilgrim.md), voce A1.

**Cosa non è ancora fatto** — i punti stanno sul profilo ma non sulla mappa, perché acqua
e cibo in `poi.js` hanno solo il km e non le coordinate (le hanno solo paesi e alloggi).
Serve prima rigenerare i POI conservando lat/lon, voci A2 e A3 dello stesso documento.

Su un telefono in verticale ci stanno una quindicina di icone, in orizzontale una ventina:
quante ne restano fuori è scritto sotto il profilo, non nascosto.

## Punto della situazione (13 agosto 2026)

L'app è **pronta per l'invio ai partecipanti**. Prima di riprendere lo sviluppo, questo è
quello che è deciso e quello che manca.

### Deciso e fatto
- Contenuti allineati all'email delle tracce, **niente segnaposto visibili**: nell'app c'è
  solo ciò che è stato comunicato. La barra demo delle fasi è nascosta ai partecipanti e
  si attiva col parametro `?demo=1`.
- **Bilingue IT/EN** con switch a bandierine. Il tedesco è escluso per scelta.
  Ogni testo nuovo va aggiunto in **entrambe** le lingue in `content.js`.
- **Regola di scrittura**: mai i due punti `:` nella prosa dei testi rivolti ai
  partecipanti (ok negli orari, tipo 17:00) — decisione di Andrea, vale per tutte le lingue.
- **POI completi** sui tre percorsi. Per rigenerarli leggere prima `docs/generazione-poi.md`.
- **Notifiche push spente** con `NOTIFICHE_ATTIVE = false` in `index.html`: il sistema resta
  integro e si riaccende cambiando quella riga. Spente per poter promuovere l'app senza
  ancora gestire le comunicazioni.
- **Airbnb non si mette.** O compare dentro la mappa Stay22 accanto a Booking, oppure niente:
  i link esterni sono stati scartati (motivazione tecnica completa nella PR #9 chiusa).

### In sospeso, con la dipendenza che li blocca
| Cosa | Chi sblocca |
|---|---|
| Dominio `app.trentinogravel.com` | Francesco, 1 record DNS su Cloudflare → [issue #14](https://github.com/advlabbik/tg-guida/issues/14) |
| Analytics (Umami, piano gratuito) | Andrea, crea l'account su cloud.umami.is e passa il Website ID |
| Link della diretta WHIP, contatti taxi, orari definitivi del pacco | informazioni non ancora disponibili |
| Riaccensione notifiche push | decisione di Andrea, dopo il dominio (le iscrizioni sono legate all'indirizzo) |

### Trappole note
- Chi ha già salvato l'app in home **non vede la nuova icona**: i telefoni la congelano al
  salvataggio, va rimossa e risalvata.
- Le iscrizioni alle notifiche sono legate al dominio: attivare il dominio **prima** di
  invitare i partecipanti ad attivarle, altrimenti si perdono.
- La cartella `fonts/` contiene font di una versione precedente e **non è più usata**:
  il design system attuale carica Inter e Space Grotesk da Google Fonts (`index.html`).
  Se serve tornare offline-first sui font, vanno scaricati quelli giusti.
- Bumpare sempre `CACHE` in `sw.js` quando si modificano i file, altrimenti chi ha l'app
  installata resta indietro di una versione.
