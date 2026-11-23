import type { ReactNode } from "react";
import PanelShell from "@/components/shared/PanelShell";

export default function LayoutOperator({ children }: { children: ReactNode }) {
  return <PanelShell peran="operator">{children}</PanelShell>;
}