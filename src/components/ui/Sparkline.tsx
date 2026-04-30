type Props = {
  data: number[];
  color?: string;
  fill?: string;
  width?: number;
  height?: number;
  className?: string;
  /**
   * a11y: スパークラインの意味をスクリーンリーダーに伝えるためのラベル。
   * 指定された場合、SVG に `role="img"` + `aria-label` を付ける。
   * 装飾用途のときは未指定のままにし、SVG を `aria-hidden="true"` で読み飛ばす。
   */
  ariaLabel?: string;
};

export default function Sparkline({
  data,
  color = "#10b981",
  fill = "rgba(16, 185, 129, 0.10)",
  width = 220,
  height = 56,
  className,
  ariaLabel,
}: Props) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / Math.max(data.length - 1, 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path d={areaPath} fill={fill} />
      <path
        d={linePath}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.4} fill={color} />
    </svg>
  );
}
