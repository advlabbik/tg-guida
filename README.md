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
| `index.html` | Markup + tutta la logica dell'app (tab, gate d'accesso, vista percorso con mappa e altimetria, GPS live, meteo, mappe Leaflet, ricerca, installazione PWA, opt-in notifiche push, feed Comunicazioni). Vista percorso e Live condividono i mattoni: `creaProfilo`/`profDisegna`/`profPin` per l'altimetria (che sa disegnare sia tutto il tracciato sia una finestra), `poiSuMappa` per i segni, `raggruppa` per non far sparire i punti sovrapposti |
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
| `anteprima-francesco/` | Snapshot statico storico di un branch di restyle (vedi sezione "Stato del repo e dei branch" sotto) — non è codice attivo, non editarlo pensando che finisca in produzione |

## Funzionalità principali

- **Tre fasi dell'evento** (`prima` / `durante` / `dopo`), calcolate automaticamente da `content.js → meta.fasi` in base alla data, con una home diversa per fase. C'è un demobar per forzare manualmente la fase durante lo sviluppo/demo (dietro `?demo=1`, nascosta di default).
- **Percorso**: la scelta fra i tre tracciati (Corto 216 km, Medio 360 km, Lungo 374 km) con foto, dati e note, il bottone che apre la vista percorso, il download GPX e la minimappa d'insieme. **La lista servizi non sta più qui**: stava staccata dal percorso, con un suo secondo selettore dopo quello appena usato sulle schede, e ripeteva in 220-245 righe quello che ora si vede su mappa e altimetria.
- **Vista percorso** (`#routeview`, il bottone "Mappa + altimetria"): schermata a tutto schermo **dentro l'app** che raccoglie tutto quello che riguarda un percorso — mappa Esri, profilo altimetrico e lista servizi, **tre viste sugli stessi dati comandate da un filtro solo** (tutto / acqua / mangiare / dormire). I punti compaiono sul profilo alla loro quota e sulla mappa come segni per categoria, la lista sotto è ordinata per km e contiene gli avvisi sui tratti senza rifornimenti. Trascinando il dito sul profilo si muove il cursore sulla mappa, toccando un'icona o un segno si legge nome, km, quota e quanto manca all'arrivo in km e in dislivello. La barra in alto resta ferma mentre il resto scorre, quindi la via d'uscita non scompare mai nemmeno in fondo alla lista — e le uscite sono tre, il tasto "Percorsi", il tasto indietro del telefono (`history.pushState` + `popstate`) e il tasto Esc. Prima questo bottone apriva `percorso-{id}.html` del repo mappe in una scheda esterna che non aveva nessun link di ritorno.
- **Info**: schede a tema (prima di partire, arrivare a Rovereto, sul percorso, durante l'evento, regole e vantaggi) con ricerca full-text.
- **Dormire**: mappa alloggi via iframe Stay22 (account aziendale reale `adventurelabsrl`, campagna `tgguida2026`).
- **Live**: geolocalizzazione in tempo reale con calcolo del km percorso, POI davanti, **punti di interesse anche sulla mappa** (gli stessi segni raggruppati della vista percorso) e **altimetria con il punto di dove sei**. Il profilo mostra una **finestra sui prossimi 25 km** (più 3 km alle spalle) invece di tutto il tracciato, perché in sella la domanda è che salita hai davanti e dove bevi, non com'è fatto il percorso intero — un tasto passa comunque alla vista completa. Sotto il profilo, quota attuale e quanto manca all'arrivo in km e dislivello. Più condivisione posizione (WhatsApp/Web Share API), meteo (Open-Meteo, gratuito) per le località dell'evento, orario del tramonto, e una sezione per il live tracking WHIP (in stato "in arrivo" finché non arriva il link reale).
- **Offline-first**: service worker network-first con fallback su cache, font e icone self-hosted, così le info restano consultabili anche senza segnale in montagna.
- **Installabile**: prompt "aggiungi a schermata Home" per Android (`beforeinstallprompt`) e istruzioni guidate per iOS.
- **Notifiche push e Comunicazioni**: opt-in Web Push (VAPID) nella tab Live, ricevute da `sw.js` anche ad app chiusa, più un feed in-app "Comunicazioni" come fallback per chi non riceve il push (es. iOS senza PWA installata). Lo staff invia i messaggi da `staff.html`.
- **Fase "dopo" a sequenza spuntabile** (19 agosto 2026): la home post-evento ha la stessa forma della checklist del "prima" — voci numerate con casella, salvate in `localStorage` (`tg-ck-dopo`, chiave separata da `tg-ck`). Le voci con `url` vuoto in `content.js → dopo.azioni` appaiono in stato "In arrivo" (testo `attesa`, niente casella né link): appena si compila l'url la voce si accende da sola, senza toccare il codice. Il prossimo evento (`dopo.prossimo`) è una card in evidenza col bordo oro, non una casella — un invito, non un compito; anche qui il bottone compare solo se `url` è compilato.

## Da sapere

- I dati marcati con `✱` in `content.js` sono segnaposto residui da confermare prima della pubblicazione reale (orari, numeri di telefono, link, codici sconto, traccia GPX definitiva) — la maggior parte è già stata sostituita con dati reali, controllare `grep -n '✱' content.js` prima del go-live per l'elenco aggiornato.
- Il gate d'accesso (`GATE_CODE` in `index.html`) è un deterrente, non sicurezza vera — verrà sostituito da un'autenticazione legata all'account BAS.
- `<meta name="robots" content="noindex, nofollow">`: la pagina non deve essere indicizzata, è riservata ai partecipanti.
- Le mappe usano tile Esri (minimappa percorsi e vista percorso) e CyclOSM (mappa GPS live); Leaflet è caricato da unpkg via CDN.
- **La traccia di `tracks.js` è semplificata e misura il 2-3% in meno del GPX completo** (211,9 / 348,7 / 362,6 km contro i 216 / 360 / 374 ufficiali), mentre i km dei POI di `poi.js` vengono dal GPX completo. Scalando i due riferimenti in modo lineare un punto finirebbe fino a 2,7 km più avanti di dov'è davvero, cioè dalla parte sbagliata di una salita. `routeGeom()` in `index.html` risolve usando come ancore i POI che hanno le coordinate (paesi e alloggi, 63-88 per percorso): trova il punto traccia più vicino a ciascuno, ottiene la coppia km-POI ↔ km-traccia e interpola in mezzo. Errore residuo misurato — mediano 0 km, peggiore 0,5 km. **Se un giorno `tracks.js` verrà rigenerato con la traccia completa, questa correzione diventa inutile ma resta innocua.**
- **Acqua e cibo in `poi.js` non hanno le coordinate, solo il km** — `scripts/gen_poi.py` scarta lat/lon dopo aver calcolato la posizione lungo il percorso, e le tiene solo dove servono al bottone Prenota (paesi e alloggi). Sulla mappa quei punti vengono appoggiati da `g.posOf()` al punto della traccia al loro km: restano dentro il corridoio con cui sono stati cercati (500 m per il cibo, 300 m per l'acqua), quindi il segno dice "a questo km del percorso" e non "esattamente qui" — ed è scritto nel testo sopra la lista, in tutte e due le lingue. **Conseguenza da conoscere**: i punti con lo stesso km cadono sullo stesso identico pixel e nessuno zoom li separa. A Rovereto otto locali fra il km 2,3 e il km 3,0 si sovrappongono perfettamente. Per questo i segni della mappa **raggruppano invece di nascondere**, col numero di quanti ne rappresentano: verificato che alla prima apertura i segni coprono la totalità dei POI di ogni percorso (220, 217, 245), nessuno lasciato indietro in silenzio. La cura vera sarebbe rigenerare `poi.js` conservando lat/lon — costa una rilettura completa di OpenStreetMap (20-40 minuti per percorso, vedi `docs/generazione-poi.md`) e una nuova revisione umana della lista, quindi si fa quando serve davvero, non di passaggio.
- **Il km del Live va preso da `routeGeom().kmAt`, mai sommando la traccia.** Fino al 13 agosto `startGPS()` sommava le distanze fra i punti di `tracks.js`, che è la traccia semplificata: misurava il 2-3% in meno della scala da cui vengono i km dei POI. Errore misurato sul Lungo — 3,1 km a un quarto di percorso, 8,8 km a tre quarti, 11,4 km all'arrivo. Non era solo un numero storto a schermo: il riquadro "Davanti a te" confronta i km dei POI con quello, quindi proponeva come prossime fontane e bar già superati da chilometri. `g.kmAt[best]` risolve e costa zero, il valore è già calcolato.
- **`fitBounds` sulla mappa della vista percorso va chiamato con `animate:false`.** Con l'animazione attiva i segni venivano calcolati sulla vista di passaggio invece che su quella definitiva, e un terzo del percorso restava fuori inquadratura con 60-90 POI mai disegnati.
- **`percorsi[].dplus` in `content.js` è testo già formattato e cambia con la lingua** (`"7.900"` in italiano, `"7,900"` in inglese), non è un numero. Va letto con `parseInt(String(p.dplus).replace(/\D/g,''), 10)` — moltiplicarlo direttamente dà risultati assurdi. `p.km` invece è un numero vero.
- Il dislivello residuo mostrato nella vista percorso è la somma grezza dei dislivelli della traccia **riportata in scala sul D+ ufficiale** del percorso, così il numero resta coerente con quello comunicato ai partecipanti. I km e i D+ ufficiali non si ricalcolano mai dal GPX.
- **Frecce direzionali sulla mappa Stay22: provate il 13 agosto, pubblicate, scartate da Andrea. Non rifarle senza un'idea diversa.** Dentro Stay22 la traccia la disegna Stay22 nel suo iframe cross-origin, e i soli parametri disponibili (`gpx`, `gpxlinecolor`, `gpxlinethickness`, `gpxlineopacity`) non riguardano le frecce. L'unico aggancio è `poi`, un array JSON di marcatori con immagine ma **senza rotazione**, quindi la rotazione va cotta nei file, uno per angolo. Tecnicamente funziona, Stay22 accetta gli SVG e li monta, ma rende ogni freccia come un **pallino bianco tondo di 30×36 px con la coda**, immagine ritagliata a cerchio e ingrandita al 125%, `size` minimo 1 e nessun modo di rimpicciolire. Vengono spilli, non frecce sulla linea, su una mappa che serve a cercare alloggi ed è già piena di spilli coi prezzi. Codice, script generatore e 24 SVG stanno nel commit `3c0b8c3`, annullato subito dopo. Altre cose verificate sul campo, se un domani servissero: `name` compare solo al passaggio del dito (niente etichette a vista, quindi nemmeno marcatori "km 30" leggibili al volo), l'immagine la scarica Stay22 e non il telefono (serve un indirizzo pubblico in HTTPS, da `localhost` non funziona), e con 12 marcatori la query string dell'iframe arriva a circa 2.700 caratteri.

### Checklist go-live fase "dopo" (19 agosto 2026)

- [ ] Compilare i tre url in `content.js → dopo` (IT **e** EN): `azioni[questionario].url` (il questionario post-evento), `azioni[foto].url` (le foto ufficiali — chiedere a Francesco il link del sistema di riconoscimento facciale), `prossimo.url` (form email "avvisami" del sito Tuscany Trail 2027). Le voci si accendono da sole appena l'url c'è.
- [ ] La data della finestra alumni (31 ottobre ore 18) è già nel testo di `dopo.prossimo`: i partecipanti la vedono dal 1° ottobre (inizio fase "dopo"), prima del reveal pubblico di metà ottobre. È voluto — sono gli alumni, il vantaggio è il messaggio — ma se il piano lanci cambia va aggiornata qui.
- [ ] **Bottone feedback dei partecipanti**: costruito e collaudato sul branch `feedback-partecipanti` (link in fondo a ogni pagina → modale → tabella Supabase `tg_feedback`, migrazione inclusa nel branch). In mano a Francesco — va applicata la migrazione e configurato il Database Webhook verso Slack prima del merge.

### Checklist go-live notifiche push

Prima della pubblicazione reale, da fare in quest'ordine:

- [ ] Sostituire `STAFF_CODE` nel secret dell'Edge Function `tg-send-broadcast` su Supabase (`npx supabase secrets set STAFF_CODE=... --project-ref kqsrtuzeeiljozdnjott`) con il codice reale. `staff.html` non ha più una copia locale del codice (fix #16): valida solo il server, e su 403 pulisce da sola il codice salvato in `localStorage` e riapre il gate — non serve coordinare un secondo update né avvisare chi ha già sbloccato il gate col placeholder.
- [ ] Se si tocca di nuovo `sw.js`, incrementare `CACHE` — altrimenti i client con la PWA installata restano sulla versione cache precedente.
- [ ] Verificare il fallback iOS su un iPhone reale — finora testato solo per via statica/logica.

## Stato del repo e dei branch

Deploy automatico su GitHub Pages da `main` (`https://advlabbik.github.io/tg-guida/`).

**Branch attivo: solo `main`.** Tutto lo sviluppo corrente procede qui con branch di vita breve mergiati appena pronti. Il branch `feat/poi-mappa-altimetria` (vista percorso, POI su mappa e altimetria, revisione del Live — 13 agosto) è stato sviluppato a parte su richiesta di Andrea, revisionato e mergiato: dopo il merge non va più usato.

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

**Aggiornamento, stesso 13 agosto** — le voci A2 e A3 sono state fatte in giornata,
in modo diverso da come le immaginava il documento. I punti stanno **anche sulla mappa**
(vista percorso e Live) senza rigenerare `poi.js`: dove mancano le coordinate il punto si
appoggia alla traccia al suo km tramite `g.posOf()`, con la posizione dichiarata
indicativa nel testo sopra la lista. La rigenerazione dei POI da OpenStreetMap **non è un
prerequisito di niente**, serve solo se un giorno si vorranno le posizioni esatte di
fontane e locali (vedi la voce dedicata in "Da sapere").

I punti che si sovrappongono non vengono scartati ma **raggruppati**, e il segno porta il
numero di quanti ne rappresenta — sul profilo come sulla mappa. Il conteggio sotto il
profilo dice quanti punti sono in vista e in quanti segni sono raggruppati.

## Funzioni decise, non ancora costruite

### "Arriva preparato" nella checklist pre-evento (Andrea, 15 agosto 2026)

Nella Home in fase "prima", tra le cose da fare, va aggiunto un punto
**"Arriva preparato"**: apre una lista delle cose che il partecipante potrebbe
dover comprare per l'evento, ogni voce linkata allo **shop online dello sponsor**
con lo **sconto dedicato ai partecipanti**; per tutto quello che non è coperto
da uno sponsor specifico si linka **Sportler** (sponsor). Mappa naturale
voce→sponsor del circuito: gomme Vittoria, borse Miss Grape, sella Selle Italia,
scarpe Northwave, casco e antifurto Abus, nutrizione Enervit, abbigliamento
RH+, tutto il resto Sportler.

Percorso deciso: si costruisce **prima nell'app del Tuscany Trail** (quando
nascerà, derivata da questa guida — repo ancora da creare; il TT ha anche la
parte turistica, che oggi vive in `advlabbik/cycling-in-tuscany`). Se funziona
si porta qui sul Trentino e su tutti gli eventi. Prima di svilupparla servono
da Andrea/Francesca: lista codici sconto per sponsor, link agli shop, testi
IT/EN.

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
- **Marker delle mappe — regola condivisa con tutti i progetti BAS** (imparata a spese di
  `cycling-in-tuscany`, due bug identici il 18/8/2026). Il posizionamento del marker lo fa
  la libreria con una sua classe (`.leaflet-marker-icon` qui, `.maplibregl-marker` in
  MapLibre): quindi **mai dichiarare `position`** sull'elemento passato al marker, e **mai
  riassegnare `className`** su un marker già aggiunto alla mappa — l'attributo intero
  cancella le classi della libreria. Solo `classList.add/remove/toggle`. Sintomo: i pin
  lasciano il tracciato, vanno **in diagonale** e finiscono fuori mappa. Qui non capita
  perché al cambio filtro si ricostruiscono i layer invece di ritoccare gli elementi:
  **è il metodo giusto, tenerlo.** La trappola torna viva il giorno in cui si passa a
  MapLibre. Spiegazione estesa nel README di `advlabbik/cycling-in-tuscany`.

## Lista servizi raggruppata e fumetto del profilo (19 agosto 2026, sera)

Due correzioni di Andrea sull'app appena pubblicata.

**La lista servizi non era leggibile.** Erano 220-300 righe tutte uguali. Ora e'
un blocco per chilometro (`poiGruppoHtml()`), con **le sole icone** e il numero
di punti per tipo — niente altro: nessuna freccia, nessun dettaglio che si apre
(seconda passata, Andrea 19/8 sera). Sul Corto si passa da 274 righe a 109
blocchi. I nomi dei singoli punti, il Prenota e il telefono del meccanico si
vedono **toccando il punto sulla mappa o sull'altimetria**, dove il fumetto
(`rvVoce()`) e' l'unico posto in cui vivono i dettagli — per questo li' sono
stati aggiunti i metri fuori percorso e il numero di telefono. I paesi restano un blocco a se' (`poiCittaHtml()`) col nome sopra e
**i conteggi per tipo sotto**, invece che in fila accanto al nome dove su schermo
stretto andavano a capo storti. Gli avvisi sui buchi di acqua e cibo restano
righe piene, in mezzo agli altri blocchi al loro chilometro.

**Il fumetto del profilo finiva sotto la barra dei filtri.** La barra e' sticky
con `z-index:3` e il fumetto non ne aveva nessuno, quindi toccando un punto alto
del profilo meta' testo spariva dietro i filtri. Ora `#rv-tip` (e `#lv-tip` del
Live) stanno a `z-index:5`, e se sopra il punto non c'e' spazio il fumetto si
**ribalta sotto** (classe `.sotto`, controllo `at.y - tip.offsetHeight - 10 < 0`
in `rvShowAt()`).

