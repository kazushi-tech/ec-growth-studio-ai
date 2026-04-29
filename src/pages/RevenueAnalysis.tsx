import { Link } from "react-router-dom";
import {
  TrendingDown,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  MousePointer,
  Target,
  ShoppingCart,
  Activity,
  AlertTriangle,
  Lightbulb,
  Database,
  Compass,
  ArrowRight,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill, {
  effortTone,
  impactTone,
  priorityTone,
} from "../components/ui/Pill";
import {
  revenueAnalysis,
  type RevenueCause,
  type RevenueDataReadiness,
  type RevenueFactor,
  type RevenueFactorKey,
  type RevenueNextAction,
} from "../data/sample";

const factorIcon: Record<RevenueFactorKey, LucideIcon> = {
  sessions: MousePointer,
  cvr: Target,
  aov: ShoppingCart,
};

const causeBadgeTone: Record<
  RevenueCause["category"],
  "sky" | "rose" | "violet" | "gold" | "slate"
> = {
  流入: "sky",
  商品ページCVR: "rose",
  "カート/決済": "violet",
  AOV: "gold",
  "在庫/商品": "slate",
};

const readinessTone: Record<
  RevenueDataReadiness["state"],
  "mint" | "gold" | "slate"
> = {
  取込済み: "mint",
  次フェーズ: "gold",
  将来: "slate",
};

const sendToTone: Record<RevenueNextAction["sendTo"], "navy" | "violet"> = {
  施策ボード: "navy",
  AI考察レポート: "violet",
};

const intentTextClass: Record<
  RevenueFactor["changeIntent"],
  string
> = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-slate-500",
};

const intentBarClass: Record<
  RevenueFactor["changeIntent"],
  string
> = {
  positive: "bg-emerald-500",
  negative: "bg-rose-500",
  neutral: "bg-slate-400",
};

