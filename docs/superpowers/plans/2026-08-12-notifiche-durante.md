# Notifiche push — comunicazioni staff durante l'evento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dare allo staff BAS un modo di mandare comunicazioni testuali in tempo reale a tutti i partecipanti durante l'evento (fase "durante"), via Web Push del browser, con un fallback in-app per chi non riceve il push.

**Architecture:** Web Push standard (VAPID) con backend nel progetto Supabase esistente `kqsr`. Due tabelle nuove e una Edge Function ricevono il messaggio dalla pagina staff, lo salvano (fonte di verità per il feed in-app) e lo inviano via push a tutte le subscription valide. Il client (`tg-guida`, vanilla JS, nessun build step) fa opt-in già dalla fase "prima", riceve il push via `sw.js`, e mostra uno storico dei messaggi nella tab Live durante la fase "durante".

**Tech Stack:** HTML/CSS/vanilla JS lato client (nessuna dipendenza npm aggiunta), Supabase (Postgres + REST + Edge Function Deno), libreria `web-push` via `npm:` specifier nella Edge Function, VAPID.

## Global Constraints

- Spec di riferimento: `docs/superpowers/specs/2026-08-12-notifiche-durante-design.md`.
- Progetto Supabase: `kqsrtuzeeiljozdnjott` (alias `kqsr`), region eu-west-1.
- URL Supabase: `https://kqsrtuzeeiljozdnjott.supabase.co`.
- Publishable/anon key (pubblica per design, protetta da RLS): `sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih`.
- `tg-guida` è vanilla JS senza build step (GitHub Pages) — nessuna dipendenza npm va aggiunta al client. La Edge Function gira su Deno/Supabase, separata dal client: lì i pacchetti npm (`npm:` specifier) sono ammessi.
- Pattern di sicurezza esistente nel progetto: codice-gate client-side, deterrente non sicurezza vera (`GATE_CODE` in `index.html`). Il nuovo codice staff segue lo stesso pattern, con un valore diverso.
- Regola di copy del progetto (da `content.js`): mai i due punti `:` nella prosa dei testi (ok solo negli orari).
- Su iOS/Safari il Web Push funziona solo con la PWA installata sulla home screen, da iOS 16.4 in su — nessuna azione nel codice, ma è il motivo del fallback in-app (Task 5) e va verificato esplicitamente nel test finale (Task 7).

---

### Task 1: Schema Supabase — tabelle `tg_push_subscriptions` e `tg_broadcast_messages`

**Files:**
- Nessun file nel repo `tg-guida` — la migrazione va applicata direttamente al progetto Supabase `kqsrtuzeeiljozdnjott` con il tool `mcp__supabase__apply_migration` (il repo non ha un `supabase/` locale collegato a questo progetto).

**Interfaces:**
- Produce: tabella `tg_push_subscriptions(id uuid, endpoint text unique, p256dh text, auth text, created_at timestamptz)`, insert pubblico (anon), nessuna select/update/delete pubblica.
- Produce: tabella `tg_broadcast_messages(id uuid, title text, body text, created_at timestamptz)`, select pubblica (anon), insert/update/delete solo da service role.

- [ ] **Step 1: Applica la migrazione**

Chiama `mcp__supabase__apply_migration` con `project_id: "kqsrtuzeeiljozdnjott"`, `name: "tg_push_notifications"` e questo `query`:

```sql
create table if not exists public.tg_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.tg_push_subscriptions enable row level security;

create policy "tg_push_subscriptions_insert_anon"
  on public.tg_push_subscriptions
  for insert
  to anon
  with check (true);

create table if not exists public.tg_broadcast_messages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.tg_broadcast_messages enable row level security;

create policy "tg_broadcast_messages_select_anon"
  on public.tg_broadcast_messages
  for select
  to anon
  using (true);
```

- [ ] **Step 2: Verifica RLS con una insert/select di prova**

Chiama `mcp__supabase__execute_sql` con `project_id: "kqsrtuzeeiljozdnjott"` e:

```sql
select tablename, policyname, cmd, roles
from pg_policies
where tablename in ('tg_push_subscriptions', 'tg_broadcast_messages')
order by tablename, cmd;
```

Expected: due righe — `tg_push_subscriptions` con `cmd = INSERT`, `roles = {anon}`; `tg_broadcast_messages` con `cmd = SELECT`, `roles = {anon}`. Nessun'altra policy per `anon`.

