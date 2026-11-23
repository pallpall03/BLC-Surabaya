"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle, ArrowLeft, Building2, CalendarDays, Camera, Check, CheckCircle2, Code2, Fingerprint,
  GraduationCap, Mail, MapPin, Map, Mars, Monitor, Palette, Phone, Save, Store,
  Trash2, UploadCloud, User, UserPlus, Venus,
  type LucideIcon,
} from "lucide-react";

type FormPeserta = {
  nik: string; nama: string; tanggalLahir: string; jenisKelamin: "L" | "P" | "";
  alamat: string; kecamatan: string; kelurahan: string; email: string; telepon: string;
  kategori: string; materi: string; foto: File | null;
};
type TeksKey = "nik" | "nama" | "tanggalLahir" | "alamat" | "kecamatan" | "kelurahan" | "email" | "telepon";

const AWAL: FormPeserta = {
  nik: "", nama: "", tanggalLahir: "", jenisKelamin: "", alamat: "", kecamatan: "",
  kelurahan: "", email: "", telepon: "", kategori: "", materi: "", foto: null,
};

// TODO: ganti dengan data dari API (kategori & materi pelatihan)
const KATEGORI: { nama: string; icon: LucideIcon; materi: string[] }[] = [
  { nama: "Dasar Digital", icon: Monitor, materi: ["Pengenalan Komputer", "Microsoft Office", "Internet Sehat"] },
  { nama: "Desain Grafis", icon: Palette, materi: ["Canva untuk Pemula", "Adobe Photoshop", "Desain Konten Sosial Media"] },
  { nama: "Pemrograman", icon: Code2, materi: ["Dasar HTML & CSS", "Dasar PHP & Laravel", "Dasar Python"] },
  { nama: "Usaha Digital", icon: Store, materi: ["Pemasaran Online", "Toko Online", "Fotografi Produk"] },
];

const inp =
  "w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/50";

function Card({ icon: Icon, tone, title, desc, children }: {
  icon: LucideIcon; tone: string; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-200/40">
      <div className="mb-5 flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={22} />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, id, icon: Icon, error, top, className = "", children }: {
  label: string; id?: string; icon?: LucideIcon; error?: string; top?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`pointer-events-none absolute left-3 text-orange-400 ${top ? "top-3" : "top-1/2 -translate-y-1/2"}`}
          />
        )}
        {children}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

