// Base URL: default ke proxy Next.js (/api/v1 -> http://127.0.0.1:8000/api/v1, lihat next.config.ts).
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

export function authHeaders(): Record<string, string> {
  return { Accept: 'application/json' };
}

/**
 * Satu pintu fetch ke backend. Sesi memakai cookie httpOnly dari backend, jadi
 * frontend tidak menyimpan atau membaca token; cukup kirim cookie (credentials).
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    ...init,
    headers,
  });
}

export function clearAuth(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

let refreshBerjalan: Promise<boolean> | null = null;

/** Tukar token lewat backend (POST /auth/refresh); dipakai otomatis saat API membalas 401. */
export function refreshSession(): Promise<boolean> {
  if (refreshBerjalan) return refreshBerjalan;

  refreshBerjalan = (async () => {
    try {
      const res = await apiFetch('/auth/refresh', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshBerjalan = null;
    }
  })();

  return refreshBerjalan;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    clearAuth();
    window.location.replace('/login');
  }
}

function pesanDari(body: { message?: unknown; errors?: unknown } | null, status: number): string {
  const galat = body?.errors as Record<string, string[]> | undefined;
  const pesanField = galat ? Object.values(galat).flat()[0] : undefined;
  return String(pesanField ?? body?.message ?? `API error ${status}`);
}

function ikutiPenolakanAkses(status: number, body: { redirect_to?: unknown } | null): void {
  if (typeof window === 'undefined') return;
  const tujuan = (status === 401 || status === 403)
    && typeof body?.redirect_to === 'string'
    && body.redirect_to.startsWith('/')
    && !body.redirect_to.startsWith('//')
    ? body.redirect_to
    : null;
  if (!tujuan) return;
  clearAuth();
  window.location.replace(tujuan);
}

async function request<T>(path: string, init: RequestInit = {}, izinkanRefresh = true): Promise<T> {
  const res = await apiFetch(path, init);

  // Sesi kedaluwarsa: minta token baru sekali lewat backend, lalu ulangi permintaan ini.
  if (res.status === 401 && izinkanRefresh && !path.startsWith('/auth/')) {
    if (await refreshSession()) {
      return request<T>(path, init, false);
    }
  }

  const body = await res.json().catch(() => null);
  ikutiPenolakanAkses(res.status, body);

  if (!res.ok) {
    throw new Error(pesanDari(body, res.status));
  }

  return body as T;
}

async function kirimForm<T>(path: string, method: string, form: FormData, izinkanRefresh = true): Promise<T> {
  const res = await apiFetch(path, { method, body: form });

  if (res.status === 401 && izinkanRefresh && (await refreshSession())) {
    return kirimForm<T>(path, method, form, false);
  }

  const body = await res.json().catch(() => null);
  ikutiPenolakanAkses(res.status, body);

  if (!res.ok) {
    throw new Error(pesanDari(body, res.status));
  }

  return body as T;
}

export const apiGet = <T>(path: string) => request<T>(path);
export const apiPost = <T>(path: string, data: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(data) });
export const apiPut = <T>(path: string, data: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(data) });
export const apiPatch = <T>(path: string, data: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(data) });
export const apiDelete = <T>(path: string) => request<T>(path, { method: 'DELETE' });

// ===== Instruktur API =====

export type Peserta = {
  id: number;
  nik: string;
  nama: string;
  blc: string;
  jk: 'L' | 'P';
  tervalidasi: boolean;
  telepon?: string | null;
  /** Alias dari `telepon` supaya kode lama yang memakai `phone` tetap jalan. */
  phone?: string | null;
  alamat?: string | null;
  kategori?: string;
  kecamatan?: string;
  kelurahan?: string;
  email?: string | null;
  tanggal_lahir?: string | null;
  kategori_peserta_id?: number | null;
  lokasi_blc_id?: number | null;
};

export type PesertaDetail = Peserta & {
  email?: string;
  tanggal_lahir?: string | null;
  kategori_peserta_id?: number | null;
  kategori_id?: number | null;
  lokasi_blc_id?: number;
  is_surabaya?: boolean;
  kecamatan_lain?: string | null;
  kelurahan_lain?: string | null;
};

export type PesertaOpsi = {
  kategori: { id: number; nama_kelompok: string }[];
  blc: { id: number; nama_blc: string }[];
};

export type PesertaMeta = { page: number; per_page: number; total: number; last_page: number };
export type PesertaStatistik = { semua: number; tervalidasi: number; belum: number };

