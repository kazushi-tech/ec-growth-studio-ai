import { Users, Clock, ArrowRight } from "lucide-react";
import type { GuideReadingPathV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";

type Props = {
  paths: GuideReadingPathV2[];
};

export default function GuideReadingPath({ paths }: Props) {
  return (
    <section aria-labelledby="guide-reading-path-title">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Users size={16} className="text-slate-500" aria-hidden="true" />
        <h2 id="guide-reading-path-title">読み方ガイド (Reading path)</h2>
      </div>
      <p className="mb-4 text-xs leading-6 text-slate-500">
        読者ごとに最短ルートを用意した。下の章に直接ジャンプできる。
      </p>
      <ul className="grid gap-3 md:grid-cols-3">
        {paths.map((p) => {
          const tone = guideToneStyles[p.tone];
          return (
            <li
              key={p.id}
              className={`rounded-xl border bg-white p-4 shadow-card ${tone.border}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tone.chip}`}
                >
                  {p.audience}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock size={11} aria-hidden="true" />
                  {p.estMin}
                </span>
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                {p.description}
              </p>
              <ol className="mt-3 space-y-1.5">
                {p.route.map((r, i) => (
                  <li key={r.anchor} className="flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${tone.badge}`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <a
                      href={`#${r.anchor}`}
                      className="rounded text-slate-700 underline-offset-2 hover:text-navy-900 hover:underline"
                    >
                      {r.label}
                    </a>
                    {i < p.route.length - 1 && (
                      <ArrowRight
                        size={11}
                        className="ml-auto text-slate-300"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
