"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Eye,
  ImagePlus,
  Info,
  ListChecks,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCrudNotification } from "@/components/CrudNotification";
import {
  buatFormKosong,
  MATERI_SOAL,
  PILIHAN_JAWABAN,
  type SoalFormValue,
  type SoalPelatihan,
} from "./data";

const LIST_PATH = "/koordinator/master_data/soal";

type FormSoalProps = {
  mode: "baru" | "ubah";
  awal?: SoalPelatihan;
  onSimpan: (value: SoalFormValue) => boolean;
};

function formDariSoal(item: SoalPelatihan): SoalFormValue {
  return {
    materi: item.materi,
    pertemuan: String(item.pertemuan),
    teks: item.teks,
    gambarSoal: item.gambarSoal,
    jawaban: item.jawaban.map((entry) => ({ ...entry })),
    kunciJawaban: item.kunciJawaban,
    bobotNilai: String(item.bobotNilai),
  };
}

async function bacaGambar(file: File): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Gambar tidak dapat dibaca."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Format gambar tidak didukung."));
    element.src = source;
  });

  const scale = Math.min(1, 1000 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Gambar tidak dapat diproses.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.78);
}

function UploadGambar({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const { showNotification } = useCrudNotification();
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const pilihGambar = async (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showNotification({ type: "error", title: "File tidak didukung", message: "Pilih file gambar JPG, PNG, atau WebP." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification({ type: "error", title: "Ukuran gambar terlalu besar", message: "Ukuran maksimal setiap gambar adalah 5 MB." });
      return;
    }

    setProcessing(true);
    try {
      onChange(await bacaGambar(file));
    } catch (error) {
      showNotification({
        type: "error",
        title: "Gambar gagal dimuat",
        message: error instanceof Error ? error.message : "Silakan pilih gambar lain.",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="soal-upload-wrap">
      {value ? (
        <div className="soal-upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={`Pratinjau ${label}`} />
          <div className="soal-upload-preview__toolbar">
            <label htmlFor={id} className="btn btn-sm btn-light">
              <ImagePlus size={15} /> Ganti
            </label>
            <button type="button" className="btn btn-sm btn-light-danger" onClick={() => onChange(null)}>
              <Trash2 size={15} /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`soal-upload${dragActive ? " soal-upload--active" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            void pilihGambar(event.dataTransfer.files[0]);
          }}
        >
          <span className="soal-upload__icon"><UploadCloud size={25} /></span>
          <span className="soal-upload__title">{processing ? "Memproses gambar..." : "Unggah gambar"}</span>
          <span className="soal-upload__hint">Klik atau tarik file ke sini · Maks. 5 MB</span>
        </label>
      )}
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          void pilihGambar(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </div>
  );
}

export default function FormSoal({ mode, awal, onSimpan }: FormSoalProps) {
  const { showNotification } = useCrudNotification();
  const [form, setForm] = useState<SoalFormValue>(() => awal ? formDariSoal(awal) : buatFormKosong());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const daftarPertemuan = MATERI_SOAL.find((item) => item.nama === form.materi)?.pertemuan ?? [];
  const bobotValid = Number.isInteger(Number(form.bobotNilai)) && Number(form.bobotNilai) >= 1 && Number(form.bobotNilai) <= 100;
  const kelengkapan = [
    form.materi,
    form.pertemuan,
    form.teks.trim(),
    ...form.jawaban.map((item) => item.teks.trim()),
    form.kunciJawaban,
    bobotValid ? "valid" : "",
  ].filter(Boolean).length;
  const persenKelengkapan = Math.round((kelengkapan / 10) * 100);

  const ringkasan = useMemo(() => ({
    gambarSoal: form.gambarSoal ? 1 : 0,
    gambarJawaban: form.jawaban.filter((item) => item.gambar).length,
    jawabanTerisi: form.jawaban.filter((item) => item.teks.trim()).length,
  }), [form.gambarSoal, form.jawaban]);

  const setField = <K extends keyof SoalFormValue>(key: K, value: SoalFormValue[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const setJawaban = (index: number, value: Partial<SoalFormValue["jawaban"][number]>) => {
    setForm((current) => ({
      ...current,
      jawaban: current.jawaban.map((item, itemIndex) => itemIndex === index ? { ...item, ...value } : item),
    }));
    setErrors((current) => ({ ...current, [`jawaban-${index}`]: "" }));
  };

  const kirim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.materi) nextErrors.materi = "Pilih materi terlebih dahulu.";
    if (!form.pertemuan) nextErrors.pertemuan = "Pilih pertemuan terlebih dahulu.";
    if (!form.teks.trim()) nextErrors.teks = "Teks soal wajib diisi.";
    form.jawaban.forEach((item, index) => {
      if (!item.teks.trim()) nextErrors[`jawaban-${index}`] = `Jawaban ${PILIHAN_JAWABAN[index]} wajib diisi.`;
    });
    if (!form.kunciJawaban) nextErrors.kunciJawaban = "Pilih kunci jawaban.";
    if (!bobotValid) nextErrors.bobotNilai = "Bobot nilai harus berupa angka 1 sampai 100.";

    setErrors(nextErrors);
    const pesan = Object.values(nextErrors)[0];
    if (pesan) {
      showNotification({ type: "error", title: "Data soal belum valid", message: pesan });
      const firstKey = Object.keys(nextErrors)[0];
      const answerIndex = firstKey.startsWith("jawaban-") ? firstKey.split("-")[1] : null;
      document.getElementById(answerIndex ? `soal-jawaban-${answerIndex}` : `soal-${firstKey}`)?.focus();
      return;
    }

    onSimpan({
      ...form,
      teks: form.teks.trim(),
      jawaban: form.jawaban.map((item) => ({ ...item, teks: item.teks.trim() })),
      bobotNilai: String(Number(form.bobotNilai)),
    });
  };

  return (
    <form className="card kategori-form-card soal-form-card" onSubmit={kirim} noValidate>
      <div className="card-header d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 py-4 px-4 px-lg-5">
        <div className="d-flex align-items-center gap-3">
          <span className="symbol symbol-40px">
            <span className="symbol-label bg-blue-100 text-blue-600"><ListChecks size={20} /></span>
          </span>
          <div>
            <h2 className="fs-5 fw-bold text-gray-900 mb-1">{mode === "baru" ? "Buat Soal Pelatihan BLC Baru" : "Ubah Soal Pelatihan BLC"}</h2>
            <p className="text-muted fs-7 mb-0">Lengkapi informasi materi, soal, dan lima pilihan jawaban.</p>
          </div>
        </div>
        <span className="badge bg-blue-100 text-blue-700 px-3 py-2">{persenKelengkapan}% lengkap</span>
      </div>

      <div className="card-body p-0">
        <div className="row g-0">
          <div className="col-12 col-xl-8">
            <div className="soal-form-main p-4 p-lg-5">
              <section className="soal-form-section" aria-labelledby="soal-informasi-title">
                <div className="soal-section-heading">
                  <span className="soal-section-number">1</span>
                  <div>
                    <h3 id="soal-informasi-title" className="fs-6 fw-bold text-gray-900 mb-1">Informasi soal</h3>
                    <p className="text-muted fs-7 mb-0">Tentukan materi dan pertemuan untuk soal ini.</p>
                  </div>
                </div>
                <div className="row g-4 mt-2">
                  <div className="col-12 col-md-6">
                    <label htmlFor="soal-materi" className="form-label fw-semibold">Materi <span className="text-danger">*</span></label>
                    <select
                      id="soal-materi"
                      className={`form-select${errors.materi ? " is-invalid" : ""}`}
                      value={form.materi}
                      onChange={(event) => {
                        setForm((current) => ({ ...current, materi: event.target.value, pertemuan: "" }));
                        setErrors((current) => ({ ...current, materi: "", pertemuan: "" }));
                      }}
                      aria-invalid={Boolean(errors.materi)}
                      aria-describedby={errors.materi ? "soal-materi-error" : undefined}
                      required
                    >
                      <option value="">-- Pilih Materi --</option>
                      {MATERI_SOAL.map((item) => <option key={item.nama} value={item.nama}>{item.nama}</option>)}
                    </select>
                    {errors.materi && <div id="soal-materi-error" className="invalid-feedback">{errors.materi}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="soal-pertemuan" className="form-label fw-semibold">Pertemuan <span className="text-danger">*</span></label>
                    <select
                      id="soal-pertemuan"
                      className={`form-select${errors.pertemuan ? " is-invalid" : ""}`}
                      value={form.pertemuan}
                      onChange={(event) => setField("pertemuan", event.target.value)}
                      disabled={!form.materi}
                      aria-invalid={Boolean(errors.pertemuan)}
                      aria-describedby={errors.pertemuan ? "soal-pertemuan-error" : undefined}
                      required
                    >
                      <option value="">-- Pilih Pertemuan --</option>
                      {daftarPertemuan.map((item) => <option key={item} value={item}>Pertemuan {item}</option>)}
                    </select>
                    {errors.pertemuan && <div id="soal-pertemuan-error" className="invalid-feedback">{errors.pertemuan}</div>}
                  </div>
                </div>
              </section>

              <section className="soal-form-section" aria-labelledby="soal-pertanyaan-title">
                <div className="soal-section-heading">
                  <span className="soal-section-number">2</span>
                  <div>
                    <h3 id="soal-pertanyaan-title" className="fs-6 fw-bold text-gray-900 mb-1">Pertanyaan</h3>
                    <p className="text-muted fs-7 mb-0">Tulis soal dan tambahkan gambar pendukung jika diperlukan.</p>
                  </div>
                </div>
                <div className="mt-3">
                  <label htmlFor="soal-teks" className="form-label fw-semibold">Soal <span className="text-danger">*</span></label>
                  <textarea
                    id="soal-teks"
                    className={`form-control${errors.teks ? " is-invalid" : ""}`}
                    rows={4}
                    value={form.teks}
                    onChange={(event) => setField("teks", event.target.value)}
                    placeholder="Tulis pertanyaan pelatihan di sini..."
                    aria-invalid={Boolean(errors.teks)}
                    aria-describedby={errors.teks ? "soal-teks-error" : undefined}
                    required
                  />
                  <div className="d-flex justify-content-between mt-2">
                    {errors.teks ? <div id="soal-teks-error" className="invalid-feedback d-block">{errors.teks}</div> : <span />}
                    <span className="text-muted fs-8">{form.teks.length} karakter</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="form-label fw-semibold">Gambar soal <span className="text-muted fw-normal">(opsional)</span></span>
                  <UploadGambar id="soal-gambar" label="gambar soal" value={form.gambarSoal} onChange={(value) => setField("gambarSoal", value)} />
                </div>
              </section>

              <section className="soal-form-section" aria-labelledby="soal-jawaban-title">
                <div className="soal-section-heading">
                  <span className="soal-section-number">3</span>
                  <div>
                    <h3 id="soal-jawaban-title" className="fs-6 fw-bold text-gray-900 mb-1">Pilihan jawaban</h3>
                    <p className="text-muted fs-7 mb-0">Isi jawaban A sampai E. Klik tanda centang untuk memilih kunci.</p>
                  </div>
                </div>
                <div className="soal-answer-list mt-3">
                  {PILIHAN_JAWABAN.map((huruf, index) => {
                    const selected = form.kunciJawaban === huruf;
                    return (
                      <div className={`soal-answer-card${selected ? " soal-answer-card--selected" : ""}`} key={huruf}>
                        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span className="soal-answer-letter">{huruf}</span>
                            <span className="fw-semibold text-gray-800">Jawaban {huruf}</span>
                            {selected && <span className="badge bg-blue-100 text-blue-700"><Check size={13} /> Kunci</span>}
                          </div>
                          <button
                            type="button"
                            className={`btn btn-sm ${selected ? "btn-primary" : "btn-light"}`}
                            onClick={() => setField("kunciJawaban", selected ? "" : huruf)}
                            aria-pressed={selected}
                            aria-label={selected ? `Batalkan kunci jawaban ${huruf}` : `Jadikan jawaban ${huruf} sebagai kunci`}
                          >
                            <CheckCircle2 size={15} /> {selected ? "Kunci dipilih" : "Pilih kunci"}
                          </button>
                        </div>
                        <div className="row g-3">
                          <div className="col-12 col-lg-4">
                            <UploadGambar
                              id={`soal-gambar-jawaban-${index}`}
                              label={`gambar jawaban ${huruf}`}
                              value={form.jawaban[index].gambar}
                              onChange={(value) => setJawaban(index, { gambar: value })}
                            />
                          </div>
                          <div className="col-12 col-lg-8">
                            <label htmlFor={`soal-jawaban-${index}`} className="form-label fw-semibold">Teks jawaban {huruf} <span className="text-danger">*</span></label>
                            <textarea
                              id={`soal-jawaban-${index}`}
                              className={`form-control${errors[`jawaban-${index}`] ? " is-invalid" : ""}`}
                              rows={4}
                              value={form.jawaban[index].teks}
                              onChange={(event) => setJawaban(index, { teks: event.target.value })}
                              placeholder={`Masukkan jawaban ${huruf}`}
                              aria-invalid={Boolean(errors[`jawaban-${index}`])}
                              aria-describedby={errors[`jawaban-${index}`] ? `soal-jawaban-${index}-error` : undefined}
                              required
                            />
                            {errors[`jawaban-${index}`] && <div id={`soal-jawaban-${index}-error`} className="invalid-feedback d-block">{errors[`jawaban-${index}`]}</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.kunciJawaban && <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">{errors.kunciJawaban}</div>}
              </section>

              <section className="soal-form-section soal-form-section--last" aria-labelledby="soal-pengaturan-title">
                <div className="soal-section-heading">
                  <span className="soal-section-number">4</span>
                  <div>
                    <h3 id="soal-pengaturan-title" className="fs-6 fw-bold text-gray-900 mb-1">Pengaturan jawaban</h3>
                    <p className="text-muted fs-7 mb-0">Tentukan kunci dan bobot nilai soal.</p>
                  </div>
                </div>
                <div className="row g-4 mt-2">
                  <div className="col-12 col-md-6">
                    <label htmlFor="soal-kunciJawaban" className="form-label fw-semibold">Kunci Jawaban <span className="text-danger">*</span></label>
                    <select
                      id="soal-kunciJawaban"
                      className={`form-select${errors.kunciJawaban ? " is-invalid" : ""}`}
                      value={form.kunciJawaban}
                      onChange={(event) => setField("kunciJawaban", event.target.value)}
                      aria-invalid={Boolean(errors.kunciJawaban)}
                      required
                    >
                      <option value="">-- Pilih Kunci Jawaban --</option>
                      {PILIHAN_JAWABAN.map((item) => <option key={item} value={item}>Jawaban {item}</option>)}
                    </select>
                    {errors.kunciJawaban && <div className="invalid-feedback d-block">{errors.kunciJawaban}</div>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="soal-bobotNilai" className="form-label fw-semibold">Bobot Nilai <span className="text-danger">*</span></label>
                    <input
                      id="soal-bobotNilai"
                      type="number"
                      className={`form-control${errors.bobotNilai ? " is-invalid" : ""}`}
                      value={form.bobotNilai}
                      onChange={(event) => setField("bobotNilai", event.target.value)}
                      min={1}
                      max={100}
                      aria-invalid={Boolean(errors.bobotNilai)}
                      required
                    />
                    {errors.bobotNilai && <div className="invalid-feedback d-block">{errors.bobotNilai}</div>}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <aside className="col-12 col-xl-4">
            <div className="soal-form-sidebar p-4 p-lg-5">
              <div className="soal-summary-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="symbol symbol-40px"><span className="symbol-label bg-blue-100 text-blue-600"><Eye size={20} /></span></span>
                  <div>
                    <h3 className="fs-6 fw-bold text-gray-900 mb-1">Ringkasan soal</h3>
                    <p className="text-muted fs-7 mb-0">Periksa sebelum disimpan</p>
                  </div>
                </div>
                <div className="soal-progress-label d-flex justify-content-between fs-7 fw-semibold mb-2">
                  <span>Kelengkapan</span><span className="text-blue-600">{persenKelengkapan}%</span>
                </div>
                <div className="progress soal-progress mb-4" role="progressbar" aria-valuenow={persenKelengkapan} aria-valuemin={0} aria-valuemax={100} aria-label="Kelengkapan soal">
                  <div className="progress-bar bg-primary" style={{ width: `${persenKelengkapan}%` }} />
                </div>
                <dl className="soal-summary-list">
                  <div><dt>Materi</dt><dd>{form.materi || "Belum dipilih"}</dd></div>
                  <div><dt>Pertemuan</dt><dd>{form.pertemuan ? `Pertemuan ${form.pertemuan}` : "Belum dipilih"}</dd></div>
                  <div><dt>Jawaban terisi</dt><dd>{ringkasan.jawabanTerisi} dari 5</dd></div>
                  <div><dt>Kunci jawaban</dt><dd>{form.kunciJawaban ? `Jawaban ${form.kunciJawaban}` : "Belum dipilih"}</dd></div>
                  <div><dt>Gambar</dt><dd>{ringkasan.gambarSoal + ringkasan.gambarJawaban} file</dd></div>
                </dl>
              </div>

              <div className="soal-tip-card">
                <Info size={19} className="text-blue-600 flex-shrink-0" />
                <div>
                  <strong className="d-block fs-7 text-blue-800 mb-1">Tips mengisi soal</strong>
                  <p className="text-muted fs-8 mb-0">Gunakan kalimat yang jelas, hindari jawaban ambigu, dan pastikan hanya ada satu kunci jawaban.</p>
                </div>
              </div>

              <div className="soal-form-actions">
                <Link href={LIST_PATH} className="btn btn-light w-100 mb-3">Kembali ke daftar</Link>
                <button type="submit" className="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2">
                  <Save size={17} /> {mode === "baru" ? "Simpan Soal" : "Simpan Perubahan"}
                </button>
                <p className="text-muted fs-8 text-center mt-3 mb-0"><span className="text-danger">*</span> Wajib diisi</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </form>
  );
}
