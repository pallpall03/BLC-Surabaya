"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle, ArrowLeft, Building2, CalendarDays, Fingerprint, GraduationCap,
  Mail, Map, MapPin, Phone, Save, User, UserPlus, type LucideIcon,
} from "lucide-react";
import { createPeserta, getPesertaOpsi, type PesertaOpsi } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";
import { PopupSukses } from "../components/elemenform";

type FormPeserta = {
  nik: string; nama: string; tanggalLahir: string; jenisKelamin: "L" | "P" | "";
  alamat: string; kecamatan: string; kelurahan: string; kecamatanLain: string; kelurahanLain: string; email: string; telepon: string;
  kategoriId: string; lokasiBlcId: string; isSurabaya: boolean;
};
type TeksKey = "nik" | "nama" | "tanggalLahir" | "alamat" | "kecamatan" | "kelurahan" | "kecamatanLain" | "kelurahanLain" | "email" | "telepon" | "kategoriId" | "lokasiBlcId";

const KEMBALI = "/instruktur/daftar_peserta";
const AWAL: FormPeserta = {
  nik: "", nama: "", tanggalLahir: "", jenisKelamin: "", alamat: "", kecamatan: "",
  kelurahan: "", kecamatanLain: "", kelurahanLain: "", email: "", telepon: "", kategoriId: "", lokasiBlcId: "", isSurabaya: true,
};

const inp = "w-full rounded-xl border border-orange-100 bg-orange-50/40 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60 aria-[invalid=true]:border-red-400 aria-[invalid=true]:bg-red-50/50";

