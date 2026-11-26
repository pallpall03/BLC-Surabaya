import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Master Data Materi | Koordinator BLC Surabaya",
};

export default function KoordinatorPage() {
  redirect("/koordinator/master_data/materi");
}