## Pagina Percorsi e descrizioni (19 agosto 2026, branch `percorsi-descrizioni`)

Impaginazione decisa da Andrea. La pagina Percorsi ora e', nell'ordine — la card
**Scegli il tuo percorso** con la regola del cambio percorso, la **mappa dei tre
tracciati sovrapposti**, e **tre tasti in fila** (`.rgrid` / `.rcard`) che stanno
sulla stessa riga anche su un telefono da 375 px, con foto in testa, nome, km,
dislivello e livello. Cosi' la scelta si vede tutta insieme e i tre percorsi si
confrontano senza scorrere.

Da PC (>= 900 px) la pagina resta **una colonna sola larga 860 px** invece di
stirarsi su tutta la finestra, e la mappa dei tre tracciati scende da 560 a 420 px
(`#minimap` nel blocco desktop; `#gpsmap` del Live resta 560): serviva perche' con
la mappa alta i tre tasti finivano sotto la piega e sembravano non esserci.

Tutto il resto e' passato **dentro la vista percorso**, dove c'e' lo spazio per
leggerlo — blocco `#rv-desc`, fra il profilo altimetrico e la lista servizi,
composto da `descPercorso()` in index.html con i dati di `content.js`:

- **Com'e'** — punto piu' alto in evidenza (`percorsi[].alto`) e tre paragrafi
  (`descLunga[]`) su dove passa il percorso e dove si concentra il dislivello.
