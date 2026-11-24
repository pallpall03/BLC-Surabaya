import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Role-to-path mapping for protected routes
const ROLE_PATHS: Record<string, string[]> = {
  instruktur: ['/instruktur'],
  koordinator: ['/koordinator'],
  operator: ['/operator'],
  superadmin: ['/administrator'],
};

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/register', '/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/captcha', '/ping'];

// Get JWT secret from environment
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

async function verifyToken(token: string): Promise<{ role?: { slug: string } } | null> {
  if (!JWT_SECRET.length) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as { role?: { slug: string } };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get token from cookie (set by login API)
  const token = request.cookies.get('auth_token')?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT token
  const payload = await verifyToken(token);
  if (!payload) {
    // Invalid or expired token, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
    return response;
  }

  // Check role-based access for protected routes
  const userRole = payload.role?.slug;
  if (userRole && ROLE_PATHS[userRole]) {
    const allowedPaths = ROLE_PATHS[userRole];
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));
    if (!isAllowed) {
      // Redirect to appropriate dashboard for role
      const loginUrl = new URL(allowedPaths[0], request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
