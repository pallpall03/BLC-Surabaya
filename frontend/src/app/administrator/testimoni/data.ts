export type StatusTestimoni = "aktif" | "nonaktif";

export type Testimoni = {
  id: number;
  nama: string;
  isi: string;
  status: StatusTestimoni;
  author: string;
  modifiedAt: string;
};

export type FormTestimoni = {
  nama: string;
  isi: string;
  status: StatusTestimoni;
};

const KEY = "blc-testimoni";
const API_BASE_URL = "/api/v1";

const dataAwal: Testimoni[] = [
  {
    id: 1,
    nama: "Budi Santoso",
    isi: "Pelayanan di BLC sangat baik. Materi pelatihan mudah dipahami dan bermanfaat.",
    status: "aktif",
    author: "Super Admin",
    modifiedAt: "2026-11-19T09:30:00",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    isi: "Saya mendapatkan banyak ilmu baru setelah mengikuti pelatihan di BLC Surabaya.",
    status: "nonaktif",
    author: "Super Admin",
    modifiedAt: "2026-11-19T10:15:00",
  },
  {
    id: 3,
    nama: "Andi Pratama",
    isi: "Fasilitas dan pendampingan selama pelatihan sangat membantu.",
    status: "aktif",
    author: "Super Admin",
    modifiedAt: "2026-11-19T11:00:00",
  },
];

function bacaData(): Testimoni[] {
  if (typeof window === "undefined") return [];

  const tersimpan = localStorage.getItem(KEY);

  if (!tersimpan) {
    localStorage.setItem(KEY, JSON.stringify(dataAwal));
    return [...dataAwal];
  }

  try {
    return JSON.parse(tersimpan) as Testimoni[];
  } catch {
    return [...dataAwal];
  }
}

function tulisData(data: Testimoni[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("testimoni-berubah"));
  }
}

export async function ambilTestimoni(): Promise<Testimoni[]> {
  // Coba ambil dari API, jika gagal fallback ke localStorage
  try {
    const res = await fetch(`${API_BASE_URL}/testimoni`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    // Laravel API wrapper: { data: [...] } -> ambil data saja
    const raw = json.data ?? json ?? [];
    // Mapping field API ke tipe Testimoni: keperluan -> isi, createdAt -> modifiedAt
    return raw.map((item: any) => ({
      id: item.id,
      nama: item.nama,
      isi: item.keperluan || item.isi || "",
      status: item.status || "nonaktif",
      author: item.author || "Super Admin",
      modifiedAt: item.createdAt || item.updatedAt || "2026-11-19T09:30:00",
    }));
  } catch (e) {
    console.warn("Gagal fetch testimoni API, gunakan lokal:", e);
    return bacaData().sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    );
  }
}

export async function simpanTestimoni(
  form: FormTestimoni,
  id?: number
): Promise<{ success: true; data: Testimoni[] } | { success: false; fallback: true }> {
  try {
    const method = id ? "PATCH" : "POST"
    const url = id ? `/api/v1/testimoni/${id}` : `/api/v1/testimoni`

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
              ...form, 
              author: "Super Admin",
              // Mapping field: frontend kirim `isi` → backend terima `testimoni`
              testimoni: form.isi,
              // Tambah: status dikirim langsung sesuai form
              status: form.status 
            })
    })

    if (!res.ok) throw new Error("API error")

    // ✅ Success: ambil data baru dari API
    const fresh = await ambilTestimoni()
    // tulisData(fresh)              // juga simpan ke localStorage backup (optional)
    // window.dispatchEvent(new Event("testimoni-berubah"))  // akan dipanggil di caller
    return { success: true, data: fresh }
  } catch (e) {
    // ⚠️ Fallback: ke localStorage jika API gagal
    const data = bacaData()
    const sekarang = new Date().toISOString()

    if (id !== undefined) {
      const index = data.findIndex((item) => item.id === id)
      if (index !== -1) {
        data[index] = { ...data[index], ...form, author: "Super Admin", modifiedAt: sekarang }
      }
    } else {
      const baru: Testimoni = {
        id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
        ...form,
        author: "Super Admin",
        modifiedAt: sekarang,
      }
      data.push(baru)
    }
    tulisData(data)
    return { success: false, fallback: true }
  }
}

export async function hapusTestimoni(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimoni/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("API error");
    return;
  } catch (e) {
    // ⚠️ Fallback: ke localStorage jika API gagal
    const data = bacaData();
    tulisData(data.filter((item) => item.id !== id));
  }
}

export async function ubahStatusTestimoni(id: number): Promise<void> {
  try {
    // Dapatkan status baru terlebih dahulu dari localStorage sebelum kirim ke API
    const data = bacaData();
    const itemLama = data.find((item) => item.id === id)!;
    const statusBaru = itemLama.status === "aktif" ? "nonaktif" : "aktif";

    const res = await fetch(`${API_BASE_URL}/testimoni/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: statusBaru }),
    });
    if (!res.ok) throw new Error("API error");
    return;
  } catch (e) {
    // ⚠️ Fallback: ke localStorage jika API gagal
    const data = bacaData();
    const diperbarui = data.map((item): Testimoni => {
      if (item.id !== id) return item;
      return { ...item, status: item.status === "aktif" ? "nonaktif" : "aktif", modifiedAt: new Date().toISOString() };
    });
    tulisData(diperbarui);
  }
}