- **Il fondo** — `percorsi[].fondo`.
- **Che tempo aspettarsi** — `percorsi[].meteo[]`, tabella di massime e minime
  medie per 4-6 punti del percorso, piu' `meteoNota`.

**Da dove vengono i numeri.** Le medie meteo sono calcolate sulla rianalisi ERA5
(Open-Meteo archive, gratuita) sui giorni **20-30 settembre 2022, 2023, 2024 e
2025**, 44 giornate per punto, con la quota reale del punto passata all'API cosi'
che la temperatura sia corretta sull'altitudine e non su quella media della cella.
Quote e chilometri dei punti piu' alti vengono dai GPX V1.8 (`Campo Carlo Magno
1.682 m` al km 108 sul Corto, `Baita Segantini 2.173 m` al km 199 sul Medio,
`Col Margherita 2.337 m` al km 198 sul Lungo). **Km e dislivelli totali restano
quelli ufficiali di `content.js`** — dal GPX si legge solo *come* e' distribuito
il dislivello, mai il totale (la traccia semplificata e il calcolo con soglia
danno valori piu' bassi del dato ufficiale).

**In sospeso** — le percentuali esatte di fondo per Medio e Lungo (asfalto /
sterrato / ciclabile) le passa Andrea dalle schede Komoot; oggi il testo descrive
il fondo a parole e la sola percentuale citata e' il 70% del Corto, che era gia'
il dato ufficiale in app.
## Live — il GPS accende anche il meteo, e la finestra WHIP (19 agosto 2026)

Due modifiche decise da Andrea, uguali in tutte le app della famiglia.

**Un tocco solo per posizione e meteo.** Il tasto *Attiva il GPS* del pannello
"Dove sono?" ora chiama anche `meteoGPS()`. Il permesso di posizione e' lo stesso,
chiederlo due volte era lavoro inutile per chi e' in sella. `meteoGPS()` scrive in
due riquadri quando ci sono — `#gpsmeteo`, dentro il pannello GPS, e `#meteogps`,
nella card Meteo piu' in basso — passando dai setter `box.testo` / `box.html`.
Il testo del pannello lo dice, in italiano e in inglese.

