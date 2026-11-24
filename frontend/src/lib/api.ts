// Base URL: default ke proxy Next.js (/api/v1 -> http://localhost:8000/api/v1, lihat next.config.ts).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

// Key ini harus sama dengan yang disimpan halaman login.
const TOKEN_KEY = 'auth_token';

export function authHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  return token
    ? { Accept: 'application/json', Authorization: `Bearer ${token}` }
    : { Accept: 'application/json' };
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('auth_user');
}

export async function logout(): Promise<void> {
  try {
    if (localStorage.getItem(TOKEN_KEY)) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: authHeaders(),
      });
    }
  } finally {
    clearAuth();
    window.location.replace('/login');
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    clearAuth();
    window.location.replace('/login');
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const pesan =
      body?.message ??
      (body?.errors ? (Object.values(body.errors) as string[][]).flat().join(' ') : null) ??
      `API error ${res.status}`;
    throw new Error(String(pesan));
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
  // Belum dikirim backend; dibiarkan opsional supaya halaman lama tidak error saat compile.
  kecamatan?: string;
  kelurahan?: string;
};

export type PesertaDetail = Peserta & {
  email?: string;
  tanggal_lahir?: string | null;
  kategori_peserta_id?: number | null;
  /** Alias lama untuk `kategori_peserta_id`. */
  kategori_id?: number | null;
  lokasi_blc_id?: number;
  is_surabaya?: boolean;
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
  hari: string[];
  materi: string;
  status: 'Aktif' | 'Selesai';
  totalPeserta: number;
};

// Backend response type
interface BackendKelas {
  id: number;
  nama_kelas: string;
  materi: string;
  instruktur: string;
  lokasi: string;
  hari: string[];
  jam: number;
  jumlah_peserta: number;
  status: 'Aktif' | 'Selesai' | number;
}

function mapBackendToKelas(b: BackendKelas): Kelas {
  const sesiMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  };
  const sesi = sesiMap[b.jam] ?? b.jam ?? 1;

  return {
    id: b.id,
    nama: b.nama_kelas,
    tanggal: '-',
    sesi,
    hari: b.hari ?? [],
    materi: b.materi,
    status: b.status === 1 || b.status === 'Aktif' ? 'Aktif' : 'Selesai',
    totalPeserta: b.jumlah_peserta ?? 0,
  };
}

export type Sesi = {
  id: number;
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
  page?: number;
  per_page?: number;
}): Promise<{ data: Peserta[]; meta?: PesertaMeta; statistik?: PesertaStatistik }> {
  const sp = new URLSearchParams();
  const q = params?.q ?? params?.search;
  const status = mapStatus(params?.status ?? params?.status_validasi);
  if (q) sp.set('q', q);
  if (status) sp.set('status', status);
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
    lokasi_blc_id: data.lokasi_blc_id,
    kategori_peserta_id: data.kategori_peserta_id ?? data.kategori_id ?? null,
  };
  // Buang field yang tidak dikirim supaya PATCH hanya memvalidasi yang berubah.
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
}

export async function createPeserta(
  data: Partial<PesertaDetail> & { kelas_id?: number }
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
      kategori_peserta: { id: number; nama: string }[];
    };
  }>('/instruktur/daftar-peserta/opsi');

  return {
    data: {
      kategori: (res.data?.kategori_peserta ?? []).map((k) => ({ id: k.id, nama_kelompok: k.nama })),
      blc: (res.data?.lokasi_blc ?? []).map((l) => ({ id: l.id, nama_blc: l.nama })),
    },
  };
}

// ===== Daftar Hadir / Kelas =====
// CATATAN: backend belum punya route kelas/absensi (daftar-hadir baru GET / dan POST /
// yang membalas 501). Fungsi di bawah akan gagal sampai backend-nya dibuat.

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

// Laporan
export async function getLaporan(params?: {
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  kelas_id?: number;
}): Promise<{ data: unknown }> {
  const searchParams = new URLSearchParams();
  if (params?.tanggal_mulai) searchParams.set('tanggal_mulai', params.tanggal_mulai);
  if (params?.tanggal_selesai) searchParams.set('tanggal_selesai', params.tanggal_selesai);
  if (params?.kelas_id) searchParams.set('kelas_id', String(params.kelas_id));
  const query = searchParams.toString();
  return apiGet(`/instruktur/laporan${query ? `?${query}` : ''}`);
}