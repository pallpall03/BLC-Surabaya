"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, ClipboardList, Mars, Search, SearchX, UserCheck, UserMinus, UserPlus, Venus } from "lucide-react";
import HeaderHalaman from "../../components/headerhalaman";
import { CALON_PESERTA, jamSesi, KELAS_CONTOH, type CalonPeserta } from "../../data";

const kartu = "rounded-2xl border border-orange-200 bg-white shadow-xl shadow-orange-300/40";
const JK = ({ jk }: { jk: "L" | "P" }) =>
  jk === "L" ? <span className="inline-flex items-center gap-1 text-sky-600"><Mars size={15} /> L</span>
             : <span className="inline-flex items-center gap-1 text-pink-600"><Venus size={15} /> P</span>;

export default function PesertaKelasPage() {
  const { id } = useParams<{ id: string }>();
  // TODO: ambil kelas, calon peserta, dan peserta terdaftar dari API
  const kelas = KELAS_CONTOH.find((k) => k.id === Number(id));

  const [tersedia, setTersedia] = useState<CalonPeserta[]>(CALON_PESERTA);
  const [terdaftar, setTerdaftar] = useState<CalonPeserta[]>([]);
  const [dipilih, setDipilih] = useState<number[]>([]);
  const [cari, setCari] = useState("");
  const [area, setArea] = useState("");
  const [pesan, setPesan] = useState("");

  const daftarArea = useMemo(() => Array.from(new Set(CALON_PESERTA.map((p) => p.blc))).sort(), []);
  const tampil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return tersedia.filter((p) => (!q || p.nama.toLowerCase().includes(q) || p.nik.includes(q) || p.noDaftar.includes(q)) && (!area || p.blc === area));
  }, [tersedia, cari, area]);

  if (!kelas) return <main className="p-10 text-center text-slate-600">Kelas tidak ditemukan.</main>;

  const semua = tampil.length > 0 && tampil.every((p) => dipilih.includes(p.id));
  const toggle = (pid: number) => setDipilih((d) => (d.includes(pid) ? d.filter((x) => x !== pid) : [...d, pid]));
  const toggleSemua = () =>
    setDipilih((d) => (semua ? d.filter((i) => !tampil.some((p) => p.id === i)) : Array.from(new Set([...d, ...tampil.map((p) => p.id)]))));
  const toast = (t: string) => { setPesan(t); setTimeout(() => setPesan(""), 3000); };

  const daftarkan = () => {
    // TODO: kirim ke API, mis. POST /api/kelas/{id}/peserta dengan daftar id
    const pindah = tersedia.filter((p) => dipilih.includes(p.id));
    setTerdaftar((t) => [...t, ...pindah]);
    setTersedia((t) => t.filter((p) => !dipilih.includes(p.id)));
    setDipilih([]);
    toast(`${pindah.length} peserta didaftarkan.`);
  };
  const keluarkan = (p: CalonPeserta) => {
    // TODO: DELETE /api/kelas/{id}/peserta/{pesertaId}
    setTerdaftar((t) => t.filter((x) => x.id !== p.id));
    setTersedia((t) => [...t, p]);
    toast("Peserta dikeluarkan dari kelas.");
  };

  const th = "px-4 py-3 font-medium";
  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <HeaderHalaman icon={ClipboardList} judul="Pendaftaran peserta" kembali="/instruktur/daftar_kelas"
          deskripsi={
            <span className="flex flex-wrap items-center gap-2">
              Kelas <b>{kelas.nama}</b>
              {kelas.hari.map((h) => <span key={h} className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-medium">{h}</span>)}
              <span className="text-orange-100">Sesi {kelas.sesi} · {jamSesi(kelas.sesi)}</span>
            </span>
          } />

        {/* Belum terdaftar */}
        <section className={`${kartu} mb-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 p-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <UserPlus size={20} className="text-orange-500" /> Peserta belum terdaftar
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs text-orange-700">{tersedia.length}</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                <input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama, NIK, no. pendaftaran" aria-label="Cari peserta"
                  className="w-64 rounded-xl border border-orange-100 bg-orange-50/40 py-2 pl-9 pr-3 text-sm outline-none transition hover:border-orange-300 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-200/60" />
              </div>
              <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Filter area BLC"
                className="rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-200/60">
                <option value="">Semua area BLC</option>
                {daftarArea.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {tampil.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-slate-500">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500"><SearchX size={28} /></span>
              {tersedia.length === 0 ? "Semua peserta sudah didaftarkan." : "Tidak ada peserta yang cocok."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-orange-50 text-orange-900">
                  <tr>
                    <th className={`${th} w-12`}><input type="checkbox" checked={semua} onChange={toggleSemua} aria-label="Pilih semua" className="h-4 w-4 accent-orange-500" /></th>
                    <th className={th}>NIK</th><th className={th}>No. pendaftaran</th><th className={th}>Nama lengkap</th>
                    <th className={th}>L/P</th><th className={th}>Kategori</th><th className={th}>BLC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {tampil.map((p) => (
                    <tr key={p.id} onClick={() => toggle(p.id)} className={`cursor-pointer transition ${dipilih.includes(p.id) ? "bg-orange-50" : "hover:bg-orange-50/50"}`}>
                      <td className="px-4 py-3"><input type="checkbox" checked={dipilih.includes(p.id)} onChange={() => toggle(p.id)} onClick={(e) => e.stopPropagation()} aria-label={`Pilih ${p.nama}`} className="h-4 w-4 accent-orange-500" /></td>
                      <td className="px-4 py-3 tabular-nums text-slate-600">{p.nik}</td>
                      <td className="px-4 py-3 text-slate-600">{p.noDaftar}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{p.nama}</td>
                      <td className="px-4 py-3"><JK jk={p.jk} /></td>
                      <td className="px-4 py-3"><span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">{p.kategori}</span></td>
                      <td className="px-4 py-3 text-slate-700">{p.blc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sudah terdaftar */}
        <section className={kartu}>
          <div className="border-b border-orange-100 p-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <UserCheck size={20} className="text-emerald-600" /> Peserta terdaftar
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs text-emerald-700">{terdaftar.length}</span>
            </h2>
          </div>
          {terdaftar.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Belum ada peserta. Centang peserta di atas lalu klik &quot;Daftarkan&quot;.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-emerald-50 text-emerald-900">
                  <tr><th className={th}>NIK</th><th className={th}>No. pendaftaran</th><th className={th}>Nama lengkap</th><th className={th}>L/P</th><th className={th}>Kategori</th><th className={`${th} text-right`}>Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {terdaftar.map((p) => (
                    <tr key={p.id} className="transition hover:bg-emerald-50/40">
                      <td className="px-4 py-3 tabular-nums text-slate-600">{p.nik}</td>
                      <td className="px-4 py-3 text-slate-600">{p.noDaftar}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{p.nama}</td>
                      <td className="px-4 py-3"><JK jk={p.jk} /></td>
                      <td className="px-4 py-3"><span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">{p.kategori}</span></td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => keluarkan(p)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                          <UserMinus size={15} /> Keluarkan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {dipilih.length > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-2xl shadow-orange-300/50 backdrop-blur">
          <span className="text-sm text-slate-600"><b className="text-slate-900">{dipilih.length}</b> peserta dipilih</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDipilih([])} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Batal</button>
            <button type="button" onClick={daftarkan} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700">
              <CheckCircle2 size={17} /> Daftarkan
            </button>
          </div>
        </div>
      )}
      {pesan && <div role="status" className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{pesan}</div>}
    </main>
  );
}