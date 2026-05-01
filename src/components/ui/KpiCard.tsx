import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Sparkline from "./Sparkline";
import type { Kpi } from "../../data/sample";

const intentClass = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-slate-500",
};

// 左端のインテントストライプ。ひと目で「良い / 悪い / 横ばい」を伝える。
const stripeClass = {
  positive: "bg-emerald-500",
  negative: "bg-rose-500",
  neutral: "bg-slate-300",
};

// ステータスバッジ。数字を読まなくても評価が分かるためのラベル。
const statusBadge: Record<
  Kpi["intent"],
  { label: string; className: string }
> = {
  positive: {
    label: "好調",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  negative: {
    label: "要注視",
    className: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  neutral: {
    label: "横ばい",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  const trendIcon =
    kpi.trend === "up" ? (
      <ArrowUpRight size={14} />
    ) : kpi.trend === "down" ? (
      <ArrowDownRight size={14} />
    ) : (
      <Minus size={14} />
    );

  const lineColor =
    kpi.intent === "positive"
      ? "#10b981"
      : kpi.intent === "negative"
        ? "#f43f5e"
        : "#64748b";

  const fillColor =
    kpi.intent === "positive"
      ? "rgba(16, 185, 129, 0.10)"
      : kpi.intent === "negative"
        ? "rgba(244, 63, 94, 0.08)"
        : "rgba(100, 116, 139, 0.08)";

  const badge = statusBadge[kpi.intent];

  return (
    <div className="card card-hover relative min-h-[156px] overflow-hidden p-4">
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${stripeClass[kpi.intent]}`}
      />
      <div className="flex items-center justify-between gap-2">
        <div className="kpi-label">{kpi.label}</div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="kpi-value">{kpi.value}</div>
        <div
          className={`flex items-center gap-0.5 text-xs font-semibold ${intentClass[kpi.intent]}`}
        >
          {trendIcon}
          {kpi.delta}
        </div>
      </div>
      <div className="mt-1 text-xs text-slate-500">{kpi.deltaLabel}</div>
      <div className="-mx-1 mt-2 h-12">
        <Sparkline
          data={kpi.spark}
          color={lineColor}
          fill={fillColor}
          ariaLabel={`${kpi.label} の推移 (直近${kpi.spark.length}期間, ${kpi.delta} ${kpi.deltaLabel})`}
        />
      </div>
    </div>
  );
}
