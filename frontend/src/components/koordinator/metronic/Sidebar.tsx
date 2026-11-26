"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronsLeft, X } from "lucide-react";
import { menuKoordinator, type MenuItem } from "./menu";
import { useShell } from "./shell-context";

const MOBILE_QUERY = "(max-width: 991.98px)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

function Group({ item, pathname, close }: { item: MenuItem; pathname: string; close: () => void }) {
  const [open, setOpen] = useState(true);
  const Icon = item.icon;
  const submenuId = `submenu-${item.title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`menu-item menu-accordion${open ? " show" : ""} here`}>
      <button
        type="button"
        className="menu-link w-100 border-0 bg-transparent text-start"
        aria-expanded={open}
        aria-controls={submenuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="menu-icon"><Icon size={18} /></span>
        <span className="menu-title">{item.title}</span>
        <span className="menu-arrow" />
      </button>
      <div id={submenuId} className={`menu-sub menu-sub-accordion${open ? " show" : ""}`}>
        {item.children?.map((child) => {
          const active = pathname === child.href || pathname.startsWith(`${child.href}/`);
          return (
            <div className="menu-item" key={child.href}>
              <Link
                href={child.href}
                className={`menu-link${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={close}
              >
                <span className="menu-bullet"><span className="bullet bullet-dot" /></span>
                <span className="menu-title">{child.title}</span>
              </Link>
            </div>
          );
        })}
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
    const element = document.getElementById("kt_app_body");
    if (!element) return;
    if (minimized) element.setAttribute("data-kt-app-sidebar-minimize", "on");
    else element.removeAttribute("data-kt-app-sidebar-minimize");
  }, [minimized]);

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

  const drawer = isMobile ? ` drawer drawer-start${mobileOpen ? " drawer-on" : ""}` : "";

  return (
    <>
      {isMobile && mobileOpen && <div className="drawer-overlay" onClick={close} />}
      <aside
        id="kt_app_sidebar"
        className={`app-sidebar flex-column${drawer}`}
        aria-label="Navigasi koordinator"
        style={isMobile ? { width: 270 } : undefined}
      >
        <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
          <Link href="/koordinator/master_data/materi" className="d-flex align-items-center">
            <span className="app-sidebar-logo-default">
              <span className="d-flex align-items-center gap-3">
                <span className="symbol symbol-35px">
                  <span className="symbol-label koordinator-brand-mark bg-primary text-white fw-extrabold">blc</span>
                </span>
                <span className="d-flex flex-column lh-1">
                  <span className="koordinator-sidebar-title text-blue-700 fw-bold fs-6">BLC Surabaya</span>
                  <span className="koordinator-sidebar-subtitle text-blue-500 fs-8 mt-1">Panel koordinator</span>
                </span>
              </span>
            </span>
            <span className="app-sidebar-logo-minimize symbol symbol-35px">
              <span className="symbol-label koordinator-brand-mark bg-primary text-white fw-extrabold">blc</span>
            </span>
          </Link>

          <button
            ref={closeButton}
            type="button"
            aria-label="Tutup menu"
            onClick={close}
            className="koordinator-sidebar-close btn btn-icon btn-sm btn-light d-lg-none ms-auto"
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
            onClick={() => setMinimized((value) => !value)}
          >
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
          <div id="kt_app_sidebar_menu_wrapper" className="app-sidebar-wrapper hover-scroll-overlay-y my-5">
            <div className="menu menu-column menu-rounded menu-sub-indention px-3" id="kt_app_sidebar_menu">
              <div className="menu-item pt-2">
                <div className="menu-content">
                  <span className="menu-heading fw-bold text-uppercase fs-7">Menu</span>
                </div>
              </div>
              {menuKoordinator.map((item) => (
                <Group key={item.title} item={item} pathname={pathname} close={close} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
