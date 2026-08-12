# TG Guida — Trentino Gravel

Web app (PWA) che accompagna i partecipanti del **Trentino Gravel — Pioneer Edition** (26 settembre 2026, partenza/arrivo da Progetto Manifattura, Rovereto) prima, durante e dopo l'evento.

Vanilla JS, nessun build step: `index.html` + file dati/logica/stile caricati come script/link globali. Nessun bundler, nessuna dipendenza npm.

Allineata al **Trentino Gravel Design System** (stesso brand del sito landing `vietts/trentinogravel`): forest green + terracotta, tipografia Bebas Neue / Barlow Condensed / DM Sans / DM Mono, raggio zero, nessuna emoji tranne le icone meteo.

## Come si apre

Serve un server statico qualsiasi (serve HTTPS/localhost per geolocalizzazione e service worker):

```bash
npx serve .
# oppure
python3 -m http.server 8000
```

Poi apri `index.html`. Il codice di accesso demo è `PIONEER26` (vedi `#gate` in `index.html`).

## Struttura

| File/cartella | Contenuto |
|---|---|
| `index.html` | Markup + tutta la logica dell'app (tab, gate d'accesso, GPS live, meteo, mappe Leaflet, ricerca, installazione PWA, opt-in notifiche push, feed Comunicazioni) |
| `staff.html` | Pagina riservata allo staff per inviare comunicazioni push a tutti i partecipanti iscritti (gate separato da `index.html`, chiama la Edge Function `tg-send-broadcast`) |
| `styles.css` | Tutto il CSS del design system (token in `:root`, componenti, schermate) |
| `icons.js` | Helper `icon(name, size)` per le icone Lucide (sprite SVG) e `ICONS`, la mappa id-scheda-info → nome icona |
| `icons/sprite.svg` | Sprite SVG con i simboli Lucide usati nell'app (referenziato via `<use>`, mai emoji per l'UI strutturale) |
| `fonts/` | Font del design system self-hosted in woff2 (Bebas Neue, Barlow Condensed, DM Sans, DM Mono) — mai da CDN, per restare offline-first |
| `assets/` | Logomark SVG (versione chiara per sfondi scuri, versione forest per sfondi chiari) |
| `content.js` | `window.CONTENT.it` — tutti i testi editoriali (checklist, percorsi, info-card, sponsor, meteo, fasi prima/durante/dopo, live tracking). Struttura già pronta per altre lingue (`CONTENT.en`, ecc., non ancora popolate) |
| `tracks.js` | `window.TRACKS` — coordinate GPX dei tre percorsi (corto/medio/lungo), usate per le mappe e per il calcolo posizione GPS |
| `poi.js` | `window.POI` — punti di interesse lungo il percorso (acqua, cibo, alloggi) per km, fonte OpenStreetMap |
| `manifest.webmanifest` | Manifest PWA (nome, icone, colori del brand, `display: standalone`) |
| `sw.js` | Service worker: **network-first** per i file dell'app (chi ha rete vede sempre l'ultima versione), cache come rete di salvataggio quando il segnale manca. Mappe/meteo/Stay22 non passano di qui |
| `icons/icon-192.png`, `icons/icon-512.png` | Icone PWA (logomark su sfondo forest) |

## Funzionalità principali

