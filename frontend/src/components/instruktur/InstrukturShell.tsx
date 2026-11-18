"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function InstrukturShell({ children }: { children: React.ReactNode }) {
  const [buka, setBuka] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50/60">
      <Sidebar buka={buka} tutup={() => setBuka(false)} />
      <div className="lg:pl-64 print:pl-0">
        <Topbar bukaMenu={() => setBuka(true)} />
        {children}
      </div>
    </div>
  );
}