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
  );
}