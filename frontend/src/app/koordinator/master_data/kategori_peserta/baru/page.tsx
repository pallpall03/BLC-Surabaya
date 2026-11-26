import { redirect } from "next/navigation";

const LIST_PATH = "/koordinator/master_data/kategori_peserta";

export default function BuatKategoriPesertaPage() {
  redirect(`${LIST_PATH}?form=baru`);
}
