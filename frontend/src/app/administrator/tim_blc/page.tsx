
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";

type Anggota = {
  id: number;
  nama: string;
  jabatan: string;
  foto: string;
  aktif: boolean;
  urutan: number;
};

const KUNCI = "blc-tim";
const MAKS_UKURAN = 2 * 1024 * 1024;

function bacaTim(): Anggota[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(KUNCI);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function simpanTim(data: Anggota[]) {
  localStorage.setItem(KUNCI, JSON.stringify(data));
}

// Mengubah foto menjadi gambar yang lebih ringan
function kompresFoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ukuran = 900;
        const rasio = Math.min(1, ukuran / img.width, ukuran / img.height);

        canvas.width = img.width * rasio;
        canvas.height = img.height * rasio;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Gagal memproses foto."));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };

      img.onerror = () => reject(new Error("Foto tidak dapat dibaca."));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Gagal membaca foto."));
    reader.readAsDataURL(file);
  });
}

export default function HalamanTimBlc() {
  const [daftar, setDaftar] = useState<Anggota[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [cari, setCari] = useState("");

  const [modal, setModal] = useState<{ id?: number } | null>(null);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [aktif, setAktif] = useState(true);
  const [foto, setFoto] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [galat, setGalat] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);

  useEffect(() => {
    setDaftar(bacaTim());
    setMemuat(false);
  }, []);

  const terurut = useMemo(
    () => [...daftar].sort((a, b) => a.urutan - b.urutan),
    [daftar]
  );

  const tampil = terurut.filter((a) =>
    `${a.nama} ${a.jabatan}`
      .toLowerCase()
      .includes(cari.toLowerCase())
  );

  const jumlahAktif = daftar.filter((a) => a.aktif).length;

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

  function bukaTambah() {
    setNama("");
    setJabatan("");
    setAktif(true);
    setFoto("");
    setFile(null);
    setGalat("");
    setModal({});
  }

  function bukaUbah(a: Anggota) {
    setNama(a.nama);
    setJabatan(a.jabatan);
    setAktif(a.aktif);
    setFoto(a.foto);
    setFile(null);
    setGalat("");
    setModal({ id: a.id });
  }

  function handlePilihFoto(f: File | null) {
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setGalat("File harus berupa gambar.");
      return;
    }

    if (f.size > MAKS_UKURAN) {
      setGalat("Ukuran foto maksimal 2 MB.");
      return;
    }

    setFile(f);
    setFoto(URL.createObjectURL(f));
    setGalat("");
  }

  async function handleSimpan() {
    if (!nama.trim() || !jabatan.trim()) {
      setGalat("Nama dan jabatan wajib diisi.");
      return;
    }

    setMenyimpan(true);
    setGalat("");

    try {
      const id = modal?.id;
      const lama = daftar.find((a) => a.id === id);

      let fotoFinal = lama?.foto ?? "";

      if (file) {
        fotoFinal = await kompresFoto(file);
      }

      const anggotaBaru: Anggota = {
        id: id ?? Date.now(),
        nama: nama.trim(),
        jabatan: jabatan.trim(),
        foto: fotoFinal,
        aktif,
        urutan: lama
          ? lama.urutan
          : Math.max(0, ...daftar.map((a) => a.urutan)) + 1,
      };

      const dataBaru = id
        ? daftar.map((a) => (a.id === id ? anggotaBaru : a))
        : [...daftar, anggotaBaru];

      simpanTim(dataBaru);
      setDaftar(dataBaru);
      setModal(null);
      setFile(null);
    } catch {
      setGalat("Gagal menyimpan data. Coba gunakan foto yang lebih kecil.");
    } finally {
      setMenyimpan(false);
    }
  }

  function handleHapus(a: Anggota) {
    if (!window.confirm(`Hapus "${a.nama}" dari tim?`)) return;

    const dataBaru = daftar.filter((x) => x.id !== a.id);
    simpanTim(dataBaru);
    setDaftar(dataBaru);
  }

  function handleToggle(a: Anggota) {
    const dataBaru = daftar.map((x) =>
      x.id === a.id ? { ...x, aktif: !x.aktif } : x
    );

    simpanTim(dataBaru);
    setDaftar(dataBaru);
  }

  function geser(id: number, arah: -1 | 1) {
    const urut = [...terurut];
    const i = urut.findIndex((a) => a.id === id);
    const j = i + arah;

    if (j < 0 || j >= urut.length) return;

    [urut[i], urut[j]] = [urut[j], urut[i]];

    const dataBaru = urut.map((a, index) => ({
      ...a,
      urutan: index + 1,
    }));

    simpanTim(dataBaru);
    setDaftar(dataBaru);
  }

  const fotoPreview = file ? foto : foto;

  return (
    <div className="space-y-5">
      {/* RINGKASAN */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Anggota</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            {daftar.length}
          </h3>
        </div>

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Anggota Aktif</p>
          <h3 className="mt-2 text-2xl font-bold text-green-600">
            {jumlahAktif}
          </h3>
        </div>

        <div className="card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Anggota Nonaktif</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-500">
            {daftar.length - jumlahAktif}
          </h3>
        </div>
      </div>

      {/* DAFTAR ANGGOTA */}
      <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              Anggota Tim
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                {jumlahAktif} dari {daftar.length} tampil
              </span>
            </h3>
            <p className="text-sm text-slate-400">
              Tim yang ditampilkan di halaman profil BLC
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama atau jabatan..."
                className={`${inputClass} bg-slate-50 pl-9`}
              />
            </div>

            <button
              onClick={bukaTambah}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
            >
              <Plus size={16} />
              Tambah Anggota
            </button>
          </div>
        </div>

        {memuat ? (
          <p className="py-12 text-center text-sm text-slate-400">
            Memuat data...
          </p>
        ) : tampil.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
            <UsersRound size={36} />
            <p className="text-sm">
              {cari ? "Anggota tidak ditemukan." : "Belum ada anggota."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tampil.map((a, i) => (
              <article
                key={a.id}
                className="overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-md"
              >
                <div className="relative aspect-square bg-gray-100">
                  {a.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.foto}
                      alt={a.nama}
                      className={`h-full w-full object-cover ${
                        a.aktif ? "" : "grayscale"
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-200 text-4xl font-bold text-violet-600">
                        {a.nama.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                    #{a.urutan}
                  </span>

                  {!a.aktif && (
                    <span className="absolute right-2 top-2 rounded-full bg-slate-700/80 px-2 py-0.5 text-xs text-white">
                      Disembunyikan
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="truncate font-semibold text-slate-800">
                    {a.nama}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {a.jabatan}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => geser(a.id, -1)}
                        disabled={!!cari || i === 0}
                        aria-label="Geser ke depan"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        onClick={() => geser(a.id, 1)}
                        disabled={!!cari || i === tampil.length - 1}
                        aria-label="Geser ke belakang"
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={a.aktif}
                      onClick={() => handleToggle(a)}
                      title={a.aktif ? "Tampil di website" : "Disembunyikan"}
                      className={`relative h-6 w-11 rounded-full transition ${
                        a.aktif ? "bg-violet-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                          a.aktif ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => bukaUbah(a)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-50 py-2 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                    >
                      <Pencil size={14} />
                      Ubah
                    </button>

                    <button
                      onClick={() => handleHapus(a)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!!cari && (
          <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
            Tombol urutan dimatikan saat pencarian aktif. Kosongkan pencarian
            untuk mengatur urutan.
          </p>
        )}
      </section>

      {/* MODAL TAMBAH / UBAH */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">
                {modal.id ? "Ubah Anggota" : "Tambah Anggota"}
              </h4>

              <button
                onClick={() => setModal(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center gap-4">
                <label className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-violet-500 hover:bg-violet-50">
                  {fotoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fotoPreview}
                      alt="Preview foto"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={28} />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handlePilihFoto(e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
                </label>

                <div className="text-sm">
                  <p className="font-medium text-slate-700">Foto Anggota</p>
                  <p className="text-xs text-slate-400">
                    Klik kotak untuk memilih foto. Maksimal 2 MB.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  maxLength={100}
                  placeholder="Masukkan nama anggota"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Jabatan
                </label>
                <input
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  maxLength={100}
                  placeholder="Contoh: Instruktur"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Tampilkan di website
                  </p>
                  <p className="text-xs text-slate-400">
                    Nonaktif berarti anggota disembunyikan.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={aktif}
                  onClick={() => setAktif((a) => !a)}
                  className={`relative h-6 w-11 rounded-full transition ${
                    aktif ? "bg-violet-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      aktif ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {galat && (
                <p className="text-sm text-red-600">{galat}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setModal(null)}
                disabled={menyimpan}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>

              <button
                onClick={handleSimpan}
                disabled={menyimpan}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {menyimpan ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
