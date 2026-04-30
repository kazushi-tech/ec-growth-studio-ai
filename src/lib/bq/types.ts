// `/api/bq/*` のレスポンス DTO。
// サーバー側 (`api/bq/*.ts`) と同じ shape。Phase 3A は mock のみ実装。

export type BqMode = 'live' | 'mock';

export interface BqOrdersDailyRow {
  date: string;
  orderCount: number;
  revenue: number;
  aov: number;
}

export interface BqOrdersDailySummary {
  revenue: number;
  orderCount: number;
  aov: number;
}

export interface BqOrdersDailySuccess {
  ok: true;
  mode: BqMode;
  dataset: string;
  from: string;
  to: string;
  rows: BqOrdersDailyRow[];
  summary: BqOrdersDailySummary;
  checkedAt: string;
  latencyMs: number;
  message: string;
}

export interface BqFailure {
  ok: false;
  errorCode: string;
  message: string;
  checkedAt: string;
}

export type BqOrdersDailyResponse = BqOrdersDailySuccess | BqFailure;
