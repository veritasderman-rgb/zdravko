"use client";

/**
 * Vstupy kalkulaček (zadání kap. 5.3, Calculator): stepper −/+ s číselným polem, posuvník
 * s viditelnou hodnotou a výstup s aria-live. Re-exportují se z blocks.tsx.
 * Vstupy mají data-ui, aby na ně nepůsobil starý globální styl formulářů interní části.
 */

const ROUND_BTN =
  "grid size-[52px] shrink-0 place-items-center rounded-full border-2 border-forest bg-paper text-[26px] font-bold leading-none text-forest transition-colors hover:bg-sage-soft aria-disabled:cursor-not-allowed aria-disabled:border-line aria-disabled:bg-line aria-disabled:text-muted";

export function Stepper({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={id} className="text-[17px] font-semibold leading-snug sm:text-lg">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" aria-label={`Snížit hodnotu o ${step}`} aria-controls={id} className={ROUND_BTN} aria-disabled={value <= min} onClick={() => value > min && onChange(clamp(value - step))}>
          <span aria-hidden="true">−</span>
        </button>
        <input
          data-ui
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            if (e.target.value === "") return;
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onChange(clamp(v));
          }}
          className="h-[52px] w-20 rounded-[10px] border-2 border-[#8A8172] bg-white text-center text-[22px] font-bold text-ink [appearance:textfield] sm:w-[88px] sm:text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button type="button" aria-label={`Zvýšit hodnotu o ${step}`} aria-controls={id} className={ROUND_BTN} aria-disabled={value >= max} onClick={() => value < max && onChange(clamp(value + step))}>
          <span aria-hidden="true">+</span>
        </button>
        {unit && <span className="text-base text-muted sm:text-lg">{unit}</span>}
      </div>
    </div>
  );
}

export function RangeInput({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const shown = format ? format(value) : value.toLocaleString("cs-CZ");
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="text-[17px] font-semibold leading-snug sm:text-lg">
          {label}
        </label>
        <output htmlFor={id} className="font-serif text-2xl font-semibold tabular-nums">
          {shown}
        </output>
      </div>
      <input
        data-ui
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={shown}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
      />
    </div>
  );
}

/** Výstup kalkulačky: serif „asi 240 Kč“ a věta; změny oznamuje čtečce (aria-live="polite"). */
export function CalcOutput({ value, text }: { value: string; text: string }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="flex flex-col gap-0.5 rounded-[12px] bg-paper p-4 sm:gap-1 sm:rounded-[14px] sm:px-6 sm:py-[22px]">
      <p className="font-serif text-[40px] font-semibold leading-[1.05] tabular-nums sm:text-[52px]">{value}</p>
      <p className="text-base text-muted sm:text-lg">{text}</p>
    </div>
  );
}
