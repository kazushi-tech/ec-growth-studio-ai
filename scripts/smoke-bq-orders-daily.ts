/**
 * Smoke test for /api/bq/orders-daily.
 * Invokes the handler directly with a mock VercelRequest / VercelResponse.
 *
 * Usage:
 *   npx tsx scripts/smoke-bq-orders-daily.ts
 *
 * 実 GCP には接続しない。BQ_MOCK_MODE / CORS / method / date validation /
 * MAX_QUERY_DAYS / NOT_IMPLEMENTED の分岐のみを検証する。
 */
import handler from '../api/bq/orders-daily';

interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  ended: boolean;
  setHeader(name: string, value: string): void;
  status(code: number): MockResponse;
  json(body: unknown): MockResponse;
  end(): MockResponse;
}

function makeRes(): MockResponse {
  const res: MockResponse = {
    statusCode: 0,
    headers: {},
    body: undefined,
    ended: false,
    setHeader(name: string, value: string) {
      res.headers[name.toLowerCase()] = value;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      res.ended = true;
      return res;
    },
    end() {
      res.ended = true;
      return res;
    },
  };
  return res;
}

function makeReq(
  method: string,
  origin: string | undefined,
  query: Record<string, string> = {},
) {
  return {
    method,
    headers: origin ? { origin } : {},
    query,
  };
}

let failures = 0;
function expect(name: string, cond: boolean, detail?: string) {
  if (!cond) {
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
    failures += 1;
  }
}

