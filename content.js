// Contenuti della guida. Struttura pronta per il multilingua — CONTENT.it, CONTENT.en, ...
// L'italiano comanda. Le altre lingue si aggiungono qui senza toccare l'app.
// ✱ = dato segnaposto da confermare prima della pubblicazione reale.
// REGOLA DI SCRITTURA — mai i due punti ":" nella prosa dei testi (ok solo negli orari).
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
  testo: "Sei uno dei 500. La Pioneer Edition è la prima volta del Trentino Gravel e quello che costruiamo quest'anno — insieme a te — diventa la storia dell'evento. Nessuna classifica, nessun cronometro. Bikepacking in autonomia, al tuo ritmo, dentro uno dei territori più belli delle Alpi. Questa guida è il tuo punto di riferimento unico prima, durante e dopo l'evento."
},

avvisi: [
  { testo: "Le tracce preliminari sono disponibili. Studiale con calma, ma NON caricarle sul GPS — sul GPS va solo la traccia definitiva, in arrivo dopo la verifica finale di settembre ✱." }
],

checklist: [
  { id: "certificato", testo: "1. Carica il certificato medico",
    dettaglio: "Agonistico per il CICLISMO, in corso di validità. Vai nella tua area personale, apri la sezione Certificati e carica il file (PDF o JPG, max 2 MB).",
    url: "https://www.bikeadventureseries.com/my-account/", cta: "Vai all'area personale" },
  { id: "studia", testo: "2. Studia la traccia preliminare",
    dettaglio: "Guardala sulla mappa con l'altimetria e pianifica le tappe. NON caricarla sul GPS — caricherai solo la traccia definitiva, dopo la verifica di settembre.",
    tab: "percorso" },
  { id: "prima-notte", testo: "3. Prenota la prima notte",
    dettaglio: "Venerdì 25 settembre a Rovereto sarete in 500 nella stessa città, la stessa notte. Prenota adesso dalla mappa alloggi qui nella guida.",
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
    livello: "Accessibile", giorni: "2–3 giorni",
    desc: "Il paracadute perfetto per la prima esperienza bikepacking. Passa dalla Val di Sole, tocca il Lago di Garda e chiude l'anello a Rovereto.",
    note: ["Biforcazione dal percorso Lungo e Medio a Sarche", "Circa il 70% su ciclabili e sterrato"] },
  { id: "medio", nome: "Percorso Medio", colore: "#e8590c", km: 360, dplus: "7.300",
    livello: "Intermedio", giorni: "3–4 giorni",
    desc: "L'avventura completa senza l'estremo. San Martino, le valli dell'ovest e i grandi paesaggi, evitando il tratto a piedi del Col Margherita.",
    note: ["Pensato per chi vuole la distanza senza il tratto tecnico del Col Margherita", "Per la prima notte puntate su Molveno o Andalo — molte strutture di Madonna di Campiglio sono chiuse il 26/09"] },
  { id: "lungo", nome: "Percorso Lungo", colore: "#c1121f", km: 374, dplus: "7.800",
    livello: "Impegnativo", giorni: "4–5 giorni",
    desc: "La sfida totale. Val di Fassa, Passo San Pellegrino, Col Margherita e Passo Rolle. Chilometraggio e dislivello da ultra-distance.",
    note: ["⚠️ Sul Col Margherita ci sono circa 2–2,5 km non pedalabili, ~50 minuti con bici a spinta. In cambio uno dei panorami più belli dell'arco alpino", "Per la prima notte puntate su Molveno o Andalo"] }
],

mappeBase: "https://advlabbik.github.io/trentino-gravel-mappe/",

