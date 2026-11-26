export type StatusTestimoni = "aktif" | "nonaktif";

export type Testimoni = {
  id: number;
  nama: string;
  isi: string;
  status: StatusTestimoni;
  author: string;
  modifiedAt: string;
};

export type FormTestimoni = {
  nama: string;
  isi: string;
  status: StatusTestimoni;
};

const API_BASE_URL = "/api/v1";

/**
 * Di database status-nya: pending | tampil | ditolak.
 * UI admin cuma punya dua pilihan (aktif/nonaktif), jadi dipetakan di sini:
 *   aktif    <-> tampil
 *   nonaktif <-> pending (ditolak juga dibaca sebagai nonaktif)
 */
function statusKeApi(status: StatusTestimoni): "tampil" | "pending" {
  return status === "aktif" ? "tampil" : "pending";
}

function statusDariApi(status?: string): StatusTestimoni {
  return status === "tampil" || status === "aktif" ? "aktif" : "nonaktif";
}

function beritahuBerubah() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("testimoni-berubah"));
  }
}

/** Panggil API dan lempar Error dengan pesan yang jelas kalau gagal. */
async function panggilApi(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    let pesan = `Server membalas status ${res.status}.`;
    try {
      const json = await res.json();
      if (json?.errors) {
        pesan = (Object.values(json.errors) as string[][]).flat().join(" ");
      } else if (json?.message) {
        pesan = json.message;
      }
    } catch {
      // body bukan JSON, pakai pesan default
    }
    throw new Error(pesan);
  }

  return res.json().catch(() => null);
}

type ItemApi = {
  id: number;
  nama: string;
  isiTestimoni?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function ambilTestimoni(): Promise<Testimoni[]> {
  try {
    const json = await panggilApi("/testimoni", { method: "GET" });
    const raw: ItemApi[] = json?.data ?? [];

    return raw.map((item) => ({
      id: item.id,
      nama: item.nama,
      isi: item.isiTestimoni ?? "",
      status: statusDariApi(item.status),
      author: "Super Admin",
      modifiedAt:
        item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
    }));
  } catch (e) {
    console.error("Gagal mengambil testimoni dari API:", e);
    return [];
  }
}

export type HasilSimpan = { ok: true } | { ok: false; pesan: string };

export async function simpanTestimoni(
  form: FormTestimoni,
  id?: number
): Promise<HasilSimpan> {
  try {
    await panggilApi(id ? `/testimoni/${id}` : "/testimoni", {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify({
        nama: form.nama,
        isi_testimoni: form.isi,
        status: statusKeApi(form.status),
      }),
    });

    beritahuBerubah();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      pesan: e instanceof Error ? e.message : "Gagal menyimpan testimoni.",
    };
  }
}

export async function hapusTestimoni(id: number): Promise<HasilSimpan> {
  try {
    await panggilApi(`/testimoni/${id}`, { method: "DELETE" });
    beritahuBerubah();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      pesan: e instanceof Error ? e.message : "Gagal menghapus testimoni.",
    };
  }
}

export async function ubahStatusTestimoni(
  id: number,
  statusBaru: StatusTestimoni
): Promise<HasilSimpan> {
  try {
    await panggilApi(`/testimoni/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusKeApi(statusBaru) }),
    });
    beritahuBerubah();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      pesan: e instanceof Error ? e.message : "Gagal mengubah status.",
    };
  }
}
export const menuNavbar = [
  { label: "Beranda", id: "beranda", anak: false },
  { label: "Informasi", id: "informasi", anak: true },
  { label: "Artikel", id: "artikel", anak: false },
  { label: "Lokasi", id: "lokasi", anak: false },
  { label: "Testimoni", id: "testimoni", anak: false },
  { label: "Pengguna", id: "pengguna", anak: false },
];
