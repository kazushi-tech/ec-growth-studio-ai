import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ScreenAnatomyV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";

type Props = {
  screens: ScreenAnatomyV2[];
};

/**
 * 5画面の anatomy を mini-mockup + ホットスポット注釈で表現する live infographic。
 * 実画面と同じ block 構成を縮小して並べ、ブロック名と Why → What → Action を併記する。
 */
export default function MiniMockup({ screens }: Props) {
  return (
    <div className="space-y-5">
      {screens.map((s) => (
        <ScreenAnatomyCard key={s.id} screen={s} />
      ))}
    </div>
  );
}

function ScreenAnatomyCard({ screen }: { screen: ScreenAnatomyV2 }) {
  return (
    <article
      id={screen.id}
      aria-labelledby={`${screen.id}-title`}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-card sm:p-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3
            id={`${screen.id}-title`}
            className="text-sm font-semibold tracking-tight text-slate-900"
          >
            {screen.title}
          </h3>
          <p className="mt-1 text-xs leading-6 text-slate-600">
            {screen.oneLiner}
          </p>
        </div>
        <Link
          to={screen.to}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          画面を開く
          <ChevronRight size={12} aria-hidden="true" />
        </Link>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        {/* mini mockup */}
        <div className="lg:col-span-7">
          <div
            role="img"
            aria-label={`${screen.title} の構成ブロック: ${screen.blocks.map((b) => b.label).join(" / ")}`}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-3"
          >
            {/* mock topbar */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="h-2 w-2 rounded-full bg-rose-300" aria-hidden="true" />
              <div className="h-2 w-2 rounded-full bg-amber-300" aria-hidden="true" />
              <div className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
              <div className="ml-2 h-2 flex-1 rounded bg-slate-200" aria-hidden="true" />
            </div>
            {/* mock body — block の各要素を block と縮小行で表現 */}
            <ul className="mt-2 space-y-1.5">
              {screen.blocks.map((b, i) => {
                const tone = guideToneStyles[b.tone];
                return (
                  <li
                    key={b.label}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px]"
                  >
                    <span
                      className={`inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded text-[11px] font-semibold ${tone.badge}`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="truncate text-slate-700">{b.label}</span>
                    {/* 簡易プレースホルダ: 横ラインで block の存在感を表現 */}
                    <span
                      className={`ml-auto h-1.5 w-12 rounded-full ${tone.bar}`}
                      aria-hidden="true"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Why → What → Action */}
        <div className="space-y-2 lg:col-span-5">
          <ul className="space-y-2">
            {screen.reading.map((r) => (
              <li
                key={r.phase}
                className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50/40 p-2.5"
              >
                <span
                  className={`inline-flex h-5 min-w-[3rem] items-center justify-center rounded-md text-[11px] font-semibold ${
                    r.phase === "Why"
                      ? "bg-violet-100 text-violet-700"
                      : r.phase === "What"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {r.phase}
                </span>
                <p className="flex-1 text-xs leading-6 text-slate-700">{r.body}</p>
              </li>
            ))}
          </ul>
          {screen.hint && (
            <p className="rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 text-[11px] leading-5 text-amber-800">
              {screen.hint}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
