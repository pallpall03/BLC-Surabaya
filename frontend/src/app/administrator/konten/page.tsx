"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Home, Info, Pencil, Phone, Plus, Save, Trash2, X } from "lucide-react";
import {
  ambilBeranda,
  ambilInformasi,
  ambilKontak,
  berandaAwal,
  hapusInformasi,
  kontakAwal,
  simpanBeranda,
  simpanInformasi,
  simpanKontak,
  type Beranda,
  type Informasi,
  type Kontak,
} from "./data";
import { ambilIkon, daftarIkon } from "./ikon";

type Bagian = "beranda" | "informasi" | "kontak";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";

export default function HalamanKonten() {
  const [bagian, setBagian] = useState<Bagian>("beranda");
  const [beranda, setBeranda] = useState<Beranda>(berandaAwal);
  const [kontak, setKontak] = useState<Kontak>(kontakAwal);
  const [daftar, setDaftar] = useState<Informasi[]>([]);
  const [memuat, setMemuat] = useState<boolean>(true);
  const [menyimpan, setMenyimpan] = useState<boolean>(false);
  const [pesan, setPesan] = useState("");
  const [galat, setGalat] = useState("");

  // modal informasi: null = tertutup, {} = tambah, {id} = ubah
  const [modal, setModal] = useState<{ id?: number } | null>(null);
  const [judul, setJudul] = useState("");
  const [ringkas, setRingkas] = useState("");
  const [ikon, setIkon] = useState("Info");
  const [urutan, setUrutan] = useState<number>(1);
  const [aktif, setAktif] = useState<boolean>(true);
  const [galatModal, setGalatModal] = useState("");

  useEffect(() => {
    Promise.all([ambilBeranda(), ambilInformasi(), ambilKontak()])
      .then(([b, i, k]) => {
        setBeranda(b);
        setDaftar(i);
        setKontak(k);
      })
      .finally(() => setMemuat(false));
  }, []);

  function kabari(teks: string) {
    setPesan(teks);
    setTimeout(() => setPesan(""), 3000);
  }

  function pindahBagian(b: Bagian) {
    setBagian(b);
    setGalat("");
  }

  // ---------- BERANDA ----------
  function ubahB<K extends keyof Beranda>(kolom: K, nilai: Beranda[K]) {
    setBeranda((b) => ({ ...b, [kolom]: nilai }));
  }

  function ubahStat(i: number, kolom: "angka" | "label", nilai: string) {
    setBeranda((b) => ({
      ...b,
      statistik: b.statistik.map((s, n) => (n === i ? { ...s, [kolom]: nilai } : s)),
    }));
  }

  function tambahStat() {
    setBeranda((b) =>
      b.statistik.length >= 4 ? b : { ...b, statistik: [...b.statistik, { angka: "", label: "" }] }
    );
  }

  function hapusStat(i: number) {
    setBeranda((b) => ({ ...b, statistik: b.statistik.filter((_, n) => n !== i) }));
  }

  async function handleSimpanBeranda() {
    if (!beranda.judul.trim() || !beranda.deskripsi.trim()) {
      return setGalat("Judul dan deskripsi wajib diisi.");
    }
    setGalat("");
    setMenyimpan(true);
    const bersih: Beranda = {
      ...beranda,
      statistik: beranda.statistik.filter((s) => s.angka.trim() || s.label.trim()),
    };
    await simpanBeranda(bersih);
    setBeranda(bersih);
    setMenyimpan(false);
    kabari("Konten beranda berhasil disimpan.");
  }

  // ---------- KONTAK ----------
  async function handleSimpanKontak() {
    if (!kontak.alamat.trim() && !kontak.telepon.trim() && !kontak.email.trim()) {
      return setGalat("Isi minimal satu kontak.");
    }
    setGalat("");
    setMenyimpan(true);
    await simpanKontak(kontak);
    setMenyimpan(false);
    kabari("Kontak berhasil disimpan.");
  }

  // ---------- INFORMASI ----------
  function bukaTambah() {
    setJudul("");
    setRingkas("");
    setIkon("Info");
    setUrutan(daftar.length + 1);
    setAktif(true);
    setGalatModal("");
    setModal({});
  }

  function bukaUbah(i: Informasi) {
    setJudul(i.judul);
    setRingkas(i.ringkas);
    setIkon(i.ikon);
    setUrutan(i.urutan);
    setAktif(i.aktif);
    setGalatModal("");
    setModal({ id: i.id });
  }

  async function handleSimpanInformasi() {
    const id = modal?.id;
    if (!judul.trim() || !ringkas.trim()) return setGalatModal("Judul dan ringkasan wajib diisi.");

    const hasil = await simpanInformasi({ judul: judul.trim(), ringkas: ringkas.trim(), ikon, urutan, aktif }, id);
    setDaftar((lama) => (id ? lama.map((i) => (i.id === id ? hasil : i)) : [...lama, hasil]));
    setModal(null);
  }

  async function handleHapus(i: Informasi) {
    if (!window.confirm(`Hapus informasi "${i.judul}"?`)) return;
    await hapusInformasi(i.id);
    setDaftar((lama) => lama.filter((x) => x.id !== i.id));
  }

  async function handleToggle(i: Informasi) {
    const baru = { ...i, aktif: !i.aktif };
    await simpanInformasi(baru, i.id);
    setDaftar((lama) => lama.map((x) => (x.id === i.id ? baru : x)));
  }

  const urut = [...daftar].sort((a, b) => a.urutan - b.urutan);

  const tombolSimpan = (onClick: () => void) => (
    <button
      onClick={onClick}
      disabled={menyimpan}
      className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
    >
      <Save size={16} /> {menyimpan ? "Menyimpan..." : "Simpan Perubahan"}
    </button>
  );

  return (
    <div className="space-y-5">
      {pesan && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={18} /> {pesan}
        </div>
      )}

      <section className="card rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* PILIH BAGIAN */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-6 pt-4">
          {[
            { kode: "beranda" as const, label: "Beranda", ikon: Home },
            { kode: "informasi" as const, label: "Informasi", ikon: Info },
            { kode: "kontak" as const, label: "Kontak", ikon: Phone },
          ].map((b) => {
            const Ikon = b.ikon;
            return (
              <button
                key={b.kode}
                onClick={() => pindahBagian(b.kode)}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-4 pb-3 text-sm transition ${
                  bagian === b.kode
                    ? "border-violet-600 font-semibold text-violet-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Ikon size={16} /> {b.label}
              </button>
            );
          })}
        </div>

        {memuat ? (
          <p className="py-12 text-center text-sm text-slate-400">Memuat data...</p>
        ) : bagian === "beranda" ? (
          <div className="space-y-5 p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Beranda</h3>
              <p className="text-sm text-slate-400">Bagian paling atas halaman website</p>
            </div>

            <div>
              <label className={labelClass}>Lencana kecil</label>
              <input value={beranda.lencana} onChange={(e) => ubahB("lencana", e.target.value)} className={inputClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Judul</label>
                <input value={beranda.judul} onChange={(e) => ubahB("judul", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  Kata sorot <span className="font-normal text-slate-400">(berwarna oranye)</span>
                </label>
                <input value={beranda.sorot} onChange={(e) => ubahB("sorot", e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Deskripsi</label>
              <textarea
                value={beranda.deskripsi}
                onChange={(e) => ubahB("deskripsi", e.target.value)}
                rows={3}
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Teks tombol utama</label>
                <input
                  value={beranda.tombolUtama}
                  onChange={(e) => ubahB("tombolUtama", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Teks tombol kedua</label>
                <input
                  value={beranda.tombolKedua}
                  onChange={(e) => ubahB("tombolKedua", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Statistik (maksimal 4)</p>
                <button
                  onClick={tambahStat}
                  disabled={beranda.statistik.length >= 4}
                  className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-40"
                >
                  <Plus size={14} /> Tambah
                </button>
              </div>
              <div className="space-y-2">
                {beranda.statistik.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={s.angka}
                      onChange={(e) => ubahStat(i, "angka", e.target.value)}
                      placeholder="12+"
                      className={`${inputClass} w-28 shrink-0`}
                    />
                    <input
                      value={s.label}
                      onChange={(e) => ubahStat(i, "label", e.target.value)}
                      placeholder="Lokasi BLC"
                      className={inputClass}
                    />
                    <button
                      onClick={() => hapusStat(i)}
                      aria-label="Hapus statistik"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {galat && <p className="text-sm text-red-600">{galat}</p>}
            <div className="flex justify-end border-t border-slate-100 pt-4">{tombolSimpan(handleSimpanBeranda)}</div>
          </div>
        ) : bagian === "informasi" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Informasi</h3>
                <p className="text-sm text-slate-400">Kartu informasi dan isi dropdown Informasi di navbar</p>
              </div>
              <button
                onClick={bukaTambah}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
              >
                <Plus size={16} /> Tambah Informasi
              </button>
            </div>

            {urut.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
                <Info size={36} />
                <p className="text-sm">Belum ada informasi.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {urut.map((i) => {
                  const Ikon = ambilIkon(i.ikon);
                  return (
                    <li
                      key={i.id}
                      className={`flex flex-wrap items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50 ${
                        i.aktif ? "" : "opacity-50"
                      }`}
                    >
                      <span className="w-6 text-sm text-slate-400">{i.urutan}</span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        <Ikon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800">{i.judul}</p>
                        <p className="truncate text-xs text-slate-400">{i.ringkas}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={i.aktif}
                        onClick={() => handleToggle(i)}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                          i.aktif ? "bg-violet-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                            i.aktif ? "left-[22px]" : "left-0.5"
                          }`}
                        />
                      </button>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => bukaUbah(i)}
                          className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                        >
                          <Pencil size={14} /> Ubah
                        </button>
                        <button
                          onClick={() => handleHapus(i)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <div className="space-y-5 p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Kontak</h3>
              <p className="text-sm text-slate-400">Ditampilkan di bagian Kontak website</p>
            </div>

            <div>
              <label className={labelClass}>Alamat</label>
              <input
                value={kontak.alamat}
                onChange={(e) => setKontak((k) => ({ ...k, alamat: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Telepon</label>
                <input
                  value={kontak.telepon}
                  onChange={(e) => setKontak((k) => ({ ...k, telepon: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={kontak.email}
                  onChange={(e) => setKontak((k) => ({ ...k, email: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Jam layanan</label>
              <input
                value={kontak.jam}
                onChange={(e) => setKontak((k) => ({ ...k, jam: e.target.value }))}
                className={inputClass}
              />
            </div>

            {galat && <p className="text-sm text-red-600">{galat}</p>}
            <div className="flex justify-end border-t border-slate-100 pt-4">{tombolSimpan(handleSimpanKontak)}</div>
          </div>
        )}
      </section>

      {/* MODAL INFORMASI */}
      {modal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="font-semibold text-slate-800">{modal.id ? "Ubah Informasi" : "Tambah Informasi"}</h4>
              <button
                onClick={() => setModal(null)}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className={labelClass}>Judul</label>
                <input value={judul} onChange={(e) => setJudul(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ringkasan</label>
                <textarea
                  value={ringkas}
                  onChange={(e) => setRingkas(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className={inputClass}
                />
                <p className="mt-1 text-right text-xs text-slate-400">{ringkas.length}/160</p>
              </div>
              <div>
                <label className={labelClass}>Urutan</label>
                <input
                  type="number"
                  min={1}
                  value={urutan}
                  onChange={(e) => setUrutan(Number(e.target.value) || 1)}
                  className={inputClass}
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Ikon</p>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(daftarIkon).map(([kode, IkonItem]) => (
                    <button
                      key={kode}
                      type="button"
                      title={kode}
                      onClick={() => setIkon(kode)}
                      className={`flex h-10 items-center justify-center rounded-lg border transition ${
                        ikon === kode
                          ? "border-violet-500 bg-violet-50 text-violet-600"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <IkonItem size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Tampil di website</p>
                  <p className="text-xs text-slate-400">Nonaktif berarti disembunyikan.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={aktif}
                  onClick={() => setAktif((a) => !a)}
                  className={`relative h-6 w-11 rounded-full transition ${aktif ? "bg-violet-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      aktif ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {galatModal && <p className="text-sm text-red-600">{galatModal}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSimpanInformasi}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}