"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addComment, type ActionState } from "@/app/actions";
import { KIND_LABEL, SEVERITY_LABEL } from "@/lib/labels";

export function CommentForm({ documentId, versionId, blockKey, slug, defaultCodes, canOrg }: { documentId: number; versionId: number; blockKey: string; slug: string; defaultCodes: string; canOrg: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addComment, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  // Označený text v dokumentu se nabídne jako citát připomínky.
  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection()?.toString().trim() ?? "";
      if (sel.length > 3 && sel.length < 1500) setQuote(sel);
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  return (
    <form ref={formRef} action={action} className="space-y-3 rounded-lg border border-accent/30 bg-accent-soft/40 p-3">
      <h3 className="text-sm font-semibold">Nová připomínka</h3>
      <input type="hidden" name="documentId" value={documentId} />
      <input type="hidden" name="versionId" value={versionId} />
      <input type="hidden" name="blockKey" value={blockKey} />
      <input type="hidden" name="slug" value={slug} />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="field" htmlFor="kind">Typ</label>
          <select id="kind" name="kind" defaultValue="vecna" required>
            {Object.entries(KIND_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field" htmlFor="severity">Závažnost</label>
          <select id="severity" name="severity" defaultValue="doporucujici" required>
            {Object.entries(SEVERITY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field" htmlFor="quote">Úryvek, kterého se připomínka týká (označte text v dokumentu)</label>
        <textarea id="quote" name="quote" rows={2} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="nepovinné" />
      </div>

      <div>
        <label className="field" htmlFor="body">Připomínka</label>
        <textarea id="body" name="body" rows={4} required minLength={5} placeholder="Jedna věc, jeden komentář." />
      </div>

      <div>
        <label className="field" htmlFor="proposedText">Návrh nového znění (nepovinné)</label>
        <textarea id="proposedText" name="proposedText" rows={3} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="field" htmlFor="source">Zdroj (URL, PMID, předpis)</label>
          <input id="source" name="source" placeholder="nepovinné" />
        </div>
        <div>
          <label className="field" htmlFor="codes">Kódy opatření</label>
          <input id="codes" name="codes" defaultValue={defaultCodes} placeholder="J1 P2 H5" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" name="needsVerification" className="w-auto" /> Údaj je neověřený („Ověřit“)
        </label>
        <label className="flex items-center gap-1.5">
          <select name="onBehalf" className="w-auto" defaultValue="osoba">
            <option value="osoba">za sebe</option>
            <option value="organizace" disabled={!canOrg}>za organizaci</option>
          </select>
        </label>
      </div>

      {state.error && <p className="text-xs text-rose-700">{state.error}</p>}
      {state.ok && <p className="text-xs text-emerald-800">Připomínka uložena.</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Ukládám…" : "Vložit připomínku"}
      </button>
    </form>
  );
}
