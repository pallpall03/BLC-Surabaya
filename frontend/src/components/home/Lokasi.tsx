export default function Lokasi() {
  return (
    <section
      id="lokasi"
      className="flex min-h-screen snap-start items-center bg-white px-6 py-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="mb-8 text-3xl font-bold text-slate-800">Lokasi</h2>
        <iframe
          title="Lokasi BLC Surabaya"
          src="PASTE_LINK_EMBED_GOOGLE_MAPS_DI_SINI"  //maps
          className="h-96 w-full rounded-xl border-0"
          loading="lazy"
        />
      </div>
    </section>
  );
}