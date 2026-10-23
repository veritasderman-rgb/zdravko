/**
 * Dočasné ilustrace z návrhu směru B (zadání kap. 4), do dodání sady od ilustrátora.
 * Inline SVG, role="img" s popisem scény, škálují na šířku rodiče (width 100 %, height auto).
 * Styl: ploché barvy z palety, obrys #1C2321, různé tóny pleti, žádný text v obrázku.
 */

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/** Sestra z týmu na návštěvě u seniorky doma, za oknem obecní centrum. crop → výřez pro mobil. */
export function HomeVisit({ className, crop = false }: { className?: string; crop?: boolean }) {
  return (
    <svg
      viewBox={crop ? "30 130 460 430" : "0 0 520 560"}
      className={cx("block h-auto w-full", className)}
      role="img"
      aria-label="Sestra z týmu na návštěvě u seniorky doma; seniorka sedí v křesle a drží sestru za ruku, za oknem je vidět obecní zdravotní centrum"
    >
      <path d="M30 560 V250 A230 230 0 0 1 490 250 V560 Z" fill="#DCE8E0" />
      <path d="M30 470 H490 V560 H30 Z" fill="#E6D8C0" />
      <ellipse cx="250" cy="500" rx="170" ry="24" fill="#D9C3A0" />
      <rect x="320" y="140" width="130" height="160" rx="4" fill="#F7F1E6" stroke="#1C2321" strokeWidth="2.5" />
      <circle cx="350" cy="174" r="14" fill="#F2D29B" />
      <path d="M322 262 Q360 238 400 252 T448 246 V298 H322 Z" fill="#A9C4B5" />
      <rect x="392" y="230" width="40" height="28" fill="#FBF8F2" stroke="#1C2321" strokeWidth="1.5" />
      <rect x="388" y="224" width="48" height="7" fill="#1F4A3D" />
      <path d="M385 140 V300 M320 204 H450" stroke="#1C2321" strokeWidth="2.5" />
      <rect x="312" y="298" width="146" height="10" rx="2" fill="#FBF8F2" stroke="#1C2321" strokeWidth="2" />
      <rect x="78" y="318" width="150" height="140" rx="34" fill="#D9A86C" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M88 450 L84 472 M244 450 L248 472" stroke="#1C2321" strokeWidth="4" strokeLinecap="round" />
      <rect x="70" y="400" width="190" height="52" rx="18" fill="#C99559" stroke="#1C2321" strokeWidth="2.5" />
      <rect x="60" y="372" width="40" height="88" rx="18" fill="#D9A86C" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M128 412 L132 330 Q158 312 186 330 L190 412 Z" fill="#7C9A8C" stroke="#1C2321" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M138 404 H232 Q244 404 244 418 V430 H138 Z" fill="#4E5A57" stroke="#1C2321" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="220" y="424" width="22" height="46" fill="#4E5A57" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M214 468 H250 Q258 468 258 478 H214 Z" fill="#1C2321" />
      <path d="M184 338 Q200 366 204 398" fill="none" stroke="#7C9A8C" strokeWidth="15" strokeLinecap="round" />
      <rect x="226" y="372" width="40" height="88" rx="18" fill="#D9A86C" stroke="#1C2321" strokeWidth="2.5" />
      <circle cx="158" cy="288" r="22" fill="#EBC7A4" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M136 288 A22 22 0 0 1 180 288 Z" fill="#E4E0D8" stroke="#1C2321" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="151" cy="296" r="5" fill="none" stroke="#1C2321" strokeWidth="1.6" />
      <circle cx="166" cy="296" r="5" fill="none" stroke="#1C2321" strokeWidth="1.6" />
      <path d="M156 296 H161" stroke="#1C2321" strokeWidth="1.6" />
      <path d="M282 380 L280 466 H298 L301 404 L304 466 H322 L320 380 Z" fill="#143229" stroke="#1C2321" strokeWidth="2" strokeLinejoin="round" />
      <rect x="276" y="462" width="24" height="10" rx="4" fill="#F7F1E6" stroke="#1C2321" strokeWidth="2" />
      <rect x="302" y="462" width="24" height="10" rx="4" fill="#F7F1E6" stroke="#1C2321" strokeWidth="2" />
      <path d="M324 300 Q336 340 338 370" fill="none" stroke="#1F4A3D" strokeWidth="15" strokeLinecap="round" />
      <path d="M332 372 Q344 356 356 372" fill="none" stroke="#1C2321" strokeWidth="2.5" />
      <rect x="320" y="370" width="46" height="34" rx="6" fill="#F2D29B" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M274 388 L278 286 Q300 268 324 286 L328 388 Z" fill="#1F4A3D" stroke="#1C2321" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M292 278 L301 292 L310 278" fill="none" stroke="#F7F1E6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M280 298 Q246 330 216 390" fill="none" stroke="#1F4A3D" strokeWidth="15" strokeLinecap="round" />
      <circle cx="205" cy="400" r="8" fill="#EBC7A4" stroke="#1C2321" strokeWidth="2" />
      <circle cx="216" cy="392" r="8" fill="#8D5B3E" stroke="#1C2321" strokeWidth="2" />
      <circle cx="338" cy="372" r="7" fill="#8D5B3E" stroke="#1C2321" strokeWidth="2" />
      <circle cx="301" cy="252" r="22" fill="#8D5B3E" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M279 252 A22 22 0 0 1 323 252 Z" fill="#1C1714" />
      <circle cx="319" cy="234" r="9" fill="#1C1714" />
      <path d="M430 470 L436 432 H476 L482 470 Z" fill="#C98B5B" stroke="#1C2321" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="444" cy="406" rx="10" ry="24" transform="rotate(-22 444 406)" fill="#6F9A83" stroke="#1C2321" strokeWidth="2" />
      <ellipse cx="470" cy="402" rx="10" ry="26" transform="rotate(18 470 402)" fill="#6F9A83" stroke="#1C2321" strokeWidth="2" />
      <ellipse cx="457" cy="392" rx="9" ry="30" fill="#7FAA92" stroke="#1C2321" strokeWidth="2" />
    </svg>
  );
}

