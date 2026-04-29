import Papa from "papaparse";

// 広告CSV の最小行表現。
// campaign / channel / date / cost のみ必須。
// impressions / clicks / conversions / revenue / product_name はあれば集計に使う。
export type AdRow = {
  campaign: string;
  channel: string;
  date: Date;
  cost: number;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  revenue: number | null;
  product_name: string | null;
};

export type AdsParseWarning = {
  row: number;
  field?: string;
  message: string;
};

export type AdsParseError = {
  message: string;
};

export type AdsDetectedColumns = Record<keyof AdRow, string | null>;

export type AdsParseResult = {
  rows: AdRow[];
  warnings: AdsParseWarning[];
  errors: AdsParseError[];
  totalRows: number;
  acceptedRows: number;
  detectedColumns: AdsDetectedColumns;
};

const COLUMN_SYNONYMS: Record<keyof AdRow, string[]> = {
  campaign: [
    "campaign",
    "campaign_name",
    "ad_group",
    "キャンペーン",
    "キャンペーン名",
    "広告キャンペーン",
  ],
  channel: [
    "channel",
    "platform",
    "media",
    "source",
    "チャネル",
    "媒体",
    "媒体名",
  ],
  date: ["date", "day", "日付", "配信日"],
  cost: [
    "cost",
    "spend",
    "amount_spent",
    "広告費",
    "費用",
    "コスト",
    "消化金額",
  ],
  impressions: [
    "impressions",
    "imp",
    "インプレッション",
    "表示回数",
  ],
  clicks: ["clicks", "click", "クリック", "クリック数"],
  conversions: [
    "conversions",
    "conv",
    "purchases",
    "transactions",
    "コンバージョン",
    "コンバージョン数",
    "購入",
    "購入数",
  ],
  revenue: [
    "revenue",
    "conversion_value",
    "value",
    "売上",
    "コンバージョン値",
    "広告経由売上",
  ],
  product_name: [
    "product_name",
    "product",
    "item",
    "商品名",
    "アイテム名",
  ],
};

const REQUIRED_FIELDS: (keyof AdRow)[] = [
  "campaign",
  "channel",
  "date",
  "cost",
];

const norm = (s: string) =>
  s
    .replace(/﻿/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, "_");

function detectColumns(headers: string[]): AdsDetectedColumns {
  const map = {} as AdsDetectedColumns;
  const normalized = headers.map((h) => ({ raw: h, norm: norm(h) }));
  (Object.keys(COLUMN_SYNONYMS) as (keyof AdRow)[]).forEach((field) => {
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
  // 広告管理画面エクスポートで稀に "YYYYMMDD" 形式が出るので対応
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

export async function parseAdsCsv(file: File): Promise<AdsParseResult> {
  const text = await file.text();
  return parseAdsCsvText(text);
}

export function parseAdsCsvText(text: string): AdsParseResult {
  const warnings: AdsParseWarning[] = [];
  const errors: AdsParseError[] = [];

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
      message: `必須カラムが不足: ${missing.join(", ")}（対応カラム名は 広告CSV テンプレートを参照）`,
    });
  }

  const rows: AdRow[] = [];
  parsed.data.forEach((raw, idx) => {
    const rowNo = idx + 2; // header is row 1

    const campaign = detected.campaign
      ? String(raw[detected.campaign] ?? "").trim()
      : "";
    const channel = detected.channel
      ? String(raw[detected.channel] ?? "").trim()
      : "";
    const dateRaw = detected.date ? raw[detected.date] : null;
    const costRaw = detected.cost ? raw[detected.cost] : null;
    const impressionsRaw = detected.impressions
      ? raw[detected.impressions]
      : null;
    const clicksRaw = detected.clicks ? raw[detected.clicks] : null;
    const conversionsRaw = detected.conversions
      ? raw[detected.conversions]
      : null;
    const revenueRaw = detected.revenue ? raw[detected.revenue] : null;
    const product = detected.product_name
      ? String(raw[detected.product_name] ?? "").trim()
      : "";

    const date = parseDate(dateRaw);
    const cost = parseNumber(costRaw);

    if (!campaign) {
      warnings.push({
        row: rowNo,
        field: "campaign",
        message: "campaign が空です",
      });
      return;
    }
    if (!channel) {
      warnings.push({
        row: rowNo,
        field: "channel",
        message: "channel が空です",
      });
      return;
    }
    if (date === null) {
      warnings.push({
        row: rowNo,
        field: "date",
        message: `日付を解釈できませんでした: "${String(dateRaw ?? "")}"`,
      });
      return;
    }
    if (cost === null || cost < 0) {
      warnings.push({
        row: rowNo,
        field: "cost",
        message: `cost が不正: "${String(costRaw ?? "")}"`,
      });
      return;
    }

    const impressions = parseNumber(impressionsRaw);
    const clicks = parseNumber(clicksRaw);
    const conversions = parseNumber(conversionsRaw);
    const revenue = parseNumber(revenueRaw);

    rows.push({
      campaign,
      channel,
      date,
      cost,
      impressions:
        impressions !== null && impressions >= 0 ? impressions : null,
      clicks: clicks !== null && clicks >= 0 ? clicks : null,
      conversions:
        conversions !== null && conversions >= 0 ? conversions : null,
      revenue: revenue !== null && revenue >= 0 ? revenue : null,
      product_name: product || null,
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