function formatYen(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}¥${Math.abs(n).toLocaleString("ja-JP")}`;
}

function formatYenAbs(n: number): string {
  return `¥${Math.abs(n).toLocaleString("ja-JP")}`;
}

export default function RevenueAnalysis() {
  const r = revenueAnalysis;
  const HeadIcon = r.intent === "negative" ? TrendingDown : TrendingUp;
  const headIconClass =
    r.intent === "negative" ? "text-rose-600" : "text-emerald-600";
  const diffTextClass = intentTextClass[r.intent];

  const maxAbsImpact = Math.max(...r.factors.map((f) => Math.abs(f.impactYen)));

  return (
    <>
      <Topbar
        title="売上要因分析"
        subtitle="売上 = セッション × CVR × AOV に分解して、今月直すべき要因を特定"
        actions={
          <>
            <Link
              to="/app/action-board"
              className="btn-primary px-3 py-1.5 text-xs"
            >
              施策ボードに反映
            </Link>
            <Link
              to="/app/ai-report"
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              AI考察レポートで深掘り
            </Link>
          </>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* Hero summary */}
        <SectionCard
          title="今月の売上変動サマリー"
          icon={<HeadIcon size={16} className={headIconClass} />}
          action={
            <span className="text-[11px] text-slate-500">
              {r.prevMonth} → {r.month}
            </span>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="text-[11px] text-slate-500">売上差分</div>
              <div className={`mt-1 text-3xl font-semibold tracking-tight ${diffTextClass}`}>
                {r.diffPercent}
              </div>
              <div className={`mt-0.5 text-sm font-medium ${diffTextClass}`}>
                {formatYen(r.diffYen)}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                前月比 / 売上 = セッション × CVR × AOV で分解
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="text-[11px] text-slate-500">前月売上</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {formatYenAbs(r.prevRevenue)}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">{r.prevMonth}</div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="text-[11px] text-slate-500">今月売上</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {formatYenAbs(r.currRevenue)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">{r.month}</div>
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                <AlertTriangle size={13} />
                主因候補
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-800">
                {r.primaryDriver}
              </p>
              <p className="mt-3 text-[11px] leading-6 text-slate-600">
                {r.headline}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Factor cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {r.factors.map((f) => (
            <FactorCard key={f.key} factor={f} maxAbsImpact={maxAbsImpact} />
          ))}
        </div>

        {/* Waterfall / step decomposition */}
        <SectionCard
          title="売上ブリッジ（前月 → 今月）"
          icon={<Activity size={16} />}
          action={
            <span className="text-[11px] text-slate-500">
              影響量バーは |増減額| / 前月売上 で表示
            </span>
          }
        >
          <RevenueBridge
            prevRevenue={r.prevRevenue}
            currRevenue={r.currRevenue}
            factors={r.factors}
          />
        </SectionCard>

        {/* Causes + Next actions */}
        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="原因候補"
            icon={<AlertTriangle size={16} />}
            action={
              <span className="text-[11px] text-slate-500">
                商品 / チャネル / 全体に分解
              </span>
            }
          >
            <ul className="space-y-3">
              {r.causes.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/40 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={causeBadgeTone[c.category]} size="xs">
                      {c.category}
                    </Pill>
                    <Pill tone="slate" size="xs">
                      {c.scope}
                    </Pill>
                    <span className="text-sm font-medium text-slate-800">
                      {c.target}
                    </span>
                    <span className="ml-auto">
                      <Pill tone={impactTone(c.impact)} size="xs">
                        影響度 {c.impact}
                      </Pill>
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-6 text-slate-700">
                    {c.summary}
                  </p>
                  <div className="mt-1.5 text-[11px] font-mono text-slate-500">
                    根拠: {c.evidence}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            title="次の一手（推奨アクション候補）"
            icon={<Lightbulb size={16} />}
            action={
              <Link
                to="/app/action-board"
                className="text-sky-600 hover:text-sky-700"
              >
                施策ボードで実行管理 →
              </Link>
            }
          >
            <ul className="space-y-3">
              {r.nextActions.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="slate" size="xs">
                      {a.area}
                    </Pill>
                    <Pill tone={priorityTone(a.priority)} size="xs">
                      {a.priority}
                    </Pill>
                    <Pill tone={effortTone(a.effort)} size="xs">
                      工数 {a.effort}
                    </Pill>
                    <span className="ml-auto">
                      <Pill tone={sendToTone[a.sendTo]} size="xs">
                        → {a.sendTo}
                      </Pill>
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-800">
                    {a.title}
                  </div>
                  <p className="mt-1 text-[12px] leading-6 text-slate-600">
                    なぜ: {a.why}
                  </p>
                  <div className="mt-1 text-[12px] text-emerald-700">
                    期待: {a.expected}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-end">
              <Link
                to="/app/action-board"
                className="inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
              >
                施策ボードに送る
                <ArrowRight size={12} />
              </Link>
            </div>
          </SectionCard>
        </div>

        {/* Data readiness + role copy */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="分析に必要なデータ"
            icon={<Database size={16} />}
            action={
              <Link
                to="/app/data-import"
                className="text-sky-600 hover:text-sky-700"
              >
                データ取込画面 →
              </Link>
            }
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {r.dataReadiness.map((d) => (
                <li
                  key={d.label}
                  className="rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {d.label}
                    </span>
                    <Pill tone={readinessTone[d.state]} size="xs">
                      {d.state}
                    </Pill>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-6 text-slate-600">
                    {d.note}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-500">
              現状はCSV-firstで「セッション × CVR × AOV」の構造を仮置きしています。
              GA4 / 広告CSV を追加するとセッションとチャネル別CVRの精度が上がり、
              将来的に BigQuery を読み取り接続すると自動更新になります。
            </p>
          </SectionCard>

          <SectionCard
            title="この画面の役割"
            icon={<Compass size={16} />}
          >
            <p className="text-[13px] leading-7 text-slate-700">
              ここは GA4 や BigQuery を <b>読む画面ではありません</b>。
              EC担当者が「今月なぜ売上が動いたか」と
              「次に何を直すべきか」を <b>判断する画面</b> です。
            </p>
            <ul className="mt-3 space-y-1.5 text-[12px] text-slate-600">
              <li className="flex items-start gap-2">
                <ChevronRight size={12} className="mt-1 text-slate-400" />
                数値はAIの主因候補。最終判断は担当者が行う
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={12} className="mt-1 text-slate-400" />
                次の一手はそのまま施策ボードに送れる
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight size={12} className="mt-1 text-slate-400" />
                月次会議の冒頭スライドとしても利用可能
              </li>
            </ul>
            <Link
              to="/app/monthly-report"
              className="btn-secondary mt-4 w-full justify-center text-xs"
            >
              月次レポートに反映
              <ArrowRight size={12} />
            </Link>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

function FactorCard({
  factor,
  maxAbsImpact,
}: {
  factor: RevenueFactor;
  maxAbsImpact: number;
}) {
  const Icon = factorIcon[factor.key];
  const impactPct =
    maxAbsImpact === 0
      ? 0
      : Math.min(100, (Math.abs(factor.impactYen) / maxAbsImpact) * 100);
  const TrendIcon =
    factor.changeIntent === "positive"
      ? ArrowUpRight
      : factor.changeIntent === "negative"
        ? ArrowDownRight
        : ArrowRight;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
            <Icon size={14} />
          </span>
          <div className="text-sm font-semibold text-slate-800">
            {factor.label}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold ${intentTextClass[factor.changeIntent]}`}
        >
          <TrendIcon size={13} />
          {factor.changeLabel}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-slate-50/60 px-2.5 py-1.5">
          <div className="text-[10px] text-slate-500">前月</div>
          <div className="text-sm font-semibold text-slate-800">
            {factor.prevValue}
          </div>
        </div>
        <div className="rounded-md bg-white px-2.5 py-1.5 ring-1 ring-slate-100">
          <div className="text-[10px] text-slate-500">今月</div>
          <div className="text-sm font-semibold text-slate-900">
            {factor.currValue}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">売上への影響</span>
          <span className={`font-semibold ${intentTextClass[factor.changeIntent]}`}>
            {factor.impactLabel}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${intentBarClass[factor.changeIntent]}`}
            style={{ width: `${impactPct}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-6 text-slate-500">
        {factor.driverNote}
      </p>
    </div>
  );
}

