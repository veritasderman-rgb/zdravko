# Konzultační platforma „Zdraví blíž lidem“ (MVP čtečky)

Interní nástroj pro připomínkování studie reformy zdravotnictví, verze 3. Návrh celé platformy je v
[`../docs/navrh-konzultacni-platformy.md`](../docs/navrh-konzultacni-platformy.md); tohle je jeho první krok.

## Co MVP umí

- **Čtečka** všech sedmi Markdown dokumentů z repozitáře rozsekaných na bloky (nadpis, odstavec, odrážka, tabulka, citace)
  se stabilním klíčem `cesta-nadpisů#druhN`. Osnova vlevo s počty připomínek, text uprostřed, připomínky vpravo.
- **Strukturovaná připomínka** k bloku: typ, závažnost (zásadní / doporučující / redakční), úryvek (předvyplní se
  označením textu), text, návrh nového znění, zdroj, přepínač „Ověřit“, kódy opatření (předvyplněné z bloku nebo
  z nadpisu sekce), za sebe / za organizaci. Odpovědi ve vlákně.
- **Seznam připomínek** s filtry (dokument, stav, závažnost, typ, kód, text), změna stavu, garant a téma vypořádání,
  **export CSV** (`?verejne=1` skryje jména osob, zůstává jen organizace).
- **Registr „Ověřit“**: 112 míst vytěžených z textu, stav, kdo ověří, výsledek.
- **Registr kódů** J1–J10, P1–P5, Pil, M, H1–H8, D1–D12, R1–R19, B1–B4 (132 kódů) s popisem z registru opatření,
  výskyty v textu, připomínkami a filtrem dokumentu podle kódu (`/d/studie?kod=J2`).
- **Přístup** jedním kódem a jménem (podepsaná cookie). Jména osob se nikdy nezveřejňují, do veřejného vypořádání jde
  jen organizace.

## Stack

Next.js 16 (App Router, server actions), Tailwind 4, Drizzle ORM, Neon Postgres (eu-central-1, projekt
`zdravi-bliz-lidem`, databáze `zdravko`), remark pro import Markdownu.

## Spuštění

```bash
cd web
pnpm install
cp .env.example .env.local   # doplňte DATABASE_URL, ACCESS_CODE, SESSION_SECRET
pnpm db:push                 # vytvoří tabulky podle src/db/schema.ts
pnpm import:docs             # naimportuje ../*.md a ../docs/*.md do bloků (jen změněné; --force vše)
pnpm dev
```

Po změně Markdownu stačí znovu `pnpm import:docs`: dokument dostane novou verzi, bloky se znovu vytvoří,
připomínky zůstávají navázané na klíč bloku (sekce + pořadí), položky „Ověřit“ si drží stav podle textu.

## Struktura

| Cesta | Co |
| --- | --- |
| `scripts/import.ts` | import Markdownu: bloky, kódy, „Ověřit“, registr kódů z tabulek |
| `src/db/schema.ts` | tabulky: documents, document_versions, blocks, codes, comments, resolutions, verifications, events |
| `src/lib/codes.ts` | regulární výraz a pomocníci pro kódy J/P/Pil/M/H/D/R/B |
| `src/lib/session.ts`, `src/proxy.ts` | podepsaná cookie a ochrana všech stránek kromě `/vstup` |
| `src/app/d/[slug]` | čtečka dokumentu |
| `src/app/pripominky`, `src/app/api/export/pripominky` | seznam a CSV export |
| `src/app/overit`, `src/app/kody` | registry |
| `src/app/actions.ts` | server actions: vstup, připomínka, odpověď, stav, ověření |

## Co je další krok (podle návrhu)

Vypořádání s odůvodněním a kontrolou oponenta (tabulka `resolutions` už existuje), přihlášení e-mailem místo
jednoho kódu, témata a garantství, otázky pro RT, registr závazných čísel, interaktivní grafy, kalkulačky
(nejdřív platba státu a daně za zdraví), veřejná část.
