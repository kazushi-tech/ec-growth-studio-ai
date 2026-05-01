import { AlertCircle, Sparkles } from "lucide-react";
import type { GuideHeroV3 } from "../../data/sample";

type Props = {
  hero: GuideHeroV3;
};

export default function GuideHero({ hero }: Props) {
  return (
    <section
      aria-labelledby="guide-hero-title"
      className="relative overflow-hidden rounded-2xl border border-navy-200 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-6 py-9 text-white shadow-cardLg sm:px-10 sm:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-100">
          <Sparkles size={13} aria-hidden="true" />
          {hero.eyebrow}
        </div>
        <h2
          id="guide-hero-title"
          className="mt-5 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl lg:text-[34px]"
        >
          {hero.title}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-navy-100 sm:text-base sm:leading-8">
          {hero.lead}
        </p>

        <ul
          className="mt-7 grid gap-3 sm:grid-cols-3"
          aria-label="このツールの3つの特徴"
        >
          {hero.highlights.map((h) => (
            <li
              key={h.label}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
            >
              <div className="text-sm font-semibold text-emerald-200">
                {h.label}
              </div>
              <p className="mt-2 text-sm leading-7 text-navy-100">{h.body}</p>
            </li>
          ))}
        </ul>

        <div
          role="note"
          aria-label="必ず最初に伝える前提"
          className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-amber-100"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm leading-7 text-amber-50">
            <span className="font-semibold text-amber-100">
              必ず最初に伝える前提
            </span>
            <span className="mx-1.5 text-amber-200/70" aria-hidden="true">
              ·
            </span>
            {hero.caveat}
          </p>
        </div>
      </div>
    </section>
  );
}
