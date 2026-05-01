import { ListOrdered } from "lucide-react";
import type { GuideChapterMetaV3 } from "../../data/sample";

type Props = {
  chapters: GuideChapterMetaV3[];
};

/**
 * ガイドの目次。
 * - lg 以上: 親側で `lg:sticky lg:top-20` を当てて aside として固定表示する
 * - md 以下: <details> を使って折りたたみ表示
 */
export default function GuideToc({ chapters }: Props) {
  const totalMin = chapters.reduce((s, c) => s + c.estMin, 0);
  return (
    <>
      {/* デスクトップ — sticky aside (親で `lg:sticky lg:top-20` を付与) */}
      <nav
        aria-label="ガイドの目次"
        className="hidden rounded-xl border border-slate-200 bg-white p-4 shadow-card lg:block"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <ListOrdered size={14} aria-hidden="true" />
          目次 — 全{chapters.length}章 / 約{totalMin}分
        </div>
        <ol className="mt-3 space-y-1">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="group flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-900"
              >
                <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-navy-700">
                  {c.number}
                </span>
                <span className="flex-1 truncate">{c.title}</span>
                <span className="text-xs text-slate-400">{c.estMin}分</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* モバイル — <details> で折りたたみ */}
      <details className="group rounded-xl border border-slate-200 bg-white p-3 shadow-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-slate-700">
          <span className="flex items-center gap-2">
            <ListOrdered size={15} aria-hidden="true" />
            目次 — 全{chapters.length}章 / 約{totalMin}分
          </span>
          <span
            className="text-xs text-slate-400 group-open:hidden"
            aria-hidden="true"
          >
            開く
          </span>
          <span
            className="hidden text-xs text-slate-400 group-open:inline"
            aria-hidden="true"
          >
            閉じる
          </span>
        </summary>
        <ol className="mt-3 space-y-1">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-900"
              >
                <span className="font-mono text-xs font-semibold text-slate-400">
                  {c.number}
                </span>
                <span className="flex-1 truncate">{c.title}</span>
                <span className="text-xs text-slate-400">{c.estMin}分</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </>
  );
}
