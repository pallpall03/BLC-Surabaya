import { NextResponse } from "next/server";
import { daftarArtikel, type Artikel } from "@/lib/artikel-store";

export async function GET() {
  return NextResponse.json(daftarArtikel);
}

export async function POST(request: Request) {
  const data = await request.json();
  const baru: Artikel = {
    id: Date.now(),
    judul: data.judul,
    ringkasan: data.ringkasan,
    status: data.status,
  };
  daftarArtikel.push(baru);
  return NextResponse.json(baru, { status: 201 });
}
