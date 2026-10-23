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

/** Potvrzení veřejné připomínky ke studii. */
export function commentConfirmation(p: { name: string; id: number; body: string; quote?: string | null; studyUrl: string; versionLabel: string }) {
  const subject = `Vaše připomínka ke studii Zdraví blíž lidem (č. ${p.id})`;
  const quoteText = p.quote ? `\nK místu: „${p.quote}“\n` : "\n";
  const text = `Dobrý den,

děkujeme za připomínku ke konzultační verzi studie Zdraví blíž lidem (${p.versionLabel}). Evidujeme ji pod číslem ${p.id}.
${quoteText}
Vaše připomínka:
${p.body}

Co bude dál: resortní tým prochází připomínky po částech studie. Připomínky odborných organizací vyřizujeme přednostně, připomínky veřejnosti po nich. Když budeme potřebovat upřesnění, ozveme se na tento e-mail. Vaše jméno ani e-mail nikde nezveřejňujeme; ve veřejném vypořádání uvádíme jen názvy organizací.

Studie: ${p.studyUrl}

Zdraví blíž lidem
`;
  const html = `<p>Dobrý den,</p>
<p>děkujeme za připomínku ke konzultační verzi studie <strong>Zdraví blíž lidem</strong> (${esc(p.versionLabel)}). Evidujeme ji pod číslem <strong>${p.id}</strong>.</p>
${p.quote ? `<p style="color:#52594F">K místu: <em>„${esc(p.quote)}“</em></p>` : ""}
<p><strong>Vaše připomínka:</strong></p>
<blockquote style="border-left:3px solid #CFC5B3;margin:0;padding:4px 12px;white-space:pre-wrap">${esc(p.body)}</blockquote>
<p><strong>Co bude dál.</strong> Resortní tým prochází připomínky po částech studie. Připomínky odborných organizací vyřizujeme přednostně, připomínky veřejnosti po nich. Když budeme potřebovat upřesnění, ozveme se na tento e-mail. Vaše jméno ani e-mail nikde nezveřejňujeme; ve veřejném vypořádání uvádíme jen názvy organizací.</p>
<p>Studie: <a href="${esc(p.studyUrl)}">${esc(p.studyUrl)}</a></p>
<p>Zdraví blíž lidem</p>`;
  return { subject, text, html };
}
