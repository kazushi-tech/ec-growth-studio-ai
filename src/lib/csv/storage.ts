import type { AdsImport, Ga4Import, OrdersImport } from "./ImportContext";
import type { OrderRow, ParseResult } from "./parseOrders";
import type { OrderAggregation, ProductSales } from "./aggregateOrders";
import type {
  Ga4Aggregation,
  ChannelStat,
  LandingStat,
} from "./aggregateGa4";
import type {
  Ga4DetectedColumns,
  Ga4ParseResult,
  Ga4Row,
} from "./parseGa4";
import type {
  AdsAggregation,
  AdChannelStat,
  AdCampaignStat,
  InefficientCampaign,
} from "./aggregateAds";
import type {
  AdRow,
  AdsDetectedColumns,
  AdsParseResult,
} from "./parseAds";

export const ORDERS_IMPORT_STORAGE_KEY = "ec-growth-studio:orders-import:v1";
export const GA4_IMPORT_STORAGE_KEY = "ec-growth-studio:ga4-import:v1";
export const ADS_IMPORT_STORAGE_KEY = "ec-growth-studio:ads-import:v1";

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toDate(v: unknown): Date | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

function toNumOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toStrOrNull(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v);
  return s ? s : null;
}

// ---------- Orders ----------

export function saveOrdersImport(imp: OrdersImport): void {
  if (!hasLocalStorage()) return;
  try {
    // JSON.stringify converts Date instances to ISO strings via Date.prototype.toJSON.
    window.localStorage.setItem(ORDERS_IMPORT_STORAGE_KEY, JSON.stringify(imp));
  } catch {
    // quota exceeded / serialization failure — ignore, in-memory state is still authoritative
  }
}

export function clearStoredOrdersImport(): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(ORDERS_IMPORT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadOrdersImport(): OrdersImport | null {
  if (!hasLocalStorage()) return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(ORDERS_IMPORT_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  return reviveOrdersImport(parsed);
}

function reviveOrdersImport(obj: unknown): OrdersImport | null {
  if (!isObject(obj)) return null;
  if (typeof obj.fileName !== "string") return null;
  const importedAt = toDate(obj.importedAt);
  if (!importedAt) return null;
  const parseResult = reviveParseResult(obj.parseResult);
  const aggregation = reviveAggregation(obj.aggregation);
  if (!parseResult || !aggregation) return null;
  return {
    fileName: obj.fileName,
    importedAt,
    parseResult,
    aggregation,
  };
}

function reviveOrderRow(obj: unknown): OrderRow | null {
  if (!isObject(obj)) return null;
  const order_date = toDate(obj.order_date);
  if (!order_date) return null;
  return {
    order_id: String(obj.order_id ?? ""),
    order_date,
    customer_id: String(obj.customer_id ?? ""),
    product_name: String(obj.product_name ?? ""),
    quantity: Number(obj.quantity ?? 0),
    total_sales: Number(obj.total_sales ?? 0),
  };
}

function reviveParseResult(obj: unknown): ParseResult | null {
  if (!isObject(obj)) return null;
  const rawRows = Array.isArray(obj.rows) ? obj.rows : [];
  const rows: OrderRow[] = [];
  for (const r of rawRows) {
    const row = reviveOrderRow(r);
    if (!row) return null;
    rows.push(row);
  }
  const detected = isObject(obj.detectedColumns)
    ? (obj.detectedColumns as ParseResult["detectedColumns"])
    : ({
        order_id: null,
        order_date: null,
        customer_id: null,
        product_name: null,
        quantity: null,
        total_sales: null,
      } as ParseResult["detectedColumns"]);
  return {
    rows,
    warnings: Array.isArray(obj.warnings)
      ? (obj.warnings as ParseResult["warnings"])
      : [],
    errors: Array.isArray(obj.errors)
      ? (obj.errors as ParseResult["errors"])
      : [],
    totalRows: Number(obj.totalRows ?? 0),
    acceptedRows: Number(obj.acceptedRows ?? rows.length),
    detectedColumns: detected,
  };
}

function reviveAggregation(obj: unknown): OrderAggregation | null {
  if (!isObject(obj)) return null;
  const topProducts: ProductSales[] = Array.isArray(obj.topProducts)
    ? (obj.topProducts as ProductSales[])
    : [];
  return {
    totalSales: Number(obj.totalSales ?? 0),
    orderCount: Number(obj.orderCount ?? 0),
    uniqueCustomers: Number(obj.uniqueCustomers ?? 0),
    aov: Number(obj.aov ?? 0),
    topProducts,
    periodStart: toDate(obj.periodStart),
    periodEnd: toDate(obj.periodEnd),
  };
}

// ---------- GA4 ----------

export function saveGa4Import(imp: Ga4Import): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(GA4_IMPORT_STORAGE_KEY, JSON.stringify(imp));
  } catch {
    // ignore
  }
}

