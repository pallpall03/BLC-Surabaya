"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  Download,
  Eye,
  Trash2,
  X,
  Users,
  CalendarDays,
  MapPin,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileSpreadsheet,
} from "lucide-react";
type Pengunjung = {
  id: number;
  tanggal: string; // Format YYYY-MM-DD
  nama: string;
  nik: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamat: string;
  kecamatan: string;
  kelurahan: string;
  telepon: string;
  email: string;
  instansi: string;
  lokasi: string;
  sesi: string;
  keperluan: string;
};

// Data contoh sementara. Nantinya ganti dengan data dari API/backend.
const DATA_CONTOH: Pengunjung[] = [
  {
    id: 1,
    tanggal: "2026-11-23",
    nama: "Andi Pratama",
    nik: "3578011205980001",
    tanggalLahir: "1998-05-12",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Contoh No. 12",
    kecamatan: "Wonokromo",
    kelurahan: "Darmo",
    telepon: "081234567890",
    email: "andi@email.com",
    instansi: "Mahasiswa",
    lokasi: "BLC Surabaya - Taman",
    sesi: "Pagi",
    keperluan: "Mengikuti pelatihan komputer",
  },
  {
    id: 2,
    tanggal: "2026-11-23",
    nama: "Siti Rahma",
    nik: "3578024506990002",
    tanggalLahir: "1999-06-05",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Melati No. 8",
    kecamatan: "Tegalsari",
    kelurahan: "Kedungdoro",
    telepon: "082112345678",
    email: "siti@email.com",
    instansi: "Umum",
    lokasi: "BLC Surabaya - Kebraon",
    sesi: "Siang",
    keperluan: "Konsultasi layanan digital",
  },
  {
    id: 3,
    tanggal: "2026-11-22",
    nama: "Budi Santoso",
    nik: "3578030101970003",
    tanggalLahir: "1997-01-01",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Mawar No. 21",
    kecamatan: "Gubeng",
    kelurahan: "Airlangga",
    telepon: "085712345678",
    email: "budi@email.com",
    instansi: "Wiraswasta",
    lokasi: "BLC Surabaya - Taman",
    sesi: "Pagi",
    keperluan: "Menggunakan fasilitas internet",
  },
  {
    id: 4,
    tanggal: "2026-11-21",
    nama: "Dewi Lestari",
    nik: "3578045602000004",
    tanggalLahir: "2000-02-16",
    jenisKelamin: "Perempuan",
    alamat: "Jl. Kenanga No. 4",
    kecamatan: "Rungkut",
    kelurahan: "Kali Rungkut",
    telepon: "081398765432",
    email: "dewi@email.com",
    instansi: "Pelajar",
    lokasi: "BLC Surabaya - Kebraon",
    sesi: "Sore",
    keperluan: "Belajar desain grafis",
  },
  {
    id: 5,
    tanggal: "2026-11-20",
    nama: "Rizky Maulana",
    nik: "3578051703990005",
    tanggalLahir: "1999-03-17",
    jenisKelamin: "Laki-laki",
    alamat: "Jl. Anggrek No. 15",
    kecamatan: "Sukolilo",
    kelurahan: "Keputih",
    telepon: "087812345678",
    email: "rizky@email.com",
    instansi: "Mahasiswa",
    lokasi: "BLC Surabaya - Taman",
    sesi: "Siang",
    keperluan: "Mengikuti kegiatan komunitas",
  },
];

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return "-";
  return new Date(`${tanggal}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function BukuTamuPage() {
  const [data, setData] = useState<Pengunjung[]>(DATA_CONTOH);
  const [kataKunci, setKataKunci] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua Lokasi");
  const [filterSesi, setFilterSesi] = useState("Semua Sesi");
  const [halaman, setHalaman] = useState(1);
  const [dataDipilih, setDataDipilih] = useState<Pengunjung | null>(null);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState<number | null>(null);

  const jumlahPerHalaman = 5;

  const daftarLokasi = useMemo(
    () => [...new Set(data.map((item) => item.lokasi))],
    [data]
  );

  const daftarSesi = useMemo(
    () => [...new Set(data.map((item) => item.sesi))],
    [data]
  );

  const hasil = useMemo(() => {
    const keyword = kataKunci.toLowerCase().trim();

    return data.filter((item) => {
      const cocokKataKunci =
        !keyword ||
        item.nama.toLowerCase().includes(keyword) ||
        item.nik.includes(keyword) ||
        item.telepon.includes(keyword) ||
        item.email.toLowerCase().includes(keyword);

      const cocokTanggal = !filterTanggal || item.tanggal === filterTanggal;
      const cocokLokasi =
        filterLokasi === "Semua Lokasi" || item.lokasi === filterLokasi;
      const cocokSesi =
        filterSesi === "Semua Sesi" || item.sesi === filterSesi;

      return cocokKataKunci && cocokTanggal && cocokLokasi && cocokSesi;
    });
  }, [data, kataKunci, filterTanggal, filterLokasi, filterSesi]);

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / jumlahPerHalaman));
  const dataHalaman = hasil.slice(
    (halaman - 1) * jumlahPerHalaman,
    halaman * jumlahPerHalaman
  );

  const tanggalHariIni = new Date().toLocaleDateString("en-CA");
  const jumlahHariIni = data.filter(
    (item) => item.tanggal === tanggalHariIni
  ).length;
  const jumlahLokasi = new Set(data.map((item) => item.lokasi)).size;

  function hapusPengunjung(id: number) {
    setData((sebelumnya) => sebelumnya.filter((item) => item.id !== id));
    setKonfirmasiHapus(null);
    if (dataHalaman.length === 1 && halaman > 1) {
      setHalaman((sebelumnya) => sebelumnya - 1);
    }
  }

  function exportExcel() {
    // Mengekspor seluruh data yang sesuai filter, bukan hanya halaman aktif.
    const dataExcel = hasil.map((item, index) => ({
      No: index + 1,
      Tanggal: formatTanggal(item.tanggal),
      Nama: item.nama,
      NIK: item.nik,
      "Tanggal Lahir": formatTanggal(item.tanggalLahir),
      "Jenis Kelamin": item.jenisKelamin,
      Alamat: item.alamat,
      Kecamatan: item.kecamatan,
      Kelurahan: item.kelurahan,
      Telepon: item.telepon,
      Email: item.email,
      "Asal Instansi/Pekerjaan": item.instansi,
      "Lokasi BLC": item.lokasi,
      Sesi: item.sesi,
      Keperluan: item.keperluan,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    worksheet["!cols"] = [
      { wch: 6 }, { wch: 18 }, { wch: 24 }, { wch: 20 },
      { wch: 18 }, { wch: 16 }, { wch: 30 }, { wch: 18 },
      { wch: 18 }, { wch: 18 }, { wch: 28 }, { wch: 26 },
      { wch: 25 }, { wch: 12 }, { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Buku Tamu");
    XLSX.writeFile(workbook, "Data-Buku-Tamu.xlsx");
  }

  function resetFilter() {
    setKataKunci("");
    setFilterTanggal("");
    setFilterLokasi("Semua Lokasi");
    setFilterSesi("Semua Sesi");
    setHalaman(1);
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 md:p-6">
      {/* Header halaman */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buku Tamu</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola dan pantau data pengunjung BLC Surabaya.
          </p>
        </div>

        <button
          type="button"
          onClick={exportExcel}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <FileSpreadsheet size={18} />
          Export Excel
        </button>
      </div>

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Pengunjung
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {data.length}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">Seluruh data buku tamu</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pengunjung Hari Ini
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {jumlahHariIni}
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CalendarDays size={24} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Berdasarkan tanggal kunjungan hari ini
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lokasi BLC</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {jumlahLokasi}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <MapPin size={24} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Lokasi yang memiliki data pengunjung
          </p>
        </div>
      </div>

      {/* Tabel dan filter */}
      <section className="card overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Data Pengunjung
            </h2>
            <p className="text-sm text-gray-500">
              Lihat, cari, filter, dan kelola data pengunjung.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={kataKunci}
                onChange={(e) => {
                  setKataKunci(e.target.value);
                  setHalaman(1);
                }}
                placeholder="Cari nama, NIK, telepon..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                value={filterTanggal}
                onChange={(e) => {
                  setFilterTanggal(e.target.value);
                  setHalaman(1);
                }}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={filterLokasi}
              onChange={(e) => {
                setFilterLokasi(e.target.value);
                setHalaman(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Semua Lokasi</option>
              {daftarLokasi.map((lokasi) => (
                <option key={lokasi} value={lokasi}>
                  {lokasi}
                </option>
              ))}
            </select>

            <select
              value={filterSesi}
              onChange={(e) => {
                setFilterSesi(e.target.value);
                setHalaman(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>Semua Sesi</option>
              {daftarSesi.map((sesi) => (
                <option key={sesi} value={sesi}>
                  Sesi {sesi}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <Filter size={14} />
              Ditemukan {hasil.length} data pengunjung
            </p>
            <button
              type="button"
              onClick={resetFilter}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Reset filter
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="table table-row-dashed align-middle w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">No.</th>
                <th className="px-5 py-4 font-semibold">Tanggal</th>
                <th className="px-5 py-4 font-semibold">Nama Pengunjung</th>
                <th className="px-5 py-4 font-semibold">Lokasi BLC</th>
                <th className="px-5 py-4 font-semibold">Sesi</th>
                <th className="px-5 py-4 font-semibold">Keperluan</th>
                <th className="px-5 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataHalaman.length > 0 ? (
                dataHalaman.map((item, index) => (
                  <tr key={item.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4 text-gray-500">
                      {(halaman - 1) * jumlahPerHalaman + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatTanggal(item.tanggal)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {item.nama}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{item.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{item.lokasi}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        <Clock3 size={13} />
                        {item.sesi}
                      </span>
                    </td>
                    <td className="max-w-[220px] px-5 py-4 text-gray-600">
                      <span className="line-clamp-2">{item.keperluan}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDataDipilih(item)}
                          title="Lihat detail"
                          className="rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setKonfirmasiHapus(item.id)}
                          title="Hapus data"
                          className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada data pengunjung yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Menampilkan{" "}
            <span className="font-semibold text-gray-700">
              {hasil.length === 0 ? 0 : (halaman - 1) * jumlahPerHalaman + 1}
              {" - "}
              {Math.min(halaman * jumlahPerHalaman, hasil.length)}
            </span>{" "}
            dari <span className="font-semibold text-gray-700">{hasil.length}</span>{" "}
            data
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={halaman <= 1}
              onClick={() => setHalaman((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft size={17} />
            </button>
            <span className="min-w-20 text-center text-sm text-gray-600">
              Halaman {halaman} / {totalHalaman}
            </span>
            <button
              type="button"
              disabled={halaman >= totalHalaman}
              onClick={() => setHalaman((p) => Math.min(totalHalaman, p + 1))}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* Modal detail pengunjung */}
      {dataDipilih && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDataDipilih(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Detail Pengunjung
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Informasi lengkap data buku tamu
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDataDipilih(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Tutup detail"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
              {[
                ["Nama Lengkap", dataDipilih.nama],
                ["NIK", dataDipilih.nik],
                ["Tanggal Lahir", formatTanggal(dataDipilih.tanggalLahir)],
                ["Jenis Kelamin", dataDipilih.jenisKelamin],
                ["Nomor Telepon", dataDipilih.telepon],
                ["Email", dataDipilih.email],
                ["Asal Instansi/Pekerjaan", dataDipilih.instansi],
                ["Tanggal Kunjungan", formatTanggal(dataDipilih.tanggal)],
                ["Lokasi BLC", dataDipilih.lokasi],
                ["Sesi Kunjungan", dataDipilih.sesi],
                ["Kecamatan", dataDipilih.kecamatan],
                ["Kelurahan", dataDipilih.kelurahan],
                ["Alamat", dataDipilih.alamat],
                ["Keperluan", dataDipilih.keperluan],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setDataDipilih(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {konfirmasiHapus !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <h3 className="mt-4 text-center text-lg font-bold text-gray-900">
              Hapus Data Pengunjung?
            </h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Data yang dihapus akan hilang dari daftar tampilan ini.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setKonfirmasiHapus(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => hapusPengunjung(konfirmasiHapus)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
