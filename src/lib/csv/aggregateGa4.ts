import type { Ga4Row } from "./parseGa4";

export type ChannelStat = {
  channel: string;
  sessions: number;
  purchases: number;
  revenue: number;
  cvr: number;
};

export type LandingStat = {
  landing_page: string;
  sessions: number;
  purchases: number;
  cvr: number;
};

export type Ga4Aggregation = {
  totalSessions: number;
  totalUsers: number | null;
  totalPurchases: number | null;
  totalRevenue: number | null;
  cvr: number | null; // purchases / sessions
  topChannels: ChannelStat[];
  topLandingPages: LandingStat[];
  periodStart: Date | null;
  periodEnd: Date | null;
  hasChannel: boolean;
  hasLandingPage: boolean;
};

export function aggregateGa4(rows: Ga4Row[]): Ga4Aggregation {
  if (rows.length === 0) {
    return {
      totalSessions: 0,
      totalUsers: null,
      totalPurchases: null,
      totalRevenue: null,
      cvr: null,
      topChannels: [],
      topLandingPages: [],
      periodStart: null,
      periodEnd: null,
      hasChannel: false,
      hasLandingPage: false,
    };
  }

  let totalSessions = 0;
  let totalUsers = 0;
  let usersSeen = false;
  let totalPurchases = 0;
  let purchasesSeen = false;
  let totalRevenue = 0;
  let revenueSeen = false;
  let minDate = rows[0].date.getTime();
  let maxDate = rows[0].date.getTime();

  const byChannel = new Map<
    string,
    { sessions: number; purchases: number; revenue: number }
  >();
  const byLanding = new Map<
    string,
    { sessions: number; purchases: number }
  >();

  let hasChannel = false;
  let hasLandingPage = false;

  for (const r of rows) {
    totalSessions += r.sessions;

    if (r.users !== null) {
      totalUsers += r.users;
      usersSeen = true;
    }
    if (r.purchases !== null) {
      totalPurchases += r.purchases;
      purchasesSeen = true;
    }
    if (r.total_revenue !== null) {
      totalRevenue += r.total_revenue;
      revenueSeen = true;
    }

    const t = r.date.getTime();
    if (t < minDate) minDate = t;
    if (t > maxDate) maxDate = t;

    if (r.channel) {
      hasChannel = true;
      const c =
        byChannel.get(r.channel) ?? { sessions: 0, purchases: 0, revenue: 0 };
      c.sessions += r.sessions;
      if (r.purchases !== null) c.purchases += r.purchases;
      if (r.total_revenue !== null) c.revenue += r.total_revenue;
      byChannel.set(r.channel, c);
    }
    if (r.landing_page) {
      hasLandingPage = true;
      const l = byLanding.get(r.landing_page) ?? { sessions: 0, purchases: 0 };
      l.sessions += r.sessions;
      if (r.purchases !== null) l.purchases += r.purchases;
      byLanding.set(r.landing_page, l);
    }
  }

  const topChannels: ChannelStat[] = Array.from(byChannel.entries())
    .map(([channel, v]) => ({
      channel,
      sessions: v.sessions,
      purchases: v.purchases,
      revenue: v.revenue,
      cvr: v.sessions > 0 ? v.purchases / v.sessions : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);

  const topLandingPages: LandingStat[] = Array.from(byLanding.entries())
    .map(([landing_page, v]) => ({
      landing_page,
      sessions: v.sessions,
      purchases: v.purchases,
      cvr: v.sessions > 0 ? v.purchases / v.sessions : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 5);

  return {
    totalSessions,
    totalUsers: usersSeen ? totalUsers : null,
    totalPurchases: purchasesSeen ? totalPurchases : null,
    totalRevenue: revenueSeen ? totalRevenue : null,
    cvr:
      purchasesSeen && totalSessions > 0
        ? totalPurchases / totalSessions
        : null,
    topChannels,
    topLandingPages,
    periodStart: new Date(minDate),
    periodEnd: new Date(maxDate),
    hasChannel,
    hasLandingPage,
  };
}

export function formatPercent(n: number, digits = 2): string {
  return `${(n * 100).toFixed(digits)}%`;
}
