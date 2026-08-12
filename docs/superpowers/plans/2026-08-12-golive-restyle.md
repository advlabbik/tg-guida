# Go-live TG Guida — restyle + feature completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare `advlabbik/tg-guida` dal prototipo maroon attuale al Trentino Gravel Design System (forest/terracotta), completare le 3 feature oggi stub con un pattern "placeholder pronto", chiudere i 6 issue di code review, e pubblicarla su un sottodominio Cloudflare dedicato — tutto entro 3 giorni.

**Architecture:** Nessun build step, nessuna dipendenza npm: si continua a lavorare su `index.html` (markup + logica) più file JS globali (`content.js`, `tracks.js`, `poi.js`) e un nuovo `styles.css` estratto dal CSS oggi inline. Le classi CSS esistenti non cambiano nome (sono generate dai template stringa in `index.html`). Font e icone diventano asset locali per restare offline-first via service worker.

**Tech Stack:** HTML/CSS/vanilla JS, Leaflet 1.9.4 (CDN, invariato), service worker cache-first, GitHub Pages (deploy automatico su push a `main`), Cloudflare DNS.

## Global Constraints

- Nessuna emoji nella UI, **tranne** le icone meteo generate da `wIcon()` (restano emoji).
- Border-radius **zero ovunque**, unica eccezione i pill della demobar (`999px`).
- **Non rinominare le classi CSS esistenti**: `.card`, `.btn`, `.chk`, `.bigbtn`, `.badge`, `.icard`, `.poirow`, `nav button` sono prodotte dai template stringa in `index.html` — rinominarle rompe il rendering.
- **Copy verbatim**: nessun testo di `content.js` va riscritto, eccetto i campi nuovi introdotti esplicitamente dalle Task 11/13 (WHIP, link dopo-evento).
- I colori dei tre percorsi (`#2f9e44` corto, `#e8590c` medio, `#c1121f` lungo) **restano invariati** e vanno usati **solo** su tracce/quadratini/bordo sinistro card percorso/pill selezione — mai su bottoni o testo generico.
- **Font locali, mai CDN Google**: l'app è offline-first, `sw.js` cachea solo asset dello stesso host (+ unpkg per Leaflet) — un font da Google Fonts CDN sparirebbe senza segnale in montagna.
- Solo mobile in questo giro: il breakpoint `@media(min-width:900px)` esistente **non va ridisegnato**.
- Fuori scope (non toccare): auth reale/verifica acquisto, "cambiare percorso" in-app, ogni altro placeholder `✱` in `content.js` non elencato nelle Task 11-13.
- Lavoro su branch `ds-restyle` in un worktree dedicato, rebase su `main` (mai merge).

---

## Setup — worktree

- [ ] **Step 1: Creare il worktree**

```bash
cd /path/to/tg-guida   # repo clonata, su main aggiornato
git worktree add ../tg-guida-ds -b ds-restyle
cd ../tg-guida-ds
```

- [ ] **Step 2: Verificare che il server locale funzioni da qui**

```bash
python3 -m http.server 8123 &
curl -sI http://localhost:8123/index.html | head -1
```

Expected: `HTTP/1.0 200 OK`

Tutte le Task seguenti operano dentro `../tg-guida-ds`.

---

### Task 1: Estrazione CSS in styles.css

**Files:**
- Create: `styles.css`
- Modify: `index.html:13-201` (blocco `<style>`), `index.html:12` (aggiunta link)
- Modify: `sw.js:2-8` (ASSETS + bump versione cache)

**Interfaces:**
- Produces: `styles.css` — foglio di stile linkato, stesso identico contenuto CSS oggi inline tra `index.html:14` e `index.html:200`.

- [ ] **Step 1: Copiare il CSS esistente in styles.css**

Copiare **verbatim** tutto il contenuto tra `index.html:14` (`:root{--maroon:...`) e `index.html:200` (`}` di chiusura del breakpoint desktop) in un nuovo file `styles.css`. Nessuna modifica al contenuto in questo step.

- [ ] **Step 2: Sostituire il blocco inline con un link**

In `index.html`, sostituire le righe 13-201 (`<style>...tutto il CSS...</style>`) con:

```html
<link rel="stylesheet" href="styles.css"/>
```

- [ ] **Step 3: Aggiungere styles.css alla cache del service worker**

In `sw.js`, modificare l'array `ASSETS` (riga 3) aggiungendo `'./styles.css'` e alzare la versione cache (riga 2) da `'tg-guida-v11'` a `'tg-guida-v12'` per forzare l'aggiornamento lato client:

```js
const CACHE = 'tg-guida-v12';
const ASSETS = [
  './', './index.html', './styles.css', './content.js', './tracks.js', './poi.js',
  './icons/icon-192.png', './icons/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
```

- [ ] **Step 4: Verifica visiva — nessun cambiamento**

```bash
python3 -m http.server 8123
```

Aprire `http://localhost:8123/index.html`, confrontare con uno screenshot pre-modifica (stesso layout maroon di oggi). Deve essere **pixel-identico**: questo commit è puramente meccanico.

- [ ] **Step 5: Verifica che non resti CSS inline residuo**

```bash
grep -n "<style" index.html
```

