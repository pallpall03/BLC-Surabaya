"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { MapPin } from "lucide-react";
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
  const [open, setOpen] = useState(aktif);
  const Icon = item.icon;

  return (
    <div className={`menu-item menu-accordion${open ? " show" : ""}${aktif ? " here" : ""}`}>
      <span className="menu-link" role="button" onClick={() => setOpen((v) => !v)}>
        <span className="menu-icon"><Icon size={18} /></span>
        <span className="menu-title">{item.title}</span>
        <span className="menu-arrow" />
      </span>
      <div className={`menu-sub menu-sub-accordion${open ? " show" : ""}`}>
        {item.children!.map((c) => (
          <div className="menu-item" key={c.href}>
            <Link
              href={c.href}
              className={`menu-link${isOn(pathname, c.href) ? " active" : ""}`}
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
  const close = () => setMobileOpen(false);

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
        style={isMobile ? { width: 225 } : undefined}
      >
        {/* Logo */}
        <div className="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
          <Link href="/instruktur" className="d-flex align-items-center">
            {/* d-flex dipindah ke dalam: d-flex !important bikin logo ini tidak bisa disembunyikan saat sidebar diminimize */}
            <span className="app-sidebar-logo-default">
              <span className="d-flex align-items-center gap-3">
                <span className="symbol symbol-35px">
                  <span className="symbol-label bg-primary text-white"><MapPin size={18} /></span>
                </span>
                <span className="d-flex flex-column lh-1">
                  <span className="text-gray-900 fw-bold fs-6">BLC Surabaya</span>
                  <span className="text-gray-500 fs-8 mt-1">Panel instruktur</span>
                </span>
              </span>
            </span>
            <span className="app-sidebar-logo-minimize symbol symbol-35px">
              <span className="symbol-label bg-primary text-white"><MapPin size={18} /></span>
            </span>
          </Link>

          <div
            id="kt_app_sidebar_toggle"
            className={`app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute top-50 start-100 translate-middle rotate${minimized ? " active" : ""}`}
            onClick={() => setMinimized((v) => !v)}
          >
            <span className="svg-icon svg-icon-2 rotate-180">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.5" d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z" fill="currentColor" />
                <path d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z" fill="currentColor" />
              </svg>
            </span>
          </div>
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