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
| `index.html` | Markup, CSS inline, tutta la logica dell'app (tab, gate d'accesso, GPS live, meteo, mappe Leaflet, ricerca, installazione PWA) |
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

## Da sapere

- I dati marcati con `✱` in `content.js` sono segnaposto da confermare prima della pubblicazione reale (orari, numeri di telefono, link, codici sconto, traccia GPX definitiva).
- Il gate d'accesso (`GATE_CODE` in `index.html`) è un deterrente, non sicurezza vera — verrà sostituito dal login nell'area personale su bikeadventureseries.com.
- `<meta name="robots" content="noindex, nofollow">`: la pagina non deve essere indicizzata, è riservata ai partecipanti.
- Le mappe usano tile Esri (minimappa percorsi) e CyclOSM (mappa GPS live); Leaflet è caricato da unpkg via CDN.
