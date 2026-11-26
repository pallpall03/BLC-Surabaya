import { redirect } from "next/navigation";

const LIST_PATH = "/koordinator/master_data/kategori_peserta";

export default async function UbahKategoriPesertaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`${LIST_PATH}?form=ubah&id=${encodeURIComponent(id)}`);
}
