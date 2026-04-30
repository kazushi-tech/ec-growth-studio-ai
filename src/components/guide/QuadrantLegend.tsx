import type { QuadrantCellV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";

type Props = {
  cells: QuadrantCellV2[];
};

/**
 * データ取込スコープを「実値 / デモ / 未接続 / 将来予定」の4区分で示す live grid。
 * 静的画像ではなく Tailwind tone を直接使うので、他画面の Pill / バナー色と一貫する。
 */
export default function QuadrantLegend({ cells }: Props) {
  return (
    <figure className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
      <ul
        className="grid gap-3 sm:grid-cols-2"
        aria-label="本MVPで担保しているデータの4区分"
      >
        {cells.map((c) => {
          const tone = guideToneStyles[c.tone];
          return (
            <li
              key={c.label}
              className={`rounded-xl border bg-white p-4 shadow-sm ${tone.border}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`text-sm font-semibold ${tone.text}`}>
                  {c.label}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${tone.chip}`}
                >
                  {c.pillLabel}
                </span>
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-600">{c.body}</p>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-xs leading-6 text-slate-600">
        各画面のラベルは常にこの4区分のいずれかで明示される。「実値」と「デモ」を混同しないことが上司デモの肝。
      </figcaption>
    </figure>
  );
}
