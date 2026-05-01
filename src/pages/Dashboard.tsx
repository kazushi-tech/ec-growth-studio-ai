import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  AlertTriangle,
  Target,
  ListChecks,
  Boxes,
  ArrowRight,
  ChevronRight,
  CalendarClock,
  Users,
  RefreshCw,
  Database,
  Lightbulb,
  AlertCircle,
  Info,
  LayoutGrid,
  TrendingUp,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import KpiCard from "../components/ui/KpiCard";
import SectionCard from "../components/ui/SectionCard";
import CycleProgress from "../components/ui/CycleProgress";
import PriorityMap from "../components/ui/PriorityMap";
import Pill, {
  impactTone,
  judgmentTone,
  statusTone,
} from "../components/ui/Pill";
import { actions, kpis as sampleKpis, products } from "../data/sample";
import { useImport } from "../lib/csv/ImportContext";
import { buildKpisFromImport } from "../lib/csv/buildKpis";
import {
  BQ_DEMO_DEFAULT_FROM,
  BQ_DEMO_DEFAULT_TO,
  BqFetchError,
  fetchBqOrdersDaily,
} from "../lib/bq/client";
import type { BqOrdersDailySuccess } from "../lib/bq/types";
import { buildKpisFromBqDemo } from "../lib/bq/buildKpisFromBqDemo";

type DataSource = "bq-demo" | "csv" | "sample";

// `/api/bq/orders-daily` から `NOT_IMPLEMENTED` が返るのは Production の安全停止仕様
// （`BQ_MOCK_MODE` 未設定で実 BigQuery クエリ未実装）。これを「壊れた」ではなく
// 「Preview 専用デモが Production では安全停止中」という案内として扱うため、
// 通常の取得失敗とはトーンを分ける。
type BqDemoFailure =
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

const PRODUCTION_BQ_DEMO_SAFE_STOP_HOSTS = new Set([
  "ec-growth-studio-ai.vercel.app",
  "ec-growth-studio-ai-kazushis-projects-49d4e473.vercel.app",
]);

function shouldClientStopBqDemoOnProduction(): boolean {
  if (typeof window === "undefined") return false;
  return PRODUCTION_BQ_DEMO_SAFE_STOP_HOSTS.has(window.location.hostname);
}

