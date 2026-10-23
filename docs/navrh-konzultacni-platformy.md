# Konzultační platforma „Zdraví blíž lidem“ — návrh, co má umět a jak má vypadat

Pracovní návrh · 23. 10. 2026 · vychází z přečtení všech šesti dokumentů v repozitáři (studie v3, politická verze, one-pager, podklad pro PEER, dvě prezentace)

## 1. Co jsem v reformě našel a co z toho plyne pro nástroj

Reforma není jeden text, ale **pevně kódovaný systém**, který se dá přímo převést na datový model:

| Co dokument obsahuje | Počet | Kde |
| --- | --- | --- |
| Opatření jádra J1–J10, podmínky P1–P5 | 15 | Část II, III, Registr opatření |
| Doplňková opatření pilířů Pil1.1–Pil5.7 | 30 | Registr opatření |
| Opatření doprovodu M1.1–M10.5 (10 briefů Manifestu) | 44 řádků (37 vlastních) | Část XI, Registr |
| Ukazatele H1–H8 a D1–D12 | 20 | Část IX |
| Rizika R1–R19 | 19 | Část X |
| Brány B1–B4 s prahy | 4 | Část VIII, IX |
| Kroky „co všechno se musí stát“ | 29 | Manažerské shrnutí |
| Závazky s termínem a ověřením | 20 | Politická verze, Registr závazků |
| Vládní předlohy a náš postoj | 10 | Část VI |
| Legislativní předlohy ve vlnách 0–4 | 20 | Část VII |
| Značky „Ověřit:“ (otevřená ověření) | 106 značek, 80 položek | celá studie, Příloha B |
| Otevřené otázky pro RT | 21 | Část XI (2–3 na brief) |
| Výhrady posudku / opravy se stavem vypořádání | 10 / 20 | Příloha B |
| Subjekty ke konzultaci (10 klíčových pro bránu B1) | 16 | Část VIII, mapa aktérů |
| Kulaté stoly s jedním výstupem | 9 | Část VIII |
| Zástupné grafy „interaktivní verze je v Claude Docs“ | 33 | celá studie |
| Tabulky | 86 | studie |

Z toho plyne pět závěrů pro návrh:

1. **Připomínka se musí vázat na kód, ne jen na odstavec.** Studie sama žádá „u každé připomínky číslo opatření (J1–J10, P1–P5) nebo části“. Vypořádání podle témat je pak přirozené: téma = pilíř nebo opatření, ne kapitola.
2. **Nástroj musí převzít proces, který už studie definuje.** Interní připomínky RT před 7. 12. 2026, první vnější kolo do 31. 3. 2027, zveřejněné vypořádání před bránou B1 (6/2028), role garant / oponent / koordinátor, pravidlo „jedna věc, jeden komentář, návrh znění a zdroj, neověřené označit Ověřit:“.
3. **Tři hotové „backlogy“ čekají na rozdělení 9. 11.:** 80 otevřených ověření, 21 otázek pro RT a 10 věcných záměrů + 10 briefů + 16 subjektů bez garanta. To není připomínkování, to je řízení práce. Platforma to má vést vedle připomínek, ne místo nich.
4. **Čísla se opakují v šesti dokumentech a už se rozcházejí.** Příklad: politická verze uvádí spotřebu alkoholu 11,2 l na dospělého (OECD 8,5), Část IX studie u ukazatele D8 uvádí 10,6 l za rok 2024 (OECD 8,4). Část V mluví o 10 předpokladech v Monte Carlo, podklad pro PEER o 12 vstupech. Potřebujeme jeden registr závazných čísel, na který se všechny texty odkazují.
5. **Dnešní stav (Claude Docs + komentáře + chybějící e-mail RT) nestačí** na vypořádání stovek připomínek od 16 subjektů s povinností zveřejnit každé vypořádání písemně. Komentář u textu je správný vstup, ale chybí stav, přiřazení, seskupení, export a veřejná tabulka vypořádání.

## 2. Pro koho a v jakém pořadí

| Fáze | Kdo | Co dělá | Termín |
| --- | --- | --- | --- |
| 0 Interní | členové RT (cca 10–15 lidí), Institut Pi, PEER | čtou, připomínkují, vybírají témata a garantství, řeší „Ověřit“ | do 9. 11. a 7. 12. 2026 |
| 1 Odborná konzultace | 16 subjektů, pracovní skupiny, kulaté stoly | strukturované připomínky za organizaci, stanoviska, memoranda | 12/2026 – 31. 3. 2027, stoly do 6/2028 |
| 2 Veřejnost | pacienti, novináři, kdokoli | čtou shrnutí, „co to znamená pro mě“, kalkulačky; připomínka přes formulář | od 12/2026 |
| 3 Vypořádání a brána B1 | RT, garanti, koordinátor | vypořádání každé připomínky, zveřejnění tabulky, evidence podpory 6 z 10 subjektů | průběžně, zveřejnit před 6/2028 |