- [ ] **Step 3: Verifica manuale via REST che l'insert anon funzioni e la select su subscriptions sia bloccata**

```bash
curl -s -X POST 'https://kqsrtuzeeiljozdnjott.supabase.co/rest/v1/tg_push_subscriptions' \
  -H 'apikey: sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih' \
  -H 'Authorization: Bearer sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih' \
  -H 'Content-Type: application/json' \
  -d '{"endpoint":"https://example.com/test-endpoint","p256dh":"test","auth":"test"}'

curl -s 'https://kqsrtuzeeiljozdnjott.supabase.co/rest/v1/tg_push_subscriptions?select=*' \
  -H 'apikey: sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih' \
  -H 'Authorization: Bearer sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih'
```

Expected: il POST risponde `201` (o corpo vuoto con status 2xx); il GET risponde `200` con un array vuoto `[]` (RLS blocca la select anon, non ritorna errore ma nessuna riga).

- [ ] **Step 4: Pulisci la riga di test**

Chiama `mcp__supabase__execute_sql` con:

```sql
delete from public.tg_push_subscriptions where endpoint = 'https://example.com/test-endpoint';
```

---

### Task 2: Chiavi VAPID ed Edge Function `tg-send-broadcast`

**Files:**
- Deploy diretto su Supabase (progetto `kqsrtuzeeiljozdnjott`) con `mcp__supabase__deploy_edge_function` — nessun file nel repo `tg-guida` (coerente con Task 1: il repo non gestisce localmente lo schema/le function di `kqsr`).

**Interfaces:**
- Consuma: le tabelle `tg_push_subscriptions` e `tg_broadcast_messages` di Task 1.
- Produce: endpoint `POST https://kqsrtuzeeiljozdnjott.supabase.co/functions/v1/tg-send-broadcast`, body `{title: string, body: string, staffCode: string}`, risposta `{sent: number, removed: number, total: number}` (200) o `{error: string}` (400/403/500). CORS aperto (`Access-Control-Allow-Origin: *`) per essere chiamabile da `staff.html` su GitHub Pages.
- Produce: la chiave pubblica VAPID generata in questo task, che serve al client in Task 3 (`VAPID_PUBLIC_KEY`).

- [ ] **Step 1: Genera la coppia di chiavi VAPID**

Azione manuale da terminale (richiede Node.js, nessuna dipendenza permanente aggiunta al repo):

```bash
npx web-push generate-vapid-keys
```

Annota i due valori stampati, `Public Key` e `Private Key` — servono agli step successivi e al Task 3.

- [ ] **Step 2: Imposta i secrets della Edge Function**

Azione manuale da terminale, richiede login Supabase CLI con le credenziali del progetto (`npx supabase login`, una tantum se non già fatto — flusso OAuth interattivo nel browser, non delegabile a un subagent):

```bash
npx supabase secrets set \
  VAPID_PUBLIC_KEY=<Public Key dello Step 1> \
  VAPID_PRIVATE_KEY=<Private Key dello Step 1> \
  VAPID_SUBJECT=mailto:info@bikeadventureseries.com \
  STAFF_CODE=PIONEER26-STAFF \
  --project-ref kqsrtuzeeiljozdnjott
```

`STAFF_CODE` qui è un valore segnaposto (stesso pattern di `GATE_CODE = 'PIONEER26'` in `index.html`) — Francesco lo sostituirà con il codice reale prima del go-live. Deve combaciare esattamente con `STAFF_CODE` in `staff.html` (Task 6).

- [ ] **Step 3: Deploy della Edge Function**

Chiama `mcp__supabase__deploy_edge_function` con `project_id: "kqsrtuzeeiljozdnjott"`, `name: "tg-send-broadcast"`, `entrypoint_path: "index.ts"`, `verify_jwt: false` (la function non richiede un JWT Supabase — è protetta dal controllo `staffCode` nel corpo della richiesta, stesso livello "deterrente non sicurezza vera" del resto del progetto), e questo file:

