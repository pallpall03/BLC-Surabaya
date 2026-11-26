import type { ReactNode } from "react";
import "./metronic-admin.css";
import DashboardGuard from "@/components/auth/DashboardGuard";
import AdministratorShell from "./components/AdministratorShell";

export default function LayoutAdministrator({ children }: { children: ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" precedence="default" />
      <DashboardGuard path="/administrator">
        <AdministratorShell>{children}</AdministratorShell>
      </DashboardGuard>
    </>
  );
}
