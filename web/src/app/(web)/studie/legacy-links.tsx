"use client";

import { useEffect } from "react";

/**
 * Starší odkazy na celou studii na jedné stránce: /studie#kotva vede přes /studie/kotva
 * na odstavec v jeho kapitole, /studie?q=… na hledání ve studii. Kotvy, které na úvodní
 * stránce studie existují (#pripominka, #kapitoly), zůstávají tady.
 */
export function LegacyStudyLinks() {
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && !document.getElementById(hash)) {
      window.location.replace(`/studie/kotva?k=${encodeURIComponent(hash)}`);
      return;
    }
    const q = new URLSearchParams(window.location.search).get("q")?.trim();
    if (q) window.location.replace(`/hledat?jen=studie&q=${encodeURIComponent(q)}`);
  }, []);
  return null;
}
