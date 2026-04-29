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
  Check,
  Database,
  Lightbulb,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import KpiCard from "../components/ui/KpiCard";
import SectionCard from "../components/ui/SectionCard";
import StepFlow from "../components/ui/StepFlow";
import Pill, {
  impactTone,
  judgmentTone,
  statusTone,
} from "../components/ui/Pill";
import { actions, kpis as sampleKpis, products } from "../data/sample";
import { useImport } from "../lib/csv/ImportContext";
import { buildKpisFromImport } from "../lib/csv/buildKpis";

export default function Dashboard() {
  const { ordersImport } = useImport();
  const top5 = actions.slice(0, 5);
  const kpis = ordersImport
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

      <div className="space-y-5 px-6 py-5">
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

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <KpiCard key={k.key} kpi={k} />
          ))}
        </div>

        {/* AI Summary + Cycle row */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard
              title="AI月次診断サマリー"
              icon={<Sparkles size={16} />}
              action={
                <Pill tone="mint">
                  <Check size={11} /> 信頼度: 高
                </Pill>
              }
            >
              <p className="text-sm leading-7 text-slate-700">
                売上は成長していますが、広告費増加に対して主力商品のCVRと在庫効率が追いついていません。
                今月は<b>商品Aのページ改善</b>、<b>商品Bへの広告配分変更</b>、
                <b>初回購入者CRMの強化</b>を優先します。
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <SummaryStat
                  tone="mint"
                  icon={<Lightbulb size={16} />}
                  title="売上機会"
                  body="商品Bは在庫十分・CVR安定。広告拡張で売上増が見込めます。"
                  meta="インパクト: 高"
                />
                <SummaryStat
                  tone="rose"
                  icon={<AlertTriangle size={16} />}
                  title="リスク"
                  body="商品Aは売上構成比が高い一方、CVR低下と在庫残が発生。"
                  meta="重要度: 高"
                />
                <SummaryStat
                  tone="sky"
                  icon={<Target size={16} />}
                  title="優先施策"
                  body="商品AのLP改善と広告配分見直しを今週中に実行。"
                  meta="今週の優先度: 高"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span>分析期間: 2026年4月</span>
                <span className="text-slate-300">|</span>
                <span>次回改善会議: 5月7日</span>
              </div>
            </SectionCard>
          </div>

          <SectionCard
            title="月次改善サイクル"
            icon={<RefreshCw size={16} />}
            action={
              <span className="text-[11px] text-slate-500">
                次回会議: 5/7 10:00
              </span>
            }
          >
            <StepFlow />
            <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Users size={12} /> 担当: EC Growth Studio Team
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock size={12} /> 今週の完了目標: 3件
              </div>
            </div>
          </SectionCard>
        </div>

        {/* TOP5 + Product judgment row */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-5"
            title="優先アクション TOP5"
            icon={<ListChecks size={16} />}
            action={
              <Link
                to="/app/action-board"
                className="text-sky-600 hover:text-sky-700"
              >
                施策ボードで実行管理 →
              </Link>
            }
            bodyClassName="!px-2 !py-2"
          >
            <table className="table-clean">
              <thead>
                <tr>
                  <th className="!w-8">#</th>
                  <th>アクション</th>
                  <th>関連領域</th>
                  <th className="!w-16">インパクト</th>
                  <th>担当者</th>
                  <th className="!w-12">期限</th>
                  <th className="!w-20">進捗</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((a) => (
                  <tr key={a.id}>
                    <td className="text-slate-400">{a.id}</td>
                    <td className="font-medium text-slate-800">{a.title}</td>
                    <td>
                      <Pill tone="slate" size="xs">
                        {a.area}
                      </Pill>
                    </td>
                    <td>
                      <Pill tone={impactTone(a.impact)} size="xs">
                        {a.impact}
                      </Pill>
                    </td>
                    <td className="text-slate-600">{a.owner}</td>
                    <td className="text-slate-500">{a.due}</td>
                    <td>
                      <Pill tone={statusTone(a.status)} size="xs">
                        {a.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 px-3 pb-1 pt-2 text-xs">
              <Link
                to="/app/action-board"
                className="inline-flex items-center gap-1 font-medium text-navy-700 hover:text-navy-900"
              >
                → 施策ボードで実行管理
              </Link>
            </div>
          </SectionCard>

          <SectionCard
            className="lg:col-span-7"
            title="商品別改善判断"
            icon={<Boxes size={16} />}
            action={
              <Link
                to="/app/product-page"
                className="text-sky-600 hover:text-sky-700"
              >
                商品ページ改善 →
              </Link>
            }
            bodyClassName="!px-2 !py-2"
          >
            <table className="table-clean">
              <thead>
                <tr>
                  <th>商品</th>
                  <th className="!w-20">判断</th>
                  <th>売上</th>
                  <th>CVR</th>
                  <th>在庫</th>
                  <th>広告費</th>
                  <th>AI推奨</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-200 to-slate-50 text-[11px] font-semibold text-slate-600">
                          {p.id}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {p.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Pill tone={judgmentTone(p.judgment)} size="xs">
                        {p.judgment}
                      </Pill>
                    </td>
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
                        {p.cvr}
                        <span className="text-[10px]">{p.cvrDelta}</span>
                      </span>
                    </td>
                    <td className="text-slate-600">残 {p.stock}</td>
                    <td className="text-slate-600">{p.ad}</td>
                    <td className="text-slate-500">{p.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>

        {/* Bottom row: Insights / Data state / Next */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SectionCard
            title="最新インサイト"
            icon={<Sparkles size={16} />}
            className="lg:col-span-2"
            action={
              <Link
                to="/app/ai-report"
                className="text-sky-600 hover:text-sky-700"
              >
                すべてのAIインサイトを見る →
              </Link>
            }
          >
            <ul className="grid gap-2 md:grid-cols-2">
              {(
                [
                  ["広告費は +¥620,000（前月比 +18%）", "bg-amber-500"],
                  ["商品AのCVRが -0.6pt 低下", "bg-rose-500"],
                  ["新規顧客数は +12% で推移", "bg-emerald-500"],
                  ["在庫回転日数は +4日 悪化", "bg-rose-500"],
                ] as const
              ).map(([t, c]) => (
                <li
                  key={t}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-sm"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${c}`}
                    aria-hidden
                  />
                  {t}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="次に実行すべきこと"
            icon={<Target size={16} />}
          >
            <div className="text-sm leading-7 text-slate-700">
              商品Aの商品ページ改善を最優先で開始してください。
            </div>
            <Link
              to="/app/product-page"
              className="btn-primary mt-4 w-full justify-center text-sm"
            >
              改善タスクを開く
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/app/ai-report"
              className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              根拠を見る <ChevronRight size={12} />
            </Link>
          </SectionCard>
        </div>

        {/* Data linkage state */}
        <SectionCard title="データ連携状態" icon={<Database size={16} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ordersImport
                ? {
                    name: "Shopify注文CSV",
                    state: "取込済",
                    when: `${ordersImport.importedAt.toLocaleString("ja-JP")} / ${ordersImport.parseResult.acceptedRows.toLocaleString("ja-JP")}件`,
                    detail: ordersImport.fileName,
                    tone: "mint" as const,
                  }
                : {
                    name: "Shopify注文CSV",
                    state: "未取込",
                    when: "未取込",
                    detail: undefined,
                    tone: "gold" as const,
                  },
              { name: "商品CSV", state: "取込済", when: "最終: 4/30 08:30", detail: undefined, tone: "mint" as const },
              { name: "広告CSV", state: "取込済", when: "最終: 4/30 08:30", detail: undefined, tone: "mint" as const },
              { name: "GA4 CSV", state: "任意・未取込", when: "未取込", detail: undefined, tone: "gold" as const },
              { name: "Shopify API", state: "任意・未接続", when: "未接続", detail: undefined, tone: "gold" as const },
            ].map((d) => (
              <div key={d.name} className="rounded-xl border border-slate-100 p-3">
                <div className="text-xs font-semibold text-slate-700">
                  {d.name}
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <Pill tone={d.tone} size="xs">
                    {d.state}
                  </Pill>
                  <span className="truncate text-[10px] text-slate-400" title={d.when}>
                    {d.when}
                  </span>
                </div>
                {d.detail && (
                  <div
                    className="mt-1 truncate font-mono text-[10px] text-slate-500"
                    title={d.detail}
                  >
                    {d.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-emerald-700">
            ✓ CSVだけで月次診断可能
          </p>
        </SectionCard>
      </div>
    </>
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
      <div className="mt-2 text-[10px] text-slate-500">{meta}</div>
    </div>
  );
}
