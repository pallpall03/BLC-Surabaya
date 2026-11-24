"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionWrap from "./SectionWrap";
import { ambilFaq, type Faq as ItemFaq } from "../administrator/faq/data";

export default function Faq() {
  const [daftar, setDaftar] = useState<ItemFaq[]>([]);

  useEffect(() => {
    ambilFaq().then((data) =>
      setDaftar(data.filter((f) => f.aktif).sort((a, b) => a.urutan - b.urutan))
    );
  }, []);

  return (
    <SectionWrap id="faq" judul="Tanya Jawab" deskripsi="Pertanyaan yang sering diajukan tentang BLC Surabaya.">
      {daftar.length === 0 ? (
        <p className="text-center text-sm text-slate-400">Belum ada pertanyaan.</p>
      ) : (
        <div className="mx-auto max-w-3xl space-y-3">
          {daftar.map((f) => (
            <details
              key={f.id}
              className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
                {f.pertanyaan}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm text-slate-500">{f.jawaban}</p>
            </details>
          ))}
        </div>
      )}
    </SectionWrap>
  );
}