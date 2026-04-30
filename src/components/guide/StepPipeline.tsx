import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import type { StepPipelineStepV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";

type Props = {
  steps: StepPipelineStepV2[];
};

/**
 * 6ステップの月次改善ループ。
 * - sm 以上は横並び (overflow-x-auto)
 * - sm 未満は縦並び
 * - 末尾に「翌月へ」を意味する折返し矢印を出す
 */
export default function StepPipeline({ steps }: Props) {
  return (
    <figure className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
      <ol
        className="flex flex-col gap-3 sm:flex-row sm:flex-nowrap sm:items-stretch sm:gap-2 sm:overflow-x-auto"
        aria-label="月次改善ループ 6ステップ"
      >
        {steps.map((s, i) => {
          const tone = guideToneStyles[s.tone];
          const inner = (
            <div
              className={`flex h-full flex-col rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-cardLg sm:min-w-[140px] ${tone.border}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${tone.badge}`}
                  aria-hidden="true"
                >
                  {s.num}
                </span>
                <div className={`text-xs font-semibold ${tone.text}`}>
                  {s.title}
                </div>
              </div>
              <div className="mt-1.5 flex-1 text-[11px] leading-5 text-slate-600">
                {s.sub}
              </div>
            </div>
          );
          return (
            <li
              key={s.num}
              className="flex items-center gap-2 sm:flex-col sm:items-stretch"
            >
              {s.to ? (
                <Link
                  to={s.to}
                  className="block flex-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 sm:flex-none"
                  aria-label={`Step ${s.num} ${s.title} の画面を開く`}
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex-1 sm:flex-none">{inner}</div>
              )}
              {/* 矢印 — 最後のステップ以降は折返しアイコンを出す */}
              {i < steps.length - 1 ? (
                <ArrowRight
                  size={14}
                  className="shrink-0 text-slate-400 sm:hidden"
                  aria-hidden="true"
                />
              ) : null}
              {i < steps.length - 1 ? (
                <div
                  className="hidden shrink-0 items-center justify-center text-slate-400 sm:flex sm:self-center"
                  aria-hidden="true"
                >
                  <ArrowRight size={14} />
                </div>
              ) : null}
            </li>
          );
        })}

        {/* 末尾の折返し: 翌月へ */}
        <li
          className="flex items-center gap-2 sm:flex-col sm:items-stretch sm:justify-center"
          aria-label="翌月へ続く"
        >
          <div className="flex h-full items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-500 sm:flex-col sm:px-3 sm:py-3 sm:text-center">
            <RefreshCw size={12} aria-hidden="true" />
            <span>翌月へ</span>
          </div>
        </li>
      </ol>
      <figcaption className="mt-3 text-xs leading-6 text-slate-600">
        各ステップは本プロダクトの画面に1対1で対応する。クリックで画面に直接ジャンプできる。
      </figcaption>
    </figure>
  );
}
