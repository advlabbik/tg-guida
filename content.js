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
  { id: "corto", nome: "Percorso Corto", breve: "Corto", colore: "#5ea345", km: 216, dplus: "3.000",
    livello: "Accessibile",
    desc: "Il percorso per chi vuole l'avventura senza l'estremo. Si stacca dagli altri due a Sarche e chiude l'anello a Rovereto.",
    note: ["Circa il 70% su ciclabili e sterrato"] },
  { id: "medio", nome: "Percorso Medio", breve: "Medio", colore: "#3d7a2e", km: 360, dplus: "7.400",
    livello: "Intermedio",
    desc: "Identico al Lungo per quasi tutto il tracciato, con una differenza sola — evita la Val di Fassa e il tratto a spinta del Col Margherita.",
    note: ["Pensato per chi vuole la distanza senza il tratto a spinta del Col Margherita"] },
  { id: "lungo", nome: "Percorso Lungo", breve: "Lungo", colore: "#1f4d1a", km: 374, dplus: "7.900",
    livello: "Impegnativo",
    desc: "Rispetto al Medio affronta la Val di Fassa e sale al Passo San Pellegrino su sterrato, per poi continuare a salire sul Col Margherita.",
    note: ["⚠️ Sul Col Margherita ci sono circa 2,5 km che farai per il 70% a spinta, per via delle pendenze. Quando lo abbiamo provato ci abbiamo messo circa 50 minuti. È dura, ma in vetta la vista a 300 gradi sulle Dolomiti ripaga la fatica"] }
],

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

