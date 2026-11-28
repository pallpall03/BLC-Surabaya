import {
    ClipboardCheck, ClipboardList, FileQuestion,
    Megaphone, UsersRound,
    type LucideIcon,
  } from "lucide-react";
  
  export type MenuLeaf = { title: string; href: string };
  export type MenuItem = {
    title: string;
    icon: LucideIcon;
    href?: string;
    children?: MenuLeaf[];
  };
  
  export const menuInstruktur: MenuItem[] = [
    {
      title: "Absensi Peserta",
      icon: ClipboardCheck,
      children: [
        { title: "Daftar peserta", href: "/instruktur/daftar_peserta" },
        { title: "Daftar hadir", href: "/instruktur/pelatihan/daftar_hadir" },
        { title: "Laporan", href: "/instruktur/pelatihan/laporan" },
      ],
    },
    { title: "Daftar kelas", href: "/instruktur/daftar_kelas", icon: ClipboardList },
    {
      title: "Pengunjung",
      icon: UsersRound,
      children: [
        { title: "Daftar pengunjung", href: "/instruktur/pengunjung/pengunjung" },
        { title: "Foto kegiatan", href: "/instruktur/pengunjung/foto_kegiatan" },
        { title: "Aktivitas & Laporan", href: "/instruktur/laporan_instruktur" },
      ],
    },
    { title: "Sosialisasi", href: "/instruktur/sosialisasi", icon: Megaphone },
    { title: "Master ujian", href: "/instruktur/master_ujian", icon: FileQuestion },
  ];