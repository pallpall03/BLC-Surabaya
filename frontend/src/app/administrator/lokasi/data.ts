
export type StatusLokasi = "aktif" | "nonaktif";

export type Lokasi = {
  id: number;
  nama: string;
  alamat: string;
  kecamatan: string;
  telepon: string;
  maps: string;
  status: StatusLokasi;
  jumlah_slot_computer?: number;
  jadwal_blc?: string;
  wilayah_surabaya?: string;
};

export type FormLokasi = Omit<Lokasi, "id">;

const KUNCI = "blc-lokasi";
const API_BASE = "/api/v1";

const dataAwal: Lokasi[] = [
  {
    id: 1,
    nama: "BLC Surabaya Pusat",
    alamat: "Masukkan alamat cabang BLC",
    kecamatan: "Genteng",
    telepon: "",
    maps: "",
    status: "aktif",
  },
  {
    id: 2,
    nama: "BLC Surabaya Timur",
    alamat: "Masukkan alamat cabang BLC",
    kecamatan: "Gubeng",
    telepon: "",
    maps: "",
    status: "aktif",
  },
  {
    id: 3,
    nama: "BLC Surabaya Selatan",
    alamat: "Masukkan alamat cabang BLC",
    kecamatan: "Wonokromo",
    telepon: "",
    maps: "",
    status: "aktif",
  },
];

function baca(): Lokasi[] {
  if (typeof window === "undefined") return dataAwal;

  try {
    const tersimpan = localStorage.getItem(KUNCI);
    return tersimpan ? JSON.parse(tersimpan) as Lokasi[] : dataAwal;
  } catch {
    return dataAwal;
  }
}

function tulis(data: Lokasi[]) {
  localStorage.setItem(KUNCI, JSON.stringify(data));
}

export async function ambilLokasi(): Promise<Lokasi[]> {
  // Coba ambil dari API, jika gagal fallback ke localStorage
  try {
    return await fetchLokasiDariAPI();
  } catch (e) {
    console.warn("Gagal fetch lokasi API, gunakan lokal:", e);
    return baca();
  }
}

export async function simpanLokasi(
  data: FormLokasi,
  id?: number
): Promise<{ success: true; data: Lokasi } | { success: false; fallback: true }> {
  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/v1/lokasi-blc/${id}` : `/api/v1/lokasi-blc`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("API error");

    // ✅ Success: ambil data baru dari API
    const fresh = await ambilLokasi();
    return { success: true, data: fresh };
  } catch (e) {
    // ⚠️ Fallback: ke localStorage jika API gagal
    const lama = baca();
    const sekarang = new Date().toISOString();

    if (id !== undefined) {
      const index = lama.findIndex((lokasi) => lokasi.id === id);
      if (index !== -1) {
        lama[index] = { ...lama[index], ...data, status: data.status || "aktif" };
      }
    } else {
      const lokasiBaru: Lokasi = {
        id: lama.length > 0 ? Math.max(...lama.map((l) => l.id)) + 1 : 1,
        ...data,
        status: data.status || "aktif",
      };
      lama.push(lokasiBaru);
    }
    tulis(lama);
    return { success: false, fallback: true };
  }
}

export async function hapusLokasi(id: number): Promise<void> {
  try {
    await hapusLokasiDariAPI(id);
    // Refresh data dari API setelah hapus berhasil
    const data = baca();
    tulis(data.filter((lokasi) => lokasi.id !== id));
  } catch (e) {
    console.warn("Gagal hapus dari API, fallback ke lokal:", e);
    // Fallback ke localStorage
    const data = baca();
    tulis(data.filter((lokasi) => lokasi.id !== id));
  }
}

// Helper functions for API communication
async function fetchLokasiDariAPI(): Promise<Lokasi[]> {
  const res = await fetch(`${API_BASE}/lokasi-blc`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  // Laravel API wrapper: { data: [...] } -> ambil data saja
  return json.data ?? json ?? [];
}

async function simpanLokasiKeAPI(data: FormLokasi, id?: number): Promise<Lokasi> {
  const method = id ? "PUT" : "POST";
  const res = await fetch(`${API_BASE}/lokasi-blc`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

async function hapusLokasiDariAPI(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/lokasi-blc/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("API error");
}
