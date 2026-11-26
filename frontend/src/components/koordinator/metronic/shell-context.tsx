"use client";

import { createContext, useContext } from "react";

type ShellContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

export const ShellContext = createContext<ShellContextValue>({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useShell = () => useContext(ShellContext);