infoCards: [
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
  cercaGlobale: "Cerca fra tutte le informazioni…",
  cercaNulla: "Nessun risultato. Prova con un'altra parola.",
  cercaInfo: "Cerca nelle informazioni…",
  percorsoScegli: "Scegli il tuo percorso",
  percorsoIntro: "Partenza e arrivo per tutti da |. Puoi cambiare idea sul percorso in qualsiasi momento, senza bisogno di comunicarcelo — ti vedremo dall'app di live tracking.",
  mappaAltimetria: "Mappa + altimetria", gpx: "↓ GPX",
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
  filtri: { tutti: "Tutto", a: "Acqua", m: "Mangiare", d: "Dormire" },
  conteggi: { m: "mangiare", d: "alloggi", a: "fontane" },
  prenota: "Prenota",
  buco: "km senza acqua né cibo", bucoDettaglio: "dal km | al km | — fai scorta prima",
  serviziInArrivo: "La lista servizi di questo percorso è in preparazione, arriva a breve.",
  mappaTraccia: "La mappa mostra la traccia del tuo percorso",
  caricamentoAlloggi: "Caricamento mappa alloggi…",
  mioPercorso: "Il mio percorso",
  attivaGps: "Attiva il GPS",
  gpsCerco: "Ricerca posizione…",
  gpsNo: "GPS non disponibile su questo dispositivo.",
  gpsNegato: "Non riesco a leggere la posizione. Controlla i permessi del telefono.",
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
  notifiche: {
    titolo: "Notifiche evento",
    testo: "Attiva le notifiche per ricevere le comunicazioni dello staff durante l'evento, anche ad app chiusa.",
    attiva: "Attiva le notifiche",
    attive: "Notifiche attive. Riceverai le comunicazioni dello staff durante l'evento.",
    bloccate: "Notifiche bloccate dal browser. Se vuoi riceverle, abilitale dalle impostazioni del sito.",
    errore: "Errore nell'attivazione delle notifiche, riprova.",
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
  partenza: "Saturday 26 September, around 7 am",
  dataPartenza: "2026-09-26T07:00:00",
  fasi: { prima: "2026-09-24", durante: "2026-09-25", dopo: "2026-10-01" }
},

intro: {
  titolo: "Welcome, pioneer.",
  testo: "You are one of the 500. The Pioneer Edition is the very first Trentino Gravel, and what we build this year — together with you — becomes the history of the event. No ranking, no clock. Self-supported bikepacking, at your own pace, through one of the most beautiful corners of the Alps. This guide is your single point of reference before, during and after the event."
},

avvisi: [
  { testo: "You have until 27 August to upload your medical certificate in your personal area on bikeadventureseries.com." },
  { testo: "The routes you see here are preliminary. Study them and book your nights, but do not load them onto your GPS. The final routes arrive a few days before the start and, unless last-minute issues come up, they will stay the same as these." }
],

checklist: [
  { id: "certificato", testo: "1. Upload your medical certificate by 27 August",
    dettaglio: "A competitive cycling medical certificate, still valid. Go to your personal area, open the Certificates section and upload the file.",
    url: "https://www.bikeadventureseries.com/my-account/", cta: "Go to your personal area" },
  { id: "studia", testo: "2. Study the preliminary route",
    dettaglio: "Explore it on the map with the elevation profile and plan your stages. Do not load it onto your GPS — only the final route goes on your GPS, arriving a few days before the start.",
    tab: "percorso" },
  { id: "prima-notte", testo: "3. Book at least your first night in Rovereto",
    dettaglio: "On Friday 25 September there will be 500 of you in the same town, on the same night. If you like, book the other nights now too from the map along the route.",
    tab: "dormire" },
  { id: "forum", testo: "4. Questions? Ask on the BAS forum",
    dettaglio: "For anything about preparation, bikes and gear there is the community. The staff and fellow riders answer there.",
    url: "https://www.bikeadventureseries.com/community/", cta: "Go to the forum" },
  { id: "treno", testo: "5. Plan your trip",
    dettaglio: "The train is your friend. Rovereto sits on the Brenner line and the station is minutes away from the start.",
    tab: "info" }
],

percorsi: [
  { id: "corto", nome: "Short Route", breve: "Short", colore: "#5ea345", km: 216, dplus: "3,000",
    livello: "Accessible",
    desc: "The route for those who want the adventure without the extreme. It splits from the other two at Sarche and closes the loop in Rovereto.",
    note: ["About 70% on cycleways and gravel"] },
  { id: "medio", nome: "Medium Route", breve: "Medium", colore: "#3d7a2e", km: 360, dplus: "7,400",
    livello: "Intermediate",
    desc: "Identical to the Long route for almost the entire way, with one difference — it avoids Val di Fassa and the hike-a-bike section of Col Margherita.",
    note: ["Made for riders who want the distance without the Col Margherita hike-a-bike section"] },
  { id: "lungo", nome: "Long Route", breve: "Long", colore: "#1f4d1a", km: 374, dplus: "7,900",
    livello: "Demanding",
    desc: "Compared to the Medium route it takes on Val di Fassa and climbs to Passo San Pellegrino on gravel, then keeps climbing up Col Margherita.",
    note: ["⚠️ On Col Margherita there are about 2.5 km you will cover roughly 70% pushing the bike, because of the gradients. When we tested it, it took us about 50 minutes. It is hard, but the 300-degree view over the Dolomites from the top repays the effort"] }
],

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

infoCards: [
  { id: "certificato", tema: "Before you leave", icona: "🩺", titolo: "Medical certificate by 27 August",
    corpo: "A valid competitive cycling medical certificate is mandatory to take part. You have until 27 August to upload it in your personal area on bikeadventureseries.com, in the Certificates section.",
    link: { testo: "Go to your personal area", url: "https://www.bikeadventureseries.com/my-account/" },
    cerca: "medical certificate cycling mandatory upload deadline 27 august personal area" },
  { id: "gpsguide", tema: "Before you leave", icona: "🛰️", titolo: "Only the final route goes on your GPS",
    corpo: "The routes you see here are preliminary and are meant for planning your ride and booking your nights. Do not load them onto your GPS. The final routes arrive a few days before the start and, unless last-minute issues come up, they will stay the same as these.",
    cerca: "gps route load navigation final preliminary track" },
  { id: "pacco", tema: "Before you leave", icona: "🎒", titolo: "Event pack pickup",
    corpo: "Event pack pickup is on Friday afternoon, 25 September, at Manifattura Tabacchi in Rovereto. Count on 5 pm onwards. Official times will follow.",
    cerca: "event pack pickup collection friday 25 time" },
  { id: "cambio", tema: "Before you leave", icona: "🔁", titolo: "Changing route",
    corpo: "You can change your mind about the route at any time, with no need to tell us. We will see you on the live tracking app.",
    cerca: "change route switch choice short medium long mind" },
  { id: "luogo", tema: "Getting to Rovereto", icona: "📍", titolo: "One place for everything",
    corpo: "Event pack pickup, start, finish and finisher pack pickup all happen at Manifattura Tabacchi in Rovereto. Tap the button, Google Maps opens and you can set your navigation.",
    link: { testo: "Open in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "venue address manifattura tabacchi rovereto where start finish place map navigation google" },
  { id: "partenza", tema: "Getting to Rovereto", icona: "🚵", titolo: "Start",
    corpo: "The start is on Saturday 26 September at around 7 in the morning, from Manifattura Tabacchi.",
    cerca: "start time saturday 26 when departure morning" },
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
    corpo: "This is not a race, take no unnecessary risks. Roads are open to traffic and the highway code applies. Avoid riding at night, and if you must, use powerful lights. Do not ride when you are too tired, try never to be alone, and help anyone in difficulty. If a section feels dangerous, get off and walk.",
    cerca: "safety rules highway code night traffic caution fatigue help" },
  { id: "dotazione", tema: "On the route", icona: "🦺", titolo: "What to bring",
    corpo: "Lights and a bell are required by the highway code, and keep your helmet fastened at all times. For dark sections you need a hi-vis vest or reflective elements. Bring a power bank for GPS and phone and a repair kit — and learn to use it before you leave.",
    cerca: "gear helmet lights vest reflective bell equipment what to bring repair kit" },
  { id: "acqua", tema: "On the route", icona: "⛲", titolo: "Water and resupply",
    corpo: "Fountains and resupply points are frequent in the villages along the way. The full list, kilometre by kilometre, is in the Route section. On the high sections always set off with full bottles.",
    cerca: "water fountains resupply refill food shops bottles" },
  { id: "meteo", tema: "On the route", icona: "🌦️", titolo: "Weather, altitude and darkness",
    corpo: "Late September in the mountains means mild days in the valley, real cold at altitude and darkness shortly after 7 pm. Bring warm layers and lights. The updated forecast and sunset time are in the Live section.",
    cerca: "weather cold rain clothing what to bring lights altitude temperature dark sunset" },
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
    corpo: "We will be at the finish to welcome you until 30 September, roughly from 10 am to 7 pm, at Manifattura Tabacchi. That is also where you collect your finisher pack.",
    cerca: "finish welcome times until when 30 september finisher pack" },
  { id: "social", tema: "During the event", icona: "📣", titolo: "Tell the story",
    corpo: "Use the hashtag #trentinogravel in your photos and stories, so the people back home live the event through you.",
    cerca: "social hashtag instagram photos share" },
  { id: "bivacco", tema: "The rules", icona: "⛺", titolo: "Where NOT to sleep",
    corpo: "Wild camping and tents outside designated areas are not allowed — most of the route crosses protected park areas. If you travel with a tent, use official campsites. We are guests of a territory that opened its doors to us, and leaving it as we found it is the first rule of the event.",
    cerca: "tent wild camping bivouac campsite sleep rules park forbidden" },
  { id: "ebike", tema: "The rules", icona: "🔋", titolo: "E-bikes",
    corpo: "E-bikes are allowed. Plan your charging independently at the places where you sleep, because there are no dedicated charging points along the route.",
    cerca: "ebike e-bike electric bike charging allowed" }
],

live: {
  gps: {
    titolo: "Where am I?",
    testo: "Turn on your phone's GPS and the guide tells you which kilometre you are at, what lies ahead — water, food, places to sleep — and lets you share your position with one tap."
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
  cercaGlobale: "Search all the information…",
  cercaNulla: "No results. Try another word.",
  cercaInfo: "Search the information…",
  percorsoScegli: "Choose your route",
  percorsoIntro: "Start and finish for everyone at |. You can change your mind about the route at any time, with no need to tell us — we will see you on the live tracking app.",
  mappaAltimetria: "Map + elevation", gpx: "↓ GPX",
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
  filtri: { tutti: "All", a: "Water", m: "Food", d: "Sleep" },
  conteggi: { m: "food", d: "stays", a: "fountains" },
  prenota: "Book",
  buco: "km with no water or food", bucoDettaglio: "from km | to km | — stock up before",
  serviziInArrivo: "The services list for this route is being prepared, coming soon.",
  mappaTraccia: "The map shows your route line",
  caricamentoAlloggi: "Loading accommodation map…",
  mioPercorso: "My route",
  attivaGps: "Turn on GPS",
  gpsCerco: "Finding your position…",
  gpsNo: "GPS not available on this device.",
  gpsNegato: "Cannot read your position. Check your phone permissions.",
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
  notifiche: {
    titolo: "Event notifications",
    testo: "Turn on notifications to receive staff updates during the event, even with the app closed.",
    attiva: "Turn on notifications",
    attive: "Notifications are on. You will receive staff updates during the event.",
    bloccate: "Notifications are blocked by the browser. Enable them in the site settings if you want them.",
    errore: "Could not turn on notifications, try again.",
    comunicazioni: "Updates",
    nessuna: "No updates at the moment.",
    erroreCarico: "Cannot load the updates. Check your connection."
  },
  poiSub: { ristorante: "restaurant", bar: "bar", "fast food": "fast food", pub: "pub",
            gelateria: "ice cream shop", supermercato: "supermarket", alimentari: "grocery",
            panificio: "bakery", fontana: "fountain", hotel: "hotel", "B&B": "B&B",
            ostello: "hostel", motel: "motel", rifugio: "mountain hut", bivacco: "bivouac hut",
            campeggio: "campsite", chalet: "chalet", appartamenti: "apartments" }
}

} // fine en

};
