"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Počítá stažení PDF: jeden posluchač pro celý web místo úprav každého odkazu. */
export function DownloadTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.origin !== window.location.origin) return;
      if (a.pathname.endsWith(".pdf")) trackEvent("Stažení", { soubor: a.pathname.slice(1), stranka: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
