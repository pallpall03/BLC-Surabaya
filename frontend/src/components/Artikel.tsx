const artikel = [
  { judul: "Judul artikel 1", ringkas: "Ringkasan singkat artikel." },
  { judul: "Judul artikel 2", ringkas: "Ringkasan singkat artikel." },
  { judul: "Judul artikel 3", ringkas: "Ringkasan singkat artikel." },
];

export default function Artikel() {
  return (
    <section
      id="artikel"
      className="flex min-h-screen snap-start items-center bg-sky-50 px-6 py-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="mb-8 text-3xl font-bold text-slate-800">Artikel</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {artikel.map((a) => (
            <article key={a.judul} className="rounded-xl bg-white p-5 shadow">
              <h3 className="mb-2 font-semibold text-slate-800">{a.judul}</h3>
              <p className="text-sm text-slate-600">{a.ringkas}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}