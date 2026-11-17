"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 bg-gray-100 min-h-screen">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader onMenuClick={() => setOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}