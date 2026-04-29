type Props = {
  score: number;
  max?: number;
};

export default function ScoreBar({ score, max = 100 }: Props) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const color =
    score >= 75
      ? "bg-emerald-500"
      : score >= 65
        ? "bg-amber-400"
        : "bg-rose-400";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
