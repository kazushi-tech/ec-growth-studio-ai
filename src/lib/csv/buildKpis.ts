import { kpis as sampleKpis, type Kpi } from "../../data/sample";
import type { OrderAggregation } from "./aggregateOrders";
import { formatYen, formatInt } from "./aggregateOrders";

// Replace sales / orders / aov KPIs with values computed from the imported CSV.
// Other KPIs (CVR / repeat / ROAS) cannot be derived from order CSV alone, so
// they remain as the existing sample values with a "—" delta to signal they
// were not recomputed.
export function buildKpisFromImport(agg: OrderAggregation): Kpi[] {
  const csvKey = (k: Kpi): Kpi => {
    if (k.key === "sales") {
      return {
        ...k,
        value: formatYen(agg.totalSales),
        delta: "CSV取込",
        deltaLabel: "今回取込分",
        trend: "flat",
        intent: "neutral",
      };
    }
    if (k.key === "orders") {
      return {
        ...k,
        value: formatInt(agg.orderCount),
        delta: "CSV取込",
        deltaLabel: "今回取込分",
        trend: "flat",
        intent: "neutral",
      };
    }
    if (k.key === "aov") {
      return {
        ...k,
        value: formatYen(agg.aov),
        delta: "CSV取込",
        deltaLabel: "今回取込分",
        trend: "flat",
        intent: "neutral",
      };
    }
    // KPIs not derivable from orders CSV — keep sample, but flag as not recomputed
    return { ...k, delta: "—", deltaLabel: "CSV未対応" };
  };

  return sampleKpis.map(csvKey);
}
