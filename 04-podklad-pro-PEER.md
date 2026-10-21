# Zdraví blíž lidem v3 — podklad pro PEER

20. 10. 2026 · Josef Pavlovic

## Proč tento podklad

Do schůze resortního týmu 7. 12. 2026, která schvaluje verzi 3 ke konzultaci, potřebujeme od PEER šest rozhodnutí. Cílem je, aby zdravotní reforma a hospodářská strategie šly do programu se stejnými čísly a nic se v nich nesčítalo dvakrát.

- **Náklad.** Reforma bude v plném náběhu kolem roku 2038 stát čistě asi 21,5 mld. Kč ročně (rozpětí 15 až 25 mld. Kč, ceny 2026), tedy necelá 4 % dnešních výdajů zdravotního pojištění. V 90 % simulací vychází 19,2–23,0 mld. Kč.
- **Daně za zdraví.** Slibujeme 5 mld. Kč ročně (5–7). Čísla PEER (10–15) a PAQ Research (12–17) vedeme jako horní scénář mimo rozpočet reformy.
- **„+80 mld.“** je v dokumentech PEER čistý výnos daňové reformy, tedy příjem, ne potřeba zdravotnictví. Daně za zdraví jsou jeho součástí a v konsolidaci se nesmí počítat podruhé.
- **Lůžka.** Navrhujeme jedinou metriku: podíl akutní lůžkové péče na úhradách pojištění 29,7 % → 26 % kolem roku 2038.
- **Platba státu.** 100 Kč měsíčně na státního pojištěnce stojí 7,2 mld. Kč ročně. Reformu zaplatí daně za zdraví (5 mld. Kč), státní rozpočet (asi 15,6 mld. Kč, z toho asi 13 mld. Kč vyšší platbou za státní pojištěnce, tedy asi 180 Kč měsíčně) a obce (asi 1 mld. Kč); mezeru 70 mld. Kč v roce 2038 musí řešit pravidla příjmů, ne reforma.

Částky jsou v mld. Kč ročně, v cenách a velikosti ekonomiky roku 2026, ze skriptu model\_v3.py (stav 20. 10. 2026). Autor je členem PEER i Správní rady VZP, přičemž studie navrhuje pilot s VZP; podklad proto otevřeně opravuje i čísla PEER a model předkládá k oponentuře.

## Daně za zdraví: v programu 5 mld. Kč

Navrhujeme, aby program sliboval 5 mld. Kč ročně v plném náběhu od roku 2033 (rozpětí 5–7) a vyšší čísla vedl jako horní scénář mimo rozpočet reformy. Oponent jinak použije vyšší číslo jako slib a nižší jako přiznání.

| Zdroj | Mld. Kč ročně | Co předpokládá | Návrh |
| --- | --- | --- | --- |
| Studie v3 | 5 (5–7) | tiché víno 23,40 Kč/l (malí vinaři polovinu), britská pásmová daň ze slazených nápojů, líh a pivo jen valorizace | jediné veřejně slibované číslo |
| Hospodářská strategie PEER | 10–15 | víno podle alkoholu, cukerná daň nad britskou úrovní, malá reakce spotřeby, žádná eroze základu | horní scénář |
| Strukturální reforma v6 | až asi 15 | valorizace, tiché víno, případně slazené nápoje; součást balíku +80 mld. Kč | sjednotit s návrhem níže |
| PAQ Research | 12–17 | pivo a víno zdaněné podle obsahu alkoholu | horní scénář; výhled po roce 2033 |

Skladba našeho čísla po reakci poptávky: tiché víno 3,3–4,3, slazené nápoje asi 1,5 (1,3–1,8), valorizace lihu a piva 0–1 mld. Kč. Statický výnos 6,8–8,6 mld. Kč tak klesne na 4,6–7,1 mld. Kč.

**Proč se čísla liší.** Rozdíl dělají tři předpoklady, ne aritmetika.