- **Tre fasi dell'evento** (`prima` / `durante` / `dopo`), calcolate automaticamente da `content.js → meta.fasi` in base alla data, con una home diversa per fase. C'è un demobar per forzare manualmente la fase durante lo sviluppo/demo.
- **Percorso**: tre tracciati (Corto 216 km, Medio 360 km, Lungo 374 km) con mappa Leaflet, download GPX, lista servizi lungo la traccia filtrabile (acqua/cibo/dormire) e avviso automatico dei tratti >20 km senza rifornimenti.
- **Info**: schede a tema (prima di partire, arrivare a Rovereto, sul percorso, durante l'evento, regole e vantaggi) con ricerca full-text.
- **Dormire**: mappa alloggi via iframe Stay22 (account aziendale reale), con bottone "Cerca anche su Airbnb" che segue la stessa zona/date (Airbnb non è tra i portali Stay22, integrato come link diretto).
- **Live**: geolocalizzazione in tempo reale con calcolo del km percorso, POI davanti, condivisione posizione (WhatsApp/Web Share API), meteo (Open-Meteo, gratuito) per le località dell'evento, orario del tramonto, e una sezione per il live tracking WHIP (in stato "in arrivo" finché non arriva il link reale).
- **Offline-first**: service worker network-first con fallback su cache, font e icone self-hosted, così le info restano consultabili anche senza segnale in montagna.
- **Installabile**: prompt "aggiungi a schermata Home" per Android (`beforeinstallprompt`) e istruzioni guidate per iOS.
- **Notifiche push e Comunicazioni**: opt-in Web Push (VAPID) nella tab Live, ricevute da `sw.js` anche ad app chiusa, più un feed in-app "Comunicazioni" come fallback per chi non riceve il push (es. iOS senza PWA installata). Lo staff invia i messaggi da `staff.html`. A differenza del resto dell'app (che gira senza backend), questa funzionalità introduce una **dipendenza runtime da Supabase** (progetto `kqsrtuzeeiljozdnjott`): tabelle `tg_push_subscriptions`/`tg_broadcast_messages` e la Edge Function `tg-send-broadcast`, versionate in `supabase/`.

## Placeholder pronti

Alcuni dati non ancora disponibili sono strutturati come singolo punto da aggiornare in `content.js`, senza toccare markup/CSS quando arrivano:

- `dormire.stay22` → account Stay22 (già sull'account business reale)
- `live.whip.embedUrl` → link/embed della diretta live (oggi `null`, mostra stato "in arrivo")
- `dopo.azioni[].url` → link a questionario/foto/attestato (oggi `"#"`, mostrano stato "in arrivo")

## Da sapere

- I dati marcati con `✱` in `content.js` sono segnaposto da confermare prima della pubblicazione reale (orari, numeri di telefono, link, codici sconto, traccia GPX definitiva).
- Il gate d'accesso (`GATE_CODE` in `index.html`) è un deterrente, non sicurezza vera — verrà sostituito da un'autenticazione legata all'account BAS.
- `<meta name="robots" content="noindex, nofollow">`: la pagina non deve essere indicizzata, è riservata ai partecipanti.
- Le mappe usano tile Esri (minimappa percorsi) e CyclOSM (mappa GPS live); Leaflet è caricato da unpkg via CDN.
- Il breakpoint desktop (`@media(min-width:900px)`) non è stato ridisegnato con il nuovo design system — resta la struttura precedente (sidebar, griglie).

### Checklist go-live notifiche push

Prima della pubblicazione reale, da fare in quest'ordine:

- [ ] Sostituire `STAFF_CODE` nel secret dell'Edge Function `tg-send-broadcast` su Supabase (`npx supabase secrets set STAFF_CODE=... --project-ref kqsrtuzeeiljozdnjott`) con il codice reale.
- [ ] Sostituire la costante `STAFF_CODE` in `staff.html` con lo stesso valore — i due DEVONO combaciare esattamente, il primo update senza il secondo blocca tutto lo staff fuori.
- [ ] Coordinare il ri-deploy del secret con chi ha già salvato il vecchio codice: `staff.html` salva il codice digitato in `localStorage`, quindi chi ha già sbloccato il gate con il placeholder non se ne accorge finché non prova a inviare (la Edge Function risponde 403).
- [ ] Se si tocca di nuovo `sw.js`, incrementare `CACHE` (attualmente `tg-guida-v18`) — altrimenti i client con la PWA installata restano sulla versione cache precedente.
- [ ] Verificare il fallback iOS su un iPhone reale — finora testato solo per via statica/logica (nessun hardware reale disponibile in fase di sviluppo).

## Stato del repo

Deploy automatico su GitHub Pages da `main` (`https://advlabbik.github.io/tg-guida/`). Il redesign secondo il design system vive sul branch `ds-restyle` (già riconciliato con `main`): resta da configurare il sottodominio dedicato prima di aprire la PR verso `main`.