/** Senior taxi: malé auto veze seniora k lékaři. */
export function SeniorTaxi({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 240"
      className={cx("block h-auto w-full overflow-hidden rounded-card bg-sage-soft", className)}
      role="img"
      aria-label="Senior taxi: malé auto, které obec objedná, veze seniora k lékaři"
    >
      <path d="M0 196 H360 V240 H0 Z" fill="#E6D8C0" />
      <path d="M20 196 Q60 150 110 170 Q150 120 220 150 Q280 120 340 160 V196 Z" fill="#A9C4B5" />
      <path d="M70 186 V150 Q72 126 100 122 H200 Q222 122 236 142 L256 162 H286 Q300 162 300 176 V186 Z" fill="#F7F1E6" stroke="#1C2321" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M112 132 H158 V160 H104 V140 Q104 132 112 132 Z" fill="#CFE0EA" stroke="#1C2321" strokeWidth="2" />
      <path d="M168 132 H200 Q212 132 222 146 L232 160 H168 Z" fill="#CFE0EA" stroke="#1C2321" strokeWidth="2" />
      <circle cx="132" cy="146" r="9" fill="#EBC7A4" stroke="#1C2321" strokeWidth="2" />
      <path d="M123 146 A9 9 0 0 1 141 146 Z" fill="#E4E0D8" />
      <circle cx="196" cy="146" r="9" fill="#B98563" stroke="#1C2321" strokeWidth="2" />
      <path d="M187 145 A9 9 0 0 1 205 145 Z" fill="#3A2C22" />
      <rect x="70" y="166" width="230" height="10" fill="#1F4A3D" />
      <circle cx="112" cy="190" r="17" fill="#1C2321" />
      <circle cx="112" cy="190" r="7" fill="#DDD5C6" />
      <circle cx="258" cy="190" r="17" fill="#1C2321" />
      <circle cx="258" cy="190" r="7" fill="#DDD5C6" />
    </svg>
  );
}

