import { Check, Loader2, Circle } from "lucide-react";
import { cycleSteps } from "../../data/sample";

const stateMap: Record<
  string,
  { icon: React.ReactNode; ring: string; label: string }
> = {
  完了: {
    icon: <Check size={14} className="text-white" />,
    ring: "bg-emerald-500 text-white",
    label: "完了",
  },
  進行中: {
    icon: <Loader2 size={14} className="animate-spin text-white" />,
    ring: "bg-sky-500 text-white",
    label: "進行中",
  },
  未完了: {
    icon: <Circle size={14} className="text-slate-400" />,
    ring: "bg-white ring-1 ring-slate-300 text-slate-400",
    label: "未完了",
  },
  待機: {
    icon: <Circle size={14} className="text-slate-300" />,
    ring: "bg-white ring-1 ring-slate-200 text-slate-400",
    label: "待機",
  },
};

export default function StepFlow() {
  return (
    <ol className="space-y-3">
      {cycleSteps.map((s) => {
        const state = stateMap[s.state] ?? stateMap["待機"];
        return (
          <li key={s.step} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${state.ring}`}
            >
              {s.state === "完了" || s.state === "進行中" ? state.icon : s.step}
            </span>
            <div className="flex-1 text-sm">
              <div className="font-medium text-slate-800">{s.title}</div>
            </div>
            <span
              className={`text-xs ${
                s.state === "完了"
                  ? "text-emerald-600"
                  : s.state === "進行中"
                    ? "text-sky-600"
                    : "text-slate-400"
              }`}
            >
              {s.date}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
