import { VERDICT_CLASS, VERDICT_LABEL, evidenceLinks, topVerdict, type OvereniRecord } from "@/content/overeni-hspa";

/**
 * Doložení místa studie v HSPA Monitoru: štítek s verdiktem a odkazy na článek nebo indikátor.
 * `dense` je interní čtečka a registry (malé písmo), jinak veřejná čtečka. Nepublikované články
 * HSPA (koncepty) se neodkazují. U rozporu se ukáže i poznámka, co HSPA uvádí jinak.
 */
export function HspaEvidence({ records, dense = false, max = 3, className = "" }: { records: OvereniRecord[]; dense?: boolean; max?: number; className?: string }) {
  if (!records.length) return null;
  const verdict = topVerdict(records);
  if (!verdict) return null;
  const links = evidenceLinks(records, max);
  const contradiction = records.find((r) => r.verdict === "rozpor");
  const note = contradiction?.note ?? (links.length === 0 ? records[0].note : null);
  const text = dense ? "text-[11px]" : "text-[14px]";
  return (
    <div className={`${dense ? "mt-1 opacity-80 group-hover:opacity-100" : "mt-2"} flex flex-wrap items-center gap-x-3 gap-y-0 ${text} leading-5 text-muted ${className}`}>
      <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 font-semibold ${VERDICT_CLASS[verdict]}`} title="HSPA Monitor (skorezdravotnictvi.cz), pomůcka k ověření; není zdrojem hodnocení reformy">
        {VERDICT_LABEL[verdict]}
      </span>
      {links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={`underline decoration-line-strong underline-offset-2 hover:text-ink ${dense ? "" : "inline-flex min-h-8 items-center"}`}>
          {l.kind === "indicator" ? `Indikátor: ${l.label}` : l.label}
        </a>
      ))}
      {note && <span className="basis-full">{note.length > 240 ? `${note.slice(0, 237)}…` : note}</span>}
    </div>
  );
}
