/**
 * Cíl markdownového odkazu: text za „[popisek](“ až po uzavírací závorku.
 *
 * Regulární výraz „všechno až po první )“ nestačí. DOI časopisu Lancet má
 * závorky přímo v adrese (10.1016/S0140-6736(23)00497-X) a studie takový cíl
 * zapisuje ve špičatých závorkách; odkaz se pak utnul uprostřed adresy
 * a zbytek zůstal na stránce jako text.
 *
 * Podporuje obě podoby z CommonMarku:
 *   (<adresa se (závorkami) i mezerami>)
 *   (adresa/s(vyváženými)závorkami)
 * a nepovinný titulek za adresou ("…", '…'), který se zahazuje.
 *
 * `from` je index hned za otevírací závorkou. Vrací adresu a index hned za
 * uzavírací závorkou, nebo null, když tam platný cíl není.
 */
export function parseLinkDestination(src: string, from: number): { href: string; end: number } | null {
  let i = from;
  let href: string;

  if (src[i] === "<") {
    const close = src.indexOf(">", i + 1);
    if (close === -1) return null;
    href = src.slice(i + 1, close);
    if (/[<\n]/.test(href)) return null;
    i = close + 1;
  } else {
    let depth = 0;
    const start = i;
    for (; i < src.length; i++) {
      const ch = src[i];
      if (ch === "(") depth++;
      else if (ch === ")") {
        if (depth === 0) break;
        depth--;
      } else if (/\s/.test(ch)) break;
    }
    if (depth !== 0) return null;
    href = src.slice(start, i);
  }
  if (!href) return null;

  // Nepovinný titulek: mezera a text v uvozovkách.
  const rest = /^[ \t]+(?:"[^"\n]*"|'[^'\n]*')[ \t]*/.exec(src.slice(i));
  if (rest) i += rest[0].length;
  else while (src[i] === " " || src[i] === "\t") i++;

  if (src[i] !== ")") return null;
  return { href, end: i + 1 };
}
