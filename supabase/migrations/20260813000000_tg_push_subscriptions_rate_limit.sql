-- Fix #17: l'INSERT anonimo su tg_push_subscriptions non aveva alcun limite di
-- volume oltre ai CHECK di formato (20260812000001) — uno script con la anon
-- key (visibile nel sorgente di index.html) poteva riempire la tabella di
-- righe a piacere, purché passassero i CHECK di formato. Aggiunge un rate
-- limit per IP lato RLS: un vero dispositivo si sottoscrive al massimo poche
-- volte all'ora (prima sottoscrizione + eventuali re-invii da
-- verifyPushSubscription quando l'endpoint ruota), quindi un limite generoso
-- non tocca l'uso reale ma blocca un flood automatizzato.
--
-- NOTA: già applicata in produzione sul progetto kqsrtuzeeiljozdnjott.
-- Non va ri-applicata: serve solo a portare lo schema sotto version control.

create table if not exists public.tg_push_subscribe_attempts (
  id bigint generated always as identity primary key,
  client_ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists tg_push_subscribe_attempts_ip_time_idx
  on public.tg_push_subscribe_attempts (client_ip, created_at);

-- SECURITY DEFINER: l'anon role non ha (e non deve avere) permesso di
-- scrivere direttamente su tg_push_subscribe_attempts; la funzione registra
-- il tentativo e risponde true/false per la WITH CHECK della policy insert.
create or replace function public.tg_push_subscribe_rate_ok()
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

  -- pulizia opportunistica, non a ogni chiamata: evita che la tabella di
  -- tracking cresca senza limite senza bisogno di un cron dedicato.
  if random() < 0.01 then
    delete from public.tg_push_subscribe_attempts where created_at < now() - interval '7 days';
  end if;

  select count(*) into recent_count
  from public.tg_push_subscribe_attempts
  where client_ip = ip and created_at > now() - interval '1 hour';

  if recent_count >= 20 then
    return false;
  end if;

  insert into public.tg_push_subscribe_attempts (client_ip) values (ip);
  return true;
end;
$$;

drop policy if exists "tg_push_subscriptions_insert_anon" on public.tg_push_subscriptions;

create policy "tg_push_subscriptions_insert_anon"
  on public.tg_push_subscriptions
  for insert
  to anon
  with check (public.tg_push_subscribe_rate_ok());
