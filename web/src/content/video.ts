/**
 * Vysvětlující video na úvodní stránce: komentář po odstavcích a větách. Věty jsou zároveň
 * titulky (čísla číslicemi, komentář je čte slovy) a textová verze pod videem. Video
 * a titulky vyrábí scripts/render-video.ts; každý odstavec je jedna scéna ve video/sceny.html.
 */
export const VIDEO = {
  src: "/video/vysvetleni.mp4",
  captions: "/video/vysvetleni.vtt",
  poster: "/video/vysvetleni.jpg",
  /** Délka v sekundách, jak ji vypíše render. */
  seconds: 87,
  voice: "Komentář namluvil syntetický hlas Aneta (ElevenLabs).",
  paragraphs: [
    ["Lidí nad 85 let je u nás dnes 200 tisíc.", "V roce 2050 jich bude přes půl milionu.", "To není názor.", "Ti lidé už se narodili."],
    ["Přitom ze 100 Kč, které pojišťovny zaplatí, jde skoro 30 na akutní lůžka v nemocnicích.", "A praktikům pro dospělé jen něco přes 4 koruny."],
    ["Studie Zdraví blíž lidem navrhuje, jak to změnit.", "Každý člověk má mít svého lékaře a svou sestru blízko domova."],
    ["Praktici se mohou spojit do týmů s víc sestrami.", "Sestra přijede i domů a obec zajistí odvoz k lékaři."],
    ["Ke specialistovi se půjde podle toho, jak to spěchá.", "Lékař zaškrtne: do 2 týdnů, do 6 týdnů, nebo plánovaně.", "A pojišťovna za termín ručí."],
    ["Nemocnice se neruší, mění se.", "Okresní nemocnice dostane jistou roli blízko domova: doléčení, rehabilitaci a jednodenní chirurgii."],
    [
      "Prevence dostane stálé peníze z daní z tichého vína a slazených nápojů.",
      "A v každém okrese bude mobilní paliativní tým, aby člověk mohl prožít konec života doma, když si to přeje.",
    ],
    ["Všechno po krocích.", "Nejdřív zkouška ve třech regionech a rozhoduje se podle dat."],
    ["Studie je ke konzultaci, ne hotová.", "Přečtěte si ji a napište nám, co je špatně, přímo k odstavci.", "Na zdraviblizlidem.cz"],
  ],
} as const;
