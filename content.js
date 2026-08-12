// Contenuti della guida. Struttura pronta per il multilingua — CONTENT.it, CONTENT.en, ...
// L'italiano comanda. Le altre lingue si aggiungono qui senza toccare l'app.
//
// REGOLE EDITORIALI (decisioni di Andrea, 12 ago 2026)
// 1. Mai i due punti ":" nella prosa (ok solo negli orari tipo 17:00).
// 2. Versione consegnata ai partecipanti: qui c'è SOLO quello che è stato
//    comunicato nell'email delle tracce. Niente informazioni non ancora decise,
//    niente segnaposto visibili. Le integrazioni arrivano nei prossimi giorni.
window.CONTENT = { it: {

meta: {
  titolo: "Trentino Gravel",
  sottotitolo: "Pioneer Edition · 26 settembre 2026",
  hub: "Manifattura Tabacchi, Rovereto",
  hubMaps: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto",
  partenza: "Sabato 26 settembre, ore 7 circa",
  dataPartenza: "2026-09-26T07:00:00",
  fasi: { prima: "2026-09-24", durante: "2026-09-25", dopo: "2026-10-01" }
},

intro: {
  titolo: "Benvenuto, pioniere.",
  testo: "Sei uno dei 500. La Pioneer Edition è la prima volta del Trentino Gravel e quello che costruiamo quest'anno — insieme a te — diventa la storia dell'evento. Nessuna classifica, nessun cronometro. Bikepacking in autonomia, al tuo ritmo, dentro uno dei territori più belli delle Alpi. Questa guida è il tuo punto di riferimento unico prima, durante e dopo l'evento."
},

avvisi: [
  { testo: "Hai tempo fino al 27 agosto per caricare il certificato medico nella tua area personale su bikeadventureseries.com." },
  { testo: "Le tracce che vedi qui sono preliminari. Studiale con calma e prenota le tue notti, ma non caricarle sul GPS. Le tracce definitive arrivano pochi giorni prima della partenza e, se non ci saranno problematiche dell'ultimo periodo, resteranno uguali a queste." }
],

checklist: [
  { id: "certificato", testo: "1. Carica il certificato medico entro il 27 agosto",
    dettaglio: "Agonistico per il ciclismo, in corso di validità. Vai nella tua area personale, apri la sezione Certificati e carica il file.",
    url: "https://www.bikeadventureseries.com/my-account/", cta: "Vai all'area personale" },
  { id: "studia", testo: "2. Studia la traccia preliminare",
    dettaglio: "Guardala sulla mappa con l'altimetria e pianifica le tappe. Non caricarla sul GPS — sul GPS andrà solo la traccia definitiva, in arrivo pochi giorni prima della partenza.",
    tab: "percorso" },
  { id: "prima-notte", testo: "3. Prenota almeno la prima notte a Rovereto",
    dettaglio: "Venerdì 25 settembre sarete in 500 nella stessa città, la stessa notte. Le altre notti, se preferisci, prenotale già ora dalla mappa lungo il percorso.",
    tab: "dormire" },
  { id: "forum", testo: "4. Hai dubbi? Chiedi sul forum BAS",
    dettaglio: "Per domande su preparazione, bici e materiali c'è la community. Lo staff e gli altri partecipanti rispondono lì.",
    url: "https://www.bikeadventureseries.com/community/", cta: "Vai al forum" },
  { id: "treno", testo: "5. Organizza il viaggio",
    dettaglio: "Il treno è tuo amico. Rovereto è sulla linea del Brennero e la stazione è a pochi minuti dalla partenza.",
    tab: "info" }
],

percorsi: [
  { id: "corto", nome: "Percorso Corto", colore: "#2f9e44", km: 216, dplus: "3.000",
    livello: "Accessibile",
    desc: "Il percorso per chi vuole l'avventura senza l'estremo. Si stacca dagli altri due a Sarche e chiude l'anello a Rovereto.",
    note: ["Circa il 70% su ciclabili e sterrato"] },
  { id: "medio", nome: "Percorso Medio", colore: "#e8590c", km: 360, dplus: "7.400",
    livello: "Intermedio",
    desc: "Identico al Lungo per quasi tutto il tracciato, con una differenza sola — evita la Val di Fassa e il tratto a spinta del Col Margherita.",
    note: ["Pensato per chi vuole la distanza senza il tratto a spinta del Col Margherita"] },
  { id: "lungo", nome: "Percorso Lungo", colore: "#c1121f", km: 374, dplus: "7.900",
    livello: "Impegnativo",
    desc: "Rispetto al Medio affronta la Val di Fassa e sale al Passo San Pellegrino su sterrato, per poi continuare a salire sul Col Margherita.",
    note: ["⚠️ Sul Col Margherita ci sono circa 2,5 km che farai per il 70% a spinta, per via delle pendenze. Quando lo abbiamo provato ci abbiamo messo circa 50 minuti. È dura, ma in vetta la vista a 300 gradi sulle Dolomiti ripaga la fatica"] }
],

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

// tema = titolo della sezione in cui la scheda compare. Le schede sono sempre aperte.
infoCards: [
  // ---- Prima di partire ----
  { id: "certificato", tema: "Prima di partire", icona: "🩺", titolo: "Certificato medico entro il 27 agosto",
    corpo: "Per partecipare è obbligatorio il certificato medico agonistico per il ciclismo, in corso di validità. Hai tempo fino al 27 agosto per caricarlo nella tua area personale su bikeadventureseries.com, nella sezione Certificati.",
    link: { testo: "Vai all'area personale", url: "https://www.bikeadventureseries.com/my-account/" },
    cerca: "certificato medico agonistico ciclismo obbligatorio caricare scadenza 27 agosto visita area personale" },
  { id: "gpsguide", tema: "Prima di partire", icona: "🛰️", titolo: "Sul GPS va solo la traccia definitiva",
    corpo: "Le tracce che vedi qui sono preliminari e servono per studiare il viaggio e prenotare le notti. Non caricarle sul GPS. Le tracce definitive arrivano pochi giorni prima della partenza e, se non ci saranno problematiche dell'ultimo periodo, resteranno uguali a queste.",
    cerca: "gps traccia caricare navigazione definitiva preliminare" },
  { id: "pacco", tema: "Prima di partire", icona: "🎒", titolo: "Consegna pacco evento",
    corpo: "Il ritiro del pacco evento è venerdì pomeriggio 25 settembre a Manifattura Tabacchi di Rovereto. Considera dalle 17 in poi. Gli orari ufficiali arrivano più avanti.",
    cerca: "pacco evento ritiro consegna venerdi 25 orario" },
  { id: "cambio", tema: "Prima di partire", icona: "🔁", titolo: "Cambiare percorso",
    corpo: "Puoi cambiare idea sul percorso in qualsiasi momento, senza bisogno di comunicarcelo. Ti vedremo dall'app di live tracking.",
    cerca: "cambiare percorso cambio scelta corto medio lungo idea" },
  // ---- Arrivare a Rovereto ----
  { id: "luogo", tema: "Arrivare a Rovereto", icona: "📍", titolo: "Un luogo solo per tutto",
    corpo: "Consegna del pacco evento, partenza, arrivo e consegna del pacco arrivo sono tutti a Manifattura Tabacchi di Rovereto. Tocca il bottone, si apre Google Maps e lo metti sul navigatore.",
    link: { testo: "Apri in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "sede indirizzo manifattura tabacchi rovereto dove partenza arrivo luogo mappa navigatore google" },
  { id: "partenza", tema: "Arrivare a Rovereto", icona: "🚵", titolo: "Partenza",
    corpo: "La partenza è sabato 26 settembre alle 7 circa della mattina, da Manifattura Tabacchi.",
    cerca: "partenza orario sabato 26 quando si parte mattina" },
  { id: "treno", tema: "Arrivare a Rovereto", icona: "🚆", titolo: "Arrivare in treno (consigliato)",
    corpo: "Rovereto è sulla linea del Brennero, con treni diretti da Verona, Trento e Bolzano e collegamenti comodi da Milano, Bologna, Monaco e Innsbruck. La stazione è a pochi minuti in bici da Manifattura Tabacchi. Con la bici già montata e nessun parcheggio da cercare è la soluzione più semplice.",
    cerca: "treno stazione brennero arrivare come si arriva verona trento bolzano milano" },
  { id: "auto", tema: "Arrivare a Rovereto", icona: "🚗", titolo: "Arrivare in auto e parcheggi",
    corpo: "Per la sosta lunga di più giorni usa i parcheggi comunali a pagamento di Rovereto, in particolare le aree Mart e Follone, a pochi minuti dalla sede. Non lasciare l'auto nei piazzali di Manifattura.",
    link: { testo: "Mappa parcheggi Rovereto (PDF)", url: "https://smr.tn.it/wp-content/uploads/2023/06/Mappa-parcheggi-organizzati-e-struttura.pdf" },
    cerca: "auto parcheggio parcheggi macchina dove lascio sosta mart follone mappa" },
  // ---- Sul percorso ----
  { id: "colmargherita", tema: "Sul percorso", icona: "⛰️", titolo: "Col Margherita (solo Lungo)",
    corpo: "Il percorso Lungo affronta la Val di Fassa e sale al Passo San Pellegrino su sterrato, per poi continuare a salire sul Col Margherita. Lì ci sono circa 2,5 km che farai per il 70% a spinta, per via delle pendenze della strada. Quando lo abbiamo provato ci abbiamo messo circa 50 minuti. È un tratto duro, ma una volta in vetta la vista a 300 gradi sulle Dolomiti ripaga la fatica. Se preferisci evitarlo, il percorso Medio esiste esattamente per questo.",
    cerca: "col margherita spinta piedi tratto tecnico camminare lungo san pellegrino fassa" },
  { id: "sicurezza", tema: "Sul percorso", icona: "🛡️", titolo: "Le regole d'oro della sicurezza",
    corpo: "Non è una gara, non prendere rischi inutili. Le strade sono aperte al traffico e vale il Codice della Strada. Evita di pedalare di notte e se devi farlo usa luci potenti. Non pedalare se sei troppo stanco, cerca di non restare mai da solo e aiuta chi è in difficoltà. Se un tratto ti sembra pericoloso scendi e cammina.",
    cerca: "sicurezza regole codice strada notte traffico prudenza stanchezza aiuto" },
  { id: "dotazione", tema: "Sul percorso", icona: "🦺", titolo: "Cosa portare con te",
    corpo: "Luci e campanello li chiede il Codice della Strada, e il casco tienilo sempre allacciato. Per i tratti al buio servono gilet o elementi catarifrangenti. Porta un power bank per GPS e telefono e un kit riparazione — e impara a usarlo prima di partire.",
    cerca: "materiale casco luci gilet catarifrangente campanello equipaggiamento cosa portare kit riparazione" },
  { id: "acqua", tema: "Sul percorso", icona: "⛲", titolo: "Acqua e rifornimenti",
    corpo: "Fontane e punti di rifornimento sono frequenti nei paesi attraversati. L'elenco completo per chilometro è nella sezione Percorso. Nei tratti in quota riparti sempre con le borracce piene.",
    cerca: "acqua fontane ristoro rifornimento mangiare negozi borracce" },
  { id: "meteo", tema: "Sul percorso", icona: "🌦️", titolo: "Meteo, quota e buio",
    corpo: "Fine settembre in montagna vuol dire giornate miti in valle, freddo vero in quota e buio poco dopo le 19. Porta strati caldi e luci. Il meteo aggiornato e l'orario del tramonto li trovi nella sezione Live.",
    cerca: "meteo freddo pioggia abbigliamento cosa porto luci quota temperatura buio tramonto" },
  { id: "animali", tema: "Sul percorso", icona: "🐄", titolo: "Animali al pascolo",
    corpo: "Nei tratti in quota puoi incontrare mucche e greggi al pascolo, a volte con cani da guardiania. Rallenta, se serve scendi dalla bici e tienila tra te e l'animale, passa con calma senza gesti bruschi. Se attraversi un recinto di pascolo richiudi sempre il cancello dietro di te.",
    cerca: "animali mucche cani pastore gregge pascolo cancelli recinti incontro" },
  // ---- Durante l'evento ----
  { id: "whip", tema: "Durante l'evento", icona: "📡", titolo: "Live tracking",
    corpo: "Durante l'evento ogni partecipante è visibile sull'app di live tracking. È anche il modo con cui vediamo quale percorso hai scelto, per questo puoi cambiare idea senza avvisarci. Le istruzioni per attivare il tuo tracking arrivano prima della partenza.",
    cerca: "live tracking seguire diretta famiglia attivare tracciamento" },
  { id: "emergenze", tema: "Durante l'evento", icona: "🆘", titolo: "Emergenze",
    corpo: "Per un'emergenza sanitaria o il soccorso alpino chiama subito il 112, il numero unico che funziona sempre. L'evento è in autonomia, non c'è un servizio scopa. Dalla sezione Live puoi condividere la tua posizione esatta con un tocco.",
    cerca: "emergenza 112 soccorso aiuto telefono incidente posizione" },
  { id: "arrivo", tema: "Durante l'evento", icona: "🏁", titolo: "Arrivo e accoglienza",
    corpo: "Saremo all'arrivo ad accogliervi fino al 30 settembre, con orari indicativi dalle 10 della mattina alle 19 della sera, a Manifattura Tabacchi. Lì ritirerai anche il pacco arrivo.",
    cerca: "arrivo accoglienza orari fino quando 30 settembre pacco arrivo finisher" },
  { id: "social", tema: "Durante l'evento", icona: "📣", titolo: "Racconta il viaggio",
    corpo: "Usa l'hashtag #trentinogravel nelle foto e nelle storie, chi è a casa vive l'evento attraverso di te.",
    cerca: "social hashtag instagram foto condividere" },
  // ---- Le regole ----
  { id: "bivacco", tema: "Le regole", icona: "⛺", titolo: "Dove NON si dorme",
    corpo: "Il bivacco libero e la tenda fuori dalle aree attrezzate non sono ammessi — gran parte del percorso attraversa aree di parco. Chi viaggia in tenda usa i campeggi ufficiali. Siamo ospiti di un territorio che ci ha aperto le porte e lasciarlo come lo abbiamo trovato è la prima regola dell'evento.",
    cerca: "tenda bivacco campeggio dormire regole parco vietato" },
  { id: "ebike", tema: "Le regole", icona: "🔋", titolo: "E-bike",
    corpo: "Le e-bike sono ammesse. Pianifica le ricariche in autonomia presso le strutture dove dormi, perché lungo il percorso non ci sono punti di ricarica dedicati.",
    cerca: "ebike e-bike bici elettrica ricarica ammesse" }
],

live: {
  gps: {
    titolo: "Dove sono?",
    testo: "Attiva il GPS del telefono e la guida ti dice a che chilometro sei, cosa hai davanti — acqua, cibo, alloggi — e ti fa condividere la posizione con un tocco."
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
    // centrata su Manifattura Tabacchi, non su Rovereto centro: cosi' la traccia
    // passa proprio sotto gli alloggi e si capisce subito il valore della mappa
    lat: 45.88291, lng: 11.02185,
    checkin: "2026-09-25", checkout: "2026-09-26"
  },
  consigli: []
},

dopo: {
  titolo: "È stata la prima. Grazie di averla scritta con noi.",
  testo: "La Pioneer Edition esiste una volta sola, e tu c'eri. Le informazioni su foto, questionario e prossimi eventi arrivano qui a fine evento.",
  azioni: [],
  prossimo: null
},

sponsor: {
  titolo: "",
  lista: []
},

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
}

}};