export type Kelas = {
  id: number;
  nama: string;
  tanggal: string;
  sesi: number;
  sesi_id: number;
  waktuSesi?: string;
  hari: string[];
  materi: string;
  materi_id: string;
  lokasi_blc_id: number;
  lokasi?: string;
  status: 'Aktif' | 'Selesai';
  totalPeserta: number;
};

// Backend response type
interface BackendKelas {
  id: number;
  nama_kelas: string;
  materi: string;
  materi_id: string;
  instruktur: string;
  lokasi: string;
  lokasi_blc_id: number;
  hari: string[];
  jam: number;
  sesi_id: number;
  nomor_sesi: number;
  waktu_sesi?: string;
  jumlah_peserta: number;
  status: 'Aktif' | 'Selesai' | number;
}

function mapBackendToKelas(b: BackendKelas): Kelas {
  const sesiMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  };
  const sesi = b.nomor_sesi ?? sesiMap[b.sesi_id ?? b.jam] ?? b.sesi_id ?? b.jam ?? 1;

  return {
    id: b.id,
    nama: b.nama_kelas,
    tanggal: 'Jadwal mingguan',
    sesi,
    sesi_id: b.sesi_id ?? b.jam,
    waktuSesi: b.waktu_sesi,
    hari: b.hari ?? [],
    materi: b.materi,
    materi_id: b.materi_id,
    lokasi_blc_id: b.lokasi_blc_id,
    lokasi: b.lokasi,
    status: b.status === 1 || b.status === 'Aktif' ? 'Aktif' : 'Selesai',
    totalPeserta: b.jumlah_peserta ?? 0,
  };
}

export type Sesi = {
  id: number;
  sesi: number;
  jam: string;
};

export type Materi = {
  id: string;
  nama_materi: string;
};

export type AbsensiItem = {
  peserta_id: number;
  nama: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpa';
  keterangan?: string;
};

export type AbsensiPayload = {
  kelas_id: number;
  tanggal: string;
  peserta: AbsensiItem[];
};

export type AbsensiRekap = {
  peserta_id: number;
  nama: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
};

// ===== Daftar Peserta (sudah sesuai backend: modul Instruktur/DaftarPeserta) =====

function mapPeserta<T extends Peserta>(p: T): T {
  return { ...p, phone: p.phone ?? p.telepon ?? undefined };
}

// Backend menerima status = semua | valid | non
function mapStatus(s?: string): 'semua' | 'valid' | 'non' | undefined {
  if (!s) return undefined;
  const v = s.toLowerCase();
  if (['valid', 'tervalidasi', 'sudah', 'true', '1'].includes(v)) return 'valid';
  if (['non', 'belum', 'false', '0'].includes(v)) return 'non';
  if (v === 'semua') return 'semua';
  return undefined;
}

export async function getDaftarPeserta(params?: {
  q?: string;
  /** Alias lama untuk `q`. */
  search?: string;
  status?: 'semua' | 'valid' | 'non';
  /** Alias lama untuk `status`. */
  status_validasi?: string;
  lokasi_blc_id?: number;
  page?: number;
  per_page?: number;
}): Promise<{ data: Peserta[]; meta?: PesertaMeta; statistik?: PesertaStatistik }> {
  const sp = new URLSearchParams();
  const q = params?.q ?? params?.search;
  const status = mapStatus(params?.status ?? params?.status_validasi);
  if (q) sp.set('q', q);
  if (status) sp.set('status', status);
  if (params?.lokasi_blc_id) sp.set('lokasi_blc_id', String(params.lokasi_blc_id));
  if (params?.page) sp.set('page', String(params.page));
  if (params?.per_page) sp.set('per_page', String(params.per_page));
  const query = sp.toString();

  const res = await apiGet<{ data: Peserta[]; meta?: PesertaMeta; statistik?: PesertaStatistik }>(
    `/instruktur/daftar-peserta${query ? `?${query}` : ''}`
  );
  return { ...res, data: (res.data ?? []).map(mapPeserta) };
}

export async function getPeserta(id: number): Promise<{ data: PesertaDetail }> {
  const res = await apiGet<{ data: PesertaDetail }>(`/instruktur/daftar-peserta/${id}`);
  return { data: mapPeserta(res.data) };
}

