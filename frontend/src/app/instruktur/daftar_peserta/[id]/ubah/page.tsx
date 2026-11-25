"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Building2, CalendarDays, Camera, Check, Fingerprint, GraduationCap, Mail, Map, MapPin, Mars,
  Monitor, Palette, PencilLine, Phone, RotateCcw, Save, Trash2, UploadCloud, User, Venus, AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { Card, Field, inp, PopupSukses } from "../../components/elemenform";
import FormPassword from "../../components/formpassword";
import { getPeserta, updatePeserta, type PesertaDetail } from "@/lib/api";

type Nilai = {
  nik: string; nama: string; tanggalLahir: string; jenisKelamin: "L" | "P";
  alamat: string; kecamatan: string; kelurahan: string; email: string; telepon: string;
  kategori: string; materi: string;
};
type TeksKey = "nik" | "nama" | "tanggalLahir" | "alamat" | "kecamatan" | "kelurahan" | "email" | "telepon";

const KATEGORI = ["SD", "SMP", "SMA", "MAHASISWA", "UMUM"];
const MATERI: { nama: string; icon: LucideIcon }[] = [
  { nama: "APLIKASI PERKANTORAN", icon: Monitor },
  { nama: "DESAIN GRAFIS", icon: Palette },
];
const NAMA_KOLOM: Record<keyof Nilai, string> = {
  nik: "NIK", nama: "Nama", tanggalLahir: "Tanggal lahir", jenisKelamin: "Jenis kelamin", alamat: "Alamat",
  kecamatan: "Kecamatan", kelurahan: "Kelurahan", email: "Email", telepon: "No. telepon", kategori: "Kategori", materi: "Materi",
};
const KEMBALI = "/instruktur/daftar_peserta";