1. **Sazby nad valorizaci.** PEER i PAQ zdaňují víno, případně i pivo, podle obsahu alkoholu, tedy výrazně nad dnešní sazby. Studie u lihu a piva navrhuje jen automatickou valorizaci a víno zdaňuje stejnou sazbou jako šumivé.
2. **Reakce spotřeby.** Elasticita poptávky po víně je −0,69, u slazených nápojů −1,59 (Andreyeva 2022, PMID 35648398). Britská daň vybrala 327 místo plánovaných 500 mil. £, protože výrobci cukr odstranili. Vysoký výnos při malé reakci spotřeby by znamenal, že daň neplní zdravotní cíl.
3. **Přeshraniční nákupy a eroze základu.** Sazba lihu vzrostla v letech 2024–2026 o více než pětinu, inkaso je přesto pod úrovní roku 2023 (8,97 mld. Kč). Ověřit: sazby tichého vína v Německu, Rakousku, Polsku a na Slovensku.

**Pravidlo rozdělení.** Studie váže zákonem pevné 2 mld. Kč (valorizované) do Národního fondu prevence a zbytek 3–5 mld. Kč přidává do platby státu; odvody z práce nesnižuje. Strukturální reforma v6 dává až 15 mld. Kč ze 100 % do prevence jako politické rozpočtové pravidlo a Akční plán HS žádá „min. 40 %“ do Fondu prevence.

Návrh sjednocení pro v6 i Akční plán HS:

- 2 mld. Kč pevně do fondu prevence; při 5 mld. Kč je to právě 40 %, takže požadavek PEER platí u plánovací hodnoty. Kryje prevenci v modelu (1,3) a komunitní programy (0,7).
- Zbytek (3 mld. Kč, v horní hranici 5) zvyšuje platbu státu do pojištění.
- Výnos nad 5 mld. Kč jde do fondu jen do 40 % celkového výnosu; při 7 mld. Kč je to +0,8 mld. Kč.
- „100 % do prevence“ vypustit: 15 mld. Kč by téměř zdvojnásobilo dnešních 18–19 mld. Kč na prevenci a program pro ně nemá ověřené programy ani kapacitu.

Z pohledu fiskálního účtu PEER je celý výnos daní za zdraví utracen ve zdravotnictví a jeho konsolidační přínos je nulový. To se shoduje s v6, která tuto část také vede jako rozpočtově neutrální.

## Co je uvnitř čeho: „+80 mld.“, reforma a mezera NRR

„+80 mld. Kč“ je v dokumentech PEER čistý fiskální přínos daňové reformy (Strukturální reforma v6, Reforma 1), tedy příjem státu, ne výdaj ani potřeba zdravotnictví. Skládá se z překrývajících se položek: snížení daně zaměstnancům −45, OSVČ asi +22,5, DPH a úniky +40 až +45, nemovitosti +16 až +30, kapitál +20 až +30 a spotřební daně až +15 mld. Kč.

V dokumentu „PEER – Co si o tom myslíme“ číslo 80 mld. Kč není; Akční plán HS ho také neuvádí. „80 miliard“ v dokumentu „Reforma zdravotnictví: Teze a důkazy“ je jiná veličina: odhad AIFP (přes Kurzy.cz) sociálních dávek spojených s chronickými nemocemi.

| Číslo | Co to je | Strana účtu | Uvnitř čeho | Jak s ním počítat |
| --- | --- | --- | --- | --- |
| +80 mld. Kč (v6) | čistý výnos daňové reformy, statický | příjmy | — | nesčítat s dílčími položkami balíku |
| Daně za zdraví 5 mld. Kč (v6: až 15) | víno, slazené nápoje, valorizace | příjmy | uvnitř +80 | nepřičítat k 80; Ověřit: kolik spotřebních daní obsahuje 80 v Prokopově modelu |
| 2 mld. Kč fond prevence + 3 mld. Kč platba státu | utracený výnos daní za zdraví | výdaje | kryje část 21,5 | konsolidační přínos 0 |
| Čistý náklad reformy 21,5 mld. Kč (2038) | nová opatření nad projekcí NRR | výdaje | mimo projekci NRR | po odečtení daní zatěžuje státní rozpočet asi 15,6 mld. Kč a obce asi 1 mld. Kč |
| Mezera NRR 60 / 70 / 104 mld. Kč (2035 / 2038 / 2050) | výdaje minus příjmy pojištění při dnešních pravidlech | saldo | v základní projekci NRR | nepřičítat jako nový výdaj; fiskální kotva ji musí unést; s reformou dává potřebu 91,6 mld. Kč (2038) |
| Sociální účet +57 mld. Kč (80 → 137, do 2035) | náklad sociální péče o seniory (studie pro APSS ČR) | výdaje mimo v. z. p. | mimo 21,5 i mimo mezeru NRR | samostatný řádek strategie; Ověřit překryv s projekcí NRR |
| Růst výdajů na zdravotnictví o 2 % HDP do 2040 (v6) | růst výdajů celkem, ne mezera | výdaje | překrývá se s projekcí NRR | nesčítat s mezerou NRR |
| 80 mld. Kč (AIFP, „Teze a důkazy“) | sociální dávky spojené s chronickými nemocemi | — | jiná veličina | necitovat |

