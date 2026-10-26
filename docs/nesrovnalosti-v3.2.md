# Sjednocení věcných nesrovnalostí ve verzi 3.2

Při jazykové úpravě studie (verze 3.2) se našla místa, kde si text odporoval nebo kde čísla nesouhlasila.
Dokument zaznamenává, jak jsme každé místo sjednotili a podle čeho. Platí pravidlo: kde má hodnotu HSPA Monitor
(skorezdravotnictvi.cz), přebíráme ji. Kde ji nemá, zvolili jsme jednu hodnotu nebo formulaci a použili ji
všude stejně, ve studii i na webu. Čísla řádků platí pro `01-studie-zdravi-bliz-lidem-v3.2.md`.

Věty „Ověřit:“, kódy opatření a zástupné řádky grafů zůstaly beze změny. Registr ověření HSPA
(`web/src/content/overeni-hspa.json`) je nově navázaný na verzi 3.2, registr opatření na webu
(`web/src/content/registr.json`) odpovídá Příloze A verze 3.2.

Zdroj rozhodnutí: **HSPA** = hodnota HSPA Monitoru; **primární** = primární zdroj citovaný ve studii;
**výpočet** = přepočet z tabulek studie; **sjednocení** = jedna z formulací, které už ve studii byly.

## Opravy z jazykové úpravy

| Kde | Rozhodnutí | Zdroj |
| --- | --- | --- |
| ř. 1174 (pilíř 4, krátká intervence) | „asi jedno pivo (půllitr)“ místo „dvě piva“; půllitr pětistupňového piva má asi 20 g alkoholu | výpočet |
| ř. 513 (varianty A a B) | „zaniklo 428 míst praktiků“ místo „v 428 obcích“ | primární (viz ř. 280) |

## Čísla a výpočty

| Kde | Co nesedělo | Rozhodnutí | Zdroj |
| --- | --- | --- | --- |
| ř. 19, 166, 304, 322, 1326 | „přes 30 000 úvazků“ proti „nejméně 24 000“ | Přes 30 000 úvazků platí pro všeobecné a dětské sestry a porodní asistentky dohromady, nejméně 24 000 jen pro všeobecné sestry. Všude je to napsané stejně. | HSPA (vládní program 2026–2037) |
| ř. 19, 304, 1326, 1563, 1565, 2091 | Absolventky ročně: 1 250, 1 750 a 1 840 | Dnes asi 1 750 plně kvalifikovaných všeobecných sester ročně (OECD 2024); asi 1 840 ročně je výhled vládního programu na roky 2026–2037 (22 000 za 12 let). Obě čísla zůstávají, vždy s tím, k čemu patří; 1 250 (680 + 570) z historie verzí vypadlo. | HSPA; primární |
| ř. 181, 1471 | Rozdíl A − B „3,8 mld. Kč“, investice „17 až 23 mld. Kč“ | 3,7 mld. Kč (21,5 − 17,8); 17 až 23 mld. Kč jsou investice do center, ne celkový rozdíl investic | výpočet |
| ř. 183 | Vyšší odhady výnosu daní „10 až 17 mld. Kč“ | 10 až 15 mld. Kč (cíl PEER a propočet HSPA Monitoru) | HSPA |
| ř. 17 | „přidává dvě opatření“, vyjmenovány tři okruhy | „opatření ve třech okruzích“ | sjednocení |
| ř. 2552, 2748 | Registr „89 řádků, 82 opatření“ | 93 řádků, 86 opatření a 7 odkazů (spočteno z tabulek Přílohy A) | výpočet |
| ř. 2880 | Síla důkazů „5 / 8 / 7“ dávala 20 tvrzení z 22 | 5 silně, 9 středně, 6 slabě, E13 slabá až střední, E5 smíšená | výpočet |
| ř. 2989 | „29 citací, 27 v PubMed“ | 32 citací, 30 v PubMed, 2 přes Consensus | výpočet |
| ř. 2713, 2757 | Otevřená ověření: 80, 93 a 83 odrážek | 80 platí pro verzi 3 k 21. 10. 2026; dnes 81 otevřených ověření. Dvě uzavřená (proočkovanost 65+, účinnost reformy hygienické služby) ze seznamu vypadla. | výpočet |
| ř. 1190, 1592, 2592 (P3) | „o 57 mld. Kč ročně“ a „228 mld. Kč za 114 tisíc lůžek“ | Náklad sociální péče o seniory bude v roce 2035 asi o 57 mld. Kč ročně vyšší než dnes. Investice: 35 tisíc nových pobytových míst po 2 mil. Kč, tedy asi 70 mld. Kč (Deloitte pro APSS ČR); dřívějších 100 až 175 mld. Kč vycházelo z jednotkové ceny verze 2 (3 až 5 mil. Kč) | primární, výpočet |
| ř. 1093 (J8) | Tiché víno s nulovou sazbou a „0,24 % inkasa“; zdražení 12–18 % | Inkaso 0,24 % patří vínu jako celku (zdaněné je jen šumivé); 12–18 % je zdražení bez DPH | primární |
| ř. 1124 | „růst o 5 % ročně je pomalejší než v letech 2024 až 2027“ | „růst o 5 % ročně nad inflaci je postupný a předem známý, bez skoků“ | sjednocení |
| ř. 342 | Schodek 14,9 proti 570,8 − 555,8 = 15,0 | Ponechán 14,9 mld. Kč podle pojistných plánů (HSPA potvrzuje), s poznámkou, že je počítán z nezaokrouhlených částek | HSPA |
| ř. 1803, 1807 | Institut HTA jako „třetí“ velká předloha | V tabulkách vln jsou tři velké předlohy (nová hlava zák. 372/2011 Sb., zákon o síti, zákon o pojištění dlouhodobé péče), HTA jako nový zákon by byl čtvrtou | výpočet |
| ř. 165, 1441 | Sestry na lékaře v roce 2050 | Bez rozporu: dvě sestry na lékaře kolem roku 2038, tři ve výhledu k roku 2050 | — |

