import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BigQuery } from '@google-cloud/bigquery';

type ErrorCode =
  | 'CONFIG_MISSING'
  | 'CREDENTIALS_INVALID'
  | 'BQ_QUERY_FAILED'
  | 'METHOD_NOT_ALLOWED'
  | 'CORS_FORBIDDEN'
  | 'UNKNOWN';

interface HealthSuccess {
  ok: true;
  projectId: string;
  dataset: string;
  location: string;
  datasetExists: boolean;
  checkedAt: string;
  latencyMs: number;
}

interface HealthFailure {
  ok: false;
  errorCode: ErrorCode;
  message: string;
  checkedAt: string;
}

const SECRET_KEY_HINTS = ['private_key', 'client_email', 'client_id', 'private_key_id'];

function maskProjectId(id: string): string {
  if (id.length <= 6) return '***';
  return `${id.slice(0, 3)}***${id.slice(-3)}`;
}

function sanitizeMessage(raw: string): string {
  let msg = raw;
  for (const key of SECRET_KEY_HINTS) {
    const re = new RegExp(`${key}\\s*[:=]\\s*"[^"]*"`, 'gi');
    msg = msg.replace(re, `${key}:"[REDACTED]"`);
  }
  msg = msg.replace(/-----BEGIN[^-]+-----[\s\S]*?-----END[^-]+-----/g, '[REDACTED_PEM]');
  msg = msg.replace(/eyJ[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/g, '[REDACTED_JWT]');
  if (msg.length > 500) msg = `${msg.slice(0, 500)}...`;
  return msg;
}

function safeMessage(err: unknown): string {
  if (err instanceof Error) return sanitizeMessage(err.message);
  if (typeof err === 'string') return sanitizeMessage(err);
  return 'Unknown error';
}

function parseAllowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function applyCors(req: VercelRequest, res: VercelResponse): { allowed: boolean; origin: string } {
  const origin = (req.headers.origin as string | undefined) ?? '';
  const allowedList = parseAllowedOrigins();
  const allowed = origin === '' || allowedList.length === 0 || allowedList.includes(origin);
  if (allowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '300');
  res.setHeader('Cache-Control', 'no-store');
  return { allowed, origin };
}

function jsonFailure(
  res: VercelResponse,
  status: number,
  errorCode: ErrorCode,
  message: string,
): void {
  const body: HealthFailure = {
    ok: false,
    errorCode,
    message,
    checkedAt: new Date().toISOString(),
  };
  res.status(status).json(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { allowed } = applyCors(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (!allowed) {
      jsonFailure(res, 403, 'CORS_FORBIDDEN', 'Origin is not allowed');
      return;
    }

    if (req.method !== 'GET') {
      jsonFailure(res, 405, 'METHOD_NOT_ALLOWED', 'Only GET is allowed');
      return;
    }

    const projectId = process.env.GCP_PROJECT_ID;
    const credsB64 = process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64;
    const dataset = process.env.BQ_DATASET ?? 'ec_growth_demo';
    const location = process.env.BQ_LOCATION ?? 'asia-northeast1';

    if (!projectId || !credsB64) {
      jsonFailure(
        res,
        200,
        'CONFIG_MISSING',
        'Server is missing required env vars (GCP_PROJECT_ID / GCP_SERVICE_ACCOUNT_JSON_BASE64).',
      );
      return;
    }

    let clientEmail: string;
    let privateKey: string;
    try {
      const json = Buffer.from(credsB64, 'base64').toString('utf-8');
      const parsed = JSON.parse(json) as { client_email?: unknown; private_key?: unknown };
      if (typeof parsed.client_email !== 'string' || typeof parsed.private_key !== 'string') {
        throw new Error('service account JSON is missing required fields');
      }
      clientEmail = parsed.client_email;
      privateKey = parsed.private_key;
    } catch {
      jsonFailure(
        res,
        200,
        'CREDENTIALS_INVALID',
        'GCP_SERVICE_ACCOUNT_JSON_BASE64 is not a valid base64-encoded service account JSON',
      );
      return;
    }

    const startedAt = Date.now();

    try {
      const bq = new BigQuery({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        location,
      });

      await bq.query({ query: 'SELECT 1 AS ok', location });

      let datasetExists = false;
      try {
        const [exists] = await bq.dataset(dataset).exists();
        datasetExists = exists;
      } catch {
        datasetExists = false;
      }

      const latencyMs = Date.now() - startedAt;
      const body: HealthSuccess = {
        ok: true,
        projectId: maskProjectId(projectId),
        dataset,
        location,
        datasetExists,
        checkedAt: new Date().toISOString(),
        latencyMs,
      };
      res.status(200).json(body);
    } catch (err) {
      jsonFailure(res, 200, 'BQ_QUERY_FAILED', safeMessage(err));
    }
  } catch (err) {
    jsonFailure(res, 200, 'UNKNOWN', safeMessage(err));
  }
}
