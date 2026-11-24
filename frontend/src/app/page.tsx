import Navbar from "./_home/Navbar";
import Beranda from "./_home/Beranda";
import Informasi from "./_home/Informasi";
import ArtikelTerbaru from "./_home/ArtikelTerbaru";
import Faq from "./_home/Faq";
import Lokasi from "./_home/Lokasi";
import BukuTamu from "./_home/BukuTamu";
import Kontak from "./_home/Kontak";

export default function HalamanHome() {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <Navbar />
      <main>
        <Beranda />
        <Informasi />
        <ArtikelTerbaru />
        <Faq />
        <Lokasi />
        <BukuTamu />
        <Kontak />
      </main>
      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Broadband Learning Center Surabaya
      </footer>
    </div>
  );
}