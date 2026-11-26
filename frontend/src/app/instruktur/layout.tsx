import DashboardGuard from "@/components/auth/DashboardGuard";
import InstrukturShell from "@/components/instruktur/InstrukturShell";

export default function InstrukturLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard path="/instruktur">
      <InstrukturShell>{children}</InstrukturShell>
    </DashboardGuard>
  );
}
