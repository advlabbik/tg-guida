# Il backend di questa guida

Le notifiche push, il feed Comunicazioni e i feedback dei partecipanti sono
l'unica parte dell'app che ha bisogno di un server. Tutto il resto gira senza.

## Dove sta

Progetto Supabase **`guide-eventi`** (`tokqvqrebunfshjtpkog`), condiviso da
tutte le app-evento. Le tabelle sono comuni — `eventi`, `push_subscriptions`,
`broadcast_messages`, `feedback` e le due di rate limit — e ogni riga porta un
`evento_id`. Il Trentino Gravel è la riga `trentino-gravel`, il cui uuid sta in
`config.js` (`window.TG_EVENTO_ID`).

`migrations/` è la storia dello schema, ed è storia condivisa: da qui è nato
quello che oggi usano anche le altre app-evento.

## La Edge Function non vive più qui

Dal 27/8/2026 `staff.html` chiama **`invia-comunicazione`**, che è una sola per
tutti gli eventi e il cui sorgente sta in
[`advlabbik/event-app-template`](https://github.com/advlabbik/event-app-template),
in `supabase/functions/invia-comunicazione/`. **Questa repo non la deploya**: se
va cambiata, si cambia là e si rideploya una volta sola.

Prima c'era `tg-send-broadcast`, che prendeva l'evento da un secret `EVENTO_SLUG`
e il codice staff da un secret `STAFF_CODE`. Reggeva finché il Trentino era
l'unico evento: i secret di Supabase sono **del progetto**, e il progetto è
condiviso, quindi un solo `STAFF_CODE` sarebbe valso per tutti gli eventi e
chiunque potesse scrivere a uno avrebbe potuto scrivere a tutti. Ora l'evento
viaggia nella richiesta e il codice si legge da `eventi.staff_code`, che è per
evento. `eventi` ha RLS abilitata e zero policy, quindi il codice non esce di lì
— **se un giorno si aggiunge una policy di lettura, quella colonna va esclusa.**

## Il codice staff

Sta in `eventi.staff_code` sulla riga `trentino-gravel`. Si cambia con una riga:

```sql
update public.eventi set staff_code = 'NUOVO' where slug = 'trentino-gravel';
```

Non c'è da ripubblicare niente: `staff.html` non ne ha copia, lo chiede e basta.

## Tre trappole che fanno perdere ore

**Su iPhone il push non esiste in Safari.** `Notification` e `PushManager` li dà
solo alle app aggiunte alla schermata Home. Provando da una scheda normale non
compare nessun errore e non parte nessuna richiesta — sembra che il push sia
rotto mentre non è mai partito. Dal 27/8/2026 la card lo dice, invece di
sparire. Per sapere se qualcuno ci ha davvero provato si guarda
`push_subscribe_attempts`: se è vuota il problema è sul telefono, non nel
database.

**Il deploy della function la mette in `verify_jwt: true`,** e `staff.html`
chiama **senza** header `Authorization` — il suo controllo d'accesso è il codice
staff. Con il JWT acceso risponde il gateway `401` prima che la function parta:
pannello rotto e log della function vuoto, perché non è mai stata eseguita.
Serve `--no-verify-jwt`. Per capire se è viva, chiamarla con un codice
sbagliato: `403` = ci è arrivata, `401` = non ci è mai arrivata.

**`anon` può scrivere ma non rileggere.** Le policy sono di solo inserimento. Se
si prova una scrittura a mano con `Prefer: return=representation` torna un `401`
con «new row violates row-level security policy», che sembra una policy
sbagliata e non lo è: la riga viene scritta, è la rilettura a essere negata.

## I feedback

Il modale "Qualcosa non funziona?" scrive in `feedback` con l'`evento_id` di
questa app, e un trigger `pg_net` chiama il webhook n8n che li porta su Slack in
`#feedback-app`.
