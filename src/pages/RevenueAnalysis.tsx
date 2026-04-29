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
  BarChart3,
  Megaphone,
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
  type RevenueAnalysis as RevenueAnalysisModel,
  type RevenueCause,
  type RevenueDataReadiness,
  type RevenueFactor,
  type RevenueFactorKey,
  type RevenueNextAction,
} from "../data/sample";
import { useImport } from "../lib/csv/ImportContext";
import type { Ga4Aggregation } from "../lib/csv/aggregateGa4";
import type { OrderAggregation } from "../lib/csv/aggregateOrders";
import {
  formatRoas,
  formatCpc,
  type AdsAggregation,
} from "../lib/csv/aggregateAds";

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

const intentTextClass: Record<RevenueFactor["changeIntent"], string> = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-slate-500",
};

const intentBarClass: Record<RevenueFactor["changeIntent"], string> = {
  positive: "bg-emerald-500",
  negative: "bg-rose-500",
  neutral: "bg-slate-400",
};

function formatYenSigned(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}¥${Math.abs(Math.round(n)).toLocaleString("ja-JP")}`;
}

function formatYenAbs(n: number): string {
  return `¥${Math.abs(Math.round(n)).toLocaleString("ja-JP")}`;
}

function formatInt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

function formatPercent(ratio: number, digits = 2): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

// --- Sample-string parsers (revenueAnalysis stores prev/curr as display strings) ---
function parseSessionsString(s: string): number {
  return Number(s.replace(/[, ]/g, ""));
}
function parsePercentString(s: string): number {
  return Number(s.replace(/%/g, "").trim()) / 100;
}
function parseYenString(s: string): number {
  return Number(s.replace(/[¥, ]/g, ""));
}

type FactorMode = "sample" | "ga4" | "orders";
type ResolvedFactor = {
  factor: RevenueFactor;
  source: FactorMode;
};

// Build effective factors using ga4 (for sessions / cvr) and orders (for aov)
// when available. Falls back to the static sample for the curr value otherwise.
// prev values always come from the static sample because the prototype does
// not have last-month data ingestion.
function resolveFactors(
  base: RevenueAnalysisModel,
  ga4: Ga4Aggregation | null,
  orders: OrderAggregation | null,
): {
  factors: RevenueFactor[];
  sources: Record<RevenueFactorKey, FactorMode>;
  prevRevenue: number;
  currRevenue: number;
  diffYen: number;
  diffPercent: string;
  intent: "positive" | "negative" | "neutral";
} {
  const sampleSessions = base.factors.find((f) => f.key === "sessions")!;
  const sampleCvr = base.factors.find((f) => f.key === "cvr")!;
  const sampleAov = base.factors.find((f) => f.key === "aov")!;

  const Sprev = parseSessionsString(sampleSessions.prevValue);
  const Cprev = parsePercentString(sampleCvr.prevValue);
  const Aprev = parseYenString(sampleAov.prevValue);

  const sampleScurr = parseSessionsString(sampleSessions.currValue);
  const sampleCcurr = parsePercentString(sampleCvr.currValue);
  const sampleAcurr = parseYenString(sampleAov.currValue);

  const sources: Record<RevenueFactorKey, FactorMode> = {
    sessions: "sample",
    cvr: "sample",
    aov: "sample",
  };

  let Scurr = sampleScurr;
  if (ga4 && ga4.totalSessions > 0) {
    Scurr = ga4.totalSessions;
    sources.sessions = "ga4";
  }

  let Ccurr = sampleCcurr;
  if (ga4 && ga4.cvr !== null) {
    Ccurr = ga4.cvr;
    sources.cvr = "ga4";
  }

  let Acurr = sampleAcurr;
  if (orders && orders.aov > 0) {
    Acurr = orders.aov;
    sources.aov = "orders";
  }

  const prevRevenue = Sprev * Cprev * Aprev;
  const currRevenue = Scurr * Ccurr * Acurr;
  const diffYen = currRevenue - prevRevenue;

  // Chained decomposition so the three factor impacts sum exactly to diffYen.
  const impactSessions = (Scurr - Sprev) * Cprev * Aprev;
  const impactCvr = Scurr * (Ccurr - Cprev) * Aprev;
  const impactAov = Scurr * Ccurr * (Acurr - Aprev);

  const sessionsChangeRatio = Sprev === 0 ? 0 : (Scurr - Sprev) / Sprev;
  const cvrChangePoints = Ccurr - Cprev; // in absolute ratio
  const cvrChangeRatio = Cprev === 0 ? 0 : cvrChangePoints / Cprev;
  const aovChangeRatio = Aprev === 0 ? 0 : (Acurr - Aprev) / Aprev;

  const sessionsIntent: RevenueFactor["changeIntent"] =
    Math.abs(Scurr - Sprev) < 1
      ? "neutral"
      : Scurr > Sprev
        ? "positive"
        : "negative";
  const cvrIntent: RevenueFactor["changeIntent"] =
    Math.abs(cvrChangePoints) < 0.0001
      ? "neutral"
      : Ccurr > Cprev
        ? "positive"
        : "negative";
  const aovIntent: RevenueFactor["changeIntent"] =
    Math.abs(Acurr - Aprev) < 1
      ? "neutral"
      : Acurr > Aprev
        ? "positive"
        : "negative";

  const factors: RevenueFactor[] = [
    {
      key: "sessions",
      label: sampleSessions.label,
      unit: sampleSessions.unit,
      prevValue: formatInt(Sprev),
      currValue: formatInt(Scurr),
      changeLabel: `${sessionsChangeRatio >= 0 ? "+" : ""}${(sessionsChangeRatio * 100).toFixed(1)}%`,
      changeIntent: sessionsIntent,
      impactYen: impactSessions,
      impactLabel: formatYenSigned(impactSessions),
      driverNote:
        sources.sessions === "ga4"
          ? `GA4 CSV から実値を反映。${ga4?.hasChannel ? "上位チャネルの動きが流入変動の中心。" : "チャネル列なしのため全体集計のみ。"}`
          : sampleSessions.driverNote,
    },
    {
      key: "cvr",
      label: sampleCvr.label,
      unit: sampleCvr.unit,
      prevValue: formatPercent(Cprev),
      currValue: formatPercent(Ccurr),
      changeLabel: `${cvrChangePoints >= 0 ? "+" : ""}${(cvrChangePoints * 100).toFixed(2)}pt（${cvrChangeRatio >= 0 ? "+" : ""}${(cvrChangeRatio * 100).toFixed(1)}%）`,
      changeIntent: cvrIntent,
      impactYen: impactCvr,
      impactLabel: formatYenSigned(impactCvr),
      driverNote:
        sources.cvr === "ga4"
          ? `GA4 CSV の purchases / sessions から実値を反映。${ga4?.hasLandingPage ? "LP別CVR の精査で要因をさらに絞り込み可能。" : ""}`
          : sampleCvr.driverNote,
    },
    {
      key: "aov",
      label: sampleAov.label,
      unit: sampleAov.unit,
      prevValue: formatYenAbs(Aprev),
      currValue: formatYenAbs(Acurr),
      changeLabel: `${aovChangeRatio >= 0 ? "+" : ""}${(aovChangeRatio * 100).toFixed(1)}%`,
      changeIntent: aovIntent,
      impactYen: impactAov,
      impactLabel: formatYenSigned(impactAov),
      driverNote:
        sources.aov === "orders"
          ? "注文CSV の 売上合計 ÷ 注文数 から実値を反映。"
          : sampleAov.driverNote,
    },
  ];

  const intent: "positive" | "negative" | "neutral" =
    Math.abs(diffYen) < 1 ? "neutral" : diffYen > 0 ? "positive" : "negative";

  const diffPercent = `${diffYen >= 0 ? "+" : ""}${prevRevenue === 0 ? 0 : ((diffYen / prevRevenue) * 100).toFixed(1)}%`;

  return {
    factors,
    sources,
    prevRevenue,
    currRevenue,
    diffYen,
    diffPercent,
    intent,
  };
}

// Rule-based primary-driver text. Picks the factor whose impact moves revenue
// most against the user's interest (negative when total diff is negative,
// positive contributor when diff is positive).
function buildHeadline(
  diffYen: number,
  diffPercent: string,
  factors: RevenueFactor[],
): { primaryDriver: string; headline: string } {
  const sorted = [...factors].sort((a, b) =>
    diffYen >= 0 ? b.impactYen - a.impactYen : a.impactYen - b.impactYen,
  );
  const worst = sorted[0];

  const driverByKey: Record<RevenueFactorKey, { neg: string; pos: string }> = {
    sessions: {
      neg: "セッション数が縮小しており、流入チャネル（広告/SEO等）の見直しが主因候補。",
      pos: "セッション数の伸長が売上を押し上げる主導要因。",
    },
    cvr: {
      neg: "CVRが低下しており、商品ページ・カート/決済導線の見直しが主因候補。",
      pos: "CVRの改善が売上の押し上げに寄与している。",
    },
    aov: {
      neg: "AOVが低下しており、オファー設計や単価ミックスの見直しが主因候補。",
      pos: "AOVの改善が売上を押し上げる要因として寄与。",
    },
  };

  const phrase =
    diffYen >= 0
      ? driverByKey[worst.key].pos
      : driverByKey[worst.key].neg;

  const summarized = sorted
    .slice(0, 2)
    .map((f) => `${f.label} ${f.impactLabel}`)
    .join(" / ");

  const headline =
    diffYen >= 0
      ? `売上は前月比 ${diffPercent}（${formatYenSigned(diffYen)}）。${summarized} が押し上げの中心。`
      : `売上は前月比 ${diffPercent}（${formatYenSigned(diffYen)}）。${summarized} が低下の主因候補。`;

  return { primaryDriver: phrase, headline };
}

function adjustReadiness(
  base: RevenueDataReadiness[],
  ga4Connected: boolean,
  ordersConnected: boolean,
  adsConnected: boolean,
): RevenueDataReadiness[] {
  return base.map((d) => {
    if (d.label.includes("GA4") && ga4Connected) {
      return {
        ...d,
        state: "取込済み",
        note: "GA4 CSV を取込済み。セッション数・CVR・チャネル別の実値で要因分解中。",
      };
    }
    if (d.label.includes("注文") && ordersConnected) {
      return {
        ...d,
        state: "取込済み",
        note: "注文CSV を取込済み。売上 / 注文数 / AOV を実値で確定。",
      };
    }
    if (d.label.includes("広告") && adsConnected) {
      return {
        ...d,
        state: "取込済み",
        note: "広告CSV を取込済み。チャネル別 ROAS / CPC / CVR を実値で反映中。",
      };
    }
    return d;
  });
}

// 広告CSVが取り込まれている時に動的に追加する原因候補。
// ROASあり: 全体平均ROASを下回るチャネル/キャンペーンを「広告効率悪化」として追加
// 取り込まれた効率悪化キャンペーンも反映
function buildAdsCauses(ads: AdsAggregation): RevenueCause[] {
  const out: RevenueCause[] = [];

  if (ads.totalCost <= 0) return out;

  // チャネル別の効率変動（最も ROAS が低いチャネル）
  if (ads.hasRevenue && ads.roas !== null) {
    const sorted = [...ads.topChannels]
      .filter((c) => c.roas !== null && c.cost > 0)
      .sort((a, b) => (a.roas ?? 0) - (b.roas ?? 0));
    const worst = sorted[0];
    if (worst && worst.roas !== null && worst.roas < ads.roas * 0.85) {
      out.push({
        id: `ads-roas-${worst.channel}`,
        category: "流入",
        scope: "チャネル",
        target: `${worst.channel}（広告）`,
        summary: `チャネル ROAS ${formatRoas(worst.roas)} が全体平均 ${formatRoas(ads.roas)} を下回り、広告費効率が悪化。同チャネルへの予算配分の見直しが必要。`,
        evidence: `広告費 ¥${Math.round(worst.cost).toLocaleString("ja-JP")} / 広告経由売上 ¥${Math.round(worst.revenue).toLocaleString("ja-JP")}`,
        impact: worst.cost > ads.totalCost * 0.2 ? "高" : "中",
      });
    }
  }

  // CPC上昇/CVR低下のシグナル（最も CPC が高いチャネル）
  if (ads.hasClicks && ads.cpc !== null) {
    const ranked = [...ads.topChannels]
      .filter((c) => c.cpc !== null)
      .sort((a, b) => (b.cpc ?? 0) - (a.cpc ?? 0));
    const worstCpc = ranked[0];
    if (
      worstCpc &&
      worstCpc.cpc !== null &&
      worstCpc.cpc > ads.cpc * 1.4 &&
      worstCpc.cost > ads.totalCost * 0.1
    ) {
      out.push({
        id: `ads-cpc-${worstCpc.channel}`,
        category: "流入",
        scope: "チャネル",
        target: `${worstCpc.channel}（広告）`,
        summary: `CPC ${formatCpc(worstCpc.cpc)} が全体平均 ${formatCpc(ads.cpc)} を大きく上回り、クリック単価高騰が流入縮小の要因候補。`,
        evidence: `クリック数 ${worstCpc.clicks.toLocaleString("ja-JP")} / 広告費 ¥${Math.round(worstCpc.cost).toLocaleString("ja-JP")}`,
        impact: "中",
      });
    }
  }

  // 効率悪化キャンペーン（aggregateAds の判定をそのまま反映）
  for (const camp of ads.inefficientCampaigns) {
    out.push({
      id: `ads-camp-${camp.campaign}`,
      category: "流入",
      scope: "商品",
      target: `${camp.campaign}（${camp.channel}）`,
      summary: camp.reason,
      evidence: `広告費 ¥${Math.round(camp.cost).toLocaleString("ja-JP")} / ROAS ${formatRoas(camp.roas)}`,
      impact: "中",
    });
  }

  return out;
}

function buildAdsActions(ads: AdsAggregation): RevenueNextAction[] {
  const out: RevenueNextAction[] = [];
  if (ads.totalCost <= 0) return out;

  // 配分見直し: ROASが全体平均を下回るチャネルからの予算移管
  if (ads.hasRevenue && ads.roas !== null) {
    const sorted = [...ads.topChannels]
      .filter((c) => c.roas !== null && c.cost > 0)
      .sort((a, b) => (a.roas ?? 0) - (b.roas ?? 0));
    const worst = sorted[0];
    const best = [...ads.topChannels]
      .filter((c) => c.roas !== null)
      .sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    if (
      worst &&
      best &&
      worst.channel !== best.channel &&
      worst.roas !== null &&
      best.roas !== null &&
      worst.roas < ads.roas
    ) {
      out.push({
        id: "ads-reallocate",
        area: "広告",
        title: `${worst.channel} → ${best.channel} への広告費配分見直し`,
        why: `${worst.channel} の ROAS ${formatRoas(worst.roas)} に対し ${best.channel} は ${formatRoas(best.roas)}。効率の高いチャネルへ寄せ、広告費1円あたりの売上回収を改善する。`,
        expected: `想定 ROAS +${(((best.roas - worst.roas) / Math.max(0.01, worst.roas)) * 0.2 * 100).toFixed(0)}pt（保守試算）`,
        effort: "低",
        priority: "P1",
        sendTo: "施策ボード",
      });
    }
  }

  // 効率悪化キャンペーンの停止/縮小
  if (ads.inefficientCampaigns.length > 0) {
    const c = ads.inefficientCampaigns[0];
    out.push({
      id: `ads-stop-${c.campaign}`,
      area: "広告",
      title: `${c.campaign} の停止 / 大幅縮小を検討`,
      why: c.reason,
      expected: `想定広告費削減 ¥${Math.round(c.cost * 0.6).toLocaleString("ja-JP")} / ROAS改善`,
      effort: "低",
      priority: "P1",
      sendTo: "施策ボード",
    });
  }

  // 拡張候補: ROAS最良チャネル
  if (ads.hasRevenue && ads.roas !== null) {
    const best = [...ads.topChannels]
      .filter((c) => c.roas !== null)
      .sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))[0];
    if (best && best.roas !== null && best.roas > ads.roas * 1.15) {
      out.push({
        id: `ads-expand-${best.channel}`,
        area: "広告",
        title: `${best.channel} の拡張（広告費の追加投下）`,
        why: `ROAS ${formatRoas(best.roas)} は全体平均 ${formatRoas(ads.roas)} を上回り、広告費を追加投下しても効率を維持しやすい。`,
        expected: "想定売上 +¥320,000（広告費を 20% 増やした場合）",
        effort: "低",
        priority: "P2",
        sendTo: "施策ボード",
      });
    }
  }

  return out;
}

const sourcePillTone: Record<FactorMode, "mint" | "sky" | "slate"> = {
  ga4: "sky",
  orders: "mint",
  sample: "slate",
};

const sourcePillLabel: Record<FactorMode, string> = {
  ga4: "GA4実値",
  orders: "注文CSV実値",
  sample: "推定値",
};

export default function RevenueAnalysis() {
  const { ga4Import, ordersImport, adsImport } = useImport();
  const base = revenueAnalysis;

  const ga4Agg = ga4Import?.aggregation ?? null;
  const ordersAgg = ordersImport?.aggregation ?? null;
  const adsAgg = adsImport?.aggregation ?? null;

  const resolved = resolveFactors(base, ga4Agg, ordersAgg);
  const adjusted =
    resolved.sources.sessions !== "sample" ||
    resolved.sources.cvr !== "sample" ||
    resolved.sources.aov !== "sample";

  const { primaryDriver, headline } = adjusted
    ? buildHeadline(resolved.diffYen, resolved.diffPercent, resolved.factors)
    : { primaryDriver: base.primaryDriver, headline: base.headline };

  const factors = adjusted ? resolved.factors : base.factors;
  const prevRevenue = adjusted ? resolved.prevRevenue : base.prevRevenue;
  const currRevenue = adjusted ? resolved.currRevenue : base.currRevenue;
  const diffYen = adjusted ? resolved.diffYen : base.diffYen;
  const diffPercent = adjusted ? resolved.diffPercent : base.diffPercent;
  const intent = adjusted ? resolved.intent : base.intent;

  const dataReadiness = adjustReadiness(
    base.dataReadiness,
    !!ga4Import,
    !!ordersImport,
    !!adsImport,
  );

  const adsCauses = adsAgg ? buildAdsCauses(adsAgg) : [];
  const adsActions = adsAgg ? buildAdsActions(adsAgg) : [];
  const causes: RevenueCause[] = adsCauses.length
    ? [...adsCauses, ...base.causes]
    : base.causes;
  const nextActions: RevenueNextAction[] = adsActions.length
    ? [...adsActions, ...base.nextActions]
    : base.nextActions;

  const HeadIcon = intent === "negative" ? TrendingDown : TrendingUp;
  const headIconClass =
    intent === "negative" ? "text-rose-600" : "text-emerald-600";
  const diffTextClass = intentTextClass[intent];

  const maxAbsImpact = Math.max(...factors.map((f) => Math.abs(f.impactYen)));

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
        {/* Real-data status banner */}
        {(ga4Import || ordersImport || adsImport) && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-[12px] text-emerald-800">
            <BarChart3 size={14} className="text-emerald-600" />
            <span className="font-semibold">CSV実値で反映中</span>
            {ordersImport && (
              <Pill tone="mint" size="xs">
                注文CSV: {ordersImport.fileName}
              </Pill>
            )}
            {ga4Import && (
              <Pill tone="sky" size="xs">
                GA4 CSV: {ga4Import.fileName}
              </Pill>
            )}
            {adsImport && (
              <Pill tone="rose" size="xs">
                広告CSV: {adsImport.fileName}
              </Pill>
            )}
            <span className="ml-auto text-[11px] text-emerald-700/80">
              前月値は推定（静的サンプル）/ 今月値はCSVから算出
            </span>
          </div>
        )}

        {/* Hero summary */}
        <SectionCard
          title="今月の売上変動サマリー"
          icon={<HeadIcon size={16} className={headIconClass} />}
          action={
            <span className="text-[11px] text-slate-500">
              {base.prevMonth} → {base.month}
            </span>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="text-[11px] text-slate-500">売上差分</div>
              <div className={`mt-1 text-3xl font-semibold tracking-tight ${diffTextClass}`}>
                {diffPercent}
              </div>
              <div className={`mt-0.5 text-sm font-medium ${diffTextClass}`}>
                {formatYenSigned(diffYen)}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                前月比 / 売上 = セッション × CVR × AOV で分解
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="text-[11px] text-slate-500">前月売上</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {formatYenAbs(prevRevenue)}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                {base.prevMonth}{" "}
                {adjusted && (
                  <span className="ml-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                    推定
                  </span>
                )}
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="text-[11px] text-slate-500">今月売上</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {formatYenAbs(currRevenue)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {base.month}{" "}
                  {adjusted && (
                    <span className="ml-1 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
                      実値反映
                    </span>
                  )}
                </div>
                {ordersImport && (
                  <div className="mt-1 text-[10px] text-slate-400">
                    注文CSV売上合計: {formatYenAbs(ordersImport.aggregation.totalSales)}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                <AlertTriangle size={13} />
                主因候補
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-800">
                {primaryDriver}
              </p>
              <p className="mt-3 text-[11px] leading-6 text-slate-600">
                {headline}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Factor cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {factors.map((f) => (
            <FactorCard
              key={f.key}
              factor={f}
              maxAbsImpact={maxAbsImpact}
              source={resolved.sources[f.key]}
              dynamic={adjusted}
            />
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
            prevRevenue={prevRevenue}
            currRevenue={currRevenue}
            factors={factors}
            adjusted={adjusted}
          />
        </SectionCard>

        {/* GA4 channel/LP breakdown — only when ga4 CSV is loaded */}
        {ga4Import && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="GA4 チャネル別 流入とCVR"
              icon={<BarChart3 size={16} className="text-sky-600" />}
              action={
                <span className="text-[11px] text-slate-500">
                  CSV実値（上位5）
                </span>
              }
            >
              {ga4Import.aggregation.hasChannel ? (
                <table className="table-clean">
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
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-3 text-[11px] text-slate-500">
                  channel 列が見当たりません。session_default_channel_group 等の列を含めるとチャネル別分析が可能になります。
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="GA4 ランディングページ別 CVR"
              icon={<BarChart3 size={16} className="text-sky-600" />}
              action={
                <span className="text-[11px] text-slate-500">
                  CSV実値（上位5）
                </span>
              }
            >
              {ga4Import.aggregation.hasLandingPage ? (
                <table className="table-clean">
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
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-3 text-[11px] text-slate-500">
                  landing_page 列が見当たりません。page_path 等の列を含めるとLP別分析が可能になります。
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* Ads breakdown — only when ads CSV is loaded */}
        {adsImport && (
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard
              title="広告 チャネル別 効率（ROAS / CPC / CVR）"
              icon={<Megaphone size={16} className="text-rose-500" />}
              action={
                <span className="text-[11px] text-slate-500">
                  CSV実値（上位5）
                </span>
              }
            >
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <SmallStat
                  label="広告費合計"
                  value={`¥${Math.round(adsImport.aggregation.totalCost).toLocaleString("ja-JP")}`}
                />
                <SmallStat
                  label="ROAS"
                  value={formatRoas(adsImport.aggregation.roas)}
                />
                <SmallStat
                  label="CPC"
                  value={formatCpc(adsImport.aggregation.cpc)}
                />
                <SmallStat
                  label="CVR"
                  value={
                    adsImport.aggregation.cvr === null
                      ? "—"
                      : formatPercent(adsImport.aggregation.cvr)
                  }
                />
              </div>

              <table className="table-clean mt-3">
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
                        ¥{Math.round(c.cost).toLocaleString("ja-JP")}
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
            </SectionCard>

            <SectionCard
              title="効率悪化キャンペーン候補"
              icon={<AlertTriangle size={16} className="text-rose-600" />}
              action={
                <span className="text-[11px] text-slate-500">
                  ROAS / CVR ベースの自動抽出
                </span>
              }
            >
              {adsImport.aggregation.inefficientCampaigns.length > 0 ? (
                <ul className="space-y-2">
                  {adsImport.aggregation.inefficientCampaigns.map((c) => (
                    <li
                      key={c.campaign}
                      className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 text-[12px]"
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
                        <span className="ml-auto text-[11px] text-slate-500">
                          広告費 ¥
                          {Math.round(c.cost).toLocaleString("ja-JP")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-5 text-slate-700">
                        {c.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-3 text-[11px] text-slate-500">
                  全体平均を大きく下回るキャンペーンは見当たりません。配分は概ね効率的に保たれています。
                </div>
              )}
              <p className="mt-3 text-[11px] text-slate-500">
                ※ ROAS &lt; 全体平均 × 0.7、または CVR &lt; 全体平均 × 0.5 のキャンペーンを最大3件抽出。
              </p>
            </SectionCard>
          </div>
        )}

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
              {causes.map((c) => (
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
              {nextActions.map((a) => (
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
              {dataReadiness.map((d) => (
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
              {adsImport && ga4Import
                ? "GA4 / 広告 CSV を反映済み。チャネル別 ROAS / CVR / CPC まで実値で要因分解しています。BigQuery 直接接続で自動更新化するのは将来フェーズです。"
                : adsImport
                  ? "広告CSV を反映済み。広告効率（ROAS / CPC / CVR）まで原因候補に組み込んでいます。GA4 CSV を追加するとセッション・CVR の精度がさらに上がります。"
                  : ga4Import
                    ? "GA4 CSV のセッション/CVR を反映済み。広告CSV を追加すると ROAS / CPC まで原因候補が広がります。BigQuery 直接接続で自動更新化するのは将来フェーズです。"
                    : "現状は静的サンプルで「セッション × CVR × AOV」の構造を仮置きしています。GA4 CSV を取込むとセッションとチャネル別CVRの精度が上がり、広告CSVを追加するとROAS/CPCまで含めた要因分解が可能になります。"}
            </p>
          </SectionCard>

          <SectionCard title="この画面の役割" icon={<Compass size={16} />}>
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
  source,
  dynamic,
}: {
  factor: RevenueFactor;
  maxAbsImpact: number;
  source: FactorMode;
  dynamic: boolean;
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
          <div className="text-[10px] text-slate-500">
            前月{dynamic ? "（推定）" : ""}
          </div>
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
          <span
            className={`font-semibold ${intentTextClass[factor.changeIntent]}`}
          >
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

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] leading-6 text-slate-500">
          {factor.driverNote}
        </p>
        <Pill tone={sourcePillTone[source]} size="xs">
          {sourcePillLabel[source]}
        </Pill>
      </div>
    </div>
  );
}

function RevenueBridge({
  prevRevenue,
  currRevenue,
  factors,
  adjusted,
}: {
  prevRevenue: number;
  currRevenue: number;
  factors: RevenueFactor[];
  adjusted: boolean;
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
        value={`¥${Math.round(prevRevenue).toLocaleString("ja-JP")}`}
        bar={
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-navy-900"
              style={{ width: "100%" }}
            />
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
        sub={
          prevRevenue === 0
            ? ""
            : `前月比 ${((currRevenue / prevRevenue - 1) * 100).toFixed(1)}%`
        }
        value={`¥${Math.round(currRevenue).toLocaleString("ja-JP")}`}
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
        {adjusted
          ? "※ 影響額は連鎖法による概算（ΔS×Cprev×Aprev → Scurr×ΔC×Aprev → Scurr×Ccurr×ΔA）。前月値は静的サンプルを推定値として用いています。"
          : "※ 影響額は概算です。GA4 / 広告CSV を取り込むとチャネル別の精度が上がります。"}
      </p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold tracking-tight text-slate-900">
        {value}
      </div>
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
