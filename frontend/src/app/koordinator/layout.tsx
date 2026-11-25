import MetronicShell from "@/components/koordinator/metronic/MetronicShell";
import "./koordinator-theme.css";

export default function KoordinatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
      <link rel="stylesheet" href="/metronic/assets/plugins/global/plugins.bundle.css" />
      <link rel="stylesheet" href="/metronic/assets/css/style.bundle.css" />
      <link rel="stylesheet" href="/custom/orange.css" />
      <MetronicShell>{children}</MetronicShell>
    </>
  );
}
