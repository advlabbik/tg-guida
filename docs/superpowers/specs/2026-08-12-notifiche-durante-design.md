# Notifiche push — comunicazioni staff durante l'evento

Data: 2026-08-12
Evento: Trentino Gravel — Pioneer Edition, 26 settembre 2026
Repo: `advlabbik/tg-guida`

## Contesto

`tg-guida` è la PWA vanilla JS che accompagna i partecipanti prima/durante/dopo l'evento (vedi `docs/superpowers/specs/2026-08-12-golive-restyle-design.md` per il contesto generale del progetto). Oggi non esiste alcuna forma di comunicazione in tempo reale tra lo staff BAS e i partecipanti: verificato che la feature non è tracciata da nessuna issue, piano o riga di codice esistente.

## Obiettivo

Dare allo staff BAS un modo di mandare comunicazioni testuali in tempo reale a tutti i partecipanti il giorno dell'evento (fase "durante"), tramite notifica push del browser, con un fallback in-app per chi non può riceverla.

## Perimetro

### Dentro

- Notifica push di sistema (Web Push, VAPID) inviata a tutti i partecipanti iscritti.
- Opt-in del partecipante: bottone "Attiva notifiche evento" nella tab Live, visibile già dalla fase "prima".
- Fallback in-app: sezione "Comunicazioni" nella tab Live (visibile solo in fase "durante") con lo storico dei messaggi inviati, per chi non riceve il push.
- Pagina staff separata per scrivere e inviare il messaggio (titolo + corpo), protetta da un codice-gate dedicato, diverso da quello dei partecipanti.
- Backend: due tabelle + una Edge Function nel progetto Supabase esistente `kqsr` (`kqsrtuzeeiljozdnjott`).

### Fuori (esplicitamente rimandato)

- Livelli di urgenza/colore del messaggio (icone alert, terracotta, ecc.).
- Link opzionali dentro il messaggio.
- Aggiornamento realtime del feed in-app (si aggiorna all'apertura/refresh della tab, non via socket).
- Targeting per percorso/gruppo — l'invio è sempre a tutti i partecipanti iscritti.
- Autenticazione staff reale — resta un codice-gate deterrente, non sicurezza vera.
- Notifiche automatiche generate dal sistema (meteo, POI, avvisi rifornimenti) — solo comunicazioni manuali scritte da una persona.

## Vincolo tecnico noto: iOS

Su iOS/Safari, il Web Push funziona solo se la PWA è installata sulla home screen (`display: standalone`), non nel browser normale, e solo da iOS 16.4 in su. Chi non installa la guida non riceverà mai la notifica push — da qui il fallback in-app descritto sopra, che copre chiunque riapra l'app durante l'evento indipendentemente dal push.

## Componenti

### 1. Client (`tg-guida`)

**Opt-in.** Un bottone "Attiva notifiche evento" nella tab Live, visibile da fase "prima" in poi (non si aspetta la fase "durante" per chiedere il permesso — il giorno dell'evento, in bici, è il momento peggiore per farlo). Al tap:
- richiede il permesso `Notification`;
- se concesso, esegue `pushManager.subscribe()` con la chiave pubblica VAPID;
- salva la subscription su Supabase con un insert diretto in `tg_push_subscriptions` (anon key, RLS insert-only: il client non può leggere/modificare/cancellare subscription altrui).

Se il browser non supporta `PushManager` (tipicamente iOS non installato su home), il bottone non compare — nessun messaggio d'errore.

**Ricezione.** In `sw.js` si aggiungono due listener:
- `push`: mostra la notifica di sistema via `self.registration.showNotification(title, {body})`;
- `notificationclick`: chiude la notifica e porta il focus/apre `tg-guida` sulla tab Live.

**Fallback in-app.** Nuova sezione "Comunicazioni" in cima alla tab Live, visibile solo quando `fase === 'durante'`. Al momento in cui la tab viene aperta, legge (anon select) `tg_broadcast_messages` ordinati per data decrescente e li renderizza come lista semplice (titolo, corpo, ora). Nessun polling né realtime: si aggiorna riaprendo/rientrando nella tab.

### 2. Pagina staff

Una pagina statica separata nel repo (es. `staff.html`), sempre raggiungibile (nessun blocco lato server legato alla fase). Protetta da un codice-gate proprio, distinto da `PIONEER26`, con lo stesso meccanismo già usato in `index.html` (`localStorage` + confronto stringa — deterrente, non sicurezza vera, stessa postura del resto del progetto).

Form con due campi (titolo, corpo) e un pulsante di invio, che chiama la Edge Function `tg-send-broadcast` passando `{title, body}`.

### 3. Backend (Supabase, progetto `kqsr`)

**Tabelle nuove:**
- `tg_push_subscriptions` — `id`, `endpoint` (unique), `p256dh`, `auth`, `created_at`. RLS: insert pubblico (anon), nessuna select/update/delete pubblica.
- `tg_broadcast_messages` — `id`, `title`, `body`, `created_at`. RLS: select pubblica (anon, per il feed in-app), insert/update/delete solo da service role (Edge Function).

**Edge Function `tg-send-broadcast`:**
1. Riceve `{title, body}` dalla pagina staff.
2. Inserisce la riga in `tg_broadcast_messages` (fonte di verità per il feed in-app, scritta prima dell'invio push così il messaggio esiste anche se l'invio push fallisce parzialmente).
3. Legge tutte le righe di `tg_push_subscriptions`.
4. Invia il push a ciascuna subscription con la libreria `web-push` (chiavi VAPID nei secrets della function; la chiave pubblica è hardcoded lato client come per `GATE_CODE`).
5. Per ogni subscription che risponde 404/410 (scaduta/revocata), la cancella da `tg_push_subscriptions`.

## Data flow

```
Staff scrive messaggio (staff.html, dietro codice-gate dedicato)
  → POST alla Edge Function tg-send-broadcast
    → insert su tg_broadcast_messages (feed in-app aggiornato)
    → invio Web Push a tutte le subscription in tg_push_subscriptions
      → browser dei partecipanti iscritti mostra la notifica di sistema (sw.js → push)
      → tap sulla notifica apre tg-guida sulla tab Live
  → chi non riceve il push (iOS non installato, permesso negato, offline al momento dell'invio)
    vede comunque il messaggio riaprendo l'app durante la fase "durante" (sezione Comunicazioni)
```

## Rischio accettato

La pagina staff è protetta solo da un codice-gate client-side — stesso livello "deterrente non sicurezza vera" dichiarato nel README per `GATE_CODE`. Chiunque ottenga il codice staff può inviare comunicazioni a tutti i partecipanti; non c'è verifica di identità reale. Accettato per coerenza con la postura di sicurezza esistente del progetto e per lo scope ridotto (evento singolo, 3 giorni).

## Testing

- Subscribe/unsubscribe su Chrome desktop e Android (percorso principale Web Push).
- Verifica esplicita che su iOS senza installazione la sezione opt-in sparisca senza errori, e che il fallback in-app mostri comunque i messaggi.
- Invio da `staff.html` con codice sbagliato → nessun accesso alla form.
- Edge Function: subscription scaduta (404/410) viene rimossa da `tg_push_subscriptions` dopo un invio.
- Messaggio inviato prima che un partecipante faccia opt-in: al successivo opt-in non riceve i messaggi passati via push (comportamento atteso del Push API), ma li vede aprendo la sezione Comunicazioni.
