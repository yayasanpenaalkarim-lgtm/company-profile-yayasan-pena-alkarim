import { supabase } from '../lib/supabase';



type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'image' | 'select';

interface Field {

   name: string;

   label: string;

   type: FieldType;

   required?: boolean;

   hint?: string;

   options?: { value: string; label: string }[];

   full?: boolean;

   multiple?: boolean;

}

type Row = { id: number } & Record<string, string | string[] | number | null>;

interface ListCfg {

   id: string;

   label: string;

   noun: string;

   desc: string;

   icon: string;

   table: string;

   titleField: string;

   subFields: string[];

   imageField?: string;

   groupBy?: string;

   folder: string;

   fields: Field[];

}

interface Group { id: string; label: string; desc: string; fields: Field[] }



const t = (name: string, label: string, extra: Partial<Field> = {}): Field => ({ name, label, type: 'text', ...extra });

const ta = (name: string, label: string, extra: Partial<Field> = {}): Field => ({ name, label, type: 'textarea', full: true, ...extra });

const img = (name: string, label: string, extra: Partial<Field> = {}): Field => ({ name, label, type: 'image', full: true, ...extra });

const urutan: Field = { name: 'urutan', label: 'Urutan tampil', type: 'number', hint: 'Angka kecil tampil lebih dulu. Bisa juga diatur dengan tombol panah di daftar.' };



const GROUPS: Group[] = [

   { id: 'identitas', label: 'Identitas', desc: 'Nama yayasan di menu atas, banner, dan tujuan tombol donasi.', fields: [

      t('nama_yayasan', 'Nama yayasan (teks di navbar)', { full: true }),

      img('logo_url', 'Logo yayasan (navbar, footer, dan login admin)', { hint: 'Unggah PNG/WebP transparan agar logo sesuai dengan tampilan situs.' }),

      t('banner_teks', 'Teks banner hijau paling atas', { full: true, hint: 'Kosongkan kalau tidak ingin ada banner.' }),


   ]},

   { id: 'beranda', label: 'Beranda', desc: 'Bagian paling atas halaman depan, termasuk dua foto pada kartu yang bisa ditukar.', fields: [

      t('hero_badge', 'Label kecil di atas judul'),

      t('hero_judul', 'Judul utama'),

      ta('hero_highlight', 'Baris berwarna kuning di judul', {
         hint: 'Isi satu frasa per baris. Setiap frasa akan muncul bergantian dengan animasi mengetik.',
      }),

      t('hero_tombol_label', 'Tulisan pada tombol hijau'),

      ta('hero_deskripsi', 'Deskripsi singkat'),

      img('hero_foto_url', 'Foto utama beranda'),

      img('hero_foto2_url', 'Foto kedua beranda (muncul saat kartu diklik)'),

   ]},

   { id: 'program', label: 'Judul Program', desc: 'Judul dan penjelasan di atas kartu program.', fields: [

      t('program_judul', 'Judul bagian program', { full: true }),

      ta('program_deskripsi', 'Deskripsi bagian program'),

   ]},

   { id: 'visi', label: 'Visi', desc: 'Atur judul bagian, deskripsi pembuka, dan teks visi yang tampil di halaman utama.', fields: [

      t('profil_judul', 'Judul bagian visi & misi', { full: true }),

      ta('profil_deskripsi', 'Deskripsi pembuka', { full: true }),

      ta('visi', 'Isi visi yayasan', { full: true, required: true }),

   ]},

   { id: 'misi', label: 'Misi', desc: 'Atur pernyataan misi utama. Enam kartu poin misi tetap dikelola di menu “Poin Misi”.', fields: [

      ta('misi', 'Isi misi yayasan', { full: true, required: true }),

   ]},

   { id: 'halaman', label: 'Judul Halaman', desc: 'Atur judul dan deskripsi halaman Pengurus serta judul galeri di beranda.', fields: [

      t('pengurus_judul', 'Judul halaman pengurus', {
         full: true,
         hint: 'Contoh: Bersama membangun generasi bermakna.',
      }),

      ta('pengurus_deskripsi', 'Deskripsi halaman pengurus', {
         full: true,
         hint: 'Deskripsi singkat mengenai pengurus dan tenaga pengajar.',
      }),

      t('galeri_judul', 'Judul bagian galeri prestasi', { full: true }),

   ]},

   { id: 'kontak', label: 'Kontak & Maps', desc: 'Alamat, nomor WhatsApp, email, dan peta Google Maps di bagian bawah.', fields: [

      ta('alamat', 'Alamat lengkap'),

      t('kontak1_nama', 'Kontak 1 - nama'), t('kontak1_wa', 'Kontak 1 - nomor WhatsApp'),

      t('kontak2_nama', 'Kontak 2 - nama'), t('kontak2_wa', 'Kontak 2 - nomor WhatsApp'),

      t('email1', 'Email', { full: true }),

      t('maps_embed_url', 'Link embed Google Maps', { full: true, hint: 'Google Maps > cari lokasi > Bagikan > Sematkan peta > Salin HTML. Boleh tempel seluruh kode <iframe>, link-nya diambil otomatis.' }),

   ]},

   { id: 'footer', label: 'Footer', desc: 'Atur nama yayasan dan informasi yang ditampilkan pada footer website.', fields: [

      t('footer_nama', 'Nama di footer', { full: true }),

      ta('footer_deskripsi', 'Deskripsi singkat di footer'),

   ]},

];