Doporučení: postavit jednu aplikaci se třemi úrovněmi přístupu (interní / registrovaný subjekt / veřejnost), ne tři nástroje. Spustit nejdřív jen interní režim.

## 3. Co má platforma umět (moduly)

### 3.1 Čtečka dokumentu s kotvami

- Zdroj pravdy zůstává **Markdown v tomto git repozitáři**. Aplikace ho při každé verzi naimportuje a rozseká na bloky (nadpis, odstavec, tabulka, řádek tabulky, odrážka). Klíč bloku odvozený z cesty nadpisů a pořadí je jen vstupní adresa; při nové verzi importér sestaví **explicitní mapu starý blok → nový blok** (nejdřív shoda textu v téže sekci, pak nejbližší podobný text v téže sekci, zbytek ručně) a tu uloží k verzi, aby se dala zkontrolovat. Připomínka tak nese trvalé ID bloku, ne pořadí; vložený odstavec nic neposune. Bloky, které se spárovat nepodaří, se vypíší koordinátorovi k ručnímu přiřazení. MVP zatím mapu nestaví a klíč podle pořadí používá přímo; je to první věc, kterou je třeba dodělat před verzí v3.1.
- Levý panel: osnova (Části I–XI, přílohy), filtr podle kódu („ukaž mi vše k J2“), vyhledávání.
- U každého bloku: ikona komentáře s počtem, štítky kódů (J/P/Pil/M/H/D/R/B), značka „Ověřit“, odkaz na politickou verzi téhož tématu.
- Pravý panel: připomínky k vybranému bloku, vlákno odpovědí, stav vypořádání.
- Přepínač dokumentu: studie / politická verze / one-pager / podklad PEER / prezentace. Stejný kód propojuje všechny.
- Mobilní verze jen pro čtení a krátké komentáře (členové RT čtou v telefonu).

### 3.2 Strukturovaná připomínka

Formulář záměrně kopíruje požadavky studie, aby vypořádání bylo možné bez přepisování:

| Pole | Hodnoty |
| --- | --- |
| Kotva | blok dokumentu + označený úryvek textu (uloží se i citát, aby přežil přečíslování) |
| Kódy | jeden nebo více z J1–J10, P1–P5, Pil, M, H, D, R, B; návrh předvyplní z kotvy |
| Typ | chyba v čísle · věcná výhrada · návrh nového znění · chybí zdroj / evidence · právní riziko · otázka · podpora · redakční |
| Závažnost | zásadní (blokuje vydání / podporu) · doporučující · redakční (odpovídá zvyklosti meziresortního řízení) |
| Text připomínky | povinné, „jedna věc, jeden komentář“ |
| Návrh znění | nepovinné, ale zvýrazněné; umožní diff proti původnímu bloku |
| Zdroj | URL, PMID, číslo předpisu; pole „Ověřit:“ jako přepínač, pokud zdroj chybí |
| Za koho | sám za sebe · za organizaci (vybere z 16 subjektů nebo doplní) |
| Viditelnost | interní RT · registrovaní · veřejné (po zveřejnění vypořádání) |

Doplňky: hlasování „souhlasím s připomínkou“ (deduplikace), sloučení duplicit do jedné s odkazy na původní, hromadný import z e-mailu a z exportu Claude Docs / Google Docs komentářů (CSV), aby šlo převést to, co už v dokumentu je.

### 3.3 Vypořádání podle témat