`index.ts`:
```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT")!;
const STAFF_CODE = Deno.env.get("STAFF_CODE")!;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Metodo non consentito" }, 405);
  }

  let payload: { title?: string; body?: string; staffCode?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "JSON non valido" }, 400);
  }

  const staffCode = (payload.staffCode ?? "").trim();
  if (staffCode !== STAFF_CODE) {
    return json({ error: "Codice staff non valido" }, 403);
  }

  const title = (payload.title ?? "").trim();
  const body = (payload.body ?? "").trim();
  if (!title || !body) {
    return json({ error: "Titolo e messaggio sono obbligatori" }, 400);
  }

  const { error: insertError } = await supabase
    .from("tg_broadcast_messages")
    .insert({ title, body });
  if (insertError) {
    return json({ error: insertError.message }, 500);
  }

  const { data: subs, error: subsError } = await supabase
    .from("tg_push_subscriptions")
    .select("id, endpoint, p256dh, auth");
  if (subsError) {
    return json({ error: subsError.message }, 500);
  }

  const payloadStr = JSON.stringify({ title, body });
  let sent = 0;
  let removed = 0;

  await Promise.all((subs ?? []).map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    };
    try {
      await webpush.sendNotification(pushSubscription, payloadStr);
      sent++;
    } catch (err) {
      const statusCode = (err as { statusCode?: number })?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await supabase.from("tg_push_subscriptions").delete().eq("id", sub.id);
        removed++;
      }
    }
  }));

  return json({ sent, removed, total: (subs ?? []).length });
});
```

- [ ] **Step 4: Test — codice staff sbagliato viene rifiutato**

```bash
curl -s -i -X POST 'https://kqsrtuzeeiljozdnjott.supabase.co/functions/v1/tg-send-broadcast' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test","body":"Test","staffCode":"codice-sbagliato"}'
```

Expected: status `403`, body `{"error":"Codice staff non valido"}`.

- [ ] **Step 5: Test — invio valido con zero subscription**

```bash
curl -s -i -X POST 'https://kqsrtuzeeiljozdnjott.supabase.co/functions/v1/tg-send-broadcast' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Prova sistema","body":"Messaggio di prova, nessun iscritto ancora","staffCode":"PIONEER26-STAFF"}'
```

Expected: status `200`, body `{"sent":0,"removed":0,"total":0}` (a meno che Task 1 Step 3 non abbia lasciato subscription di test — in quel caso il numero riflette quelle presenti).

- [ ] **Step 6: Verifica che il messaggio sia stato salvato**

Chiama `mcp__supabase__execute_sql` con `project_id: "kqsrtuzeeiljozdnjott"` e:

```sql
select title, body, created_at from public.tg_broadcast_messages order by created_at desc limit 1;
```

Expected: una riga con `title = 'Prova sistema'`.

- [ ] **Step 7: Pulisci il messaggio di test**

```sql
delete from public.tg_broadcast_messages where title = 'Prova sistema';
```

---

### Task 3: Client — opt-in notifiche (bottone "Attiva notifiche evento")

**Files:**
- Modify: `index.html:82` (dopo la definizione di `pendingCta`, prima della sezione `/* ---------- accesso riservato ai partecipanti ---------- */`) — aggiunge le costanti e le funzioni di push.
- Modify: `index.html:523-556` (`renderLive()`) — aggiunge il markup del bottone e il binding.
- Modify: `index.html:180-188` (`openTab()`) — richiama `refreshNotifCard()` ogni volta che si apre la tab Live.

**Interfaces:**
- Consuma: `$()`, `esc()`, `icon()`, `phase()` (già esistenti in `index.html`).
- Produce: `VAPID_PUBLIC_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` (costanti), `pushSupported()`, `refreshNotifCard()`, `activatePush()` — usate anche da Task 5 (`SUPABASE_URL`/`SUPABASE_ANON_KEY`) e richiamabili da `openTab`.

- [ ] **Step 1: Aggiungi le costanti e le funzioni di push**

In `index.html`, subito dopo la riga 82 (`function pendingCta(label){ ... }`), inserisci:

