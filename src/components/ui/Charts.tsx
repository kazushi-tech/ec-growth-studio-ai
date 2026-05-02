import type { ReactNode } from "react";

export type ChartDatum = {
  label: string;
  value: number;
  compare?: number;
};

export type ChartSeries = {
  name: string;
  values: number[];
  color?: string;
};

export type DistributionDatum = {
  label: string;
  value: number;
  color?: string;
};

const chartColors = {
  navy: "#0b1f3a",
  slate: "#64748b",
  sky: "#0284c7",
  rose: "#e11d48",
  amber: "#d97706",
  grid: "#e2e8f0",
  panel: "#f8fafc",
};

function range(values: number[]) {
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  return { min, max, span: max - min || 1 };
}

function fmt(value: number, unit = "") {
  return `${value.toLocaleString("ja-JP")}${unit}`;
}

export function ChartFrame({
  title,
  subtitle,
  legend,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  legend?: { label: string; color?: string }[];
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {legend?.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color ?? chartColors.navy }}
              />
              {item.label}
            </span>
          ))}
          {action}
        </div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function LineChart({
  series,
  labels,
  height = 260,
  unit = "",
  ariaLabel,
}: {
  series: ChartSeries[];
  labels?: string[];
  height?: number;
  unit?: string;
  ariaLabel: string;
}) {
  const width = 720;
  const pad = { top: 18, right: 20, bottom: 34, left: 48 };
  const values = series.flatMap((s) => s.values);
  const { min, max, span } = range(values);
  const xStep = (width - pad.left - pad.right) / Math.max(1, (series[0]?.values.length ?? 1) - 1);
  const y = (v: number) => pad.top + (max - v) / span * (height - pad.top - pad.bottom);
  const x = (i: number) => pad.left + i * xStep;
  const ticks = [0, 0.5, 1].map((r) => Math.round(min + span * r));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[260px] w-full"
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="none"
    >
      <rect x="0" y="0" width={width} height={height} fill="white" />
      {ticks.map((tick) => {
        const yy = y(tick);
        return (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={yy} y2={yy} stroke={chartColors.grid} strokeWidth="1" />
            <text x={pad.left - 10} y={yy + 4} textAnchor="end" fontSize="12" fill={chartColors.slate}>
              {fmt(tick, unit)}
            </text>
          </g>
        );
      })}
      {series.map((s, si) => {
        const points = s.values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
        const color = s.color ?? (si === 0 ? chartColors.navy : chartColors.sky);
        const area =
          si === 0
            ? `${s.values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")} L ${x(s.values.length - 1).toFixed(1)} ${height - pad.bottom} L ${pad.left} ${height - pad.bottom} Z`
            : "";
        return (
          <g key={s.name}>
            {area && <path d={area} fill={color} opacity="0.08" />}
            <polyline points={points} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            {s.values.map((v, i) => i === s.values.length - 1 ? (
              <circle key={i} cx={x(i)} cy={y(v)} r="4" fill={color} />
            ) : null)}
          </g>
        );
      })}
      {(labels ?? []).map((label, i) => {
        if (i % Math.ceil((labels?.length ?? 1) / 6) !== 0 && i !== (labels?.length ?? 1) - 1) return null;
        return (
          <text key={label} x={x(i)} y={height - 10} textAnchor="middle" fontSize="12" fill={chartColors.slate}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function BarChart({
  data,
  height = 260,
  unit = "",
  ariaLabel,
}: {
  data: ChartDatum[];
  height?: number;
  unit?: string;
  ariaLabel: string;
}) {
  const width = 720;
  const pad = { top: 18, right: 20, bottom: 44, left: 48 };
  const max = Math.max(...data.flatMap((d) => [d.value, d.compare ?? 0]), 1);
  const slot = (width - pad.left - pad.right) / data.length;
  const barW = Math.min(34, slot * 0.32);
  const y = (v: number) => pad.top + (max - v) / max * (height - pad.top - pad.bottom);
  const base = height - pad.bottom;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full" role="img" aria-label={ariaLabel} preserveAspectRatio="none">
      <rect width={width} height={height} fill="white" />
      {[0, 0.5, 1].map((r) => {
        const value = Math.round(max * r);
        const yy = y(value);
        return (
          <g key={r}>
            <line x1={pad.left} x2={width - pad.right} y1={yy} y2={yy} stroke={chartColors.grid} />
            <text x={pad.left - 10} y={yy + 4} textAnchor="end" fontSize="12" fill={chartColors.slate}>
              {fmt(value, unit)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const cx = pad.left + slot * i + slot / 2;
        return (
          <g key={d.label}>
            {typeof d.compare === "number" && (
              <rect x={cx - barW - 3} y={y(d.compare)} width={barW} height={base - y(d.compare)} rx="4" fill={chartColors.grid} />
            )}
            <rect x={cx + (typeof d.compare === "number" ? 3 : -barW / 2)} y={y(d.value)} width={barW} height={base - y(d.value)} rx="4" fill={chartColors.navy} />
            <text x={cx} y={height - 18} textAnchor="middle" fontSize="12" fill={chartColors.slate}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HorizontalBarChart({
  data,
  unit = "",
  ariaLabel,
}: {
  data: DistributionDatum[];
  unit?: string;
  ariaLabel: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div role="img" aria-label={ariaLabel} className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[minmax(110px,180px)_1fr_auto] items-center gap-3 text-sm">
          <div className="truncate font-medium text-slate-700">{d.label}</div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(3, (d.value / max) * 100)}%`,
                backgroundColor: d.color ?? chartColors.navy,
              }}
            />
          </div>
          <div className="w-20 text-right font-semibold text-slate-900">{fmt(d.value, unit)}</div>
        </div>
      ))}
    </div>
  );
}

export function StackedBar({
  data,
  ariaLabel,
}: {
  data: DistributionDatum[];
  ariaLabel: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="flex h-6 overflow-hidden rounded-full bg-slate-100">
        {data.map((d) => (
          <div
            key={d.label}
            title={`${d.label}: ${d.value}`}
            style={{
              width: `${(d.value / total) * 100}%`,
              backgroundColor: d.color ?? chartColors.slate,
            }}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex min-w-0 items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color ?? chartColors.slate }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="font-semibold text-slate-900">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  data,
  ariaLabel,
}: {
  data: DistributionDatum[];
  ariaLabel: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let acc = 0;
  const gradient = data
    .map((d) => {
      const start = (acc / total) * 100;
      acc += d.value;
      const end = (acc / total) * 100;
      return `${d.color ?? chartColors.slate} ${start}% ${end}%`;
    })
    .join(", ");
  return (
    <div className="grid items-center gap-5 sm:grid-cols-[180px_1fr]">
      <div
        role="img"
        aria-label={ariaLabel}
        className="mx-auto h-40 w-40 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full p-8">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
            <div>
              <div className="text-2xl font-semibold text-slate-900">{total}</div>
              <div className="text-sm text-slate-500">合計</div>
            </div>
          </div>
        </div>
      </div>
      <StackedBar data={data} ariaLabel={`${ariaLabel} の内訳`} />
    </div>
  );
}

export function WaterfallChart({
  start,
  end,
  steps,
  unit = "",
  ariaLabel,
}: {
  start: { label: string; value: number };
  end: { label: string; value: number };
  steps: ChartDatum[];
  unit?: string;
  ariaLabel: string;
}) {
  const width = 720;
  const height = 260;
  const pad = { top: 20, right: 20, bottom: 44, left: 56 };
  const cumulative: { label: string; from: number; to: number; delta?: number }[] = [
    { label: start.label, from: 0, to: start.value },
  ];
  let cursor = start.value;
  for (const step of steps) {
    const from = cursor;
    cursor += step.value;
    cumulative.push({ label: step.label, from, to: cursor, delta: step.value });
  }
  cumulative.push({ label: end.label, from: 0, to: end.value });
  const all = cumulative.flatMap((d) => [d.from, d.to]);
  const min = Math.min(...all, 0);
  const max = Math.max(...all, 1);
  const span = max - min || 1;
  const y = (v: number) => pad.top + (max - v) / span * (height - pad.top - pad.bottom);
  const slot = (width - pad.left - pad.right) / cumulative.length;
  const barW = Math.min(56, slot * 0.52);
  const zero = y(0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full" role="img" aria-label={ariaLabel} preserveAspectRatio="none">
      <rect width={width} height={height} fill="white" />
      <line x1={pad.left} x2={width - pad.right} y1={zero} y2={zero} stroke={chartColors.grid} />
      {cumulative.map((d, i) => {
        const x = pad.left + slot * i + slot / 2 - barW / 2;
        const top = Math.min(y(d.from), y(d.to));
        const h = Math.max(4, Math.abs(y(d.from) - y(d.to)));
        const fill = d.delta === undefined ? chartColors.navy : d.to >= d.from ? chartColors.sky : chartColors.rose;
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={top} width={barW} height={h} rx="5" fill={fill} opacity={d.delta === undefined ? 1 : 0.88} />
            <text x={x + barW / 2} y={height - 18} textAnchor="middle" fontSize="12" fill={chartColors.slate}>
              {d.label}
            </text>
            <text x={x + barW / 2} y={top - 6} textAnchor="middle" fontSize="12" fill={chartColors.slate}>
              {d.delta === undefined ? fmt(d.to, unit) : `${d.delta > 0 ? "+" : ""}${fmt(d.delta, unit)}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export const chartPalette = chartColors;
