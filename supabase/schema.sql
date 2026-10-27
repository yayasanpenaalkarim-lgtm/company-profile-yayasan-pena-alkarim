-- =====================================================================
-- SCHEMA WEB YAYASAN  |  Jalankan di Supabase: SQL Editor > New query > Run
-- Aman dijalankan ulang: tabel lama dihapus dulu lalu dibuat lagi
-- (isinya hanya data contoh, jadi jalankan ulang SEBELUM kamu mengisi data asli).
-- =====================================================================

drop table if exists public.site_settings, public.program, public.poin_misi,
  public.pengurus, public.kegiatan, public.footer_link, public.statistik, public.nilai cascade;

-- 1) TABEL ------------------------------------------------------------

-- Teks & foto umum (hero, visi, misi, kontak, maps, footer) -> key/value
create table public.site_settings (
  key   text primary key,
  value text not null default ''
);

-- 4 kartu "Program Unggulan": foto + deskripsi
create table public.program (
  id        bigint generated always as identity primary key,
  deskripsi text not null,
  foto_url  text,
  urutan    int not null default 0
);

-- 6 kartu poin misi di sisi kanan bagian Visi & Misi
create table public.poin_misi (
  id        bigint generated always as identity primary key,
  deskripsi text not null,
  urutan    int not null default 0
);

-- Ketua yayasan, pengurus, dan pengajar dalam 1 tabel (dibedakan kolom kategori)
create table public.pengurus (
  id        bigint generated always as identity primary key,
  nama      text not null,
  jabatan   text not null,
  kategori  text not null default 'pengurus' check (kategori in ('pengurus','pengajar')),
  deskripsi text,
  foto_url  text,
  urutan    int not null default 0
);

-- Galeri prestasi: foto saja. "judul" hanya penanda di admin + teks alternatif foto
create table public.kegiatan (
  id       bigint generated always as identity primary key,
  judul    text not null,
  foto_url text,
  urutan   int not null default 0
);

-- Daftar tautan di kolom kanan footer
create table public.footer_link (
  id     bigint generated always as identity primary key,
  label  text not null,
  url    text not null default '/',
  urutan int not null default 0
);

-- 2) KEAMANAN (RLS) ---------------------------------------------------
-- Publik (tanpa login) = hanya boleh BACA.
-- User yang login (admin)  = boleh tambah / ubah / hapus.
-- PENTING: matikan "Allow new users to sign up" di Authentication > Sign In / Providers,
-- supaya hanya akun admin yang kamu buat manual yang bisa login.

do $$
declare t text;
begin
  foreach t in array array['site_settings','program','poin_misi','pengurus','kegiatan','footer_link']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "publik baca" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin tulis" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Izin akses ke Data API (tetap dibatasi oleh aturan RLS di atas)
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;

-- 3) STORAGE FOTO -----------------------------------------------------
-- Bucket "foto" bersifat publik (foto bisa dilihat siapa saja lewat URL),
-- tapi upload / ganti / hapus hanya untuk admin yang login.

insert into storage.buckets (id, name, public)
values ('foto', 'foto', true)
on conflict (id) do nothing;

drop policy if exists "foto admin upload" on storage.objects;
drop policy if exists "foto admin ubah"   on storage.objects;
drop policy if exists "foto admin hapus"  on storage.objects;

create policy "foto admin upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'foto');
create policy "foto admin ubah" on storage.objects for update to authenticated
  using (bucket_id = 'foto') with check (bucket_id = 'foto');
create policy "foto admin hapus" on storage.objects for delete to authenticated
  using (bucket_id = 'foto');

-- 4) ISI AWAL (sesuai desain; semuanya bisa diganti dari halaman admin) --

