"use client";
import { createContext, useContext } from "react";

type ShellCtx = { mobileOpen: boolean; setMobileOpen: (v: boolean) => void };

export const ShellContext = createContext<ShellCtx>({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useShell = () => useContext(ShellContext);