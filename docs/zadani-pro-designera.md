# Zadání pro designéra: web „Zdraví blíž lidem“

*Verze 1, 23. 10. 2026. Připravil resortní tým zdravotnictví. Kontakt: Josef Pavlovic.*

Současný web: https://web-b5qk.vercel.app · Zdrojový kód a texty: https://github.com/veritasderman-rgb/zdravko (složka `web/`, všechny texty v `web/src/content/reforma.ts`)

---

## 1. O co jde v jedné minutě

Máme hotovou odbornou studii reformy zdravotnictví (asi 120 stran, 89 opatření, horizont 2027–2038) a web, který ji má vysvětlit běžným lidem. Web dnes funguje, ale **vypadá jako technická dokumentace**: všechno je stejně důležité, odkazy jsou nenápadné textové řádky se šipkou, text je malý, nic nevede oko a nic člověka nenutí kliknout dál.

Potřebujeme **vizuální návrh (UI design) celého webu**, který:

1. umožní člověku do 30 sekund pochopit **co, proč a jak** chceme změnit,
2. ho **vede dál** jasnými výzvami k akci (přečíst pět změn, spočítat si dopad, přečíst studii, později poslat připomínku),
3. je **čitelný na mobilu** (čekáme, že většina lidí přijde z mobilu přes sociální sítě),
4. působí **klidně, lidsky a důvěryhodně**, jako veřejná služba, ne jako stranický web ani jako startup.

Web implementuje náš tým (Next.js, Tailwind). Od designéra potřebujeme návrh ve Figmě s komponentami a tokeny, ne kód.

---

## 2. Kontext

### Co web je

Veřejná prezentace návrhu reformy „Zdraví blíž lidem“, verze 3 ke konzultaci. Hlavní myšlenka: každý člověk má mít svého lékaře a svou sestru blízko domova; péče o dlouhodobě nemocné a staré lidi se má přesunout z nemocnic blíž k nim; nemocnice dostanou jistou roli; prevence stálé peníze.

Web má tři vrstvy:

| Vrstva | Pro koho | Stav |
|---|---|---|
| **Výkladový web** (co, proč, jak, peníze, pro koho, otázky, slovníček) | veřejnost, zdravotníci, novináři | hotový obsah, špatný design, **předmět tohoto zadání** |
| **Čtečka studie** (plné znění, osnova, bez komentářů) | odborná veřejnost | hotová, potřebuje design |
| **Připomínkování** (komentáře k odstavcům, vypořádání) | resortní tým, později organizace | funguje za heslem, design až ve 2. fázi, ale počítat s ním |

### Důležité: apolitický vzhled

Plán připravuje resortní tým jedné strany, ale web má sloužit **všem**, včetně odborných organizací, se kterými plán projednáváme (praktici, sestry, lékařská komora, pojišťovny, kraje, obce, pacienti, odbory). Proto:

- žádné stranické barvy, loga ani fonty strany v primární vrstvě webu,
- autor plánu je uveden v patičce a na stránce „Pro koho“, ne v hlavičce,
- tón: věcný, klidný, lidský. Ne kampaň, ne strach, ne útok na nikoho.

