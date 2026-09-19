// Contenuti della guida in due lingue — CONTENT.it e CONTENT.en.
// L'italiano comanda. Ogni modifica ai testi va fatta in TUTTE E DUE le lingue.
//
// REGOLE EDITORIALI (decisioni di Andrea)
// 1. Mai i due punti ":" nella prosa, in nessuna lingua (ok solo negli orari tipo 17:00).
// 2. Qui c'è SOLO quello che è stato comunicato ai partecipanti. Niente
//    informazioni non decise, niente segnaposto visibili.
// 3. La sezione `ui` contiene le scritte dell'interfaccia (bottoni, messaggi,
//    etichette). Le etichette dei servizi POI (`poiSub`) traducono i dati.
window.CONTENT = {

// ============================================================ ITALIANO
it: {

meta: {
  titolo: "Trentino Gravel",
  sottotitolo: "Pioneer Edition · 26 settembre 2026",
  hub: "Manifattura Tabacchi, Rovereto",
  hubMaps: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto",
  partenza: "Sabato 26 settembre, ore 7:30",
  dataPartenza: "2026-09-26T07:30:00",
  fasi: { prima: "2026-09-24", durante: "2026-09-25", dopo: "2026-10-01" }
},

intro: {
  titolo: "Benvenuto, pioniere.",
  testo: "Sei uno dei 500. La Pioneer Edition è la prima volta del Trentino Gravel e quello che costruiamo quest'anno — insieme a te — diventa la storia dell'evento. Nessuna classifica, nessun cronometro. Bikepacking in autonomia, al tuo ritmo, dentro uno dei territori più belli delle Alpi. Questa guida è il tuo punto di riferimento unico prima, durante e dopo l'evento."
},

/* Il box in evidenza tiene solo le cose che scadono. L'avviso sulle tracce
   preliminari e' uscito il 23/8 (vive gia' come card nelle Info). Quello sulla
   taglia della t-shirt e' uscito il 27/8, scaduto il giorno prima (Andrea).
   Resta il certificato, finche' non scade il 27. */
avvisi: [
  { testo: "Hai tempo fino al 27 agosto per caricare il certificato medico nella tua area personale su bikeadventureseries.com." }
],

checklist: [
  { id: "certificato", testo: "1. Carica il certificato medico entro il 27 agosto",
    dettaglio: "Agonistico per il ciclismo, in corso di validità. Vai nella tua area personale, apri la sezione Certificati e carica il file.",
    url: "https://www.bikeadventureseries.com/my-account/", cta: "Vai all'area personale" },
  { id: "studia", testo: "2. Studia la traccia definitiva",
    dettaglio: "Guardala sulla mappa con l'altimetria, pianifica le tappe e scaricala sul GPS dal tasto GPX. Il Medio e il Lungo arrivano in due file, caricali entrambi.",
    tab: "percorso" },
  { id: "prima-notte", testo: "3. Prenota almeno la prima notte a Rovereto",
    dettaglio: "Venerdì 25 settembre sarete in 500 nella stessa città, la stessa notte. Le altre notti, se preferisci, prenotale già ora dalla mappa lungo il percorso.",
    tab: "dormire" },
  { id: "treno", testo: "4. Organizza il viaggio",
    dettaglio: "Il treno è tuo amico. Rovereto è sulla linea del Brennero e la stazione è a pochi minuti dalla partenza.",
    tab: "info" }
],

/* Sotto la checklist, senza casella da spuntare: il forum non e' un compito da
   completare ma un posto dove tornare. Punta al post "Bici e logistica" e non
   piu' alla home della community (Andrea, 20/8), cosi' chi arriva dall'app
   atterra sulla risposta invece che sul flusso. Poi un evento BAS pescato a
   caso fra i quattro (uno solo per volta — il catalogo intero diluisce). Il
   rimando all'articolo del Journal e' stato tolto lo stesso giorno. Gli url
   degli eventi hanno gli UTM, cosi' quando arriveranno le analytics si vedra'
   quale card tira di piu'. */
extraHome: {
  forum: { titolo: "Hai dubbi? Chiedi sul forum BAS",
    testo: "Per domande su preparazione, bici e materiali c'è la community. Lo staff e gli altri partecipanti rispondono lì.",
    url: "https://www.bikeadventureseries.com/community/space/trentino-gravel-introduce-yourself/post/bici-e-logistica-bike-and-logistics", cta: "Vai al forum" },
  altriEventi: [
    { id: "tuscany-trail", titolo: "Cerchi un'altra avventura bikepacking per la tua gravel?",
      testo: "Scopri il più grande evento bikepacking al mondo.",
      url: "https://www.tuscanytrail.it/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=tuscany-trail", cta: "Vai" },
    { id: "unpaved-roads", titolo: "Voglia di gravel?",
      testo: "Scopri il fine settimana di gravel più amato d'Italia.",
      url: "https://www.unpavedroads.cc/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=unpaved-roads", cta: "Vai" },
    { id: "grand-escape", titolo: "Cerchi una fuga dalla quotidianità?",
      testo: "Scopri il bikepacking con un percorso totalmente su asfalto e piste ciclabili.",
      url: "https://www.thegrandescape.cc/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=grand-escape", cta: "Vai" },
    { id: "northcape4000", titolo: "Raggiungi la fine del mondo",
      testo: "Scopri l'evento che ti porta a Capo Nord dopo 4.000 km su traccia fissa.",
      url: "https://northcape4000.com/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=northcape4000", cta: "Vai" }
  ]
},

percorsi: [
  { id: "corto", nome: "Percorso Corto", breve: "Corto", colore: "#5ea345", km: 210, dplus: "3.000",
    livello: "Accessibile",
    desc: "Il percorso per chi vuole l'avventura senza l'estremo. Si stacca dagli altri due a Sarche e chiude l'anello a Rovereto.",
    note: ["Circa il 70% su ciclabili e sterrato",
      "⚠️ Due punti da massima prudenza — al km 62 la svolta sulla SP34 fra Sclemo e Seo, al km 161 l'attraversamento della SS43 alla Rocchetta. Li trovi segnati sulla mappa e sull'altimetria del percorso"],
    alto: { nome: "Passo Campo Carlo Magno", quota: "1.682 m", km: 104 },
    descLunga: [
      "Un anello che parte in fondovalle, sale una volta sola e torna a casa lungo i fiumi. Dai primi chilometri vai verso il lago — Mori, Loppio, Nago e la discesa su Torbole con il Garda davanti — poi risali la valle del Sarca fino ad Arco, attraversi le Marocche di Dro e arrivi a Sarche, dove il Corto si stacca dagli altri due.",
      "Da lì il percorso punta nelle Giudicarie, passa da Stenico e risale la val Rendena fino a Pinzolo e Madonna di Campiglio, con le Dolomiti di Brenta sempre di fianco. Il punto più alto è il passo di Campo Carlo Magno, 1.682 metri, intorno al chilometro 104. Da lassù in avanti è quasi tutta discesa e pianura — val di Sole, Malé, la val di Non fra i meleti, Mezzolombardo, Trento e la ciclabile dell'Adige che ti riporta a Rovereto.",
      "Il dislivello sta quasi tutto nella prima metà. Fino a Sarche, al chilometro 45, hai salito pochissimo; il grosso arriva nei sessanta chilometri fra Sarche e Campo Carlo Magno, circa due terzi del totale, in una salita lunga e regolare più che ripida. Negli ultimi cento chilometri resta meno di un sesto del dislivello complessivo."
    ],
    fondo: "Circa il 70% fra ciclabili asfaltate e sterrato, il resto su strade aperte al traffico. Lo sterrato si concentra fra le Giudicarie e la val Rendena; il rientro da Trento a Rovereto è tutto sulla ciclabile asfaltata della valle dell'Adige. Nessun tratto da fare a spinta.",
    meteo: [
      { luogo: "Rovereto", quota: "170 m", max: "22°", min: "13°" },
      { luogo: "Cles, val di Non", quota: "650 m", max: "19°", min: "10°" },
      { luogo: "Madonna di Campiglio", quota: "1.520 m", max: "13°", min: "4°" },
      { luogo: "Campo Carlo Magno", quota: "1.682 m", max: "12°", min: "2°" }
    ],
    meteoNota: "In quattro anni, negli stessi giorni, a Campo Carlo Magno si sono misurati sia 21 gradi di giorno sia 8 sotto zero di notte. Mettiti in borsa di che coprirti anche se parti in maniche corte." },
  { id: "medio", nome: "Percorso Medio", breve: "Medio", colore: "#3d7a2e", km: 353, dplus: "6.740",
    livello: "Intermedio",
    desc: "Identico al Lungo per quasi tutto il tracciato, con una differenza sola — evita la Val di Fassa e il tratto a spinta del Col Margherita.",
    note: ["Pensato per chi vuole la distanza senza il tratto a spinta del Col Margherita",
      "⚠️ Al km 96 si attraversa a raso la SS43 della Val di Non, veloce e trafficata — piede a terra e massima prudenza. Il punto è segnato sulla mappa e sull'altimetria del percorso"],
    alto: { nome: "Baita Segantini, sopra il passo Rolle", quota: "2.173 m", km: 196 },
    descLunga: [
      "Il giro grande del Trentino, senza il tratto a spinta. Fino a Sarche è uguale al Corto — lago, valle del Sarca, Marocche — poi sale verso il Brenta a Molveno e Andalo, scende sulla Rotaliana a Mezzocorona e risale la Strada del Vino fra Salorno, Egna e Montagna.",
      "Dalla val di Fiemme, superate Cavalese e Predazzo, comincia la parte alta del percorso — Bellamonte, il passo Rolle e la salita fino alla Baita Segantini, 2.173 metri, il punto più alto del Medio, con le Pale di San Martino davanti. Si scende a San Martino di Castrozza e poi a Canal San Bovo, da dove si sale al passo Brocon, 1.616 metri, e si scende su Pieve Tesino verso la Valsugana.",
      "L'ultima parte è la Valsugana — Borgo, Levico e i laghi — con una gobba finale verso Vattaro prima di rientrare a Rovereto per Mattarello e Calliano. Il dislivello arriva a ondate, non tutto insieme — il Brenta, la lunga salita al Rolle, il Brocon e l'ultimo strappo prima di casa. A metà percorso, al chilometro 200, ne hai fatti circa due terzi."
    ],
    fondo: "Fondovalle su ciclabili asfaltate — Rotaliana, Strada del Vino, val di Fiemme e Valsugana — e sterrato nelle salite e nei traversi in quota. Nessun tratto da fare a spinta, ed è esattamente il motivo per cui il Medio esiste.",
    meteo: [
      { luogo: "Rovereto", quota: "170 m", max: "22°", min: "13°" },
      { luogo: "Cavalese, val di Fiemme", quota: "1.000 m", max: "17°", min: "8°" },
      { luogo: "Passo Rolle", quota: "1.984 m", max: "11°", min: "2°" },
      { luogo: "Baita Segantini", quota: "2.173 m", max: "9°", min: "0°" },
      { luogo: "Passo Brocon", quota: "1.616 m", max: "12°", min: "3°" },
      { luogo: "Borgo Valsugana", quota: "385 m", max: "21°", min: "12°" }
    ],
    meteoNota: "Fra il fondovalle e i 2.000 metri ballano dodici gradi di giorno e altrettanti di notte. Alla Baita Segantini, negli ultimi quattro anni, la notte più fredda del periodo è arrivata a 6 sotto zero." },
  { id: "lungo", nome: "Percorso Lungo", breve: "Lungo", colore: "#1f4d1a", km: 371, dplus: "7.400",
    livello: "Impegnativo",
    desc: "Rispetto al Medio affronta la Val di Fassa e sale al Passo San Pellegrino su sterrato, per poi continuare a salire sul Col Margherita.",
    note: ["⚠️ Sul Col Margherita ci sono circa 2,5 km che farai per il 70% a spinta, per via delle pendenze. Quando lo abbiamo provato ci abbiamo messo circa 50 minuti. È dura, ma in vetta la vista a 300 gradi sulle Dolomiti ripaga la fatica",
      "⚠️ Al km 96 si attraversa a raso la SS43 della Val di Non, veloce e trafficata — piede a terra e massima prudenza. Il punto è segnato sulla mappa e sull'altimetria del percorso"],
    alto: { nome: "Col Margherita", quota: "2.337 m", km: 198 },
    descLunga: [
      "Il percorso più duro dei tre, e l'unico che entra in val di Fassa. Fino a Predazzo ricalca il Medio — lago, Marocche, Brenta a Molveno e Andalo, Rotaliana, Strada del Vino e val di Fiemme — poi invece di puntare a Bellamonte prosegue su Moena e sale al passo San Pellegrino su sterrato.",
      "Dal passo si continua a salire fino al Col Margherita, 2.337 metri, il punto più alto di tutto il Trentino Gravel, raggiunto intorno al chilometro 198. Lì stanno i 2,5 chilometri che si fanno per la maggior parte spingendo la bici, ripagati da una vista a 300 gradi sulle Dolomiti. Si scende verso Falcade e il passo Valles, si risale al passo Rolle e alla Baita Segantini e si arriva a San Martino di Castrozza.",
      "Da San Martino in poi è identico al Medio — Canal San Bovo, il passo Brocon e la discesa su Pieve Tesino, la Valsugana con Borgo, Levico e i laghi, e il rientro su Rovereto per Vattaro e Mattarello. Nei cinquanta chilometri fra Moena e San Martino si concentra la parte più alta e più lenta del viaggio, con tre valichi sopra i 1.900 metri uno dietro l'altro."
    ],
    fondo: "Come il Medio nei fondovalle, con in più la salita al passo San Pellegrino su sterrato e i 2,5 chilometri del Col Margherita, che farai per il 70% a piedi spingendo la bici. Quando lo abbiamo provato ci abbiamo messo circa 50 minuti.",
    meteo: [
      { luogo: "Rovereto", quota: "170 m", max: "22°", min: "13°" },
      { luogo: "Cavalese, val di Fiemme", quota: "1.000 m", max: "17°", min: "8°" },
      { luogo: "Passo San Pellegrino", quota: "1.918 m", max: "11°", min: "1°" },
      { luogo: "Col Margherita", quota: "2.337 m", max: "8°", min: "-1°" },
      { luogo: "Passo Rolle", quota: "1.984 m", max: "11°", min: "2°" },
      { luogo: "Borgo Valsugana", quota: "385 m", max: "21°", min: "12°" }
    ],
    meteoNota: "Sul Col Margherita la media delle minime di fine settembre è sotto zero, e negli ultimi quattro anni la giornata più fredda non ha superato i 4 gradi. Ci arrivi bagnato di sudore dopo aver spinto la bici — guanti, giacca e qualcosa di asciutto non sono un extra." }
],

/* Punti del tracciato da affrontare con la massima prudenza. Le voci t:"p" di
   poi.js portano un pid che pesca qui nome e testo, così la spiegazione vive in
   un posto solo ed è bilingue. */
pericoli: {
  venegia: { nome: "Da Predazzo alla Val Venegia senza cibo",
    testo: "Predazzo è l'ultimo posto dove fare scorta prima della salita più lunga del percorso. Da qui a Baita Segantini sono 24,7 km con 1.320 metri di dislivello, sempre in salita, e Capanna Cervino arriva solo al km 197. Le due malghe della Val Venegia, che sulla carta stanno a metà strada, quest'anno non ci sono — Malga Venegiota è chiusa da fine agosto per lavori di ristrutturazione e Malga Venegia chiude domenica 27 settembre. Acqua ne trovi, le fontane lungo il Travignolo e le Sorgenti al km 193 ci sono sempre. Quello che manca è il cibo. Riempi le tasche prima di lasciare il paese." },
  venegiaLungo: { nome: "In Val Venegia le due malghe sono chiuse",
    testo: "Passo Valles e Malga Vallazza sono gli ultimi posti dove mangiare prima di Passo Rolle. Le due malghe della Val Venegia, che sulla carta stanno più avanti, quest'anno non ci sono — Malga Venegiota è chiusa da fine agosto per lavori di ristrutturazione e Malga Venegia chiude domenica 27 settembre. Da Malga Vallazza a Baita Segantini restano 10,2 km con 520 metri di dislivello, e poi c'è Capanna Cervino. Acqua ne trovi lungo tutta la valle, le Sorgenti del Travignolo non si fermano mai. Il cibo no." },
  ss43: { nome: "Attraversamento della SS43",
    testo: "Alla Rocchetta la traccia attraversa a raso la statale della Val di Non, veloce e molto trafficata. Si passa dritti, per andare a prendere la Strada delle Roste che corre tranquilla lungo il Noce — è il motivo per cui questo attraversamento esiste. Rallenta per tempo, fermati col piede a terra prima dell'asfalto e guarda bene nei due sensi. Si attraversa solo a strada libera, in un colpo solo e con la massima prudenza." },
  sp34: { nome: "Svolta sulla SP34",
    testo: "Fra Sclemo e Seo, nel comune di Stenico, la traccia lascia la provinciale del Lisano e Sesena imboccando lo sterrato. Prendi la svolta con calma — rallenta per tempo, segnala con il braccio se hai qualcuno dietro e aspetta che la strada sia libera nei due sensi prima di uscire dall'asfalto. Massima attenzione." }
},

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

/* Live tracking WHIP. L'embed e' lo stesso usato sulla home di northcape4000.com
   (iframe verso www.whip.live/event-tracking/<CODICE>, nessun X-Frame-Options).
   Stringa vuota = la card resta ma al posto della mappa mostra il testo `attesa`
   di live.whip ("qui arriverà la mappa del live tracking"). Quando WHIP consegna
   il codice del Trentino Gravel si scrive qui l'url completo, in tutte e due le
   lingue, e la mappa compare da sola. Verificato il 19/8 sull'evento NC4R26 che
   whip.live si lascia incorporare (niente X-Frame-Options ne' frame-ancestors). */
whipUrl: "",

/* La scheda del QR personale del ritiro pacco: il motore la mette PRIMA di
   tutte le infoCards, in tutte le fasi. In `numero` il | sta al posto del
   pettorale. `vuoto` e' la riga che legge chi il QR non ce l'ha, in fila al
   banco. L'id `qr` nelle infoCards e' riservato a questa scheda.
   ✱ `vuoto` da confermare quando il link ?qr= sara' nell'email del ritiro
   pacco (Brevo, Francesco): finche' l'email porta solo l'immagine, il modo per
   averlo nell'app e' incollare il codice. */
qr: {
  titolo: "Il tuo QR per il ritiro pacco",
  numero: "Pettorale |",
  testo: "Mostralo al banco del ritiro pacco, venerdì 25 settembre dalle 16 alle 18 a Progetto Manifattura. Funziona anche senza connessione, e se lo scanner non lo legge basta dire il numero.",
  vuoto: "Il tuo QR è nell'email del ritiro pacco. Apri da lì il link che porta alla guida, oppure incolla qui sotto il codice, e comparirà qui, salvato sul telefono. Se non trovi l'email, al banco basta il tuo nome.",
  daLink: "Questo QR è arrivato da un link. Il tuo resta salvato e torna alla prossima apertura.",
  mio: "Questo è il mio QR"
},
infoCards: [
  /* Gli orari definitivi sono arrivati il 27/8 e stanno in una card sola, la
     prima, con la tabella oraria nel campo `orari` invece che dentro la prosa.
     Le card pacco, partenza e arrivo ripetono la loro riga a parole, cosi' chi
     cerca "briefing" o "partenza" trova la risposta dove la cerca. Se un orario
     cambia, va cambiato QUI e nelle tre card, in tutte e due le lingue. */
  { id: "orari", tema: "Gli orari", icona: "⏱️", titolo: "Tutti gli orari",
    corpo: "Questi sono gli orari definitivi. Succede tutto a Progetto Manifattura, a Rovereto — il ritiro del pacco, il briefing, la partenza e l'accoglienza all'arrivo.",
    orari: [
      { giorno: "Venerdì 25 settembre", voci: [
        { ora: "16:00–18:00", cosa: "Ritiro del pacco evento" },
        { ora: "18:00–19:00", cosa: "Briefing" } ] },
      { giorno: "Sabato 26 settembre", voci: [
        { ora: "7:15", cosa: "Ritrovo sul viale" },
        { ora: "7:30", cosa: "Si parte" } ] },
      { giorno: "Gli arrivi, da domenica a mercoledì", voci: [
        { ora: "14:00–19:00", cosa: "Domenica 27 settembre" },
        { ora: "10:00–19:00", cosa: "Da lunedì 28 a mercoledì 30 settembre" } ] }
    ],
    link: { testo: "Apri in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "orari orario programma tabella quando ritiro pacco briefing partenza ritrovo viale arrivo arrivi accoglienza venerdi sabato domenica lunedi martedi mercoledi 25 26 27 28 29 30 settembre" },
  { id: "certificato", tema: "Prima di partire", icona: "🩺", titolo: "Certificato medico entro il 27 agosto",
    corpo: "Per partecipare è obbligatorio il certificato medico agonistico per il ciclismo, in corso di validità. Hai tempo fino al 27 agosto per caricarlo nella tua area personale su bikeadventureseries.com, nella sezione Certificati.",
    link: { testo: "Vai all'area personale", url: "https://www.bikeadventureseries.com/my-account/" },
    cerca: "certificato medico agonistico ciclismo obbligatorio caricare scadenza 27 agosto visita area personale" },
  { id: "gpsguide", tema: "Prima di partire", icona: "🛰️", titolo: "La traccia definitiva è qui, ed è quella da caricare sul GPS",
    corpo: "Le tracce che vedi in questa app sono quelle definitive e sono le stesse da caricare sul GPS. Le scarichi dal tasto GPX in alto nella mappa di ogni percorso. Il Medio e il Lungo arrivano in due file, prima e seconda parte, perché molti GPS non caricano una traccia sopra i 10.000 punti — caricali entrambi e passa al secondo quando il primo finisce, a Predazzo. Rispetto alla traccia preliminare cambia soprattutto il tratto dopo Canal San Bovo, che ora passa dal passo Brocon e da Pieve Tesino invece che dal Cinque Croci, chiuso per lavori. Ci sono poi ritocchi brevi in più punti, quindi butta via le versioni vecchie.",
    cerca: "gps traccia caricare navigazione definitiva preliminare gpx due file parte brocon cinque croci" },
  { id: "pacco", tema: "Prima di partire", icona: "🎒", titolo: "Consegna pacco evento",
    corpo: "Il ritiro del pacco evento è venerdì 25 settembre dalle 16:00 alle 18:00, a Progetto Manifattura di Rovereto. Subito dopo, dalle 18:00 alle 19:00, c'è il briefing nello stesso posto.",
    cerca: "pacco evento ritiro consegna briefing venerdi 25 orario" },
  { id: "cambio", tema: "Prima di partire", icona: "🔁", titolo: "Cambiare percorso",
    corpo: "Puoi cambiare idea sul percorso in qualsiasi momento, senza bisogno di comunicarcelo. Ti vedremo dall'app di live tracking.",
    cerca: "cambiare percorso cambio scelta corto medio lungo idea" },
  { id: "luogo", tema: "Arrivare a Rovereto", icona: "📍", titolo: "Un luogo solo per tutto",
    corpo: "Consegna del pacco evento, partenza, arrivo e consegna del pacco arrivo sono tutti a Manifattura Tabacchi di Rovereto. Tocca il bottone, si apre Google Maps e lo metti sul navigatore.",
    link: { testo: "Apri in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "sede indirizzo manifattura tabacchi rovereto dove partenza arrivo luogo mappa navigatore google" },
  { id: "partenza", tema: "Arrivare a Rovereto", icona: "🚵", titolo: "Partenza",
    corpo: "Sabato 26 settembre il ritrovo è alle 7:15 sul viale, davanti a Progetto Manifattura. Si parte alle 7:30.",
    cerca: "partenza orario sabato 26 quando si parte mattina ritrovo viale" },
  { id: "treno", tema: "Arrivare a Rovereto", icona: "🚆", titolo: "Arrivare in treno (consigliato)",
    corpo: "Rovereto è sulla linea del Brennero, con treni diretti da Verona, Trento e Bolzano e collegamenti comodi da Milano, Bologna, Monaco e Innsbruck. La stazione è a pochi minuti in bici da Manifattura Tabacchi. Con la bici già montata e nessun parcheggio da cercare è la soluzione più semplice.",
    cerca: "treno stazione brennero arrivare come si arriva verona trento bolzano milano" },
  { id: "auto", tema: "Arrivare a Rovereto", icona: "🚗", titolo: "Arrivare in auto e parcheggi",
    corpo: "Per la sosta lunga di più giorni usa i parcheggi comunali a pagamento di Rovereto, in particolare le aree Mart e Follone, a pochi minuti dalla sede. Non lasciare l'auto nei piazzali di Manifattura.",
    link: { testo: "Mappa parcheggi Rovereto (PDF)", url: "https://smr.tn.it/wp-content/uploads/2023/06/Mappa-parcheggi-organizzati-e-struttura.pdf" },
    cerca: "auto parcheggio parcheggi macchina dove lascio sosta mart follone mappa" },
  { id: "colmargherita", tema: "Sul percorso", icona: "⛰️", titolo: "Col Margherita (solo Lungo)",
    corpo: "Il percorso Lungo affronta la Val di Fassa e sale al Passo San Pellegrino su sterrato, per poi continuare a salire sul Col Margherita. Lì ci sono circa 2,5 km che farai per il 70% a spinta, per via delle pendenze della strada. Quando lo abbiamo provato ci abbiamo messo circa 50 minuti. È un tratto duro, ma una volta in vetta la vista a 300 gradi sulle Dolomiti ripaga la fatica. Se preferisci evitarlo, il percorso Medio esiste esattamente per questo.",
    cerca: "col margherita spinta piedi tratto tecnico camminare lungo san pellegrino fassa" },
  { id: "sicurezza", tema: "Sul percorso", icona: "🛡️", titolo: "Le regole d'oro della sicurezza",
    corpo: "Non è una gara, non prendere rischi inutili. Le strade sono aperte al traffico e vale il Codice della Strada. Non si pedala col buio, e se la sera ti coglie comunque fuori usa luci potenti e fermati alla prima occasione. Non pedalare se sei troppo stanco, cerca di non restare mai da solo e aiuta chi è in difficoltà. Se un tratto ti sembra pericoloso scendi e cammina.",
    cerca: "sicurezza regole codice strada notte traffico prudenza stanchezza aiuto" },
  { id: "dotazione", tema: "Sul percorso", icona: "🦺", titolo: "Cosa portare con te",
    corpo: "Luci e campanello li chiede il Codice della Strada, e il casco tienilo sempre allacciato. Per i tratti al buio servono gilet o elementi catarifrangenti. Porta un power bank per GPS e telefono e un kit riparazione — e impara a usarlo prima di partire.",
    cerca: "materiale casco luci gilet catarifrangente campanello equipaggiamento cosa portare kit riparazione" },
  { id: "acqua", tema: "Sul percorso", icona: "⛲", titolo: "Acqua e rifornimenti",
    corpo: "Fontane e punti di rifornimento sono frequenti nei paesi attraversati. L'elenco completo per chilometro è nella sezione Percorso. Nei tratti in quota riparti sempre con le borracce piene.",
    cerca: "acqua fontane ristoro rifornimento mangiare negozi borracce" },
  /* Riscritta il 23/8 sul testo dell'email ai partecipanti: la vecchia versione
     diceva solo "porta strati caldi e luci", che e' un consiglio di valigia. Qui
     serve che la decisione di fermarsi resti in capo a chi pedala. */
  { id: "meteo", tema: "Sul percorso", icona: "🌦️", titolo: "La montagna a fine settembre",
    corpo: "Il Trentino Gravel si pedala anche in alta quota e a fine settembre il tempo lassù cambia in fretta. Può essere estate a valle e inverno in cresta nello stesso pomeriggio, con il buio che arriva poco dopo le 19. Ci sono tratti, pochi ma ci sono, dove non incontri nessuno per parecchi chilometri e dove il telefono prende male.\n\nDue cose ti chiediamo di prendere sul serio.\n\nNon si pedala col buio. Costruisci le tue giornate in modo da essere fermo prima del tramonto, anche quando questo vuol dire arrivare un giorno dopo.\n\nIl meteo lo valuti tu, ogni giorno e mentre sei in strada. Se le condizioni non lo permettono ti fermi, aspetti e riparti quando migliora. Nessuno ti sta cronometrando e non esiste una ragione al mondo per stare su un passo esposto mentre arriva un temporale.\n\nPorta con te roba per il freddo e per la pioggia anche se parti con il sole. Guarda le previsioni ogni sera per il giorno dopo, le trovi nella sezione Live insieme all'orario del tramonto. Tieni sempre presente dove puoi fermarti e da dove puoi scendere a valle se la giornata gira male.\n\nLe decisioni sul percorso sono tue e la tua sicurezza dipende da come le prendi.",
    cerca: "meteo freddo pioggia abbigliamento cosa porto luci quota temperatura buio tramonto temporale montagna alta quota autonomia sicurezza fermarsi previsioni notte" },
  { id: "animali", tema: "Sul percorso", icona: "🐄", titolo: "Animali al pascolo",
    corpo: "Nei tratti in quota puoi incontrare mucche e greggi al pascolo, a volte con cani da guardiania. Rallenta, se serve scendi dalla bici e tienila tra te e l'animale, passa con calma senza gesti bruschi. Se attraversi un recinto di pascolo richiudi sempre il cancello dietro di te.",
    cerca: "animali mucche cani pastore gregge pascolo cancelli recinti incontro" },
  { id: "whip", tema: "Durante l'evento", icona: "📡", titolo: "Live tracking",
    corpo: "Durante l'evento ogni partecipante è visibile sull'app di live tracking. È anche il modo con cui vediamo quale percorso hai scelto, per questo puoi cambiare idea senza avvisarci. Le istruzioni per attivare il tuo tracking arrivano prima della partenza.",
    cerca: "live tracking seguire diretta famiglia attivare tracciamento" },
  { id: "emergenze", tema: "Durante l'evento", icona: "🆘", titolo: "Emergenze",
    corpo: "Per un'emergenza sanitaria o il soccorso alpino chiama subito il 112, il numero unico che funziona sempre. L'evento è in autonomia, non c'è un servizio scopa. Dalla sezione Live puoi condividere la tua posizione esatta con un tocco.",
    cerca: "emergenza 112 soccorso aiuto telefono incidente posizione" },
  { id: "arrivo", tema: "Durante l'evento", icona: "🏁", titolo: "Arrivo e accoglienza",
    corpo: "Ti aspettiamo all'arrivo a Progetto Manifattura, dove ritirerai anche il pacco arrivo. Domenica 27 siamo lì dalle 14:00 alle 19:00, da lunedì 28 a mercoledì 30 dalle 10:00 alle 19:00.",
    cerca: "arrivo accoglienza orari fino quando domenica 27 lunedi 28 mercoledi 30 settembre pacco arrivo finisher" },
  { id: "social", tema: "Durante l'evento", icona: "📣", titolo: "Racconta il viaggio",
    corpo: "Usa l'hashtag #trentinogravel nelle foto e nelle storie, chi è a casa vive l'evento attraverso di te.",
    cerca: "social hashtag instagram foto condividere" },
  { id: "bivacco", tema: "Le regole", icona: "⛺", titolo: "Dove NON si dorme",
    corpo: "Il bivacco libero e la tenda fuori dalle aree attrezzate non sono ammessi — gran parte del percorso attraversa aree di parco. Chi viaggia in tenda usa i campeggi ufficiali. Siamo ospiti di un territorio che ci ha aperto le porte e lasciarlo come lo abbiamo trovato è la prima regola dell'evento.",
    cerca: "tenda bivacco campeggio dormire regole parco vietato" },
  { id: "ebike", tema: "Le regole", icona: "🔋", titolo: "E-bike",
    corpo: "Le e-bike sono ammesse. Pianifica le ricariche in autonomia presso le strutture dove dormi, perché lungo il percorso non ci sono punti di ricarica dedicati.",
    cerca: "ebike e-bike bici elettrica ricarica ammesse" },
  /* ✱ TESTO DA CONFERMARE con chi segue la privacy prima di pubblicare, e non
     e' un parere legale. Sta qui perche' l'avviso sopra la barra ci rimanda
     con «Come funziona»: senza questa scheda quel tasto apre la sezione Info e
     basta. Le quattro cose che dice — codice rigenerato ogni giorno, niente
     terzi, niente posizione ne' parole cercate, 90 giorni — non sono zavorra:
     sono le condizioni che tengono la misurazione fuori dal banner di consenso.
     Se una cade, cade l'esenzione. */
  { id: "privacy", tema: "Come trattiamo i dati", icona: "🔒", titolo: "Come funziona la misurazione",
    corpo: "Questa applicazione impiega strumenti di misurazione di pubblico di prima parte, finalizzati esclusivamente a rilevare in forma anonima e aggregata quante persone la utilizzano e quali funzioni vengono consultate, al fine di migliorare il servizio.\n\nNon sono impiegati strumenti di tracciamento per finalità di marketing, profilazione o pubblicità comportamentale.\n\nLa rilevazione avviene mediante un identificativo casuale rigenerato ogni giorno, che non consente di riconoscere l'interessato nel tempo. I dati non sono comunicati a terzi, non sono incrociati con altre banche dati e non comprendono dati di geolocalizzazione né i termini digitati nelle ricerche.\n\nI dati non aggregati sono conservati per 90 giorni; decorso tale termine permangono i soli totali aggregati.",
    cerca: "privacy dati personali anonimo statistiche misurazione cookie tracciamento gdpr" },
],

live: {
  whip: {
    titolo: "Dove sono gli altri",
    testo: "La mappa del live tracking ufficiale. Vedi in tempo reale dove sono i partecipanti lungo il percorso.",
    nota: "",
    attesa: "Qui arriverà la mappa del live tracking ufficiale — vedrai in tempo reale dove sono gli altri lungo il percorso. Si accende prima della partenza.",
    apri: "Apri a schermo intero"
  },
  gps: {
    titolo: "Dove sono?",
    testo: "Appena apri questa schermata la guida cerca la tua posizione e ti dice a che chilometro sei, cosa hai davanti — acqua, cibo, alloggi — che tempo fa dove sei, e ti fa condividere la posizione con un tocco."
  }
},

dormire: {
  titolo: "Arrivare e dormire",
  intro: "Ti consigliamo di prenotare almeno la prima notte a Rovereto, quella di venerdì 25 settembre — sarete in 500 nella stessa città. Le altre notti, se preferisci, prenotale già ora dalla mappa qui sotto, che mostra la traccia del percorso e i luoghi dove dormire.",
  stay22: {
    titolo: "Prenota dalla mappa",
    testo: "Hotel, B&B e campeggi intorno a Rovereto per la notte di venerdì 25. Muovi la mappa lungo il percorso per prenotare anche le tappe successive — quello che vedi è prenotabile.",
    aid: "adventurelabsrl",
    campaign: "tgguida2026",
    lat: 45.88291, lng: 11.02185,
    checkin: "2026-09-25", checkout: "2026-09-26"
  },
  consigli: []
},

dopo: {
  titolo: "È stata la prima. Grazie di averla scritta con noi.",
  testo: "La Pioneer Edition esiste una volta sola, e tu c'eri. Qui sotto trovi le cose da fare adesso — si accendono man mano che sono pronte.",
  // Le azioni con url vuoto compaiono in stato "in arrivo" (testo `attesa`,
  // niente casella né bottone). Appena l'url c'è, la voce si accende da sola.
  azioni: [
    { id: "questionario", icona: "pencil-line",
      testo: "1. Racconta com'è andata",
      dettaglio: "Sono dieci minuti e ci servono davvero per costruire la seconda edizione. Alla fine trovi il tuo attestato di finisher della Pioneer Edition, da tenere e da mostrare.",
      attesa: "Il questionario arriva qui a fine evento. Ti avvisiamo.",
      url: "", cta: "Compila il questionario" },
    { id: "foto", icona: "camera",
      testo: "2. Ritrovati nelle foto",
      dettaglio: "Le foto ufficiali della Pioneer Edition. Cerca tra le cartelle o prova la ricerca per volto, e scarica quello che trovi.",
      attesa: "Le foto ufficiali arrivano qui nei giorni dopo l'evento.",
      url: "", cta: "Vai alle foto" }
  ],
  prossimo: {
    titolo: "Il prossimo capitolo",
    testo: "Hai pedalato un evento della serie, quindi entri prima degli altri. Il 31 ottobre alle 18 apre la finestra riservata agli alumni per il Tuscany Trail 2027, dal 19 al 25 maggio. I posti di quella finestra finiscono prima dell'apertura al pubblico.",
    url: "", cta: "Avvisami quando apre"
  }
},

sponsor: { titolo: "", lista: [] },

meteo: {
  localita: [
    { nome: "Rovereto", lat: 45.889, lng: 11.044 },
    { nome: "Riva del Garda", lat: 45.885, lng: 10.841 },
    { nome: "M. di Campiglio", lat: 46.230, lng: 10.827 },
    { nome: "Dimaro (V. Sole)", lat: 46.327, lng: 10.874 },
    { nome: "Molveno", lat: 46.143, lng: 10.964 },
    { nome: "Predazzo (Fiemme)", lat: 46.312, lng: 11.601 },
    { nome: "S. Martino di C.", lat: 46.263, lng: 11.795 }
  ],
  giorniEvento: ["2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30"]
},

ui: {
  stay22lang: "it",
  giorniSett: ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"],
  countdown: { giorni: "giorni", ore: "ore", minuti: "minuti" },
  tabs: { home: "Home", percorso: "Percorso", info: "Info", dormire: "Dormire", live: "Live" },
  // Etichette della scheda del QR personale (dal template, motore/ui.js → qr).
  qr: {
    campo: "Codice o link dell'email",
    conferma: "Mostra il mio QR",
    errore: "Questo codice non ha la forma giusta. Copia di nuovo dall'email, per intero.",
    cambia: "Non è il tuo QR? Incolla qui il codice dell'email",
    oppure: "Oppure incolla il codice della tua email"
  },
  gate: {
    testo: "Questa guida è riservata ai partecipanti.|Inserisci il codice che trovi nell'email con le tracce.",
    placeholder: "CODICE", bottone: "Entra",
    errore: "Codice non valido. Controlla l'email con le tracce."
  },
  installa: {
    titolo: "Tieni la guida a portata di mano",
    testo: "Salvala sulla schermata Home. Diventa un'icona sul telefono — un tocco e sei dentro, anche senza segnale.",
    salva: "Salva sul telefono", dopo: "Più tardi",
    iosTitolo: "Salva la guida sull'iPhone",
    iosPassi: ["Tocca il tasto <b>Condividi</b> in basso in Safari (il quadrato con la freccia verso l'alto)",
               "Scorri e scegli <b>\"Aggiungi alla schermata Home\"</b>",
               "Tocca <b>Aggiungi</b> e da quel momento la guida è un'icona sul telefono, un tocco e sei dentro"],
    iosFatto: "Fatto"
  },
  avvisiTitolo: "Da sapere adesso",
  checklistTitolo: "Le cose da fare, in ordine",
  checklistSotto: "Segui l'ordine e spunta quello che completi. La lista si ricorda di te.",
  vai: "Vai",
  trePercorsi: "I tre percorsi", vaiPercorsi: "Vai ai percorsi",
  durante: {
    liveSotto: "Tocca qui e scopri dove sei, a che km, cosa hai davanti da mangiare e da dormire",
    emergenze: "Emergenze · 112", condividi: "Condividi posizione",
    meteo: "Meteo e tramonto", dormire: "Dormire stanotte", info: "Tutte le info"
  },
  cercaLabel: "Cerca",
  cercaTip: "Qui dentro cerchi tutto: acqua, treno, pacco, meteo, alloggi.",
  cercaGlobale: "Cerca fra tutte le informazioni…",
  cercaNulla: "Nessun risultato. Prova con un'altra parola.",
  cercaInfo: "Cerca nelle informazioni…",
  percorsoScegli: "Scegli il tuo percorso",
  percorsoIntro: "Partenza e arrivo per tutti da |. Puoi cambiare idea sul percorso in qualsiasi momento, senza bisogno di comunicarcelo — ti vedremo dall'app di live tracking.",
  mappaAltimetria: "Mappa + altimetria", gpx: "↓ GPX", gpx1: "↓ GPX 1/2", gpx2: "↓ GPX 2/2",
  gpxDue: "Il | è in due file GPX, perché molti GPS non caricano una traccia sopra i 10.000 punti. Scaricali entrambi con i due tasti in alto e caricali tutti e due sul dispositivo. La seconda parte comincia dove finisce la prima, a Predazzo.",
  percorsoTocca: "Tocca un percorso e trovi la mappa, l'altimetria, la descrizione e i servizi lungo la strada.",
  rvSez: {
    descrizione: "Com'è", fondo: "Il fondo", meteo: "Che tempo aspettarsi",
    alto: "Punto più alto", quota: "quota", maxCol: "max", minCol: "min",
    fonteMeteo: "Medie delle massime e delle minime dal 20 al 30 settembre degli ultimi quattro anni, corrette sulla quota reale di ogni punto. Sono medie, non previsioni."
  },
  rv: {
    torna: "Percorsi",
    aiuto: "Trascina il dito sull'altimetria e vedi il punto muoversi sulla mappa. Sulla mappa ingrandisci per far comparire più punti.",
    partenza: "Partenza · Rovereto", arrivo: "Arrivo · Rovereto",
    mostrati: "| punti in vista, raggruppati in | segni — il numero sul segno dice quanti ce ne sono lì",
    quiCiSono: "Qui ci sono | punti", eAltri: "e altri |", altriQui: "e altri | qui",
    prossimi: "Prossimi | km", tuttoIlPercorso: "Tutto il percorso",
    seiQui: "Sei al km | · quota | m",
    lontanoKm: "Punto più vicino del percorso al km | · quota | m",
    nessunPunto: "Nessun punto di questo tipo su questo percorso.",
    quota: "quota",
    daQui: "Da qui all'arrivo | km e | m di dislivello"
  },
  insieme: "I tre percorsi insieme",
  servizi: "Servizi lungo il percorso",
  serviziIntro: "Acqua, cibo e alloggi entro 500 metri dalla traccia. La lista dice che un posto esiste, non che è aperto — per gli alloggi premi <b>Prenota</b> e vedi prezzi e disponibilità reali sulla mappa. Sulla mappa acqua e cibo sono segnati al loro chilometro di percorso, quindi la posizione è indicativa entro qualche centinaio di metri.",
  filtri: { tutti: "Tutto", a: "Acqua", m: "Mangiare", d: "Dormire", b: "Meccanico" },
  fuoriPercorso: "| m fuori percorso",
  conteggi: { m: "mangiare", d: "alloggi", a: "fontane", b: "meccanici", b1: "meccanico" },
  prenota: "Prenota",
  buco: "km senza acqua né cibo", bucoDettaglio: "dal km | al km | — fai scorta prima",
  serviziInArrivo: "La lista servizi di questo percorso è in preparazione, arriva a breve.",
  mappaTraccia: "La mappa mostra la traccia del tuo percorso",
  caricamentoAlloggi: "Caricamento mappa alloggi…",
  mioPercorso: "Il mio percorso",
  attivaGps: "Attiva il GPS",
  aggiornaPos: "Aggiorna la posizione",
  gpsCerco: "Ricerca posizione…",
  gpsNo: "GPS non disponibile su questo dispositivo.",
  gpsNegato: "Non riesco a leggere la posizione. Controlla i permessi del telefono.",
  // L'avviso sulla misurazione d'uso, sopra la barra. Il testo lungo e'
  // la scheda Info con id "privacy".
  uso: {
    avviso: "Questa app conta in forma anonima quante persone la usano e quali funzioni. Nessun tracciamento pubblicitario.",
    leggi: "Come funziona",
    chiudi: "Chiudi l'avviso"
  },
  gpsLontano: "Sei a | km dal percorso |. Il punto più vicino è al km |.",
  gpsPosizione: "Sei circa al km | di | del | — mancano | km all'arrivo a Rovereto. Forza! 💪",
  condividiPos: "Condividi la posizione",
  condividiTesto: "La mia posizione al Trentino Gravel",
  davanti: "Davanti a te", tra: "tra", km: "km", fontana: "fontana", fontane: "fontane", posti: "posti", alloggi: "alloggi",
  meteoTitolo: "Meteo", meteoDoveSono: "Meteo dove sono", meteoLocalita: "Le località dell'evento",
  meteoNota: "Anteprima con i prossimi giorni — durante l'evento questa tabella mostra il 25–30 settembre.",
  meteoAdesso: "dove sei adesso", vento: "vento", pioggia: "pioggia nelle prossime ore",
  tramontaQui: "🌇 Il sole qui tramonta alle",
  tramonto: "🌇 <b>Tramonto oggi a Rovereto alle |</b> — pianifica di arrivare a destinazione prima del buio.",
  tramontoOffline: "🌇 Tramonto non disponibile offline.",
  meteoOffline: "Meteo non raggiungibile, serve connessione.",
  legenda: "Trentino Gravel · Guida in versione beta — la miglioriamo ogni settimana",
  dopoSequenza: "Le cose da fare adesso",
  dopoSotto: "In ordine, come prima della partenza. Le voci si accendono quando sono pronte.",
  dopoInArrivo: "In arrivo",
  feedback: {
    link: "Qualcosa non funziona? Scrivicelo",
    titolo: "Aiutaci a migliorare la guida",
    testo: "Un errore, una cosa che non funziona, un'idea. Scrivi qui e arriva dritto a chi costruisce l'app.",
    placeholder: "Cosa hai trovato?",
    emailPlaceholder: "La tua email, se vuoi una risposta (facoltativa)",
    invia: "Invia", chiudi: "Chiudi",
    grazie: "Ricevuto, grazie. Lo leggiamo davvero.",
    errore: "Invio non riuscito. Riprova, oppure scrivici a ciao@trentinogravel.com."
  },
  notifiche: {
    titolo: "Notifiche evento",
    testo: "Attiva le notifiche per ricevere le comunicazioni dello staff durante l'evento, anche ad app chiusa.",
    attiva: "Attiva le notifiche",
    attive: "Notifiche attive. Riceverai le comunicazioni dello staff durante l'evento.",
    bloccate: "Notifiche bloccate dal browser. Se vuoi riceverle, abilitale dalle impostazioni del sito.",
    errore: "Errore nell'attivazione delle notifiche, riprova.",
    soloDaHome: "Su iPhone le notifiche arrivano solo se aggiungi la guida alla schermata Home. Tocca Condividi, poi «Aggiungi a Home», e riapri la guida dall'icona.",
    comunicazioni: "Comunicazioni",
    nessuna: "Nessuna comunicazione al momento.",
    erroreCarico: "Non riesco a caricare le comunicazioni. Controlla la connessione."
  },
  poiSub: {}
},

}, // fine it

// ============================================================ ENGLISH
en: {

meta: {
  titolo: "Trentino Gravel",
  sottotitolo: "Pioneer Edition · 26 September 2026",
  hub: "Manifattura Tabacchi, Rovereto",
  hubMaps: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto",
  partenza: "Saturday 26 September, 7:30",
  dataPartenza: "2026-09-26T07:30:00",
  fasi: { prima: "2026-09-24", durante: "2026-09-25", dopo: "2026-10-01" }
},

intro: {
  titolo: "Welcome, pioneer.",
  testo: "You are one of the 500. The Pioneer Edition is the very first Trentino Gravel, and what we build this year — together with you — becomes the history of the event. No ranking, no clock. Self-supported bikepacking, at your own pace, through one of the most beautiful corners of the Alps. This guide is your single point of reference before, during and after the event."
},

avvisi: [
  { testo: "You have until 27 August to upload your medical certificate in your personal area on bikeadventureseries.com." }
],

checklist: [
  { id: "certificato", testo: "1. Upload your medical certificate by 27 August",
    dettaglio: "A competitive cycling medical certificate, still valid. Go to your personal area, open the Certificates section and upload the file.",
    url: "https://www.bikeadventureseries.com/my-account/", cta: "Go to your personal area" },
  { id: "studia", testo: "2. Study the final route",
    dettaglio: "Look at it on the map with the elevation profile, plan your stages and download it to your GPS with the GPX button. The Medium and Long routes come as two files, load both.",
    tab: "percorso" },
  { id: "prima-notte", testo: "3. Book at least your first night in Rovereto",
    dettaglio: "On Friday 25 September there will be 500 of you in the same town, on the same night. If you like, book the other nights now too from the map along the route.",
    tab: "dormire" },
  { id: "treno", testo: "4. Plan your trip",
    dettaglio: "The train is your friend. Rovereto sits on the Brenner line and the station is minutes away from the start.",
    tab: "info" }
],

/* Same order and same ids as the Italian block — the random pick uses the
   index, so the two lists must stay aligned. */
extraHome: {
  forum: { titolo: "Questions? Ask on the BAS forum",
    testo: "For anything about preparation, bikes and gear there is the community. The staff and fellow riders answer there.",
    url: "https://www.bikeadventureseries.com/community/space/trentino-gravel-introduce-yourself/post/bici-e-logistica-bike-and-logistics", cta: "Go to the forum" },
  altriEventi: [
    { id: "tuscany-trail", titolo: "Looking for another bikepacking adventure for your gravel bike?",
      testo: "Discover the biggest bikepacking event in the world.",
      url: "https://www.tuscanytrail.it/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=tuscany-trail", cta: "Go" },
    { id: "unpaved-roads", titolo: "In the mood for gravel?",
      testo: "Discover Italy's best loved gravel weekend.",
      url: "https://www.unpavedroads.cc/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=unpaved-roads", cta: "Go" },
    { id: "grand-escape", titolo: "Looking for an escape from everyday life?",
      testo: "Discover bikepacking on a route entirely on tarmac and cycleways.",
      url: "https://www.thegrandescape.cc/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=grand-escape", cta: "Go" },
    { id: "northcape4000", titolo: "Ride to the end of the world",
      testo: "Discover the event that takes you to the North Cape after 4,000 km on a fixed route.",
      url: "https://northcape4000.com/?utm_source=tg-guida&utm_medium=app&utm_campaign=crosssell-2026&utm_content=northcape4000", cta: "Go" }
  ]
},

percorsi: [
  { id: "corto", nome: "Short Route", breve: "Short", colore: "#5ea345", km: 210, dplus: "3,000",
    livello: "Accessible",
    desc: "The route for those who want the adventure without the extreme. It splits from the other two at Sarche and closes the loop in Rovereto.",
    note: ["About 70% on cycleways and gravel",
      "⚠️ Two spots that demand maximum caution — the SP34 turn between Sclemo and Seo at km 62, and the SS43 crossing at La Rocchetta at km 161. Both are marked on the route map and profile"],
    alto: { nome: "Campo Carlo Magno pass", quota: "1,682 m", km: 104 },
    descLunga: [
      "A loop that starts on the valley floor, climbs once and comes home along the rivers. The first kilometres head for the lake — Mori, Loppio, Nago and the descent to Torbole with Lake Garda in front of you — then you ride up the Sarca valley to Arco, cross the Marocche di Dro landslide and reach Sarche, where the Short route leaves the other two.",
      "From there it heads into the Giudicarie valleys, passes Stenico and climbs the val Rendena to Pinzolo and Madonna di Campiglio, with the Brenta Dolomites alongside all the way. The highest point is the Campo Carlo Magno pass, 1,682 m, around kilometre 104. From up there it is almost all downhill and flat — val di Sole, Malé, the apple orchards of val di Non, Mezzolombardo, Trento and the Adige valley cycleway back to Rovereto.",
      "Almost all the climbing sits in the first half. By Sarche, at kilometre 45, you have barely climbed; the bulk comes in the sixty kilometres between Sarche and Campo Carlo Magno, about two thirds of the total, on a long steady climb rather than a steep one. Less than a sixth of the total climbing is left for the last hundred kilometres."
    ],
    fondo: "About 70% between paved cycleways and gravel, the rest on roads open to traffic. The gravel is concentrated between the Giudicarie valleys and val Rendena; the run home from Trento to Rovereto is all on the paved Adige valley cycleway. No hike-a-bike sections.",
    meteo: [
      { luogo: "Rovereto", quota: "170 m", max: "22°", min: "13°" },
      { luogo: "Cles, val di Non", quota: "650 m", max: "19°", min: "10°" },
      { luogo: "Madonna di Campiglio", quota: "1,520 m", max: "13°", min: "4°" },
      { luogo: "Campo Carlo Magno", quota: "1,682 m", max: "12°", min: "2°" }
    ],
    meteoNota: "Over four years, in the same days, Campo Carlo Magno has seen both 21 degrees by day and 8 below zero at night. Pack something warm even if you start in short sleeves." },
  { id: "medio", nome: "Medium Route", breve: "Medium", colore: "#3d7a2e", km: 353, dplus: "6,740",
    livello: "Intermediate",
    desc: "Identical to the Long route for almost the entire way, with one difference — it avoids Val di Fassa and the hike-a-bike section of Col Margherita.",
    note: ["Made for riders who want the distance without the Col Margherita hike-a-bike section",
      "⚠️ At km 96 the route crosses the fast, busy SS43 Val di Non road at street level — foot down and maximum caution. The spot is marked on the route map and profile"],
    alto: { nome: "Baita Segantini, above Passo Rolle", quota: "2,173 m", km: 196 },
    descLunga: [
      "The big Trentino loop, without the hike-a-bike. As far as Sarche it is the same as the Short route — lake, Sarca valley, Marocche — then it climbs towards the Brenta at Molveno and Andalo, drops to Mezzocorona and rides up the Wine Road through Salorno, Egna and Montagna.",
      "Past Cavalese and Predazzo in val di Fiemme the high part of the route begins — Bellamonte, Passo Rolle and the climb to Baita Segantini, 2,173 m, the highest point of the Medium route, with the Pale di San Martino right in front of you. You drop to San Martino di Castrozza and then to Canal San Bovo, from where you climb Passo Brocon, 1,616 m, and descend to Pieve Tesino towards the Valsugana.",
      "The last part is the Valsugana — Borgo, Levico and the lakes — with one final bump towards Vattaro before returning to Rovereto via Mattarello and Calliano. The climbing comes in waves rather than all at once — the Brenta, the long haul to Passo Rolle, the Brocon and the last kick before home. Halfway through, at kilometre 200, you have done about two thirds of it."
    ],
    fondo: "Paved cycleways along the valley floors — Rotaliana, the Wine Road, val di Fiemme and the Valsugana — and gravel on the climbs and high traverses. No hike-a-bike sections, which is exactly why the Medium route exists.",
    meteo: [
      { luogo: "Rovereto", quota: "170 m", max: "22°", min: "13°" },
      { luogo: "Cavalese, val di Fiemme", quota: "1,000 m", max: "17°", min: "8°" },
      { luogo: "Passo Rolle", quota: "1,984 m", max: "11°", min: "2°" },
      { luogo: "Baita Segantini", quota: "2,173 m", max: "9°", min: "0°" },
      { luogo: "Passo Brocon", quota: "1,616 m", max: "12°", min: "3°" },
      { luogo: "Borgo Valsugana", quota: "385 m", max: "21°", min: "12°" }
    ],
    meteoNota: "Between the valley floor and 2,000 m there are twelve degrees of difference by day and as many at night. At Baita Segantini the coldest night of the period in the last four years hit 6 below zero." },
  { id: "lungo", nome: "Long Route", breve: "Long", colore: "#1f4d1a", km: 371, dplus: "7,400",
    livello: "Demanding",
    desc: "Compared to the Medium route it takes on Val di Fassa and climbs to Passo San Pellegrino on gravel, then keeps climbing up Col Margherita.",
    note: ["⚠️ On Col Margherita there are about 2.5 km you will cover roughly 70% pushing the bike, because of the gradients. When we tested it, it took us about 50 minutes. It is hard, but the 300-degree view over the Dolomites from the top repays the effort",
      "⚠️ At km 96 the route crosses the fast, busy SS43 Val di Non road at street level — foot down and maximum caution. The spot is marked on the route map and profile"],
    alto: { nome: "Col Margherita", quota: "2,337 m", km: 198 },
    descLunga: [
      "The hardest of the three, and the only one that enters val di Fassa. As far as Predazzo it follows the Medium route — lake, Marocche, the Brenta at Molveno and Andalo, Rotaliana, the Wine Road and val di Fiemme — then, instead of heading to Bellamonte, it carries on to Moena and climbs Passo San Pellegrino on gravel.",
      "From the pass you keep climbing to Col Margherita, 2,337 m, the highest point of the whole Trentino Gravel, reached around kilometre 198. That is where the 2.5 kilometres of hike-a-bike are, repaid by a 300-degree view over the Dolomites. Then down towards Falcade and Passo Valles, back up to Passo Rolle and Baita Segantini, and on to San Martino di Castrozza.",
      "From San Martino onwards it is identical to the Medium route — Canal San Bovo, Passo Brocon and the descent to Pieve Tesino, the Valsugana with Borgo, Levico and the lakes, and the way home to Rovereto via Vattaro and Mattarello. The fifty kilometres between Moena and San Martino hold the highest and slowest part of the trip, with three passes above 1,900 m one after the other."
    ],
    fondo: "Like the Medium route along the valley floors, plus the gravel climb to Passo San Pellegrino and the 2.5 kilometres of Col Margherita, which you will cover roughly 70% pushing the bike. It took us about 50 minutes when we tested it.",
    meteo: [
      { luogo: "Rovereto", quota: "170 m", max: "22°", min: "13°" },
      { luogo: "Cavalese, val di Fiemme", quota: "1,000 m", max: "17°", min: "8°" },
      { luogo: "Passo San Pellegrino", quota: "1,918 m", max: "11°", min: "1°" },
      { luogo: "Col Margherita", quota: "2,337 m", max: "8°", min: "-1°" },
      { luogo: "Passo Rolle", quota: "1,984 m", max: "11°", min: "2°" },
      { luogo: "Borgo Valsugana", quota: "385 m", max: "21°", min: "12°" }
    ],
    meteoNota: "On Col Margherita the average late-September low is below zero, and in the last four years the coldest day of the period never went above 4 degrees. You get there soaked in sweat after pushing the bike — gloves, a jacket and something dry are not an extra." }
],

/* Sections of the route that demand maximum caution. The t:"p" entries in
   poi.js carry a pid that looks up name and text here, so the explanation
   lives in one place and is bilingual. */
pericoli: {
  venegia: { nome: "From Predazzo to Val Venegia with no food",
    testo: "Predazzo is the last place to stock up before the longest climb on the route. From here to Baita Segantini it is 24.7 km with 1,320 metres of climbing, uphill all the way, and Capanna Cervino only comes at km 197. The two Val Venegia mountain dairies that look like a halfway stop on the map are not there this year — Malga Venegiota has been closed since the end of August for building work and Malga Venegia closes on Sunday 27 September. Water is not a problem, the fountains along the Travignolo and the springs at km 193 always run. Food is what is missing. Fill your pockets before you leave town." },
  venegiaLungo: { nome: "Both Val Venegia dairies are closed",
    testo: "Passo Valles and Malga Vallazza are the last places to eat before Passo Rolle. The two Val Venegia mountain dairies further down the valley are not there this year — Malga Venegiota has been closed since the end of August for building work and Malga Venegia closes on Sunday 27 September. From Malga Vallazza to Baita Segantini it is 10.2 km with 520 metres of climbing, and then comes Capanna Cervino. Water runs all the way down the valley, the Travignolo springs never stop. Food does not." },
  ss43: { nome: "SS43 road crossing",
    testo: "At La Rocchetta the route crosses the fast, busy Val di Non trunk road at street level. You ride straight across, to pick up the Strada delle Roste that runs quietly along the Noce river — the whole reason this crossing exists. Slow down early, stop with a foot on the ground before the tarmac and look carefully both ways. Cross only when the road is clear, in one go and with maximum care." },
  sp34: { nome: "Turn on the SP34",
    testo: "Between Sclemo and Seo, in the Stenico municipality, the route leaves the provincial road and turns onto gravel. Take the turn calmly — slow down early, signal with your arm if anyone is behind you and wait until the road is clear in both directions before leaving the tarmac. Maximum attention." }
},

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

/* Live tracking WHIP. L'embed e' lo stesso usato sulla home di northcape4000.com
   (iframe verso www.whip.live/event-tracking/<CODICE>, nessun X-Frame-Options).
   Stringa vuota = la card resta ma al posto della mappa mostra il testo `attesa`
   di live.whip ("qui arriverà la mappa del live tracking"). Quando WHIP consegna
   il codice del Trentino Gravel si scrive qui l'url completo, in tutte e due le
   lingue, e la mappa compare da sola. Verificato il 19/8 sull'evento NC4R26 che
   whip.live si lascia incorporare (niente X-Frame-Options ne' frame-ancestors). */
whipUrl: "",

qr: {
  titolo: "Your QR for pack pickup",
  numero: "Bib |",
  testo: "Show it at the pack pickup desk, Friday 25 September from 4 to 6 pm at Progetto Manifattura. It works offline too, and if the scanner can't read it your number is enough.",
  vuoto: "Your QR is in the pack pickup email. Open the link in that email that brings you to the guide, or paste the code below, and it will appear here, saved on your phone. Can't find the email? At the desk your name is enough.",
  daLink: "This QR came from a link. Yours stays saved and comes back next time you open the guide.",
  mio: "This is my QR"
},
infoCards: [
  { id: "orari", tema: "The schedule", icona: "⏱️", titolo: "All the times",
    corpo: "These are the final times. Everything happens at Progetto Manifattura in Rovereto — pack pickup, briefing, the start and the welcome at the finish.",
    orari: [
      { giorno: "Friday 25 September", voci: [
        { ora: "16:00–18:00", cosa: "Event pack pickup" },
        { ora: "18:00–19:00", cosa: "Briefing" } ] },
      { giorno: "Saturday 26 September", voci: [
        { ora: "7:15", cosa: "Meet on the avenue" },
        { ora: "7:30", cosa: "Start" } ] },
      { giorno: "The finish, Sunday to Wednesday", voci: [
        { ora: "14:00–19:00", cosa: "Sunday 27 September" },
        { ora: "10:00–19:00", cosa: "Monday 28 to Wednesday 30 September" } ] }
    ],
    link: { testo: "Open in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "times schedule timetable programme when pack pickup briefing start meet avenue finish welcome friday saturday sunday monday tuesday wednesday 25 26 27 28 29 30 september" },
  { id: "certificato", tema: "Before you leave", icona: "🩺", titolo: "Medical certificate by 27 August",
    corpo: "A valid competitive cycling medical certificate is mandatory to take part. You have until 27 August to upload it in your personal area on bikeadventureseries.com, in the Certificates section.",
    link: { testo: "Go to your personal area", url: "https://www.bikeadventureseries.com/my-account/" },
    cerca: "medical certificate cycling mandatory upload deadline 27 august personal area" },
  { id: "gpsguide", tema: "Before you leave", icona: "🛰️", titolo: "The final route is here, and it is the one to load on your GPS",
    corpo: "The routes you see in this app are the final ones and they are the same ones to load on your GPS. Download them with the GPX button at the top of each route map. The Medium and Long routes come as two files, part one and part two, because many GPS units will not load a track above 10,000 points — load both and switch to the second one when the first ends, at Predazzo. Compared with the preliminary route the main change is the section after Canal San Bovo, which now goes over Passo Brocon and Pieve Tesino instead of Passo Cinque Croci, closed for roadworks. There are also short tweaks in several places, so throw away the old versions.",
    cerca: "gps route load navigation final preliminary track gpx two files part brocon cinque croci" },
  { id: "pacco", tema: "Before you leave", icona: "🎒", titolo: "Event pack pickup",
    corpo: "Event pack pickup is on Friday 25 September, from 16:00 to 18:00, at Progetto Manifattura in Rovereto. Right after, from 18:00 to 19:00, the briefing takes place in the same venue.",
    cerca: "event pack pickup collection briefing friday 25 time" },
  { id: "cambio", tema: "Before you leave", icona: "🔁", titolo: "Changing route",
    corpo: "You can change your mind about the route at any time, with no need to tell us. We will see you on the live tracking app.",
    cerca: "change route switch choice short medium long mind" },
  { id: "luogo", tema: "Getting to Rovereto", icona: "📍", titolo: "One place for everything",
    corpo: "Event pack pickup, start, finish and finisher pack pickup all happen at Manifattura Tabacchi in Rovereto. Tap the button, Google Maps opens and you can set your navigation.",
    link: { testo: "Open in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "venue address manifattura tabacchi rovereto where start finish place map navigation google" },
  { id: "partenza", tema: "Getting to Rovereto", icona: "🚵", titolo: "Start",
    corpo: "On Saturday 26 September we meet at 7:15 on the avenue, in front of Progetto Manifattura. The start is at 7:30.",
    cerca: "start time saturday 26 when departure morning meet avenue" },
  { id: "treno", tema: "Getting to Rovereto", icona: "🚆", titolo: "Arriving by train (recommended)",
    corpo: "Rovereto sits on the Brenner line, with direct trains from Verona, Trento and Bolzano and easy connections from Milan, Bologna, Munich and Innsbruck. The station is a few minutes by bike from Manifattura Tabacchi. With your bike already assembled and no parking to hunt for, it is by far the simplest option.",
    cerca: "train station brenner arrive how to get verona trento bolzano milan munich" },
  { id: "auto", tema: "Getting to Rovereto", icona: "🚗", titolo: "Arriving by car and parking",
    corpo: "For multi-day parking use Rovereto's paid municipal car parks, in particular the Mart and Follone areas, a few minutes from the venue. Do not leave your car in the Manifattura grounds.",
    link: { testo: "Rovereto parking map (PDF)", url: "https://smr.tn.it/wp-content/uploads/2023/06/Mappa-parcheggi-organizzati-e-struttura.pdf" },
    cerca: "car parking park where leave multi day mart follone map" },
  { id: "colmargherita", tema: "On the route", icona: "⛰️", titolo: "Col Margherita (Long route only)",
    corpo: "The Long route takes on Val di Fassa and climbs to Passo San Pellegrino on gravel, then keeps climbing up Col Margherita. There you will find about 2.5 km that you will cover roughly 70% pushing the bike, because of the gradients. When we tested it, it took us about 50 minutes. It is a hard section, but once at the top the 300-degree view over the Dolomites repays the effort. If you would rather skip it, the Medium route exists exactly for that.",
    cerca: "col margherita push hike a bike technical section walking long san pellegrino fassa" },
  { id: "sicurezza", tema: "On the route", icona: "🛡️", titolo: "The golden rules of safety",
    corpo: "This is not a race, take no unnecessary risks. Roads are open to traffic and the highway code applies. Do not ride in the dark, and if evening catches you out anyway, use powerful lights and stop at the first opportunity. Do not ride when you are too tired, try never to be alone, and help anyone in difficulty. If a section feels dangerous, get off and walk.",
    cerca: "safety rules highway code night traffic caution fatigue help" },
  { id: "dotazione", tema: "On the route", icona: "🦺", titolo: "What to bring",
    corpo: "Lights and a bell are required by the highway code, and keep your helmet fastened at all times. For dark sections you need a hi-vis vest or reflective elements. Bring a power bank for GPS and phone and a repair kit — and learn to use it before you leave.",
    cerca: "gear helmet lights vest reflective bell equipment what to bring repair kit" },
  { id: "acqua", tema: "On the route", icona: "⛲", titolo: "Water and resupply",
    corpo: "Fountains and resupply points are frequent in the villages along the way. The full list, kilometre by kilometre, is in the Route section. On the high sections always set off with full bottles.",
    cerca: "water fountains resupply refill food shops bottles" },
  { id: "meteo", tema: "On the route", icona: "🌦️", titolo: "The mountains in late September",
    corpo: "The Trentino Gravel also runs high up, and in late September the weather up there turns fast. It can be summer in the valley and winter on a ridge in the same afternoon, with darkness falling shortly after 7 pm. There are sections, few but real, where you will not meet anyone for a long while and where phone coverage is poor.\n\nTwo things we ask you to take seriously.\n\nDo not ride in the dark. Build your days so that you stop before sunset, even when that means finishing a day later.\n\nYou are the one judging the weather, every day and while you ride. If conditions do not allow it, you stop, you wait, and you start again when it improves. Nobody is timing you and there is no reason on earth to be on an exposed pass while a storm rolls in.\n\nCarry cold and rain gear even if you start under the sun. Check the forecast every evening for the next day, you find it in the Live section together with the sunset time. Always keep in mind where you can stop and where you can drop down to the valley if the day turns bad.\n\nThe decisions on the route are yours, and your safety depends on how you make them.",
    cerca: "weather cold rain clothing what to bring lights altitude temperature dark sunset storm mountains self supported safety stop forecast night" },
  { id: "animali", tema: "On the route", icona: "🐄", titolo: "Grazing animals",
    corpo: "On the high sections you may meet cows and flocks at pasture, sometimes with guardian dogs. Slow down, get off the bike if needed and keep it between you and the animal, pass calmly without sudden moves. If you cross a pasture fence, always close the gate behind you.",
    cerca: "animals cows dogs shepherd flock pasture gates fences encounter" },
  { id: "whip", tema: "During the event", icona: "📡", titolo: "Live tracking",
    corpo: "During the event every rider is visible on the live tracking app. It is also how we see which route you chose, which is why you can change your mind without telling us. Instructions to activate your tracking arrive before the start.",
    cerca: "live tracking follow family activate tracker" },
  { id: "emergenze", tema: "During the event", icona: "🆘", titolo: "Emergencies",
    corpo: "For a medical emergency or mountain rescue call 112 right away, the single European number that always works. The event is self-supported, there is no sweep vehicle. From the Live section you can share your exact position with one tap.",
    cerca: "emergency 112 rescue help phone accident position" },
  { id: "arrivo", tema: "During the event", icona: "🏁", titolo: "Finish and welcome",
    corpo: "We wait for you at the finish at Progetto Manifattura, where you also collect your finisher pack. On Sunday 27 we are there from 14:00 to 19:00, from Monday 28 to Wednesday 30 from 10:00 to 19:00.",
    cerca: "finish welcome times until when sunday 27 monday 28 wednesday 30 september finisher pack" },
  { id: "social", tema: "During the event", icona: "📣", titolo: "Tell the story",
    corpo: "Use the hashtag #trentinogravel in your photos and stories, so the people back home live the event through you.",
    cerca: "social hashtag instagram photos share" },
  { id: "bivacco", tema: "The rules", icona: "⛺", titolo: "Where NOT to sleep",
    corpo: "Wild camping and tents outside designated areas are not allowed — most of the route crosses protected park areas. If you travel with a tent, use official campsites. We are guests of a territory that opened its doors to us, and leaving it as we found it is the first rule of the event.",
    cerca: "tent wild camping bivouac campsite sleep rules park forbidden" },
  { id: "ebike", tema: "The rules", icona: "🔋", titolo: "E-bikes",
    corpo: "E-bikes are allowed. Plan your charging independently at the places where you sleep, because there are no dedicated charging points along the route.",
    cerca: "ebike e-bike electric bike charging allowed" },
  /* ✱ SAME TEXT, to be confirmed before publishing. See the Italian card. */
  { id: "privacy", tema: "How we handle your data", icona: "🔒", titolo: "How the measurement works",
    corpo: "This application uses first-party audience measurement tools, solely to record, in anonymous and aggregated form, how many people use it and which features are consulted, for the purpose of improving the service.\n\nNo trackers are used for marketing, profiling or behavioural advertising purposes.\n\nMeasurement relies on a random identifier regenerated every day, which does not allow a user to be recognised over time. The data are not disclosed to third parties, are not combined with any other dataset, and include neither location data nor the terms typed into searches.\n\nNon-aggregated data are retained for 90 days; thereafter only aggregate totals remain.",
    cerca: "privacy personal data anonymous statistics measurement cookies tracking gdpr" },
],

live: {
  whip: {
    titolo: "Where everyone else is",
    testo: "The official live tracking map. See in real time where the riders are along the route.",
    nota: "",
    attesa: "The official live tracking map will go here — you will see in real time where the others are along the route. It switches on before the start.",
    apri: "Open full screen"
  },
  gps: {
    titolo: "Where am I?",
    testo: "As soon as you open this screen the guide looks for your position and tells you which kilometre you are at, what lies ahead — water, food, places to sleep — the weather where you are, and lets you share your position with one tap."
  }
},

dormire: {
  titolo: "Getting there and sleeping",
  intro: "We recommend booking at least your first night in Rovereto, Friday 25 September — there will be 500 of you in the same town. If you like, book the other nights now too from the map below, which shows the route line and the places to stay.",
  stay22: {
    titolo: "Book from the map",
    testo: "Hotels, B&Bs and campsites around Rovereto for the night of Friday 25. Move the map along the route to book your next stops too — what you see is bookable.",
    aid: "adventurelabsrl",
    campaign: "tgguida2026",
    lat: 45.88291, lng: 11.02185,
    checkin: "2026-09-25", checkout: "2026-09-26"
  },
  consigli: []
},

dopo: {
  titolo: "It was the first one. Thank you for writing it with us.",
  testo: "The Pioneer Edition happens only once, and you were there. Below are the things to do now — they switch on as they become ready.",
  // Azioni con url vuoto = stato "coming soon" (testo `attesa`, niente casella).
  azioni: [
    { id: "questionario", icona: "pencil-line",
      testo: "1. Tell us how it went",
      dettaglio: "It takes ten minutes and we truly need it to build the second edition. At the end you will find your Pioneer Edition finisher certificate, to keep and to show.",
      attesa: "The survey arrives here at the end of the event. We will let you know.",
      url: "", cta: "Fill in the survey" },
    { id: "foto", icona: "camera",
      testo: "2. Find yourself in the photos",
      dettaglio: "The official Pioneer Edition photos. Browse the folders or try the face search, and download what you find.",
      attesa: "The official photos arrive here in the days after the event.",
      url: "", cta: "Go to the photos" }
  ],
  prossimo: {
    titolo: "The next chapter",
    testo: "You rode an event of the series, so you get in before everyone else. On 31 October at 18.00 the alumni window opens for the Tuscany Trail 2027, from 19 to 25 May. The spots in that window run out before the public opening.",
    url: "", cta: "Tell me when it opens"
  }
},

sponsor: { titolo: "", lista: [] },

meteo: {
  localita: [
    { nome: "Rovereto", lat: 45.889, lng: 11.044 },
    { nome: "Riva del Garda", lat: 45.885, lng: 10.841 },
    { nome: "M. di Campiglio", lat: 46.230, lng: 10.827 },
    { nome: "Dimaro (V. Sole)", lat: 46.327, lng: 10.874 },
    { nome: "Molveno", lat: 46.143, lng: 10.964 },
    { nome: "Predazzo (Fiemme)", lat: 46.312, lng: 11.601 },
    { nome: "S. Martino di C.", lat: 46.263, lng: 11.795 }
  ],
  giorniEvento: ["2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29", "2026-09-30"]
},

ui: {
  stay22lang: "en",
  giorniSett: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  countdown: { giorni: "days", ore: "hours", minuti: "minutes" },
  tabs: { home: "Home", percorso: "Route", info: "Info", dormire: "Sleep", live: "Live" },
  qr: {
    campo: "Code or link from the email",
    conferma: "Show my QR",
    errore: "That code does not look right. Copy it again from the email, in full.",
    cambia: "Not your QR? Paste the code from the email here",
    oppure: "Or paste the code from your own email"
  },
  gate: {
    testo: "This guide is for participants only.|Enter the code you received in the routes email.",
    placeholder: "CODE", bottone: "Enter",
    errore: "Invalid code. Check the routes email."
  },
  installa: {
    titolo: "Keep the guide within reach",
    testo: "Save it to your Home screen. It becomes an icon on your phone — one tap and you are in, even with no signal.",
    salva: "Save to phone", dopo: "Later",
    iosTitolo: "Save the guide on your iPhone",
    iosPassi: ["Tap the <b>Share</b> button at the bottom of Safari (the square with the arrow pointing up)",
               "Scroll and choose <b>\"Add to Home Screen\"</b>",
               "Tap <b>Add</b> and from then on the guide is an icon on your phone, one tap and you are in"],
    iosFatto: "Done"
  },
  avvisiTitolo: "Good to know right now",
  checklistTitolo: "Things to do, in order",
  checklistSotto: "Follow the order and tick what you complete. The list remembers you.",
  vai: "Go",
  trePercorsi: "The three routes", vaiPercorsi: "Go to the routes",
  durante: {
    liveSotto: "Tap here to see where you are, at which km, and what lies ahead to eat and sleep",
    emergenze: "Emergency · 112", condividi: "Share position",
    meteo: "Weather and sunset", dormire: "Sleep tonight", info: "All the info"
  },
  cercaLabel: "Search",
  cercaTip: "Search everything in here: water, train, race pack, weather, beds.",
  cercaGlobale: "Search all the information…",
  cercaNulla: "No results. Try another word.",
  cercaInfo: "Search the information…",
  percorsoScegli: "Choose your route",
  percorsoIntro: "Start and finish for everyone at |. You can change your mind about the route at any time, with no need to tell us — we will see you on the live tracking app.",
  mappaAltimetria: "Map + elevation", gpx: "↓ GPX", gpx1: "↓ GPX 1/2", gpx2: "↓ GPX 2/2",
  gpxDue: "The | comes as two GPX files, because many GPS units will not load a track above 10,000 points. Download both with the two buttons at the top and load both on your device. Part two starts where part one ends, at Predazzo.",
  percorsoTocca: "Tap a route for the map, the elevation profile, the description and the services along the way.",
  rvSez: {
    descrizione: "What it is like", fondo: "Surface", meteo: "What weather to expect",
    alto: "Highest point", quota: "elevation", maxCol: "high", minCol: "low",
    fonteMeteo: "Average daily highs and lows from 20 to 30 September over the last four years, corrected for the real elevation of each point. Averages, not a forecast."
  },
  rv: {
    torna: "Routes",
    aiuto: "Drag your finger along the elevation profile and watch the point move on the map. Zoom in on the map to make more points appear.",
    partenza: "Start · Rovereto", arrivo: "Finish · Rovereto",
    mostrati: "| points shown, grouped into | markers — the number on a marker says how many are there",
    quiCiSono: "| points here", eAltri: "and | more", altriQui: "and | more here",
    prossimi: "Next | km", tuttoIlPercorso: "Whole route",
    seiQui: "You are at km | · elevation | m",
    lontanoKm: "Nearest point of the route at km | · elevation | m",
    nessunPunto: "No points of this kind on this route.",
    quota: "elevation",
    daQui: "From here to the finish | km and | m of climbing"
  },
  insieme: "The three routes together",
  servizi: "Services along the route",
  serviziIntro: "Water, food and places to sleep within 500 metres of the route. The list says a place exists, not that it is open — for accommodation press <b>Book</b> and see real prices and availability on the map. On the map, water and food are marked at their kilometre along the route, so the position is approximate within a few hundred metres.",
  filtri: { tutti: "All", a: "Water", m: "Food", d: "Sleep", b: "Bike shop" },
  fuoriPercorso: "| m off route",
  conteggi: { m: "food", d: "stays", a: "fountains", b: "bike shops", b1: "bike shop" },
  prenota: "Book",
  buco: "km with no water or food", bucoDettaglio: "from km | to km | — stock up before",
  serviziInArrivo: "The services list for this route is being prepared, coming soon.",
  mappaTraccia: "The map shows your route line",
  caricamentoAlloggi: "Loading accommodation map…",
  mioPercorso: "My route",
  attivaGps: "Turn on GPS",
  aggiornaPos: "Refresh my position",
  gpsCerco: "Finding your position…",
  gpsNo: "GPS not available on this device.",
  gpsNegato: "Cannot read your position. Check your phone permissions.",
  // L'avviso sulla misurazione d'uso, sopra la barra. Il testo lungo e'
  // la scheda Info con id "privacy".
  uso: {
    avviso: "This app anonymously counts how many people use it and which features. No advertising tracking.",
    leggi: "How it works",
    chiudi: "Dismiss this notice"
  },
  gpsLontano: "You are | km from the | route. The nearest point is at km |.",
  gpsPosizione: "You are around km | of | on the | — | km to go to the finish in Rovereto. Keep going! 💪",
  condividiPos: "Share my position",
  condividiTesto: "My position at Trentino Gravel",
  davanti: "Ahead of you", tra: "in", km: "km", fontana: "fountain", fontane: "fountains", posti: "places", alloggi: "stays",
  meteoTitolo: "Weather", meteoDoveSono: "Weather where I am", meteoLocalita: "The event locations",
  meteoNota: "Preview with the coming days — during the event this table shows 25–30 September.",
  meteoAdesso: "where you are now", vento: "wind", pioggia: "rain in the next hours",
  tramontaQui: "🌇 The sun sets here at",
  tramonto: "🌇 <b>Sunset today in Rovereto at |</b> — plan to reach your destination before dark.",
  tramontoOffline: "🌇 Sunset not available offline.",
  meteoOffline: "Weather unavailable, connection needed.",
  legenda: "Trentino Gravel · Beta guide — we improve it every week",
  dopoSequenza: "What to do now",
  dopoSotto: "In order, just like before the start. Items switch on when they are ready.",
  dopoInArrivo: "Coming soon",
  feedback: {
    link: "Something not working? Tell us",
    titolo: "Help us improve this guide",
    testo: "A mistake, something broken, an idea. Write it here and it goes straight to the people building the app.",
    placeholder: "What did you find?",
    emailPlaceholder: "Your email, if you want a reply (optional)",
    invia: "Send", chiudi: "Close",
    grazie: "Got it, thank you. We really do read these.",
    errore: "Could not send. Try again, or write to ciao@trentinogravel.com."
  },
  notifiche: {
    titolo: "Event notifications",
    testo: "Turn on notifications to receive staff updates during the event, even with the app closed.",
    attiva: "Turn on notifications",
    attive: "Notifications are on. You will receive staff updates during the event.",
    bloccate: "Notifications are blocked by the browser. Enable them in the site settings if you want them.",
    errore: "Could not turn on notifications, try again.",
    soloDaHome: "On iPhone, notifications only work if you add the guide to your Home Screen. Tap Share, then «Add to Home Screen», then open the guide from its icon.",
    comunicazioni: "Updates",
    nessuna: "No updates at the moment.",
    erroreCarico: "Cannot load the updates. Check your connection."
  },
  poiSub: { "negozio di bici": "bike shop", "riparazione self service": "self service repair stand",
    riparazioni: "repairs",
    ristorante: "restaurant", bar: "bar", "fast food": "fast food", pub: "pub",
            gelateria: "ice cream shop", supermercato: "supermarket", alimentari: "grocery",
            panificio: "bakery", fontana: "fountain", hotel: "hotel", "B&B": "B&B",
            ostello: "hostel", motel: "motel", rifugio: "mountain hut", bivacco: "bivouac hut",
            campeggio: "campsite", chalet: "chalet", appartamenti: "apartments" }
}

} // fine en

};
