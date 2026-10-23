# Zadání pro implementaci: vizuální směr B „Vysvětlující příběh“

*Verze 1, 23. 10. 2026. Navazuje na [`zadani-pro-designera.md`](zadani-pro-designera.md). Rozhoduje Josef Pavlovic za resortní tým.*

**Referenční návrh:** plátno „Zdraví blíž lidem – vizuální směry webu“ v Claude (https://claude.ai/artifact/Rpo2JbxdhsH8Y6X3qTc7sz, přístup nasdílí Josef). Implementuje se **spodní řada, směr B**: `B · Úvod – desktop`, `B · Úvod – mobil 390`, `B · Tokeny a komponenty`. Horní řada (směr A) je vyřazená, slouží jen pro srovnání.

**Kód:** `web/` v tomto repu (Next.js 16, Tailwind 4, Recharts). Texty zůstávají v `web/src/content/reforma.ts`.

---

## 1. O co jde

Veřejný web má dnes správný obsah, ale vypadá jako technická dokumentace. Směr B ho převléká do podoby „explaineru“ zdravotnického think-tanku. Má mít:

- **patkové titulky** (Source Serif 4) nad dobře čitelným bezpatkovým textem (Source Sans 3, základ 20 px),
- **teplou paletu**: písková půda, lesní zelená identita, šalvějové plochy a **jedinou okrovou akční barvu**, která se používá jen na primární tlačítka,
- **jedno hlavní tlačítko na obrazovku** („Co se změní pro mě“) a jasné „Další krok“ na konci každé stránky,
- **lidi v ilustracích** (sestra u seniorky doma, tým, obec), ne čísla a karty bez kontextu,
- **čísla, která vyprávějí**: velké číslo, jedna věta, zdroj; rozpětí jako vizuál; graf s titulkem-tvrzením.

**Mimo rozsah:** změny obsahu a čísel (kromě krátkých verzí textů v kap. 6), logika interní části (`(rt)`), databáze, autentizace a komentáře (2. fáze). Interní část se jen přebarví přes sdílené tokeny.

---

## 2. Postup po PR

Každý PR musí projít `pnpm typecheck`, `pnpm lint` a `pnpm build` a musí jít nasadit sám o sobě.

| PR | Obsah | Hotovo, když |
|---|---|---|
| **1. Základy** | tokeny v `globals.css`, nová písma, odstranění Barlow Condensed a Geist Sans, základní komponenty (kap. 5.1), nová hlavička s mobilním menu, nová patička | všechny stránky běží na nových tokenech a písmech; nic se nerozbilo v `(rt)` |
| **2. Úvodní stránka** | `/` přesně podle návrhu (kap. 7) | odpovídá artboardům B desktop a mobil na 390, 768 a 1440 px |
| **3. Grafy a vizuály** | `theme.ts`, nový `ChartFrame`, waffle, rozpětí, časová osa (desktop vodorovně, mobil svisle), restyling `visuals.tsx` | každý graf má titulek-tvrzení, zdroj a přepínač graf/tabulka |
| **4. Podstránky** | `/proc`, `/co-chceme`, `/jak`, `/penize`, `/pro-koho`, `/otazky`, `/slovnicek` (kap. 8) | každá stránka má hero, jedno primární CTA a pruh „Další krok“ |
| **5. Čtečka studie a tisk** | `/studie`: rozvržení, štítek „Ověřujeme“, čipy kódů, tiskový styl | studie se dá číst na mobilu a vytisknout bez navigace |
| **6. Ilustrace a sdílení** | výměna dočasných SVG za sadu od ilustrátora, OG obrázky, favicon, 404 | OG obrázek pro každou stránku, favicon bez stranických prvků |

---

## 3. Design tokeny

### 3.1 Barvy

Stávající sémantické názvy (`background`, `foreground`, `muted`, `line`, `paper`, `accent`, `accent-soft`) **zachovat a přemapovat**, aby se interní část přebarvila sama. Přidat nové názvy. Starý `--color-ink` (#0f3d35, dnes jen pozadí hero) přejmenovat na `forest-deep`. Kontrolou `grep -rn "ink" src` ověřit, že nic nezůstalo.

| Token | Hodnota | Použití | Kontrast |
|---|---|---|---|
| `background` / `sand` | `#F3EEE4` | pozadí stránky | — |
| `paper` | `#FBF8F2` | karty, světlé pásy, panely | — |
| `stone` | `#EAE3D6` | stav „dnes“ v Cestě pacienta, tlumené plochy | — |
| `line` | `#DDD5C6` | tenké linky, rámečky karet | — |
| `line-strong` | `#CFC5B3` | oddělovače seznamů, obrysy čipů | — |
| `foreground` / `ink` | `#1C2321` | hlavní text | 13,8 : 1 na sand |
| `ink-2` | `#3C4340` | text na barevných plochách | — |
| `muted` | `#52594F` | vedlejší text, popisky, zdroje | 6,3 : 1 na sand |
| `accent` / `forest` | `#1F4A3D` | identita: odkazy, číslice, štítky, sekundární tlačítka | 8,6 : 1 na sand |
| `forest-deep` | `#143229` | tmavé pásy (Proč, patička) | sand na něm 12 : 1 |
| `forest-mid` | `#2E4F46` | neutrální buňky waffle na tmavém pásu | — |
| `accent-soft` / `sage-soft` | `#DCE8E0` | stav „po reformě“, kruhy ikon, pruh Další krok | — |
| `sage` | `#A9C4B5` | štítky na tmavém pásu, rozpětí | 7,4 : 1 na forest-deep |
| `on-dark` | `#F3EEE4` | text na forest-deep | — |
| `on-dark-muted` | `#C9D9CF` | vedlejší text na forest-deep | 9,4 : 1 |
| `action` | `#9A5A12` | **jen** výplň primárního tlačítka | bílý text 5,5 : 1 |
| `action-hover` | `#7D4810` | hover primárního tlačítka | — |
| `verify-bg` / `verify-fg` | `#F6E9C8` / `#6B4A00` | štítek „Ověřujeme“ | 6,7 : 1 |
| `honey` | `#F2D29B` | jen ilustrace (slunce, taška, okna) | — |

**Pravidla:**
- `action` se nikde jinde nepoužívá: ne na odkazy, nadpisy, ikony ani grafy.
- Žádná červená mimo grafy, žádné gradienty, žádné stíny (hloubku dělají plochy sand / paper / sage-soft).
- Fokus: `outline: 3px solid #1C2321; outline-offset: 3px` na všem interaktivním. Na tmavém pásu `outline-color: #F3EEE4`.

### 3.2 Barvy grafů

Paleta v `components/charts/theme.ts` (`SERIES`) **zůstává**, je ověřená na barvoslepost. Mění se jen neutrály, aby ladily s pískem:

```ts
export const MUTED_MARK = "#BDB8AE";
export const INK = { primary: "#1C2321", secondary: "#52594F", muted: "#6E695F", grid: "#E6DFD1", axis: "#CFC5B3", surface: "#FBF8F2" };
export const ON_DARK = { rest: "#2E4F46", text: "#C9D9CF", blueText: "#8FBCF2", orangeText: "#F4A27E" };
```

Barvy grafů se nesmí potkat s `forest` ani s `action`, aby nevznikl dojem „naše barva = dobrá hodnota“.

### 3.3 Typografie

V `app/layout.tsx` nahradit Geist Sans a Barlow Condensed. Geist Mono může zůstat pro kódy opatření.

```ts
import { Geist_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";
const serif = Source_Serif_4({ variable: "--font-serif", subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"], style: ["normal", "italic"] });
const sans = Source_Sans_3({ variable: "--font-sans-src", subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"] });
```

| Role | Písmo | Desktop | Mobil | Řez / řádkování |
|---|---|---|---|---|
| Velké číslo | Serif | 84 px | 56 px | 600 / 1,0, `tabular-nums lining-nums` |
| H1 | Serif | 62 px | 38 px | 600 / 1,04–1,08, `letter-spacing -0.02em`, `text-wrap: balance` |
| H2 | Serif | 44–46 px | 28–32 px | 600 / 1,1 |
| H3 | Serif | 30 px | 22 px | 600 / 1,2 |
| Výrok (Proč) | Serif | 38 px | 27 px | 600 / 1,2–1,25 |
| Obava | Serif kurzíva | 21 px | 19 px | 400 |
| Perex | Sans | 22 px | 19 px | 400 / 1,5, barva `muted` |
| Text | Sans | 20 px | 19 px | 400 / 1,55 |
| Štítek (eyebrow) | Sans | 16 px | 14 px | 700, verzálky, `letter-spacing 0.06em`, barva `forest` |
| Popisek | Sans | 16–17 px | 16 px | 400, `muted` |
| Zdroj grafu | Sans | 15 px | 14 px | 400, `muted`; **nikdy pod 13 px** |

- Řádek textu max. **70 znaků** (`max-w-[34em]` u perexu, `max-w-[44em]` u úvodů sekcí).
- Odstranit třídy `.display-title`, `.big-number`, `.eyebrow`, `.font-display` z `globals.css` a nahradit je komponentami (kap. 5.1) nebo utilitami `font-serif`.
- Ověřit dlouhá slova v titulcích na 360 px („připomínkování“, „zdravotnictví“): `hyphens: auto` s `lang="cs"` je v pořádku, zalomení uprostřed slova bez spojovníku ne.

### 3.4 Mezery, poloměry, šířky

- Mřížka 4 px. Škála: 4, 8, 12, 16, 24, 32, 48, 64, 104.
- Svislý odstup sekcí: **96–104 px desktop, 44–48 px mobil**.
- Obsahový kontejner `max-w-[1200px]`, boční odsazení `clamp(16px, 4vw, 40px)` (mobil 20 px).
- Poloměry: tlačítka a čipy `999px` (pilulka), karty `16px`, panely (kalkulačka, výzva) `20px`, pruh Další krok `24px`.

### 3.5 Kostra `globals.css`

```css
@import "tailwindcss";

:root {
  --background: #F3EEE4; --foreground: #1C2321; --muted: #52594F; --line: #DDD5C6;
  --accent: #1F4A3D; --accent-soft: #DCE8E0; --paper: #FBF8F2;
}

@theme inline {
  --color-background: var(--background); --color-foreground: var(--foreground);
  --color-muted: var(--muted); --color-line: var(--line); --color-paper: var(--paper);
  --color-accent: var(--accent); --color-accent-soft: var(--accent-soft);
  --color-sand: #F3EEE4; --color-stone: #EAE3D6; --color-line-strong: #CFC5B3;
  --color-ink: #1C2321; --color-ink-2: #3C4340;
  --color-forest: #1F4A3D; --color-forest-deep: #143229; --color-forest-mid: #2E4F46;
  --color-sage: #A9C4B5; --color-sage-soft: #DCE8E0;
  --color-on-dark: #F3EEE4; --color-on-dark-muted: #C9D9CF;
  --color-action: #9A5A12; --color-action-hover: #7D4810;
  --color-verify-bg: #F6E9C8; --color-verify-fg: #6B4A00; --color-honey: #F2D29B;
  --font-sans: var(--font-sans-src), "Segoe UI", system-ui, sans-serif;
  --font-serif: var(--font-serif), Georgia, serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --radius-card: 16px; --radius-panel: 20px; --radius-band: 24px;
}

body { background: var(--background); color: var(--foreground); font-family: var(--font-sans); font-size: 1.25rem; line-height: 1.55; }
:where(a, button, input, select, textarea, summary):focus-visible { outline: 3px solid #1C2321; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
```

Interní část má vlastní menší písmo. `(rt)/layout.tsx` dostane `text-base`, aby se jí nezvětšil text na 20 px.

---

## 4. Ikony a ilustrace

**Ikony:** jedna sada, tah 1,6–1,8 px, `stroke="currentColor"`, viewBox 24. Doporučená je `lucide-react`. Pokud nechcete novou závislost, stačí dnešní inline SVG z návrhu: šipka, chevron, menu, info, dům se srdcem, dva lidé, hodiny, budova, list. Ikona je vždy pomocník u nadpisu nebo akce, nikdy dekorace. V kroužku 56–64 px (`sage-soft`) u karet a vstupů, samostatně 20–22 px u odkazů. Dekorativní ikony mají `aria-hidden="true"`.

**Ilustrace:** složka `src/components/web/illustrations/`, jedna komponenta na motiv, inline SVG s `role="img"` a `aria-label` popisujícím scénu. Do dodání sady od ilustrátora se použijí dočasné SVG z návrhu:

| Komponenta | Motiv | Kde |
|---|---|---|
| `HomeVisit` | sestra u seniorky doma, za oknem obecní centrum (oblouk) | hero úvodu, `/co-chceme` změna 5 |
| `SeniorTaxi` | auto veze seniora k lékaři | `/co-chceme` změna 1, Cesta pacienta |
| `EReferral` | eŽádanka v mobilu se třemi úrovněmi naléhavosti | `/co-chceme` změna 2 |
| `HealthCentre` | obecní zdravotní centrum, lékařka, otec s dítětem | `/pro-koho`, změna 1 |

Doplní ilustrátor: tým lékař a sestra, nemocnice s novou rolí, ultrazvuk v ordinaci, prevence (lékárna, pohyb), tok peněz, časová osa.

**Pravidla stylu:** ploché barvy z palety, obrys `#1C2321` 2–2,5 px, různé tóny pleti (`#EBC7A4`, `#B98563`, `#8D5B3E`) a věku. Žádný text v obrázku. Žádný červený kříž. Nesmí být karikaturní ani v obecném korporátním stylu. SVG musí škálovat (`width: 100%; height: auto`).

---

## 5. Komponenty

Všechno jsou serverové komponenty, pokud nepotřebují stav. Klientské (`"use client"`) jsou jen: mobilní menu, menu „Více“, přepínač Cesty pacienta, přepínač graf/tabulka, kalkulačky, časová osa s detailem brány a FAQ (nebo nativní `<details>`).

### 5.1 Základ (`src/components/web/ui.tsx`, přepsat)

**`Button`** (`variant: "primary" | "secondary" | "secondary-on-dark"`, `href`, `icon?: "arrow" | "download" | "external"`), renderuje `<Link>` nebo `<a>`.
- *primary:* `bg-action text-white rounded-full min-h-[58px] px-[30px] text-[19px] font-bold`, ikona šipky 22 px, hover `bg-action-hover`, na mobilu `w-full justify-center`. **Max. jedno na obrazovku.**
- *secondary:* obrys 2 px `forest`, text `forest`, `min-h-[52px] px-6 text-lg font-bold rounded-full`, hover `bg-sage-soft`.
- *secondary-on-dark:* obrys a text `on-dark`, hover `bg-white/10`.
- *disabled:* `bg-line text-muted`, bez kurzoru.

**`TextLink`**: `text-forest font-bold underline underline-offset-[5px] decoration-2`, volitelná šipka 20 px. Odkazy jsou **vždy podtržené**, i v navigaci patičky.

**`Eyebrow`**: štítek nad nadpisem (16/700, verzálky, `forest`). Na tmavém pásu `sage`.

**`Chip`**: tři varianty.
- *topic:* obrys `line-strong`, text 15–16 px.
- *verify:* `bg-verify-bg text-verify-fg font-bold`, ikona lupy, text „Ověřujeme“.
- *gate:* `bg-ink text-on-dark font-bold`, např. „B3 · Lidé a data · 12/2031“.

**`CodeRef`** (dnešní `.code-ref`): `bg-stone`, Geist Mono 14 px, rádius 6, odkaz na `/kody/[code]`.

**`Section`** (`id`, `eyebrow`, `title`, `lead`, `tone: "sand" | "paper" | "dark"`, `children`): pás přes celou šíři s vnitřním kontejnerem 1200 px. `paper` má horní a dolní linku `line`. `dark` = `bg-forest-deep text-on-dark`. Nadpis serif H2, lead perex.

**`PageHero`** (podstránky): eyebrow, serif H1 (52–62 px), perex, volitelně **jedno** velké číslo nebo vizuál vpravo (desktop) / pod textem (mobil), volitelně jedno primární CTA. Pozadí `sand`, žádný tmavý blok.

**`NextStep`** (`eyebrow="Další krok"`, `title`, `text`, `href`, `label`): pruh `bg-sage-soft rounded-[24px] px-14 py-12` s primárním tlačítkem vpravo (mobil pod textem, na celou šíři). **Na konci každé veřejné stránky** místo dnešního `NextLink`.

**`Callout`** (`title`, `children`, `icon="info"`): `bg-sand` nebo `bg-sage-soft`, rádius 16, ikona info vlevo. Pro poctivé poznámky („Co se změní i k horšímu“, „Říkáme to otevřeně“). Klidný, ne varovný: bez červené, bez levého barevného pruhu.

### 5.2 Hlavička a patička (`site-nav.tsx`)

**Hlavička:**
- *Rozvržení:* není sticky s průhledností, je statická na `sand` s dolní linkou `line`, výška 84 px (mobil 64 px).
- *Vlevo:* značka (kruh 38 px `forest` s domkem, viz návrh) a „Zdraví blíž lidem“ v serifu 23 px.
- *Uprostřed:* pět položek (Proč, Co chceme, Jak a kdy, Peníze, Pro koho), 18 px / 600, `ink`, bez podtržení. Aktivní stránka podtržená 2 px a `aria-current="page"`.
- *Menu „Více“:* tlačítko s chevronem otevře menu s položkami Otázky, Slovníček, Studie. Musí jít ovládat klávesnicí a zavřít Escapem.
- *Vpravo:* sekundární tlačítko „Číst studii“.
- *Mobil (< 900 px):* jen značka a kulaté tlačítko menu 48 px s `aria-label="Otevřít menu"`. Otevře celoobrazovkové menu na `sand`: položky 24 px serif, výška řádku 56 px, dole „Číst studii“ a „Přihlášení pro tým“. Fokus zůstane v menu (focus trap) a Escape menu zavře.
- *Odstranit:* odkaz „Pro resortní tým“ z hlavičky. Přesouvá se do patičky.

**Patička** (`bg-forest-deep text-on-dark`), čtyři sloupce (mobil jeden sloupec, odkazy ve dvou sloupcích):
1. „Zdraví blíž lidem“ v serifu, „Plán reformy zdravotnictví, verze 3 ke konzultaci, 20. 10. 2026“ a „Připravil Josef Pavlovic, resortní tým Zdravotnictví. Je to návrh k diskusi, ne program strany.“
2. Stránky.
3. Studie: Číst studii, Stáhnout PDF, Otázky, Slovníček.
4. Poctivě: Střet zájmů autora (odkaz na `/otazky#stret-zajmu`), Zdroje dat, Přihlášení pro tým (`/vstup`).

Plný text střetu zájmů se z patičky přesouvá na `/otazky`.

### 5.3 Obsahové bloky

**`AudienceEntry`** (rozcestník pod hero úvodu): tři karty `bg-paper border-line rounded-2xl`, ikona v kruhu 56 px `sage-soft`, nadpis 20/700 `forest` podtržený, podnadpis 17 px `muted`. Celá karta je odkaz. Mobil: pod sebou, kruh 44 px.

**`ChangeRow`** (pět změn, `<ol>`): mřížka `80px | 1fr | 72px | 40px` = serif číslice 56 px `forest`, serif nadpis 30 px a věta 19 px `muted`, ikona v kruhu 64 px, šipka. Celý řádek je `<a>`. Hover: `bg-paper` a podtržení nadpisu. Oddělovače `line-strong`. Mobil: číslice 36 px, nadpis 22 px, ikona a šipka se skryjí.

**`Waffle`** (`cells=100`, `groups: { value, color, label }[]`): mřížka 10 × 10, buňka 34 px (mobil 28 px), mezera 6 (4), rádius 6. Legenda pod mřížkou. `role="img"` s `aria-label` a tabulková varianta. Hodnoty se zaokrouhlí na celé buňky (29,7 → 30, 4,3 → 4), přesná čísla stojí v legendě.

**`BigNumber`** (`value`, `text`, `source?`, `range?: { min, max, value, scaleMax, unit }`): serif číslo 84/56 px, věta 22 px. S `range` se pod číslem zobrazí osa (linka 2 px `line-strong`), pásmo rozpětí `sage` (rádius 999, výška 18 px), značka hodnoty (kruh 30 px `forest` s bílým okrajem 4 px) a popisky min a max. Pod tím tři menší čísla (serif 34 px a věta 16 px), ne čtyři stejně velká.

**`PatientJourney`** (klientská, data `PATIENT_JOURNEY`): řádek čipů-záložek (`role="tablist"`, šipky vlevo a vpravo přepínají, aktivní čip `bg-forest text-on-dark`, ostatní `bg-paper border-line-strong`, výška 44 px). Pod nimi dva panely vedle sebe: **Dnes** (`bg-stone`, text `ink-2`) a **Po reformě** (`bg-sage-soft`), padding 32 px, rádius 16, text 21 px. Mobil: čipy se posouvají vodorovně (`overflow-x-auto`, bez viditelného posuvníku, ale s přesahem napovídajícím posun), panely pod sebou. Výchozí krok na úvodu: „Potřebuji specialistu“, na `/co-chceme` „Hledám praktika“. Krok jde sdílet odkazem (`?krok=4` nebo `#krok-4`).

**`FearFact`** (co reforma nedělá): mřížka `0.8fr | 1.2fr` = obava v serifové kurzívě 21 px `muted` a odpověď 20/700 s jednou větou 18 px `ink-2`. Dva sloupce s oddělovači `line-strong`. Mobil: obava nad odpovědí. Data v kap. 6.

**`MilestoneColumns`** (časová osa na úvodu): čtyři sloupce oddělené svislou linkou `line`, nad nimi linka 2 px `forest`. Ve sloupci rok v serifu 40 px `forest`, název 18/700, věta 17 px `muted` a čip brány. Mobil: svislý seznam s levou linkou 2 px `forest`.

**`Calculator`** (rámec pro tři kalkulačky): panel `bg-sand border-line rounded-[20px] p-9`. Uvnitř eyebrow „Spočítejte si“, serif H3 jako otázka, vstup (`<label>` 18/600, stepper −/+ jako kulatá tlačítka 52 px a `<input type="number">` šířky 88 px, nebo posuvník s viditelnou hodnotou) a výstup v bloku `bg-paper rounded-2xl` (serif 52 px „asi 240 Kč“, věta 18 px). Pod tím poznámka o zjednodušení 15 px. Výsledek je zaokrouhlený na desítky a uvozený „asi“. Výstup má `aria-live="polite"`.

**`OrgList`** (Pro koho na úvodu): dvousloupcový seznam deseti organizací (`KEY_SUBJECTS`), řádky 18 px oddělené `line`.

**`FAQ`**: `<details>` s `<summary>` v serifu 24 px, otevřená položka s textem 19 px. Každá otázka má `id` a tlačítko „Kopírovat odkaz“. Hash v URL otázku otevře.

---

## 6. Úpravy obsahu v `reforma.ts`

Návrh používá kratší verze některých textů. Přidat je jako nová pole, původní texty zůstávají pro podstránky.

```ts
// FIVE_CHANGES: nové pole `short` (jedna věta pro úvod) a `icon`
1: "Praktici se mohou dobrovolně spojit do týmu s víc sestrami. Sestra jezdí i za pacienty domů."   // icon: "team"
2: "Lékař v žádance zaškrtne: do 2 týdnů, do 6 týdnů, nebo plánované. Pojišťovna ručí za termín."  // icon: "clock"
3: "Okresní nemocnice dostane jistou roli: doléčení, rehabilitaci, jednodenní chirurgii a ambulance." // icon: "hospital"
4: "Daně z tichého vína a slazených nápojů: 5 mld. Kč ročně, z toho 2 mld. Kč do Národního fondu prevence." // icon: "leaf"
5: "Domov jako možnost, ne povinnost. V každém okrese mobilní paliativní tým."                      // icon: "home"

// NOT_DOING: nová pole `fear` (obava) a `short` (odpověď na úvod)
"Žádné nové poplatky u lékaře"            fear: "Budu u lékaře platit víc?"     short: "Žádné nové poplatky."
"Dětští lékaři zůstávají"                 fear: "Zruší dětské lékaře?"          short: "Dětští lékaři zůstávají."
"Nemocnice nerušíme, měníme jejich roli"  fear: "Zavřou nám nemocnici?"         short: "Měníme roli, nerušíme."
"Nic neprodáváme"                         fear: "Bude se privatizovat?"         short: "Nic neprodáváme."
"Nikoho nenutíme"                         fear: "Budu potřebovat doporučení?"   short: "Nikoho nenutíme."
"Daně za zdraví nejsou úleva z práce"     fear: "Zvednou se mi odvody?"         short: "Odvody z mezd se nemění."

// AUDIENCES (nové)
{ title: "Pacient a rodina", text: "Co se změní pro vás a vaše blízké", href: "/co-chceme", icon: "home" }
{ title: "Lékař a sestra", text: "Co reforma znamená pro vaši ordinaci", href: "/pro-koho#prakticti-lekari", icon: "team" }
{ title: "Obec, kraj, pojišťovna", text: "Co nabízíme a co potřebujeme", href: "/pro-koho", icon: "building" }
```

Věty v `FearFact` pod odpovědí se berou z prvních vět `NOT_DOING.text`. Na obsahu nic dalšího neměnit. **Každé číslo na webu musí mít zdroj v `reforma.ts`.**

---

## 7. Úvodní stránka `/`

Pořadí sekcí podle artboardu „B · Úvod – desktop“. Čísla v závorce jsou odstupy.

1. **Hero** (`sand`, 64/56):
   - *Levý sloupec:* eyebrow „Plán reformy zdravotnictví · verze 3 ke konzultaci“, H1 „Každý člověk má mít svého lékaře a svou sestru blízko domova.“ a perex „Péče o dlouhodobě nemocné a staré lidi se přesune z nemocnic blíž k nim. Nemocnice dostanou jistou roli, prevence stálé peníze.“
   - *Akce:* primární tlačítko **„Co se změní pro mě“** → `/co-chceme` a textový odkaz „Proč to potřebujeme“ → `/proc`.
   - *Pravý sloupec:* ilustrace `HomeVisit` (max. 520 px). Mobil: ilustrace pod tlačítky, oříznutá na `viewBox="30 130 460 430"`.
   - *Odstranit:* dnešní tmavé pozadí, tři rovnocenná tlačítka a graf v hero.
2. **Začněte tam, kde jste vy**: malý nadpis 18/700 `muted` a tři `AudienceEntry`.
3. **Proč** (`dark`, 96): eyebrow „Proč · 1 ze 6“ a výrok v serifu 38 px: „Z každých 100 Kč, které pojišťovny zaplatí, jde **29,70 Kč** na akutní lůžka v nemocnicích a **4,30 Kč** na praktické lékaře pro dospělé.“ Čísla jsou obarvená `ON_DARK.blueText` / `orangeText`, aby odpovídala waffle. Dál věta o úbytku praktiků (`GP_DECLINE`), tlačítko secondary-on-dark „Dalších pět důvodů“ → `/proc` a zdroj. Vpravo `Waffle` (30 modrých, 4 oranžové, zbytek `forest-mid`).
4. **Pět změn** (104/88): eyebrow „Co chceme“, H2 „Pět změn, které pocítíte“ a pět `ChangeRow` s `href="/co-chceme#zmena-N"`.
5. **Cesta pacienta**: eyebrow, H2 „Jak to bude vypadat, když…“ a `PatientJourney` se všemi devíti kroky.
6. **Peníze** (`paper`, 96):
   - *Vlevo:* `BigNumber` „21,5 mld. Kč“ s rozpětím 15–25 na ose 0–30. Text: „ročně navíc, až reforma poběží naplno kolem roku 2038. Odhad 15 až 25 mld. Kč, necelá 4 % toho, co dnes stojí zdravotní pojištění.“ Pod ním tři malá čísla (520 týmů / 8 000 lůžek / 5 mld.) a odkaz „Odkud peníze přijdou a na co půjdou“.
   - *Vpravo:* `Calculator` „Kolik zaplatíte za tiché víno navíc?“ (stepper sklenek 0–21, výchozí 1, výpočet `sklenky × 0,2 × 23,40 × 52`, zaokrouhleno na desítky). Věta „Kdo nepije slazené nápoje, na nich nezaplatí nic.“
7. **Co reforma nedělá** (104): H2 „Obavy, které slýcháme, a jak to opravdu je“ a šest `FearFact`.
8. **Jak a kdy** (`paper`, 96): H2 „Po krocích, s pojistkami“, lead „Bez dat se nerozhoduje. Když selže jedna část, zastaví se jen ta část.“, `MilestoneColumns` (2027 Konzultace · B1, 2028 Zkouška · B2, 2031–32 Peníze a zákony · B3, 2038 Reforma naplno · B4) a `Callout` „Co se změní i k horšímu“ (`HONEST_CHANGES` spojené do odstavce).
9. **Pro koho** (104): vlevo H2 „Plán projednáváme s těmi, kdo ho budou dělat“, „Deset organizací, devět kulatých stolů od února 2027 do června 2028.“ a odkaz. Vpravo `OrgList`.
10. **NextStep**: „Co se změní pro vás a vaše blízké“, „Pět změn a devět situací, dnes a po reformě. Čtení na pět minut.“ a tlačítko „Co se změní pro mě“.

**Z dnešního úvodu vypadá:** mřížka čtyř stejných čísel, „Půjčujeme si…“ (`INSPIRATION` se přesouvá na `/co-chceme`), dlaždice „Průvodce“ a pruh s `META.claim`. Ten se zkrátí do perexu na `/pro-koho`.

---

## 8. Podstránky

Každá podstránka má `PageHero`, obsah v sekcích `Section` se střídáním `sand` / `paper` a na konci `NextStep` podle tabulky. Primární tlačítko je v hero nebo v NextStep, nikdy v obou na stejné obrazovce.

| Stránka | Hero | Hlavní změny | NextStep → |
|---|---|---|---|
| `/proc` | jedno velké číslo „29,7 % vs 4,3 %“ s waffle | šest grafů, každý v novém `ChartFrame` s titulkem-tvrzením; mezi grafy velká čísla `PROBLEM_FACTS` a `PREVENTION_FACTS` (serif 56 px a věta), **ne** mřížka malých karet | „Co s tím uděláme“ → `/co-chceme` |
| `/co-chceme` | „Pět změn“ s kotvami 1–5 | každá změna jako kapitola: ilustrace / text střídavě vlevo a vpravo (mobil: ilustrace nahoře), bloky „Co uděláme“, „Co to přinese“ (`bg-sage-soft`), „Kdy“ (čipy dat), kódy jako `CodeRef`; `PatientJourney` (výchozí krok 1); `FearFact` ×6 s plnými texty; `HONEST_CHANGES` v `Callout`; `INSPIRATION` jako řádek čtyř zemí | „Kdy a jak“ → `/jak` |
| `/jak` | časová osa jako hero | `Timeline`: desktop vodorovně (fáze jako pásy sage → forest, brány jako tlačítka 44 px `bg-ink`, klik otevře panel „Co musí platit / Co když ne“), **mobil svisle**; pravidla jako čtyři očíslované bloky; varianty A/B/C jako tabulka, na mobilu karty; rizika jako `<details>` | „Kolik to stojí“ → `/penize` |
| `/penize` | `BigNumber` 21,5 s rozpětím | `MoneyFlow` jako hlavní vizuál (zdroje → použití), náklady 2038 v `ChartFrame`; tři kalkulačky v rámci `Calculator` (posuvníky se stejným vzhledem: dráha 6 px `line-strong`, palec 28 px `forest`, hodnota vždy vypsaná); deset čísel jako seznam (serif 34 px + věta), ne karty | „Pro koho to děláme“ → `/pro-koho` |
| `/pro-koho` | deset organizací jako řádek štítků | 12 skupin jako `StakeholderCard` (kdo, co nabízíme / co potřebujeme ve dvou sloupcích, první krok jako čip s datem, `id` pro kotvy); kulaté stoly jako svislý seznam s daty | „Nejčastější otázky“ → `/otazky` |
| `/otazky` | seznam témat (čipy) | `FAQ` s kotvami; střet zájmů jako `Callout` s `id="stret-zajmu"` | „Přečíst studii“ → `/studie` |
| `/slovnicek` | prostý nadpis | seznam pojmů s kotvami a písmennou navigací; pojmy v textu webu jako `<abbr>`/popover s odkazem sem (může jít do 2. kroku) | zpět, odkud čtenář přišel (`history.back` s odkazem na `/` jako zálohou) |

---

## 9. Grafy (`components/charts/`)

- **`ChartFrame`**:
  - *Hlavička:* titulek-tvrzení serif 24 px, podtitulek s definicí 16 px `muted`.
  - *Přepínač:* skupina dvou tlačítek „Graf“ / „Tabulka“ s `aria-pressed`, ve tvaru pilulky.
  - *Pata:* zdroj s rokem 14–15 px a volitelně čip „Ověřujeme“, jen pokud je číslo v registru Ověřit.
  - *Tabulka:* nahradí graf ve stejném rámu, nesmí být schovaná v `<details>` pod ním.
  - *Vzhled:* `bg-paper border-line rounded-2xl p-7`.
- **Pruhy**: max. 22–24 px, zaoblený jen datový konec, jedna série zvýrazněná (`SERIES[0]`), ostatní `MUTED_MARK`. Mřížka tenká a plná, nikdy čárkovaná. Hodnota u konce pruhu, popisky kategorií nad pruhem (na mobilu se nevejdou vedle).
- **Anotace v grafu** místo legendy, kde to jde (např. „ročně ubude 110 až 180 lékařů“ v `GpDeclineChart`), serifová kurzíva 14 px.
- **Bez** duálních os, koláčů a 3D. Animace Recharts zůstávají vypnuté (`isAnimationActive={false}`).
- Písmo v Recharts (`tick`) nastavit na `var(--font-sans)` a min. 13 px.
- `visuals.tsx` přebarvit na nové tokeny. `HeroSplit` nahradí `Waffle` a `PhasesStrip` nahradí `MilestoneColumns`.

---

## 10. Čtečka studie `/studie`

- **Rozvržení:** osnova vlevo (sbalitelná, zvýrazňuje aktuální kapitolu přes `IntersectionObserver`), text uprostřed max. 70 znaků, serif nadpisy, text 19 px. Pravý sloupec zůstává prázdný pro komentáře ve 2. fázi. Mobil: osnova jako tlačítko „Obsah“ otevírající panel.
- **Hero:** název, verze, datum, autor a sekundární tlačítko „Stáhnout PDF“.
- **Bloky:** bloky označené „Ověřit“ dostanou čip `verify`. Kódy opatření jsou `CodeRef`. Tabulky jsou v posuvném boxu.
- **Tisk** (`@media print`): bez hlavičky, patičky, osnovy a tlačítek. Serif 11 pt, text černý na bílém, za odkazy se vypíše URL, `break-inside: avoid` u tabulek, čísla stránek přes `@page`.
- **Interní čtečka** `(rt)/d/[slug]` přebírá tokeny, ale zachovává dnešní hustotu.

---

## 11. Přístupnost a responzivita

- WCAG 2.2 AA: kontrasty z kap. 3.1 dodržet beze změn. Pokud upravíte barvu, ověřte ji znovu.
- Všechny dotykové cíle mají aspoň **44 × 44 px**. Výjimkou jsou jen odkazy uvnitř odstavce.
- Skutečné prvky: `<a>`, `<button>`, `<input>` s `<label>`, nikdy `div` s `onClick`. Ikonová tlačítka mají `aria-label`.
- Záložky v Cestě pacienta podle vzoru WAI-ARIA Tabs (šipky, Home, End).
- Odkaz „Přeskočit na obsah“ jako první prvek stránky.
- `prefers-reduced-motion` je respektované, nic se samo nepohybuje: žádný carousel, autoplay ani vyskakovací okna.
- Testovat na šířkách **360, 390, 768, 1024, 1280 a 1440 px**. Na 360 px nesmí vzniknout vodorovný posuv stránky (výjimkou jsou vědomě posuvné boxy: čipy, tabulky, časová osa).
- Na Lighthouse má být Accessibility ≥ 95 na `/`, `/co-chceme` a `/penize`.

---

## 12. Technické poznámky

- **Žádné nové závislosti** kromě volitelného `lucide-react`. Písma jdou přes `next/font/google`, `latin-ext` je povinné.
- **Turbopack a Tailwind:** v `next.config.ts` je vypnutá build cache kvůli chybějícím třídám na produkci, to nechat. Nové třídy pište celé, ne skládané z řetězců (`bg-${x}`), jinak je Tailwind nevygeneruje. Po nasazení zkontrolovat tmavé pásy na produkci, protože právě tam minule chybělo pozadí.
- **Dynamické barvy** (waffle, záložky) řešit přes `style={{ background }}` nebo mapu celých tříd.
- **OG obrázky:** `opengraph-image.tsx` pro každou stránku přes `next/og` (1200 × 630): sand pozadí, serif titulek, jedno číslo a značka. Písmo načíst jako soubor.
- **Favicon:** značka z hlavičky (kruh `forest` s domkem) jako SVG a PNG 32/180/512. Žádné stranické logo ani barvy.
- **Prázdné a chybové stavy:** `not-found.tsx` v duchu webu (serif H1, věta, tlačítko „Na úvod“) a stav „Studie se teď nedá načíst“ pro výpadek databáze na `/studie`.
- Dodržet `AGENTS.md`: před zásahem do API Next.js 16 číst dokumentaci v `node_modules/next/dist/docs/`.

---

## 13. Akceptační kritéria

- [ ] Na webu nejsou Barlow Condensed, Geist Sans ani třídy `.display-title`, `.big-number`, `.eyebrow`, `.btn`.
- [ ] Barva `action` je použitá jen na primárních tlačítkách (ověřit grepem `bg-action`).
- [ ] Každá veřejná stránka má max. jedno primární tlačítko na obrazovku a pruh `NextStep`.
- [ ] Každý graf má titulek-tvrzení, zdroj s rokem a přepnutí na tabulku.
- [ ] Úvod na 390 px odpovídá artboardu „B · Úvod – mobil 390“, na 1440 px artboardu „B · Úvod – desktop“.
- [ ] Mobilní menu, záložky Cesty pacienta, kalkulačky a FAQ jdou ovládat jen klávesnicí.
- [ ] Žádný text menší než 13 px a žádný kontrast pod 4,5 : 1 (u velkých titulků 3 : 1).
- [ ] Interní část `(rt)` funguje beze změny chování a jen převzala tokeny.
- [ ] `pnpm typecheck`, `pnpm lint` a `pnpm build` projdou a produkční nasazení vypadá stejně jako lokální.

---

## 14. Otevřené otázky (rozhodne Josef)

1. **Ilustrátor:** kdo dodá finální sadu 8–12 motivů a kdy? Do té doby jdou na web dočasné SVG z návrhu.
2. **Ikony:** přidat `lucide-react`, nebo zůstat u vlastních inline SVG?
3. **PDF studie:** existuje soubor ke stažení, nebo se má generovat?
4. **Doména:** zůstává `web-b5qk.vercel.app` do spuštění, nebo bude vlastní doména (kvůli OG obrázkům a absolutním URL)?
