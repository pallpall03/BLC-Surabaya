import { Database, type LucideIcon } from "lucide-react";

export type MenuLeaf = { title: string; href: string };
export type MenuItem = {
  title: string;
  icon: LucideIcon;
  href?: string;
  children?: MenuLeaf[];
};

export const menuKoordinator: MenuItem[] = [
  {
    title: "Master Data",
    icon: Database,
    children: [{ title: "Materi", href: "/koordinator/master_data/materi" }],
  },
];
