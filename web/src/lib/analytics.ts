import { track } from "@vercel/analytics";

/**
 * Vlastní události ve Vercel Analytics (v přehledu projektu, záložka Events). Bez osobních údajů:
 * žádné jméno, e-mail ani text připomínky, jen druh akce a nanejvýš dvě krátké vlastnosti.
 */
export type EventName =
  | "Připomínka odeslána"
  | "Návrh opatření odeslán"
  | "Stažení"
  | "Novinky: přihláška"
  | "Kulaté stoly: přihláška"
  | "Organizace: zpráva"
  | "Potvrzeno"
  | "Hledání bez výsledků";

export function trackEvent(name: EventName, props?: Record<string, string | number | boolean>) {
  try {
    track(name, props);
  } catch {
    // Měření nesmí rozbít formulář.
  }
}
