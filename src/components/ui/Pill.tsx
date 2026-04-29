import type { ReactNode } from "react";

type Tone =
  | "mint"
  | "rose"
  | "gold"
  | "sky"
  | "slate"
  | "violet"
  | "navy"
  | "emerald";

const toneClass: Record<Tone, string> = {
  mint: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  gold: "bg-amber-50 text-amber-700 ring-amber-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  navy: "bg-navy-900 text-white ring-navy-900",
  emerald: "bg-emerald-600 text-white ring-emerald-700",
};

export default function Pill({
  tone = "slate",
  children,
  size = "sm",
}: {
  tone?: Tone;
  size?: "xs" | "sm";
  children: ReactNode;
}) {
  const sizing =
    size === "xs"
      ? "px-2 py-0.5 text-[10px]"
      : "px-2.5 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ring-1 ${sizing} ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

export const judgmentTone = (j: string): Tone => {
  switch (j) {
    case "伸ばす":
      return "mint";
    case "改善":
      return "gold";
    case "維持":
      return "sky";
    case "停止検討":
      return "rose";
    case "要調査":
      return "slate";
    default:
      return "slate";
  }
};

export const impactTone = (i: string): Tone => {
  switch (i) {
    case "高":
      return "rose";
    case "中":
      return "gold";
    case "低":
      return "mint";
    default:
      return "slate";
  }
};

export const effortTone = (e: string): Tone => {
  switch (e) {
    case "高":
      return "rose";
    case "中":
      return "gold";
    case "低":
      return "mint";
    default:
      return "slate";
  }
};

export const priorityTone = (p: string): Tone => {
  return p === "P1" ? "rose" : "gold";
};

export const statusTone = (
  s: string
):
  | "slate"
  | "sky"
  | "gold"
  | "violet"
  | "mint"
  | "rose" => {
  switch (s) {
    case "完了":
    case "実装済み":
      return "mint";
    case "進行中":
      return "sky";
    case "レビュー中":
      return "gold";
    case "効果検証中":
      return "violet";
    case "未着手":
      return "slate";
    default:
      return "slate";
  }
};
