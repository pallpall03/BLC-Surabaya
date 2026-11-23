import SectionWrap from "./SectionWrap";
import { daftarInformasi } from "./data";

export default function Informasi() {
  return (
    <SectionWrap
      id="informasi"
      judul="Informasi"
      deskripsi="Hal-hal yang perlu kamu ketahui tentang layanan BLC Surabaya."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {daftarInformasi.map((item) => {
          const Ikon = item.ikon;
          return (
            <div
              key={item.id}
              id={`info-${item.id}`}
              className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Ikon size={24} />
              </span>
              <h3 className="mt-4 font-semibold text-slate-800">{item.judul}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.ringkas}</p>
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}
