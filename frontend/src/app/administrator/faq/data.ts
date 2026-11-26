export type Faq = {
  id: number;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  aktif: boolean;
};

export type FormFaq = Omit<Faq, "id">;

const API_BASE = '/api/v1/faq';

const KUNCI = "blc-faq";

const awal: Faq[] = [
  {
    id: 1,
    pertanyaan: "Apa itu BLC Surabaya?",
    jawaban:
      "Broadband Learning Center adalah pusat pembelajaran digital untuk warga Surabaya.",
    urutan: 1,
    aktif: true,
  },
  {
    id: 2,
    pertanyaan: "Bagaimana cara mendaftar pelatihan?",
    jawaban:
      "Datang ke BLC terdekat atau daftar lewat menu Daftar di website.",
    urutan: 2,
    aktif: true,
  },
  {
    id: 3,
    pertanyaan: "Apakah pelatihan berbayar?",
    jawaban: "Pelatihan di BLC gratis untuk warga Surabaya.",
    urutan: 3,
    aktif: true,
  },
];

// Membaca data dari localStorage
function bacaCache(): Faq[] {
  if (typeof window === "undefined") return awal;
  try {
    const s = window.localStorage.getItem(KUNCI);
    return s ? (JSON.parse(s) as Faq[]) : awal;
  } catch {
    return awal;
  }
}

// Menyimpan data ke localStorage
function tulisCache(data: Faq[]) {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    // Abaikan jika penyimpanan gagal
  }
}

// Normalisasi nama field dari API ke lokal
function normalisasi(faq: any): Faq {
  return {
    id: faq.id,
    pertanyaan: faq.pertanyaan,
    jawaban: faq.jawaban,
    urutan: faq.urutan ?? 0,
    aktif: faq.isAktif ?? faq.aktif ?? true,
  };
}

// Mengambil seluruh FAQ dari API (dengan fallback ke localStorage)
export async function ambilFaq(): Promise<Faq[]> {
  try {
    const res = await fetch(`${API_BASE}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Gagal mengambil data FAQ");
    const json = await res.json();
    const data = json.data ?? json;
    tulisCache(data.map(normalisasi));
    return data.map(normalisasi);
  } catch (err: any) {
    console.warn("Gagal ambil FAQ dari API, fallback ke localStorage:", err);
    return bacaCache();
  }
}

// Menambah atau mengubah FAQ
export async function simpanFaq(data: FormFaq, id?: number): Promise<Faq> {
  const baru: Faq = {
    id: id ?? Date.now(),
    pertanyaan: data.pertanyaan,
    jawaban: data.jawaban,
    urutan: data.urutan ?? 0,
    aktif: data.aktif ?? true,
  };

  try {
    const method = id ? "PUT" : "POST";
    const res = await fetch(`${API_BASE}${id ? "/" + id : ""}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(baru),
      credentials: "include",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.message || `Gagal menyimpan FAQ (${res.status})`;
      throw new Error(msg);
    }

    const json = await res.json();
    const hasil = normalisasi(json.data ?? json);

    // Sync ke cache lokal
    const current = bacaCache();
    const updated = id
      ? current.map((x) => (x.id === id ?hasil : x))
      : [hasil, ...current.filter((x) => x.id !== hasil.id)];
    tulisCache(updated);

    return hasil;
  } catch (err: any) {
    console.error("Gagal simpan ke API, fallback ke localStorage:", err);

    // Fallback ke localStorage saja
    const lama = bacaCache();
    const itemBaru: Faq = {
      id: id ?? Date.now(),
      ...baru,
      updated_at: new Date().toISOString(),
    };

    const updated = id
      ? lama.map((x) => (x.id === id ? itemBaru : x))
      : [itemBaru, ...lama.filter((x) => x.id !== itemBaru.id)];
    tulisCache(updated);

    return { success: true, data: itemBaru };
  }
}

// Menghapus FAQ
export async function hapusFaq(id: number): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Gagal menghapus FAQ (${res.status})`);
    }

    // Hapus dari cache lokal
    tulisCache(bacaCache().filter((f) => f.id !== id));
    return;
  } catch (err: any) {
    console.error("Gagal hapus dari API, fallback ke localStorage:", err);
    tulisCache(bacaCache().filter((f) => f.id !== id));
    return;
  }
}

// Mengubah status FAQ (aktif/nonaktif)
export async function ubahStatusFaq(id: number, aktif: boolean): Promise<Faq> {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_aktif: aktif }),
      credentials: "include",
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Gagal ubah status FAQ (${res.status})`);
    }

    const json = await res.json();
    const hasil = normalisasi(json.data ?? json);

    // Sync ke cache lokal
    const current = bacaCache();
    tulisCache(current.map((x) => (x.id === id ?hasil : x)));
    return hasil;
  } catch (err: any) {
    console.error("Gagal ubah status via API, fallback ke localStorage:", err);
    const current = bacaCache();
    tulisCache(
      current.map((x) =>
        x.id === id
          ? { ...normalisasi({ id, pertanyaan: "", jawaban: "", urutan: 0, aktif }) }
          : x
      )
    );
    throw err;
  }
}