export default function UbahPesertaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<Nilai>({
    nik: "", nama: "", tanggalLahir: "", jenisKelamin: "L",
    alamat: "", kecamatan: "", kelurahan: "", email: "", telepon: "",
    kategori: "", materi: "",
  });
  const [fotoLama, setFotoLama] = useState(true);
  const [fotoBaru, setFotoBaru] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Nilai | "foto" | "general", string>>>({});
  const [saving, setSaving] = useState(false);
  const [seret, setSeret] = useState(false);
  const [sukses, setSukses] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [initialForm, setInitialForm] = useState<Nilai | null>(null);

  const preview = useMemo(() => (fotoBaru ? URL.createObjectURL(fotoBaru) : null), [fotoBaru]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setLoadError("");
      try {
        const pesertaRes = await getPeserta(Number(id));
        const p: PesertaDetail = pesertaRes.data;
        const nextForm: Nilai = {
          nik: p.nik || "",
          nama: p.nama || "",
          tanggalLahir: p.tanggal_lahir || "",
          jenisKelamin: p.jk || "L",
          alamat: p.alamat || "",
          kecamatan: p.kecamatan || "",
          kelurahan: p.kelurahan || "",
          email: p.email || "",
          telepon: p.phone || "",
          kategori: p.kategori || "",
          materi: "",
        };
        setForm(nextForm);
        setInitialForm(nextForm);
        setFotoLama(!!p.tanggal_lahir);
      } catch {
        setLoadError("Data peserta belum berhasil dimuat. Coba lagi beberapa saat.");
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [id, reloadKey]);

  // Setelah popup sukses muncul, otomatis kembali ke daftar peserta
  useEffect(() => {
    if (!sukses) return;
    const t = setTimeout(() => router.push(KEMBALI), 2500);
    return () => clearTimeout(t);
  }, [sukses, router]);

  const ref = initialForm ?? form;
  const berubah = (Object.keys(ref) as (keyof Nilai)[]).filter((k) => form[k] !== ref[k]);
  const fotoBerubah = fotoBaru !== null || fotoLama !== true;
  const jumlah = berubah.length + (fotoBerubah ? 1 : 0);

  const set = <K extends keyof Nilai>(k: K, v: Nilai[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const bind = (k: TeksKey) => ({
    id: k, value: form[k], className: inp, "aria-invalid": !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value),
  });

  const kembalikan = () => {
    if (initialForm) setForm({ ...initialForm });
    setFotoLama(true);
    setFotoBaru(null);
    setErrors({});
  };
  const keluar = () => {
    if (jumlah > 0 && !window.confirm("Ada perubahan yang belum disimpan. Keluar tanpa menyimpan?")) return;
    router.push(KEMBALI);
  };

  const validasi = () => {
    const e: Partial<Record<keyof Nilai, string>> = {};
    if (!/^\d{16}$/.test(form.nik)) e.nik = "NIK harus 16 digit angka.";
    if (!form.nama.trim()) e.nama = "Nama lengkap wajib diisi.";
    if (!form.tanggalLahir) e.tanggalLahir = "Tanggal lahir wajib diisi.";
    if (!form.alamat.trim()) e.alamat = "Alamat wajib diisi.";
    if (!form.kecamatan.trim()) e.kecamatan = "Kecamatan wajib diisi.";
    if (!form.kelurahan.trim()) e.kelurahan = "Kelurahan wajib diisi.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Format email belum benar.";
    if (form.telepon && !/^(\+62|62|0)8\d{7,12}$/.test(form.telepon)) e.telepon = "Contoh: 081234567890.";
    if (!form.kategori) e.kategori = "Pilih kategori.";
    if (!form.materi) e.materi = "Pilih materi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pilihFoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors((e) => ({ ...e, foto: "File harus berupa gambar (JPG/PNG)." }));
    if (file.size > 2 * 1024 * 1024) return setErrors((e) => ({ ...e, foto: "Ukuran foto maksimal 2 MB." }));
    setErrors((e) => ({ ...e, foto: undefined }));
    setFotoBaru(file);
  };

  const simpan = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (jumlah === 0 || !validasi()) return;
    setSaving(true);
    try {
      const payload = {
        nik: form.nik,
        nama: form.nama,
        tanggal_lahir: form.tanggalLahir,
        jk: form.jenisKelamin,
        alamat: form.alamat,
        kecamatan: form.kecamatan,
        kelurahan: form.kelurahan,
        email: form.email,
        phone: form.telepon,
        kategori: form.kategori,
        materi: form.materi,
        // Note: foto upload needs multipart - backend may need separate endpoint
      };
      await updatePeserta(Number(id!), payload);
      setSukses(form.nama);
      if (initialForm) setInitialForm({ ...form });
    } catch {
      setErrors({ general: "Gagal menyimpan perubahan. Coba lagi." });
    } finally {
          setSaving(false);
        }
  };

  const diubah = (k: keyof Nilai) => form[k] !== ref[k];

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <span className="instruktur-spinner" aria-hidden="true" />
              <span className="text-slate-600">Memuat data peserta...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="instruktur-main">
        <div className="mx-auto max-w-3xl">
          <Link href={KEMBALI} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-700">
            <ArrowLeft size={16} /> Kembali ke daftar peserta
          </Link>
          <div className="card">
            <div className="card-body d-flex flex-column align-items-center gap-3 text-center py-10" role="alert">
              <span className="symbol symbol-60px symbol-circle">
                <span className="symbol-label bg-light-danger text-danger"><AlertCircle size={28} /></span>
              </span>
              <h1 className="fs-4 fw-bold text-gray-900 mb-0">Data peserta tidak dapat dimuat</h1>
              <p className="fs-7 text-gray-500 mb-0">{loadError}</p>
              <button type="button" className="btn btn-primary mt-2" onClick={() => setReloadKey((value) => value + 1)}>
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href={KEMBALI} onClick={(e) => { if (jumlah > 0) { e.preventDefault(); keluar(); } }}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Kembali ke daftar peserta
        </Link>

        {/* Banner */}
        <div className="instruktur-page-header mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><PencilLine size={28} /></span>
            <div>
              <h1 className="text-2xl font-semibold">Ubah peserta</h1>
              <p className="text-sm text-orange-50">Mengubah data <b>{form.nama || "..."}</b> · peserta nomor {id}</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${jumlah > 0 ? "bg-white text-orange-700" : "bg-white/25 text-white"}`}>
            {jumlah > 0 ? `${jumlah} perubahan belum disimpan` : "Belum ada perubahan"}
          </span>
        </div>

        <form onSubmit={simpan} noValidate autoComplete="off" className="space-y-6">
          <Card icon={User} tone="bg-orange-100 text-orange-600" title="Data diri" desc="Identitas sesuai KTP.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="NIK" id="nik" icon={Fingerprint} diubah={diubah("nik")} error={errors.nik}>
                <input {...bind("nik")} inputMode="numeric" maxLength={16} placeholder="16 digit NIK" onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Field label="Nama lengkap" id="nama" icon={User} diubah={diubah("nama")} error={errors.nama}>
                <input {...bind("nama")} placeholder="Sesuai KTP" />
              </Field>
              <Field label="Tanggal lahir" id="tanggalLahir" icon={CalendarDays} diubah={diubah("tanggalLahir")} error={errors.tanggalLahir}>
                <input {...bind("tanggalLahir")} type="date" />
              </Field>
              <Field label="Jenis kelamin" diubah={diubah("jenisKelamin")}>
                <div className="grid grid-cols-2 gap-3">
                  {([[ "L", "Laki-laki", Mars, "sky" ], [ "P", "Perempuan", Venus, "pink" ]] as const).map(([v, label, Icon, warna]) => (
                    <label key={v} className="cursor-pointer">
                      <input type="radio" name="jk" className="peer sr-only" checked={form.jenisKelamin === v} onChange={() => set("jenisKelamin", v)} />
                      <span className={`flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 text-sm text-slate-600 transition hover:border-orange-300 peer-focus-visible:ring-4 peer-focus-visible:ring-orange-200/60 ${
                        warna === "sky" ? "peer-checked:border-sky-400 peer-checked:bg-sky-50 peer-checked:text-sky-700" : "peer-checked:border-pink-400 peer-checked:bg-pink-50 peer-checked:text-pink-700" } peer-checked:font-medium`}>
                        <Icon size={18} /> {label}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </Card>

          <Card icon={MapPin} tone="bg-sky-100 text-sky-600" title="Alamat dan kontak" desc="Tempat tinggal dan cara menghubungi peserta.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Alamat" id="alamat" icon={MapPin} top diubah={diubah("alamat")} error={errors.alamat} className="sm:col-span-2">
                <textarea {...bind("alamat")} rows={2} placeholder="Nama jalan, RT/RW, nomor rumah" />
              </Field>
              <Field label="Kecamatan" id="kecamatan" icon={Building2} diubah={diubah("kecamatan")} error={errors.kecamatan}>
                <input {...bind("kecamatan")} placeholder="Contoh: Gunung Anyar" />
              </Field>
              <Field label="Kelurahan" id="kelurahan" icon={Map} diubah={diubah("kelurahan")} error={errors.kelurahan}>
                <input {...bind("kelurahan")} placeholder="Contoh: Gunung Anyar" />
              </Field>
              <Field label="Email" id="email" icon={Mail} diubah={diubah("email")} error={errors.email}>
                <input {...bind("email")} type="email" name="email-peserta" autoComplete="off" placeholder="nama@email.com" />
              </Field>
              <Field label="No. telepon" id="telepon" icon={Phone} diubah={diubah("telepon")} error={errors.telepon}>
                <input {...bind("telepon")} inputMode="tel" placeholder="081234567890" onChange={(e) => set("telepon", e.target.value.replace(/[^\d+]/g, ""))} />
              </Field>
            </div>
          </Card>

          <Card icon={GraduationCap} tone="bg-violet-100 text-violet-600" title="Pelatihan" desc="Kategori peserta dan materi yang diikuti.">
            <p className="mb-2 flex items-center text-sm font-medium text-slate-700">
              Kategori {diubah("kategori") && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">diubah</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {KATEGORI.map((k) => {
                const aktif = form.kategori === k;
                return (
                  <button key={k} type="button" onClick={() => set("kategori", k)} aria-pressed={aktif}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                      aktif ? "border-violet-400 bg-violet-50 font-medium text-violet-700" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}>
                    {aktif && <Check size={15} />} {k}
                  </button>
                );
              })}
            </div>
            {errors.kategori && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.kategori}</p>}

            <p className="mb-2 mt-5 flex items-center text-sm font-medium text-slate-700">
              Materi {diubah("materi") && <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">diubah</span>}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {MATERI.map(({ nama, icon: Icon }) => {
                const aktif = form.materi === nama;
                return (
                  <button key={nama} type="button" onClick={() => set("materi", nama)} aria-pressed={aktif}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      aktif ? "border-green-500 bg-green-50 font-medium text-green-700" : "border-orange-100 bg-orange-50/40 text-slate-600 hover:border-green-300"
                    }`}>
                    <Icon size={24} /> <span className="flex-1">{nama}</span> {aktif && <Check size={16} />}
                  </button>
                );
              })}
            </div>
            {errors.materi && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.materi}</p>}
          </Card>

          <Card icon={Camera} tone="bg-emerald-100 text-emerald-600" title="Foto peserta" desc="Opsional. JPG atau PNG, maksimal 2 MB.">
            {preview || fotoLama ? (
              <div className="flex items-center gap-4 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Pratinjau foto" className="h-28 w-24 rounded-xl object-cover shadow-md" />
                ) : (
                  <span className="flex h-28 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-sky-200 text-white shadow-md"><User size={40} /></span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{preview ? fotoBaru?.name : "Foto saat ini"}</p>
                  <p className="text-xs text-slate-500">{preview ? `${fotoBaru ? (fotoBaru.size / 1024).toFixed(0) : 0} KB · akan menggantikan foto lama` : "Tersimpan di server"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label htmlFor="foto" className="cursor-pointer rounded-lg border border-orange-200 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-50">Ganti foto</label>
                    <button type="button" onClick={() => (preview ? setFotoBaru(null) : setFotoLama(false))}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                      <Trash2 size={16} /> {preview ? "Batalkan foto baru" : "Hapus foto"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label htmlFor="foto"
                onDragOver={(e) => { e.preventDefault(); setSeret(true); }} onDragLeave={() => setSeret(false)}
                onDrop={(e) => { e.preventDefault(); setSeret(false); pilihFoto(e.dataTransfer.files[0]); }}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
                  seret ? "border-orange-500 bg-orange-100" : "border-orange-200 bg-orange-50/40 hover:border-orange-400 hover:bg-orange-50"
                }`}>
                <UploadCloud size={36} className="text-orange-500" />
                <span className="text-sm font-medium text-slate-700">Tarik foto ke sini atau klik untuk memilih</span>
              </label>
            )}
            <input id="foto" type="file" accept="image/*" className="sr-only" onChange={(e) => { pilihFoto(e.target.files?.[0]); e.target.value = ""; }} />
            {errors.foto && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.foto}</p>}
          </Card>

          {/* Tombol aksi */}
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-xl shadow-orange-300/40 backdrop-blur">
            <p className="min-w-0 flex-1 truncate text-sm text-slate-500">
              {jumlah === 0 ? "Belum ada perubahan." : `Diubah: ${[...berubah.map((k) => NAMA_KOLOM[k]), ...(fotoBerubah ? ["Foto"] : [])].join(", ")}`}
            </p>
            <div className="ml-auto flex gap-3">
              {jumlah > 0 && (
                <button type="button" onClick={kembalikan} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  <RotateCcw size={16} /> Kembalikan
                </button>
              )}
              <button type="button" onClick={keluar} disabled={!!sukses} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">Batal</button>
              <button type="submit" disabled={saving || !!sukses || jumlah === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700 disabled:opacity-50 disabled:shadow-none">
                <Save size={18} /> {saving ? "Menyimpan..." : "Simpan perubahan"}
              </button>
            </div>
          </div>
        </form>

        {/* Ubah password: form terpisah dengan tombol simpan sendiri */}
        <div className="mt-10">
          <FormPassword pesertaId={String(id)} nama={form.nama} />
        </div>
      </div>

      {sukses && <PopupSukses judul="Perubahan tersimpan" pesan={<><b className="text-slate-700">{sukses}</b> berhasil diperbarui. Mengalihkan ke daftar peserta...</>} tombol="Lihat daftar peserta" onLanjut={() => router.push(KEMBALI)} />}
    </main>
  );
}