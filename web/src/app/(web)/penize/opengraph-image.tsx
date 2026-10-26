import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

const EYEBROW = "Peníze";
const TITLE = "Asi 21,5 miliardy ročně navíc. Necelá 4 % toho, co zdravotnictví stojí dnes.";

export const alt = TITLE;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: EYEBROW, title: TITLE });
}