export default function Dashboard() {
  const { ordersImport, ga4Import, adsImport } = useImport();
  const top5 = actions.slice(0, 5);
  const [activeWorkbench, setActiveWorkbench] = useState<
    "actions" | "products" | "data" | "insights"
  >("actions");

  const [bqDemoEnabled, setBqDemoEnabled] = useState(false);
  const [bqDemoLoading, setBqDemoLoading] = useState(false);
  const [bqDemoData, setBqDemoData] = useState<BqOrdersDailySuccess | null>(
    null,
  );
  const [bqDemoFailure, setBqDemoFailure] = useState<BqDemoFailure | null>(
    null,
  );

  useEffect(() => {
    if (!bqDemoEnabled) {
      setBqDemoData(null);
      setBqDemoFailure(null);
      setBqDemoLoading(false);
      return;
    }
    const controller = new AbortController();
    setBqDemoLoading(true);
    setBqDemoFailure(null);
    if (shouldClientStopBqDemoOnProduction()) {
      setBqDemoFailure({ kind: "unavailable" });
      setBqDemoLoading(false);
      setBqDemoData(null);
      return () => controller.abort();
    }
    fetchBqOrdersDaily({
      from: BQ_DEMO_DEFAULT_FROM,
      to: BQ_DEMO_DEFAULT_TO,
      signal: controller.signal,
    })
      .then((data) => {
        setBqDemoData(data);
        setBqDemoLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (err instanceof BqFetchError && err.errorCode === "NOT_IMPLEMENTED") {
          setBqDemoFailure({ kind: "unavailable" });
        } else {
          const message =
            err instanceof BqFetchError
              ? `${err.errorCode}: ${err.message}`
              : err instanceof Error
                ? err.message
                : "BigQueryデモの取得に失敗しました";
          setBqDemoFailure({ kind: "error", message });
        }
        setBqDemoLoading(false);
        setBqDemoData(null);
      });
    return () => controller.abort();
  }, [bqDemoEnabled]);

  const usingBqDemo = bqDemoEnabled && bqDemoData !== null;
  const source: DataSource = usingBqDemo
    ? "bq-demo"
    : ordersImport
      ? "csv"
      : "sample";

  const kpis = usingBqDemo
    ? buildKpisFromBqDemo(bqDemoData.summary)
    : ordersImport
      ? buildKpisFromImport(ordersImport.aggregation)
      : sampleKpis;

  return (
    <>
      <Topbar
        title="EC売上改善ダッシュボード"
        subtitle="商品・広告・CRM・在庫を横断して、今月直すべき売上改善をAIが整理"
        actions={
          <>
            <Link
              to="/app/action-board"
              className="btn-primary px-3 py-1.5 text-xs"
            >
              次に実行する施策を確認
            </Link>
            <Link
              to="/app/monthly-report"
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              月次レポート生成
            </Link>
          </>
        }
      />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        <DataSourceBar
          source={source}
          bqDemoEnabled={bqDemoEnabled}
          bqDemoLoading={bqDemoLoading}
          onToggleBqDemo={() => setBqDemoEnabled((v) => !v)}
          bqDemoMeta={bqDemoData}
          bqDemoFailure={bqDemoFailure}
        />

        {bqDemoFailure?.kind === "unavailable" && (
          <div className="flex flex-wrap items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-[11px] text-amber-900">
            <Info size={14} className="mt-0.5 shrink-0 text-amber-700" />
            <div className="flex-1 space-y-1">
              <div className="text-xs font-semibold text-amber-900">
                BigQueryデモは Preview 環境専用です
              </div>
              <p className="leading-5 text-amber-800">
                Production では実GCPへ誤接続しないよう安全停止しています。CSV / サンプル値を表示中です。
                BigQuery接続後の見え方は <span className="font-mono">BQ_MOCK_MODE=true</span> の Preview で確認できます。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBqDemoEnabled(false)}
              className="ml-auto text-amber-800 hover:text-amber-900"
            >
              トグルをOFFにする →
            </button>
          </div>
        )}

        {bqDemoFailure?.kind === "error" && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2 text-[11px] text-rose-800">
            <AlertCircle size={12} />
            <span className="font-semibold">BigQueryデモの取得に失敗:</span>
            <span className="font-mono">{bqDemoFailure.message}</span>
            <span className="text-rose-700/70">
              （CSV/サンプル値にフォールバック）
            </span>
            <button
              type="button"
              onClick={() => setBqDemoEnabled(false)}
              className="ml-auto text-rose-700 hover:text-rose-900"
            >
              デモをOFFにする →
            </button>
          </div>
        )}

        {ordersImport && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-[11px] text-emerald-800">
            <Database size={12} />
            <span className="font-semibold">CSV取込済み:</span>
            <span className="font-mono">{ordersImport.fileName}</span>
            <span className="text-emerald-700/70">
              （売上・注文数・AOVを再計算 / 取込
              {ordersImport.parseResult.acceptedRows.toLocaleString("ja-JP")}件）
            </span>
            <Link
              to="/app/data-import"
              className="ml-auto text-emerald-700 hover:text-emerald-900"
            >
              取込結果を見る →
            </Link>
          </div>
        )}

        <DataStateSummary
          ordersImport={ordersImport}
          ga4Import={ga4Import}
          adsImport={adsImport}
          bqDemoEnabled={bqDemoEnabled}
          bqDemoFailure={bqDemoFailure}
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <KpiCard key={k.key} kpi={k} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)_300px]">
          <MonthlyStatusCard source={source} />
          <AiBriefCard />
          <NextActionCard />
        </div>

        <SectionCard
          title="月次改善ワークベンチ"
          icon={<LayoutGrid size={16} />}
          bodyClassName="!p-0"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <WorkbenchTabs
              active={activeWorkbench}
              onChange={setActiveWorkbench}
            />
          </div>
          {activeWorkbench === "actions" && (
            <ActionsWorkbench top5={top5} />
          )}
          {activeWorkbench === "products" && <ProductsWorkbench />}
          {activeWorkbench === "data" && (
            <DataWorkbench
              ordersImport={ordersImport}
              ga4Import={ga4Import}
              adsImport={adsImport}
              bqDemoEnabled={bqDemoEnabled}
              bqDemoFailure={bqDemoFailure}
            />
          )}
          {activeWorkbench === "insights" && <InsightsWorkbench />}
        </SectionCard>
      </div>
    </>
  );
}

