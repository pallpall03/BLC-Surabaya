// Klien auth tipis: frontend hanya memanggil endpoint backend, semua keputusan
// (role, redirect, aturan kunci akun, captcha) tetap di backend.
import { apiFetch } from './api';

export type Peran = { slug: string; name: string } | null;

export type AuthUser = {
  id: number;
  name: string;
  nik?: string | null;
  email?: string | null;
  role: Peran;
};

export type LoginResult = {
  token: string;
  token_type: string;
  expires_in: number;
  dashboard_url: string;
  user: AuthUser;
};

export type CaptchaChallenge = { id: string; image: string; refresh_in: number };

export type AksesDashboard = { allowed: true; redirect_to: string; user: AuthUser };

export type DaftarInput = {
  name: string;
  nik: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export class AuthError extends Error {
  readonly status: number;
  readonly data: Record<string, unknown>;

  constructor(message: string, status: number, data: Record<string, unknown>) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.data = data;
  }
}

function pesanDari(body: Record<string, unknown> | null, status: number): string {
  const galat = body?.errors as Record<string, string[]> | undefined;
  const pesanField = galat ? Object.values(galat).flat()[0] : undefined;
  return String(pesanField ?? body?.message ?? `Permintaan gagal (${status})`);
}

async function kirim<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, init);
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;

  if (!res.ok) {
    throw new AuthError(pesanDari(body, res.status), res.status, body ?? {});
  }

  return body as T;
}

export async function ambilCaptcha(): Promise<CaptchaChallenge> {
  const data = await kirim<{ captcha_id: string; image: string; refresh_in: number }>('/auth/captcha');
  return { id: data.captcha_id, image: data.image, refresh_in: data.refresh_in };
}

export async function masuk(input: {
  login: string;
  password: string;
  captchaId?: string;
  captcha?: string;
}): Promise<LoginResult> {
  return kirim<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      login: input.login,
      password: input.password,
      ...(input.captchaId && input.captcha
        ? { captcha_id: input.captchaId, captcha: input.captcha }
        : {}),
    }),
  });
}

export async function daftar(input: DaftarInput): Promise<LoginResult> {
  return kirim<LoginResult>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Backend memutuskan boleh/tidaknya path ini untuk role yang sedang login. */
export async function aksesDashboard(path: string): Promise<AksesDashboard> {
  const data = await kirim<AksesDashboard>(
    `/auth/akses-dashboard?path=${encodeURIComponent(path)}`,
  );
  simpanUserTampilan(data.user);
  return data;
}

/** Simpan salinan user hanya untuk tampilan (nama di topbar/laporan), bukan penentu akses. */
export function simpanUserTampilan(user: AuthUser): void {
  try {
    localStorage.removeItem('auth_token');
    localStorage.setItem('auth_user', JSON.stringify(user));
  } catch {
    // Penyimpanan browser tidak tersedia: tampilan memakai data dari API saja.
  }
}
