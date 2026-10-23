/** Kotva z českého textu: bez diakritiky, malá písmena, slova spojená pomlčkou („Praktičtí lékaři“ → „prakticti-lekari“). */
export function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
