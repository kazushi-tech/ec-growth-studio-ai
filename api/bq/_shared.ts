/**
 * 共通ユーティリティ for `/api/bq/*` Vercel Functions.
 *
 * 設計方針:
 * - フロントから SQL 文字列は受け取らない。サーバー側で固定クエリ＋パラメータバリデーションのみ
 * - CORS は fail-closed（許可外 Origin は ACAO ヘッダを付けず 403）
 * - 認証情報は一切ログに出さない（safeMessage で機微情報を除去）
 * - BQ_MOCK_MODE=true の場合は GCP に一切接続せず、mock response を返す
 *
 * 追加抽象化はしない。読みやすくなる範囲でのみ共通化する。
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SECRET_KEY_HINTS = ['private_key', 'client_email', 'client_id', 'private_key_id'];

export function sanitizeMessage(raw: string): string {
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

export function safeMessage(err: unknown): string {
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

/**
 * fail-closed CORS:
 * - Origin ヘッダなし: same-origin / curl / サーバー間呼び出しと見なし許可（CORS ヘッダは付けない）
 * - Origin あり + ALLOWED_ORIGINS に含まれる: 許可（Access-Control-Allow-Origin を返す）
 * - Origin あり + ALLOWED_ORIGINS 未設定 or 不一致: 拒否（CORS ヘッダを一切付けない）
 */
export function applyCors(
  req: VercelRequest,
  res: VercelResponse,
): { allowed: boolean; origin: string } {
  const origin = (req.headers.origin as string | undefined) ?? '';
  const allowedList = parseAllowedOrigins();

  res.setHeader('Cache-Control', 'no-store');

  if (origin === '') {
    return { allowed: true, origin };
  }

  const matched = allowedList.includes(origin);
  if (!matched) {
    return { allowed: false, origin };
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '300');
  return { allowed: true, origin };
}

export function jsonFailure(
  res: VercelResponse,
  status: number,
  errorCode: string,
  message: string,
): void {
  res.status(status).json({
    ok: false,
    errorCode,
    message,
    checkedAt: new Date().toISOString(),
  });
}

/**
 * BQ_MOCK_MODE=true のとき、GCP には一切接続せず demo response を返す分岐に入る。
 * 値は文字列比較のみ（"1" / "true" / "TRUE" を許可）。それ以外は false。
 */
export function isMockMode(): boolean {
  const v = (process.env.BQ_MOCK_MODE ?? '').trim().toLowerCase();
  return v === 'true' || v === '1';
}

export const MOCK_PROJECT_ID = 'mock-project';
export const MOCK_LOCATION = 'mock';
export const DEFAULT_DATASET = 'ec_growth_demo';
export const MOCK_MESSAGE = 'BigQuery demo mode. No GCP connection was made.';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** YYYY-MM-DD の妥当な日付かどうか。例えば 2026-02-30 のような不正値は弾く。 */
export function isValidIsoDate(s: string | undefined | null): s is string {
  if (typeof s !== 'string') return false;
  if (!ISO_DATE_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map((p) => Number.parseInt(p, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return false;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
  );
}

/** UTC で 2 つの ISO 日付の差分を日数で返す（from <= to の場合は >= 0）。 */
export function diffInDays(fromIso: string, toIso: string): number {
  const f = Date.UTC(
    Number.parseInt(fromIso.slice(0, 4), 10),
    Number.parseInt(fromIso.slice(5, 7), 10) - 1,
    Number.parseInt(fromIso.slice(8, 10), 10),
  );
  const t = Date.UTC(
    Number.parseInt(toIso.slice(0, 4), 10),
    Number.parseInt(toIso.slice(5, 7), 10) - 1,
    Number.parseInt(toIso.slice(8, 10), 10),
  );
  return Math.round((t - f) / 86400000);
}

export const DEFAULT_MAX_QUERY_DAYS = 370;

export function getMaxQueryDays(): number {
  const raw = process.env.MAX_QUERY_DAYS;
  if (!raw) return DEFAULT_MAX_QUERY_DAYS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_MAX_QUERY_DAYS;
  return n;
}
