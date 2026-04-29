import type { OrderRow } from "./parseOrders";

export type ProductSales = {
  product_name: string;
  sales: number;
  orders: number;
  quantity: number;
};

export type OrderAggregation = {
  totalSales: number;
  orderCount: number;
  uniqueCustomers: number;
  aov: number;
  topProducts: ProductSales[];
  periodStart: Date | null;
  periodEnd: Date | null;
};

export function aggregateOrders(rows: OrderRow[]): OrderAggregation {
  if (rows.length === 0) {
    return {
      totalSales: 0,
      orderCount: 0,
      uniqueCustomers: 0,
      aov: 0,
      topProducts: [],
      periodStart: null,
      periodEnd: null,
    };
  }

  let totalSales = 0;
  const orderIds = new Set<string>();
  const customerIds = new Set<string>();
  const byProduct = new Map<
    string,
    { sales: number; orders: Set<string>; quantity: number }
  >();
  let minDate = rows[0].order_date.getTime();
  let maxDate = rows[0].order_date.getTime();

  for (const r of rows) {
    totalSales += r.total_sales;
    orderIds.add(r.order_id);
    if (r.customer_id) customerIds.add(r.customer_id);

    const t = r.order_date.getTime();
    if (t < minDate) minDate = t;
    if (t > maxDate) maxDate = t;

    const cur = byProduct.get(r.product_name) ?? {
      sales: 0,
      orders: new Set<string>(),
      quantity: 0,
    };
    cur.sales += r.total_sales;
    cur.quantity += r.quantity;
    cur.orders.add(r.order_id);
    byProduct.set(r.product_name, cur);
  }

  const orderCount = orderIds.size;
  const aov = orderCount > 0 ? totalSales / orderCount : 0;

  const topProducts: ProductSales[] = Array.from(byProduct.entries())
    .map(([product_name, v]) => ({
      product_name,
      sales: v.sales,
      orders: v.orders.size,
      quantity: v.quantity,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return {
    totalSales,
    orderCount,
    uniqueCustomers: customerIds.size,
    aov,
    topProducts,
    periodStart: new Date(minDate),
    periodEnd: new Date(maxDate),
  };
}

export function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export function formatInt(n: number): string {
  return n.toLocaleString("ja-JP");
}