function Card({ icon: Icon, title, desc, children }: {
  icon: LucideIcon; title: string; desc: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-200/40">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Icon size={22} /></span>
        <div><h2 className="font-semibold text-slate-900">{title}</h2><p className="text-sm text-slate-500">{desc}</p></div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, id, icon: Icon, error, top, children, className = "" }: {
  label: string; id?: string; icon?: LucideIcon; error?: string; top?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        {Icon && <Icon size={18} className={`pointer-events-none absolute left-3 text-orange-400 ${top ? "top-3" : "top-1/2 -translate-y-1/2"}`} />}
        {children}
      </div>
      {error && <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600"><AlertCircle size={14} /> {error}</p>}
    </div>
  );
}

export default function TambahPesertaPage() {
  const router = useRouter();
  const { showNotification } = useCrudNotification();
  const [form, setForm] = useState<FormPeserta>(AWAL);
  const [opsi, setOpsi] = useState<PesertaOpsi | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormPeserta, string>>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sukses, setSukses] = useState<string | null>(null);

  useEffect(() => {
    getPesertaOpsi().then((res) => {
      setOpsi(res.data);
      setForm((f) => ({
        ...f,
        lokasiBlcId: res.data.blc.length === 1 ? String(res.data.blc[0].id) : f.lokasiBlcId,
      }));
    }).catch((e) => setError(e instanceof Error ? e.message : "Gagal memuat pilihan data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!sukses) return;
    const timer = setTimeout(() => router.push(KEMBALI), 2500);
    return () => clearTimeout(timer);
  }, [sukses, router]);

  const wajib = [form.nik, form.nama, form.tanggalLahir, form.jenisKelamin, form.alamat, form.kategoriId, form.lokasiBlcId];
  const terisi = wajib.filter(Boolean).length;
  const persen = Math.round((terisi / wajib.length) * 100);

  const set = <K extends keyof FormPeserta>(key: K, value: FormPeserta[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const bind = (key: TeksKey) => ({
    id: key, value: form[key], className: inp, "aria-invalid": !!errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never),
  });

  const validasi = () => {
    const next: Partial<Record<keyof FormPeserta, string>> = {};
    if (!/^\d{16}$/.test(form.nik)) next.nik = "NIK harus 16 digit angka.";
    if (!form.nama.trim()) next.nama = "Nama lengkap wajib diisi.";
    if (!form.tanggalLahir) next.tanggalLahir = "Tanggal lahir wajib diisi.";
    else if (form.tanggalLahir > new Date().toLocaleDateString("en-CA")) next.tanggalLahir = "Tanggal lahir tidak boleh di masa depan.";
    if (!form.jenisKelamin) next.jenisKelamin = "Pilih jenis kelamin.";
    if (!form.alamat.trim()) next.alamat = "Alamat wajib diisi.";
    if (!form.kategoriId) next.kategoriId = "Pilih kategori peserta.";
    if (!form.lokasiBlcId) next.lokasiBlcId = "Pilih BLC.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Format email belum benar.";
    if (form.telepon && !/^[0-9+\-\s()]+$/.test(form.telepon)) next.telepon = "Nomor telepon hanya boleh berisi angka dan tanda + - ( ).";
    if (form.telepon.length > 20) next.telepon = "Nomor telepon maksimal 20 karakter.";
    if (!form.isSurabaya && !form.kecamatanLain.trim()) next.kecamatanLain = "Kecamatan luar Surabaya wajib diisi.";
    if (!form.isSurabaya && !form.kelurahanLain.trim()) next.kelurahanLain = "Kelurahan luar Surabaya wajib diisi.";
    setErrors(next);
    if (Object.keys(next).length === 0) return true;
    showNotification({ type: "error", title: "Peserta gagal disimpan", message: "Periksa kembali isian formulir." });
    return false;
  };

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jenisKelamin || !validasi()) return;
    setSaving(true);
    setError("");
    try {
      await createPeserta({
        nik: form.nik, nama: form.nama, tanggal_lahir: form.tanggalLahir, jk: form.jenisKelamin,
        alamat: form.alamat, kecamatan: form.kecamatan, kelurahan: form.kelurahan,
        kecamatan_lain: form.kecamatanLain, kelurahan_lain: form.kelurahanLain,
        email: form.email, telepon: form.telepon, kategori_peserta_id: Number(form.kategoriId),
        lokasi_blc_id: Number(form.lokasiBlcId), is_surabaya: form.isSurabaya,
      });
      setSukses(form.nama);
      showNotification({
        type: "success",
        title: "Peserta tersimpan",
        message: `${form.nama} berhasil ditambahkan.`,
        action: { label: "Lihat daftar peserta", onClick: () => router.push(KEMBALI) },
      });
    } catch (e) {
      const pesan = e instanceof Error ? e.message : "Gagal menyimpan peserta";
      setError(pesan);
      showNotification({ type: "error", title: "Peserta gagal disimpan", message: pesan });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href={KEMBALI} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700"><ArrowLeft size={16} /> Kembali ke daftar peserta</Link>
        <div className="instruktur-page-header mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
          <div className="flex items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/25"><UserPlus size={28} /></span>
            <div><h1 className="text-2xl font-semibold">Tambah peserta</h1><p className="text-sm text-orange-50">Lengkapi data peserta pelatihan BLC.</p></div></div>
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

        {loading ? <div className="flex justify-center py-16"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" aria-label="Memuat pilihan data" /></div> : (
          <form onSubmit={simpan} noValidate autoComplete="off" className="space-y-6">
            <Card icon={User} title="Data diri" desc="Identitas sesuai KTP.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="NIK" id="nik" icon={Fingerprint} error={errors.nik}><input {...bind("nik")} inputMode="numeric" maxLength={16} placeholder="16 digit NIK" onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))} /></Field>
                <Field label="Nama lengkap" id="nama" icon={User} error={errors.nama}><input {...bind("nama")} placeholder="Sesuai KTP" /></Field>
                <Field label="Tanggal lahir" id="tanggalLahir" icon={CalendarDays} error={errors.tanggalLahir}><input {...bind("tanggalLahir")} type="date" max={new Date().toLocaleDateString("en-CA")} /></Field>
                <Field label="Jenis kelamin" error={errors.jenisKelamin}>
                  <div className="grid grid-cols-2 gap-3">{(["L", "P"] as const).map((jk) => <label key={jk} className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-2.5 text-center text-sm"><input type="radio" name="jk" className="mr-2 accent-orange-500" checked={form.jenisKelamin === jk} onChange={() => set("jenisKelamin", jk)} />{jk === "L" ? "Laki-laki" : "Perempuan"}</label>)}</div>
                </Field>
              </div>
            </Card>

            <Card icon={MapPin} title="Alamat dan kontak" desc="Data kontak untuk pendaftaran peserta.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Alamat" id="alamat" icon={MapPin} error={errors.alamat} top className="sm:col-span-2"><textarea {...bind("alamat")} rows={2} placeholder="Nama jalan, RT/RW, nomor rumah" /></Field>
                <Field label="Kecamatan" id="kecamatan" icon={Building2}><input {...bind("kecamatan")} placeholder="Contoh: Gunung Anyar" /></Field>
                <Field label="Kelurahan" id="kelurahan" icon={Map}><input {...bind("kelurahan")} placeholder="Contoh: Rungkut Menanggal" /></Field>
                <Field label="Email" id="email" icon={Mail} error={errors.email}><input {...bind("email")} type="email" placeholder="nama@email.com" /></Field>
                <Field label="No. telepon" id="telepon" icon={Phone} error={errors.telepon}><input {...bind("telepon")} inputMode="tel" placeholder="081234567890" /></Field>
              </div>
            </Card>

            <Card icon={GraduationCap} title="Pelatihan dan area" desc="Kategori peserta serta BLC penempatan.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Kategori peserta" id="kategoriId" icon={GraduationCap} error={errors.kategoriId}>
                  <select {...bind("kategoriId")} className={inp}><option value="">Pilih kategori</option>{opsi?.kategori.map((k) => <option key={k.id} value={k.id}>{k.nama_kelompok}</option>)}</select>
                </Field>
                <Field label="BLC" id="lokasiBlcId" icon={MapPin} error={errors.lokasiBlcId}>
                  <select {...bind("lokasiBlcId")} className={inp}><option value="">Pilih BLC</option>{opsi?.blc.map((b) => <option key={b.id} value={b.id}>{b.nama_blc}</option>)}</select>
                </Field>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.isSurabaya} onChange={(e) => set("isSurabaya", e.target.checked)} className="h-4 w-4 accent-orange-500" /> Peserta berdomisili di Surabaya</label>
              {!form.isSurabaya && <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Kecamatan luar Surabaya" id="kecamatanLain" icon={Building2} error={errors.kecamatanLain}><input {...bind("kecamatanLain")} /></Field><Field label="Kelurahan luar Surabaya" id="kelurahanLain" icon={Map} error={errors.kelurahanLain}><input {...bind("kelurahanLain")} /></Field></div>}
            </Card>

            {error && <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} /> {error}</p>}
            <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-xl backdrop-blur">
              {Object.values(errors).filter(Boolean).length > 0 ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-red-600"><AlertCircle size={16} /> {Object.values(errors).filter(Boolean).length} isian perlu diperbaiki.</p>
              ) : (
                <p className="hidden text-sm text-slate-500 sm:block">{persen === 100 ? "Semua data wajib sudah lengkap." : "Lengkapi semua data wajib."}</p>
              )}
              <div className="ml-auto flex gap-3">
                <button type="button" onClick={() => router.push(KEMBALI)} disabled={!!sukses} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">Batal</button>
                <button type="submit" disabled={saving || !!sukses} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-green-700 disabled:opacity-60"><Save size={18} /> {saving ? "Menyimpan..." : "Simpan peserta"}</button>
              </div>
            </div>
          </form>
        )}
      </div>
      {!loading && !opsi?.kategori.length && <p className="mx-auto mt-4 flex max-w-3xl items-center gap-2 text-sm text-amber-700"><AlertCircle size={16} /> Belum ada kategori peserta; hubungi admin untuk melengkapi data master.</p>}
      {sukses && <PopupSukses judul="Peserta tersimpan" pesan={`Data ${sukses} berhasil ditambahkan.`} tombol="Lihat daftar peserta" onLanjut={() => router.push(KEMBALI)} />}
    </main>
  );
}
