"use client";

import { useState, useEffect } from "react";

// Types
export type AkunUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status: boolean;
  created_at: string;
};

export type RoleUser = "administrator" | "operator" | "instruktur";

// Mock data - akan diganti dengan API call nanti
const [users, setUsers] = useState<AkunUser[]>([]);
const [roles, setRoles] = useState<RoleUser[]>(["administrator", "operator", "instruktur"]);

// Fungsi ambil user per role
export function ambilUserPerRole(role: RoleUser): Promise<AkunUser[]> {
  return new Promise((resolve) => {
    // Simulasi delay jaringan
    setTimeout(() => {
      const filtered = users.filter((u) => u.role === role);
      resolve(filtered);
    }, 500);
  });
}

// Fungsi daftar role
export function daftarRole(): Promise<RoleUser[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...roles]);
    }, 300);
  });
}

// Fungsi reset password
export function resetPassword(userId: number, passwordBaru: string): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Password untuk user ID ${userId} berhasil diatur menjadi: ${passwordBaru}`,
      });
    }, 800);
  });
}

// Ekspor state untuk digunakan di komponen
export { users, setUsers };