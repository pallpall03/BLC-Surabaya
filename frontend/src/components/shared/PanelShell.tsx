"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api";

const LABEL_ROLE: Record<string, string> = {
  operator: "Operator",
};

export default function PanelShell({
  peran,
  children,
}: {
  peran: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <Link href="/" className="font-semibold text-slate-900">
          BLC Surabaya
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{LABEL_ROLE[peran] ?? peran}</span>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6">{children}</main>
    </div>
  );
}