export function clearStoredGa4Import(): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(GA4_IMPORT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadGa4Import(): Ga4Import | null {
  if (!hasLocalStorage()) return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(GA4_IMPORT_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  return reviveGa4Import(parsed);
}

function reviveGa4Import(obj: unknown): Ga4Import | null {
  if (!isObject(obj)) return null;
  if (typeof obj.fileName !== "string") return null;
  const importedAt = toDate(obj.importedAt);
  if (!importedAt) return null;
  const parseResult = reviveGa4ParseResult(obj.parseResult);
  const aggregation = reviveGa4Aggregation(obj.aggregation);
  if (!parseResult || !aggregation) return null;
  return {
    fileName: obj.fileName,
    importedAt,
    parseResult,
    aggregation,
  };
}

function reviveGa4Row(obj: unknown): Ga4Row | null {
  if (!isObject(obj)) return null;
  const date = toDate(obj.date);
  if (!date) return null;
  const sessions = Number(obj.sessions ?? 0);
  if (!Number.isFinite(sessions)) return null;
  return {
    date,
    sessions,
    users: toNumOrNull(obj.users),
    purchases: toNumOrNull(obj.purchases),
    total_revenue: toNumOrNull(obj.total_revenue),
    channel: toStrOrNull(obj.channel),
    landing_page: toStrOrNull(obj.landing_page),
  };
}

function reviveGa4ParseResult(obj: unknown): Ga4ParseResult | null {
  if (!isObject(obj)) return null;
  const rawRows = Array.isArray(obj.rows) ? obj.rows : [];
  const rows: Ga4Row[] = [];
  for (const r of rawRows) {
    const row = reviveGa4Row(r);
    if (!row) return null;
    rows.push(row);
  }
  const detected = isObject(obj.detectedColumns)
    ? (obj.detectedColumns as Ga4DetectedColumns)
    : ({
        date: null,
        sessions: null,
        users: null,
        purchases: null,
        total_revenue: null,
        channel: null,
        landing_page: null,
      } as Ga4DetectedColumns);
  return {
    rows,
    warnings: Array.isArray(obj.warnings)
      ? (obj.warnings as Ga4ParseResult["warnings"])
      : [],
    errors: Array.isArray(obj.errors)
      ? (obj.errors as Ga4ParseResult["errors"])
      : [],
    totalRows: Number(obj.totalRows ?? 0),
    acceptedRows: Number(obj.acceptedRows ?? rows.length),
    detectedColumns: detected,
  };
}

function reviveGa4Aggregation(obj: unknown): Ga4Aggregation | null {
  if (!isObject(obj)) return null;
  const topChannels: ChannelStat[] = Array.isArray(obj.topChannels)
    ? (obj.topChannels as ChannelStat[])
    : [];
  const topLandingPages: LandingStat[] = Array.isArray(obj.topLandingPages)
    ? (obj.topLandingPages as LandingStat[])
    : [];
  return {
    totalSessions: Number(obj.totalSessions ?? 0),
    totalUsers: toNumOrNull(obj.totalUsers),
    totalPurchases: toNumOrNull(obj.totalPurchases),
    totalRevenue: toNumOrNull(obj.totalRevenue),
    cvr: toNumOrNull(obj.cvr),
    topChannels,
    topLandingPages,
    periodStart: toDate(obj.periodStart),
    periodEnd: toDate(obj.periodEnd),
    hasChannel: Boolean(obj.hasChannel),
    hasLandingPage: Boolean(obj.hasLandingPage),
  };
}

// ---------- Ads ----------

export function saveAdsImport(imp: AdsImport): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(ADS_IMPORT_STORAGE_KEY, JSON.stringify(imp));
  } catch {
    // ignore
  }
}

