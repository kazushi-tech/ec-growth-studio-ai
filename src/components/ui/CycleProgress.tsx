import { Check, Loader2 } from "lucide-react";
import { cycleSteps } from "../../data/sample";

// Dashboard 上で月次改善ループの「現在地」を一目で示すための横型ミニビュー。
// Guide v2 の step-pipeline と同じ思想だが、Dashboard では密度を高めるために
// 円形ノード + 連結線の最小表現に絞る。データソースは sample.cycleSteps を再利用。

type State = "完了" | "進行中" | "未完了" | "待機";

const nodeStyle: Record<
  State,
  {
    ring: string;
    text: string;
    label: string;
  }
> = {
  完了: {
    ring: "bg-emerald-500 text-white ring-emerald-200",
    text: "text-emerald-700",
    label: "完了",
  },
  進行中: {
    ring: "bg-sky-500 text-white ring-sky-200",
    text: "text-sky-700",
    label: "進行中",
  },
  未完了: {
    ring: "bg-white text-slate-500 ring-slate-200",
    text: "text-slate-500",
    label: "未着手",
  },
  待機: {
    ring: "bg-white text-slate-400 ring-slate-200",
    text: "text-slate-400",
    label: "待機",
  },
};

export default function CycleProgress() {
  const steps = cycleSteps;
  const currentIndex = steps.findIndex((s) => s.state === "進行中");
  const completed = steps.filter((s) => s.state === "完了").length;
  const total = steps.length;
  const currentLabel =
    currentIndex >= 0
      ? `Step ${currentIndex + 1} / ${total}：${steps[currentIndex].title}`
      : `${completed} / ${total} ステップ完了`;

  return (
    <figure
      className="rounded-xl border border-slate-200 bg-slate-50/40 p-3"
      aria-label="月次改善ループの現在地"
    >
      <ol className="flex items-stretch gap-1.5 overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const state = (nodeStyle[s.state as State] ?? nodeStyle["待機"]) as
            (typeof nodeStyle)[State];
          const isCurrent = s.state === "進行中";
          const connectorDone =
            s.state === "完了" || (i < steps.length - 1 && steps[i + 1].state === "完了");
          return (
            <li
              key={s.step}
              className="flex min-w-[64px] flex-1 flex-col items-center text-center"
            >
              <div className="flex w-full items-center">
                {/* 左連結線 */}
                <span
                  aria-hidden
                  className={`h-0.5 flex-1 ${
                    i === 0
                      ? "bg-transparent"
                      : steps[i - 1].state === "完了"
                        ? "bg-emerald-300"
                        : "bg-slate-200"
                  }`}
                />
                {/* ノード */}
                <span
                  className={`relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-2 ${state.ring} ${
                    isCurrent ? "shadow-[0_0_0_4px_rgba(56,189,248,0.18)]" : ""
                  }`}
                >
                  {s.state === "完了" ? (
                    <Check size={13} aria-hidden="true" />
                  ) : s.state === "進行中" ? (
                    <Loader2
                      size={13}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    s.step
                  )}
                </span>
                {/* 右連結線 */}
                <span
                  aria-hidden
                  className={`h-0.5 flex-1 ${
                    i === steps.length - 1
                      ? "bg-transparent"
                      : connectorDone
                        ? "bg-emerald-300"
                        : "bg-slate-200"
                  }`}
                />
              </div>
              <div className="mt-1.5 text-xs font-medium leading-tight text-slate-700">
                {s.title}
              </div>
              <div className={`text-xs ${state.text}`}>{state.label}</div>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">現在地</span>
        <span className="text-sky-700">{currentLabel}</span>
      </figcaption>
    </figure>
  );
}
