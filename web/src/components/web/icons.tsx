/**
 * Jedna sada ikon (kap. 4): viewBox 24, tah 1,7 px, stroke="currentColor", vždy aria-hidden.
 * Ikona je pomocník u nadpisu nebo akce, nikdy dekorace. Barvu dědí z textu (text-forest apod.).
 * Soubor nemá "use client", takže ho mohou používat serverové i klientské komponenty.
 */

export type IconName =
  | "home"
  | "team"
  | "building"
  | "clock"
  | "hospital"
  | "leaf"
  | "arrow"
  | "chevron"
  | "menu"
  | "info"
  | "search"
  | "download"
  | "external"
  | "close";

// Ovládací glyfy (šipka, chevron, menu, zavřít) mají silnější tah, aby byly čitelné i malé.
const HEAVY: Partial<Record<IconName, number>> = { arrow: 2.3, chevron: 2.2, menu: 2.2, close: 2.2, download: 2.2, external: 2 };

function Shapes({ name }: { name: IconName }) {
  switch (name) {
    case "home":
      return (
        <>
          <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          <path d="M12 17.5s-3-1.8-3-4a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2.2-3 4-3 4z" />
        </>
      );
    case "team":
      return (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16 14.2c2.9.3 5 2.6 5 5.8" />
        </>
      );
    case "building":
      return (
        <>
          <path d="M4 21V8l8-4 8 4v13" />
          <path d="M9 21v-5h6v5M3 21h18" />
        </>
      );
    case "hospital":
      return (
        <>
          <path d="M4 21V8l8-4 8 4v13" />
          <path d="M9 21v-5h6v5M12 8v4M10 10h4" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l3 2M9 2h6" />
        </>
      );
    case "leaf":
      return (
        <>
          <path d="M5 19C5 11 11 5 20 5c0 9-6 15-14 15" />
          <path d="M5 19l7-7" />
        </>
      );
    case "arrow":
      return <path d="M5 12h14M13 6l6 6-6 6" />;
    case "chevron":
      return <path d="M6 9l6 6 6-6" />;
    case "menu":
      return <path d="M4 7h16M4 12h16M4 17h16" />;
    case "info":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6M12 7.5v.5" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-4.2-4.2" />
        </>
      );
    case "download":
      return <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />;
    case "external":
      return <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />;
    case "close":
      return <path d="M6 6l12 12M18 6L6 18" />;
  }
}

export function Icon({ name, size = 22, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={HEAVY[name] ?? 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <Shapes name={name} />
    </svg>
  );
}
