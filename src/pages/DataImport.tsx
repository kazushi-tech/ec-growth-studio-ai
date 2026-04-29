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

export default function DataImport() {
  const {
    ordersImport,
    lastFailure,
    isImporting,
    importOrdersFile,
    clearOrdersImport,
    dismissFailure,
  } = useImport();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      await importOrdersFile(file);
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

        {/* Connection summary */}
        <SectionCard title="データ接続サマリー" icon={<Database size={16} />}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <SummaryItem
              label="接続済みデータ"
              value={ordersImport ? "7" : "6"}
              sub={ordersImport ? "CSV取込 +1" : "前月比 +1"}
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
              value={
                ordersImport
                  ? ordersImport.importedAt.toLocaleString("ja-JP")
                  : "2026/04/29 09:42"
              }
              sub={
                ordersImport
                  ? `ファイル: ${ordersImport.fileName}`
                  : "前回: 2026/04/28 18:31"
              }
            />
            <SummaryItem
              label="AI診断データ充足率"
              value="78%"
              sub="前月比 +8pt"
              tone="emerald"
              progress={78}
            />
            <SummaryItem
              label="今月の診断ステータス"
              value="診断可能"
              sub="全体の78%のデータを確保"
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
                {dataSources.map((d) => (
                  <tr key={d.name}>
                    <td>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                        {sourceIcon(d.name)}
                        {d.name}
                      </div>
                    </td>
                    <td>
                      <Pill tone={stateTone(d.status)} size="xs">
                        {d.status}
                      </Pill>
                    </td>
                    <td className="text-slate-600">{d.method}</td>
                    <td className="text-slate-500">{d.updated}</td>
                    <td className="text-slate-700">{d.count}</td>
                    <td className="text-slate-500">{d.impact}</td>
                    <td>
                      <button className="text-xs text-sky-600 hover:text-sky-700">
                        {d.action}
                      </button>
                    </td>
                  </tr>
                ))}
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
                {isImporting
                  ? "読み込み中..."
                  : "CSVファイルをドラッグ＆ドロップ"}
              </div>
              <div className="text-[11px] text-slate-500">
                またはクリックしてファイルを選択
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {[
                  "注文CSV",
                  "商品CSV",
                  "在庫CSV",
                  "レビューCSV",
                  "広告CSV",
                  "GA4 CSV",
                  "CRM CSV",
                ].map((t) => (
                  <Pill
                    key={t}
                    tone={t === "注文CSV" ? "mint" : "slate"}
                    size="xs"
                  >
                    {t}
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
                  disabled={isImporting}
                >
                  <Upload size={12} /> CSVをアップロード
                </button>
                <a
                  href="/samples/orders_sample.csv"
                  download="orders_sample.csv"
                  className="btn-secondary px-3 py-1.5 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={12} /> CSVテンプレートを取得
                </a>
              </div>
              {uploadError && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
                  <XCircle size={12} /> {uploadError}
                </div>
              )}
            </div>

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