const LISTS: ListCfg[] = [

   { id: 'program', label: 'Program Unggulan', noun: 'Program', icon: 'grid', table: 'program', titleField: 'deskripsi', subFields: [], imageField: 'foto_urls', folder: 'program',

      desc: 'Kartu di bagian “Program Unggulan”: pilih beberapa foto untuk slider dan satu deskripsi.',

      fields: [ta('deskripsi', 'Deskripsi program', { required: true }), img('foto_urls', 'Foto program (bisa pilih lebih dari satu)', { multiple: true, hint: 'Pilih beberapa foto sekaligus. Foto baru ditambahkan ke foto yang sudah tersimpan.' }), urutan] },

   { id: 'poin_misi', label: 'Poin Misi', noun: 'Poin misi', icon: 'list', table: 'poin_misi', titleField: 'deskripsi', subFields: [], folder: 'poin',

      desc: 'Kartu poin misi di samping Visi & Misi. Ikonnya otomatis mengikuti urutan.',

      fields: [ta('deskripsi', 'Isi poin', { required: true }), urutan] },

   { id: 'prestasi', label: 'Prestasi & Capaian', noun: 'prestasi', icon: 'check', table: 'prestasi', titleField: 'deskripsi', subFields: [], folder: 'prestasi',
    desc: 'Kelola daftar prestasi dan capaian yang tampil pada bagian “Prestasi dan Capaian” di halaman utama.',
    fields: [ta('deskripsi', 'Deskripsi prestasi atau capaian', { required: true }), urutan] },

  { id: 'kegiatan', label: 'Galeri Prestasi', noun: 'Foto galeri', icon: 'image', table: 'kegiatan', titleField: 'judul', subFields: [], imageField: 'foto_url', folder: 'kegiatan',

      desc: 'Foto di bagian “Galeri Prestasi”. Lima foto pertama tampil di beranda, sisanya di halaman Galeri.',

      fields: [

         t('judul', 'Nama foto', { required: true, full: true, hint: 'Hanya penanda di admin dan teks alternatif foto, tidak ditampilkan di situs.' }),

         img('foto_url', 'Foto'),

         urutan,

      ] },

   { id: 'pengurus', label: 'Pengurus & Pengajar', noun: 'Pengurus / pengajar', icon: 'users', table: 'pengurus', titleField: 'nama', subFields: ['jabatan', 'kategori'], groupBy: 'kategori', folder: 'pengurus',

      desc: 'Kelola nama, jabatan, kelompok, dan urutan pengurus serta tenaga pengajar.',

      fields: [

         t('nama', 'Nama lengkap', { required: true, full: true }),

         t('jabatan', 'Jabatan', { required: true, full: true }),

         { name: 'kategori', label: 'Kelompok', type: 'select', required: true, full: true,

            options: [{ value: 'pengurus', label: 'Pengurus yayasan' }, { value: 'pengajar', label: 'Tenaga pengajar' }] },

         urutan,

      ] },

];



const NAV: { id: string; label: string; icon: string; section?: string }[] = [

   { id: 'ringkasan', label: 'Ringkasan', icon: 'home', section: 'Menu' },

   { id: 'umum', label: 'Teks & Foto Umum', icon: 'edit' },

   ...LISTS.map((l, i) => ({ id: l.id, label: l.label, icon: l.icon, section: i === 0 ? 'Konten' : undefined })),

];



/* ==================================================================== */

/* 2. IKON & HELPER                                                                                 */

/* ==================================================================== */



const ICONS: Record<string, string> = {

   home: '<path d="M3 11 12 3l9 8M5 10v10h14V10M10 20v-6h4v6"/>',

   edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',

   grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',

   list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',

   image: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L5 21"/>',

   users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',

   link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',

   plus: '<path d="M12 5v14M5 12h14"/>',

   search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',

   up: '<path d="m18 15-6-6-6 6"/>',

   down: '<path d="m6 9 6 6 6-6"/>',

   trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',

   x: '<path d="M18 6 6 18M6 6l12 12"/>',

   menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',

   external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',

   logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',

   check: '<path d="M20 6 9 17l-5-5"/>',

   alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',

   upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',

   eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',

   eyeoff: '<path d="M17.9 17.9A10.9 10.9 0 0 1 12 19c-6.4 0-10-7-10-7a18.5 18.5 0 0 1 5.1-5.9M9.9 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',

   arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',

   info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',

};

const ic = (name: string): string => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;

const LOGO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 1 8.5 12 14l8-4v6h2V8.5zM5 13.3V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.7l-7 3.5z"/></svg>';



const app = document.getElementById('app') as HTMLElement;

const toastBox = document.getElementById('toasts') as HTMLElement;



const esc = (v: unknown): string =>

   String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));



function msg(e: unknown): string {

   if (e instanceof Error) return e.message;

   if (typeof e === 'object' && e && 'message' in e) return String((e as { message: unknown }).message);

   return 'Terjadi kesalahan.';

}



function toast(text: string, kind: 'ok' | 'bad' = 'ok'): void {

   const el = document.createElement('div');

   el.className = `toast ${kind}`;

   el.innerHTML = `${ic(kind === 'ok' ? 'check' : 'alert')}<span>${esc(text)}</span>`;

   toastBox.appendChild(el);

   requestAnimationFrame(() => el.classList.add('in'));

   window.setTimeout(() => {

      el.classList.remove('in');

      window.setTimeout(() => el.remove(), 300);

   }, kind === 'bad' ? 5200 : 3000);

}



function setBusy(form: HTMLFormElement, busy: boolean): void {

   form.querySelectorAll<HTMLButtonElement>('button').forEach((b) => (b.disabled = busy));

   form.querySelector('button[type=submit]')?.classList.toggle('loading', busy);

}



/** Dialog konfirmasi sendiri (lebih rapi daripada confirm bawaan browser). */

function ask(title: string, text: string, ok = 'Ya', danger = false): Promise<boolean> {

   const d = document.getElementById('cfm') as HTMLDialogElement;

   d.innerHTML = `<div class="cfm-box">

      <div class="cfm-ic ${danger ? 'bad' : ''}">${ic(danger ? 'trash' : 'info')}</div>

      <h3>${esc(title)}</h3><p>${esc(text)}</p>

      <div class="actions">

         <button class="btn btn-outline" type="button" data-res="0">Batal</button>

         <button class="btn ${danger ? 'btn-danger-solid' : 'btn-primary'}" type="button" data-res="1">${esc(ok)}</button>

      </div></div>`;

   return new Promise((resolve) => {

      d.onclick = (e) => {

         const b = (e.target as HTMLElement).closest<HTMLElement>('[data-res]');

         if (b) { d.close(); resolve(b.dataset.res === '1'); }

         else if (e.target === d) { d.close(); resolve(false); }

      };

      d.oncancel = () => resolve(false);

      d.showModal();

   });

}



/* ----- foto: dikecilkan di browser, lalu diunggah ke Supabase Storage ----- */



async function compress(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {

   const bmp = await createImageBitmap(file);

   const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));

   const w = Math.round(bmp.width * scale);

   const h = Math.round(bmp.height * scale);

   const canvas = document.createElement('canvas');

   canvas.width = w;

   canvas.height = h;

   const ctx = canvas.getContext('2d');

   if (!ctx) throw new Error('Browser tidak mendukung pemrosesan foto.');

   ctx.fillStyle = '#fff';

   ctx.fillRect(0, 0, w, h);

   ctx.drawImage(bmp, 0, 0, w, h);

   return new Promise((resolve, reject) =>

      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Gagal memproses foto.'))), 'image/jpeg', quality)

   );

}



async function uploadImage(file: File, folder: string): Promise<string> {

   if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar (JPG/PNG/WebP).');

   const blob = await compress(file);

   const path = `${folder}/${crypto.randomUUID()}.jpg`;

   const { error } = await supabase.storage.from('foto').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });

   if (error) throw error;

   return supabase.storage.from('foto').getPublicUrl(path).data.publicUrl;

}



