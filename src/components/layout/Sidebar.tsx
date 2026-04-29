import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  FileEdit,
  Sparkles,
  KanbanSquare,
  FileBarChart2,
  Crown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

// MVPで実装済みの7画面のみを Sidebar に出す。
// 商品分析 / 広告・流入 / CRM・リピート / 在庫・SKU / 設定 は
// product-spec.md の「未実装範囲」に該当するため Sidebar からは隠す。
// 領域別の入口は当面ダッシュボードと施策ボードのフィルタ経由で提供する。
const navItems: NavItem[] = [
  { label: "ダッシュボード", to: "/app", icon: LayoutDashboard, end: true },
  { label: "データ取込", to: "/app/data-import", icon: Database },
  { label: "AI考察レポート", to: "/app/ai-report", icon: Sparkles },
  { label: "商品ページ改善", to: "/app/product-page", icon: FileEdit },
  { label: "施策ボード", to: "/app/action-board", icon: KanbanSquare },
  { label: "月次レポート", to: "/app/monthly-report", icon: FileBarChart2 },
];

type Props = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: Props) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-800/70 bg-navy-950 text-navy-100 lg:flex">
      <SidebarBody onNavigate={onNavigate} />
    </aside>
  );
}

export function SidebarBody({ onNavigate }: Props) {
  return (
    <div className="flex h-full flex-col">
      <NavLink
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500">
          <TrendingUp size={18} className="text-navy-950" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-white">EC Growth</div>
          <div className="text-[15px] font-semibold text-white">Studio AI</div>
        </div>
      </NavLink>

      <nav className="flex-1 space-y-0.5 px-3 pt-2">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-navy-800/80 p-4">
        <div className="rounded-lg border border-navy-700 bg-navy-900/60 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <Crown size={14} />
            プレミアムプラン
          </div>
          <p className="mt-1 text-[11px] text-navy-200">
            契約期間: 2026/12/31まで
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-navy-900/40 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-xs font-semibold text-navy-950">
            SG
          </div>
          <div className="leading-tight">
            <div className="text-sm text-white">Growth Team</div>
            <div className="text-[11px] text-navy-300">オーナー</div>
          </div>
        </div>
      </div>
    </div>
  );
}
