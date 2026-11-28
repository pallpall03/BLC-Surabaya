import Navbar from "@/home/Navbar";
import Footer from "@/home/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* pb-24 supaya footer tidak tertutup bottom navigation di HP */}
      <div className="pb-24 lg:pb-0">
        <Footer />
      </div>

    </>
  );
}