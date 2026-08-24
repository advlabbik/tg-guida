-- Feedback dei partecipanti dall'app (bottone "Qualcosa non funziona?
-- Scrivicelo" in fondo a ogni pagina). Stessa filosofia di
-- tg_push_subscriptions: insert-only per anon, vincoli di formato,
-- rate limit per IP con funzione SECURITY DEFINER.
--
-- APPLICATA il 24/8/2026 sul progetto guide-eventi (tokqvqrebunfshjtpkog),
-- il nuovo progetto dedicato alle app guida. Due differenze rispetto alla
-- prima stesura:
-- 1. RLS abilitata anche su tg_feedback_attempts: senza, la tabella di
--    tracking resta esposta in lettura/scrittura all'anon key (stesso
--    advisory critico emerso su kqsr per tg_push_subscribe_attempts).
--    La funzione SECURITY DEFINER continua a scriverci senza policy.
-- 2. Notifica Slack via trigger pg_net al webhook n8n "tg-feedback-slack"
--    (workflow "TG Guida — Feedback → Slack" → canale #feedback-app),
--    definita qui in SQL invece del Database Webhook da dashboard: stesso
--    payload (type/table/schema/record), ma sotto version control.
--
-- Lettura: nessuna policy select per anon (i feedback non devono essere
-- pubblici). Si leggono dal dashboard Supabase o via service role.

create table if not exists public.tg_feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  contact text,
  context jsonb,
  created_at timestamptz not null default now(),
  constraint tg_feedback_format_check check (
    length(message) between 1 and 2000
    and (contact is null or length(contact) <= 200)
  )
);

alter table public.tg_feedback enable row level security;

-- Rate limit per IP, stesso pattern di tg_push_subscribe_rate_ok (fix #17).
create table if not exists public.tg_feedback_attempts (
  id bigint generated always as identity primary key,
  client_ip text not null,
  created_at timestamptz not null default now()
);

alter table public.tg_feedback_attempts enable row level security;

create index if not exists tg_feedback_attempts_ip_time_idx
  on public.tg_feedback_attempts (client_ip, created_at);

create or replace function public.tg_feedback_rate_ok()
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

  -- pulizia opportunistica, come per le push: niente cron dedicato
  if random() < 0.01 then
    delete from public.tg_feedback_attempts where created_at < now() - interval '7 days';
  end if;

  select count(*) into recent_count
  from public.tg_feedback_attempts
  where client_ip = ip and created_at > now() - interval '1 hour';

  -- una persona vera scrive al massimo qualche segnalazione di fila
  if recent_count >= 10 then
    return false;
  end if;

  insert into public.tg_feedback_attempts (client_ip) values (ip);
  return true;
end;
$$;

create policy "tg_feedback_insert_anon"
  on public.tg_feedback
  for insert
  to anon
  with check (public.tg_feedback_rate_ok());

-- Notifica Slack: INSERT su tg_feedback -> webhook n8n -> #feedback-app
create extension if not exists pg_net;

create or replace function public.tg_feedback_notify_slack()
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

create trigger tg_feedback_webhook
  after insert on public.tg_feedback
  for each row execute function public.tg_feedback_notify_slack();
