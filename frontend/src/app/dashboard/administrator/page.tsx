import { Users, Newspaper, MapPin, BookOpen } from "lucide-react";
import StatCard from "@/components/admin/StatCard";

const ringkasan = [
  { id: 1, label: "Pengguna", ikon: Users },
  { id: 2, label: "Artikel", ikon: Newspaper },
  { id: 3, label: "Lokasi", ikon: MapPin },
  { id: 4, label: "Buku Tamu", ikon: BookOpen },
];

export default function DashboardAdministrator() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ringkasan.map((item) => (
          <StatCard key={item.id} label={item.label} nilai="-" ikon={item.ikon} />
        ))}
      </div>
    </div>
  );
}