**Finestra WHIP nel Live.** Card `#whipsec` con l'iframe del live tracking
ufficiale, lo stesso embed usato sulla home di northcape4000.com
(`https://www.whip.live/event-tracking/<CODICE>`; verificato il 19/8 che non manda
ne' `X-Frame-Options` ne' `frame-ancestors`, quindi si incorpora ovunque).
L'URL sta in `content.js` come `whipUrl`, **una riga per lingua**: se e' stringa
vuota la card non viene proprio generata, cosi' un evento senza codice non mostra
una pagina rotta. Testi in `live.whip` (titolo, testo, nota, apri).

**Stato al 19/8 — `whipUrl` e' vuoto per scelta**: la prova con il tracker
NorthCape (`NC4R26`) e' servita a verificare che l'embed funzioni, poi Andrea ha
deciso che per ora l'app dice solo che la mappa arrivera'. Quindi la card c'e'
sempre e mostra il testo `live.whip.attesa`; appena WHIP consegna il codice del
Trentino Gravel si scrive l'url in `whipUrl` **in tutte e due le lingue** e la
mappa compare da sola, senza toccare il codice.
## Home — checklist rivista e cross-sell (19 agosto 2026, branch `home-checklist`)

Lista e ordine dettati da Andrea. Nella fase "prima" la Home e' ora —

