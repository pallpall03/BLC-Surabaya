import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const frontendDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const workerFile = "pdf.worker.min.mjs";

// Simpan worker sebagai aset publik agar URL-nya stabil pada Turbopack,
// mode produksi, dan static export tanpa mengimpor worker sebagai modul JS.
const source = join(dirname(require.resolve("pdfjs-dist/package.json")), "build", workerFile);
const destinationDir = join(frontendDir, "public", "pdfjs");
mkdirSync(destinationDir, { recursive: true });
copyFileSync(source, join(destinationDir, workerFile));
