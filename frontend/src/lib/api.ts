const API_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : { Accept: 'application/json' };
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}

export async function apiPut<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}

// ===== Instruktur API =====

export type Peserta = {
  id: number;
  nik: string;
  nama: string;
  blc: string;
  jk: 'L' | 'P';
  tervalidasi: boolean;
  phone?: string;
  alamat?: string;
  kategori?: string;
  kecamatan?: string;
  kelurahan?: string;
};

export type PesertaDetail = Peserta & {
  email?: string;
  tanggal_lahir?: string;
  kategori_id?: number;
  lokasi_blc_id?: number;
  is_surabaya?: boolean;
};

export type PesertaOpsi = {
  kategori: { id: number; nama_kelompok: string }[];
  blc: { id: number; nama_blc: string }[];
};

export type Kelas = {
  id: number;
  nama: string;
  tanggal: string;
  sesi: number;
  hari: string[];
  materi: string;
  status: "Aktif" | "Selesai";
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
  status: "Aktif" | "Selesai" | number;
}

function mapBackendToKelas(b: BackendKelas): Kelas {
  const sesiMap: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
  };
  const sesi = sesiMap[b.jam] ?? b.jam ?? 1;

  return {
    id: b.id,
    nama: b.nama_kelas,
    tanggal: "-",
    sesi,
    hari: b.hari ?? [],
    materi: b.materi,
    status: b.status === 1 || b.status === "Aktif" ? "Aktif" : "Selesai",
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

// Daftar Peserta
export async function getDaftarPeserta(params?: {
  search?: string;
  status_validasi?: string;
  page?: number;
  per_page?: number;
  kelas_id?: number;
}): Promise<{ data: Peserta[] }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.status_validasi) searchParams.set('status_validasi', params.status_validasi);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.per_page) searchParams.set('per_page', String(params.per_page));
  if (params?.kelas_id) searchParams.set('kelas_id', String(params.kelas_id));
  const query = searchParams.toString();
  return apiGet(`/instruktur/daftar-peserta${query ? `?${query}` : ''}`);
}

export async function getPeserta(id: number): Promise<{ data: PesertaDetail }> {
  return apiGet(`/instruktur/daftar-peserta/${id}`);
}

export async function createPeserta(data: Partial<PesertaDetail> & { kelas_id?: number }): Promise<{ data: Peserta }> {
  return apiPost('/instruktur/daftar-peserta', data);
}

export async function updatePeserta(id: number, data: Partial<PesertaDetail>): Promise<{ data: Peserta }> {
  return apiPut(`/instruktur/daftar-peserta/${id}`, data);
}

export async function validasiPeserta(id: number, tervalidasi: boolean): Promise<{ data: Peserta }> {
  return apiPut(`/instruktur/daftar-peserta/${id}/validasi`, { tervalidasi });
}

export async function deletePeserta(id: number): Promise<{ message: string }> {
  return apiDelete(`/instruktur/daftar-peserta/${id}`);
}

export async function getPesertaOpsi(): Promise<{ data: PesertaOpsi }> {
  return apiGet('/instruktur/daftar-peserta/opsi');
}

// Daftar Hadir / Kelas
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