1. **Quattro voci spuntabili** in `checklist[]` — certificato medico, studia la
   traccia preliminare, prenota almeno la prima notte a Rovereto, organizza il
   viaggio. Il forum e' uscito dalla lista numerata.
2. **Il forum in una card sua** (`cardForum()`), fuori dalla checklist — non e'
   un compito che si chiude, e' un posto dove tornare. Prima stava in coda alla
   stessa card senza casella e sembrava una voce a cui si era dimenticata la
   spunta (correzione di Andrea, 19/8).
3. **Un evento della serie, pescato a caso** (`cardAltroEvento()`), uno solo per
   volta: Tuscany Trail, Unpaved Roads, The Grand Escape, NorthCape4000. La
   scelta si fa una volta per apertura e resta ferma per tutta la sessione — se
   cambiasse a ogni ridisegno sembrerebbe un errore.
4. **L'articolo sui GPX** del Journal BAS (`cardArticolo()`), l'ultima cosa
   prima dei percorsi perche' e' quella che aiuta davvero chi sta preparando.
5. **I tre percorsi**, il blocco che c'era gia'.

Contenuti in `content.js` sotto `extraHome` (`forum`, `altriEventi[]`,
`articolo`), un blocco per lingua. **Le due liste `altriEventi` devono restare
nello stesso ordine**: la scelta casuale usa l'indice, quindi un ordine diverso
fra italiano e inglese mostrerebbe due eventi diversi cambiando lingua.