- **Téma** = pilíř (5) nebo opatření (J, P, Pil, M) nebo průřez (peníze, ukazatele, legislativa, proces, rizika). Každé téma má garanta, oponenta a termín; garanty rozdělí schůzka 9. 11.
- Stavy připomínky: *nová → přiřazena → v řešení → návrh vypořádání (garant) → zkontrolováno (oponent) → vypořádána → zveřejněna*.
- Výsledek: *akceptováno · akceptováno částečně · neakceptováno · vysvětleno · mimo rozsah v3 (do další verze)*; povinné odůvodnění, nepovinný odkaz na změnu textu (commit / verze).
- Pohled garanta: fronta připomínek svého tématu, hromadné vypořádání podobných, šablony odpovědí.
- Pohled koordinátora: všechny otevřené zásadní připomínky, lhůty, kdo je pozadu, konflikt dvou garantů nad stejným blokem.
- Export **tabulky vypořádání** (připomínkové místo · připomínka · typ · vypořádání · odůvodnění · změna textu) do XLSX/CSV/PDF a veřejná stránka vypořádání před bránou B1. To je přímo závazek č. 1 v Registru závazků.
- Zápis z kulatého stolu jako zvláštní zdroj připomínek (9 stolů, každý s jedním výstupem).

### 3.4 Registr opatření, ukazatelů, rizik a bran jako databáze

- 89 řádků registru, 20 ukazatelů, 19 rizik, 4 brány a 20 předloh načíst z Markdownu do tabulek s vazbami (opatření ↔ ukazatel ↔ riziko ↔ brána ↔ předloha ↔ bloky textu ↔ připomínky).
- Karta opatření: text ze studie, nástroj, vlna, náklad, kdo, termíny v obou scénářích, evidence, počet připomínek, stav vypořádání, otevřená ověření, garant.
- Graf závislostí (Část IV) jako interaktivní síť: klik na J7 ukáže, co na něm stojí a co se zastaví při neúspěchu.

### 3.5 Pracovní backlogy RT (to, co se rozdělí 9. 11.)

- **Ověřit (80 položek):** každá s místem v textu, odpovědnou osobou, termínem, stavem (otevřeno / ověřeno – potvrzeno / ověřeno – opraveno / neověřitelné), zdrojem a výsledným textem. Po uzavření se značka v dokumentu změní automaticky v další verzi.
- **Otázky pro RT (21):** rozhodovací záznam: otázka, varianty, kdo rozhoduje, střet zájmů (briefy 3 a 4 bez hlasu autora), rozhodnutí, datum, promítnutí do textu.
- **Garantství:** 10 věcných záměrů, 10 briefů, 16 subjektů, podněty k vyhlášce, 4 předlohy, pilot: kdo je garant, kdo oponent, střet zájmů, termín. Člen RT si „vybere 1–2 témata“ přímo v aplikaci.
- **Vypořádání posudku:** 10 výhrad a 20 oprav už mají stavy; jen je převést do stejného registru, ať je jeden přehled, co je ještě „částečně“.

### 3.6 Registr závazných čísel

- Jedna tabulka čísel s definicí, hodnotou, rozpětím, rokem, cenovou hladinou, zdrojem a jistotou (Část V už má tabulku vstupů s 12 řádky; politická verze „Deset čísel, která budeme opakovat“; podklad pro PEER tabulku „co je uvnitř čeho“).
- Každý výskyt čísla v šesti dokumentech se k registru přiváže; aplikace hlásí odchylky (viz 11,2 vs 10,6 l) a při změně modelu ukáže, které věty v kterých dokumentech se musí přepsat.
- Veřejná stránka „Čísla, za která ručíme“ s odkazem na výpočet v modelu.

### 3.7 Shrnutí a „co to znamená pro mě“

- Úvodní stránka: jedna věta cíle, 5 změn, 10 čísel, harmonogram s branami, co reforma nedělá, odpovědi na 8 námitek. Vše už je v politické verzi, jen se přeskládá.
- **Pohledy podle role** vyrobené z mapy aktérů a tabulky „Co od vás potřebujeme“: praktik, dětský praktik, sestra, pojišťovna, kraj, obec, nemocnice a odbory, poskytovatel sociálních služeb, pacient, MF/NRR, koaliční partner. Každý pohled: co nabízíme · co potřebujeme · první krok a termín · které J/P se vás týkají · tlačítko „připomínkovat tuto část“.
- **Cesta pacienta** jako klikací příběh (chronik, křehký senior, člověk bez praktika, zdravý třicátník) z tabulky „dnes / po reformě“.
- Časová osa 2026–2038 s fázemi F0–F4, branami, účinnostmi zákonů a tím, co se stane při nesplnění brány.

### 3.8 Dopady změny (interaktivní grafy místo 33 zástupných)

Studie má 33 míst „Graf/diagram — interaktivní verze je v Claude Docs“. Navrhuji je postavit přímo v aplikaci nad daty z registru a modelu, aby grafy a text sdílely jedna čísla:

