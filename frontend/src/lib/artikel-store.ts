export type Artikel = {
  id: number;
  judul: string;
  ringkasan: string;
  status: "Draf" | "Terbit";
};

const globalStore = globalThis as unknown as { __artikel?: Artikel[] };

if (!globalStore.__artikel) {
  globalStore.__artikel = [];
}

export const daftarArtikel = globalStore.__artikel;
