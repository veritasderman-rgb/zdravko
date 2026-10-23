import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getCode } from "@/lib/queries";
import { FAMILY_CLASS, FAMILY_LABEL, familyOf, isCode } from "@/lib/codes";
import { SEVERITY_CLASS, SEVERITY_LABEL, STATUS_CLASS, STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function CodePage({ params }: PageProps<"/kody/[code]">) {
  await requireSession();
  const { code } = await params;
  if (!isCode(code)) notFound();
  const { code: c, blocks, comments } = await getCode(code);
  const fam = familyOf(code);
  const meta = (c?.meta ?? {}) as Record<string, string>;
  const docs = [...new Set(blocks.map((b) => b.docSlug))];

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`chip font-mono text-base ${FAMILY_CLASS[fam]}`}>{code}</span>
        <h1 className="text-2xl font-semibold tracking-tight">{c?.label ?? FAMILY_LABEL[fam]}</h1>
      </div>
      <p className="mt-1 text-sm text-muted">{FAMILY_LABEL[fam]}{c?.layer ? ` · ${c.layer}` : ""}{c?.pillar ? ` · ${c.pillar}` : ""}</p>

      {Object.keys(meta).length > 0 && (
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 rounded-lg border border-line bg-paper p-4 text-sm md:grid-cols-[220px_1fr]">
          {Object.entries(meta).map(([k, v]) =>
            v ? (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ) : null,
          )}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {docs.map((slug) => (
          <Link key={slug} href={`/d/${slug}?kod=${code}`} className="btn btn-ghost">
            Zobrazit v dokumentu „{slug}“ s filtrem
          </Link>
        ))}
        <Link href={`/pripominky?code=${code}`} className="btn btn-ghost">Připomínky ({comments.length})</Link>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Připomínky k tomuto kódu</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-muted">Zatím žádné.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {comments.map(({ c: cm, docSlug, docTitle, headingPath }) => (
            <li key={cm.id} className="rounded-lg border border-line bg-paper p-3 text-sm">
              <div className="flex flex-wrap gap-1 text-[11px]">
                <span className={`chip ${SEVERITY_CLASS[cm.severity]}`}>{SEVERITY_LABEL[cm.severity]}</span>
                <span className={`chip border-transparent ${STATUS_CLASS[cm.status]}`}>{STATUS_LABEL[cm.status]}</span>
                <Link href={`/d/${docSlug}?b=${encodeURIComponent(cm.blockKey)}#${encodeURIComponent(cm.blockKey)}`} className="text-muted underline">{docTitle}{headingPath ? ` › ${headingPath}` : ""}</Link>
              </div>
              <p className="mt-1">{cm.body}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold">Kde se v textu objevuje ({blocks.length})</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {blocks.map(({ b, docSlug, docTitle }) => (
          <li key={b.id} className="rounded border border-line bg-paper px-3 py-2">
            <div className="text-[11px] text-muted">{docTitle}{b.headingPath ? ` › ${b.headingPath}` : ""}</div>
            <Link href={`/d/${docSlug}?b=${encodeURIComponent(b.blockKey)}#${encodeURIComponent(b.blockKey)}`} className="hover:underline">
              {b.text.length > 260 ? b.text.slice(0, 260) + "…" : b.text}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
