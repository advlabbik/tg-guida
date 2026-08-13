# Cosa prendere da Wise Pilgrim / All Caminos — analisi e proiezione

Documento di valutazione, 13 agosto 2026. Nasce dagli screenshot dell'app del Camino
(Wise Pilgrim, modalità demo su Camino a Finisterre e Camino Francese) e serve a decidere
**cosa vale la pena portare nella guida TG**, non a copiarne l'impostazione.

Branch di lavoro `feat/poi-mappa-altimetria`. `main` e il sito online non vengono toccati.

---

## 1. Il loro modello, in breve

Wise Pilgrim è costruito attorno a un'idea sola. Il cammino è una **sequenza di luoghi**, e
ogni luogo è una scheda con servizi, prezzi, foto e commenti. Tutto il resto dell'app —
lista, mappa, altimetria — è una vista diversa sulla stessa sequenza. Se tocchi un punto
sull'altimetria arrivi alla stessa scheda che raggiungi dalla lista o dalla mappa.

Questa coerenza è la cosa migliore che hanno, e sul Camino funziona perché il pellegrino
fa 25 km al giorno per trenta giorni e ogni sera deve dormire in un paese diverso. Da noi
la giornata è diversa. Il partecipante TG fa 216-374 km in due o tre giorni, naviga col
ciclocomputer e non sceglie il paese dove dormire, sceglie **dove si ferma a bere e a
mangiare**. Quindi non ci serve la scheda-luogo. Ci serve la stessa coerenza applicata ai
rifornimenti.

## 2. Cosa già facciamo, per non riscoprirlo

| Loro | Noi, oggi |
|---|---|
| Lista dei luoghi con km progressivo e icone servizi | Lista servizi per km, filtrabile acqua/cibo/dormire |
| Avviso tratti scoperti | Avviso automatico sui buchi oltre 20 km, che loro non hanno |
| "Distanza da te" lungo il cammino | GPS live con km percorso e blocco "davanti a te" |
| Bottone Booking.com per località | Stay22 con account aziendale, commissione 30%, più fornitori di Booking soltanto |
| Condividi, preferiti | Condivisione posizione via WhatsApp e Web Share |
| Mappa con traccia | Minimappa dei tre percorsi con frecce direzionali, mappa live CyclOSM |

Sull'affiliazione siamo già avanti a loro. Il loro bottone porta a una ricerca Booking
generica sulla località, il nostro apre la mappa Stay22 centrata sulla struttura, con
Booking dentro insieme agli altri portali. Non c'è niente da imparare lì.

## 3. Le cose loro che meritano attenzione

1. **I punti di interesse compaiono sull'altimetria**, con il nome scritto in verticale e
   l'icona del servizio. Guardando il profilo capisci in un colpo dove sono le salite e
   dove mangi prima di attaccarle.
2. **Gli stessi punti compaiono sulla mappa** con icone tipizzate e raggruppamento
   numerico quando sono vicini.
3. **La barra fissa "indietro / avanti"** con i km già fatti e quelli che mancano, sempre
   visibile sopra mappa e altimetria.
4. **Il dislivello del singolo tratto** (↑189 m ↓115 m) e la distanza fuori traccia
   (64 m dal cammino) mostrati sul punto selezionato.
5. **I commenti dei pellegrini datati** sotto ogni luogo — "il bar al km 79 era chiuso
   stamattina", "aperto per caffè alle 10:30, ha due bagni".
6. **Le mappe offline scaricabili** dalla home, come funzione di primo livello.
7. **La legenda delle icone** raggiungibile dalla home.
8. **Il selettore dei livelli mappa** (strade / satellite / outdoor / offline).

## 4. Il vantaggio che non ci aspettavamo — i dati ci sono già

Prima di stimare qualsiasi cosa ho guardato cosa abbiamo in casa.

- `tracks.js` contiene già l'array **`ele`**, una quota per ogni punto traccia, allineata
  uno a uno con le coordinate. Corto 1.229 punti (65-1.641 m), medio 1.321 (67-2.133 m),
  lungo 1.381 (67-2.273 m). **L'altimetria è calcolabile senza scaricare niente.**
- Ogni voce di `poi.js` ha il **km progressivo**. Quindi posizionare un punto
  sull'altimetria è un'operazione aritmetica, non serve nuovo materiale.
