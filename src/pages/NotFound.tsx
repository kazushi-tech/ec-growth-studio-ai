import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
      <div>
        <div className="text-sm font-semibold text-emerald-600">404</div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-950">
          ページが見つかりません
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          URLをご確認いただくか、ダッシュボードへお戻りください。
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Link to="/" className="btn-secondary text-sm">
            LPへ戻る
          </Link>
          <Link to="/app" className="btn-primary text-sm">
            ダッシュボードへ
          </Link>
        </div>
      </div>
    </div>
  );
}
