import { kpis as sampleKpis, type Kpi } from '../../data/sample';
import { formatYen, formatInt } from '../csv/aggregateOrders';
import type { BqOrdersDailySummary } from './types';

// BigQuery デモ Mode の summary を Dashboard の KPI（売上 / 注文数 / AOV）に流し込む。
// CVR / リピート率 / 広告 ROAS は orders-daily から導出できないため、
// 既存サンプル値を維持しつつ delta を「BQ未対応」と表示する。
// `buildKpisFromImport` (CSV) と並列構造。
export function buildKpisFromBqDemo(summary: BqOrdersDailySummary): Kpi[] {
  return sampleKpis.map((k): Kpi => {
    if (k.key === 'sales') {
      return {
        ...k,
        value: formatYen(summary.revenue),
        delta: 'BigQueryデモ',
        deltaLabel: '集計期間',
        trend: 'flat',
        intent: 'neutral',
      };
    }
    if (k.key === 'orders') {
      return {
        ...k,
        value: formatInt(summary.orderCount),
        delta: 'BigQueryデモ',
        deltaLabel: '集計期間',
        trend: 'flat',
        intent: 'neutral',
      };
    }
    if (k.key === 'aov') {
      return {
        ...k,
        value: formatYen(summary.aov),
        delta: 'BigQueryデモ',
        deltaLabel: '集計期間',
        trend: 'flat',
        intent: 'neutral',
      };
    }
    return { ...k, delta: '—', deltaLabel: 'BQ未対応' };
  });
}
