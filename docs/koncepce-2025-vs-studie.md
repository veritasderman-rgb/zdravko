# Koncepce MZ 2025 a studie „Zdraví blíž lidem“ v3: srovnání čísel a směru

> **Interní pracovní podklad.** Koncepci MZ 2025 používáme výhradně k ověření dat. Na veřejném webu ani ve studii ji neuvádíme jako politickou oporu („jde stejným směrem“ apod.); je to dokument ministerstva a nemá být politicky ohýbán. Čísla z ní převzatá dokládáme primárními zdroji, kde existují, jinak neutrální citací datového zdroje.


Pracovní podklad pro resortní tým · 23. 10. 2026

**Co se srovnává.**

- Koncepce: „Strategické analýzy potřeb resortu zdravotnictví. Koncepce podložená dostupnými daty. Aktualizovaná verze Koncepce s vyhodnocením dosažených cílů k 1. 8. 2025, verze 2.0“, Ministerstvo zdravotnictví ČR, editoři V. Válek a L. Dušek, https://nzip.cz/koncepce2025. Dále jen „Koncepce“.
- Studie: „Zdraví blíž lidem“, verze 3 (konzultační), 20. 10. 2026, soubor `01-studie-zdravi-bliz-lidem-v3.md`. Dále jen „studie“.
- Web: `web/src/content/reforma.ts`, stav k 23. 10. 2026. Odkazuji na klíče (KEY_NUMBERS, NURSES…), ne na řádky, protože soubor se právě upravuje.
- Manifest reformy (7. 5. 2026) jen pro kontext směru.

**Jak číst.**

- „s. X“ je tištěné číslo strany Koncepce. Každé číslo z Koncepce je ověřené v plném textu.
- „ř. X“ je řádek ve studii v3.
- Verdikty: **potvrzuje** (stejná hodnota nebo stejné tvrzení), **upřesňuje** (Koncepce dává přesnější, novější nebo jinak vymezené číslo), **rozpor** (hodnoty se liší a rozdíl definicemi vysvětlit nejde), **Koncepce nemá** (číslo ani tvrzení v textu Koncepce není).
- „Náš dopočet“ označuje aritmetiku z čísel Koncepce. V Koncepci samotné tento výsledek není.

**Důležité upozornění k povaze Koncepce.** Koncepce je resortní dokument Ministerstva zdravotnictví. Na titulní straně ani v textu není usnesení vlády, kterým by ji vláda schválila (s. 1). Vláda v ní vystupuje jen u dílčích kroků, například u Národního screeningového centra (květen 2025) nebo programu pro nelékařské profese (s. 113). Koncepce vznikla před sněmovními volbami 2025 pod vedením ministra Válka. Studie v Části VI hodnotí předlohy dnešní vlády. Doporučuji proto **nepsat „vládní Koncepce“**, ale „Koncepce Ministerstva zdravotnictví 2025“. Zda dnešní vedení MZ Koncepci dál používá jako východisko, ze vstupů nevyplývá. To je nové „Ověřit“ pro studii.

---

## A. Shrnutí na jednu stranu

**Hlavní zjištění.** Studie Koncepci ani jednou necituje. Přitom Koncepce jde ve většině jádra stejným směrem: méně akutních lůžek a víc následné péče, týmové praxe jako první krok k centrům primární péče, širší kompetence praktiků a sester, jednotné sazby DRG, eŽádanka, sloučení hygienické služby. Studie tak ztrácí nejsilnější argument, který má: že navazuje na směr resortu, a ne na stranický program. Na několika místech ale Koncepce čísla studie opravuje nebo zpochybňuje, hlavně u sester a u potřeby lůžek dlouhodobé péče.

**Co Koncepce potvrzuje.**

- Akutní lůžková péče má přebytek kapacity a následná péče nedostatek. Produkce akutní lůžkové péče klesá asi o 1,5 % ročně, síť ani lůžkový fond na to nereagovaly a v řadě regionů kriticky chybí lůžka následné péče (s. 61). Řada nemocnic má oddělení s obložností pod 50 % (s. 75).
- Primární péče je slabá a roztříštěná: dominují sólo praxe s jedním lékařem a sestrou (s. 75), řada občanů nemá praktika, a proto nejde zavést gatekeeping jako v Dánsku, Rakousku nebo Německu (s. 95). To je přesně argument studie pro měkký gatekeeping (J5).
- Týmové praxe od roku 2025 jsou podle MZ jen první krok; další mají být multidisciplinární praxe, tedy centra primární péče s přesahem do veřejného a duševního zdraví (s. 77, s. 82). To je J1 a varianta A studie.
- Preskripční omezení brání primární péči a MZ chce nastavit pravidla jejich uvolnění (s. 78, s. 86, s. 90). To je J3.
- Screening: pokrytí kolorektálním screeningem asi 30 % a účast na kolonoskopii po pozitivním TOKS 60 až 70 % (s. 36); mamografie asi 60 % (s. 36). Studie má 31,1 %, 61,7 % a 60 %.
- eRecept: téměř 86 milionů vystavených eReceptů v roce 2024 (s. 91). Studie číslo má, ale bez zdroje (ř. 769).
- Počet lékařů na obyvatele je nad průměrem EU (s. 95). Studie: 4,2 proti 4,0 v OECD (ř. 273).
- Silné pobídky za měřený výkon jsou riskantní (s. 14). Studie proto dává odměně týmu strop 10 % (ř. 557).
- Podpora jednodenní a domácí péče sama nepřinese úspory na lůžkách, pokud systémy fungují vedle sebe nekoordinovaně (s. 77). Studie počítá s malými úsporami (1,2 mld. Kč v roce 2038, ř. 1346).

**Co Koncepce upřesňuje.**

- Lůžka následné a dlouhodobé péče: podle MZ už dnes chybí nejméně 2 až 3 tisíce a do roku 2035 bude potřeba dalších nejméně 8 tisíc (s. 65). Spodní hranice predikcí je asi 4 700 lůžek do let 2030 až 2035 (s. 66). Jde o zdravotní lůžka. Číslo studie 39 000 zahrnuje i pobytové sociální služby. Přeměna 8 000 akutních lůžek tedy řádově odpovídá zdravotní části potřeby podle MZ, ne „pětině potřeby“, jak píše ř. 1497.
- Sestry: 83 tisíc ve zdravotnictví, asi 3 tisíce chybí, přes 12 tisíc všeobecných sester je starších 60 let a 1 774 starších 70 let (s. 111). Potřeba nových všeobecných sester je nejméně 24 000 úvazků za 10 až 12 let (s. 114). Studie má „přes 30 000 úvazků“ bez primárního zdroje (ř. 287).
- DRG: podíl akutní lůžkové péče hrazené jednotnou základní sazbou vzrostl z 3,4 % v roce 2022 na víc než 25 % v roce 2025, cílem je aspoň 30 % (s. 74, s. 76). Studie sleduje jinou veličinu: rozpětí krajských sazeb 1 : 1,7 → 1 : 1,3 (ř. 942).
- Rezidenční místa: ve všeobecném praktickém lékařství 150, 140 a 140 v letech 2023 až 2025, v pediatrii 80, 70 a 70 (s. 97). Studie uvádí „asi 80 míst pro PLDD ročně“ (ř. 718), což platilo jen pro rok 2023.
- Kompetence sester: některé kroky už platí (vyhl. 158/2022 Sb., vyhl. 324/2024 Sb., předepisování zdravotnických prostředků podle zák. 375/2022 Sb.; s. 118, s. 120). Od 1. 1. 2026 smí sestra se specializací v domácí péči upravit nebo doplnit indikaci lékaře, pokud to lékař umožní (s. 121). Studie píše, že kompetence samostatnou práci „prakticky neumožňují“ (ř. 283).

**Kde je rozpor.**

- Absolventky ošetřovatelství: studie „VŠ dodávají asi 1 300 absolventek ročně“ (ř. 269, 590, 1483, 2362; web NURSES). Koncepce: 16 vysokých škol s produkcí 680 absolventů a 35 VOŠ s produkcí 570 (s. 112). Číslo 1 300 odpovídá spíš součtu VŠ a VOŠ (1 250, náš dopočet). Na tom stojí tvrzení „440 sester ročně je třetina VŠ absolventek“ (ř. 117, 131, 1481). Vůči samotným VŠ je to 65 %.
- Vládní program pro nelékařské profese: studie „zhruba 15 400 VŠ absolventek“ (ř. 269); Koncepce dává 11 078 všeobecných sester, 2 539 porodních asistentek a 1 547 dětských sester, tedy 15 164 (s. 114, náš součet). Studie dál píše o navýšení kapacit „o 20 %“ (ř. 2362); Koncepce: nejméně 20 %, u všeobecného ošetřovatelství až 40 % (s. 113).
- Fondy prevence pojišťoven: Koncepce je posiluje a chce z nich individuální bonusy pojištěncům (s. 76, s. 78). Studie je chce přeměnit na fondy rozšířené péče (M2.3, ř. 2194). Jde o věcný rozpor ve směru, ne v číslech.

**Co ve studii chybí a Koncepce to má.**

- Instituce, které už existují a na které jádro studie přímo navazuje: NIKEZ (od 19. 1. 2023, s. 53; programové cíle včetně HSPA a predikce personálních kapacit, s. 58), Národní screeningové centrum (schváleno vládou v květnu 2025, s. 35), Rada vlády pro veřejné zdraví (usnesení č. 602/2024, s. 25), plán Národního institutu veřejného zdraví (s. 26).
- Precedent přeměny lůžek z evropských peněz: dotaci IROP dostane jen poskytovatel, který zruší 20 akutních lůžek a zřídí 20 následných (s. 148). Je to přesně logika J6 a J7.
- Typologie sítě nemocnic v pěti typech (s. 69–70), na kterou může navázat tři role nemocnic v J6.
- Projekt KRAPL: krajské plánování zdravotně-sociálních služeb v Jihomoravském a Královéhradeckém kraji (s. 149). Je to předstupeň krajského plánu v J6 a P3.
- Plánovací modely personálu (JA HEROES, cíl Národního centra pro plánování a forecasting, s. 113). Je to opora pro P1.
- Pojišťovny mají podle MZ hledat pacientům lékaře a sledovat čekací doby (s. 76) a zveřejňovat zprávu o síti poskytovatelů (s. 81). Je to opora pro J5.
- Čísla, která studie nemá: −1,5 % produkce akutní lůžkové péče ročně (s. 61), 68 % seniorů s vážnou chronickou nemocí (s. 20), přes 1 milion diabetiků (s. 22), výpadky léků podle hlášení SÚKL (s. 84), IROP 12,3 mld. Kč (s. 150). Úplný výběr je v příloze F.

