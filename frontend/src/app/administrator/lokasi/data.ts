
export type Lokasi = {
  id: number;
  nama_blc: string;
  alamat: string | null;
  foto_blc?: string | null;
  foto2_blc?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  area?: string | null;
  aktif: boolean;
  jumlah_slot_computer?: number | null;
  jadwal_blc?: string | null;
  wilayah_surabaya?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type FormLokasi = {
  nama_blc: string;
  alamat: string;
  foto_blc?: string;
  foto2_blc?: string;
  latitude?: string;
  longitude?: string;
  area?: string;
  aktif: boolean;
  jumlah_slot_computer?: number | null;
  jadwal_blc?: string;
  wilayah_surabaya?: string;
};

const KUNCI = "blc-lokasi";
const API_BASE = "/api/v1";

const dataAwal: Lokasi[] = [
  {
    id: 1,
    nama_blc: "BLC Headquarters",
    alamat: "Jl. Pahlawan No. 1, Surabaya",
    latitude: "-7.2575",
    longitude: "112.7521",
    area: "dalam",
    aktif: true,
    jumlah_slot_computer: 30,
    jadwal_blc: "Senin - Jumat, 08:00 - 16:00",
    wilayah_surabaya: "Surabaya Pusat",
  },
  {
    id: 2,
    nama_blc: "BLC Kantor Pusat 2",
    alamat: "Jl. Ahmad Yani No. 5, Surabaya",
    latitude: "-7.315",
    longitude: "112.756",
    area: "luar",
    aktif: true,
    jumlah_slot_computer: 25,
    jadwal_blc: "Senin - Jumat, 08:00 - 16:00",
    wilayah_surabaya: "Surabaya Selatan",
  },
  {
    id: 3,
    nama_blc: "BLC Villa Madya",
    alamat: "Jl. Basuki Rachmat No. 10, Surabaya",
    latitude: "-7.285",
    longitude: "112.745",
    area: "dalam",
    aktif: false,
    jumlah_slot_computer: 20,
    jadwal_blc: "Senin - Jumat, 08:00 - 16:00",
    wilayah_surabaya: "Surabaya Pusat",
  },
  {
    id: 4,
    nama_blc: "BLC Kampus A",
    alamat: "Jl. MT Haryono No. 1, Surabaya",
    latitude: "-7.27",
    longitude: "112.75",
    area: "dalam",
    aktif: true,
    jumlah_slot_computer: 35,
    jadwal_blc: "Senin - Jumat, 08:00 - 16:00",
    wilayah_surabaya: "Surabaya Timur",
  },
  {
    id: 5,
    nama_blc: "BLC Mall Taman",
    alamat: "Jl. Jemursari No. 12, Surabaya",
    latitude: "-7.265",
    longitude: "112.748",
    area: "dalam",
    aktif: true,
    jumlah_slot_computer: 15,
    jadwal_blc: "Senin - Jumat, 08:00 - 16:00",
    wilayah_surabaya: "Surabaya Selatan",
  },
];

function baca(): Lokasi[] {
  if (typeof window === "undefined") return dataAwal;

  try {
    const tersimpan = localStorage.getItem(KUNCI);
    return tersimpan ? (JSON.parse(tersimpan) as Lokasi[]) : dataAwal;
  } catch {
    return dataAwal;
  }
}

function tulis(data: Lokasi[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KUNCI, JSON.stringify(data));
}

// Helper untuk extract lat & long dari Google Maps link
export function ekstrakKoordinatMaps(url: string): { latitude: string; longitude: string } | null {
  if (!url) return null;

  // Format 1: @-7.2575,112.7521
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return { latitude: atMatch[1], longitude: atMatch[2] };
  }

  // Format 2: ?q=-7.2575,112.7521 atau &query=-7.2575,112.7521
  const qMatch = url.match(/[?&](?:q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    return { latitude: qMatch[1], longitude: qMatch[2] };
  }

  // Format 3: ll=-7.2575,112.7521
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    return { latitude: llMatch[1], longitude: llMatch[2] };
  }

  return null;
}

