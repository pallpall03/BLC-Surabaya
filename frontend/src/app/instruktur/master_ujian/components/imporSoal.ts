"use client";

import type { SoalUjian } from "@/lib/api";

export const MAX_SOAL = 10;
const MAKS_DOKUMEN = 10 * 1024 * 1024;
const MAKS_TEKS = 1024 * 1024;
const MAKS_HASIL_TEKS = 2 * 1024 * 1024;
const HEADER_CSV = ["pertanyaan", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "jawaban_benar"];

export type HasilImporSoal = {
  soal: SoalUjian[];
  teks: string;
  namaFile: string;
  format: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell.trim()); cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = "";
    } else cell += c;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function validasiSoal(items: unknown[]): SoalUjian[] {
  if (items.length === 0) throw new Error("File tidak berisi soal.");
  if (items.length > MAX_SOAL) throw new Error(`Maksimal ${MAX_SOAL} soal. File berisi ${items.length} soal.`);
  return items.map((item, i) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`Format soal nomor ${i + 1} tidak valid.`);
    const s = item as Record<string, unknown>;
    const pilihan = Array.isArray(s.pilihan) ? s.pilihan.map((p) => String(p).trim()) : [];
    const kunci = String(s.jawaban_benar ?? "").trim();
    const benar = /^[A-Da-d]$/.test(kunci) ? kunci.toUpperCase().charCodeAt(0) - 65 : Number(kunci);
    if (!String(s.pertanyaan ?? "").trim()) throw new Error(`Soal nomor ${i + 1} belum memiliki pertanyaan.`);
    if (pilihan.length !== 4 || pilihan.some((p) => !p)) throw new Error(`Soal nomor ${i + 1} harus memiliki 4 pilihan jawaban.`);
    if (new Set(pilihan).size !== 4) throw new Error(`Pilihan soal nomor ${i + 1} tidak boleh sama.`);
    if (!Number.isInteger(benar) || benar < 0 || benar > 3) throw new Error(`Kunci soal nomor ${i + 1} harus A, B, C, atau D.`);
    return {
      pertanyaan: String(s.pertanyaan).trim(), pilihan, jawaban_benar: benar,
      nomor: i + 1, bobot: 1, penjelasan: String(s.penjelasan ?? "").trim(),
    };
  });
}

function imporTeks(text: string): SoalUjian[] {
  const normalized = text.replace(/\r/g, "").trim();
  const blocks = normalized.split(/\n\s*\n/).flatMap((block) => {
    const lines = block.split("\n");
    const sections: string[][] = [[]];
    for (const line of lines) {
      if (/^(?:soal\s*)?\d+[.)]\s+/i.test(line.trim()) && sections[sections.length - 1].length > 0) sections.push([]);
      sections[sections.length - 1].push(line);
    }
    return sections.map((section) => section.join("\n").trim()).filter(Boolean);
  });
  const items = blocks.map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const pertanyaan = (lines[0] ?? "").replace(/^(?:soal\s*)?\d+[.)]\s*/i, "").trim();
    const pilihan = ["", "", "", ""];
    let jawaban_benar = -1;
    let penjelasan = "";
    for (const line of lines.slice(1)) {
      const p = line.match(/^([A-Da-d])[.)]\s*(.+)$/);
      if (p) { pilihan[p[1].toUpperCase().charCodeAt(0) - 65] = p[2]; continue; }
      const key = line.match(/^(?:jawaban|kunci)\s*:\s*([A-Da-d])\b/i);
      if (key) { jawaban_benar = key[1].toUpperCase().charCodeAt(0) - 65; continue; }
      const explanation = line.match(/^(?:penjelasan)\s*:\s*(.*)$/i);
      if (explanation) penjelasan = explanation[1];
    }
    return { pertanyaan, pilihan, jawaban_benar, nomor: 1, bobot: 1, penjelasan };
  });
  return validasiSoal(items);
}

