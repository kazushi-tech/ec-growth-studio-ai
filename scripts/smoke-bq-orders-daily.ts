/**
 * Smoke test for /api/bq/orders-daily.
 * Invokes the handler directly with a mock VercelRequest / VercelResponse.
 *
 * Usage:
 *   npx tsx scripts/smoke-bq-orders-daily.ts
 *
 * Phase 3A 第2PRは mock mode のみを扱う。実 BigQuery クエリは検証しない。
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

function makeReq(method: string, origin?: string, query: Record<string, string> = {}) {
  return {
    method,
    headers: origin ? { origin } : {},
    query,
  };
}

const isolatedKeys = [
  'BQ_MOCK_MODE',
  'BQ_DATASET',
  'ALLOWED_ORIGINS',
  'MAX_QUERY_DAYS',
];

async function runHandler({
  method = 'GET',
  origin,
  query = {},
  envOverrides = {},
}: {
  method?: string;
  origin?: string;
  query?: Record<string, string>;
  envOverrides?: Record<string, string | undefined>;
}) {
  const before: Record<string, string | undefined> = {};
  for (const k of isolatedKeys) {
    before[k] = process.env[k];
    const v = envOverrides[k];
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

let failures = 0;
function expect(name: string, cond: boolean, detail?: string) {
  if (!cond) {
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
    failures += 1;
  }
}

function leaksSecret(body: unknown): boolean {
  const s = JSON.stringify(body ?? '');
  return (
    s.includes('private_key') ||
    s.includes('BEGIN PRIVATE KEY') ||
    s.includes('client_email')
  );
}

async function main() {
  const r0 = await runHandler({});
  console.log(JSON.stringify({ case: 'GET no-mock', status: r0.statusCode, body: r0.body }));
  expect('GET no-mock -> 501', r0.statusCode === 501);
  expect(
    'GET no-mock -> NOT_IMPLEMENTED',
    (r0.body as { ok?: boolean; errorCode?: string })?.ok === false &&
      (r0.body as { errorCode?: string })?.errorCode === 'NOT_IMPLEMENTED',
  );

  const r1 = await runHandler({ envOverrides: { BQ_MOCK_MODE: 'true' } });
  console.log(JSON.stringify({ case: 'GET mock default', status: r1.statusCode, body: r1.body }));
  expect('GET mock default -> 200', r1.statusCode === 200);
  expect(
    'GET mock default -> ok:true / mode:mock',
    (r1.body as { ok?: boolean; mode?: string })?.ok === true &&
      (r1.body as { mode?: string })?.mode === 'mock',
  );
  expect(
    'GET mock default -> 30 rows',
    ((r1.body as { rows?: unknown[] })?.rows ?? []).length === 30,
  );
  expect(
    'GET mock default -> summary populated',
    ((r1.body as { summary?: { revenue?: number; orderCount?: number; aov?: number } })?.summary
      ?.revenue ?? 0) > 0 &&
      ((r1.body as { summary?: { orderCount?: number } })?.summary?.orderCount ?? 0) > 0 &&
      ((r1.body as { summary?: { aov?: number } })?.summary?.aov ?? 0) > 0,
  );
  expect(
    'GET mock default -> message says no GCP connection',
    String((r1.body as { message?: string })?.message ?? '').includes('No GCP connection'),
  );
  expect('GET mock default -> no secret leak', !leaksSecret(r1.body));

  const r2 = await runHandler({
    envOverrides: { BQ_MOCK_MODE: '1' },
    query: { from: '2026-04-01', to: '2026-04-07' },
  });
  console.log(JSON.stringify({ case: 'GET mock 7 days', status: r2.statusCode, body: r2.body }));
  expect('GET mock 7 days -> 200', r2.statusCode === 200);
  expect(
    'GET mock 7 days -> 7 rows',
    ((r2.body as { rows?: unknown[] })?.rows ?? []).length === 7,
  );

  const r3 = await runHandler({
    envOverrides: { BQ_MOCK_MODE: 'true' },
    query: { from: '2030-01-01', to: '2030-01-31' },
  });
  console.log(JSON.stringify({ case: 'GET mock out-of-range', status: r3.statusCode, body: r3.body }));
  expect('GET mock out-of-range -> 200', r3.statusCode === 200);
  expect(
    'GET mock out-of-range -> empty rows / orderCount=0',
    ((r3.body as { rows?: unknown[] })?.rows ?? []).length === 0 &&
      (r3.body as { summary?: { orderCount?: number } })?.summary?.orderCount === 0,
  );

  const r4 = await runHandler({
    envOverrides: { BQ_MOCK_MODE: 'true' },
    query: { from: 'not-a-date', to: '2026-04-07' },
  });
  console.log(JSON.stringify({ case: 'GET invalid date', status: r4.statusCode, body: r4.body }));
  expect('GET invalid date -> 400', r4.statusCode === 400);
  expect(
    'GET invalid date -> INVALID_DATE',
    (r4.body as { errorCode?: string })?.errorCode === 'INVALID_DATE',
  );

  const r5 = await runHandler({
    envOverrides: { BQ_MOCK_MODE: 'true' },
    query: { from: '2026-02-30', to: '2026-04-07' },
  });
  console.log(JSON.stringify({ case: 'GET non-existent date', status: r5.statusCode, body: r5.body }));
  expect('GET non-existent date -> 400', r5.statusCode === 400);
  expect(
    'GET non-existent date -> INVALID_DATE',
    (r5.body as { errorCode?: string })?.errorCode === 'INVALID_DATE',
  );

  const r6 = await runHandler({
    envOverrides: { BQ_MOCK_MODE: 'true' },
    query: { from: '2026-04-08', to: '2026-04-07' },
  });
  console.log(JSON.stringify({ case: 'GET invalid range', status: r6.statusCode, body: r6.body }));
  expect('GET invalid range -> 400', r6.statusCode === 400);
  expect(
    'GET invalid range -> INVALID_RANGE',
    (r6.body as { errorCode?: string })?.errorCode === 'INVALID_RANGE',
  );

  const r7 = await runHandler({
    envOverrides: { BQ_MOCK_MODE: 'true', MAX_QUERY_DAYS: '7' },
    query: { from: '2026-04-01', to: '2026-04-08' },
  });
  console.log(JSON.stringify({ case: 'GET range too long', status: r7.statusCode, body: r7.body }));
  expect('GET range too long -> 400', r7.statusCode === 400);
  expect(
    'GET range too long -> RANGE_TOO_LONG',
    (r7.body as { errorCode?: string })?.errorCode === 'RANGE_TOO_LONG',
  );

  const r8 = await runHandler({
    method: 'POST',
    envOverrides: { BQ_MOCK_MODE: 'true' },
  });
  console.log(JSON.stringify({ case: 'POST no-origin', status: r8.statusCode, body: r8.body }));
  expect('POST no-origin -> 405', r8.statusCode === 405);

  const r9 = await runHandler({
    origin: 'https://evil.example.com',
    envOverrides: { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: undefined },
  });
  console.log(
    JSON.stringify({
      case: 'GET denied origin',
      status: r9.statusCode,
      acao: r9.headers['access-control-allow-origin'] ?? null,
      body: r9.body,
    }),
  );
  expect('GET denied origin -> 403', r9.statusCode === 403);
  expect(
    'GET denied origin -> CORS_FORBIDDEN',
    (r9.body as { errorCode?: string })?.errorCode === 'CORS_FORBIDDEN',
  );
  expect(
    'GET denied origin -> no ACAO',
    r9.headers['access-control-allow-origin'] === undefined,
  );

  const r10 = await runHandler({
    origin: 'https://allowed.example.com',
    envOverrides: { BQ_MOCK_MODE: 'true', ALLOWED_ORIGINS: 'https://allowed.example.com' },
  });
  console.log(
    JSON.stringify({
      case: 'GET allowed origin',
      status: r10.statusCode,
      acao: r10.headers['access-control-allow-origin'] ?? null,
      body: r10.body,
    }),
  );
  expect('GET allowed origin -> 200', r10.statusCode === 200);
  expect(
    'GET allowed origin -> ACAO echoed',
    r10.headers['access-control-allow-origin'] === 'https://allowed.example.com',
  );

  const r11 = await runHandler({
    method: 'OPTIONS',
    origin: 'https://allowed.example.com',
    envOverrides: { ALLOWED_ORIGINS: 'https://allowed.example.com' },
  });
  console.log(
    JSON.stringify({
      case: 'OPTIONS allowed origin',
      status: r11.statusCode,
      acao: r11.headers['access-control-allow-origin'] ?? null,
    }),
  );
  expect('OPTIONS allowed origin -> 204', r11.statusCode === 204);
  expect(
    'OPTIONS allowed origin -> ACAO echoed',
    r11.headers['access-control-allow-origin'] === 'https://allowed.example.com',
  );

  const r12 = await runHandler({
    method: 'OPTIONS',
    origin: 'https://evil.example.com',
    envOverrides: { ALLOWED_ORIGINS: 'https://allowed.example.com' },
  });
  console.log(
    JSON.stringify({
      case: 'OPTIONS denied origin',
      status: r12.statusCode,
      acao: r12.headers['access-control-allow-origin'] ?? null,
    }),
  );
  expect('OPTIONS denied origin -> 403', r12.statusCode === 403);
  expect(
    'OPTIONS denied origin -> no ACAO',
    r12.headers['access-control-allow-origin'] === undefined,
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