async function removeImage(url: string | null | undefined): Promise<void> {

   if (!url) return;

   const marker = '/object/public/foto/';

   const i = url.indexOf(marker);

   if (i < 0) return;

   await supabase.storage.from('foto').remove([decodeURIComponent(url.slice(i + marker.length))]); // best-effort

}



/** URL foto final: file baru > dihapus > tetap. Foto baru dicatat di `uploaded` agar bisa dibersihkan kalau simpan gagal. */

async function resolveImage(form: HTMLFormElement, f: Field, old: string | null, folder: string, uploaded: string[]): Promise<string | null> {

   const file = (form.elements.namedItem(f.name) as HTMLInputElement).files?.[0];

   const removed = (form.elements.namedItem(`__rm_${f.name}`) as HTMLInputElement | null)?.value === '1';

   if (file) {

      const url = await uploadImage(file, folder);

      uploaded.push(url);

      return url;

   }

   return removed ? null : old;

}

/** Normalisasi foto_urls agar mendukung kolom Supabase text[] maupun jsonb, serta data lama berupa satu URL. */
function imageUrls(value: unknown): string[] {
   if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
   }

   if (typeof value !== 'string' || !value.trim()) return [];

   const raw = value.trim();
   try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
         return parsed.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
      }
   } catch {
      // Bukan JSON: dianggap sebagai URL gambar tunggal.
   }

   return [raw];
}

/** Foto baru ditambahkan; foto lama tetap tersimpan kecuali admin menghapusnya. */
async function resolveImages(form: HTMLFormElement, f: Field, oldUrls: string[], folder: string, uploaded: string[]): Promise<string[]> {
   const input = form.elements.namedItem(f.name) as HTMLInputElement | null;
   const files = Array.from(input?.files ?? []);
   const removedInput = form.elements.namedItem(`__rm_${f.name}`) as HTMLInputElement | null;
   let removedUrls: string[] = [];

   try {
      const parsed: unknown = JSON.parse(removedInput?.value || '[]');
      if (Array.isArray(parsed)) removedUrls = parsed.filter((item): item is string => typeof item === 'string');
   } catch {
      removedUrls = [];
   }

   const keptUrls = oldUrls.filter((url) => !removedUrls.includes(url));
   const newUrls: string[] = [];

   for (const file of files) {
      const url = await uploadImage(file, folder);
      uploaded.push(url);
      newUrls.push(url);
   }

   return [...keptUrls, ...newUrls];
}



/** Kalau yang ditempel kode <iframe> Google Maps, ambil src-nya saja. */

function normalize(key: string, value: string): string {

   if (key === 'maps_embed_url') {

    const m = value.match(/src=["']([^"']+)["']/i);

      return m ? m[1] : value;

   }

   return value;

}



/* ----- HTML field ----- */



function fieldHtml(f: Field, value: string | string[] | number | null): string {

   const v = value ?? '';

   const cls = `fld${f.full || f.type === 'textarea' ? ' full' : ''}`;

   const req = f.required ? ' required' : '';

   let control: string;

   switch (f.type) {

      case 'textarea':

         control = `<textarea class="input" name="${f.name}" rows="3"${req}>${esc(v)}</textarea>`;

         break;

      case 'number':

         control = `<input class="input" type="number" name="${f.name}" value="${esc(v)}" />`;

         break;

      case 'date':

         control = `<input class="input" type="date" name="${f.name}" value="${esc(v)}" />`;

         break;

      case 'select':

         control = `<select class="input" name="${f.name}"${req}>${(f.options ?? [])

            .map((o) => `<option value="${esc(o.value)}"${o.value === String(v) ? ' selected' : ''}>${esc(o.label)}</option>`)

            .join('')}</select>`;

         break;

      case 'image':

         if (f.multiple) {
            const urls = imageUrls(v);
            const previews = urls.map((url, index) => `
               <div class="multi-photo" data-existing-url="${esc(url)}" style="position:relative;min-width:0;">
                  <img src="${esc(url)}" alt="Foto program ${index + 1}" loading="lazy" style="display:block;width:100%;height:96px;object-fit:cover;border-radius:10px;border:1px solid #dce3e8;" />
                  <button type="button" class="link-danger" data-act="rm-multi-img" data-name="${f.name}" data-url="${esc(url)}" style="margin-top:5px;font-size:.78rem;">Hapus foto</button>
               </div>`).join('');

            control = `<div class="imgfield multi-imgfield${urls.length ? ' has-img' : ''}">
               <div class="multi-existing" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin-bottom:12px;">${previews}</div>
               <label class="drop">
                  <input class="sr" type="file" name="${f.name}" accept="image/*" multiple />
                  <span class="drop-empty">${ic('upload')}<b>Klik atau seret beberapa foto ke sini</b><small>Bisa memilih banyak foto sekaligus. Format gambar otomatis diproses.</small></span>
                  <span class="drop-change">${ic('upload')} Tambah foto</span>
               </label>
               <div class="multi-selected" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin-top:10px;"></div>
               <input type="hidden" name="__rm_${f.name}" value="[]" />
               <button type="button" class="link-danger" data-act="rm-multi-all" data-name="${f.name}" style="margin-top:10px;">Hapus semua foto tersimpan</button>
            </div>`;
         } else {
            control = `<div class="imgfield${v ? ' has-img' : ''}">
               <label class="drop">
                  <input class="sr" type="file" name="${f.name}" accept="image/*" />
                  <img class="drop-prev" src="${esc(v)}" alt="" />
                  <span class="drop-empty">${ic('upload')}<b>Klik atau seret foto ke sini</b><small>JPG, PNG, atau WebP. Otomatis dikecilkan.</small></span>
                  <span class="drop-change">${ic('upload')} Ganti foto</span>
               </label>
               <input type="hidden" name="__rm_${f.name}" value="" />
               <button type="button" class="link-danger" data-act="rm-img" data-name="${f.name}">Hapus foto</button>
            </div>`;
         }

         break;

      default:

         control = `<input class="input" type="text" name="${f.name}" value="${esc(v)}"${req} />`;

   }

   return `<div class="${cls}"><label>${esc(f.label)}${f.required ? ' <i>*</i>' : ''}</label>${control}${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</div>`;

}



/* ==================================================================== */

/* 3. STATE                                                                                             */

/* ==================================================================== */



let settingsCache: Record<string, string> = {};

let rowsCache: Row[] = [];

let currentList: ListCfg | null = null;

let search = '';

let dirty = false;

let shellReady = false;

let renderToken = 0;

let userEmail = '';
let brandName = 'Yayasan Pena Al-Karim';
let brandLogoUrl = '';

function syncBrandingFromSettings(): void {
  brandName = settingsCache.nama_yayasan?.trim() || settingsCache.footer_nama?.trim() || 'Yayasan Pena Al-Karim';
  brandLogoUrl = settingsCache.logo_url?.trim() || '';
}

