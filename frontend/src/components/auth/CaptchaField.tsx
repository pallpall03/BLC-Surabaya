"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type NilaiCaptcha = { id: string; answer: string };

type Props = {
  onChange: (nilai: NilaiCaptcha) => void;
  /** Naikkan angka ini untuk memaksa captcha diganti (mis. setelah login gagal). */
  refreshKey?: number;
};

/**
 * Captcha gambar. Mengikuti sibunda.go.id: berganti otomatis setiap 60 detik
 * (jawaban dikosongkan), dan bisa diganti manual lewat tombol.
 */
export default function CaptchaField({ onChange, refreshKey = 0 }: Props) {
  const [id, setId] = useState("");
  const [gambar, setGambar] = useState("");
  const [sisa, setSisa] = useState(0);
  const [jawaban, setJawaban] = useState("");
  const [gagalMuat, setGagalMuat] = useState(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const muat = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/captcha", { cache: "no-store" });
      if (!res.ok) throw new Error("gagal");
      const data = await res.json();
      setId(data.captcha_id);
      setGambar(data.image);
      setSisa(data.expires_in ?? 60);
      setJawaban("");
      setGagalMuat(false);
    } catch {
      setGagalMuat(true);
    }
  }, []);

  // Muat saat pertama tampil dan setiap refreshKey berubah.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    muat();
  }, [muat, refreshKey]);

  // Hitung mundur 1 detik; habis → ganti otomatis.
  useEffect(() => {
    if (sisa <= 0) return;
    const t = setTimeout(() => {
      if (sisa <= 1) muat();
      else setSisa((s) => s - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [sisa, muat]);

  useEffect(() => {
    onChangeRef.current({ id, answer: jawaban });
  }, [id, jawaban]);

  return (
    <div className="fv-row mb-8">
      <div className="d-flex align-items-center gap-3 mb-3">
        {gambar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gambar} alt="Kode captcha" width={190} height={64} className="rounded border" />
        ) : (
          <div className="rounded border d-flex flex-center text-gray-500 fs-8" style={{ width: 190, height: 64 }}>
            {gagalMuat ? "Gagal memuat" : "Memuat..."}
          </div>
        )}
        <button
          type="button"
          onClick={muat}
          className="btn btn-icon btn-light-primary btn-sm"
          title="Ganti captcha"
          aria-label="Ganti captcha"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      <input
        type="text"
        name="captcha_answer"
        value={jawaban}
        onChange={(e) => setJawaban(e.target.value.toUpperCase())}
        placeholder="Ketik kode pada gambar"
        autoComplete="off"
        maxLength={10}
        required
        className="form-control bg-transparent"
      />
      <div className="text-muted fs-8 mt-2">
        Captcha berganti otomatis dalam {sisa} detik.
      </div>
    </div>
  );
}
