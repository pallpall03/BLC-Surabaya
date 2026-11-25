"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ShellContext } from "./shell-context";

export default function MetronicShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ShellContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div
        id="kt_app_body"
        className="app-default d-flex flex-column min-vh-100"
        data-role="instruktur"
        data-kt-app-layout="light-sidebar"
        data-kt-app-header-fixed="true"
        data-kt-app-sidebar-enabled="true"
        data-kt-app-sidebar-fixed="true"
        data-kt-app-sidebar-push-header="true"
        data-kt-app-sidebar-push-toolbar="true"
        data-kt-app-sidebar-push-footer="true"
        data-kt-app-toolbar-enabled="true"
      >
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
          <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
            <Header />
            <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
              <Sidebar />
              <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                <div className="d-flex flex-column flex-column-fluid">
                  <div id="kt_app_content" className="app-content flex-column-fluid">
                    <div id="kt_app_content_container" className="app-container container-fluid">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}