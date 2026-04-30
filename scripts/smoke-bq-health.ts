/**
 * Smoke test for /api/bq/health.
 * Invokes the handler directly with a mock VercelRequest / VercelResponse.
 *
 * Usage:
 *   npx tsx scripts/smoke-bq-health.ts
 *
 * Asserts only the "config missing" path so it is safe to run without GCP creds.
 */
import handler from '../api/bq/health';

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

async function run() {
  // Force env-missing path so we never hit GCP from this smoke test.
  delete process.env.GCP_PROJECT_ID;
  delete process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64;

  const cases: Array<{ name: string; method: string; origin?: string }> = [
    { name: 'GET no-creds', method: 'GET' },
    { name: 'OPTIONS preflight', method: 'OPTIONS', origin: 'https://example.com' },
    { name: 'POST not allowed', method: 'POST' },
  ];

  let ok = true;
  for (const c of cases) {
    const req = makeReq(c.method, c.origin);
    const res = makeRes();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await handler(req as any, res as any);
    const summary = {
      case: c.name,
      status: res.statusCode,
      bodyKeys: res.body && typeof res.body === 'object' ? Object.keys(res.body) : null,
      ok: res.body && typeof res.body === 'object' ? (res.body as { ok?: unknown }).ok : null,
    };
    console.log(JSON.stringify(summary));

    if (c.name === 'GET no-creds') {
      const body = res.body as { ok?: boolean; errorCode?: string };
      if (body?.ok !== false || body?.errorCode !== 'CONFIG_MISSING') {
        console.error('FAIL: expected ok=false / errorCode=CONFIG_MISSING');
        ok = false;
      }
    }
    if (c.name === 'OPTIONS preflight' && res.statusCode !== 204) {
      console.error('FAIL: expected 204 on OPTIONS');
      ok = false;
    }
    if (c.name === 'POST not allowed' && res.statusCode !== 405) {
      console.error('FAIL: expected 405 on POST');
      ok = false;
    }

    // Sensitive content must never leak in any case.
    const serialized = JSON.stringify(res.body ?? '');
    if (
      serialized.includes('private_key') ||
      serialized.includes('BEGIN PRIVATE KEY') ||
      serialized.includes('client_email')
    ) {
      console.error('FAIL: response body leaked credential-shaped content');
      ok = false;
    }
  }

  if (!ok) {
    process.exit(1);
  }
  console.log('smoke test OK');
}

void run().catch((e) => {
  console.error('smoke test crashed:', e);
  process.exit(1);
});
