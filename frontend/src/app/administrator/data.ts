export type BlcBaru = {
  id: number;
  nama: string;
};

const semua: BlcBaru[] = [
  "BLC Ujung",
  "BLC Wonorejo Rungkut",
  "BLC Banyu Urip",
  "BLC Gunung Anyar",
  "BLC Kupang Gunung",
  "BLC Bulak Banteng",
  "BLC Dukuh Kupang",
  "BLC Kemayoran",
  "BLC Klakah Rejo",
  "BLC Siwalankerto",
  "BLC Kebun Bibit Wonorejo",
  "BLC Medokan Ayu",
].map((nama, i) => ({ id: i + 1, nama }));

type Isi = { website: BlcBaru[]; belum: BlcBaru[] };

const KUNCI = "blc-lokasi-beranda";
const awal: Isi = { website: semua.slice(0, 4), belum: semua.slice(4) };

// SEMENTARA: disimpan di localStorage. NANTI DIGANTI fetch ke backend.
function baca(): Isi {
  if (typeof window === "undefined") return awal;
  try {
    const s = window.localStorage.getItem(KUNCI);
    if (!s) return awal;
    const parsed = JSON.parse(s);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.website)) {
      return awal;
    }
    return parsed as Isi;
  } catch {
    return awal;
  }
}

function tulis(isi: Isi) {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(isi));
  } catch {
    // abaikan kalau penyimpanan penuh atau diblokir
  }
}

// BLC yang belum tampil di website (dipakai Beranda admin)
export async function ambilBlcBaru(): Promise<BlcBaru[]> {
  const isi = baca();
  return Array.isArray(isi?.belum) ? isi.belum : [];
}

// Pindahkan BLC dari "belum terdaftar" ke daftar lokasi di website
export async function tambahkanBlc(id: number): Promise<void> {
  const isi = baca();
  const blc = isi.belum.find((b) => b.id === id);
  if (!blc) return;
  tulis({
    website: [...(Array.isArray(isi.website) ? isi.website : []), blc],
    belum: (Array.isArray(isi.belum) ? isi.belum : []).filter((b) => b.id !== id),
  });
}

// BLC yang tampil di website (dipakai section Lokasi di home)
export async function ambilLokasiWebsite(): Promise<BlcBaru[]> {
  const isi = baca();
  return Array.isArray(isi?.website) ? isi.website : [];
}

