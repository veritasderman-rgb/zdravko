# Manifest reformy (13 oblastí) a studie „Zdraví blíž lidem“ v3

> Studie z Manifestu vychází a je jeho rozpracováním do opatření, termínů a peněz. Tento dokument neslouží k hledání rozdílů, ale k evidenci toho, co z Manifestu je už rozpracované do kroků a co zbývá doplnit v dalších verzích.

Přehled pro redakci a resortní tým: co Manifest z 7. 5. 2026 slibuje, kam to ve studii v3 patří, kdy to začíná a co zbývá rozpracovat. Na webu stejný obsah stojí na stránce `/plan`, data jsou v `web/src/content/manifest.ts`. Opatření jsou označena kódy z registru (`registr.json`): J = jádro, P = podmínka, Pil = doplněk pilíře, M = doprovod (oblasti 1 až 10 Části XI).

**Jak číst termíny.** Manifest počítá „Rok 1“ od nástupu vlády. Ve studii je Rok 1 = 2030 (základní scénář „Vláda 2030“), Rok 5 = 2034. Termíny v tabulce jsou termíny studie.

**Pořadí oblastí.** Číslování oblastí Manifestu (1 až 13) není totéž co číslování oblastí v Části XI studie (1 až 10). Oblasti Manifestu 6, 8 a 10 jsou ve studii jádro; zbývajících deset odpovídá oblastem studie takto: 1→1, 2→2, 3→3, 4→4, 5→5, 7→6, 9→7, 11→8, 12→9, 13→10.

## Přehled třinácti oblastí

