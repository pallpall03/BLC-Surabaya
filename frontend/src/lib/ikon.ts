import {
  Home,
  Database,
  Monitor,
  Users,
  UsersRound,
  UserCog,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Images,
  Info,
  Newspaper,
  MapPin,
  Mail,
  ShieldCheck,
  Tags,
  Layers,
  List,
  KeyRound,
  Circle,
  type LucideIcon,
} from "lucide-react";

export const daftarIkon: Record<string, LucideIcon> = {
  Home,
  Database,
  Monitor,
  Users,
  UsersRound,
  UserCog,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Images,
  Info,
  Newspaper,
  MapPin,
  Mail,
  ShieldCheck,
  Tags,
  Layers,
  List,
  KeyRound,
};

export function ambilIkon(nama: string): LucideIcon {
  return daftarIkon[nama] ?? Circle;
}