function imporCsv(text: string): SoalUjian[] {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length < 2) throw new Error("CSV harus memiliki header dan minimal satu baris soal.");
  const header = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const required = ["pertanyaan", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "jawaban_benar"];
  if (required.some((h) => !header.includes(h))) throw new Error("Header CSV belum sesuai. Unduh template yang disediakan.");
  const col = (name: string) => header.indexOf(name);
  return validasiSoal(rows.slice(1).map((r) => ({
    pertanyaan: r[col("pertanyaan")] ?? "",
    pilihan: [r[col("pilihan_a")], r[col("pilihan_b")], r[col("pilihan_c")], r[col("pilihan_d")]],
    jawaban_benar: /^[A-Da-d]$/.test(r[col("jawaban_benar")] ?? "")
      ? (r[col("jawaban_benar")] as string).toUpperCase().charCodeAt(0) - 65 : Number(r[col("jawaban_benar")]),
    nomor: 1, bobot: 1, penjelasan: r[col("penjelasan")] ?? "",
  })));
}

function pesanError(error: unknown): string {
  return error instanceof Error ? error.message : "Format soal tidak valid.";
}

function satuBaris(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function keTxt(items: unknown[]): string {
  return validasiSoal(items).map((s) => [
    `${s.nomor}. ${satuBaris(s.pertanyaan)}`,
    ...s.pilihan.map((pilihan, i) => `${String.fromCharCode(65 + i)}. ${satuBaris(pilihan)}`),
    `Jawaban: ${String.fromCharCode(65 + s.jawaban_benar)}`,
    ...(s.penjelasan ? [`Penjelasan: ${satuBaris(s.penjelasan)}`] : []),
  ].join("\n")).join("\n\n");
}

function normalisasiBaris(text: string, buangBarisKosong = false): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2028\u2029]/g, "\n")
    .replace(/[\u00a0\u200b\ufeff]/g, " ")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .filter((line) => !buangBarisKosong || line.length > 0)
    .join("\n")
    .trim();
}

function hasilTeks(file: File, format: string, teks: string, rapikan: boolean): HasilImporSoal {
  const normalized = normalisasiBaris(teks, rapikan);
  if (!normalized) throw new Error(`Teks hasil konversi ${format} kosong. Pastikan file berisi soal.`);
  if (normalized.length > MAKS_HASIL_TEKS) throw new Error(`Teks hasil konversi ${format} terlalu besar (maksimal 2 MB).`);
  try {
    return { soal: imporTeks(normalized), teks: normalized, namaFile: file.name, format };
  } catch (error) {
    throw new Error(`Teks hasil konversi ${format} tidak sesuai format soal: ${pesanError(error)}`);
  }
}

async function decodeUtf8(file: File, format: string): Promise<string> {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
    if (text.includes("\0")) throw new Error("binary");
    return text;
  } catch {
    const saran = format === "TEKS"
      ? "File biner tidak dapat dikenali sebagai teks soal."
      : `Simpan file sebagai ${format} teks UTF-8 lalu coba lagi.`;
    throw new Error(`${format} pada "${file.name}" bukan teks UTF-8 yang valid. ${saran}`);
  }
}

