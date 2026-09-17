# TG Guida — Trentino Gravel

Web app (PWA) che accompagna i partecipanti del **Trentino Gravel — Pioneer Edition** (26 settembre 2026, partenza/arrivo da Manifattura Tabacchi, Rovereto) prima, durante e dopo l'evento.

Vanilla JS, nessun build step: `index.html` + file dati/logica/stile caricati come script/link globali. Nessun bundler, nessuna dipendenza npm.

Design system: verde + logo/icone disegnate su misura ("veste grafica di Alessio"), tipografia e componenti in `styles.css`. Contenuti bilingue IT/EN (`content.js → CONTENT.it` / `CONTENT.en`).

## Prima di toccare qualcosa — leggi qui, e leggi `CLAUDE.md`

Questa è **un'app-evento**, non il template. Le app-evento di BAS hanno tutte
lo stesso motore, e il motore vive in un posto solo — la repo
[`advlabbik/event-app-template`](https://github.com/advlabbik/event-app-template).

- **Qui si cambiano solo contenuti e veste grafica** — testi, date, tracce,
  punti di interesse, loghi, colori. Cosa è contenuto e cosa è motore, file per
  file, sta nella tabella in `CLAUDE.md`.
- **Il motore non si tocca qui, nemmeno «solo per questa volta».** Serve una
  funzione o c'è un bug? Si fa nel template, e da lì Francesco la porta giù in
  ogni app. Copiare un pezzo da un'altra app-evento non è un porting: è
  un'altra versione in più da riconciliare.
- **Questa app è nata prima del template**, quindi il motore sta ancora dentro
  `index.html` e non c'è un controllo automatico che blocchi una modifica
  sbagliata. La sostituzione del motore con quello del template è un lavoro di
  Francesco, ancora da fare; fino ad allora qui non entra nessuna riga di
  motore nuova.
- **Mai su `main`**: ramo, verifica in locale, poi merge. `main` è online con
  partecipanti veri dentro.
- **Tutto quello che deve arrivare a Francesco** — una PR che aspetta lui, un
  dato mancante, una cosa rotta — va nel canale Slack `#segnalazioni-test`,
  dove legge la sua sessione Claude sempre accesa.

Se lanci Claude Code in questa cartella, legge `CLAUDE.md` da solo e ti dice
all'inizio in quale repo sei e cosa può fare. Se ti risponde «questa è una
modifica al motore, va fatta nel template», non è pigrizia: è la regola.

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
| `index.html` | **Motore — non si modifica qui, vedi `CLAUDE.md`.** Markup + tutta la logica dell'app (tab, gate d'accesso, vista percorso con mappa e altimetria, GPS live, meteo, mappe Leaflet, ricerca, installazione PWA, opt-in notifiche push, feed Comunicazioni). Vista percorso e Live condividono i mattoni: `creaProfilo`/`profDisegna`/`profPin` per l'altimetria (che sa disegnare sia tutto il tracciato sia una finestra), `poiSuMappa` per i segni, `raggruppa` per non far sparire i punti sovrapposti |
| `staff.html` | Pagina riservata allo staff per inviare comunicazioni push a tutti i partecipanti iscritti (gate separato da `index.html`, chiama la Edge Function `invia-comunicazione`), con sotto l'archivio di quelle già mandate |
| `config.js` | Unica fonte per `TG_SUPABASE_URL`, `TG_SUPABASE_ANON_KEY` e `TG_EVENTO_ID`, caricato sia da `index.html` sia da `staff.html` — evita di tenere sincronizzato a mano lo stesso valore in più file |
| `uso.js` | **Analytics d'uso — spento.** Conta quante persone usano la guida e quali funzioni, con un codice anonimo che si rigenera ogni notte. Arriva dal template (`advlabbik/event-app-template`, `motore/uso.js`) e **va tenuto identico byte per byte**: e' l'unico modo perche' le correzioni fatte la' si riportino qui con una copia invece che con una riconciliazione a mano. Si accende da `config.js` → `analytics` |
| `styles.css` | Tutto il CSS del design system (token in `:root`, componenti, schermate) |
| `icons.js` | Helper `icon(name, size)` per le icone (sprite SVG) e mappa id-scheda-info → nome icona |
| `icons/sprite.svg` | Sprite SVG con i simboli usati nell'app (referenziato via `<use>`) |
| `fonts/` | Font del design system self-hosted in woff2 — mai da CDN, per restare offline-first |
| `assets/` | Loghi SVG/PNG (compreso quello degli sponsor) |
| `content.js` | `window.CONTENT.it` / `window.CONTENT.en` — tutti i testi editoriali (checklist, percorsi, info-card, sponsor, meteo, fasi prima/durante/dopo, live tracking), bilingue con switch in alto |
| `tracks.js` | `window.TRACKS` — coordinate GPX dei tre percorsi (corto/medio/lungo), usate per le mappe e per il calcolo posizione GPS |
| `poi.js` | `window.POI` — punti di interesse lungo il percorso (acqua, cibo, alloggi) per km, fonte OpenStreetMap, generati con `scripts/gen_poi.py` (procedura in `docs/generazione-poi.md`) |
| `gpx/` | I GPX definitivi V3.0 serviti dall'app stessa (dal 17/9/2026 non più dal repo mappe): Corto intero; Medio e Lungo **uniti** (li usano la mappa Stay22 e la vista percorso) e in **due parti** `-parte1`/`-parte2` (quelli che si scaricano: oltre i 10.000 punti i GPS Garmin non caricano). Non in precache del service worker |
| `docs/liste-poi/` | Liste POI grezze per percorso, output intermedio dello script di generazione |
| `manifest.webmanifest` | Manifest PWA (nome, icone, colori del brand, `display: standalone`) |
| `sw.js` | Service worker: **network-first** per i file dell'app (chi ha rete vede sempre l'ultima versione), cache come rete di salvataggio quando il segnale manca. Mappe/meteo/Stay22 non passano di qui. Versione cache attuale: vedi costante `CACHE` in cima al file — **va incrementata a ogni modifica di `sw.js`** o dell'elenco asset, altrimenti i client con la PWA installata restano bloccati sulla versione precedente |
| `icons/icon-192.png`, `icons/icon-512.png` | Icone PWA |
| `supabase/` | Migrazioni e `LEGGIMI.md` del backend push (la Edge Function `invia-comunicazione` non sta più qui: è una sola per tutte le app-evento e vive in `advlabbik/event-app-template`) e per la tabella `feedback` (segnalazioni dei partecipanti) — unica dipendenza runtime da un backend (progetto Supabase **`tokqvqrebunfshjtpkog` "guide-eventi"**, condiviso fra tutte le app-evento, separato dal DB marketing dal 24/8/2026). Le tabelle sono generiche (`push_subscriptions`, `broadcast_messages`, `feedback`, ecc.) con una FK `evento_id` verso `eventi`, non più prefissate per evento (schema condiviso dal 24/8/2026, migrazione `eventi_condivisi`) — il resto dell'app gira senza backend |
| `scripts/gen_poi.py` | Script per rigenerare `poi.js` da OpenStreetMap quando cambia una traccia |
| `anteprima-francesco/` | Snapshot statico storico di un branch di restyle (vedi sezione "Stato del repo e dei branch" sotto) — non è codice attivo, non editarlo pensando che finisca in produzione |

