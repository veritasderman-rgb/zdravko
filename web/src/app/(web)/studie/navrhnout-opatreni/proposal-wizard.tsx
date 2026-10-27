"use client";

import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import { addProposal, type ActionState } from "@/app/actions";
import { STEPS, answerText, isVisible, stepErrors, type Answers, type Field } from "@/content/navrh-opatreni";

type Measure = { code: string; label: string; area: string };

const DRAFT_KEY = "navrh-opatreni-v1";
const INPUT = "w-full rounded-[10px] border-2 border-line-strong bg-paper px-4 py-3 text-[18px] text-ink focus:border-forest";
const SUMMARY_STEP = STEPS.length;

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Výběr opatření studie z registru: hledání podle kódu nebo slova, vybraná opatření jako štítky. */
function CodePicker({ field, value, onChange, measures, invalid, describedBy }: { field: Field; value: string[]; onChange: (v: string[]) => void; measures: Measure[]; invalid: boolean; describedBy: string }) {
  const [q, setQ] = useState("");
  const id = useId();
  const found = useMemo(() => {
    const t = fold(q.trim());
    if (t.length < 1) return [];
    return measures.filter((m) => fold(`${m.code} ${m.label}`).includes(t) && !value.includes(m.code)).slice(0, 8);
  }, [q, measures, value]);
  const label = (c: string) => measures.find((m) => m.code === c)?.label ?? "";
  const full = value.length >= field.max;
  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Vybraná opatření">
          {value.map((c) => (
            <li key={c} className="inline-flex max-w-full items-center gap-2 rounded-full border border-forest bg-sage-soft py-1 pl-3 pr-1 text-[16px] text-ink">
              <span className="font-mono text-[14px] font-semibold text-forest">{c}</span>
              <span className="truncate">{label(c)}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== c))}
                aria-label={`Odebrat ${c}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-forest hover:bg-paper"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!full && (
        <>
          <input
            id={`${field.id}-pole`}
            data-ui
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hledat opatření: kód nebo slovo"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            aria-controls={`${id}-list`}
            autoComplete="off"
            className={INPUT}
          />
          <ul id={`${id}-list`} className="flex flex-col gap-1.5" aria-live="polite">
            {found.map((m) => (
              <li key={m.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...value, m.code]);
                    setQ("");
                  }}
                  className="flex min-h-11 w-full items-start gap-3 rounded-card border border-line bg-paper px-4 py-2.5 text-left text-[16px] hover:border-forest hover:bg-sage-soft"
                >
                  <span className="w-16 shrink-0 font-mono text-[14px] font-semibold text-forest">{m.code}</span>
                  <span className="text-ink">{m.label}</span>
                </button>
              </li>
            ))}
            {q.trim() && found.length === 0 && <li className="text-[16px] text-muted">Nic takového v registru opatření není. Zkuste jiné slovo nebo vazbu popište slovy.</li>}
          </ul>
        </>
      )}
      {full && <p className="text-[16px] text-muted">Vybrali jste nejvíc opatření, kolik pole dovoluje ({field.max}).</p>}
    </div>
  );
}

function FieldInput({ field, a, set, error, measures }: { field: Field; a: Answers; set: (id: string, v: string | string[]) => void; error?: string; measures: Measure[] }) {
  const id = `${field.id}-pole`;
  const hintId = `${field.id}-napoveda`;
  const errId = `${field.id}-chyba`;
  const describedBy = [field.hint || field.example ? hintId : "", error ? errId : ""].filter(Boolean).join(" ") || undefined;
  const v = a[field.id];
  const str = typeof v === "string" ? v : "";
  const arr = Array.isArray(v) ? v : [];
  const group = field.type === "radio" || field.type === "multi";
  const optional = !field.required && <span className="font-normal text-muted"> (nepovinné)</span>;

  const labelEl = group ? (
    <legend className="mb-1 text-[19px] font-semibold leading-snug text-ink">
      {field.label}
      {optional}
    </legend>
  ) : (
    <label htmlFor={id} className="mb-1 block text-[19px] font-semibold leading-snug text-ink">
      {field.label}
      {optional}
    </label>
  );

  const help = (field.hint || field.example) && (
    <div id={hintId} className="mb-3 flex flex-col gap-2 text-[16px] leading-relaxed text-muted">
      {field.hint && <p>{field.hint}</p>}
      {field.example && (
        <p className="rounded-card border-l-4 border-sage bg-paper px-4 py-2 text-ink-2">
          <span className="font-semibold text-ink">Například: </span>
          {field.example}
        </p>
      )}
    </div>
  );

  let control: React.ReactNode;
  if (field.type === "textarea") {
    const left = field.min ? field.min - str.trim().length : 0;
    control = (
      <>
        <textarea
          id={id}
          data-ui
          value={str}
          onChange={(e) => set(field.id, e.target.value)}
          rows={field.max > 2000 ? 8 : 5}
          maxLength={field.max}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={`${INPUT} leading-relaxed`}
        />
        <p className="mt-1 text-right text-[14px] text-muted">
          {field.min && left > 0 ? `Ještě aspoň ${left} znaků · ` : ""}
          {str.length} / {field.max}
        </p>
      </>
    );
  } else if (field.type === "text" || field.type === "email") {
    control = (
      <input
        id={id}
        data-ui
        type={field.type}
        value={str}
        onChange={(e) => set(field.id, e.target.value)}
        maxLength={field.max}
        autoComplete={field.type === "email" ? "email" : field.id === "name" ? "name" : field.id === "organization" ? "organization" : "off"}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        className={INPUT}
      />
    );
  } else if (field.type === "select") {
    control = (
      <select id={id} data-ui value={str} onChange={(e) => set(field.id, e.target.value)} aria-invalid={!!error || undefined} aria-describedby={describedBy} className={INPUT}>
        <option value="">Vyberte…</option>
        {field.options?.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    );
  } else if (group) {
    const multi = field.type === "multi";
    control = (
      <div className={`grid gap-2 ${field.options && field.options.length > 6 ? "sm:grid-cols-2" : ""}`}>
        {field.options?.map((o, i) => {
          const checked = multi ? arr.includes(o.v) : str === o.v;
          return (
            <label
              key={o.v}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-card border-2 px-4 py-3 text-[17px] leading-snug ${checked ? "border-forest bg-sage-soft" : "border-line bg-paper hover:border-line-strong"}`}
            >
              <input
                data-ui
                id={i === 0 ? id : undefined}
                type={multi ? "checkbox" : "radio"}
                name={field.id}
                value={o.v}
                checked={checked}
                onChange={() => {
                  if (!multi) return set(field.id, o.v);
                  // „Nevím“ se s ostatními volbami vylučuje.
                  if (o.v === "nevim") return set(field.id, checked ? [] : ["nevim"]);
                  const rest = arr.filter((x) => x !== "nevim");
                  set(field.id, checked ? rest.filter((x) => x !== o.v) : [...rest, o.v]);
                }}
                aria-describedby={describedBy}
                className="mt-1 size-5 shrink-0 accent-forest"
              />
              <span>
                <span className="text-ink">{o.l}</span>
                {o.hint && <span className="mt-0.5 block text-[15px] text-muted">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    );
  } else {
    control = <CodePicker field={field} value={arr} onChange={(x) => set(field.id, x)} measures={measures} invalid={!!error} describedBy={describedBy ?? ""} />;
  }

  const inner = (
    <>
      {labelEl}
      {help}
      {control}
      {error && (
        <p id={errId} className="mt-2 text-[16px] font-semibold text-danger">
          {error}
        </p>
      )}
    </>
  );
  return group ? (
    <fieldset id={`${field.id}-skupina`} aria-invalid={!!error || undefined} className="min-w-0">
      {inner}
    </fieldset>
  ) : (
    <div className="min-w-0">{inner}</div>
  );
}

