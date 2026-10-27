import { supabaseServer as db } from './supabase';

export type Settings = Record<string, string>;

export interface Program { id: number; deskripsi: string; foto_urls: string[]; urutan: number }
export interface PoinMisi { id: number; deskripsi: string; urutan: number }
export interface Pengurus {
  id: number; nama: string; jabatan: string; kategori: 'pengurus' | 'pengajar';
  deskripsi: string | null; foto_url: string | null; urutan: number;
}
// Tambahkan struktur datanya
export interface Prestasi { id: number; deskripsi: string; urutan: number }

// Tambahkan fungsi pengambil datanya
export async function getPrestasi(): Promise<Prestasi[]> {
  return must(await db.from('prestasi').select('*').order('urutan'), 'prestasi');
}
export interface Kegiatan { id: number; judul: string; foto_url: string | null; urutan: number }
export interface FooterLink { id: number; label: string; url: string; urutan: number }

function must<T>(res: { data: T | null; error: { message: string } | null }, label: string): T {
  if (res.error) throw new Error(`Gagal ambil ${label}: ${res.error.message}`);
  return (res.data ?? []) as T;
}

export async function getSettings(): Promise<Settings> {
  const rows = must(await db.from('site_settings').select('key,value'), 'pengaturan') as { key: string; value: string }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
export async function getProgram(): Promise<Program[]> {
  return must(await db.from('program').select('*').order('urutan'), 'program');
}
export async function getPoinMisi(): Promise<PoinMisi[]> {
  return must(await db.from('poin_misi').select('*').order('urutan'), 'poin misi');
}
export async function getPengurus(kategori?: 'pengurus' | 'pengajar'): Promise<Pengurus[]> {
  let q = db.from('pengurus').select('*').order('urutan');
  if (kategori) q = q.eq('kategori', kategori);
  return must(await q, 'pengurus');
}
export async function getKegiatan(limit?: number): Promise<Kegiatan[]> {
  let q = db.from('kegiatan').select('*').order('urutan');
  if (limit) q = q.limit(limit);
  return must(await q, 'kegiatan');
}
export async function getFooterLinks(): Promise<FooterLink[]> {
  return must(await db.from('footer_link').select('*').order('urutan'), 'footer');
}

/** "Ahmad Fulan" -> "AF" (dipakai kalau foto belum diunggah) */
export function inisial(nama: string): string {
  const kata = nama
    .replace(/\b(KH|Ust|Ustzh|Hj|H|Dr|Drs|Ir|Prof)\.?\s/gi, '')
    .split(/[\s,]+/)
    .filter(Boolean);
  return ((kata[0]?.[0] ?? '') + (kata[1]?.[0] ?? '')).toUpperCase();
}
