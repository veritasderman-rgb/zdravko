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
| `/ochrana-udaju` | jak zacházíme s osobními údaji, lhůty uchování, žádost o odkaz na vlastní údaje |
| `/ochrana-udaju/sprava?t=…` | náhled, stažení (JSON) a výmaz vlastních údajů z odkazu v e-mailu |
| `/potvrdit?t=…` | potvrzení veřejné připomínky tlačítkem z odkazu v e-mailu |

Texty jsou psané v první osobě množného čísla bez odborných výrazů; kde se jim nejde vyhnout, vysvětluje je slovníček. Grafy jsou v Recharts podle zásad dataviz (validovaná paleta, jedna osa, tenké pruhy, tabulková varianta u každého grafu).

## Interní část: připomínky k odborné studii (osobní účty a role)

Připomínkuje se jen odborná studie (`01-studie-zdravi-bliz-lidem-v3.md`); ostatní dokumenty slouží jako zdroj pro veřejný web.
Cesty `/rt`, `/d/studie`, `/pripominky`, `/overit`, `/kody`, `/lide` a export chrání `src/proxy.ts`.

**Účty a role** (`src/lib/roles.ts`, `src/lib/accounts-core.ts`). Každý člen týmu má účet s e-mailem a rolí; přihlašuje
se jednorázovým odkazem z e-mailu (platí 20 minut, potvrzuje se tlačítkem, aby ho nespotřebovala kontrola pošty).
Sdílený přístupový kód už není. Role:

| Role | Smí |
| --- | --- |
| čtenář | číst studii a připomínky, psát připomínky a odpovědi |
| garant | navíc třídit (garant, téma, priorita), posouvat do stavu „návrh vypořádání“, vést registr „Ověřit“, vidět e-maily veřejnosti |
| oponent | navíc potvrdit návrh vypořádání („zkontrolováno“), nebo ho vrátit k řešení |
| autor | totéž co garant, navíc rozhodnout o vypořádání a exportovat |
| koordinátor | všechno, navíc zveřejnit vypořádání a spravovat lidi na `/lide` |

Oprávnění se kontrolují na serveru (změna stavu, registr, export, správa lidí); stránky jen skrývají ovládání,
které role nemá. Role a aktivita se čtou z databáze při každém požadavku, takže deaktivace platí hned. Koordinátor
musí zůstat aspoň jeden. Prvního založíte z příkazové řádky:

```bash
pnpm users:add --email jana@example.cz --name "Jana Nováková" --role koordinator --org "RT zdravotnictví"
pnpm users:list
```

## Co interní část umí

- **Čtečka** studie rozsekané na bloky (nadpis, odstavec, odrážka, tabulka, citace)
  se stabilním klíčem `cesta-nadpisů#druhN`. Osnova vlevo s počty připomínek, text uprostřed, připomínky vpravo.
- **Strukturovaná připomínka** k bloku: typ, závažnost (zásadní / doporučující / redakční), úryvek (předvyplní se
  označením textu), text, návrh nového znění, zdroj, přepínač „Ověřit“, kódy opatření (předvyplněné z bloku nebo
  z nadpisu sekce), za sebe / za organizaci. Odpovědi ve vlákně.
- **Seznam připomínek** s filtry (dokument, stav, závažnost, typ, kód, text), změna stavu, garant a téma vypořádání,
  **export CSV** (`?verejne=1` skryje jména osob, zůstává jen organizace).
- **Registr „Ověřit“**: 100 míst vytěžených ze studie, stav, kdo ověří, výsledek. U každé položky je předpřipravené,
  co k ní má HSPA Monitor (registr `src/content/overeni-hspa.json`, viz níže).
- **Registr kódů** J1–J10, P1–P5, Pil, M, H1–H8, D1–D12, R1–R19, B1–B4 (132 kódů) s popisem z registru opatření,
  výskyty v textu, připomínkami a filtrem dokumentu podle kódu (`/d/studie?kod=J2`).
- **Přístup** osobním účtem s rolí, přihlášení odkazem z e-mailu (podepsaná cookie). Jména osob se nikdy
  nezveřejňují, do veřejného vypořádání jde jen organizace.

