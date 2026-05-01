import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleHelp,
  FileText,
  Layers,
  ListChecks,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import GuideHero from "../components/guide/GuideHero";
import GuideToc from "../components/guide/GuideToc";
import GuideImage from "../components/guide/GuideImage";
import {
  guideHeroV3,
  guideFirstStepsV3,
  guideChaptersV3,
  guideOrderRowsV3,
  guideScreenRowsV3,
  guideDataScopeRowsV3,
  guideFaqV3,
  guideImagesV3,
  type GuideStepV3,
  type GuideChapterMetaV3,
  type GuideOrderRowV3,
  type GuideScreenRowV3,
  type GuideDataScopeRowV3,
  type GuideFaqV3,
} from "../data/sample";

/**
 * /app/guide — Guide v3「利用者オンボーディング」。
 * 構造: Hero / まず3ステップ / sticky TOC / 5章 (全体像 / まず触る順番 / 画面別の使い方 / データ状態の見方 / よくある疑問) / 関連ドキュメント。
 * 上司デモの台本は本ガイドからは外し、フッターから docs/demo-script.md へリンクする。
 */
export default function Guide() {
  return (
    <>
      <Topbar
        title="ガイド"
        subtitle="はじめて使う方が、何をするツールかと、まず何を触るかを5分で掴めるオンボーディング"
        actions={
          <Link to="/app" className="btn-primary px-3 py-1.5 text-xs">
            ダッシュボードへ
          </Link>
        }
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <GuideHero hero={guideHeroV3} />

        {/* まず3ステップ */}
        <section
          aria-labelledby="first-steps-title"
          className="mt-8 sm:mt-10"
        >
          <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2
                id="first-steps-title"
                className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
              >
                まず3ステップで始める
              </h2>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                難しい設定なしに、この順番で触れば全体像がつかめるぞ。
              </p>
            </div>
            <a
              href="#ch-overview"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              詳しい使い方ガイドへ
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </header>
          <ol className="grid gap-4 md:grid-cols-3">
            {guideFirstStepsV3.map((s) => (
              <FirstStepCard key={s.num} step={s} />
            ))}
          </ol>
        </section>

        {/* メインガイド (TOC + 5章) */}
        <div className="mt-10 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <GuideToc chapters={guideChaptersV3} />
          </aside>

          <div className="mt-6 space-y-8 lg:mt-0">
            <ChapterOverview meta={guideChaptersV3[0]} />
            <ChapterOrder meta={guideChaptersV3[1]} rows={guideOrderRowsV3} />
            <ChapterScreens meta={guideChaptersV3[2]} rows={guideScreenRowsV3} />
            <ChapterDataScope meta={guideChaptersV3[3]} rows={guideDataScopeRowsV3} />
            <ChapterFaq meta={guideChaptersV3[4]} faqs={guideFaqV3} />

            {/* フッター — 関連ドキュメント */}
            <FooterDocs />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── まず3ステップ カード ─────────────────────────────────────

const stepToneStyles: Record<
  GuideStepV3["tone"],
  { badge: string; bar: string; numText: string }
> = {
  navy: { badge: "bg-navy-900 text-white", bar: "bg-navy-900", numText: "text-navy-900" },
  sky: { badge: "bg-sky-500 text-white", bar: "bg-sky-500", numText: "text-sky-700" },
  mint: { badge: "bg-emerald-500 text-white", bar: "bg-emerald-500", numText: "text-emerald-700" },
  gold: { badge: "bg-amber-500 text-white", bar: "bg-amber-500", numText: "text-amber-700" },
  violet: { badge: "bg-violet-500 text-white", bar: "bg-violet-500", numText: "text-violet-700" },
  rose: { badge: "bg-rose-500 text-white", bar: "bg-rose-500", numText: "text-rose-700" },
};

function FirstStepCard({ step }: { step: GuideStepV3 }) {
  const tone = stepToneStyles[step.tone];
  return (
    <li className="card overflow-hidden">
      <div className={`h-1 w-full ${tone.bar}`} aria-hidden="true" />
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold ${tone.badge}`}
            aria-hidden="true"
          >
            {step.num}
          </span>
          <span className={`text-xs font-semibold uppercase tracking-wide ${tone.numText}`}>
            STEP {step.num}
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          {step.title}
        </h3>
        <p className="text-sm leading-7 text-slate-600">{step.body}</p>
        <Link
          to={step.to}
          className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900"
        >
          {step.toLabel}
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

// ─── 章ラッパー ────────────────────────────────────────────────

const chapterToneStyles: Record<
  GuideChapterMetaV3["tone"],
  { bar: string; badge: string }
> = {
  navy: { bar: "bg-navy-900", badge: "bg-navy-900 text-white" },
  sky: { bar: "bg-sky-500", badge: "bg-sky-500 text-white" },
  mint: { bar: "bg-emerald-500", badge: "bg-emerald-500 text-white" },
  gold: { bar: "bg-amber-500", badge: "bg-amber-500 text-white" },
  violet: { bar: "bg-violet-500", badge: "bg-violet-500 text-white" },
  rose: { bar: "bg-rose-500", badge: "bg-rose-500 text-white" },
};

function ChapterShell({
  meta,
  icon,
  children,
}: {
  meta: GuideChapterMetaV3;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const tone = chapterToneStyles[meta.tone];
  return (
    <section
      id={meta.id}
      aria-labelledby={`${meta.id}-title`}
      className="card scroll-mt-24 overflow-hidden"
    >
      <div className={`h-1 w-full ${tone.bar}`} aria-hidden="true" />
      <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-start gap-4">
          <span
            className={`inline-flex h-10 min-w-[3rem] items-center justify-center rounded-lg px-2.5 text-base font-semibold ${tone.badge}`}
            aria-hidden="true"
          >
            {meta.number}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={`${meta.id}-title`}
              className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
            >
              {icon ? (
                <span className="text-slate-500" aria-hidden="true">
                  {icon}
                </span>
              ) : null}
              {meta.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {meta.intro}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            約{meta.estMin}分
          </span>
        </header>

        {children}
      </div>
    </section>
  );
}

// ─── 01 全体像 ────────────────────────────────────────────────

function ChapterOverview({ meta }: { meta: GuideChapterMetaV3 }) {
  return (
    <ChapterShell meta={meta} icon={<Sparkles size={20} />}>
      <GuideImage image={guideImagesV3.overview} />

      <div className="grid gap-3 sm:grid-cols-2">
        <OverviewItem
          label="AI診断"
          body="商品 / 流入 / CRM / 在庫 の4領域で、課題と改善機会の候補を量で出す。"
        />
        <OverviewItem
          label="人間レビュー"
          body="AI が出した候補から、採用するものと優先順位を担当者が決める。"
        />
        <OverviewItem
          label="施策実行"
          body="施策ボードで担当・期限・期待値を埋めて運用に乗せる。"
        />
        <OverviewItem
          label="月次報告"
          body="月次レポートに整え、末尾の「次月の優先施策3件」で翌月会議へ繋ぐ。"
        />
      </div>

      <details className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-800">
          <span>このループが大事な理由（もっと詳しく）</span>
          <ChevronRight
            size={16}
            className="shrink-0 text-slate-400 transition-transform group-open:rotate-90"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
          <p>
            EC の改善は「気づき」だけでは進まない。誰が・いつまでに・何を・どこまでやるか まで埋めて初めて運用に乗る。本ツールは AI による気づきの量を担保しつつ、最終判断と実行管理を担当者の手に残すために設計されておる。
          </p>
          <p>
            毎月同じ順序で同じ画面を回すことで、属人性を抑え、担当が変わっても継続できる運用にする。これが「BPaaS（Business Process as a Service）」として伴走する側面じゃ。
          </p>
        </div>
      </details>
    </ChapterShell>
  );
}

function OverviewItem({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="text-sm font-semibold text-navy-900">{label}</div>
      <p className="mt-1.5 text-sm leading-7 text-slate-700">{body}</p>
    </div>
  );
}

// ─── 02 まず触る順番 ──────────────────────────────────────────

function ChapterOrder({
  meta,
  rows,
}: {
  meta: GuideChapterMetaV3;
  rows: GuideOrderRowV3[];
}) {
  return (
    <ChapterShell meta={meta} icon={<ListChecks size={20} />}>
      <ol className="space-y-3">
        {rows.map((r) => (
          <li
            key={r.num}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-base font-semibold text-white"
            >
              {r.num}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-slate-900">
                {r.title}
              </h3>
              <p className="mt-1.5 text-sm leading-7 text-slate-700">
                {r.body}
              </p>
            </div>
            <Link
              to={r.to}
              className="inline-flex shrink-0 items-center gap-1 self-start rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:bg-slate-50 hover:text-navy-900"
            >
              {r.toLabel}
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>

      <aside
        role="note"
        className="rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3 sm:px-5 sm:py-4"
      >
        <p className="text-sm leading-7 text-slate-700">
          <span className="font-semibold text-sky-800">ポイント</span>
          <span className="mx-1.5 text-sky-400" aria-hidden="true">·</span>
          毎月この順序で回すこと自体が運用設計じゃ。順番を入れ替えると、AI の気づきが施策ボードに乗らず、効果検証も翌月レポートに反映されにくくなる。
        </p>
      </aside>
    </ChapterShell>
  );
}

// ─── 03 画面別の使い方 ────────────────────────────────────────

function ChapterScreens({
  meta,
  rows,
}: {
  meta: GuideChapterMetaV3;
  rows: GuideScreenRowV3[];
}) {
  return (
    <ChapterShell meta={meta} icon={<Layers size={20} />}>
      <GuideImage image={guideImagesV3.screenMap} />

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="table-clean min-w-[40rem]">
          <thead>
            <tr>
              <th scope="col" className="w-[18%]">画面</th>
              <th scope="col" className="w-[42%]">何を見る</th>
              <th scope="col" className="w-[40%]">次にすること</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row" className="px-3 py-3 text-left align-top">
                  <Link
                    to={r.to}
                    className="inline-flex items-center gap-1 text-sm font-medium text-navy-800 hover:text-navy-900"
                  >
                    {r.name}
                    <ChevronRight size={12} aria-hidden="true" />
                  </Link>
                </th>
                <td className="align-top text-sm leading-7">{r.watch}</td>
                <td className="align-top text-sm leading-7">{r.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          各画面の補足
        </p>
        {rows.map((r) => (
          <details
            key={`${r.id}-detail`}
            className="group rounded-xl border border-slate-200 bg-white p-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-800">
              <span>{r.name} — もっと詳しく</span>
              <ChevronRight
                size={16}
                className="shrink-0 text-slate-400 transition-transform group-open:rotate-90"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 text-sm leading-7 text-slate-700">{r.detail}</p>
            <div className="mt-3">
              <Link
                to={r.to}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:bg-slate-50 hover:text-navy-900"
              >
                {r.name} を開く
                <ChevronRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </details>
        ))}
      </div>
    </ChapterShell>
  );
}

// ─── 04 データ状態の見方 ──────────────────────────────────────

const dataScopeRowStyles: Record<
  GuideDataScopeRowV3["tone"],
  { chip: string }
> = {
  navy: { chip: "bg-navy-50 text-navy-900 ring-1 ring-navy-100" },
  sky: { chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-100" },
  mint: { chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" },
  gold: { chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" },
  violet: { chip: "bg-violet-50 text-violet-700 ring-1 ring-violet-100" },
  rose: { chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-100" },
};

function ChapterDataScope({
  meta,
  rows,
}: {
  meta: GuideChapterMetaV3;
  rows: GuideDataScopeRowV3[];
}) {
  return (
    <ChapterShell meta={meta} icon={<MapIcon size={20} />}>
      <GuideImage image={guideImagesV3.dataScope} />

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="table-clean min-w-[40rem]">
          <thead>
            <tr>
              <th scope="col" className="w-[18%]">区分</th>
              <th scope="col" className="w-[42%]">具体例</th>
              <th scope="col" className="w-[40%]">どの数字が動くか</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.category}>
                <th scope="row" className="px-3 py-3 text-left align-top">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dataScopeRowStyles[r.tone].chip}`}
                  >
                    {r.category}
                  </span>
                </th>
                <td className="align-top text-sm leading-7">{r.example}</td>
                <td className="align-top text-sm leading-7">{r.flow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="group rounded-xl border border-rose-200 bg-rose-50/40 p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-rose-800">
          <span>注意 — 誤認させる文言は使わない</span>
          <ChevronRight
            size={16}
            className="shrink-0 text-rose-400 transition-transform group-open:rotate-90"
            aria-hidden="true"
          />
        </summary>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          「接続完了」「実データと接続済み」のような完了形の表現はデモ・資料・画面のいずれでも使わない方針じゃ。常に上の4区分（実値 / デモ / 未接続 / 将来予定）で話すようにしてほしい。Production 環境では BigQuery デモ Mode のトグルを ON にしても安全に停止し、CSV / サンプル値にフォールバックする。
        </p>
      </details>
    </ChapterShell>
  );
}

// ─── 05 よくある疑問 ──────────────────────────────────────────

function ChapterFaq({
  meta,
  faqs,
}: {
  meta: GuideChapterMetaV3;
  faqs: GuideFaqV3[];
}) {
  return (
    <ChapterShell meta={meta} icon={<CircleHelp size={20} />}>
      <ol className="space-y-3">
        {faqs.map((f, i) => (
          <li key={f.q}>
            <details className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-base font-semibold text-slate-900">
                <span className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-semibold text-rose-700 ring-1 ring-rose-100"
                  >
                    Q{i + 1}
                  </span>
                  <span>{f.q}</span>
                </span>
                <ChevronRight
                  size={16}
                  className="mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-90"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 pl-10 text-sm leading-7 text-slate-700">
                {f.a}
              </p>
            </details>
          </li>
        ))}
      </ol>
    </ChapterShell>
  );
}

// ─── フッター — 関連ドキュメント ──────────────────────────────

function FooterDocs() {
  return (
    <section
      aria-labelledby="footer-docs-title"
      className="card overflow-hidden"
    >
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-slate-500" aria-hidden="true" />
          <h2
            id="footer-docs-title"
            className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
          >
            次に読む
          </h2>
        </div>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          上司・社内向けに説明するときは台本を、画面別の細かい仕様は製品仕様を参照してくれ。
        </p>
        <ul
          aria-label="関連ドキュメント"
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <li>
            <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/40 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText size={16} className="text-rose-500" aria-hidden="true" />
                社内説明・上司デモ用台本を見る
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                5〜10分でデモする際の話す内容と、誤認を避けるための前置き例をまとめた台本じゃ。本ガイドからは外してこちらに退避しておる。
              </p>
              <p className="mt-3 font-mono text-xs text-slate-500">
                docs/demo-script.md
              </p>
              <a
                href="https://github.com/kazushi-tech/ec-growth-studio-ai/blob/main/docs/demo-script.md"
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-navy-700 hover:text-navy-900"
              >
                docs/demo-script.md を開く
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </article>
          </li>
          <li>
            <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50/40 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText size={16} className="text-navy-700" aria-hidden="true" />
                プロダクト仕様の正本
              </div>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                画面別の仕様、データ接続状況、Phase ロードマップは製品仕様にまとめておる。
              </p>
              <p className="mt-3 font-mono text-xs text-slate-500">
                docs/product-spec.md
              </p>
              <a
                href="https://github.com/kazushi-tech/ec-growth-studio-ai/blob/main/docs/product-spec.md"
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-navy-700 hover:text-navy-900"
              >
                docs/product-spec.md を開く
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </article>
          </li>
        </ul>
      </div>
    </section>
  );
}