// tema = titolo della sezione in cui la scheda compare. Le schede sono sempre aperte.
infoCards: [
  // ---- Prima di partire ----
  { id: "certificato", tema: "Prima di partire", icona: "🩺", titolo: "Certificato medico ✱",
    corpo: "Per partecipare è obbligatorio il certificato medico agonistico per il CICLISMO in corso di validità (non valgono certificati per altre discipline). Caricalo nella tua area personale su bikeadventureseries.com, sezione Certificati (PDF o JPG, max 2 MB), entro la data che ti comunicheremo ✱. Senza certificato conforme non sei regolarmente iscritto.",
    cerca: "certificato medico agonistico ciclismo obbligatorio caricare scadenza visita" },
  { id: "gpsguide", tema: "Prima di partire", icona: "🛰️", titolo: "Sul GPS va SOLO la traccia definitiva",
    corpo: "La traccia preliminare serve per studiare il viaggio e prenotare. Guardala sulla mappa qui nella guida, ma NON caricarla sul GPS. Dopo la verifica finale di settembre ti consegniamo la traccia definitiva ✱ e a quel punto carica quella, appena arriva — non il giorno della partenza, così hai tempo di risolvere eventuali problemi. Gli eventi BAS usano Ride with GPS e con l'iscrizione hai le funzioni Premium sulle tracce ufficiali, cioè navigazione turn-by-turn, mappe offline e sincronizzazione con Garmin, Wahoo e Hammerhead ✱. Parti sempre col GPS carico e un power bank. La traccia è riservata ai partecipanti, non condividerla.",
    link: { testo: "Guida per caricare una traccia su Garmin/Wahoo", url: "https://support.ridewithgps.com/hc/en-us" },
    cerca: "gps traccia caricare garmin wahoo hammerhead ride with gps rwgps navigazione offline turn by turn batteria definitiva preliminare" },
  { id: "pacco", tema: "Prima di partire", icona: "🎒", titolo: "Consegna pacco evento",
    corpo: "Venerdì 25 settembre dalle 17:00 alle 20:00 (orario indicativo ✱) a Progetto Manifattura. Per il ritiro servono il tuo numero di iscrizione (lo trovi nell'area personale, sezione My Events) e un documento d'identità. Chi non riesce il venerdì può ritirarlo sabato mattina presto prima del briefing. Nel pacco trovi il magazine BAS, il cappellino Pioneer Edition, la pasta trentina, i prodotti Melinda, la tabellina numerata e il tuo codice per il live tracking.",
    cerca: "pacco evento ritiro consegna venerdi orario kit gadget codice numero documento identita cosa serve" },
  { id: "delega", tema: "Prima di partire", icona: "🤝", titolo: "Non riesci al ritiro? Delega un amico",
    corpo: "Se non arrivi in tempo per il ritiro del pacco puoi delegare qualcuno. Scrivi una delega con i tuoi dati e quelli della persona incaricata, allega la fotocopia fronte/retro del tuo documento d'identità e firmala. Senza questi documenti lo staff non può consegnare il pacco.",
    cerca: "delega ritiro amico terzi documento autorizzazione non riesco ritardo" },
  { id: "cambio", tema: "Prima di partire", icona: "🔁", titolo: "Cambiare percorso",
    corpo: "Puoi cambiare percorso fino al giorno prima della partenza. Rispondi a una qualsiasi email dell'evento e ce ne occupiamo noi. Guarda le tracce con calma e scegli quello giusto per te.",
    cerca: "cambiare percorso cambio scelta corto medio lungo" },
  // ---- Arrivare a Rovereto ----
  { id: "luogo", tema: "Arrivare a Rovereto", icona: "📍", titolo: "Luogo di partenza e arrivo",
    corpo: "Progetto Manifattura (ex Manifattura Tabacchi), Rovereto. Ritiro pacco, briefing, partenza e arrivo — tutto qui. Tocca il bottone, si apre Google Maps e lo metti sul navigatore.",
    link: { testo: "Apri in Google Maps", url: "https://maps.google.com/?q=Progetto+Manifattura+Piazza+Manifattura+1+Rovereto" },
    cerca: "sede indirizzo manifattura rovereto dove hub partenza arrivo luogo mappa navigatore google" },
  { id: "treno", tema: "Arrivare a Rovereto", icona: "🚆", titolo: "Arrivare in treno (consigliato)",
    corpo: "Rovereto è sulla linea del Brennero, con treni diretti da Verona, Trento e Bolzano e collegamenti comodi da Milano, Bologna, Monaco e Innsbruck. La stazione è a pochi minuti in bici da Progetto Manifattura. Con la bici già montata e nessun parcheggio da cercare è la soluzione più semplice.",
    cerca: "treno stazione brennero arrivare come si arriva verona trento bolzano milano" },
  { id: "auto", tema: "Arrivare a Rovereto", icona: "🚗", titolo: "Arrivare in auto e parcheggi",
    corpo: "Per la sosta lunga di più giorni usate i parcheggi comunali a pagamento di Rovereto, in particolare le aree Mart e Follone, a pochi minuti dalla sede. Non lasciate l'auto nei piazzali di Manifattura.",
    link: { testo: "Mappa parcheggi Rovereto (PDF)", url: "https://smr.tn.it/wp-content/uploads/2023/06/Mappa-parcheggi-organizzati-e-struttura.pdf" },
    cerca: "auto parcheggio parcheggi macchina dove lascio sosta mart follone" },
  { id: "taxi", tema: "Arrivare a Rovereto", icona: "🚕", titolo: "Taxi e transfer ✱",
    corpo: "Per rientri fuori orario, imprevisti o spostamenti degli accompagnatori pubblicheremo qui i contatti di taxi e NCC locali convenzionati ✱. Salvali prima di partire.",
    cerca: "taxi transfer ncc rientro accompagnatori trasporto" },
  // ---- Sul percorso ----
  { id: "sicurezza", tema: "Sul percorso", icona: "🛡️", titolo: "Le regole d'oro della sicurezza",
    corpo: "Non è una gara, non prendere rischi inutili. Le strade sono aperte al traffico e vale il Codice della Strada. Evita di pedalare di notte e se devi farlo usa luci potenti. Non pedalare se sei troppo stanco, cerca di non restare mai da solo e aiuta chi è in difficoltà. Se un tratto ti sembra pericoloso scendi e cammina. Il futuro dell'evento dipende dalla prudenza di ognuno.",
    cerca: "sicurezza regole codice strada notte traffico prudenza stanchezza aiuto" },
  { id: "materiale", tema: "Sul percorso", icona: "🦺", titolo: "Materiale obbligatorio",
    corpo: "Il percorso è aperto al traffico e vale il Codice della Strada. Servono il casco (sempre allacciato), le luci anteriore e posteriore, il gilet o elementi catarifrangenti per i tratti al buio e il campanello. Consigliati anche un power bank per GPS e telefono e un kit riparazione — e saperlo usare.",
    cerca: "materiale obbligatorio casco luci gilet catarifrangente campanello equipaggiamento cosa portare kit" },
  { id: "colmargherita", tema: "Sul percorso", icona: "⛰️", titolo: "Col Margherita (solo Lungo)",
    corpo: "Sul percorso Lungo c'è un tratto di circa 2–2,5 km non pedalabile sul Col Margherita, ~50 minuti con la bici a spinta. Lo diciamo prima perché tu lo sappia prima. In cambio c'è uno dei panorami più spettacolari delle Dolomiti. Se preferisci evitarlo, il percorso Medio esiste esattamente per questo.",
    cerca: "col margherita spinta piedi tratto tecnico camminare lungo" },
  { id: "acqua", tema: "Sul percorso", icona: "⛲", titolo: "Acqua e rifornimenti",
    corpo: "Fontane e punti di rifornimento sono frequenti nei paesi attraversati — trovi l'elenco completo per chilometro nella sezione Percorso. Il ristoro ufficiale all'arrivo è a base di mele Melinda, ce ne sono 1.000 che vi aspettano. Nei tratti in quota ripartite sempre con le borracce piene.",
    cerca: "acqua fontane ristoro rifornimento mangiare negozi mele" },
  { id: "meteo", tema: "Sul percorso", icona: "🌦️", titolo: "Meteo, quota e buio",
    corpo: "Fine settembre in montagna vuol dire giornate miti in valle, freddo vero in quota dopo le 17 e buio poco dopo le 19. Portate strati caldi e luci, e in quota ripartite con le borracce piene e gli strati a portata di mano. Se il meteo si mette male il formato no-race gioca per voi — nessun cancello orario, e si può sempre ripiegare sul percorso Corto. Il meteo aggiornato e l'orario del tramonto li trovi nella sezione Live.",
    cerca: "meteo freddo pioggia abbigliamento cosa porto luci quota temperatura buio tramonto" },
  { id: "animali", tema: "Sul percorso", icona: "🐄", titolo: "Animali al pascolo",
    corpo: "Nei tratti in quota puoi incontrare mucche e greggi al pascolo, a volte con cani da guardiania. Rallenta, se serve scendi dalla bici e tienila tra te e l'animale, passa con calma senza gesti bruschi. Se attraversi un recinto di pascolo richiudi sempre il cancello dietro di te.",
    cerca: "animali mucche cani pastore gregge pascolo cancelli recinti incontro" },
  { id: "criticita", tema: "Sul percorso", icona: "🚧", titolo: "Tratti da conoscere ✱",
    corpo: "Dopo il giro di verifica finale di metà settembre pubblicheremo qui l'elenco dei punti a cui fare attenzione per ogni percorso, cioè tratti senza rifornimenti, attraversamenti delicati e cantieri. Intanto segnati l'unico già certo, il tratto a spinta del Col Margherita sul percorso Lungo.",
    cerca: "criticita attenzione pericoli tratti guado cantieri rifornimenti verifica" },
  // ---- Durante l'evento ----
  { id: "whip", tema: "Durante l'evento", icona: "🔑", titolo: "Live tracking e codice WHIP",
    corpo: "Ogni partecipante è tracciato durante l'evento. Amici e famiglia possono seguirti in tempo reale e per noi il tracking è anche uno strumento di sicurezza. Ti serve il tuo codice personale WHIP — lo trovi nell'email di settembre ✱ e sulla tabellina numerata nel pacco evento. Attivalo seguendo le istruzioni che ricevi al ritiro del pacco. Il link della diretta arriva qui prima della partenza ✱ e potrai girarlo a chi ti segue da casa.",
    cerca: "live tracking whip codice tracker seguire diretta famiglia attivare" },
  { id: "emergenze", tema: "Durante l'evento", icona: "🆘", titolo: "Emergenze e incidenti",
    corpo: "Per un'emergenza sanitaria o il soccorso alpino chiama subito il 112, il numero unico europeo che funziona sempre. Poi, una volta gestita l'emergenza, avvisa l'organizzazione con un messaggio WhatsApp al +39 ✱ — scrivi, non chiamare, perché in valle la linea può mancare. L'evento è in autonomia, non c'è servizio scopa né assistenza meccanica sul percorso. In caso di infortunio hai 3 giorni ✱ per inviare il modulo assicurativo che trovi nell'area personale. Dalla sezione Live puoi anche condividere la tua posizione esatta con un tocco.",
    cerca: "emergenza 112 soccorso aiuto telefono contatto numero organizzazione incidente whatsapp assicurazione infortunio modulo" },
  { id: "arrivo", tema: "Durante l'evento", icona: "🏁", titolo: "Arrivo e accoglienza",
    corpo: "Da domenica 27 a mercoledì 30 l'arrivo è presidiato a Progetto Manifattura con docce, cibo e bevande — mele Melinda e Birra del Bosco ti aspettano — e il banner finisher per la foto. Orari di presidio 10:00–19:00 ✱ (domenica 14:00–19:00 ✱).",
    cerca: "arrivo docce finisher accoglienza orari cibo bevande birra" },
  { id: "social", tema: "Durante l'evento", icona: "📣", titolo: "Racconta il viaggio",
    corpo: "Usa l'hashtag #trentinogravel nelle foto e nelle storie, chi è a casa vive l'evento attraverso di te. E se lungo il percorso noti comportamenti scorretti di altri partecipanti segnalacelo via email — l'evento vive del rispetto reciproco.",
    cerca: "social hashtag instagram foto condividere segnalazioni comportamenti" },
  // ---- Regole e vantaggi ----
  { id: "bivacco", tema: "Regole e vantaggi", icona: "⛺", titolo: "Dove NON si dorme",
    corpo: "Il bivacco libero e la tenda fuori dalle aree attrezzate NON sono ammessi — gran parte del percorso attraversa aree di parco. Chi viaggia in tenda usa i campeggi ufficiali. Siamo ospiti di un territorio che ci ha aperto le porte e lasciarlo come lo abbiamo trovato è la prima regola dell'evento.",
    cerca: "tenda bivacco campeggio dormire regole parco vietato" },
  { id: "ebike", tema: "Regole e vantaggi", icona: "🔋", titolo: "E-bike",
    corpo: "Le e-bike sono ammesse. Pianifica le ricariche in autonomia presso le strutture dove dormi, perché lungo il percorso non ci sono punti di ricarica dedicati.",
    cerca: "ebike e-bike bici elettrica ricarica ammesse" },
  { id: "sconti", tema: "Regole e vantaggi", icona: "🏷️", titolo: "Vantaggi riservati agli iscritti ✱",
    corpo: "In quanto partecipante avrai sconti esclusivi dei partner tecnici dell'evento su abbigliamento, borse e componenti. I codici arrivano qui e nell'area personale prima dell'evento ✱.",
    cerca: "sconti codici partner vantaggi offerte riservati" },
  { id: "rovereto", tema: "Regole e vantaggi", icona: "🏛️", titolo: "Vivi Rovereto ✱",
    corpo: "Il Trentino Gravel inizia prima della partenza e finisce dopo l'arrivo. Rovereto merita tempo — il MART, il centro storico, il Castello. In arrivo una guida del territorio con dove mangiare e cosa vedere, per te e per chi ti accompagna ✱.",
    cerca: "rovereto guida territorio mangiare vedere mart castello accompagnatori" }
],

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

