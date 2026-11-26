<<<<<<< HEAD
import DashboardGuard from "@/components/auth/DashboardGuard";
import InstrukturShell from "@/components/instruktur/InstrukturShell";

export default function InstrukturLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard path="/instruktur">
      <InstrukturShell>{children}</InstrukturShell>
    </DashboardGuard>
=======
import MetronicShell from "@/components/instruktur/metronic/MetronicShell";
import "./instruktur.css";

export default function InstrukturLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700" />
      <link rel="stylesheet" href="/metronic/assets/plugins/global/plugins.bundle.css" />
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" />
      <link rel="stylesheet" href="/custom/orange.css" />
      <MetronicShell>{children}</MetronicShell>
    </>
>>>>>>> 8243e2e945cd328a787142c23a6d7858d8b15720
  );
}
