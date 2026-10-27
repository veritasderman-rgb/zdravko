import QRCode from "qrcode";

/** QR kód adresy jako vložené SVG (vykreslí se na serveru, na stránku nejde žádný skript). */
export async function Qr({ url, className }: { url: string; className?: string }) {
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#143229", light: "#ffffff" } });
  return <div className={`qr ${className ?? ""}`} role="img" aria-label={`QR kód: ${url}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Krátká adresa pro tisk: bez protokolu a „www.“. */
export const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

/** Značka: kruh s domkem, stejná jako v hlavičce webu. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 38" aria-hidden="true" className={className}>
      <circle cx="19" cy="19" r="19" fill="#1F4A3D" />
      <path d="M10 20 L19 12 L28 20 M13 18 V27 H25 V18" fill="none" stroke="#F3EEE4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="22" r="2.4" fill="#F2D29B" />
    </svg>
  );
}

/** Rozměr tiskové strany pro PDF: stejný jako list, bez okrajů. */
export function PageSize({ size }: { size: string }) {
  return <style>{`@page { size: ${size}; margin: 0; }`}</style>;
}
