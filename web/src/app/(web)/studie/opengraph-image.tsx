import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

const EYEBROW = "Odborná studie ke konzultaci";
const TITLE = "Plné znění studie: čtěte, hledejte a připomínkujte každý odstavec";

export const alt = TITLE;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: EYEBROW, title: TITLE });
}