Expected: nessun risultato (a parte l'attributo `style="display:none"` sul div `#gate`, gestito da JS — quello resta, non è CSS del design).

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css sw.js
git commit -m "Estrae il CSS inline in styles.css"
```

---

### Task 2: Font locali self-hosted

**Files:**
- Create: `fonts/bebas-neue-400.woff2`, `fonts/barlow-condensed-700.woff2`, `fonts/barlow-condensed-800.woff2`, `fonts/dm-sans-400.woff2`, `fonts/dm-sans-500.woff2`, `fonts/dm-mono-400.woff2`, `fonts/dm-mono-500.woff2`
- Modify: `styles.css` (aggiunta blocco `@font-face` in testa al file)
- Modify: `sw.js:3` (ASSETS), `sw.js:2` (bump versione)

**Interfaces:**
- Produces: 4 `font-family` disponibili in CSS — `"Bebas Neue"` (400), `"Barlow Condensed"` (700/800), `"DM Sans"` (400/500), `"DM Mono"` (400/500). Usate dalla Task 3 in poi.

- [ ] **Step 1: Scaricare i woff2 da Google Fonts**

```bash
mkdir -p fonts
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

for spec in "Bebas+Neue:wght@400:bebas-neue-400" \
            "Barlow+Condensed:wght@700;800:barlow-condensed" \
            "DM+Sans:wght@400;500:dm-sans" \
            "DM+Mono:wght@400;500:dm-mono"; do
  fam="${spec%%:*}"; rest="${spec#*:}"; wghts="${rest%%:*}"; base="${rest#*:}"
  curl -sA "$UA" "https://fonts.googleapis.com/css2?family=${fam}:${wghts}&display=swap" -o /tmp/f.css
  grep -oE "https://fonts.gstatic.com/[^)]+\.woff2" /tmp/f.css
done
```

Per ogni URL stampato, scaricare con il nome file corrispondente al peso (l'ordine degli URL nel CSS segue l'ordine dei pesi richiesti):

```bash
curl -s "<url-bebas-400>" -o fonts/bebas-neue-400.woff2
curl -s "<url-barlow-700>" -o fonts/barlow-condensed-700.woff2
curl -s "<url-barlow-800>" -o fonts/barlow-condensed-800.woff2
curl -s "<url-dmsans-400>" -o fonts/dm-sans-400.woff2
curl -s "<url-dmsans-500>" -o fonts/dm-sans-500.woff2
curl -s "<url-dmmono-400>" -o fonts/dm-mono-400.woff2
curl -s "<url-dmmono-500>" -o fonts/dm-mono-500.woff2
```

- [ ] **Step 2: Verificare che i file siano woff2 validi**

```bash
file fonts/*.woff2
```

Expected: ogni riga riporta `Web Open Font Format (Version 2)`, nessun file a 0 byte.

- [ ] **Step 3: Dichiarare i @font-face**

In cima a `styles.css`, prima del blocco `:root`:

```css
@font-face{font-family:"Bebas Neue";src:url("fonts/bebas-neue-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"Barlow Condensed";src:url("fonts/barlow-condensed-700.woff2") format("woff2");font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:"Barlow Condensed";src:url("fonts/barlow-condensed-800.woff2") format("woff2");font-weight:800;font-style:normal;font-display:swap}
@font-face{font-family:"DM Sans";src:url("fonts/dm-sans-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"DM Sans";src:url("fonts/dm-sans-500.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:"DM Mono";src:url("fonts/dm-mono-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"DM Mono";src:url("fonts/dm-mono-500.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}
```

- [ ] **Step 4: Cache dei font nel service worker**

In `sw.js`, aggiungere i 7 path all'array `ASSETS` e alzare la versione a `'tg-guida-v13'`:

```js
const CACHE = 'tg-guida-v13';
const ASSETS = [
  './', './index.html', './styles.css', './content.js', './tracks.js', './poi.js',
  './icons/icon-192.png', './icons/icon-512.png',
  './fonts/bebas-neue-400.woff2', './fonts/barlow-condensed-700.woff2',
  './fonts/barlow-condensed-800.woff2', './fonts/dm-sans-400.woff2',
  './fonts/dm-sans-500.woff2', './fonts/dm-mono-400.woff2', './fonts/dm-mono-500.woff2',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
```

- [ ] **Step 5: Verifica offline**

Con Chrome DevTools → Application → Service Workers → "Offline" attivo, ricaricare `http://localhost:8123/index.html`: la pagina deve continuare a caricare (i font non sono ancora *usati* in questo commit, ma devono risultare in cache). In Application → Cache Storage → `tg-guida-v13`, verificare che tutti e 7 i file `.woff2` siano elencati.

- [ ] **Step 6: Commit**

```bash
git add fonts/ styles.css sw.js
git commit -m "Aggiunge i font del design system self-hosted"
```

---

### Task 3: Token e reset globale

**Files:**
- Modify: `styles.css` (righe corrispondenti a `:root`, `*`, `html,body`, `body`, `#phone` nel file originale)

**Interfaces:**
- Consumes: font-family da Task 2.
- Produces: custom properties `--forest`, `--deep-forest`, `--ink`, `--terracotta`, `--terracotta-h`, `--cream`, `--offwhite` — usate da tutte le Task successive.

- [ ] **Step 1: Riscrivere il blocco :root**

Sostituire l'attuale (`--maroon`, `--maroon-d`, `--cream`, `--card`, `--ink`, `--muted`, `--line`, `--gold`, `--nav-h`) con:

```css
:root{
  --forest:#2C5E2E; --deep-forest:#1A3C1C; --ink:#0A150A;
  --terracotta:#C25832; --terracotta-h:#D46840;
  --cream:#F2EEAE; --offwhite:#F5EDE0; --card:#fff;
  --muted:rgba(10,21,10,.55); --line:rgba(10,21,10,.12); --sep:rgba(10,21,10,.08);
  --muted-d:rgba(242,238,174,.5); --line-d:rgba(242,238,174,.24);
  --nav-h:62px; --radius:0;
  --f-display:"Bebas Neue",sans-serif; --f-label:"Barlow Condensed",sans-serif;
  --f-body:"DM Sans",sans-serif; --f-mono:"DM Mono",monospace;
}
```

- [ ] **Step 2: Reset globale e body**

```css
*{box-sizing:border-box}
html,body{margin:0;background:var(--offwhite)}
body{font-family:var(--f-body);color:var(--ink);line-height:1.6;font-size:15.5px}
#phone{max-width:560px;margin:0 auto;background:var(--offwhite);min-height:100vh;position:relative;box-shadow:none}
button,input{appearance:none;-webkit-appearance:none;border-radius:0;font-family:inherit}
```

iOS Safari applica un raggio nativo a `<button>`/`<input>` a meno di neutralizzarlo esplicitamente — senza questa riga il vincolo "raggio zero ovunque" (Global Constraints) sarebbe violato su ogni telefono iPhone nonostante il CSS dichiari `--radius:0`. Le regole più specifiche introdotte nelle Task successive (es. `#demobar button{border-radius:999px}` in Task 4) restano valide: la specificità del selettore ID prevale su questo reset generico per tag.

- [ ] **Step 3: Sostituire ogni uso residuo delle vecchie variabili**

```bash
grep -n "var(--maroon\|var(--gold)\|var(--line)\|var(--muted)\|var(--card)" styles.css
```

Per ogni risultato: `var(--maroon)` → `var(--forest)` (uso strutturale) o `var(--terracotta)` (accenti/CTA) a seconda del contesto — vedi tabella token nell'handoff (`design_handoff_tg_guida_restyle/README.md`, sezione "Colori"); `var(--maroon-d)` → `var(--deep-forest)`; `var(--gold)` → `var(--terracotta)` tranne che per le pill della demobar dove resta un bordo dedicato. Verificare che non restino riferimenti alle 4 variabili rimosse:

```bash
grep -n "maroon\|--gold" styles.css
```

Expected: nessun risultato.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "Token del design system e reset globale"
```

---

### Task 4: Header, demobar, tab bar, overlay ricerca

**Files:**
- Modify: `styles.css` (selettori `#demobar*`, `header*`, `.langs*`, `#searchbtn`, `#searchov*`, `#searchbox*`, `.sres*`, `.snull`, `nav*`)
- Modify: `index.html:216-225` (header — aggiunta `<img>` logomark)
- Create: nessuno (il logo SVG arriva dalla Task 9/assets, vedi Step 5)

**Interfaces:**
- Consumes: token da Task 3.

- [ ] **Step 1: Demobar**

```css
#demobar{background:var(--ink);color:rgba(242,238,174,.6);font-family:var(--f-mono);
  font-size:10px;letter-spacing:.22em;text-transform:uppercase;padding:6px 14px;
  display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#demobar b{color:var(--terracotta)}
#demobar button{background:none;border:1px solid rgba(242,238,174,.3);color:rgba(242,238,174,.6);
  border-radius:999px;padding:2px 10px;font-size:10px;font-family:var(--f-mono);
  letter-spacing:.22em;text-transform:uppercase;cursor:pointer}
#demobar button.on{background:var(--terracotta);border-color:var(--terracotta);color:#fff;font-weight:700}
```

- [ ] **Step 2: Header**

```css
header{background:var(--forest);color:#fff;padding:12px 16px;border-bottom:2px solid var(--deep-forest);
  position:sticky;top:0;z-index:600}
header .row{display:flex;align-items:center;gap:10px}
header .logomark{height:40px;flex:0 0 auto}
header h1{font-family:var(--f-display);font-size:22px;margin:0;letter-spacing:.02em;line-height:1;color:var(--cream);flex:1}
header .sub{font-family:var(--f-mono);font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;
  color:rgba(242,238,174,.55);margin-top:3px}
.langs{display:flex;border:1px solid rgba(242,238,174,.3)}
.langs span{font-family:var(--f-mono);font-size:11px;font-weight:700;padding:5px 8px;opacity:.6}
.langs .on{background:var(--cream);color:var(--forest);opacity:1}
#searchbtn{background:none;border:1px solid rgba(242,238,174,.4);color:#fff;font-size:15px;
  width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center}
```

- [ ] **Step 3: Overlay ricerca**

```css
#searchov{position:fixed;inset:0;background:rgba(10,21,10,.6);z-index:900;display:none}
#searchov.open{display:block}
#searchbox{max-width:560px;margin:0 auto;background:var(--offwhite);padding:14px;min-height:40vh;
  border-bottom:3px solid var(--terracotta);max-height:85vh;overflow-y:auto}
#searchbox input{width:100%;font-family:var(--f-body);font-size:16px;padding:12px 14px;
  border:1.5px solid var(--forest);outline:none;background:#fff}
.sres{background:#fff;border:1px solid var(--line);padding:10px 14px;margin-top:10px;cursor:pointer}
.sres b{display:block;font-family:var(--f-label);font-weight:700;font-size:16px}
.sres span{font-family:var(--f-mono);font-size:11px;color:var(--terracotta);text-transform:uppercase}
.snull{text-align:center;color:var(--muted);font-size:13.5px;padding:18px 0}
```

- [ ] **Step 4: Tab bar**

```css
nav .in{pointer-events:auto;display:flex;width:100%;max-width:560px;background:#fff;
  border-top:2px solid var(--deep-forest);height:var(--nav-h);padding-bottom:env(safe-area-inset-bottom)}
nav button{flex:1;background:none;border:none;cursor:pointer;font-family:var(--f-label);
  color:var(--muted);display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:2px;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
nav button.on{background:var(--offwhite);color:var(--forest);border-top:3px solid var(--terracotta);margin-top:-2px}
```

**Nota — regola desktop da non ridisegnare ma da non rompere**: dentro `@media(min-width:900px)` esiste `nav button.on{background:var(--cream);border-right-color:var(--maroon)}` (sidebar desktop). Il breakpoint desktop non va ridisegnato (Global Constraints), ma `--maroon` non esiste più (già rimappata dalla Task 3) e `--cream` ora è il nuovo verde-oliva acceso del design system, non più il vecchio neutro chiaro — lasciarla così cambierebbe visivamente la sidebar desktop, cosa che la Task 3 non doveva fare e questa Task non deve fare nemmeno. In questa regola, e solo qui, usare `var(--offwhite)` al posto di `var(--cream)` (per restare vicino alla tinta neutra originale) e verificare che il `border-right-color` sia già stato rimappato a un colore valido dalla Task 3 (dovrebbe già leggere `var(--forest)`, coerente con l'uso strutturale).

- [ ] **Step 5: Logomark nell'header**

In `index.html:217-221`, aggiungere l'immagine prima del blocco titolo:

```html
<div class="row">
  <img class="logomark" src="assets/logo-light.svg" alt=""/>
  <div style="flex:1">
    <h1 id="h-title"></h1>
    <div class="sub" id="h-sub"></div>
  </div>
  ...
```

Copiare `design_handoff_tg_guida_restyle/assets/logo-light.svg` e `logo-forest.svg` in `assets/` nel repo (`cp` dai file ricevuti nell'handoff).

- [ ] **Step 6: Cache dei loghi nel service worker**

In `sw.js`, aggiungere i due SVG all'array `ASSETS` e alzare la versione a `'tg-guida-v14'`:

```js
const CACHE = 'tg-guida-v14';
const ASSETS = [
  './', './index.html', './styles.css', './content.js', './tracks.js', './poi.js',
  './icons/icon-192.png', './icons/icon-512.png',
  './fonts/bebas-neue-400.woff2', './fonts/barlow-condensed-700.woff2',
  './fonts/barlow-condensed-800.woff2', './fonts/dm-sans-400.woff2',
  './fonts/dm-sans-500.woff2', './fonts/dm-mono-400.woff2', './fonts/dm-mono-500.woff2',
  './assets/logo-light.svg', './assets/logo-forest.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
```

- [ ] **Step 7: Verifica**

Aprire l'app in locale, controllare: header verde forest con logomark visibile, tab bar bianca con bordo verde spesso in alto, voce attiva con bordo terracotta, demobar nera con testo monospace. `grep -n "maroon" styles.css index.html` deve dare zero risultati.

- [ ] **Step 8: Commit**

```bash
git add styles.css index.html assets/
git commit -m "Restyle header, demobar, tab bar, overlay ricerca"
```

---

### Task 5: Componenti generici (card, bottoni, badge, checklist)

**Files:**
- Modify: `styles.css` (selettori `.card*`, `.btn*`, `.chk*`, `.badge`, `.bigbtn*`, `.icard*`, `.poirow*`, `.avvisi*`)
- Modify: `index.html:639-651` (`setMyRoute()`)

**Interfaces:**
- Consumes: token da Task 3.

- [ ] **Step 1: Card**

```css
.card{background:var(--card);border:1px solid var(--line);padding:16px;margin-bottom:12px;box-shadow:none}
.card h2{font-family:var(--f-display);font-size:27px;margin:0 0 8px;line-height:1;letter-spacing:.02em;color:var(--forest)}
.card h3{font-family:var(--f-display);font-size:22px;margin:0 0 6px;line-height:1}
.card p{margin:0 0 8px;font-size:15.5px}
.card p:last-child{margin-bottom:0}
.muted{color:var(--muted);font-size:14px}
```

- [ ] **Step 2: Bottoni**

```css
.btn{display:inline-block;background:var(--terracotta);color:#fff;text-decoration:none;
  font-family:var(--f-label);font-weight:800;letter-spacing:.14em;text-transform:uppercase;
  font-size:12.5px;padding:11px 18px;border:none;cursor:pointer}
.btn:hover{background:var(--terracotta-h)}
.btn.sec{background:#fff;color:var(--forest);border:1.5px solid var(--forest)}
.btn.small{font-size:11.5px;padding:8px 14px}
.btnrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
/* freccia in coda a ogni CTA */
.btn::after{content:" →"}
```

- [ ] **Step 3: Avviso (sostituisce il box giallo)**

```css
.avvisi{background:#fff;border-top:3px solid var(--terracotta);padding:14px 16px;margin-bottom:12px}
.avvisi h3{margin:0 0 6px;font-family:var(--f-mono);font-size:11px;text-transform:uppercase;
  letter-spacing:.24em;color:var(--terracotta);font-weight:400}
.avvisi p{margin:0 0 7px;font-size:15.5px;color:var(--ink)}
.avvisi p:last-child{margin-bottom:0}
```

- [ ] **Step 4: Checklist**

```css
.chk{padding:11px 0;border-bottom:1px solid var(--sep)}
.chk:last-child{border-bottom:none}
.chk .top{display:flex;align-items:center;gap:10px}
.chk input{appearance:none;width:19px;height:19px;border:1.5px solid var(--forest);flex:0 0 auto;
  cursor:pointer;position:relative}
.chk input:checked{background:var(--forest)}
.chk input:checked::after{content:"";position:absolute;left:5px;top:1px;width:5px;height:10px;
  border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.chk.done label{text-decoration:line-through;color:rgba(10,21,10,.4)}
.chk label{font-family:var(--f-label);font-size:19px;font-weight:700;cursor:pointer;flex:1}
.chk .det{font-size:14.5px;color:rgba(10,21,10,.62);margin:5px 0 0 29px}
.chk.done .det{color:rgba(10,21,10,.35)}
.chk .det a{color:var(--terracotta);font-weight:700;text-decoration:none;border-bottom:1.5px solid var(--terracotta)}
```

- [ ] **Step 5: Badge, bigbtn, icard, poirow**

```css
.badge{background:var(--offwhite);border:1px solid var(--line);padding:4px 12px;
  font-family:var(--f-mono);font-size:11.5px;font-weight:500}
.bigbtn{background:#fff;border:1px solid var(--line);padding:16px 12px;text-align:center;
  cursor:pointer;text-decoration:none;color:var(--ink);box-shadow:none;min-height:104px;
  display:flex;flex-direction:column}
.bigbtn b{font-family:var(--f-label);font-size:16px;font-weight:800;letter-spacing:.14em;
  text-transform:uppercase;margin-top:auto}
.bigbtn.alert{background:var(--terracotta);border-color:var(--terracotta);color:#fff}
.icard .head{display:flex;align-items:center;gap:10px}
.icard .head h3{flex:1;margin:0}
.itheme{font-family:var(--f-mono);font-size:14px;text-transform:uppercase;letter-spacing:.30em;
  color:var(--terracotta);margin:20px 2px 10px;font-weight:400}
.poirow{padding:8px 0;border-bottom:1px solid var(--sep);font-size:15px;display:flex;gap:8px;align-items:center}
.poikm{color:var(--terracotta);font-family:var(--f-mono);font-size:11.5px;flex:0 0 46px;font-weight:500}
.poibook{margin-left:auto;background:var(--terracotta);color:#fff;padding:4px 12px;
  font-family:var(--f-label);font-size:11.5px;text-decoration:none;font-weight:800;
  letter-spacing:.1em;text-transform:uppercase;flex:0 0 auto}
```

- [ ] **Step 6: Rimuovere gli stili inline da setMyRoute()**

`index.html:639-651` oggi scrive `style.background/borderColor/color` inline sui pill selezionati, che sovrascrive qualsiasi CSS nuovo. Sostituire con una classe:

```js
function setMyRoute(id){
  localStorage.setItem('tg-route', id);
  document.querySelectorAll('.rpill').forEach(b=>{
    const on = b.dataset.route === id;
    b.classList.toggle('on', on);
    b.style.removeProperty('background');
    b.style.removeProperty('border-color');
    b.style.removeProperty('color');
    if (on) b.style.setProperty('--pill-color', C.percorsi.find(p=>p.id===id).colore);
  });
  const sel = document.getElementById('gpsroute');
  if (sel) sel.value = id;
}
```

E in `styles.css`, aggiungere:

```css
.rpill{background:#fff;border:1px solid var(--line);font-family:var(--f-label);font-size:12.5px;
  font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:8px 14px;cursor:pointer}
.rpill.on{background:var(--pill-color,var(--forest));border-color:var(--pill-color,var(--forest));color:#fff}
.pfil{background:#fff;border:1px solid var(--line);font-family:var(--f-label);font-size:12.5px;
  font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:7px 13px;cursor:pointer}
.pfil.on{background:var(--forest);border-color:var(--forest);color:var(--cream)}
```

- [ ] **Step 7: Verifica**

```bash
grep -n "style\.background\|style\.borderColor\|style\.color" index.html
```

Expected: nessun risultato in `setMyRoute` (restano solo, se presenti, gli usi di `--pill-color` via `setProperty`, che è custom-property non stile diretto).

- [ ] **Step 8: Commit**

```bash
git add styles.css index.html
git commit -m "Restyle componenti generici: card, bottoni, checklist, badge, poirow"
```

---

### Task 6: Home (hero, install card, riepilogo percorsi)

**Files:**
- Modify: `styles.css` (selettori `.hero*`, `#countdown*`, `#installcard*`, `#iosmodal*`)

**Interfaces:**
- Consumes: token da Task 3, componenti da Task 5.

- [ ] **Step 1: Hero**

```css
.hero{background:var(--deep-forest);color:#fff;border:none;padding:26px 18px 20px}
.hero h2{font-family:var(--f-display);color:var(--cream);font-size:52px;line-height:1;margin:0 0 4px}
.hero p{color:rgba(242,238,174,.86);font-size:15.5px}
#countdown{display:flex;margin:16px 0 4px;border-top:1.5px solid var(--line-d);border-bottom:1.5px solid var(--line-d)}
#countdown div{padding:10px 0;text-align:center;flex:1;border-left:1.5px solid var(--line-d)}
#countdown div:first-child{border-left:none}
#countdown b{display:block;font-family:var(--f-display);font-size:42px;color:var(--cream);line-height:1}
#countdown span{font-family:var(--f-mono);font-size:9px;text-transform:uppercase;letter-spacing:.28em;
  color:var(--muted-d)}
```

Il kicker "Edizione Zero · 26.09.2026" sopra il titolo va aggiunto nel markup di `renderHome()` (`index.html:378`), non solo in CSS. **Non usare `toLocaleDateString('it-IT')`**: in JS quel formato produce separatori `/` (es. `26/09/2026`), non i punti richiesti dall'handoff — formattare a mano:

```js
function dataKicker(iso){
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}
h += `<div class="card hero"><div class="kicker">Edizione Zero · ${dataKicker(C.meta.dataPartenza)}</div>
  <h2>${esc(C.intro.titolo)}</h2>
  <div id="countdown"></div>
  <p>${esc(C.intro.testo)}</p></div>`;
```

```css
.kicker{font-family:var(--f-mono);font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--terracotta);margin-bottom:6px}
.hero .kicker{color:rgba(242,238,174,.7)}
```

- [ ] **Step 2: Install card**

```css
#installcard{background:#fff;border:1px solid var(--line);box-shadow:0 24px 60px rgba(12,14,26,.06)}
#installcard h3{display:flex;align-items:center;gap:8px;font-family:var(--f-display);font-size:26px}
```

- [ ] **Step 3: Modale installazione iOS**

```css
#iosmodal{position:fixed;inset:0;background:rgba(10,21,10,.7);z-index:1500;display:none;
  align-items:flex-end;justify-content:center}
#iosmodal .box{background:var(--offwhite);border-top:3px solid var(--terracotta);padding:22px 20px 30px;
  max-width:560px;width:100%}
#iosmodal h3{margin:0 0 10px;font-family:var(--f-display);font-size:28px;color:var(--forest)}
#iosmodal .step{display:flex;gap:12px;align-items:center;padding:9px 0;font-size:14.5px;
  border-bottom:1px solid var(--line)}
#iosmodal .step:last-of-type{border-bottom:none}
#iosmodal .n{color:var(--terracotta);font-family:var(--f-mono);font-weight:500;flex:0 0 auto;font-size:13px}
```

Il markup dei passi (`index.html:234-236`) usa `<span class="n">1</span>` — va aggiornato a `01 /` per coerenza con la numerazione dell'handoff:

```html
<div class="step"><span class="n">01 /</span><span>Tocca il tasto <b>Condividi</b> in basso in Safari (il quadrato con la freccia verso l'alto)</span></div>
<div class="step"><span class="n">02 /</span><span>Scorri e scegli <b>"Aggiungi alla schermata Home"</b></span></div>
<div class="step"><span class="n">03 /</span><span>Tocca <b>Aggiungi</b>: da ora la guida è un'icona sul telefono, un tocco e sei dentro</span></div>
```

- [ ] **Step 4: Verifica**

Aprire la app, fase "prima": hero verde scuro con countdown a colonne separate da linee, install card bianca con ombra morbida. Fase "durante": griglia bigbtn 2 colonne, tessera "Emergenze" piena terracotta.

- [ ] **Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "Restyle Home: hero, countdown, install card, modale iOS"
```

---

### Task 7: Percorso, Info, Dormire, Live + fix issue #6 (mappe non responsive)

**Files:**
- Modify: `styles.css` (`.route`, `#minimap`/`#gpsmap`, `#stay22wrap`, `#infosearch`, `.sunset`, `#meteotab*`)
- Modify: `index.html:352-361` (`openTab`) — fix issue #6

**Interfaces:**
- Consumes: token Task 3, componenti Task 5.

- [ ] **Step 1: Card percorso e mappe placeholder**

```css
.route{border-left:5px solid var(--col)}
.route h3{color:var(--col)}
#minimap,#gpsmap{height:340px;background:var(--deep-forest)}
#stay22wrap{border:1px solid var(--line);height:420px}
```

- [ ] **Step 2: Info e Live**

```css
#infosearch{width:100%;font-family:var(--f-body);font-size:16px;padding:12px 14px;
  border:1.5px solid var(--line);outline:none;background:#fff;margin-bottom:12px}
mark{background:var(--cream);padding:0 1px}
.sunset{background:var(--cream);padding:10px 14px;font-size:14.5px;margin-top:10px;color:var(--ink)}
#meteotab{width:100%;border-collapse:collapse;font-family:var(--f-mono);font-size:11px}
#meteotab th{background:none;font-size:9px;text-transform:uppercase;border-bottom:1.5px solid var(--line);padding:5px 4px}
#meteotab td{border-bottom:1px solid var(--sep);padding:5px 4px;text-align:center}
#meteotab .loc{text-align:left;font-family:var(--f-label);font-weight:700;font-size:13px;
  text-transform:uppercase;white-space:nowrap}
```

Nella CSS originale, `#gpsinfo` e `#gpsahead` (box informativi della tab Live, "sei al km X" e "davanti a te") usano `background:var(--cream)`: con la Task 3 quel token è diventato il verde-oliva acceso del design system, non più adatto come sfondo neutro per un box di testo. Sostituire con un contenitore bordato coerente con lo stile "Davanti a te" dell'handoff:

```css
#gpsinfo{background:#fff;border:1px solid var(--line);padding:10px 14px;font-size:15.5px;margin-top:10px;display:none}
#gpsahead{background:#fff;border:1px solid var(--line);padding:10px 14px;font-size:15.5px;margin-top:8px;display:none}
#gpsahead b{color:var(--terracotta)}
```

- [ ] **Step 3: Fix issue #6 — invalidateSize al cambio breakpoint**

`index.html:352-361`, funzione `openTab`, oggi non gestisce il resize. Aggiungere un listener globale che invalida le mappe Leaflet quando il layout cambia breakpoint (attraversamento dei 900px), subito dopo la dichiarazione di `mapsInit`:

```js
let mapsInit = {};
let lastIsDesktop = window.matchMedia('(min-width:900px)').matches;
window.addEventListener('resize', () => {
  const isDesktop = window.matchMedia('(min-width:900px)').matches;
  if (isDesktop === lastIsDesktop) return;
  lastIsDesktop = isDesktop;
  if (miniMap) setTimeout(() => miniMap.invalidateSize(), 50);
  if (gpsMap) setTimeout(() => gpsMap.invalidateSize(), 50);
});
```

(`miniMap` e `gpsMap` sono già variabili globali dichiarate più avanti nel file — `let miniMap;` a `index.html:585` e `let gpsMap, ...` a `index.html:804`; in JS le `let` a livello di script sono visibili ovunque nello stesso script dopo l'esecuzione del file, quindi il riferimento nella closure del listener funziona anche se dichiarate più sotto nel sorgente.)

- [ ] **Step 4: Verifica**

Aprire la tab Percorso su viewport stretto (es. 375px), poi ridimensionare la finestra oltre i 900px senza ricaricare: la minimappa deve riempire correttamente il nuovo spazio, non restare grigia/tagliata. Ripetere per la tab Live con GPS attivo.

- [ ] **Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "Restyle Percorso/Info/Dormire/Live; fix invalidateSize mappe al resize (#6)"
```

---

### Task 8: Gate d'accesso

**Files:**
- Modify: `styles.css` (`#gate*`)
- Modify: `index.html:205-211` (markup gate — aggiunta logomark + kicker)

**Interfaces:**
- Consumes: token Task 3, `assets/logo-forest.svg` (copiato in Task 4).

- [ ] **Step 1: CSS**

```css
#gate{position:fixed;inset:0;background:var(--forest);z-index:2000;display:flex;
  align-items:center;justify-content:center;padding:20px}
#gate .box{background:var(--offwhite);border-top:3px solid var(--terracotta);padding:28px 24px;
  max-width:380px;width:100%;text-align:center;box-shadow:0 24px 60px rgba(12,14,26,.28)}
#gate .logomark{height:56px;margin-bottom:14px}
#gate .kicker{color:var(--terracotta)}
#gate h2{margin:0 0 6px;font-family:var(--f-display);font-size:44px;color:var(--forest);line-height:1}
#gate p{font-size:14.5px;color:var(--muted);margin:0 0 14px}
#gate input{width:100%;font-family:var(--f-label);font-size:20px;font-weight:800;padding:12px;
  border:1.5px solid var(--line);text-align:center;text-transform:uppercase;letter-spacing:.28em;outline:none}
#gate input:focus{border-color:var(--forest)}
#gate .err{color:var(--terracotta);font-family:var(--f-mono);font-size:10px;min-height:20px;margin:6px 0}
#gate button{width:100%}
```

- [ ] **Step 2: Markup**

`index.html:205-211`:

```html
<div id="gate" style="display:none"><div class="box">
  <img class="logomark" src="assets/logo-forest.svg" alt=""/>
  <div class="kicker">Edizione Zero · Accesso riservato</div>
  <h2>Trentino Gravel</h2>
  <p>Questa guida è riservata ai partecipanti.<br/>Inserisci il codice che trovi nell'email di benvenuto ✱.</p>
  <input id="gatecode" type="text" placeholder="CODICE" autocomplete="off"/>
  <div class="err" id="gateerr"></div>
  <button class="btn" id="gatebtn">Entra</button>
</div></div>
```

- [ ] **Step 3: Verifica**

Cancellare `localStorage` (`localStorage.removeItem('tg-access')`) e ricaricare: il gate deve apparire con sfondo forest pieno, card offwhite con bordo terracotta in alto, titolo Bebas grande.

- [ ] **Step 4: Commit**

```bash
git add styles.css index.html
git commit -m "Restyle gate d'accesso"
```

---

### Task 9: Icone Lucide → sprite locale

**Files:**
- Create: `icons/sprite.svg`, `icons.js`
- Modify: `index.html` (markup `poiRow` L505-520, `aheadHtml` L818-833, `bigbtn` in `renderHome` L392-399/401-405, `nav` L249-255, header search button L223, info card icone in `renderInfo` L605-621)
- Modify: `sw.js` (ASSETS + bump versione, Step 4)
- Nessuna modifica a `content.js` — i campi `icona` restano emoji nei dati, non vengono più letti per il rendering delle icone UI

**Interfaces:**
- Produces: `ICONS` (oggetto globale in `icons.js`) — mappa `id infoCard → nome-lucide`; funzione `icon(name, size=18)` che ritorna una stringa `<svg>` pronta per l'`innerHTML`, dove `name` è un nome Lucide diretto (es. `'crosshair'`) o un valore letto da `ICONS`.
- Consumes: nessuna dipendenza esterna (niente CDN Lucide, per la stessa ragione offline-first della Task 2).

- [ ] **Step 1: Scaricare le ~25 icone usate come sprite**

Elenco icone da `design_handoff_tg_guida_restyle/README.md` (sezione "Iconografia" + icone delle 24 info card): `house route info bed-double radio search crosshair siren share-2 cloud-sun-rain smartphone pencil-line camera award sunset droplets utensils map-pin stethoscope satellite backpack handshake repeat train-front car car-taxi-front shield hard-hat mountain beef triangle-alert key-round flag megaphone tent battery-charging tag landmark` (38 nomi univoci — include `beef`, usato dall'info card "Animali al pascolo" e assente dall'elenco icone generali del README ma presente nell'elenco per-info-card).

```bash
mkdir -p /tmp/lucide-src
for n in house route info bed-double radio search crosshair siren share-2 cloud-sun-rain \
         smartphone pencil-line camera award sunset droplets utensils map-pin stethoscope \
         satellite backpack handshake repeat train-front car car-taxi-front shield hard-hat \
         mountain beef triangle-alert key-round flag megaphone tent battery-charging tag landmark; do
  curl -s "https://unpkg.com/lucide-static@latest/icons/${n}.svg" -o "/tmp/lucide-src/${n}.svg"
done
ls -la /tmp/lucide-src | grep -c ".svg"
```

Expected: 38 file (uno per icona elencata).

- [ ] **Step 2: Comporre lo sprite**

Creare `icons/sprite.svg` combinando ogni file scaricato come `<symbol id="i-<nome>">` (stroke 1.5px, coerente col design system):

```bash
{
  echo '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">'
  for f in /tmp/lucide-src/*.svg; do
    name=$(basename "$f" .svg)
    # estrae il contenuto interno di <svg>...</svg> e lo avvolge in <symbol>
    inner=$(sed -n 's/.*<svg[^>]*>\(.*\)<\/svg>.*/\1/p' "$f")
    echo "<symbol id=\"i-${name}\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">${inner}</symbol>"
  done
  echo '</svg>'
} > icons/sprite.svg
grep -c "<symbol" icons/sprite.svg
```

Expected: 38.

- [ ] **Step 3: Helper icons.js**

`icon()` referenzia i simboli **direttamente dal file esterno** `icons/sprite.svg` via `<use href="...#i-nome">` — i browser moderni risolvono il riferimento cross-file same-origin senza bisogno di iniettare lo sprite nel DOM, quindi non serve alcun fetch manuale (vedi Step 4). `ICONS` serve solo per il caso in cui l'icona va scelta a partire da un dato (l'id di una info card in `content.js`), non per le chiamate dirette (`icon('house')`, `icon('crosshair')`, ecc.) usate ovunque nel resto del file.

```js
window.ICONS = {
  certificato:'stethoscope', gpsguide:'satellite', pacco:'backpack', delega:'handshake', cambio:'repeat',
  luogo:'map-pin', treno:'train-front', auto:'car', taxi:'car-taxi-front',
  sicurezza:'shield', materiale:'hard-hat', colmargherita:'mountain', acqua:'droplets', meteo:'cloud-sun-rain',
  animali:'beef', criticita:'triangle-alert',
  whip:'key-round', emergenze:'siren', arrivo:'flag', social:'megaphone',
  bivacco:'tent', ebike:'battery-charging', sconti:'tag', rovereto:'landmark'
};
function icon(name, size){
  size = size || 18;
  return `<svg width="${size}" height="${size}"><use href="icons/sprite.svg#i-${name}"/></svg>`;
}
```

`ICONS` copre uno-a-uno i 24 id di `content.js:infoCards[]`, nello stesso ordine in cui compaiono lì (`certificato` → `content.js:64`, ... `rovereto` → `content.js:140`).

- [ ] **Step 4: Includere icons.js e cachare lo sprite**

In fondo al file, prima di `<script src="content.js">` (riga 258):

```html
<script src="icons.js"></script>
```

In `sw.js`, aggiungere `icons.js` e `icons/sprite.svg` all'array `ASSETS` e alzare la versione a `'tg-guida-v15'` (lo sprite deve restare disponibile offline esattamente come i font):

```js
const CACHE = 'tg-guida-v15';
const ASSETS = [
  './', './index.html', './styles.css', './content.js', './tracks.js', './poi.js', './icons.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/sprite.svg',
  './fonts/bebas-neue-400.woff2', './fonts/barlow-condensed-700.woff2',
  './fonts/barlow-condensed-800.woff2', './fonts/dm-sans-400.woff2',
  './fonts/dm-sans-500.woff2', './fonts/dm-mono-400.woff2', './fonts/dm-mono-500.woff2',
  './assets/logo-light.svg', './assets/logo-forest.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];
```

- [ ] **Step 5: Sostituire i riferimenti emoji nella UI con icon()**

Il markup della nav (`index.html:249-255`) già contiene `<span class="e">🏠</span>` dentro ogni `<button>` — non va riscritto in HTML, basta sostituirne il contenuto via JS al load (`icon()` è disponibile perché `icons.js` è caricato prima del blocco script principale):

```js
document.querySelectorAll('nav button .e').forEach(el=>{
  const map = {home:'house', percorso:'route', info:'info', dormire:'bed-double', live:'radio'};
  const tab = el.closest('button').dataset.tab;
  el.innerHTML = icon(map[tab], 19);
});
$('#searchbtn').innerHTML = icon('search', 16);
```

Aggiungere queste righe subito dopo `initGate(); renderHome(); renderPercorso(); renderInfo(); renderDormire(); renderLive();` (`index.html:922`), prima di `paintDemo(); openTab('home');` (`index.html:923`).

- [ ] **Step 6: renderHome/renderInfo/poiRow/aheadHtml usano icon()**

- `index.html:392-399` (bigbtn fase durante): sostituire ogni `<span class="e">📍</span>` ecc. con `<span class="e">${icon('crosshair')}</span>`, `${icon('siren')}`, `${icon('share-2')}`, `${icon('cloud-sun-rain')}`, `${icon('bed-double')}`, `${icon('info')}` (in quest'ordine, uno per bigbtn — nomi Lucide diretti, non chiavi di `ICONS`).
- `index.html:401-405` (fase dopo): `${icon('pencil-line')}`, `${icon('camera')}`, `${icon('award')}` al posto di `a.icona` (che resta in `content.js` come emoji ma non viene più letto qui).
- `index.html:605-621` (`renderInfo`, ciclo `C.infoCards`): sostituire `<span class="e">${c.icona}</span>` con `<span class="e">${icon(ICONS[c.id] || 'info', 20)}</span>` (fallback `info` se un id non è mappato).
- `index.html:505-520` (`poiRow`): sostituire `const ico = {a:'⛲', m:'🍝', d:'🛏️'}[e.t];` con `const ico = icon({a:'droplets', m:'utensils', d:'bed-double'}[e.t], 15);`.
- `index.html:818-833` (`aheadHtml`): sostituire i letterali `'⛲'`/`'🍝'`/`'🛏️'` passati a `row()` con `icon('droplets',16)`/`icon('utensils',16)`/`icon('bed-double',16)`.

**Non toccare** `wIcon()` (`index.html:715-726`, meteo) — le emoji lì restano per esplicita decisione del design system.

- [ ] **Step 7: Chiamare il refresh icone dopo ogni render dinamico**

Per i punti che generano icone via `icon()` dentro `innerHTML` (Step 6) non serve un passaggio ulteriore: `icon()` produce già l'SVG inline con `<use>`, che si aggiorna automaticamente col DOM — a differenza di `lucide.createIcons()` (libreria CDN, non usata qui) non serve richiamare nulla dopo il render. Questo è il motivo per cui si è scelto lo sprite locale invece di Lucide da CDN: un requisito in meno da orchestrare nei punti di render (`renderHome`, `renderPercorso`, `renderInfo`, `renderDormire`, `renderLive`, `renderPoiList`, callback di `startGPS`).

- [ ] **Step 8: Verifica**

```bash
grep -n "🏠\|🗺️\|ℹ️\|🛏️\|📡\|🔍\|📍\|🆘\|📤\|🌦️\|📲\|📝\|📷\|🏆" index.html
```

Expected: nessun risultato (tutte le emoji strutturali sostituite). Aprire l'app e controllare visivamente nav, bigbtn fase durante, home fase dopo, info card, lista POI, meteo (qui le emoji restano, per design).

- [ ] **Step 9: Commit**

```bash
git add icons/ icons.js index.html sw.js
git commit -m "Sostituisce le emoji con icone Lucide via sprite SVG locale"
```

---

### Task 10: Dettagli sparsi

**Files:**
- Modify: `index.html:8` (`theme-color`), `manifest.webmanifest`, `index.html:678-680` (`loadStay22`)
- Create: `icons/icon-192.png`, `icons/icon-512.png` (rigenerate)

**Interfaces:**
- Consumes: `assets/logo-light.svg` (Task 4).

- [ ] **Step 1: theme-color**

`index.html:8`:

```html
<meta name="theme-color" content="#2C5E2E"/>
```

- [ ] **Step 2: manifest.webmanifest**

```json
{
  "name": "Trentino Gravel — La tua guida",
  "short_name": "TG Guida",
  "description": "La guida ufficiale del Trentino Gravel: percorsi, info, alloggi e live tracking.",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#1A3C1C",
  "theme_color": "#2C5E2E",
  "lang": "it",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 3: Rigenerare le icone PWA**

```bash
brew list librsvg >/dev/null 2>&1 || brew install librsvg
brew list imagemagick >/dev/null 2>&1 || brew install imagemagick
for size in 192 512; do
  rsvg-convert -w $((size*60/100)) -h $((size*60/100)) assets/logo-light.svg -o /tmp/mark-$size.png
  magick -size ${size}x${size} xc:"#1A3C1C" /tmp/mark-$size.png -gravity center -composite icons/icon-$size.png
done
identify icons/icon-192.png icons/icon-512.png
```

Expected: `icon-192.png PNG 192x192`, `icon-512.png PNG 512x512`.

- [ ] **Step 4: Colore Stay22**

`index.html:678-680`, in `loadStay22()`:

```js
const url = `https://www.stay22.com/embed/gm?aid=${s.aid}&campaign=${s.campaign}&lat=${lat}&lng=${lng}`+
  `&checkin=${s.checkin}&checkout=${s.checkout}&maincolor=2C5E2E&venue=${encodeURIComponent('Progetto Manifattura Rovereto')}&ljs=it`+
  `&gpx=${encodeURIComponent(gpxUrl(rid))}&gpxlinecolor=${p.colore.replace('#','')}&gpxlinethickness=4&gpxlineopacity=1.00&mapstyle=outdoors`;
```

(unica modifica: `maincolor=68173D` → `maincolor=2C5E2E`)

- [ ] **Step 5: Verifica**

Aprire l'app da telefono (o Chrome DevTools → Application → Manifest): l'icona nella preview di installazione deve mostrare il mark chiaro su sfondo verde scuro, non più maroon.

- [ ] **Step 6: Commit**

```bash
git add index.html manifest.webmanifest icons/
git commit -m "Aggiorna theme-color, manifest e icone PWA al nuovo brand"
```

---

### Task 11: Feature — Live tracking WHIP (placeholder pronto)

**Files:**
- Modify: `content.js` (aggiunta `live.whip`)
- Modify: `index.html:685-712` (`renderLive`)
- Modify: `styles.css` (nuova classe `.pending`)

**Interfaces:**
- Produces: helper `pendingCta(label)` in `index.html` (usata anche da Task 13) — ritorna markup di un bottone "in arrivo" non cliccabile, stile coerente col resto dell'app.
- Consumes: `icon()` da Task 9.

- [ ] **Step 1: Nuovo campo in content.js**

In `content.js`, dentro l'oggetto `live` (riga 145-150), aggiungere `whip` accanto a `gps`:

```js
live: {
  gps: {
    titolo: "Dove sono?",
    testo: "Attiva il GPS del telefono e la guida ti dice a che chilometro sei, cosa hai davanti — acqua, cibo, alloggi — e ti fa condividere la posizione con un tocco."
  },
  whip: {
    titolo: "Diretta live",
    testo: "Segui in tempo reale dove sono i partecipanti sulla mappa dell'evento.",
    embedUrl: null // ✱ arriva il link/embed WHIP prima della partenza — vedi content.js:118-120 per il contesto
  }
},
```

- [ ] **Step 2: Helper "in arrivo" condiviso**

In `index.html`, subito prima di `bindBook` (riga 521), aggiungere:

```js
function pendingCta(label){
  return `<div class="pending">${esc(label)}</div>`;
}
```

```css
.pending{display:inline-block;background:var(--offwhite);border:1px dashed var(--line);
  color:var(--muted);font-family:var(--f-label);font-size:12.5px;font-weight:800;
  letter-spacing:.1em;text-transform:uppercase;padding:10px 18px}
```

- [ ] **Step 3: Sezione WHIP in renderLive()**

`index.html:685-712`, in `renderLive()`, dopo il blocco `#meteosec` (che chiude a riga 702) e prima della riga `$('#tab-live').innerHTML = h;` (riga 703):

```js
h += `<div class="card"><h3>${icon('key-round',20)} ${esc(l.whip.titolo)}</h3>
  <p>${esc(l.whip.testo)}</p>` +
  (l.whip.embedUrl
    ? `<div style="height:320px"><iframe src="${l.whip.embedUrl}" style="width:100%;height:100%;border:0" allow="fullscreen"></iframe></div>`
    : `${pendingCta('Diretta in arrivo')}`) +
  `</div>`;
```

- [ ] **Step 4: Verifica**

Con `embedUrl: null` (stato attuale), la tab Live mostra una card "Diretta live" con un box tratteggiato "Diretta in arrivo", non un link rotto. Impostare temporaneamente `embedUrl: "https://example.com"` in locale e verificare che l'iframe compaia; poi rimettere `null` prima del commit.

- [ ] **Step 5: Commit**

```bash
git add content.js index.html styles.css
git commit -m "Aggiunge sezione live tracking WHIP (placeholder pronto)"
```

---

### Task 12: Feature — Account Stay22 definitivo + fix issue #2 (doppio load)

**Files:**
- Modify: `index.html:561-566` (`goBook`), `index.html:671-682` (`loadStay22`/`renderDormire`)
- Modify: `content.js:155-162` (commento sul campo `aid`)

**Interfaces:**
- Consumes: `mapsInit` (Task 7/globale).

Il meccanismo "placeholder pronto" per Stay22 **esiste già** in `content.js` (`dormire.stay22.aid`): è il singolo punto da aggiornare quando arriva l'account business. Questa task lo rende esplicito con un commento e risolve il bug collegato (issue #2: `goBook()` carica l'iframe due volte).

- [ ] **Step 1: Marcare il punto di aggiornamento**

`content.js:158`, aggiungere un commento sopra `aid`:

```js
stay22: {
  titolo: "Prenota dalla mappa",
  testo: "Hotel, B&B e campeggi intorno a Rovereto per la notte di venerdì 25. Muovi la mappa lungo il percorso per prenotare anche le tappe successive — quello che vedi è prenotabile.",
  // ✱ account provvisorio — sostituire `aid` (e `campaign` se cambia) con l'account business Stay22 quando arriva
  aid: "694570b3581ec595fca56708",
  campaign: "trentinogravel",
  lat: 45.8896, lng: 11.0440,
  checkin: "2026-09-25", checkout: "2026-09-26"
},
```

- [ ] **Step 2: Fix issue #2 — goBook() non deve richiamare loadStay22 se openTab l'ha già fatto**

`index.html:561-566`, oggi:

```js
let stayCenter = null;
function goBook(lat, lng){
  stayCenter = {lat, lng};
  openTab('dormire');
  loadStay22();
}
```

`openTab('dormire')` già chiama `loadStay22()` internamente se `!mapsInit.stay` (`index.html:359`). Il fix: chiamare `loadStay22()` da `goBook` solo se la mappa **era già stata inizializzata** in precedenza (altrimenti la chiamata di `openTab` basta):

```js
let stayCenter = null;
function goBook(lat, lng){
  stayCenter = {lat, lng};
  const alreadyInit = mapsInit.stay;
  openTab('dormire');
  if (alreadyInit) loadStay22();
}
```

- [ ] **Step 3: Verifica**

Aprire Chrome DevTools → Network, filtrare per `stay22.com`. Da una tab diversa da Dormire, cliccare "Prenota" su un POI con alloggi: deve comparire **una sola** richiesta all'iframe Stay22, non due. Ripetere il test cliccando "Prenota" una seconda volta (con la mappa già inizializzata): questa volta la richiesta deve comunque avvenire (per aggiornare il centro mappa sul nuovo POI).

- [ ] **Step 4: Commit**

```bash
git add content.js index.html
git commit -m "Marca il punto di aggiornamento Stay22; fix doppio load in goBook (#2)"
```

---

### Task 13: Feature — Link "dopo l'evento" reali (placeholder pronto)

**Files:**
- Modify: `index.html:401-409` (blocco fase "dopo" in `renderHome`)

**Interfaces:**
- Consumes: `pendingCta()` (Task 11).

- [ ] **Step 1: Sostituire i link "#" con stato pending**

`index.html:401-405`, oggi:

```js
h += C.dopo.azioni.map(a=>`<div class="card"><h3>${a.icona} ${esc(a.titolo)}</h3>
  <p>${esc(a.testo)}</p>
  <div class="btnrow"><a class="btn" href="${a.url}" target="_blank" rel="noopener">${esc(a.cta)}</a></div></div>`).join('');
```

Sostituire con un controllo esplicito su `url === '#'`:

```js
h += C.dopo.azioni.map(a=>`<div class="card"><h3>${a.icona} ${esc(a.titolo)}</h3>
  <p>${esc(a.testo)}</p>
  <div class="btnrow">${a.url === '#'
    ? pendingCta('In arrivo')
    : `<a class="btn" href="${a.url}" target="_blank" rel="noopener">${esc(a.cta)}</a>`}</div></div>`).join('');
```

- [ ] **Step 2: Marcare i 3 campi in content.js**

`content.js:172-176`, aggiungere un commento sopra l'array:

```js
azioni: [
  // ✱ i 3 url sotto sono "#" finché non arrivano i link reali (questionario, galleria foto, generatore attestato) — sostituire qui, nessun'altra modifica necessaria
  { icona: "📝", titolo: "Raccontaci com'è andata", testo: "Il questionario di fine evento richiede 5 minuti e la seconda edizione la costruiamo sulle tue risposte.", cta: "Compila il questionario ✱", url: "#" },
  { icona: "📷", titolo: "Le foto ufficiali", testo: "Le foto dell'evento, la tua foto al banner finisher e il materiale da condividere.", cta: "Guarda le foto ✱", url: "#" },
  { icona: "🏆", titolo: "Attestato Pioneer", testo: "L'attestato ufficiale di finisher della Pioneer Edition, con il tuo nome. Da scaricare e incorniciare.", cta: "Scarica l'attestato ✱", url: "#" }
],
```

- [ ] **Step 3: Verifica**

Impostare temporaneamente la fase demobar su "Dopo": le 3 card mostrano il box tratteggiato "In arrivo" invece di un bottone che punta a `#`. Impostare temporaneamente uno degli `url` a un indirizzo reale (es. `https://example.com`) e verificare che torni a comparire il bottone cliccabile normale; poi ripristinare `"#"` prima del commit.

- [ ] **Step 4: Commit**

```bash
git add index.html content.js
git commit -m "Link dopo-evento: stato in arrivo invece di # morto (placeholder pronto)"
```

---

### Task 14: Fix issue #1 — polilinea GPS ridisegnata ad ogni tick

**Files:**
- Modify: `index.html:868-880` (dentro `startGPS`, callback di `watchPosition`)

**Interfaces:**
- Consumes: `gpsLine`, `gpsArrowsRoute` (variabili globali già dichiarate a `index.html:804`).

- [ ] **Step 1: Aggiungere il tracking del percorso già disegnato**

`index.html:804`, oggi:

```js
let gpsMap, gpsMarker, gpsLine, gpsWatch, gpsArrows, gpsArrowsRoute, lastPos = null, autoShare = false;
```

Aggiungere una variabile gemella a quella già usata per le frecce:

```js
let gpsMap, gpsMarker, gpsLine, gpsLineRoute, gpsWatch, gpsArrows, gpsArrowsRoute, lastPos = null, autoShare = false;
```

- [ ] **Step 2: Guardia sul redraw**

`index.html:874-875`, oggi:

```js
if (gpsLine) gpsMap.removeLayer(gpsLine);
gpsLine = L.polyline(track,{color:p.colore,weight:4}).addTo(gpsMap);
```

Sostituire con:

```js
if (gpsLineRoute !== rid){
  if (gpsLine) gpsMap.removeLayer(gpsLine);
  gpsLine = L.polyline(track,{color:p.colore,weight:4}).addTo(gpsMap);
  gpsLineRoute = rid;
}
```

- [ ] **Step 3: Verifica**

Chrome DevTools → Sensors → Location, simulare più posizioni in sequenza sullo stesso percorso: la polilinea non deve "sfarfallare" ad ogni update (verificabile anche solo controllando che `L.polyline` non venga richiamato nel Performance profiler ad ogni tick). Cambiare percorso dal selettore: la polilinea deve aggiornarsi al nuovo colore/traccia.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Fix: polilinea GPS ridisegnata solo al cambio percorso, non ad ogni tick (#1)"
```

---

### Task 15: Fix issue #3 — URL GPX duplicato

**Files:**
- Modify: `index.html:475` (card percorso in `renderPercorso`)

**Interfaces:**
- Consumes: `gpxUrl(id)` (già definita a `index.html:636-638`).

- [ ] **Step 1: Riusare l'helper esistente**

`index.html:475`, oggi:

```js
<a class="btn small sec" href="${C.mappeBase}gpx/Trentino-Gravel-2026-${p.id[0].toUpperCase()+p.id.slice(1)}-V1.8.gpx" target="_blank" rel="noopener">↓ GPX</a>
```

Sostituire con:

```js
<a class="btn small sec" href="${gpxUrl(p.id)}" target="_blank" rel="noopener">↓ GPX</a>
```

- [ ] **Step 2: Verifica**

```bash
grep -n "Trentino-Gravel-2026-" index.html
```

Expected: **una sola** occorrenza letterale del pattern (dentro la definizione di `gpxUrl`, riga 637), non più due. Cliccare "↓ GPX" su ciascuno dei 3 percorsi e verificare che l'URL scaricato combaci con quello del bottone "Mappa + altimetria" per lo stesso percorso.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Riusa gpxUrl() nella card percorso invece di duplicare il template (#3)"
```

---

### Task 16: Fix issue #4 — classList.add('open') morto

**Files:**
- Modify: `index.html:911-917` (binding risultati ricerca globale)

**Interfaces:**
- Nessuna.

- [ ] **Step 1: Rimuovere l'aggiunta di classe senza effetto**

`index.html:915-916`, oggi:

```js
if (h.el){ const el = document.getElementById(h.el);
  if (el){ el.classList.add('open'); setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'center'}),150); } }
```

Sostituire con:

```js
if (h.el){ const el = document.getElementById(h.el);
  if (el) setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'center'}),150); }
```

- [ ] **Step 2: Verifica**

```bash
grep -n "classList.add('open')" index.html
```

Expected: nessun risultato. Cercare "parcheggi" nella ricerca globale, cliccare il risultato: deve continuare a fare scroll fino alla card Info corrispondente.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rimuove classList.add('open') morto dalla ricerca globale (#4)"
```

---

### Task 17: Fix issue #5 — fillHeroSunset() morto

**Files:**
- Modify: `index.html:777-781`

**Interfaces:**
- Nessuna (funzione rimossa, non chiamata da nessun altro punto del file — verificato).

- [ ] **Step 1: Rimuovere la funzione**

```bash
grep -n "fillHeroSunset\|herosunset" index.html
```

Verificare che l'unico risultato sia la definizione della funzione stessa (`index.html:777-781`), nessuna chiamata altrove. Rimuovere il blocco:

```js
async function fillHeroSunset(){
  const s = await loadSunset();
  const el = $('#herosunset');
  if (el && s) el.innerHTML = `🌇 Tramonto: <b>${s}</b> — occhio al buio.`;
}
```

- [ ] **Step 2: Verifica**

```bash
grep -n "fillHeroSunset\|herosunset" index.html
```

Expected: nessun risultato.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rimuove fillHeroSunset(), mai chiamata e riferita a un elemento inesistente (#5)"
```

---

### Task 18: Sottodominio Cloudflare

**Files:** nessuno nel repo (attività infra) — eccetto verifica finale.

**Interfaces:** nessuna.

- [ ] **Step 1: CNAME su Cloudflare**

Nel pannello DNS di Cloudflare per `bikeadventureseries.com`, aggiungere:

```
Tipo: CNAME
Nome: trentinogravel
Target: advlabbik.github.io
Proxy: DNS only (nuvoletta grigia, non arancione) — GitHub Pages richiede che il traffico non passi dal proxy Cloudflare per la verifica del certificato
```

- [ ] **Step 2: Custom domain su GitHub Pages**

```bash
gh api repos/advlabbik/tg-guida/pages -X PUT -f cname=trentinogravel.bikeadventureseries.com
```

- [ ] **Step 3: Aggiungere il file CNAME al repo**

GitHub Pages richiede un file `CNAME` in root con il dominio, altrimenti la configurazione viene persa al prossimo deploy:

```bash
echo "trentinogravel.bikeadventureseries.com" > CNAME
git add CNAME
git commit -m "Aggiunge CNAME per il sottodominio trentinogravel.bikeadventureseries.com"
```

- [ ] **Step 4: Verifica propagazione e HTTPS**

```bash
dig trentinogravel.bikeadventureseries.com CNAME +short
# Expected: advlabbik.github.io.

sleep 60
gh api repos/advlabbik/tg-guida/pages | grep -E '"status"|"https_enforced"'
# Expected: "status":"built", "https_enforced":true (può richiedere fino a ~15-20 minuti la prima volta)

curl -sI https://trentinogravel.bikeadventureseries.com/ | head -1
# Expected: HTTP/2 200
```

---

### Task 19: Verifica finale e merge

**Files:** nessuno (solo verifica).

- [ ] **Step 1: Rebase su main**

```bash
cd ../tg-guida-ds
git fetch origin
git rebase main
```

Risolvere eventuali conflitti (improbabili: nessun altro dovrebbe aver toccato questi file su `main` nel frattempo).

- [ ] **Step 1bis: Verifica residui di `--cream` con significato sbagliato**

La Task 3 ha ridefinito `--cream` da neutro chiaro a verde-oliva acceso senza rinominarlo — le Task 4 e 7 correggono gli usi noti (`nav button.on` desktop, `#gpsinfo`/`#gpsahead`), ma un residuo isolato è possibile. Controllo a rete:

```bash
grep -n "var(--cream)" styles.css
```

Per ogni risultato, verificare che sia un uso *intenzionale* del nuovo colore (testo su sfondo scuro, box "consigli"/tramonto — coerente con l'handoff) e non un vecchio sfondo neutro dimenticato. In caso di dubbio, confrontare con `design_handoff_tg_guida_restyle/README.md` sezione "Colori" (riga Cream: "ogni testo su scuro; campo pieno per i box 'consigli' e tramonto").

- [ ] **Step 2: Smoke test manuale su telefono reale**

Aprire `https://trentinogravel.bikeadventureseries.com/` (dopo Task 18) da uno smartphone reale, non solo browser desktop:
- Gate: inserire il codice, verificare l'accesso
- Home: tutte e 3 le fasi (via demobar) mostrano il layout atteso
- Percorso: le 3 card, la minimappa, la lista servizi filtrabile
- Info: ricerca funzionante, tutte le icone visibili
- Dormire: iframe Stay22 carica
- Live: GPS (richiede permesso posizione), meteo, sezione WHIP in stato "in arrivo"

- [ ] **Step 3: Verifica offline**

Con la app già aperta e cache popolata, attivare la modalità aereo sul telefono, ricaricare: la app deve continuare a funzionare (font, icone, layout — non le mappe tile né Stay22/meteo, che richiedono rete per definizione).

- [ ] **Step 4: Verifica issue GitHub**

```bash
gh issue list --repo advlabbik/tg-guida --state open
```

Chiudere manualmente (o via commit message `Fixes #1` in un futuro commit, qui a posteriori):

```bash
for n in 1 2 3 4 5 6; do
  gh issue close $n --repo advlabbik/tg-guida --comment "Risolto nel restyle (branch ds-restyle)."
done
```

- [ ] **Step 5: Push e merge**

```bash
git push -u origin ds-restyle
gh pr create --repo advlabbik/tg-guida --title "Restyle design system + completamento feature + fix code review" \
  --body "Restyle secondo l'handoff design (forest/terracotta), completamento WHIP/Stay22/link dopo-evento con pattern placeholder-pronto, chiusura issue #1-#6, sottodominio trentinogravel.bikeadventureseries.com."
```

Dopo review e merge, GitHub Pages ridistribuisce automaticamente `main` (deploy legacy già configurato).