```js
/* ---------- notifiche push ---------- */
const SUPABASE_URL = 'https://kqsrtuzeeiljozdnjott.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kL1z4KhZWlxIpqE55KIQvw_rr3kZbih';
const VAPID_PUBLIC_KEY = '<Public Key generata nel Task 2, Step 1>';

function urlBase64ToUint8Array(base64String){
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g,'+').replace(/_/g,'/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

function pushSupported(){
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

async function refreshNotifCard(){
  const card = $('#notifcard');
  if (!card) return;
  if (!pushSupported()){
    card.style.display = 'none';
    return;
  }
  if (phase() === 'dopo'){
    card.style.display = 'none';
    return;
  }
  card.style.display = '';
  const btn = $('#notifbtn');
  const status = $('#notifstatus');
  if (Notification.permission === 'granted'){
    btn.style.display = 'none';
    status.textContent = 'Notifiche attive. Riceverai le comunicazioni dello staff durante l\'evento.';
  } else if (Notification.permission === 'denied'){
    btn.style.display = 'none';
    status.textContent = 'Notifiche bloccate dal browser. Abilitale dalle impostazioni del sito se vuoi riceverle.';
  } else {
    btn.style.display = '';
    status.textContent = '';
  }
}

async function activatePush(){
  const status = $('#notifstatus');
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted'){
      refreshNotifCard();
      return;
    }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub){
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    const subJson = sub.toJSON();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tg_push_subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ endpoint: subJson.endpoint, p256dh: subJson.keys.p256dh, auth: subJson.keys.auth })
    });
    if (!res.ok && res.status !== 409){
      status.textContent = 'Errore nel salvataggio, riprova.';
      return;
    }
    refreshNotifCard();
  } catch (err){
    status.textContent = 'Errore nell\'attivazione delle notifiche, riprova.';
  }
}
```

Sostituisci `<Public Key generata nel Task 2, Step 1>` con il valore reale annotato in Task 2.

- [ ] **Step 2: Aggiungi il bottone nella tab Live**

In `renderLive()` (riga 523-556), subito dopo `const l = C.live;` (riga 524) e prima di `let h = ...` (riga 525), non serve nulla di nuovo; modifica invece l'assegnazione di `h` aggiungendo il nuovo blocco come primo elemento. Sostituisci la riga:

```js
  let h = `<div class="card"><h2>${icon('crosshair',22)} ${esc(l.gps.titolo)}</h2><p>${esc(l.gps.testo)}</p>
```

con:

```js
  let h = `<div class="card" id="notifcard" style="display:none">
    <h3>${icon('megaphone',20)} Notifiche evento</h3>
    <p>Attiva le notifiche per ricevere le comunicazioni dello staff durante l'evento, anche ad app chiusa.</p>
    <div class="btnrow"><button class="btn" id="notifbtn">Attiva notifiche evento</button></div>
    <p class="muted" id="notifstatus"></p></div>`;
  h += `<div class="card"><h2>${icon('crosshair',22)} ${esc(l.gps.titolo)}</h2><p>${esc(l.gps.testo)}</p>
```

(il resto del template esistente, dal `<p><label class="muted">Il mio percorso</label>` in poi, non cambia).

- [ ] **Step 3: Bind del bottone**

Dopo la riga (ora spostata di poche righe più in basso) `$('#gpsinfo').addEventListener('click', e => { if (e.target.closest('#shareposbtn')) sharePos(); });`, subito prima della chiusura `}` di `renderLive()`, aggiungi:

```js
  $('#notifbtn').addEventListener('click', activatePush);
  refreshNotifCard();
```

- [ ] **Step 4: Aggiorna lo stato quando si apre la tab Live**

In `openTab(name)` (riga 180-188), dopo la riga:

```js
  if (name==='live' && !mapsInit.meteo) { mapsInit.meteo = true; loadMeteoTable(); loadSunset(); }
```

aggiungi:

```js
  if (name==='live') { refreshNotifCard(); }
```

- [ ] **Step 5: Test manuale in browser (Chrome desktop)**

Servi il sito con `npx serve .`, apri `index.html`, sblocca il gate con `PIONEER26`, vai sulla tab Live. Verifica che compaia la card "Notifiche evento" con il bottone (in fase "prima" o "durante" — usa la demobar per forzare la fase se serve). Clicca "Attiva notifiche evento →", concedi il permesso nel prompt del browser. Verifica che il bottone sparisca e appaia "Notifiche attive…".

- [ ] **Step 6: Verifica che la subscription sia salvata**

Chiama `mcp__supabase__execute_sql` con `project_id: "kqsrtuzeeiljozdnjott"`:

```sql
select endpoint, created_at from public.tg_push_subscriptions order by created_at desc limit 1;
```

