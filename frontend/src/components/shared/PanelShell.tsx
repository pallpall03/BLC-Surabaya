"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PanelShell({ peran, children }: { peran: string; children: ReactNode }) {
  const pathname = usePathname();

  function aktif(href: string) {
    return pathname === `/${peran}` ? pathname.startsWith(`/${peran}`) : false;
  }

  return (
    <div className="admin-metronic app-root app-page flex min-h-screen flex-row bg-[#f5f8fa] text-slate-700" data-kt-app-layout="light-sidebar">
      {/* LATAR GELAP */}
      {peran === "operator" && (
        <div
          onClick={() => {}}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`app-sidebar admin-sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-[265px] flex-col bg-white transition-all duration-300 lg:sticky lg:top-0 -translate-x-full lg:translate-x-0`}
      >
        {/* logo */}
        <div className="app-sidebar-logo flex h-[70px] shrink-0 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="admin-brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-500 text-sm font-extrabold tracking-wide text-white">
              BLC
            </span>
            <p className="font-semibold tracking-tight text-slate-800">BLC Surabaya</p>
          </div>
          <button
            onClick={() => {}}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* menu */}
        <nav className="app-sidebar-menu menu menu-column menu-rounded menu-sub-indention menu-title-gray-700 menu-icon-gray-500 menu-arrow-gray-500 menu-hover-bg-light-primary flex-1 overflow-y-auto px-4 py-4">
          {[
            { label: "Beranda", href: `/${peran}`, ikon: {} as any },
            { label: "Testimoni", href: `/${peran}/testimoni`, ikon: {} as any },
            { label: "Lokasi", href: `/${peran}/lokasi`, ikon: {} as any },
          ].map((m) => {
            const Ikon = m.ikon;
            if (m.href) {
              return (
                <div className={`menu-item ${aktif(m.href) ? "here" : ""}`} key={m.label}>
                  <Link href={m.href} title={m.label} onClick={() => {}} aria-current={aktif(m.href) ? "page" : undefined} className={`menu-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition`}>
                    <span className="menu-icon flex w-5 shrink-0 justify-center">
                      <Ikon size={19} />
                    </span>
                    <span>{m.label}</span>
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </nav>
      </aside>

      {/* AREA KANAN */}
      <div className="app-wrapper flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <header className="app-header z-30 flex h-[70px] shrink-0 items-stretch justify-between bg-white px-4 sm:px-6">
          <div className="app-header-wrapper flex min-w-0 flex-1 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <button onClick={() => {}} aria-label="Buka menu" className="btn btn-icon btn-light-primary lg:hidden">
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => {}}
                aria-label="Ciutkan atau lebarkan sidebar"
                className="btn btn-icon btn-light-primary hidden lg:flex"
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <polyline points="3 12 5 12 21 12" />
                  <polyline points="3 18 5 18 21 18" />
                </svg>
              </button>
              <div className="relative hidden w-64 md:block">
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  aria-label="Cari"
                  placeholder="Search..."
                  className="form-control admin-header-search w-full pl-10"
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button aria-label="Notifikasi" className="btn btn-icon btn-light-primary relative">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="18" r="5" />
                  <line x1="13" y1="18" x2="3" y2="18" />
                  <line x1="3" y1="13" x2="13" y2="3" />
                </svg>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
              </button>
              <div className="relative">
                <button
                  aria-label="Menu profil"
                  className="symbol symbol-40px symbol-circle"
                >
                  <span className="symbol-label bg-orange-500 text-sm font-semibold text-white">A</span>
                </button>
                <div className="admin-profile-dropdown absolute right-0 mt-3 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white text-sm shadow-xl">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                    <span className="symbol symbol-40px symbol-circle">
                      <span className="symbol-label bg-orange-500 text-sm font-semibold text-white">A</span>
                    </span>
                    <div className="leading-tight">
                      <p className="font-semibold text-slate-800">Admin</p>
                      <p className="text-xs text-slate-400">Administrator</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-2">
                    <a href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-50">
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="10" x2="16" y2="10" />
                        <line x1="12" y1="10" x2="12" y2="4" />
                      </svg>
                      Keluar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ISI HALAMAN */}
        <main className="app-main flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="app-content flex flex-1 flex-col">
            <div className="app-container container-fluid w-full px-4 pb-10 sm:px-6">
              <div className="app-toolbar mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="page-title d-flex flex-column justify-content-center">
                  <h1 className="fs-2 fw-bold mb-1 text-slate-800">{peran === "operator" ? "Operator" : "Administrator"}</h1>
                  <nav aria-label="Breadcrumb" className="breadcrumb breadcrumb-separatorless fw-semibold fs-7">
                    <span className="text-muted">{peran === "operator" ? "Operator" : "Administrator"}</span>
                    <span aria-hidden="true" className="breadcrumb-separator text-gray-400">/</span>
                    <span className="text-gray-800">{peran === "operator" ? "Operator" : "Administrator"}</span>
                  </nav>
                </div>
              </div>
              <div className="admin-page-content">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}