kritická cesta (3 řetězce, 4 brány) · teorie změny (5 řetězců) · tři vrstvy opatření · cesta pacienta · varianty A/B/C · náběh 2028–2038 · tornádo citlivosti a Monte Carlo · tok peněz 2038 · platba státu · bilance sester · úbytek praktiků · harmonogram · mapa aktérů · matice rizik · řízení reformy · legislativní zátěž podle let · výchozí stav po krajích (lůžka, obložnost, praktici).

### 3.9 Kalkulačky

Většina stojí na vzorcích, které studie už uvádí (platba státu, sestry, lůžka, tým pro ORP, brána B3). Daňová kalkulačka je výjimka: studie uvádí jen scénářové odhady výnosu a sama říká, že přesné sazby daně ze slazených nápojů určí dopadová studie v roce 2028 a podíl malých vinařů je neznámý. Kalkulačka proto bude přepočítávat jen rozpětí scénářů studie podle zvoleného předpokladu (sazba, elasticita, podíl malých vinařů) a každý výsledek označí jako scénář s uvedenými předpoklady, ne jako fiskální odhad. Model v3 online závisí na dodání skriptu.

| Kalkulačka | Vstupy | Výstup | Odkud vzorec |
| --- | --- | --- | --- |
| Model v3 online | 12 vstupů (počet týmů, podíl praktiků v týmech, sester na lékaře, plat sestry, platby týmům, úspory, fond přeměny, …) posuvníky s rozpětími | čistý náklad 2035/2038/2050, varianty A/B/C, tornádo | model_v3.py (musí být v repozitáři, zatím není) |
| Platba státu | Kč měsíčně na státního pojištěnce, sazba pojistného, výnos daní | mld. Kč ročně, podíl stát/práce/spotřeba/obce, V1 vs V2 | 100 Kč = 7,2 mld. Kč; +1 p. b. = 27 + 11,7 mld. Kč |
| Daně za zdraví | sazba na víno, pásma cukru, elasticity (−0,69; −1,59), režim malých vinařů | výnos po reakci poptávky, rozdělení 2 mld. fond / zbytek platba státu | Část V, podklad PEER |
| Kolik zaplatím já | sklenek vína týdně, litrů slazených nápojů | Kč ročně | 0,2 l týdně = 240 Kč/rok; 6–8 Kč/l |
| Sestry | počet sester navíc, rok, plat | náklad, podíl absolventek, vrchol náboru | 0,998 mil. Kč na sestru, 1 300 absolventek |
| Lůžka v kraji | kraj, obložnost, přeměněná lůžka, tempo | stop pravidlo 85 %, garance příjmu, obložnost po přeměně | 1 500 Kč/lůžko/den × 60 % × 3 roky; 56 % × 48 036 / 40 000 |
| Tým pro mé ORP | obyvatel ORP, praktiků, sester | velikost týmu, náklad, senior taxi | 10–25 tis. na tým, 13 mil. Kč na tým v pilotu, 1,1 mil. Kč na vůz |
| Brána B3 | obsazená místa sester, stav zákona, krajské plány | A, nebo B; co se nestaví | pravidla rozhodování |

Každý výsledek má tlačítko „připomínkovat předpoklad“, které otevře připomínku s kódem a hodnotou vstupu.

### 3.10 Verze dokumentu a změny