**UTM.** Tutti i link in uscita da questa parte della Home sono tracciati con
`utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=<slug>`.
Quando ci saranno le analytics dell'app si vedra' quale card tira di piu' e si
aggiustera' il tiro (era esattamente l'intenzione di Andrea).

Questa e' la parte "vendita" della cornice qui sotto — il contenuto utile e' il
veicolo, e resta un solo invito commerciale per volta.
## POI meccanici (19 agosto 2026, branch `poi-meccanici`)

Nuovo tipo di punto sul percorso, **`t: "b"`** — negozi di bici, meccanici e
colonnine di riparazione self service, presi da OpenStreetMap. Corto 55 punti,
Medio 52, Lungo 52 (la maggior parte dentro i paesi, vedi sotto). Si generano con `python scripts/gen_meccanici.py
corto=... medio=... lungo=...` (una query Overpass sola, distanze calcolate in
locale sul GPX: leggerissimo rispetto a `gen_poi.py`).

**Si comportano come gli altri POI** (correzione di Andrea, 19/8): chi cade
dentro il raggio di un paese non fa riga per conto suo ma entra nel **conteggio
del paese** (`nb` sulla riga `t:"c"`, accanto a mangiare/alloggi/fontane), con le
stesse costanti di `gen_poi.py` — raggio 4.000 m per le citta', 2.500 town,
1.200 village, 700 hamlet, e a parita' vince il centro piu' importante. Restano
righe singole solo i punti isolati (9 sul Corto, 9 sul Medio, 9 sul Lungo, contro
i 46/43/43 finiti dentro i paesi), che si portano dietro il nome della frazione.

