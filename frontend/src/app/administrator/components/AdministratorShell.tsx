"use client";

import { useEffect, useState, type ReactNode } from "react";
import PanelShell from "./PanelShell";
import type { KonfigPeran } from "./tipe";
import { konfigAdministrator, susunMenu } from "../menu-peran";
import { ambilMenu, EVENT_MENU } from "../menu/data";

export default function AdministratorShell({ children }: { children: ReactNode }) {
  const [konfig, setKonfig] = useState<KonfigPeran>(konfigAdministrator);

  useEffect(() => {
    let batal = false;

    function muat() {
      ambilMenu().then((data) => {
        if (batal) return;
        const menu = susunMenu(data, "administrator");
        if (menu.length > 0) setKonfig({ ...konfigAdministrator, menu });
      });
    }

    muat();
    window.addEventListener(EVENT_MENU, muat);
    return () => {
      batal = true;
      window.removeEventListener(EVENT_MENU, muat);
    };
  }, []);

  return <PanelShell konfig={konfig}>{children}</PanelShell>;
}
