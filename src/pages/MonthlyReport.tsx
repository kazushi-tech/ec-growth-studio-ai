import {
  FileText,
  FileBarChart2,
  Sparkles,
  ListChecks,
  Calendar,
  Store,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  Plus,
  Download,
  AlertTriangle,
  Maximize2,
  Presentation,
  RefreshCw,
  Target,
  Database,
  Info,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill, {
  impactTone,
  statusTone,
} from "../components/ui/Pill";
import {
  actions,
  dataSources,
  insights,
  kpis,
  monthlyStats,
  reportSections,
} from "../data/sample";
import type { DataSource } from "../data/sample";

const reportStatusTone = (s: string) => {
  if (s.includes("AI生成") || s.includes("数値確認") || s.includes("反映"))
    return "mint";
  if (s.includes("レビュー")) return "gold";
  if (s.includes("一部")) return "sky";
  if (s.includes("要")) return "rose";
  if (s.includes("リスク")) return "rose";
  return "slate";
};

const dataSourceTone = (s: DataSource["status"]) => {
  switch (s) {
    case "取込済み":
      return "mint";
    case "要確認":
      return "gold";
    case "未接続":
      return "rose";
    case "任意":
      return "slate";
    default:
      return "slate";
  }
};

const reportKpiKeys = ["sales", "orders", "aov", "cvr", "repeat", "roas"];

export default function MonthlyReport() {
  const reportKpis = kpis.filter((k) => reportKpiKeys.includes(k.key));
  const priorityActions = actions
    .filter((a) => a.priority === "P1")
    .slice(0, 5);

  return (
    <>
      <Topbar
        title="月次レポート出力"
        subtitle="売上分析・AI考察・改善施策・効果検証を顧客提出用レポートに整理"
        actions={
          <>
            <button className="btn-primary px-3 py-1.5 text-xs">
              <FileBarChart2 size={12} /> 月次レポートを生成
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              <LinkIcon size={12} /> 顧客共有リンクを作成
            </button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-5">
        {/* === Client report (paper-like) === */}
        <article className="rounded-2xl border border-slate-200 bg-white shadow-card">
          {/* Cover */}
          <header className="border-b border-slate-100 px-8 pt-8 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
              <span>Monthly EC Growth Report</span>
              <span className="text-slate-300">|</span>
              <span>Prepared by EC Growth Studio Team</span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              2026年4月 月次EC改善レポート
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Sample Shopify Store さま向け / 月次BPaaS伴走
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600 md:grid-cols-4">
              <CoverMeta icon={<Calendar size={12} />} label="対象月" value="2026年4月（4/1〜4/30）" />
              <CoverMeta icon={<Store size={12} />} label="対象ストア" value="Sample Shopify Store" />
              <CoverMeta icon={<Users size={12} />} label="作成者" value="EC Growth Studio Team" />
              <CoverMeta icon={<RefreshCw size={12} />} label="最終更新" value="2026/04/29 09:42" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <Pill tone="mint" size="xs">
                AI診断完了
              </Pill>
              <Pill tone="gold" size="xs">
                担当者レビュー中
              </Pill>
              <Pill tone="sky" size="xs">
                BPaaS伴走中
              </Pill>
              <Pill tone="slate" size="xs">
                データ: CSV取込（注文 / GA4 / 広告）
              </Pill>
            </div>
          </header>

          {/* Executive summary */}
          <section className="border-b border-slate-100 px-8 py-6">
            <SectionTitle
              icon={<Sparkles size={14} />}
              eyebrow="01 / Executive Summary"
              title="今月の結論"
            />
            <p className="mt-3 text-[15px] leading-7 text-slate-700">
              売上は前月比 <b className="text-emerald-600">+14.3%</b> で堅調に成長。
              主力商品AのCVR低下と広告ROAS悪化が次月の最優先課題であり、
              <b>商品ページ改善 / 広告予算配分 / 初回購入者CRM</b> の3点で
              <b className="text-slate-900"> +¥1,200,000 前後の上乗せ</b>を見込む。
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <ExecCallout
                tone="mint"
                title="伸びている指標"
                items={[
                  "売上 / 注文数 / AOV / リピート率",
                  "商品B（CVR・ROAS）",
                ]}
              />
              <ExecCallout
                tone="rose"
                title="次月の重点課題"
                items={[
                  "商品A FV訴求 → CVR低下",
                  "広告ROAS悪化（商品Aへの偏り）",
                ]}
              />
              <ExecCallout
                tone="sky"
                title="伴走で動かすこと"
                items={[
                  "P1 施策3件を5月第1週に着手",
                  "5/7 月次定例で効果確認",
                ]}
              />
            </div>
          </section>

          {/* KPI snapshot */}
          <section className="border-b border-slate-100 px-8 py-6">
            <SectionTitle
              icon={<TrendingUp size={14} />}
              eyebrow="02 / KPI Snapshot"
              title="主要KPI（前月比）"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {reportKpis.map((k) => (
                <ReportKpi key={k.key} label={k.label} value={k.value} delta={k.delta} intent={k.intent} />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              ※ 売上 / 注文数 / AOV は注文CSV由来の <b>実値</b>、CVR / リピート / ROAS は
              GA4・広告CSV取込状況に応じて切替。前月数値は静的サンプル（推定）。
            </p>
          </section>

          {/* Issues by area */}
          <section className="border-b border-slate-100 px-8 py-6">
            <SectionTitle
              icon={<AlertTriangle size={14} />}
              eyebrow="03 / Issues"
              title="今月の課題（領域別）"
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
              <table className="table-clean">
                <thead>
                  <tr>
                    <th>領域</th>
                    <th>状態</th>
                    <th>所見</th>
                    <th>影響度</th>
                    <th>次の一手</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((ins) => (
                    <tr key={ins.area}>
                      <td className="font-medium text-slate-800">{ins.area}</td>
                      <td>
                        <Pill tone={insightStateTone(ins.state)} size="xs">
                          {ins.state}
                        </Pill>
                      </td>
                      <td className="text-slate-700">{ins.summary}</td>
                      <td>
                        <Pill tone={impactTone(ins.impact)} size="xs">
                          影響 {ins.impact}
                        </Pill>
                      </td>
                      <td className="text-slate-700">{ins.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Priority actions for next month */}
          <section className="border-b border-slate-100 px-8 py-6">
            <SectionTitle
              icon={<Target size={14} />}
              eyebrow="04 / Next Month"
              title="来月の重点施策（P1）"
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
              <table className="table-clean">
                <thead>
                  <tr>
                    <th>施策</th>
                    <th>領域</th>
                    <th>担当</th>
                    <th>期限</th>
                    <th>期待効果</th>
                    <th>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityActions.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="font-medium text-slate-800">{a.title}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {a.rationale}
                        </div>
                      </td>
                      <td className="text-slate-700">{a.area}</td>
                      <td className="text-slate-700">{a.owner}</td>
                      <td className="text-slate-700">{a.due}</td>
                      <td className="text-emerald-700">{a.expected}</td>
                      <td>
                        <Pill tone={statusTone(a.status)} size="xs">
                          {a.status}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-slate-500 md:grid-cols-4">
              <FootStat label="今月の施策数" value={`${monthlyStats.totalActions}件`} />
              <FootStat label="完了" value={`${monthlyStats.done}件`} />
              <FootStat label="進行中" value={`${monthlyStats.inProgress}件`} />
              <FootStat
                label="想定売上インパクト"
                value={monthlyStats.expectedSalesLift}
              />
            </div>
          </section>

          {/* Data sources */}
          <section className="border-b border-slate-100 px-8 py-6">
            <SectionTitle
              icon={<Database size={14} />}
              eyebrow="05 / Data Sources"
              title="データソース状態"
            />
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {dataSources.map((d) => (
                <div
                  key={d.name}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800">
                      {d.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {d.method} ・ {d.updated} ・ {d.count}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {d.impact}
                    </div>
                  </div>
                  <Pill tone={dataSourceTone(d.status)} size="xs">
                    {d.status}
                  </Pill>
                </div>
              ))}
            </div>
          </section>

          {/* Disclosure / footnotes */}
          <section className="rounded-b-2xl bg-slate-50/60 px-8 py-6">
            <SectionTitle
              icon={<Info size={14} />}
              eyebrow="06 / Notes"
              title="未接続範囲・デモデータ注記"
            />
            <ul className="mt-3 space-y-2 text-[12px] leading-6 text-slate-600">
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-slate-400" />
                数値の出所:{" "}
                <span className="text-slate-700">
                  売上 / 注文数 / AOV は注文CSV、セッション / CVR は GA4 CSV、ROAS / CPC は広告CSV由来の
                  <b> 実値</b>。前月数値・AI考察文・主因候補ヘッドラインは <b>静的サンプル</b>。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-500" />
                未接続範囲:{" "}
                <span className="text-slate-700">
                  実 GCP / 実 BigQuery / 実 GA4 Data API / 実広告API / 実 Shopify Admin API / 実 AI 生成 は <b>未接続</b>（CSV取込のみで動作）。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info size={14} className="mt-0.5 shrink-0 text-sky-500" />
                BigQueryデモ Mode:{" "}
                <span className="text-slate-700">
                  <code>BQ_MOCK_MODE=true</code> の Preview 環境でだけ
                  <b> mock 表示</b>される位置づけで、Production では安全停止しサンプル/CSV値にフォールバック。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                データ保持:{" "}
                <span className="text-slate-700">
                  CSV取込結果は <b>ブラウザ内 localStorage のみ</b>。外部送信なし。認証情報・APIキーは扱わず。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-slate-400" />
                出力形式:{" "}
                <span className="text-slate-700">
                  PDF / PowerPoint / Google Docs の自動生成は <b>レイアウト設計のみ</b>。Phase 4 で実装予定。
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-500" />
                顧客提出前チェック:{" "}
                <span className="text-slate-700">
                  薬機法・景表法の表現確認 / データ不足注記 / 担当者承認 を済ませてから提出してください。
                </span>
              </li>
            </ul>
          </section>
        </article>

        {/* === Operations panel (secondary) === */}
        <SectionCard title="レポートサマリー（運用）" icon={<FileText size={16} />}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-7">
            <SummaryItem icon={<Calendar size={14} />} label="対象月" value="2026年4月" />
            <SummaryItem icon={<Store size={14} />} label="対象ストア" value="Sample Shopify Store" />
            <DonutItem percent={86} label="レポート完成度" />
            <SummaryItem icon={<Sparkles size={14} />} label="AI診断" value="完了" tone="mint" />
            <SummaryItem icon={<ListChecks size={14} />} label="施策反映" value="12件" />
            <SummaryItem icon={<CheckCircle2 size={14} />} label="効果検証済み" value="4件" />
            <SummaryItem icon={<Users size={14} />} label="顧客提出ステータス" value="レビュー中" tone="gold" />
          </div>
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-12">
          <SectionCard
            className="xl:col-span-3"
            title="レポート構成プレビュー"
            icon={<FileText size={16} />}
          >
            <ol className="space-y-2">
              {reportSections.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-slate-500">
                      {s.no}
                    </div>
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {s.title}
                  </div>
                  <div className="mt-1.5">
                    <Pill tone={reportStatusTone(s.status)} size="xs">
                      {s.status}
                    </Pill>
                  </div>
                </li>
              ))}
              <li>
                <button className="w-full rounded-xl border border-dashed border-slate-300 px-2 py-2 text-[11px] text-slate-500 hover:bg-slate-50">
                  <Plus size={11} className="mr-1 inline" /> セクションを追加
                </button>
              </li>
            </ol>
          </SectionCard>

          <SectionCard
            className="xl:col-span-3"
            title="編集・確認ステータス"
            icon={<RefreshCw size={16} />}
          >
            <Step
              dotColor="bg-emerald-500"
              title="AI生成済み"
              sub={`AIがレポートを生成 / 2026/04/29 09:10`}
              icon={<Sparkles size={14} />}
              completed
            />
            <StepArrow />
            <Step
              dotColor="bg-amber-500"
              title="担当者レビュー中"
              sub="Growth Team が内容を確認中"
              icon={<Users size={14} />}
            />
            <StepArrow />
            <Step
              dotColor="bg-sky-500"
              title="顧客提出可"
              sub="社内承認後に提出可能"
              icon={<CheckCircle2 size={14} />}
              hint
            />
            <div className="mt-2 space-y-1.5">
              <Pill tone="rose">
                <AlertTriangle size={11} /> 要確認
              </Pill>
              <div />
              <Pill tone="rose">
                <AlertTriangle size={11} /> データ不足
              </Pill>
              <div />
              <Pill tone="rose">
                <AlertTriangle size={11} /> 表現リスク確認
              </Pill>
            </div>
            <StepArrow />
            <Step
              dotColor="bg-violet-500"
              title="顧客提出"
              sub="クライアントに共有・提出"
              icon={<Presentation size={14} />}
            />
          </SectionCard>

          <SectionCard
            className="xl:col-span-3"
            title="出力形式"
            icon={<Download size={16} />}
            action={
              <span className="text-[11px] text-slate-400">
                <Maximize2 size={11} className="inline" /> Phase 4 予定
              </span>
            }
          >
            <div className="grid grid-cols-2 gap-2">
              <FormatCard label="PDF" tone="primary" />
              <FormatCard label="PowerPoint" />
              <FormatCard label="Google Slides" />
              <FormatCard label="共有リンク" />
              <FormatCard label="Notion連携" muted="近日対応" />
              <FormatCard label="Google Docs連携" muted="近日対応" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="btn-primary px-3 py-2 text-xs">
                PDFで出力
              </button>
              <button className="btn-secondary px-3 py-2 text-xs">
                PowerPointで出力
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              ※ 自動出力は Phase 4 で実装予定。現状は UI 上のレイアウトを担当者が確認する用途。
            </p>
          </SectionCard>

          <SectionCard
            className="xl:col-span-3"
            title="顧客提出前チェック"
            icon={<CheckCircle2 size={16} />}
          >
            <CheckRow icon="ok" label="数値確認" status="完了" tone="mint" />
            <CheckRow icon="ok" label="表現チェック" status="完了" tone="mint" />
            <CheckRow
              icon="warn"
              label="薬機法/景表法などの注意"
              status="要確認"
              tone="gold"
              detail="効果効能の断定表現を確認してください"
            />
            <CheckRow
              icon="warn"
              label="データ不足の注記"
              status="要確認"
              tone="gold"
              detail="商品別粗利未入力のため利益評価は注記が必要"
            />
            <CheckRow icon="todo" label="担当者承認" status="未完了" tone="slate" />
            <CheckRow
              icon="todo"
              label="顧客向けコメント確認"
              status="未完了"
              tone="slate"
            />
          </SectionCard>
        </div>

        <SectionCard title="出力・共有アクション" icon={<Download size={16} />}>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            <button className="btn-primary px-3 py-2 text-xs">
              <Sparkles size={12} /> 月次レポートを生成
            </button>
            <button className="btn-secondary px-3 py-2 text-xs">
              <LinkIcon size={12} /> 顧客共有リンクを作成
            </button>
            <button className="btn-secondary px-3 py-2 text-xs">
              PDFで出力
            </button>
            <button className="btn-secondary px-3 py-2 text-xs">
              施策ボードから再反映
            </button>
            <button className="btn-secondary px-3 py-2 text-xs">
              PowerPointで出力
            </button>
            <button className="btn-secondary px-3 py-2 text-xs">
              次月アクションを作成
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500 md:grid-cols-4">
            <div>
              <div className="text-slate-400">次回報告会</div>
              <div className="text-slate-700">5月7日 10:00</div>
            </div>
            <div>
              <div className="text-slate-400">共有範囲</div>
              <div className="text-slate-700">クライアント閲覧可</div>
            </div>
            <div>
              <div className="text-slate-400">承認者</div>
              <div className="text-slate-700">EC Growth Studio Team</div>
            </div>
            <div>
              <div className="text-slate-400">最終更新</div>
              <div className="text-slate-700">2026/04/29 09:42</div>
            </div>
          </div>
        </SectionCard>

        <p className="text-center text-[11px] text-slate-400">
          ※ 数値や表現は自動生成されています。提出前に必ず内容をご確認ください。
        </p>
      </div>
    </>
  );
}

function CoverMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {icon && <span className="text-slate-400">{icon}</span>}
        {eyebrow}
      </div>
      <h3 className="mt-1 border-l-4 border-navy-900 pl-2 text-base font-semibold text-slate-900">
        {title}
      </h3>
    </div>
  );
}

function ExecCallout({
  tone,
  title,
  items,
}: {
  tone: "mint" | "rose" | "sky";
  title: string;
  items: string[];
}) {
  const toneClass =
    tone === "mint"
      ? "border-emerald-100 bg-emerald-50/60"
      : tone === "rose"
        ? "border-rose-100 bg-rose-50/60"
        : "border-sky-100 bg-sky-50/60";
  const dotClass =
    tone === "mint"
      ? "bg-emerald-500"
      : tone === "rose"
        ? "bg-rose-500"
        : "bg-sky-500";
  return (
    <div className={`rounded-xl border ${toneClass} p-3`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-[12px] text-slate-700">
        {items.map((it) => (
          <li key={it} className="leading-5">
            ・{it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportKpi({
  label,
  value,
  delta,
  intent,
}: {
  label: string;
  value: string;
  delta: string;
  intent: "positive" | "negative" | "neutral";
}) {
  const Icon =
    intent === "positive"
      ? TrendingUp
      : intent === "negative"
        ? TrendingDown
        : Info;
  const color =
    intent === "positive"
      ? "text-emerald-600"
      : intent === "negative"
        ? "text-rose-600"
        : "text-slate-500";
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
      <div className={`mt-0.5 flex items-center gap-1 text-[11px] font-semibold ${color}`}>
        <Icon size={12} />
        {delta}
      </div>
    </div>
  );
}

function FootStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-2.5">
      <div className="text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function insightStateTone(s: string) {
  switch (s) {
    case "要改善":
      return "rose" as const;
    case "配分見直し":
      return "gold" as const;
    case "伸長余地":
      return "mint" as const;
    case "要確認":
      return "sky" as const;
    default:
      return "slate" as const;
  }
}

function SummaryItem({
  icon,
  label,
  value,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  tone?: "mint" | "gold";
}) {
  const valueColor =
    tone === "mint"
      ? "text-emerald-600"
      : tone === "gold"
        ? "text-amber-600"
        : "text-slate-900";
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>
      <div className={`mt-1 text-sm font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}

function DonutItem({ percent, label }: { percent: number; label: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c * (1 - percent / 100);
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          role="img"
          aria-label={`${label} ${percent}%`}
        >
          <circle
            cx="24"
            cy="24"
            r={r}
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r={r}
            stroke="#10b981"
            strokeWidth="5"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={off}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
          />
        </svg>
        <div className="text-xl font-bold text-slate-900">{percent}%</div>
      </div>
    </div>
  );
}

function Step({
  dotColor,
  title,
  sub,
  icon,
  completed,
  hint,
}: {
  dotColor: string;
  title: string;
  sub?: string;
  icon?: React.ReactNode;
  completed?: boolean;
  hint?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-2.5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${dotColor} text-white`}
        >
          {icon}
        </span>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        {completed && (
          <CheckCircle2 size={14} className="ml-auto text-emerald-500" />
        )}
        {hint && (
          <Pill tone="sky" size="xs">
            次のステップ
          </Pill>
        )}
      </div>
      {sub && <p className="mt-1 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

function StepArrow() {
  return (
    <div className="flex justify-center py-1">
      <span className="h-3 w-px bg-slate-300" />
    </div>
  );
}

function FormatCard({
  label,
  tone,
  muted,
}: {
  label: string;
  tone?: "primary";
  muted?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-2.5 text-center ${
        tone === "primary"
          ? "border-navy-900 bg-navy-50 text-navy-800"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <div className="text-xs font-semibold">{label}</div>
      {muted && (
        <div className="mt-0.5 text-[11px] text-slate-400">{muted}</div>
      )}
    </div>
  );
}

function CheckRow({
  icon,
  label,
  status,
  tone,
  detail,
}: {
  icon: "ok" | "warn" | "todo";
  label: string;
  status: string;
  tone: "mint" | "gold" | "slate";
  detail?: string;
}) {
  const Icon =
    icon === "ok" ? CheckCircle2 : icon === "warn" ? AlertTriangle : Plus;
  const color =
    icon === "ok"
      ? "text-emerald-500"
      : icon === "warn"
        ? "text-amber-500"
        : "text-slate-400";
  return (
    <div className="mt-2 flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-white p-2.5">
      <div className="flex items-start gap-2">
        <Icon size={14} className={`mt-0.5 ${color}`} />
        <div>
          <div className="text-xs font-medium text-slate-800">{label}</div>
          {detail && (
            <div className="text-[11px] text-slate-500">{detail}</div>
          )}
        </div>
      </div>
      <Pill tone={tone} size="xs">
        {status}
      </Pill>
    </div>
  );
}
