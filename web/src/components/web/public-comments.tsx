"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { PublicCommentForm } from "./public-comment-form";

/**
 * Obal veřejné čtečky: zachytí kliknutí na tlačítka „Připomínka“ u odstavců
 * (`data-comment-for`) a otevře dialog s formulářem navázaným na daný blok.
 */
export function PublicComments({ documentId, versionId, children }: { documentId: number; versionId: number; children: ReactNode }) {
  const [target, setTarget] = useState<{ blockKey: string; quote: string } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-comment-for]");
    if (!btn) return;
    openerRef.current = btn;
    setTarget({ blockKey: btn.dataset.commentFor ?? "", quote: btn.dataset.commentQuote ?? "" });
  };

  useEffect(() => {
    if (!target) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTarget(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = openerRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, [target]);

  return (
    <div onClick={onClick}>
      {children}
      {target && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6" onClick={(e) => e.target === e.currentTarget && setTarget(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="pripominka-dialog-nadpis" className="relative max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-t-panel bg-sand p-5 sm:rounded-panel sm:p-7">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 id="pripominka-dialog-nadpis" className="font-serif text-[24px] font-semibold leading-tight text-ink">
                Připomínka k tomuto místu
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setTarget(null)}
                aria-label="Zavřít"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-forest text-forest hover:bg-sage-soft"
              >
                <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            {target.quote && (
              <blockquote className="mb-4 max-h-32 overflow-y-auto border-l-2 border-line-strong pl-3 font-serif text-[16px] italic leading-snug text-muted">
                {target.quote}
                {target.quote.length >= 300 ? "…" : ""}
              </blockquote>
            )}
            <PublicCommentForm documentId={documentId} versionId={versionId} blockKey={target.blockKey} quote={target.quote} onDone={() => setTarget(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
