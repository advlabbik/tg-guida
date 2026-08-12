# TG Guida — Trentino Gravel

Prototipo interno AdventureLab: la web app (PWA) che accompagna i partecipanti del **Trentino Gravel — Pioneer Edition** (26 settembre 2026, partenza/arrivo da Progetto Manifattura, Rovereto) prima, durante e dopo l'evento.

Vanilla JS, nessun build step: `index.html` + tre file dati/logica caricati come script globali. Nessun bundler, nessuna dipendenza npm.

## Come si apre

Serve un server statico qualsiasi (serve HTTPS/localhost per geolocalizzazione e service worker):

```bash
npx serve .
# oppure
python3 -m http.server 8000
```

Poi apri `index.html`. Il codice di accesso demo è `PIONEER26` (vedi `#gate` in `index.html`).

## Struttura

| File | Contenuto |
|---|---|
| `index.html` | Markup, CSS inline, tutta la logica dell'app (tab, gate d'accesso, GPS live, meteo, mappe Leaflet, ricerca, installazione PWA, opt-in notifiche push, feed Comunicazioni) |
| `staff.html` | Pagina riservata allo staff per inviare comunicazioni push a tutti i partecipanti iscritti (gate separato da `index.html`, chiama la Edge Function `tg-send-broadcast`) |
| `content.js` | `window.CONTENT.it` — tutti i testi editoriali (checklist, percorsi, info-card, sponsor, meteo, fasi prima/durante/dopo). Struttura già pronta per altre lingue (`CONTENT.en`, ecc., non ancora popolate) |
| `tracks.js` | `window.TRACKS` — coordinate GPX dei tre percorsi (corto/medio/lungo), usate per le mappe e per il calcolo posizione GPS |
| `poi.js` | `window.POI` — punti di interesse lungo il percorso (acqua, cibo, alloggi) per km, fonte OpenStreetMap |
| `manifest.webmanifest` | Manifest PWA (nome, icone, `display: standalone`) |
| `sw.js` | Service worker: cache-first per gli asset dell'app, esclude mappe/meteo/Stay22 (troppo pesanti/dinamici da cachare) |
| `icons/` | Icone PWA (192px, 512px) |

## Funzionalità principali

- **Tre fasi dell'evento** (`prima` / `durante` / `dopo`), calcolate automaticamente da `content.js → meta.fasi` in base alla data, con una home diversa per fase. C'è un demobar per forzare manualmente la fase durante lo sviluppo/demo.
- **Percorso**: tre tracciati (Corto 216 km, Medio 360 km, Lungo 374 km) con mappa Leaflet, download GPX, lista servizi lungo la traccia filtrabile (acqua/cibo/dormire) e avviso automatico dei tratti >20 km senza rifornimenti.
- **Info**: schede a tema (prima di partire, arrivare a Rovereto, sul percorso, durante l'evento, regole e vantaggi) con ricerca full-text.
- **Dormire**: mappa alloggi via iframe Stay22, centrata sulla traccia del percorso scelto.
- **Live**: geolocalizzazione in tempo reale con calcolo del km percorso, POI davanti, condivisione posizione (WhatsApp/Web Share API), meteo (Open-Meteo, gratuito) per le località dell'evento e orario del tramonto.
- **Offline-first**: service worker che cachea gli asset statici, così le info restano consultabili anche senza segnale in montagna.
- **Installabile**: prompt "aggiungi a schermata Home" per Android (`beforeinstallprompt`) e istruzioni guidate per iOS.
- **Notifiche push e Comunicazioni**: opt-in Web Push (VAPID) nella tab Live, ricevute da `sw.js` anche ad app chiusa, più un feed in-app "Comunicazioni" come fallback per chi non riceve il push (es. iOS senza PWA installata). Lo staff invia i messaggi da `staff.html`. A differenza del resto dell'app (che gira senza backend), questa funzionalità introduce una **dipendenza runtime da Supabase** (progetto `kqsrtuzeeiljozdnjott`): tabelle `tg_push_subscriptions`/`tg_broadcast_messages` e la Edge Function `tg-send-broadcast`, versionate in `supabase/`.

## Da sapere

- I dati marcati con `✱` in `content.js` sono segnaposto da confermare prima della pubblicazione reale (orari, numeri di telefono, link, codici sconto, traccia GPX definitiva).
- Il gate d'accesso (`GATE_CODE` in `index.html`) è un deterrente, non sicurezza vera — verrà sostituito dal login nell'area personale su bikeadventureseries.com.
- `<meta name="robots" content="noindex, nofollow">`: la pagina non deve essere indicizzata, è riservata ai partecipanti.
- Le mappe usano tile Esri (minimappa percorsi) e CyclOSM (mappa GPS live); Leaflet è caricato da unpkg via CDN.

### Checklist go-live notifiche push

Prima della pubblicazione reale, da fare in quest'ordine:

- [ ] Sostituire `STAFF_CODE` nel secret dell'Edge Function `tg-send-broadcast` su Supabase (`npx supabase secrets set STAFF_CODE=... --project-ref kqsrtuzeeiljozdnjott`) con il codice reale.
- [ ] Sostituire la costante `STAFF_CODE` in `staff.html` con lo stesso valore — i due DEVONO combaciare esattamente, il primo update senza il secondo blocca tutto lo staff fuori.
- [ ] Coordinare il ri-deploy del secret con chi ha già salvato il vecchio codice: `staff.html` salva il codice digitato in `localStorage`, quindi chi ha già sbloccato il gate con il placeholder non se ne accorge finché non prova a inviare (la Edge Function risponde 403).
- [ ] Se si tocca di nuovo `sw.js`, incrementare `CACHE` (attualmente `tg-guida-v18`) — altrimenti i client con la PWA installata restano sulla versione cache precedente.
- [ ] Verificare il fallback iOS su un iPhone reale — finora testato solo per via statica/logica (nessun hardware reale disponibile in fase di sviluppo).