| Oblast Manifestu | Vrstva ve studii | Opatření (kódy) | První krok a termín | Co zbývá rozpracovat |
| --- | --- | --- | --- | --- |
| 1. Více muziky za peníze | doprovod (oblast 1) | M1.1–M1.4, J1, Pil2.2 | Metodika hodnocení modelů péče pod ÚZIS, 2027 (M1.1); platba týmům za funkce v pilotu 2028 (J1) | Bonus 5–15 % k DRG vázaný na výsledek studie nemá; platí za funkce a odměnu za výsledky stropuje |
| 2. Volba bez úplatků | doprovod (oblast 2) | M2.1–M2.4, J5, M3.1, M4.2 | Čekání a naléhavost v eŽádance, dobrovolně od 2027 (J5); zákon o rozšířené péči účinný 1. 1. 2032 (M2.1) | Trestnost neformálních plateb a hrazený druhý názor studie neřeší; garanci specialisty do 30 dnů nahrazují lhůty podle naléhavosti (2 a 6 týdnů) |
| 3. Zdravotnictví ve službách pojištěnců | doprovod (oblast 3) | M3.1–M3.4, J5, Pil3.3, Pil4.8, Pil5.3 | Evidence plnění nároku v pilotu 2028 (M3.1); pozměňovací návrh ke správě pojišťoven 2027 (M3.2) | Povinné hlášení pacientských incidentů studie nemá; navigátor je užší (po pozitivním screeningu, pilot, a koordinátor plánu péče) |
| 4. Transparence | doprovod (oblast 4) | M4.1–M4.4, P5, Pil3.3 | Otevřená data a informace pro pacienta od 2027 bez zákona (M4.1, M4.2); HSPA v zákoně od 1. 1. 2033 (P5) | Shodujeme se; zákonná povinnost přichází později než v Manifestu (Rok 1 = 2030) |
| 5. Dostupné léky | doprovod (oblast 5) | M5.1–M5.4 | Seznam základních léků a srovnávač doplatků lze zavést bez zákona (M5.1, M5.2); zákon 2032–2033 | Emergency Stock 500+ léčiv jde dál než seznam M5.1; u léků na vzácná onemocnění studie nezavádí strop na pacienta (fond FRP) |
| 6. Zdravotně sociální pomezí | **jádro** (Pilíř 5, P3, J4, J7) | J4, J7, P3, Pil5.1–Pil5.7, M9.4 | Návštěvní služba a senior taxi v pilotu 2028 (J4); věcný záměr sociálního účtu do konce 2029 (P3) | Mezirezortní zákon chce Manifest v roce 1 (2030), studie sociální účet s účinností 1. 1. 2034; rodina v nemocnici „bez výjimek“ vs. výchozí pravidlo s odůvodněnými výjimkami |
| 7. Světový klinický výzkum | doprovod (oblast 6) | M6.1–M6.4 | Podnět k programu AZV v F0 (2027–2028), první výzva 2031 (M6.1, M6.2) | Centrální etická komise, biobanka a provedení evropského nařízení o klinických hodnoceních studie neřeší |
| 8. Prevence jako standard | **jádro** (Pilíř 4, J8, J9, P4, J1) | J8, J9, P4, Pil4.1–Pil4.10, J1 | Daň z vína a valorizace daní z lihu a piva platí od 1. 1. 2031 (J8); Národní fond prevence od 1. 1. 2031 (P4) | Cíl prevence ≥ 5 % výdajů vs. pevná částka (2 + 1,3 mld. Kč); dentální hygiena zúžena na lak a zalití rýh; zdanění tabáku a pozvánky na všechny screeningy studie nemá |
| 9. Reforma stomatologie | doprovod (oblast 7) | M7.1–M7.5, Pil4.6 | Podněty k úhradám zubařů do 30. 6. 2027 (M7.1, M7.2); zubní prevence do 18 let od 1. 1. 2032 (Pil4.6) | Konec amalgámu, bonus zubařům za prevenci a pokuty pojišťoven za nedostupného zubaře studie nemá; hygiena zúžena |
| 10. Data a informace ve službách pacienta | **jádro** (Pilíř 3, J5) | J5, Pil3.1, Pil3.2, Pil3.3, M4.1, M4.2 | Data o čekání a o lidech bez praktika dobrovolně od 2027 (J5); pilot dálkového sledování 2028 (Pil3.1); portál pacienta do dvou let od nástupu vlády (Pil3.3) | Jednotné standardy (FHIR) studie nezmiňuje; navazuje na portál z ledna 2026 a evropský prostor pro zdravotní data |
| 11. Vzdělání a podmínky personálu | doprovod (oblast 8) | M8.1–M8.5, J2, P1, P2, Pil5.1 | Podnět k rezidenčním místům do rozpočtu 2028 (P2); kurzy sester s pilotem od 2028 (M8.3); závazně od 2031 | Navýšení kapacit lékařských fakult, regionální bonusy a 15letý plán personálu studie nemá; sesterská indikace až 2032, sestra s rozšířenou praxí 2033 (Manifest: Rok 1 a 3) |
| 12. Práva pacientů | doprovod (oblast 9) | M9.1–M9.5 | Dříve vyslovené přání jako poslanecký návrh 2028–2029 (M9.5); zdravotnický ombudsman od 1. 1. 2032 (M9.1) | Hlášení incidentů, mediace a odškodnění bez viny studie nemá; nemocniční ombudsman (zák. 290/2025 Sb.) už platí |
| 13. Dostupná péče o duševní zdraví | doprovod (oblast 10) | M10.1–M10.5, J1 | Roční mapa center duševního zdraví od 2027 (M10.5); psycholog v týmu v pilotu 2028 (M10.1, J1) | Zákon o psychoterapii chce Manifest v roce 1 (2030), studie novelami s účinností 1. 1. 2034 (M10.3); dětská psychiatrie jen přes rezidenční místa |

## Nástroje, kterými studie Manifest naplňuje

Tyto věci Manifest výslovně neřeší nebo jen naznačuje a bez nich by se jeho cíle nedaly uskutečnit:

