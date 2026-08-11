// Contenuti della guida. Struttura pronta per il multilingua: CONTENT.it, CONTENT.en, ...
// L'italiano comanda: le altre lingue si aggiungono qui senza toccare l'app.
// ✱ = dato segnaposto da confermare prima della pubblicazione reale.
window.CONTENT = { it: {

meta: {
  titolo: "Trentino Gravel",
  sottotitolo: "Pioneer Edition · 26 settembre 2026",
  hub: "Progetto Manifattura, Rovereto",
  hubMaps: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto",
  partenza: "Sabato 26 settembre, mattina presto — orario esatto in arrivo ✱",
  dataPartenza: "2026-09-26T07:00:00",
  fasi: { prima: "2026-09-24", durante: "2026-09-25", dopo: "2026-10-01" }
},

intro: {
  titolo: "Benvenuto, pioniere.",
  testo: "Sei uno dei 500. La Pioneer Edition è la prima volta del Trentino Gravel: quello che costruiamo quest'anno — insieme a te — diventa la storia dell'evento. Nessuna classifica, nessun cronometro: bikepacking in autonomia, al tuo ritmo, dentro uno dei territori più belli delle Alpi. Questa guida è il tuo punto di riferimento unico: prima, durante e dopo l'evento. Salvala sulla schermata home del telefono e la ritrovi sempre, anche senza segnale."
},

percorsi: [
  { id: "corto", nome: "Percorso Corto", colore: "#2f9e44", km: 216, dplus: "3.000",
    livello: "Accessibile", giorni: "2–3 giorni",
    desc: "Il paracadute perfetto per la prima esperienza bikepacking. Passa dalla Val di Sole, tocca il Lago di Garda e chiude l'anello a Rovereto.",
    note: ["Biforcazione dal percorso Lungo e Medio a Sarche", "Circa il 70% su ciclabili e sterrato"] },
  { id: "medio", nome: "Percorso Medio", colore: "#e8590c", km: 360, dplus: "7.300",
    livello: "Intermedio", giorni: "3–4 giorni",
    desc: "L'avventura completa senza l'estremo: San Martino, le valli dell'ovest e i grandi paesaggi, evitando il tratto a piedi del Col Margherita.",
    note: ["Pensato per chi vuole la distanza senza il tratto tecnico del Col Margherita", "Prima notte: puntate su Molveno o Andalo (molte strutture di Madonna di Campiglio sono chiuse il 26/09)"] },
  { id: "lungo", nome: "Percorso Lungo", colore: "#c1121f", km: 374, dplus: "7.800",
    livello: "Impegnativo", giorni: "4–5 giorni",
    desc: "La sfida totale: Val di Fassa, Passo San Pellegrino, Col Margherita e Passo Rolle. Chilometraggio e dislivello da ultra-distance.",
    note: ["⚠️ Col Margherita: circa 2–2,5 km non pedalabili, ~50 minuti con bici a spinta. In cambio: uno dei panorami più belli dell'arco alpino", "Prima notte: puntate su Molveno o Andalo"] }
],

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

infoCards: [
  { id: "sede", icona: "📍", titolo: "La sede: una sola",
    corpo: "Progetto Manifattura (ex Manifattura Tabacchi), Rovereto. Ritiro pacco, briefing, partenza e arrivo: tutto qui. Segnatevi questo indirizzo e dimenticate tutti gli altri.",
    cerca: "sede indirizzo manifattura rovereto dove hub partenza arrivo" },
  { id: "pacco", icona: "🎒", titolo: "Consegna pacco evento",
    corpo: "Venerdì 25 settembre, dalle 17:00 alle 20:00 (orario indicativo ✱), a Progetto Manifattura. Per il ritiro servono: il tuo numero di iscrizione (lo trovi nell'area personale su bikeadventureseries.com → My Events) e un documento d'identità. Chi non riesce il venerdì può ritirarlo sabato mattina presto prima del briefing. Nel pacco: magazine BAS, cappellino Pioneer Edition, pasta trentina, prodotti Melinda, tabellina numerata e il tuo codice per il live tracking.",
    cerca: "pacco evento ritiro consegna venerdi orario kit gadget codice numero documento identita cosa serve" },
  { id: "delega", icona: "🤝", titolo: "Non riesci al ritiro? Delega un amico",
    corpo: "Se non arrivi in tempo per il ritiro del pacco puoi delegare qualcuno: scrivi una delega con i tuoi dati e quelli della persona incaricata, allega la fotocopia fronte/retro del tuo documento d'identità e firmala. Senza questi documenti lo staff non può consegnare il pacco.",
    cerca: "delega ritiro amico terzi documento autorizzazione non riesco ritardo" },
  { id: "certificato", icona: "🩺", titolo: "Certificato medico ✱",
    corpo: "Per partecipare è obbligatorio il certificato medico agonistico per il CICLISMO in corso di validità (non valgono certificati per altre discipline). Caricalo nella tua area personale su bikeadventureseries.com → sezione Certificati (PDF o JPG, max 2 MB) entro la data che ti comunichiamo ✱. Senza certificato conforme non sei regolarmente iscritto.",
    cerca: "certificato medico agonistico ciclismo obbligatorio caricare scadenza visita" },
  { id: "partenza", icona: "🚵", titolo: "Partenza",
    corpo: "Sabato 26 settembre, ritrovo la mattina presto a Progetto Manifattura: briefing breve e si parte. L'orario esatto arriva con le comunicazioni di settembre ✱.",
    cerca: "partenza orario sabato briefing ritrovo quando si parte" },
  { id: "arrivo", icona: "🏁", titolo: "Arrivo e accoglienza",
    corpo: "Da domenica 27 a mercoledì 30 l'arrivo è presidiato a Progetto Manifattura: docce, cibo e bevande (mele Melinda e Birra del Bosco ti aspettano), e il banner finisher per la foto. Orari di presidio: 10:00–19:00 ✱ (domenica 14:00–19:00 ✱).",
    cerca: "arrivo docce finisher accoglienza orari cibo bevande birra" },
  { id: "treno", icona: "🚆", titolo: "Arrivare in treno (consigliato)",
    corpo: "Rovereto è sulla linea del Brennero: treni diretti da Verona, Trento e Bolzano, collegamenti comodi da Milano, Bologna, Monaco e Innsbruck. La stazione è a pochi minuti in bici da Progetto Manifattura. Con la bici già montata e nessun parcheggio da cercare, è la soluzione più semplice.",
    cerca: "treno stazione brennero arrivare come si arriva verona trento bolzano milano" },
  { id: "auto", icona: "🚗", titolo: "Arrivare in auto e parcheggi",
    corpo: "Per la sosta lunga (più giorni) usate i parcheggi comunali a pagamento di Rovereto, in particolare le aree Mart e Follone, a pochi minuti dalla sede. Mappa dei parcheggi sul sito del Comune. Non lasciate l'auto nei piazzali di Manifattura.",
    link: { testo: "Mappa parcheggi Rovereto (PDF)", url: "https://smr.tn.it/wp-content/uploads/2023/06/Mappa-parcheggi-organizzati-e-struttura.pdf" },
    cerca: "auto parcheggio parcheggi macchina dove lascio sosta mart follone" },
  { id: "cambio", icona: "🔁", titolo: "Cambiare percorso",
    corpo: "Puoi cambiare percorso fino al giorno prima della partenza: rispondi a una qualsiasi email dell'evento e ce ne occupiamo noi. Guarda le tracce con calma e scegli quello giusto per te.",
    cerca: "cambiare percorso cambio scelta corto medio lungo" },
  { id: "bivacco", icona: "⛺", titolo: "Dove NON si dorme: la regola del bivacco",
    corpo: "Il bivacco libero e la tenda fuori dalle aree attrezzate NON sono ammessi: gran parte del percorso attraversa aree di parco. Chi viaggia in tenda usa i campeggi ufficiali. Siamo ospiti di un territorio che ci ha aperto le porte: lasciarlo come lo abbiamo trovato è la prima regola dell'evento.",
    cerca: "tenda bivacco campeggio dormire regole parco vietato" },
  { id: "chiusure", icona: "⚠️", titolo: "Strutture in quota: prenotate presto",
    corpo: "Molte strutture in quota chiudono intorno al 20 settembre, con la chiusura degli impianti. La finestra giusta per prenotare le notti lungo il percorso è ADESSO: chi aspetta metà settembre rischia di trovare intere valli chiuse. Su Ferratel/Visit Trentino una struttura chiusa non è prenotabile: quello che vedete è quello che c'è.",
    cerca: "strutture chiuse quota settembre prenotare quando rifugi alberghi" },
  { id: "guestcard", icona: "🎫", titolo: "Trentino Guest Card",
    corpo: "Chi pernotta in Trentino riceve la Trentino Guest Card: trasporti pubblici, musei e attrazioni inclusi durante il soggiorno. Un motivo in più per allungare il viaggio.",
    cerca: "guest card sconti musei trasporti carta ospite" },
  { id: "ebike", icona: "🔋", titolo: "E-bike",
    corpo: "Le e-bike sono ammesse. Pianifica le ricariche in autonomia presso le strutture dove dormi: lungo il percorso non ci sono punti di ricarica dedicati.",
    cerca: "ebike e-bike bici elettrica ricarica ammesse" },
  { id: "colmargherita", icona: "⛰️", titolo: "Col Margherita (solo Lungo)",
    corpo: "Sul percorso Lungo c'è un tratto di circa 2–2,5 km non pedalabile sul Col Margherita: ~50 minuti con la bici a spinta. Lo diciamo prima perché tu lo sappia prima: in cambio c'è uno dei panorami più spettacolari delle Dolomiti. Se preferisci evitarlo, il percorso Medio esiste esattamente per questo.",
    cerca: "col margherita spinta piedi tratto tecnico camminare lungo" },
  { id: "emergenze", icona: "🆘", titolo: "Emergenze e incidenti",
    corpo: "Emergenza sanitaria o soccorso alpino: chiama subito il 112 (numero unico europeo, funziona sempre). Poi, una volta gestita l'emergenza, avvisa l'organizzazione con un messaggio WhatsApp al +39 ✱ — scrivi, non chiamare: in valle la linea può mancare. L'evento è in autonomia: non c'è servizio scopa né assistenza meccanica sul percorso. In caso di infortunio, per attivare l'assicurazione hai 3 giorni ✱ per inviare il modulo che trovi nell'area personale.",
    cerca: "emergenza 112 soccorso aiuto telefono contatto numero organizzazione incidente whatsapp assicurazione infortunio modulo" },
  { id: "materiale", icona: "🦺", titolo: "Materiale obbligatorio",
    corpo: "Il percorso è aperto al traffico e vale il Codice della Strada. Equipaggiamento obbligatorio: casco (sempre allacciato), luci anteriore e posteriore, gilet o elementi catarifrangenti per i tratti al buio, campanello. Consigliati: power bank per GPS e telefono, kit riparazione (e saperlo usare).",
    cerca: "materiale obbligatorio casco luci gilet catarifrangente campanello equipaggiamento cosa portare kit" },
  { id: "sicurezza", icona: "🛡️", titolo: "Sicurezza: le regole d'oro",
    corpo: "Non è una gara: non prendere rischi inutili. Le strade sono aperte al traffico, rispetta il Codice della Strada. Evita di pedalare di notte; se devi, usa luci potenti. Non pedalare se sei troppo stanco, cerca di non restare mai da solo e aiuta chi è in difficoltà. Se un tratto ti sembra pericoloso, scendi e cammina: il futuro dell'evento dipende dalla prudenza di ognuno.",
    cerca: "sicurezza regole codice strada notte traffico prudenza stanchezza aiuto" },
  { id: "gpsguide", icona: "🛰️", titolo: "Carica la traccia sul GPS adesso",
    corpo: "Non aspettare il giorno della partenza: carica la traccia oggi, così hai tempo di risolvere i problemi (al ritiro pacco lo staff non potrà aiutarti). Gli eventi BAS usano Ride with GPS: con l'iscrizione hai le funzioni Premium sulle tracce ufficiali — navigazione turn-by-turn, mappe offline, sincronizzazione con Garmin, Wahoo e Hammerhead ✱. Parti sempre col GPS carico e un power bank. E ricorda: la traccia è riservata ai partecipanti, non condividerla.",
    link: { testo: "Guida: caricare una traccia su Garmin/Wahoo", url: "https://support.ridewithgps.com/hc/en-us" },
    cerca: "gps traccia caricare garmin wahoo hammerhead ride with gps rwgps navigazione offline turn by turn batteria" },
  { id: "animali", icona: "🐄", titolo: "Animali al pascolo",
    corpo: "Nei tratti in quota puoi incontrare mucche e greggi al pascolo, a volte con cani da guardiania. Rallenta, se serve scendi dalla bici e tienila tra te e l'animale, passa con calma senza gesti bruschi. Se attraversi un recinto di pascolo, richiudi sempre il cancello dietro di te.",
    cerca: "animali mucche cani pastore gregge pascolo cancelli recinti incontro" },
  { id: "taxi", icona: "🚕", titolo: "Taxi e transfer ✱",
    corpo: "Per rientri fuori orario, imprevisti o spostamenti degli accompagnatori pubblicheremo qui i contatti di taxi e NCC locali convenzionati ✱. Salvali prima di partire.",
    cerca: "taxi transfer ncc rientro accompagnatori trasporto" },
  { id: "social", icona: "📣", titolo: "Racconta il viaggio",
    corpo: "Usa l'hashtag #trentinogravel nelle foto e nelle storie: chi è a casa vive l'evento attraverso di te. E se lungo il percorso noti comportamenti scorretti di altri partecipanti, segnalacelo via email: l'evento vive del rispetto reciproco.",
    cerca: "social hashtag instagram foto condividere segnalazioni comportamenti" },
  { id: "sconti", icona: "🏷️", titolo: "Vantaggi riservati agli iscritti ✱",
    corpo: "In quanto partecipante avrai sconti esclusivi dei partner tecnici dell'evento (abbigliamento, borse, componenti). I codici arrivano qui e nell'area personale prima dell'evento ✱.",
    cerca: "sconti codici partner vantaggi offerte riservati" },
  { id: "criticita", icona: "🚧", titolo: "Tratti da conoscere ✱",
    corpo: "Dopo il giro di verifica finale di metà settembre pubblicheremo qui l'elenco dei punti a cui fare attenzione per ogni percorso: tratti senza rifornimenti, attraversamenti delicati, cantieri. Intanto segnati l'unico già certo: il tratto a spinta del Col Margherita sul percorso Lungo.",
    cerca: "criticita attenzione pericoli tratti guado cantieri rifornimenti verifica" },
  { id: "rovereto", icona: "🏛️", titolo: "Vivi Rovereto ✱",
    corpo: "Il Trentino Gravel inizia prima della partenza e finisce dopo l'arrivo: Rovereto merita tempo — il MART, il centro storico, il Castello. In arrivo una guida del territorio con dove mangiare e cosa vedere, per te e per chi ti accompagna ✱.",
    cerca: "rovereto guida territorio mangiare vedere mart castello accompagnatori" },
  { id: "meteo", icona: "🌦️", titolo: "Meteo e quota",
    corpo: "Fine settembre in montagna: giornate miti in valle, freddo vero in quota, buio poco dopo le 19. Portate strati caldi e luci. Se il meteo si mette male, il formato no-race gioca per voi: nessun cancello orario, e si può sempre ripiegare sul percorso Corto.",
    cerca: "meteo freddo pioggia abbigliamento cosa porto luci quota temperatura" },
  { id: "acqua", icona: "⛲", titolo: "Acqua e rifornimenti",
    corpo: "Fontane e punti di rifornimento sono frequenti nei paesi attraversati. Il ristoro ufficiale all'arrivo è a base di mele Melinda — 1.000 mele vi aspettano. Nei tratti in quota del Medio e del Lungo, ripartite sempre con le borracce piene.",
    cerca: "acqua fontane ristoro rifornimento mangiare negozi mele" },
  { id: "telegram", icona: "💬", titolo: "Canale Telegram",
    corpo: "Le comunicazioni rapide durante l'evento passano dal canale Telegram ufficiale ✱. Iscriviti prima di partire: è il modo più veloce per ricevere aggiornamenti su percorso e meteo.",
    link: { testo: "Entra nel canale ✱", url: "#" },
    cerca: "telegram canale comunicazioni aggiornamenti chat" }
],

live: {
  titolo: "Live tracking",
  spiegazione: "Ogni partecipante è tracciato durante l'evento: amici e famiglia possono seguirti in tempo reale, e per noi il tracking è anche uno strumento di sicurezza.",
  codice: {
    titolo: "Il tuo codice WHIP",
    testo: "Per essere tracciato ti serve il tuo codice personale WHIP: lo trovi nell'email di settembre ✱ e sulla tabellina numerata nel pacco evento. Attivalo seguendo le istruzioni che ricevi al ritiro del pacco.",
    demo: "TG26-0417 ✱"
  },
  link: { testo: "Segui la live ✱", url: "#" },
  gps: {
    titolo: "Dove sono?",
    testo: "Attiva il GPS del telefono e la guida ti mostra dove sei rispetto al percorso: chilometro raggiunto e distanza dall'arrivo."
  }
},

dormire: {
  titolo: "Arrivare e dormire",
  intro: "Due prenotazioni, due tempi. La notte di venerdì 25 a Rovereto: subito, saremo in 500 nella stessa città. Le notti lungo il percorso: adesso che hai le tracce, non aspettare settembre — molte strutture in quota chiudono il 20.",
  ferratel: {
    titolo: "Il canale ufficiale: Visit Trentino",
    testo: "Il sistema di prenotazione ufficiale del territorio: categoria, posizione, prezzo e disponibilità reale. Se una struttura è chiusa, non la puoi prenotare — quello che vedi è quello che c'è. Le APT hanno pre-allertato le strutture lungo il percorso.",
    url: "https://www.visittrentino.info/it/prenota"
  },
  stay22: {
    titolo: "Cerca sulla mappa",
    testo: "Hotel, B&B e campeggi intorno a Rovereto per la notte di venerdì 25. Muovi la mappa per esplorare le notti lungo il percorso.",
    aid: "694570b3581ec595fca56708",
    campaign: "trentinogravel",
    lat: 45.8896, lng: 11.0440,
    checkin: "2026-09-25", checkout: "2026-09-26"
  },
  consigli: [
    "Prima notte sul Medio e sul Lungo: puntate su Molveno o Andalo — molte strutture di Madonna di Campiglio sono già chiuse il 26/09",
    "Chi dorme in tenda usa i campeggi ufficiali: il bivacco libero non è ammesso",
    "Pernottando in Trentino ricevete la Trentino Guest Card: trasporti e musei inclusi"
  ]
},

dopo: {
  titolo: "È stata la prima. Grazie di averla scritta con noi.",
  testo: "La Pioneer Edition esiste una volta sola, e tu c'eri. Prima di rimettere le borse in cantina, tre cose.",
  azioni: [
    { icona: "📝", titolo: "Raccontaci com'è andata", testo: "Il questionario di fine evento: 5 minuti, e la seconda edizione la costruiamo sulle tue risposte.", cta: "Compila il questionario ✱", url: "#" },
    { icona: "📷", titolo: "Le foto ufficiali", testo: "Le foto dell'evento, la tua foto al banner finisher e il materiale da condividere.", cta: "Guarda le foto ✱", url: "#" },
    { icona: "🏆", titolo: "Attestato Pioneer", testo: "L'attestato ufficiale di finisher della Pioneer Edition, con il tuo nome. Da scaricare e incorniciare.", cta: "Scarica l'attestato ✱", url: "#" }
  ],
  prossimo: {
    titolo: "Il prossimo capitolo",
    testo: "La Bike Adventure Series continua: il Tuscany Trail 2027 apre presto le iscrizioni, e chi ha pedalato un evento BAS entra dalla porta prioritaria — prima che aprano al pubblico.",
    cta: "Scopri il Tuscany Trail ✱", url: "https://www.tuscanytrail.it"
  }
},

sponsor: {
  titolo: "L'evento è possibile grazie a",
  lista: [
    { nome: "Trentino Marketing", ruolo: "Partner istituzionale" },
    { nome: "Melinda", ruolo: "1.000 mele al ristoro + nel pacco evento" },
    { nome: "Pastificio Felicetti", ruolo: "La pasta trentina nel pacco evento" },
    { nome: "Birra del Bosco", ruolo: "La birra del finisher" },
    { nome: "Spazio disponibile", ruolo: "Il tuo brand qui ✱" }
  ]
},

checklist: [
  { id: "certificato", testo: "Carica il certificato medico nell'area personale", tab: "info" },
  { id: "traccia", testo: "Scarica la traccia GPX del tuo percorso", tab: "percorso" },
  { id: "gps", testo: "Carica la traccia sul GPS e prova la navigazione", tab: "info" },
  { id: "rovereto", testo: "Prenota la notte di venerdì 25 a Rovereto", tab: "dormire" },
  { id: "tappe", testo: "Pianifica le tappe e prenota le notti lungo il percorso", tab: "dormire" },
  { id: "studia", testo: "Studia percorso e altimetria", tab: "percorso" },
  { id: "treno", testo: "Organizza il viaggio (il treno è tuo amico)", tab: "info" },
  { id: "telegram", testo: "Iscriviti al canale Telegram", tab: "info" }
],

durante: {
  orariOggi: "Arrivi presidiati 10:00–19:00 ✱ · Docce e ristoro a Progetto Manifattura"
}

}};
