"use client";

import { useActionState, useState } from "react";
import { addReply, type ActionState } from "@/app/actions";

export function ReplyForm({ parentId, slug }: { parentId: number; slug: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ActionState, FormData>(async (prev, fd) => {
    const result = await addReply(prev, fd);
    if (result.ok) setOpen(false); // formulář se po úspěchu zavře a tím i vyprázdní
    return result;
  }, {});
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-2 text-[11px] text-accent underline">
        odpovědět
      </button>
    );
  return (
    <form action={action} className="mt-2 space-y-1">
      <input type="hidden" name="parentId" value={parentId} />
      <input type="hidden" name="slug" value={slug} />
      <textarea name="body" rows={2} required placeholder="Odpověď nebo doplnění" className="text-xs" />
      {state.error && <p className="text-[11px] text-rose-700">{state.error}</p>}
      <div className="flex gap-2">
        <button className="btn !py-1 !px-2 !text-xs" type="submit" disabled={pending}>Odeslat</button>
        <button type="button" className="text-[11px] text-muted underline" onClick={() => setOpen(false)}>zrušit</button>
      </div>
    </form>
  );
}
