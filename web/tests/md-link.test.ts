import { readFileSync } from "node:fs";
import path from "node:path";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderInline } from "@/lib/md";
import { parseLinkDestination } from "@/lib/md-link";

/** Odkazy (<a>) z výstupu renderInline, včetně vnořených v tučném/kurzívě. */
function links(nodes: ReactNode[]): { href: string; text: string }[] {
  const out: { href: string; text: string }[] = [];
  const walk = (n: ReactNode) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!isValidElement(n)) return;
    const props = n.props as { href?: string; children?: ReactNode };
    if (n.type === "a") out.push({ href: props.href ?? "", text: String(props.children) });
    else walk(props.children);
  };
  walk(nodes);
  return out;
}

/** Prostý text mimo prvky — to, co by na stránce zbylo jako „utržený“ zbytek. */
function looseText(nodes: ReactNode[]): string {
  return nodes.filter((n) => typeof n === "string").join("");
}

const dest = (s: string) => parseLinkDestination(s, s.indexOf("(") + 1);

describe("parseLinkDestination", () => {
  it("obyčejná adresa", () => {
    expect(dest("(https://example.org/a)")).toEqual({ href: "https://example.org/a", end: 23 });
  });

  it("vyvážené závorky v adrese", () => {
    expect(dest("(https://doi.org/10.1016/S0140-6736(23)00497-X) dál")?.href).toBe(
      "https://doi.org/10.1016/S0140-6736(23)00497-X",
    );
  });

  it("adresa ve špičatých závorkách", () => {
    const s = "(<https://doi.org/10.1016/S0140-6736(23)00497-X>)";
    expect(dest(s)).toEqual({ href: "https://doi.org/10.1016/S0140-6736(23)00497-X", end: s.length });
  });

  it("titulek za adresou se zahodí", () => {
    expect(dest('(https://example.org "Titulek")')?.href).toBe("https://example.org");
    expect(dest("(<https://example.org/a b> 'T')")?.href).toBe("https://example.org/a b");
  });

  it("kotva a relativní cesta", () => {
    expect(dest("(#b-0012)")?.href).toBe("#b-0012");
    expect(dest("(/studie/shrnuti)")?.href).toBe("/studie/shrnuti");
  });

  it("neplatný cíl není odkaz", () => {
    expect(dest("(https://example.org")).toBeNull();
    expect(dest("(<https://example.org)")).toBeNull();
    expect(dest("()")).toBeNull();
    expect(dest("(a(b)")).toBeNull();
    expect(dest("(dvě slova)")).toBeNull();
  });
});

const opts = { linkCodes: false };

describe("renderInline: odkazy", () => {

  it("řádek s DOI Lancetu ze studie (závorky v adrese, cíl v <…>)", () => {
    const line =
      "Lancet 2023;401(10385):1361–70. [PMID 36963415](https://pubmed.ncbi.nlm.nih.gov/36963415/), " +
      "[DOI 10.1016/S0140-6736(23)00497-X](<https://doi.org/10.1016/S0140-6736(23)00497-X>)";
    const out = renderInline(line, opts);
    expect(links(out)).toEqual([
      { href: "https://pubmed.ncbi.nlm.nih.gov/36963415/", text: "PMID 36963415" },
      { href: "https://doi.org/10.1016/S0140-6736(23)00497-X", text: "DOI 10.1016/S0140-6736(23)00497-X" },
    ]);
    expect(looseText(out)).toBe("Lancet 2023;401(10385):1361–70. , ");
  });

  it("text za odkazem zůstane celý", () => {
    const out = renderInline("viz [zdroj](https://example.org/x(1)) (str. 3) a dál", opts);
    expect(links(out)).toEqual([{ href: "https://example.org/x(1)", text: "zdroj" }]);
    expect(looseText(out)).toBe("viz  (str. 3) a dál");
  });

  it("odkaz uvnitř tučného textu", () => {
    expect(links(renderInline("**[a](https://example.org/b)**", opts))).toEqual([
      { href: "https://example.org/b", text: "a" },
    ]);
  });

  it("nedokončený odkaz zůstane textem", () => {
    const out = renderInline("hranatá [závorka](bez konce", opts);
    expect(links(out)).toEqual([]);
    expect(looseText(out)).toBe("hranatá [závorka](bez konce");
  });
});

describe("odkazy ve zdrojovém textu studie", () => {
  const dir = path.resolve(__dirname, "..", "..");
  for (const file of ["01-studie-zdravi-bliz-lidem-v3.2.md"]) {
    it(`${file}: každý odkaz má čistý cíl`, () => {
      const src = readFileSync(path.join(dir, file), "utf8");
      const bad: string[] = [];
      let n = 0;
      for (const line of src.split("\n")) {
        for (const l of links(renderInline(line, opts))) {
          n++;
          if (!/^(https?:\/\/|mailto:|#|\/)/.test(l.href) || /[<>\s]/.test(l.href)) bad.push(`${l.text} → ${l.href}`);
        }
        // Zbytek adresy utržený za odkazem: „…>)“ nebo osamělé „](“.
        if (/>\)|\]\(/.test(looseText(renderInline(line, opts)))) bad.push(`utržený zbytek: ${line.slice(0, 80)}`);
      }
      expect(n).toBeGreaterThan(100);
      expect(bad).toEqual([]);
    });
  }
});