Cosa cambia in app — quarto filtro **Meccanico** nella vista percorso, accanto ad
Acqua, Mangiare e Dormire; pin color petrolio (`#0b7285`) su mappa e altimetria,
icona `i-wrench` aggiunta allo sprite; nella lista compaiono il **telefono**
quando OSM ce l'ha (link da toccare) e **quanto e' fuori percorso** quando supera
i 500 metri.

Due scelte di dato — buffer a **1.000 m** invece dei 500 degli altri POI (con la
catena rotta un chilometro lo fai), e niente nome inventato: se OSM non ha il
nome la riga mostra il sottotipo tradotto ("riparazione self service"), che dice
di piu' di un segnaposto.

**Non ancora fatto** — i meccanici non entrano nel blocco «Davanti a te» del Live,
che continua a pescare 1 acqua, 1 cibo e 2 posti letto. Il meccanico piu' vicino
davanti a te sarebbe utile proprio nel momento peggiore, ma cambia il disegno di
quel blocco e va deciso a parte.

## A cosa servono le app degli eventi (Andrea, 19 agosto 2026)

Cornice valida per tutte le app evento BAS, comprese quelle non ancora nate — da rileggere prima di aggiungere o togliere qualcosa.

L'app serve a **restare attaccati al cliente dal momento dell'iscrizione fino alla fine dell'evento**. In quella finestra il partecipante ci dà la sua attenzione, che è la cosa più preziosa che ha, e non ce la dà nessun altro canale. Quell'attenzione si spende **bilanciando utilità e vendita**.

