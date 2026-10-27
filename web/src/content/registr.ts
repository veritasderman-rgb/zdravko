import registr from "@/content/registr.json";

/** Opatření studie z registru (Příloha A): kód a název, pro výběr návazností v návrhu opatření. */
export const REGISTRY: { code: string; label: string; area: string }[] = registr.map((r) => ({ code: r.code, label: r.label, area: r.area }));
export const REGISTRY_CODES: readonly string[] = REGISTRY.map((r) => r.code);
export const REGISTRY_LABEL = new Map(REGISTRY.map((r) => [r.code, r.label]));
