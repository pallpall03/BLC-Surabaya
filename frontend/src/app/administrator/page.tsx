"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  HelpCircle,
  MapPin,
  Newspaper,
  Users,
  UserCog,
  MessageSquareQuote,
  Settings,
} from "lucide-react";
import { ambilArtikel, type Artikel } from "./artikel/data";
import { ambilLokasi } from "./lokasi/data";
import { ambilFaq } from "./faq/data";
import { ambilUser } from "./user_manager/data";
import { ambilTestimoni } from "./testimoni/data";
import { ambilBukuTamu } from "./buku_tamu/data";

type Ringkasan = {
  artikel: number;
  lokasi: number;
  pengguna: number;
  faq: number;
};

type AktivitasBulanan = {
  kunci: string;
  label: string;
  artikel: number;
  pesan: number;
};

const JUMLAH_BULAN_GRAFIK = 12;

function kunciBulan(tanggal: string | null | undefined) {
  if (!tanggal) return null;
  const parsed = new Date(tanggal);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

function ringkasPerubahan(bulanIni: number, bulanLalu: number) {
  if (bulanLalu === 0) {
    return bulanIni === 0 ? "Sama dengan bulan lalu" : "Ada aktivitas baru";
  }

  const perubahan = Math.round(((bulanIni - bulanLalu) / bulanLalu) * 100);
  return `${perubahan > 0 ? "+" : ""}${perubahan}% dari bulan lalu`;
}

export default function HalamanBeranda() {
  const [ringkasan, setRingkasan] = useState<Ringkasan>({
    artikel: 0,
    lokasi: 0,
    pengguna: 0,
    faq: 0,
  });
  const [artikelTerbaru, setArtikelTerbaru] = useState<Artikel[]>([]);
  const [aktivitasBulanan, setAktivitasBulanan] = useState<AktivitasBulanan[]>([]);
  const [testimoniMenunggu, setTestimoniMenunggu] = useState(0);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let batal = false;

    async function muatDashboard() {
      try {
        const [artikel, lokasi, faq, pengguna, bukuTamu] = await Promise.all([
          ambilArtikel(),
          ambilLokasi(),
          ambilFaq(),
          ambilUser().catch(() => []),
          ambilBukuTamu(),
        ]);

        if (batal) return;

        const testimoni = ambilTestimoni();
        const daftarArtikel = Array.isArray(artikel) ? artikel : [];
        const daftarLokasi = Array.isArray(lokasi) ? lokasi : [];
        const daftarFaq = Array.isArray(faq) ? faq : [];
        const daftarPengguna = Array.isArray(pengguna) ? pengguna : [];
        const daftarBukuTamu = Array.isArray(bukuTamu) ? bukuTamu : [];

        setRingkasan({
          artikel: daftarArtikel.filter((item) => item.status === "aktif").length,
          lokasi: daftarLokasi.filter((item) => item.status === "aktif").length,
          pengguna: daftarPengguna.length,
          faq: daftarFaq.filter((item) => item.aktif).length,
        });
        setArtikelTerbaru(
          [...daftarArtikel]
            .sort((a, b) => b.diubah.localeCompare(a.diubah))
            .slice(0, 5)
        );
        const hariIni = new Date();
        const bulanGrafik: AktivitasBulanan[] = Array.from(
          { length: JUMLAH_BULAN_GRAFIK },
          (_, index) => {
            const bulan = new Date(
              hariIni.getFullYear(),
              hariIni.getMonth() - (JUMLAH_BULAN_GRAFIK - 1) + index,
              1
            );
            return {
              kunci: kunciBulan(bulan.toISOString()) ?? "",
              label: new Intl.DateTimeFormat("id-ID", {
                month: "short",
              }).format(bulan),
              artikel: 0,
              pesan: 0,
            };
          }
        );
        const indeksBulan = new Map(
          bulanGrafik.map((bulan, index) => [bulan.kunci, index])
        );

        for (const artikel of daftarArtikel) {
          if (artikel.status !== "aktif" || !artikel.dipublikasi) continue;
          const index = indeksBulan.get(kunciBulan(artikel.dipublikasi) ?? "");
          if (index !== undefined) bulanGrafik[index].artikel += 1;
        }

        for (const pesan of daftarBukuTamu) {
          const index = indeksBulan.get(kunciBulan(pesan.tanggal) ?? "");
          if (index !== undefined) bulanGrafik[index].pesan += 1;
        }

        setAktivitasBulanan(bulanGrafik);
        setTestimoniMenunggu(
          testimoni.filter((item) => item.status === "nonaktif").length
        );
      } finally {
        if (!batal) setMemuat(false);
      }
    }

    muatDashboard();
    return () => {
      batal = true;
    };
  }, []);

  const kartuRingkasan = [
    {
      label: "Artikel Aktif",
      nilai: ringkasan.artikel,
      ikon: Newspaper,
      warna: "text-primary bg-light-primary",
      href: "/administrator/artikel",
    },
    {
      label: "Lokasi Aktif",
      nilai: ringkasan.lokasi,
      ikon: MapPin,
      warna: "text-success bg-light-success",
      href: "/administrator/lokasi",
    },
    {
      label: "Pengguna",
      nilai: ringkasan.pengguna,
      ikon: Users,
      warna: "text-info bg-light-info",
      href: "/administrator/user_manager",
    },
    {
      label: "FAQ Aktif",
      nilai: ringkasan.faq,
      ikon: HelpCircle,
      warna: "text-warning bg-light-warning",
      href: "/administrator/faq",
    },
  ];

  const totalArtikel12Bulan = aktivitasBulanan.reduce(
    (total, bulan) => total + bulan.artikel,
    0
  );
  const totalPesan12Bulan = aktivitasBulanan.reduce(
    (total, bulan) => total + bulan.pesan,
    0
  );
  const bulanIni = aktivitasBulanan[aktivitasBulanan.length - 1];
  const bulanLalu = aktivitasBulanan[aktivitasBulanan.length - 2];
  const nilaiMaksimumGrafik = Math.max(
    4,
    Math.ceil(
      Math.max(
        0,
        ...aktivitasBulanan.flatMap((bulan) => [bulan.artikel, bulan.pesan])
      ) / 4
    ) * 4
  );
  const areaGrafik = { kiri: 56, atas: 24, lebar: 680, tinggi: 176 };
  const posisiX = (index: number) =>
    areaGrafik.kiri +
    (aktivitasBulanan.length > 1
      ? (areaGrafik.lebar / (aktivitasBulanan.length - 1)) * index
      : areaGrafik.lebar / 2);
  const posisiY = (nilai: number) =>
    areaGrafik.atas + areaGrafik.tinggi * (1 - nilai / nilaiMaksimumGrafik);
  const titikArtikel = aktivitasBulanan
    .map((bulan, index) => `${posisiX(index)},${posisiY(bulan.artikel)}`)
    .join(" ");
  const titikPesan = aktivitasBulanan
    .map((bulan, index) => `${posisiX(index)},${posisiY(bulan.pesan)}`)
    .join(" ");

  const pintasan = [
    {
      label: "Kelola Artikel",
      keterangan: "Tambah, ubah, dan publikasikan artikel",
      href: "/administrator/artikel",
      ikon: Newspaper,
    },
    {
      label: "Kelola Lokasi",
      keterangan: "Perbarui cabang dan layanan BLC",
      href: "/administrator/lokasi",
      ikon: Building2,
    },
    {
      label: "Manajemen User",
      keterangan: "Kelola akun dan hak akses",
      href: "/administrator/user_manager",
      ikon: UserCog,
    },
    {
      label: "Konten Website",
      keterangan: "Atur banner, statistik, dan konten",
      href: "/administrator/konten",
      ikon: Settings,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="card admin-welcome-card overflow-hidden">
        <div className="card-body relative flex items-center justify-between gap-6 p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <span className="badge badge-light-primary mb-3 px-3 py-2">
              Dashboard Administrator
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Selamat datang, Admin
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Pantau aktivitas dan kelola konten Website BLC Surabaya dari satu tempat.
            </p>
          </div>
          <Building2
            size={72}
            className="hidden shrink-0 text-primary opacity-20 sm:block"
          />
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Ringkasan dashboard"
      >
        {kartuRingkasan.map((kartu) => {
          const Ikon = kartu.ikon;
          return (
            <Link
              key={kartu.label}
              href={kartu.href}
              className="card group transition hover:-translate-y-0.5"
            >
              <div className="card-body flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {kartu.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {memuat ? "-" : kartu.nilai}
                  </p>
                </div>
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${kartu.warna}`}
                >
                  <Ikon size={23} />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="card" aria-labelledby="dashboard-chart-title">
        <div className="card-header flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 id="dashboard-chart-title" className="font-semibold text-gray-900">
              Aktivitas 12 Bulan Terakhir
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Artikel dipublikasikan dan pesan buku tamu yang masuk per bulan
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
              Artikel terbit
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              Pesan masuk
            </span>
          </div>
        </div>
        <div className="card-body px-4 pb-5 pt-3 sm:px-6">
          <svg
            className="h-auto w-full"
            viewBox="0 0 760 242"
            role="img"
            aria-label="Grafik aktivitas artikel terbit dan pesan buku tamu dalam dua belas bulan terakhir"
          >
            <title>Aktivitas administrator selama dua belas bulan</title>
            <desc>
              Grafik garis membandingkan jumlah artikel yang dipublikasikan
              dengan pesan buku tamu yang diterima setiap bulan selama dua belas
              bulan terakhir.
            </desc>
            <defs>
              <linearGradient id="dashboard-chart-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3, 4].map((langkah) => {
              const nilai = (nilaiMaksimumGrafik * langkah) / 4;
              const y = posisiY(nilai);

              return (
                <g key={langkah}>
                  <line
                    x1={areaGrafik.kiri}
                    y1={y}
                    x2={areaGrafik.kiri + areaGrafik.lebar}
                    y2={y}
                    stroke="#ede3fa"
                    strokeDasharray={langkah === 0 ? undefined : "4 6"}
                  />
                  <text
                    x={areaGrafik.kiri - 14}
                    y={y + 4}
                    textAnchor="end"
                    fill="#806b94"
                    fontSize="12"
                  >
                    {nilai}
                  </text>
                </g>
              );
            })}

            <polyline
              points={titikArtikel}
              fill="none"
              stroke="url(#dashboard-chart-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={titikPesan}
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {aktivitasBulanan.map((bulan, index) => (
              <g key={bulan.kunci}>
                <circle
                  cx={posisiX(index)}
                  cy={posisiY(bulan.artikel)}
                  r="5"
                  fill="#fff"
                  stroke="#7c3aed"
                  strokeWidth="3"
                >
                  <title>{`${bulan.label}: ${bulan.artikel} artikel terbit`}</title>
                </circle>
                <circle
                  cx={posisiX(index)}
                  cy={posisiY(bulan.pesan)}
                  r="5"
                  fill="#fff"
                  stroke="#f97316"
                  strokeWidth="3"
                >
                  <title>{`${bulan.label}: ${bulan.pesan} pesan masuk`}</title>
                </circle>
                <text
                  x={posisiX(index)}
                  y={areaGrafik.atas + areaGrafik.tinggi + 28}
                  textAnchor="middle"
                  fill="#735e86"
                  fontSize="13"
                >
                  {bulan.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-orange-50 p-3">
              <p className="text-xs font-medium text-gray-500">
                Artikel terbit · 12 bulan
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {memuat ? "-" : totalArtikel12Bulan}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {memuat || !bulanIni || !bulanLalu
                  ? "Perbandingan bulanan"
                  : `${bulanIni.artikel} bulan ini · ${ringkasPerubahan(
                      bulanIni.artikel,
                      bulanLalu.artikel
                    )}`}
              </p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-orange-50 p-3">
              <p className="text-xs font-medium text-gray-500">
                Rata-rata artikel / bulan
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {memuat
                  ? "-"
                  : new Intl.NumberFormat("id-ID", {
                      maximumFractionDigits: 1,
                    }).format(totalArtikel12Bulan / JUMLAH_BULAN_GRAFIK)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Berdasarkan 12 bulan</p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-orange-50 p-3">
              <p className="text-xs font-medium text-gray-500">
                Pesan masuk · 12 bulan
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {memuat ? "-" : totalPesan12Bulan}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {memuat || !bulanIni || !bulanLalu
                  ? "Perbandingan bulanan"
                  : `${bulanIni.pesan} bulan ini · ${ringkasPerubahan(
                      bulanIni.pesan,
                      bulanLalu.pesan
                    )}`}
              </p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-orange-50 p-3">
              <p className="text-xs font-medium text-gray-500">
                Rata-rata pesan / bulan
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {memuat
                  ? "-"
                  : new Intl.NumberFormat("id-ID", {
                      maximumFractionDigits: 1,
                    }).format(totalPesan12Bulan / JUMLAH_BULAN_GRAFIK)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Berdasarkan 12 bulan</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.45fr)]">
        <section className="card">
          <div className="card-header flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Akses Cepat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Menu pengelolaan yang sering digunakan
              </p>
            </div>
          </div>
          <div className="card-body grid gap-4 p-5 sm:grid-cols-2">
            {pintasan.map((item) => {
              const Ikon = item.ikon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-light-primary"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-primary text-primary">
                    <Ikon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-gray-800">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      {item.keterangan}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="mt-1 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Perlu Perhatian</h3>
          </div>
          <div className="card-body space-y-3 p-5">
            <Link
              href="/administrator/testimoni"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-light-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-light-warning text-warning">
                <MessageSquareQuote size={20} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Testimoni belum aktif</p>
                <p className="mt-1 text-sm text-gray-500">
                  {memuat ? "Memuat..." : `${testimoniMenunggu} testimoni menunggu`}
                </p>
              </div>
            </Link>

            <Link
              href="/administrator/artikel"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:bg-light-primary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-light-info text-info">
                <BookOpen size={20} />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Kelola artikel</p>
                <p className="mt-1 text-sm text-gray-500">
                  Buat dan perbarui konten website
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-header flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Artikel Terbaru</h3>
            <p className="mt-1 text-sm text-gray-500">
              Konten yang terakhir diperbarui
            </p>
          </div>
          <Link
            href="/administrator/artikel"
            className="btn btn-sm btn-light-primary"
          >
            Lihat semua
          </Link>
        </div>
        <div className="card-body p-0">
          {memuat ? (
            <p className="px-5 py-10 text-center text-sm text-gray-500">
              Memuat artikel...
            </p>
          ) : artikelTerbaru.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-500">
              Belum ada artikel.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {artikelTerbaru.map((artikel) => (
                <Link
                  key={artikel.id}
                  href="/administrator/artikel"
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-primary text-primary">
                    <Newspaper size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-800">
                      {artikel.judul}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {artikel.status === "aktif" ? "Dipublikasikan" : "Draft"}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      artikel.status === "aktif"
                        ? "badge-light-success"
                        : "badge-light-warning"
                    }`}
                  >
                    {artikel.status === "aktif" ? "Aktif" : "Nonaktif"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
