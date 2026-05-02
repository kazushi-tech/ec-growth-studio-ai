import { Link } from "react-router-dom";
import type { Action } from "../../data/sample";

// 施策を「インパクト × 実行しやすさ」で配置する2軸マップ。
// - 縦軸: インパクト（高ほど上）
// - 横軸: 実行しやすさ（実行しやすい＝Effort 低が左）
// チャート依存を増やしたくないため、SVG 1枚で完結させている。

type Props = {
  actions: Action[];
  /** 表示する最大件数。混雑回避のため既定で 8 件まで。 */
  limit?: number;
};

const xByEffort = {
  低: 0.18,
  中: 0.5,
  高: 0.82,
} as const;

const yByImpact = {
  高: 0.22,
  中: 0.5,
  低: 0.78,
} as const;

const priorityFill = {
  P1: "#f43f5e",
  P2: "#f59e0b",
} as const;

const priorityRing = {
  P1: "ring-rose-100",
  P2: "ring-amber-100",
} as const;

const priorityChip = {
  P1: "bg-rose-50 text-rose-700",
  P2: "bg-amber-50 text-amber-700",
} as const;

export default function PriorityMap({ actions, limit = 8 }: Props) {
  // P1 を優先しつつ、表示件数を絞って混雑を避ける。
  const sorted = [...actions]
    .sort((a, b) => {
      if (a.priority === b.priority) return a.id - b.id;
      return a.priority === "P1" ? -1 : 1;
    })
    .slice(0, limit);

  // 同じセルで重なるとラベルが読みにくくなるので、cell 内で軽くずらす。
  const cellCount = new Map<string, number>();
  const placed = sorted.map((a) => {
    const cellKey = `${a.impact}-${a.effort}`;
    const n = cellCount.get(cellKey) ?? 0;
    cellCount.set(cellKey, n + 1);
    const baseX = xByEffort[a.effort];
    const baseY = yByImpact[a.impact];
    // 1セル内に最大3件想定の螺旋オフセット。
    const angle = n * 2.0;
    const radius = n === 0 ? 0 : 0.05 + n * 0.012;
    const x = Math.min(0.95, Math.max(0.05, baseX + Math.cos(angle) * radius));
    const y = Math.min(0.95, Math.max(0.05, baseY + Math.sin(angle) * radius));
    return { action: a, x, y };
  });

  // 凡例で件数を出すため、表示対象の P1 / P2 件数を集計。
  const p1Count = sorted.filter((a) => a.priority === "P1").length;
  const p2Count = sorted.filter((a) => a.priority === "P2").length;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <div className="relative">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="block h-[260px] w-full rounded-xl border border-slate-200 bg-white"
            role="img"
            aria-label="施策の優先度マップ。縦軸はインパクト、横軸は実行しやすさ。"
          >
            {/* 4象限の柔らかい塗り */}
            <rect x="0" y="0" width="50" height="50" fill="#ecfdf5" />
            <rect x="50" y="0" width="50" height="50" fill="#eff6ff" />
            <rect x="0" y="50" width="50" height="50" fill="#f8fafc" />
            <rect x="50" y="50" width="50" height="50" fill="#f5f5f4" />
            {/* 軸線 */}
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="#cbd5e1"
              strokeWidth="0.4"
              strokeDasharray="1.5 1.5"
            />
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="#cbd5e1"
              strokeWidth="0.4"
              strokeDasharray="1.5 1.5"
            />
            {/* 象限ラベル (装飾) */}
            <text
              x="3"
              y="6"
              fontSize="3.4"
              fill="#047857"
              fontWeight="600"
              aria-hidden="true"
            >
              Quick Win
            </text>
            <text
              x="97"
              y="6"
              fontSize="3.4"
              fill="#1d4ed8"
              fontWeight="600"
              textAnchor="end"
              aria-hidden="true"
            >
              戦略案件
            </text>
            <text
              x="3"
              y="97"
              fontSize="3.2"
              fill="#64748b"
              aria-hidden="true"
            >
              余力で実行
            </text>
            <text
              x="97"
              y="97"
              fontSize="3.2"
              fill="#94a3b8"
              textAnchor="end"
              aria-hidden="true"
            >
              再検討
            </text>

            {/* 施策ドット */}
            {placed.map(({ action, x, y }) => {
              const fill = priorityFill[action.priority];
              return (
                <g key={action.id}>
                  <title>
                    {`#${action.id} ${action.title} / インパクト${action.impact} × 実行${action.effort} / ${action.priority}`}
                  </title>
                  <circle
                    cx={x * 100}
                    cy={y * 100}
                    r="3.4"
                    fill={fill}
                    fillOpacity="0.85"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={x * 100}
                    y={y * 100 + 1.3}
                    fontSize="3"
                    fill="white"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {action.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 軸ラベル (HTML、a11y用に SVG とは別に明示) */}
          <div className="pointer-events-none mt-1 flex justify-between text-xs text-slate-500">
            <span>← 実行しやすい（工数 低）</span>
            <span>実行しにくい（工数 高） →</span>
          </div>
          <div
            className="pointer-events-none absolute left-[-6px] top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500"
            aria-hidden="true"
          >
            ← インパクト 高
          </div>
        </div>

        {/* 凡例 + 上位施策リスト */}
        <div className="space-y-2 text-xs">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <div className="text-xs font-semibold text-slate-700">
              凡例
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: priorityFill.P1 }}
                aria-hidden="true"
              />
              <span className="text-slate-700">
                P1（最優先・{p1Count}件）
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: priorityFill.P2 }}
                aria-hidden="true"
              />
              <span className="text-slate-700">P2（{p2Count}件）</span>
            </div>
          </div>
          <ul className="space-y-1">
            {placed
              .filter(({ action }) => action.priority === "P1")
              .slice(0, 4)
              .map(({ action }) => (
                <li
                  key={action.id}
                  className="flex items-start gap-1.5 leading-4"
                >
                  <span
                    className={`inline-flex h-4 min-w-[1.1rem] shrink-0 items-center justify-center rounded-full px-1 text-xs font-semibold ring-1 ${priorityChip[action.priority]} ${priorityRing[action.priority]}`}
                  >
                    {action.id}
                  </span>
                  <span className="text-slate-700">{action.title}</span>
                </li>
              ))}
          </ul>
          <Link
            to="/app/action-board"
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900"
          >
            施策ボードで詳細を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
