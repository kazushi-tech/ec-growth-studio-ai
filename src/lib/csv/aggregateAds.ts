import type { AdRow } from "./parseAds";

export type AdChannelStat = {
  channel: string;
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpc: number | null; // cost / clicks
  ctr: number | null; // clicks / impressions
  cvr: number | null; // conversions / clicks
  roas: number | null; // revenue / cost
};

export type AdCampaignStat = {
  campaign: string;
  channel: string;
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpc: number | null;
  ctr: number | null;
  cvr: number | null;
  roas: number | null;
};

// 効率悪化キャンペーン候補。広告費が一定以上かつ ROAS が全体平均を下回るものを抽出。
export type InefficientCampaign = {
  campaign: string;
  channel: string;
  cost: number;
  revenue: number;
  roas: number | null; // null = revenue 列が無い
  reason: string; // 表示用の根拠
};

export type AdsAggregation = {
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  cpc: number | null; // totalCost / totalClicks
  ctr: number | null; // totalClicks / totalImpressions
  cvr: number | null; // totalConversions / totalClicks
  roas: number | null; // totalRevenue / totalCost
  topChannels: AdChannelStat[];
  topCampaigns: AdCampaignStat[];
  inefficientCampaigns: InefficientCampaign[];
  periodStart: Date | null;
  periodEnd: Date | null;
  hasImpressions: boolean;
  hasClicks: boolean;
  hasConversions: boolean;
  hasRevenue: boolean;
  hasProduct: boolean;
};

function ratio(num: number, den: number): number | null {
  return den > 0 ? num / den : null;
}

