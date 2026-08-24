-- Passaggio da tabelle prefissate per evento (tg_*) a uno schema condiviso
-- fra tutte le app-evento sullo stesso progetto Supabase "guide-eventi"
-- (tokqvqrebunfshjtpkog): una tabella `eventi` (id/slug/nome) e tabelle
-- generiche con `evento_id` come FK. Applicata a tabelle vuote o quasi (0
-- righe reali, 2 righe di rate-limit non significative in
-- tg_feedback_attempts) — drop pulito, nessuna migrazione dati.
--
-- Le altre app-evento (Tuscany Trail, ecc.) deployeranno la propria Edge
-- Function (nome/secret propri, vedi supabase/functions/tg-send-broadcast)
-- puntando alle STESSE tabelle qui sotto, filtrate dal proprio evento_id.

-- ============================================================
-- 1. Drop schema precedente (tg_*)
-- ============================================================

drop trigger if exists tg_feedback_webhook on public.tg_feedback;

-- Le tabelle vanno droppate prima delle funzioni: le policy RLS (che
-- dipendono dalle funzioni *_rate_ok) sono di proprieta' della tabella e
-- spariscono con essa, altrimenti drop function fallisce per dipendenza.
drop table if exists public.tg_feedback_attempts;
drop table if exists public.tg_feedback;
drop table if exists public.tg_push_subscribe_attempts;
drop table if exists public.tg_broadcast_messages;
drop table if exists public.tg_push_subscriptions;

drop function if exists public.tg_feedback_notify_slack();
drop function if exists public.tg_feedback_rate_ok();
drop function if exists public.tg_push_subscribe_rate_ok();

-- ============================================================
-- 2. Tabella eventi
-- ============================================================

create table public.eventi (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  created_at timestamptz not null default now()
);

-- Id fisso (non gen_random_uuid) cosi' il frontend statico di ogni app-evento
-- puo' incollarlo come letterale in config.js senza una fetch extra per
-- risolvere slug -> id a ogni caricamento.
insert into public.eventi (id, slug, nome) values
  ('b059ed05-79cc-4da0-a0d4-e82763fe02ba', 'trentino-gravel', 'Trentino Gravel — Pioneer Edition');

-- Nessuna RLS su eventi: e' un catalogo di sola lettura per uso interno
-- (Edge Function con service role, dashboard). Nessun client anon la legge
-- direttamente: il frontend usa l'id gia' noto in config.js.

-- ============================================================
-- 3. push_subscriptions (ex tg_push_subscriptions)
-- ============================================================

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventi(id),
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  constraint push_subscriptions_evento_endpoint_unique unique (evento_id, endpoint),
  constraint push_subscriptions_format_check check (
    endpoint like 'https://%' and length(endpoint) < 1024
    and length(p256dh) < 256 and length(auth) < 128
  )
);

alter table public.push_subscriptions enable row level security;

-- ============================================================
-- 4. push_subscribe_attempts + rate limit (ex tg_push_subscribe_attempts /
--    tg_push_subscribe_rate_ok) — rate limit ora per (ip, evento), non solo
--    per ip: un flood su un evento non deve consumare la soglia di un altro
--    evento che condivide lo stesso progetto Supabase.
-- ============================================================

