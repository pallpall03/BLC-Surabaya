import { NextResponse } from "next/server";
import { daftarArtikel } from "@/lib/artikel-store";

type Konteks = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Konteks) {
  const { id } = await params;
  const data = await request.json();
  const index = daftarArtikel.findIndex((a) => a.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ pesan: "Tidak ditemukan" }, { status: 404 });
  }

  daftarArtikel[index] = {
    ...daftarArtikel[index],
    judul: data.judul,
    ringkasan: data.ringkasan,
    status: data.status,
  };
  return NextResponse.json(daftarArtikel[index]);
}

export async function DELETE(_request: Request, { params }: Konteks) {
  const { id } = await params;
  const index = daftarArtikel.findIndex((a) => a.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ pesan: "Tidak ditemukan" }, { status: 404 });
  }

  daftarArtikel.splice(index, 1);
  return NextResponse.json({ pesan: "Dihapus" });
}