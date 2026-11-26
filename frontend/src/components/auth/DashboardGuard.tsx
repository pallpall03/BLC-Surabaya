'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { aksesDashboard, AuthError } from '@/lib/auth';
import { refreshSession } from '@/lib/api';

/**
 * Penjaga halaman dashboard. Frontend tidak tahu aturan role: cukup tanya backend
 * lewat /auth/akses-dashboard lalu ikuti keputusannya (boleh, atau redirect_to).
 */
export default function DashboardGuard({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    let aktif = true;

    const alihkan = (galat: unknown) => {
      const data: Record<string, unknown> = galat instanceof AuthError ? galat.data : {};
      const tujuan = typeof data.redirect_to === 'string'
        && data.redirect_to.startsWith('/')
        && !data.redirect_to.startsWith('//')
        ? data.redirect_to
        : '/login';
      window.location.replace(tujuan);
    };

    (async () => {
      for (let percobaan = 0; percobaan < 2; percobaan += 1) {
        try {
          await aksesDashboard(path);
          if (aktif) setSiap(true);
          return;
        } catch (galat) {
          const bisaDiperbarui = galat instanceof AuthError
            && galat.status === 401
            && percobaan === 0
            && (await refreshSession());

          if (bisaDiperbarui) continue;

          alihkan(galat);
          return;
        }
      }
    })();

    return () => {
      aktif = false;
    };
  }, [path]);

  if (!siap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Memeriksa akses...
      </div>
    );
  }

  return <>{children}</>;
}
