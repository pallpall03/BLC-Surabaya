import {
  Users,
  HandHeart,
  BadgeCheck,
  GraduationCap,
  ClipboardList,
  HelpCircle,
  BookOpen,
  Info,
  ShieldCheck,
  Clock,
  Mail,
  MapPin,
  Phone,
  Layers,
  Circle,
  type LucideIcon,
} from "lucide-react";

// Ikon yang bisa dipilih untuk kartu Informasi. Menambah ikon cukup menambah satu nama di sini.
export const daftarIkon: Record<string, LucideIcon> = {
  Users,
  HandHeart,
  BadgeCheck,
  GraduationCap,
  ClipboardList,
  HelpCircle,
  BookOpen,
  Info,
  ShieldCheck,
  Clock,
  Mail,
  MapPin,
  Phone,
  Layers,
};

export function ambilIkon(nama: string): LucideIcon {
  return daftarIkon[nama] ?? Circle;
}