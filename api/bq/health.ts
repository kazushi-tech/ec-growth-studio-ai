import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BigQuery } from '@google-cloud/bigquery';
import {
  applyCors,
  jsonFailure,
  safeMessage,
  isMockMode,
  MOCK_PROJECT_ID,
  MOCK_LOCATION,
  DEFAULT_DATASET,
  MOCK_MESSAGE,
} from './_shared';

type ErrorCode =
  | 'CONFIG_MISSING'
  | 'CREDENTIALS_INVALID'
  | 'BQ_QUERY_FAILED'
  | 'DATASET_CHECK_FAILED'
  | 'METHOD_NOT_ALLOWED'
  | 'CORS_FORBIDDEN'
  | 'UNKNOWN';

type Mode = 'live' | 'mock';

interface HealthSuccess {
  ok: true;
  mode: Mode;
  projectId: string;
  dataset: string;
  location: string;
  datasetExists: boolean;
  checkedAt: string;
  latencyMs: number;
  message?: string;
}

function maskProjectId(id: string): string {
  if (id.length <= 6) return '***';
  return `${id.slice(0, 3)}***${id.slice(-3)}`;
}

/**
 * BigQuery SDK が投げる "Not Found" 相当のエラー（dataset が単純に存在しない）と、
 * 権限不足 / location 不一致 / ネットワーク失敗を区別する。
 *
 * smoke test から検証可能にするため export している。本番のユーザー向けエンドポイントで
 * 内部関数を露出させているわけではない。
 */
export function isNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: unknown; status?: unknown; message?: unknown };
  if (e.code === 404 || e.status === 404) return true;
  if (typeof e.code === 'string' && e.code.toUpperCase() === 'NOT_FOUND') return true;
  if (typeof e.message === 'string') {
    const msg = e.message.toLowerCase();
    if (msg.includes('not found') && !msg.includes('permission')) return true;
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { allowed } = applyCors(req, res);

    if (!allowed) {
      // OPTIONS preflight も含め、許可外 Origin には Access-Control-Allow-Origin を返さず
      // 403 で安全に失敗させる（fail closed）。
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

    const dataset = process.env.BQ_DATASET ?? DEFAULT_DATASET;

    // BQ_MOCK_MODE=true のときは GCP に接続しない。デモ用の固定 response を返す。
    // mode:"mock" と message を必ず含め、UI / docs 上で「実接続」と誤認されないようにする。
    if (isMockMode()) {
      const body: HealthSuccess = {
        ok: true,
        mode: 'mock',
        projectId: MOCK_PROJECT_ID,
        dataset,
        location: MOCK_LOCATION,
        datasetExists: true,
        checkedAt: new Date().toISOString(),
        latencyMs: 0,
        message: MOCK_MESSAGE,
      };
      res.status(200).json(body);
      return;
    }

    const projectId = process.env.GCP_PROJECT_ID;
    const credsB64 = process.env.GCP_SERVICE_ACCOUNT_JSON_BASE64;
    const location = process.env.BQ_LOCATION ?? 'asia-northeast1';

    if (!projectId || !credsB64) {
      jsonFailure(
        res,
        200,
        'CONFIG_MISSING' satisfies ErrorCode,
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
        'CREDENTIALS_INVALID' satisfies ErrorCode,
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

      let datasetExists: boolean;
      try {
        const [exists] = await bq.dataset(dataset).exists();
        datasetExists = exists;
      } catch (err) {
        // 404 / Not Found 相当のみ「存在しない」として扱い、それ以外（権限不足・
        // location 不一致・API 失敗）は明示的なエラーとして返す。
        if (isNotFoundError(err)) {
          datasetExists = false;
        } else {
          jsonFailure(res, 200, 'DATASET_CHECK_FAILED' satisfies ErrorCode, safeMessage(err));
          return;
        }
      }

      const latencyMs = Date.now() - startedAt;
      const body: HealthSuccess = {
        ok: true,
        mode: 'live',
        projectId: maskProjectId(projectId),
        dataset,
        location,
        datasetExists,
        checkedAt: new Date().toISOString(),
        latencyMs,
      };
      res.status(200).json(body);
    } catch (err) {
      jsonFailure(res, 200, 'BQ_QUERY_FAILED' satisfies ErrorCode, safeMessage(err));
    }
  } catch (err) {
    jsonFailure(res, 200, 'UNKNOWN' satisfies ErrorCode, safeMessage(err));
  }
}