- **Utilità** — dentro ci devono essere tutte le informazioni e gli strumenti per arrivare preparati e vivere al meglio la propria avventura in bicicletta. È la parte che si guadagna l'attenzione; senza, l'app non viene aperta e non c'è niente da bilanciare.
- **Vendita** — chi è già dentro deve poter spendere altri soldi con noi, in tre modi soltanto — fargli **scoprire un altro evento**, **agganciarlo alla Bike Adventure Series** (la serie, non il singolo evento), oppure **tutti e due insieme**, per esempio la BAS presentata con il link a un articolo che gli è davvero utile. Il contenuto utile è il veicolo della vendita, non il suo contorno.
- **B2B con intelligenza** — i partner entrano dentro un punto di forza per chi pedala, mai come cartellone. Qui la superficie di oggi è la barra sponsor (markup pronto, 4 loghi in `assets`, slot «il tuo brand qui») e la mappa alloggi; «Arriva preparato» con la lista della spesa e gli sconti sponsor si valida prima sul Tuscany Trail e poi scende anche qui.

L'utilità non arretra mai per far posto a chi paga (regola D6 del registro). Ragionamento esteso e decisione **D17** nella pagina Notion linkata qui sotto.

## Decisioni ecosistema — 16 agosto 2026

Analisi completa dei 4 progetti digitali e registro decisioni con le motivazioni nella pagina Notion [Ecosistema App BAS — analisi e registro decisioni](https://app.notion.com/p/3bef88ad0121819487aceb41d1a89781). Qui solo ciò che tocca questo repo.

- **Fase "dopo" da popolare prima del 26/9** — attestato Pioneer, foto, questionario e card "Prima Fila BAS" in `dopo.azioni[]`/`dopo.prossimo` (testi base nello snapshot `anteprima-francesco/content.js`). Perché — il post-evento è il picco emotivo e la prevendita alumni apre il 31/10, quando i 500 pionieri avranno ancora l'app in mano.
- **Push da riaccendere per il 31/10** — checklist go-live già in questo README + dominio (issue #14). La notifica "Prima Fila" ai 500 è il canale a costo zero sulla coorte più calda della serie.
- **Qui nasce il motore card social** — canvas on-device + Web Share API (già usata per la posizione), primo uso l'attestato Pioneer condivisibile. Zero backend; il motore si riusa su tuscany-trail-app e northcape4000-app.
- **Segnalazioni percorso, stadio 1** — bottone nella Live che apre WhatsApp precompilato con km e percorso allegati in automatico (arriva in Slack via 2Chat). Il form strutturato su Supabase è lo stadio 2, previsto sul Tuscany Trail 2027. Resta separato dall'assistenza personale (112, taxi, meccanici).
- **Niente timbri in-app per l'edizione zero** — al TG debutta il passaporto fisico BAS e la survey aveva già rimandato l'idea all'area personale 2027.
- **Analytics Umami sulle 3 app** appena c'è l'account — prerequisito per vendere qualsiasi visibilità in-app.