async function runHandler(
  method: string,
  origin: string | undefined,
  query: Record<string, string>,
  envOverrides: Record<string, string | undefined>,
) {
  const before: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(envOverrides)) {
    before[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const req = makeReq(method, origin, query);
  const res = makeRes();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await handler(req as any, res as any);
  for (const [k, v] of Object.entries(before)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return res;
}

async function main() {
  // ---------- mock-mode 成功（明示的 from/to） ----------
  const r1 = await runHandler(
    'GET',
    undefined,
    { from: '2026-04-01', to: '2026-04-30' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined, MAX_QUERY_DAYS: undefined },
  );
  console.log(
    JSON.stringify({
      case: 'mock GET full-april',
      status: r1.statusCode,
      ok: (r1.body as { ok?: boolean })?.ok,
      mode: (r1.body as { mode?: string })?.mode,
      rowCount: ((r1.body as { rows?: unknown[] })?.rows ?? []).length,
      summary: (r1.body as { summary?: unknown })?.summary,
    }),
  );
  expect('mock GET full-april → 200', r1.statusCode === 200);
  expect(
    'mock GET full-april → ok:true / mode:mock',
    (r1.body as { ok?: boolean })?.ok === true &&
      (r1.body as { mode?: string })?.mode === 'mock',
  );
  expect(
    'mock GET full-april → 30 rows',
    ((r1.body as { rows?: unknown[] }).rows ?? []).length === 30,
  );
  expect(
    'mock GET full-april → summary fields present',
    typeof (r1.body as { summary?: { revenue?: number; orderCount?: number; aov?: number } })
      ?.summary?.revenue === 'number' &&
      typeof (r1.body as { summary?: { orderCount?: number } })?.summary?.orderCount === 'number' &&
      typeof (r1.body as { summary?: { aov?: number } })?.summary?.aov === 'number',
  );

  const sum = (r1.body as { summary?: { revenue: number; orderCount: number; aov: number } })
    ?.summary;
  // 30日 mock data の合計が EC ECサイトとして妥当な範囲内（数千万円・数千件）
  expect(
    'mock summary revenue is plausible (¥8M〜¥20M)',
    !!sum && sum.revenue >= 8_000_000 && sum.revenue <= 20_000_000,
    `revenue=${sum?.revenue}`,
  );
  expect(
    'mock summary orderCount is plausible (2,000〜5,000)',
    !!sum && sum.orderCount >= 2_000 && sum.orderCount <= 5_000,
    `orderCount=${sum?.orderCount}`,
  );

  // ---------- mock-mode: クエリ未指定でもデフォルト範囲を返す ----------
  const r2 = await runHandler(
    'GET',
    undefined,
    {},
    { BQ_MOCK_MODE: '1', ALLOWED_ORIGINS: undefined },
  );
  expect('mock no-query → 200', r2.statusCode === 200);
  expect(
    'mock no-query → ok:true',
    (r2.body as { ok?: boolean })?.ok === true,
  );
  expect(
    'mock no-query → defaults applied',
    (r2.body as { from?: string })?.from === '2026-04-01' &&
      (r2.body as { to?: string })?.to === '2026-04-30',
  );

  // ---------- mock-mode: 範囲外（rows 空配列） ----------
  const r3 = await runHandler(
    'GET',
    undefined,
    { from: '2030-01-01', to: '2030-01-31' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  );
  expect('mock out-of-range → 200', r3.statusCode === 200);
  expect(
    'mock out-of-range → empty rows / orderCount=0',
    ((r3.body as { rows?: unknown[] }).rows ?? []).length === 0 &&
      (r3.body as { summary?: { orderCount?: number } })?.summary?.orderCount === 0,
  );

  // ---------- 不正な date ----------
  const r4 = await runHandler(
    'GET',
    undefined,
    { from: 'not-a-date', to: '2026-04-30' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  );
  expect('invalid from → 400', r4.statusCode === 400);
  expect(
    'invalid from → INVALID_DATE',
    (r4.body as { errorCode?: string })?.errorCode === 'INVALID_DATE',
  );

  // 2026-02-30 は実在しない日付
  const r4b = await runHandler(
    'GET',
    undefined,
    { from: '2026-02-30', to: '2026-04-30' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  );
  expect('non-existent date → 400 / INVALID_DATE', r4b.statusCode === 400);
  expect(
    'non-existent date → INVALID_DATE',
    (r4b.body as { errorCode?: string })?.errorCode === 'INVALID_DATE',
  );

  // ---------- from > to ----------
  const r5 = await runHandler(
    'GET',
    undefined,
    { from: '2026-04-30', to: '2026-04-01' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  );
  expect('from > to → 400', r5.statusCode === 400);
  expect(
    'from > to → INVALID_RANGE',
    (r5.body as { errorCode?: string })?.errorCode === 'INVALID_RANGE',
  );

  // ---------- MAX_QUERY_DAYS 超過 ----------
  const r6 = await runHandler(
    'GET',
    undefined,
    { from: '2024-01-01', to: '2026-12-31' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined, MAX_QUERY_DAYS: '370' },
  );
  expect('range too long → 400', r6.statusCode === 400);
  expect(
    'range too long → RANGE_TOO_LONG',
    (r6.body as { errorCode?: string })?.errorCode === 'RANGE_TOO_LONG',
  );

  // ---------- BQ_MOCK_MODE 未設定 → NOT_IMPLEMENTED ----------
  const r7 = await runHandler(
    'GET',
    undefined,
    { from: '2026-04-01', to: '2026-04-30' },
    { BQ_MOCK_MODE: undefined, ALLOWED_ORIGINS: undefined },
  );
  expect('no mock mode → 501', r7.statusCode === 501);
  expect(
    'no mock mode → NOT_IMPLEMENTED',
    (r7.body as { errorCode?: string })?.errorCode === 'NOT_IMPLEMENTED',
  );

  // ---------- POST 拒否 ----------
  const r8 = await runHandler(
    'POST',
    undefined,
    {},
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  );
  expect('POST → 405', r8.statusCode === 405);

  // ---------- CORS fail-closed: ALLOWED_ORIGINS 未設定 + Origin あり ----------
  const r9 = await runHandler(
    'GET',
    'https://evil.example.com',
    { from: '2026-04-01', to: '2026-04-30' },
    { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  );
  expect('CORS empty + origin → 403', r9.statusCode === 403);
  expect(
    'CORS empty + origin → CORS_FORBIDDEN',
    (r9.body as { errorCode?: string })?.errorCode === 'CORS_FORBIDDEN',
  );
  expect(
    'CORS empty + origin → no ACAO header',
    r9.headers['access-control-allow-origin'] === undefined,
  );

  // ---------- CORS 許可 Origin ----------
  const r10 = await runHandler(
    'GET',
    'https://allowed.example.com',
    { from: '2026-04-01', to: '2026-04-30' },
    {
      BQ_MOCK_MODE: 'true',
      ALLOWED_ORIGINS: 'https://allowed.example.com',
    },
  );
  expect('allowed origin → 200', r10.statusCode === 200);
  expect(
    'allowed origin → ACAO echoed',
    r10.headers['access-control-allow-origin'] === 'https://allowed.example.com',
  );

  if (failures > 0) {
    console.error(`smoke test FAILED (${failures} assertion(s))`);
    process.exit(1);
  }
  console.log('smoke test OK');
}

void main().catch((e) => {
  console.error('smoke test crashed:', e);
  process.exit(1);
});