- Il codice del profilo altimetrico **esiste già**, nel repo `trentino-gravel-mappe`
  (`percorso-*.html`, canvas sincronizzato con la mappa). Va portato dentro l'app, non
  scritto da zero.
- Le coordinate però ci sono solo su una parte dei POI, e questo è il vero collo di
  bottiglia della mappa.

| Percorso | POI totali | Con coordinate | Senza coordinate |
|---|---|---|---|
| Corto | 220 | 72 (paesi, alloggi) | 148 (86 cibo, 62 acqua) |
| Medio | 217 | 85 | 132 (88 cibo, 44 acqua) |
| Lungo | 245 | 99 | 146 (98 cibo, 48 acqua) |

Le fontane e i bar hanno solo il km perché lo script di generazione scarta lat/lon dopo
aver calcolato la posizione lungo la traccia. Il dato sorgente OpenStreetMap ce l'ha.
Rigenerare `poi.js` conservando le coordinate è una modifica di poche righe a
`scripts/gen_poi.py` e una rilettura, con un aumento di peso del file stimato attorno ai
15 KB su 55. Nessun problema.

**Conseguenza pratica.** L'altimetria con i punti si può fare adesso. La mappa con tutti i
punti richiede prima la rigenerazione dei POI, che però è un lavoro breve e già
documentato.

## 5. La lista — cosa possiamo fare, con costo e utilità reale

Ordinati per rapporto tra quello che danno al partecipante e quello che costano. La
colonna utilità è argomentata sui questionari dove esiste un dato (2.116 risposte TT26,
temi per menzioni — dormire 482, cibo 443, traccia e GPS 178, acqua 113).

### A — da fare, il valore è chiaro e i dati ci sono

**A1. Altimetria dentro l'app, con acqua, cibo e paesi sopra il profilo**
Oggi il bottone "Mappa e altimetria" porta fuori, su un altro sito. Il profilo va portato
dentro la tab Percorso, con i punti disegnati sopra e la lista sotto sincronizzata.
*Utilità* — alta. È la risposta alla domanda che si fa chiunque prima di partire, dove
sono le salite e dove mangio prima. Copre insieme i due temi più citati dopo il dormire.
Chiude anche il principio dell'unica porta, che è il mandato uscito dai questionari.
*Fattibilità* — piena, dati e codice già in casa.
*Costo* — una giornata circa, compresa la sincronia con la mappa.

**A2. Rigenerare i POI con le coordinate**
Prerequisito tecnico di A3. Modifica a `scripts/gen_poi.py`, rilettura OSM sui tre
percorsi, verifica che i conteggi non cambino.
*Utilità* — indiretta, abilita il resto.
*Fattibilità* — piena, procedura già scritta in `docs/generazione-poi.md`.
*Costo* — mezza giornata, il grosso è la verifica.

**A3. Punti di interesse sulla mappa, con icone e raggruppamento**
Fontane, bar, supermercati, alloggi sulla minimappa e sulla mappa live, con le stesse
icone della lista e i cluster numerici quando si accavallano.
*Utilità* — alta, ma solo dopo A2. Senza le coordinate di acqua e cibo la mappa mostra
paesi e alloggi, cioè la metà meno urgente.
*Fattibilità* — piena, Leaflet con il plugin cluster, oppure un raggruppamento nostro per
non aggiungere dipendenze.
*Costo* — una giornata.

**A4. Barra "fatti / mancano" durante l'evento**
Km percorsi e km rimanenti sempre in vista nella tab Live, sopra la mappa, come loro.
Aggiungere il dislivello che resta, che per noi conta più che per un pellegrino a piedi.
*Utilità* — alta nel durante. La informazione più cercata in sella dopo la posizione.
*Fattibilità* — piena, il km percorso è già calcolato.
*Costo* — mezza giornata.

**A5. "Davanti a te" più ricco**
Il blocco esiste già e mostra la prossima acqua, il prossimo cibo, i prossimi due alloggi.
Aggiungere quanto dislivello separa dal punto e un avviso quando il prossimo rifornimento
è oltre i 15 km.
*Utilità* — alta nel durante, e riusa quello che c'è.
*Fattibilità* — piena.
*Costo* — poche ore.

