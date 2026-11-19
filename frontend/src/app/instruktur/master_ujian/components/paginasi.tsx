"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Bar paginasi di bawah tabel. `setPerPage` opsional (kalau kosong, pilihan jumlah baris disembunyikan).
export default function Paginasi({ page, setPage, jumlah, perPage, setPerPage, satuan = "data" }: {
  page: number;
  setPage: (n: number) => void;
  jumlah: number;
  perPage: number;
  setPerPage?: (n: number) => void;
  satuan?: string;
}) {
  const total = Math.max(1, Math.ceil(jumlah / perPage));
  const h = Math.min(page, total);
  const awal = (h - 1) * perPage;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 px-4 py-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        {setPerPage && (
          <>
            <span>Tampilkan</span>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} aria-label="Jumlah baris"
              className="rounded-lg border border-orange-200 bg-white px-2 py-1 outline-none focus:ring-4 focus:ring-orange-200/60">
              {[10, 25, 50].map((n) => <option key={n}>{n}</option>)}
            </select>
          </>
        )}
        <span>{jumlah === 0 ? 0 : awal + 1}–{Math.min(awal + perPage, jumlah)} dari {jumlah} {satuan}</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setPage(h - 1)} disabled={h <= 1} aria-label="Sebelumnya" className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
        <span className="tabular-nums">{h} / {total}</span>
        <button type="button" onClick={() => setPage(h + 1)} disabled={h >= total} aria-label="Berikutnya" className="rounded-lg border border-orange-200 p-1.5 hover:bg-orange-50 disabled:opacity-40"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
