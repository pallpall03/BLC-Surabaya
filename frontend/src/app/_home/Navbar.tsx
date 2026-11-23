"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { idSection, menuNavbar } from "./data";
import { ambilInformasi, type Informasi } from "../administrator/konten/data";
import { ambilIkon } from "@/app/administrator/konten/ikon";

export default function Navbar() {
  const [aktif, setAktif] = useState<string>("beranda");
  const [mobile, setMobile] = useState<boolean>(false);
  const [infoBuka, setInfoBuka] = useState<boolean>(false);
  const [daftarInfo, setDaftarInfo] = useState<Informasi[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);

  function ke(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobile(false);
    setInfoBuka(false);
  }

  // isi dropdown Informasi diatur dari admin
  useEffect(() => {
    ambilInformasi().then((data) =>
      setDaftarInfo(data.filter((i) => i.aktif).sort((a, b) => a.urutan - b.urutan))
    );
  }, []);

  // tandai menu sesuai section yang sedang terlihat
  useEffect(() => {
    const pengamat = new IntersectionObserver(
      (entri) => {
        entri.forEach((e) => {
          if (e.isIntersecting) setAktif(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    idSection.forEach((id) => {
      const el = document.getElementById(id);
      if (el) pengamat.observe(el);
    });
    return () => pengamat.disconnect();
  }, []);

  // tutup dropdown kalau klik di luar
  useEffect(() => {
    function klikLuar(e: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setInfoBuka(false);
    }
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  const kelasMenu = (id: string) =>
    `rounded-full px-4 py-2 text-sm transition ${
      aktif === id
        ? "bg-orange-50 font-semibold text-orange-600"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="relative w-full max-w-4xl rounded-full border border-slate-200 bg-white/85 px-3 py-2 shadow-lg shadow-slate-200/60 backdrop-blur">
        <div className="flex items-center justify-between">
          <button onClick={() => ke("beranda")} className="flex items-center gap-2 pl-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-extrabold text-white">
              blc
            </span>
            <span className="font-bold tracking-tight text-slate-800">BLC Surabaya</span>
          </button>

          {/* MENU DESKTOP */}
          <div className="hidden items-center gap-1 md:flex">
            {menuNavbar.map((m) =>
              m.anak ? (
                <div key={m.label} className="relative" ref={infoRef}>
                  <button
                    onClick={() => setInfoBuka((b) => !b)}
                    className={`flex items-center gap-1 ${kelasMenu(m.id)}`}
                  >
                    {m.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${infoBuka ? "rotate-180" : ""}`}
                    />
                  </button>
                  {infoBuka && (
                    <div className="absolute left-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
                      {daftarInfo.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-slate-400">Belum ada informasi.</p>
                      ) : (
                        daftarInfo.map((item) => {
                          const Ikon = ambilIkon(item.ikon);
                          return (
                            <button
                              key={item.id}
                              onClick={() => ke(`info-${item.id}`)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Ikon size={16} /> {item.judul}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button key={m.label} onClick={() => ke(m.id)} className={kelasMenu(m.id)}>
                  {m.label}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setMobile((b) => !b)}
            aria-label="Buka menu"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MENU HP */}
        {mobile && (
          <div className="mt-2 space-y-1 border-t border-slate-100 px-2 pb-2 pt-3 md:hidden">
            {menuNavbar.map((m) => (
              <button
                key={m.label}
                onClick={() => ke(m.id)}
                className={`block w-full text-left ${kelasMenu(m.id)}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}