/**
 * Průvodce návrhem nového opatření: kroky z definice otázek (src/content/navrh-opatreni.ts),
 * kontrola každého kroku před pokračováním, souhrn s možností opravit kterýkoli krok a odeslání.
 * Rozpracovaný návrh se průběžně ukládá jen v prohlížeči (localStorage), po odeslání se smaže.
 */
export function ProposalWizard({ documentId, versionId, measures }: { documentId: number; versionId: number; measures: Measure[] }) {
  const [a, setA] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [restored, setRestored] = useState(false);
  const [ts] = useState(() => Date.now());
  const [state, action, pending] = useActionState<ActionState, FormData>(addProposal, {});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const codes = useMemo(() => new Set(measures.map((m) => m.code)), [measures]);

  // Obnovení rozpracovaného návrhu.
  useEffect(() => {
    let saved: { a?: Answers; step?: number; visited?: number } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    } catch {
      saved = null;
    }
    if (!saved?.a || Object.keys(saved.a).length === 0) return;
    const t = window.setTimeout(() => {
      setA(saved.a ?? {});
      setStep(Math.min(saved.step ?? 0, SUMMARY_STEP));
      setVisited(Math.min(saved.visited ?? 0, SUMMARY_STEP));
      setRestored(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Průběžné uložení (jen v tomto prohlížeči).
  useEffect(() => {
    if (state.ok) return;
    const t = window.setTimeout(() => {
      try {
        if (Object.keys(a).length) localStorage.setItem(DRAFT_KEY, JSON.stringify({ a, step, visited }));
      } catch {
        // Bez úložiště se návrh jen neuloží rozpracovaný.
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [a, step, visited, state.ok]);

  useEffect(() => {
    if (!state.ok) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // nic
    }
  }, [state.ok]);

  // Po přechodu na jiný krok fokus na jeho nadpis (čtečky obrazovky ho přečtou).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  const set = (id: string, v: string | string[]) => {
    setA((prev) => ({ ...prev, [id]: v }));
    if (errors[id]) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== id)));
  };

  const go = (to: number) => {
    setErrors({});
    setStep(to);
    setVisited((v) => Math.max(v, to));
  };

  const next = () => {
    const errs = stepErrors(STEPS[step], a, codes);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = STEPS[step].fields.find((f) => errs[f.id]);
      if (first) window.setTimeout(() => document.getElementById(`${first.id}-pole`)?.focus(), 0);
      return;
    }
    go(step + 1);
  };

  const reset = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // nic
    }
    setA({});
    setRestored(false);
    go(0);
    setVisited(0);
  };

  if (state.ok) {
    return (
      <div role="status" className="rounded-panel border border-line bg-sage-soft p-6 sm:p-8">
        <h2 className="font-serif text-[28px] font-semibold leading-tight text-ink">Děkujeme za návrh. Ještě ho prosím potvrďte v e-mailu.</h2>
        <p className="mt-3 text-[18px] leading-relaxed text-ink-2">
          Poslali jsme vám odkaz k potvrzení a v e-mailu je i celý návrh. K resortnímu týmu se dostane, až na odkaz kliknete; odkaz platí 7 dní. Když e-mail nepřijde, zkontrolujte i nevyžádanou poštu.
        </p>
        <button type="button" onClick={() => window.location.reload()} className="mt-5 inline-flex min-h-12 items-center rounded-full border-2 border-forest px-6 text-[17px] font-bold text-forest hover:bg-paper">
          Navrhnout další opatření
        </button>
      </div>
    );
  }

  const label = (c: string) => measures.find((m) => m.code === c)?.label;
  const errorList = STEPS[step] ? STEPS[step].fields.filter((f) => errors[f.id]) : [];
  const allStepsValid = STEPS.every((s) => Object.keys(stepErrors(s, a, codes)).length === 0);

  return (
    <div className="flex flex-col gap-8">
      {restored && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-paper px-5 py-4 text-[17px]">
          <span>Pokračujete v rozpracovaném návrhu uloženém v tomto prohlížeči.</span>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 font-semibold text-ink hover:border-forest hover:bg-sage-soft">
            Začít znovu
          </button>
        </div>
      )}

      <nav aria-label="Kroky návrhu">
        <p className="mb-3 text-[16px] font-semibold text-muted">
          {step < SUMMARY_STEP ? `Krok ${step + 1} z ${SUMMARY_STEP + 1}` : `Krok ${SUMMARY_STEP + 1} z ${SUMMARY_STEP + 1}: souhrn`}
        </p>
        <ol className="flex flex-wrap gap-2">
          {[...STEPS.map((s) => s.title), "Souhrn a odeslání"].map((t, i) => {
            const current = i === step;
            const reachable = i <= visited;
            return (
              <li key={t}>
                <button
                  type="button"
                  disabled={!reachable || current}
                  onClick={() => go(i)}
                  aria-current={current ? "step" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold ${
                    current ? "border-forest bg-forest text-on-dark" : reachable ? "border-line-strong bg-paper text-ink hover:border-forest hover:bg-sage-soft" : "border-line bg-transparent text-muted"
                  }`}
                >
                  <span className="tabular-nums">{i + 1}.</span>
                  <span className="hidden sm:inline">{t}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {step < SUMMARY_STEP ? (
        <section aria-labelledby="krok-nadpis" className="flex flex-col gap-8 rounded-panel border border-line bg-sand p-5 sm:p-8">
          <div>
            <h2 id="krok-nadpis" ref={headingRef} tabIndex={-1} className="scroll-mt-6 font-serif text-[28px] font-semibold leading-tight text-ink sm:text-[32px]">
              {STEPS[step].title}
            </h2>
            <p className="mt-2 max-w-[42em] text-[18px] leading-relaxed text-ink-2">{STEPS[step].intro}</p>
          </div>

          {errorList.length > 0 && (
            <div role="alert" className="rounded-card border-2 border-danger bg-paper px-5 py-4 text-[17px]">
              <p className="font-semibold text-ink">Než budete pokračovat, doplňte prosím:</p>
              <ul className="mt-2 list-disc pl-5">
                {errorList.map((f) => (
                  <li key={f.id}>
                    <a href={`#${f.id}-pole`} className="underline">
                      {f.label}
                    </a>
                    : {errors[f.id]}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {STEPS[step].fields
            .filter((f) => isVisible(f, a))
            .map((f) => (
              <FieldInput key={f.id} field={f} a={a} set={set} error={errors[f.id]} measures={measures} />
            ))}

          <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6">
            {step > 0 ? (
              <button type="button" onClick={() => go(step - 1)} className="inline-flex min-h-12 items-center rounded-full border-2 border-forest px-6 text-[17px] font-bold text-forest hover:bg-sage-soft">
                ← Zpět
              </button>
            ) : (
              <span />
            )}
            <button type="button" onClick={next} className="inline-flex min-h-12 items-center rounded-full bg-forest px-7 text-[17px] font-bold text-on-dark hover:bg-forest-deep">
              {step === SUMMARY_STEP - 1 ? "Zkontrolovat návrh →" : "Pokračovat →"}
            </button>
          </div>
        </section>
      ) : (
        <section aria-labelledby="krok-nadpis" className="flex flex-col gap-6 rounded-panel border border-line bg-sand p-5 sm:p-8">
          <div>
            <h2 id="krok-nadpis" ref={headingRef} tabIndex={-1} className="scroll-mt-6 font-serif text-[28px] font-semibold leading-tight text-ink sm:text-[32px]">
              Zkontrolujte návrh a odešlete ho
            </h2>
            <p className="mt-2 max-w-[42em] text-[18px] leading-relaxed text-ink-2">Takhle návrh uvidí resortní tým. Cokoli můžete opravit tlačítkem „Upravit“ u příslušné části.</p>
          </div>

          {STEPS.map((s, i) => {
            const shown = s.fields.filter((f) => isVisible(f, a) && answerText(f, a, label));
            return (
              <div key={s.id} className="rounded-card border border-line bg-paper p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-serif text-[22px] font-semibold text-ink">{s.title}</h3>
                  <button type="button" onClick={() => go(i)} className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-[15px] font-semibold text-ink hover:border-forest hover:bg-sage-soft">
                    Upravit
                  </button>
                </div>
                {shown.length === 0 ? (
                  <p className="text-[16px] text-muted">Nevyplněno.</p>
                ) : (
                  <dl className="flex flex-col gap-3">
                    {shown.map((f) => (
                      <div key={f.id}>
                        <dt className="text-[15px] font-semibold text-muted">{f.label}</dt>
                        <dd className="whitespace-pre-wrap text-[17px] leading-relaxed text-ink">{answerText(f, a, label)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            );
          })}

          <form action={action} className="flex flex-col gap-4">
            <input data-ui type="hidden" name="documentId" value={documentId} />
            <input data-ui type="hidden" name="versionId" value={versionId} />
            <input data-ui type="hidden" name="ts" value={ts} />
            <input data-ui type="hidden" name="answers" value={JSON.stringify(a)} />
            {/* Past na roboty: člověk pole nevidí a nevyplní. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="navrh-web">Nevyplňujte</label>
              <input data-ui id="navrh-web" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <p className="text-[16px] leading-relaxed text-muted">
              Odesláním souhlasíte, že vás můžeme kontaktovat kvůli upřesnění návrhu. Jméno ani e-mail nezveřejňujeme; jak s údaji zacházíme, popisuje{" "}
              <a href="/ochrana-udaju" className="underline">
                stránka o ochraně údajů
              </a>
              .
            </p>
            {!allStepsValid && <p className="text-[17px] font-semibold text-danger">Některý krok ještě není kompletní. Projděte prosím kroky výše a doplňte povinné odpovědi.</p>}
            {state.error && (
              <p role="alert" className="text-[17px] font-semibold text-danger">
                {state.error}
              </p>
            )}
            <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6">
              <button type="button" onClick={() => go(SUMMARY_STEP - 1)} className="inline-flex min-h-12 items-center rounded-full border-2 border-forest px-6 text-[17px] font-bold text-forest hover:bg-sage-soft">
                ← Zpět
              </button>
              <button type="submit" disabled={pending || !allStepsValid} className="inline-flex min-h-12 items-center rounded-full bg-forest px-7 text-[17px] font-bold text-on-dark hover:bg-forest-deep disabled:opacity-60">
                {pending ? "Odesílám…" : "Odeslat návrh"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