function brandLogoMarkup(): string {
  if (!brandLogoUrl) return LOGO;
  return `<img src="${esc(brandLogoUrl)}" alt="Logo ${esc(brandName)}" style="display:block;width:100%;height:100%;object-fit:contain;padding:3px;" />`;
}

async function loadBrandSettings(): Promise<void> {
  try {
    const { data, error } = await supabase.from('site_settings').select('key,value');
    if (error) return;
    settingsCache = Object.fromEntries((data ?? []).map((r) => [String(r.key), String(r.value ?? '')]));
    syncBrandingFromSettings();
  } catch {
    // Login tetap dapat ditampilkan dengan identitas cadangan jika pengaturan belum dapat dibaca.
  }
}


const panel = (): HTMLElement => document.getElementById('panel') as HTMLElement;

const skeleton = (): string => '<div class="skel" style="height:34px;width:40%;margin-bottom:12px"></div><div class="skel" style="height:16px;width:60%;margin-bottom:26px"></div><div class="skel" style="height:260px"></div>';



function pageHead(title: string, desc: string, actions = ''): string {

   return `<div class="ph"><div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div>${actions ? `<div class="ph-actions">${actions}</div>` : ''}</div>`;

}



/* ==================================================================== */

/* 4. TAMPILAN                                                                                        */

/* ==================================================================== */



function renderLogin(error = ''): void {

   shellReady = false;

   app.innerHTML = `

      <div class="login">

         <aside class="login-art">

            <div class="la-brand"><span class="logo">${brandLogoMarkup()}</span><strong>${esc(brandName)}</strong></div>

            <div class="la-copy">

               <h2>Kelola website yayasan dengan mudah.</h2>

               <ul>

                  <li>${ic('check')} Ganti teks dan foto tanpa menyentuh kode</li>

                  <li>${ic('check')} Atur pengurus, pengajar, dan galeri prestasi</li>

                  <li>${ic('check')} Perubahan tampil di situs dalam sekitar 1 menit</li>

               </ul>

            </div>

            <small>Khusus pengelola yayasan.</small>

         </aside>

         <section class="login-side">

            <form class="login-card" id="login-form" novalidate>

               <div class="lc-logo"><span class="logo">${brandLogoMarkup()}</span></div>

               <h1>Selamat datang</h1>

               <p class="sub">${esc(brandName)} · Masuk dengan akun admin untuk melanjutkan.</p>

               <div class="fld"><label for="em">Email</label><input class="input" id="em" name="email" type="email" autocomplete="username" placeholder="nama@email.com" required /></div>

               <div class="fld"><label for="pw">Password</label>

                  <div class="pw"><input class="input" id="pw" name="password" type="password" autocomplete="current-password" placeholder="Password" required />

                     <button type="button" class="icon-btn" data-act="toggle-pw" aria-label="Tampilkan password">${ic('eye')}</button></div></div>

               ${error ? `<div class="err" role="alert">${ic('alert')}<span>${esc(error)}</span></div>` : ''}

               <button class="btn btn-primary btn-block btn-lg" type="submit">Masuk</button>

               <a class="btn btn-ghost btn-block" href="/admin/reset-password">Lupa password?</a>

            </form>

         </section>

      </div>`;

   (document.getElementById('em') as HTMLInputElement).focus();

}



function renderShell(): void {

   shellReady = true;

   const nameInitial = (userEmail || 'A').charAt(0).toUpperCase();

   app.innerHTML = `

      <div class="adm" id="adm">

         <header class="topbar">

            <button class="icon-btn menu-btn" type="button" data-act="drawer" aria-label="Buka menu">${ic('menu')}</button>

            <a class="tb-brand" href="#/ringkasan" data-nav><span class="logo">${brandLogoMarkup()}</span><span class="tb-name">${esc(brandName)}</span></a>

            <div class="tb-right">

               <a class="btn btn-ghost btn-sm" href="/" target="_blank" rel="noopener">${ic('external')}<span>Lihat situs</span></a>

               <div class="user" title="${esc(userEmail)}"><span class="avatar">${esc(nameInitial)}</span><span class="email">${esc(userEmail)}</span></div>

               <button class="btn btn-ghost btn-sm" type="button" data-act="logout">${ic('logout')}<span>Keluar</span></button>

            </div>

         </header>

         <div class="layout">

            <aside class="side" id="side">

               <nav aria-label="Menu admin">

                  ${NAV.map((n) => `${n.section ? `<div class="nav-label">${n.section}</div>` : ''}<a class="nav-item" href="#/${n.id}" data-nav data-page="${n.id}">${ic(n.icon)}<span>${esc(n.label)}</span></a>`).join('')}

               </nav>

               <div class="side-tip">${ic('info')}<p>Perubahan tampil di situs publik dalam sekitar 1 menit.</p></div>

            </aside>

            <div class="scrim" data-act="drawer-close"></div>

            <main class="main" id="panel"></main>

         </div>

      </div>

      <dialog id="dlg"></dialog>`;

   const dlg = document.getElementById('dlg') as HTMLDialogElement;

   dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

   if (!location.hash) history.replaceState(null, '', '#/ringkasan');

   void renderRoute();

}



function setDrawer(open: boolean): void {

   document.getElementById('adm')?.classList.toggle('open', open);

}



