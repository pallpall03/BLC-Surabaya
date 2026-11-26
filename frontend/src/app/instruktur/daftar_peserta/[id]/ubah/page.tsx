"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle, ArrowLeft, Building2, CalendarDays, CheckCircle2, Fingerprint, GraduationCap,
  Mail, Map, MapPin, Phone, Save, User, type LucideIcon,
} from "lucide-react";
<<<<<<< HEAD
import { getPeserta, getPesertaOpsi, updatePeserta, type PesertaDetail, type PesertaOpsi } from "@/lib/api";
=======
import { Card, Field, inp } from "../../components/elemenform";
import FormPassword from "../../components/formpassword";
import { getPeserta, updatePeserta, type PesertaDetail } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

type Nilai = {
  nik: string; nama: string; tanggalLahir: string; jenisKelamin: "L" | "P";
  alamat: string; kecamatan: string; kelurahan: string; kecamatanLain: string; kelurahanLain: string;
  email: string; telepon: string; kategoriId: string; lokasiBlcId: string; isSurabaya: boolean;
};

const inp = "w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";
const KEMBALI = "/instruktur/daftar_peserta";

function Card({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-200/40">
    <h2 className="mb-5 flex items-center gap-2 font-semibold text-slate-900"><Icon size={20} className="text-orange-500" /> {title}</h2>{children}
  </section>;
}

function Field({ label, icon: Icon, children }: { label: string; icon: LucideIcon; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label><div className="relative">
    <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />{children}
  </div></div>;
}

export default function UbahPesertaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
<<<<<<< HEAD
  const [form, setForm] = useState<Nilai | null>(null);
  const [initial, setInitial] = useState<Nilai | null>(null);
  const [opsi, setOpsi] = useState<PesertaOpsi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPeserta(Number(id)), getPesertaOpsi()]).then(([pesertaRes, opsiRes]) => {
      const p: PesertaDetail = pesertaRes.data;
      const value: Nilai = {
        nik: p.nik ?? "", nama: p.nama ?? "", tanggalLahir: p.tanggal_lahir ?? "", jenisKelamin: p.jk,
        alamat: p.alamat ?? "", kecamatan: p.kecamatan ?? "", kelurahan: p.kelurahan ?? "",
        kecamatanLain: p.kecamatan_lain ?? "", kelurahanLain: p.kelurahan_lain ?? "", email: p.email ?? "",
        telepon: p.phone ?? "", kategoriId: String(p.kategori_peserta_id ?? ""),
        lokasiBlcId: String(p.lokasi_blc_id ?? ""), isSurabaya: p.is_surabaya ?? true,
      };
      setForm(value); setInitial(value); setOpsi(opsiRes.data);
    }).catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat data peserta"))
      .finally(() => setLoading(false));
  }, [id]);
=======
  const { showNotification } = useCrudNotification();

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
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

  useEffect(() => {
    if (!sukses) return;
    const timer = setTimeout(() => router.push(KEMBALI), 2500);
    return () => clearTimeout(timer);
  }, [sukses, router]);

<<<<<<< HEAD
  const set = <K extends keyof Nilai>(key: K, value: Nilai[K]) => setForm((f) => f ? { ...f, [key]: value } : f);
  const berubah = !!initial && !!form && JSON.stringify(initial) !== JSON.stringify(form);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!/^\d{16}$/.test(form.nik) || !form.nama.trim() || !form.jenisKelamin || !form.lokasiBlcId) {
      setError("Lengkapi NIK, nama, jenis kelamin, dan BLC dengan benar."); return;
    }
    setSaving(true); setError("");
    try {
      await updatePeserta(Number(id), {
        nik: form.nik, nama: form.nama, tanggal_lahir: form.tanggalLahir || null, jk: form.jenisKelamin,
        alamat: form.alamat, kecamatan: form.kecamatan, kelurahan: form.kelurahan,
        kecamatan_lain: form.kecamatanLain, kelurahan_lain: form.kelurahanLain, email: form.email,
        telepon: form.telepon, kategori_peserta_id: form.kategoriId ? Number(form.kategoriId) : null,
        lokasi_blc_id: Number(form.lokasiBlcId), is_surabaya: form.isSurabaya,
      });
      setInitial(form); setSukses(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan perubahan");
    } finally { setSaving(false); }
=======
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
    if (Object.keys(e).length > 0) {
      showNotification({ type: "error", title: "Data peserta belum valid", message: Object.values(e)[0] ?? "Periksa kembali isian formulir." });
    }
    return Object.keys(e).length === 0;
  };

  const pilihFoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, foto: "File harus berupa gambar (JPG/PNG)." }));
      showNotification({ type: "error", title: "Foto tidak valid", message: "File harus berupa gambar (JPG/PNG)." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({ ...e, foto: "Ukuran foto maksimal 2 MB." }));
      showNotification({ type: "error", title: "Foto tidak valid", message: "Ukuran foto maksimal 2 MB." });
      return;
    }
    setErrors((e) => ({ ...e, foto: undefined }));
    setFotoBaru(file);
  };

  const simpan = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (jumlah === 0) {
      showNotification({ type: "error", title: "Belum ada perubahan", message: "Ubah data peserta sebelum menyimpan." });
      return;
    }
    if (!validasi()) return;
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
      showNotification({
        type: "success",
        title: "Peserta diperbarui",
        message: `Data ${form.nama} berhasil diperbarui.`,
        action: { label: "Lihat daftar peserta", onClick: () => router.push(KEMBALI) },
      });
      if (initialForm) setInitialForm({ ...form });
    } catch (e) {
      const pesan = e instanceof Error ? e.message : "Gagal menyimpan perubahan. Coba lagi.";
      setErrors({ general: pesan });
      showNotification({ type: "error", title: "Peserta gagal diperbarui", message: pesan });
    } finally {
          setSaving(false);
        }
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-orange-50/60"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></main>;
  if (!form) return <main className="p-10 text-center text-red-600">{error || "Peserta tidak ditemukan."}</main>;

