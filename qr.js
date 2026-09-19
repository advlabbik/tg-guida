// Il QR personale del ritiro pacco.
//
// L'app non sa chi ha davanti: il codice d'accesso e' uguale per tutti. Il QR
// arriva da fuori, dentro l'indirizzo — ?qr=GA26.346.d5412d7424 — dal link
// dell'email del ritiro pacco o dall'area account del sito. Questo file lo
// legge, lo controlla, decide se salvarlo e quale mostrare. Il disegno sta in
// app.js, con lean-qr.
//
// Espone window.QR e non conosce nient'altro del motore, come uso.js: cosi' si
// prova in Node con scripts/prova-qr.mjs, caricando il file vero.
//
// Il piano, con le alternative scartate: docs/qr-personale.md

window.QR = (function () {
  const CFG = window.EVENTO_CONFIG;
  // NASCE SPENTA. Spenta vuol dire niente scritture nel browser e nessuna
  // scheda — ma il parametro si toglie comunque dall'indirizzo (vedi sotto).
  const ATTIVO = CFG.qr === true;
  const CHIAVE = CFG.prefissoStorage + '-qr';
  // Il codice arrivato col link vive anche qui — stessa scheda, si perde
  // chiudendola. L'indirizzo e' gia' pulito quando arriva un cambio di lingua
  // o il ricaricamento automatico di una versione nuova: senza questo il QR
  // dell'amico sparirebbe in quel momento.
  const CHIAVE_LINK = CFG.prefissoStorage + '-qr-link';

  // Sigla di due lettere e l'anno, il pettorale senza zeri e al massimo di
  // cinque cifre, dieci caratteri esadecimali. Verificata l'11/9/2026 su 558
  // codici di Germany/Austria e 517 del Trentino Gravel, fatti da due
  // generatori diversi. Tutto il resto si scarta: questa stringa finisce dentro
  // un'immagine e dentro la pagina.
  // Quel numero e' il PETTORALE, non il numero d'ordine di WooCommerce, che le
  // sei cifre le passa senza fatica: se un domani il generatore ci mettesse
  // quello, il tetto taglierebbe fuori tutti senza che si capisca perche'.
  // Il tetto alle cifre serve da quando il codice si puo' anche incollare a
  // mano: un pettorale di mille cifre passerebbe, e la scheda si sfonderebbe —
  // il numero si stampa lo stesso, mentre il QR non si disegna perche' un dato
  // cosi' in un QR non ci sta.
  const FORMA = /^[A-Z]{2}\d{2}\.[1-9]\d{0,4}\.[0-9a-f]{10}$/;

  // I tokens.csv del generatore hanno le righe alla Windows: un "\r" in coda
  // arriva fin dentro i link, se chi li costruisce non lo toglie.
  function pulisci(v) { return String(v == null ? '' : v).trim(); }
  function valido(v) { return FORMA.test(pulisci(v)); }
  function numero(token) { return pulisci(token).split('.')[1]; }

  // In certi browser privati sessionStorage lancia anche solo a leggerlo.
  function leggiSessione() { try { return sessionStorage.getItem(CHIAVE_LINK); } catch (e) { return null; } }
  function scriviSessione(v) { try { sessionStorage.setItem(CHIAVE_LINK, v); } catch (e) { /* browser privato: resta solo in memoria */ } }

  // Il codice arrivato con l'indirizzo in questa apertura, se c'e'. Spenta non
  // legge nemmeno sessionStorage.
  let dalLink = null;
  if (ATTIVO) {
    const daSessione = leggiSessione();
    if (valido(daSessione)) dalLink = pulisci(daSessione);
  }
  // Vedi arrivatoDalLink() piu' sotto.
  let arrivato = false;

  function salvato() {
    if (!ATTIVO) return null;
    const v = localStorage.getItem(CHIAVE);
    return valido(v) ? pulisci(v) : null;
  }

  // Legge ?qr= e restituisce la query senza, da rimettere nella barra con
  // history.replaceState. null se il parametro non c'era.
  //
  // Si toglie SEMPRE, anche spenta e anche malformato: il codice e' personale,
  // e lasciato nella barra finirebbe in ogni screenshot e in ogni link
  // condiviso. La stessa ragione per cui lo fa ?code=.
  //
  // L'indirizzo vince sul salvato, ma non lo sovrascrive. Il caso e' voluto:
  // uno passa il proprio link a un amico perche' gli faccia il check-in. Se
  // l'amico e' iscritto anche lui, senza questa regola si ritroverebbe per
  // sempre il QR di un altro al posto del suo.
  function leggiIndirizzo(search) {
    const q = new URLSearchParams(search);
    if (!q.has('qr')) return null;
    const v = pulisci(q.get('qr'));
    q.delete('qr');
    if (ATTIVO && valido(v)) {
      dalLink = v;
      arrivato = true;
      scriviSessione(v);
      if (!salvato()) localStorage.setItem(CHIAVE, v);
    }
    return q.toString();
  }

  // Vero solo se in questa apertura l'indirizzo portava un QR valido e la
  // funzione e' accesa; un QR tornato da sessionStorage dopo un ricaricamento
  // non conta. Serve ad app.js per decidere se aprire Info da solo.
  function arrivatoDalLink() { return arrivato; }

  // Rende salvato il QR arrivato dal link, per il caso in cui e' davvero il
  // proprio (l'iscritto aveva aperto per primo il link di un amico). Vero solo
  // se accesa e c'e' un codice arrivato dal link; altrimenti non scrive niente.
  function salvaComeMio() {
    if (!ATTIVO || !dalLink) return false;
    localStorage.setItem(CHIAVE, dalLink);
    return true;
  }

  // Il codice incollato a mano, dentro l'app.
  //
  // Su iPhone l'app aggiunta alla schermata Home ha un salvataggio tutto suo,
  // separato da Safari e dal browser di Gmail: il QR salvato aprendo il link
  // li' dentro non c'e', e l'app installata parte vuota. Chi aveva gia'
  // l'icona sul telefono quando e' arrivata l'email non ha nessun altro modo
  // di portarcelo — il link, aperto da Gmail, finisce sempre nel browser.
  // Provato su un iPhone vero l'11 settembre 2026, issue #38.
  //
  // Si accetta sia il link intero dell'email sia il solo codice, perche' chi e'
  // in fila copia quello che gli capita sotto il dito.
  //
  // Qui il salvato si sovrascrive, al contrario del link che non lo tocca mai:
  // questo lo sta incollando la persona, apposta. Per la stessa ragione smette
  // di mostrarsi il codice di un altro arrivato da un link.
  function accetta(testo) {
    if (!ATTIVO) return false;
    const t = pulisci(testo);
    if (!t) return false;
    const link = /[?&]qr=([^&#\s]+)/.exec(t);
    let v;
    if (link) {
      // Dal link si prende quello che c'e', senza aggiustarlo. Quei link li
      // costruisce una macchina, e l'indirizzo nella barra e' altrettanto
      // severo — lo stesso link accettato qui e rifiutato li' sarebbe una
      // differenza da mezz'ora persa a capirla.
      try { v = decodeURIComponent(link[1]); } catch (e) { v = link[1]; }
    } else {
      // Chi il codice lo digita invece di incollarlo scrive la sigla minuscola,
      // e la tastiera del telefono non gliela corregge. Gli esadecimali restano
      // come sono, minuscoli li vuole la forma.
      v = t.replace(/^[a-zA-Z]{2}/, s => s.toUpperCase());
    }
    v = pulisci(v);
    if (!valido(v)) return false;
    // Memoria piena, o navigazione privata sui vecchi iPhone: chi ha toccato il
    // pulsante deve vedere la riga d'errore, non restare senza risposta.
    try { localStorage.setItem(CHIAVE, v); } catch (e) { return false; }
    dalLink = null;
    arrivato = false;
    try { sessionStorage.removeItem(CHIAVE_LINK); } catch (e) { /* browser privato */ }
    return true;
  }

  // Cosa mostrare.
  //   null                  spenta, niente scheda
  //   { token: null }       accesa ma senza QR: lo stato vuoto
  //   { token, daLink }     daLink e' true se il QR del link non e' il proprio
  function daMostrare() {
    if (!ATTIVO) return null;
    const mio = salvato();
    if (dalLink) return { token: dalLink, daLink: !!mio && mio !== dalLink };
    return { token: mio, daLink: false };
  }

  return { attivo: ATTIVO, valido: valido, numero: numero, leggiIndirizzo: leggiIndirizzo, daMostrare: daMostrare, salvaComeMio: salvaComeMio, arrivatoDalLink: arrivatoDalLink, accetta: accetta };
})();
