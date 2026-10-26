import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

const EYEBROW = "Ochrana osobních údajů";
const TITLE = "Jak zacházíme s vašimi údaji";

export const alt = TITLE;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: EYEBROW, title: TITLE });
}
