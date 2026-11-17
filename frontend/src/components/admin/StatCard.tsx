import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  nilai,
  ikon: Ikon,
}: {
  label: string;
  nilai: string;
  ikon: LucideIcon;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4">
      <span className="w-12 h-12 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
        <Ikon size={24} />
      </span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{nilai}</p>
      </div>
    </div>
  );
}