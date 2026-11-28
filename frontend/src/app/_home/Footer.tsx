"use client";

import { useEffect, useRef, useState } from "react";
import { X, Menu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-600">
            <span>BLC Surabaya</span> &copy; {new Date().getFullYear()}
          </div>
          <nav className="flex gap-6 text-sm text-slate-500">
            <a href="#informasi" className="hover:text-slate-700 transition">Informasi</a>
            <a href="#tentang" className="hover:text-slate-700 transition">Tentang</a>
            <a href="#kontak" className="hover:text-slate-700 transition">Kontak</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}