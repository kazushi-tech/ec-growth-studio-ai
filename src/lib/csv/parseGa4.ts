import Papa from "papaparse";

// GA4 CSV の最小行表現。
// date / sessions のみ必須、それ以外はあれば集計に使う。
export type Ga4Row = {
  date: Date;
  sessions: number;
  users: number | null;
  purchases: number | null;
  total_revenue: number | null;
  channel: string | null;
  landing_page: string | null;
};

export type Ga4ParseWarning = {
  row: number;
  field?: string;
  message: string;
};

export type Ga4ParseError = {
  message: string;
};

export type Ga4DetectedColumns = Record<keyof Ga4Row, string | null>;

export type Ga4ParseResult = {
  rows: Ga4Row[];
  warnings: Ga4ParseWarning[];
  errors: Ga4ParseError[];
  totalRows: number;
  acceptedRows: number;
  detectedColumns: Ga4DetectedColumns;
};

const COLUMN_SYNONYMS: Record<keyof Ga4Row, string[]> = {
  date: ["date", "event_date", "日付"],
  sessions: ["sessions", "セッション", "セッション数"],
  users: ["users", "active_users", "ユーザー", "ユーザー数"],
  purchases: [
    "purchases",
    "transactions",
    "purchase",
    "購入",
    "購入数",
  ],
  total_revenue: [
    "total_revenue",
    "revenue",
    "purchase_revenue",
    "売上",
  ],
  channel: [
    "channel",
    "session_default_channel_group",
    "source_medium",
    "流入元",
  ],
  landing_page: [
    "landing_page",
    "page_path",
    "lp",
    "ランディングページ",
  ],
};

const REQUIRED_FIELDS: (keyof Ga4Row)[] = ["date", "sessions"];

const norm = (s: string) =>
  s
    .replace(/﻿/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, "_");

function detectColumns(headers: string[]): Ga4DetectedColumns {
  const map = {} as Ga4DetectedColumns;
  const normalized = headers.map((h) => ({ raw: h, norm: norm(h) }));
  (Object.keys(COLUMN_SYNONYMS) as (keyof Ga4Row)[]).forEach((field) => {
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
  const cleaned = s.replace(/[¥￥$,\s円]/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  if (!s) return null;
  // GA4 BigQuery export の event_date は "YYYYMMDD" 形式が多い
  if (/^\d{8}$/.test(s)) {
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    const dt = new Date(`${y}-${m}-${d}`);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const normalized = s.replace(/\//g, "-");
  const dt = new Date(normalized);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

export async function parseGa4Csv(file: File): Promise<Ga4ParseResult> {
  const text = await file.text();
  return parseGa4CsvText(text);
}

export function parseGa4CsvText(text: string): Ga4ParseResult {
  const warnings: Ga4ParseWarning[] = [];
  const errors: Ga4ParseError[] = [];

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
      message: `必須カラムが不足: ${missing.join(", ")}（対応カラム名は GA4 CSV テンプレートを参照）`,
    });
  }

  const rows: Ga4Row[] = [];
  parsed.data.forEach((raw, idx) => {
    const rowNo = idx + 2; // header is row 1

    const dateRaw = detected.date ? raw[detected.date] : null;
    const sessionsRaw = detected.sessions ? raw[detected.sessions] : null;
    const usersRaw = detected.users ? raw[detected.users] : null;
    const purchasesRaw = detected.purchases ? raw[detected.purchases] : null;
    const revenueRaw = detected.total_revenue ? raw[detected.total_revenue] : null;
    const channel = detected.channel
      ? String(raw[detected.channel] ?? "").trim()
      : "";
    const landing = detected.landing_page
      ? String(raw[detected.landing_page] ?? "").trim()
      : "";

    const date = parseDate(dateRaw);
    const sessions = parseNumber(sessionsRaw);

    if (date === null) {
      warnings.push({
        row: rowNo,
        field: "date",
        message: `日付を解釈できませんでした: "${String(dateRaw ?? "")}"`,
      });
      return;
    }
    if (sessions === null || sessions < 0) {
      warnings.push({
        row: rowNo,
        field: "sessions",
        message: `sessions が不正: "${String(sessionsRaw ?? "")}"`,
      });
      return;
    }

    const users = parseNumber(usersRaw);
    const purchases = parseNumber(purchasesRaw);
    const revenue = parseNumber(revenueRaw);

    rows.push({
      date,
      sessions,
      users: users !== null && users >= 0 ? users : null,
      purchases: purchases !== null && purchases >= 0 ? purchases : null,
      total_revenue: revenue !== null && revenue >= 0 ? revenue : null,
      channel: channel || null,
      landing_page: landing || null,
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
