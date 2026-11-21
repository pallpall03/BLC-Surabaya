export type ArtikelRingkas = {
  id: number;
  judul: string;
  ringkas: string;
  kategori: string;
  tanggal: string;
  gambar: string; // URL gambar, kosong = pakai latar gradasi
};

const dataContoh: ArtikelRingkas[] = [
  { id: 1, judul: "Judul artikel 1", ringkas: "Ringkasan singkat artikel pertama untuk contoh tampilan.", kategori: "Berita", tanggal: "17 Nov 2026", gambar: "" },
  { id: 2, judul: "Judul artikel 2", ringkas: "Ringkasan singkat artikel kedua untuk contoh tampilan.", kategori: "Pelatihan", tanggal: "15 Nov 2026", gambar: "" },
  { id: 3, judul: "Judul artikel 3", ringkas: "Ringkasan singkat artikel ketiga untuk contoh tampilan.", kategori: "Tips", tanggal: "12 Nov 2026", gambar: "" },
  { id: 4, judul: "Judul artikel 4", ringkas: "Ringkasan singkat artikel keempat untuk contoh tampilan.", kategori: "Berita", tanggal: "10 Nov 2026", gambar: "" },
  { id: 5, judul: "Judul artikel 5", ringkas: "Ringkasan singkat artikel kelima untuk contoh tampilan.", kategori: "Kegiatan", tanggal: "8 Nov 2026", gambar: "" },
  { id: 6, judul: "Judul artikel 6", ringkas: "Ringkasan singkat artikel keenam untuk contoh tampilan.", kategori: "Tips", tanggal: "5 Nov 2026", gambar: "" },
];

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend (artikel terbaru yang berstatus terbit).
export async function ambilArtikelTerbaru(): Promise<ArtikelRingkas[]> {
  return dataContoh;
}