create table public.push_subscribe_attempts (
  id bigint generated always as identity primary key,
  evento_id uuid not null references public.eventi(id),
  client_ip text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscribe_attempts enable row level security;
-- Nessuna policy: solo la funzione SECURITY DEFINER sotto ci scrive.

create index push_subscribe_attempts_evento_ip_time_idx
  on public.push_subscribe_attempts (evento_id, client_ip, created_at);

create or replace function public.push_subscribe_rate_ok(p_evento_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ip text;
  recent_count int;
begin
  ip := coalesce(
    nullif(current_setting('request.headers', true)::json ->> 'cf-connecting-ip', ''),
    nullif(split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1), ''),
    'unknown'
  );

  if random() < 0.01 then
    delete from public.push_subscribe_attempts where created_at < now() - interval '7 days';
  end if;

  select count(*) into recent_count
  from public.push_subscribe_attempts
  where client_ip = ip and evento_id = p_evento_id and created_at > now() - interval '1 hour';

  if recent_count >= 20 then
    return false;
  end if;

  insert into public.push_subscribe_attempts (evento_id, client_ip) values (p_evento_id, ip);
  return true;
end;
$$;

create policy "push_subscriptions_insert_anon"
  on public.push_subscriptions
  for insert
  to anon
  with check (public.push_subscribe_rate_ok(evento_id));

-- ============================================================
-- 5. broadcast_messages (ex tg_broadcast_messages)
-- ============================================================

create table public.broadcast_messages (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventi(id),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.broadcast_messages enable row level security;

create index broadcast_messages_evento_created_idx
  on public.broadcast_messages (evento_id, created_at desc);

-- Lettura pubblica non filtrata per evento in RLS: il contenuto non e'
-- sensibile. Il filtro per evento e' responsabilita' del CLIENT via query
-- string PostgREST (?evento_id=eq.<uuid>) — vedi index.html. Se un'app-evento
-- dimentica quel filtro vede (in lettura) i messaggi di tutti gli eventi.
create policy "broadcast_messages_select_anon"
  on public.broadcast_messages
  for select
  to anon
  using (true);

-- ============================================================
-- 6. feedback (ex tg_feedback)
-- ============================================================

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references public.eventi(id),
  message text not null,
  contact text,
  context jsonb,
  created_at timestamptz not null default now(),
  constraint feedback_format_check check (
    length(message) between 1 and 2000
    and (contact is null or length(contact) <= 200)
  )
);

alter table public.feedback enable row level security;

create index feedback_evento_idx on public.feedback (evento_id);

-- ============================================================
-- 7. feedback_attempts + rate limit (ex tg_feedback_attempts /
--    tg_feedback_rate_ok), stesso pattern del punto 4.
-- ============================================================

create table public.feedback_attempts (
  id bigint generated always as identity primary key,
  evento_id uuid not null references public.eventi(id),
  client_ip text not null,
  created_at timestamptz not null default now()
);

alter table public.feedback_attempts enable row level security;

create index feedback_attempts_evento_ip_time_idx
  on public.feedback_attempts (evento_id, client_ip, created_at);

create or replace function public.feedback_rate_ok(p_evento_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ip text;
  recent_count int;
begin
  ip := coalesce(
    nullif(current_setting('request.headers', true)::json ->> 'cf-connecting-ip', ''),
    nullif(split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1), ''),
    'unknown'
  );

  if random() < 0.01 then
    delete from public.feedback_attempts where created_at < now() - interval '7 days';
  end if;

  select count(*) into recent_count
  from public.feedback_attempts
  where client_ip = ip and evento_id = p_evento_id and created_at > now() - interval '1 hour';

  if recent_count >= 10 then
    return false;
  end if;

  insert into public.feedback_attempts (evento_id, client_ip) values (p_evento_id, ip);
  return true;
end;
$$;

create policy "feedback_insert_anon"
  on public.feedback
  for insert
  to anon
  with check (public.feedback_rate_ok(evento_id));

-- ============================================================
-- 8. Notifica Slack via trigger pg_net -> n8n (ex tg_feedback_notify_slack /
--    tg_feedback_webhook). pg_net resta nello schema extensions, non va
--    toccata: e' gia' li' dalla migrazione di hardening del 24/8.
-- ============================================================

create or replace function public.feedback_notify_slack()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://n8n.xct.bikeadventureseries.com/webhook/tg-feedback-slack',
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', tg_table_name,
      'schema', tg_table_schema,
      'record', to_jsonb(new)
    ),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  return new;
end;
$$;

-- Hardening ereditato da 20260824000000_hardening_advisors.sql: la funzione
-- trigger non deve essere chiamabile via RPC da anon/authenticated (spam
-- diretto su Slack scavalcando il rate limit). Le funzioni *_rate_ok restano
-- invece eseguibili da anon: le invoca la policy RLS WITH CHECK.
revoke execute on function public.feedback_notify_slack() from public, anon, authenticated;

create trigger feedback_webhook
  after insert on public.feedback
  for each row execute function public.feedback_notify_slack();
