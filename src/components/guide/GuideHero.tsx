import { AlertCircle, Sparkles } from "lucide-react";
import type { GuideHeroV2 } from "../../data/sample";

type Props = {
  hero: GuideHeroV2;
};

export default function GuideHero({ hero }: Props) {
  return (
    <section
      aria-labelledby="guide-hero-title"
      className="relative overflow-hidden rounded-2xl border border-navy-200 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 py-7 text-white shadow-cardLg sm:px-8 sm:py-9"
    >
      {/* 装飾用グラデブロブ (decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-100">
          <Sparkles size={12} aria-hidden="true" />
          {hero.eyebrow}
        </div>
        <h2
          id="guide-hero-title"
          className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[28px]"
        >
          {hero.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-navy-100 sm:text-[15px]">
          {hero.lead}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {hero.bullets.map((b) => (
            <li
              key={b.label}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                {b.label}
              </div>
              <p className="mt-1.5 text-xs leading-6 text-navy-100">{b.body}</p>
            </li>
          ))}
        </ul>

        <div
          role="note"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-amber-100"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs leading-6">
            <span className="font-semibold text-amber-100">{hero.caveat.label}</span>
            <span className="mx-1.5 text-amber-200/70" aria-hidden="true">
              ·
            </span>
            <span className="text-amber-50">{hero.caveat.body}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
