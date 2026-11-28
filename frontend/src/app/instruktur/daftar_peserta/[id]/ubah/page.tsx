"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle, ArrowLeft, Building2, CalendarDays, Fingerprint, GraduationCap,
  Mail, Map, MapPin, Mars, Phone, RotateCcw, Save, User, Venus,
} from "lucide-react";
import { getPeserta, getPesertaOpsi, updatePeserta, type PesertaDetail, type PesertaOpsi } from "@/lib/api";

type Nilai = {
  nik: string; nama: string; tanggalLahir: string; jenisKelamin: "L" | "P";
  alamat: string; kecamatan: string; kelurahan: string; kecamatanLain: string; kelurahanLain: string;
  email: string; telepon: string; kategoriId: string; lokasiBlcId: string; isSurabaya: boolean;
};
type TeksKey = "nik" | "nama" | "tanggalLahir" | "alamat" | "kecamatan" | "kelurahan" | "kecamatanLain" | "kelurahanLain" | "email" | "telepon";

const KEMBALI = "/instruktur/daftar_peserta";
const NAMA_KOLOM: Record<keyof Nilai, string> = {
  nik: "NIK", nama: "Nama", tanggalLahir: "Tanggal lahir", jenisKelamin: "Jenis kelamin", alamat: "Alamat",
  kecamatan: "Kecamatan", kelurahan: "Kelurahan", kecamatanLain: "Kecamatan luar Surabaya",
  kelurahanLain: "Kelurahan luar Surabaya", email: "Email", telepon: "No. telepon",
  kategoriId: "Kategori peserta", lokasiBlcId: "BLC", isSurabaya: "Domisili Surabaya",
};

export default function UbahPesertaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
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

  useEffect(() => {
    if (!sukses) return;
    const timer = setTimeout(() => router.push(KEMBALI), 2500);
    return () => clearTimeout(timer);
  }, [sukses, router]);

  const set = <K extends keyof Nilai>(key: K, value: Nilai[K]) => setForm((f) => f ? { ...f, [key]: value } : f);
  const berubah = !!initial && !!form && JSON.stringify(initial) !== JSON.stringify(form);

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;
    if (berubah.length === 0) {
      showNotification({ type: "error", title: "Belum ada perubahan", message: "Ubah data peserta sebelum menyimpan." });
      return;
    }
    if (!validasi()) return;
    setSaving(true);
    setErrors((e) => ({ ...e, general: undefined }));
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
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-orange-50/60"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></main>;
  if (!form) return <main className="p-10 text-center text-red-600">{error || "Peserta tidak ditemukan."}</main>;

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

      <Card icon={GraduationCap} title="Pelatihan dan area"><div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kategori peserta" icon={GraduationCap}><select value={form.kategoriId} onChange={(e) => set("kategoriId", e.target.value)} className={inp}><option value="">Pilih kategori</option>{opsi?.kategori.map((k) => <option key={k.id} value={k.id}>{k.nama_kelompok}</option>)}</select></Field>
        <Field label="BLC" icon={MapPin}><select value={form.lokasiBlcId} onChange={(e) => set("lokasiBlcId", e.target.value)} className={inp}>{opsi?.blc.map((b) => <option key={b.id} value={b.id}>{b.nama_blc}</option>)}</select></Field>
      </div>
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
