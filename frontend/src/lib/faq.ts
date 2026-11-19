export type Faq = {
  id: number;
  pertanyaan: string;
  jawaban: string;
  aktif: boolean; // false = disembunyikan dari website publik
  urutan: number;
};

export type FormFaq = Omit<Faq, "id">;

export async function ambilFaq(): Promise<Faq[]> {
  const res = await fetch("/api/v1/faq");
  return res.json();
}

export async function simpanFaq(data: FormFaq, id?: number): Promise<Faq> {
  const res = await fetch(id ? `/api/v1/faq/${id}` : "/api/v1/faq", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function hapusFaq(id: number): Promise<void> {
  await fetch(`/api/v1/faq/${id}`, { method: "DELETE" });
}

export async function simpanUrutanFaq(idBerurutan: number[]): Promise<void> {
  await fetch("/api/v1/faq/urutan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idBerurutan }),
  });
}