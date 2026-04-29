import type { OrdersImport } from "./ImportContext";
import type { OrderRow, ParseResult } from "./parseOrders";
import type { OrderAggregation, ProductSales } from "./aggregateOrders";

export const ORDERS_IMPORT_STORAGE_KEY = "ec-growth-studio:orders-import:v1";

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