// Ubah nama field lama (phone, kategori_id) ke nama yang dipakai backend.
function toBackendPeserta(data: Partial<PesertaDetail>) {
  const out: Record<string, unknown> = {
    nik: data.nik,
    nama: data.nama,
    jk: data.jk,
    tanggal_lahir: data.tanggal_lahir || null,
    telepon: data.telepon ?? data.phone ?? null,
    alamat: data.alamat ?? null,
    email: data.email ?? null,
    kecamatan: data.kecamatan ?? null,
    kelurahan: data.kelurahan ?? null,
    kecamatan_lain: data.kecamatan_lain ?? null,
    kelurahan_lain: data.kelurahan_lain ?? null,
    is_surabaya: data.is_surabaya,
    lokasi_blc_id: data.lokasi_blc_id,
    kategori_peserta_id: data.kategori_peserta_id ?? data.kategori_id ?? null,
  };
  // Buang field yang tidak dikirim supaya PATCH hanya memvalidasi yang berubah.
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

export async function createPeserta(
  data: Partial<PesertaDetail>
): Promise<{ data: Peserta }> {
  return apiPost('/instruktur/daftar-peserta', toBackendPeserta(data));
}

export async function updatePeserta(
  id: number,
  data: Partial<PesertaDetail>
): Promise<{ data: Peserta }> {
  return apiPatch(`/instruktur/daftar-peserta/${id}`, toBackendPeserta(data));
}

// Backend memakai PATCH untuk validasi (bukan PUT).
export async function validasiPeserta(id: number, tervalidasi: boolean): Promise<{ data: Peserta }> {
  return apiPatch(`/instruktur/daftar-peserta/${id}/validasi`, { tervalidasi });
}

export async function deletePeserta(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/daftar-peserta/${id}`);
}

export async function getPesertaOpsi(): Promise<{ data: PesertaOpsi }> {
  const res = await apiGet<{
    data: {
      lokasi_blc: { id: number; nama: string }[];
      kategori_peserta: { id: number; nama: string; nama_kelompok?: string }[];
    };
  }>('/instruktur/daftar-peserta/opsi');

  return {
    data: {
      kategori: (res.data?.kategori_peserta ?? []).map((k) => ({ id: k.id, nama_kelompok: k.nama_kelompok ?? k.nama })),
      blc: (res.data?.lokasi_blc ?? []).map((l) => ({ id: l.id, nama_blc: l.nama })),
    },
  };
}

// ===== Daftar Hadir / Kelas =====

export async function getKelas(params?: { search?: string }): Promise<{ data: Kelas[] }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  const query = searchParams.toString();
  const res = await apiGet<{ data: BackendKelas[] }>(`/instruktur/daftar-hadir/kelas${query ? `?${query}` : ''}`);
  return { data: (res.data ?? []).map(mapBackendToKelas) };
}

export async function getKelasDetail(id: number): Promise<{ data: Kelas }> {
  const res = await apiGet<{ data: BackendKelas }>(`/instruktur/daftar-hadir/kelas/${id}`);
  return { data: mapBackendToKelas(res.data) };
}

export async function createKelas(data: {
  nama_kelas: string;
  materi_id: string;
  sesi_id: number;
  hari: string[];
  lokasi_blc_id: number;
}): Promise<{ data: Kelas }> {
  const res = await apiPost<{ data: BackendKelas }>('/instruktur/daftar-hadir/kelas', data);
  return { data: mapBackendToKelas(res.data) };
}

export async function updateKelas(id: number, data: Partial<{
  nama_kelas: string;
  materi_id: string;
  sesi_id: number;
  hari: string[];
  lokasi_blc_id: number;
  status: number;
}>): Promise<{ data: Kelas }> {
  const res = await apiPut<{ data: BackendKelas }>(`/instruktur/daftar-hadir/kelas/${id}`, data);
  return { data: mapBackendToKelas(res.data) };
}

export async function deleteKelas(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/daftar-hadir/kelas/${id}`);
}

export async function getSesi(): Promise<{ data: Sesi[] }> {
  return apiGet('/instruktur/daftar-hadir/kelas/opsi/sesi');
}

export async function getMateri(): Promise<{ data: Materi[] }> {
  return apiGet('/instruktur/daftar-hadir/kelas/opsi/materi');
}

export async function getKelasOpsi(): Promise<{ data: { sesi: Sesi[]; materi: Materi[]; blc: { id: number; nama_blc: string }[] } }> {
  return apiGet('/instruktur/daftar-hadir/kelas/opsi');
}

export async function getCalonPeserta(kelasId: number): Promise<{ data: Peserta[] }> {
  return apiGet(`/instruktur/daftar-hadir/kelas/${kelasId}/calon-peserta`);
}

