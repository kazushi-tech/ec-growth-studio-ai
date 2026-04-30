import type { ExecTimelineSegmentV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";

type Props = {
  segments: ExecTimelineSegmentV2[];
  totalMinutes?: number;
};

/**
 * 上司デモの 5〜10分タイムラインを横バーで描く live infographic。
 * sm 以上で横並び / sm 未満で縦並びにフォールバックする。
 */
export default function ExecTimeline({ segments, totalMinutes = 10 }: Props) {
  return (
    <figure className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
      {/* 横タイムライン (>= sm) */}
      <div className="hidden sm:block" aria-hidden="false">
        <div className="relative h-3 w-full rounded-full bg-slate-200">
          {segments.map((seg) => {
            const left = (seg.from / totalMinutes) * 100;
            const width = ((seg.to - seg.from) / totalMinutes) * 100;
            const tone = guideToneStyles[seg.tone];
            return (
              <div
                key={`${seg.from}-${seg.to}`}
                className={`absolute top-0 h-3 ${tone.bar}`}
                style={{ left: `${left}%`, width: `${width}%` }}
                aria-label={`${seg.from}〜${seg.to}分: ${seg.label}`}
                role="img"
              />
            );
          })}
        </div>
        {/* 目盛 */}
        <div className="relative mt-1 h-3" aria-hidden="true">
          {Array.from({ length: totalMinutes + 1 }).map((_, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 text-[11px] text-slate-500"
              style={{ left: `${(i / totalMinutes) * 100}%` }}
            >
              {i}
            </span>
          ))}
        </div>
        <div className="-mx-1 mt-3 grid grid-cols-6 gap-1">
          {segments.map((seg) => {
            const tone = guideToneStyles[seg.tone];
            return (
              <div
                key={`label-${seg.from}-${seg.to}`}
                className="flex flex-col gap-1 px-1"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${tone.bar}`}
                    aria-hidden="true"
                  />
                  <span className={tone.text}>{seg.label}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {seg.from}–{seg.to}分
                </div>
                <p className="text-[11px] leading-5 text-slate-600">{seg.say}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 縦リスト (< sm) */}
      <ol className="space-y-2 sm:hidden">
        {segments.map((seg) => {
          const tone = guideToneStyles[seg.tone];
          return (
            <li
              key={`m-${seg.from}-${seg.to}`}
              className={`rounded-lg border bg-white p-3 ${tone.border}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${tone.badge}`}
                >
                  {seg.from}–{seg.to}分
                </span>
                <span className={`text-xs font-semibold ${tone.text}`}>
                  {seg.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-slate-600">{seg.say}</p>
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-4 text-xs leading-6 text-slate-600">
        最初の1分で必ず未接続範囲を言い切ってから本編に入ること。締めの1分でロードマップを示す。
      </figcaption>
    </figure>
  );
}
