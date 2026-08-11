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
    corpo: "Venerdì 25 settembre, dalle 17:00 alle 20:00 (orario indicativo ✱), a Progetto Manifattura. Chi non riesce il venerdì può ritirarlo sabato mattina presto prima del briefing. Nel pacco: magazine BAS, cappellino Pioneer Edition, pasta trentina, prodotti Melinda, tabellina numerata e il tuo codice per il live tracking.",
    cerca: "pacco evento ritiro consegna venerdi orario kit gadget codice" },
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
  { id: "emergenze", icona: "🆘", titolo: "Emergenze",
    corpo: "Emergenza sanitaria o soccorso alpino: chiama il 112 (numero unico europeo, funziona sempre). Per problemi non urgenti legati all'evento: contatto organizzazione +39 ✱ (attivo dal 25 al 30 settembre). L'evento è in autonomia: non c'è assistenza meccanica sul percorso.",
    cerca: "emergenza 112 soccorso aiuto telefono contatto numero organizzazione" },
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
  { id: "traccia", testo: "Scarica la traccia GPX del tuo percorso", tab: "percorso" },
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
