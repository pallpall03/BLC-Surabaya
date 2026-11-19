"use client";

import { useState } from "react";
import { AlertCircle, Check, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Save } from "lucide-react";
import { Card, Field, inp } from "./elemenform";

// Kekuatan password: 0 sampai 4 (panjang, huruf besar+kecil, angka, simbol)
function kekuatan(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const LABEL = ["Lemah", "Lemah", "Cukup", "Kuat", "Sangat kuat"];
const WARNA = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];
const inpSandi = inp.replace("pr-3", "pr-11");

export default function FormPassword({ pesertaId, nama }: { pesertaId: string; nama: string }) {
  const [baru, setBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [lihat, setLihat] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sukses, setSukses] = useState(false);

  const skor = kekuatan(baru);
  const cocok = konfirmasi.length > 0 && baru === konfirmasi;
  const siap = baru.length >= 8 && baru === konfirmasi;

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (baru.length < 8) return setError("Password minimal 8 karakter.");
    if (baru !== konfirmasi) return setError("Konfirmasi password tidak sama.");
    setSaving(true);
    try {
      // TODO (backend): ubah password peserta, mis. PUT /peserta/{pesertaId}/password dengan { password, password_confirmation }
      void pesertaId;
      setBaru(""); setKonfirmasi(""); setError(""); setSukses(true);
      setTimeout(() => setSukses(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const tombolMata = (
    <button type="button" onClick={() => setLihat((v) => !v)} aria-label={lihat ? "Sembunyikan password" : "Tampilkan password"}
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600">
      {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <form onSubmit={simpan} noValidate autoComplete="off">
      <Card icon={KeyRound} tone="bg-rose-100 text-rose-600" title="Ubah password" desc={`Atur password baru untuk ${nama}. Dipisah dari data profil di atas.`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password baru" id="pw-baru" icon={Lock}>
            <input id="pw-baru" name="pw-baru" type={lihat ? "text" : "password"} autoComplete="new-password" className={inpSandi}
              placeholder="Minimal 8 karakter" value={baru} onChange={(e) => { setBaru(e.target.value); setError(""); }} />
            {tombolMata}
          </Field>
          <Field label="Konfirmasi password" id="pw-konfirmasi" icon={Lock}>
            <input id="pw-konfirmasi" name="pw-konfirmasi" type={lihat ? "text" : "password"} autoComplete="new-password" className={inpSandi}
              placeholder="Ketik ulang password baru" value={konfirmasi} onChange={(e) => { setKonfirmasi(e.target.value); setError(""); }} />
          </Field>
        </div>

        {/* Kekuatan password */}
        {baru && (
          <div className="mt-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full transition-all ${n <= skor ? WARNA[skor] : "bg-slate-200"}`} />)}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">Kekuatan: <b className="text-slate-700">{LABEL[skor]}</b> · gunakan huruf besar dan kecil, angka, dan simbol.</p>
          </div>
        )}
        {konfirmasi && (
          <p className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${cocok ? "text-emerald-600" : "text-red-600"}`}>
            {cocok ? <Check size={14} /> : <AlertCircle size={14} />} {cocok ? "Password cocok." : "Password belum sama."}
          </p>
        )}

        {error && <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={16} /> {error}</p>}
        {sukses && <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"><CheckCircle2 size={16} /> Password berhasil diubah.</p>}

        <div className="mt-5 flex justify-end border-t border-orange-100 pt-5">
          <button type="submit" disabled={saving || !siap}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-green-600/30 hover:bg-green-700 disabled:opacity-50 disabled:shadow-none">
            <Save size={18} /> {saving ? "Menyimpan..." : "Simpan password"}
          </button>
        </div>
      </Card>
    </form>
  );
}