**A6. Legenda delle icone**
Diventa necessaria nel momento in cui la mappa si popola di simboli.
*Utilità* — media, ma è il complemento obbligatorio di A3.
*Costo* — poche ore, testo in due lingue.

### B — interessanti, ma con una decisione dentro

**B1. Mappe offline scaricabili**
La lacuna vera rispetto a loro. Il nostro service worker mette in cache i file dell'app,
non le tile delle mappe. In montagna senza campo la mappa resta bianca.
*Utilità* — media-alta, con un distinguo onesto. Il partecipante naviga col ciclocomputer,
non col telefono. La mappa offline serve per capire dove si è quando qualcosa va storto,
che è raro ma è il momento in cui l'app deve funzionare.
*Fattibilità* — sì, ma è la cosa più pesante della lista. Servono un corridoio attorno alla
traccia, un limite di zoom e una barra di avanzamento. La stima è **40-60 MB per percorso**
fermandosi allo zoom 15, che è il livello dove si leggono ancora le strade secondarie.
Sopra quel livello il conto esplode.
*Costo* — due o tre giornate, più i test su iPhone dove le quote di storage sono capricciose.
*Alternativa a costo quasi zero* — mettere in cache le tile man mano che vengono guardate e
scrivere in chiaro "apri la mappa una volta prima di partire". Copre il caso più comune con
un decimo del lavoro. La proporrei prima della versione completa.

**B2. Segnalazioni dal campo**
Il loro sistema di commenti datati è la cosa più intelligente che hanno, perché risolve
l'unico problema che nessun database risolve, cioè se quel bar oggi è aperto.
*Utilità* — potenzialmente alta, ma da noi il volume è un problema. Loro hanno un flusso
continuo di pellegrini tutto l'anno sulla stessa traccia. Noi abbiamo qualche centinaio di
persone su due giorni, una volta l'anno. Un feed di commenti vuoto fa più danno che
utilità, e uno pieno va moderato mentre l'evento è in corso.
*Fattibilità* — tecnica sì, Supabase c'è già per le notifiche. Il costo vero è la
moderazione e il rischio reputazionale, non il codice.
*Proposta ridotta* — il partecipante segnala allo staff, non al pubblico. Un bottone
"segnala un problema qui" che manda km, tipo e testo allo staff, e lo staff decide se
trasformarlo in una comunicazione push per tutti. Stesso beneficio, nessuna moderazione
pubblica, e riusa il sistema di comunicazioni già costruito.
*Costo* — una giornata nella versione ridotta.

**B3. Selettore dei livelli mappa**
Strade, satellite, outdoor. Il satellite serve davvero solo per capire com'è un fondo prima
di partire.
*Utilità* — bassa nel durante, media nel prima.
*Costo* — poche ore.

### C — le lascerei stare, e il perché

**C1. La scheda per ogni luogo.** Loro ne hanno bisogno perché ogni paese è una tappa. Da
noi moltiplicherebbe le pagine senza aggiungere informazione, la riga della lista dice già
tutto quello che serve a chi passa in bici. Andrea l'ha già escluso.

**C2. I prezzi degli alloggi in app.** Loro li scrivono a mano e li mantengono. Per noi è
lavoro perpetuo e in più ci toglierebbe il traffico da Stay22, cioè la commissione.

**C3. I preferiti.** Costano poco ma non risolvono niente. Su trenta tappe ha senso segnare
i posti buoni, su una gara di due giorni no.

**C4. Foto per ogni punto.** Bella per il Camino, per noi è produzione di contenuto senza
fine.

**C5. Precedente / successivo tra i punti.** Ha senso solo se esistono le schede, quindi
cade con C1.

## 6. Se dovessi scegliere

Il pacchetto che consegnerei per primo è **A1 + A2 + A3 + A6**, cioè altimetria dentro
l'app con i punti sopra, POI rigenerati con le coordinate, punti sulla mappa e legenda.
Sono tre giornate scarse, usano dati che abbiamo già e chiudono il tema più votato dai
questionari dopo il dormire.

Subito dopo **A4 + A5**, mezza giornata in tutto, perché migliorano il momento in cui
l'app viene davvero aperta, cioè in sella.

**B1 nella versione leggera** prima dell'evento, quella completa solo se emerge dai
partecipanti che serve.

**B2 ridotta** la valuterei dopo il go-live delle notifiche, perché dipende dallo stesso
canale.
