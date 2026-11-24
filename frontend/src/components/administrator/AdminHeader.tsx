import { Menu } from "lucide-react";

export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b flex items-center justify-between px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded hover:bg-gray-100"
        aria-label="Buka menu"
      >
        <Menu size={22} />
      </button>

      <p className="hidden lg:block text-sm text-gray-500">Panel Administrator</p>

      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-600">Akun Admin</span>
        <span className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center">
          A
        </span>
      </div>
    </header>
  );
}