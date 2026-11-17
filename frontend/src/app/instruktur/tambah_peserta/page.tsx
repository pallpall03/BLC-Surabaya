"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus } from "lucide-react";

type FormPeserta = {
  nik: string;
  nama: string;
  tanggalLahir: string;
  jenisKelamin: "L" | "P" | "";
  alamat: string;
  kecamatan: string;
  kelurahan: string;
  email: string;
  telepon: string;
  kategori: string;
  materi: string;
  foto: File | null;
};

// TODO: ganti dengan data dari API (kategori & materi pelatihan)
const MATERI_PER_KATEGORI: Record<string, string[]> = {
  "Dasar Digital": ["Pengenalan Komputer", "Microsoft Office", "Internet Sehat"],
  "Desain Grafis": ["Canva untuk Pemula", "Adobe Photoshop", "Desain Konten Sosial Media"],
  Pemrograman: ["Dasar HTML & CSS", "Dasar PHP & Laravel", "Dasar Python"],
  "Usaha Digital": ["Pemasaran Online", "Toko Online", "Fotografi Produk"],
};

const AWAL: FormPeserta = {
  nik: "",
  nama: "",
  tanggalLahir: "",
  jenisKelamin: "",
  alamat: "",
  kecamatan: "",
  kelurahan: "",
  email: "",
  telepon: "",
  kategori: "",
  materi: "",
  foto: null,
};

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20";