## Termíny

| Kde | Co nesedělo | Rozhodnutí | Zdroj |
| --- | --- | --- | --- |
| ř. 218, 1635, 1671, 1888 a web | Podněty do dohodovacího řízení o úhradách 2028 jednou do 31. 1. 2027, jinde do 30. 6. 2027 | Podněty do 31. 1. 2027, dohoda do 30. 6. 2027. Podklady pro řízení jsou hotové do 31. 1. 2027 (dříve 31. 3. 2027, tedy po termínu podání). Na webu sjednoceny časové osy, harmonogram i registr opatření. | sjednocení (převažující znění) |
| ř. 1828 | Lhůta dohody „120 dnů před koncem roku“ | Ponecháno beze změny (je uvnitř věty „Ověřit“) | — |
| ř. 13 | „Kulaté stoly proběhnou v roce 2027“ | od února 2027 do června 2028 | sjednocení |
| ř. 982 | Zákon o síti ve vlně 2 | Vlna 3, stejně jako v tabulkách vln a v Příloze A | sjednocení |
| ř. 1902 | „Finanční a daňové změny jdou na 1. 1. 2031“ | Začínají platit 1. 1. 2031; daň ze slazených nápojů od 1. 1. 2032, plná sazba na víno od 1. 1. 2033 | sjednocení |
| ř. 23 | eŽádanka: první fáze „jen laboratorní a obrazová vyšetření“ | První fáze (zák. 236/2025 Sb.) pokrývá žádanky K, Z a FT, laboratorní přibydou později | HSPA |
| ř. 2038, 2128 | Řídicí výbor přechod branou „schvaluje“, jinde jen „doporučuje vládě“ | Výbor na doporučení hodnotitele schvaluje přechod branou a vládě doporučuje, co pokračuje, co se upraví a co se zmenší; roční zprávu projednává spolu se čtvrtletními údaji | sjednocení (ř. 2032 a tabulka B3) |
| Část XI, podklad 5; ř. 2380; M5.1, M5.3, M5.4 | „návrh 2032–2033“ proti „předložit po roce 2031, účinnost 2032–2033 (vlna 4)“ | Podle definice vlny 4: předložit 2032–2034, účinnost 2033 a později | sjednocení |
| Příloha A, Pil5.3 | „Podnět 1. 1. 2028“ | „Podnět do 31. 1. 2027, platí od 2028“, stejně jako Pil5.2 | sjednocení |
| ř. 1998, M6.4 | „nezávislé hodnocení asi 5 mil. Kč“ bez jednotky | asi 5 mil. Kč ročně, stejně jako pilot (30 až 50 mil. Kč ročně) | sjednocení |
| Část X, stupeň C; R4 | Stupeň C bez společného základu; R4 vede odmítnutí vzorce na B, tabulka stupňů na C | Stupeň C výslovně obsahuje prevenci, paliativní týmy, konzultace a fond přeměny (jako varianta C v Části V). R4: při odmítnutí vzorce stupeň B, a když sesterská složka nemá trvalé krytí, stupeň C. | sjednocení s Částí V |
| Pilíř 5, domácí péče | Vlna 1, nebo 2 | Bez rozporu: předložení 2030 spolu se zákonem o primární péči, účinnost 1. 1. 2032 je vlna 2 | — |
| Část VIII, F0 | F0 od 11/2026, verzi 3 schvaluje RT až 7. 12. 2026 | Bez rozporu: F0 začíná přípravou (schůzky RT 27. 10. a 9. 11. 2026), konzultace běží od prosince | — |
| Část VI | „reforma v. z. p. 2030“ s účinností 2028 | Ponecháno: je to název vládní předlohy (reforma veřejného zdravotního pojištění 2030), ne rok účinnosti | — |

