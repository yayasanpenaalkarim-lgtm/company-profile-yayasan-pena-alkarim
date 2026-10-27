import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    'PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY belum diisi. Salin .env.example menjadi .env lalu isi.'
  );
}

/** Dipakai di browser (halaman /admin): sesi login disimpan otomatis. */
export const supabase = createClient(url, key);

/** Dipakai di server (halaman publik): tanpa sesi, hanya baca data publik. */
export const supabaseServer = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
