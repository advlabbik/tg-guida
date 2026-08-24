-- Hardening da advisor Supabase, applicata il 24/8/2026 sul progetto
-- guide-eventi (tokqvqrebunfshjtpkog) subito dopo il trasloco:
-- 1. La funzione trigger di notifica non deve essere chiamabile via RPC da
--    anon/authenticated (avrebbe permesso spam diretto su Slack senza insert,
--    scavalcando il rate limit). Le funzioni *_rate_ok restano invece
--    eseguibili da anon: le invoca la policy RLS WITH CHECK con i privilegi
--    del chiamante, senza EXECUTE l'insert fallirebbe.
-- 2. pg_net fuori dallo schema public (advisor extension_in_public). Non
--    supporta SET SCHEMA: drop e ricreazione nello schema extensions; le sue
--    funzioni vivono comunque nello schema net, il trigger
--    tg_feedback_webhook non cambia. Flusso feedback ri-verificato end-to-end
--    dopo l'applicazione.

revoke execute on function public.tg_feedback_notify_slack() from public, anon, authenticated;

create schema if not exists extensions;
drop extension pg_net;
create extension pg_net with schema extensions;
