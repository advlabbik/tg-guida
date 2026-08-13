import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT")!;
const STAFF_CODE = Deno.env.get("STAFF_CODE")!;

// Numero di subscription inviate in parallelo per batch. Con centinaia/migliaia
// di iscritti, un Promise.all su tutte le righe in un colpo solo apre troppe
// connessioni contemporanee verso i push service (rischio rate limit/timeout).
// I batch girano in sequenza, ogni batch in parallelo al suo interno.
const BATCH_SIZE = 100;

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
  const allSubs = subs ?? [];
  let sent = 0;
  const staleIds: string[] = [];

  for (let i = 0; i < allSubs.length; i += BATCH_SIZE) {
    const batch = allSubs.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (sub) => {
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
          // endpoint non più valido (utente ha disinstallato/revocato): va rimosso,
          // non è un fallimento da segnalare.
          staleIds.push(sub.id);
        } else {
          // qualsiasi altro errore (es. credenziali VAPID non valide, push service
          // down) va loggato: altrimenti sparisce senza lasciare traccia e uno
          // "sent: 0" sembra "nessun iscritto", non "invio rotto".
          console.error(`invio push fallito per subscription ${sub.id}:`, err);
        }
      }
    }));
  }

  let removed = 0;
  if (staleIds.length) {
    const { error: deleteError, count } = await supabase
      .from("tg_push_subscriptions")
      .delete({ count: "exact" })
      .in("id", staleIds);
    if (deleteError) {
      console.error("rimozione subscription scadute fallita:", deleteError);
    } else {
      removed = count ?? staleIds.length;
    }
  }

  return json({ sent, removed, total: allSubs.length });
});
