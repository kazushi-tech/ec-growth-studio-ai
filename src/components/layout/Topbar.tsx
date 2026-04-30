import { ChevronDown, Store, Calendar, BadgeCheck, Menu } from "lucide-react";
import { useMobileNav } from "./mobileNavContext";

type TopbarProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  const { setOpen } = useMobileNav();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:flex-nowrap">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="メニューを開く"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={16} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[18px] font-semibold tracking-tight text-slate-900 sm:text-[20px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-disabled="true"
            disabled
            title="UIプロトタイプ — 店舗切替は未実装"
            className="btn-secondary px-3 py-1.5 text-xs cursor-not-allowed opacity-80"
          >
            <Store size={14} className="text-slate-500" aria-hidden="true" />
            <span className="hidden sm:inline">Sample Shopify Store</span>
            <span className="sm:hidden">Store</span>
            <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-disabled="true"
            disabled
            title="UIプロトタイプ — 期間切替は未実装"
            className="btn-secondary px-3 py-1.5 text-xs cursor-not-allowed opacity-80"
          >
            <Calendar size={14} className="text-slate-500" aria-hidden="true" />
            2026年4月
            <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
          </button>
          <span
            role="status"
            aria-label="月次BPaaS の運用ループを表すバッジ (UIプロトタイプ)"
            className="hidden items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 md:inline-flex"
          >
            <BadgeCheck size={14} aria-hidden="true" />
            月次BPaaSループ
          </span>
          {actions}
        </div>
      </div>
    </header>
  );
}