export function clearStoredAdsImport(): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.removeItem(ADS_IMPORT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadAdsImport(): AdsImport | null {
  if (!hasLocalStorage()) return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(ADS_IMPORT_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  return reviveAdsImport(parsed);
}

function reviveAdsImport(obj: unknown): AdsImport | null {
  if (!isObject(obj)) return null;
  if (typeof obj.fileName !== "string") return null;
  const importedAt = toDate(obj.importedAt);
  if (!importedAt) return null;
  const parseResult = reviveAdsParseResult(obj.parseResult);
  const aggregation = reviveAdsAggregation(obj.aggregation);
  if (!parseResult || !aggregation) return null;
  return {
    fileName: obj.fileName,
    importedAt,
    parseResult,
    aggregation,
  };
}

function reviveAdRow(obj: unknown): AdRow | null {
  if (!isObject(obj)) return null;
  const date = toDate(obj.date);
  if (!date) return null;
  const cost = Number(obj.cost ?? 0);
  if (!Number.isFinite(cost)) return null;
  const campaign = String(obj.campaign ?? "");
  const channel = String(obj.channel ?? "");
  if (!campaign || !channel) return null;
  return {
    campaign,
    channel,
    date,
    cost,
    impressions: toNumOrNull(obj.impressions),
    clicks: toNumOrNull(obj.clicks),
    conversions: toNumOrNull(obj.conversions),
    revenue: toNumOrNull(obj.revenue),
    product_name: toStrOrNull(obj.product_name),
  };
}

function reviveAdsParseResult(obj: unknown): AdsParseResult | null {
  if (!isObject(obj)) return null;
  const rawRows = Array.isArray(obj.rows) ? obj.rows : [];
  const rows: AdRow[] = [];
  for (const r of rawRows) {
    const row = reviveAdRow(r);
    if (!row) return null;
    rows.push(row);
  }
  const detected = isObject(obj.detectedColumns)
    ? (obj.detectedColumns as AdsDetectedColumns)
    : ({
        campaign: null,
        channel: null,
        date: null,
        cost: null,
        impressions: null,
        clicks: null,
        conversions: null,
        revenue: null,
        product_name: null,
      } as AdsDetectedColumns);
  return {
    rows,
    warnings: Array.isArray(obj.warnings)
      ? (obj.warnings as AdsParseResult["warnings"])
      : [],
    errors: Array.isArray(obj.errors)
      ? (obj.errors as AdsParseResult["errors"])
      : [],
    totalRows: Number(obj.totalRows ?? 0),
    acceptedRows: Number(obj.acceptedRows ?? rows.length),
    detectedColumns: detected,
  };
}

function reviveAdsAggregation(obj: unknown): AdsAggregation | null {
  if (!isObject(obj)) return null;
  const topChannels: AdChannelStat[] = Array.isArray(obj.topChannels)
    ? (obj.topChannels as AdChannelStat[])
    : [];
  const topCampaigns: AdCampaignStat[] = Array.isArray(obj.topCampaigns)
    ? (obj.topCampaigns as AdCampaignStat[])
    : [];
  const inefficientCampaigns: InefficientCampaign[] = Array.isArray(
    obj.inefficientCampaigns,
  )
    ? (obj.inefficientCampaigns as InefficientCampaign[])
    : [];
  return {
    totalCost: Number(obj.totalCost ?? 0),
    totalImpressions: Number(obj.totalImpressions ?? 0),
    totalClicks: Number(obj.totalClicks ?? 0),
    totalConversions: Number(obj.totalConversions ?? 0),
    totalRevenue: Number(obj.totalRevenue ?? 0),
    cpc: toNumOrNull(obj.cpc),
    ctr: toNumOrNull(obj.ctr),
    cvr: toNumOrNull(obj.cvr),
    roas: toNumOrNull(obj.roas),
    topChannels,
    topCampaigns,
    inefficientCampaigns,
    periodStart: toDate(obj.periodStart),
    periodEnd: toDate(obj.periodEnd),
    hasImpressions: Boolean(obj.hasImpressions),
    hasClicks: Boolean(obj.hasClicks),
    hasConversions: Boolean(obj.hasConversions),
    hasRevenue: Boolean(obj.hasRevenue),
    hasProduct: Boolean(obj.hasProduct),
  };
}
