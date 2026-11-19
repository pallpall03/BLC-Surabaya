import type { ReactNode } from "react";
import PanelShell from "@/components/panel/PanelShell";

export default function LayoutAdministrator({ children }: { children: ReactNode }) {
  return <PanelShell peran="administrator">{children}</PanelShell>;
}