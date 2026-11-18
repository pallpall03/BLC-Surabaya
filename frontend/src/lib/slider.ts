export type Slide = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar: string; // URL gambar (sementara: URL preview dari browser)
};

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilSlide(): Promise<Slide[]> {
  return [];
}

// SEMENTARA: bikin slide palsu di browser. NANTI DIGANTI fetch POST (FormData) ke backend.
export async function tambahSlide(data: FormData): Promise<Slide> {
  const file = data.get("gambar") as File;
  return {
    id: Date.now(),
    judul: String(data.get("judul")),
    deskripsi: String(data.get("deskripsi")),
    gambar: URL.createObjectURL(file),
  };
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch DELETE ke backend.
export async function hapusSlide(id: number): Promise<void> {
  void id;
}