- Verze v3 → v3.1 → … s datem; diff bloků; u každé změny seznam připomínek, které ji vyvolaly („tato věta se změnila kvůli #12, #40“), a naopak u připomínky odkaz na změnu.
- Changelog „co se změnilo proti v3“ generovaný ze stavů vypořádání, stejně jako dnes existuje „Co se změnilo proti verzi 2“.
- Export celé studie i politické verze do PDF/DOCX pro ty, kdo chtějí číst mimo web.

### 3.11 Lidé, přístup, upozornění

- Role: správce · koordinátor · člen RT (garant/oponent podle tématu) · zástupce subjektu · registrovaný čtenář · veřejnost.
- Přihlášení odkazem v e-mailu (bez hesel), pozvánky po organizacích; u subjektu se eviduje oficiální stanovisko zvlášť od individuálních komentářů jeho lidí.
- Upozornění: garantovi nová připomínka v jeho tématu; týdenní souhrn pro RT před schůzkou (27. 10., 9. 11., 7. 12.); připomínkujícímu zpráva o vypořádání.
- Střet zájmů: pole u člena RT, zobrazuje se u jeho vypořádání (studie to vyžaduje u briefů 3 a 4).
- Evidence memorand: 10 klíčových subjektů, stav (jednáme / stanovisko / memorandum podepsáno), cíl 6 z 10 do 6/2028.

### 3.12 Pomoc s textem (volitelné, s Claude API)

- Návrh kódů a typu pro novou připomínku, upozornění na duplicitu.
- Návrh textu vypořádání z podobných už vypořádaných připomínek; garant vždy schvaluje.
- Kontrola čísel napříč dokumenty proti registru závazných čísel.
- Shrnutí vlákna s 30 komentáři pro schůzku RT.

## 4. Jak by to mělo vypadat (návrh obrazovek)

1. **Domů (veřejné):** věta cíle, 5 změn, časová osa s branami, 10 čísel, „vyberte svou roli“, stav konzultace (kolik připomínek, kolik vypořádáno, do kdy).
2. **Dokument:** tři sloupce: osnova a filtry · text s kotvami a štítky · připomínky k vybranému bloku. Nahoře přepínač verze a dokumentu.
3. **Připomínky:** tabulka s filtry (téma, kód, typ, závažnost, stav, subjekt, autor, datum), hromadné akce, export.
4. **Témata:** dlaždice pilířů a opatření se semaforem (otevřené zásadní / v řešení / vypořádáno), garant, termín.
5. **Registr:** opatření · ukazatele · rizika · brány · předlohy · čísla; karta s vazbami a grafem závislostí.
6. **Práce RT (interní):** Ověřit · Otázky pro RT · Garantství · Posudek · Memoranda · schůzky s podklady.
7. **Dopady a kalkulačky:** 8 kalkulaček a interaktivní grafy, každý s odkazem do textu a na předpoklad v modelu.
8. **Vypořádání (veřejné od 2028):** tabulka vypořádání, stažení, statistiky podle subjektů.

Vzhled: klidný, textový, bez stranických barev na veřejné části (konzultační verze „není program strany“), tisknutelný. Štítky kódů a stavů barevně, jinak střídmě. Čeština, přístupnost (klávesnice, kontrast), aby ji mohly používat pacientské organizace.

## 5. Technické řešení (doporučení)

- **Databáze: Neon Postgres** v eu-central-1 (Frankfurt), nový projekt ve stávající organizaci; větve Neonu na vývoj a náhled. Fulltext přes `unaccent` + `pg_trgm` (Postgres nemá český stemmer; pro vyhledávání v připomínkách to stačí).
- **Aplikace: Next.js (App Router) na Vercelu**, ORM Drizzle, migrace v repozitáři. Stejný vzor jako vaše dotazníkové projekty v Neonu.
- **Přihlášení:** Auth.js s odkazem v e-mailu (Resend), nebo Neon Auth. Žádná hesla.
- **Import dokumentu:** skript `remark` → bloky s ID → tabulky `blocks`, `block_codes`; spouští se při každé změně Markdownu (GitHub Action), stará verze zůstává.
- **Model:** port `model_v3.py` do TypeScriptu s testem, že dává stejná čísla jako Python (pevné semínko 2026). Bez toho kalkulačka „Model v3“ nejde postavit.
- **Grafy:** jedna knihovna (např. Recharts / D3 pro síť závislostí), data vždy z databáze, nikdy natvrdo.
- **Export:** XLSX a CSV ze serveru; PDF přes tisk stránky s tiskovým stylem.
- **Audit:** každá změna stavu připomínky s autorem a časem; nic se nemaže, jen skrývá.

Datový model (jádro): `documents`, `document_versions`, `blocks`, `codes` (opatření/ukazatel/riziko/brána/předloha/číslo), `block_codes`, `users`, `organizations`, `memberships` (role), `topics` (téma, garant, oponent, termín), `comments` (kotva, úryvek, typ, závažnost, text, návrh znění, zdroj, ověřit, za koho, viditelnost, stav), `comment_codes`, `replies`, `resolutions` (výsledek, odůvodnění, odkaz na změnu, kontrola oponenta), `verifications` (Ověřit), `open_questions` a `decisions`, `assignments` (garantství), `memoranda`, `numbers` (registr čísel) a `number_occurrences`, `events` (audit).

### Proč ne jen Claude Docs / Google Docs / Notion / GitHub

| Varianta | Co umí | Co chybí pro naši potřebu |
| --- | --- | --- |
| Claude Docs / Google Docs komentáře | komentář u textu, rychlý start, už běží | stav, přiřazení, téma, export tabulky vypořádání, veřejné zveřejnění, kalkulačky, 16 subjektů bez chaosu |
| Notion | databáze, pohledy, role | komentář ukotvený k větě studie, veřejná část, kalkulačky; závislost na cizím nástroji pro veřejnou konzultaci |
| GitHub Issues / Discussions | stavy, štítky, verze textu | nepoužitelné pro lékaře, pacienty a kraje; žádná čtečka ani čísla |
| Vlastní aplikace (návrh) | vše výše | nutné postavit a provozovat; odhad níže |

Doporučuji vlastní aplikaci a mezitím ponechat komentáře v Claude Docs do 9. 11. a pak je importovat.

## 6. Postup a milníky (sladěné s kalendářem RT)

| Do kdy | Co bude hotové | Komu slouží |
| --- | --- | --- |
| 27. 10. 2026 | rozhodnutí o nástroji; založení Neon projektu a repozitáře aplikace; import studie a politické verze do bloků (prototyp čtečky bez přihlášení) | schůzka RT: ukázat, jak to bude vypadat |
| 9. 11. 2026 | MVP interní: přihlášení, čtečka s kotvami, strukturovaná připomínka, témata a garantství, registr Ověřit a Otázky pro RT, import dosavadních komentářů | rozdělení témat, záměrů a briefů přímo v aplikaci |
| 7. 12. 2026 | vypořádání (stavy, oponent, export), registr opatření/ukazatelů/rizik, registr čísel, kalkulačky platba státu a daně za zdraví, verze v3.1 | schválení v3 ke konzultaci se seznamem interních připomínek a jejich vypořádáním |
| 12/2026 | veřejná část: shrnutí, role, cesta pacienta, časová osa, formulář pro veřejnost, registrace subjektů | start veřejné konzultace a pacientských organizací |
| 1. čtvrtletí 2027 | model v3 online, zbylé kalkulačky a grafy, modul kulatých stolů, memoranda | pracovní skupiny, kulaté stoly 2/2027 a 4/2027 |
| 31. 3. 2027 | uzávěrka 1. kola, statistiky, průběžná tabulka vypořádání | RT, subjekty |
| do 6/2028 | veřejná tabulka vypořádání, podklad pro bránu B1 | brána B1 |

Odhad práce: MVP do 9. 11. zhruba 2–3 týdny vývoje jednoho člověka s AI podporou, veřejná část do 12/2026 další 3–4 týdny, model a kalkulačky 2 týdny po dodání skriptu. Provoz Neon + Vercel v řádu stovek korun měsíčně v interní fázi.

## 7. Co potřebuji od vás, abych mohl začít stavět

1. **model_v3.py a tabulku vstupů** přidat do repozitáře (studie slibuje zveřejnění; bez něj nejde kalkulačka ani registr čísel ověřit).
2. **Potvrdit stack:** Neon (nový projekt v organizaci) + Vercel + Next.js; doménu pro interní a veřejnou část.
3. **Seznam členů RT a e-maily** pro pozvánky; kdo je koordinátor (správce vypořádání).
4. **Rozhodnout o viditelnosti:** zda se jména připomínkujících zveřejňují ve vypořádání (u organizací ano jako v legislativním procesu; u jednotlivců navrhuji jen se souhlasem).
5. **E-mailovou adresu RT** pro připomínky mimo aplikaci (studie ji má jako „Ověřit“).
6. **Export dnešních komentářů** z Claude Docs verze 3, ať je naimportuji a nic se neztratí.
7. **Souhlas, že grafy budou v aplikaci**, ne v Claude Docs, a studie se na ně bude odkazovat.

## 8. Co jsem si při čtení poznamenal k samotné reformě (první připomínky do systému)

- Alkohol: 11,2 l (politická verze) vs 10,6 l za 2024 (Část IX, D8). Sjednotit a uvést rok.
- Monte Carlo: „10 hlavních předpokladů“ (Část V) vs „12 vstupů“ (podklad PEER). Sjednotit.
- Doprovod: „44 opatření“ v prezentaci vs „44 řádků, z toho 37 vlastních“ v registru. V prezentaci říkat 37, nebo „44 řádků“.
- Varianta B: v textu „asi 18“, v tabulkách 17,8. Drobnost, ale registr čísel ji pohlídá.
- Dvě místa slibují „zveřejněný model“, ale skript není v repozitáři ani v dokumentu. To je zároveň otevřená oprava č. 8 posudku.
- Prezentace pro RT odkazuje na komentáře v Claude Docs; po spuštění platformy je třeba přepsat slajd 13 a odstavec „Jak připomínkovat“ ve studii i v politické verzi.