**Co Koncepce neobsahuje.** Studie z ní proto tato čísla citovat nemůže.

- Žádná čísla o praktických lékařích: počty, věk, úvazky, počet lidí bez praktika ani počet týmových praxí. Jen kvalitativně „řada občanů ČR nemá svého praktického lékaře“ (s. 95).
- Podíly výdajů podle segmentů péče a výdaje na zdravotnictví v % HDP za ČR. Jen obecná teze o 7 až 10 % HDP ve vyspělých státech (s. 12).
- Absolutní počty lůžek, lůžka na 1 000 obyvatel, průměrnou obložnost, počet nemocnic a urgentních příjmů.
- Výši platby za státního pojištěnce a celkové příjmy a výdaje veřejného zdravotního pojištění.
- Spotřební daně z alkoholu, tabáku nebo cukru. Tabák a alkohol jsou jen v seznamu rizikových faktorů (s. 24).
- Čekací doby v číslech, počet kontaktů s lékařem, odvratitelné hospitalizace v číslech.
- Kapacity domácí péče, duševního zdraví a sociálních služeb; adopci EZKarty, eŽádanky a telemedicíny.
- Harmonogram ani návrh pro sestry v pokročilé praxi (APN). Jen záměr „odborných platforem“ (s. 127).

**Vedlejší nálezy uvnitř studie** (zjištěno při srovnání, s Koncepcí nesouvisí):

- 39 000 lůžek se připisuje třem různým zdrojům a třem různým veličinám: Přecechtěl a Hlávka 2025 (ř. 295), studie pro APSS ČR (ř. 904, 1497, 2840) a „pobytová lůžka“ (ř. 1124). Deloitte přitom podle ř. 297 počítá 35 tisíc pobytových míst.
- Spotřeba alkoholu 11,2 l, OECD 8,5 l (ř. 321, 325) proti 10,6 l, OECD 8,4 l (D8, ř. 2022; web PREVENTION_FACTS).
- Atestace ve všeobecném praktickém lékařství: 150 až 200 (ř. 245), 160 až 200 (ř. 1491), 161 až 199 (ř. 2362).
- Lékaři 55+: 41 % proti EU 35 % (ř. 275), ale 40 % proti EU 33 % (ř. 2362).

---

## B. Tabulka ověření čísel

### B1. Výdaje, podíly a financování

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Podíl akutní lůžkové péče na úhradách (ř. 215, 225; H6 ř. 2003; web SPENDING_SHARE) | 29,7 % (2024) | Nemá podíly segmentů. Jen kvalitativně: akutní lůžková péče „trvale odčerpává značné personální kapacity“ (s. 61) | Koncepce nemá | Ponechat zdroj ÚZIS. Nepsat, že číslo potvrzuje MZ. |
| Celý lůžkový segment, ambulantní specialisté, praktici (ř. 225, 490; web SPENDING_SHARE) | 56,3 %; 116 mld. Kč; 4,3 % a 6,4 % | Nemá | Koncepce nemá | Beze změny. |
| Výdaje na zdravotnictví v % HDP (ř. 217) | 8,6 % (ČSÚ 2024) | Jen obecná teze: vyspělé státy dávají 7 až 10 % HDP (s. 12), bez údaje za ČR | Koncepce nemá | Koncepci zde necitovat. |
| Státní pojištěnci (ř. 1442; web TAXES.statePayees, GLOSSARY) | 6,0 mil. | „Téměř 60 % obyvatel“ (s. 17); ekonomicky aktivní dávají téměř 70 % příjmů (s. 14) | upřesňuje | Rozdíl 55 % proti 60 % je v definici a roce; Koncepce neuvádí absolutní číslo. Ponechat 6,0 mil., případně doplnit větu o 70 % příjmů od ekonomicky aktivních (s. 14). |
| Platba státu a vzorec § 3c (ř. 313; J10 ř. 425) | Vzorec sleduje inflaci a polovinu růstu reálné mzdy | MZ za klíčové opatření označuje automatickou valorizaci „návaznost na inflaci a růst reálné mzdy“, která má „odpolitizovat příjmy“ (s. 76, s. 78). Částku ani rok účinnosti neuvádí | upřesňuje | Do J10 doplnit: „Automatickou valorizaci platby státu zavedlo MZ jako klíčové opatření k odpolitizování příjmů (Koncepce 2025, s. 76). J10 na ni navazuje: vzorec má sledovat i počet a věk státních pojištěnců.“ |
| Fondy pojišťoven (M2.3 ř. 2194; P2 ř. 2495) | Fond prevence přeměnit na fond rozšířené péče; rezidenční místa z fondu obecně prospěšných činností | Novela od 2026: „významné posílení fondů prevence“ s individuálními bonusy, nový fond obecně prospěšných činností pro dostupnost v problematických odbornostech a lokalitách (s. 78); pojišťovny smějí od ledna 2026 dotovat vzdělávání z fondů (s. 117) | rozpor (M2.3), potvrzuje (P2) | U P2 doplnit odkaz na s. 78 a s. 117. U M2.3 výslovně napsat, že jde proti směru MZ, a proč (viz E, bod 14). |

### B2. Lůžka, obložnost a produkce akutní péče

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Akutní lůžka (ř. 231, 842; D1; web KEY_NUMBERS, BEDS, GLOSSARY) | 48 036 (2024), 4,4 na 1 000 | Absolutní počet nemá. „Disponujeme vysokým počtem akutních lůžek“ (s. 61); síť UP a JIP „vůbec nejhustší v EU“ (s. 51) | Koncepce nemá (číslo), potvrzuje (směr) | Ponechat zdroj NZIP/ÚZIS. |
| Obložnost standardních akutních lůžek (ř. 233, 856; D2; web BEDS) | 56 % (2024), 65,6 % (2015) | „Řada nemocnic nyní provozuje oddělení s obložností pod 50 %“ (s. 75) | potvrzuje (kvalitativně) | Za ř. 233 doplnit větu z s. 75 se zdrojem. |
| Produkce akutní lůžkové péče | Studie nemá; má jen pokles obložnosti | Pokles ošetřovacích dnů asi o 1,5 % ročně za posledních 10 let; síť ani lůžkový fond nereagovaly (s. 61) | Koncepce má navíc | Doplnit do Části I (E, bod 2). |
| Následná lůžka obsazená (ř. 233, 856, 904; web BEDS) | 84,2 % (SSS-05), 85,4 % (OIS-11-28) | Bez čísla; „v řadě regionů přitom již nyní kriticky chybí lůžka následné péče“ (s. 61) | potvrzuje (kvalitativně) | Beze změny čísla; doplnit citaci s. 61. |
| Pediatrická lůžka (ř. 948) | 36,3 %; 75 z 84 pracovišť pod 50 % | Jen obecně oddělení pod 50 % (s. 75) | potvrzuje (kvalitativně) | Beze změny. |
| Úbytek akutních lůžek 2025 (ř. 880) | 46 018 předběžně, −2 018 | Pojišťovny se během roku 2024 s řadou nemocnic dohodly na redukci akutních lůžek a vzniku lůžek následné péče, bez čísla (s. 82) | upřesňuje | Doplnit k „Ověřit“ na ř. 880 větu ze s. 82 jako nepřímou oporu, že jde o skutečné snížení. Číslo zůstává k ověření. |
| Úhrady odměňují objem a historii (ř. 235) | Kvalitativně | Základní sazba vznikala ad hoc; hospodaření nemocnic ovlivňovala „historická výše úhrad“ (s. 74) | potvrzuje | Doplnit citaci s. 74. |
| Typologie nemocnic (J6 ř. 887) | Tři role: centrum, regionální s UP, okresní jako zdravotní centrum regionu | Pět typů: centrové s UP a LPS (aspoň jedna v kraji), akutní 24/7 bez center, bez UP, s následnou péčí a geriatrickou ambulancí, paliativní (s. 69–70) | upřesňuje | V J6 uvést převodník tří rolí na pět typů MZ (E, bod 6). |

### B3. Následná a dlouhodobá lůžka a jejich potřeba

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Potřeba lůžek do 2035 (ř. 119, 295, 356, 904, 996, 1124, 1497; D3) | asi 39 000 lůžek dlouhodobé a následné péče, „o 53 % víc než 2021“; 21 000 pečovatelů | Chybí nejméně 2–3 tis. lůžek; do roku 2035 další nejméně 8 tis. (s. 65). Spodní hranice predikcí: asi 4 700 do let 2030–2035, z toho +3 200 ošetřovatelských lůžek 9U7 do 2030 a +1 600 lůžek pro péči, kterou dnes nesou akutní lůžka (s. 66) | upřesňuje (jiná definice) | Viz vysvětlení pod tabulkou a návrh textu v E, bod 3. |
| Přeměna 8 000 akutních lůžek pokryje „asi pětinu potřeby“ (ř. 1497) | 8 000 do 2038 | Zdravotní potřeba do 2035 nejméně 8 tis. navíc k dnešnímu deficitu 2–3 tis. (s. 65) | rozpor ve výkladu | Větu přepsat: 8 000 přeměněných lůžek odpovídá řádově zdravotní části potřeby podle MZ; zbytek do 39 000 jsou pobytové sociální služby. |
| Pokles 2010–2013 (ř. 886; web PROBLEM_FACTS, FAQ) | −5 914 akutních, +22 následných | Bez čísla; za posledních 10 let „nijak nereagovala … ani lůžkový fond“ (s. 61) | Koncepce nemá | Beze změny. |

**Proč se 39 000 a 8 tisíc neliší chybou, ale definicí.**

