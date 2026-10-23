"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { PATIENT_JOURNEY } from "@/content/reforma";

/**
 * Cesta pacienta: záložky (WAI-ARIA Tabs, automatická aktivace) a dva panely Dnes / Po reformě.
 * Krok je sdílitelný odkazem #krok-N nebo ?krok=N (N od 1). Zdrojem pravdy je URL:
 * klik přepíše hash přes history.replaceState (bez skoku stránky).
 */

const KROK_EVENT = "zbl:krok";

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  window.addEventListener(KROK_EVENT, cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener(KROK_EVENT, cb);
  };
}

function readStepFromUrl(): number {
  const fromHash = /^#krok-(\d+)$/.exec(window.location.hash)?.[1];
  const fromQuery = new URLSearchParams(window.location.search).get("krok");
  const n = Number(fromHash ?? fromQuery ?? NaN);
  return Number.isInteger(n) && n >= 1 && n <= PATIENT_JOURNEY.length ? n : 0;
}

export function PatientJourney({ defaultStep = 1 }: { defaultStep?: number }) {
  const fromUrl = useSyncExternalStore(subscribe, readStepFromUrl, () => 0);
  const fallback = Math.min(PATIENT_JOURNEY.length, Math.max(1, defaultStep));
  const active = (fromUrl || fallback) - 1;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback((i: number, focus: boolean) => {
    const url = `${window.location.pathname}${window.location.search}#krok-${i + 1}`;
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(KROK_EVENT));
    if (focus) {
      const el = tabs.current[i];
      el?.focus();
      el?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = PATIENT_JOURNEY.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1) : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  }

  const step = PATIENT_JOURNEY[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Situace pacienta"
        className="-mx-[clamp(16px,4vw,40px)] flex gap-2 overflow-x-auto px-[clamp(16px,4vw,40px)] py-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {PATIENT_JOURNEY.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.step}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`krok-${i + 1}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="cesta-pacienta-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i, false)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-base font-semibold leading-tight transition-colors sm:px-[18px] sm:text-[17px] ${
                selected ? "border-forest bg-forest text-on-dark" : "border-line-strong bg-paper text-ink hover:border-forest"
              }`}
            >
              {s.step}
            </button>
          );
        })}
      </div>

      <div
        id="cesta-pacienta-panel"
        role="tabpanel"
        aria-labelledby={`krok-${active + 1}`}
        tabIndex={0}
        className="mt-3 grid gap-2.5 sm:mt-5 sm:gap-5 md:grid-cols-2"
      >
        <div className="flex flex-col gap-1.5 rounded-[14px] bg-stone p-5 sm:gap-3 sm:rounded-card sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.06em] text-muted sm:text-base">Dnes</p>
          <p className="text-lg leading-normal text-ink-2 sm:text-[21px]">{step.today}</p>
        </div>
        <div className="flex flex-col gap-1.5 rounded-[14px] bg-sage-soft p-5 sm:gap-3 sm:rounded-card sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.06em] text-forest sm:text-base">Po reformě</p>
          <p className="text-lg leading-normal text-ink sm:text-[21px]">{step.after}</p>
        </div>
      </div>
    </div>
  );
}
