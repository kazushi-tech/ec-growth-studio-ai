import { useEffect, useRef, useState } from "react";
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
  Activity,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import {
  SIDEBAR_WIDTH_DEFAULT,
  SIDEBAR_WIDTH_MAX,
  SIDEBAR_WIDTH_MIN,
  SIDEBAR_WIDTH_STEP,
  useResizableSidebar,
} from "../../hooks/useResizableSidebar";

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
  { label: "売上要因分析", to: "/app/revenue-analysis", icon: Activity },
  { label: "データ取込", to: "/app/data-import", icon: Database },
  { label: "AI考察レポート", to: "/app/ai-report", icon: Sparkles },
  { label: "商品ページ改善", to: "/app/product-page", icon: FileEdit },
  { label: "施策ボード", to: "/app/action-board", icon: KanbanSquare },
  { label: "月次レポート", to: "/app/monthly-report", icon: FileBarChart2 },
  { label: "ガイド", to: "/app/guide", icon: BookOpen },
];

type Props = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: Props) {
  const { width, setWidth, resetWidth } = useResizableSidebar();
  const asideRef = useRef<HTMLElement>(null);
  const dragOffsetRef = useRef(0);
  const [isResizing, setIsResizing] = useState(false);

  // ドラッグ中だけ window に pointermove/up を貼る。
  // body の userSelect / cursor を一時的に上書きして、
  // テキスト選択や false な cursor 表示を抑える。
  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (event: PointerEvent) => {
      setWidth(event.clientX - dragOffsetRef.current);
    };
    const handleUp = () => {
      setIsResizing(false);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
    };
  }, [isResizing, setWidth]);

  const onHandlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // 左クリックのみ許容 (右/中クリックでドラッグ開始しない)。
    if (event.button !== 0) return;
    const aside = asideRef.current;
    if (!aside) return;
    event.preventDefault();
    dragOffsetRef.current = aside.getBoundingClientRect().left;
    setIsResizing(true);
  };

  const onHandleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = width - SIDEBAR_WIDTH_STEP;
        break;
      case "ArrowRight":
        next = width + SIDEBAR_WIDTH_STEP;
        break;
      case "Home":
        next = SIDEBAR_WIDTH_MIN;
        break;
      case "End":
        next = SIDEBAR_WIDTH_MAX;
        break;
      case "Enter":
        next = SIDEBAR_WIDTH_DEFAULT;
        break;
      default:
        return;
    }
    event.preventDefault();
    setWidth(next);
  };

  return (
    <aside
      ref={asideRef}
      style={{ width: `${width}px` }}
      className="relative hidden shrink-0 flex-col border-r border-navy-800/70 bg-navy-950 text-navy-100 lg:flex"
    >
      <SidebarBody onNavigate={onNavigate} />
      <div
        role="separator"
        aria-label="サイドバー幅を調整 (矢印キー: 16pxずつ / Home: 最小 / End: 最大 / Enter: 既定値)"
        aria-orientation="vertical"
        aria-valuemin={SIDEBAR_WIDTH_MIN}
        aria-valuemax={SIDEBAR_WIDTH_MAX}
        aria-valuenow={width}
        tabIndex={0}
        onPointerDown={onHandlePointerDown}
        onKeyDown={onHandleKeyDown}
        onDoubleClick={resetWidth}
        title="ドラッグ / 矢印キーで幅を調整。ダブルクリックで既定値に戻す"
        className={`group/handle absolute right-0 top-0 z-10 h-full w-1.5 cursor-ew-resize touch-none transition-colors duration-150 hover:bg-emerald-300/40 ${
          isResizing ? "bg-emerald-300/60" : ""
        }`}
      />
    </aside>
  );
}

export function SidebarBody({ onNavigate }: Props) {
  return (
    <div className="flex h-full flex-col">
      <NavLink
        to="/"
        onClick={onNavigate}
        aria-label="EC Growth Studio AI のトップへ戻る"
        className="flex items-center gap-2.5 px-5 py-5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500">
          <TrendingUp size={18} className="text-navy-950" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-white">EC Growth</div>
          <div className="text-[15px] font-semibold text-white">Studio AI</div>
        </div>
      </NavLink>

      <nav aria-label="主要画面" className="flex-1 space-y-0.5 px-3 pt-2">
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
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-navy-800/80 p-4">
        <div className="rounded-lg border border-navy-700 bg-navy-900/60 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
            <Crown size={14} aria-hidden="true" />
            プレミアムプラン
          </div>
          <p className="mt-1 text-[11px] text-navy-100">
            契約期間: 2026/12/31まで
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-navy-900/40 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-xs font-semibold text-navy-950">
            SG
          </div>
          <div className="leading-tight">
            <div className="text-sm text-white">Growth Team</div>
            <div className="text-[11px] text-navy-200">オーナー</div>
          </div>
        </div>
      </div>
    </div>
  );
}
