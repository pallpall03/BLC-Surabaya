import type { ReactNode } from "react";
import DashboardGuard from "@/components/auth/DashboardGuard";
import PanelShell from "@/components/shared/PanelShell";

export default function LayoutOperator({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard path="/operator">
      <PanelShell peran="operator">{children}</PanelShell>
    </DashboardGuard>
  );
}