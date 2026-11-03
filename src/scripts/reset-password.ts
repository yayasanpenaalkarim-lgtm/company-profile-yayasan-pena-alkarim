import { createClient } from '@supabase/supabase-js';

const requestForm = document.querySelector<HTMLFormElement>('#request-form')!;
const passwordForm = document.querySelector<HTMLFormElement>('#password-form')!;
const status = document.querySelector<HTMLElement>('#reset-status')!;
const invalidLink = 'Tautan pemulihan tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.';

// Capture and remove credentials before creating any client or making requests.
const fragment = new URLSearchParams(window.location.hash.slice(1));
const query = new URLSearchParams(window.location.search);
window.history.replaceState(null, '', window.location.pathname);

// Keep recovery credentials in memory only, isolated from the admin login session.
// This matches the existing client's default implicit email recovery flow.
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'pena-password-recovery' } },
);

let recoveryReady = false;
let busy = false;
let expiresAt = 0;

function showRequest(message: string): void {
  recoveryReady = false;
  passwordForm.reset();
  passwordForm.hidden = true;
  requestForm.hidden = false;
  status.textContent = message;
}

function redirectUrl(): string {
  // Set PUBLIC_SITE_URL to the verified production origin at build time.
  const url = new URL(import.meta.env.PUBLIC_SITE_URL || window.location.origin);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Invalid site URL');
  }
  if (url.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('HTTPS required');
  }
  return new URL('/admin/reset-password', url.origin).href;
}

requestForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy || !requestForm.reportValidity()) return;
  busy = true;
  const button = requestForm.querySelector<HTMLButtonElement>('button')!;
  button.disabled = true;
  status.textContent = 'Mengirim tautan pemulihan…';
  try {
    let redirectTo: string;
    try {
      redirectTo = redirectUrl();
    } catch {
      status.textContent = 'Alamat website belum dikonfigurasi dengan benar. Hubungi pengelola.';
      return;
    }
    const email = String(new FormData(requestForm).get('email') || '').trim();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      status.textContent = error.status === 429
        ? 'Terlalu banyak permintaan. Tunggu beberapa menit sebelum mencoba lagi.'
        : 'Tautan belum dapat dikirim. Silakan coba lagi beberapa saat.';
      return;
    }
    status.textContent = 'Jika email terdaftar, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder spam.';
    requestForm.reset();
  } catch {
    status.textContent = 'Tidak dapat terhubung. Periksa koneksi lalu coba lagi.';
  } finally {
    busy = false;
    button.disabled = false;
  }
});

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy || !recoveryReady || !passwordForm.reportValidity()) return;
  if (Date.now() >= expiresAt) {
    showRequest(invalidLink);
    return;
  }
  const password = passwordForm.querySelector<HTMLInputElement>('#new-password')!;
  const confirmation = passwordForm.querySelector<HTMLInputElement>('#confirm-password')!;
  if (password.value !== confirmation.value) {
    status.textContent = 'Konfirmasi password tidak cocok.';
    confirmation.focus();
    return;
  }
  busy = true;
  const button = passwordForm.querySelector<HTMLButtonElement>('button')!;
  button.disabled = true;
  status.textContent = 'Menyimpan password baru…';
  try {
    // Revalidate with Auth; never authorize a change based on stored browser state.
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) {
      showRequest(invalidLink);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: password.value });
    if (error) {
      if (error.status === 401 || error.status === 403) showRequest(invalidLink);
      else status.textContent = error.code === 'same_password'
        ? 'Gunakan password yang berbeda dari password sebelumnya.'
        : error.code === 'weak_password'
          ? 'Password belum memenuhi ketentuan keamanan. Gunakan password yang lebih kuat.'
          : error.status === 429
            ? 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.'
            : 'Password belum berhasil diperbarui. Silakan coba lagi.';
      return;
    }
    recoveryReady = false;
    passwordForm.reset();
    passwordForm.hidden = true;
    status.textContent = 'Password berhasil diperbarui. Kembali ke login dan masuk dengan password baru.';
    // Cleanup failure must not report a successfully updated password as failed.
    try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* In-memory session only. */ }
  } catch {
    status.textContent = 'Tidak dapat terhubung. Periksa koneksi lalu coba lagi.';
  } finally {
    busy = false;
    button.disabled = false;
  }
});

async function initialize(): Promise<void> {
  const hasCallback = fragment.size > 0 || query.size > 0;
  try {
    if (!hasCallback) {
      showRequest('Masukkan email admin untuk menerima tautan pemulihan password.');
      return;
    }
    if (fragment.has('error') || query.has('error') || fragment.get('type') !== 'recovery') {
      showRequest(invalidLink);
      return;
    }
    const access_token = fragment.get('access_token');
    const refresh_token = fragment.get('refresh_token');
    if (!access_token || !refresh_token) {
      showRequest(invalidLink);
      return;
    }
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error || !data.session) {
      showRequest(invalidLink);
      return;
    }
    const { data: verified, error: verificationError } = await supabase.auth.getUser();
    if (verificationError || !verified.user) {
      showRequest(invalidLink);
      return;
    }
    expiresAt = (data.session.expires_at ?? 0) * 1000;
    if (Date.now() >= expiresAt) {
      showRequest(invalidLink);
      return;
    }
    recoveryReady = true;
    status.textContent = 'Tautan terverifikasi. Masukkan password baru Anda.';
    passwordForm.hidden = false;
    passwordForm.querySelector<HTMLInputElement>('input')!.focus();
  } catch {
    showRequest('Tautan tidak dapat diverifikasi. Periksa koneksi atau minta tautan baru.');
  } finally {
    // Drop the parsed URL credentials as soon as verification finishes.
    for (const key of [...fragment.keys()]) fragment.delete(key);
    for (const key of [...query.keys()]) query.delete(key);
  }
}

void initialize();
