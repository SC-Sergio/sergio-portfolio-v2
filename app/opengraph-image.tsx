import { renderSocialImage } from "@/lib/socialImage";

export const alt = "Sergio Carey — Ingeniero en Informática: software, IA aplicada y automatización";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderSocialImage();
}