- **Týmy primární péče s pětiletou smlouvou (J1 až J4)**: dobrovolné týmy lékařů a sester pro 10 až 25 tisíc lidí, platba za funkce, sestry v týmu, návštěvní služba a senior taxi. Doplňují je dětské týmy, večerní a víkendové ordinace, výkup praxí a dotace na centra (Pil1.1–Pil1.5). Kolem 2038 asi 520 týmů a 4 000 sester navíc.
- **Krajský plán sítě lůžkové péče (J6, J7)**: desetiletý plán, čtyři skupiny lůžek, fond přeměny a podmínka, že akutní lůžko se mění až po doložené kapacitě doléčení a dojezdu záchranky (Pil2.1–Pil2.5). Asi 8 000 lůžek mění účel do roku 2038.
- **Nový vzorec platby státu (J10)**: zdroj peněz pro reformu, asi 180 Kč měsíčně navíc za státního pojištěnce; 100 Kč měsíčně = 7,2 mld. Kč ročně.
- **Personální bilance po krajích a rezidenční místa (P1, P2)**: personál jako podmínka, ne přání; měření obsazení míst sester v bráně B3 (12/2031).
- **Čtyři kontrolní body (B1 až B4) a tři varianty (A, B, C)**: rozhodování podle čísel (pokračovat, upravit, zmenšit) a varianta, která se použije, když chybí sestry.
- **Ukazatele reformy (H1–H8)** a nezávislé hodnocení ÚZIS s univerzitou; pilotní týmy se vyhodnocují jako studie s kontrolní skupinou (M6.4).
- **Daňové jádro prevence (J8, J9, P4)** s pevným zákonným příjmem Národního fondu prevence, aby se výnos nerozpustil v rozpočtu.

## Kde studie zatím rozpracovala jen část

| Manifest | Studie v3 | Důvod ve studii |
| --- | --- | --- |
| Hrazená dentální hygiena do 18 let | Fluoridový lak, zalití rýh prvních stálých stoliček a instruktáž; 0,3–0,5 mld. Kč ročně (Pil4.6) | První odhad 0,8–1,4 mld. Kč neměl doklady účinnosti; rutinní hygiena u dospělých bez doloženého přínosu |
| Bonus 5–15 % k DRG vázaný na výsledek | Platba týmům za funkce a odměna za výsledky se stropem (J1) | Nizozemské balíčkové platby za chroniky výdaje zvýšily |
| Garance specialisty do 30 dnů, druhý názor | Lhůty podle naléhavosti v eŽádance (2 týdny, 6 týdnů, plánované) a měření čekání (J5) | Bez triážního údaje nelze lhůtu garantovat ani kontrolovat |
| Navigátor pro vážné diagnózy | Navigace po pozitivním screeningu (pilot ve dvou krajích) a koordinátor plánu péče (Pil4.8, Pil5.3) | Doložený účinek je u dokončení kolonoskopie po pozitivním testu; pilot s vyhodnocením |
| Prevence ≥ 5 % zdravotních výdajů | Pevná částka: 2 mld. Kč z daní za zdraví a 1,3 mld. Kč prevence v týmech; cíl v procentech nestanoven (P4) | Pevná částka chrání prevenci před poklesem výnosu |
| Emergency Stock 500+ léčiv | Seznam základních léků se zajištěnou dostupností (M5.1) | Studie Emergency Stock neřeší; seznam základních léků lze zavést i bez zákona |
| Léky na vzácná onemocnění: fond a strop na pacienta | Společný rizikový fond pojišťoven, bez limitu na pacienta, nikdy ze sbírek (M5.4) | Zdroj fondu zbývá určit |
| Rodina v nemocnici „bez výjimek“ | Výchozí pravidlo; každé omezení musí mít konkrétní, zapsaný a přezkoumatelný důvod (M9.4) | Brief důvod výjimek nerozvádí; omezení musí být zapsané a přezkoumatelné |
| Přímá volba do rad všech pojišťoven (i VZP volená poslanci) | Jeden návrh správy pojišťoven jako pozměňovací návrh k reformě MZ; mimo jádro (M3.2) | Náklady voleb dosud nikdo nevyčíslil |
| Minimální cena alkoholu v Roce 1 | Zákon až s účinností 1. 1. 2034 (Pil4.1) | Nejdřív musí obstát daně; test přiměřenosti u evropského soudu |
| Zákony v Roce 1 až 2 (mezirezortní zákon, psychoterapie, ombudsman) | Účinnost 2032–2034 (P3, M10.3, M9.1) | Ministerstvo zvládne za volební období jen dvě velké předlohy a několik středních |
| Kompetence sester v Roce 1 | Samostatná indikace sestry 1. 1. 2032, sestra s rozšířenou praxí 1. 1. 2033 (J2) | Kompetence přibývají ve třech krocích: poradny podle protokolu, samostatná indikace, sestra v pokročilé praxi |

