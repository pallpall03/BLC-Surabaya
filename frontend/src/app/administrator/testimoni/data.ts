export type StatusTestimoni = "pending" | "aktif" | "nonaktif";

export type Testimoni = {
  id: number;
  nama: string;
  phone?: string | null;
  email?: string | null;
  isi: string;
  rating?: number | null;
  lokasiBlcId?: number | null;
  namaLokasi?: string | null;
  status: StatusTestimoni;
  createdAt?: string;
  updatedAt?: string;
};

export type FormTestimoni = {
  nama: string;
  phone?: string;
  email?: string;
  isi: string;
  status: StatusTestimoni;
};

const KEY = "blc-testimoni";
const API_BASE_URL = "/api/v1";

function bacaData(): Testimoni[] {
  if (typeof window === "undefined") return [];

  const tersimpan = localStorage.getItem(KEY);
  if (!tersimpan) return [];

  try {
    return JSON.parse(tersimpan) as Testimoni[];
  } catch {
    return [];
  }
}

function simpanCache(data: Testimoni[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // Abaikan jika quota storage penuh
    }
  }
}

function kabariPerubahan(data?: Testimoni[]) {
  if (typeof window !== "undefined") {
    if (data) {
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch {
        // Abaikan
      }
    }
    window.dispatchEvent(new Event("testimoni-berubah"));
  }
}

export async function ambilTestimoni(): Promise<Testimoni[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimoni`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) throw new Error("API error: " + res.status);
    const json = await res.json();
    const raw = Array.isArray(json) ? json : json.data ?? [];

    const list: Testimoni[] = raw.map((item: any) => ({
      id: Number(item.id),
      nama: item.nama || "",
      phone: item.phone || null,
      email: item.email || null,
      isi: item.isiTestimoni || item.isi_testimoni || item.keperluan || item.isi || "",
      rating: item.rating ? Number(item.rating) : null,
      lokasiBlcId: item.lokasiBlcId ?? item.lokasi_blc_id ?? null,
      namaLokasi: item.namaLokasi || item.nama_lokasi || null,
      status: (item.status as StatusTestimoni) || "pending",
      createdAt: item.createdAt || item.created_at,
      updatedAt: item.updatedAt || item.updated_at,
    }));

    // Simpan ke cache tanpa memicu event loop
    simpanCache(list);
    return list;
  } catch (e) {
    console.warn("Gagal fetch testimoni API, fallback ke localStorage:", e);
    return bacaData();
  }
}

export async function simpanTestimoni(
  form: FormTestimoni,
  id?: number
): Promise<{ success: boolean; data?: Testimoni[]; error?: string }> {
  try {
    const method = id ? "PATCH" : "POST";
    const url = id ? `${API_BASE_URL}/testimoni/${id}` : `${API_BASE_URL}/testimoni`;

    const payload = {
      nama: form.nama.trim(),
      phone: form.phone?.trim() || null,
      email: form.email?.trim() || null,
      isi_testimoni: form.isi.trim(),
      status: form.status,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || "Gagal menyimpan data ke API");
    }

    const fresh = await ambilTestimoni();
    kabariPerubahan(fresh);
    return { success: true, data: fresh };
  } catch (e: any) {
    console.warn("API simpan testimoni gagal, fallback simpan lokal:", e);

    const data = bacaData();
    const sekarang = new Date().toISOString();

    if (id !== undefined) {
      const index = data.findIndex((item) => item.id === id);
      if (index !== -1) {
        data[index] = {
          ...data[index],
          nama: form.nama,
          phone: form.phone || null,
          email: form.email || null,
          isi: form.isi,
          status: form.status,
          updatedAt: sekarang,
        };
      }
    } else {
      const baru: Testimoni = {
        id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
        nama: form.nama,
        phone: form.phone || null,
        email: form.email || null,
        isi: form.isi,
        status: form.status,
        createdAt: sekarang,
        updatedAt: sekarang,
      };
      data.unshift(baru);
    }

    kabariPerubahan(data);
    return { success: true, data };
  }
}

export async function hapusTestimoni(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimoni/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("API delete error");
  } catch (e) {
    console.warn("API delete gagal, fallback lokal:", e);
  } finally {
    const data = bacaData();
    const sisa = data.filter((item) => item.id !== id);
    kabariPerubahan(sisa);
  }
}

export async function ubahStatusTestimoni(
  id: number,
  statusBaru: StatusTestimoni
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimoni/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: statusBaru }),
    });
    if (!res.ok) throw new Error("API status error");
  } catch (e) {
    console.warn("API ubah status gagal, fallback lokal:", e);
  } finally {
    const data = bacaData();
    const diperbarui = data.map((item): Testimoni => {
      if (item.id !== id) return item;
      return { ...item, status: statusBaru, updatedAt: new Date().toISOString() };
    });
    kabariPerubahan(diperbarui);
  }
}