async function bacaPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist").catch(() => {
    throw new Error("Pembaca PDF gagal dimuat. Periksa koneksi jaringan lalu coba lagi.");
  });
  // Aset publik ini disalin dari build/pdf.worker.min.mjs oleh postinstall.
  // URL tetap sama pada Turbopack maupun static export; PDF.js 6 tidak memakai eval.
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

  let loadingTask: ReturnType<typeof pdfjs.getDocument>;
  try {
    loadingTask = pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer()),
      useSystemFonts: true,
    });
  } catch {
    throw new Error("PDF tidak dapat dibuka. Pastikan file adalah PDF teks yang valid dan tidak terlindungi kata sandi.");
  }

  try {
    const pdf = await loadingTask.promise;
    try {
      const halaman: string[] = [];
      let jumlahKarakter = 0;
      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i);
        try {
          const content = await page.getTextContent();
          const text = content.items.map((item) => "str" in item ? item.str + (item.hasEOL ? "\n" : "") : "").join("");
          jumlahKarakter += text.length;
          if (jumlahKarakter > MAKS_HASIL_TEKS) throw new Error("PDF memiliki terlalu banyak teks untuk diimpor (maksimal 2 MB hasil ekstraksi).");
          halaman.push(text);
        } finally {
          page.cleanup();
        }
      }
      const text = halaman.join("\n\n");
      if (!text.trim()) {
        throw new Error("PDF tidak memiliki teks yang dapat dibaca. PDF scan/gambar memerlukan OCR; jalankan OCR lalu simpan sebagai TXT, DOCX, atau PDF teks.");
      }
      return text;
    } finally {
      await pdf.cleanup().catch(() => undefined);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("PDF")) throw error;
    throw new Error("Gagal mengekstrak teks PDF. Pastikan file adalah PDF teks yang valid; untuk PDF scan/gambar, jalankan OCR terlebih dahulu.");
  } finally {
    await loadingTask.destroy().catch(() => undefined);
  }
}

async function bacaDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth").catch(() => {
    throw new Error("Pembaca DOCX gagal dimuat. Periksa koneksi jaringan lalu coba lagi.");
  });
  let html: string;
  try {
    const result = await mammoth.default.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    html = result.value;
  } catch {
    throw new Error("DOCX tidak dapat dibaca. Pastikan file adalah DOCX yang valid. Format .doc lama tidak didukung; simpan ulang sebagai DOCX.");
  }
  return htmlKeTeks(html);
}

function htmlKeTeks(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,style,noscript,template,svg,canvas,iframe,object,embed,head,nav,footer").forEach((el) => el.remove());
  doc.querySelectorAll("br").forEach((el) => el.replaceWith("\n"));
  doc.querySelectorAll("td,th").forEach((el) => el.append("\t"));
  doc.querySelectorAll("p,div,li,tr,h1,h2,h3,h4,h5,h6,section,article,blockquote,pre").forEach((el) => el.append("\n"));
  return doc.body?.textContent ?? "";
}

function rtfKeTeks(input: string): string {
  let output = "";
  let depth = 0;
  let skipDepth: number | null = null;
  let unicodeSkip = 1;
  let i = 0;
  const destinations = new Set([
    "fonttbl", "colortbl", "stylesheet", "info", "pict", "object", "objdata", "datastore",
    "themedata", "xmlnstbl", "listtable", "listoverridetable", "rsidtbl", "generator",
    "fldinst", "htmlrtf", "latentstyles",
  ]);

  while (i < input.length) {
    const char = input[i];
    if (char === "\\") {
      i += 1;
      if (i >= input.length) break;
      if (input[i] === "\\" || input[i] === "{" || input[i] === "}") {
        if (skipDepth === null) output += input[i] === "{" ? "{" : input[i] === "}" ? "}" : "\\";
        i += 1;
        continue;
      }
      if (input[i] === "*") {
        if (skipDepth === null) skipDepth = depth;
        i += 1;
        continue;
      }
      if (input[i] === "'") {
        const hex = input.slice(i + 1, i + 3);
        if (/^[\da-f]{2}$/i.test(hex)) {
          if (skipDepth === null) output += String.fromCharCode(Number.parseInt(hex, 16));
          i += 3;
        } else i += 1;
        continue;
      }

      const start = i;
      while (i < input.length && /[a-z]/i.test(input[i])) i += 1;
      const word = input.slice(start, i).toLowerCase();
      let parameter = "";
      if (input[i] === "-") { parameter = "-"; i += 1; }
      while (i < input.length && /\d/.test(input[i])) { parameter += input[i]; i += 1; }
      const value = Number.parseInt(parameter || "0", 10);
      if (input[i] === " ") i += 1;

      if (word === "bin") {
        i += Math.max(0, value);
        continue;
      }
      if (destinations.has(word) && skipDepth === null) {
        skipDepth = depth;
        continue;
      }
      if (skipDepth !== null) continue;

      if (word === "par" || word === "line" || word === "row") output += "\n";
      else if (word === "tab" || word === "cell") output += "\t";
      else if (word === "uc") unicodeSkip = Math.max(1, value);
      else if (word === "u") {
        output += String.fromCharCode(value & 0xffff);
        for (let skipped = 0; skipped < unicodeSkip && i < input.length; skipped += 1) {
          if (input[i] === "\\" && input[i + 1] === "'") i += 4;
          else i += 1;
        }
      }
      continue;
    }
    if (char === "{") { depth += 1; i += 1; continue; }
    if (char === "}") {
      if (skipDepth === depth) skipDepth = null;
      depth = Math.max(0, depth - 1);
      i += 1;
      continue;
    }
    if (skipDepth === null && char !== "\r" && char !== "\n") output += char;
    i += 1;
  }
  return output;
}

