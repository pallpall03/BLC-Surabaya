import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import PanelShell from "@/components/shared/PanelShell";

export default function LayoutOperator({ children }: { children: ReactNode }) {
  return (
    <AuthGuard role="operator">
      <PanelShell peran="operator">{children}</PanelShell>
    </AuthGuard>
  );
}