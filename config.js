// Unica fonte per l'URL del progetto Supabase, condivisa tra index.html e
// staff.html — evita di doverlo tenere sincronizzato a mano in più file
// (fix #21). VAPID_PUBLIC_KEY resta solo in index.html: è l'unico file che
// lo usa ancora, sw.js non ne ha più bisogno da quando il push handler
// legge solo il payload del messaggio.
window.TG_SUPABASE_URL = 'https://tokqvqrebunfshjtpkog.supabase.co';
// Id fisso della riga 'trentino-gravel' in public.eventi (schema condiviso
// multi-evento, migrazione 20260824085311_eventi_condivisi.sql). Non generato
// a runtime: l'app è statica, evitare una fetch extra per risolvere lo slug.
window.TG_EVENTO_ID = 'b059ed05-79cc-4da0-a0d4-e82763fe02ba';
