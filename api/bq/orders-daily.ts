import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  applyCors,
  diffInDays,
  getMaxQueryDays,
  isMockMode,
  isValidIsoDate,
  jsonFailure,
  safeMessage,
  DEFAULT_DATASET,
  MOCK_MESSAGE,
} from './_shared.js';

type ErrorCode =
  | 'METHOD_NOT_ALLOWED'
  | 'CORS_FORBIDDEN'
  | 'INVALID_DATE'
  | 'INVALID_RANGE'
  | 'RANGE_TOO_LONG'
  | 'NOT_IMPLEMENTED'
  | 'UNKNOWN';

type Mode = 'mock';

interface DailyRow {
  date: string;
  orderCount: number;
  revenue: number;
  aov: number;
}

interface OrdersDailySuccess {
  ok: true;
  mode: Mode;
  dataset: string;
  from: string;
  to: string;
  rows: DailyRow[];
  summary: {
    revenue: number;
    orderCount: number;
    aov: number;
  };
  checkedAt: string;
  latencyMs: number;
  message: string;
}

// Mock 範囲は 2026 年 4 月 1〜30 日。`samples/csv/orders_sample.csv` と同じ世界観。
// 日次値は固定（モジュール読込時に決定）で、デモ間で揺れないようにする。
const MOCK_RANGE_START = '2026-04-01';
const MOCK_RANGE_END = '2026-04-30';

// Sun..Sat の基本受注数。週末を高めにする EC の典型パターン。
const DOW_BASE_ORDER_COUNT = [130, 102, 100, 106, 104, 118, 124] as const;

function buildMockRows(): readonly DailyRow[] {
  const rows: DailyRow[] = [];
  // 2026-04-01 (UTC) から 30 日。Date.UTC の月は 0-indexed。
  const start = Date.UTC(2026, 3, 1);
  for (let i = 0; i < 30; i++) {
    const t = start + i * 86_400_000;
    const d = new Date(t);
    const iso = d.toISOString().slice(0, 10);
    const dow = d.getUTCDay();
    const dom = d.getUTCDate();
    // 月内の日でわずかに揺らす（同じ曜日が完全一致しないように）
    const orderCount = DOW_BASE_ORDER_COUNT[dow] + ((dom * 3) % 9) - 4;
    const aov = 3700 + ((dom * 7) % 12) * 10; // 3700〜3810
    rows.push({ date: iso, orderCount, revenue: orderCount * aov, aov });
  }
  return Object.freeze(rows);
}

const MOCK_DAILY_ROWS: readonly DailyRow[] = buildMockRows();

function summarize(rows: readonly DailyRow[]): OrdersDailySuccess['summary'] {
  let revenue = 0;
  let orderCount = 0;
  for (const r of rows) {
    revenue += r.revenue;
    orderCount += r.orderCount;
  }
  const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
  return { revenue, orderCount, aov };
}

function pickQuery(req: VercelRequest, key: string): string | undefined {
  const v = req.query?.[key];
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return v[0];
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { allowed } = applyCors(req, res);

    if (!allowed) {
      if (req.method === 'OPTIONS') {
        res.status(403).end();
        return;
      }
      jsonFailure(res, 403, 'CORS_FORBIDDEN' satisfies ErrorCode, 'Origin is not allowed');
      return;
    }

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (req.method !== 'GET') {
      jsonFailure(res, 405, 'METHOD_NOT_ALLOWED' satisfies ErrorCode, 'Only GET is allowed');
      return;
    }

    // Phase 3A では実 BigQuery への orders-daily クエリは未実装。
    // BQ_MOCK_MODE=true のときだけ mock data を返し、それ以外は 501 で安全に失敗する。
    // GCP には接続しない。
    if (!isMockMode()) {
      jsonFailure(
        res,
        501,
        'NOT_IMPLEMENTED' satisfies ErrorCode,
        'Real BigQuery orders-daily is not implemented yet. Set BQ_MOCK_MODE=true to use demo data.',
      );
      return;
    }

    const fromQ = pickQuery(req, 'from') ?? MOCK_RANGE_START;
    const toQ = pickQuery(req, 'to') ?? MOCK_RANGE_END;

    if (!isValidIsoDate(fromQ) || !isValidIsoDate(toQ)) {
      jsonFailure(
        res,
        400,
        'INVALID_DATE' satisfies ErrorCode,
        'from / to must be ISO 8601 dates (YYYY-MM-DD)',
      );
      return;
    }

    const days = diffInDays(fromQ, toQ);
    if (days < 0) {
      jsonFailure(
        res,
        400,
        'INVALID_RANGE' satisfies ErrorCode,
        '`from` must be on or before `to`',
      );
      return;
    }

    const maxDays = getMaxQueryDays();
    // diff は両端を含めるので +1 が日数。閾値は MAX_QUERY_DAYS と一致させる。
    if (days + 1 > maxDays) {
      jsonFailure(
        res,
        400,
        'RANGE_TOO_LONG' satisfies ErrorCode,
        `Requested range exceeds MAX_QUERY_DAYS=${maxDays}`,
      );
      return;
    }

    const rows = MOCK_DAILY_ROWS.filter((r) => r.date >= fromQ && r.date <= toQ);
    const dataset = process.env.BQ_DATASET ?? DEFAULT_DATASET;

    const body: OrdersDailySuccess = {
      ok: true,
      mode: 'mock',
      dataset,
      from: fromQ,
      to: toQ,
      rows,
      summary: summarize(rows),
      checkedAt: new Date().toISOString(),
      latencyMs: 0,
      message: MOCK_MESSAGE,
    };
    res.status(200).json(body);
  } catch (err) {
    jsonFailure(res, 200, 'UNKNOWN' satisfies ErrorCode, safeMessage(err));
  }
}