export async function addPesertaToKelas(kelasId: number, pesertaIds: number[]): Promise<{ data: Peserta[] }> {
  return apiPost(`/instruktur/daftar-hadir/kelas/${kelasId}/peserta`, { peserta_ids: pesertaIds });
}

export async function removePesertaFromKelas(kelasId: number, pesertaId: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/daftar-hadir/kelas/${kelasId}/peserta/${pesertaId}`);
}

export async function getKelasPeserta(kelasId: number): Promise<{ data: Peserta[] }> {
  return apiGet(`/instruktur/daftar-hadir/kelas/${kelasId}/peserta`);
}

export async function getDaftarHadir(kelasId: number, tanggal: string): Promise<{ data: Peserta[] }> {
  return apiGet(`/instruktur/daftar-hadir/${kelasId}?tanggal=${tanggal}`);
}

export async function saveAbsensi(payload: AbsensiPayload): Promise<{ data: Peserta[] }> {
  return apiPost('/instruktur/daftar-hadir', payload);
}

export async function getRekapAbsensi(kelasId: number): Promise<{ data: AbsensiRekap[] }> {
  return apiGet(`/instruktur/daftar-hadir/kelas/${kelasId}/rekap`);
}

// ===== Laporan Instruktur =====

export type LaporanKelasOpsi = {
  id: number;
  nama_kelas: string;
  materi: string | null;
  materi_id: string | null;
  jumlah_peserta: number;
};

export type LaporanHarian = {
  id: number;
  tanggal: string;
  kelas_id: number | null;
  kelas: string | null;
  materi: string | null;
  hadir: number;
  total: number;
  aktivitas: string;
  foto: string[];
  foto_deskripsi: string[];
  foto_url: string[];
};

export async function getLaporanOpsi(): Promise<{ data: { kelas: LaporanKelasOpsi[] } }> {
  return apiGet('/instruktur/laporan/opsi');
}

export async function getLaporan(mulai: string, sampai: string): Promise<{ data: LaporanHarian[] }> {
  return apiGet(`/instruktur/laporan?mulai=${encodeURIComponent(mulai)}&sampai=${encodeURIComponent(sampai)}`);
}

export async function saveLaporan(id: number | null, form: FormData): Promise<{ data: LaporanHarian }> {
  const path = id === null ? '/instruktur/laporan' : `/instruktur/laporan/${id}`;
  return kirimForm<{ data: LaporanHarian }>(path, id === null ? 'POST' : 'PUT', form);
}

export async function deleteLaporan(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/laporan/${id}`);
}

// ===== Master Ujian =====

export type SoalUjian = {
  id?: number;
  pertanyaan: string;
  pilihan: string[];
  jawaban_benar: number;
  nomor: number;
  bobot: number;
  penjelasan: string;
};

export type JadwalUjian = {
  id: number;
  kelas_id: number;
  kelas: string;
  mulai: string;
  selesai: string;
  token: string;
};

export type Ujian = {
  id: number;
  judul: string;
  materi_id: string | null;
  materi: string | null;
  tipe: 'pretest' | 'posttest';
  durasi_menit: number;
  nilai_minimum: number;
  acak_soal: boolean;
  is_aktif: boolean;
  jumlah_soal: number;
  soal: SoalUjian[];
  jadwal: JadwalUjian[];
};

export type UjianInput = {
  judul: string;
  materi_id: string | null;
  tipe: 'pretest' | 'posttest';
  durasi_menit: number;
  nilai_minimum: number;
  acak_soal: boolean;
  is_aktif: boolean;
  soal: SoalUjian[];
};

export type KelasUjianOpsi = {
  id: number;
  nama_kelas: string;
  materi_id: string | null;
  materi: string | null;
  lokasi_blc_id: number | null;
  blc: string | null;
  jumlah_peserta: number;
};

export type UjianOpsi = {
  materi: { id: string; nama: string }[];
  kelas: KelasUjianOpsi[];
};

export type JadwalUjianInput = {
  master_ujian_id: number;
  kelas_id: number;
  mulai: string;
  selesai: string;
  token?: string;
};

export async function getUjian(): Promise<{ data: Ujian[] }> {
  return apiGet('/instruktur/ujian');
}

export async function getUjianDetail(id: number): Promise<{ data: Ujian }> {
  return apiGet(`/instruktur/ujian/${id}`);
}

