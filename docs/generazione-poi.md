# Generazione POI (acqua / mangiare / dormire) per un percorso

Procedura per creare la lista servizi che la guida mostra nella sezione Percorso,
nel "davanti a te" del GPS e nei bottoni Prenota. Vale per ogni evento BAS che
userà quest'app: ogni itinerario nuovo passa da qui.

**Script:** `scripts/gen_poi.py` · **Fonte dati:** OpenStreetMap via Overpass API (gratuita, senza chiave)

## Come si lancia

Dalla radice del repo, un argomento `chiave=file.gpx` per ogni percorso:

```bash
python scripts/gen_poi.py corto="C:/tracce/corto.gpx" medio="C:/tracce/medio.gpx"
```

- Le chiavi (`corto`, `medio`, `lungo`, …) devono combaciare con gli `id` dei
  percorsi in `content.js`, altrimenti l'app non trova i dati.
- `poi.js` viene **aggiornato, non riscritto**: i percorsi non passati restano.
- Le liste leggibili (per la revisione umana) finiscono in `docs/liste-poi/`.
- Il lavoro **riprende da dove si era interrotto**: ogni tratto scaricato viene
  salvato subito (`_osm_<chiave>.json.parziale`). Un crash o uno spegnimento
  non fanno perdere nulla. A fine corsa resta la cache `_osm_<chiave>.json`:
  finché esiste, rilanciare NON riscarica (utile per ritoccare solo
  l'elaborazione). Per riscaricare da zero, cancellarla.

## Le cinque trappole già pagate care (12 agosto 2026)

Chi tocca lo script legga queste prima di "migliorarlo".

### 1. Il corridoio si campiona a passo costante, MAI con la semplificazione geometrica

Il primo tentativo semplificava la traccia con Ramer-Douglas-Peucker e usava i
punti risultanti per la ricerca `around:500`. RDP tiene i punti dove la strada
curva e li elimina dove è dritta: sui rettilinei (ciclabile dell'Adige,
Valsugana) restavano punti distanti chilometri e la ricerca **saltava interi
paesi** — Sarche, Dro, Pietramurata, Telve, Borgo Valsugana. Il paradosso: lo
script finiva "con successo" e i dati sembravano buoni.

La soluzione è `campiona()`: un punto ogni **700 m di percorso reale** (PASSO).
Con buffer di ricerca da 500 m i cerchi si sovrappongono e non restano buchi.
700 e 500 sono legati: se si allarga il passo oltre 2×buffer tornano i buchi.

### 2. Overpass pubblico è inaffidabile: tratti corti, più server, ripresa

Il server `overpass-api.de` risponde spesso 429/504, e alcuni mirror citati in
giro sono morti del tutto. Contromisure nello script, tutte necessarie:

- query a **tratti da 22 punti** (CHUNK) — le query piccole passano quasi sempre;
- **due endpoint verificati** in alternanza (`overpass-api.de`, `overpass.osm.ch`)
  con 12 tentativi e attesa crescente. Prima di aggiungere un mirror, provarlo:
  `curl -m 20 --data-urlencode 'data=[out:json];node[amenity=drinking_water](45.88,11.03,45.90,11.06);out count;' https://SERVER/api/interpreter`
- salvataggio del parziale dopo ogni tratto (vedi sopra).

Con Overpass in giornata storta i 374 km del Lungo richiedono 20-40 minuti:
è normale, non è un blocco. Un giro che "gira da ore" invece non è normale
(vedi trappola 3).

### 3. I mirror Overpass regionali avvelenano i dati in silenzio

`overpass.osm.ch` copre **solo la Svizzera**: interrogato sul Trentino risponde
200 OK con zero risultati, senza alcun errore. Usato come riserva quando il
server principale era occupato, ha svuotato metà dei tratti di tre generazioni
consecutive. Per questo lo script **collauda ogni server all'avvio** sulla zona
del percorso (pretende almeno un centro abitato entro 10 km dalla partenza) e
scarta chi non la copre. Mai aggiungere un mirror alla lista senza quel
collaudo — rispondere non basta, deve coprire l'area.

### 4. Overpass può rispondere "200 OK" con dati troncati

La trappola più subdola di tutte. Quando la query scade LATO SERVER, Overpass
risponde comunque HTTP 200 con un JSON valido — ma con meno elementi (anche
zero) e l'avviso solo nel campo `remark`. Risultato del 12 agosto: il Corto
"completato con successo" aveva due buchi da 10-20 km (Val Rendena sparita)
e numeri dimezzati. Lo script ora controlla `remark` e tratta la risposta
parziale come un errore da ritentare. Il sintomo, se ricompare, è nella
checklist finale (fasce chilometriche vuote in zone abitate).

### 5. I cicli con soglia devono far crescere la tolleranza

Un `while len(punti) > soglia: ricampiona()` senza aumentare la tolleranza a
ogni giro **non esce mai** se il primo tentativo è già sopra soglia: un'ora e
43 minuti di CPU bruciati prima di accorgersene. Ogni ciclo del genere deve
modificare il proprio parametro (`eps *= 1.6`) a ogni iterazione.

## Altre scelte che è facile rompere senza volerlo

- **`place=farm` esiste**: in Trentino i masi sono `place=farm` e all'inizio
  facevano crashare l'assegnazione ai centri. I servizi si classificano PRIMA
  dei centri abitati (un maso può essere sia `place=farm` sia `tourism=chalet`)
  e i `place` sconosciuti si ignorano.
- **Raggruppamento per centro**: un POI appartiene al centro abitato più
  "importante" nel cui raggio ricade — city 4 km, town 2,5 km, village 1,2 km,
  hamlet 700 m. Senza questa gerarchia le frazioni spezzano i paesi (Arco
  diventava Arco + Mogno + Moletta + Caneve). Un centro con ≥4 mangiare o
  ≥4 alloggi (SOGLIA) diventa una riga sola con i conteggi; le fontane dei
  centri grandi si contano ma non si elencano.
- **Fontane deduplicate** entro 80 m (in piazza ce n'è spesso più d'una mappata).
- **Buffer**: 500 m per mangiare/dormire, 300 m per l'acqua.
- **I km della lista sono indicativi**: la traccia GPS misura qualche km in
  meno del chilometraggio ufficiale comunicato. I km/dislivelli UFFICIALI
  stanno in `content.js` e non si ricalcolano mai dal GPX.

## Checklist di verifica finale — NON opzionale

Il fallimento più subdolo è lo script che finisce bene con dati incompleti.
Dopo ogni generazione, prima di pubblicare:

1. **Confronto tra percorsi**: righe e totali (acqua/mangiare/dormire) di un
   percorso più lungo non possono essere molto più bassi di uno più corto.
   Il Lungo con la metà delle righe del Medio era il sintomo della trappola 1.
2. **Paesi campione**: cercare nella lista 3-4 paesi che si sa essere
   attraversati (per il TG: Sarche, Pietramurata, Cavalese, Molveno).
   Se manca un paese noto, c'è un buco di corridoio.
3. **Avvisi sui buchi**: i "km senza acqua né cibo" generati devono essere
   pochi e plausibili (tratti in quota), non decine in fondovalle.
4. **Revisione umana**: mandare la lista markdown ad Andrea prima di darla
   per buona — OpenStreetMap dice che un posto esiste, non che è aperto.
5. **Prova in app**: aprire la guida in locale, sezione Percorso, selettore
   sul percorso nuovo, e controllare lista + un paio di bottoni Prenota.

## Dove finiscono i dati nell'app

`poi.js` → `window.POI[chiave]`, un array ordinato per km. Ogni voce:
`{t:"c"}` centro raggruppato (con conteggi `ne`/`ns`/`nf`), `{t:"a"|"m"|"d"}`
singolo punto (fontana / mangiare / dormire); `lat`/`lng` presenti dove serve
il bottone Prenota (centra la mappa Stay22 su quel punto).
