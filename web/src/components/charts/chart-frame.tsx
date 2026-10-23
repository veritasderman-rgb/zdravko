"use client";

import { useId, useState, type ReactNode } from "react";
import { Chip } from "@/components/web/ui";

/**
 * Rámec grafu: titulek-tvrzení (co z grafu plyne), podtitulek s definicí, zdroj s rokem
 * a přepínač Graf / Tabulka. Tabulka nahradí graf ve stejném rámu (není schovaná pod ním).
 * `verify` přidá čip „Ověřujeme“, jen pokud je číslo v registru Ověřit.
 */
export function ChartFrame({
  title,
  subtitle,
  source,
  verify = false,
  table,
  children,
}: {
  title: string;
  subtitle?: string;
  source?: string;
  verify?: boolean;
  table?: ReactNode;
  children: ReactNode;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const id = useId();
  const showTable = view === "table" && table != null;

  return (
    <figure className="chart-frame flex min-w-0 flex-col gap-4 rounded-card border border-line bg-paper p-5 md:p-7" aria-labelledby={`${id}-t`}>
      <figcaption className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <span className="flex flex-col gap-1.5">
          <span id={`${id}-t`} className="font-serif text-[21px] font-semibold leading-[1.25] text-ink md:text-2xl">{title}</span>
          {subtitle && <span className="text-base text-muted">{subtitle}</span>}
        </span>
        {table != null && (
          <span role="group" aria-label="Zobrazení" className="chart-toggle inline-flex shrink-0 self-start overflow-hidden rounded-full border border-line-strong">
            <button
              type="button"
              aria-pressed={view === "chart"}
              onClick={() => setView("chart")}
              className={`min-h-11 px-4 text-[15px] font-semibold ${view === "chart" ? "bg-ink text-on-dark" : "bg-transparent text-ink hover:bg-sage-soft"}`}
            >
              Graf
            </button>
            <button
              type="button"
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
              className={`min-h-11 px-4 text-[15px] font-semibold ${view === "table" ? "bg-ink text-on-dark" : "bg-transparent text-ink hover:bg-sage-soft"}`}
            >
              Tabulka
            </button>
          </span>
        )}
      </figcaption>

      <div className="min-w-0 font-sans">{showTable ? table : children}</div>

      {(source || verify) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6DFD1] pt-3 text-[14px] leading-snug text-muted md:text-[15px]">
          {source && <span>Zdroj: {source}</span>}
          {verify && <Chip variant="verify" />}
        </div>
      )}
    </figure>
  );
}