## Stack

Next.js 16 (App Router, server actions), Tailwind 4, Drizzle ORM, Neon Postgres (eu-central-1, projekt
`zdravi-bliz-lidem`, databáze `zdravko`), remark pro import Markdownu.

## Spuštění

```bash
cd web
pnpm install
cp .env.example .env.local   # doplňte DATABASE_URL, SESSION_SECRET, RESEND_API_KEY
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

**Veřejné připomínky a osobní údaje** (`src/lib/privacy-core.ts`, stránka `/ochrana-udaju`):

- Veřejná připomínka se uloží jako čekající (`comments.verify_token_hash`) a autorovi přijde odkaz k potvrzení.
  Potvrzuje se tlačítkem na stránce `/potvrdit`, ne samotným otevřením odkazu, aby ji nepotvrdila kontrola pošty.
  Do fronty týmu, počtů ve čtečce a exportu se dostane až po potvrzení; čekající ukáže `/pripominky?overeni=ceka`.
  Když se potvrzovací e-mail nepodaří odeslat, připomínka se smaže a autor dostane chybu.
- Omezení: z jedné adresy IP 5 připomínek za 10 minut a 20 za den, z jednoho e-mailu 5 za 10 minut, celkem 30 za
  minutu; nejvýš tři odkazy v textu; stejný text ze stejného e-mailu za 24 hodin se neuloží podruhé. Tabulka
  `rate_hits` drží jen HMAC adresy IP nebo e-mailu (klíč `PRIVACY_SECRET`, jinak `SESSION_SECRET`).
- Lhůty: nepotvrzená připomínka 7 dní, záznamy limitů 30 dní, jméno a e-mail veřejné připomínky 24 měsíců.
  Maže je denně `/cron/retence` (`vercel.json`, potřebuje `CRON_SECRET`), ručně `pnpm gdpr:retence`.
- Export a výmaz: autor si na `/ochrana-udaju` nechá poslat podepsaný odkaz platný 24 hodin. Výmaz smaže nepotvrzené
  připomínky celé, u ostatních odstraní jméno, e-mail, organizaci a text a vyčistí auditní záznamy; ve vypořádání
  zůstane číslo, místo ve studii a stav.

**Odběr novinek** (`src/lib/brevo.ts`, `src/app/novinky-actions.ts`): formulář na úvodní stránce a v patičce pošle
podepsaný odkaz platný 48 hodin; kontakt jde do Brevo až po potvrzení tlačítkem na `/novinky/potvrdit`. Web e-mail
sám neukládá, drží jen otisk pro limity (10 přihlášek z adresy IP za hodinu, 3 na e-mail za den). Seznam
„Zdraví blíž lidem — novinky“ ve složce „Zdraví blíž lidem“ najde podle názvu, nebo ho při prvním potvrzení založí;
potřebuje `BREVO_API_KEY`, číslo seznamu lze pevně dát `BREVO_LIST_ID`. Odhlášení obstarává Brevo odkazem v každé
rozesílce.

**Vysvětlující video** (úvodní stránka, `#video`): 87 s, scény ve stylu webu, ženský komentář (ElevenLabs, hlas
Aneta), titulky a celý text pod videem. Text komentáře po větách je v `src/content/video.ts` (zároveň titulky a textová
verze), scény ve `video/sceny.html` (jedna scéna na odstavec, prvky se objevují podle času slov), nahrávka a časy slov
ve `video/narrace.mp3` a `video/narrace-slova.json`. `pnpm video:render` (potřebuje ffmpeg a Playwright s Chromiem)
vyrobí `public/video/vysvetleni.mp4`, `.vtt` a náhled `.jpg`; `--jen-nahled` přegeneruje jen náhled. Při změně
textu je potřeba nová nahrávka a její přepis s časy slov (ElevenLabs Scribe) do `narrace-slova.json`; počet vět
v nahrávce musí sedět s `video.ts`, jinak render skončí chybou.

