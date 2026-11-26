"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronsLeft, X } from "lucide-react";
import { menuInstruktur, type MenuItem } from "./menu";
import { useShell } from "./shell-context";

const QUERY = "(max-width: 991.98px)";

function subscribe(cb: () => void) {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}

const isOn = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + "/");

function Group({ item, pathname, close }: { item: MenuItem; pathname: string; close: () => void }) {
  const aktif = item.children!.some((c) => isOn(pathname, c.href));
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const open = manualOpen ?? aktif;
  const Icon = item.icon;
  const submenuId = `submenu-${item.title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`menu-item menu-accordion${open ? " show" : ""}${aktif ? " here" : ""}`}>
      <button
        type="button"
        className="menu-link w-100 border-0 bg-transparent text-start"
        aria-expanded={open}
        aria-controls={submenuId}
        onClick={() => setManualOpen(!open)}
      >
        <span className="menu-icon"><Icon size={18} /></span>
        <span className="menu-title">{item.title}</span>
        <span className="menu-arrow" />
      </button>
      <div id={submenuId} className={`menu-sub menu-sub-accordion${open ? " show" : ""}`}>
        {item.children!.map((c) => (
          <div className="menu-item" key={c.href}>
            <Link
              href={c.href}
              className={`menu-link${isOn(pathname, c.href) ? " active" : ""}`}
              aria-current={isOn(pathname, c.href) ? "page" : undefined}
              onClick={close}
            >
              <span className="menu-bullet"><span className="bullet bullet-dot" /></span>
              <span className="menu-title">{c.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { mobileOpen, setMobileOpen } = useShell();
  const [minimized, setMinimized] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = () => setMobileOpen(false);

  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isMobile, mobileOpen, setMobileOpen]);

  useEffect(() => {
    const el = document.getElementById("kt_app_body");
    if (!el) return;
    if (minimized) el.setAttribute("data-kt-app-sidebar-minimize", "on");
    else el.removeAttribute("data-kt-app-sidebar-minimize");
  }, [minimized]);

  const drawer = isMobile ? ` drawer drawer-start${mobileOpen ? " drawer-on" : ""}` : "";

  return (
    <>
      {isMobile && mobileOpen && <div className="drawer-overlay" onClick={close} />}

      <div
        id="kt_app_sidebar"
        className={`app-sidebar flex-column${drawer}`}
        aria-label="Navigasi instruktur"
        style={isMobile ? { width: 270 } : undefined}
      >
        {/* Logo */}
        <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
          <Link href="/instruktur" className="d-flex align-items-center">
            {/* d-flex dipindah ke dalam: d-flex !important bikin logo ini tidak bisa disembunyikan saat sidebar diminimize */}
            <span className="app-sidebar-logo-default">
              <span className="d-flex align-items-center gap-3">
                <span className="symbol symbol-35px">
                  <span className="symbol-label instruktur-brand-mark bg-primary text-white text-sm font-extrabold lowercase tracking-tight">blc</span>
                </span>
                <span className="d-flex flex-column lh-1">
                  <span className="instruktur-sidebar-title text-orange-600 fw-bold fs-6">BLC Surabaya</span>
                  <span className="instruktur-sidebar-subtitle text-orange-500 fs-8 mt-1">Panel instruktur</span>
                </span>
              </span>
            </span>
            <span className="app-sidebar-logo-minimize symbol symbol-35px">
              <span className="symbol-label instruktur-brand-mark bg-primary text-white text-sm font-extrabold lowercase tracking-tight">blc</span>
            </span>
          </Link>

          <button
            ref={closeButton}
            type="button"
            aria-label="Tutup menu"
            onClick={close}
            className="instruktur-sidebar-close btn btn-icon btn-sm btn-light d-lg-none ms-auto"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            id="kt_app_sidebar_toggle"
            aria-label={minimized ? "Perluas sidebar" : "Perkecil sidebar"}
            aria-pressed={minimized}
            title={minimized ? "Perluas sidebar" : "Perkecil sidebar"}
            className={`app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute top-5 end-0 translate-x-1/2${minimized ? " active" : ""}`}
            onClick={() => setMinimized((v) => !v)}
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
          <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper hover-scroll-overlay-y my-5">
            <div className="menu menu-column menu-rounded menu-sub-indention px-3" id="kt_app_sidebar_menu">
              <div className="menu-item pt-2">
                <div className="menu-content">
                  <span className="menu-heading fw-bold text-uppercase fs-7">Menu</span>
                </div>
              </div>

              {menuInstruktur.map((item) => {
                if (item.children) {
                  return <Group key={item.title} item={item} pathname={pathname} close={close} />;
                }
                const Icon = item.icon;
                return (
                  <div className="menu-item" key={item.href}>
                    <Link
                      href={item.href!}
                      className={`menu-link${isOn(pathname, item.href!) ? " active" : ""}`}
                      aria-current={isOn(pathname, item.href!) ? "page" : undefined}
                      onClick={close}
                    >
                      <span className="menu-icon"><Icon size={18} /></span>
                      <span className="menu-title">{item.title}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}