export async function getUjianOpsi(): Promise<{ data: UjianOpsi }> {
  return apiGet('/instruktur/ujian/opsi');
}

export async function saveUjian(id: number | null, data: UjianInput): Promise<{ data: Ujian }> {
  return id === null ? apiPost('/instruktur/ujian', data) : apiPut(`/instruktur/ujian/${id}`, data);
}

export async function deleteUjian(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/ujian/${id}`);
}

export async function saveJadwalUjian(id: number | null, data: JadwalUjianInput): Promise<{ data: JadwalUjian }> {
  return id === null ? apiPost('/instruktur/ujian/jadwal', data) : apiPut(`/instruktur/ujian/jadwal/${id}`, data);
}

export async function deleteJadwalUjian(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/ujian/jadwal/${id}`);
}

// ===== Pengunjung / Buku Tamu =====

export type Pengunjung = {
  id: number;
  tanggal: string;
  sesi: number | null;
  sesi_id: number | null;
  lokasi_blc_id: number | null;
  blc: string | null;
  nama: string;
  email: string | null;
  telepon: string | null;
  instansi: string | null;
  pesan: string;
  rating: number | null;
  jenis_kelamin: 'L' | 'P' | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  kategori: string | null;
};

export type PengunjungInput = {
  nama: string;
  lokasi_blc_id: number;
  sesi_id: number;
  instansi?: string | null;
  email?: string | null;
  telepon?: string | null;
  pesan?: string | null;
  rating?: number | null;
  jenis_kelamin?: 'L' | 'P' | null;
  tanggal_lahir?: string | null;
  alamat?: string | null;
  kategori?: string | null;
};

export type PengunjungOpsi = {
  blc: { id: number; nama: string }[];
  sesi: Sesi[];
  kategori: string[];
};

export async function getPengunjungOpsi(): Promise<{ data: PengunjungOpsi }> {
  return apiGet('/instruktur/pengunjung/opsi');
}

export async function getPengunjung(params: {
  mulai: string;
  sampai: string;
  lokasi_blc_id?: number;
  sesi_id?: number;
}): Promise<{ data: Pengunjung[] }> {
  const sp = new URLSearchParams({ mulai: params.mulai, sampai: params.sampai });
  if (params.lokasi_blc_id) sp.set('lokasi_blc_id', String(params.lokasi_blc_id));
  if (params.sesi_id) sp.set('sesi_id', String(params.sesi_id));
  return apiGet(`/instruktur/pengunjung?${sp}`);
}

export async function createPengunjung(data: PengunjungInput): Promise<{ data: Pengunjung }> {
  return apiPost('/instruktur/pengunjung', data);
}

export async function updatePengunjung(id: number, data: Partial<PengunjungInput>): Promise<{ data: Pengunjung }> {
  return apiPatch(`/instruktur/pengunjung/${id}`, data);
}

export async function deletePengunjung(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/pengunjung/${id}`);
}

// ===== Foto Kegiatan Pengunjung =====

export type FotoKegiatan = {
  id: number;
  tanggal: string;
  sesi: number | null;
  sesi_id: number | null;
  lokasi_blc_id: number | null;
  blc: string | null;
  keterangan: string;
  foto: string[];
  foto_deskripsi: string[];
  foto_url: string[];
  created_by: number | null;
};

export async function getFotoKegiatanOpsi(): Promise<{ data: Pick<PengunjungOpsi, 'blc' | 'sesi'> }> {
  return apiGet('/instruktur/foto-kegiatan/opsi');
}

export async function getFotoKegiatan(params: {
  mulai: string;
  sampai: string;
  lokasi_blc_id?: number;
  sesi_id?: number;
}): Promise<{ data: FotoKegiatan[] }> {
  const sp = new URLSearchParams({ mulai: params.mulai, sampai: params.sampai });
  if (params.lokasi_blc_id) sp.set('lokasi_blc_id', String(params.lokasi_blc_id));
  if (params.sesi_id) sp.set('sesi_id', String(params.sesi_id));
  return apiGet(`/instruktur/foto-kegiatan?${sp}`);
}

export async function saveFotoKegiatan(id: number | null, form: FormData): Promise<{ data: FotoKegiatan }> {
  const path = id ? `/instruktur/foto-kegiatan/${id}` : '/instruktur/foto-kegiatan';
  return kirimForm<{ data: FotoKegiatan }>(path, id ? 'PUT' : 'POST', form);
}

export async function deleteFotoKegiatan(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/foto-kegiatan/${id}`);
}