1. **Rozsah.** Koncepce mluví o zdravotních lůžkách následné a dlouhodobé ošetřovatelské péče, tedy o lůžkách hrazených z pojištění pod MZ. Výslovně uvádí ošetřovatelská pracoviště 9U7 (s. 66) a „smluvně zajištěná lůžka“ (s. 65). Studie bere číslo, které zahrnuje i pobytové sociální služby pod MPSV a kraji (domovy pro seniory, domovy se zvláštním režimem). Graf ř. 293 to říká výslovně.
2. **Dvě řady v Koncepci.** Koncepce uvádí „konzervativní“ řadu (2–3 tis. dnes, dalších 8 tis. do 2035, s. 65) a „spodní hranici predikcí“ (4 700 do 2030–2035, s. 66). Jejich vztah nevysvětluje. Pro studii je bezpečné citovat obě a nespojovat je do jednoho čísla.
3. **Co to znamená pro J7.** Podmínka J7 (žádná přeměna bez prokázané kapacity) zůstává správná. Mění se ale argument: zdravotní část potřeby podle MZ (desítka tisíc lůžek do 2035, náš dopočet z s. 65) může z velké části vzniknout přeměnou akutních lůžek. Kapacitní propast leží hlavně v sociálních pobytových službách. To posiluje P3 (sociální účet) a oslabuje větu, že přeměna „pokryje asi pětinu potřeby“.
4. **Koncepce i studie se shodnou na mechanismu.** MZ píše, že 1 600 lůžek potřeby „vyplývá již ze současných potřeb systému – jde o péči, kterou v současnosti zajišťují lůžka akutní“ (s. 66). To je přesně důvod přeměny v J6.

### B4. Praktici a lékaři

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Počet praktiků pro dospělé, úbytek, věk (ř. 239; web GP_DECLINE) | asi 5 500; −110 až 180 ročně; 43,6 % nad 60 let | Žádná čísla. „Dlouhodobý nedostatek lékařů v primární péči“, „řada občanů ČR nemá svého praktického lékaře“ (s. 95) | Koncepce nemá | Ponechat ÚZIS. Doplnit jen kvalitativní citaci s. 95 jako shodu s MZ. |
| PLDD a děti bez kapitace (ř. 247, 251; web PROBLEM_FACTS) | 2 050 PLDD; 182 tis. dětí | Jen „ubývající kapacita“ PLDD (s. 95) | Koncepce nemá | Beze změny. |
| Lidé bez praktika (ř. 251–253) | neměří se | Neměří; pojišťovny mají „důsledně hledat lékaře“ (s. 76) | Koncepce nemá (číslo) | Viz D. |
| Týmové praxe (J1 ř. 540) | 241 k 30. 6. 2026; nevyžadují sestry | Definice a úhradová podpora 2025; přínos: sdílení přístrojů, zastupitelnost, přenos administrativy „na nelékařský personál“, delší ordinační doby; „jen prvním krokem“, dalším jsou multidisciplinární praxe (s. 77); „pilotní zavedení … jako první krok ke vzniku center primární péče“ (s. 82). Počet praxí neuvádí | potvrzuje (studie má i počet) | J1 výslovně označit za druhý krok, který Koncepce ohlašuje (E, bod 5). |
| „Centrum primární péče … zatím nemá definici“ (ř. 540) | | Popisná definice: multidisciplinární týmová praxe s přesahem do veřejného zdraví a komunitního duševního zdraví, s celým multidisciplinárním týmem (s. 77) | upřesňuje | Upravit na „nemá právní definici; MZ ji v Koncepci 2025 popisuje takto … (s. 77)“. |
| Lékaři na 1 000 obyvatel (ř. 273) | 4,2, OECD 4,0 | Nad průměrem EU, srovnatelné s Rakouskem a Německem, bez čísla (s. 95) | potvrzuje | Doplnit „shodně MZ (s. 95)“. |
| Absolventi lékařských fakult | Studie nemá | +300 absolventů všeobecného lékařství ročně od šk. roku 2025/26; počet studujících +30 % (s. 97) | Koncepce má navíc | Doplnit do P2 jako kontext: přísun lékařů roste, úzkým místem je obor a rezidenční místo. |
| Rezidenční místa VPL (P2 ř. 2495; ř. 2376) | +50 atestací ročně od 2033 (předpoklad) | 150 (2023), 140 (2024), 140 (2025), dotace 1,98 a 1,8 mil. Kč na místo (s. 97) | upřesňuje | V P2 uvést výchozí stav 140 míst a to, že počet v letech 2023–2025 klesl. Předpoklad +50 atestací vyžaduje víc míst, ne udržení. |
| Rezidenční místa pediatrie (ř. 718) | „asi 80 ročně“ | 80 (2023), 70 (2024), 70 (2025); podporována jen varianta s praxí u PLDD, od 2025 24 měsíců (s. 97–98) | upřesňuje | Přepsat na „80 v roce 2023, 70 v letech 2024 a 2025 (Koncepce 2025, s. 97)“. |
| Atestace VPL (ř. 245, 1491, 2362) | 150–200 / 160–200 / 161–199 | Nemá | Koncepce nemá | Sjednotit uvnitř studie. |

### B5. Sestry a nelékařské profese

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Počet sester | 9,0 praktikujících sester na 1 000 (ř. 276) | asi 83 tisíc sester ve zdravotnictví podle NZIS (s. 111) | upřesňuje (jiná definice) | 9,0 na 1 000 dává asi 98 tisíc (náš dopočet). Rozdíl je nejspíš v definici OECD „practising nurses“ a v roce. Doplnit absolutní číslo MZ se zdrojem a obě veličiny nesrovnávat. |
| Chybějící sestry | Studie nemá | asi 3 tisíce „již nyní“ (s. 111) | Koncepce má navíc | Doplnit do Části I. |
| Věk sester (ř. 287 Ověřit; ř. 590) | průměrný věk všeobecné sestry 48,2 (2023) | přes 12 tisíc všeobecných sester nad 60 let, 1 774 nad 70 let; v sociálních službách je 60+ až pětina sester (s. 111) | upřesňuje | Doplnit; uzavírá část „Ověřit“ na ř. 287. |
| Náhrada do 2037 (ř. 269, 590, 1483; web NURSES, FAQ) | „přes 30 000 úvazků sester, PA a dětských sester“ | nových všeobecných sester je potřeba nejméně 24 000 úvazků za 10–12 let; u porodních asistentek a dětských sester program „kryje očekávané odchody“ (s. 114) | rozpor nebo jiná definice | Náš dopočet: 24 000 + 2 539 + 1 547 ≈ 28 tisíc. Bez primárního zdroje 30 000 nahradit číslem MZ (E, bod 4). |
| Vládní program NLZP (ř. 269, 2362) | 12,8 mld. Kč, 2026–2037; „zhruba 15 400 VŠ absolventek“; „kapacity o 20 %“ | přes 12,8 mld. Kč, 2026–2037, schválen vládou (s. 113); 17 VŠ; úspěšnost 70 %; za 12 let 11 078 všeobecných sester, 2 539 PA, 1 547 dětských sester, 1 728 RA, 3 573 záchranářů, 1 250 nutričních terapeutů (s. 114); 1. ročníky nejméně +20 %, všeobecné ošetřovatelství až +40 % (s. 113) | potvrzuje (12,8 mld.), upřesňuje (15 164; +20 až +40 %) | Přepsat na přesná čísla s s. 113–114. |
| Roční produkce škol (ř. 269, 590, 1483, 2362; H2; web NURSES, TEN_NUMBERS) | „VŠ asi 1 300 absolventek ošetřovatelství ročně“ | 16 VŠ: 680 absolventů; 35 VOŠ: 570 studentů ročně (s. 112); VOŠ za 12 let asi 11 000 všeobecných sester (s. 114) | rozpor | Nejpravděpodobněji jde o součet VŠ a VOŠ (1 250). Studie uvádí i OECD 16 všeobecných sester na 100 tis. (ř. 277), tedy asi 1 740 ročně. Vybrat jednu veličinu a citovat s. 112. |
| Podíl reformy na absolventkách (ř. 117, 131, 1481, 1483) | 440 ročně = „třetina VŠ absolventek“; vrchol 595 (46 %) | z čísel s. 112 a 114 | rozpor (závisí na základu) | Náš dopočet: 440 je 65 % dnešních 680 VŠ absolventů, 35 % dnešních VŠ a VOŠ (1 250) a asi 24 % průměrné produkce všeobecných sester VŠ a VOŠ v letech 2026–2037 (asi 22 tisíc za 12 let, s. 114). Formulaci opravit (E, bod 4). |
| Bilance bez reformy | Studie nemá | Potřeba 24 000 (s. 114) proti nabídce 11 078 z VŠ a asi 11 000 z VOŠ (s. 114) | Koncepce má navíc | Náš dopočet: i bez reformy chybí za 12 let asi 2 tisíce všeobecných sester. 4 000 sester pro týmy jsou nad tímto rámcem. Patří do P1 a do rizika R1. |
| Kompetence sester (ř. 283; J2) | „prakticky neumožňují“ samostatnou práci | vyhl. 158/2022 Sb. rozšířila činnosti bez indikace lékaře (s. 118); vyhl. 324/2024 Sb. přenesla část kompetencí v léčbě ran (s. 120); zák. 375/2022 Sb. umožnil předepisovat vybrané zdravotnické prostředky (s. 118) | upřesňuje | Zmírnit: kompetence se rozšiřují, ale v ordinaci praktika chybí úhrada a protokoly. Citovat s. 118–120. |
| Indikace domácí péče (Pil5.1 ř. 1149; web PATIENT_JOURNEY) | dnes praktik na 3 měsíce, jiný lékař na 14 dnů | od 1. 1. 2026 smí sestra se specializovanou způsobilostí v domácí péči upravit či doplnit indikaci, „pokud to lékař v rámci indikace umožní“ (s. 121) | upřesňuje | Doplnit jako výchozí krok, na který Pil5.1 navazuje. |
| Sestra v pokročilé praxi (J2 krok 3; vlna 4) | APN s preskripcí od 2033 | Zahraniční model popsán (s. 121); cíl do 2025 jen „platformy nad podmínkami a možnostmi implementace“ (s. 127) | potvrzuje směr, studie jde dál | Napsat, že MZ APN uvádí jako cíl bez harmonogramu a studie mu dává termín. |

