# Zdraví blíž lidem: veřejný web reformy a připomínkování studie

Jedna aplikace, dvě části. Návrh celé platformy je v
[`../docs/navrh-konzultacni-platformy.md`](../docs/navrh-konzultacni-platformy.md).

## Veřejný web (bez přihlášení)

Statické stránky z obsahu studie v3, politické verze a prezentace, data v `src/content/reforma.ts`:

| Cesta | Obsah |
| --- | --- |
| `/` | úvod: cíl, čtyři čísla, pět změn, co reforma nedělá, průvodce |
| `/proc` | výchozí stav s grafy: podíl na úhradách, obložnost, úbytek praktiků, odvratitelné hospitalizace, sestry, mezera pojištění |
| `/co-chceme` | pět změn (co, co přinese, kdy), cesta pacienta dnes a po reformě |
| `/jak` | interaktivní harmonogram s branami, čtyři pravidla, varianty A/B/C, kroky do voleb 2029, ukazatele, rizika |
| `/penize` | struktura nákladů 2038, kdo platí, tři kalkulačky (platba státu, rozdělení daní, kolik zaplatím), deset čísel |
| `/pro-koho` | co nabízíme a potřebujeme od 12 skupin, kulaté stoly |
| `/otazky` | osm častých otázek, střet zájmů |
| `/studie` | plné znění odborné studie ke čtení, bez připomínek (z databáze, obnova po 5 minutách) |
| `/slovnicek` | slovníček pojmů |

Texty jsou psané v první osobě množného čísla bez odborných výrazů; kde se jim nejde vyhnout, vysvětluje je slovníček. Grafy jsou v Recharts podle zásad dataviz (validovaná paleta, jedna osa, tenké pruhy, tabulková varianta u každého grafu).

## Interní část: připomínky k odborné studii (přístupový kód)

Připomínkuje se jen odborná studie (`01-studie-zdravi-bliz-lidem-v3.md`); ostatní dokumenty slouží jako zdroj pro veřejný web.
Cesty `/rt`, `/d/studie`, `/pripominky`, `/overit`, `/kody` a export chrání `src/proxy.ts`.

## Co interní část umí

- **Čtečka** studie rozsekané na bloky (nadpis, odstavec, odrážka, tabulka, citace)
  se stabilním klíčem `cesta-nadpisů#druhN`. Osnova vlevo s počty připomínek, text uprostřed, připomínky vpravo.
- **Strukturovaná připomínka** k bloku: typ, závažnost (zásadní / doporučující / redakční), úryvek (předvyplní se
  označením textu), text, návrh nového znění, zdroj, přepínač „Ověřit“, kódy opatření (předvyplněné z bloku nebo
  z nadpisu sekce), za sebe / za organizaci. Odpovědi ve vlákně.
- **Seznam připomínek** s filtry (dokument, stav, závažnost, typ, kód, text), změna stavu, garant a téma vypořádání,
  **export CSV** (`?verejne=1` skryje jména osob, zůstává jen organizace).
- **Registr „Ověřit“**: 100 míst vytěžených ze studie, stav, kdo ověří, výsledek.
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
pnpm import:docs             # naimportuje studii do bloků (jen při změně; --force založí novou verzi)
pnpm dev
```

Po změně Markdownu stačí znovu `pnpm import:docs`: dokument dostane novou verzi a „Ověřit“ si drží stav podle textu.

**Kotvy připomínek.** Polohový klíč bloku (`sekce#p3`) slouží jen pro odkazy v rámci jedné verze, protože vložený
odstavec přečísluje následující. Připomínky se proto vážou na trvalou kotvu bloku (`blocks.anchor_id`). Import ji
přenese na odpovídající blok nové verze podle obsahu: nejdřív přesná shoda textu, pak podobnost slov, ostatní
bloky dostanou novou kotvu (`src/lib/anchors.ts`). Co se s kterým blokem stalo (stejný, upravený, přesunutý, nový,
odstraněný), zapisuje tabulka `block_lineage`. Připomínka si navíc ukládá blok a jeho text v době podání, takže
čtečka pozná, že se text od podání změnil, a připomínky k odstraněnému textu ukáže zvlášť. Celý import verze
běží v jedné transakci; když cokoli selže, zůstane aktuální předchozí verze.

**Migrace starých dat na kotvy** (jednou, před nasazením kódu s kotvami):

```bash
pnpm db:push       # přidá sloupce anchor_id, block_id, block_text, block_hash a tabulku block_lineage
pnpm db:anchors    # doplní kotvy do všech verzí a naváže na ně existující připomínky; vypíše kontrolu
```

**Testy a kontroly.** `pnpm test` spouští testy nad PGlite (Postgres v paměti), bez sdílené databáze: přiřazení
kotev, migraci připomínek ze studie v3 na v3.1 na skutečných souborech, doplnění kotev do starých dat, validaci
a transakce zápisů a export bez osobních údajů. GitHub Actions (`.github/workflows/ci.yml`) pouští u každého PR
lint, typecheck, testy a build.

## Struktura

| Cesta | Co |
| --- | --- |
| `scripts/import.ts` | import Markdownu; logika v `src/lib/importer.ts` (bloky, kotvy, mapování verzí, „Ověřit“, registr kódů) |
| `scripts/anchors-backfill.ts` | jednorázové doplnění kotev do starých verzí a navázání existujících připomínek |
| `src/lib/comments-core.ts` | zápisy připomínek: společná validace a transakce s auditem |
| `tests/` | testy (Vitest + PGlite) |
| `src/content/figures/vazby.ts` | mapa vazeb opatření v čase, organigramy pilířů, matice vlivů; `pnpm check:vazby` hlídá, že vazba „bez A nejde B“ nemíří proti času a že organigramy obsahují všechna opatření registru |
| `src/db/schema.ts` | tabulky: documents, document_versions, blocks, codes, comments, resolutions, verifications, events |
| `src/lib/codes.ts` | regulární výraz a pomocníci pro kódy J/P/Pil/M/H/D/R/B |
| `src/lib/session.ts`, `src/proxy.ts` | podepsaná cookie a ochrana všech stránek kromě `/vstup` |
| `src/app/(web)` | veřejný web; `src/components/charts` grafy a kalkulačky; `src/components/web` navigace a prvky |
| `src/app/(rt)/d/[slug]` | čtečka studie |
| `src/app/(rt)/pripominky`, `src/app/api/export/pripominky` | seznam a CSV export |
| `src/app/(rt)/overit`, `src/app/(rt)/kody` | registry |
| `src/app/actions.ts` | server actions: vstup, připomínka, odpověď, stav, ověření |

## Co je další krok (podle návrhu)

Vypořádání s odůvodněním a kontrolou oponenta (tabulka `resolutions` už existuje), přihlášení e-mailem místo
jednoho kódu, témata a garantství, otázky pro RT, registr závazných čísel, interaktivní grafy, kalkulačky
(nejdřív platba státu a daně za zdraví), veřejná část.
