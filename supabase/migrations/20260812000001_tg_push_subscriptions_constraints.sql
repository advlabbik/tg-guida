-- Hardening: tg_push_subscriptions accetta insert anonimi (RLS insert-only per
-- anon, vedi 20260812000000_tg_push_notifications.sql) senza alcun vincolo di
-- formato sui valori. Un client malevolo o rotto potrebbe inserire endpoint non
-- https o payload abnormemente lunghi. Aggiunge un check di formato minimo.

alter table public.tg_push_subscriptions
  add constraint tg_push_subscriptions_format_check
  check (
    endpoint like 'https://%' and length(endpoint) < 1024
    and length(p256dh) < 256 and length(auth) < 128
  );
