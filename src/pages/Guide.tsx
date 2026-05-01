import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Database,
  FileText,
  LayoutGrid,
  ListChecks,
  MousePointer2,
  Route,
  Sparkles,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Pill from "../components/ui/Pill";
import {
  guideDataScopeRowsV3,
  guideFaqV3,
  guideFirstStepsV3,
  guideOrderRowsV3,
  guideScreenRowsV3,
  type GuideDataScopeRowV3,
  type GuideFaqV3,
  type GuideOrderRowV3,
  type GuideScreenRowV3,
  type GuideStepV3,
} from "../data/sample";

type GuideTab = "overview" | "order" | "screens" | "data" | "faq";

const guideTabs: { id: GuideTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutGrid size={14} /> },
  { id: "order", label: "操作順", icon: <Route size={14} /> },
  { id: "screens", label: "画面別", icon: <ListChecks size={14} /> },
  { id: "data", label: "データ状態", icon: <Database size={14} /> },
  { id: "faq", label: "FAQ", icon: <CircleHelp size={14} /> },
];

const tabDescriptions: Record<GuideTab, string> = {
  overview:
    "EC Growth Studio AI の役割と、最初に見るべき3つの判断ポイントを確認する。",
  order:
    "毎月の運用で触る順番を、画面遷移と次アクションに分けて確認する。",
  screens:
    "各画面で何を見るか、どこへ進むかをGA4風の早見表で確認する。",
  data:
    "実値 / デモ / 未接続 / 将来予定 の区分を確認し、誤認を避ける。",
  faq: "初見で迷いやすい質問だけを折りたたみで確認する。",
};

const dataTone: Record<
  GuideDataScopeRowV3["tone"],
  "mint" | "sky" | "gold" | "violet" | "rose" | "slate"
> = {
  navy: "slate",
  sky: "sky",
  mint: "mint",
  gold: "gold",
  violet: "violet",
  rose: "rose",
};

