"use client";

import { useState } from "react";
import { LogOut, Menu, UserRound } from "lucide-react";
import { logout } from "@/lib/api";
import { useShell } from "./shell-context";

export default function Header() {
  const { mobileOpen, setMobileOpen } = useShell();
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <div id="kt_app_header" className="app-header">
      <div className="app-container container-fluid d-flex align-items-center justify-content-between" id="kt_app_header_container">
        <div className="d-flex align-items-center d-lg-none ms-n3 me-2">
          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            className="btn btn-icon btn-active-color-primary w-40px h-40px"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="d-flex flex-column justify-content-center flex-grow-1 min-w-0">
          <h2 className="text-dark fw-bold fs-3 my-0 text-truncate">Master Data Materi</h2>
          <span className="text-muted fs-7 mt-1 d-none d-sm-block">Panel Koordinator · BLC Surabaya</span>
        </div>

        <div className="d-flex align-items-center gap-2 ms-3">
          <span className="symbol symbol-38px" aria-hidden="true">
            <span className="symbol-label bg-light-primary text-primary fw-bold"><UserRound size={18} /></span>
          </span>
          <span className="d-none d-md-inline fw-semibold text-gray-700">Koordinator</span>
          <button
            type="button"
            className="btn btn-icon btn-light w-38px h-38px"
            aria-label="Keluar"
            title="Keluar"
            disabled={loggingOut}
            onClick={() => {
              setLoggingOut(true);
              void logout();
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
