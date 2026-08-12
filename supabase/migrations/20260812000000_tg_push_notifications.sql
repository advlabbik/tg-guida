-- Schema per le notifiche push di comunicazioni staff (feature "notifiche durante").
-- NOTA: questa migrazione documenta lo schema gia' applicato in produzione sul
-- progetto kqsrtuzeeiljozdnjott (vedi Task 1 del piano
-- docs/superpowers/plans/2026-08-12-notifiche-durante.md). Non va ri-applicata:
-- serve solo a portare lo schema sotto version control nel repo.

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
