import { MapPin, Phone, Mail, Clock } from "lucide-react";

const kontak = [
  { id: 1, label: "Alamat", isi: "-", ikon: MapPin },
  { id: 2, label: "Telepon", isi: "-", ikon: Phone },
  { id: 3, label: "Email", isi: "-", ikon: Mail },
  { id: 4, label: "Jam Layanan", isi: "-", ikon: Clock },
];

export default function HalamanKontak() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-orange-600 mb-8">Kontak</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {kontak.map((k) => {
          const Ikon = k.ikon;
          return (
            <div key={k.id} className="bg-white rounded-xl shadow p-6 flex gap-4">
              <span className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Ikon size={24} />
              </span>
              <div>
                <p className="text-sm text-gray-500">{k.label}</p>
                <p className="font-medium">{k.isi}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}