// Guide v2 専用の tone マップ。
// Tailwind は動的クラス生成を許さないため、tone → 固定クラス文字列の対応表に集約する。
import type { GuideToneV2 } from "../../data/sample";

export type GuideToneStyles = {
  /** カード上端の細いストライプ */
  bar: string;
  /** カード本体の柔らかい背景 */
  surface: string;
  /** ボーダー (薄) */
  border: string;
  /** タイトルの強調文字色 */
  text: string;
  /** Pill 用 chip 背景 + 文字色 */
  chip: string;
  /** SVG / dot 等の塗り潰しに使う Hex */
  hex: string;
  /** ノードの輪 (リング) */
  ring: string;
  /** 番号バッジ */
  badge: string;
};

export const guideToneStyles: Record<GuideToneV2, GuideToneStyles> = {
  navy: {
    bar: "bg-navy-900",
    surface: "bg-navy-50/50",
    border: "border-navy-200",
    text: "text-navy-900",
    chip: "bg-navy-900 text-white",
    hex: "#0b1e3f",
    ring: "ring-navy-200",
    badge: "bg-navy-900 text-white",
  },
  sky: {
    bar: "bg-sky-500",
    surface: "bg-sky-50/50",
    border: "border-sky-200",
    text: "text-sky-700",
    chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
    hex: "#0ea5e9",
    ring: "ring-sky-200",
    badge: "bg-sky-500 text-white",
  },
  mint: {
    bar: "bg-emerald-500",
    surface: "bg-emerald-50/50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    hex: "#10b981",
    ring: "ring-emerald-200",
    badge: "bg-emerald-500 text-white",
  },
  gold: {
    bar: "bg-amber-500",
    surface: "bg-amber-50/50",
    border: "border-amber-200",
    text: "text-amber-700",
    chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    hex: "#f59e0b",
    ring: "ring-amber-200",
    badge: "bg-amber-500 text-white",
  },
  violet: {
    bar: "bg-violet-500",
    surface: "bg-violet-50/50",
    border: "border-violet-200",
    text: "text-violet-700",
    chip: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
    hex: "#8b5cf6",
    ring: "ring-violet-200",
    badge: "bg-violet-500 text-white",
  },
  rose: {
    bar: "bg-rose-500",
    surface: "bg-rose-50/50",
    border: "border-rose-200",
    text: "text-rose-700",
    chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
    hex: "#f43f5e",
    ring: "ring-rose-200",
    badge: "bg-rose-500 text-white",
  },
};
