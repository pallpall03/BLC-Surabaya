import Navbar from "@/components/home/Navbar"; // sesuaikan path punyamu
import HeroSection from "@/components/home/HeroSection";
import TentangBLC from "@/components/home/TentangBLC";
import Artikel from "@/components/home/Artikel";
import Lokasi from "@/components/home/Lokasi";
import Footer from "@/components/home/Footer"; // sesuaikan path punyamu

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TentangBLC />
      <Artikel />
      <Lokasi />
      <Footer />
    </>
  );
}