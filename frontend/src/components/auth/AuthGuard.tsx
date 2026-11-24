"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/api";

const DASHBOARD_ROLE: Record<string, string> = {
  superadmin: "/administrator",
  operator: "/operator",
  instruktur: "/instruktur",
};

type AuthUser = {
  role?: { slug?: string | null } | null;
};

export default function AuthGuard({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let aktif = true;

    async function periksa() {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch("/api/v1/auth/me", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          clearAuth();
          router.replace("/login");
          return;
        }

        if (!response.ok) throw new Error();

        const data = (await response.json()) as { user?: AuthUser };
        const roleUser = data.user?.role?.slug;

        if (roleUser !== role) {
          router.replace(DASHBOARD_ROLE[roleUser ?? ""] ?? "/");
          return;
        }

        if (aktif) setStatus("ready");
      } catch {
        if (aktif) setStatus("error");
      }
    }

    void periksa();

    return () => {
      aktif = false;
    };
  }, [role, router]);

  if (status === "ready") return <>{children}</>;

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      {status === "error"
        ? "Gagal memeriksa akses. Periksa koneksi lalu muat ulang halaman."
        : "Memeriksa akses dashboard..."}
    </div>
  );
}
