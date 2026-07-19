export const TABS = [
  { id: "garment", icon: "🎽", label: "Garment" },
  { id: "library", icon: "✦", label: "Library" },
  { id: "upload", icon: "↑", label: "Upload" },
  { id: "text", icon: "Aa", label: "Text" },
  // { id: "draw", icon: "✏", label: "Draw" },
  { id: "place", icon: "⊹", label: "Place" },
] as const;
export type TabId = (typeof TABS)[number]["id"];

export interface ColorOption {
  key: string;
  hex: string;
  border?: string;
}
export interface ThreadOption {
  key: string;
  hex: string;
  label: string;
  border?: string;
}
export interface DesignOption {
  label: string;
  svg: string;
}

export const COLORS: ColorOption[] = [
  { key: "cream", hex: "#F5F0E8", border: "#ccc" },
  { key: "white", hex: "#FAFAFA", border: "#ccc" },
  { key: "navy", hex: "#1B2A4A" },
  { key: "black", hex: "#1A1410" },
  { key: "sage", hex: "#7A9E7E" },
  { key: "blush", hex: "#E8C4B0" },
  { key: "stone", hex: "#9E9082" },
  { key: "forest", hex: "#2D4A3E" },
];

export const THREADS: ThreadOption[] = [
  { key: "sienna", hex: "#A0522D", label: "Sienna" },
  { key: "gold", hex: "#C8A96E", label: "Gold" },
  { key: "ivory", hex: "#F0EBE0", label: "Ivory", border: "#ccc" },
  { key: "navy", hex: "#1B2A4A", label: "Navy" },
  { key: "black", hex: "#1A1410", label: "Black" },
  { key: "sage", hex: "#7A9E7E", label: "Sage" },
  { key: "red", hex: "#8B2020", label: "Burgundy" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "2XL"] as const;
export type Size = (typeof SIZES)[number];

const sunRays = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
  .map((a) => {
    const r = Math.PI / 180;
    return `<line x1="${40 + 16 * Math.cos(a * r)}" y1="${40 + 16 * Math.sin(a * r)}" x2="${40 + 26 * Math.cos(a * r)}" y2="${40 + 26 * Math.sin(a * r)}" stroke="currentColor" stroke-width="1.8"/>`;
  })
  .join("");

const starPts = [0, 72, 144, 216, 288]
  .map(
    (a) =>
      `${40 + 28 * Math.cos(((a - 90) * Math.PI) / 180)},${40 + 28 * Math.sin(((a - 90) * Math.PI) / 180)}`,
  )
  .join(" ");
const starDots = [0, 72, 144, 216, 288]
  .map(
    (a) =>
      `<circle cx="${40 + 28 * Math.cos(((a - 90) * Math.PI) / 180)}" cy="${40 + 28 * Math.sin(((a - 90) * Math.PI) / 180)}" r="2" fill="currentColor"/>`,
  )
  .join("");

export const DESIGNS: Record<string, DesignOption> = {
  flower: {
    label: "Flower",
    svg: `<circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3" opacity=".4"/><g transform="translate(40,40)"><ellipse rx="6" ry="14" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(0)"/><ellipse rx="6" ry="14" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(45)"/><ellipse rx="6" ry="14" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(90)"/><ellipse rx="6" ry="14" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(135)"/><circle r="8" fill="currentColor" opacity=".3"/><circle r="4" fill="currentColor" opacity=".7"/></g>`,
  },
  anchor: {
    label: "Anchor",
    svg: `<circle cx="40" cy="17" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="24" x2="40" y2="62" stroke="currentColor" stroke-width="2"/><path d="M22 36 Q40 42 58 36" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20 60 Q30 50 40 62 Q50 50 60 60" fill="none" stroke="currentColor" stroke-width="2"/>`,
  },
  leaf: {
    label: "Leaf",
    svg: `<path d="M40 8 Q68 28 63 58 Q40 73 18 53 Q8 28 40 8 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="8" x2="40" y2="70" stroke="currentColor" stroke-width="1"/><path d="M40 30 Q52 38 57 48" fill="none" stroke="currentColor" stroke-width="1"/><path d="M40 30 Q28 38 23 48" fill="none" stroke="currentColor" stroke-width="1"/>`,
  },
  mountain: {
    label: "Mountain",
    svg: `<polyline points="8,64 28,28 46,50 60,18 76,64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="4" y1="64" x2="76" y2="64" stroke="currentColor" stroke-width="1" opacity=".4"/>`,
  },
  sun: {
    label: "Sun",
    svg: `<circle cx="40" cy="40" r="12" fill="currentColor" opacity=".4"/>${sunRays}`,
  },
  wave: {
    label: "Wave",
    svg: `<path d="M4 36 Q14 22 24 36 Q34 50 44 36 Q54 22 64 36 Q74 50 80 36" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M4 50 Q14 36 24 50 Q34 64 44 50 Q54 36 64 50 Q74 64 80 50" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".45"/>`,
  },
  star: {
    label: "Stars",
    svg: `<polygon points="${starPts}" fill="none" stroke="currentColor" stroke-width="1.5"/>${starDots}`,
  },
  monogram: {
    label: "Monogram",
    svg: `<text x="40" y="56" text-anchor="middle" font-family="Playfair Display,serif" font-size="44" font-style="italic" fill="none" stroke="currentColor" stroke-width="1.2">A</text>`,
  },
  dragon: {
    label: "Dragon",
    svg: `<path d="M40 10 Q56 20 58 36 Q64 40 66 52 Q60 60 50 55 Q46 64 40 68 Q34 64 30 55 Q20 60 14 52 Q16 40 22 36 Q24 20 40 10 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="33" cy="34" r="3" fill="currentColor" opacity=".6"/><circle cx="47" cy="34" r="3" fill="currentColor" opacity=".6"/><path d="M34 50 Q40 56 46 50" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  },
};

export const FONTS = [
  {
    font: "Playfair Display",
    italic: true,
    preview: "Elegant Italic",
    meta: "Playfair Display · Italic",
    style: { fontFamily: '"Playfair Display",serif', fontStyle: "italic" },
  },
  {
    font: "Playfair Display",
    italic: false,
    preview: "Classic Serif",
    meta: "Playfair Display · Regular",
    style: { fontFamily: '"Playfair Display",serif' },
  },
  {
    font: "DM Mono",
    italic: false,
    preview: "MONO TYPE",
    meta: "DM Mono · Monospace",
    style: {
      fontFamily: '"DM Mono",monospace',
      letterSpacing: "0.08em",
      fontSize: "13px",
    },
  },
  {
    font: "Cormorant Garamond",
    italic: true,
    preview: "Literary Script",
    meta: "Cormorant Garamond · Italic",
    style: {
      fontFamily: '"Cormorant Garamond",serif',
      fontStyle: "italic",
      fontSize: "18px",
    },
  },
] as const;

export interface PlaceOption {
  top: string;
  left: string;
  transform: string;
}
export const PLACES: Record<string, PlaceOption> = {
  center: { top: "34%", left: "50%", transform: "translate(-50%,-50%)" },
  "top-left": { top: "22%", left: "28%", transform: "translate(-50%,-50%)" },
  "top-right": { top: "22%", left: "72%", transform: "translate(-50%,-50%)" },
  "left-sleeve": { top: "44%", left: "17%", transform: "translate(-50%,-50%)" },
  "right-sleeve": {
    top: "44%",
    left: "83%",
    transform: "translate(-50%,-50%)",
  },
  back: { top: "36%", left: "50%", transform: "translate(-50%,-50%)" },
};

export const VIEWS = ["front", "back", "left", "right", "detail"] as const;
export type View = (typeof VIEWS)[number];

/* ════════════════════════════════════════════════════════════
   MULTI-LAYER EMBROIDERY TYPES
   Each design the user adds (text, image, motif, drawing) is its
   own independent layer with its own position/size/content.
════════════════════════════════════════════════════════════ */
export interface EmbLayer {
  id: string;
  type: "library" | "upload" | "text" | "draw";
  content: string; // the HTML/SVG markup rendered inside the layer
  top: string;
  left: string;
  width: number; // layer is always square, so this doubles as height
  // raw data kept so the layer can be re-edited later (e.g. re-opening
  // the text tool on a previously-added text layer)
  raw?: {
    text?: string;
    fontIndex?: number;
    threadHex?: string;
    designKey?: string;
  };
}

export function createLayerId() {
  return `layer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