Pro fiskální účet PEER z toho plynou tři řádky na rok 2038: příjem +80 mld. Kč (včetně 5 mld. Kč daní za zdraví), výdaj reformy −21,5 mld. Kč a mezera NRR, kterou základní projekce už obsahuje. Pokud model PEER počítá v osmdesátce se spotřebními daněmi 15 mld. Kč, klesne balík při našem čísle asi na 70 mld. Kč. Ověřit: zda NRR v tab. D.1 vede mezeru pojištění jako součást salda vládních institucí v základním scénáři.

## Jedna metrika pro nemocnice: 29,7 % → 26 %

Navrhujeme, aby program měřil přesun z nemocnic jediným ukazatelem: podílem vlastní akutní lůžkové péče na úhradách pojišťoven, 29,7 % (2024) → 28 % (2033) → 26 % kolem roku 2038. Akční plán HS a studie dnes uvádějí dva různé cíle ve dvou různých základech.

| Číslo | Co měří | Zdroj | Použití |
| --- | --- | --- | --- |
| 46,5 % → 36,4 % | nemocniční (lůžková) péče na celkových výdajích na zdravotnictví; 36,4 % je průměr EU27 | Akční plán HS; NERV 2024 podle Eurostatu (Ověřit: stránka a klasifikace) | jen mezinárodní srovnání |
| 56,3 % | lůžková zařízení celkem na úhradách v. z. p.: akutní péče 29,7, ambulance nemocnic 12,8, centrová léčiva 6,8, následná a dlouhodobá péče 6,4 | ÚZIS OIS-11-24 | doplňkový |
| asi 40 % | poskytovatel nemocnice (HP.1) na celkových výdajích, OECD asi 36 % | ČSÚ, zdravotnické účty 2024 | mezinárodní srovnání |
| **29,7 % → 26 %** | **vlastní akutní lůžková péče (podsegment 2.1.2) na úhradách v. z. p.** | **ÚZIS OIS-11-24** | **hlavní ukazatel programu (H6)** |

Celý lůžkový segment je pro cíl nevhodný ze tří důvodů. Centrová léčiva rostou z jiných příčin a následná péče má podle reformy růst. Podíl nemocnic se navíc dá splnit přeúčtováním, například vyčleněním nemocničních ambulancí do samostatných subjektů.

Cíl 46,5 → 36,4 % (−10 bodů) a cíl 29,7 → 26 % (−3,7 bodu) měří jiný základ a nelze je převést jeden na druhý; pokles o 10 bodů navíc vychází z čísla, které jsme v žádné standardní klasifikaci neukotvili. Při dnešních úhradách 571 mld. Kč znamená −3,7 bodu asi 21 mld. Kč ročně přesunutých z akutních lůžek jinam (odvozený přepočet). Formulace Akčního plánu „zkrácení doby pobytu na evropský průměr“ navíc stojí na srovnání délky hospitalizace, které není mezi zeměmi harmonizované.

Ukazatel se čte spolu s dvěma věcnými veličinami, které nejde přeúčtovat: přeměna 8 000 akutních lůžek do roku 2038 (z 48 036 na asi 40 000, ze 4,4 na 3,7 na 1 000 obyvatel) a odvratitelné hospitalizace (ACSC) 592 → 530 na 100 000. Návrh textu pro Akční plán HS: „Snížíme podíl akutní lůžkové péče na úhradách zdravotního pojištění z 29,7 % na 26 % kolem roku 2038 a uvolněné prostředky přesuneme do primární, domácí a následné péče.“

## Platba státu v jedné tabulce