Nasazení změn schématu: vždy nejdřív `pnpm db:push` (přidávají se jen sloupce a tabulky, starý kód je ignoruje),
pak sloučit kód. Mazání podle lhůt potřebuje ve Vercelu `CRON_SECRET`.

**Testy a kontroly.** `pnpm test` spouští testy nad PGlite (Postgres v paměti), bez sdílené databáze: přiřazení
kotev, migraci připomínek ze studie v3 na v3.1 na skutečných souborech, doplnění kotev do starých dat, validaci
a transakce zápisů, export bez osobních údajů, limity, potvrzení e-mailem, odkaz na vlastní údaje, výmaz a lhůty
uchování, role a jejich vynucení, přihlášení odkazem a správu lidí. GitHub Actions (`.github/workflows/ci.yml`) pouští u každého PR
lint, typecheck, testy a build.

## Struktura

| Cesta | Co |
| --- | --- |
| `scripts/import.ts` | import Markdownu; logika v `src/lib/importer.ts` (bloky, kotvy, mapování verzí, „Ověřit“, registr kódů) |
| `scripts/anchors-backfill.ts` | jednorázové doplnění kotev do starých verzí a navázání existujících připomínek |
| `src/lib/comments-core.ts` | zápisy připomínek: společná validace a transakce s auditem |
| `src/lib/privacy-core.ts`, `src/app/udaje-actions.ts` | limity, potvrzení e-mailem, export, výmaz a lhůty uchování osobních údajů |
| `src/app/cron/retence`, `scripts/retence.ts` | denní a ruční mazání podle lhůt |
| `tests/` | testy (Vitest + PGlite) |
| `src/content/overeni-hspa.json`, `src/content/overeni-hspa.ts` | registr ověření studie proti HSPA Monitoru (skorezdravotnictvi.cz): 1 000+ míst studie (položky „Ověřit“, faktická tvrzení, ukazatele H1–H8 a D1–D12, čísla z `cisla.ts`) s tím, co k nim HSPA má (indikátor, článek, registrované tvrzení) a verdiktem potvrzuje / upřesňuje / rozpor / má téma / nemá; čtečka u bloku ukáže štítek a odkazy, `/cisla` a `/overit` totéž u čísel a položek Ověřit. Čitelná verze je `../docs/overeni-hspa.md`. `pnpm check:overeni` hlídá, že každý záznam sedí na blok studie a každé „Ověřit“ má záznam; běží v CI |
| `src/content/figures/vazby.ts` | mapa vazeb opatření v čase, organigramy pilířů, matice vlivů; `pnpm check:vazby` hlídá, že vazba „bez A nejde B“ nemíří proti času a že organigramy obsahují všechna opatření registru |
| `src/db/schema.ts` | tabulky: documents, document_versions, blocks, codes, comments, resolutions, verifications, events, rate_hits, users, login_tokens |
| `src/lib/codes.ts` | regulární výraz a pomocníci pro kódy J/P/Pil/M/H/D/R/B |
| `src/lib/session.ts`, `src/lib/auth.ts`, `src/proxy.ts` | podepsaná cookie s účtem a rolí, kontrola aktivního účtu, ochrana interních stránek |
| `src/lib/roles.ts`, `src/lib/accounts-core.ts`, `src/app/(rt)/lide`, `scripts/users.ts` | role a oprávnění, přihlášení odkazem, správa lidí |
| `src/app/(web)` | veřejný web; `src/components/charts` grafy a kalkulačky; `src/components/web` navigace a prvky |
| `src/app/(rt)/d/[slug]` | čtečka studie |
| `src/app/(rt)/pripominky`, `src/app/api/export/pripominky` | seznam a CSV export |
| `src/app/(rt)/overit`, `src/app/(rt)/kody` | registry |
| `src/app/actions.ts` | server actions: vstup, připomínka, odpověď, stav, ověření |

## Co je další krok (podle návrhu)

Vypořádání s odůvodněním a kontrolou oponenta (tabulka `resolutions` už existuje), témata a garantství
navázaná na účty, otázky pro RT, registr závazných čísel, interaktivní grafy, kalkulačky
(nejdřív platba státu a daně za zdraví), veřejná část.