function headerExcel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function selCsv(value: unknown): string {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function bacaExcel(file: File): Promise<HasilImporSoal> {
  const XLSX = await import("xlsx").catch(() => {
    throw new Error("Pembaca Excel gagal dimuat. Periksa koneksi jaringan lalu coba lagi.");
  });
  let workbook: ReturnType<typeof XLSX.read>;
  try {
    workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  } catch {
    throw new Error("Excel tidak dapat dibaca. Pastikan file adalah XLSX atau XLS yang valid.");
  }

  const rows: unknown[][] = [];
  const sheets: string[] = [];
  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "", blankrows: false });
    const headerIndex = data.findIndex((row) => {
      const header = row.map((cell) => headerExcel(String(cell ?? "")));
      return HEADER_CSV.every((column) => header.includes(column));
    });
    if (headerIndex < 0) continue;
    const header = data[headerIndex].map((cell) => headerExcel(String(cell ?? "")));
    rows.push(...data.slice(headerIndex + 1).map((row) => HEADER_CSV.map((column) => row[header.indexOf(column)] ?? "")));
    sheets.push(name);
  }

  if (!sheets.length) {
    throw new Error(`Excel "${file.name}" belum memiliki header pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, dan jawaban_benar. Unduh template CSV sebagai contoh header.`);
  }
  const csv = rows.map((row) => row.map(selCsv).join(",")).join("\n");
  try {
    const soal = imporCsv(csv);
    return { soal, teks: keTxt(soal), namaFile: file.name, format: "EXCEL" };
  } catch (error) {
    throw new Error(`Format soal pada Excel (sheet: ${sheets.join(", ")}) tidak valid: ${pesanError(error)}`);
  }
}

function imporJson(file: File, text: string): HasilImporSoal {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`JSON pada "${file.name}" tidak valid: ${pesanError(error)}`);
  }
  const items = Array.isArray(parsed) ? parsed : (parsed as { soal?: unknown } | null)?.soal;
  if (!Array.isArray(items)) throw new Error("JSON harus berupa array soal atau objek dengan properti soal.");
  try {
    // JSON dinormalisasi ke TXT lebih dahulu, lalu melewati parser TXT yang sama.
    const teks = keTxt(items);
    return { soal: imporTeks(teks), teks, namaFile: file.name, format: "JSON" };
  } catch (error) {
    throw new Error(`JSON pada "${file.name}" tidak sesuai format soal: ${pesanError(error)}`);
  }
}

function imporCsvFile(file: File, text: string): HasilImporSoal {
  try {
    const soal = imporCsv(text);
    return { soal, teks: keTxt(soal), namaFile: file.name, format: "CSV" };
  } catch (error) {
    throw new Error(`CSV pada "${file.name}" tidak sesuai format soal: ${pesanError(error)}`);
  }
}