/** eŽádanka v mobilu se třemi úrovněmi naléhavosti, nejvyšší je zaškrtnutá. */
export function EReferral({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 240"
      className={cx("block h-auto w-full overflow-hidden rounded-card bg-stone", className)}
      role="img"
      aria-label="Elektronická žádanka v mobilu se třemi úrovněmi naléhavosti, nejvyšší je zaškrtnutá"
    >
      <circle cx="290" cy="60" r="34" fill="#F2D29B" />
      <rect x="128" y="24" width="112" height="200" rx="18" fill="#FBF8F2" stroke="#1C2321" strokeWidth="2.5" />
      <rect x="164" y="34" width="40" height="6" rx="3" fill="#CFC5B3" />
      <rect x="144" y="62" width="80" height="10" rx="5" fill="#1F4A3D" />
      <rect x="144" y="80" width="56" height="8" rx="4" fill="#CFC5B3" />
      <rect x="142" y="104" width="84" height="32" rx="10" fill="#DCE8E0" stroke="#1F4A3D" strokeWidth="2" />
      <circle cx="158" cy="120" r="7" fill="#1F4A3D" />
      <path d="M154.5 120 L157 122.5 L161.5 117.5" stroke="#FBF8F2" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="172" y="116" width="40" height="8" rx="4" fill="#1F4A3D" />
      <rect x="142" y="144" width="84" height="32" rx="10" fill="#FBF8F2" stroke="#CFC5B3" strokeWidth="2" />
      <circle cx="158" cy="160" r="7" fill="none" stroke="#CFC5B3" strokeWidth="2" />
      <rect x="172" y="156" width="32" height="8" rx="4" fill="#CFC5B3" />
      <rect x="142" y="184" width="84" height="26" rx="10" fill="#FBF8F2" stroke="#CFC5B3" strokeWidth="2" />
      <circle cx="158" cy="197" r="7" fill="none" stroke="#CFC5B3" strokeWidth="2" />
      <rect x="172" y="193" width="24" height="8" rx="4" fill="#CFC5B3" />
      <path d="M60 230 V150 Q60 120 90 118 Q118 120 118 150 V230 Z" fill="#7C9A8C" stroke="#1C2321" strokeWidth="2.5" />
      <circle cx="89" cy="96" r="18" fill="#EBC7A4" stroke="#1C2321" strokeWidth="2.5" />
      <path d="M71 96 A18 18 0 0 1 107 96 Z" fill="#6B4A2E" />
      <path d="M112 150 Q126 140 136 128" stroke="#7C9A8C" strokeWidth="13" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Obecní zdravotní centrum na náměstí, před ním lékařka a otec s dítětem. */
export function HealthCentre({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 240"
      className={cx("block h-auto w-full overflow-hidden rounded-card bg-sage-soft", className)}
      role="img"
      aria-label="Obecní zdravotní centrum na náměstí, před ním lékařka a otec s dítětem"
    >
      <path d="M0 196 H360 V240 H0 Z" fill="#E6D8C0" />
      <rect x="70" y="70" width="220" height="126" fill="#FBF8F2" stroke="#1C2321" strokeWidth="2.5" />
      <rect x="60" y="58" width="240" height="16" rx="4" fill="#1F4A3D" />
      <rect x="140" y="86" width="80" height="22" rx="6" fill="#DCE8E0" />
      <path d="M180 90 V104 M173 97 H187" stroke="#1F4A3D" strokeWidth="3" strokeLinecap="round" />
      <rect x="88" y="120" width="40" height="32" rx="3" fill="#F2D29B" stroke="#1C2321" strokeWidth="2" />
      <rect x="232" y="120" width="40" height="32" rx="3" fill="#F2D29B" stroke="#1C2321" strokeWidth="2" />
      <rect x="160" y="132" width="40" height="64" rx="3" fill="#CFE0EA" stroke="#1C2321" strokeWidth="2" />
      <circle cx="38" cy="150" r="22" fill="#6F9A83" stroke="#1C2321" strokeWidth="2" />
      <path d="M38 172 V196" stroke="#1C2321" strokeWidth="3" />
      <path d="M300 196 V160 Q300 146 314 146 Q328 146 328 160 V196 Z" fill="#1F4A3D" stroke="#1C2321" strokeWidth="2" />
      <circle cx="314" cy="132" r="11" fill="#8D5B3E" stroke="#1C2321" strokeWidth="2" />
      <path d="M303 132 A11 11 0 0 1 325 132 Z" fill="#1C1714" />
      <path d="M232 196 V168 Q232 156 244 156 Q256 156 256 168 V196 Z" fill="#D9A86C" stroke="#1C2321" strokeWidth="2" />
      <circle cx="244" cy="144" r="10" fill="#EBC7A4" stroke="#1C2321" strokeWidth="2" />
      <path d="M262 196 V180 Q262 172 270 172 Q278 172 278 180 V196 Z" fill="#A9C4B5" stroke="#1C2321" strokeWidth="2" />
      <circle cx="270" cy="164" r="7" fill="#EBC7A4" stroke="#1C2321" strokeWidth="2" />
      <path d="M254 176 Q260 178 264 182" stroke="#D9A86C" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
