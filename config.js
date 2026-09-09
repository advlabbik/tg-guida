// Unica fonte per l'URL del progetto Supabase, condivisa tra index.html e
// staff.html — evita di doverlo tenere sincronizzato a mano in più file
// (fix #21). VAPID_PUBLIC_KEY resta solo in index.html: è l'unico file che
// lo usa ancora, sw.js non ne ha più bisogno da quando il push handler
// legge solo il payload del messaggio.
window.TG_SUPABASE_URL = 'https://tokqvqrebunfshjtpkog.supabase.co';
// Chiave publishable, cioè pubblica per progetto: sta nel sorgente di un sito
// statico e va bene così. Da qui e non più solo dentro index.html perché ora
// la usa anche staff.html, per rileggere le comunicazioni già inviate.
window.TG_SUPABASE_ANON_KEY = 'sb_publishable_uAsfI4XJD5r5HZPykdxxGg_vzhRd77U';
// Id fisso della riga 'trentino-gravel' in public.eventi (schema condiviso
// multi-evento, migrazione 20260824085311_eventi_condivisi.sql). Non generato
// a runtime: l'app è statica, evitare una fetch extra per risolvere lo slug.
window.TG_EVENTO_ID = 'b059ed05-79cc-4da0-a0d4-e82763fe02ba';

// --------------------------------------------------------------- analytics
// `uso.js` arriva dal template (advlabbik/event-app-template, motore/uso.js) e
// va tenuto IDENTICO, byte per byte: e' l'unico modo perche' le correzioni
// fatte la' si riportino qui con una copia invece che con una riconciliazione a
// mano. Quel file legge `window.EVENTO_CONFIG`, che questa app non ha perche' e'
// nata prima del template — quindi glielo si costruisce qui, in sei righe, con
// i dati che questa app ha gia'.
//
// NASCE SPENTA. Accesa, manda a Supabase quante persone usano la guida e quali
// funzioni, con un codice anonimo che si rigenera ogni notte. Prima di
// accenderla serve una riga nell'informativa che lo dica ai partecipanti, in
// tutte le lingue.
window.EVENTO_CONFIG = {
  prefissoStorage: 'tg',            // le chiavi di quest'app sono gia' 'tg-...'
  analytics: false,
  backend: {
    supabaseUrl: window.TG_SUPABASE_URL,
    anonKey: window.TG_SUPABASE_ANON_KEY,
    eventoId: window.TG_EVENTO_ID
  }
};
