"use client";

import { useEffect, useState, type ReactNode } from "react";
import "./metronic-admin.css";
import AuthGuard from "@/components/auth/AuthGuard";
import PanelShell from "./components/PanelShell";
import type { KonfigPeran } from "./components/tipe";
import { konfigAdministrator, susunMenu } from "./menu-peran";
import { ambilMenu, EVENT_MENU } from "./menu/data";

// atribut body yang dibutuhkan layout Metronic (Demo 1, sidebar gelap)
const ATRIBUT_BODY: Record<string, string> = {
  "data-kt-app-layout": "dark-sidebar",
  "data-kt-app-header-fixed": "true",
  "data-kt-app-sidebar-enabled": "true",
  "data-kt-app-sidebar-fixed": "true",
  "data-kt-app-sidebar-push-header": "true",
  "data-kt-app-sidebar-push-toolbar": "true",
  "data-kt-app-sidebar-push-footer": "true",
  "data-kt-app-toolbar-enabled": "true",
};

export default function LayoutAdministrator({ children }: { children: ReactNode }) {
  const [konfig, setKonfig] = useState<KonfigPeran>(konfigAdministrator);

  // pasang atribut Metronic di <body>, lepas lagi saat keluar dari halaman administrator
  useEffect(() => {
    const body = document.body;
    Object.entries(ATRIBUT_BODY).forEach(([k, v]) => body.setAttribute(k, v));
    body.classList.add("app-default");
    return () => {
      Object.keys(ATRIBUT_BODY).forEach((k) => body.removeAttribute(k));
      body.classList.remove("app-default");
    };
  }, []);

  useEffect(() => {
    let batal = false;

    function muat() {
      ambilMenu().then((data) => {
        if (batal) return;
        const menu = susunMenu(data, "administrator");
        // kalau hasilnya kosong, tetap pakai menu bawaan
        if (menu.length > 0) setKonfig({ ...konfigAdministrator, menu });
      });
    }

    muat();
    window.addEventListener(EVENT_MENU, muat);
    return () => {
      batal = true;
      window.removeEventListener(EVENT_MENU, muat);
    };
  }, []);

  return (
    <AuthGuard role="superadmin">
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/metronic/assets/plugins/global/plugins.bundle.css" precedence="default" />
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" precedence="default" />
      <PanelShell konfig={konfig}>{children}</PanelShell>
    </AuthGuard>
  );
}
