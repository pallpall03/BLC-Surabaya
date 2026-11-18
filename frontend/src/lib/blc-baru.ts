export type BlcBaru = {
  id: number;
  nama: string;
};

const dataContoh: BlcBaru[] = [
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

// SEMENTARA: data contoh. NANTI DIGANTI fetch GET ke backend.
export async function ambilBlcBaru(): Promise<BlcBaru[]> {
  return dataContoh;
}

// SEMENTARA: tidak melakukan apa-apa. NANTI DIGANTI fetch POST ke backend.
export async function tambahkanBlc(id: number): Promise<void> {
  void id;
}