dormire: {
  titolo: "Arrivare e dormire",
  intro: "Due prenotazioni, due tempi. La notte di venerdì 25 a Rovereto va bloccata subito, sarete in 500 nella stessa città. Le notti lungo il percorso vanno prenotate adesso che hai le tracce, senza aspettare settembre.",
  stay22: {
    titolo: "Prenota dalla mappa",
    testo: "Hotel, B&B e campeggi intorno a Rovereto per la notte di venerdì 25. Muovi la mappa lungo il percorso per prenotare anche le tappe successive — quello che vedi è prenotabile.",
    // ✱ account provvisorio — sostituire `aid` (e `campaign` se cambia) con l'account business Stay22 quando arriva
    aid: "694570b3581ec595fca56708",
    campaign: "trentinogravel",
    lat: 45.8896, lng: 11.0440,
    checkin: "2026-09-25", checkout: "2026-09-26"
  },
  consigli: [
    "Per la prima notte sul Medio e sul Lungo puntate su Molveno o Andalo — molte strutture di Madonna di Campiglio sono già chiuse il 26/09",
    "Chi dorme in tenda usa i campeggi ufficiali, il bivacco libero non è ammesso"
  ]
},

dopo: {
  titolo: "È stata la prima. Grazie di averla scritta con noi.",
  testo: "La Pioneer Edition esiste una volta sola, e tu c'eri. Prima di rimettere le borse in cantina, tre cose.",
  azioni: [
    // ✱ i 3 url sotto sono "#" finché non arrivano i link reali (questionario, galleria foto, generatore attestato) — sostituire qui, nessun'altra modifica necessaria
    { icona: "📝", titolo: "Raccontaci com'è andata", testo: "Il questionario di fine evento richiede 5 minuti e la seconda edizione la costruiamo sulle tue risposte.", cta: "Compila il questionario ✱", url: "#" },
    { icona: "📷", titolo: "Le foto ufficiali", testo: "Le foto dell'evento, la tua foto al banner finisher e il materiale da condividere.", cta: "Guarda le foto ✱", url: "#" },
    { icona: "🏆", titolo: "Attestato Pioneer", testo: "L'attestato ufficiale di finisher della Pioneer Edition, con il tuo nome. Da scaricare e incorniciare.", cta: "Scarica l'attestato ✱", url: "#" }
  ],
  prossimo: {
    titolo: "Il prossimo capitolo",
    testo: "La Bike Adventure Series continua. Il Tuscany Trail 2027 apre presto le iscrizioni e chi ha pedalato un evento BAS entra dalla porta prioritaria, prima che aprano al pubblico.",
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
