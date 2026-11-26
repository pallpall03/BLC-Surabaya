"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Clock, Copy, Pencil, Plus, RefreshCw, Trash2, Users, X } from "lucide-react";
import {
  deleteJadwalUjian, saveJadwalUjian,
  type JadwalUjian, type JadwalUjianInput, type Ujian, type UjianOpsi,
} from "@/lib/api";
import TokenUjian, { buatToken } from "./tokenujian";

const inputCls = "w-full rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60";

function keInputTanggal(nilai: string) {
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "";
  const lokal = new Date(tanggal.getTime() - tanggal.getTimezoneOffset() * 60_000);
  return lokal.toISOString().slice(0, 16);
}

function formatTanggal(nilai: string) {
  const tanggal = new Date(nilai);
  if (Number.isNaN(tanggal.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(tanggal);
}

export default function ModalJadwal({ ujian, jadwalAwal, opsi, memuatOpsi, errorOpsi, onMuatOpsi, onPerubahan, onTutup }: {
  ujian: Ujian;
  jadwalAwal: JadwalUjian | null;
  opsi: UjianOpsi;
  memuatOpsi: boolean;
  errorOpsi: string;
  onMuatOpsi: () => void;
  onPerubahan: () => Promise<void>;
  onTutup: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const [edit, setEdit] = useState<JadwalUjian | null>(jadwalAwal);
  const [kelasId, setKelasId] = useState(jadwalAwal ? String(jadwalAwal.kelas_id) : "");
  const [mulai, setMulai] = useState(jadwalAwal ? keInputTanggal(jadwalAwal.mulai) : "");
  const [selesai, setSelesai] = useState(jadwalAwal ? keInputTanggal(jadwalAwal.selesai) : "");
  const [token, setToken] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);
  const [menghapusId, setMenghapusId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");
  const [disalin, setDisalin] = useState<number | null>(null);
  const sibuk = menyimpan || menghapusId !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  const jadwal = useMemo(() => ujian.jadwal ?? [], [ujian.jadwal]);
  const kelasTersedia = useMemo(() => opsi.kelas.filter((kelas) =>
    !jadwal.some((item) => item.kelas_id === kelas.id && item.id !== edit?.id)
  ), [opsi.kelas, jadwal, edit]);
  const kelasTerpilih = opsi.kelas.find((kelas) => kelas.id === Number(kelasId));
  const kelasEditHilang = !!edit && !kelasTerpilih;
  const materiBerbeda = !!kelasTerpilih && (
    (ujian.materi_id !== null && kelasTerpilih.materi_id !== null && ujian.materi_id !== kelasTerpilih.materi_id) ||
    (ujian.materi_id === null && kelasTerpilih.materi_id !== null)
  );

  const resetForm = () => {
    setEdit(null);
    setKelasId("");
    setMulai("");
    setSelesai("");
    setToken("");
    setError("");
    setSukses("");
  };

  const pilihEdit = (item: JadwalUjian) => {
    setEdit(item);
    setKelasId(String(item.kelas_id));
    setMulai(keInputTanggal(item.mulai));
    setSelesai(keInputTanggal(item.selesai));
    setToken("");
    setError("");
    setSukses("");
  };

  const salinToken = async (item: JadwalUjian) => {
    try {
      await navigator.clipboard.writeText(item.token);
      setDisalin(item.id);
      setTimeout(() => setDisalin(null), 1500);
    } catch {
      setError("Token tidak dapat disalin. Salin token secara manual.");
    }
  };

  const simpan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSukses("");
    if (!kelasId) {
      setError("Pilih kelas untuk jadwal ujian.");
      return;
    }
    if (!mulai || !selesai) {
      setError("Isi tanggal dan jam mulai serta selesai.");
      return;
    }
    if (new Date(selesai).getTime() <= new Date(mulai).getTime()) {
      setError("Waktu selesai harus setelah waktu mulai.");
      return;
    }
    if (kelasTersedia.length === 0 && !edit) {
      setError("Tidak ada kelas yang tersedia untuk dijadwalkan.");
      return;
    }
    setMenyimpan(true);
    const payload: JadwalUjianInput = {
      master_ujian_id: ujian.id,
      kelas_id: Number(kelasId),
      mulai,
      selesai,
      ...(token.trim() ? { token: token.trim() } : {}),
    };
    try {
      await saveJadwalUjian(edit?.id ?? null, payload);
      await onPerubahan();
      onTutup();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Jadwal ujian gagal disimpan.");
    } finally {
      setMenyimpan(false);
    }
  };

  const hapus = async (item: JadwalUjian) => {
    if (!window.confirm(`Hapus jadwal kelas "${item.kelas}"? Token dan akses ujian untuk jadwal ini akan dihapus.`)) return;
    setMenghapusId(item.id);
    setError("");
    setSukses("");
    try {
      await deleteJadwalUjian(item.id);
      await onPerubahan();
      if (edit?.id === item.id) resetForm();
      setSukses(`Jadwal kelas ${item.kelas} berhasil dihapus.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Jadwal ujian gagal dihapus.");
    } finally {
      setMenghapusId(null);
    }
  };

  const klikLatar = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && !sibuk) onTutup();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={headingId} onCancel={(event) => { if (sibuk) event.preventDefault(); }}
      onClose={onTutup} onClick={klikLatar}
      className="m-auto max-h-[92vh] w-[calc(100%_-_1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-orange-200 bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-orange-100 bg-white px-5 py-4">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-slate-900">Jadwal kelas ujian</h2>
          <p className="mt-0.5 text-sm text-slate-500">{ujian.judul}</p>
        </div>
        <button type="button" onClick={onTutup} disabled={sibuk} aria-label="Tutup jadwal ujian"
          className="rounded-full p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-700 disabled:opacity-40"><X size={20} /></button>
      </div>

      <div className="space-y-5 p-5">
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {sukses && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><CheckCircle2 size={17} /> {sukses}</p>}

        <section aria-labelledby={`${headingId}-form`}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 id={`${headingId}-form`} className="font-semibold text-slate-900">{edit ? "Ubah jadwal" : "Tambah jadwal"}</h3>
            {edit && <button type="button" onClick={resetForm} disabled={sibuk} className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-800 disabled:opacity-40"><Plus size={15} /> Jadwal baru</button>}
          </div>
          <form onSubmit={simpan} className="space-y-4">
            <div>
              <label htmlFor={`${headingId}-kelas`} className="mb-1.5 block text-sm font-medium text-slate-700">Kelas <span className="text-red-500">*</span></label>
              <select id={`${headingId}-kelas`} value={kelasId} onChange={(event) => { setKelasId(event.target.value); setError(""); }}
                required disabled={memuatOpsi || sibuk} autoFocus className={inputCls}>
                <option value="">{memuatOpsi ? "Memuat kelas..." : "Pilih kelas"}</option>
                {kelasEditHilang && <option value={edit.kelas_id}>{edit.kelas} — data kelas tidak tersedia</option>}
                {kelasTersedia.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>{kelas.nama_kelas}{kelas.materi ? ` — ${kelas.materi}` : ""}{kelas.blc ? ` — ${kelas.blc}` : ""}</option>
                ))}
              </select>
              {!memuatOpsi && !errorOpsi && kelasTersedia.length === 0 && !edit && <p className="mt-1.5 text-sm text-slate-500">Semua kelas yang tersedia sudah memiliki jadwal pada ujian ini.</p>}
              {errorOpsi && <p className="mt-1.5 text-sm text-red-600">Pilihan kelas gagal dimuat. <button type="button" onClick={onMuatOpsi} className="font-medium underline">Coba lagi</button></p>}
            </div>

            {kelasTerpilih && (
              <div className="flex flex-wrap gap-2 rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2.5 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5"><Users size={14} className="text-orange-500" /> {kelasTerpilih.jumlah_peserta.toLocaleString("id-ID")} peserta terdaftar</span>
                <span>Materi: {kelasTerpilih.materi ?? "Belum diatur"}</span>
                <span>BLC: {kelasTerpilih.blc ?? "Belum diatur"}</span>
              </div>
            )}
            {materiBerbeda && (
              <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
                <AlertTriangle size={17} className="mt-0.5 shrink-0" /> Materi kelas berbeda dari materi ujian. Pastikan pemilihan kelas sudah sesuai.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${headingId}-mulai`} className="mb-1.5 block text-sm font-medium text-slate-700">Mulai (WIB) <span className="text-red-500">*</span></label>
                <input id={`${headingId}-mulai`} type="datetime-local" value={mulai} onChange={(event) => { setMulai(event.target.value); setError(""); }} required disabled={sibuk} className={inputCls} />
              </div>
              <div>
                <label htmlFor={`${headingId}-selesai`} className="mb-1.5 block text-sm font-medium text-slate-700">Selesai (WIB) <span className="text-red-500">*</span></label>
                <input id={`${headingId}-selesai`} type="datetime-local" value={selesai} onChange={(event) => { setSelesai(event.target.value); setError(""); }} required disabled={sibuk} className={inputCls} />
              </div>
            </div>
            {mulai && selesai && new Date(selesai).getTime() <= new Date(mulai).getTime() && <p className="text-sm text-red-600">Waktu selesai harus setelah waktu mulai.</p>}

            <div>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={`${headingId}-token`} className="text-sm font-medium text-slate-700">Token baru <span className="font-normal text-slate-400">(opsional)</span></label>
                {edit && <TokenUjian token={edit.token} />}
              </div>
              <div className="flex gap-2">
                <input id={`${headingId}-token`} type="text" value={token} onChange={(event) => setToken(event.target.value.toUpperCase())}
                  maxLength={6} pattern="[A-Za-z0-9]{6}" title="Token terdiri dari 6 huruf atau angka" autoComplete="off" placeholder={edit ? "Kosongkan untuk mempertahankan token" : "Otomatis dibuat jika dikosongkan"} disabled={sibuk}
                  className={`${inputCls} font-mono uppercase tracking-wider`} />
                <button type="button" onClick={() => setToken(buatToken())} disabled={sibuk} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-orange-200 px-3 text-sm font-medium text-orange-700 transition hover:bg-orange-50 disabled:opacity-40">
                  <RefreshCw size={15} /> <span className="hidden sm:inline">Buat acak</span>
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">{edit ? "Isi token baru untuk mengganti token yang sedang digunakan." : "Token dibuat otomatis oleh sistem jika kolom ini dikosongkan."}</p>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-orange-100 pt-4">
              <button type="button" onClick={onTutup} disabled={sibuk} className="rounded-xl border border-orange-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-orange-50 disabled:opacity-40">Batal</button>
              <button type="submit" disabled={sibuk || memuatOpsi || !!errorOpsi || (!edit && kelasTersedia.length === 0)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-300/50 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">
                <CalendarClock size={16} /> {menyimpan ? "Menyimpan..." : edit ? "Simpan perubahan" : "Simpan jadwal"}
              </button>
            </div>
          </form>
        </section>

        <section aria-labelledby={`${headingId}-daftar`} className="border-t border-orange-100 pt-5">
          <h3 id={`${headingId}-daftar`} className="mb-3 font-semibold text-slate-900">Jadwal tersimpan <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs tabular-nums text-orange-700">{jadwal.length}</span></h3>
          {jadwal.length === 0 ? (
            <p className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-6 text-center text-sm text-slate-500">Belum ada kelas yang dijadwalkan untuk ujian ini.</p>
          ) : (
            <ul className="space-y-3">
              {jadwal.map((item) => {
                const kelas = opsi.kelas.find((pilihan) => pilihan.id === item.kelas_id);
                return (
                  <li key={item.id} className="rounded-xl border border-orange-100 bg-orange-50/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{item.kelas}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600"><Clock size={14} className="text-orange-500" /> {formatTanggal(item.mulai)} — {formatTanggal(item.selesai)}</p>
                        <p className="mt-1 text-xs text-slate-500">{kelas ? `${kelas.jumlah_peserta.toLocaleString("id-ID")} peserta terdaftar` : "Jumlah peserta tidak tersedia"}{kelas?.blc ? ` · ${kelas.blc}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => salinToken(item)} disabled={sibuk} aria-label={`Salin token kelas ${item.kelas}`} title="Salin token"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-100 hover:text-orange-700 disabled:opacity-40">{disalin === item.id ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}</button>
                        <button type="button" onClick={() => pilihEdit(item)} disabled={sibuk} aria-label={`Ubah jadwal kelas ${item.kelas}`} title="Ubah jadwal"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40"><Pencil size={16} /></button>
                        <button type="button" onClick={() => void hapus(item)} disabled={sibuk} aria-label={`Hapus jadwal kelas ${item.kelas}`} title="Hapus jadwal"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Token</span><span className="rounded-md border border-orange-200 bg-white px-2 py-1 font-mono font-semibold tracking-wider text-orange-800">{item.token}</span>
                      {menghapusId === item.id && <span className="text-red-600">Menghapus...</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </dialog>
  );
}
