"use client";

import { useEffect, type ReactNode } from "react";
import "./metronic-admin.css";
import DashboardGuard from "@/components/auth/DashboardGuard";
import AdministratorShell from "./components/AdministratorShell";

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
  // Pasang atribut Metronic di <body>, lepas lagi saat keluar dari halaman administrator.
  // Pemuatan menu ditangani AdministratorShell agar tidak menduplikasi state menu.
  useEffect(() => {
    const body = document.body;
    Object.entries(ATRIBUT_BODY).forEach(([k, v]) => body.setAttribute(k, v));
    body.classList.add("app-default");
    return () => {
      Object.keys(ATRIBUT_BODY).forEach((k) => body.removeAttribute(k));
      body.classList.remove("app-default");
    };
  }, []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/metronic/assets/plugins/global/plugins.bundle.css" precedence="default" />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" precedence="default" />
      <DashboardGuard path="/administrator">
        <AdministratorShell>{children}</AdministratorShell>
      </DashboardGuard>
    </>
  );
}