## Funzionalità principali

- **Tre fasi dell'evento** (`prima` / `durante` / `dopo`), calcolate automaticamente da `content.js → meta.fasi` in base alla data, con una home diversa per fase. C'è un demobar per forzare manualmente la fase durante lo sviluppo/demo (dietro `?demo=1`, nascosta di default).
- **Percorso**: la scelta fra i tre tracciati (Corto 216 km, Medio 357 km, Lungo 376 km — tracce V3.0 definitive del 17 settembre 2026) con foto, dati e note, il bottone che apre la vista percorso, il download GPX (un tasto per il Corto, due tasti impilati «GPX 1/2» e «GPX 2/2» per Medio e Lungo, vedi `gpxFiles()`) e la minimappa d'insieme. **La lista servizi non sta più qui**: stava staccata dal percorso, con un suo secondo selettore dopo quello appena usato sulle schede, e ripeteva in 220-245 righe quello che ora si vede su mappa e altimetria.
- **Vista percorso** (`#routeview`, il bottone "Mappa + altimetria"): schermata a tutto schermo **dentro l'app** che raccoglie tutto quello che riguarda un percorso — mappa Esri, profilo altimetrico e lista servizi, **tre viste sugli stessi dati comandate da un filtro solo** (tutto / acqua / mangiare / dormire). I punti compaiono sul profilo alla loro quota e sulla mappa come segni per categoria, la lista sotto è ordinata per km e contiene gli avvisi sui tratti senza rifornimenti. Trascinando il dito sul profilo si muove il cursore sulla mappa, toccando un'icona o un segno si legge nome, km, quota e quanto manca all'arrivo in km e in dislivello. La barra in alto resta ferma mentre il resto scorre, quindi la via d'uscita non scompare mai nemmeno in fondo alla lista — e le uscite sono tre, il tasto "Percorsi", il tasto indietro del telefono (`history.pushState` + `popstate`) e il tasto Esc. Prima questo bottone apriva `percorso-{id}.html` del repo mappe in una scheda esterna che non aveva nessun link di ritorno.
- **Info**: schede a tema (gli orari, prima di partire, arrivare a Rovereto, sul percorso, durante l'evento, regole e vantaggi) con ricerca full-text. La prima scheda porta la **tabella oraria** dell'evento: una card info può avere un campo `orari` (giorni → righe `ora` + `cosa`) che viene disegnato come tabella invece che come prosa, ed entra anche nella ricerca, così "briefing" o "7:30" trovano la card.
- **Dormire**: mappa alloggi via iframe Stay22 (account aziendale reale `adventurelabsrl`, campagna `tgguida2026`).
- **Live**: geolocalizzazione in tempo reale con calcolo del km percorso, POI davanti, **punti di interesse anche sulla mappa** (gli stessi segni raggruppati della vista percorso) e **altimetria con il punto di dove sei**. Il profilo mostra una **finestra sui prossimi 25 km** (più 3 km alle spalle) invece di tutto il tracciato, perché in sella la domanda è che salita hai davanti e dove bevi, non com'è fatto il percorso intero — un tasto passa comunque alla vista completa. Sotto il profilo, quota attuale e quanto manca all'arrivo in km e dislivello. Più condivisione posizione (WhatsApp/Web Share API), meteo (Open-Meteo, gratuito) per le località dell'evento, orario del tramonto, e una sezione per il live tracking WHIP (in stato "in arrivo" finché non arriva il link reale).
- **Offline-first**: service worker network-first con fallback su cache, font e icone self-hosted, così le info restano consultabili anche senza segnale in montagna.
- **Installabile**: prompt "aggiungi a schermata Home" per Android (`beforeinstallprompt`) e istruzioni guidate per iOS.
- **Notifiche push e Comunicazioni**: opt-in Web Push (VAPID) nella tab Live, ricevute da `sw.js` anche ad app chiusa, più un feed in-app "Comunicazioni" come fallback per chi non riceve il push. Il feed porta giorno e ora, non solo l'ora: l'evento dura sei giorni e un messaggio di sabato e uno di domenica sarebbero identici. **Su iPhone in Safari il push non esiste** — Apple lo dà solo alle app aggiunte alla schermata Home — e la card lo dice invece di sparire, che è la ragione per cui `push_subscribe_attempts` era rimasta a zero. Lo staff invia i messaggi da `staff.html`, che sotto al modulo mostra anche l'archivio di quelle già mandate, per non mandare due volte la stessa cosa quando scrivono in più persone.
- **Fase "dopo" a sequenza spuntabile** (19 agosto 2026): la home post-evento ha la stessa forma della checklist del "prima" — voci numerate con casella, salvate in `localStorage` (`tg-ck-dopo`, chiave separata da `tg-ck`). Le voci con `url` vuoto in `content.js → dopo.azioni` appaiono in stato "In arrivo" (testo `attesa`, niente casella né link): appena si compila l'url la voce si accende da sola, senza toccare il codice. Il prossimo evento (`dopo.prossimo`) è una card in evidenza col bordo oro, non una casella — un invito, non un compito; anche qui il bottone compare solo se `url` è compilato.
- **Feedback dei partecipanti**: link fisso in fondo alla pagina ("Qualcosa non funziona? Scrivicelo") che apre un modale con textarea + email facoltativa. Il messaggio va nella tabella Supabase `feedback` (insert-only per anon, rate limit per IP e per evento — stesso pattern delle push) insieme al contesto tecnico (fase, tab, lingua, user agent, PWA sì/no) e all'`evento_id` di questa app. Nessuna policy di lettura per anon: i feedback si leggono dal dashboard Supabase e arrivano in tempo reale su Slack `#feedback-app` via trigger `pg_net` → webhook n8n. Dal 31/8/2026 lo stesso workflow (rinominato "Guide eventi — Feedback → Slack + issue", `r7ZcI2XT34iRv7px`) **apre anche una issue GitHub** etichettata `feedback`, con testo, contatto, contesto tecnico e id Supabase; il messaggio Slack porta il nome dell'evento e il link alla issue. **Il workflow non è più solo di questa app**: la tabella `feedback` è condivisa e il trigger è sulla tabella, quindi ci passano i feedback di *tutte* le app-evento. Uno Switch sull'`evento_id` li smista nella repo giusta — `b059ed05…` → `tg-guida`, `96b30757…` → `evento-tge-ger-austria-2026` (l'app TGE Germania/Austria, che ha `feedbackAttivo: true` sullo stesso progetto Supabase) — e un'uscita di riserva manda su Slack, senza aprire niente, quello che arriva da un `evento_id` non ancora mappato. **Quando nasce una nuova app-evento va aggiunta lì**, altrimenti i suoi feedback restano solo su Slack.

