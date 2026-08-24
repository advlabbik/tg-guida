-- Advisor rls_disabled_in_public (ERROR): eventi era esposta senza RLS via
-- PostgREST, quindi leggibile/scrivibile da chiunque avesse la anon key.
-- Abilitiamo RLS senza policy: nessun accesso per anon/authenticated. La
-- Edge Function legge eventi con la service role key, che bypassa RLS, quindi
-- non serve nessuna policy select per anon.
alter table public.eventi enable row level security;
