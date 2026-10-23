import Link from "next/link";
import type { schema } from "@/db";
import type { Session } from "@/lib/session";
import { CommentForm } from "./comment-form";
import { ReplyForm } from "./reply-form";
import { KIND_LABEL, SEVERITY_CLASS, SEVERITY_LABEL, STATUS_CLASS, STATUS_LABEL, fmtDate } from "@/lib/labels";
import { renderInline } from "@/lib/md";

type Block = typeof schema.blocks.$inferSelect;
type Comment = typeof schema.comments.$inferSelect;
type Doc = typeof schema.documents.$inferSelect;
type Version = typeof schema.documentVersions.$inferSelect;

export function CommentPanel({ doc, version, block, comments, session, codeLabels, slug, defaultCodes }: { doc: Doc; version: Version; block: Block | null; comments: Comment[]; session: Session; codeLabels: Map<string, string | null>; slug: string; defaultCodes: string[] }) {
  if (!block) {
    return (
      <div className="text-sm text-muted">
        <h2 className="mb-2 text-base font-semibold text-foreground">Připomínky</h2>
        <p>Klikněte na ikonu 💬 u odstavce, tabulky nebo odrážky. Zde se zobrazí připomínky k tomu místu a formulář pro novou.</p>
        <p className="mt-3">
          Doporučení studie: jedna věc, jeden komentář; návrh nového znění a zdroj; neověřený údaj označte „Ověřit“.
        </p>
      </div>
    );
  }
  const roots = comments.filter((c) => !c.parentId);
  const replies = (id: number) => comments.filter((c) => c.parentId === id);

  return (
    <div className="text-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-muted">{block.headingPath || doc.title}</div>
          <h2 className="text-base font-semibold">Připomínky k bloku</h2>
        </div>
        <Link href={`/d/${slug}`} className="text-xs text-muted underline">zavřít</Link>
      </div>
      <blockquote className="mb-3 max-h-40 overflow-y-auto border-l-2 border-amber-300 bg-amber-50/50 px-3 py-2 text-xs leading-5 text-stone-700">
        {block.text.length > 600 ? block.text.slice(0, 600) + "…" : block.text}
      </blockquote>
      {block.codes.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {block.codes.map((c) => (
            <Link key={c} href={`/kody/${c}`} className="chip" title={codeLabels.get(c) ?? ""}>
              <span className="font-mono">{c}</span>
              {codeLabels.get(c) && <span className="max-w-[180px] truncate text-muted">{codeLabels.get(c)}</span>}
            </Link>
          ))}
        </div>
      )}

      {roots.length === 0 ? (
        <p className="mb-4 text-muted">Zatím bez připomínek.</p>
      ) : (
        <ul className="mb-4 space-y-3">
          {roots.map((c) => (
            <li key={c.id} className="rounded-lg border border-line p-3">
              <div className="mb-1 flex flex-wrap items-center gap-1 text-[11px]">
                <span className={`chip ${SEVERITY_CLASS[c.severity]}`}>{SEVERITY_LABEL[c.severity]}</span>
                <span className="chip">{KIND_LABEL[c.kind]}</span>
                <span className={`chip border-transparent ${STATUS_CLASS[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                {c.needsVerification && <span className="chip border-amber-300 bg-amber-50 text-amber-900">Ověřit</span>}
                {c.channel === "verejnost" && <span className="chip border-sky-200 bg-sky-50 text-sky-900">veřejnost · {c.priority === "nizka" ? "nízká priorita" : c.priority === "vysoka" ? "vysoká priorita" : "běžná priorita"}</span>}
                {c.codes.map((k) => (
                  <Link key={k} href={`/kody/${k}`} className="code-ref">{k}</Link>
                ))}
              </div>
              {c.quote && <div className="mb-1 border-l-2 border-line pl-2 text-xs italic text-muted">„{c.quote}“</div>}
              <p className="whitespace-pre-wrap">{renderInline(c.body, { linkCodes: true })}</p>
              {c.proposedText && (
                <div className="mt-2 rounded bg-emerald-50 p-2 text-xs">
                  <div className="mb-0.5 font-semibold text-emerald-900">Návrh znění</div>
                  <p className="whitespace-pre-wrap">{c.proposedText}</p>
                </div>
              )}
              {c.source && <div className="mt-1 text-xs text-muted">Zdroj: {renderInline(c.source, { linkCodes: false })}</div>}
              <div className="mt-2 text-[11px] text-muted">
                {c.authorName}
                {c.organization ? ` · ${c.organization}` : ""}
                {c.onBehalf === "organizace" ? " (za organizaci)" : ""} · {fmtDate(c.createdAt)} · #{c.id}
              </div>
              {replies(c.id).map((r) => (
                <div key={r.id} className="mt-2 border-l-2 border-line pl-3 text-xs">
                  <p className="whitespace-pre-wrap">{r.body}</p>
                  <div className="text-[11px] text-muted">{r.authorName} · {fmtDate(r.createdAt)}</div>
                </div>
              ))}
              <ReplyForm parentId={c.id} slug={slug} />
            </li>
          ))}
        </ul>
      )}

      <CommentForm documentId={doc.id} versionId={version.id} blockKey={block.blockKey} slug={slug} defaultCodes={defaultCodes.join(" ")} canOrg={!!session.organization} />
    </div>
  );
}