Každých 100 Kč měsíčně na státního pojištěnce stojí 7,2 mld. Kč ročně. Reformu v roce 2038 zaplatí daně za zdraví 5 mld. Kč, státní rozpočet asi 15,6 mld. Kč (z toho asi 13 mld. Kč vyšší platbou za státní pojištěnce, tedy asi 180 Kč měsíčně, a 2,6 mld. Kč přímými výdaji) a obce a kraje asi 1 mld. Kč.

| Prvek | Hodnota | Výpočet a poznámka |
| --- | --- | --- |
| Vzorec dnes (§ 3c zák. 592/1992 Sb.) | 2 188 Kč měsíčně (2026) | vyměřovací základ 16 207 Kč × 13,5 %; asi 6,0 mil. státních pojištěnců |
| Převodní pravidlo | 100 Kč měsíčně = 7,2 mld. Kč ročně | 6,0 mil. × 100 Kč × 12 |
| 2027, tisk 235 | pevný základ 18 362 Kč, platba 2 479 Kč (asi +21 mld. Kč) | 3. čtení zatím neproběhlo; PN č. 1796 navrhuje základ 17 540 Kč |
| 2028 | MZ avizuje zmrazení | požadujeme pravidlo místo zmrazení |
| 2029 | návrat vzorce § 3c | výchozí stav pro novou vládu |
| 1. 1. 2031 | náš nový vzorec podle nákladů na státní pojištěnce (J10) | předložit v 1. pololetí 2030 s daněmi za zdraví (vlna 1) |
| Sazba +1 bod (13,5 → 14,5 %) | práce a OSVČ 25–29 (střed 27) mld. Kč + automaticky 11,7 mld. Kč ze státu | +162 Kč měsíčně v platbě státu při základu 2026; při základu 2027 13,2 mld. Kč |
| Daně za zdraví do pojištění | 3 mld. Kč ≈ 42 Kč měsíčně | 5 mld. Kč minus 2 mld. Kč fondu prevence |
| Reforma 2038: vyšší platba za státní pojištěnce | asi 13,0 mld. Kč ≈ 180 Kč měsíčně | 2035 asi 8,5 mld. Kč (120 Kč), 2050 asi 17,8 mld. Kč (250 Kč) |

Celá potřeba roku 2038 (mezera NRR i reforma) ve dvou variantách sazby, v mld. Kč:

| Zdroj 2038 | V1 bez vyšší sazby | V2 sazba 13,5 → 14,5 % v daňové reformě |
| --- | --- | --- |
| Potřeba celkem (mezera 70,0 + reforma 21,5) | 91,6 | 91,6 |
| Daně za zdraví → Národní fond prevence | 2,0 | 2,0 |
| Daně za zdraví → pojištění přes platbu státu | 3,0 | 3,0 |
| Obce a kraje přímo (senior taxi, provoz center) | 1,0 | 1,0 |
| Státní rozpočet přímo (koordinace, fond přeměny, dálkové sledování, rezerva fondu prevence) | 2,6 | 2,6 |
| Sazba pojištění: práce a OSVČ | 0 | 27,0 |
| Sazba pojištění: automatický růst platby státu (§ 3c) | 0 | 11,7 |
| Platba státu: nový vzorec (diskrečně) | 83,0 | 44,3 |
| **Platba státu nad projekci NRR celkem (bez daní)** | **83,0 ≈ 1 150 Kč měsíčně** | **56,0 ≈ 780 Kč měsíčně (z toho 162 Kč automaticky)** |
| Kdo nese: stát / práce / spotřeba / obce | 93 / 0 / 6 / 1 % | 64 / 29 / 6 / 1 % |

Pro srovnání: v roce 2035 (potřeba 76,5) je platba státu ve V1 68,2 mld. Kč (asi 950 Kč), ve V2 41,2 mld. Kč (asi 570 Kč); v roce 2050 (potřeba 129,3) 122,1, resp. 95,1 mld. Kč. Při výnosu daní 7 mld. Kč klesne potřebná platba státu o 2 mld. Kč.

Automatický růst 11,7 mld. Kč není nový zdroj, ale výdaj státního rozpočtu, který vyšší sazba vyvolá. Varianta se sazbou 14,5 % zatěžuje práci o 27 mld. Kč a jde proti cíli PEER snížit zdanění práce; to je otázka pro PEER, ne pro resortní tým. Ani jedna varianta nevytváří peníze navíc: vyšší platba státu je přesun ze státního rozpočtu, který projekce NRR už zachycuje.