## Co z Manifestu zbývá rozpracovat

Souhrn bodů označených v `gaps` na stránce `/plan`. Ověřeno hledáním v textu studie v3 (20. 10. 2026).

1. **Oblast 1:** value-based bonus 5–15 % k platbě za případ (DRG).
2. **Oblast 2:** trestnost neformálních plateb a anonymní oznamovací kanál; hrazený druhý názor pro vážné diagnózy.
3. **Oblast 3:** povinné hlášení pacientských incidentů.
4. **Oblast 5:** Emergency Stock na 500 a více léčiv včetně pokut za nehlášený výpadek.
5. **Oblast 7:** centrální etická komise, národní biobanka, plné provedení evropského nařízení o klinických hodnoceních (CTR/CTIS).
6. **Oblast 8:** zdanění tabáku; centrální aktivní zvaní (opt-out) u všech populačních screeningů; cíl prevence v procentech výdajů.
7. **Oblast 9:** konec amalgámu (standardizace materiálů), bonus zubařům za prevenci, pokuty pojišťoven za nedostupného zubaře, screening dutiny ústní. Pozor: fotokompozitní výplň je dospělým hrazená od ledna 2026 (zák. 289/2025 Sb.), takže část tohoto bodu se časově předběhla.
8. **Oblast 10:** jednotné datové standardy (FHIR) a jejich zákonné ukotvení.
9. **Oblast 11:** navýšení kapacit lékařských fakult, regionální bonusy pro nedostatkové obory, 15leté plánování personálu.
10. **Oblast 12:** mediace sporů, odškodnění bez prokazování viny, pacientský advokát.
11. **Oblast 13:** samostatný zákon o psychoterapii v Roce 1, pilot Talking Therapies, plošná dostupnost dětské psychiatrie.

## Doporučení pro verzi 3.1 studie

1. **Rozhodnout o hlášení pacientských incidentů a o mediaci.** Manifest je chce a studie k nim mlčí. Stačí doplnit brief v oblasti 9 (Práva pacientů) o opatření s termínem a nástrojem, nebo vysvětlit, proč je nepřebíráme.
2. **Dopsat do oblasti 8 (Prevence) výslovné stanovisko k tabáku a k aktivnímu zvaní na screening.** Buď je přijmout (zákon o spotřebních daních, pozvánky přes pojišťovny a týmy), nebo vysvětlit, proč ne. Dnes čtenář Manifestu nenajde odpověď.
3. **Sjednat čísla mezi Manifestem a studií.** Výdaje na prevenci (Manifest 2,7 % proti OECD 3,4 %, studie 2,74 % proti 3,2 %), antidepresiva (67 proti 69,5 DDD v samotném Manifestu), kardiovaskulární úmrtnost (463 proti 463,75), účinnost zákona 290/2025 Sb. (Manifest 1. 7. 2026, studie 1. 1. 2026). Web dnes uvádí čísla z úvodu Manifestu (463) i z jeho podrobností (463,75); měla by být jedna řada.
4. **Přidat k oblastem doprovodu sloupec „co zveřejníme při prvním termínu“.** Řada opatření v Části XI má „datum neuvedeno“ (například M1.4, M5.2, M6.3, M7.4, M9.3, M9.4, M10.2); u každého uvést aspoň rok, nebo napsat, proč termín chybí.
5. **Rozhodnout, zda se hrazená zubní hygiena vrátí v širší podobě.** Pokud ano, doložit účinnost a náklad; pokud ne, vysvětlit zúžení čtenáři Manifestu na samostatném místě (dnes je jen v odstavci o ostatní prevenci).
6. **Vysvětlit časový posun zákonů.** Manifest slibuje řadu zákonů v Roce 1 až 2, studie je dává na 2032–2034. Jedna tabulka „Kdy Manifest, kdy studie, proč“ by předešla dojmu, že studie slib zpomaluje bez důvodu; důvod je kapacita ministerstva (dvě velké předlohy za období).
