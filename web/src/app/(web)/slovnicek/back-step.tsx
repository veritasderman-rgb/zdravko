"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Obal pro pruh „Další krok“, jehož odkaz vede na „/“ jako zálohu: když má prohlížeč kam se vrátit,
 * klik místo toho zavolá history.back() a čtenář se vrátí tam, odkud přišel.
 */
export function BackStep({ children }: { children: ReactNode }) {
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (window.history.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      window.history.back();
    }
  };
  return <div onClickCapture={onClickCapture}>{children}</div>;
}
