import Navbar from "@/components/Navbar"; // sesuaikan path punyamu
import HeroSection from "@/components/home/HeroSection";
import TentangBLC from "@/components/TentangBLC";
import Artikel from "@/components/Artikel";
import Lokasi from "@/components/Lokasi";
import Footer from "@/components/Footer"; // sesuaikan path punyamu

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