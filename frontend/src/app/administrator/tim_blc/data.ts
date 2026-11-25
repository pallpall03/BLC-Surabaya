export type TimBlc = {
  id: number;
  nama_lengkap: string;
  role: string;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  lokasi_blc_id?: number | null;
  nama_lokasi?: string | null;
  username?: string | null;
  is_delete: boolean; // false = Aktif, true = Non-aktif
  created_at?: string;
  updated_at?: string;
};

export type FormTimBlc = {
  nama_lengkap: string;
  role?: string;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  lokasi_blc_id?: number | null;
  is_delete: boolean;
};

const KUNCI = "blc-tim-admin";
const API_BASE = "/api/v1";

const dataAwal: TimBlc[] = [
  {
    id: 5,
    nama_lengkap: "Rudi Hartono, S.Kom",
    role: "instruktur",
    gender: "L",
    email: "rudi@blc.go.id",
    phone: "08111111115",
    avatar: "rudi.jpg",
    lokasi_blc_id: 1,
    nama_lokasi: "BLC Headquarters",
    username: "rudi.hartono",
    is_delete: false,
    updated_at: "2026-11-24 15:19:19",
  },
  {
    id: 4,
    nama_lengkap: "Drs. Dewi Sartika",
    role: "instruktur",
    gender: "P",
    email: "dewi@blc.go.id",
    phone: "08111111114",
    avatar: "dewi.jpg",
    lokasi_blc_id: 5,
    nama_lokasi: "BLC Mall Taman",
    username: "dewi.sartika",
    is_delete: false,
    updated_at: "2026-11-24 15:19:19",
  },
  {
    id: 3,
    nama_lengkap: "Ir. Budi Prasetyo",
    role: "instruktur",
    gender: "L",
    email: "budi@blc.go.id",
    phone: "08111111113",
    avatar: "budi.jpg",
    lokasi_blc_id: 4,
    nama_lokasi: "BLC Kampus A",
    username: "budi.prasetyo",
    is_delete: false,
    updated_at: "2026-11-24 15:19:19",
  },
  {
    id: 2,
    nama_lengkap: "Prof. Siti Aminah",
    role: "instruktur",
    gender: "P",
    email: "siti@blc.go.id",
    phone: "08111111112",
    avatar: "siti.jpg",
    lokasi_blc_id: 2,
    nama_lokasi: "BLC Kantor Pusat 2",
    username: "siti.aminah",
    is_delete: false,
    updated_at: "2026-11-24 15:19:19",
  },
  {
    id: 1,
    nama_lengkap: "Dr. Ahmad Fauzi",
    role: "koordinator",
    gender: "L",
    email: "ahmad@blc.go.id",
    phone: "08111111111",
    avatar: "ahmad.jpg",
    lokasi_blc_id: 1,
    nama_lokasi: "BLC Headquarters",
    username: "ahmad.fauzi",
    is_delete: false,
    updated_at: "2026-11-24 15:19:19",
  },
];

function bacaCache(): TimBlc[] {
  if (typeof window === "undefined") return dataAwal;
  try {
    const raw = localStorage.getItem(KUNCI);
    return raw ? (JSON.parse(raw) as TimBlc[]) : dataAwal;
  } catch {
    return dataAwal;
  }
}

function simpanCache(data: TimBlc[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    // abaikan jika storage penuh
  }
}

function normalisasi(item: any): TimBlc {
  return {
    id: Number(item.id),
    nama_lengkap: item.nama_lengkap ?? item.namaLengkap ?? "",
    role: item.role ?? "instruktur",
    gender: item.gender ?? null,
    email: item.email ?? null,
    phone: item.phone ?? null,
    avatar: item.avatar ?? null,
    lokasi_blc_id: item.lokasi_blc_id ?? item.lokasiBlcId ?? null,
    nama_lokasi: item.nama_lokasi ?? item.namaLokasi ?? null,
    username: item.username ?? null,
    is_delete: Boolean(item.is_delete ?? item.isDelete ?? false),
    created_at: item.created_at ?? item.createdAt ?? undefined,
    updated_at: item.updated_at ?? item.updatedAt ?? undefined,
  };
}

export async function ambilTimBlc(): Promise<TimBlc[]> {
  try {
    const res = await fetch(`${API_BASE}/tim-blc`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error("API tim-blc gagal dimuat");

    const json = await res.json();
    const rawList = Array.isArray(json) ? json : json?.data ?? [];
    const list: TimBlc[] = rawList.map(normalisasi);

    simpanCache(list);
    return list;
  } catch (err) {
    console.warn("Gagal fetch tim-blc API, gunakan cache lokal:", err);
    return bacaCache();
  }
}

export async function simpanTimBlc(
  data: FormTimBlc,
  id?: number
): Promise<{ success: boolean; data: TimBlc }> {
  const payload = {
    nama_lengkap: data.nama_lengkap,
    role: data.role || "instruktur",
    gender: data.gender || null,
    email: data.email || null,
    phone: data.phone || null,
    avatar: data.avatar || null,
    lokasi_blc_id: data.lokasi_blc_id ? Number(data.lokasi_blc_id) : null,
    is_delete: Boolean(data.is_delete),
  };

  try {
    const url = id ? `${API_BASE}/tim-blc/${id}` : `${API_BASE}/tim-blc`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.message || `Gagal menyimpan ke API tim-blc (${res.status})`;
      throw new Error(msg);
    }

    const json = await res.json();
    const hasil = normalisasi(json.data ?? json);

    // Sync ke cache lokal
    const current = bacaCache();
    const updated = id
      ? current.map((x) => (x.id === id ? hasil : x))
      : [hasil, ...current.filter((x) => x.id !== hasil.id)];
    simpanCache(updated);

    return { success: true, data: hasil };
  } catch (err: any) {
    console.error("Gagal simpan ke API tim-blc:", err);
    throw err;
  }
}

export async function ubahStatusTimBlc(
  id: number,
  is_delete: boolean
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/tim-blc/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_delete }),
      credentials: "include",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Gagal ubah status tim (${res.status})`);
    }

    const current = bacaCache();
    const updated = current.map((x) =>
      x.id === id ? { ...x, is_delete } : x
    );
    simpanCache(updated);
    return true;
  } catch (err) {
    console.error("Gagal update status via API:", err);
    throw err;
  }
}

export async function hapusTimBlc(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/tim-blc/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Gagal menghapus personil (${res.status})`);
    }

    const current = bacaCache();
    const updated = current.filter((x) => x.id !== id);
    simpanCache(updated);
    return true;
  } catch (err) {
    console.error("Gagal hapus tim dari API:", err);
    throw err;
  }
}
