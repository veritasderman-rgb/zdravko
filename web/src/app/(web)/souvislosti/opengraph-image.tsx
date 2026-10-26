import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

const EYEBROW = "Jak to do sebe zapadá";
const TITLE = "Co na co navazuje a co se kde ovlivňuje";

export const alt = TITLE;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: EYEBROW, title: TITLE });
}
