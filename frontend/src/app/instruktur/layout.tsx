import AuthGuard from "@/components/auth/AuthGuard";
import InstrukturShell from "@/components/instruktur/InstrukturShell";

export default function InstrukturLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="instruktur">
      <InstrukturShell>{children}</InstrukturShell>
    </AuthGuard>
  );
}