function Field({
  label,
  htmlFor,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 text-sm font-semibold text-slate-900">{title}</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function TambahPesertaPage() {
  const router = useRouter();
  const onClose = () => router.push("/instruktur/daftar_peserta");

  const onSubmit = async (data: FormPeserta) => {
    // TODO: kirim ke API Laravel dengan FormData (karena ada file foto)
    // const body = new FormData();
    // Object.entries(data).forEach(([k, v]) => v !== null && body.append(k, v as string | Blob));
    // await fetch("/api/peserta", { method: "POST", body });
    void data;
  };
  const [form, setForm] = useState<FormPeserta>(AWAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormPeserta, string>>>({});
  const [saving, setSaving] = useState(false);

  const preview = useMemo(() => (form.foto ? URL.createObjectURL(form.foto) : null), [form.foto]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const set = <K extends keyof FormPeserta>(key: K, value: FormPeserta[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validasi = () => {
    const e: Partial<Record<keyof FormPeserta, string>> = {};
    if (!/^\d{16}$/.test(form.nik)) e.nik = "NIK harus 16 digit angka.";
    if (!form.nama.trim()) e.nama = "Nama lengkap wajib diisi.";
    if (!form.tanggalLahir) e.tanggalLahir = "Tanggal lahir wajib diisi.";
    if (!form.jenisKelamin) e.jenisKelamin = "Pilih jenis kelamin.";
    if (!form.alamat.trim()) e.alamat = "Alamat wajib diisi.";
    if (!form.kecamatan.trim()) e.kecamatan = "Kecamatan wajib diisi.";
    if (!form.kelurahan.trim()) e.kelurahan = "Kelurahan wajib diisi.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Format email belum benar.";
    if (!/^(\+62|62|0)8\d{7,12}$/.test(form.telepon)) e.telepon = "Contoh: 081234567890.";
    if (!form.kategori) e.kategori = "Pilih kategori.";
    if (!form.materi) e.materi = "Pilih materi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, foto: "File harus berupa gambar (JPG/PNG)." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, foto: "Ukuran foto maksimal 2 MB." }));
      return;
    }
    set("foto", file);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validasi()) return;
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/instruktur/daftar_peserta"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar peserta
        </Link>
        <div className="flex flex-col rounded-xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40">
        <header className="border-b border-orange-100 px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">Tambah peserta</h1>
          <p className="text-sm text-slate-500">Lengkapi data peserta pelatihan.</p>
        </header>

        <form id="form-peserta" onSubmit={handleSubmit} noValidate className="space-y-8 px-6 py-6">
          <Section title="Data diri">
            <Field label="NIK" htmlFor="nik" error={errors.nik}>
              <input
                id="nik"
                inputMode="numeric"
                maxLength={16}
                placeholder="16 digit NIK"
                className={inputCls}
                value={form.nik}
                onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field label="Nama lengkap" htmlFor="nama" error={errors.nama}>
              <input
                id="nama"
                placeholder="Sesuai KTP"
                className={inputCls}
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
              />
            </Field>
            <Field label="Tanggal lahir" htmlFor="tgl" error={errors.tanggalLahir}>
              <input
                id="tgl"
                type="date"
                className={inputCls}
                value={form.tanggalLahir}
                onChange={(e) => set("tanggalLahir", e.target.value)}
              />
            </Field>
            <Field label="Jenis kelamin" error={errors.jenisKelamin}>
              <div className="flex gap-3">
                {(
                  [
                    ["L", "Laki-laki"],
                    ["P", "Perempuan"],
                  ] as const
                ).map(([v, label]) => (
                  <label key={v} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="jk"
                      className="peer sr-only"
                      checked={form.jenisKelamin === v}
                      onChange={() => set("jenisKelamin", v)}
                    />
                    <span className="block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm text-slate-700 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:font-medium peer-checked:text-orange-800 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500/30">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Alamat dan kontak">
            <Field label="Alamat" htmlFor="alamat" error={errors.alamat} className="sm:col-span-2">
              <textarea
                id="alamat"
                rows={2}
                placeholder="Nama jalan, RT/RW, nomor rumah"
                className={inputCls}
                value={form.alamat}
                onChange={(e) => set("alamat", e.target.value)}
              />
            </Field>
            <Field label="Kecamatan" htmlFor="kec" error={errors.kecamatan}>
              <input
                id="kec"
                className={inputCls}
                value={form.kecamatan}
                onChange={(e) => set("kecamatan", e.target.value)}
              />
            </Field>
            <Field label="Kelurahan" htmlFor="kel" error={errors.kelurahan}>
              <input
                id="kel"
                className={inputCls}
                value={form.kelurahan}
                onChange={(e) => set("kelurahan", e.target.value)}
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email}>
              <input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className={inputCls}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="No. telepon" htmlFor="telp" error={errors.telepon}>
              <input
                id="telp"
                inputMode="tel"
                placeholder="081234567890"
                className={inputCls}
                value={form.telepon}
                onChange={(e) => set("telepon", e.target.value.replace(/[^\d+]/g, ""))}
              />
            </Field>
          </Section>

          <Section title="Pelatihan">
            <Field label="Kategori" htmlFor="kategori" error={errors.kategori}>
              <select
                id="kategori"
                className={inputCls}
                value={form.kategori}
                onChange={(e) => {
                  set("kategori", e.target.value);
                  set("materi", "");
                }}
              >
                <option value="">Pilih kategori</option>
                {Object.keys(MATERI_PER_KATEGORI).map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </Field>
            <Field label="Materi" htmlFor="materi" error={errors.materi}>
              <select
                id="materi"
                className={inputCls + " disabled:bg-slate-50 disabled:text-slate-400"}
                disabled={!form.kategori}
                value={form.materi}
                onChange={(e) => set("materi", e.target.value)}
              >
                <option value="">{form.kategori ? "Pilih materi" : "Pilih kategori dulu"}</option>
                {(MATERI_PER_KATEGORI[form.kategori] ?? []).map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
          </Section>

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-900">Foto peserta</legend>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Pratinjau foto" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="text-slate-400" size={24} />
                )}
              </div>
              <div>
                <label
                  htmlFor="foto"
                  className="inline-block cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {form.foto ? "Ganti foto" : "Pilih foto"}
                </label>
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFoto(e.target.files?.[0])}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  {form.foto ? form.foto.name : "JPG atau PNG, maksimal 2 MB."}
                </p>
                {errors.foto && <p className="mt-1 text-xs text-red-600">{errors.foto}</p>}
              </div>
            </div>
          </fieldset>
        </form>

        <footer className="flex justify-end gap-3 border-t border-orange-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            form="form-peserta"
            disabled={saving}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan peserta"}
          </button>
        </footer>
        </div>
      </div>
    </main>
  );
}