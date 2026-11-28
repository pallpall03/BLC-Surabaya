"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle, ArrowLeft, Building2, CalendarDays, Fingerprint, GraduationCap,
  Mail, Map, MapPin, Mars, Phone, RotateCcw, Save, User, Venus,
} from "lucide-react";
import { Card, Field, PopupSukses, inp } from "../../components/elemenform";
import { getPeserta, getPesertaOpsi, updatePeserta, type PesertaDetail, type PesertaOpsi } from "@/lib/api";
import { useCrudNotification } from "@/components/CrudNotification";

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
  const { showNotification } = useCrudNotification();
  const [form, setForm] = useState<Nilai | null>(null);
  const [initial, setInitial] = useState<Nilai | null>(null);
  const [opsi, setOpsi] = useState<PesertaOpsi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof Nilai | "general", string>>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !/^\d+$/.test(id)) {
        setLoadError("Data peserta belum berhasil dimuat. Coba lagi beberapa saat.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError("");
      try {
        const [pesertaRes, opsiRes] = await Promise.all([getPeserta(Number(id)), getPesertaOpsi()]);
        const p: PesertaDetail = pesertaRes.data;
        const value: Nilai = {
          nik: p.nik ?? "", nama: p.nama ?? "", tanggalLahir: p.tanggal_lahir ?? "", jenisKelamin: p.jk,
          alamat: p.alamat ?? "", kecamatan: p.kecamatan ?? "", kelurahan: p.kelurahan ?? "",
          kecamatanLain: p.kecamatan_lain ?? "", kelurahanLain: p.kelurahan_lain ?? "", email: p.email ?? "",
          telepon: p.phone ?? "", kategoriId: String(p.kategori_peserta_id ?? ""),
          lokasiBlcId: String(p.lokasi_blc_id ?? ""), isSurabaya: p.is_surabaya ?? true,
        };
        setForm(value);
        setInitial(value);
        setOpsi(opsiRes.data);
      } catch {
        setLoadError("Data peserta belum berhasil dimuat. Coba lagi beberapa saat.");
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!sukses) return;
    const timer = setTimeout(() => router.push(KEMBALI), 2500);
    return () => clearTimeout(timer);
  }, [sukses, router]);

  const berubah = initial && form
    ? (Object.keys(initial) as (keyof Nilai)[]).filter((key) => initial[key] !== form[key])
    : [];
  const ref = initial ?? form;
  const diubah = (key: keyof Nilai) => !!ref && !!form && form[key] !== ref[key];

  const set = <K extends keyof Nilai>(key: K, value: Nilai[K]) => {
    setForm((f) => f ? { ...f, [key]: value } : f);
    setErrors((e) => ({ ...e, [key]: undefined, general: undefined }));
  };
  const bind = (key: TeksKey) => ({
    id: key, value: form?.[key] ?? "", className: inp, "aria-invalid": !!errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never),
  });

  const kembalikan = () => {
    if (initial) setForm({ ...initial });
    setErrors({});
  };
  const keluar = () => {
    if (berubah.length > 0 && !window.confirm("Ada perubahan yang belum disimpan. Keluar tanpa menyimpan?")) return;
    router.push(KEMBALI);
  };

  const validasi = () => {
    if (!form) return false;
    const next: Partial<Record<keyof Nilai, string>> = {};
    if (!/^\d{16}$/.test(form.nik)) next.nik = "NIK harus 16 digit angka.";
    if (!form.nama.trim()) next.nama = "Nama lengkap wajib diisi.";
    if (!form.jenisKelamin) next.jenisKelamin = "Pilih jenis kelamin.";
    if (!form.lokasiBlcId) next.lokasiBlcId = "Pilih BLC.";
    if (form.tanggalLahir && form.tanggalLahir > new Date().toLocaleDateString("en-CA")) next.tanggalLahir = "Tanggal lahir tidak boleh di masa depan.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Format email belum benar.";
    if (form.telepon && !/^[0-9+\-\s()]+$/.test(form.telepon)) next.telepon = "Nomor telepon hanya boleh berisi angka dan tanda + - ( ).";
    if (form.telepon.length > 20) next.telepon = "Nomor telepon maksimal 20 karakter.";
    if (!form.isSurabaya && !form.kecamatanLain.trim()) next.kecamatanLain = "Kecamatan luar Surabaya wajib diisi.";
    if (!form.isSurabaya && !form.kelurahanLain.trim()) next.kelurahanLain = "Kelurahan luar Surabaya wajib diisi.";
    setErrors(next);
    if (Object.keys(next).length === 0) return true;
    showNotification({ type: "error", title: "Data peserta belum valid", message: Object.values(next)[0] ?? "Periksa kembali isian formulir." });
    return false;
  };

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
      setInitial({ ...form });
      setSukses(form.nama);
      showNotification({
        type: "success",
        title: "Peserta diperbarui",
        message: `Data ${form.nama} berhasil diperbarui.`,
        action: { label: "Lihat daftar peserta", onClick: () => router.push(KEMBALI) },
      });
    } catch (e) {
      const pesan = e instanceof Error ? e.message : "Gagal menyimpan perubahan";
      setErrors({ general: pesan });
      showNotification({ type: "error", title: "Peserta gagal diperbarui", message: pesan });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-3 py-16" role="status">
            <span className="instruktur-spinner" aria-hidden="true" />
            <span className="text-slate-600">Memuat data peserta...</span>
          </div>
        </div>
      </main>
    );
  }

  if (loadError || !form) {
    return (
      <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href={KEMBALI} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700">
            <ArrowLeft size={16} /> Kembali ke daftar peserta
          </Link>
          <div className="card">
            <div className="card-body d-flex flex-column align-items-center gap-3 text-center py-10" role="alert">
              <span className="symbol symbol-60px symbol-circle">
                <span className="symbol-label bg-light-danger text-danger"><AlertCircle size={28} /></span>
              </span>
              <h1 className="fs-4 fw-bold text-gray-900 mb-0">Data peserta tidak dapat dimuat</h1>
              <p className="fs-7 text-gray-500 mb-0">{loadError || "Peserta tidak ditemukan."}</p>
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
        <Link href={KEMBALI} onClick={(e) => { if (berubah.length > 0) { e.preventDefault(); keluar(); } }}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Kembali ke daftar peserta
        </Link>

        <div className="instruktur-page-header mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-xl shadow-orange-300/50">
          <div>
            <h1 className="text-2xl font-semibold">Ubah peserta</h1>
            <p className="mt-1 text-sm text-orange-50">Perbarui data <b>{form.nama || "..."}</b>.</p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${berubah.length > 0 ? "bg-white text-orange-700" : "bg-white/25 text-white"}`}>
            {berubah.length > 0 ? `${berubah.length} perubahan belum disimpan` : "Belum ada perubahan"}
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
                <input {...bind("tanggalLahir")} type="date" max={new Date().toLocaleDateString("en-CA")} />
              </Field>
              <Field label="Jenis kelamin" diubah={diubah("jenisKelamin")} error={errors.jenisKelamin}>
                <div className="grid grid-cols-2 gap-3">
                  {([["L", "Laki-laki", Mars, "sky"], ["P", "Perempuan", Venus, "pink"]] as const).map(([value, label, Icon, warna]) => (
                    <label key={value} className="cursor-pointer">
                      <input type="radio" name="jk" className="peer sr-only" checked={form.jenisKelamin === value} onChange={() => set("jenisKelamin", value)} />
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

          <Card icon={MapPin} tone="bg-sky-100 text-sky-600" title="Alamat dan kontak" desc="Data kontak untuk pendaftaran peserta.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Alamat" id="alamat" icon={MapPin} top diubah={diubah("alamat")} error={errors.alamat} className="sm:col-span-2">
                <textarea {...bind("alamat")} rows={2} placeholder="Nama jalan, RT/RW, nomor rumah" />
              </Field>
              <Field label="Kecamatan" id="kecamatan" icon={Building2} diubah={diubah("kecamatan")} error={errors.kecamatan}>
                <input {...bind("kecamatan")} placeholder="Contoh: Gunung Anyar" />
              </Field>
              <Field label="Kelurahan" id="kelurahan" icon={Map} diubah={diubah("kelurahan")} error={errors.kelurahan}>
                <input {...bind("kelurahan")} placeholder="Contoh: Rungkut Menanggal" />
              </Field>
              <Field label="Email" id="email" icon={Mail} diubah={diubah("email")} error={errors.email}>
                <input {...bind("email")} type="email" placeholder="nama@email.com" />
              </Field>
              <Field label="No. telepon" id="telepon" icon={Phone} diubah={diubah("telepon")} error={errors.telepon}>
                <input {...bind("telepon")} inputMode="tel" placeholder="081234567890" />
              </Field>
            </div>
          </Card>

          <Card icon={GraduationCap} tone="bg-violet-100 text-violet-600" title="Pelatihan dan area" desc="Kategori peserta serta BLC penempatan.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kategori peserta" id="kategoriId" icon={GraduationCap} diubah={diubah("kategoriId")} error={errors.kategoriId}>
                <select id="kategoriId" value={form.kategoriId} onChange={(e) => set("kategoriId", e.target.value)} className={inp} aria-invalid={!!errors.kategoriId}>
                  <option value="">Pilih kategori</option>{opsi?.kategori.map((k) => <option key={k.id} value={k.id}>{k.nama_kelompok}</option>)}
                </select>
              </Field>
              <Field label="BLC" id="lokasiBlcId" icon={MapPin} diubah={diubah("lokasiBlcId")} error={errors.lokasiBlcId}>
                <select id="lokasiBlcId" value={form.lokasiBlcId} onChange={(e) => set("lokasiBlcId", e.target.value)} className={inp} aria-invalid={!!errors.lokasiBlcId}>
                  <option value="">Pilih BLC</option>{opsi?.blc.map((b) => <option key={b.id} value={b.id}>{b.nama_blc}</option>)}
                </select>
              </Field>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.isSurabaya} onChange={(e) => set("isSurabaya", e.target.checked)} className="h-4 w-4 accent-orange-500" /> Berdomisili di Surabaya</label>
            {!form.isSurabaya && <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Kecamatan luar Surabaya" id="kecamatanLain" icon={Building2} diubah={diubah("kecamatanLain")} error={errors.kecamatanLain}><input {...bind("kecamatanLain")} /></Field><Field label="Kelurahan luar Surabaya" id="kelurahanLain" icon={Map} diubah={diubah("kelurahanLain")} error={errors.kelurahanLain}><input {...bind("kelurahanLain")} /></Field></div>}
          </Card>

          {errors.general && <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} /> {errors.general}</p>}
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-xl backdrop-blur">
            <p className="min-w-0 flex-1 truncate text-sm text-slate-500">
              {berubah.length === 0 ? "Belum ada perubahan." : `Diubah: ${berubah.map((key) => NAMA_KOLOM[key]).join(", ")}`}
            </p>
            <div className="ml-auto flex gap-3">
              {berubah.length > 0 && (
                <button type="button" onClick={kembalikan} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  <RotateCcw size={16} /> Kembalikan
                </button>
              )}
              <button type="button" onClick={keluar} disabled={!!sukses} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">Batal</button>
              <button type="submit" disabled={saving || !!sukses || berubah.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-green-700 disabled:opacity-50"><Save size={18} /> {saving ? "Menyimpan..." : "Simpan perubahan"}</button>
            </div>
          </div>
        </form>
      </div>
      {sukses && <PopupSukses judul="Perubahan tersimpan" pesan={`Data ${sukses} berhasil diperbarui.`} tombol="Lihat daftar peserta" onLanjut={() => router.push(KEMBALI)} />}
    </main>
  );
}
