# Go-live TG Guida — restyle + feature completion (3 giorni)

Data: 2026-08-12
Evento: Trentino Gravel — Pioneer Edition, 26 settembre 2026
Repo: `advlabbik/tg-guida`

## Contesto

`tg-guida` è la PWA vanilla JS (nessun build step) che accompagna i partecipanti prima/durante/dopo l'evento. È già deployata su GitHub Pages (`https://advlabbik.github.io/tg-guida/`, auto-build da `main`), protetta da un codice-gate fittizio (`PIONEER26`, deterrente non sicurezza vera) e con `robots: noindex,nofollow`.

Una code review del prototipo attuale ha prodotto 6 issue aperte su GitHub (bug minori, nessuno bloccante):
1. [#1](https://github.com/advlabbik/tg-guida/issues/1) — polilinea GPS ridisegnata ad ogni tick invece che una volta per percorso
2. [#2](https://github.com/advlabbik/tg-guida/issues/2) — `goBook()` carica due volte l'iframe Stay22
3. [#3](https://github.com/advlabbik/tg-guida/issues/3) — URL GPX duplicato invece di riusare `gpxUrl()`
4. [#4](https://github.com/advlabbik/tg-guida/issues/4) — `classList.add('open')` sulla ricerca, senza effetto CSS
5. [#5](https://github.com/advlabbik/tg-guida/issues/5) — `fillHeroSunset()` codice morto
6. [#6](https://github.com/advlabbik/tg-guida/issues/6) — mappe Leaflet non si ridimensionano al cambio breakpoint

È stato inoltre prodotto un handoff di design completo (`design_handoff_tg_guida_restyle/README.md`, ricevuto come zip), che allinea l'app al Trentino Gravel Design System (forest green + terracotta, Bebas Neue / Barlow Condensed / DM Sans / DM Mono, raggio zero, no emoji tranne meteo). L'handoff include già un piano di implementazione a 5 commit e la raccomandazione esplicita di un git worktree.

Vincolo di tempo: **3 giorni**, non le ~6 settimane fino all'evento. Questo esclude qualunque lavoro che richieda dati o integrazioni non ancora disponibili.

## Obiettivo

Portare `tg-guida` da prototipo/bozza a versione presentabile per i partecipanti entro 3 giorni, con:
- restyle completo secondo il design system
- le 3 feature oggi incomplete portate a "pronte all'uso" (in attesa solo del dato esterno)
- i 6 bug della code review chiusi
- un sottodominio BAS dedicato, separato dal sito WordPress esistente

## Perimetro

### Dentro

- **Restyle** — applicazione dell'handoff design a `index.html`/CSS, seguendo il suo piano a 5 commit.
- **3 feature da completare**:
  - Live tracking pubblico (embed/link WHIP) — oggi solo testo "il link arriva prima della partenza✱"
  - Account Stay22 definitivo — oggi l'iframe usa un `aid` che il testo stesso segna come provvisorio
  - Link "Dopo l'evento" reali (questionario, foto ufficiali, attestato Pioneer) — oggi puntano tutti a `#`
- **Chiusura dei 6 issue** di code review — stesso branch del restyle, stessi file.
- **Sottodominio Cloudflare** (`trentinogravel.bikeadventureseries.com`, nome da confermare), separato dall'infrastruttura WordPress esistente, puntato via CNAME a `advlabbik.github.io` + custom domain nelle impostazioni Pages del repo.

### Fuori (esplicitamente rimandato)

- Auth reale con verifica acquisto (account BAS + check ordine) — resta il codice-gate attuale, invariato.
- "Cambiare percorso" in-app — resta gestito via risposta email, come oggi.
- Tutti gli altri placeholder `✱` in `content.js` non legati alle 3 feature sopra (certificato, criticità percorso, taxi, sconti, orari presidio, ecc.) — restano placeholder, fuori da questo giro.

## Approcci considerati

1. **Sequenziale, stile poi auth** — scartato: l'auth è comunque fuori scope ora, la domanda non si pone più.
2. **Sequenziale, infrastruttura poi stile** — scartato per lo stesso motivo, e perché con 3 giorni non si può permettere di far attendere il restyle (già pronto come handoff) su un'attività DNS che è comunque rapida.
3. **Binario unico, sullo stesso branch** (scelto) — con solo 3 giorni e senza il binario "auth" (che avrebbe giustificato un secondo fronte di lavoro separato), non ha senso spezzettare il lavoro su più branch da riconciliare dopo. Restyle, feature e bugfix toccano `index.html`/`content.js`/`sw.js`: si lavora in sequenza sullo stesso worktree, con commit granulari.

## Design

### Git

Worktree dedicato, come da handoff:

```bash
git worktree add ../tg-guida-ds -b ds-restyle
```

Rebase su `main` frequentemente, non merge (un `<style>` monolitico riscritto rende un merge a 3 vie ingestibile). Bugfix e feature entrano come commit separati sullo stesso branch `ds-restyle`, non branch propri — con questo orizzonte temporale un secondo fronte da riconciliare sarebbe solo overhead.

Ordine dei commit (esteso rispetto ai 5 dell'handoff):

1. Estrazione `<style>` → `styles.css` (meccanico, nessun cambiamento visivo)
2. Font locali (Bebas Neue, Barlow Condensed, DM Sans, DM Mono) in `fonts/`, `@font-face`, aggiunta alla cache di `sw.js` — **non CDN Google**, l'app è offline-first
3. Token e riscrittura selettori in `styles.css` (classi invariate: `.card`, `.btn`, `.chk`, `.bigbtn`, `.badge`, `.icard`, `.poirow`, `nav button`)
4. Icone Lucide → sprite SVG locale, mappa `id scheda → icona` in `icons.js` separato, `lucide.createIcons()` richiamato in ogni funzione di render
5. Dettagli sparsi: `theme-color`, icone PWA, colore Stay22 nell'URL
6. **(nuovo)** Le 3 feature — WHIP embed, Stay22 aid definitivo, link dopo-evento — pattern "placeholder pronto" (sotto)
7. **(nuovo)** Fix dei 6 issue di code review, uno per commit

### Feature incomplete — pattern "placeholder pronto"

Nessuno dei 3 dati esterni (link/embed WHIP, `aid` Stay22 business, URL di questionario/galleria/attestato) è disponibile ora. Per non bloccare lo sviluppo né rischiare un ritocco last-minute di markup/CSS quando i dati arrivano:

- Il valore vive in un unico punto ben marcato in `content.js` (stesso pattern già usato per gli altri campi `✱`), non sparso nel codice.
- La UI/logica è scritta e testata come se il dato ci fosse (embed WHIP renderizzato, iframe Stay22 con `aid` reale, bottoni "dopo l'evento" cliccabili).
- Finché il valore resta il placeholder, la UI mostra uno stato "in arrivo" coerente con quanto già fa oggi altrove nell'app (non un link rotto o un componente vuoto).
- Quando arrivano i dati reali: una riga in `content.js` + push, zero rischio su markup/CSS.

Il reperimento dei 3 dati (a chi chiederli) è un'attività separata, non bloccante per lo sviluppo — va tracciata a parte, non fa parte di questo piano tecnico.

### Sottodominio

- Nome proposto: `trentinogravel.bikeadventureseries.com` (da confermare/correggere).
- CNAME su Cloudflare → `advlabbik.github.io`.
- Custom domain nelle impostazioni GitHub Pages del repo (dashboard o `gh api repos/advlabbik/tg-guida/pages -X PUT`).
- GitHub gestisce il certificato HTTPS automaticamente una volta verificato il CNAME.
- Separato dall'infrastruttura WordPress esistente per scelta esplicita — nessuna modifica al sito WP.

### Verifica prima del go-live

Checklist minima (coerente con un orizzonte di 3 giorni, non un ciclo di QA esteso):

- Smoke test manuale delle 5 tab (Home, Percorso, Info, Dormire, Live) su un telefono reale, non solo browser desktop.
- Verifica che il service worker cachi correttamente i font locali — altrimenti Bebas/Barlow non caricano offline e il layout si scompone (rischio esplicitamente segnalato nell'handoff).
- Verifica dominio custom + HTTPS attivi su `trentinogravel.bikeadventureseries.com`.
- Verifica che il codice-gate funzioni sul nuovo dominio (dipende da `localStorage`, quindi per-dominio: chi ha già sbloccato su `advlabbik.github.io` dovrà reinserire il codice sul nuovo dominio — comportamento atteso, da tenere a mente).

## Rischi noti

- **Bebas/Barlow offline**: se il service worker non cachea correttamente i woff2 locali, l'app perde la sua identità visiva appena il segnale manca in montagna — è il rischio più alto segnalato dall'handoff stesso (commit 2).
- **Dati esterni in ritardo**: se WHIP/Stay22/link dopo-evento non arrivano prima del go-live, l'app va comunque in produzione con lo stato "in arrivo" — accettabile, ma va comunicato a chi deve procurare quei dati che il conto alla rovescia è già partito.
- **Gate per-dominio**: lo spostamento sul nuovo sottodominio invalida l'accesso già salvato in `localStorage` sul dominio GitHub Pages — irrilevante se il link ai partecipanti non è ancora stato distribuito da quell'URL, ma da verificare se qualcuno lo ha già usato.
