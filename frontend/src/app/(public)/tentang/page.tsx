
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <Navbar />

      <main className="w-full bg-white">

        {/* ================= HERO SECTION ================= */}
        {/* EDIT: Judul, deskripsi, dan gambar utama */}
        <section className="relative w-full overflow-hidden bg-[#FFF8ED]">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-10">

            <div>
              <p className="mb-4 font-semibold uppercase tracking-widest text-[#F59A23]">
                Broadband Learning Center
              </p>

              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Mengenal BLC
                <span className="block text-[#F59A23]">
                  Surabaya
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">
                {/* EDIT DESKRIPSI DI SINI */}
                Broadband Learning Center (BLC) Surabaya merupakan
                fasilitas pembelajaran teknologi informasi dan
                komunikasi yang ditujukan untuk masyarakat.
              </p>

              <a
                href="#profil"
                className="mt-8 inline-block rounded-lg bg-[#F59A23] px-7 py-3 font-semibold text-white transition hover:bg-[#E88912]"
              >
                Selengkapnya
              </a>
            </div>

            {/* EDIT: Ganti URL gambar sesuai kebutuhan */}
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/images/blc-hero.jpg"
                alt="Kegiatan BLC Surabaya"
                className="h-[350px] w-full object-cover"
              />
            </div>

          </div>
        </section>

        {/* ================= PROFIL BLC ================= */}
        <section id="profil" className="mx-auto max-w-7xl px-6 py-20 md:px-10">

          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-widest text-[#F59A23]">
              Tentang Kami
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Profil BLC Surabaya
            </h2>

            {/* EDIT DESKRIPSI PROFIL DI SINI */}
            <p className="mt-6 leading-8 text-gray-600">
              BLC Surabaya hadir sebagai sarana untuk mendukung
              peningkatan pengetahuan dan kemampuan masyarakat
              dalam bidang teknologi informasi.
            </p>
          </div>

        </section>

        {/* ================= STATISTIK ================= */}
        <section className="bg-[#FFF8ED] px-6 py-20">

          <div className="mx-auto max-w-7xl">

            <div className="mb-12 text-center">
              <p className="font-semibold uppercase tracking-widest text-[#F59A23]">
                Data BLC
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900">
                Statistik BLC Surabaya
              </h2>
            </div>

            {/* EDIT ANGKA DAN KETERANGAN DI BAGIAN INI */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">

              {[
                { angka: "00", label: "Jumlah Lokasi BLC" },
                { angka: "00", label: "Jumlah Peserta" },
                { angka: "00", label: "Jumlah Pelatihan" },
                { angka: "00", label: "Jumlah Instruktur" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-4xl font-bold text-[#F59A23]">
                    {item.angka}
                  </h3>

                  <p className="mt-3 font-medium text-gray-600">
                    {item.label}
                  </p>
                </div>
              ))}

            </div>
          </div>

        </section>

        {/* ================= PENUTUP ================= */}
        <section className="px-6 py-20 text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Belajar Teknologi Bersama BLC
          </h2>

          {/* EDIT DESKRIPSI DI SINI */}
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600">
            Bersama BLC Surabaya, masyarakat dapat mengenal
            dan mengembangkan kemampuan di bidang teknologi
            informasi dan komunikasi.
          </p>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </>
  );
}
