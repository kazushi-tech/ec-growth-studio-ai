import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Sparkline from "./Sparkline";
import type { Kpi } from "../../data/sample";

const intentClass = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-slate-500",
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

  return (
    <div className="card card-hover p-4">
      <div className="kpi-label">{kpi.label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="kpi-value">{kpi.value}</div>
        <div
          className={`flex items-center gap-0.5 text-xs font-semibold ${intentClass[kpi.intent]}`}
        >
          {trendIcon}
          {kpi.delta}
        </div>
      </div>
      <div className="mt-1 text-[11px] text-slate-400">{kpi.deltaLabel}</div>
      <div className="-mx-1 mt-2 h-12">
        <Sparkline data={kpi.spark} color={lineColor} fill={fillColor} />
      </div>
    </div>
  );
}
