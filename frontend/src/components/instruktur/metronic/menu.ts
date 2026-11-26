import {
    Activity, ClipboardList, FileQuestion, FileText,
    GraduationCap, Megaphone, Users, UsersRound,
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
    { title: "Daftar peserta", href: "/instruktur/daftar_peserta", icon: Users },
    { title: "Daftar kelas", href: "/instruktur/daftar_kelas", icon: ClipboardList },
    {
      title: "Pelatihan",
      icon: GraduationCap,
      children: [
        { title: "Daftar hadir", href: "/instruktur/pelatihan/daftar_hadir" },
        { title: "Laporan", href: "/instruktur/pelatihan/laporan" },
      ],
    },
    {
      title: "Pengunjung",
      icon: UsersRound,
      children: [
        { title: "Pengunjung", href: "/instruktur/pengunjung/pengunjung" },
        { title: "Foto kegiatan", href: "/instruktur/pengunjung/foto_kegiatan" },
      ],
    },
    { title: "Sosialisasi", href: "/instruktur/sosialisasi", icon: Megaphone },
    { title: "Aktivitas", href: "/instruktur/aktivitas", icon: Activity },
    { title: "Laporan Instruktur", href: "/instruktur/laporan_instruktur", icon: FileText },
    { title: "Master ujian", href: "/instruktur/master_ujian", icon: FileQuestion },
  ];