function imporTeksTakDikenal(file: File, text: string): HasilImporSoal {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  const header = rows[0]?.map((cell) => cell.toLowerCase().replace(/\s+/g, "_")) ?? [];
  const sepertiCsv = HEADER_CSV.every((column) => header.includes(column));
  const sepertiTxt = /^(?:soal\s*)?\d+[.)]\s+\S/mi.test(text)
    && /^[A-Da-d][.)]\s+\S/m.test(text)
    && /^(?:jawaban|kunci)\s*:\s*[A-Da-d]\b/mi.test(text);
  if (!sepertiCsv && !sepertiTxt) {
    throw new Error(`Format file "${file.name}" tidak dikenali. Gunakan PDF, DOCX, XLSX/XLS, CSV, TXT, JSON, HTML, atau RTF dengan format soal yang didukung.`);
  }
  try {
    if (sepertiCsv) return imporCsvFile(file, text);
    const normalized = normalisasiBaris(text);
    return { soal: imporTeks(normalized), teks: normalized, namaFile: file.name, format: "TEKS" };
  } catch (error) {
    throw new Error(`Format soal pada file teks "${file.name}" tidak valid: ${pesanError(error)}`);
  }
}

const FORMAT_EXTENSI: Record<string, string> = {
  pdf: "PDF", docx: "DOCX", xlsx: "EXCEL", xls: "EXCEL", csv: "CSV",
  txt: "TXT", text: "TXT", json: "JSON", html: "HTML", htm: "HTML", rtf: "RTF",
};
const FORMAT_MIME: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "EXCEL",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "EXCEL",
  "text/csv": "CSV",
  "text/plain": "TEKS",
  "application/json": "JSON",
  "text/html": "HTML",
  "application/rtf": "RTF",
  "text/rtf": "RTF",
};

export async function bacaFileSoal(file: File): Promise<HasilImporSoal> {
  if (file.size === 0) throw new Error(`File "${file.name}" kosong.`);
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  if (extension === "doc") {
    throw new Error("Format .doc legacy tidak didukung. Buka file di Word, lalu simpan ulang sebagai DOCX sebelum diimpor.");
  }
  const format = FORMAT_EXTENSI[extension] ?? FORMAT_MIME[(file.type ?? "").toLowerCase()] ?? "TEKS";
  const dokumen = ["PDF", "DOCX", "EXCEL"].includes(format);
  const batas = dokumen ? MAKS_DOKUMEN : MAKS_TEKS;
  if (file.size > batas) {
    throw new Error(`Ukuran file ${format} melebihi batas ${dokumen ? "10 MB untuk dokumen" : "1 MB untuk teks"}.`);
  }

  if (format === "PDF") return hasilTeks(file, format, await bacaPdf(file), true);
  if (format === "DOCX") return hasilTeks(file, format, await bacaDocx(file), true);
  if (format === "EXCEL") return bacaExcel(file);

  const text = await decodeUtf8(file, format);
  if (format === "JSON") return imporJson(file, text);
  if (format === "CSV") return imporCsvFile(file, text);
  if (format === "RTF") {
    if (!/^\s*\{\\rtf/i.test(text)) throw new Error(`RTF pada "${file.name}" tidak valid.`);
    return hasilTeks(file, format, rtfKeTeks(text), true);
  }
  if (format === "HTML") return hasilTeks(file, format, htmlKeTeks(text), true);
  if (extension === "txt" || extension === "text") {
    const normalized = normalisasiBaris(text);
    try {
      return { soal: imporTeks(normalized), teks: normalized, namaFile: file.name, format };
    } catch (error) {
      throw new Error(`TXT pada "${file.name}" tidak sesuai format soal: ${pesanError(error)}`);
    }
  }
  return imporTeksTakDikenal(file, text);
}
