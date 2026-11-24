"use client";

import { useCallback, useEffect, useState } from "react";

type Akun = { id: number; name: string; nik: string; role: string | null; locked_at: string | null };

/** Halaman admin: daftar akun yang terkunci (salah password > 2 kali) dan tombol buka kunci. */
export default function AkunTerkunciPage() {
  const [akun, setAkun] = useState<Akun[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [pesan, setPesan] = useState("");

  const header = useCallback(
    (): HeadersInit => ({
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth_token") ?? ""}`,
    }),
    [],
  );

  const muat = useCallback(async () => {
    setMemuat(true);
    try {
      const res = await fetch("/api/v1/auth/terkunci", { headers: header(), cache: "no-store" });
      if (!res.ok) throw new Error();
      setAkun((await res.json()).data ?? []);
    } catch {
      setPesan("Gagal memuat daftar akun terkunci.");
    } finally {
      setMemuat(false);
    }
  }, [header]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    muat();
  }, [muat]);

  async function buka(a: Akun) {
    if (!confirm(`Buka kunci akun ${a.name}?`)) return;
    const res = await fetch(`/api/v1/auth/terkunci/${a.id}/buka`, { method: "POST", headers: header() });
    const data = await res.json().catch(() => ({}));
    setPesan(data.message ?? (res.ok ? "Kunci dibuka." : "Gagal membuka kunci."));
    if (res.ok) muat();
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title fw-bold">Akun Terkunci</h3>
      </div>
      <div className="card-body">
        {pesan && <div className="alert alert-info py-3 mb-6">{pesan}</div>}
        <div className="table-responsive">
          <table className="table table-row-bordered align-middle gs-0 gy-3">
            <thead>
              <tr className="fw-bold text-muted">
                <th>Nama</th>
                <th>NIK</th>
                <th>Role</th>
                <th>Terkunci pada</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memuat ? (
                <tr><td colSpan={5} className="text-center text-muted py-8">Memuat...</td></tr>
              ) : akun.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted py-8">Tidak ada akun yang terkunci.</td></tr>
              ) : (
                akun.map((a) => (
                  <tr key={a.id}>
                    <td className="fw-semibold">{a.name}</td>
                    <td>{a.nik}</td>
                    <td>{a.role ?? "-"}</td>
                    <td>{a.locked_at ? new Date(a.locked_at).toLocaleString("id-ID") : "-"}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-light-primary" onClick={() => buka(a)}>
                        Buka kunci
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
