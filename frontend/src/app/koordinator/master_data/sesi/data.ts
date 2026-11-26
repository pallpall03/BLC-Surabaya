export type SesiPelatihan = {
  id: string;
  nomor: number;
  jam: string;
};

export const SESI_STORAGE_KEY = "blc-koordinator-sesi-pelatihan";

export const DATA_AWAL_SESI: SesiPelatihan[] = [
  { id: "sesi-1", nomor: 1, jam: "07.30-09.00" },
  { id: "sesi-2", nomor: 2, jam: "09.00-10.30" },
  { id: "sesi-3", nomor: 3, jam: "10.30-12.00" },
  { id: "sesi-4", nomor: 4, jam: "13.00-14.30" },
  { id: "sesi-5", nomor: 5, jam: "14.30-16.00" },
];

export function bacaSesi(): SesiPelatihan[] {
  if (typeof window === "undefined") return DATA_AWAL_SESI;

  try {
    const tersimpan = sessionStorage.getItem(SESI_STORAGE_KEY);
    if (!tersimpan) {
      sessionStorage.setItem(SESI_STORAGE_KEY, JSON.stringify(DATA_AWAL_SESI));
      return DATA_AWAL_SESI;
    }

    const parsed: unknown = JSON.parse(tersimpan);
    if (!Array.isArray(parsed)) return DATA_AWAL_SESI;

    return parsed.filter((item): item is SesiPelatihan =>
      typeof item === "object"
      && item !== null
      && typeof item.id === "string"
      && Number.isInteger(item.nomor)
      && item.nomor > 0
      && typeof item.jam === "string");
  } catch {
    return DATA_AWAL_SESI;
  }
}

export function simpanSesi(items: SesiPelatihan[]): boolean {
  try {
    sessionStorage.setItem(SESI_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
