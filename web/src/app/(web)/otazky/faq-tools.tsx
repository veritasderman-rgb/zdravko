"use client";

import { useEffect, useState } from "react";

/** Tlačítko „Kopírovat odkaz“ na jednu otázku (URL s kotvou). */
export function CopyLinkButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.location.hash = id;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-forest px-4 text-[16px] font-bold text-forest hover:bg-sage-soft"
    >
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
      </svg>
      <span aria-live="polite">{copied ? "Odkaz zkopírován" : "Kopírovat odkaz"}</span>
    </button>
  );
}

/** Otevře `<details>` podle kotvy v URL (při načtení i při změně kotvy) a posune k němu. */
export function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