### B6. Úhrady, DRG, týmové praxe a centralizace

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Konvergence DRG (ř. 942, 1555; M3.3 ř. 2549) | rozpětí krajských sazeb 1 : 1,7 → 1 : 1,3 do 2031; DRG zákonem od 2033 | podíl ALP hrazené jednotnou základní sazbou 3,4 % (2022, s. 74) → přes 25 % (2025, s. 76, s. 82); cíl aspoň 30 % „v příštích několika letech“ (s. 76) | upřesňuje (jiná veličina) | Obě veličiny uvést vedle sebe. Podíl péče za jednotnou sazbu měří, kolik péče už je sjednoceno; rozpětí sazeb měří, jak daleko jsou zbylé sazby od sebe. Viz E, bod 9. |
| Rizikový koridor (M3.4 ř. 2223) | trvalý koridor ±5 % | v úhradové vyhlášce 2025 „zúžení risk-koridoru o dodatečných 5 %“ (s. 82) | upřesňuje | Doplnit výchozí stav (s. 82). Pozor: „zúžení o 5 %“ a „koridor ±5 %“ nejsou totéž. |
| CZ-DRG v úhradách | Studie nemá datum | plošně od 2021; verze 7.0 pro 2025; přes 40 referenčních nemocnic, asi 40 % ALP (s. 62–63) | Koncepce má navíc | Volitelně do M3.3. |
| Centralizace (ř. 846, 926–928; Pil2.1) | onkochirurgie od 1. 9. 2026 jako „precedent bez zákona“ | řízená koncentrace od 2023, péče mimo centra penalizována, výhledově odsmluvnění (s. 77); pro rok 2025 nově chirurgie (s. 82) | upřesňuje | Doplnit, že precedent začal v roce 2023 a vlny 2026–2030 na něj navazují. |
| Jednodenní péče (J6 role okresní nemocnice) | kvalitativně | nový segment v dohodovacím řízení; kardiologie 2025 (s. 76, s. 81) | potvrzuje | Doplnit citaci do J6. |
| Odměna za výsledky (J1 ř. 557) | strop 10 % | silné pobídky za měřený výkon jsou „velmi nebezpečné“, když měřený výkon je malá část toho, na čem záleží (s. 14) | potvrzuje | Doplnit k Roland a Guthrie jako shodu s MZ. |

### B7. Prevence a screening

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Kolorektální screening (ř. 329; D6 ř. 2020; web PREVENTION_FACTS „31 %“) | 31,1 % (2024, ÚZIS), cílová populace 50–75 | „přibližně 30 %“ u lidí od 50 let; v tříletém intervalu asi 50 % (s. 36) | potvrzuje | Doplnit, že MZ uvádí totéž. U D6 uvést, že od 2026 se má cílová skupina změnit na 45–75 let (s. 40), což změní jmenovatel ukazatele. |
| Účast na kolonoskopii po pozitivním TOKS (ř. 340) | 61,7 % | 60 až 70 % „v čase“ (s. 36); pozitivita TOKS až 10 % a s ní rostoucí čekání (s. 36) | potvrzuje | Doplnit citaci; u čekání 84,2 dne uvést, že MZ růst čekání potvrzuje bez čísla (s. 36). |
| Mamografie (ř. 330; web PREVENTION_FACTS „60 %“) | 60 % žen 50–69 (OECD) | asi 60 % žen 45–69 ve dvouletém intervalu, v některých okresech pod 50 % (s. 36) | potvrzuje (jiná věková skupina) | Na webu buď ponechat OECD (50–69), nebo přejít na MZ (45–69). Nemíchat. |
| Navigace po pozitivním screeningu (Pil4.8 ř. 1109) | pilot ve dvou krajích | NSC zavedlo koordinátory screeningových programů a krajské koordinátory (s. 44–45); plánuje centrální rezervační systém (s. 43, s. 46) a eŽádanku s hodnotou TOKS | Koncepce má navíc | Pilot navigace postavit na infrastruktuře NSC (E, bod 12). |
| Kapacita kolonoskopie (ř. 342) | Ověřit | výzva na technické vybavení koloskopických pracovišť (s. 45), bez kapacit | Koncepce nemá (čísla) | Viz D2. |
| Daně z alkoholu a cukru (J8, J9) | 5 mld. Kč ročně | Žádné daňové opatření; tabák a alkohol jen v seznamu priorit primární prevence (s. 24) | Koncepce nemá | Nepsat „stejným směrem jako MZ“. Studie zde jde nad rámec Koncepce a má to říct. |
| Fond prevence a bonusy (P4; Část VI ř. 1547) | Národní fond prevence 2 mld. Kč; odměnu za prevenci platit jen z fondu prevence | posílení fondů prevence pojišťoven a individuální zdravotní účty (s. 76, s. 78); cílem bylo i „systém bonusů … umožňující individuální účty“ (s. 49) | potvrzuje cíl, liší se nástroj | Viz E, bod 14. |
| Zátěž chronickými nemocemi | Studie nemá | téměř 68 % seniorů nad 65 let má aspoň jednu vážnou chronickou nemoc (EHES 2019, s. 20); až 30 % lidí nad 65 let má víc než dvě (s. 35); přes 1 milion diabetiků (s. 22) | Koncepce má navíc | Doplnit do Části I (odvratitelné hospitalizace). |

### B8. Léky a elektronizace

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Výpadky léků (brief 5 ř. 2275; Manifest ř. 27) | „kolem 2 200 aktivních výpadků proti 580 v roce 2019“ | Hlášení přerušení dodávek SÚKL za rok: 2 211 (2019), 1 898 (2020), 1 853 (2021), 2 826 (2022), 4 145 (2023), 3 808 (2024) (s. 84). Data „nezohledňují … dobu tohoto přerušení“ (s. 84). Přípravky s příznakem „omezená dostupnost“: 585 (6/2024–6/2025), u 229 odňat (s. 88) | jiné veličiny | Viz vysvětlení pod tabulkou. |
| eRecept (ř. 769) | 86 mil. receptů 2024, bez zdroje | téměř 86 mil. vystavených, přes 85 mil. vydaných (2024, s. 91) | potvrzuje | Doplnit zdroj s. 91. |
| eŽádanka (J5 ř. 680, 773; Pil3) | povinná eŽádanka z vládní novely; triážní pole pro ambulantní specialisty | zák. č. 236/2025 Sb. účinný od 1. 1. 2026 (s. 128–129); eŽádanka „podpoří monitoring objednacích dob“ a „v budoucnu umožní zveřejnění čekacích lhůt“; **první fáze jen laboratorní a obrazová vyšetření** (s. 140) | upřesňuje | J5 má napsat, že triážní pole pro konzultace u specialistů vyžaduje rozšíření eŽádanky za první fázi MZ. |
| Portál pacienta (Pil3.3 ř. 780, 824) | Portál lékaře a pacienta, pilot od 1/2026 | Národní portál elektronického zdravotnictví (NPEZ) a EZKarta (s. 134, s. 139) | Koncepce nemá (jiný název) | Ověřit, zda jde o tentýž systém. |
| Online objednání, souhrn pacienta (ř. 769) | 19,6 % lidí; 66,4 % lékařů souhrn nepoužilo | Koncepce žádná čísla o adopci nemá | Koncepce nemá | Beze změny. |

**Proč „2 200 výpadků“ v Manifestu a „2 211 hlášení“ v Koncepci nejsou totéž.** Koncepce uvádí **tok**: počet hlášení o přerušení dodávek, která SÚKL dostal za celý kalendářní rok, bez ohledu na délku přerušení (s. 84). Manifest uvádí **stav**: počet výpadků aktivních k jednomu dni (květen 2026, podle § 33b). Shoda čísla 2 211 za rok 2019 a „asi 2 200“ za rok 2026 je náhodná a svádí k chybnému srovnání. Třetí veličina je 585 přípravků s příznakem „omezená dostupnost“ (s. 88), blízká číslu 580 z Manifestu, ale opět jiná. Doporučení: v briefu 5 nechat Manifest se zdrojem a datem stavu a vedle něj uvést tok podle Koncepce. Nikdy je nespojovat do jedné řady.

### B9. Investice, fondy EU a pomezí

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Fond přeměny lůžek (J6, J7 ř. 912–918) | 5–10 mld. Kč investic, 0,6–1,2 mil. Kč na lůžko; garance příjmu | IROP: dotaci dostane jen poskytovatel, který zruší 20 akutních lůžek a zřídí 20 následných, převážně geriatrických, s návazností na sociální služby (s. 148) | Koncepce má navíc (precedent) | Doplnit jako precedent nástroje. Částku 1,1 mld. Kč pro tuto výzvu Koncepce neuvádí; v textu ji necitovat se s. 148. |
| IROP celkem | Studie nemá | vyhlášené výzvy 9,5 mld. Kč EU + 2,7 mld. Kč národní spolufinancování = asi 12,3 mld. Kč (k 31. 7. 2025, s. 150); z toho nejméně 255 nových akutních psychiatrických lůžek, 110 dětských (s. 150); výzvy na urgentní příjmy asi 5 mld. Kč (12/2024, s. 147) | Koncepce má navíc | Doplnit do Investic (ř. 1424) jako kontext; nepočítat do zdrojů reformy. |
| IROP a ordinace (ř. 1424) | IROP výstavbu ordinací praktiků nepodporuje | Nic proti tomu; o ordinacích mlčí | Koncepce nemá | Beze změny. |
| NPO | Studie nemá | pilíř 6 asi 12,5 mld. Kč; 14 milníků, 4 splněny k 31. 7. 2025 (s. 146) | Koncepce má navíc | Jen kontext pro Pil3 (eHealth z NPO). |
| REACT-EU | Studie nemá | 22 mld. Kč, hlavně akutní péče a urgentní příjmy, do konce 2023 (s. 147) | Koncepce má navíc | Volitelně do pilíře 2: velká investice do akutní sítě v letech 2021–2023 zvyšuje odpor k přeměně. |
| Krajské plánování pomezí (J6, P3) | krajský plán od 2033 | projekt KRAPL ve dvou krajích (s. 149); datový most MZ–MPSV (s. 68, s. 71) | Koncepce má navíc | Doplnit do J6 a P3 jako předstupeň. |
| Sociálně-zdravotní lůžka (Část VI, zák. 38/2025) | podpořit cíl | „Proběhlo legislativní ukotvení … sociálně-zdravotní lůžkové péče“ (s. 72); stanovena úhrada (s. 82) | potvrzuje | Beze změny; volitelně citovat. |
| Domácí péče | Studie: úhradová vyhláška 2027 +8,5 % (ř. 1149) | program švýcarsko-české spolupráce asi 250 mil. Kč (s. 149) | Koncepce má navíc | Volitelně. |

### B10. Instituce: NIKEZ, NSC, veřejné zdraví