export function aggregateAds(rows: AdRow[]): AdsAggregation {
  if (rows.length === 0) {
    return {
      totalCost: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      cpc: null,
      ctr: null,
      cvr: null,
      roas: null,
      topChannels: [],
      topCampaigns: [],
      inefficientCampaigns: [],
      periodStart: null,
      periodEnd: null,
      hasImpressions: false,
      hasClicks: false,
      hasConversions: false,
      hasRevenue: false,
      hasProduct: false,
    };
  }

  let totalCost = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let totalRevenue = 0;
  let hasImpressions = false;
  let hasClicks = false;
  let hasConversions = false;
  let hasRevenue = false;
  let hasProduct = false;
  let minDate = rows[0].date.getTime();
  let maxDate = rows[0].date.getTime();

  type Acc = {
    cost: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  const blank = (): Acc => ({
    cost: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
  });
  const byChannel = new Map<string, Acc>();
  const byCampaign = new Map<string, Acc & { channel: string }>();

  for (const r of rows) {
    totalCost += r.cost;
    if (r.impressions !== null) {
      totalImpressions += r.impressions;
      hasImpressions = true;
    }
    if (r.clicks !== null) {
      totalClicks += r.clicks;
      hasClicks = true;
    }
    if (r.conversions !== null) {
      totalConversions += r.conversions;
      hasConversions = true;
    }
    if (r.revenue !== null) {
      totalRevenue += r.revenue;
      hasRevenue = true;
    }
    if (r.product_name) hasProduct = true;

    const t = r.date.getTime();
    if (t < minDate) minDate = t;
    if (t > maxDate) maxDate = t;

    const ch = byChannel.get(r.channel) ?? blank();
    ch.cost += r.cost;
    ch.impressions += r.impressions ?? 0;
    ch.clicks += r.clicks ?? 0;
    ch.conversions += r.conversions ?? 0;
    ch.revenue += r.revenue ?? 0;
    byChannel.set(r.channel, ch);

    const camp = byCampaign.get(r.campaign) ?? { ...blank(), channel: r.channel };
    camp.cost += r.cost;
    camp.impressions += r.impressions ?? 0;
    camp.clicks += r.clicks ?? 0;
    camp.conversions += r.conversions ?? 0;
    camp.revenue += r.revenue ?? 0;
    // 同名キャンペーンが複数チャネルにまたがっている場合は最初に出会ったチャネルを保持
    if (!camp.channel) camp.channel = r.channel;
    byCampaign.set(r.campaign, camp);
  }

  const overallRoas = hasRevenue ? ratio(totalRevenue, totalCost) : null;

  const topChannels: AdChannelStat[] = Array.from(byChannel.entries())
    .map(([channel, v]) => ({
      channel,
      cost: v.cost,
      impressions: v.impressions,
      clicks: v.clicks,
      conversions: v.conversions,
      revenue: v.revenue,
      cpc: hasClicks ? ratio(v.cost, v.clicks) : null,
      ctr: hasImpressions && hasClicks ? ratio(v.clicks, v.impressions) : null,
      cvr: hasClicks && hasConversions ? ratio(v.conversions, v.clicks) : null,
      roas: hasRevenue ? ratio(v.revenue, v.cost) : null,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  const topCampaigns: AdCampaignStat[] = Array.from(byCampaign.entries())
    .map(([campaign, v]) => ({
      campaign,
      channel: v.channel,
      cost: v.cost,
      impressions: v.impressions,
      clicks: v.clicks,
      conversions: v.conversions,
      revenue: v.revenue,
      cpc: hasClicks ? ratio(v.cost, v.clicks) : null,
      ctr: hasImpressions && hasClicks ? ratio(v.clicks, v.impressions) : null,
      cvr: hasClicks && hasConversions ? ratio(v.conversions, v.clicks) : null,
      roas: hasRevenue ? ratio(v.revenue, v.cost) : null,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  // 効率悪化キャンペーン: コスト降順 TOP5 のうち
  //  - revenue 列ありなら ROAS が全体平均より低い
  //  - revenue 列なしなら CVR が極端に低い（< 全体CVR / 2 もしくは conversions=0）
  // を抽出。最大3件。
  const inefficientCampaigns: InefficientCampaign[] = [];
  const campaignByCost = Array.from(byCampaign.entries())
    .map(([campaign, v]) => ({ campaign, ...v }))
    .sort((a, b) => b.cost - a.cost);

  for (const c of campaignByCost) {
    if (inefficientCampaigns.length >= 3) break;
    if (c.cost <= 0) continue;
    if (hasRevenue && overallRoas !== null) {
      const r = ratio(c.revenue, c.cost);
      if (r !== null && r < overallRoas * 0.7) {
        inefficientCampaigns.push({
          campaign: c.campaign,
          channel: c.channel,
          cost: c.cost,
          revenue: c.revenue,
          roas: r,
          reason: `ROAS ${(r * 100).toFixed(0)}% は全体平均 ${(overallRoas * 100).toFixed(0)}% を大きく下回り、広告費 ¥${Math.round(c.cost).toLocaleString("ja-JP")} に対して回収不足`,
        });
        continue;
      }
    } else if (hasClicks && hasConversions) {
      const overallCvr = ratio(totalConversions, totalClicks);
      const cvr = ratio(c.conversions, c.clicks);
      if (
        overallCvr !== null &&
        (cvr === null || cvr < overallCvr * 0.5)
      ) {
        inefficientCampaigns.push({
          campaign: c.campaign,
          channel: c.channel,
          cost: c.cost,
          revenue: c.revenue,
          roas: null,
          reason: `クリックCVR ${cvr === null ? "—" : (cvr * 100).toFixed(2) + "%"} が全体 ${(overallCvr * 100).toFixed(2)}% を大きく下回り、広告費 ¥${Math.round(c.cost).toLocaleString("ja-JP")} の効率が悪化`,
        });
      }
    }
  }

  return {
    totalCost,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalRevenue,
    cpc: hasClicks ? ratio(totalCost, totalClicks) : null,
    ctr: hasImpressions && hasClicks ? ratio(totalClicks, totalImpressions) : null,
    cvr: hasClicks && hasConversions ? ratio(totalConversions, totalClicks) : null,
    roas: overallRoas,
    topChannels,
    topCampaigns,
    inefficientCampaigns,
    periodStart: new Date(minDate),
    periodEnd: new Date(maxDate),
    hasImpressions,
    hasClicks,
    hasConversions,
    hasRevenue,
    hasProduct,
  };
}

export function formatRoas(n: number | null): string {
  if (n === null) return "—";
  return `${(n * 100).toFixed(0)}%`;
}

export function formatCpc(n: number | null): string {
  if (n === null) return "—";
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}