Expected: una riga recente. Non cancellarla — serve al Task 4.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "Aggiunge opt-in notifiche push nella tab Live"
```

---

### Task 4: Service worker — ricezione push e click sulla notifica

**Files:**
- Modify: `sw.js` (append in fondo al file, dopo il listener `fetch` esistente).

**Interfaces:**
- Consuma: nessuna nuova interfaccia — usa le API standard `push`/`notificationclick` del service worker.

- [ ] **Step 1: Aggiungi i listener push e notificationclick**

In fondo a `sw.js`, dopo la chiusura del listener `fetch` esistente, aggiungi:

```js
self.addEventListener('push', e => {
  let data = { title: 'Trentino Gravel', body: '' };
  try { data = e.data.json(); } catch (err) {}
  e.waitUntil(self.registration.showNotification(data.title || 'Trentino Gravel', {
    body: data.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png'
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
```

- [ ] **Step 2: Bump della cache version**

`sw.js` usa `CACHE = 'tg-guida-v16'` per invalidare la cache ad ogni deploy (vedi `activate` listener che cancella le cache vecchie). Incrementa la versione:

```js
const CACHE = 'tg-guida-v17';
```

- [ ] **Step 3: Test end-to-end del push reale**

Con il sito ancora servito e la subscription di Task 3 Step 6 ancora presente in `tg_push_subscriptions`, invia un push reale:

```bash
curl -s -i -X POST 'https://kqsrtuzeeiljozdnjott.supabase.co/functions/v1/tg-send-broadcast' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test push","body":"Se vedi questa notifica il push funziona","staffCode":"PIONEER26-STAFF"}'
```

Expected: entro pochi secondi compare la notifica di sistema del browser con titolo "Test push". Cliccandola, si apre/riporta il focus su `tg-guida`.

- [ ] **Step 4: Pulisci il messaggio di test**

```sql
delete from public.tg_broadcast_messages where title = 'Test push';
```

(via `mcp__supabase__execute_sql`, `project_id: "kqsrtuzeeiljozdnjott"`)

- [ ] **Step 5: Commit**

```bash
git add sw.js
git commit -m "Aggiunge ricezione notifiche push in sw.js"
```

---

### Task 5: Client — fallback in-app "Comunicazioni" nella tab Live

**Files:**
- Modify: `index.html:82` (stesso blocco di Task 3 Step 1, subito dopo le funzioni di push aggiunte lì) — aggiunge `loadComunicazioni()`.
- Modify: `index.html` — markup in `renderLive()` (subito dopo il blocco `#notifcard` aggiunto in Task 3 Step 2).
- Modify: `index.html` — `openTab()` (stessa riga toccata in Task 3 Step 4).

**Interfaces:**
- Consuma: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (Task 3), `phase()`, `esc()`, `icon()`, `$()`.
- Produce: `loadComunicazioni()`, richiamata da `openTab('live')`.

- [ ] **Step 1: Aggiungi `loadComunicazioni()`**

Subito dopo la funzione `activatePush()` aggiunta in Task 3 Step 1, inserisci:

```js
async function loadComunicazioni(){
  const sec = $('#commssec');
  const list = $('#commslist');
  if (!sec || !list) return;
  if (phase() !== 'durante'){
    sec.style.display = 'none';
    return;
  }
  sec.style.display = '';
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tg_broadcast_messages?select=title,body,created_at&order=created_at.desc`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (!res.ok) throw new Error('fetch fallita');
    const msgs = await res.json();
    list.innerHTML = msgs.length
      ? msgs.map(m => `<div class="avvisi"><h3>${esc(m.title)} · ${new Date(m.created_at).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}</h3><p>${esc(m.body)}</p></div>`).join('')
      : '<p class="muted">Nessuna comunicazione al momento.</p>';
  } catch (err){
    list.innerHTML = '<p class="muted">Non riesco a caricare le comunicazioni. Controlla la connessione.</p>';
  }
}
```

- [ ] **Step 2: Aggiungi la sezione nel markup di `renderLive()`**

Nel blocco aggiunto da Task 3 Step 2, subito dopo la chiusura del `<div class="card" id="notifcard" ...>` e prima di `h += '<div class="card"><h2>...crosshair...'`, aggiungi:

```js
  h += `<div id="commssec" style="display:none">
    <h3 style="margin:4px 0 8px">${icon('megaphone',20)} Comunicazioni</h3>
    <div id="commslist"></div></div>`;
```

- [ ] **Step 3: Richiama `loadComunicazioni()` all'apertura della tab**

Nella riga aggiunta da Task 3 Step 4 in `openTab()`, aggiorna:

```js
  if (name==='live') { refreshNotifCard(); }
```

in:

```js
  if (name==='live') { refreshNotifCard(); loadComunicazioni(); }
```

- [ ] **Step 4: Test manuale — messaggio visibile senza push**

Con la demobar, forza la fase "durante". Vai sulla tab Live: verifica che compaia "Comunicazioni" con "Nessuna comunicazione al momento." Invia un messaggio di prova:

```bash
curl -s -X POST 'https://kqsrtuzeeiljozdnjott.supabase.co/functions/v1/tg-send-broadcast' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Prova feed","body":"Questo deve comparire nella lista","staffCode":"PIONEER26-STAFF"}'
```

Ricarica la pagina (o riapri la tab Live cambiando tab e tornando su Live): verifica che "Prova feed" compaia nella lista con l'orario.

- [ ] **Step 5: Pulisci il messaggio di test**

```sql
delete from public.tg_broadcast_messages where title = 'Prova feed';
```

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Aggiunge feed Comunicazioni in-app nella tab Live"
```

---

### Task 6: Pagina staff (`staff.html`)

**Files:**
- Create: `staff.html`.

**Interfaces:**
- Consuma: `styles.css` (classi `.card`, `.btn`, `.btnrow`, `.muted`, `#gate`, `.box`, `.err` già esistenti), Edge Function `tg-send-broadcast` (Task 2).

- [ ] **Step 1: Crea `staff.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Trentino Gravel · Staff</title>
<meta name="robots" content="noindex, nofollow"/>
<link rel="stylesheet" href="styles.css"/>
<style>.staffwrap{max-width:560px;margin:0 auto;padding:16px}</style>
</head>
<body>
<div id="gate" style="display:none"><div class="box">
  <div class="kicker">Trentino Gravel · Staff</div>
  <h2>Comunicazioni</h2>
  <p>Inserisci il codice staff per inviare un messaggio a tutti i partecipanti.</p>
  <input id="gatecode" type="text" placeholder="CODICE" autocomplete="off"/>
  <div class="err" id="gateerr"></div>
  <button class="btn" id="gatebtn">Entra</button>
</div></div>
<div class="staffwrap">
  <div class="card">
    <h2>Invia comunicazione</h2>
    <p class="muted">Il messaggio arriva come notifica push a tutti i partecipanti iscritti, e resta visibile nella guida (tab Live) a chi la riapre durante l'evento.</p>
    <p><label class="muted">Titolo</label><br/>
    <input id="msgtitle" type="text" maxlength="80" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:15px"/></p>
    <p><label class="muted">Messaggio</label><br/>
    <textarea id="msgbody" rows="4" maxlength="500" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;font-size:15px"></textarea></p>
    <div class="btnrow"><button class="btn" id="sendbtn">Invia a tutti</button></div>
    <p id="sendstatus" class="muted"></p>
  </div>
</div>
<script>
const $ = s => document.querySelector(s);
const STAFF_CODE = 'PIONEER26-STAFF'; // ✱ segnaposto, deve combaciare col secret STAFF_CODE della Edge Function
const FUNCTION_URL = 'https://kqsrtuzeeiljozdnjott.supabase.co/functions/v1/tg-send-broadcast';

function initGate(){
  if (localStorage.getItem('tg-staff-access') === STAFF_CODE) return;
  $('#gate').style.display = 'flex';
  const tryCode = () => {
    const v = $('#gatecode').value.trim().toUpperCase();
    if (v === STAFF_CODE){
      localStorage.setItem('tg-staff-access', STAFF_CODE);
      $('#gate').style.display = 'none';
    } else {
      $('#gateerr').textContent = 'Codice non valido.';
    }
  };
  $('#gatebtn').addEventListener('click', tryCode);
  $('#gatecode').addEventListener('keydown', e => { if (e.key === 'Enter') tryCode(); });
}
initGate();

$('#sendbtn').addEventListener('click', async () => {
  const title = $('#msgtitle').value.trim();
  const body = $('#msgbody').value.trim();
  const status = $('#sendstatus');
  if (!title || !body){
    status.textContent = 'Scrivi sia il titolo sia il messaggio.';
    return;
  }
  $('#sendbtn').disabled = true;
  status.textContent = 'Invio in corso…';
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, staffCode: STAFF_CODE })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invio fallito');
    status.textContent = `Inviato a ${data.sent} di ${data.total} iscritti.`;
    $('#msgtitle').value = '';
    $('#msgbody').value = '';
  } catch (err){
    status.textContent = 'Errore — ' + err.message;
  } finally {
    $('#sendbtn').disabled = false;
  }
});
</script>
</body>
</html>
```

- [ ] **Step 2: Aggiungi `staff.html` alla cache del service worker**

In `sw.js`, nell'array `ASSETS`, dopo `'./index.html'`, aggiungi `'./staff.html'`:

```js
const ASSETS = [
  './', './index.html', './staff.html', './styles.css', './content.js', './tracks.js', './poi.js', './icons.js',
```

(la versione `CACHE` è già stata incrementata a `tg-guida-v17` in Task 4 Step 2 — non serve un altro bump).

- [ ] **Step 3: Test manuale — codice sbagliato**

Apri `staff.html` nel browser. Inserisci un codice sbagliato: verifica che compaia "Codice non valido." e che la form resti nascosta.

- [ ] **Step 4: Test manuale — invio reale**

Inserisci `PIONEER26-STAFF`, scrivi titolo "Prova staff" e un messaggio, clicca "Invia a tutti →". Verifica che compaia "Inviato a N di N iscritti." Verifica che la notifica di sistema arrivi (se hai completato Task 3 su questo stesso browser) e che il messaggio compaia nella tab Live → Comunicazioni di `index.html` (fase "durante").

- [ ] **Step 5: Pulisci il messaggio di test**

```sql
delete from public.tg_broadcast_messages where title = 'Prova staff';
```

- [ ] **Step 6: Commit**

```bash
git add staff.html sw.js
git commit -m "Aggiunge pagina staff per l'invio di comunicazioni push"
```

---

### Task 7: Smoke test end-to-end e verifica fallback iOS

**Files:**
- Nessuna modifica — solo verifica manuale in browser reale, come da convenzione già seguita nel progetto per il restyle (README, sezione smoke test).

- [ ] **Step 1: Percorso principale (Chrome desktop o Android)**

Con il sito servito via HTTPS/localhost (`npx serve .`), fase forzata su "prima" via demobar: verifica che la card "Notifiche evento" sia visibile in tab Live e che "Comunicazioni" NON lo sia. Attiva le notifiche. Passa a fase "durante": verifica che "Comunicazioni" compaia (vuota). Da `staff.html`, invia un messaggio reale: verifica che arrivi sia come notifica push sia nel feed in-app.

- [ ] **Step 2: Fase "dopo"**

Forza la fase "dopo" via demobar: verifica che sia "Notifiche evento" sia "Comunicazioni" spariscano dalla tab Live.

- [ ] **Step 3: Verifica del fallback iOS**

Su Safari iOS, senza aver installato la guida sulla home screen, apri `index.html`, fase "durante": verifica che la card "Notifiche evento" non compaia (perché `pushSupported()` è `false` in quel contesto) e che nessun errore compaia in console. Verifica che "Comunicazioni" compaia comunque e mostri lo storico messaggi già inviati.

- [ ] **Step 4: Permesso negato**

Su un browser desktop, nega esplicitamente il permesso di notifica quando richiesto (o revocalo dalle impostazioni del sito e ricarica). Verifica che la card mostri "Notifiche bloccate dal browser…" invece del bottone.

- [ ] **Step 5: Pulizia finale dei dati di test**

Chiama `mcp__supabase__execute_sql` con `project_id: "kqsrtuzeeiljozdnjott"`:

```sql
select id, title, body, created_at from public.tg_broadcast_messages order by created_at desc;
select id, endpoint, created_at from public.tg_push_subscriptions order by created_at desc;
```

Cancella manualmente (via `delete from ... where id = '<id>'`) le righe generate durante i test di questo task che non sono già state ripulite nei task precedenti.

- [ ] **Step 6: Commit finale (se necessario)**

Se lo smoke test ha richiesto correzioni, committale con un messaggio descrittivo del fix. Se nessuna modifica è stata necessaria, questo step non produce commit.