| Tvrzení studie (místo) | Studie | Koncepce (strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Nezávislá instituce pro hodnocení technologií (M1.2 ř. 2167, 2540) | léky, výkony, prostředky, digitální nástroje, organizační modely; rozšíření mandátu SÚKL a ÚZIS | NIKEZ od 19. 1. 2023, pracuje „v rámci řídících struktur“ MZ (s. 53); 8 programových cílů: doporučené postupy, kvalita, akreditace center, indikátory kvality a HSPA, dostupnost, hodnocení prevence, predikce personálu, heterogenita DRG (s. 58) | navázání, ne rozpor | NIKEZ není HTA agentura pro léky a není nezávislý na MZ. Studie má napsat, že metodiku hodnocení organizačních modelů (M1.1) a HSPA (P5) chce postavit na NIKEZ a ÚZIS a že nezávislost je to, co přidává. |
| HSPA jako rámec v zákoně (P5 ř. 2251, 2498) | Rada HSPA schvaluje, ÚZIS počítá | HSPA je programový cíl NIKEZ č. 4 (s. 58); MZ chce „výroční zprávy o výkonnosti systému“ (s. 14); resortní referenční statistiky až na úroveň poskytovatelů (s. 56) | potvrzuje směr | Zvážit, zda místo nové Rady HSPA nevyužít Řídicí radu NIKEZ nebo Radu NZIS. |
| Národní screeningové centrum | Studie nezmiňuje | schváleno vládou v květnu 2025 jako koordinátor screeningů (s. 35); 40 kmenových zaměstnanců (s. 39) | Koncepce má navíc | Doplnit do pilíře 4 (E, bod 12). |
| Hygienická služba a NIVZ (Část VI ř. 1553; ř. 80) | vládní reforma sloučí 14 KHS, SZÚ a dva zdravotní ústavy (17 institucí) | Národní institut veřejného zdraví „vznikne konsolidací“ SZÚ, obou zdravotních ústavů a Státní hygienické služby jako nástupce 14 KHS (s. 26); Státní hygienická služba jako ústřední orgán (s. 145) | potvrzuje | V Části VI napsat, že vládní předloha převzala záměr Koncepce 2025 (s. 26). Institut má být „odborným nezávislým zázemím pro vznik podkladů pro zdravotní politiku státu“ (s. 26), což podporuje PN studie o hodnocení prevence. |
| Rada vlády pro veřejné zdraví | Studie nezmiňuje | usnesení vlády č. 602/2024 ze 4. 9. 2024 (s. 25) | Koncepce má navíc | Zmínit u P4 jako místo pro koordinaci Národního fondu prevence. |
| Nemocniční ombudsman (M9.1) | navazuje na zák. 290/2025 Sb. | další rozvoj funkce nemocničního ombudsmana (s. 57) | potvrzuje | Volitelně citovat. |

### B11. Výzkum

| Tvrzení studie (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Rozpočet AZV (ř. 2320 Ověřit) | neuvádí | asi 1,2 mld. Kč v letech 2024 a 2025 (s. 154); podpořen „každý 5. projekt“, 23 % standardní a 19 % juniorské (s. 154) | Koncepce má | Doplnit; uzavírá část „Ověřit“. |
| Podíl státního rozpočtu VaV na zdravotnický výzkum | Studie nemá | ČR asi 12 %, Rakousko 20 %, Nizozemsko téměř 30 % (s. 155); 14 % (2010) → 12 % (2020) (s. 165); cíl 20 % v roce 2030 (s. 166) | Koncepce má navíc | Doplnit do briefu 6 jako vládní cíl, na který M6.1 a M6.2 navazují. |
| Akademické klinické studie a ECRIN (M6.1) | CZECRIN od 2018 | AZV podepsala memorandum s CZECRIN (s. 161) | potvrzuje | Doplnit citaci. |
| Linka pro výzkum zdravotních služeb (M6.2) | navrhuje | Koncepce výzkumu do 2030 přidala prioritu Veřejné zdraví; samostatnou linku pro výzkum zdravotních služeb nezmiňuje | studie jde dál | Ponechat jako vlastní návrh. |

### B12. Úmrtnost a epidemiologie

| Tvrzení studie nebo webu (místo) | Studie | Koncepce (hodnota, rok, strana) | Verdikt | Doporučení |
| --- | --- | --- | --- | --- |
| Odvratitelná úmrtnost (ř. 64, 257; H7; web INDICATORS) | léčitelná 107,2 proti EU 86,8 (+24 %, Eurostat 2023); preventabilní 173,9 proti 150,9 | úmrtnost z preventabilních **a** léčitelných příčin „přibližně o 25 % vyšší“ než EU (OECD Country Health Profile 2023, s. 20, s. 35) | upřesňuje (jiná veličina a rok) | Čísla nemíchat: Koncepce sčítá obě složky a vychází ze starších dat OECD. Náš dopočet z Eurostatu 2023: součet obou složek je o 18 % nad EU. |
| Odvratitelné hospitalizace (ř. 257; H5; web AVOIDABLE) | 592 proti OECD 473 | „řada onemocnění, kterým by šlo prevencí a ambulantní péčí předcházet, se … léčí až v nemocničním prostředí“, bez čísla (s. 75) | potvrzuje (kvalitativně) | Doplnit citaci jako shodu s MZ. |
| Stárnutí (ř. 215) | 85+ z 202 na 509 tisíc do 2050 | počet lidí 80+ se v příštích dvou dekádách „až zdvojnásobí“; zhoršení od 2030 (s. 16) | potvrzuje | Volitelně citovat. |

---

## C. Směr: kapitoly Koncepce a pilíře studie

Legenda ve sloupci „Vztah“: **stejný směr** (studie má výslovně napsat, že navazuje na Koncepci), **Koncepce navíc** (Koncepce řeší, studie ne), **studie dál** (stejný cíl, studie jde hlouběji nebo dál v čase), **studie jinak** (jiný nástroj nebo opačný směr).

| Kapitola Koncepce (strany) | Co Koncepce dělá | Opatření studie | Vztah | Co má studie napsat |
| --- | --- | --- | --- | --- |
| 0 Úvod (6–19) | Odklon od plateb za výkon ke kapitaci a sdíleným úsporám; výroční zprávy o výkonnosti; varování před silnými pobídkami (s. 14) | J1 platba za funkce, strop odměny 10 %; P5 | stejný směr | U J1 a P5 citovat s. 14. |
| I Prevence a veřejné zdraví (20–34) | 9 priorit, Rada vlády (s. 25), Národní institut veřejného zdraví (s. 26), očkovací strategie; bez daní | J8, J9, P4, Pil4.1–4.10; PN k hygienické službě | stejný směr v institucích; studie dál v daních | U P4 a PN k NIVZ citovat s. 25–26. U J8 a J9 napsat, že Koncepce daně nenavrhuje a studie jde dál. |
| II Sekundární prevence a NSC (35–50) | NSC (s. 35), koordinátoři screeningu (s. 44–45), rezervační systém (s. 43), věk kolorekta 45–75 od 2026 (s. 40), reporty praktikům | Pil4.8 navigace, D5, D6, J2 (sestra zve) | Koncepce navíc; stejný směr | Navigaci stavět na NSC; D6 přepočítat na novou cílovou populaci. |
| III Kvalita, NIKEZ (51–59) | NIKEZ (s. 53), 8 programových cílů (s. 58), RRS na úroveň poskytovatele (s. 56), nemocniční ombudsman (s. 57) | M1.1, M1.2, M4.1, P5, M9.1 | stejný směr; studie dál v nezávislosti | Výslovně navázat na NIKEZ; nová instituce jen tam, kde NIKEZ nestačí. |
| IV Modely organizace péče (60–73) | Pokles ALP −1,5 %/rok (s. 61); deficit následných lůžek (s. 65–66); 5 typů nemocnic (s. 69–70); CZ-DRG a referenční nemocnice (s. 62–63); datový most MZ–MPSV (s. 68) | J6, J7, P3, Pil2.1–2.5 | stejný směr | J6 a J7 označit za zákonné dotažení směru Koncepce: plán, kontrolní body, fond přeměny. |
| V Ekonomika a úhrady (74–82) | Jednotná sazba 3,4 → 25 → 30 % (s. 74, 76); týmové praxe jako první krok (s. 77, 82); preskripční omezení (s. 78); valorizace platby státu (s. 76); fondy prevence a bonusy (s. 78); pojišťovny hledají lékaře a sledují čekání (s. 76); zpráva o síti (s. 81) | J1, J3, J5, J10, M3.3, M3.4, M2.3 | stejný směr (J1, J3, J5, J10, M3.3); studie jinak (M2.3) | J1 jako druhý krok MZ; J5 jako konkretizace povinnosti pojišťoven z s. 76; M2.3 vysvětlit jako vědomou odchylku. |
| VI Léková politika (83–94) | Novela zákona o léčivech 2024: rezervní zásoby, „omezená dostupnost“ (s. 87–88); hlášení výpadků (s. 84); pravidla uvolnění preskripčních omezení (s. 90); eRecept (s. 91) | brief 5 (M5.1–M5.4), J3 | stejný směr | M5.1 má navázat na nástroje novely 2024, ne je navrhovat znovu. |
| VII Lékaři (95–109) | +300 absolventů ročně (s. 97); rezidenční místa VPL 140, pediatrie 70 (s. 97); Systém Administrace od 1. 1. 2026 | P2, M8.2 | stejný směr; studie dál v počtu míst | P2 postavit na tabulce s. 97 a říct, kolik míst navíc +50 atestací vyžaduje. |
| VIII Nelékaři a sestry (110–127) | 83 tis., 3 tis. chybí (s. 111); program 12,8 mld. (s. 113); 24 000 (s. 114); kompetence (s. 118–121); APN jen platformy (s. 127); plánovací modely HEROES (s. 113) | J2, P1, Pil5.1, M8.3, M8.4 | stejný směr; studie dál (APN, sesterská složka) | Přepočítat personální bilanci na čísla s. 111–114; P1 napojit na modely HEROES. |
| IX Elektronizace (128–143) | zák. 236/2025 od 1. 1. 2026; NPEZ, EZKarta; eŽádanka nejdřív laboratoř a zobrazování (s. 140) | J5, Pil3.1–3.3 | stejný směr; studie dál (triáž) | Říct, že triážní pole vyžaduje rozšíření eŽádanky na ambulantní specialisty. |
| X Legislativa a dotace (144–152) | IROP 12,3 mld. (s. 150); podmínka 20 → 20 lůžek (s. 148); NPO (s. 146); KRAPL (s. 149); odklon od financování akutní péče k pomezí | Investice (Část V), fond přeměny, J6, P3 | stejný směr | Citovat IROP podmínku jako precedent fondu přeměny. |
| XI Výzkum (153–166) | AZV 1,2 mld. (s. 154); 12 → 20 % do 2030 (s. 155, 166); CZECRIN (s. 161) | brief 6 (M6.1–M6.4) | stejný směr; studie dál (akademické studie, výzkum služeb) | Citovat cíl 20 % jako rámec. |
| XII NZIS, NZIP, data (167–179) | přes 300 datových sad (s. 167); syntetická data; predikce personálu a referenční hodnocení následné péče jako cíl | M4.1, M4.2, P5, D3 | stejný směr | Citovat jako výchozí stav otevřených dat. |

**Kde Koncepce něco řeší a studie ne.** Národní screeningové centrum a celý cyklus screeningových programů (kap. II). Kvalita a doporučené postupy přes NIKEZ (kap. III). Léková politika v části výpadků a cenové regulace (kap. VI) je ve studii jen jako brief. Vzdělávání lékařů včetně kmenů a Systému Administrace (kap. VII). Kyberbezpečnost a EHDS (kap. IX). Výzkumné instituce (kap. XI).

**Kde studie jde dál.** Spotřební daně za zdraví (J8, J9) a Národní fond prevence (P4). Zákon o síti lůžkové péče s krajským plánem a kontrolními body (J6, J7). Sesterská složka úhrady a APN s termínem (J2). Triážní údaj a garance termínu (J5). Nový vzorec platby státu podle nákladů péče (J10). Sociální účet dlouhodobé péče (P3).

**Kde studie jde jinak nebo proti.**

1. **Fondy prevence pojišťoven** (M2.3): Koncepce je posiluje a chce individuální bonusy (s. 76, s. 78); studie je chce přeměnit na fondy rozšířené péče a prevenci přesunout do Národního fondu prevence a týmů.
2. **Odměna za prevenci pro pojištěnce**: Koncepce cílí na individuální účty a bonusy (s. 49, s. 76); studie v Části VI (ř. 1547) přijímá odměnu jen z fondu prevence a s měřením pokrytí. Není to rozpor, ale studie má říct, že bonusy jako nástroj nepovažuje za hlavní.
3. **Nezávislost hodnocení**: NIKEZ je součástí řídících struktur MZ (s. 53); studie chce nezávislé hodnocení (M1.2, M4.4). Jde o krok dál, ne proti.

---

## D. „Ověřit“, které Koncepce uzavírá

Studie má podle ř. 2657 asi 110 značek „Ověřit“ (80 po sloučení). Prošel jsem všechny výskyty (`grep -n "Ověřit"`). Koncepce zcela uzavírá jen málo z nich, protože většina se týká vývoje po 1. 8. 2025, financí pojištění nebo daní, které Koncepce nemá.

### D1. Uzavírá úplně nebo zčásti

| # | Místo ve studii | „Ověřit“ (zkráceně) | Co říká Koncepce | Věta k doplnění | Stav |
| --- | --- | --- | --- | --- | --- |
| 1 | ř. 287; seznam ř. 2667 | Primární zdroj 30 000 úvazků a věková struktura sester | 83 tis. sester, 3 tis. chybí, přes 12 tis. VS nad 60, 1 774 nad 70 (s. 111); potřeba nejméně 24 000 úvazků VS za 10–12 let (s. 114) | „Podle MZ působí ve zdravotnictví asi 83 tisíc sester, asi 3 tisíce chybí a přes 12 tisíc všeobecných sester je starších 60 let (MZ ČR, Koncepce 2025, s. 111). Jen nových všeobecných sester je za 10 až 12 let potřeba nejméně 24 000 úvazků (tamtéž, s. 114).“ | Věk uzavřen. 30 000 nahradit, nebo doložit jiným zdrojem. |
| 2 | ř. 1489; ř. 2672 | Roční počet absolventek VOŠ a praktických sester | 35 VOŠ s produkcí 570 ročně, 16 VŠ s 680 (s. 112); VOŠ od 2021 +40 až 50 % nově přijatých, za 12 let asi 11 000 VS (s. 114); z praktických sester pracuje ve zdravotnictví jen 50 % absolventů (s. 112) | „Vyšší odborné školy dnes vychovají asi 570 diplomovaných všeobecných sester ročně, vysoké školy 680 absolventů (MZ ČR, Koncepce 2025, s. 112). VOŠ od roku 2021 přijímají o 40 až 50 % víc studentů a za 12 let mají vychovat asi 11 000 všeobecných sester (s. 114).“ | VOŠ uzavřeno; počet praktických sester zůstává otevřený. |
| 3 | ř. 2376; ř. 2767 | Kolik rezidenčních míst ministerstvo vypisuje | VPL 150, 140, 140; pediatrie 80, 70, 70 v letech 2023–2025 (s. 97) | „Ministerstvo podpořilo ve všeobecném praktickém lékařství 150 rezidenčních míst v roce 2023 a po 140 v letech 2024 a 2025, v pediatrii 80, 70 a 70 (MZ ČR, Koncepce 2025, s. 97).“ | Uzavřeno pro 2023–2025. Potřeba míst zůstává otevřená. |
| 4 | ř. 2320; ř. 2764 | Rozpočet AZV | asi 1,2 mld. Kč v letech 2024 a 2025 (s. 154) | „Agentura pro zdravotnický výzkum pracovala v letech 2024 a 2025 s rozpočtem asi 1,2 mld. Kč (MZ ČR, Koncepce 2025, s. 154).“ | Rozpočet uzavřen; podíl akademických studií otevřený. |
| 5 | ř. 1128; ř. 2707 | Potřeba lůžek dlouhodobé péče do 2035: 35, nebo 39 tisíc | zdravotní lůžka: dnes chybí nejméně 2–3 tis., do 2035 dalších nejméně 8 tis. (s. 65); spodní hranice 4 700 (s. 66) | „Pro zdravotní lůžka následné a dlouhodobé péče uvádí MZ, že už dnes chybí nejméně 2 až 3 tisíce a do roku 2035 bude potřeba dalších nejméně 8 tisíc (MZ ČR, Koncepce 2025, s. 65). Odhad 35 až 39 tisíc zahrnuje i pobytové sociální služby.“ | Zčásti: oddělí zdravotní část. Spor 35 proti 39 tisícům nerozhodne. |
| 6 | ř. 880; ř. 2688 | 46 018 lůžek v roce 2025: trvalé snížení, nebo změna vykazování | pojišťovny se v roce 2024 s řadou nemocnic dohodly na redukci akutních lůžek a vzniku následných (s. 82) | „Pojišťovny se během roku 2024 s řadou nemocnic dohodly na redukci akutních lůžek a vzniku lůžek následné péče (MZ ČR, Koncepce 2025, s. 82).“ | Zčásti: podpora výkladu „trvalé snížení“, číslo zůstává k ověření. |
| 7 | ř. 780; ř. 2681 | Stav vládní novely zák. 325/2021 Sb. a termín eŽádanky | zák. č. 236/2025 Sb. účinný od 1. 1. 2026 (s. 128–129); první fáze eŽádanky: laboratoř a zobrazování (s. 140) | „Novela zákona o elektronizaci (zák. č. 236/2025 Sb.) je účinná od 1. 1. 2026. První fáze eŽádanky podle MZ pokrývá laboratorní a obrazová vyšetření (MZ ČR, Koncepce 2025, s. 129 a 140).“ | Zčásti: výchozí stav ano; dnešní novela (č. j. 748/26) zůstává k ověření. |
| 8 | ř. 718–720 | Text prof. Bronského (80 rezidenčních míst pro PLDD) | pediatrie 80 (2023), 70 (2024 a 2025) (s. 97) | „Pro budoucí PLDD podporuje ministerstvo 70 rezidenčních míst ročně (2024 a 2025; v roce 2023 80), a to jen ve variantě s praxí v ordinaci PLDD (MZ ČR, Koncepce 2025, s. 97–98).“ | Číslo aktualizováno. Jméno a název textu Bronského zůstávají k doplnění. |
| 9 | ř. 1555; ř. 2719 | Veřejný dokument MZ s trajektorií konvergence CZ-DRG | jiná veličina: podíl ALP za jednotnou sazbou 3,4 % (2022) → přes 25 % (2025) → aspoň 30 % (s. 74, s. 76) | „MZ v roce 2025 uvádí, že jednotnou základní sazbou se hradí přes 25 % akutní lůžkové péče proti 3,4 % v roce 2022 a cílem je aspoň 30 % (MZ ČR, Koncepce 2025, s. 74 a 76).“ | Zčásti: trajektorie 1 : 1,7 → 1 : 1,3 zůstává k ověření. |

### D2. Koncepce uzavřít nemůže

Důvodem je obvykle to, že Koncepce je k 1. 8. 2025 a otázka se týká pozdějšího vývoje, nebo že Koncepce dané číslo vůbec neuvádí (viz „Co Koncepce neobsahuje“).

- **Lidé bez praktika** (ř. 253, 2666). Koncepce jen kvalitativně (s. 95) a jako povinnost pojišťoven hledat lékaře (s. 76).
- **Rezervy pojišťoven, tabulka D.1 NRR, příjmy v. z. p.** (ř. 311, 315, 1438, 1477, 2839, 2933, 2936). Koncepce čísla v. z. p. nemá.
- **Implementační plán MZ 2.1 a 10 mld. Kč** (ř. 1340, 2671). Plán je z prosince 2025, Koncepce je starší.
- **Kapacita endoskopie** (ř. 342, 2670). Koncepce jen zmiňuje výzvu na vybavení koloskopických pracovišť (s. 45).
- **Preskripční omezení v číslech SÚKL a ultrazvuk odbornosti 001** (ř. 637, 2677–2678). Koncepce potvrzuje problém a cíl (s. 86, s. 90), čísla nemá.
- **Telefonická triáž krajů** (ř. 732, 2680). Koncepce jen přesun LPS na pojišťovny (s. 76).
- **AI zapisovatel, AI Act, Portál lékaře a pacienta** (ř. 813, 824, 834). Koncepce zná NPEZ a EZKartu (s. 134, s. 139), ne Portál lékaře a pacienta.
- **Ústavní nálezy, SGEI, veřejná podpora, TRIS** (ř. 888, 922, 1056, 1731–1733, 2689–2690, 2701). Koncepce neřeší.
- **Indikační omezení místo limitů** (ř. 944, 2691). Koncepce neřeší.
- **Dětská psychiatrie po krajích** (ř. 954, 2692). Koncepce má jen IROP 110 dětských psychiatrických lůžek celkem (s. 150).
- **Dojezdy ZZS** (ř. 964, 2018, 2693). Koncepce má jen úvazky záchranářů 19,2–63,1 na 100 tis. obyvatel (s. 111).
- **Koncepce intenzivní péče (Věstník 4/2026)** (ř. 970, 2694). Pozdější dokument.
- **Víno, slazené nápoje, minimální cena, Národní fond prevence jako státní fond** (ř. 1045–1060, 1078, 1096, 2698–2703). Koncepce daně nemá.
- **Proočkovanost proti chřipce 65+** (ř. 1108, 2704), **navigace po screeningu: start a plátce** (ř. 1109, 1112, 2705–2706), **zubní prevence v modelu** (ř. 1114).
- **Pilot společného rozpočtu, podpora pečujících, dříve vyslovené přání** (ř. 1138, 1152, 1169, 2708–2710). Koncepce má jen KRAPL (s. 149).
- **Část VI: VeKLEP, tisk 235, zák. 38/2025 Sb., hygienická služba od 1. 1. 2028, sesterská preskripce** (ř. 1547–1554, 1571, 2714–2720). Koncepce dává jen výchozí záměr (NIVZ s. 26; APN s. 121 a 127), ne dnešní stav.
- **Legislativní mapa a paragrafy** (ř. 1637–1750, 2724–2735). Mimo rozsah Koncepce.
- **Harmonogram, hodnotitel, řídicí výbor** (ř. 1822, 1916, 1958, 2739–2741).
- **Ukazatele: rok NRZP, ACSC, obložnost, slazené nápoje, výdaje na prevenci** (ř. 2018–2025, 2046, 2745–2750). Koncepce tyto údaje nemá.
- **První úplná zpráva HSPA (leden 2025)** (ř. 2258, 2761). Koncepce HSPA uvádí jako cíl NIKEZ (s. 58), o vydání zprávy nepíše. Z mlčení nelze nic vyvodit.
- **Kapacita SÚKL a ÚZIS pro hodnocení** (ř. 2183, 2758). Koncepce popisuje NIKEZ (s. 53, s. 58), o kapacitě nepíše.
- **Ostatní briefy** (ř. 2211, 2239–2240, 2282, 2347–2348, 2403–2404, 2432–2433, 2763, 2765–2770): správní rady, nadstandard, doplatky, kořenové kanálky, šetření orálního zdraví, ombudsman, psychoterapie, centra duševního zdraví. Koncepce k nim čísla nemá.
- **Formální položky** (ř. 13, 45, 1531, 2794, 2877, 2913, 2937–2938): e-mail, oponenti, adresa modelu, Estonsko, názvy předpisů, citace, ISPV.

**Nová „Ověřit“, která srovnání otevírá.**

1. Zda dnešní vedení MZ Koncepci 2025 dál používá jako východisko a zda ji nějaký orgán vlády projednal.
2. Zdroj čísla „VŠ asi 1 300 absolventek ročně“ a zda nejde o součet VŠ a VOŠ.
3. Zda Portál lékaře a pacienta (pilot od 1/2026) je tentýž systém jako NPEZ a EZKarta z Koncepce.
4. Zdroj „30 000 úvazků“, pokud ho studie ponechá vedle čísla 24 000 z s. 114.

---

## E. Návrh úprav

### E1. Studie, verze 3.1 (15 bodů)

1. **Část VI, úvod (za ř. 1537).** Vložit odstavec: „Výchozím dokumentem resortu je Koncepce Ministerstva zdravotnictví 2025 (verze 2.0, 1. 8. 2025). Ve většině jádra jde stejným směrem jako tato studie: méně akutních lůžek a víc následné péče (s. 61, 65–66), týmové praxe jako první krok k centrům primární péče (s. 77, 82), uvolnění preskripčních omezení (s. 78, 90), jednotné sazby DRG (s. 76) a sloučení hygienické služby do Národního institutu veřejného zdraví (s. 26). Studie tyto záměry převádí do zákonů, úhrad a termínů. Kde jde dál nebo jinak, říká to u jednotlivých opatření.“ Do seznamu zdrojů (ř. 2841) přidat Koncepci s URL.

2. **Část I, Nemocniční těžiště (za ř. 233).** Vložit: „Ministerstvo zdravotnictví uvádí, že produkce akutní lůžkové péče měřená ošetřovacími dny klesala za posledních deset let asi o 1,5 % ročně, aniž by na to reagovala síť nebo lůžkový fond, a že řada nemocnic provozuje oddělení s obložností pod 50 % (MZ ČR, Koncepce 2025, s. 61 a 75).“

3. **Lůžka dlouhodobé péče (ř. 295–297, 904, 1124, 1497; D3).** Sjednotit zdroj 39 000 na jeden (dnes tři) a na ř. 295 vložit: „Pro zdravotní lůžka následné a dlouhodobé péče uvádí MZ, že už dnes chybí nejméně 2 až 3 tisíce a do roku 2035 bude potřeba dalších nejméně 8 tisíc; spodní hranice predikcí je asi 4 700 lůžek do let 2030 až 2035 (MZ ČR, Koncepce 2025, s. 65 a 66). Odhad 39 000 zahrnuje i pobytové sociální služby.“ Na ř. 1497 nahradit větu o „pětině potřeby“: „Přeměna 8 000 akutních lůžek řádově odpovídá zdravotní části potřeby, kterou odhaduje MZ. Zbytek potřeby leží v pobytových sociálních službách, a proto je podmínkou P3.“

4. **Sestry (ř. 269, 287, 590, 1483, 2362; H2).** Nahradit na ř. 269: „Ve zdravotnictví působí asi 83 tisíc sester, asi 3 tisíce chybí a přes 12 tisíc všeobecných sester je starších 60 let (MZ ČR, Koncepce 2025, s. 111). Jen nových všeobecných sester je za 10 až 12 let potřeba nejméně 24 000 úvazků. Vládní program pro nelékařské profese (přes 12,8 mld. Kč, 2026 až 2037) má na vysokých školách vychovat 11 078 všeobecných sester, 2 539 porodních asistentek a 1 547 dětských sester; vyšší odborné školy dalších asi 11 000 všeobecných sester (s. 113–114).“ Na ř. 117, 131 a 1481 nahradit „třetinu vysokoškolských absolventek“ za „asi čtvrtinu všeobecných sester, které podle MZ vyjdou z vysokých a vyšších odborných škol v letech 2026 až 2037“. Přepočítat vrchol 595 (ř. 1483) na stejný základ. Do rizika R1 doplnit, že bilance MZ chybí asi 2 tisíce všeobecných sester i bez reformy (náš dopočet ze s. 114).

5. **J1, Proč (ř. 540).** Doplnit: „Ministerstvo zdravotnictví v Koncepci 2025 označuje týmové praxe za první krok a jako další ohlašuje multidisciplinární praxe, tedy centra primární péče s přesahem do veřejného a komunitního duševního zdraví (MZ ČR, Koncepce 2025, s. 77 a 82). Standard týmu v J1 je tento druhý krok: dává mu sestry, další profese, pětiletou smlouvu a pravidla.“ Větu „zatím nemá definici“ změnit na „zatím nemá právní definici“.

6. **J6 (ř. 887).** Za výčet tří rolí doplnit: „Role odpovídají typologii MZ: specializované centrum = centrová nemocnice s urgentním příjmem a LPS, aspoň jedna v kraji; regionální nemocnice = akutní péče 24/7 bez center; okresní nemocnice = nemocnice bez urgentního příjmu nebo s následnou péčí a geriatrickou ambulancí (MZ ČR, Koncepce 2025, s. 69–70).“ Do J6 a P3 doplnit projekt KRAPL (s. 149) jako předstupeň krajského plánu.

7. **Fond přeměny (ř. 912).** Doplnit precedent: „Stejný princip už používá IROP: dotaci na následnou péči dostane jen poskytovatel, který zruší 20 akutních lůžek a zřídí 20 následných, převážně geriatrických (MZ ČR, Koncepce 2025, s. 148).“

8. **Kompetence sester a domácí péče (ř. 283, 1149; Pil5.1).** Ř. 283 zmírnit: „Kompetence sester se od roku 2022 rozšiřují (vyhl. 158/2022 Sb., vyhl. 324/2024 Sb., předepisování vybraných zdravotnických prostředků; MZ ČR, Koncepce 2025, s. 118–120), samostatnou práci v ordinaci ale dál brzdí úhrada a chybějící protokoly.“ Na ř. 1149 doplnit: „Od 1. 1. 2026 smí sestra se specializací v domácí péči indikaci upravit nebo doplnit, pokud to lékař umožní (s. 121); Pil5.1 z toho dělá samostatnou indikaci.“

9. **DRG (ř. 942, 1555; M3.3, M3.4).** Doplnit: „MZ uvádí, že jednotnou základní sazbou se v roce 2025 hradí přes 25 % akutní lůžkové péče proti 3,4 % v roce 2022, cílem je aspoň 30 %, a že úhradová vyhláška 2025 zúžila rizikový koridor o dalších 5 % (MZ ČR, Koncepce 2025, s. 74, 76 a 82). Podíl péče za jednotnou sazbou a rozpětí krajských sazeb 1 : 1,7 jsou dvě různé veličiny; studie sleduje obě.“

10. **P2 a rezidenční místa (ř. 718, 1495, 2356).** Ř. 718: „asi 80“ změnit na „70 v letech 2024 a 2025 (80 v roce 2023)“. K P2 doplnit: „Ministerstvo podpořilo ve všeobecném praktickém lékařství 150, 140 a 140 rezidenčních míst v letech 2023 až 2025 (s. 97). Předpoklad +50 atestací ročně od roku 2033 vyžaduje počet míst zvýšit, ne udržet. Absolventů lékařských fakult přitom přibývá o víc než 300 ročně (s. 97).“

11. **eRecept a eŽádanka (ř. 769, 680, 773).** Na ř. 769 doplnit zdroj „(MZ ČR, Koncepce 2025, s. 91)“. K J5 doplnit: „Podle MZ má eŽádanka podpořit monitoring objednacích dob a později zveřejnění čekacích lhůt; první fáze ale pokrývá jen laboratorní a obrazová vyšetření (s. 140). Triážní údaj pro vyšetření u ambulantních specialistů proto vyžaduje rozšíření eŽádanky za tuto první fázi.“ K pravidlu 8 cesty pacienta (ř. 503) doplnit oporu: „MZ chce, aby pojišťovny pacientům důsledně hledaly lékaře a sledovaly čekací doby (s. 76).“

12. **Pilíř 4, screening (ř. 340, 1109; D5, D6).** Doplnit: „Screeningové programy koordinuje Národní screeningové centrum, které vláda schválila v květnu 2025 (MZ ČR, Koncepce 2025, s. 35). Účast na kolonoskopii po pozitivním testu je podle MZ jen 60 až 70 % (s. 36). Pilot navigace (Pil4.8) proto stavíme na koordinátorech screeningových programů a krajských koordinátorech NSC (s. 44–45).“ U D6 doplnit: „Od roku 2026 se cílová skupina má změnit na 45 až 75 let (s. 40); výchozí hodnotu je třeba přepočítat.“

13. **Brief 1, brief 4 a P5 (ř. 2166–2171, 2251).** Doplnit: „Na hodnocení kvality už od 19. 1. 2023 pracuje NIKEZ, společné pracoviště MZ a ÚZIS; mezi jeho cíle patří indikátory kvality, HSPA, predikce personálních kapacit a hodnocení programů prevence (MZ ČR, Koncepce 2025, s. 53 a 58). Metodiku hodnocení organizačních modelů (M1.1) a rámec HSPA (P5) navrhujeme vést v NIKEZ. Navíc přinášíme nezávislost hodnocení na ministerstvu a zákonné ukotvení.“

14. **Brief 2, M2.3 a Část VI (ř. 2194, 1547).** Výslovně uvést odchylku: „Koncepce MZ 2025 fondy prevence pojišťoven posiluje a chce z nich individuální bonusy (s. 76 a 78). Studie je navrhuje přeměnit na fondy rozšířené péče, protože prevenci financuje Národní fond prevence s evaluací a bonusy pojištěncům mají podle studie nejistý účinek. Jde o vědomou odchylku od směru MZ.“ Pokud resortní tým odchylku nechce, M2.3 vypustit.

15. **P1, personální bilance (ř. 2494).** Doplnit: „Bilanci po krajích postavíme na plánovacích modelech MZ z projektu JA HEROES a na cíli MZ zřídit Národní centrum pro plánování a forecasting zdravotnických pracovníků (MZ ČR, Koncepce 2025, s. 113); predikce personálních kapacit je i cílem NIKEZ (s. 58).“ Do Části VI doplnit, že vládní reforma hygienické služby převzala záměr Koncepce (s. 26) a centralizace onkochirurgie navazuje na řízenou koncentraci péče od roku 2023 (s. 77, 82).

Mimo těchto 15 bodů sjednotit vedlejší nálezy z části A (alkohol, atestace, lékaři 55+).

### E2. Web (8 bodů)

Všude psát „Koncepce Ministerstva zdravotnictví 2025“, ne „vládní Koncepce“. Zdroj zkráceně: „MZ ČR, Koncepce 2025, s. X“.

1. **KEY_NUMBERS, položka „8 000 lůžek“, pole `note`.** Doplnit: „Ministerstvo zdravotnictví odhaduje, že do roku 2035 bude potřeba nejméně 8 tisíc lůžek následné a dlouhodobé péče navíc (MZ ČR, Koncepce 2025, s. 65).“

2. **BEDS, pole `source`.** Doplnit: „Produkce akutní lůžkové péče klesá asi o 1,5 % ročně a řada nemocnic má oddělení s obložností pod 50 % (MZ ČR, Koncepce 2025, s. 61 a 75).“

3. **NURSES.** `title`: „Sester chybí už dnes: jen všeobecných sester je do 12 let potřeba nejméně 24 000 nových úvazků“. `source`: „MZ ČR, Koncepce 2025, s. 111 a 114. Ve zdravotnictví pracuje asi 83 tisíc sester, 3 tisíce chybí, přes 12 tisíc je starších 60 let.“ Řádek „Kolik sester ročně odchází…“ změnit na 2 000 (24 000 / 12, náš dopočet). Řádek „Kolik jich ročně vystuduje: 1 300“ ponechat až po vyjasnění; podle MZ je to dnes 680 z VŠ a 570 z VOŠ (s. 112).

4. **TEN_NUMBERS „440 sester ročně“ a FAQ „Kde vezmete sestry?“.** Nahradit „zhruba třetina sester, které ročně vystudují vysokou školu“ za „asi čtvrtina všeobecných sester, které podle ministerstva vyjdou ze škol v letech 2026 až 2037“. Ve FAQ nahradit „přes 30 000 úvazků do roku 2037“ za „jen všeobecných sester nejméně 24 000 úvazků (MZ ČR, Koncepce 2025, s. 114)“.

5. **PREVENTION_FACTS.** U „31 %“ doplnit „Ministerstvo uvádí asi 30 % (MZ ČR, Koncepce 2025, s. 36)“. Přidat fakt: `{ value: "60 až 70 %", label: "lidí s pozitivním testem na krev ve stolici dojde na kolonoskopii (MZ ČR, Koncepce 2025, s. 36)." }`. U mamografie sjednotit věkovou skupinu (OECD 50–69, nebo MZ 45–69 se s. 36).

6. **PROBLEM_FACTS.** Přidat: `{ value: "68 %", label: "seniorů nad 65 let má aspoň jednu vážnou chronickou nemoc. Diabetiků je přes milion (MZ ČR, Koncepce 2025, s. 20 a 22)." }`

7. **FIVE_CHANGES n = 1, pole `what` nebo `brings`.** Přidat větu: „Ministerstvo zdravotnictví v Koncepci 2025 označuje týmové praxe za první krok a centra primární péče za další (s. 77). Jde stejným směrem; my přidáváme sestry, smlouvu na pět let a pravidla.“ Obdobně u n = 3: „Stejným směrem jde i Koncepce MZ 2025: méně akutních lůžek, víc následné péče (s. 61 a 66). Evropské peníze z IROP už dnes dostane jen nemocnice, která zruší 20 akutních lůžek a zřídí 20 následných (s. 148).“ U n = 4 větu „stejným směrem“ **nepřidávat**: Koncepce daně nenavrhuje.

8. **PATIENT_JOURNEY, krok „Vracím se z nemocnice“, pole `today`.** Upřesnit: „Domácí péči předepíše praktik na tři měsíce, jiný lékař jen na 14 dnů. Sestra ji od roku 2026 smí jen upravit, pokud to lékař dovolí.“ (MZ ČR, Koncepce 2025, s. 121). Volitelně přidat do GLOSSARY heslo „Koncepce MZ 2025: resortní dokument Ministerstva zdravotnictví z 1. 8. 2025, který popisuje potřeby a cíle zdravotnictví a hodnotí jejich plnění.“

---

## F. Příloha: 15 čísel z Koncepce pro web

Čísla, která studie ani web dnes nemají, nebo je mají bez zdroje. Zdroj vždy „MZ ČR, Koncepce 2025, s. X“.

| # | Číslo | Co znamená | Rok | Strana | Kam na webu |
| --- | --- | --- | --- | --- | --- |
| 1 | −1,5 % ročně | pokles produkce akutní lůžkové péče (ošetřovací dny) | posledních 10 let | 61 | BEDS |
| 2 | pod 50 % | obložnost oddělení v „řadě nemocnic“ | 2025 | 75 | BEDS, GLOSSARY „Obložnost“ |
| 3 | 2–3 tisíce a dalších 8 tisíc | chybějící lůžka následné a dlouhodobé péče dnes a potřeba do 2035 | 2025 | 65 | KEY_NUMBERS, FAQ „Rušíte nemocnice?“ |
| 4 | 20 za 20 | IROP podmínka: zrušit 20 akutních a zřídit 20 následných lůžek | 2021–2027 | 148 | FIVE_CHANGES n = 3 |
| 5 | 12,3 mld. Kč | vyhlášené výzvy IROP do zdravotnictví (9,5 mld. EU + 2,7 mld. národní) | k 31. 7. 2025 | 150 | VARIANTS `note` nebo Investice |
| 6 | 68 % | senioři 65+ s aspoň jednou vážnou chronickou nemocí (EHES 2019) | 2019 | 20 | PROBLEM_FACTS |
| 7 | přes 1 milion | lidí s diabetem | 2025 | 22 | PROBLEM_FACTS |
| 8 | 3,4 % → přes 25 % | podíl akutní lůžkové péče hrazené jednotnou základní sazbou | 2022 → 2025 | 74, 76 | FAQ nebo sekce Peníze |
| 9 | 83 tisíc, 3 tisíce, přes 12 tisíc | sestry ve zdravotnictví, chybějící sestry, všeobecné sestry nad 60 let | 2025 | 111 | NURSES |
| 10 | 24 000 úvazků | potřeba nových všeobecných sester za 10–12 let | 2025 | 114 | NURSES, FAQ |
| 11 | 140 a 70 | rezidenční místa ve všeobecném praktickém lékařství a pediatrii ročně | 2024, 2025 | 97 | STAKEHOLDERS „Praktičtí lékaři“ |
| 12 | 60 až 70 % | účast na kolonoskopii po pozitivním TOKS | 2025 | 36 | PREVENTION_FACTS |
| 13 | 86 milionů | vystavených eReceptů | 2024 | 91 | sekce o technologiích, pokud vznikne |
| 14 | 2 211 → 4 145 → 3 808 | hlášení přerušení dodávek léků SÚKL za rok | 2019, 2023, 2024 | 84 | jen s vysvětlením, že jde o počet hlášení za rok, ne o aktivní výpadky |
| 15 | 12 % proti 20 % | podíl státního rozpočtu na VaV pro zdravotnický výzkum (ČR) proti Rakousku; cíl ČR 20 % v roce 2030 | 2020; cíl 2030 | 155, 166 | brief „Světový klinický výzkum“, pokud se dostane na web |

Pro texty, které nejsou čísla, se hodí dvě citace:

- „Řada občanů ČR nemá svého praktického lékaře. Proto není možné nastavit standardní fungování systému tak, jak je to např. v Dánsku, Rakousku, Německu“ (s. 95).
- „Týmové praxe jsou ale jen prvním krokem reformy organizace primární péče“ (s. 77).
