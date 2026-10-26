import { WHY_NOW } from "@/content/reforma";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const alt = WHY_NOW.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ eyebrow: WHY_NOW.eyebrow, title: WHY_NOW.title });
}
