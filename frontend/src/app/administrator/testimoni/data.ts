
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

export function ambilTestimoni(): Testimoni[] {
  return bacaData().sort(
    (a, b) =>
      new Date(b.modifiedAt).getTime() -
      new Date(a.modifiedAt).getTime()
  );
}

export function simpanTestimoni(
  form: FormTestimoni,
  id?: number
): Testimoni {
  const data = bacaData();

  const sekarang = new Date().toISOString();

  if (id !== undefined) {
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Data testimoni tidak ditemukan.");
    }

    const diperbarui: Testimoni = {
      ...data[index],
      ...form,
      author: "Super Admin",
      modifiedAt: sekarang,
    };

    data[index] = diperbarui;
    tulisData(data);

    return diperbarui;
  }

  const baru: Testimoni = {
    id:
      data.length > 0
        ? Math.max(...data.map((item) => item.id)) + 1
        : 1,
    ...form,
    author: "Super Admin",
    modifiedAt: sekarang,
  };

  data.push(baru);
  tulisData(data);

  return baru;
}

export function hapusTestimoni(id: number): void {
  const data = bacaData();
  tulisData(data.filter((item) => item.id !== id));
}

export function ubahStatusTestimoni(id: number): void {
  const data = bacaData();

  const diperbarui = data.map((item): Testimoni => {
    if (item.id !== id) return item;

    return {
      ...item,
      status: item.status === "aktif" ? "nonaktif" : "aktif",
      modifiedAt: new Date().toISOString(),
    };
  });

  tulisData(diperbarui);
}
