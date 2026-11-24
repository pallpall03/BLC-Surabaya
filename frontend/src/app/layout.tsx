import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLC Surabaya",
  description: "Broadband Learning Center Surabaya",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="scroll-smooth snap-y snap-proximity scroll-pt-20">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}