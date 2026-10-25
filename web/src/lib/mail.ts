import "server-only";

/**
 * Odesílání e-mailů přes Resend (HTTP API, bez knihovny).
 * Bez RESEND_API_KEY se nic neposílá a funkce vrátí false; volající s tím počítá
 * (připomínka se uloží i bez potvrzení).
 */
const FROM = process.env.MAIL_FROM ?? "Zdraví blíž lidem <pripominky@josefpavlovic.cz>";

export async function sendMail(msg: { to: string; subject: string; text: string; html?: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("mail: RESEND_API_KEY není nastaven, e-mail se neodesílá");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [msg.to],
        subject: msg.subject,
        text: msg.text,
        ...(msg.html ? { html: msg.html } : {}),
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("mail: Resend odpověděl", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("mail: odeslání selhalo", e);
    return false;
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}

const SIGN = "Zdraví blíž lidem";

const pocet = (n: number) => (n === 1 ? "jednu připomínku" : n >= 2 && n <= 4 ? `${n} připomínky` : `${n} připomínek`);

/**
 * Žádost o potvrzení veřejné připomínky. Do fronty týmu se připomínka dostane až po
 * kliknutí na odkaz; nepotvrzená se po {days} dnech smaže.
 */
export function commentVerification(p: { name: string; id: number; body: string; quote?: string | null; confirmUrl: string; studyUrl: string; versionLabel: string; days: number; privacyUrl: string }) {
  const subject = `Potvrďte prosím svou připomínku ke studii Zdraví blíž lidem (č. ${p.id})`;
  const quoteText = p.quote ? `\nK místu: „${p.quote}“\n` : "\n";
  const text = `Dobrý den,

děkujeme za připomínku ke konzultační verzi studie Zdraví blíž lidem (${p.versionLabel}). Evidujeme ji pod číslem ${p.id}.

Potvrďte ji prosím na této adrese, jinak ji tým neuvidí:
${p.confirmUrl}

Odkaz platí ${p.days} dní. Pokud jste připomínku neposílali vy, nic nedělejte: nepotvrzenou připomínku i s e-mailem smažeme.
${quoteText}
Vaše připomínka:
${p.body}

Co bude dál: resortní tým prochází připomínky po částech studie. Připomínky odborných organizací vyřizujeme přednostně, připomínky veřejnosti po nich. Když budeme potřebovat upřesnění, ozveme se na tento e-mail. Vaše jméno ani e-mail nikde nezveřejňujeme; ve veřejném vypořádání uvádíme jen názvy organizací.

Jak s údaji zacházíme a jak si je stáhnout nebo smazat: ${p.privacyUrl}
Studie: ${p.studyUrl}

${SIGN}
`;
  const html = `<p>Dobrý den,</p>
<p>děkujeme za připomínku ke konzultační verzi studie <strong>Zdraví blíž lidem</strong> (${esc(p.versionLabel)}). Evidujeme ji pod číslem <strong>${p.id}</strong>.</p>
<p><strong>Potvrďte ji prosím, jinak ji tým neuvidí:</strong></p>
<p><a href="${esc(p.confirmUrl)}" style="display:inline-block;background:#9a5a12;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Potvrdit připomínku</a></p>
<p style="color:#52594F">Odkaz platí ${p.days} dní. Pokud jste připomínku neposílali vy, nic nedělejte: nepotvrzenou připomínku i s e-mailem smažeme.</p>
${p.quote ? `<p style="color:#52594F">K místu: <em>„${esc(p.quote)}“</em></p>` : ""}
<p><strong>Vaše připomínka:</strong></p>
<blockquote style="border-left:3px solid #CFC5B3;margin:0;padding:4px 12px;white-space:pre-wrap">${esc(p.body)}</blockquote>
<p><strong>Co bude dál.</strong> Resortní tým prochází připomínky po částech studie. Připomínky odborných organizací vyřizujeme přednostně, připomínky veřejnosti po nich. Když budeme potřebovat upřesnění, ozveme se na tento e-mail. Vaše jméno ani e-mail nikde nezveřejňujeme; ve veřejném vypořádání uvádíme jen názvy organizací.</p>
<p><a href="${esc(p.privacyUrl)}">Jak s údaji zacházíme a jak si je stáhnout nebo smazat</a> · <a href="${esc(p.studyUrl)}">Studie</a></p>
<p>${SIGN}</p>`;
  return { subject, text, html };
}

/** Odkaz na vlastní údaje (náhled, stažení, výmaz). */
export function dataAccessMail(p: { url: string; hours: number; count: number }) {
  const subject = "Vaše údaje u konzultace studie Zdraví blíž lidem";
  const text = `Dobrý den,

o odkaz na své údaje jste požádali na webu studie Zdraví blíž lidem. Evidujeme od vás ${pocet(p.count)}.

Na této adrese si údaje prohlédnete, stáhnete a můžete je smazat:
${p.url}

Odkaz platí ${p.hours} hodin. Pokud jste o něj nežádali, e-mail ignorujte; bez odkazu se k údajům nikdo nedostane.

${SIGN}
`;
  const html = `<p>Dobrý den,</p>
<p>o odkaz na své údaje jste požádali na webu studie Zdraví blíž lidem. Evidujeme od vás ${pocet(p.count)}.</p>
<p><a href="${esc(p.url)}" style="display:inline-block;background:#1f4a3d;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Zobrazit moje údaje</a></p>
<p style="color:#52594F">Odkaz platí ${p.hours} hodin. Pokud jste o něj nežádali, e-mail ignorujte; bez odkazu se k údajům nikdo nedostane.</p>
<p>${SIGN}</p>`;
  return { subject, text, html };
}