export default function Guide() {
  const [activeTab, setActiveTab] = useState<GuideTab>("overview");
  const activeLabel = useMemo(
    () => guideTabs.find((tab) => tab.id === activeTab)?.label ?? "Overview",
    [activeTab],
  );

  return (
    <>
      <Topbar
        title="ガイド"
        subtitle="GA4風の早見表で、月次EC改善BPaaSの触り方とデータ状態を確認"
        actions={
          <Link to="/app" className="btn-primary px-3 py-1.5 text-xs">
            ダッシュボードへ
          </Link>
        }
      />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        <GuideCommandBar />

        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="sky" size="xs">
                    Guide v4
                  </Pill>
                  <Pill tone="gold" size="xs">
                    実API未接続
                  </Pill>
                  <Pill tone="mint" size="xs">
                    CSV-first
                  </Pill>
                </div>
                <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                  月次EC改善を迷わず回すための操作ガイド
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>読む順番: 目的 → 操作順 → 画面別 → データ状態</span>
                <Link
                  to="/app/data-import"
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
                >
                  CSV取込へ
                  <ChevronRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid min-h-[640px] min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
            <main className="min-w-0 overflow-hidden border-slate-100 lg:border-r">
              <TabBar activeTab={activeTab} onChange={setActiveTab} />

              <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {activeLabel}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span>{tabDescriptions[activeTab]}</span>
                </div>
              </div>

              <div className="p-4">
                {activeTab === "overview" && (
                  <OverviewPanel steps={guideFirstStepsV3} />
                )}
                {activeTab === "order" && (
                  <OrderPanel rows={guideOrderRowsV3} />
                )}
                {activeTab === "screens" && (
                  <ScreensPanel rows={guideScreenRowsV3} />
                )}
                {activeTab === "data" && (
                  <DataPanel rows={guideDataScopeRowsV3} />
                )}
                {activeTab === "faq" && <FaqPanel faqs={guideFaqV3} />}
              </div>
            </main>

            <aside className="space-y-3 bg-slate-50/60 p-4">
              <SideSummary />
              <DataScopeMini rows={guideDataScopeRowsV3} />
              <NextDocs />
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}

function GuideCommandBar() {
  return (
    <section
      aria-label="ガイドの要点"
      className="grid gap-2 md:grid-cols-4"
    >
      <CompactMetric
        icon={<Sparkles size={14} />}
        label="このツール"
        value="月次EC改善ループ"
        note="AI診断から実行管理まで"
        tone="navy"
      />
      <CompactMetric
        icon={<MousePointer2 size={14} />}
        label="まずやること"
        value="データ → 課題 → 施策"
        note="3ステップで開始"
        tone="sky"
      />
      <CompactMetric
        icon={<Database size={14} />}
        label="データ状態"
        value="実値 / デモ / 未接続"
        note="区分を常時明示"
        tone="mint"
      />
      <CompactMetric
        icon={<AlertTriangle size={14} />}
        label="注意"
        value="実APIは未接続"
        note="Productionは安全停止"
        tone="gold"
      />
    </section>
  );
}

function CompactMetric({
  icon,
  label,
  value,
  note,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  tone: "navy" | "sky" | "mint" | "gold";
}) {
  const toneClass =
    tone === "navy"
      ? "border-navy-200 bg-white text-navy-900"
      : tone === "sky"
        ? "border-sky-200 bg-sky-50/60 text-sky-900"
        : tone === "mint"
          ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
          : "border-amber-200 bg-amber-50/60 text-amber-900";

  return (
    <div className={`rounded-lg border px-3 py-2.5 ${toneClass}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className="text-slate-500" aria-hidden="true">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{note}</div>
    </div>
  );
}

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: GuideTab;
  onChange: (tab: GuideTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="ガイドカテゴリ"
      className="flex w-full max-w-full gap-1 overflow-x-auto border-b border-slate-100 bg-white px-3 py-2"
    >
      {guideTabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-navy-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function OverviewPanel({ steps }: { steps: GuideStepV3[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                  {step.num}
                </span>
                <Link
                  to={step.to}
                  className="text-xs font-medium text-sky-700 hover:text-sky-900"
                >
                  {step.toLabel}
                </Link>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
            月次改善ループ
          </div>
          <div className="grid gap-2 p-3 sm:grid-cols-4">
            {[
              ["AI診断", "候補を量で出す", "violet"],
              ["人間レビュー", "採用を決める", "mint"],
              ["施策実行", "担当・期限を持つ", "sky"],
              ["月次報告", "翌月会議へ繋ぐ", "navy"],
            ].map(([label, note, tone]) => (
              <div key={label} className="rounded-md border border-slate-100 bg-slate-50/70 p-3">
                <Pill
                  tone={
                    tone === "violet"
                      ? "violet"
                      : tone === "mint"
                        ? "mint"
                        : tone === "sky"
                          ? "sky"
                          : "slate"
                  }
                  size="xs"
                >
                  {label}
                </Pill>
                <p className="mt-2 text-xs leading-5 text-slate-600">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
          <AlertTriangle size={14} aria-hidden="true" />
          最初に共有する前提
        </div>
        <p className="mt-2 text-xs leading-6 text-amber-900">
          本MVPは実 GCP / 実 BigQuery / 実 GA4 API / 実広告API / 実AI API
          には未接続。CSV取込と Preview 限定デモで運用フローを確認する。
        </p>
      </div>
    </div>
  );
}

function OrderPanel({ rows }: { rows: GuideOrderRowV3[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="table-clean min-w-[48rem]">
        <thead>
          <tr>
            <th className="!w-12">Step</th>
            <th>操作</th>
            <th>見るもの</th>
            <th className="!w-36">開く画面</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.num}>
              <td className="font-mono text-xs text-slate-400">{row.num}</td>
              <td className="font-medium text-slate-900">{row.title}</td>
              <td className="text-sm leading-6 text-slate-600">{row.body}</td>
              <td>
                <Link
                  to={row.to}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {row.toLabel}
                  <ChevronRight size={12} aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScreensPanel({ rows }: { rows: GuideScreenRowV3[] }) {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="table-clean min-w-[52rem]">
          <thead>
            <tr>
              <th className="!w-40">画面</th>
              <th>何を見る</th>
              <th>次にすること</th>
              <th className="!w-24">移動</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="font-medium text-navy-900">{row.name}</td>
                <td className="text-sm leading-6 text-slate-600">{row.watch}</td>
                <td className="text-sm leading-6 text-slate-600">{row.next}</td>
                <td>
                  <Link
                    to={row.to}
                    className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900"
                  >
                    開く
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {rows.map((row) => (
          <details
            key={`${row.id}-detail`}
            className="group rounded-lg border border-slate-200 bg-white p-3"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-slate-800">
              <span>{row.name} の補足</span>
              <ChevronRight
                size={14}
                className="text-slate-400 transition-transform group-open:rotate-90"
                aria-hidden="true"
              />
            </summary>
            <p className="mt-2 text-xs leading-6 text-slate-600">{row.detail}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function DataPanel({ rows }: { rows: GuideDataScopeRowV3[] }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.category}
            className="rounded-lg border border-slate-200 bg-white p-3"
          >
            <Pill tone={dataTone[row.tone]} size="xs">
              {row.category}
            </Pill>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {row.example}
            </p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="table-clean min-w-[44rem]">
          <thead>
            <tr>
              <th className="!w-28">区分</th>
              <th>具体例</th>
              <th>数字への影響</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.category}>
                <td>
                  <Pill tone={dataTone[row.tone]} size="xs">
                    {row.category}
                  </Pill>
                </td>
                <td>{row.example}</td>
                <td>{row.flow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="group rounded-lg border border-rose-200 bg-rose-50/50 p-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-rose-800">
          <span>誤認を避ける表現ルール</span>
          <ChevronRight
            size={14}
            className="text-rose-400 transition-transform group-open:rotate-90"
            aria-hidden="true"
          />
        </summary>
        <p className="mt-2 text-xs leading-6 text-slate-700">
          接続完了のように見える完了形の表現は使わない。常に「実値 / デモ /
          未接続 / 将来予定」の区分で説明する。
        </p>
      </details>
    </div>
  );
}

function FaqPanel({ faqs }: { faqs: GuideFaqV3[] }) {
  return (
    <div className="grid min-w-0 gap-2 lg:grid-cols-2">
      {faqs.map((faq, index) => (
        <details
          key={faq.q}
          className="group min-w-0 rounded-lg border border-slate-200 bg-white p-3"
        >
          <summary className="flex min-w-0 cursor-pointer list-none items-start justify-between gap-2 text-sm font-semibold text-slate-900">
            <span className="flex min-w-0 items-start gap-2 break-words">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                Q{index + 1}
              </span>
              {faq.q}
            </span>
            <ChevronRight
              size={14}
              className="mt-1 shrink-0 text-slate-400 transition-transform group-open:rotate-90"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-2 break-words pl-8 text-xs leading-6 text-slate-600">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}

function SideSummary() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <CheckCircle2 size={14} className="text-emerald-600" aria-hidden="true" />
        この画面で分かること
      </div>
      <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600">
        <li>・最初に触る順番</li>
        <li>・画面ごとの判断ポイント</li>
        <li>・どの数字が実値/デモ/未接続か</li>
      </ul>
    </div>
  );
}

function DataScopeMini({ rows }: { rows: GuideDataScopeRowV3[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Database size={14} aria-hidden="true" />
        データ状態
      </div>
      <div className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.category}
            className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2 py-1.5"
          >
            <Pill tone={dataTone[row.tone]} size="xs">
              {row.category}
            </Pill>
            <span className="truncate text-xs text-slate-500">{row.example}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextDocs() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <BookOpen size={14} aria-hidden="true" />
        関連ドキュメント
      </div>
      <div className="mt-2 space-y-2 text-xs">
        <a
          href="https://github.com/kazushi-tech/ec-growth-studio-ai/blob/main/docs/demo-script.md"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-2 rounded-md border border-slate-100 px-2 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          <span className="inline-flex items-center gap-1.5">
            <FileText size={13} aria-hidden="true" />
            デモ台本
          </span>
          <ChevronRight size={13} aria-hidden="true" />
        </a>
        <a
          href="https://github.com/kazushi-tech/ec-growth-studio-ai/blob/main/docs/product-spec.md"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-2 rounded-md border border-slate-100 px-2 py-2 font-medium text-slate-700 hover:bg-slate-50"
        >
          <span className="inline-flex items-center gap-1.5">
            <FileText size={13} aria-hidden="true" />
            製品仕様
          </span>
          <ChevronRight size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