function RevenueBridge({
  prevRevenue,
  currRevenue,
  factors,
}: {
  prevRevenue: number;
  currRevenue: number;
  factors: RevenueFactor[];
}) {
  const baseWidth = (n: number) =>
    prevRevenue === 0 ? 0 : Math.min(100, (n / prevRevenue) * 100);
  const factorWidth = (n: number) =>
    prevRevenue === 0
      ? 0
      : Math.min(100, (Math.abs(n) / prevRevenue) * 100);
  const currPct = baseWidth(currRevenue);

  return (
    <div className="space-y-3">
      <BridgeRow
        label="前月売上"
        sub=""
        value={`¥${prevRevenue.toLocaleString("ja-JP")}`}
        bar={
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-navy-900" style={{ width: "100%" }} />
          </div>
        }
        accent="text-slate-700"
      />

      {factors.map((f) => {
        const w = factorWidth(f.impactYen);
        const Icon =
          f.changeIntent === "positive"
            ? ArrowUpRight
            : f.changeIntent === "negative"
              ? ArrowDownRight
              : ArrowRight;
        return (
          <BridgeRow
            key={f.key}
            label={f.label}
            sub={f.changeLabel}
            value={f.impactLabel}
            icon={<Icon size={13} className={intentTextClass[f.changeIntent]} />}
            bar={
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${intentBarClass[f.changeIntent]}`}
                  style={{ width: `${w}%` }}
                />
              </div>
            }
            accent={intentTextClass[f.changeIntent]}
          />
        );
      })}

      <BridgeRow
        label="今月売上"
        sub={`前月比 ${((currRevenue / prevRevenue - 1) * 100).toFixed(1)}%`}
        value={`¥${currRevenue.toLocaleString("ja-JP")}`}
        bar={
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-navy-900"
              style={{ width: `${currPct}%` }}
            />
          </div>
        }
        accent="text-slate-700"
      />

      <p className="mt-2 text-[11px] text-slate-500">
        ※ 影響額は概算です。GA4 / 広告CSV を取り込むとチャネル別の精度が上がります。
      </p>
    </div>
  );
}

function BridgeRow({
  label,
  sub,
  value,
  bar,
  icon,
  accent,
}: {
  label: string;
  sub: string;
  value: string;
  bar: React.ReactNode;
  icon?: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[160px_1fr_140px]">
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-700">
        {icon}
        {label}
        {sub && <span className="text-[10px] font-normal text-slate-500">{sub}</span>}
      </div>
      <div>{bar}</div>
      <div className={`text-right text-[12px] font-semibold ${accent}`}>
        {value}
      </div>
    </div>
  );
}
