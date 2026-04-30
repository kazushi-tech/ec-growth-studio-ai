import type { BqOrdersDailyResponse, BqOrdersDailySuccess } from './types';

// BigQuery デモ Mode のデフォルト期間。`api/bq/orders-daily.ts` の MOCK_RANGE と一致。
export const BQ_DEMO_DEFAULT_FROM = '2026-04-01';
export const BQ_DEMO_DEFAULT_TO = '2026-04-30';

export class BqFetchError extends Error {
  constructor(
    public readonly errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = 'BqFetchError';
  }
}

export async function fetchBqOrdersDaily(params: {
  from?: string;
  to?: string;
  signal?: AbortSignal;
}): Promise<BqOrdersDailySuccess> {
  const from = params.from ?? BQ_DEMO_DEFAULT_FROM;
  const to = params.to ?? BQ_DEMO_DEFAULT_TO;
  const url = `/api/bq/orders-daily?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: params.signal,
  });

  let body: BqOrdersDailyResponse | null = null;
  try {
    body = (await res.json()) as BqOrdersDailyResponse;
  } catch {
    throw new BqFetchError(
      'NETWORK',
      `Failed to parse response from /api/bq/orders-daily (HTTP ${res.status})`,
    );
  }

  if (!body || body.ok !== true) {
    const errorCode = body && 'errorCode' in body ? body.errorCode : `HTTP_${res.status}`;
    const message = body && 'message' in body ? body.message : 'Unknown failure';
    throw new BqFetchError(errorCode, message);
  }

  return body;
}