## Citlivost a nejistota

Centrální odhad 21,5 mld. Kč je robustní vůči jednotlivým vstupům: žádný z deseti nejdůležitějších ho sám neposune mimo 19,4–23,1 mld. Kč. Rozpětí 15–25 mld. Kč kryje hlavně strukturní scénáře, ve kterých se více vstupů pohne najednou.

*[Graf/diagram: model_v3.py: tornádo čistého nákladu 2038 (varianta A) a Monte Carlo 20 000 běhů, seed 2026; stav 20. 10. 2026 — interaktivní verze je v dokumentu Claude Docs]*

Monte Carlo (20 000 běhů, trojúhelníková rozdělení 12 vstupů) dává medián 21,0 mld. Kč a 90 % běhů v intervalu 19,2–23,0 mld. Kč; nad 25 mld. Kč je méně než 0,1 % běhů. Interval je úzký, protože vstupy jsou v simulaci nezávislé; korelace vstupů (například mzdy a počet sester) je první otázka pro oponenturu.

Strukturní scénáře (čistý náklad 2038): polovina sester, mzdová úroveň a dolní mez plateb týmům 17,3; bez překryvu s plánem MZ (10 mld. Kč z pojištění na podporu praxí do 2030) asi 19,5; jen polovina sester 19,4; platby týmům, fond přeměny a rezerva na horní mezi 25,7; tři sestry na lékaře už v roce 2038 25,9 mld. Kč.

Varianta bez center stojí čistě asi 18 mld. Kč a minimální varianta asi 11 mld. Kč. Prevence, paliativa, konzultace a fond přeměny jsou ve všech třech. Souběh všech dolních mezí (13,3) nebo všech horních (30,6) je krajní a málo pravděpodobný.

## Co od PEER potřebujeme

Potřebujeme šest rozhodnutí; první tři do schůze resortního týmu 7. 12. 2026, aby verze 3 šla ke konzultaci se sladěnými čísly.

| # | Rozhodnutí nebo úkol | Co přesně | Termín |
| --- | --- | --- | --- |
| 1 | Potvrdit číslo daní za zdraví | 5 mld. Kč (5–7) jako slib, 10–15 mld. Kč jako horní scénář mimo rozpočet reformy; pravidlo 2 mld. Kč do fondu prevence a zbytek do platby státu převzít do v6 i Akčního plánu HS | Dec 7, 2026; formálně do brány B1 (6/2028) |
| 2 | Převzít čísla do hospodářské strategie | tabulka „co je uvnitř čeho“; výdaj reformy 21,5 mld. Kč (2038); sdělit, kolik spotřebních daní obsahuje +80 mld. Kč v Prokopově modelu | Dec 7, 2026 |
| 3 | Jedna metrika pro nemocnice | v Akčním plánu HS nahradit 46,5 → 36,4 % cílem 29,7 → 26 % kolem roku 2038; 46,5 % ponechat jen jako srovnání s EU s přesnou definicí | Dec 7, 2026 |
| 4 | Sazba pojištění | rozhodnout mezi V1 (sazba 13,5 % zůstává, stát nese 93 %) a V2 (+1 bod v daňové reformě, práce nese 29 %) ve vazbě na cíl snížit zdanění práce | Mar 31, 2027 (konec 1. kola připomínek k v3) |
| 5 | Oponentura modelu model\_v3.py | jeden až dva ekonomové PEER: rozdělení vstupů Monte Carlo, interpolace NRR, hierarchické úspory, přepočet na nominál | jména do Nov 9, 2026; posudek do Mar 31, 2027 |
| 6 | Společná pozice k NRR a MF | dopis NRR o příjmech v. z. p. po letech (tab. D.1) a o základní projekci; pozice k tisku 235 a ke zmrazení platby státu pro rok 2028; kulatý stůl „Financování: platba státu a daně za zdraví“ (MF, NRR, pojišťovny, PEER) | dopis do Dec 31, 2026; kulatý stůl 11/2027 |

Podklady k ověření: skript model\_v3.py s výstupy, závazná čísla v3 a oponentní posudek verze 2. Na schůzi 9. 11. 2026 resortní tým rozděluje věcné záměry; finanční novela a daňové zákony (vlna 1) potřebují garanta z PEER.
