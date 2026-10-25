import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { countPendingVerification, listComments, listDocumentsWithStats } from "@/lib/queries";
import { CHANNEL_LABEL, KIND_LABEL, PRIORITY_CLASS, PRIORITY_LABEL, SEVERITY_CLASS, SEVERITY_LABEL, STATUS_CLASS, STATUS_LABEL, fmtDate } from "@/lib/labels";
import { updateCommentStatus } from "@/app/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Připomínky" };

function one(v: string | string[] | undefined) {
  return typeof v === "string" && v ? v : undefined;
}

export default async function CommentsPage({ searchParams }: PageProps<"/pripominky">) {
  await requireSession();
  const sp = await searchParams;
  const filter = { doc: one(sp.doc), status: one(sp.status), severity: one(sp.severity), kind: one(sp.kind), code: one(sp.code), q: one(sp.q), channel: one(sp.channel), overeni: one(sp.overeni) };
  const [rows, docs, pending] = await Promise.all([listComments(filter), listDocumentsWithStats(), countPendingVerification()]);

  const exportHref = `/api/export/pripominky?${new URLSearchParams(Object.entries(filter).filter(([, v]) => v) as [string, string][]).toString()}`;

  return (
    <main className="mx-auto max-w-[1300px] px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Připomínky</h1>
          <p className="text-sm text-muted">{rows.length} záznamů{rows.length === 500 ? " (zobrazeno prvních 500)" : ""}</p>
        </div>
        <a href={exportHref} className="btn btn-ghost">Export CSV</a>
      </div>

      {filter.overeni === "ceka" ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Veřejné připomínky, které autor ještě nepotvrdil odkazem z e-mailu. Do fronty se dostanou po potvrzení; nepotvrzené se po 7 dnech smažou.{" "}
          <Link href="/pripominky" className="underline">Zpět na potvrzené</Link>
        </p>
      ) : (
        pending > 0 && (
          <p className="mt-3 text-sm text-muted">
            {pending} veřejných připomínek čeká na potvrzení e-mailem.{" "}
            <Link href="/pripominky?overeni=ceka" className="underline">Zobrazit</Link>
          </p>
        )
      )}

      <form className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-line bg-paper p-3 text-sm md:grid-cols-7">
        {filter.overeni && <input type="hidden" name="overeni" value={filter.overeni} />}
        <select name="doc" defaultValue={filter.doc ?? ""}>
          <option value="">Všechny dokumenty</option>
          {docs.map((d) => <option key={d.slug} value={d.slug}>{d.title}</option>)}
        </select>
        <select name="status" defaultValue={filter.status ?? ""}>
          <option value="">Všechny stavy</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select name="severity" defaultValue={filter.severity ?? ""}>
          <option value="">Všechny závažnosti</option>
          {Object.entries(SEVERITY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select name="kind" defaultValue={filter.kind ?? ""}>
          <option value="">Všechny typy</option>
          {Object.entries(KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select name="channel" defaultValue={filter.channel ?? ""}>
          <option value="">Tým i veřejnost</option>
          {Object.entries(CHANNEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input name="code" defaultValue={filter.code ?? ""} placeholder="Kód (J2, H5…)" />
        <div className="flex gap-2">
          <input name="q" defaultValue={filter.q ?? ""} placeholder="Hledat v textu" />
          <button className="btn" type="submit">Filtrovat</button>
        </div>
      </form>

      <ul className="mt-4 space-y-3">
        {rows.map(({ c, docSlug, docTitle, headingPath, currentBlockKey }) => (
          <li key={c.id} className="rounded-lg border border-line bg-paper p-4 text-sm">
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              <span className="font-mono text-muted">#{c.id}</span>
              <span className={`chip ${SEVERITY_CLASS[c.severity]}`}>{SEVERITY_LABEL[c.severity]}</span>
              <span className="chip">{KIND_LABEL[c.kind]}</span>
              <span className={`chip border-transparent ${STATUS_CLASS[c.status]}`}>{STATUS_LABEL[c.status]}</span>
              {c.needsVerification && <span className="chip border-amber-300 bg-amber-50 text-amber-900">Ověřit</span>}
              {c.channel === "verejnost" && <span className="chip border-sky-200 bg-sky-50 text-sky-900">veřejnost</span>}
              {c.priority !== "bezna" && <span className={`chip ${PRIORITY_CLASS[c.priority] ?? ""}`}>{PRIORITY_LABEL[c.priority] ?? c.priority}</span>}
              {c.codes.map((k) => <Link key={k} href={`/kody/${k}`} className="code-ref">{k}</Link>)}
              {c.topic && <span className="chip">téma: {c.topic}</span>}
              {c.assignee && <span className="chip">garant: {c.assignee}</span>}
            </div>
            <div className="mt-1 text-xs text-muted">
              {c.blockKey === "obecne" ? (
                <span>{docTitle} › obecná připomínka</span>
              ) : currentBlockKey ? (
                <Link href={`/d/${docSlug}?b=${encodeURIComponent(currentBlockKey)}#${encodeURIComponent(currentBlockKey)}`} className="underline">
                  {docTitle}{headingPath ? ` › ${headingPath}` : ""}
                </Link>
              ) : (
                <span>
                  {docTitle}{headingPath ? ` › ${headingPath}` : ""} · <span className="text-amber-800">text v aktuální verzi není</span>
                </span>
              )}
            </div>
            {c.quote && <div className="mt-1 border-l-2 border-line pl-2 text-xs italic text-muted">„{c.quote}“</div>}
            <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            {c.proposedText && <p className="mt-1 rounded bg-emerald-50 p-2 text-xs whitespace-pre-wrap"><b>Návrh znění:</b> {c.proposedText}</p>}
            {c.source && <p className="mt-1 text-xs text-muted">Zdroj: {c.source}</p>}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
              <span>{c.authorName}{c.organization ? ` · ${c.organization}` : ""}{c.email ? ` · ${c.email}` : ""} · {fmtDate(c.createdAt)}</span>
              <form action={updateCommentStatus} className="flex flex-wrap items-center gap-1">
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="slug" value={docSlug} />
                <select name="status" defaultValue={c.status} className="!w-auto !py-0.5 !text-[11px]">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input name="assignee" defaultValue={c.assignee ?? ""} placeholder="garant" className="!w-28 !py-0.5 !text-[11px]" />
                <input name="topic" defaultValue={c.topic ?? ""} placeholder="téma" className="!w-28 !py-0.5 !text-[11px]" />
                <select name="priority" defaultValue={c.priority} className="!w-auto !py-0.5 !text-[11px]">
                  {Object.entries(PRIORITY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className="btn !py-0.5 !px-2 !text-[11px]" type="submit">Uložit</button>
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-muted">Žádné připomínky neodpovídají filtru.</li>}
      </ul>
    </main>
  );
}
