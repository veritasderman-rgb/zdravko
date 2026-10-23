"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * Rozvržení veřejné čtečky studie: osnova vlevo (sbalitelná), text uprostřed (max. 70 znaků),
 * pravý sloupec volný pro komentáře ve 2. fázi. Aktuální kapitolu zvýrazní IntersectionObserver
 * přes `aria-current="location"` na odkazu v osnově. Na mobilu otevře osnovu tlačítko „Obsah“.
 */
export function StudyReader({ outline, headingKeys, children }: { outline: ReactNode; headingKeys: string[]; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Sledování aktuální kapitoly: nadpis, který vstoupí do horní čtvrtiny okna, je aktivní.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = headingKeys.map((k) => document.getElementById(k)).filter((e): e is HTMLElement => e !== null);
    if (els.length === 0) return;
    const index = new Map(els.map((e, i) => [e.id, i]));
    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (entering.length > 0) {
          setActive(entering[0].target.id);
          return;
        }
        // Při posunu nahoru nadpis opustí pásmo směrem dolů: aktivní je pak předchozí kapitola.
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top > (e.rootBounds?.bottom ?? 0)) {
            const i = index.get(e.target.id) ?? 0;
            setActive((cur) => (cur === e.target.id ? (i > 0 ? els[i - 1].id : null) : cur));
          }
        }
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [headingKeys]);

  // Zvýraznění v osnově (desktop i mobilní panel).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const suffix = active ? `#${encodeURIComponent(active)}` : null;
    root.querySelectorAll<HTMLAnchorElement>("[data-outline] a[href]").forEach((a) => {
      if (suffix && a.getAttribute("href")?.endsWith(suffix)) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }, [active, panelOpen, collapsed]);

  // Mobilní panel: fokus dovnitř, Escape zavře, fokus zpět na tlačítko.
  useEffect(() => {
    if (!panelOpen) return;
    const opener = openBtnRef.current;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [panelOpen]);

  const closeOnLink = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) setPanelOpen(false);
  };

  // Větší čtecí písmo osnovy na veřejném webu; nadpisy se zalamují místo zkracování.
  const outlineSkin = "[&_nav>div]:text-[15px] [&_nav]:text-[16px] [&_nav]:leading-snug [&_a]:py-1.5 [&_a_span]:whitespace-normal";

  return (
    <div ref={rootRef} className="study-reader">
      {/* Mobil: tlačítko Obsah */}
      <div className="study-toc-bar sticky top-0 z-10 border-b border-line bg-sand/95 py-2 lg:hidden">
        <div className="mx-auto max-w-[1200px] px-[clamp(16px,4vw,40px)]">
          <button
            ref={openBtnRef}
            type="button"
            onClick={() => setPanelOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={panelOpen}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-forest px-5 text-[17px] font-bold text-forest hover:bg-sage-soft"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Obsah
          </button>
        </div>
      </div>

      {panelOpen && (
        <div role="dialog" aria-modal="true" aria-label="Obsah studie" className="study-toc-panel fixed inset-0 z-50 overflow-y-auto bg-sand px-5 pb-10 pt-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-serif text-[24px] font-semibold text-ink">Obsah studie</span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Zavřít obsah"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-forest text-forest hover:bg-sage-soft"
            >
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div data-outline onClick={closeOnLink} className={outlineSkin}>
            {outline}
          </div>
        </div>
      )}

      <div
        className={`mx-auto grid max-w-[1400px] grid-cols-1 px-[clamp(16px,4vw,40px)] ${
          collapsed ? "lg:grid-cols-[64px_minmax(0,1fr)] xl:grid-cols-[64px_minmax(0,1fr)_240px]" : "lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_240px]"
        }`}
      >
        <aside className="study-outline hidden border-r border-line py-6 pr-4 lg:sticky lg:top-0 lg:block lg:max-h-screen lg:self-start lg:overflow-y-auto">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-controls="studie-osnova"
            aria-label={collapsed ? "Zobrazit osnovu" : "Skrýt osnovu"}
            className="mb-3 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-strong px-3 text-[15px] font-semibold text-ink hover:bg-sage-soft"
          >
            <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={collapsed ? "rotate-180" : ""}>
              <path d="m15 6-6 6 6 6" />
            </svg>
            {!collapsed && <span>Skrýt osnovu</span>}
          </button>
          <div id="studie-osnova" data-outline hidden={collapsed} className={outlineSkin}>
            {outline}
          </div>
        </aside>
        <div className="min-w-0 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
