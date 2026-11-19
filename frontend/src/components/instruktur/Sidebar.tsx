"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, ChevronDown, ClipboardList, FileText, GraduationCap, LayoutDashboard, MapPin, Megaphone, Users, UsersRound, X,FileQuestion, 
  type LucideIcon,
} from "lucide-react";


function Item({ href, icon: Icon, label, aktif, onClick }: {
  href: string; icon: LucideIcon; label: string; aktif: boolean; onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${aktif ? "bg-orange-500 font-medium text-white shadow-md shadow-orange-300/50" : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"}`}>
      <Icon size={18} /> {label}
    </Link>
  );
}

function Grup({ icon: Icon, label, aktif, open, toggle, children }: {
  icon: LucideIcon; label: string; aktif: boolean; open: boolean; toggle: () => void; children: React.ReactNode;
}) {
  return (
    <div>
      <button type="button" onClick={toggle} aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${aktif ? "bg-orange-50 font-medium text-orange-700" : "text-slate-600 hover:bg-orange-50 hover:text-orange-700"}`}>
        <Icon size={18} /> <span className="flex-1 text-left">{label}</span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="ml-5 mt-1 space-y-0.5 border-l border-orange-100 pl-3">{children}</div>}
    </div>
  );
}

function Sub({ href, label, aktif, onClick }: { href: string; label: string; aktif: boolean; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick}
      className={`block rounded-lg px-3 py-2 text-sm transition ${aktif ? "bg-orange-500 font-medium text-white shadow-sm" : "text-slate-500 hover:bg-orange-50 hover:text-orange-700"}`}>
      {label}
    </Link>
  );
}

export default function Sidebar({ buka, tutup }: { buka: boolean; tutup: () => void }) {
  const pathname = usePathname();
  const on = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const adaPelatihan = on("/instruktur/pelatihan");
  const adaPengunjung = on("/instruktur/pengunjung");
  const [pelatihan, setPelatihan] = useState(adaPelatihan);
  const [pengunjung, setPengunjung] = useState(adaPengunjung);

  return (
    <>
      {/* Overlay (mobile) */}
      <div onClick={tutup}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition lg:hidden print:hidden ${buka ? "opacity-100" : "pointer-events-none opacity-0"}`} />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-orange-100 bg-white shadow-xl shadow-orange-200/40 transition-transform lg:translate-x-0 print:hidden ${buka ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-orange-100 px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-md shadow-orange-300/50">
              <MapPin size={18} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-slate-900">BLC Surabaya</span>
              <span className="block text-xs text-slate-500">Panel instruktur</span>
            </span>
          </Link>
          <button type="button" onClick={tutup} aria-label="Tutup menu" className="rounded-lg p-1.5 text-slate-400 hover:bg-orange-50 hover:text-orange-600 lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Menu (hardcode) */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-slate-400">Menu</p>


          <Item href="/instruktur/daftar_peserta" icon={Users} label="Daftar peserta" aktif={on("/instruktur/daftar_peserta")} onClick={tutup} />
          <Item href="/instruktur/daftar_kelas" icon={ClipboardList} label="Daftar kelas" aktif={on("/instruktur/daftar_kelas")} onClick={tutup} />

          <Grup icon={GraduationCap} label="Pelatihan" aktif={adaPelatihan} open={pelatihan} toggle={() => setPelatihan((v) => !v)}>
            <Sub href="/instruktur/pelatihan/daftar_hadir" label="Daftar hadir" aktif={on("/instruktur/pelatihan/daftar_hadir")} onClick={tutup} />
            <Sub href="/instruktur/pelatihan/laporan" label="Laporan" aktif={on("/instruktur/pelatihan/laporan")} onClick={tutup} />
          </Grup>

          <Grup icon={UsersRound} label="Pengunjung" aktif={adaPengunjung} open={pengunjung} toggle={() => setPengunjung((v) => !v)}>
            <Sub href="/instruktur/pengunjung/pengunjung" label="Pengunjung" aktif={on("/instruktur/pengunjung/pengunjung")} onClick={tutup} />
            <Sub href="/instruktur/pengunjung/foto_kegiatan" label="Foto kegiatan" aktif={on("/instruktur/pengunjung/foto_kegiatan")} onClick={tutup} />
          </Grup>

          <Item href="/instruktur/sosialisasi" icon={Megaphone} label="Sosialisasi" aktif={on("/instruktur/sosialisasi")} onClick={tutup} />

          <Item href="/instruktur/aktivitas" icon={Activity} label="Aktivitas" aktif={on("/instruktur/aktivitas")} onClick={tutup} />

          <Item href="/instruktur/laporan_instruktur" icon={FileText} label="Laporan Instruktur" aktif={on("/instruktur/laporan_instruktur")} onClick={tutup} />

          <Item href="/instruktur/master_ujian" icon={FileQuestion} label="Master ujian" aktif={on("/instruktur/master_ujian")} onClick={tutup} />
        </nav>
      </aside>
    </>
  );
}