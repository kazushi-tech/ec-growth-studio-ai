/**
 * Smoke test for /api/bq/health.
 * Invokes the handler directly with a mock VercelRequest / VercelResponse.
 *
 * Usage:
 *   npx tsx scripts/smoke-bq-health.ts
 *
 * 実 GCP に接続するケースは扱わない。CONFIG_MISSING / CORS / OPTIONS / method
 * 周りの分岐と、isNotFoundError の判定ロジックのみを検証する。
 */
import handler, { isNotFoundError } from '../api/bq/health';

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

function makeReq(method: string, origin?: string) {
  return {
    method,
    headers: origin ? { origin } : {},
    query: {},
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
  envOverrides: Record<string, string | undefined>,
) {
  const before: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(envOverrides)) {
    before[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const req = makeReq(method, origin);
  const res = makeRes();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await handler(req as any, res as any);
  for (const [k, v] of Object.entries(before)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return res;
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
  // ---------- 既存ケース ----------
  const r1 = await runHandler('GET', undefined, {
    GCP_PROJECT_ID: undefined,
    GCP_SERVICE_ACCOUNT_JSON_BASE64: undefined,
    ALLOWED_ORIGINS: undefined,
    BQ_MOCK_MODE: undefined,
  });
  console.log(JSON.stringify({ case: 'GET no-creds', status: r1.statusCode, body: r1.body }));
  expect('GET no-creds → 200', r1.statusCode === 200);
  expect(
    'GET no-creds → ok:false / CONFIG_MISSING',
    (r1.body as { ok?: boolean; errorCode?: string })?.ok === false &&
      (r1.body as { errorCode?: string })?.errorCode === 'CONFIG_MISSING',
  );
  expect('GET no-creds → no secret leak', !leaksSecret(r1.body));

  // ---------- BQ_MOCK_MODE=true: GCP 認証なしでも ok:true / mode:"mock" ----------
  const rMock = await runHandler('GET', undefined, {
    GCP_PROJECT_ID: undefined,
    GCP_SERVICE_ACCOUNT_JSON_BASE64: undefined,
    ALLOWED_ORIGINS: undefined,
    BQ_MOCK_MODE: 'true',
  });
  console.log(JSON.stringify({ case: 'GET mock-mode', status: rMock.statusCode, body: rMock.body }));
  expect('mock-mode → 200', rMock.statusCode === 200);
  expect(
    'mock-mode → ok:true',
    (rMock.body as { ok?: boolean })?.ok === true,
  );
  expect(
    'mock-mode → mode:"mock"',
    (rMock.body as { mode?: string })?.mode === 'mock',
  );
  expect(
    'mock-mode → projectId masked as "mock-project"',
    (rMock.body as { projectId?: string })?.projectId === 'mock-project',
  );
  expect(
    'mock-mode → location:"mock"',
    (rMock.body as { location?: string })?.location === 'mock',
  );
  expect(
    'mock-mode → message mentions demo/no-connection',
    typeof (rMock.body as { message?: string })?.message === 'string' &&
      ((rMock.body as { message?: string }).message ?? '').toLowerCase().includes('demo'),
  );
  expect('mock-mode → no secret leak', !leaksSecret(rMock.body));

  // ---------- POST 拒否（Origin なし = same-origin 扱いで通過 → 405） ----------
  const r2 = await runHandler('POST', undefined, { ALLOWED_ORIGINS: undefined });
  console.log(JSON.stringify({ case: 'POST no-origin', status: r2.statusCode, body: r2.body }));
  expect('POST no-origin → 405', r2.statusCode === 405);

  // ---------- OPTIONS preflight (許可 Origin) ----------
  const r3 = await runHandler('OPTIONS', 'https://allowed.example.com', {
    ALLOWED_ORIGINS: 'https://allowed.example.com',
  });
  console.log(
    JSON.stringify({
      case: 'OPTIONS allowed-origin',
      status: r3.statusCode,
      acao: r3.headers['access-control-allow-origin'],
    }),
  );
  expect('OPTIONS allowed → 204', r3.statusCode === 204);
  expect(
    'OPTIONS allowed → ACAO echoed',
    r3.headers['access-control-allow-origin'] === 'https://allowed.example.com',
  );

  // ---------- CORS fail-closed: ALLOWED_ORIGINS 未設定 + Origin あり ----------
  const r4 = await runHandler('GET', 'https://evil.example.com', {
    ALLOWED_ORIGINS: undefined,
  });
  console.log(
    JSON.stringify({
      case: 'GET origin-set + ALLOWED_ORIGINS empty',
      status: r4.statusCode,
      acao: r4.headers['access-control-allow-origin'] ?? null,
      body: r4.body,
    }),
  );
  expect('CORS empty + origin → 403', r4.statusCode === 403);
  expect(
    'CORS empty + origin → CORS_FORBIDDEN',
    (r4.body as { errorCode?: string })?.errorCode === 'CORS_FORBIDDEN',
  );
  expect(
    'CORS empty + origin → no Access-Control-Allow-Origin header',
    r4.headers['access-control-allow-origin'] === undefined,
  );

  // ---------- CORS fail-closed: 許可外 Origin の OPTIONS ----------
  const r5 = await runHandler('OPTIONS', 'https://evil.example.com', {
    ALLOWED_ORIGINS: 'https://allowed.example.com',
  });
  console.log(
    JSON.stringify({
      case: 'OPTIONS denied-origin',
      status: r5.statusCode,
      acao: r5.headers['access-control-allow-origin'] ?? null,
    }),
  );
  expect('OPTIONS denied → 403', r5.statusCode === 403);
  expect(
    'OPTIONS denied → no ACAO header',
    r5.headers['access-control-allow-origin'] === undefined,
  );

  // ---------- CORS fail-closed: 許可外 Origin の GET ----------
  const r6 = await runHandler('GET', 'https://evil.example.com', {
    ALLOWED_ORIGINS: 'https://allowed.example.com',
  });
  console.log(
    JSON.stringify({
      case: 'GET denied-origin',
      status: r6.statusCode,
      body: r6.body,
    }),
  );
  expect('GET denied → 403', r6.statusCode === 403);
  expect(
    'GET denied → CORS_FORBIDDEN',
    (r6.body as { errorCode?: string })?.errorCode === 'CORS_FORBIDDEN',
  );

  // ---------- isNotFoundError 単体検証 ----------
  expect(
    'isNotFoundError: code=404',
    isNotFoundError({ code: 404, message: 'Not found: Dataset xxx' }) === true,
  );
  expect(
    'isNotFoundError: code="NOT_FOUND"',
    isNotFoundError({ code: 'NOT_FOUND', message: 'Not found' }) === true,
  );
  expect(
    'isNotFoundError: message has "not found"',
    isNotFoundError({ message: 'Not found: Dataset ec_growth_demo' }) === true,
  );
  expect(
    'isNotFoundError: 403 permission denied → false',
    isNotFoundError({ code: 403, message: 'Permission denied on dataset' }) === false,
  );
  expect(
    'isNotFoundError: 401 invalid creds → false',
    isNotFoundError({ code: 401, message: 'invalid_grant' }) === false,
  );
  expect(
    'isNotFoundError: ENOTFOUND network → false (message mentions "permission" filter is not relevant; ensure not falsely true)',
    isNotFoundError({ code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND' }) === false,
  );
  expect(
    'isNotFoundError: location mismatch → false',
    isNotFoundError({
      code: 400,
      message: 'Dataset is in location US, but query was in asia-northeast1',
    }) === false,
  );
  expect(
    'isNotFoundError: "not found" + permission → false (permission を優先)',
    isNotFoundError({ message: 'Resource not found or permission denied' }) === false,
  );
  expect('isNotFoundError: undefined → false', isNotFoundError(undefined) === false);
  expect('isNotFoundError: null → false', isNotFoundError(null) === false);

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