Pirátský styleguide (https://styleguide.pirati.cz) berte jen jako inspiraci v **principech**: odvaha ve velkých titulcích, jasná hierarchie, hodně vzduchu, čitelnost. Ne v barvách ani písmu.

### Technický rámec

- Next.js 16 + Tailwind 4, grafy v Recharts, část vizuálů čisté SVG. Implementujeme sami.
- Design potřebujeme jako **tokeny** (barvy, typografická škála, mezery na 4px mřížce, poloměry, stíny) a **komponenty s variantami** (Figma, Auto-layout).
- Bez obrázků s textem uvnitř (texty se budou měnit; čeština s diakritikou).
- Rozsah zařízení: 360 až 1440 px šířky.

---

## 3. Cílové skupiny a co od webu chtějí

| Skupina | Příchod | Co hledá | Co má udělat |
|---|---|---|---|
| **Veřejnost, pacienti 35–75 let** | sociální sítě, média, mobil | „Co se změní pro mě a mou mámu? Nezruší nám nemocnici? Budu platit víc?“ | přečíst pět změn, „Co reforma nedělá“, spočítat si dopad daní |
| **Praktičtí lékaři, sestry** | odborné skupiny, e-mail | „Co to znamená pro moji ordinaci? Co dostanu a co se po mně chce?“ | stránka Pro koho, časová osa, studie |
| **Odborná veřejnost, pojišťovny, kraje, novináři** | přímý odkaz | čísla, zdroje, rizika, varianty, poctivost | Peníze, Jak a kdy, studie, později připomínky |
| **Resortní tým, připomínkující organizace** | heslo | číst studii po odstavcích, komentovat, vypořádávat | čtečka, komentáře (2. fáze) |

Primární skupina pro design úvodní stránky je **veřejnost na mobilu**. Odborník si cestu najde, laik ne.

---

## 4. Co dnes nefunguje (poctivý rozbor současného webu)

Prohlédněte si web na mobilu i desktopu. Konkrétně:

1. **Hero bez tahu.** Titulek je dobrý („Každý člověk má mít svého lékaře a svou sestru blízko domova“), ale pod ním jsou tři rovnocenná tlačítka a jeden graf. Není jasné, co má člověk udělat. (Na produkci se navíc kvůli chybě buildu nezobrazilo tmavé pozadí, takže byl bílý text na světlém. Opravujeme, ale hero je slabé i s pozadím.)
2. **Výzvy k akci nejsou vidět.** Odkazy typu „Co přesně uděláme a kdy, krok za krokem →“ jsou textové řádky ve 14px zelené. Nic graficky neříká „sem klikni“. Tlačítka jsou malá (14px písmo, nízká výška), mají stejnou váhu jako cokoliv jiného.
3. **Všechno vypadá stejně.** Každá sekce je nadpis + mřížka karet s tenkým rámečkem. Karta s číslem, karta se změnou, karta s odkazem, karta s otázkou: stejná velikost, stejný rámeček. Oko nemá za co se chytit a nepozná, co je důležité.
4. **Příliš textu v malém písmu.** Popisky u vizuálů mají 10–12px, karty obsahují odstavce. Na mobilu je to zeď textu.
5. **Grafy jsou „inženýrské“.** Správně udělané (paleta, mřížka, tabulka), ale bez příběhu: titulek popisuje, co graf zobrazuje, místo aby řekl, co z něj plyne. Chybí zvýraznění jedné hodnoty, o kterou jde.
6. **Chybí člověk.** Celý web je abstraktní: čísla, karty, schémata. Reforma je o lékaři, sestře a pacientovi doma. Nikde není vidět.
7. **Navigace bez priority.** Sedm položek vedle sebe plus dvě vpravo, na mobilu dvouřádkové menu. Není jasné, kudy začít.
8. **Typografie neladí.** Kombinace Geist (text) a Barlow Condensed (titulky) působí sportovně až „fitness“, ne zdravotnicky. Kondenzované písmo se špatně čte ve velkých blocích a v češtině má problémy s diakritikou.
9. **Časová osa a schémata jsou malé a hustě popsané**, na mobilu nečitelné (horizontální osa s 11px popisky).

Co funguje a chceme zachovat: **obsah** (texty jsou přepsané do srozumitelné češtiny, strukturu stránek považujeme za správnou), poctivost (rozpětí nákladů místo jednoho čísla, sekce „Co reforma nedělá“, rizika), a datová disciplína grafů (zdroj, rok, tabulka).

---

## 5. Rešerše: co funguje jinde

Prošli jsme zahraniční weby reforem, vládní design systémy, zdravotnické think-tanky a datovou žurnalistiku. Co si vzít a co ne:

### Vládní design systémy a zdravotnické weby

| Web | Co si vzít | Na co pozor |
|---|---|---|
| **GOV.UK design system** (design-system.service.gov.uk) a **NHS design system** (service-manual.nhs.uk) | **Jedno velké „Start now“ tlačítko na stránku** (zelené, se šipkou, výška 56px, text 19px). Základní text **19px**, řádek max. 65–75 znaků, levé zarovnání, žádné centrování odstavců. Karty, kde **celý nadpis je odkaz** a karta má jednu větu popisu a šipku. Vysoký kontrast, podtržené odkazy, fokus stavy žlutě. Hero NHS: tmavě modrý blok s bílým titulkem přes fotografii skutečného personálu. | Vizuálně strohé až úřední. My chceme stejnou čitelnost, ale teplejší a lidštější výraz. |
| **healthcare.gov** (USA) | Hero s **jedním zeleným primárním tlačítkem** („Apply for coverage“) a vedle něj čtyři „rychlé akce“ s ikonou. Lidé na fotografii, ne budovy. Měkká vlna pozadí odděluje hero od obsahu bez tvrdé hrany. Krátká, úkolová navigace. | Americká estetika (stock fotky, stíny karet). Použít princip, ne vzhled. |
| **Bundesministerium für Gesundheit, stránka Krankenhausreform** (bundesgesundheitsministerium.de) | Sticky **„Obsah stránky“** vlevo pro dlouhé stránky, FAQ, verze v „jednoduché řeči“ a znakové řeči (přístupnost jako viditelná funkce). | **Negativní příklad pro náš cíl**: zeď textu, odrážky, žádná výzva k akci, žádný vizuál. Tak náš web vypadat nemá. |
| **soteuudistus.fi** (finská reforma sociální a zdravotní péče), **Sláintecare** (gov.ie, irská reforma), **Future of Health** (NZ) | Dedikované weby reforem se strukturou „Co se mění / Pro koho / Harmonogram / Otázky a odpovědi / Materiály“. Časová osa reformy jako samostatný prvek. Sekce „pro občany“ vs. „pro odborníky“ hned na úvodu. | Tyto weby se nám z pracovního prostředí nepodařilo načíst, designér ať si je otevře sám. Bývají obsahově těžké; vzít strukturu, ne hustotu. |

### Zdravotnické think-tanky

| Web | Co si vzít |
|---|---|
| **Nuffield Trust** (nuffieldtrust.org.uk), **The Health Foundation** (health.org.uk), **The King's Fund** (kingsfund.org.uk) | Tmavá hlavička + světlý obsah, velké karty s **ilustrací** místo fotky, **štítek typu obsahu** („Explainer“, „Long read“, „Briefing“), autor a datum u každého textu = důvěra. Jejich „explainery“: jedno číslo, jedna věta, jeden graf na sekci. Nuffield „NHS staffing tracker“: data jako sledovatelný příběh, ne tabulka. |
| **Commonwealth Fund** (commonwealthfund.org), „Mirror, Mirror“ srovnání zdravotních systémů | Mezinárodní srovnání jako žebříček s jednou zvýrazněnou zemí. Pro nás: Česko vs. Portugalsko, Dánsko, Estonsko (odkud si půjčujeme). |

### Datová žurnalistika a datové weby

| Web | Co si vzít |
|---|---|
| **Our World in Data** (ourworldindata.org) | Každý graf má **titulek jako tvrzení**, podtitulek s definicí, zdroj a tlačítka „tabulka / stáhnout“. Tmavý hero, pod ním hned obsah. Čipy „populární témata“ jako rychlý vstup. |
| **The Pudding** (pudding.cool), **Reuters Graphics**, **FT Visual**, **NYT Upshot** | **Scrollytelling**: jeden graf, který se mění, jak čtenář scrolluje, a jedno sdělení na obrazovku. Velké číslo + krátká věta. **Anotace přímo v grafu** místo legendy („tady se Česko odchýlilo“). Pro nás vhodné na stránce Proč (šest grafů) a Peníze (tok peněz). |
| **Information is Beautiful Awards** (informationisbeautifulawards.com) | Galerie pro inspiraci u vizuálů „kolik lůžek, kolik týmů“: pictogramy, waffle grafy, lidské ikony místo sloupců. |

### Z toho plyne pro náš web

1. **Jeden hlavní krok na obrazovku**, graficky nepřehlédnutelný (velké tlačítko).
2. **Větší písmo, kratší řádky, méně slov na obrazovku.**
3. **Karty, které vypadají jako odkazy** (nadpis jako odkaz, šipka, hover), ne jako rámečky s textem.
4. **Grafy s tvrzením a jednou zvýrazněnou hodnotou.**
5. **Lidé v ilustracích**: lékař, sestra, pacient doma, obec. Ne budovy, ne stock fotky nemocničních chodeb.
6. **Štítky důvěry**: zdroj, rok, „Ověřit“ u čísel, která ještě ověřujeme, autor a datum.

---

## 6. Designové principy (závazné)

1. **Jedna obrazovka = jedno sdělení = jedna akce.** Na každé obrazovce výšky mobilu je jasné, co se tu říká a kam dál. Maximálně jedno primární tlačítko na obrazovku.
2. **Čitelnost první.** Základní text 18–20px, řádek 60–75 znaků, řádkování 1.5–1.6. Popisky nikdy pod 13px. Kontrast textu min. 4.5:1 (WCAG AA), u velkých titulků 3:1.
3. **Tři úrovně tlačítek**: primární (plná akční barva, výška 52–56px, text 17–19px, šipka), sekundární (obrys), textový odkaz (podtržený). Primární barva se používá **jen** pro akce, nikde jinde.
4. **Čísla vyprávějí.** Velké číslo (48px+), pod ním jedna věta, co znamená, a zdroj. Ne čtyři čísla vedle sebe ve stejné velikosti.
5. **Graf je tvrzení.** Titulek grafu říká, co z něj plyne („Praktiků pro dospělé ubývá, od 2010 o 12 %“). Jedna série zvýrazněná, ostatní šedé. Anotace v grafu. Vždy zdroj, rok, přepnutí na tabulku.
6. **Člověk v obraze.** Jednotná ilustrační sada: lékařka a sestra v týmu, pacient doma, senior taxi, obecní zdravotní centrum, nemocnice s novou rolí. Lidé různého věku. Ne karikatura, ne roztomilý „corporate Memphis“ styl, ne fotky stock modelů.
7. **Klid a důvěra.** Zdravotnictví je téma strachu („zruší nám nemocnici“). Design má uklidňovat: hodně vzduchu, teplé neutrály, žádná červená mimo grafy, žádné blikání, žádné odpočty.
8. **Mobil první.** Návrh začíná na 390px. Časová osa na mobilu vertikálně. Tabulky na mobilu jako karty. Dotykové cíle min. 44px.
9. **Poctivost je součást vzhledu.** Rozpětí („15 až 25 mld.“), rizika, „Co reforma nedělá“, „Ověřit“ štítky mají svůj vizuální jazyk (klidný, ne varovný), ne poznámky pod čarou.

---

## 7. Vizuální směr

### Nálada

Klidné, lidské, srozumitelné, důvěryhodné. Moderní veřejná služba. Slova, která to vystihují: *blízko, doma, jistota, srozumitelně, poctivě*. Slova, kterým se vyhnout: *kampaň, boj, revoluce, krize*.

### Barvy

Navrhněte paletu, ne přebírejte naši. Požadavky:

- **Primární barva** z rodiny zelené/petrolové/modrozelené (zdraví, klid, péče; neutrální vůči politickým stranám). Dnes používáme tmavý petrol `#0f3d35` a zelenou `#1f6f5f`, ale nejsme na ně vázaní.
- **Jedna akční barva pro tlačítka**, dostatečně odlišná od primární, s kontrastem bílého textu min. 4.5:1. Používá se jen pro CTA.
- **Teplé neutrály** na pozadí (ne čistě bílá, ne studená šedá).
- **Paleta pro grafy** (až 8 barev) musí projít testem barvosleposti. Dnes používáme ověřenou sadu `#2a78d6, #eb6834, #1baf7a, #eda100, #e87ba4, #008300, #6250d6, #e34948`; můžete ji nahradit, ale s doložením testu (např. nástrojem Viz Palette nebo Coblis).
- **Barvy stavů** (dnes vs. cíl 2038, riziko) oddělené od barev identity.
- **Vyhnout se**: pirátské žluté `#fec934` jako identitě, červené jako primární, fialové (asociace s jinou stranou), čistě modré (asociace s ODS/ANO). Zelená je v českém kontextu nejméně stranicky zatížená barva pro zdravotnictví.

### Typografie

- **Jedno kvalitní písmo s úplnou češtinou** (háčky, čárky, ů, správný kerning). Kandidáti: Inter, Public Sans, Source Sans 3, IBM Plex Sans, Figtree, Manrope. Nebo dvojice bezpatkové pro text + patkové pro titulky (Source Serif 4, Literata, Fraunces), pokud chcete přidat „důvěru dokumentu“.
- **Ne kondenzovaná písma** pro titulky (současný Barlow Condensed odstraňte).
- Typografická škála: text 18–20px, perex 20–22px, h3 24px, h2 32–36px, h1 44–56px (mobil 32–40px), velká čísla 48–72px. Tabulková čísla s `tabular-nums`.

### Ikony a ilustrace

- Jedna ikonová sada s jednotnou tloušťkou (Lucide, Phosphor nebo vlastní). Ikony jen jako pomocník u karet a akcí, ne dekorace.
- **Ilustrační sada 8–12 motivů** v jednotném stylu (lineární s plochou barvou, 2–3 barvy z palety): tým lékař + sestra, pacient doma se sestrou, senior taxi, obecní zdravotní centrum, nemocnice s novou rolí, elektronická žádanka v mobilu, ultrazvuk v ordinaci, prevence (lékárna, pohyb), peníze (tok), časová osa. Dodat jako SVG.
- Fotografie jen pokud jsou autentické a české (reálná ordinace, reálná sestra na návštěvě). Žádné stock fotky usmívajících se lékařů s tabletem.

---

## 8. Struktura webu a úkol každé stránky

Struktura zůstává (osm veřejných stránek + čtečka). Na každé stránce je **jedno hlavní „Další krok“ tlačítko** na konci a jedno v hero.

| Stránka | Úkol stránky | Hero | Hlavní CTA |
|---|---|---|---|
| **Úvod** `/` | Za 30 s pochopit co, proč, jak. Rozcestník. | Titulek-slib, jedna věta, **jedno primární tlačítko** + jeden sekundární odkaz, ilustrace (ne graf). | „Co se změní pro mě“ → /co-chceme |
| **Proč** `/proc` | Ukázat problém šesti grafy, každý s tvrzením. Kandidát na scrollytelling. | Jedno velké číslo (29,7 % vs 4,3 %) jako hero. | „Co s tím uděláme“ → /co-chceme |
| **Co chceme** `/co-chceme` | Pět změn, každá s vizuálem, co udělat, co to znamená pro člověka. Cesta pacienta jako příběh. „Co reforma nedělá“. | Pět karet/kapitol jako obsah stránky. | „Kdy a jak“ → /jak |
| **Jak a kdy** `/jak` | Časová osa 2027–2038, čtyři kontrolní body, pravidla, varianty, rizika. | Časová osa jako hero (desktop horizontální, mobil vertikální). | „Kolik to stojí“ → /penize |
| **Peníze** `/penize` | Odkud a kam tečou peníze, co to stojí, tři kalkulačky. | Jedno číslo s rozpětím. Tok peněz jako hlavní vizuál. | „Spočítat si to“ (kalkulačka) a dále → /pro-koho |
| **Pro koho** `/pro-koho` | Deset organizací, se kterými plán projednáváme; co nabízíme a co potřebujeme; kulaté stoly. | Deset log/štítků organizací. | „Nejčastější otázky“ → /otazky |
| **Otázky** `/otazky` | FAQ, střet zájmů autora. | Vyhledávání v otázkách nebo seznam témat. | „Přečíst studii“ → /studie |
| **Slovníček** `/slovnicek` | 22 pojmů. Otevírá se také z pojmů v textu (tooltip). | Prostý seznam. | zpět na předchozí stránku |
| **Studie** `/studie` | Plné znění (asi 1 200 bloků), osnova vlevo, čtení na dlouho. Bloky s označením „Ověřit“. Ve 2. fázi pravý panel s komentáři. | Název, verze, datum, autor, tlačítko „Stáhnout PDF“. | „Poslat připomínku“ (2. fáze) |
| **Interní část** `/vstup`, `/rt`, `/d/studie`, `/pripominky`, `/overit`, `/kody` | Přihlášení, přehled, čtečka s komentáři, seznam připomínek, ověřování čísel. | Pracovní nástroj, hustší, ale ve stejném systému. | (2. fáze, stačí styl komponent) |

---

## 9. Komponenty k návrhu

Vše ve variantách desktop / mobil a ve stavech (default, hover, focus, active, disabled), kde dává smysl.

**Navigace a rámec**
1. Hlavička: logo/název, 5 hlavních položek (Proč, Co chceme, Jak a kdy, Peníze, Pro koho), „více“ (Otázky, Slovníček, Studie), tlačítko „Studie“ nebo „Připomínkovat“ vpravo. Mobil: hamburger s celoobrazovkovým menu.
2. Patička: autor a tým, verze a datum, odkazy, střet zájmů, přihlášení pro tým.
3. Drobečková navigace / „Jste v části 3 ze 7“ a **pruh „Další krok“** na konci každé stránky (velké tlačítko + jedna věta, co tam je).

**Hero (3 varianty)**: úvodní (ilustrace + CTA), podstránka (titulek + perex + jedno číslo nebo vizuál), studie (metadata dokumentu).

**Tlačítka a odkazy**: primární, sekundární, textový odkaz se šipkou, odkaz s ikonou (stáhnout, externí), čip/štítek (téma, „Ověřit“, verze).

**Obsahové bloky**
4. **Karta změny** (číslo 1–5, titulek, jedna věta, ilustrace, šipka; celá klikatelná).
5. **Dlaždice s číslem** (velké číslo, věta, zdroj; varianta se srovnáním dnes / 2038).
6. **Sekce text + vizuál** (střídavě vlevo/vpravo; na mobilu vizuál nad textem).
7. **Rámec grafu**: titulek-tvrzení, podtitulek, graf, anotace, zdroj + rok, přepínač „graf / tabulka“, štítek „Ověřit“ pokud číslo ověřujeme.
8. **Časová osa**: fáze F0–F4, čtyři kontrolní body (B1–B4) klikatelné s detailem „co musí platit / co když ne“, milníky. Desktop horizontální, mobil vertikální.
9. **Kalkulačka**: vstup (posuvník + číslo), výstup (velké číslo + věta), poznámka o zjednodušení. Tři kalkulačky: platba státu, moje daně za zdraví, kam jde daň z vína.
10. **„Co reforma nedělá“**: šest tvrzení ve vzoru *obava → skutečnost*, klidný vizuál (ne přeškrtnuté ikony, ne červená).
11. **Cesta pacienta**: kroky dnes vs. po reformě (dvě paralelní linky nebo před/po přepínač).
12. **Karta organizace** (Pro koho): kdo, co nabízíme, co potřebujeme, první krok a termín.
13. **FAQ accordion** s možností sdílet odkaz na jednu otázku.
14. **Slovníček**: seznam + tooltip pro pojem v textu.
15. **Callout**: poctivá poznámka („Říkáme rozpětí, protože…“), riziko, zdroj.
16. **Tabulka** (registr opatření, srovnání variant) s mobilní variantou jako karty.

**Čtečka studie**
17. Rozvržení: osnova vlevo (sbalitelná, zvýrazní aktuální kapitolu), text uprostřed (max. 70 znaků na řádek), vpravo prostor pro komentáře (2. fáze). Bloky: nadpisy, odstavce, seznamy, tabulky, citace, štítek „Ověřit“, kódy opatření (např. `Pil1.3`, `M4.2`) jako nenápadné čipy s odkazem.
18. Komentář (2. fáze): značka počtu komentářů u odstavce, panel s vláknem, formulář (druh, závažnost, text, navrhované znění, organizace), stav vypořádání.

**Ostatní**
19. Sdílecí obrázky (OG image) pro úvod a každou stránku: titulek + jedno číslo + ilustrace.
20. Favicon a jednoduchá značka webu (ne stranické logo).
21. Prázdné a chybové stavy (404, „databáze nedostupná“), načítání.

---

## 10. Grafy a datové vizuály: pravidla

Těchto pravidel se držíme už dnes a chceme je zachovat, jen lépe „oblékněte“:

- Sloupce max. 24px tlusté, zaoblený jen datový konec, mřížka tenká a světlá, nikdy čárkovaná.
- Jedna zvýrazněná série, ostatní šedé. Legenda vždy u 2+ sérií, přímé popisky jen u klíčové hodnoty, ne u každé.
- Žádné duální osy, žádné koláče pro blízké hodnoty, žádný 3D efekt.
- Každý graf má tabulkovou verzi (přístupnost) a zdroj s rokem.
- Barvy grafů nesmí být stejné jako barvy identity nebo CTA, aby nevznikl dojem „naše barva = dobrá hodnota“.
- Velká čísla (hero, dlaždice) v textovém písmu, ne v dekorativním.

Vizuály k přepracování: šest grafů na stránce Proč (podíl výdajů, úbytek praktiků, lůžka, odvratitelné hospitalizace, mezera v péči, sestry), tok peněz (Peníze), náklady a zdroje (Peníze), časová osa (Jak), organigram týmu, triáž podle naléhavosti, waffle graf lůžek, domácí péče (Co chceme), deset organizací (Pro koho).

---

## 11. Přístupnost a technické požadavky

- WCAG 2.2 AA: kontrast, viditelný fokus, ovládání klávesnicí, dotykové cíle 44px, respektování `prefers-reduced-motion`.
- Žádný text v obrázcích. Všechny texty se budou měnit (verze 3.1 studie se chystá).
- Čeština: ověřte diakritiku a dělení slov ve zvoleném písmu; dlouhá česká slova v titulcích na mobilu („připomínkování“, „zdravotnictví“).
- Rozsahy: 360, 390, 768, 1024, 1280, 1440 px. Obsahová šířka max. 1100–1200 px, text 65–75 znaků.
- Tisk a PDF: čtečka studie má mít tiskový styl (lidé si ji budou tisknout).
- Výstup pro implementaci: Figma s Auto-layoutem, komponenty s variantami, pojmenované tokeny (barvy, typografie, mezery, poloměry, stíny) exportovatelné do JSON; ilustrace a ikony v SVG.

---

## 12. Co nechceme (stopka)

- Stranické barvy, logo, fonty nebo tón kampaně.
- Stock fotky nemocnic, usmívajících se lékařů s tabletem, dlaní držících srdce.
- Karikatury politiků, obrázky „zlé nemocnice“, strach.
- Kondenzovaná a dekorativní písma na dlouhé texty.
- Duální osy, koláče, 3D grafy, grafy bez zdroje.
- Carousel/slider v hero, auto-přehrávané video, vyskakovací okna.
- Tmavý režim není třeba; světlý je výchozí a jediný.

---

## 13. Dodávky a postup

| Fáze | Výstup | Termín (návrh) |
|---|---|---|
| 1. Směr | Moodboard a **dva vizuální směry** úvodní stránky (desktop + mobil), paleta, písmo, ukázka ilustračního stylu, ukázka primárního tlačítka a karty. | 1 týden |
| 2. Jádro | Vybraný směr dopracovaný: **Úvod, Co chceme, Peníze** kompletně (desktop + mobil), včetně grafů a kalkulačky. UI kit (tokeny, tlačítka, karty, typografie). | 2 týdny |
| 3. Celek | Zbylé stránky (Proč, Jak a kdy, Pro koho, Otázky, Slovníček), čtečka studie, patička, OG obrázky, favicon, prázdné stavy. Ilustrační sada 8–12 motivů v SVG. | 2 týdny |
| 4. Předání | Figma s komponentami a tokeny, krátký dokument pravidel (10 stran max.), 1 hodina předání vývoji, 1 kolo kontroly implementace. | 1 týden |

Rozhoduje Josef Pavlovic za resortní tým, zpětná vazba do 3 pracovních dnů od každé dodávky. Na začátku 60min schůzka nad tímto zadáním a současným webem.

---

## 14. Otázky, na které čekáme odpověď v nabídce

1. Který ze dvou přístupů doporučujete: čistý „design system“ styl (GOV.UK/NHS, strohý, extrémně čitelný) nebo „explainer“ styl (think-tank, ilustrace, scrollytelling)? Nebo kombinace a kde je hranice?
2. Umíte dodat ilustrace sami, nebo počítat s ilustrátorem?
3. Jak byste řešili časovou osu na 12 let se čtyřmi kontrolními body na mobilu?
4. Doporučili byste pro stránku Proč scrollytelling (jeden graf, který se mění při scrollu), nebo šest samostatných grafů? Co z toho zvládne čtenář na mobilu?
5. Odhad hodin po fázích.

---

## Příloha A: Obsahová inventura (co už existuje)

Všechny texty jsou v souboru `web/src/content/reforma.ts` a na webu. Shrnutí:

- **4 klíčová čísla**: 21,5 mld. Kč ročně navíc (rozpětí 15–25), 520 týmů, 8 000 lůžek změní účel, 5 mld. Kč z daní za zdraví.
- **5 změn**: svůj lékař a sestra blízko domova; ke specialistovi podle naléhavosti; nemocnice se mění, neruší; prevence se stálými penězi; stáří a konec života doma.
- **6 grafů problému**: podíl výdajů (29,7 % lůžka vs 4,3 % praktici), úbytek praktiků, lůžka vs. Evropa, odvratitelné hospitalizace, mezera v péči o dlouhodobě nemocné, sestry.
- **Časová osa**: fáze F0–F4 (2026–2038), kontrolní body B1 Mandát (6/2028), B2 Program (2029), B3 Peníze (2031), B4 Zákon (2032), 13 milníků.
- **Peníze**: tok peněz (zdroje → použití), 8 skupin nákladů v roce 2038, čisté náklady, 4 zdroje financování, 10 čísel, 3 kalkulačky.
- **Pro koho**: 10 organizací k projednání, 12 skupin s „co nabízíme / co potřebujeme / první krok“, 9 kulatých stolů 2027–2028.
- **Co reforma nedělá**: 6 tvrzení. **Otázky**: 14 FAQ + střet zájmů. **Slovníček**: 22 pojmů. **Inspirace**: Portugalsko, Estonsko, Dánsko, Německo, Británie, Polsko, Skotsko.
- **Studie**: asi 1 200 bloků, 11 částí, 3 přílohy, 89 opatření, asi 100 míst označených „Ověřit“.

## Příloha B: Odkazy z rešerše

- GOV.UK Design System: https://design-system.service.gov.uk (komponenta Button, Start button; typografie)
- NHS Design System: https://service-manual.nhs.uk/design-system
- healthcare.gov: https://www.healthcare.gov
- Bundesministerium für Gesundheit, Krankenhausreform: https://www.bundesgesundheitsministerium.de/themen/krankenhaus/krankenhausreform
- Finská reforma: https://soteuudistus.fi · Irská reforma Sláintecare: https://www.gov.ie (hledat „Sláintecare“) · NZ: https://www.futureofhealth.govt.nz
- Nuffield Trust: https://www.nuffieldtrust.org.uk · The Health Foundation: https://www.health.org.uk · The King's Fund: https://www.kingsfund.org.uk · Commonwealth Fund: https://www.commonwealthfund.org
- Our World in Data: https://ourworldindata.org · The Pudding: https://pudding.cool · Reuters Graphics: https://www.reuters.com/graphics · Information is Beautiful Awards: https://www.informationisbeautifulawards.com
- Test palety pro barvoslepost: https://projects.susielu.com/viz-palette · https://www.color-blindness.com/coblis-color-blindness-simulator
- Pirátský styleguide (jen principy): https://styleguide.pirati.cz
