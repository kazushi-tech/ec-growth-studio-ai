import {
  Search,
  ChevronDown,
  Plus,
  Sparkles,
  Filter,
  KanbanSquare,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  CalendarClock,
  User,
  MessageSquare,
  Target,
  Users,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill, { priorityTone, statusTone } from "../components/ui/Pill";
import Sparkline from "../components/ui/Sparkline";
import { actions, monthlyStats } from "../data/sample";
import type { Action } from "../data/sample";

type ColumnKey = Action["status"];

const columns: { key: ColumnKey; tone: string; bar: string }[] = [
  { key: "未着手", tone: "border-slate-200 bg-slate-50/60", bar: "bg-slate-300" },
  { key: "進行中", tone: "border-sky-200 bg-sky-50/40", bar: "bg-sky-400" },
  { key: "レビュー中", tone: "border-amber-200 bg-amber-50/30", bar: "bg-amber-400" },
  { key: "実装済み", tone: "border-emerald-200 bg-emerald-50/40", bar: "bg-emerald-400" },
  { key: "効果検証中", tone: "border-violet-200 bg-violet-50/30", bar: "bg-violet-400" },
];

const filters = [
  "すべて",
  "商品ページ",
  "広告",
  "CRM",
  "在庫",
  "分析",
  "P1",
  "P2",
  "担当者",
];

const summary = [
  { l: "今月の施策数", v: monthlyStats.totalActions, d: "前月比 +4件" },
  { l: "完了", v: monthlyStats.done, d: "前月比 +2件" },
  { l: "進行中", v: monthlyStats.inProgress, d: "前月比 +1件" },
  { l: "レビュー中", v: monthlyStats.review, d: "前月比 ±0件" },
  { l: "想定売上インパクト", v: monthlyStats.expectedSalesLift, d: "前月比 +¥350,000" },
];

export default function ActionBoard() {
  const grouped = columns.map((c) => ({
    ...c,
    items: actions.filter((a) => a.status === c.key),
  }));

  const ownerLoad = Object.entries(
    actions.reduce<Record<string, number>>((acc, a) => {
      acc[a.owner] = (acc[a.owner] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([owner, count]) => ({ owner, count }))
    .sort((a, b) => b.count - a.count);

  const reviewQueue = actions.filter(
    (a) => a.status === "レビュー中" || a.reviewComment,
  );

  const p1Count = actions.filter((a) => a.priority === "P1").length;
  const p2Count = actions.filter((a) => a.priority === "P2").length;

  return (
    <>
      <Topbar
        title="施策ボード"
        subtitle="AI提案を実行・進捗管理・効果検証まで回す月次改善オペレーション"
        actions={
          <>
            <button className="btn-primary px-3 py-1.5 text-xs">
              <Sparkles size={12} /> AI考察から施策生成
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              月次レポートに反映
            </button>
          </>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* Summary */}
        <SectionCard title="施策サマリー" icon={<KanbanSquare size={16} />}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {summary.map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-slate-100 bg-white p-3"
              >
                <div className="text-[11px] text-slate-500">{s.l}</div>
                <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {s.v}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-500">{s.d}</div>
              </div>
            ))}
            <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-3 md:col-span-3 xl:col-span-1">
              <div className="text-[11px] text-slate-500">今月の完了目標</div>
              <div className="text-2xl font-bold text-slate-900">
                {monthlyStats.monthlyGoal.target}件
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                進捗 {monthlyStats.monthlyGoal.current} /{" "}
                {monthlyStats.monthlyGoal.target}件 ({monthlyStats.monthlyGoal.percent}%)
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${monthlyStats.monthlyGoal.percent}%` }}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Operations split — owner load + review queue */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-5"
            title="担当別ロード"
            icon={<Users size={16} />}
            action={
              <span className="text-[11px] text-slate-500">
                合計 {actions.length} 件 / P1 {p1Count} ・ P2 {p2Count}
              </span>
            }
          >
            <div className="space-y-2">
              {ownerLoad.map((o) => {
                const pct = Math.min(100, (o.count / Math.max(1, actions.length)) * 100);
                return (
                  <div key={o.owner} className="rounded-lg border border-slate-100 bg-white p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <User size={12} className="text-slate-400" />
                        {o.owner}
                      </span>
                      <span className="text-slate-500">
                        {o.count} 件 ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-navy-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              ※ 月次BPaaS伴走では、担当者あたり 5件以下を目安に配分する想定。
            </p>
          </SectionCard>

          <SectionCard
            className="lg:col-span-7"
            title="レビューコメント / 確認待ち"
            icon={<MessageSquare size={16} />}
            action={
              <span className="text-[11px] text-slate-500">
                {reviewQueue.length} 件
              </span>
            }
          >
            <div className="space-y-2">
              {reviewQueue.slice(0, 4).map((a) => (
                <ReviewRow key={a.id} action={a} />
              ))}
              {reviewQueue.length === 0 && (
                <p className="text-[11px] text-slate-500">
                  レビュー指摘はありません。
                </p>
              )}
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              ※ 月次定例（5/7）までに反映予定。指摘は AI考察 → 担当者レビュー × BPaaS PM コメントの3層で残す。
            </p>
          </SectionCard>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 lg:max-w-md">
            <Search size={14} />
            <input
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
              placeholder="施策を検索"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`rounded-md border px-2.5 py-1 text-xs ${
                  i === 0
                    ? "border-navy-900 bg-navy-900 text-white"
                    : f === "P1"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : f === "P2"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn-secondary px-3 py-1.5 text-xs">
            <Filter size={12} /> 優先度: すべて
            <ChevronDown size={12} />
          </button>
          <button className="btn-secondary px-3 py-1.5 text-xs">
            担当者: すべて
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Kanban */}
        <SectionCard
          title="実行ステータス"
          icon={<KanbanSquare size={16} />}
          bodyClassName="!px-3 !py-3"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            {grouped.map((col) => (
              <div
                key={col.key}
                className={`flex flex-col gap-2 rounded-xl border p-2.5 ${col.tone}`}
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className={`h-2 w-2 rounded-full ${col.bar}`} />
                    {col.key}
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                    {col.items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {col.items.map((a) => (
                    <ActionCard key={a.id} action={a} />
                  ))}
                  <button className="w-full rounded-lg border border-dashed border-slate-300 px-2 py-1.5 text-[11px] text-slate-500 hover:bg-white">
                    <Plus size={11} className="mr-1 inline" /> 新規施策を追加
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Effect verification */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-7"
            title="効果検証"
            icon={<TrendingUp size={16} />}
            action={
              <Pill tone="mint">選択中: 商品A FVコピー改善</Pill>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { l: "実装前CVR", v: "2.1%", sub: "(4/1〜4/15)" },
                { l: "実装後CVR", v: "2.6%", sub: "(4/16〜4/30)", up: true },
                { l: "売上変化", v: "+¥480,000", sub: "同期間比", up: true },
                { l: "ROAS変化", v: "+18pt", sub: "前期間比", up: true },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="text-[11px] text-slate-500">{s.l}</div>
                  <div
                    className={`mt-1 text-xl font-bold ${
                      s.up ? "text-emerald-600" : "text-slate-900"
                    }`}
                  >
                    {s.v}
                  </div>
                  <div className="text-[10px] text-slate-500">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-100 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">CVR推移 (%)</span>
                <span className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    実装後
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    実装前
                  </span>
                </span>
              </div>
              <Sparkline
                data={[1.7, 1.9, 1.8, 2.0, 2.1, 2.05, 2.0, 2.2, 2.4, 2.5, 2.55, 2.6, 2.62]}
                color="#10b981"
                fill="rgba(16,185,129,0.10)"
                width={520}
                height={120}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>4/1</span>
                <span>4/15</span>
                <span>4/30</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <span className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={14} /> AI判定: 継続改善
              </span>
              <button className="text-emerald-700 hover:underline">
                詳細を見る
              </button>
            </div>
          </SectionCard>

          <SectionCard
            className="lg:col-span-5"
            title="BPaaS運用情報"
            icon={<KanbanSquare size={16} />}
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Stat l="次回定例" v="5月7日 10:00" />
              <Stat l="顧客確認待ち" v="3件" tone="rose" />
              <Stat l="社内対応中" v="5件" tone="sky" />
              <Stat l="今月レポート反映" v="6 / 18件" />
              <Stat l="担当" v="EC Growth Studio Team" wide />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: "33%" }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
              <div>
                <div className="font-semibold text-slate-800">次の改善提案</div>
                <div className="text-[11px] text-slate-500">
                  レビュー導線をFV直下に追加
                </div>
              </div>
              <button className="btn-secondary px-2.5 py-1 text-[11px]">
                詳細を見る
              </button>
            </div>
            <button className="btn-primary mt-3 w-full justify-center text-sm">
              運用詳細を確認
              <ArrowRight size={14} />
            </button>
          </SectionCard>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-white">
          <button className="btn-success text-sm">
            <Plus size={14} /> 新規施策を追加
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            <Sparkles size={14} /> AI考察から施策生成
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            月次レポートに反映
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20 ml-auto">
            完了施策を効果検証へ移動
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
}

function ActionCard({ action: a }: { action: Action }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        <Pill tone={priorityTone(a.priority)} size="xs">
          {a.priority}
        </Pill>
        <Pill tone={statusTone(a.status)} size="xs">
          {a.status}
        </Pill>
        <Pill tone="slate" size="xs">
          {a.area}
        </Pill>
        {a.product && (
          <Pill tone="violet" size="xs">
            {a.product}
          </Pill>
        )}
      </div>
      <div className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-800">
        {a.title}
      </div>
      <div className="mt-1.5 flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
        <Target size={11} />
        期待効果: {a.expected}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <User size={11} className="text-slate-400" />
          <span className="text-slate-700">{a.owner}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarClock size={11} className="text-slate-400" />
          <span className="text-slate-700">{a.due}</span>
        </div>
        <div>
          工数: <span className="text-slate-700">{a.effort}</span>
        </div>
        <div>
          影響: <span className="text-slate-700">{a.impact}</span>
        </div>
      </div>
      <div className="mt-1.5 space-y-1 text-[11px] text-slate-500">
        <div>
          <span className="text-slate-400">AI考察:</span>{" "}
          <span className="text-slate-700">{a.rationale}</span>
        </div>
        <div>
          <span className="text-slate-400">必要データ:</span>{" "}
          <span className="text-slate-700">{a.data}</span>
        </div>
        <div>
          <span className="text-slate-400">次アクション:</span>{" "}
          <span className="text-slate-700">{a.next}</span>
        </div>
      </div>
      {a.reviewComment && (
        <div className="mt-2 rounded-md border border-amber-100 bg-amber-50/70 p-2 text-[11px] text-amber-800">
          <div className="flex items-center gap-1 font-semibold">
            <MessageSquare size={11} />
            レビューコメント
            {a.reviewer && (
              <span className="ml-auto text-[10px] font-normal text-amber-700/80">
                {a.reviewer}
                {a.reviewedAt && ` ・ ${a.reviewedAt}`}
              </span>
            )}
          </div>
          <p className="mt-1 leading-snug">{a.reviewComment}</p>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ action: a }: { action: Action }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Pill tone={priorityTone(a.priority)} size="xs">
          {a.priority}
        </Pill>
        <Pill tone={statusTone(a.status)} size="xs">
          {a.status}
        </Pill>
        <span className="text-[12px] font-medium text-slate-800">{a.title}</span>
      </div>
      {a.reviewComment ? (
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700">
          <MessageSquare size={11} className="mr-1 inline text-amber-500" />
          {a.reviewComment}
        </p>
      ) : (
        <p className="mt-1.5 text-[11px] text-slate-500">
          レビュー指摘は未記入
        </p>
      )}
      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <User size={11} className="text-slate-400" />
          {a.owner}
        </span>
        <span className="flex items-center gap-1">
          <CalendarClock size={11} className="text-slate-400" />
          {a.due}
        </span>
        <span className="flex items-center gap-1 text-emerald-700">
          <Target size={11} />
          {a.expected}
        </span>
        {a.reviewer && (
          <span className="ml-auto text-[10px] text-slate-400">
            {a.reviewer}
            {a.reviewedAt && ` ・ ${a.reviewedAt}`}
          </span>
        )}
      </div>
    </div>
  );
}

function Stat({
  l,
  v,
  tone,
  wide,
}: {
  l: string;
  v: string;
  tone?: "rose" | "sky";
  wide?: boolean;
}) {
  const color =
    tone === "rose"
      ? "text-rose-600"
      : tone === "sky"
        ? "text-sky-600"
        : "text-slate-900";
  return (
    <div
      className={`rounded-lg border border-slate-100 bg-white p-3 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <div className="text-[11px] text-slate-500">{l}</div>
      <div className={`mt-0.5 text-sm font-bold ${color}`}>{v}</div>
    </div>
  );
}