export default function TambahPesertaPage() {
  const router = useRouter();
  const kembali = () => router.push("/instruktur/daftar_peserta");

  const [form, setForm] = useState<FormPeserta>(AWAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormPeserta, string>>>({});
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [sukses, setSukses] = useState<string | null>(null);

  const preview = useMemo(() => (form.foto ? URL.createObjectURL(form.foto) : null), [form.foto]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // Setelah popup sukses muncul, otomatis kembali ke daftar peserta
  useEffect(() => {
    if (!sukses) return;
    const t = setTimeout(() => router.push("/instruktur/daftar_peserta"), 2500);
    return () => clearTimeout(t);
  }, [sukses, router]);

  const wajib = [form.nik, form.nama, form.tanggalLahir, form.jenisKelamin, form.alamat, form.kecamatan,
    form.kelurahan, form.email, form.telepon, form.kategori, form.materi];
  const terisi = wajib.filter(Boolean).length;
  const persen = Math.round((terisi / wajib.length) * 100);

  const set = <K extends keyof FormPeserta>(key: K, value: FormPeserta[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const bind = (k: TeksKey) => ({
    id: k,
    value: form[k],
    className: inp,
    "aria-invalid": !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value),
  });

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
    if (!form.kategori) e.kategori = "Pilih kategori pelatihan.";
    else if (!form.materi) e.materi = "Pilih salah satu materi.";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setTimeout(() => document.querySelector('form p.text-red-600')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
    return Object.keys(e).length === 0;
  };

  const handleFoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors((e) => ({ ...e, foto: "File harus berupa gambar (JPG/PNG)." }));
    if (file.size > 2 * 1024 * 1024) return setErrors((e) => ({ ...e, foto: "Ukuran foto maksimal 2 MB." }));
    set("foto", file);
  };

  const simpan = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validasi()) return;
    setSaving(true);
    try {
      // TODO: kirim ke API Laravel dengan FormData (karena ada file foto)
      // const body = new FormData();
      // Object.entries(form).forEach(([k, v]) => v !== null && body.append(k, v as string | Blob));
      // await fetch("/api/peserta", { method: "POST", body });
      setSukses(form.nama);
    } finally {
      setSaving(false);
    }
  };

  const materiTersedia = KATEGORI.find((k) => k.nama === form.kategori)?.materi ?? [];

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/instruktur/daftar_peserta" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Kembali ke daftar peserta
        </Link>

        {/* Banner + progres */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25">
              <UserPlus size={28} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold">Tambah peserta</h1>
              <p className="text-sm text-orange-50">Lengkapi data peserta pelatihan BLC.</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs font-medium text-orange-50">
              <span>{terisi} dari {wajib.length} data terisi</span>
              <span>{persen}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/30">
              <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${persen}%` }} />
            </div>
          </div>
        </div>

        <form onSubmit={simpan} noValidate autoComplete="off" className="space-y-6">
          <Card icon={User} tone="bg-orange-100 text-orange-600" title="Data diri" desc="Identitas sesuai KTP.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="NIK" id="nik" icon={Fingerprint} error={errors.nik}>
                <input {...bind("nik")} inputMode="numeric" maxLength={16} placeholder="16 digit NIK"
                  onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Field label="Nama lengkap" id="nama" icon={User} error={errors.nama}>
                <input {...bind("nama")} placeholder="Sesuai KTP" />
              </Field>
              <Field label="Tanggal lahir" id="tanggalLahir" icon={CalendarDays} error={errors.tanggalLahir}>
                <input {...bind("tanggalLahir")} type="date" />
              </Field>
              <Field label="Jenis kelamin" error={errors.jenisKelamin}>
                <div className="grid grid-cols-2 gap-3">
                  {([["L", "Laki-laki", Mars, "sky"], ["P", "Perempuan", Venus, "pink"]] as const).map(([v, label, Icon, warna]) => (
                    <label key={v} className="cursor-pointer">
                      <input type="radio" name="jk" className="peer sr-only" checked={form.jenisKelamin === v} onChange={() => set("jenisKelamin", v)} />
                      <span className={`flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 text-sm text-slate-600 transition hover:border-orange-300 peer-focus-visible:ring-4 peer-focus-visible:ring-orange-200/60 ${
                        warna === "sky" ? "peer-checked:border-sky-400 peer-checked:bg-sky-50 peer-checked:text-sky-700" : "peer-checked:border-pink-400 peer-checked:bg-pink-50 peer-checked:text-pink-700"} peer-checked:font-medium`}>
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
              <Field label="Alamat" id="alamat" icon={MapPin} top error={errors.alamat} className="sm:col-span-2">
                <textarea {...bind("alamat")} rows={2} placeholder="Nama jalan, RT/RW, nomor rumah" />
              </Field>
              <Field label="Kecamatan" id="kecamatan" icon={Building2} error={errors.kecamatan}>
                <input {...bind("kecamatan")} placeholder="Contoh: Gunung Anyar" />
              </Field>
              <Field label="Kelurahan" id="kelurahan" icon={Map} error={errors.kelurahan}>
                <input {...bind("kelurahan")} placeholder="Contoh: Rungkut Menanggal" />
              </Field>
              <Field label="Email" id="email" icon={Mail} error={errors.email}>
                <input
                  {...bind("email")}
                  type="email"
                  name="email-peserta"
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.currentTarget.removeAttribute("readonly")}
                  placeholder="nama@email.com"
                />
              </Field>
              <Field label="No. telepon" id="telepon" icon={Phone} error={errors.telepon}>
                <input {...bind("telepon")} inputMode="tel" placeholder="081234567890"
                  onChange={(e) => set("telepon", e.target.value.replace(/[^\d+]/g, ""))} />
              </Field>
            </div>
          </Card>

          <Card icon={GraduationCap} tone="bg-violet-100 text-violet-600" title="Pelatihan" desc="Pilih kategori, lalu materi yang diikuti.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {KATEGORI.map(({ nama, icon: Icon }) => {
                const aktif = form.kategori === nama;
                return (
                  <button
                    key={nama} type="button"
                    onClick={() => { set("kategori", nama); set("materi", ""); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      aktif ? "border-violet-400 bg-violet-50 font-medium text-violet-700" : "border-orange-100 bg-orange-50/40 text-slate-600 hover:border-violet-300"}`}
                  >
                    <Icon size={26} /> {nama}
                  </button>
                );
              })}
            </div>
            {errors.kategori && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.kategori}</p>}

            {form.kategori && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-slate-700">Materi</p>
                <div className="flex flex-wrap gap-2">
                  {materiTersedia.map((m) => {
                    const aktif = form.materi === m;
                    return (
                      <button
                        key={m} type="button" onClick={() => set("materi", m)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                          aktif ? "border-green-500 bg-green-50 font-medium text-green-700" : "border-slate-200 bg-white text-slate-600 hover:border-green-300 hover:bg-green-50/50"}`}
                      >
                        {aktif && <Check size={15} />} {m}
                      </button>
                    );
                  })}
                </div>
                {errors.materi && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.materi}</p>}
              </div>
            )}
          </Card>

          <Card icon={Camera} tone="bg-emerald-100 text-emerald-600" title="Foto peserta" desc="Opsional. JPG atau PNG, maksimal 2 MB.">
            {preview ? (
              <div className="flex items-center gap-4 rounded-xl border border-orange-100 bg-orange-50/40 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Pratinjau foto" className="h-28 w-24 rounded-xl object-cover shadow-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{form.foto?.name}</p>
                  <p className="text-xs text-slate-500">{form.foto ? (form.foto.size / 1024).toFixed(0) : 0} KB</p>
                  <button type="button" onClick={() => set("foto", null)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                    <Trash2 size={16} /> Hapus foto
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="foto"
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFoto(e.dataTransfer.files[0]); }}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
                  dragging ? "border-orange-500 bg-orange-100" : "border-orange-200 bg-orange-50/40 hover:border-orange-400 hover:bg-orange-50"}`}
              >
                <UploadCloud size={36} className="text-orange-500" />
                <span className="text-sm font-medium text-slate-700">Tarik foto ke sini atau klik untuk memilih</span>
                <input id="foto" type="file" accept="image/*" className="sr-only"
                  onChange={(e) => { handleFoto(e.target.files?.[0]); e.target.value = ""; }} />
              </label>
            )}
            {errors.foto && <p className="mt-2 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {errors.foto}</p>}
          </Card>

          {/* Tombol aksi */}
          <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-xl shadow-orange-300/40 backdrop-blur">
            {Object.values(errors).filter(Boolean).length > 0 ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-red-600"><AlertCircle size={16} /> {Object.values(errors).filter(Boolean).length} isian perlu diperbaiki.</p>
            ) : (
              <p className="hidden text-sm text-slate-500 sm:block">{persen === 100 ? "Semua data sudah lengkap." : "Lengkapi semua data wajib."}</p>
            )}
            <div className="ml-auto flex gap-3">
              <button type="button" onClick={kembali} disabled={!!sukses} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                Batal
              </button>
              <button type="submit" disabled={saving || !!sukses}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700 disabled:opacity-60">
                <Save size={18} /> {saving ? "Menyimpan..." : "Simpan peserta"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Popup sukses */}
      {sukses && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" role="alertdialog" aria-live="polite">
          <style>{`
            @keyframes pop { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(1) } }
            @keyframes bar { from { width: 100% } to { width: 0% } }
          `}</style>
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl shadow-orange-300/50"
            style={{ animation: "pop .35s ease-out" }}>
            <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/70" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={44} />
              </span>
            </span>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">Peserta tersimpan</h3>
            <p className="mt-1 text-sm text-slate-500"><b className="text-slate-700">{sukses}</b> berhasil ditambahkan. Mengalihkan ke daftar peserta...</p>
            <button type="button" onClick={() => router.push("/instruktur/daftar_peserta")}
              className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:-translate-y-0.5 hover:bg-orange-600">
              Lihat daftar peserta
            </button>
            <span className="absolute bottom-0 left-0 h-1 bg-orange-400" style={{ animation: "bar 2.5s linear forwards" }} />
          </div>
        </div>
      )}
    </main>
  );
}