import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

const EYEBROW = "Jak a kdy";
const TITLE = "První zákony mohou platit od roku 2031, cíl je kolem roku 2038";

export const alt = TITLE;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: EYEBROW, title: TITLE });
}