<<<<<<< HEAD
  return <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8"><div className="mx-auto max-w-3xl">
    <Link href={KEMBALI} onClick={(e) => { if (berubah && !window.confirm("Keluar tanpa menyimpan perubahan?")) e.preventDefault(); }} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700"><ArrowLeft size={16} /> Kembali ke daftar peserta</Link>
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
      <h1 className="text-2xl font-semibold">Ubah peserta</h1><p className="mt-1 text-sm text-orange-50">Perbarui data <b>{form.nama}</b>.</p>
    </div>

    <form onSubmit={simpan} noValidate className="space-y-6">
      <Card icon={User} title="Data diri"><div className="grid gap-4 sm:grid-cols-2">
        <Field label="NIK" icon={Fingerprint}><input value={form.nik} onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))} maxLength={16} className={inp} /></Field>
        <Field label="Nama lengkap" icon={User}><input value={form.nama} onChange={(e) => set("nama", e.target.value)} className={inp} /></Field>
        <Field label="Tanggal lahir" icon={CalendarDays}><input type="date" value={form.tanggalLahir} onChange={(e) => set("tanggalLahir", e.target.value)} className={inp} /></Field>
        <div><span className="mb-1.5 block text-sm font-medium text-slate-700">Jenis kelamin</span><div className="grid grid-cols-2 gap-3">{(["L", "P"] as const).map((jk) => <label key={jk} className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-2.5 text-center text-sm"><input type="radio" className="mr-2 accent-orange-500" checked={form.jenisKelamin === jk} onChange={() => set("jenisKelamin", jk)} />{jk === "L" ? "Laki-laki" : "Perempuan"}</label>)}</div></div>
      </div></Card>

      <Card icon={MapPin} title="Alamat dan kontak"><div className="grid gap-4 sm:grid-cols-2">
        <Field label="Alamat" icon={MapPin}><textarea value={form.alamat} onChange={(e) => set("alamat", e.target.value)} rows={2} className={inp} /></Field>
        <Field label="Kecamatan" icon={Building2}><input value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)} className={inp} /></Field>
        <Field label="Kelurahan" icon={Map}><input value={form.kelurahan} onChange={(e) => set("kelurahan", e.target.value)} className={inp} /></Field>
        <Field label="Email" icon={Mail}><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inp} /></Field>
        <Field label="No. telepon" icon={Phone}><input value={form.telepon} onChange={(e) => set("telepon", e.target.value)} className={inp} /></Field>
      </div></Card>
=======
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
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720

      <Card icon={GraduationCap} title="Pelatihan dan area"><div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kategori peserta" icon={GraduationCap}><select value={form.kategoriId} onChange={(e) => set("kategoriId", e.target.value)} className={inp}><option value="">Pilih kategori</option>{opsi?.kategori.map((k) => <option key={k.id} value={k.id}>{k.nama_kelompok}</option>)}</select></Field>
        <Field label="BLC" icon={MapPin}><select value={form.lokasiBlcId} onChange={(e) => set("lokasiBlcId", e.target.value)} className={inp}>{opsi?.blc.map((b) => <option key={b.id} value={b.id}>{b.nama_blc}</option>)}</select></Field>
      </div>
<<<<<<< HEAD
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.isSurabaya} onChange={(e) => set("isSurabaya", e.target.checked)} className="h-4 w-4 accent-orange-500" /> Berdomisili di Surabaya</label>
      {!form.isSurabaya && <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Kecamatan luar Surabaya" icon={Building2}><input value={form.kecamatanLain} onChange={(e) => set("kecamatanLain", e.target.value)} className={inp} /></Field><Field label="Kelurahan luar Surabaya" icon={Map}><input value={form.kelurahanLain} onChange={(e) => set("kelurahanLain", e.target.value)} className={inp} /></Field></div>}
      </Card>

      {error && <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} /> {error}</p>}
      <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-xl backdrop-blur">
        <span className="text-sm text-slate-500">{berubah ? "Ada perubahan belum disimpan" : "Belum ada perubahan"}</span>
        <button type="submit" disabled={saving || !berubah} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-green-700 disabled:opacity-50"><Save size={18} /> {saving ? "Menyimpan..." : "Simpan perubahan"}</button>
      </div>
    </form>
  </div>
  {sukses && <div role="alertdialog" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div className="rounded-2xl bg-white p-8 text-center shadow-2xl"><CheckCircle2 size={48} className="mx-auto text-emerald-500" /><h2 className="mt-4 text-xl font-semibold">Perubahan tersimpan</h2><button type="button" onClick={() => router.push(KEMBALI)} className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-white">Lihat daftar peserta</button></div></div>}
  </main>;
}
=======
    </main>
  );
}
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
