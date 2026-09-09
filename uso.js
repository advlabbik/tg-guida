/* Quante persone usano l'app e quali funzioni.
   Il disegno, con le ragioni di ogni scelta, sta in
   docs/superpowers/specs/2026-09-08-analytics-uso-design.md

   E' un file a se' e non un pezzo di app.js per due motivi: app.js e' gia' a
   2.200 righe, e questo sottosistema e' l'unico del motore che si puo' provare
   in Node senza browser — cosa che vale piu' della vicinanza al codice che lo
   chiama. */
window.USO = (function(){
  const CFG = window.EVENTO_CONFIG;
  const K = n => CFG.prefissoStorage + '-' + n;
  const ATTIVO = CFG.analytics === true;

  /* Il vocabolario. DEVE coincidere alla lettera con l'elenco dentro
     `uso_conteggi_validi` sul database: un nome che sta di qua e non di la'
     viene rifiutato dall'inserimento, e non lo segnala nessuno.
     E' anche cio' che tiene la misurazione dentro le condizioni che la
     esentano dal banner di consenso — aggiungere qualcosa "gia' che ci siamo"
     e' il modo in cui quell'esenzione cade. */
  const NOMI = [
    'apertura',
    'scheda:home', 'scheda:percorso', 'scheda:info', 'scheda:dormire', 'scheda:live',
    'bisogno:acqua', 'bisogno:cibo', 'bisogno:spesa',
    'gps:acceso', 'gps:negato', 'posizione:condivisa',
    'alloggi:mappa', 'alloggi:salto60', 'alloggi:salto100', 'alloggi:prenota',
    'info:cerca', 'cerca:globale',
    'percorso:vista', 'percorso:gpx',
    'lingua:cambiata', 'maps:cerca'
  ];

  /* Ora LOCALE, non toISOString(): quella da' la data UTC, e fra mezzanotte e
     le due in Italia e' ancora ieri. E' la stessa trappola gia' pagata su
     stayNotti(), nella mappa degli alloggi. */
  function oggi(d){
    d = d || new Date();
    const due = x => String(x).padStart(2, '0');
    return d.getFullYear() + '-' + due(d.getMonth() + 1) + '-' + due(d.getDate());
  }

  /* Un codice casuale che si rigenera ogni notte. Risponde a "quante persone
     oggi" senza essere un identificativo persistente — e' quella la differenza
     che tiene fuori il banner. Il giorno fa parte della chiave, quindi il
     codice di ieri non si puo' recuperare nemmeno volendo. */
  function codiceDelGiorno(giorno){
    const chiave = K('uso-codice-' + giorno);
    let c = null;
    try { c = localStorage.getItem(chiave); } catch (e){}
    if (c && /^[A-Za-z0-9]{16}$/.test(c)) return c;
    const alfabeto = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const b = new Uint8Array(16);
    (window.crypto || crypto).getRandomValues(b);
    c = Array.from(b, x => alfabeto[x % alfabeto.length]).join('');
    salva(chiave, c);
    scordaCodiciVecchi(chiave);
    return c;
  }

  /* I codici dei giorni passati vanno buttati, non lasciati li'. Tenerli
     significa avere sul telefono l'elenco di tutti i giorni in cui la persona
     ha usato l'app, e quello e' esattamente l'identificativo che dura nel
     tempo che questo disegno ha rinunciato ad avere per restare fuori dal
     banner di consenso. Senza questa riga il commento qui sopra sarebbe falso. */
  function scordaCodiciVecchi(tieni){
    const prefisso = K('uso-codice-');
    /* `length`/`key(i)` e non Object.keys: e' l'API dello Storage, quella che
       esiste ovunque. E si raccoglie PRIMA di cancellare, perche' togliendo
       una chiave gli indici di quelle dopo scalano e se ne salterebbe una. */
    const daButtare = [];
    try {
      for (let i = 0; i < localStorage.length; i++){
        const k = localStorage.key(i);
        if (k && k.indexOf(prefisso) === 0 && k !== tieni) daButtare.push(k);
      }
    } catch (e){ return; }
    daButtare.forEach(butta);
  }

  const CHIAVE = K('uso');
  /* Oltre questo, i lotti piu' vecchi si buttano. Un telefono spento per una
     settimana non deve tornare con un archivio. */
  const MAX_LOTTI = 8;
  /* E soprattutto si scarta per ETA', come chiede la spec — «oltre qualche
     giorno di arretrato i lotti piu' vecchi si buttano». Tre giorni e' la
     stessa finestra che accetta `uso_rate_ok` sul database.
     Non e' rifinitura: oltre quella finestra il database rifiuta, e lo fa con
     lo STESSO 403 con cui dice «hai spedito troppo», che invece va riprovato.
     Un lotto vecchio in testa alla coda verrebbe quindi riprovato per sempre,
     e siccome al primo rifiuto si esce dal ciclo bloccherebbe anche tutti
     quelli nuovi- l'analytics di quel telefono morirebbe in silenzio, senza
     che nessuno possa accorgersene. */
  const GIORNI_UTILI = 3;

  function leggi(){
    try { const v = JSON.parse(localStorage.getItem(CHIAVE) || '[]');
          return Array.isArray(v) ? v : []; }
    catch (e){ return []; }
  }
  /* Ogni scrittura passa di qui. In Safari in navigazione privata, o con la
     quota piena, `setItem` SOLLEVA — e `conta()` e' la prima riga di
     `openTab()`, quindi l'eccezione fermerebbe il cambio scheda e l'app
     diventerebbe inservibile. Una misurazione non deve mai poter rompere la
     guida che sta misurando. */
  function salva(chiave, valore){
    try { localStorage.setItem(chiave, valore); return true; }
    catch (e){ return false; }
  }
  function butta(chiave){
    try { localStorage.removeItem(chiave); } catch (e){}
  }

  function scrivi(lotti){
    const limite = new Date();
    limite.setDate(limite.getDate() - GIORNI_UTILI);
    const soglia = oggi(limite);
    lotti = lotti.filter(l => l && l.giorno >= soglia);   // '2026-09-09' > '2026-09-06'
    // i piu' recenti in fondo: se si taglia, si taglia da davanti
    if (lotti.length > MAX_LOTTI) lotti = lotti.slice(lotti.length - MAX_LOTTI);
    if (!lotti.length) butta(CHIAVE);
    else salva(CHIAVE, JSON.stringify(lotti));
  }

  function conta(nome){
    if (!ATTIVO) return;
    /* Un nome fuori vocabolario non entra e non fa danni: il database lo
       rifiuterebbe comunque, e con lui l'INTERO lotto. Meglio scartarlo qui. */
    if (NOMI.indexOf(nome) < 0){
      console.warn('USO: contatore sconosciuto, ignorato —', nome);
      return;
    }
    const g = oggi();
    const c = codiceDelGiorno(g);
    const lotti = leggi();
    let l = lotti.find(x => x.giorno === g && x.codice === c);
    if (!l){ l = { giorno: g, codice: c, conteggi: {} }; lotti.push(l); }
    l.conteggi[nome] = (l.conteggi[nome] || 0) + 1;
    scrivi(lotti);
  }

  /* `apertura` vuole dire "una persona ha aperto la guida", e una sessione
     della scheda e' la cosa che gli somiglia di piu'. Non un caricamento: la
     pagina si ricarica DA SOLA quando il service worker si aggiorna
     (`controllerchange` in app.js) e quando si cambia lingua, e ogni
     ricaricamento contava un'apertura in piu' — cioe' il giorno che si
     pubblica una versione nuova tutti contano doppio.
     `sessionStorage` dura quanto la scheda- sopravvive al ricaricamento e
     muore quando la scheda si chiude, che e' esattamente la definizione che
     serve. Se il browser non lo lascia usare si conta lo stesso- un'apertura
     in piu' e' un errore piu' piccolo di un'apertura persa. */
  function contaApertura(){
    if (!ATTIVO) return;
    /* Col GIORNO dentro. La guida installata in home resta aperta per giorni e
       a mezzanotte cambia il codice: con un segnaposto senza data, i giorni di
       uso continuo — cioe' proprio i giorni dell'evento — non conterebbero piu'
       nessuna apertura, pur generando un codice nuovo. */
    const chiave = K('uso-apertura-' + oggi());
    if (daSessione(chiave) === '1') return;
    ricordaInSessione(chiave, '1');
    conta('apertura');
  }

  function lotti(){ return ATTIVO ? leggi() : []; }

  /* Il server ha confermato `partito`. Si sottrae ESATTAMENTE quello, non si
     azzera: mentre la richiesta viaggiava l'utente ha continuato a usare
     l'app, e quei tocchi non vanno persi. */
  function confermato(partito){
    if (!ATTIVO || !partito) return;
    const tutti = leggi();
    const l = tutti.find(x => x.giorno === partito.giorno && x.codice === partito.codice);
    if (!l) return;
    for (const nome in partito.conteggi){
      const resta = (l.conteggi[nome] || 0) - partito.conteggi[nome];
      if (resta > 0) l.conteggi[nome] = resta;
      else delete l.conteggi[nome];
    }
    scrivi(Object.keys(l.conteggi).length ? tutti : tutti.filter(x => x !== l));
  }

  /* L'avviso ai partecipanti. Non e' un banner di consenso e non ha "accetta"
     ne' "rifiuta": la misurazione sta dentro le condizioni che la esentano dal
     consenso, ma non dal DIRLO. Si mostra una volta e poi non torna piu' —
     alla partenza, sotto la pioggia, una cosa da chiudere due volte e' una
     cosa di troppo. */
  const CHIAVE_AVVISO = K('uso-avviso-visto');
  /* Se il browser non sa scrivere — Safari in navigazione privata, quota piena
     — la scelta non si puo' ricordare fra un'apertura e l'altra, ma almeno
     dentro la sessione si', altrimenti l'avviso tornerebbe a ogni apertura per
     sempre. Che e' esattamente il contrario di «si mostra una volta». */
  /* In `sessionStorage` e non in una variabile del modulo: la pagina si
     ricarica da sola al cambio lingua e quando il service worker si aggiorna,
     e una variabile muore li'. La scheda invece e' la stessa, e la scelta di
     chi l'ha chiuso deve valere almeno per quella. */
  function ricordaInSessione(chiave, valore){
    try { const ss = window.sessionStorage; if (ss) ss.setItem(chiave, valore); }
    catch (e){}
  }
  function daSessione(chiave){
    try { const ss = window.sessionStorage; return ss ? ss.getItem(chiave) : null; }
    catch (e){ return null; }
  }

  /* Ultima rete, per il browser che non lascia usare nemmeno sessionStorage.
     Vale solo per questo caricamento, ma e' sempre meglio di un avviso che
     ricompare mentre la persona lo sta chiudendo. Le tre memorie sono una la
     rete dell'altra- questa il caricamento, la sessione la scheda, il
     localStorage per sempre. */
  let avvisoChiusoOra = false;

  function avvisoDaMostrare(){
    if (!ATTIVO || avvisoChiusoOra) return false;
    if (daSessione(CHIAVE_AVVISO) === '1') return false;
    let v = null;
    try { v = localStorage.getItem(CHIAVE_AVVISO); } catch (e){}
    return v !== '1';
  }
  function avvisoChiuso(){
    if (!ATTIVO) return;
    avvisoChiusoOra = true;
    ricordaInSessione(CHIAVE_AVVISO, '1');
    salva(CHIAVE_AVVISO, '1');
  }

  const URL_USO = CFG.backend.supabaseUrl + '/rest/v1/uso';
  let contesto = () => ({ fase: null, lingua: null, standalone: null });
  let inCorso = false;
  let ultimoInvio = 0;

  /* Il database rifiuta oltre 30 inserimenti all'ora per codice
     (`uso_rate_ok`, tetto 2). Spedire ogni due minuti fa ESATTAMENTE 30
     all'ora, e ogni volta che lo schermo si spegne parte un invio in piu': un
     partecipante normale sfonderebbe il tetto proprio nell'ora in cui usa di
     piu' la guida. Tre minuti fra un invio e l'altro fanno al massimo venti
     all'ora, che sta sotto con margine. */
  const MIN_FRA_INVII = 180000;
  /* `ultimoInvio` si segna quando la risposta ARRIVA, cioe' qualche
     millisecondo dopo il battito che l'ha fatta partire. Senza questo
     margine il battito successivo, che cade a 180.000 ms esatti, trova il
     tempo trascorso di un soffio sotto la soglia e salta: il periodo vero
     diventerebbe sei minuti invece di tre, e un telefono chiuso e mai piu'
     riaperto porterebbe via il doppio dei conteggi. */
  const MARGINE = 5000;

  async function spedisci(forzato){
    if (!ATTIVO || inCorso) return;
    if (!forzato && Date.now() - ultimoInvio < MIN_FRA_INVII - MARGINE) return;
    const coda = leggi();
    if (!coda.length) return;
    inCorso = true;
    try {
      const ctx = contesto() || {};
      for (const l of coda){
        // fotografia PRIMA della richiesta: quello che arriva dopo non e' partito
        const partito = { giorno: l.giorno, codice: l.codice,
                          conteggi: Object.assign({}, l.conteggi) };
        let res;
        try {
          res = await fetch(URL_USO, {
            method: 'POST',
            keepalive: true,
            headers: {
              'apikey': CFG.backend.anonKey,
              'Authorization': 'Bearer ' + CFG.backend.anonKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              evento_id: CFG.backend.eventoId,
              giorno: partito.giorno,
              codice: partito.codice,
              fase: ctx.fase || null,
              lingua: ctx.lingua || null,
              standalone: ctx.standalone === true,
              conteggi: partito.conteggi
            })
          });
        } catch (e){
          /* Nessun campo. Il lotto resta in coda e riparte al prossimo giro:
             l'app vive su strade di montagna, e questo e' il caso normale, non
             l'eccezione. */
          break;
        }
        ultimoInvio = Date.now();
        if (!res) break;
        if (!res.ok){
          /* Un rifiuto DEFINITIVO — forma sbagliata, evento inesistente — non
             diventa valido riprovandolo, e siccome qui si esce dal ciclo
             bloccherebbe anche tutti i lotti successivi finche' il tetto del
             buffer non li mangia. Si butta e si va avanti.
             L'elenco e' ESPLICITO, e non "tutti i 4xx tranne il 429", perche'
             il rifiuto piu' frequente di tutti e' un 403: `uso_rate_ok` e' il
             `with check` della policy RLS, quindi quando un tetto scatta
             PostgreSQL solleva 42501 e PostgREST risponde 403, mai 429.
             Buttare i 403 significava cancellare i conteggi proprio nell'ora
             di punta — l'ora che si vuole misurare. */
          const DEFINITIVI = [400, 404, 405, 409, 413, 422];
          const definitivo = DEFINITIVI.indexOf(res.status) >= 0;
          if (definitivo){ confermato(partito); continue; }
          break;
        }
        confermato(partito);
      }
    } finally { inCorso = false; }
  }

  /* Tre momenti. `visibilitychange` e' l'unico segnale affidabile di "me ne sto
     andando" sul telefono: `beforeunload` su iOS non arriva. */
  function avvia(dammiContesto){
    if (typeof dammiContesto === 'function') contesto = dammiContesto;
    if (!ATTIVO) return;
    if (typeof document !== 'undefined'){
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') spedisci();
      });
      setInterval(spedisci, MIN_FRA_INVII);
    }
    spedisci(true); // svuota quello rimasto dalla volta prima, senza aspettare
  }

  return { NOMI, oggi, codiceDelGiorno, conta, contaApertura, lotti, confermato,
           spedisci, avvia, avvisoDaMostrare, avvisoChiuso, attivo: ATTIVO };
})();
