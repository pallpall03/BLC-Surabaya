import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js hanya menanyakan keputusan ke API gate Laravel. Token dan role tidak
// diperiksa di frontend; seluruh halaman dashboard tetap dirender oleh Next.js.
const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/, '');

export async function proxy(request: NextRequest) {
  const gateUrl = new URL('/api/v1/auth/dashboard-gate', BACKEND_URL);
  gateUrl.searchParams.set('path', request.nextUrl.pathname);

  const headers = new Headers({ Accept: 'application/json' });
  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  try {
    const response = await fetch(gateUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
      redirect: 'manual',
    });

    if (response.status === 204) {
      const allowed = NextResponse.next();
      allowed.headers.set('Cache-Control', 'no-store');
      return allowed;
    }
  } catch {
    // Backend tidak dapat dihubungi: jangan kirim HTML dashboard tanpa keputusan gate.
  }

  const redirect = NextResponse.redirect(new URL('/login', request.url));
  redirect.headers.set('Cache-Control', 'no-store');
  return redirect;
}

export const config = {
  matcher: [
    '/instruktur',
    '/instruktur/:path*',
    '/operator',
    '/operator/:path*',
    '/administrator',
    '/administrator/:path*',
  ],
};
