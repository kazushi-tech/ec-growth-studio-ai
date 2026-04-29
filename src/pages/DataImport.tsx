import { useRef, useState } from "react";
import {
  Upload,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  ChevronRight,
  Plug,
  Beaker,
  Download,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Box,
  XCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill from "../components/ui/Pill";
import { dataSources } from "../data/sample";
import type { DataSource } from "../data/sample";
import { useImport } from "../lib/csv/ImportContext";
import { formatYen, formatInt } from "../lib/csv/aggregateOrders";
import { formatPercent } from "../lib/csv/aggregateGa4";
import { formatRoas, formatCpc } from "../lib/csv/aggregateAds";

const sourceIcon = (name: string) => {
  if (name.includes("注文") || name.includes("商品データ"))
    return <ShoppingBag size={14} className="text-emerald-600" />;
  if (name.includes("在庫") || name.includes("画像"))
    return <Box size={14} className="text-emerald-600" />;
  if (name.includes("レビュー"))
    return <Sparkles size={14} className="text-amber-500" />;
  if (name.includes("GA4"))
    return <BarChart3 size={14} className="text-sky-600" />;
  if (name.includes("広告") || name.includes("キャンペーン"))
    return <Megaphone size={14} className="text-rose-500" />;
  if (name.includes("CRM"))
    return <Sparkles size={14} className="text-violet-500" />;
  return <Database size={14} className="text-slate-500" />;
};

const stateTone = (s: DataSource["status"]) => {
  switch (s) {
    case "取込済み":
      return "mint";
    case "要確認":
      return "gold";
    case "未接続":
      return "rose";
    case "任意":
      return "slate";
  }
};

type CsvMode = "orders" | "ga4" | "ads";

export default function DataImport() {
  const {
    ordersImport,
    lastFailure,
    isImporting,
    importOrdersFile,
    clearOrdersImport,
    dismissFailure,
    ga4Import,
    ga4Failure,
    isImportingGa4,
    importGa4File,
    clearGa4Import,
    dismissGa4Failure,
    adsImport,
    adsFailure,
    isImportingAds,
    importAdsFile,
    clearAdsImport,
    dismissAdsFailure,
  } = useImport();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [csvMode, setCsvMode] = useState<CsvMode>("orders");

  const handleFiles = async (files: FileList | null) => {
    setUploadError(null);
    const file = files?.[0];
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      setUploadError("CSVファイル(.csv)を選択してください。");
      return;
    }
    if (fileRef.current) fileRef.current.value = "";
    try {
      if (csvMode === "ga4") {
        await importGa4File(file);
      } else if (csvMode === "ads") {
        await importAdsFile(file);
      } else {
        await importOrdersFile(file);
      }
    } catch (e) {
      setUploadError(
        `読み込み中にエラーが発生しました: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const triggerSelect = () => fileRef.current?.click();

  return (
    <>
      <Topbar
        title="データ取込・連携"
        subtitle="CSVから始めて、Shopify・GA4・広告APIへ段階的に拡張"
        actions={
          <>
            <button
              className="btn-primary px-3 py-1.5 text-xs"
              onClick={triggerSelect}
              disabled={isImporting}
            >
              <Upload size={12} /> CSVをアップロード
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              <Sparkles size={12} /> AI診断を開始
            </button>
          </>
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="space-y-5 px-6 py-5">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-[11px] text-slate-600">
          <ShieldCheck size={12} className="text-emerald-600" />
          メモリ／ブラウザ保存のみ。外部送信なし。
        </div>

        {/* EC linkage stance — explain that we don't host the EC site */}
        <SectionCard title="ECサイト連携の考え方" icon={<Plug size={16} />}>
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="text-xs font-semibold text-slate-700">
                ECサイトはお客さまが保有
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-600">
                Shopify / 楽天 / 自社カート など、お客さまが既に運用している
                ECサイトを前提とします。当サービス側では構築・保有しません。
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="text-xs font-semibold text-slate-700">
                月次改善のための分析・運用レイヤー
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-600">
                注文CSV / GA4 / 広告CSV / BigQuery などを読み取り、
                AI診断 → 人間レビュー → 施策ボード → 月次レポートへ
                変換するレイヤーとして機能します。
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="text-xs font-semibold text-slate-700">
                CSV-first / API-later
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-600">
                MVPではCSV取込から開始。将来は GA4 / BigQuery / 広告API への
                <b>読み取り専用</b>連携を順次追加します。
                認証情報やAPIキーはまだ扱いません。
              </p>
            </div>
          </div>
        </SectionCard>

        {/* GA4 / BigQuery readiness — checklist only, no actual connection */}
        <SectionCard
          title="GA4 / BigQuery 接続準備"
          icon={<BarChart3 size={16} />}
          action={
            <Pill tone="gold" size="xs">
              実接続は次フェーズ
            </Pill>
          }
        >
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 lg:col-span-2">
              <div className="text-xs font-semibold text-amber-700">
                主価値は「GA4 / BigQuery 接続」ではなく
                「売上変動の原因分解と次アクション化」
              </div>
              <p className="mt-1.5 text-[11px] leading-6 text-slate-700">
                GA4 / BigQuery は売上要因分解のための<b>入力チャネル</b>と位置づけます。
                技術的にはすぐ接続できる前提で設計しますが、本MVPでは
                <b> 実API接続 / OAuth / GCP認証 / BigQuery クエリ実行は実装しません</b>。
                顧客側で揃えていただくべき項目を、下のチェックリストで可視化します。
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="text-xs font-semibold text-slate-700">
                将来のつなぎ先
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-600">
                Insight Studio で構築済みの BigQuery 分析基盤を、EC向けの
                売上要因分解にそのまま接続する想定です。
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-semibold text-slate-700">
              接続前に揃えていただくもの（読み取り専用）
            </div>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  label: "GA4プロパティ",
                  detail: "閲覧権限（サービスアカウント想定）",
                },
                {
                  label: "BigQuery Export",
                  detail: "GA4側で有効化が必要",
                },
                {
                  label: "GCPプロジェクトID",
                  detail: "BigQueryが属するプロジェクト",
                },
                {
                  label: "BigQuery dataset",
                  detail: "例: analytics_xxxxxxxxx",
                },
                {
                  label: "権限スコープ",
                  detail: "読み取り専用（roles/bigquery.dataViewer 想定）",
                },
              ].map((it) => (
                <li
                  key={it.label}
                  className="rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <CheckCircle2 size={12} className="text-slate-400" />
                    {it.label}
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    {it.detail}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-500">
              本画面では情報の可視化のみ行います。
              認証情報・APIキー・OAuth トークンの保存は実装しません。
            </p>
          </div>
        </SectionCard>

        {/* Connection summary */}
        <SectionCard title="データ接続サマリー" icon={<Database size={16} />}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <SummaryItem
              label="接続済みデータ"
              value={String(
                6 +
                  (ordersImport ? 1 : 0) +
                  (ga4Import ? 1 : 0) +
                  (adsImport ? 1 : 0),
              )}
              sub={summaryConnectedSub(ordersImport, ga4Import, adsImport)}
              tone="emerald"
            />
            <SummaryItem
              label="未接続データ"
              value="3"
              sub="前月比 -1"
              tone="amber"
            />
            <SummaryItem
              label="最新取込"
              value={latestImportLabel(ordersImport, ga4Import, adsImport)}
              sub={latestImportSub(ordersImport, ga4Import, adsImport)}
            />
            <SummaryItem
              label="AI診断データ充足率"
              value={fulfillmentLabel(ga4Import, adsImport)}
              sub={fulfillmentSub(ga4Import, adsImport)}
              tone="emerald"
              progress={fulfillmentValue(ga4Import, adsImport)}
            />
            <SummaryItem
              label="今月の診断ステータス"
              value="診断可能"
              sub={
                adsImport
                  ? "広告CSV取込で広告効率まで要因分解可能"
                  : ga4Import
                    ? "GA4実値で要因分析が精度向上"
                    : "全体の78%のデータを確保"
              }
              tone="emerald"
            />
          </div>
        </SectionCard>

        {/* Failed import panel — shown when the most recent upload could not be applied */}
        {lastFailure && (
          <SectionCard
            title="注文CSV 取込失敗"
            icon={<XCircle size={16} className="text-rose-600" />}
            action={
              <button
                onClick={dismissFailure}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                閉じる
              </button>
            }
          >
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-[12px] text-rose-800">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="rose" size="xs">
                  反映なし
                </Pill>
                <span className="font-mono text-[11px]">{lastFailure.fileName}</span>
                <span className="text-[11px] text-rose-700/70">
                  {lastFailure.attemptedAt.toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="mt-2 leading-6">
                CSVを解釈できなかったため、Dashboardには反映されていません。
                {ordersImport
                  ? "直前に成功した取込はそのまま維持されています。"
                  : "未取込状態（サンプルデータ表示）のままです。"}
              </p>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <MessageBlock
                tone="rose"
                title={`エラー (${lastFailure.parseResult.errors.length})`}
                items={lastFailure.parseResult.errors.map((e) => e.message)}
                icon={<XCircle size={13} />}
              />
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">検出されたカラム</div>
                <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {Object.entries(lastFailure.parseResult.detectedColumns).map(
                    ([k, v]) => (
                      <li key={k} className="font-mono text-[10px]">
                        {k}: {v ?? <span className="text-rose-500">未検出</span>}
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-2 text-[10px] text-slate-500">
                  受理した行数: {formatInt(lastFailure.parseResult.acceptedRows)} /{" "}
                  {formatInt(lastFailure.parseResult.totalRows)}
                </div>
              </div>
            </div>

            {lastFailure.parseResult.warnings.length > 0 && (
              <div className="mt-3">
                <MessageBlock
                  tone="amber"
                  title={`警告 (${lastFailure.parseResult.warnings.length})`}
                  items={lastFailure.parseResult.warnings
                    .slice(0, 8)
                    .map((w) =>
                      w.field
                        ? `行 ${w.row} [${w.field}]: ${w.message}`
                        : `行 ${w.row}: ${w.message}`,
                    )}
                  icon={<AlertTriangle size={13} />}
                  moreCount={Math.max(
                    0,
                    lastFailure.parseResult.warnings.length - 8,
                  )}
                />
              </div>
            )}
          </SectionCard>
        )}

        {/* Import result panel — visible only after a CSV is uploaded */}
        {ordersImport && (
          <SectionCard
            title="注文CSV 取込結果"
            icon={<CheckCircle2 size={16} />}
            action={
              <button
                onClick={clearOrdersImport}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                <RefreshCw size={12} /> サンプルデータに戻す
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <SummaryItem
                label="売上合計"
                value={formatYen(ordersImport.aggregation.totalSales)}
                sub={`期間: ${formatPeriod(ordersImport.aggregation.periodStart, ordersImport.aggregation.periodEnd)}`}
                tone="emerald"
              />
              <SummaryItem
                label="注文数"
                value={formatInt(ordersImport.aggregation.orderCount)}
                sub={`ユニーク顧客: ${formatInt(ordersImport.aggregation.uniqueCustomers)}`}
                tone="emerald"
              />
              <SummaryItem
                label="AOV"
                value={formatYen(ordersImport.aggregation.aov)}
                sub="売上 ÷ 注文数"
                tone="emerald"
              />
              <SummaryItem
                label="取込件数"
                value={`${formatInt(ordersImport.parseResult.acceptedRows)} / ${formatInt(ordersImport.parseResult.totalRows)}`}
                sub={`スキップ: ${formatInt(ordersImport.parseResult.warnings.length)} 行`}
                tone={
                  ordersImport.parseResult.warnings.length ? "amber" : "emerald"
                }
              />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-700">
                  商品別売上 上位
                </div>
                <table className="table-clean mt-1.5">
                  <thead>
                    <tr>
                      <th>商品</th>
                      <th className="!w-20">注文</th>
                      <th className="!w-20">数量</th>
                      <th className="!w-28">売上</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersImport.aggregation.topProducts.map((p) => (
                      <tr key={p.product_name}>
                        <td className="font-medium text-slate-800">
                          {p.product_name}
                        </td>
                        <td className="text-slate-600">{formatInt(p.orders)}</td>
                        <td className="text-slate-600">
                          {formatInt(p.quantity)}
                        </td>
                        <td className="font-medium text-slate-800">
                          {formatYen(p.sales)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                {ordersImport.parseResult.errors.length > 0 && (
                  <MessageBlock
                    tone="rose"
                    title={`エラー (${ordersImport.parseResult.errors.length})`}
                    items={ordersImport.parseResult.errors.map((e) => e.message)}
                    icon={<XCircle size={13} />}
                  />
                )}
                {ordersImport.parseResult.warnings.length > 0 && (
                  <MessageBlock
                    tone="amber"
                    title={`警告 (${ordersImport.parseResult.warnings.length})`}
                    items={ordersImport.parseResult.warnings
                      .slice(0, 8)
                      .map((w) =>
                        w.field
                          ? `行 ${w.row} [${w.field}]: ${w.message}`
                          : `行 ${w.row}: ${w.message}`,
                      )}
                    icon={<AlertTriangle size={13} />}
                    moreCount={Math.max(
                      0,
                      ordersImport.parseResult.warnings.length - 8,
                    )}
                  />
                )}
                {ordersImport.parseResult.errors.length === 0 &&
                  ordersImport.parseResult.warnings.length === 0 && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-[11px] text-emerald-700">
                      警告・エラーなしで取込完了しました。
                    </div>
                  )}

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-700">
                    検出されたカラム
                  </div>
                  <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {Object.entries(ordersImport.parseResult.detectedColumns).map(
                      ([k, v]) => (
                        <li key={k} className="font-mono text-[10px]">
                          {k}: {v ?? <span className="text-rose-500">未検出</span>}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* GA4 CSV failure panel */}
        {ga4Failure && (
          <SectionCard
            title="GA4 CSV 取込失敗"
            icon={<XCircle size={16} className="text-rose-600" />}
            action={
              <button
                onClick={dismissGa4Failure}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                閉じる
              </button>
            }
          >
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-[12px] text-rose-800">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="rose" size="xs">
                  反映なし
                </Pill>
                <span className="font-mono text-[11px]">{ga4Failure.fileName}</span>
                <span className="text-[11px] text-rose-700/70">
                  {ga4Failure.attemptedAt.toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="mt-2 leading-6">
                GA4 CSVを解釈できなかったため、売上要因分析のセッション/CVRには反映されていません。
                {ga4Import
                  ? "直前に成功したGA4取込はそのまま維持されています。"
                  : "GA4未取込状態（静的サンプル表示）のままです。"}
              </p>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <MessageBlock
                tone="rose"
                title={`エラー (${ga4Failure.parseResult.errors.length})`}
                items={ga4Failure.parseResult.errors.map((e) => e.message)}
                icon={<XCircle size={13} />}
              />
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">検出されたカラム</div>
                <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {Object.entries(ga4Failure.parseResult.detectedColumns).map(
                    ([k, v]) => (
                      <li key={k} className="font-mono text-[10px]">
                        {k}: {v ?? <span className="text-rose-500">未検出</span>}
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-2 text-[10px] text-slate-500">
                  受理した行数: {formatInt(ga4Failure.parseResult.acceptedRows)} /{" "}
                  {formatInt(ga4Failure.parseResult.totalRows)}
                </div>
              </div>
            </div>

            {ga4Failure.parseResult.warnings.length > 0 && (
              <div className="mt-3">
                <MessageBlock
                  tone="amber"
                  title={`警告 (${ga4Failure.parseResult.warnings.length})`}
                  items={ga4Failure.parseResult.warnings
                    .slice(0, 8)
                    .map((w) =>
                      w.field
                        ? `行 ${w.row} [${w.field}]: ${w.message}`
                        : `行 ${w.row}: ${w.message}`,
                    )}
                  icon={<AlertTriangle size={13} />}
                  moreCount={Math.max(
                    0,
                    ga4Failure.parseResult.warnings.length - 8,
                  )}
                />
              </div>
            )}
          </SectionCard>
        )}

        {/* GA4 CSV import result */}
        {ga4Import && (
          <SectionCard
            title="GA4 CSV 取込結果"
            icon={<BarChart3 size={16} className="text-sky-600" />}
            action={
              <button
                onClick={clearGa4Import}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                <RefreshCw size={12} /> GA4取込を解除
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              <SummaryItem
                label="セッション数"
                value={formatInt(ga4Import.aggregation.totalSessions)}
                sub={`期間: ${formatPeriod(ga4Import.aggregation.periodStart, ga4Import.aggregation.periodEnd)}`}
                tone="emerald"
              />
              <SummaryItem
                label="ユーザー数"
                value={
                  ga4Import.aggregation.totalUsers === null
                    ? "—"
                    : formatInt(ga4Import.aggregation.totalUsers)
                }
                sub={
                  ga4Import.aggregation.totalUsers === null
                    ? "users 列なし"
                    : "users 合計"
                }
                tone={
                  ga4Import.aggregation.totalUsers === null
                    ? undefined
                    : "emerald"
                }
              />
              <SummaryItem
                label="購入数"
                value={
                  ga4Import.aggregation.totalPurchases === null
                    ? "—"
                    : formatInt(ga4Import.aggregation.totalPurchases)
                }
                sub={
                  ga4Import.aggregation.totalPurchases === null
                    ? "purchases 列なし"
                    : "transactions / purchases 合計"
                }
                tone={
                  ga4Import.aggregation.totalPurchases === null
                    ? undefined
                    : "emerald"
                }
              />
              <SummaryItem
                label="CVR"
                value={
                  ga4Import.aggregation.cvr === null
                    ? "—"
                    : formatPercent(ga4Import.aggregation.cvr)
                }
                sub="purchases ÷ sessions"
                tone={
                  ga4Import.aggregation.cvr === null ? undefined : "emerald"
                }
              />
              <SummaryItem
                label="GA4売上"
                value={
                  ga4Import.aggregation.totalRevenue === null
                    ? "—"
                    : formatYen(ga4Import.aggregation.totalRevenue)
                }
                sub={
                  ga4Import.aggregation.totalRevenue === null
                    ? "total_revenue 列なし"
                    : "GA4 計測値"
                }
                tone={
                  ga4Import.aggregation.totalRevenue === null
                    ? undefined
                    : "emerald"
                }
              />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-700">
                  上位チャネル
                </div>
                {ga4Import.aggregation.hasChannel ? (
                  <table className="table-clean mt-1.5">
                    <thead>
                      <tr>
                        <th>チャネル</th>
                        <th className="!w-24">セッション</th>
                        <th className="!w-20">購入</th>
                        <th className="!w-20">CVR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ga4Import.aggregation.topChannels.map((c) => (
                        <tr key={c.channel}>
                          <td className="font-medium text-slate-800">
                            {c.channel}
                          </td>
                          <td className="text-slate-600">
                            {formatInt(c.sessions)}
                          </td>
                          <td className="text-slate-600">
                            {formatInt(c.purchases)}
                          </td>
                          <td className="text-slate-700">
                            {formatPercent(c.cvr)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="mt-1.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-2 text-[11px] text-slate-500">
                    channel 列が見当たらないため集計できません。
                  </div>
                )}

                <div className="mt-3 text-[11px] font-semibold text-slate-700">
                  上位ランディングページ
                </div>
                {ga4Import.aggregation.hasLandingPage ? (
                  <table className="table-clean mt-1.5">
                    <thead>
                      <tr>
                        <th>LP</th>
                        <th className="!w-24">セッション</th>
                        <th className="!w-20">購入</th>
                        <th className="!w-20">CVR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ga4Import.aggregation.topLandingPages.map((lp) => (
                        <tr key={lp.landing_page}>
                          <td className="font-mono text-[11px] text-slate-800">
                            {lp.landing_page}
                          </td>
                          <td className="text-slate-600">
                            {formatInt(lp.sessions)}
                          </td>
                          <td className="text-slate-600">
                            {formatInt(lp.purchases)}
                          </td>
                          <td className="text-slate-700">
                            {formatPercent(lp.cvr)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="mt-1.5 rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-2 text-[11px] text-slate-500">
                    landing_page 列が見当たらないため集計できません。
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {ga4Import.parseResult.warnings.length > 0 ? (
                  <MessageBlock
                    tone="amber"
                    title={`警告 (${ga4Import.parseResult.warnings.length})`}
                    items={ga4Import.parseResult.warnings
                      .slice(0, 8)
                      .map((w) =>
                        w.field
                          ? `行 ${w.row} [${w.field}]: ${w.message}`
                          : `行 ${w.row}: ${w.message}`,
                      )}
                    icon={<AlertTriangle size={13} />}
                    moreCount={Math.max(
                      0,
                      ga4Import.parseResult.warnings.length - 8,
                    )}
                  />
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-[11px] text-emerald-700">
                    警告・エラーなしで取込完了しました。
                  </div>
                )}

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-700">
                    検出されたカラム
                  </div>
                  <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {Object.entries(ga4Import.parseResult.detectedColumns).map(
                      ([k, v]) => (
                        <li key={k} className="font-mono text-[10px]">
                          {k}:{" "}
                          {v ?? <span className="text-rose-500">未検出</span>}
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-2 text-[10px] text-slate-500">
                    受理した行数: {formatInt(ga4Import.parseResult.acceptedRows)} /{" "}
                    {formatInt(ga4Import.parseResult.totalRows)}
                  </div>
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3 text-[11px] text-slate-700">
                  GA4 CSV はメモリ／ブラウザ保存のみで処理しています。
                  外部送信なし。BigQuery 直接接続は次フェーズです。
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Ads CSV failure panel */}
        {adsFailure && (
          <SectionCard
            title="広告CSV 取込失敗"
            icon={<XCircle size={16} className="text-rose-600" />}
            action={
              <button
                onClick={dismissAdsFailure}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                閉じる
              </button>
            }
          >
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-[12px] text-rose-800">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="rose" size="xs">
                  反映なし
                </Pill>
                <span className="font-mono text-[11px]">{adsFailure.fileName}</span>
                <span className="text-[11px] text-rose-700/70">
                  {adsFailure.attemptedAt.toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="mt-2 leading-6">
                広告CSVを解釈できなかったため、売上要因分析の広告効率/ROAS には反映されていません。
                {adsImport
                  ? "直前に成功した広告取込はそのまま維持されています。"
                  : "広告未取込状態のままです。"}
              </p>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <MessageBlock
                tone="rose"
                title={`エラー (${adsFailure.parseResult.errors.length})`}
                items={adsFailure.parseResult.errors.map((e) => e.message)}
                icon={<XCircle size={13} />}
              />
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">検出されたカラム</div>
                <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {Object.entries(adsFailure.parseResult.detectedColumns).map(
                    ([k, v]) => (
                      <li key={k} className="font-mono text-[10px]">
                        {k}: {v ?? <span className="text-rose-500">未検出</span>}
                      </li>
                    ),
                  )}
                </ul>
                <div className="mt-2 text-[10px] text-slate-500">
                  受理した行数: {formatInt(adsFailure.parseResult.acceptedRows)} /{" "}
                  {formatInt(adsFailure.parseResult.totalRows)}
                </div>
              </div>
            </div>

            {adsFailure.parseResult.warnings.length > 0 && (
              <div className="mt-3">
                <MessageBlock
                  tone="amber"
                  title={`警告 (${adsFailure.parseResult.warnings.length})`}
                  items={adsFailure.parseResult.warnings
                    .slice(0, 8)
                    .map((w) =>
                      w.field
                        ? `行 ${w.row} [${w.field}]: ${w.message}`
                        : `行 ${w.row}: ${w.message}`,
                    )}
                  icon={<AlertTriangle size={13} />}
                  moreCount={Math.max(
                    0,
                    adsFailure.parseResult.warnings.length - 8,
                  )}
                />
              </div>
            )}
          </SectionCard>
        )}

        {/* Ads CSV import result */}
        {adsImport && (
          <SectionCard
            title="広告CSV 取込結果"
            icon={<Megaphone size={16} className="text-rose-500" />}
            action={
              <button
                onClick={clearAdsImport}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                <RefreshCw size={12} /> 広告取込を解除
              </button>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              <SummaryItem
                label="広告費合計"
                value={formatYen(adsImport.aggregation.totalCost)}
                sub={`期間: ${formatPeriod(adsImport.aggregation.periodStart, adsImport.aggregation.periodEnd)}`}
                tone="emerald"
              />
              <SummaryItem
                label="クリック数"
                value={
                  adsImport.aggregation.hasClicks
                    ? formatInt(adsImport.aggregation.totalClicks)
                    : "—"
                }
                sub={
                  adsImport.aggregation.hasClicks ? "clicks 合計" : "clicks 列なし"
                }
                tone={adsImport.aggregation.hasClicks ? "emerald" : undefined}
              />
              <SummaryItem
                label="CPC"
                value={formatCpc(adsImport.aggregation.cpc)}
                sub="広告費 ÷ クリック"
                tone={adsImport.aggregation.cpc !== null ? "emerald" : undefined}
              />
              <SummaryItem
                label="CVR"
                value={
                  adsImport.aggregation.cvr === null
                    ? "—"
                    : formatPercent(adsImport.aggregation.cvr)
                }
                sub="conversions ÷ clicks"
                tone={adsImport.aggregation.cvr !== null ? "emerald" : undefined}
              />
              <SummaryItem
                label="ROAS"
                value={formatRoas(adsImport.aggregation.roas)}
                sub={
                  adsImport.aggregation.hasRevenue
                    ? "広告経由売上 ÷ 広告費"
                    : "revenue 列なし"
                }
                tone={
                  adsImport.aggregation.roas !== null ? "emerald" : undefined
                }
              />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold text-slate-700">
                  チャネル別 上位
                </div>
                <table className="table-clean mt-1.5">
                  <thead>
                    <tr>
                      <th>チャネル</th>
                      <th className="!w-24">広告費</th>
                      <th className="!w-20">CPC</th>
                      <th className="!w-20">CVR</th>
                      <th className="!w-20">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsImport.aggregation.topChannels.map((c) => (
                      <tr key={c.channel}>
                        <td className="font-medium text-slate-800">
                          {c.channel}
                        </td>
                        <td className="text-slate-700">
                          {formatYen(c.cost)}
                        </td>
                        <td className="text-slate-600">{formatCpc(c.cpc)}</td>
                        <td className="text-slate-600">
                          {c.cvr === null ? "—" : formatPercent(c.cvr)}
                        </td>
                        <td className="text-slate-700">{formatRoas(c.roas)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-3 text-[11px] font-semibold text-slate-700">
                  キャンペーン別 上位
                </div>
                <table className="table-clean mt-1.5">
                  <thead>
                    <tr>
                      <th>キャンペーン</th>
                      <th className="!w-20">媒体</th>
                      <th className="!w-24">広告費</th>
                      <th className="!w-20">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsImport.aggregation.topCampaigns.map((c) => (
                      <tr key={c.campaign}>
                        <td className="font-medium text-slate-800">
                          {c.campaign}
                        </td>
                        <td className="text-slate-600">{c.channel}</td>
                        <td className="text-slate-700">{formatYen(c.cost)}</td>
                        <td className="text-slate-700">
                          {formatRoas(c.roas)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                {adsImport.aggregation.inefficientCampaigns.length > 0 && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 text-[12px]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                      <AlertTriangle size={13} />
                      効率悪化キャンペーン候補 (
                      {adsImport.aggregation.inefficientCampaigns.length})
                    </div>
                    <ul className="mt-1.5 space-y-1.5 text-[11px] leading-5 text-slate-700">
                      {adsImport.aggregation.inefficientCampaigns.map((c) => (
                        <li
                          key={c.campaign}
                          className="rounded-lg bg-white/60 px-2 py-1.5"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-slate-800">
                              {c.campaign}
                            </span>
                            <Pill tone="slate" size="xs">
                              {c.channel}
                            </Pill>
                            <Pill tone="rose" size="xs">
                              ROAS {formatRoas(c.roas)}
                            </Pill>
                          </div>
                          <p className="mt-0.5 text-slate-600">{c.reason}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {adsImport.parseResult.warnings.length > 0 ? (
                  <MessageBlock
                    tone="amber"
                    title={`警告 (${adsImport.parseResult.warnings.length})`}
                    items={adsImport.parseResult.warnings
                      .slice(0, 8)
                      .map((w) =>
                        w.field
                          ? `行 ${w.row} [${w.field}]: ${w.message}`
                          : `行 ${w.row}: ${w.message}`,
                      )}
                    icon={<AlertTriangle size={13} />}
                    moreCount={Math.max(
                      0,
                      adsImport.parseResult.warnings.length - 8,
                    )}
                  />
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-[11px] text-emerald-700">
                    警告・エラーなしで取込完了しました。
                  </div>
                )}

                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-700">
                    検出されたカラム
                  </div>
                  <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {Object.entries(adsImport.parseResult.detectedColumns).map(
                      ([k, v]) => (
                        <li key={k} className="font-mono text-[10px]">
                          {k}:{" "}
                          {v ?? <span className="text-rose-500">未検出</span>}
                        </li>
                      ),
                    )}
                  </ul>
                  <div className="mt-2 text-[10px] text-slate-500">
                    受理した行数: {formatInt(adsImport.parseResult.acceptedRows)} /{" "}
                    {formatInt(adsImport.parseResult.totalRows)}
                  </div>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 text-[11px] text-slate-700">
                  広告CSV はメモリ／ブラウザ保存のみで処理しています。
                  外部送信なし。Google広告 / Meta広告 API 接続は将来フェーズです。
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Two cols: data source list / AI diagnosis influence */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="データソース一覧"
            icon={<Database size={16} />}
            bodyClassName="!px-2 !py-2"
          >
            <table className="table-clean">
              <thead>
                <tr>
                  <th>データソース</th>
                  <th className="!w-20">状態</th>
                  <th className="!w-20">方式</th>
                  <th>最終更新</th>
                  <th>件数</th>
                  <th>AI診断への影響</th>
                  <th className="!w-16">操作</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((d) => {
                  const isGa4 = d.name.includes("GA4");
                  const isAds = d.name.includes("広告");
                  const overlay =
                    isGa4 && ga4Import
                      ? {
                          status: "取込済み" as DataSource["status"],
                          updated: ga4Import.importedAt.toLocaleDateString(
                            "ja-JP",
                          ),
                          count: `${formatInt(ga4Import.parseResult.acceptedRows)}行`,
                          impact: "セッション/CVRを実値で反映中",
                        }
                      : isAds && adsImport
                        ? {
                            status: "取込済み" as DataSource["status"],
                            updated: adsImport.importedAt.toLocaleDateString(
                              "ja-JP",
                            ),
                            count: `${formatInt(adsImport.parseResult.acceptedRows)}行`,
                            impact: "ROAS / CPC / CVR を実値で反映中",
                          }
                        : null;
                  const status: DataSource["status"] = overlay?.status ?? d.status;
                  const updated = overlay?.updated ?? d.updated;
                  const count = overlay?.count ?? d.count;
                  const impact = overlay?.impact ?? d.impact;
                  return (
                    <tr key={d.name}>
                      <td>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                          {sourceIcon(d.name)}
                          {d.name}
                        </div>
                      </td>
                      <td>
                        <Pill tone={stateTone(status)} size="xs">
                          {status}
                        </Pill>
                      </td>
                      <td className="text-slate-600">{d.method}</td>
                      <td className="text-slate-500">{updated}</td>
                      <td className="text-slate-700">{count}</td>
                      <td className="text-slate-500">{impact}</td>
                      <td>
                        <button className="text-xs text-sky-600 hover:text-sky-700">
                          {d.action}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 px-3 pb-1 text-[10px] text-slate-400">
              ※ 状態の説明: 取込済み=データが最新、要確認=差分/不整合の可能性、未接続=データ未連携、任意=より高度な分析に有効
            </p>
          </SectionCard>

          <SectionCard
            title="AI診断への影響"
            icon={<Sparkles size={16} />}
          >
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                このデータだけで月次診断可能
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-600">
                主要な診断は現在のデータで実施できます。
              </p>
            </div>

            <Section
              title="現在可能な分析"
              tone="emerald"
              items={[
                "売上診断",
                "商品別改善判断",
                "広告ROAS診断",
                "リピート分析",
              ]}
              icon
            />
            <Section
              title="精度向上に必要な追加データ"
              tone="amber"
              items={["GA4 LP別CVR", "レビューCSV", "商品別粗利"]}
            />
            <Section
              title="データ不足で保留される分析"
              tone="rose"
              items={[
                "商品ページ詳細診断",
                "LP別離脱要因",
                "粗利ベース優先度",
              ]}
            />

            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-700">
                次に取り込むべきデータ
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                レビューCSVを追加すると信頼要素診断が可能になります。
              </p>
              <button className="btn-secondary mt-2 w-full justify-center text-xs">
                レビューCSVを取込む
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Upload + Flow + API */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-5"
            title="CSVアップロード"
            icon={<Upload size={16} />}
          >
            <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 text-[11px]">
              <button
                type="button"
                onClick={() => setCsvMode("orders")}
                className={`flex-1 rounded-md px-2 py-1.5 font-medium transition-colors ${
                  csvMode === "orders"
                    ? "bg-navy-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShoppingBag size={12} className="mr-1 inline" />
                注文CSV
              </button>
              <button
                type="button"
                onClick={() => setCsvMode("ga4")}
                className={`flex-1 rounded-md px-2 py-1.5 font-medium transition-colors ${
                  csvMode === "ga4"
                    ? "bg-navy-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <BarChart3 size={12} className="mr-1 inline" />
                GA4 CSV
              </button>
              <button
                type="button"
                onClick={() => setCsvMode("ads")}
                className={`flex-1 rounded-md px-2 py-1.5 font-medium transition-colors ${
                  csvMode === "ads"
                    ? "bg-navy-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Megaphone size={12} className="mr-1 inline" />
                広告CSV
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={triggerSelect}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragOver
                  ? "border-sky-400 bg-sky-50/60"
                  : "border-slate-300 bg-slate-50/60 hover:bg-slate-100/60"
              }`}
            >
              <Cloud size={28} className="mx-auto text-slate-400" />
              <div className="mt-2 text-sm font-semibold text-slate-700">
                {isImporting || isImportingGa4 || isImportingAds
                  ? "読み込み中..."
                  : csvMode === "ga4"
                    ? "GA4 CSV をドラッグ＆ドロップ"
                    : csvMode === "ads"
                      ? "広告CSV をドラッグ＆ドロップ"
                      : "注文CSV をドラッグ＆ドロップ"}
              </div>
              <div className="text-[11px] text-slate-500">
                またはクリックしてファイルを選択
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {[
                  { label: "注文CSV", active: csvMode === "orders" },
                  { label: "GA4 CSV", active: csvMode === "ga4" },
                  { label: "広告CSV", active: csvMode === "ads" },
                  { label: "商品CSV", active: false },
                  { label: "在庫CSV", active: false },
                  { label: "レビューCSV", active: false },
                  { label: "CRM CSV", active: false },
                ].map((t) => (
                  <Pill
                    key={t.label}
                    tone={t.active ? "mint" : "slate"}
                    size="xs"
                  >
                    {t.label}
                  </Pill>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  className="btn-primary px-3 py-1.5 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerSelect();
                  }}
                  disabled={isImporting || isImportingGa4 || isImportingAds}
                >
                  <Upload size={12} />{" "}
                  {csvMode === "ga4"
                    ? "GA4 CSV をアップロード"
                    : csvMode === "ads"
                      ? "広告CSV をアップロード"
                      : "注文CSV をアップロード"}
                </button>
                <a
                  href={
                    csvMode === "ga4"
                      ? "/samples/ga4_sample.csv"
                      : csvMode === "ads"
                        ? "/samples/ads_sample.csv"
                        : "/samples/orders_sample.csv"
                  }
                  download={
                    csvMode === "ga4"
                      ? "ga4_sample.csv"
                      : csvMode === "ads"
                        ? "ads_sample.csv"
                        : "orders_sample.csv"
                  }
                  className="btn-secondary px-3 py-1.5 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={12} />{" "}
                  {csvMode === "ga4"
                    ? "GA4 CSVテンプレートを取得"
                    : csvMode === "ads"
                      ? "広告CSVテンプレートを取得"
                      : "注文CSVテンプレートを取得"}
                </a>
              </div>
              {uploadError && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
                  <XCircle size={12} /> {uploadError}
                </div>
              )}
            </div>

            {csvMode === "orders" && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">
                  注文CSVテンプレート（最小カラム）
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  <li>
                    <span className="font-mono text-[10px]">order_id</span> — 注文番号（必須）
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">order_date</span> — 注文日 / date / 注文日（YYYY-MM-DD）
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">customer_id</span> — 顧客ID（任意・リピート分析に使用）
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">product_name</span> — 商品名 / product / 商品名
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">quantity</span> — 数量 / qty
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">total_sales</span> — total / sales / 売上（税込・¥可）
                  </li>
                </ul>
              </div>
            )}
            {csvMode === "ga4" && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">
                  GA4 CSVテンプレート（最小カラム）
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  <li>
                    <span className="font-mono text-[10px]">date</span> — 日付（必須） / event_date / 日付
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">sessions</span> — セッション数（必須） / セッション
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">users</span> — ユーザー数（任意） / active_users
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">purchases</span> — 購入数（任意・CVRに使用） / transactions / 購入
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">total_revenue</span> — GA4売上（任意） / revenue
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">channel</span> — チャネル（任意） / session_default_channel_group / 流入元
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">landing_page</span> — LP（任意） / page_path / ランディングページ
                  </li>
                </ul>
              </div>
            )}
            {csvMode === "ads" && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <div className="font-semibold text-slate-700">
                  広告CSVテンプレート（最小カラム）
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  <li>
                    <span className="font-mono text-[10px]">campaign</span> — キャンペーン名（必須） / campaign_name / キャンペーン
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">channel</span> — 媒体（必須） / platform / media / 媒体名
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">date</span> — 配信日（必須） / day / 日付
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">cost</span> — 広告費（必須） / spend / 費用 / 消化金額
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">impressions</span> — 表示回数（任意） / imp
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">clicks</span> — クリック数（任意） / click
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">conversions</span> — コンバージョン（任意） / conv / purchases
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">revenue</span> — 広告経由売上（任意・ROAS算出に使用） / conversion_value
                  </li>
                  <li>
                    <span className="font-mono text-[10px]">product_name</span> — 紐付け商品（任意）
                  </li>
                </ul>
              </div>
            )}
          </SectionCard>

          <SectionCard
            className="lg:col-span-4"
            title="取込の流れ"
            icon={<ChevronRight size={16} />}
          >
            <ol className="grid grid-cols-4 gap-2 text-center text-[11px]">
              {[
                { l: "アップロード", c: "bg-sky-100 text-sky-700" },
                { l: "カラムマッピング", c: "bg-amber-100 text-amber-700" },
                { l: "エラー確認", c: "bg-rose-100 text-rose-700" },
                { l: "取込完了", c: "bg-emerald-100 text-emerald-700" },
              ].map((s) => (
                <li key={s.l} className="space-y-1">
                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${s.c}`}
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="text-slate-700">{s.l}</div>
                </li>
              ))}
            </ol>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-700">
                アップロード履歴（直近）
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px]">
                {(ordersImport
                  ? ([
                      [
                        ordersImport.fileName,
                        ordersImport.parseResult.errors.length
                          ? "要確認"
                          : "取込済み",
                        ordersImport.parseResult.errors.length
                          ? "gold"
                          : "mint",
                        ordersImport.importedAt.toLocaleString("ja-JP"),
                      ],
                      ["products_202604.csv", "取込済み", "mint", "2026/04/29 09:39"],
                      ["inventory_202604.csv", "要確認", "gold", "2026/04/27 18:21"],
                    ] as const)
                  : ([
                      ["orders_202604.csv", "取込済み", "mint", "2026/04/29 09:42"],
                      ["products_202604.csv", "取込済み", "mint", "2026/04/29 09:39"],
                      ["inventory_202604.csv", "要確認", "gold", "2026/04/27 18:21"],
                    ] as const)
                ).map(([n, s, t, d]) => (
                  <li
                    key={n}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-2.5 py-1.5"
                  >
                    <span className="truncate font-mono text-[11px] text-slate-700">
                      {n}
                    </span>
                    <span className="flex items-center gap-2">
                      <Pill tone={t as "mint" | "gold"} size="xs">
                        {s}
                      </Pill>
                      <span className="text-[10px] text-slate-400">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-2 text-[11px] text-sky-600 hover:text-sky-700">
                すべての履歴を見る
              </button>
            </div>
          </SectionCard>

          <SectionCard
            className="lg:col-span-3"
            title="API連携（任意・将来的に拡張可能）"
            icon={<Plug size={16} />}
          >
            <p className="text-[11px] leading-6 text-slate-500">
              API連携なしでもCSVで月次診断を開始できます。
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { l: "Shopify", s: "任意・未接続" },
                { l: "GA4", s: "任意・未接続" },
                { l: "Google広告", s: "未接続" },
                { l: "Meta広告", s: "未接続" },
                { l: "BigQuery", s: "任意" },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-xl border border-slate-100 p-2.5"
                >
                  <div className="text-xs font-semibold text-slate-800">
                    {x.l}
                  </div>
                  <div className="text-[10px] text-slate-500">{x.s}</div>
                  <button className="mt-1.5 w-full rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50">
                    接続する
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bottom action bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-white">
          <button
            className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20"
            onClick={triggerSelect}
            disabled={isImporting}
          >
            <Upload size={14} /> CSVをアップロード
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            <Plug size={14} /> Shopify APIに接続
          </button>
          <button
            className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20"
            onClick={clearOrdersImport}
          >
            <Beaker size={14} /> サンプルデータで試す
          </button>
          <button className="btn-success ml-auto px-3 py-1.5 text-sm">
            <Sparkles size={14} /> AI診断を開始
          </button>
          <a
            href="/samples/orders_sample.csv"
            download="orders_sample.csv"
            className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20"
          >
            <Download size={14} /> データテンプレートを取得
          </a>
        </div>
      </div>
    </>
  );
}

function formatPeriod(start: Date | null, end: Date | null): string {
  if (!start || !end) return "—";
  const fmt = (d: Date) =>
    `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  return `${fmt(start)} 〜 ${fmt(end)}`;
}

type ImportLite = { fileName: string; importedAt: Date } | null;

function pickLatest(...sources: ImportLite[]): ImportLite {
  let latest: ImportLite = null;
  for (const s of sources) {
    if (!s) continue;
    if (!latest || s.importedAt.getTime() > latest.importedAt.getTime()) {
      latest = s;
    }
  }
  return latest;
}

function latestImportLabel(
  orders: ImportLite,
  ga4: ImportLite,
  ads: ImportLite,
): string {
  const newer = pickLatest(orders, ga4, ads);
  return newer ? newer.importedAt.toLocaleString("ja-JP") : "2026/04/29 09:42";
}

function latestImportSub(
  orders: ImportLite,
  ga4: ImportLite,
  ads: ImportLite,
): string {
  const newer = pickLatest(orders, ga4, ads);
  if (newer) return `ファイル: ${newer.fileName}`;
  return "前回: 2026/04/28 18:31";
}

function summaryConnectedSub(
  orders: ImportLite,
  ga4: ImportLite,
  ads: ImportLite,
): string {
  const labels: string[] = [];
  if (orders) labels.push("注文CSV");
  if (ga4) labels.push("GA4 CSV");
  if (ads) labels.push("広告CSV");
  if (labels.length === 0) return "前月比 +1";
  return `${labels.join(" / ")} 取込済み`;
}

function fulfillmentValue(ga4: ImportLite, ads: ImportLite): number {
  let v = 78;
  if (ga4) v += 6;
  if (ads) v += 6;
  return Math.min(100, v);
}

function fulfillmentLabel(ga4: ImportLite, ads: ImportLite): string {
  return `${fulfillmentValue(ga4, ads)}%`;
}

function fulfillmentSub(ga4: ImportLite, ads: ImportLite): string {
  if (ga4 && ads) return "GA4 / 広告 取込で +12pt";
  if (ga4) return "GA4取込で +6pt";
  if (ads) return "広告CSV取込で +6pt";
  return "前月比 +8pt";
}

function MessageBlock({
  tone,
  title,
  items,
  icon,
  moreCount,
}: {
  tone: "rose" | "amber";
  title: string;
  items: string[];
  icon: React.ReactNode;
  moreCount?: number;
}) {
  const wrap =
    tone === "rose"
      ? "border-rose-200 bg-rose-50/60 text-rose-700"
      : "border-amber-200 bg-amber-50/60 text-amber-700";
  return (
    <div className={`rounded-xl border p-3 ${wrap}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {icon}
        {title}
      </div>
      <ul className="mt-1.5 space-y-0.5 text-[11px] leading-5">
        {items.map((t, i) => (
          <li key={i}>・{t}</li>
        ))}
        {moreCount && moreCount > 0 ? (
          <li className="text-slate-500">…他 {moreCount} 件</li>
        ) : null}
      </ul>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  sub,
  tone,
  progress,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "emerald" | "amber";
  progress?: number;
}) {
  const dotColor =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "amber"
        ? "bg-amber-500"
        : "bg-slate-300";
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <div className="text-[11px] text-slate-500">{label}</div>
      </div>
      <div className="mt-1 text-lg font-bold tracking-tight text-slate-900">
        {value}
      </div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
      {progress !== undefined && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  tone,
  items,
  icon,
}: {
  title: string;
  tone: "emerald" | "amber" | "rose";
  items: string[];
  icon?: boolean;
}) {
  const colorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  };
  const Icon = tone === "emerald" ? CheckCircle2 : AlertTriangle;
  return (
    <div className="mt-3">
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${colorMap[tone]}`}>
        {icon ? <CheckCircle2 size={13} /> : <Icon size={13} />}
        {title}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Pill key={it} tone="slate" size="xs">
            {it}
          </Pill>
        ))}
      </div>
    </div>
  );
}