export function buatLinkGoogleMaps(lat?: string | null, lng?: string | null): string | null {
  if (!lat || !lng) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export async function ambilLokasi(): Promise<Lokasi[]> {
  try {
    const res = await fetch(`${API_BASE}/lokasi-blc`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error("API error");

    const json = await res.json();
    const list: any[] = Array.isArray(json) ? json : json?.data ?? [];

    const terformat: Lokasi[] = list.map((item) => ({
      id: Number(item.id),
      nama_blc: item.nama_blc ?? item.namaBlc ?? "",
      alamat: item.alamat ?? null,
      foto_blc: item.foto_blc ?? item.fotoBlc ?? null,
      foto2_blc: item.foto2_blc ?? item.foto2Blc ?? null,
      latitude: item.latitude ? String(item.latitude) : null,
      longitude: item.longitude ? String(item.longitude) : null,
      area: item.area ?? null,
      aktif: Boolean(item.aktif),
      jumlah_slot_computer: item.jumlah_slot_computer ?? item.jumlahSlotComputer ?? null,
      jadwal_blc: item.jadwal_blc ?? item.jadwalBlc ?? null,
      wilayah_surabaya: item.wilayah_surabaya ?? item.wilayahSurabaya ?? null,
      created_at: item.created_at ?? item.createdAt ?? undefined,
      updated_at: item.updated_at ?? item.updatedAt ?? undefined,
    }));

    tulis(terformat);
    return terformat;
  } catch (e) {
    console.warn("Gagal fetch lokasi API, gunakan lokal:", e);
    return baca();
  }
}

export async function simpanLokasi(
  data: FormLokasi,
  id?: number
): Promise<{ success: boolean; data: Lokasi }> {
  const payload = {
    nama_blc: data.nama_blc,
    alamat: data.alamat || null,
    foto_blc: data.foto_blc || null,
    foto2_blc: data.foto2_blc || null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    area: data.area || null,
    aktif: Boolean(data.aktif),
    jumlah_slot_computer:
      data.jumlah_slot_computer !== undefined &&
      data.jumlah_slot_computer !== null &&
      (data.jumlah_slot_computer as unknown as string) !== ""
        ? Number(data.jumlah_slot_computer)
        : null,
    jadwal_blc: data.jadwal_blc || null,
    wilayah_surabaya: data.wilayah_surabaya || null,
  };

  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/lokasi-blc/${id}` : `${API_BASE}/lokasi-blc`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || "Gagal menyimpan ke server");
    }

    const json = await res.json();
    const raw = json.data ?? json;
    const tersimpan: Lokasi = {
      id: Number(raw.id),
      nama_blc: raw.nama_blc ?? raw.namaBlc ?? payload.nama_blc,
      alamat: raw.alamat ?? payload.alamat,
      foto_blc: raw.foto_blc ?? raw.fotoBlc ?? payload.foto_blc,
      foto2_blc: raw.foto2_blc ?? raw.foto2Blc ?? payload.foto2_blc,
      latitude: raw.latitude ? String(raw.latitude) : payload.latitude,
      longitude: raw.longitude ? String(raw.longitude) : payload.longitude,
      area: raw.area ?? payload.area,
      aktif: raw.aktif !== undefined ? Boolean(raw.aktif) : payload.aktif,
      jumlah_slot_computer:
        raw.jumlah_slot_computer ?? raw.jumlahSlotComputer ?? payload.jumlah_slot_computer,
      jadwal_blc: raw.jadwal_blc ?? raw.jadwalBlc ?? payload.jadwal_blc,
      wilayah_surabaya:
        raw.wilayah_surabaya ?? raw.wilayahSurabaya ?? payload.wilayah_surabaya,
      created_at: raw.created_at ?? raw.createdAt,
      updated_at: raw.updated_at ?? raw.updatedAt,
    };

    const lama = baca();
    if (id !== undefined) {
      const idx = lama.findIndex((l) => l.id === id);
      if (idx !== -1) lama[idx] = tersimpan;
    } else {
      lama.push(tersimpan);
    }
    tulis(lama);

    return { success: true, data: tersimpan };
  } catch (e) {
    console.warn("Gagal simpan ke API, gunakan fallback localStorage:", e);
    const lama = baca();
    let fallbackItem: Lokasi;

    if (id !== undefined) {
      const idx = lama.findIndex((l) => l.id === id);
      fallbackItem = {
        id,
        ...payload,
        updated_at: new Date().toISOString(),
      };
      if (idx !== -1) {
        lama[idx] = fallbackItem;
      } else {
        lama.push(fallbackItem);
      }
    } else {
      const newId = lama.length > 0 ? Math.max(...lama.map((l) => l.id)) + 1 : 1;
      fallbackItem = {
        id: newId,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      lama.push(fallbackItem);
    }

    tulis(lama);
    return { success: false, data: fallbackItem };
  }
}

export async function hapusLokasi(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/lokasi-blc/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Gagal menghapus dari server");
  } catch (e) {
    console.warn("Gagal hapus dari API, hapus lokal saja:", e);
  } finally {
    const lama = baca();
    tulis(lama.filter((lokasi) => lokasi.id !== id));
  }
}