function DataSourceBar({
  source,
  bqDemoEnabled,
  bqDemoLoading,
  onToggleBqDemo,
  bqDemoMeta,
  bqDemoFailure,
}: {
  source: DataSource;
  bqDemoEnabled: boolean;
  bqDemoLoading: boolean;
  onToggleBqDemo: () => void;
  bqDemoMeta: BqOrdersDailySuccess | null;
  bqDemoFailure: BqDemoFailure | null;
}) {
  const sourceLabel =
    source === "bq-demo"
      ? "BigQueryデモ"
      : source === "csv"
        ? "CSV取込"
        : "サンプル";
  const sourceTone =
    source === "bq-demo" ? "mint" : source === "csv" ? "sky" : "slate";

  // ON 時のトグル右側のステータス文言。
  // - 取得中
  // - Production 安全停止（NOT_IMPLEMENTED）→ Preview 専用 / 安全停止
  // - 取得失敗（その他のエラー）→ 取得失敗
  // - 取得成功 → デモデータ表示中
  const toggleStatus = bqDemoLoading
    ? "取得中…"
    : !bqDemoEnabled
      ? "OFF"
      : bqDemoFailure?.kind === "unavailable"
        ? "ON（Preview専用 / 安全停止中）"
        : bqDemoFailure?.kind === "error"
          ? "ON（取得失敗）"
          : "ON（デモデータ表示中）";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 shadow-card">
      <div className="flex items-center gap-2">
        <Database size={12} className="text-slate-500" />
        <span className="font-semibold text-slate-700">データソース:</span>
        <Pill tone={sourceTone} size="xs">
          {sourceLabel}
        </Pill>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={bqDemoEnabled}
          aria-label="BigQueryデモを切り替え"
          onClick={onToggleBqDemo}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            bqDemoEnabled ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              bqDemoEnabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className="font-medium text-slate-700">BigQueryデモ</span>
        <span className="text-[11px] text-slate-400">{toggleStatus}</span>
        {bqDemoFailure?.kind === "unavailable" && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-100">
            Preview専用
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 text-[11px] text-slate-400">
        <span className="rounded-full bg-slate-100 px-2 py-0.5">GCP未接続</span>
        <span>
          {source === "bq-demo" && bqDemoMeta
            ? `期間 ${bqDemoMeta.from}〜${bqDemoMeta.to} / ${bqDemoMeta.rows.length}日 / mode:mock`
            : bqDemoFailure?.kind === "unavailable"
              ? "Production安全停止中（実BigQuery接続ではありません）"
              : "実BigQuery接続ではありません"}
        </span>
      </div>
    </div>
  );
}

