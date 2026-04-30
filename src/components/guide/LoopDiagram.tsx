import type { LoopDiagramNodeV2 } from "../../data/sample";
import { guideToneStyles } from "./tones";

type Props = {
  nodes: LoopDiagramNodeV2[];
  ariaLabel?: string;
};

/**
 * 4 ノードのループ図を SVG で描画する live infographic。
 * 重量級チャートライブラリは使わず、自前の <circle> + <path> で構築する。
 */
export default function LoopDiagram({
  nodes,
  ariaLabel = "AI診断 → 人間レビュー → 施策実行 → 月次報告 の月次運用ループ図",
}: Props) {
  // 4ノードを矩形配置 (top-left / top-right / bottom-right / bottom-left)
  const positions = [
    { cx: 110, cy: 70 },
    { cx: 350, cy: 70 },
    { cx: 350, cy: 230 },
    { cx: 110, cy: 230 },
  ];
  // 矢印 (時計回りに4本)
  const arrows = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 0 },
  ];

  const r = 48;

  return (
    <figure className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5">
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox="0 0 460 300"
        className="mx-auto block h-auto w-full max-w-[520px]"
      >
        <defs>
          <marker
            id="loop-arrow-head"
            markerWidth="10"
            markerHeight="10"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* 矢印 — 各エッジを 90度の弧で結ぶ */}
        {arrows.map(({ from, to }, i) => {
          const a = positions[from];
          const b = positions[to];
          // 端点は r 分内側に縮める
          const dx = b.cx - a.cx;
          const dy = b.cy - a.cy;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const sx = a.cx + ux * (r + 4);
          const sy = a.cy + uy * (r + 4);
          const ex = b.cx - ux * (r + 10);
          const ey = b.cy - uy * (r + 10);
          // 軽くカーブさせる
          const curve = 30;
          const mx = (sx + ex) / 2 + (uy * curve);
          const my = (sy + ey) / 2 - (ux * curve);
          return (
            <path
              key={i}
              d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
              stroke="#94a3b8"
              strokeWidth={1.6}
              fill="none"
              markerEnd="url(#loop-arrow-head)"
            />
          );
        })}

        {/* ノード */}
        {nodes.slice(0, 4).map((n, i) => {
          const pos = positions[i];
          const tone = guideToneStyles[n.tone];
          return (
            <g key={n.label}>
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={r}
                fill="#ffffff"
                stroke={tone.hex}
                strokeWidth={2}
              />
              <text
                x={pos.cx}
                y={pos.cy - 4}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fill={tone.hex}
              >
                {n.label}
              </text>
              <text
                x={pos.cx}
                y={pos.cy + 14}
                textAnchor="middle"
                fontSize="10"
                fill="#475569"
              >
                {n.sublabel}
              </text>
            </g>
          );
        })}

        {/* 中央のキャプション */}
        <text
          x="230"
          y="155"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#0b1e3f"
        >
          月次改善ループ
        </text>
        <text
          x="230"
          y="172"
          textAnchor="middle"
          fontSize="9"
          fill="#64748b"
        >
          毎月この4要素を1周する
        </text>
      </svg>
      <figcaption className="mt-3 text-xs leading-6 text-slate-600">
        AI が課題候補を量で出し、人間が採用と優先順位を決める。実行と効果検証を経て月次レポートで翌月会議へバトンする。
      </figcaption>
    </figure>
  );
}