async function renderRoute(): Promise<void> {

   const token = ++renderToken;

   dirty = false;

  const [page = 'ringkasan', sub = ''] = location.hash.replace(/^#\/?/, '').split('/');

   const known = NAV.some((n) => n.id === page);

   const active = known ? page : 'ringkasan';



   app.querySelectorAll<HTMLElement>('.nav-item').forEach((a) => a.classList.toggle('on', a.dataset.page === active));

   setDrawer(false);

   window.scrollTo({ top: 0 });

   currentList = LISTS.find((l) => l.id === active) ?? null;

   panel().innerHTML = skeleton();



   try {

      if (active === 'umum') await renderSettings(sub, token);

      else if (currentList) await renderList(currentList, token);

      else await renderDashboard(token);

   } catch (e) {

      if (token === renderToken) panel().innerHTML = `<div class="err">${ic('alert')}<span>Gagal memuat: ${esc(msg(e))}</span></div>`;

   }

}



/* ----- Ringkasan ----- */



async function renderDashboard(token: number): Promise<void> {

   const sRes = await supabase.from('site_settings').select('key,value');

   const lRes = await Promise.all(LISTS.map((l) => supabase.from(l.table).select('*')));

   if (token !== renderToken) return;

   if (sRes.error) throw sRes.error;

   const s: Record<string, string> = Object.fromEntries((sRes.data ?? []).map((r) => [r.key as string, r.value as string]));

   const data: Record<string, Row[]> = {};

   LISTS.forEach((l, i) => {

      const r = lRes[i];

      if (r.error) throw r.error;

      data[l.id] = (r.data ?? []) as Row[];

   });



   const issues: { text: string; href: string }[] = [];

   if (!s.hero_foto_url) issues.push({ text: 'Foto utama beranda belum diunggah.', href: '#/umum/beranda' });

   if (!s.hero_foto2_url) issues.push({ text: 'Foto kedua beranda (kartu yang bisa ditukar) belum diunggah.', href: '#/umum/beranda' });

   const noPhoto = (id: string): number => {
      const cfg = LISTS.find((item) => item.id === id);
      const imageField = cfg?.imageField;
      return data[id].filter((row) => !imageField || imageUrls(row[imageField]).length === 0).length;
   };

   if (noPhoto('program')) issues.push({ text: `${noPhoto('program')} program belum punya foto.`, href: '#/program' });

   if (noPhoto('kegiatan')) issues.push({ text: `${noPhoto('kegiatan')} slot galeri prestasi belum ada foto.`, href: '#/kegiatan' });

   if (data.pengurus.some((r) => String(r.nama).startsWith('Nama '))) issues.push({ text: 'Nama pengurus/pengajar masih contoh (“Nama …”).', href: '#/pengurus' });

   if (!s.email1 || s.email1.includes('contoh.com')) issues.push({ text: 'Email kontak masih contoh.', href: '#/umum/kontak' });

   (['kontak1_wa', 'kontak2_wa'] as const).forEach((k, i) => {

    if (s[k] && !/^(08|62|\+62)\d{7,13}$/.test(s[k].replace(/[\s-]/g, ''))) issues.push({ text: `Nomor WhatsApp kontak ${i + 1} (${s[k]}) sepertinya belum benar.`, href: '#/umum/kontak' });

   });



   const stats = LISTS.map((l) => {

      const rows = data[l.id];

      const sub = l.id === 'pengurus'

         ? `${rows.filter((r) => r.kategori === 'pengurus').length} pengurus · ${rows.filter((r) => r.kategori === 'pengajar').length} pengajar`

         : l.noun;

      return `<a class="stat" href="#/${l.id}" data-nav><span class="stat-ic">${ic(l.icon)}</span>

         <span class="stat-n">${rows.length}</span><span class="stat-l">${esc(l.label)}</span><small>${esc(sub)}</small><em>${ic('arrow')}</em></a>`;

   }).join('');



   const name = (userEmail.split('@')[0] || 'Admin').replace(/[._-]+/g, ' ');

   panel().innerHTML = `

      ${pageHead(`Halo, ${name}`, 'Ini ringkasan website yayasan. Pilih menu di samping untuk mengubah isinya.')}

      <section class="card todo-card">

         <h2 class="card-t">${issues.length ? 'Perlu dilengkapi' : 'Semua sudah lengkap'}</h2>

         ${issues.length

            ? `<div class="todos">${issues.map((x) => `<div class="todo">${ic('alert')}<span>${esc(x.text)}</span><a href="${x.href}" data-nav>Perbaiki ${ic('arrow')}</a></div>`).join('')}</div>`

            : `<div class="todo ok">${ic('check')}<span>Foto, kontak, dan data utama sudah terisi. Kerja bagus!</span></div>`}

      </section>

      <h2 class="sec-t">Konten</h2>

      <div class="stats-a">${stats}</div>

      <h2 class="sec-t">Aksi cepat</h2>

      <div class="quick">
        <a class="btn btn-outline" href="#/umum/identitas" data-nav>${ic('image')}<span>Atur identitas & logo</span></a>
        <a class="btn btn-outline" href="#/umum/beranda" data-nav>${ic('image')}<span>Ganti foto beranda</span></a>
        <a class="btn btn-outline" href="#/umum/visi" data-nav>${ic('edit')}<span>Ubah visi</span></a>
        <a class="btn btn-outline" href="#/umum/misi" data-nav>${ic('edit')}<span>Ubah misi</span></a>
        <a class="btn btn-outline" href="#/prestasi" data-nav>${ic('check')}<span>Atur prestasi & capaian</span></a>
        <a class="btn btn-outline" href="#/kegiatan" data-nav>${ic('plus')}<span>Tambah foto galeri</span></a>
        <a class="btn btn-outline" href="#/pengurus" data-nav>${ic('users')}<span>Atur pengurus</span></a>
        <a class="btn btn-outline" href="#/umum/kontak" data-nav>${ic('edit')}<span>Ubah kontak & maps</span></a>
      </div>`;

}



/* ----- Teks & Foto Umum ----- */



async function renderSettings(groupId: string, token: number): Promise<void> {

   const { data, error } = await supabase.from('site_settings').select('key,value');

   if (token !== renderToken) return;

   if (error) throw error;

   settingsCache = Object.fromEntries((data ?? []).map((r) => [r.key as string, r.value as string]));
   syncBrandingFromSettings();

   const g = GROUPS.find((x) => x.id === groupId) ?? GROUPS[0];



   panel().innerHTML = `

      ${pageHead('Teks & Foto Umum', 'Pilih bagian yang mau diubah, lalu simpan.')}

      <div class="seg" role="tablist">

         ${GROUPS.map((x) => `<a href="#/umum/${x.id}" data-nav role="tab" class="${x.id === g.id ? 'on' : ''}">${esc(x.label)}</a>`).join('')}

      </div>

      <form class="card" data-group="${g.id}">

         <div class="card-head"><h2 class="card-t">${esc(g.label)}</h2><p>${esc(g.desc)}</p></div>

         <div class="fgrid">${g.fields.map((f) => fieldHtml(f, settingsCache[f.name] ?? '')).join('')}</div>

         <div class="formbar">

            <span class="fb-status">Semua perubahan tersimpan</span>

            <span class="fb-btns">

               <button class="btn btn-outline" type="button" data-act="reset-form">Batal</button>

               <button class="btn btn-primary" type="submit" data-save disabled>Simpan perubahan</button>

            </span>

         </div>

      </form>`;

}



function markDirty(form: HTMLFormElement): void {

   dirty = true;

   form.classList.add('is-dirty');

   const btn = form.querySelector<HTMLButtonElement>('[data-save]');

   if (btn) btn.disabled = false;

   const st = form.querySelector('.fb-status');

   if (st) st.textContent = 'Ada perubahan yang belum disimpan';

}



/* ----- Daftar (program, galeri, pengurus, dst) ----- */



async function fetchRows(cfg: ListCfg): Promise<Row[]> {

   const { data, error } = await supabase.from(cfg.table).select('*').order('urutan').order('id');

   if (error) throw error;

   return (data ?? []) as Row[];

}



async function renderList(cfg: ListCfg, token: number): Promise<void> {

   const rows = await fetchRows(cfg);

   if (token !== renderToken) return;

   rowsCache = rows;

   search = '';

   panel().innerHTML = `

      ${pageHead(cfg.label, cfg.desc, `<button class="btn btn-primary" type="button" data-act="add">${ic('plus')}<span>Tambah ${esc(cfg.noun.toLowerCase())}</span></button>`)}

      <div class="toolbar">

         <label class="search">${ic('search')}<input type="search" data-search placeholder="Cari di ${esc(cfg.label.toLowerCase())}…" autocomplete="off" /></label>

         <span class="count" id="count"></span>

      </div>

      <div id="items"></div>`;

   renderItems(cfg);

}



async function refreshList(cfg: ListCfg): Promise<void> {

   rowsCache = await fetchRows(cfg);

   renderItems(cfg);

}



function groupOf(cfg: ListCfg, r: Row): string {

   return cfg.groupBy ? String(r[cfg.groupBy] ?? '') : '';

}



function renderItems(cfg: ListCfg): void {

   const q = search.trim().toLowerCase();

   const match = (r: Row): boolean => !q || [cfg.titleField, ...cfg.subFields].some((k) => String(r[k] ?? '').toLowerCase().includes(q));

   const visible = rowsCache.filter(match);

   const canMove = !q;

   const count = document.getElementById('count');

   if (count) count.textContent = q ? `${visible.length} dari ${rowsCache.length}` : `${rowsCache.length} item`;



   const groupField = cfg.groupBy ? cfg.fields.find((f) => f.name === cfg.groupBy) : undefined;

   const sections = groupField?.options

      ? groupField.options.map((o) => ({ label: o.label, key: o.value }))

      : [{ label: '', key: '' }];



   const html = sections.map((sec) => {

      const siblings = rowsCache.filter((r) => groupOf(cfg, r) === sec.key || !cfg.groupBy);

      const rows = visible.filter((r) => !cfg.groupBy || groupOf(cfg, r) === sec.key);

      if (!rows.length) return '';

      const cards = rows.map((r) => itemHtml(cfg, r, siblings.findIndex((x) => x.id === r.id), siblings.length, canMove)).join('');

      return `${sec.label ? `<h2 class="sec-t">${esc(sec.label)} <span>${rows.length}</span></h2>` : ''}<div class="${cfg.imageField ? 'cards' : 'rows'}">${cards}</div>`;

   }).join('');



   (document.getElementById('items') as HTMLElement).innerHTML = html || `

      <div class="empty-state">${ic(q ? 'search' : cfg.icon)}

         <h3>${q ? 'Tidak ada yang cocok' : 'Belum ada data'}</h3>

         <p>${q ? 'Coba kata kunci lain.' : `Mulai dengan menambahkan ${esc(cfg.noun.toLowerCase())} pertama.`}</p>

         ${q ? '' : `<button class="btn btn-primary" type="button" data-act="add">${ic('plus')}<span>Tambah ${esc(cfg.noun.toLowerCase())}</span></button>`}

      </div>`;

}



function itemHtml(cfg: ListCfg, r: Row, i: number, n: number, canMove: boolean): string {

   const title = String(r[cfg.titleField] ?? '');

   const sub = cfg.subFields.filter((k) => k !== cfg.groupBy).map((k) => r[k]).filter(Boolean).join(' · ');

   const imageValue = cfg.imageField ? r[cfg.imageField] : null;
   const url = Array.isArray(imageValue) ? (imageValue[0] ?? null) : (typeof imageValue === 'string' ? imageValue : null);

   const acts = `<div class="acts" data-act="none">

      ${canMove ? `<button class="icon-btn" type="button" data-act="up" data-id="${r.id}" aria-label="Naikkan" ${i === 0 ? 'disabled' : ''}>${ic('up')}</button>

      <button class="icon-btn" type="button" data-act="down" data-id="${r.id}" aria-label="Turunkan" ${i === n - 1 ? 'disabled' : ''}>${ic('down')}</button>` : ''}

      <button class="icon-btn" type="button" data-act="edit" data-id="${r.id}" aria-label="Ubah">${ic('edit')}</button>

      <button class="icon-btn danger" type="button" data-act="del" data-id="${r.id}" aria-label="Hapus">${ic('trash')}</button></div>`;

   const body = `<div class="ci-body"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>`;

   if (cfg.imageField) {

      return `<article class="ci" data-act="edit" data-id="${r.id}">

         <div class="ci-media">${url ? `<img src="${esc(url)}" alt="" loading="lazy" />` : `<div class="ph-empty">${ic('image')}<span>Belum ada foto</span></div>`}</div>

         ${body}${acts}</article>`;

   }

   return `<article class="row" data-act="edit" data-id="${r.id}"><span class="num">${i + 1}</span>${body}${acts}</article>`;

}



function openDialog(cfg: ListCfg, row?: Row): void {

   const dlg = document.getElementById('dlg') as HTMLDialogElement;

   const nextOrder = Math.max(0, ...rowsCache.map((r) => Number(r.urutan) || 0)) + 1;

   const val = (f: Field): string | string[] | number | null =>

      row ? row[f.name] : f.name === 'urutan' ? nextOrder : f.type === 'select' ? (f.options?.[0].value ?? '') : '';

   dlg.innerHTML = `

      <form id="row-form" data-list="${cfg.id}" data-id="${row?.id ?? ''}">

         <header class="dlg-h"><h3>${row ? 'Ubah' : 'Tambah'} ${esc(cfg.noun.toLowerCase())}</h3>

            <button class="icon-btn" type="button" data-act="close" aria-label="Tutup">${ic('x')}</button></header>

         <div class="dlg-b"><div class="fgrid">${cfg.fields.map((f) => fieldHtml(f, val(f))).join('')}</div></div>

         <footer class="dlg-f">

            <button class="btn btn-outline" type="button" data-act="close">Batal</button>

            <button class="btn btn-primary" type="submit">Simpan</button>

         </footer>

      </form>`;

   dlg.showModal();

   dlg.querySelector<HTMLElement>('.dlg-b input:not([type=file]):not([type=hidden]), .dlg-b textarea, .dlg-b select')?.focus();

}



/* ==================================================================== */

/* 5. AKSI                                                                                              */

/* ==================================================================== */



async function submitLogin(form: HTMLFormElement): Promise<void> {

   const d = new FormData(form);

   setBusy(form, true);

   const { data, error } = await supabase.auth.signInWithPassword({ email: String(d.get('email')).trim(), password: String(d.get('password')) });

   if (error) {

      renderLogin(error.message.toLowerCase().includes('invalid') ? 'Email atau password salah.' : error.message);

      return;

   }

   userEmail = data.user?.email ?? '';

   renderShell();

}



async function submitSettings(form: HTMLFormElement): Promise<void> {

   const group = GROUPS.find((g) => g.id === form.dataset.group) as Group;

   const rows: { key: string; value: string }[] = [];

   const oldToDelete: string[] = [];

   const uploaded: string[] = [];

   setBusy(form, true);

   try {

      for (const f of group.fields) {

         const old = settingsCache[f.name] ?? '';

         let value: string;

         if (f.type === 'image') {

            value = (await resolveImage(form, f, old || null, 'umum', uploaded)) ?? '';

            if (old && value !== old) oldToDelete.push(old);

         } else {

            value = normalize(f.name, (form.elements.namedItem(f.name) as HTMLInputElement).value.trim());

         }

         rows.push({ key: f.name, value });

      }

      const { error } = await supabase.from('site_settings').upsert(rows);

      if (error) throw error;
      rows.forEach(({ key, value }) => { settingsCache[key] = value; });
      syncBrandingFromSettings();
      app.querySelectorAll<HTMLElement>('.tb-name').forEach((el) => { el.textContent = brandName; });
      app.querySelectorAll<HTMLElement>('.tb-brand .logo').forEach((el) => { el.innerHTML = brandLogoMarkup(); });

      await Promise.all(oldToDelete.map(removeImage));

      toast('Tersimpan. Di situs publik tampil dalam ±1 menit.');

      await renderRoute();

   } catch (e) {

      await Promise.all(uploaded.map(removeImage));

      toast(msg(e), 'bad');

      setBusy(form, false);

   }

}



async function submitRow(form: HTMLFormElement): Promise<void> {

   const cfg = LISTS.find((l) => l.id === form.dataset.list) as ListCfg;

   const id = form.dataset.id ? Number(form.dataset.id) : null;

   const old = id ? rowsCache.find((r) => r.id === id) : undefined;

   const payload: Record<string, string | string[] | number | null> = {};

   const oldToDelete: string[] = [];

   const uploaded: string[] = [];

   setBusy(form, true);

   try {

      for (const f of cfg.fields) {

         if (f.type === 'image') {

            if (f.multiple) {
               const oldUrls = imageUrls(old?.[f.name]);
               const newUrls = await resolveImages(form, f, oldUrls, cfg.folder, uploaded);
               oldToDelete.push(...oldUrls.filter((url) => !newUrls.includes(url)));
               payload[f.name] = newUrls;
            } else {
               const oldValue = old?.[f.name];
               const oldUrl = typeof oldValue === 'string' ? oldValue : null;
               const url = await resolveImage(form, f, oldUrl, cfg.folder, uploaded);
               if (oldUrl && url !== oldUrl) oldToDelete.push(oldUrl);
               payload[f.name] = url;
            }

         } else {

            const v = (form.elements.namedItem(f.name) as HTMLInputElement).value.trim();

            payload[f.name] = f.type === 'number' ? (v === '' ? 0 : Number(v)) : v === '' && !f.required ? null : v;

         }

      }

      const { error } = id

         ? await supabase.from(cfg.table).update(payload).eq('id', id)

         : await supabase.from(cfg.table).insert(payload);

      if (error) throw error;

      await Promise.all(oldToDelete.map(removeImage));

      (document.getElementById('dlg') as HTMLDialogElement).close();

      toast(id ? 'Perubahan tersimpan.' : `${cfg.noun} ditambahkan.`);

      await refreshList(cfg);

   } catch (e) {

      await Promise.all(uploaded.map(removeImage));

      toast(msg(e), 'bad');

      setBusy(form, false);

   }

}



async function deleteRow(cfg: ListCfg, id: number): Promise<void> {

   const row = rowsCache.find((r) => r.id === id);

   if (!row) return;

   const ok = await ask(`Hapus ${cfg.noun.toLowerCase()} ini?`, `“${String(row[cfg.titleField]).slice(0, 80)}” akan dihapus permanen dan tidak bisa dikembalikan.`, 'Ya, hapus', true);

   if (!ok) return;

   const { error } = await supabase.from(cfg.table).delete().eq('id', id);

   if (error) { toast(msg(error), 'bad'); return; }

   if (cfg.imageField) {
      const imageValue = row[cfg.imageField];
      const urls = imageUrls(imageValue);
      await Promise.all(urls.map(removeImage));
   }

   toast('Dihapus.');

   await refreshList(cfg);

}



async function moveRow(cfg: ListCfg, id: number, dir: -1 | 1): Promise<void> {

   const row = rowsCache.find((r) => r.id === id);

   if (!row) return;

   const siblings = rowsCache.filter((r) => !cfg.groupBy || groupOf(cfg, r) === groupOf(cfg, row));

   const i = siblings.findIndex((r) => r.id === id);

   const j = i + dir;

   if (j < 0 || j >= siblings.length) return;

   [siblings[i], siblings[j]] = [siblings[j], siblings[i]];

   const changes: { id: number; urutan: number }[] = [];

   siblings.forEach((r, idx) => {

      if (Number(r.urutan) !== idx + 1) changes.push({ id: r.id, urutan: idx + 1 });

   });

   // tampil dulu (optimistis), simpan di belakang layar

   changes.forEach((c) => { const r = rowsCache.find((x) => x.id === c.id); if (r) r.urutan = c.urutan; });

   rowsCache.sort((a, b) => Number(a.urutan) - Number(b.urutan) || a.id - b.id);

   renderItems(cfg);

   const results = await Promise.all(changes.map((c) => supabase.from(cfg.table).update({ urutan: c.urutan }).eq('id', c.id)));

   const failed = results.find((r) => r.error);

   if (failed?.error) {

      toast(`Gagal menyimpan urutan: ${msg(failed.error)}`, 'bad');

      await refreshList(cfg);

   }

}



/* ==================================================================== */

/* 6. EVENT (delegasi, dipasang sekali)                                                   */

/* ==================================================================== */



app.addEventListener('click', (ev) => {

   const target = ev.target as HTMLElement;



   // Navigasi: tanya dulu kalau ada perubahan yang belum disimpan

   const link = target.closest<HTMLAnchorElement>('a[data-nav]');

   if (link) {

      setDrawer(false);

      if (dirty) {

         ev.preventDefault();

         const href = link.getAttribute('href') ?? '#/ringkasan';

         void ask('Buang perubahan?', 'Ada perubahan yang belum disimpan. Kalau pindah halaman sekarang, perubahan itu hilang.', 'Buang & pindah', true).then((ok) => {

            if (!ok) return;

            dirty = false;

            location.hash = href;

         });

      }

      return;

   }



   const el = target.closest<HTMLElement>('[data-act]');

   if (!el) return;

   const act = el.dataset.act;

   const cfg = currentList;

   const id = Number(el.dataset.id);



   switch (act) {

      case 'drawer': setDrawer(!document.getElementById('adm')?.classList.contains('open')); break;

      case 'drawer-close': setDrawer(false); break;

      case 'logout': void supabase.auth.signOut().then(() => renderLogin()); break;

      case 'add': if (cfg) openDialog(cfg); break;

      case 'edit': { const row = rowsCache.find((r) => r.id === id); if (cfg && row) openDialog(cfg, row); break; }

      case 'del': if (cfg) void deleteRow(cfg, id); break;

      case 'up': if (cfg) void moveRow(cfg, id, -1); break;

      case 'down': if (cfg) void moveRow(cfg, id, 1); break;

      case 'close': (document.getElementById('dlg') as HTMLDialogElement).close(); break;

      case 'reset-form': void renderRoute(); break;

      case 'toggle-pw': {

         const input = document.getElementById('pw') as HTMLInputElement;

         const show = input.type === 'password';

         input.type = show ? 'text' : 'password';

         el.innerHTML = ic(show ? 'eyeoff' : 'eye');

         break;

      }

      case 'rm-multi-img': {
         const form = el.closest('form') as HTMLFormElement;
         const name = el.dataset.name as string;
         const url = el.dataset.url ?? '';
         const hidden = form.elements.namedItem(`__rm_${name}`) as HTMLInputElement | null;
         if (hidden && url) {
            let removed: string[] = [];
            try {
               const parsed: unknown = JSON.parse(hidden.value || '[]');
               if (Array.isArray(parsed)) removed = parsed.filter((item): item is string => typeof item === 'string');
            } catch { removed = []; }
            if (!removed.includes(url)) removed.push(url);
            hidden.value = JSON.stringify(removed);
         }
         el.closest('.multi-photo')?.remove();
         if (form.matches('form[data-group]')) markDirty(form);
         break;
      }

      case 'rm-multi-all': {
         const form = el.closest('form') as HTMLFormElement;
         const name = el.dataset.name as string;
         const hidden = form.elements.namedItem(`__rm_${name}`) as HTMLInputElement | null;
         const existing = Array.from(form.querySelectorAll<HTMLElement>('.multi-photo[data-existing-url]'))
            .map((item) => item.dataset.existingUrl)
            .filter((url): url is string => Boolean(url));
         if (hidden) {
            let removed: string[] = [];
            try {
               const parsed: unknown = JSON.parse(hidden.value || '[]');
               if (Array.isArray(parsed)) removed = parsed.filter((item): item is string => typeof item === 'string');
            } catch { removed = []; }
            hidden.value = JSON.stringify([...new Set([...removed, ...existing])]);
         }
         form.querySelector('.multi-existing')?.replaceChildren();
         if (form.matches('form[data-group]')) markDirty(form);
         break;
      }

      case 'rm-img': {

         const form = el.closest('form') as HTMLFormElement;

         const name = el.dataset.name as string;

         (form.elements.namedItem(`__rm_${name}`) as HTMLInputElement).value = '1';

         (form.elements.namedItem(name) as HTMLInputElement).value = '';

         el.closest('.imgfield')?.classList.remove('has-img');

         if (form.matches('form[data-group]')) markDirty(form);

         break;

      }

      default: break;

   }

});



app.addEventListener('input', (ev) => {

   const target = ev.target as HTMLInputElement;

   if (target.matches('[data-search]')) {

      search = target.value;

      if (currentList) renderItems(currentList);

      return;

   }

   const form = target.closest<HTMLFormElement>('form[data-group]');

   if (form) markDirty(form);

});



app.addEventListener('change', (ev) => {

   const input = ev.target as HTMLInputElement;
   if (input.type !== 'file' || !input.files?.length) return;

   const form = input.closest('form') as HTMLFormElement;
   const wrap = input.closest('.imgfield');

   if (input.multiple) {
      // Untuk banyak foto, pertahankan pilihan hapus foto lama dan tampilkan pratinjau semua foto baru.
      const selected = wrap?.querySelector<HTMLElement>('.multi-selected');
      const files = Array.from(input.files);
      if (selected) {
         selected.innerHTML = files.map((file) => {
            const previewUrl = URL.createObjectURL(file);
            return `<div style="min-width:0;"><img src="${previewUrl}" alt="${esc(file.name)}" style="display:block;width:100%;height:96px;object-fit:cover;border-radius:10px;border:1px solid #dce3e8;" /><small style="display:block;overflow-wrap:anywhere;margin-top:4px;">${esc(file.name)}</small></div>`;
         }).join('');
      }
      wrap?.classList.add('has-img');
   } else {
      (form.elements.namedItem(`__rm_${input.name}`) as HTMLInputElement).value = '';
      const prev = wrap?.querySelector<HTMLImageElement>('.drop-prev');
      if (prev) prev.src = URL.createObjectURL(input.files[0]);
      wrap?.classList.add('has-img');
   }

   if (form.matches('form[data-group]')) markDirty(form);

});



// Seret & lepas foto ke area unggah

app.addEventListener('dragover', (ev) => {

   const drop = (ev.target as HTMLElement).closest('.drop');

   if (drop) { ev.preventDefault(); drop.classList.add('over'); }

});

app.addEventListener('dragleave', (ev) => {

   (ev.target as HTMLElement).closest('.drop')?.classList.remove('over');

});

app.addEventListener('drop', (ev) => {

   const drop = (ev.target as HTMLElement).closest<HTMLElement>('.drop');

   if (!drop) return;

   ev.preventDefault();

   drop.classList.remove('over');

   const input = drop.querySelector<HTMLInputElement>('input[type=file]');
   const droppedFiles = Array.from(ev.dataTransfer?.files ?? []).filter((file) => file.type.startsWith('image/'));

   if (!input || !droppedFiles.length) { toast('File harus berupa gambar.', 'bad'); return; }

   const dt = new DataTransfer();
   for (const file of (input.multiple ? droppedFiles : droppedFiles.slice(0, 1))) dt.items.add(file);

   input.files = dt.files;
   input.dispatchEvent(new Event('change', { bubbles: true }));

});



app.addEventListener('submit', (ev) => {

   ev.preventDefault();

   const form = ev.target as HTMLFormElement;

   if (form.id === 'login-form') void submitLogin(form);

   else if (form.id === 'row-form') void submitRow(form);

   else if (form.dataset.group !== undefined) void submitSettings(form);

});



window.addEventListener('hashchange', () => { if (shellReady) void renderRoute(); });

window.addEventListener('beforeunload', (e) => { if (dirty) e.preventDefault(); });

supabase.auth.onAuthStateChange((event) => { if (event === 'SIGNED_OUT' && shellReady) renderLogin(); });



/* ==================================================================== */

/* 7. MULAI                                                                                             */

/* ==================================================================== */



void (async () => {
  await loadBrandSettings();
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    userEmail = data.session.user.email ?? '';
    renderShell();
  } else {
    renderLogin();
  }
})();
