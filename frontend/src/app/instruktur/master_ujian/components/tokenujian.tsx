"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

export const buatToken = () =>
  Array.from({ length: 5 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)]).join("");

// Badge token dengan tombol salin dan (opsional) buat token baru.
export default function TokenUjian({ token, onBuatUlang }: { token: string; onBuatUlang?: () => void }) {
  const [status, setStatus] = useState<"disalin" | "gagal" | null>(null);

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setStatus("disalin");
      setTimeout(() => setStatus(null), 1500);
    } catch {
      setStatus("gagal");
      setTimeout(() => setStatus(null), 2500);
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center rounded-lg border border-orange-200 bg-orange-50/60">
      <span className="px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-orange-800">{token}</span>
      <button type="button" onClick={salin} aria-label={`Salin token ${token}`} title="Salin"
        className="border-l border-orange-200 p-1.5 text-slate-500 hover:bg-orange-100 hover:text-orange-700">
        {status === "disalin" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      </button>
      {onBuatUlang && (
        <button type="button" onClick={onBuatUlang} aria-label="Buat token baru" title="Token baru"
          className="border-l border-orange-200 p-1.5 text-slate-500 hover:bg-orange-100 hover:text-orange-700"><RefreshCw size={14} /></button>
      )}
      {status && (
        <span role="status" className={`w-full px-2.5 pb-1 text-xs ${status === "gagal" ? "text-red-600" : "text-emerald-600"}`}>
          {status === "disalin" ? "Token disalin" : "Token gagal disalin"}
        </span>
      )}
    </div>
  );
}
