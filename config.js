// Unica fonte per l'URL del progetto Supabase, condivisa tra index.html e
// staff.html — evita di doverlo tenere sincronizzato a mano in più file
// (fix #21). VAPID_PUBLIC_KEY resta solo in index.html: è l'unico file che
// lo usa ancora, sw.js non ne ha più bisogno da quando il push handler
// legge solo il payload del messaggio.
window.TG_SUPABASE_URL = 'https://kqsrtuzeeiljozdnjott.supabase.co';