insert into public.site_settings (key, value) values
  -- identitas & navigasi
  ('nama_yayasan',      'Yayasan abc'),
  ('banner_teks',       ''),   -- kosongkan = tidak ada banner hijau di paling atas
  ('donasi_link',       '/#kontak'),   -- tujuan tombol "Donasi Sekarang" (boleh link WhatsApp / halaman donasi)
  -- beranda
  ('hero_badge',        'Lembaga Terakreditasi A'),
  ('hero_judul',        'Membangun Generasi Rabbani'),
  ('hero_highlight',    'Berprestasi'),
  ('hero_deskripsi',    'Kami bergerak di bidang pendidikan, keagamaan, dan sosial untuk melahirkan generasi yang berilmu, beriman, dan berakhlak mulia, serta peduli terhadap sesama.'),
  ('hero_tombol_label', 'Pelajari Lebih Lanjut'),
  ('hero_foto_url',     ''),
  -- program
  ('program_judul',     'Program Unggulan Yayasan'),
  ('program_deskripsi', 'Program pendidikan, pembinaan Al-Qur''an, dan kegiatan sosial yang kami jalankan untuk anak, remaja, dan masyarakat.'),
  -- visi & misi
  ('profil_judul',      'Visi & Misi Mulia Untuk Generasi Rabbani'),
  ('profil_deskripsi',  'Yayasan kami didirikan atas kesadaran pentingnya sinergi ilmu agama yang kokoh dan keunggulan intelektual terapan demi menjawab tantangan era disrupsi peradaban.'),
  ('visi',              'Menjadi yayasan yang amanah dan berdaya guna dalam membangun generasi berilmu, beriman, berakhlak mulia, serta memberikan manfaat bagi masyarakat.'),
  ('misi',              'Menyelenggarakan pendidikan yang berkualitas dan berkarakter Islami.'),
  -- halaman pengurus & galeri
  ('pengurus_judul',    'Pengurus & Tenaga Pengajar'),
  ('pengurus_deskripsi','Orang-orang yang menjaga amanah dan membimbing anak-anak didik setiap hari.'),
  ('galeri_judul',      'Galeri Prestasi Yayasan'),
  -- kontak
  ('alamat',            'Jln. Masjid RT 07/10 No. 105 Kp. Ciater Pondok Sentul Kec. Serpong Tangerang Selatan Banten'),
  ('kontak1_nama',      'Zulkarnain, S. Pd'),
  ('kontak1_wa',        '081380102537'),
  ('kontak2_nama',      'Syafitri Yuliana, S. Pd'),
  ('kontak2_wa',        '018107105976'),
  ('email1',            'nama@contoh.com'),
  ('maps_embed_url',    'https://www.google.com/maps?q=Kp.+Ciater+Pondok+Sentul+Serpong+Tangerang+Selatan&output=embed'),
  -- footer
  ('footer_nama',       'Yayasan Pendidikan'),
  ('footer_deskripsi',  'Yayasan yang bergerak di bidang pendidikan, keagamaan, dan sosial untuk membangun generasi berilmu, berakhlak, dan bermanfaat bagi masyarakat.'),
  ('footer_kolom2_judul','Struktur & Akuntabilitas'),
  ('footer_kolom2_teks','Pengelolaan program pendidikan dan keagamaan, pelaksanaan kegiatan sosial dan kemanusiaan, pembinaan peserta didik dan masyarakat, serta pengembangan kerja sama dengan lembaga pendidikan, pemerintah, komunitas, orang tua/wali, dan pihak lainnya.

Pengelolaan yayasan secara amanah, transparan, dan bertanggung jawab.'),
  ('footer_kolom3_judul','Pendidikan & Sosial');

insert into public.program (deskripsi, urutan) values
  ('Pembinaan Al-Qur''an untuk anak, remaja, dan masyarakat.', 1),
  ('Beasiswa dan dukungan pendidikan bagi anak yang membutuhkan.', 2),
  ('Santunan, bantuan sosial, dan kepedulian kemanusiaan.', 3),
  ('Program berbagi makanan, Ramadan, qurban, dan kegiatan sosial lainnya.', 4);

insert into public.poin_misi (deskripsi, urutan) values
  ('Mengembangkan pendidikan dan pembinaan Al-Qur''an serta keagamaan.', 1),
  ('Memberdayakan masyarakat melalui program pendidikan, keagamaan, dan sosial.', 2),
  ('Membentuk generasi yang berakhlak, mandiri, dan peduli terhadap sesama.', 3),
  ('Membangun kemitraan yang luas untuk meningkatkan kebermanfaatan yayasan.', 4),
  ('Menyelenggarakan kegiatan sosial dan kemanusiaan bagi masyarakat.', 5),
  ('Mengelola yayasan secara profesional, amanah, transparan, dan berkelanjutan.', 6);

insert into public.pengurus (nama, jabatan, kategori, deskripsi, urutan) values
  ('Nama Ketua Yayasan', 'Ketua Yayasan', 'pengurus', null, 1),
  ('Nama Sekretaris',    'Sekretaris',    'pengurus', null, 2),
  ('Nama Bendahara',     'Bendahara',     'pengurus', null, 3),
  ('Nama Pengajar 1',    'Guru PAUD',     'pengajar', null, 1),
  ('Nama Pengajar 2',    'Guru Al-Qur''an','pengajar', null, 2);

insert into public.kegiatan (judul, urutan) values
  ('Penerimaan piala prestasi anak didik', 1),
  ('Penyerahan penghargaan pada acara yayasan', 2),
  ('Foto bersama peserta berprestasi', 3),
  ('Dokumentasi kegiatan 4', 4),
  ('Dokumentasi kegiatan 5', 5);

insert into public.footer_link (label, url, urutan) values
  ('Program Pendidikan Paud As syauki',            '/#program', 1),
  ('Program Pembelajaran dan Pembinaan Al-Quran',  '/#program', 2),
  ('Program Pelatihan Guru',                       '/#program', 3),
  ('Program Beasiswa Pendidikan',                  '/#program', 4),
  ('Program Seminar dan Parenting',                '/#program', 5),
  ('Hubungi Pengurus',                             '/pengurus', 6);