## Tvrzení o důkazech

| Kde | Co nesedělo | Rozhodnutí | Zdroj |
| --- | --- | --- | --- |
| ř. 436, 2213, E15 | Madsen 2014: obložnost nad 85 % „zvyšuje úmrtnost o 9 %“ | „je spojena s o 9 % vyšší úmrtností“ (pozorovací studie); stejně i ve slovníku webu | primární |
| ř. 1029 | „obložnost kolem 70 % … je tedy bezpečná“ | „má proto od této hranice dostatečnou rezervu“ | primární |
| ř. 971, 981, E12 | Kozhimannil 2018 popsán dvakrát jinak a příčinně | Obě místa i tabulka: zánik venkovských porodnic v USA byl spojen s vyšším podílem porodů mimo nemocnici a předčasných porodů | primární |
| ř. 436, 1043 | „jedno úmrtí méně na tři zachovaná lůžka“ bez jednotky času | „jedno úmrtí ročně méně“; studie pracuje s roční úmrtností regionů (Siverskog a Henriksson 2022, PMID 36206659) | primární |
| ř. 2376 | 46,6 % lidí 65+ s pěti a více léky bez zdroje | SHARE, vlna 9 (2022); průměr zemí SHARE 36,2 % | HSPA |
| Pilíř 1 | Věk sester 48,2 (ÚZIS 2023) a 47,0 (NRZP 2022) | Bez rozporu: obě čísla mají ve studii uvedený zdroj a rok | — |

## Drobnosti

- ř. 2959 a 2978: „pohávka“ opravena na „pohotovost“.
- ř. 3033: „Strukturální reforma Česka v6“.
- Příloha C: citace jednotně bez tečky na konci.
- Studie Deloitte pro APSS ČR je všude citována jako „6/2026“.
- ř. 1268: „Tři větve kritické cesty“ místo „Obě větve“ (text vyjmenovává tři vazby).
- Část IV: „tři řetězce“ (graf kritické cesty) a „šest řetězců“ (oddíly „Proč…“) jsou dva různé pojmy; ponecháno.
- „Střet zájmů autora“ v jednotném čísle zůstává, jde o osobní prohlášení autora.
