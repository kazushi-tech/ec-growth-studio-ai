import { Link } from "react-router-dom";
import { ChevronRight, Clock, Info } from "lucide-react";
import type { GuideChapterV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";
import LoopDiagram from "./LoopDiagram";
import StepPipeline from "./StepPipeline";
import QuadrantLegend from "./QuadrantLegend";
import MiniMockup from "./MiniMockup";
import ExecTimeline from "./ExecTimeline";

type Props = {
  chapter: GuideChapterV2;
};

/**
 * Guide v2 の各章ラッパー。
 * - 章タイトル (h2) / リード文 / 章バー / live infographic / bullets / callout / リンク
 * - anatomy.kind に応じて infographic コンポーネントを切替
 */
export default function GuideSection({ chapter }: Props) {
  const tone = guideToneStyles[chapter.tone];
  const callout = chapter.callout;
  const calloutTone = callout ? guideToneStyles[callout.tone] : null;

  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="card scroll-mt-20 overflow-hidden"
    >
      <div className={`h-1 w-full ${tone.bar}`} aria-hidden="true" />
      <div className="space-y-5 px-5 py-5 sm:px-6">
        {/* ヘッダ — 章番号 / タイトル / 推定時間 */}
        <header className="flex flex-wrap items-start gap-3">
          <span
            className={`inline-flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg px-2 text-sm font-semibold ${tone.badge}`}
            aria-hidden="true"
          >
            {chapter.number}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={`${chapter.id}-title`}
              className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
            >
              {chapter.title}
            </h2>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              {chapter.intro}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
            <Clock size={11} aria-hidden="true" />
            約{chapter.estMin}分
          </span>
        </header>

        {/* インフォグラフィック */}
        <Anatomy chapter={chapter} />

        {/* bullets */}
        {chapter.bullets.length > 0 && (
          <ul className="grid gap-2 md:grid-cols-2">
            {chapter.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50/40 p-3 text-xs leading-6 text-slate-700"
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.bar}`}
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* callout */}
        {callout && calloutTone && (
          <aside
            role="note"
            className={`rounded-xl border px-4 py-3 ${calloutTone.border} ${calloutTone.surface}`}
          >
            <div
              className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${calloutTone.text}`}
            >
              <Info size={12} aria-hidden="true" />
              {callout.label}
            </div>
            <p className="mt-1.5 text-xs leading-6 text-slate-700">
              {callout.body}
            </p>
          </aside>
        )}

        {/* 関連画面リンク */}
        {chapter.links && chapter.links.length > 0 && (
          <div
            aria-label="関連画面"
            className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              関連画面
            </span>
            {chapter.links.map((l) => (
              <Link
                key={l.to + l.label}
                to={l.to}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-navy-300 hover:bg-slate-50 hover:text-navy-900"
              >
                {l.label}
                <ChevronRight size={11} aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Anatomy({ chapter }: { chapter: GuideChapterV2 }) {
  const a = chapter.anatomy;
  switch (a.kind) {
    case "loop-diagram":
      return <LoopDiagram nodes={a.nodes} />;
    case "step-pipeline":
      return <StepPipeline steps={a.steps} />;
    case "quadrant-legend":
      return <QuadrantLegend cells={a.cells} />;
    case "screen-anatomy":
      return <MiniMockup screens={a.screens} />;
    case "exec-timeline":
      return <ExecTimeline segments={a.segments} />;
    default:
      return null;
  }
}
