-- Feedback dei partecipanti dall'app (bottone "Qualcosa non funziona?
-- Scrivicelo" in fondo a ogni pagina). Stessa filosofia di
-- tg_push_subscriptions: insert-only per anon, vincoli di formato,
-- rate limit per IP con funzione SECURITY DEFINER.
--
-- NOTA: NON ancora applicata in produzione (progetto kqsrtuzeeiljozdnjott).
-- Va eseguita nel SQL editor di Supabase prima che il bottone funzioni;
-- fino ad allora l'app mostra il messaggio di errore con l'email di riserva.
--
-- Lettura: nessuna policy select per anon (i feedback non devono essere
-- pubblici). Si leggono dal dashboard Supabase o via service role. Per la
-- notifica in tempo reale al team: Database Webhooks su INSERT di questa
-- tabella verso un incoming webhook Slack (si configura dal dashboard,
-- zero codice — vedi README).

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