## Da sapere

- **Gli orari dell'evento stanno scritti in quattro posti, per scelta** (`content.js`, in tutte e due le lingue): la card `orari` con la tabella, e le card `pacco`, `partenza` e `arrivo` che ripetono la loro riga a parole. La ripetizione serve a chi cerca "briefing" o "partenza" e si aspetta la risposta lì, non in una tabella generale. Se un orario cambia, **vanno cambiati tutti e quattro**, IT ed EN — più `meta.partenza` e `meta.dataPartenza`, che comandano il countdown della home.

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

### Checklist go-live fase "dopo" e feedback (19 agosto 2026)

- [x] ~~Applicare `supabase/migrations/20260819000000_tg_feedback.sql`~~ **Fatto (24/8)** sul nuovo progetto `guide-eventi` (`tokqvqrebunfshjtpkog`), con RLS abilitata anche su `tg_feedback_attempts` (su kqsr l'omologa delle push era rimasta scoperta, advisory critico).
- [x] ~~Configurare il Database Webhook verso Slack~~ **Fatto (24/8)** con trigger `pg_net` nella migrazione stessa → webhook n8n `tg-feedback-slack` → canale `#feedback-app`.
- [x] ~~**Feedback → issue GitHub**~~ **Fatto e in produzione (31/8/2026).** Il workflow n8n `r7ZcI2XT34iRv7px` apre la issue prima di postare su Slack; provato end-to-end con un feedback vero mandato all'endpoint REST (issue [#27](https://github.com/advlabbik/tg-guida/issues/27), chiusa) — passa il trigger `pg_net`, lo Switch sull'`evento_id`, la label `feedback` e il link nel messaggio Slack. La credenziale n8n è **"GitHub account"**, un PAT fine-grained intestato all'organizzazione `advlabbik` con `Issues: read and write` sulla sola repo `tg-guida`. **Ha una scadenza**, e il nodo GitHub ha `onError: continueRegularOutput` — un guasto di GitHub non deve mangiarsi la notifica Slack, e la riga su Supabase è comunque già scritta prima che il trigger parta. Perché la scadenza non passi inosservata, la riga `*Issue:*` del messaggio Slack fa da spia: se al posto del link compare **«⚠️ NON CREATA»**, il token è scaduto, revocato, o non ha accesso a quella repo. Non serve nessun controllo periodico: il segnale arriva da solo col primo feedback.
- [x] ~~**Allargare il token GitHub alla repo tedesca**~~ **Fatto (31/8).** Entrambi i rami provati in produzione con feedback veri: [tg-guida#27](https://github.com/advlabbik/tg-guida/issues/27) e [evento-tge-ger-austria-2026#28](https://github.com/advlabbik/evento-tge-ger-austria-2026/issues/28), tutt'e due chiuse.
- **Trappola da conoscere prima di diagnosticare questo workflow: i dati bloccati (*pinned*) di n8n.** Se un nodo ha dei dati bloccati nell'editor, **nelle esecuzioni manuali** restituisce quelli invece di chiamare davvero il servizio — e continua a farlo anche dopo che il problema è stato risolto. È successo il 31/8: il nodo GitHub tedesco aveva bloccato un vecchio `404` e faceva sembrare rotto un token già sistemato. Si riconosce dal tempo di esecuzione del nodo a **0 ms** invece di qualche centinaio, e dalla presenza del nodo dentro `pinData` nell'esecuzione. Non si toglie riscrivendo il workflow via API: va sbloccato dall'editor (tasto destro sul nodo → *Unpin*). **In produzione i dati bloccati vengono ignorati**, quindi nel dubbio la prova che vale è un feedback vero mandato all'endpoint REST, non un'esecuzione manuale.
- [ ] Compilare i tre url in `content.js → dopo` (IT **e** EN): `azioni[questionario].url` (il questionario post-evento), `azioni[foto].url` (le foto ufficiali — chiedere a Francesco il link del sistema di riconoscimento facciale), `prossimo.url` (form email "avvisami" del sito Tuscany Trail 2027). Le voci si accendono da sole appena l'url c'è.
- [ ] La data della finestra alumni (31 ottobre ore 18) è già nel testo di `dopo.prossimo`: i partecipanti la vedono dal 1° ottobre (inizio fase "dopo"), prima del reveal pubblico di metà ottobre. È voluto — sono gli alumni, il vantaggio è il messaggio — ma se il piano lanci cambia va aggiornata qui.

### Checklist go-live notifiche push

Prima della pubblicazione reale, da fare in quest'ordine:

- [x] `STAFF_CODE` impostato (24/8) sul progetto `guide-eventi` insieme ai VAPID rigenerati (`npx supabase secrets set ... --project-ref tokqvqrebunfshjtpkog`); il codice ce l'ha Francesco. Se serve cambiarlo di nuovo: `staff.html` non ha più una copia locale del codice (fix #16): valida solo il server, e su 403 pulisce da sola il codice salvato in `localStorage` e riapre il gate — non serve coordinare un secondo update né avvisare chi ha già sbloccato il gate col placeholder.
- [ ] Se si tocca di nuovo `sw.js`, incrementare `CACHE` — altrimenti i client con la PWA installata restano sulla versione cache precedente.
- [ ] Verificare il fallback iOS su un iPhone reale — finora testato solo per via statica/logica.

## Analytics d'uso — c'è, ed è spento

Dal ramo `analytics-uso` (settembre 2026). L'app sa contare quante persone la
usano in un giorno e quali funzioni toccano, ma **`analytics` in `config.js` è
`false`** e finché resta così non scrive niente nel browser e non manda niente
in rete.

Il disegno, con le ragioni di ogni scelta, sta nel template:
`docs/superpowers/specs/2026-09-08-analytics-uso-design.md`. In breve —
l'identità è un codice casuale che si rigenera ogni notte, quindi risponde a
«quante persone oggi» senza essere un identificativo che dura; il vocabolario
dei contatori è chiuso; non si registrano le parole cercate, né la posizione,
né il chilometro. Questa app ha già il suo `TG_EVENTO_ID`, e le tabelle sono state applicate al
progetto condiviso `guide-eventi` il 9 settembre 2026 — lo schema vive nel
template, in `supabase/riferimento/analytics-uso.sql`, e **non è copiato in
questa repo**.

> Se un giorno quelle tabelle non ci fossero (progetto ripristinato da un
> backup vecchio, schema riapplicato a metà), PostgREST risponderebbe **404**, e
> il 404 è fra i rifiuti che `uso.js` considera definitivi- ogni lotto verrebbe
> buttato **in silenzio**, senza un errore da nessuna parte. Prima di accendere,
> vale la pena aprire il Table Editor e vedere che `uso` ci sia davvero.

**Sedici contatori su ventidue.** Restano fuori i tre «bisogni» (acqua, cibo,
spesa), i due salti alloggi «+60 / +100 km» e `maps:cerca`, perché in questa
versione dell'app quelle funzioni e quei link non ci sono. Chi guarda i numeri
non deve aspettarsi quei sei — non arriveranno mai.

### Cosa serve PRIMA di accenderlo

1. **Una scheda Info con `id: 'privacy'`**, in italiano e inglese, che spieghi
   ai partecipanti che l'app conta in forma anonima quante persone la usano e
   quali funzioni. L'avviso sopra la barra rimanda lì con «Come funziona»; senza
   quella scheda il tasto apre la sezione Info e basta. I testi pronti stanno
   nel template, in `docs/informativa-analytics.md`, e **vanno confermati da chi
   segue la privacy prima di pubblicarli** — non sono un parere legale.
2. Bumpare `CACHE` in `sw.js`, come per ogni modifica ai file dell'app.

> **Qui non c'è la rete del template.** Sul template `scripts/verifica.mjs` si
> rifiuta di dare l'ok se l'analytics è acceso senza informativa, e
> `scripts/prova-uso.mjs` fa girare 30 prove sul sottosistema. Questa app non ha
> né l'uno né l'altro: i controlli, qui, li fa una persona. È il motivo per cui
> conviene accendere **a evento iniziato** e non il giorno della partenza.

## Stato del repo e dei branch

**Rispetto al template (17/9/2026).** Il motore di questa app è ancora quello
originale dentro `index.html`: la sostituzione con il motore di
`advlabbik/event-app-template` è un lavoro di Francesco, non ancora fatto. Le
funzioni che il template ha e questa app no — il cancello che legge `?code=`
dall'indirizzo, il QR personale del ritiro pacco — arrivano con quella
migrazione. La [PR #30](https://github.com/advlabbik/tg-guida/pull/30) (il
link col codice dentro per i QR dinamici) resta aperta per questo motivo: non
si porta a mano in `index.html`, si aspetta il motore nuovo.

Deploy automatico su GitHub Pages da `main`, su **<https://trentinogravel.bikeadventureseries.com>** (dal 27/8/2026, [issue #10](https://github.com/advlabbik/tg-guida/issues/10)). Il vecchio `advlabbik.github.io/tg-guida/` risponde 301 verso il nuovo indirizzo conservando il path, quindi i link già distribuiti reggono. Il file `CNAME` in radice tiene ferma la configurazione: se sparisce, al primo deploy il dominio si perde.

**Questa repo deve restare pubblica, altrimenti il sito va giù.** L'organizzazione `advlabbik` è sul piano **Free**, e su Free GitHub Pages non pubblica repo privati: nel momento in cui la visibilità passa a privato, GitHub **disattiva Pages da solo** (`has_pages` va a `false`, l'endpoint API `repos/.../pages` risponde 404) e il dominio custom comincia a servire la pagina «Site not found · GitHub Pages». Non c'è nessun avviso, nessun build fallito da guardare, nessuna traccia nei commit: da fuori sembra un guasto del deploy o del DNS, ma DNS e `CNAME` restano perfettamente a posto. È successo il **31/8/2026 alle 11:17**: la repo è stata resa privata e la guida è andata offline finché non è stata rimessa pubblica e Pages riacceso su `main` / root. Il certificato HTTPS del dominio è sopravvissuto allo spegnimento, quindi al riaccendere non serve riemetterlo.

Nel repo **non ci sono segreti**, ed è il motivo per cui tenerlo pubblico è sostenibile: `config.js` porta solo la chiave *publishable* di Supabase (pubblica per definizione in un sito statico), mentre `STAFF_CODE` e le chiavi VAPID stanno nei secret del progetto Supabase. Il `GATE_CODE` in `index.html` è un deterrente dichiarato, non un segreto. Se un domani servisse davvero tenere il codice privato, le strade sono due: portare l'organizzazione su GitHub Team (Pages pubblica anche i repo privati) oppure spostare l'hosting su Cloudflare Pages/Netlify, che buildano repo privati anche sul piano gratuito — rifacendo però il DNS del sottodominio.

**Backend: dal 24/8/2026 l'app punta al progetto Supabase dedicato `guide-eventi` (`tokqvqrebunfshjtpkog`)**, creato per separare le app evento dal DB marketing (`kqsrtuzeeiljozdnjott`, dove le tabelle `tg_*` sono nate). Lo switch è avvenuto a tabelle quasi vuote (0 subscription push, 0 broadcast reali), quindi senza migrazione dati; i VAPID e lo `STAFF_CODE` sono stati rigenerati nell'occasione. Le vecchie tabelle `tg_*` su kqsr vanno droppate dopo un periodo di osservazione.

**Schema condiviso multi-evento (24/8/2026, migrazione `eventi_condivisi`).** La convenzione iniziale prevedeva un set di tabelle prefissato per evento (`tg_*` per Trentino Gravel, `tt_*` per una futura Tuscany Trail...) nello stesso progetto — mai applicata ad altri eventi. È stata sostituita subito da uno schema unico condiviso: tabella `eventi` (id/slug/nome) + tabelle generiche `push_subscriptions`/`broadcast_messages`/`feedback`/`push_subscribe_attempts`/`feedback_attempts` con FK `evento_id`. `config.js` porta l'id fisso della riga `trentino-gravel` (`TG_EVENTO_ID`) e lo manda nella richiesta alla Edge Function. Ogni futura app-evento userà le stesse tabelle, filtrate dal proprio `evento_id` — niente nuovo set di tabelle né nuovo progetto Supabase per evento.

**Branch attivo: solo `main`.** Tutto lo sviluppo corrente procede qui con branch di vita breve mergiati appena pronti. Il branch `feat/poi-mappa-altimetria` (vista percorso, POI su mappa e altimetria, revisione del Live — 13 agosto) è stato sviluppato a parte su richiesta di Andrea, revisionato e mergiato: dopo il merge non va più usato.

**`ds-restyle` è congelato, tenuto solo come reference storico — non va mergiato.** Era nato come branch di redesign parallelo (piano `docs/superpowers/plans/2026-08-12-golive-restyle.md`, non presente su `main`), ed è stato riconciliato più volte con `main` mentre entrambi i rami andavano avanti in parallelo sugli stessi file (vedi la storia di [issue #11](https://github.com/advlabbik/tg-guida/issues/11)). L'ultima riconciliazione risale al 12/08: da allora `main` ha ricevuto in autonomia la veste grafica ufficiale ("veste grafica di Alessio", 13/08) e i contenuti bilingue/POI/copy che la superano — `ds-restyle` non li ha. Le parti tecniche che aveva di utile (notifiche push, `staff.html`, service worker network-first) sono già presenti identiche su `main`. **Prima di considerare di nuovo un merge di `ds-restyle`, verificare a mano se `main` non l'ha già superato** — è già successo due volte che sembrasse "pronto, manca solo il subdominio" mentre nel frattempo `main` era andato avanti per conto suo.

## Tracce V3.0 — le definitive (17 settembre 2026, branch `tracce-finali-v3`, NON pubblicato)

Andrea ha consegnato le tracce finali in cinque file: Corto intero, **Medio e
Lungo spezzati in due a Predazzo** (km 171,3, stesso punto per entrambi: la
parte 1 e' identica) perche' superano i 10.000 punti, il tetto che i GPS Garmin
impongono a una traccia. Il Medio combacia al metro con l'export «Trentino
Gravel v3.0» del 16/9. Regola di prodotto decisa con Andrea: **il download da'
entrambe le parti, la visualizzazione resta unica per percorso** (tracks.js,
vista percorso e Stay22 usano il file unito).

Cosa cambia rispetto alla V2.2 (misurato al metro sui GPX):

- **Cinque Croci fuori → passo Brocon (1.616 m) e Pieve Tesino**, su Medio (km
  ~230-275) e Lungo (~248-292): la strada Carlettini→Ponte Conseria in Val
  Campelle e' un cantiere fino a meta' ottobre (email 4 agli iscritti
  dell'11/9). Caoria, Refavaie, Consèria, Carlettini e Telve non sono piu' sul
  percorso;
- uscita da Rovereto (km 2-8) e Sarche (43-46) su tutti e tre; Sarche→Padergnone
  (48-60) su Medio e Lungo; ritocchi brevi a San Martino (206-214), Calaita,
  Levico, Caldonazzo/Vattaro, Mattarello/Calliano (Corto 191-198).

Il GPX misura 210,2 / 352,2 / 370,1 km (D+ grezzo 2.500 / 6.100 / 6.800): i
numeri ufficiali **restano 216×3.000 / 357×7.100 / 376×7.900** finche' Andrea
non li cambia — lo scarto e' piu' largo di prima (2,7% sul Corto).

Cosa e' stato rigenerato o ritoccato:

- `gpx/` — nuova cartella (vedi Struttura): i 5 file di Andrea copiati
  byte-identici col nome canonico + i due file uniti generati (GPX 1.1, lat/lon/
  ele, punto di giunzione deduplicato sul Medio). **Il repo `trentino-gravel-
  mappe` NON e' stato toccato e resta alla V2.2** (pagine, embed Notion APT, GPX
  pubblici): quando l'app si pubblica, va rigenerato anche quello e alzato il
  `?v=` degli embed;
- `index.html` — `GPX_VER`, `GPX_PARTI`, `gpxNome()`, `gpxUrl()` (file unito,
  URL assoluto perche' Stay22 lo scarica dai suoi server — da localhost non lo
  vede, normale in anteprima) e `gpxFiles()` (le parti per il download);
  `#rv-dl` con due link e attributo `download` (si salva il file invece di
  aprire l'XML); nota «in due file» in testa alle note della descrizione;
- `tracks.js` — rigenerato con `scripts/rigenera_tracce.py --guida` del repo
  mappe **su una copia usa-e-getta** del repo (1.228 / 1.316 / 1.386 punti);
- `poi.js` — `gen_poi.py` con Overpass fresco (cache `_osm_*` cancellate) poi
  `gen_meccanici.py`: 234 / 255 / 276 voci (prima 237 / 230 / 252; Medio e Lungo crescono per i paesi del Tesino sulla variante Brocon). Overpass principale (`overpass-api.de`) e' caduto a meta' lavoro dopo un'ora di 429/504 e non ha piu' risposto: aggiunto `overpass.openstreetmap.fr` in testa ai candidati di entrambi gli script, che ha fatto Medio e Lungo in dieci minuti. Voci `p` riallineate sulla V3.0: SP34
  61,9 e SS43 160,6 sul Corto, SS43 95,9 su Medio e Lungo, venegia 171,9,
  venegiaLungo 204,0; **`conseria` tolta** (8,5 km fuori traccia);
- `content.js` — km nelle note pericolo 62/161 (Corto) e 96 (Medio, Lungo);
  punto piu' alto del Corto km 104; Sarche «al chilometro 45»; testi Medio e
  Lungo con Brocon e Pieve Tesino al posto di Caoria/Cinque Croci (Telve fuori);
  meteo del Medio con Passo Brocon 1.616 m 12°/3° (ERA5, stesso metodo degli
  altri punti); checklist «Studia la traccia definitiva»; scheda `gpsguide`
  riscritta (la definitiva e' nell'app, due file, cosa e' cambiato); etichette
  `gpx1`/`gpx2`/`gpxDue`; pericolo `conseria` rimosso. Tutto in IT e EN;
- `styles.css` — `#rv-dl` (tasti impilati: in fila lasciavano 50 px al titolo);
- `sw.js` → cache v44.

Attenzione al merge: questo branch parte da `cerca-info-live-posizione` (6
commit dell'8/9 mai andati in main, piu' il commit «Pericoli malghe Venegia»
rimasto non committato dall'8/9), mentre `main` ha nel frattempo 4 commit di
Francesco (analytics d'uso #31, repo pubblica, ramo tedesco, feedback→issue)
che qui non ci sono.

## Tracce V2.2 (27 agosto 2026, sera)

Secondo giro dello stesso giorno, con le ultime due modifiche prima del freeze
GPX del 31/8 — dopo questo giro i punti aperti (Pinzolo, Torbole) sono chiusi:

- **Pinzolo, solo Corto (km ~91-96)**: deviazione per la zona in frana nel
  comune di Pinzolo, concordata con la polizia municipale (4,4 km sostituiti
  da 4,6 km);
- **Torbole/Garda, tutti e tre (km ~23,4)**: tratto rivisto (1,2 km sostituiti
  da 0,4 km, −0,8 km su ogni percorso).

Numeri ufficiali **invariati** (216×3.000 / 357×7.100 / 376×7.900): il GPX
misura 214,6 / 356,2 / 374,0 e i D+ non cambiano. Rigenerato/ritoccato:

- `tracks.js` — tutti e tre i percorsi, stessa densità di punti;
- `poi.js` — `gen_poi.py` con download Overpass fresco sui tre corridoi (cache
  `_osm_*` cancellate) poi `gen_meccanici.py`; i km delle 4 voci pericolo `p`
  riallineati a mano sulla V2.2 (SP34 64,8; SS43 163,4 sul Corto e 95,0 su
  Medio e Lungo — slittano di −0,8 per la variante Garda);
- `content.js` — km citati nelle note pericolo (65/163 Corto, 95 Medio e
  Lungo) e km dei punti più alti (Campo Carlo Magno 107, Baita Segantini 196,
  Col Margherita 198); quote e testi descrittivi invariati;
- link GPX (`gpxUrl()` in index.html) → file V2.2 nel repo
  `trentino-gravel-mappe` (V1.8 e V2.0 restano pubblicati);
- `sw.js` → cache v39.

## Tracce V2.0 (27 agosto 2026)

Andrea ha consegnato i GPX aggiornati (esportati da Garmin Desktop App, prima erano
komoot). Il Corto è identico al V1.8 (nessuna deviazione oltre 150 m) e non è stato
toccato; Medio e Lungo cambiano in val di Fiemme fra il km 156 e il km 178 (tre
varianti: sotto Cavalese, fra Panchià e Ziano — ora sull'altra sponda dell'Avisio —
e verso Predazzo), e il Medio cambia anche la salita in zona Bellamonte/Forte Buso.
Numeri ufficiali nuovi comunicati da Andrea: **Medio 357 km × 7.100 D+**,
**Lungo 376 km × 7.900 D+**, Corto invariato 216 × 3.000.

Cosa è stato rigenerato, solo per Medio e Lungo:

- `tracks.js` — coordinate e quote semplificate dai GPX V2.0 (stessa densità di prima,
  scarto massimo reale dal GPX pieno ~30 m);
- `poi.js` — rigenerato con `scripts/gen_poi.py` (download Overpass fresco sui corridoi
  nuovi) e poi `scripts/gen_meccanici.py`, nell'ordine giusto (gen_poi cancella i punti
  `b` dei percorsi passati); i km dei POI ora sono sul GPX V2.0;
- `content.js` — km/D+ ufficiali e km dei punti più alti (Baita Segantini km 197,
  Col Margherita km 199); i testi descrittivi restano validi (verificato: Cavalese,
  Predazzo e il rapporto con Bellamonte non cambiano, Ziano non è mai citato);
- link GPX (`gpxUrl()` in index.html) → file V2.0 nel repo `trentino-gravel-mappe`
  (i V1.8 restano pubblicati per non rompere i link già inviati agli iscritti);
- `sw.js` → cache v37.

Nel repo `trentino-gravel-mappe` sono state rigenerate nello stesso giro tutte le
pagine (map-*, map-tutti, index, percorso-*, embed/*) con le geometrie V2.0 e i
numeri ufficiali nuovi.

## Punti pericolosi sul tracciato (27 agosto 2026)

Richiesta di Andrea — due incroci da massima prudenza, segnati come POI di tipo
`p` e spiegati per esteso al partecipante:

- **SS43 alla Rocchetta** (attraversamento a raso della statale della Val di Non
  per prendere la Strada delle Roste) — ci passano **tutti e tre** i percorsi:
  corto km 164, medio e lungo km 96. Coordinate 46.23142, 11.06999.
- **SP34 fra Sclemo e Seo** (la traccia lascia la provinciale del Lisano e
  Sesena svoltando sullo sterrato) — **solo il corto**, km 66. Coordinate
  46.05914, 10.81599. Manovra verificata sulle geometrie OSM: si arriva sulla
  SP34 e la si lascia imboccando lo sterrato.

Come funziona: le voci `t:"p"` in `poi.js` portano un `pid` che pesca nome e
testo bilingue da `content.js → pericoli` (IT+EN). Nell'app non si filtrano mai
via, hanno priorità nel raggruppamento dei segni (pin rosso `triangle-alert` su
mappa e altimetria), in lista compaiono come riga rossa col testo per esteso
(`poiPericoloHtml`), e nel "davanti a te" del GPS spuntano entro 15 km. Ogni
percorso ha anche la nota ⚠️ nella scheda (`percorsi[].note`, IT+EN).
`gen_poi.py` conserva le voci `p` alla rigenerazione (sono manuali, non OSM) —
ma **se cambia la traccia nel loro tratto, km e coordinate vanno ricontrollati**
(procedura in `docs/generazione-poi.md`). Service worker a v38.

## Tre correzioni d'uso (8 settembre 2026, branch `cerca-info-live-posizione`)

Nascono da tre osservazioni di Andrea sull'uso reale e valgono per **tutte** le
app della serie. Sono nate su `tuscany-trail-app` e portate qui con tre
cherry-pick, un commit per correzione.

1. **Il tasto Cerca si vede** — era una lente grigia fra elementi grigi e chi
   non lo provava non sapeva che dietro c'e' tutta la guida. Ora e' in accento
   (`--lime`, qui il verde) con la parola scritta accanto alla lente; sotto i
   360 px resta la sola lente, colorata. Alla prima apertura un fumetto sotto
   l'intestazione dice a cosa serve, con esempi concreti: si chiude al tocco o
   da solo dopo 7 secondi e non torna piu' (`tg-cerca-visto`, prefisso di
   questa app). Il pallino delle novita' e' passato a rosso, sul tasto colorato
   spariva. Il logo dell'intestazione ora sa restringersi (`flex:0 1 auto` +
   `object-fit:contain`), altrimenti a 375 px il tasto scritto per esteso
   finiva fuori schermo. Testi nuovi: `cercaLabel`, `cercaTip` (IT+EN).

2. **Le schede delle Informazioni tornano chiuse** — lista di titoli, si tocca
   quella che serve; aperte tutte insieme facevano un muro di testo lungo tre
   schermate. Testata come bottone (`div` + `role="button"` + `aria-expanded`,
   Invio e Barra spaziatrice gestite a mano), freccia disegnata in CSS —
   nessuna icona nuova nello sprite. Chi arriva a una scheda dalla ricerca
   globale la trova gia' aperta (`apriInfoCard`). **Qui dentro riguarda anche
   la card "Tutti gli orari"**, che ha la tabella `orari`: adesso e' a un
   tocco. Se durante l'evento si decide che quella deve stare aperta, e' una
   riga sola in `renderInfo()`.

3. **Il Live prende la posizione da solo** — chi apre il Live vuole sapere dove
   si trova, non trovare un pulsante da premere. L'apertura della tab chiede la
   posizione e con lo stesso permesso accende il meteo (che qui gia' viaggiava
   insieme al GPS): al primo fix ci sono gia' chilometro, «davanti a te», mappa
   e tempo dove sei. Tutto passa da `avviaLive(forza)`, che alza il flag
   **prima** di `startGPS()` — che a sua volta chiama `openTab('live')` e
   altrimenti rientrerebbe all'infinito — e parte una volta sola per sessione;
   anche i link `data-gps` e `data-share` passano di li'. Il pulsante resta e
   forza il riavvio (la via per riprovare dopo un rifiuto) e dal primo fix si
   chiama «Aggiorna la posizione» (`aggiornaPos`, IT+EN). Le notifiche e le
   comunicazioni della tab Live restano dove erano, invariate.

Collaudo dell'8/9 in locale a 375 px con posizione simulata sul Corto (km 79):
fumetto, apri/chiudi schede, salto dalla ricerca a una scheda, e Live con km,
«davanti a te» (fontana, Borzago, Mezzosoldo), profilo, mappa e meteo al primo
fix, senza rientri infiniti. Service worker a `tg-guida-v42`.

## Porting alle altre app-evento — cosa portare, da dove

**Sezione storica, superata dal template.** Le app sorelle
(`tuscany-trail-app`, `northcape4000-app`) sono nate copiando questa repo, e
per un periodo ogni miglioria nata qui andava portata a mano nelle altre due.
Quel giro **non si fa più**: da settembre 2026 la fonte di verità del motore è
`advlabbik/event-app-template`, e le migliorie si fanno lì e si portano giù da
lì (vedi `CLAUDE.md`). La lista qui sotto resta come inventario di quello che
questa app ha e che il template potrebbe non avere ancora — serve a chi farà
la migrazione, non a chi vuole copiare da qui.

Da portare (stato al 27/8/2026):

1. **`scripts/gen_poi.py` versione corrente** — collaudo endpoint Overpass,
   controllo risposte troncate (`remark`), ripresa dal parziale, e
   **conservazione delle voci manuali `t:"p"`** alla rigenerazione.
2. **`scripts/gen_meccanici.py`** — POI meccanici tipo `b` (il backport era
   già segnato il 15/8, resta da fare).
3. **Supporto tipo `p` (punti pericolosi)** in index.html + styles.css —
   `poiMatch` (mai filtrati), `ordinePoi` (priorità), `poiPericoloHtml`,
   `pericoloDi`, rami `p` in `rvNome`/`rvVoce`, avviso in `aheadHtml` (15 km),
   CSS `t-p` e `.kmgrp.pericolo` — più il dizionario `pericoli` in content.js
   (IT+EN) e le voci manuali in poi.js.
4. **`docs/generazione-poi.md`** aggiornata (trappole + sezione tipo `p`).
5. **Le tre correzioni d'uso dell'8/9/2026** (sezione qui sopra) — **fatte su
   tutte e tre le app** l'8/9, ognuna sul branch `cerca-info-live-posizione`,
   nessuna ancora mergiata. Da rifare solo su un'app nuova. Le trappole gia'
   incontrate, per quando si clona: il prefisso localStorage dell'app nel flag
   del fumetto (`tg-`, `tt-`, `nc-`), l'intestazione a 360/375 px col logo
   dell'evento, e le `.icard` senza `.head` — in `northcape4000-app` sono
   l'intro e la chiusa del Rientro, che vanno marcate `open` o il CSS
   `.icard .body{display:none}` le fa sparire.
6. Le regole di dato che valgono ovunque — km/D+ ufficiali MAI dal GPX
   (stanno in `content.js`), ancore POI per i km sulla traccia semplificata,
   bump della cache in `sw.js` a ogni modifica dei dati.

Per le tracce delle mappe pubbliche il pezzo gemello sta nel repo
`trentino-gravel-mappe` — `scripts/rigenera_tracce.py` + README con la
procedura completa di aggiornamento GPX (pagine, embed Notion, ordine dei
passi). Nota per Tuscany Trail: le tracce NON si pubblicano prima dell'evento
(regola di Andrea), l'app le mostra "in arrivo" — il flusso GPX là passa da
`scripts/gen_tracks.py` del suo repo.

### Nuovo evento da zero (es. The Grand Escape Germania) — cosa serve in mano

**Un'app nuova non nasce più da qui.** Nasce da `advlabbik/event-app-template`
con **Use this template** su GitHub, e la procedura è nel Wiki (link in
`PROCEDURA.md` di quella repo). `tuscany-trail-app` e `northcape4000-app` sono
state clonate da questa prima che il template esistesse, ed è il motivo per cui
il template esiste. Resta valido l'elenco di cosa serve avere in mano prima di
cominciare, diviso per chi lo decide:

**Decisioni (Andrea)**
- nome evento, date, luogo di partenza/arrivo con indirizzo esatto
- percorsi: quanti, nomi, **km e D+ ufficiali** (mai calcolati dal GPX), livelli
- tracce pubbliche subito o "in arrivo" fino all'evento (stile Tuscany Trail)
- lingue dell'app (questa è IT+EN; una terza lingua è lavoro nuovo, non un flag)
- eventuali punti pericolosi (coordinate + cosa succede lì, tipo `p`)

**Materiali (Andrea / Alessio / Francesca)**
- GPX a piena risoluzione con le quote, un file per percorso (GPX 1.1, trkpt)
- palette e colori percorsi, logo, foto percorsi, icone PWA
- testi: descrizioni (3 paragrafi + fondo + note ⚠️ per percorso), info-card
  logistiche, checklist pre-evento, contenuti delle fasi prima/durante/dopo,
  eventi cross-sell con UTM

**Configurazione (Francesco)**
- repo nuovo nell'org advlabbik + GitHub Pages (+ eventuale sottodominio)
- riga evento nel progetto Supabase condiviso `guide-eventi` (push/feedback,
  schema multi-evento con `evento_id` dal 24/8/2026) e `config.js`
- campagna Stay22 dedicata sull'account `adventurelabsrl` + località centro mappa
- località meteo lungo il percorso (nome, lat/lng, quota) e giorni evento —
  le medie storiche si ricalcolano con la procedura ERA5 descritta sopra
- codice gate partecipanti e codice staff, link live tracking WHIP se c'è

Con questi input il resto è meccanico e documentato: POI da OSM con
`gen_poi.py`/`gen_meccanici.py` (funziona ovunque Overpass copra, Germania
inclusa — il collaudo endpoint è nello script), punti pericolosi manuali,
mappe pubbliche col gemello `trentino-gravel-mappe` se servono embed per i
territori. L'ordine giusto dei passi e le trappole già pagate stanno in
`docs/generazione-poi.md` e nei README dei due repo.

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
- **Notifiche push accese** con `NOTIFICHE_ATTIVE = true` in `index.html` (27/8/2026, erano
  spente dal 13/08). Si rispengono cambiando quella riga e ripubblicando: il resto
  dell'impianto resta integro in ogni caso.
- **Airbnb non si mette.** O compare dentro la mappa Stay22 accanto a Booking, oppure niente:
  i link esterni sono stati scartati (motivazione tecnica completa nella PR #9 chiusa).

### In sospeso, con la dipendenza che li blocca
| Cosa | Chi sblocca |
|---|---|
| Analytics (Umami, piano gratuito) | Andrea, crea l'account su cloud.umami.is e passa il Website ID |
| Link della diretta WHIP, contatti taxi, orari definitivi del pacco | informazioni non ancora disponibili |

### Trappole note
- Chi ha già salvato l'app in home **non vede la nuova icona**: i telefoni la congelano al
  salvataggio, va rimossa e risalvata.
- **Le iscrizioni alle notifiche sono legate all'origine, e nessun redirect le porta dietro.**
  Per questo il sottodominio è arrivato prima dell'accensione, il 27/8/2026: quelle raccolte
  su `advlabbik.github.io` sarebbero morte al trasloco, e non c'è modo di avvisare chi le
  aveva attivate — il canale per avvisarli è proprio quello. Se un giorno l'app cambia di
  nuovo indirizzo, vale ancora: si sposta prima, si invita dopo. Al cambio le iscrizioni
  erano zero, quindi non si è perso niente.
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

## Conteggio meccanici nei fumetti e filtro passato per parametro (20 agosto 2026)

`contiDet()`, cioe' i conteggi che finiscono nel fumetto di mappa e altimetria
per i paesi, **non conosceva `nb`**: Trento, che a DB ha 12 negozi di bici,
mostrava solo mangiare, alloggi e fontane e sembrava non averne nessuno. Ora i
meccanici ci sono, e col filtro acceso i fumetti mostrano **solo il conteggio di
quel tipo** (con Meccanico selezionato quattro numeri su quattro tipi erano
rumore), col Prenota che resta solo su Tutto e Dormire, come nella lista.

Nello stesso giro il filtro ha smesso di essere indovinato dalla variabile
globale `rvFilter`: ora si passa per parametro lungo `poiSuMappa` → `rvPopup` →
`rvVoce` → `contiDet` e `gruppoLabel` → `rvPinLabel`. Serviva perche' la mappa
del Live usa sempre `tutti` e prima si sarebbe presa il filtro lasciato acceso
nella vista percorso.

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
Quote e chilometri dei punti piu' alti vengono dai GPX V3.0 (`Campo Carlo Magno
1.682 m` al km 104 sul Corto, `Baita Segantini 2.173 m` al km 196 sul Medio,
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
- **Push accese dal 27/8/2026, e il 31/10 sono lo strumento** — la notifica "Prima Fila" ai 500 è il canale a costo zero sulla coorte più calda della serie, e arriva solo a chi si è iscritto: le settimane fino al 26/9, con l'app in mano ai partecipanti, sono la finestra in cui quella lista si costruisce.
- **Qui nasce il motore card social** — canvas on-device + Web Share API (già usata per la posizione), primo uso l'attestato Pioneer condivisibile. Zero backend; il motore si riusa su tuscany-trail-app e northcape4000-app.
- **Segnalazioni percorso, stadio 1** — bottone nella Live che apre WhatsApp precompilato con km e percorso allegati in automatico (arriva in Slack via 2Chat). Il form strutturato su Supabase è lo stadio 2, previsto sul Tuscany Trail 2027. Resta separato dall'assistenza personale (112, taxi, meccanici).
- **Niente timbri in-app per l'edizione zero** — al TG debutta il passaporto fisico BAS e la survey aveva già rimandato l'idea all'area personale 2027.
- **Analytics Umami sulle 3 app** appena c'è l'account — prerequisito per vendere qualsiasi visibilità in-app.
