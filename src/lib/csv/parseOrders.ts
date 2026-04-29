import Papa from "papaparse";

export type OrderRow = {
  order_id: string;
  order_date: Date;
  customer_id: string;
  product_name: string;
  quantity: number;
  total_sales: number;
};

export type ParseWarning = {
  row: number;
  field?: string;
  message: string;
};

export type ParseError = {
  message: string;
};

export type ParseResult = {
  rows: OrderRow[];
  warnings: ParseWarning[];
  errors: ParseError[];
  totalRows: number;
  acceptedRows: number;
  detectedColumns: Record<keyof OrderRow, string | null>;
};

const COLUMN_SYNONYMS: Record<keyof OrderRow, string[]> = {
  order_id: ["order_id", "orderid", "order", "注文id", "注文番号", "受注番号"],
  order_date: ["order_date", "date", "注文日", "受注日", "purchased_at", "created_at"],
  customer_id: ["customer_id", "customerid", "customer", "顧客id", "顧客番号"],
  product_name: ["product_name", "product", "item", "商品名", "アイテム名", "title"],
  quantity: ["quantity", "qty", "数量", "個数", "count"],
  total_sales: ["total_sales", "total", "sales", "売上", "amount", "price", "subtotal"],
};

const REQUIRED_FIELDS: (keyof OrderRow)[] = [
  "order_id",
  "order_date",
  "product_name",
  "quantity",
  "total_sales",
];

const norm = (s: string) =>
  s
    .replace(/﻿/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, "_");

function detectColumns(headers: string[]): Record<keyof OrderRow, string | null> {
  const map = {} as Record<keyof OrderRow, string | null>;
  const normalized = headers.map((h) => ({ raw: h, norm: norm(h) }));
  (Object.keys(COLUMN_SYNONYMS) as (keyof OrderRow)[]).forEach((field) => {
    const candidates = COLUMN_SYNONYMS[field].map(norm);
    const hit = normalized.find((h) => candidates.includes(h.norm));
    map[field] = hit ? hit.raw : null;
  });
  return map;
}

function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  // strip currency, commas, spaces
  const cleaned = s.replace(/[¥￥$,\s円]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  // accept YYYY-MM-DD, YYYY/MM/DD, or full ISO
  const normalized = s.replace(/\//g, "-");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function parseOrdersCsv(file: File): Promise<ParseResult> {
  const text = await file.text();
  return parseOrdersCsvText(text);
}

export function parseOrdersCsvText(text: string): ParseResult {
  const warnings: ParseWarning[] = [];
  const errors: ParseError[] = [];

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  const headers = parsed.meta.fields ?? [];
  const detected = detectColumns(headers);

  if (!headers.length || parsed.data.length === 0) {
    errors.push({ message: "CSVが空、またはヘッダーが読み取れませんでした。" });
    return {
      rows: [],
      warnings,
      errors,
      totalRows: 0,
      acceptedRows: 0,
      detectedColumns: detected,
    };
  }

  const missing = REQUIRED_FIELDS.filter((f) => !detected[f]);
  if (missing.length) {
    errors.push({
      message: `必須カラムが不足: ${missing.join(", ")}（対応カラム名は CSV テンプレートを参照）`,
    });
  }

  const rows: OrderRow[] = [];
  parsed.data.forEach((raw, idx) => {
    const rowNo = idx + 2; // header is row 1

    const orderId = detected.order_id ? String(raw[detected.order_id] ?? "").trim() : "";
    const customerId = detected.customer_id
      ? String(raw[detected.customer_id] ?? "").trim()
      : "";
    const productName = detected.product_name
      ? String(raw[detected.product_name] ?? "").trim()
      : "";

    const dateRaw = detected.order_date ? raw[detected.order_date] : null;
    const qtyRaw = detected.quantity ? raw[detected.quantity] : null;
    const totalRaw = detected.total_sales ? raw[detected.total_sales] : null;

    const date = parseDate(dateRaw);
    const qty = parseNumber(qtyRaw);
    const total = parseNumber(totalRaw);

    if (!orderId) {
      warnings.push({ row: rowNo, field: "order_id", message: "order_id が空です" });
      return;
    }
    if (!productName) {
      warnings.push({
        row: rowNo,
        field: "product_name",
        message: "product_name が空です",
      });
      return;
    }
    if (date === null) {
      warnings.push({
        row: rowNo,
        field: "order_date",
        message: `日付を解釈できませんでした: "${String(dateRaw ?? "")}"`,
      });
      return;
    }
    if (qty === null || qty < 0) {
      warnings.push({
        row: rowNo,
        field: "quantity",
        message: `quantity が不正: "${String(qtyRaw ?? "")}"`,
      });
      return;
    }
    if (total === null || total < 0) {
      warnings.push({
        row: rowNo,
        field: "total_sales",
        message: `total_sales が不正: "${String(totalRaw ?? "")}"`,
      });
      return;
    }

    rows.push({
      order_id: orderId,
      order_date: date,
      customer_id: customerId,
      product_name: productName,
      quantity: qty,
      total_sales: total,
    });
  });

  parsed.errors.forEach((e) => {
    warnings.push({
      row: (e.row ?? 0) + 1,
      message: `CSVパースエラー: ${e.message}`,
    });
  });

  return {
    rows,
    warnings,
    errors,
    totalRows: parsed.data.length,
    acceptedRows: rows.length,
    detectedColumns: detected,
  };
}
