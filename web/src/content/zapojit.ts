/**
 * Zapojení do konzultace: přihláška ke kulatým stolům a zpráva za organizaci.
 * Volby a kontrola vstupu jsou tady, aby je sdílel formulář, serverová akce i testy.
 * Kontakty jdou do Brevo až po potvrzení odkazem z e-mailu (src/app/zapojit-actions.ts).
 */
import { ROUND_TABLES } from "@/content/reforma";

export const TOPICS = ROUND_TABLES.map((t) => t.topic);

/** Kdo se hlásí. Volba je nepovinná; pomůže nám poskládat stůl tak, aby u něj byli všichni, koho se téma týká. */
export const ROLES = [
  "Praktický lékař pro dospělé",
  "Praktický lékař pro děti a dorost",
  "Sestra",
  "Jiný zdravotník",
  "Pacient nebo pečující",
  "Obec nebo kraj",
  "Zdravotní pojišťovna",
  "Nemocnice",
  "Sociální služby",
  "Výzkum nebo vzdělávání",
  "Novinář",
  "Jiné",
];

export const INTEREST = [
  { v: "informovat", l: "Dejte mi vědět, až bude termín", hint: "Pošleme pozvánku s místem a programem; pak se rozhodnete." },
  { v: "ucast", l: "Chci se zúčastnit", hint: "Počítáme s vámi a s pozvánkou se ozveme mezi prvními." },
  { v: "prispet", l: "Chci se zúčastnit a můžu přispět", hint: "Zkušeností z praxe, daty nebo krátkým vystoupením. Co přesně, napíšete do poznámky." },
] as const;

export const ORG_REQUESTS = [
  { v: "setkani", l: "Chceme se setkat a plán probrat", hint: "Domluvíme schůzku s autorem studie, osobně nebo online." },
  { v: "podpora", l: "Chceme plán podpořit", hint: "Celý, nebo jen některé části; napište které." },
  { v: "spoluprace", l: "Chceme spolupracovat na některé části", hint: "Pracovní skupina, podklady, data, ověření čísel." },
  { v: "kulate-stoly", l: "Pošleme zástupce na kulatý stůl", hint: "Až bude termín, ozveme se s pozvánkou." },
] as const;

export const LIMITS = { name: 120, org: 200, role: 120, note: 1500 };

/** Organizace, které plánu veřejně vyjádřily podporu a souhlasily se zveřejněním. Doplňuje tým ručně po ověření. */
export const SUPPORTERS: { name: string; url?: string; what?: string }[] = [];

export type RoundTableInput = { email: string; name: string; org: string; role: string; interest: string; topics: string[]; note: string; newsletter: boolean };
export type OrgInput = { email: string; name: string; org: string; role: string; requests: string[]; note: string; publish: boolean; newsletter: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /https?:\/\/|www\./gi;

function common(i: { email: string; name: string; note: string }): string | null {
  if (!EMAIL_RE.test(i.email)) return "Zadejte platný e-mail.";
  if (i.name.length < 2) return "Napište prosím jméno, ať víme, koho oslovit.";
  if ((i.note.match(URL_RE) ?? []).length > 3) return "Poznámka obsahuje příliš mnoho odkazů. Nechte prosím nejvýš tři.";
  return null;
}

/** První chyba přihlášky ke kulatým stolům, nebo null. */
export function roundTableError(i: RoundTableInput): string | null {
  if (!i.topics.length) return "Vyberte aspoň jedno téma kulatého stolu.";
  if (i.topics.some((t) => !TOPICS.includes(t))) return "Některé téma už v nabídce není. Obnovte prosím stránku.";
  if (!INTEREST.some((x) => x.v === i.interest)) return "Vyberte, jestli chcete jen zprávu o termínu, nebo se rovnou přihlásit.";
  if (i.role && !ROLES.includes(i.role)) return "Vyberte prosím roli z nabídky.";
  return common(i);
}

/** První chyba zprávy za organizaci, nebo null. */
export function orgError(i: OrgInput): string | null {
  if (i.org.length < 2) return "Napište prosím název organizace.";
  if (!i.requests.length) return "Vyberte, s čím se ozýváte.";
  if (i.requests.some((r) => !ORG_REQUESTS.some((x) => x.v === r))) return "Některá volba už v nabídce není. Obnovte prosím stránku.";
  return common(i);
}

export const interestLabel = (v: string) => INTEREST.find((x) => x.v === v)?.l ?? v;
export const requestLabel = (v: string) => ORG_REQUESTS.find((x) => x.v === v)?.l ?? v;