function MonthlyStatusCard({ source }: { source: DataSource }) {
  const sourceLabel =
    source === "bq-demo"
      ? "BigQueryデモ"
      : source === "csv"
        ? "CSV実値"
        : "サンプル";

  return (
    <SectionCard
      title="今月の状態"
      icon={<TrendingUp size={16} />}
      action={
        <Pill tone={source === "sample" ? "slate" : "mint"} size="xs">
          {sourceLabel}
        </Pill>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatusTile
          label="売上"
          value="+8.4%"
          note="成長中"
          tone="mint"
        />
        <StatusTile
          label="CVR"
          value="-0.6pt"
          note="主力商品で低下"
          tone="rose"
        />
        <StatusTile
          label="広告ROAS"
          value="-12%"
          note="配分見直し"
          tone="gold"
        />
      </div>
      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs leading-6 text-slate-700">
        売上は伸びていますが、広告費増加に対してCVRと在庫効率が追いついていません。
        今月は <b>商品AのCVR改善</b> と <b>商品Bへの広告配分</b> を優先します。
      </div>
    </SectionCard>
  );
}

function StatusTile({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "mint" | "rose" | "gold";
}) {
  const cls =
    tone === "mint"
      ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
      : tone === "rose"
        ? "border-rose-200 bg-rose-50/60 text-rose-800"
        : "border-amber-200 bg-amber-50/60 text-amber-800";

  return (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <div className="text-xs font-semibold">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight">{value}</div>
      <div className="text-[11px] text-slate-500">{note}</div>
    </div>
  );
}

function AiBriefCard() {
  return (
    <SectionCard
      title="AI月次診断"
      icon={<Sparkles size={16} />}
      action={
        <Pill tone="gold" size="xs">
          サンプル文言
        </Pill>
      }
    >
      <div className="space-y-2">
        <SummaryStat
          tone="rose"
          icon={<AlertTriangle size={15} />}
          title="異常"
          body="商品AのCVR低下と在庫残が売上効率を押し下げています。"
          meta="重要度: 高"
        />
        <SummaryStat
          tone="mint"
          icon={<Lightbulb size={15} />}
          title="機会"
          body="商品Bは在庫十分・CVR安定。広告拡張余地があります。"
          meta="インパクト: 高"
        />
        <SummaryStat
          tone="sky"
          icon={<Target size={15} />}
          title="判断"
          body="LP改善と広告配分見直しを同じ週で進めます。"
          meta="送り先: 施策ボード"
        />
      </div>
    </SectionCard>
  );
}

function NextActionCard() {
  return (
    <SectionCard
      title="次に実行"
      icon={<Target size={16} />}
      action={<span className="text-[11px] text-slate-500">今週</span>}
    >
      <div className="rounded-lg border border-navy-100 bg-navy-50/70 p-3">
        <div className="text-sm font-semibold text-navy-900">
          商品Aの商品ページ改善
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          FVコピーとCTAを見直し、CVR低下の主因候補を潰す。
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill tone="rose" size="xs">P1</Pill>
          <Pill tone="gold" size="xs">工数 中</Pill>
          <Pill tone="sky" size="xs">期限 5/10</Pill>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        <Link
          to="/app/product-page"
          className="btn-primary w-full justify-center px-3 py-2 text-sm"
        >
          改善タスクを開く
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          to="/app/action-board"
          className="btn-secondary w-full justify-center px-3 py-2 text-sm"
        >
          施策ボードで管理
        </Link>
      </div>
    </SectionCard>
  );
}

function WorkbenchTabs({
  active,
  onChange,
}: {
  active: "actions" | "products" | "data" | "insights";
  onChange: (tab: "actions" | "products" | "data" | "insights") => void;
}) {
  const tabs = [
    { id: "actions", label: "優先施策" },
    { id: "products", label: "商品" },
    { id: "data", label: "データ状態" },
    { id: "insights", label: "インサイト" },
  ] as const;

  return (
    <div role="tablist" aria-label="ワークベンチ切替" className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            active === tab.id
              ? "bg-navy-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ActionsWorkbench({ top5 }: { top5: typeof actions }) {
  return (
    <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Pill tone="rose" size="xs">P1優先</Pill>
          <Pill tone="sky" size="xs">今週対応</Pill>
          <span>インパクト × 実行しやすさで並べ替え</span>
        </div>
        <PriorityMap actions={actions} />
      </div>
      <ActionTable top5={top5} />
    </div>
  );
}

function ActionTable({ top5 }: { top5: typeof actions }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="table-clean min-w-[48rem]">
        <thead>
          <tr>
            <th className="!w-8">#</th>
            <th>アクション</th>
            <th>領域</th>
            <th>Impact</th>
            <th>担当</th>
            <th>期限</th>
            <th>進捗</th>
            <th className="!w-16">操作</th>
          </tr>
        </thead>
        <tbody>
          {top5.map((a) => (
            <tr key={a.id}>
              <td className="font-mono text-slate-400">{a.id}</td>
              <td className="font-medium text-slate-800">{a.title}</td>
              <td><Pill tone="slate" size="xs">{a.area}</Pill></td>
              <td><Pill tone={impactTone(a.impact)} size="xs">{a.impact}</Pill></td>
              <td>{a.owner}</td>
              <td>{a.due}</td>
              <td><Pill tone={statusTone(a.status)} size="xs">{a.status}</Pill></td>
              <td>
                <Link to="/app/action-board" className="text-xs font-medium text-sky-700 hover:text-sky-900">
                  開く
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsWorkbench() {
  return (
    <div className="overflow-x-auto p-4">
      <table className="table-clean min-w-[54rem] rounded-lg border border-slate-200 bg-white">
        <thead>
          <tr>
            <th>商品</th>
            <th>判断</th>
            <th>売上</th>
            <th>CVR</th>
            <th>在庫</th>
            <th>広告費</th>
            <th>AI推奨</th>
            <th className="!w-20">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                    {p.id}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.category}</div>
                  </div>
                </div>
              </td>
              <td><Pill tone={judgmentTone(p.judgment)} size="xs">{p.judgment}</Pill></td>
              <td className="font-medium text-slate-800">{p.sales}</td>
              <td>
                <span
                  className={`flex items-center gap-1 ${
                    p.cvrTrend === "up"
                      ? "text-emerald-600"
                      : p.cvrTrend === "down"
                        ? "text-rose-600"
                        : "text-slate-500"
                  }`}
                >
                  {p.cvr}<span className="text-[11px]">{p.cvrDelta}</span>
                </span>
              </td>
              <td>残 {p.stock}</td>
              <td>{p.ad}</td>
              <td>{p.recommendation}</td>
              <td>
                <Link to="/app/product-page" className="text-xs font-medium text-sky-700 hover:text-sky-900">
                  改善へ
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataWorkbench({
  ordersImport,
  ga4Import,
  adsImport,
  bqDemoEnabled,
  bqDemoFailure,
}: {
  ordersImport: { fileName: string; importedAt: Date; parseResult: { acceptedRows: number } } | null;
  ga4Import: { fileName: string; importedAt: Date; parseResult: { acceptedRows: number } } | null;
  adsImport: { fileName: string; importedAt: Date; parseResult: { acceptedRows: number } } | null;
  bqDemoEnabled: boolean;
  bqDemoFailure: BqDemoFailure | null;
}) {
  const rows = [
    ordersImport
      ? {
          name: "注文CSV",
          state: "取込済",
          when: `${ordersImport.importedAt.toLocaleString("ja-JP")} / ${ordersImport.parseResult.acceptedRows.toLocaleString("ja-JP")}件`,
          detail: ordersImport.fileName,
          tone: "mint" as const,
        }
      : { name: "注文CSV", state: "未取込", when: "未取込", detail: "CSV取込で実値化", tone: "gold" as const },
    ga4Import
      ? {
          name: "GA4 CSV",
          state: "取込済",
          when: `${ga4Import.importedAt.toLocaleString("ja-JP")} / ${ga4Import.parseResult.acceptedRows.toLocaleString("ja-JP")}件`,
          detail: ga4Import.fileName,
          tone: "mint" as const,
        }
      : { name: "GA4 CSV", state: "任意・未取込", when: "未取込", detail: "実API未接続", tone: "gold" as const },
    adsImport
      ? {
          name: "広告CSV",
          state: "取込済",
          when: `${adsImport.importedAt.toLocaleString("ja-JP")} / ${adsImport.parseResult.acceptedRows.toLocaleString("ja-JP")}件`,
          detail: adsImport.fileName,
          tone: "mint" as const,
        }
      : { name: "広告CSV", state: "任意・未取込", when: "未取込", detail: "実API未接続", tone: "gold" as const },
    {
      name: "BigQueryデモ",
      state: bqDemoEnabled
        ? bqDemoFailure?.kind === "unavailable"
          ? "安全停止"
          : "ON"
        : "Previewでデモ可",
      when: bqDemoFailure?.kind === "unavailable" ? "Production安全停止" : "実GCP未接続",
      detail: "BQ_MOCK_MODE=true の Preview 限定",
      tone: bqDemoEnabled && !bqDemoFailure ? "sky" as const : "gold" as const,
    },
    { name: "実AI生成", state: "未接続", when: "Phase 4", detail: "現MVPはサンプル文言", tone: "slate" as const },
  ];

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-clean min-w-[48rem] rounded-lg border border-slate-200 bg-white">
        <thead>
          <tr>
            <th>データ</th>
            <th>状態</th>
            <th>更新</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="font-medium text-slate-900">{row.name}</td>
              <td><Pill tone={row.tone} size="xs">{row.state}</Pill></td>
              <td className="text-slate-500">{row.when}</td>
              <td className="text-slate-600">{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        本MVPは実 GCP / 実 GA4 API / 実広告 API / 実AI API には未接続。CSV取込とPreview限定デモで運用フローを確認します。
      </p>
    </div>
  );
}

function InsightsWorkbench() {
  const insights = [
    ["広告費は +¥620,000（前月比 +18%）", "gold"],
    ["商品AのCVRが -0.6pt 低下", "rose"],
    ["新規顧客数は +12% で推移", "mint"],
    ["在庫回転日数は +4日 悪化", "rose"],
  ] as const;

  return (
    <div className="grid gap-3 p-4 md:grid-cols-2">
      {insights.map(([text, tone]) => (
        <div key={text} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${
                tone === "mint"
                  ? "bg-emerald-500"
                  : tone === "rose"
                    ? "bg-rose-500"
                    : "bg-amber-400"
              }`}
            />
            {text}
          </div>
          <Link to="/app/ai-report" className="text-xs font-medium text-sky-700 hover:text-sky-900">
            根拠
          </Link>
        </div>
      ))}
    </div>
  );
}

function DataStateSummary({
  ordersImport,
  ga4Import,
  adsImport,
  bqDemoEnabled,
  bqDemoFailure,
}: {
  ordersImport: { fileName: string } | null;
  ga4Import: { fileName: string } | null;
  adsImport: { fileName: string } | null;
  bqDemoEnabled: boolean;
  bqDemoFailure: BqDemoFailure | null;
}) {
  // ON だが Production の安全停止に当たっている場合は「デモ表示中」とは見せない。
  const bqDemoCard = bqDemoEnabled
    ? bqDemoFailure?.kind === "unavailable"
      ? {
          state: "Production安全停止中",
          tone: "gold" as const,
          note: "Production は BQ_MOCK_MODE 未設定で安全停止。デモは Preview 環境で確認可（実GCP接続ではない）",
        }
      : bqDemoFailure?.kind === "error"
        ? {
            state: "取得失敗 / フォールバック",
            tone: "gold" as const,
            note: "BigQueryデモの取得に失敗。CSV / サンプル値で表示中（実GCP接続ではない）",
          }
        : {
            state: "デモ表示中（mock）",
            tone: "sky" as const,
            note: "BQ_MOCK_MODE=true の環境でのみ mock データを表示（実GCP接続ではない）",
          }
    : {
        state: "Previewでデモ可",
        tone: "gold" as const,
        note: "BQ_MOCK_MODE=true の Preview でのみ mock データを表示。Production は未設定なら安全停止（実GCP接続ではない）",
      };

  const items: {
    label: string;
    state: string;
    tone: "mint" | "sky" | "gold" | "slate";
    note: string;
  }[] = [
    {
      label: "注文CSV",
      state: ordersImport ? "実値（取込済）" : "未取込 / サンプル",
      tone: ordersImport ? "mint" : "slate",
      note: ordersImport ? "売上 / 注文 / AOV を実値で計算" : "CSV取込で実値化",
    },
    {
      label: "GA4 CSV",
      state: ga4Import ? "実値（取込済）" : "未取込",
      tone: ga4Import ? "mint" : "slate",
      note: ga4Import ? "セッション / CVR を実値で反映" : "CSV取込対応・実API未接続",
    },
    {
      label: "広告CSV",
      state: adsImport ? "実値（取込済）" : "未取込",
      tone: adsImport ? "mint" : "slate",
      note: adsImport ? "ROAS / CPC / CVR を実値で反映" : "CSV取込対応・実API未接続",
    },
    {
      label: "BigQueryデモ",
      state: bqDemoCard.state,
      tone: bqDemoCard.tone,
      note: bqDemoCard.note,
    },
    {
      label: "AI考察",
      state: "サンプル文言",
      tone: "gold",
      note: "実AI生成は Phase 4 で接続予定",
    },
  ];

  // tone → 上端ストライプ色のマップ。動的Tailwind禁止のため固定文字列で持つ。
  const stripeByTone: Record<typeof items[number]["tone"], string> = {
    mint: "bg-emerald-500",
    sky: "bg-sky-500",
    gold: "bg-amber-400",
    slate: "bg-slate-300",
  };

  return (
    <SectionCard
      title="データ状態サマリー"
      icon={<Database size={16} />}
      action={
        <span className="text-[11px] text-slate-500">
          実値 / デモ / 未接続 / サンプル を一目で確認
        </span>
      }
    >
      {/* 凡例 — 4区分のトーン定義をひと目で確認できるようにする */}
      <ul
        className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600"
        aria-label="データ状態の凡例"
      >
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-3 rounded-sm bg-emerald-500"
          />
          <span>実値（CSV取込）</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-3 rounded-sm bg-sky-500"
          />
          <span>デモ（Preview限定 mock）</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-3 rounded-sm bg-amber-400"
          />
          <span>未取込 / サンプル文言</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-3 rounded-sm bg-slate-300"
          />
          <span>未接続</span>
        </li>
      </ul>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it) => (
          <div
            key={it.label}
            className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3 pt-3.5"
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-1 ${stripeByTone[it.tone]}`}
            />
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-slate-700">
                {it.label}
              </span>
              <Pill tone={it.tone} size="xs">
                {it.state}
              </Pill>
            </div>
            <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
              {it.note}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        ※ 本MVPは <b>実 GCP / 実 GA4 API / 実 広告 API / 実 AI API には未接続</b>。
        CSV取込（実値）と BigQueryデモ（接続後の再現）で、月次運用フローを確認できます。
      </p>
    </SectionCard>
  );
}

function SummaryStat({
  tone,
  icon,
  title,
  body,
  meta,
}: {
  tone: "mint" | "rose" | "sky";
  icon: React.ReactNode;
  title: string;
  body: string;
  meta: string;
}) {
  const wrap =
    tone === "mint"
      ? "border-emerald-200 bg-emerald-50/40"
      : tone === "rose"
        ? "border-rose-200 bg-rose-50/40"
        : "border-sky-200 bg-sky-50/40";
  const iconColor =
    tone === "mint"
      ? "text-emerald-600"
      : tone === "rose"
        ? "text-rose-600"
        : "text-sky-600";
  return (
    <div className={`rounded-xl border ${wrap} p-3`}>
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${iconColor}`}>
        <span>{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-xs leading-6 text-slate-700">{body}</p>
      <div className="mt-2 text-[11px] text-slate-500">{meta}</div>
    </div>
  );
}
