import {
  Sparkles,
  BarChart3,
  Megaphone,
  Users,
  Boxes,
  FileEdit,
  Plus,
  CalendarClock,
  ListChecks,
  Database,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill, {
  effortTone,
  impactTone,
  priorityTone,
  statusTone,
} from "../components/ui/Pill";
import Sparkline from "../components/ui/Sparkline";
import { Link } from "react-router-dom";
import { actions, insights, kpis } from "../data/sample";

const aiActions = actions.slice(0, 5);

export default function AiReport() {
  return (
    <>
      <Topbar
        title="AI考察レポート"
        subtitle="月次データから売上課題を分解し、実行施策までAIが整理"
        actions={
          <>
            <button className="btn-primary px-3 py-1.5 text-xs">
              月次レポートとして出力
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              <Plus size={12} /> 施策ボードへ追加
            </button>
          </>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* Sample-text disclaimer — make it explicit that AI text on this page is sample copy */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-[12px] text-amber-900">
          <AlertCircle size={14} className="text-amber-600" />
          <span className="font-semibold">この画面のAI考察はサンプル文言です。</span>
          <span className="text-amber-800/90">
            現MVPは「AI診断 × 人間レビュー」のワークフロー検証が目的で、
            実AI生成は <b>Phase 4 で Anthropic SDK + prompt cache</b> に接続予定。
            数値はサンプルデータ、文言は固定の参考文です。
          </span>
        </div>

        {/* Top: AI diagnosis + Numerical evidence */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="AI総合診断"
            icon={<Sparkles size={16} />}
            action={
              <Pill tone="gold">
                <AlertCircle size={11} /> サンプル文言
              </Pill>
            }
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-slate-500">
                  今月の結論（サンプル）
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-800">
                  売上は前月比 <b>+14.3%</b> で成長、ただし主力商品AのCVR低下、
                  広告ROAS悪化、在庫滞留が次月の売上成長を圧迫するリスクです。
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill tone="rose">商品A CVR -0.7pt</Pill>
                  <Pill tone="gold">広告ROAS -18%</Pill>
                  <Pill tone="sky">在庫残 420</Pill>
                  <Pill tone="mint">リピート率 +2.1pt</Pill>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="text-xs font-semibold text-slate-500">
                  売上への影響
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  推定機会損失
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  ¥1,240,000
                </div>
                <div className="mt-2 text-[11px] text-slate-500">改善余地</div>
                <div className="text-base font-semibold text-emerald-600">
                  +8〜12%
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="数値根拠" icon={<BarChart3 size={16} />}>
            <div className="grid grid-cols-2 gap-3">
              {kpis.slice(0, 6).map((k) => (
                <div key={k.key} className="rounded-lg border border-slate-100 p-2.5">
                  <div className="text-[10px] text-slate-500">{k.label}</div>
                  <div className="text-sm font-bold text-slate-900">
                    {k.value}
                  </div>
                  <div
                    className={`text-[10px] font-semibold ${
                      k.intent === "negative"
                        ? "text-rose-600"
                        : k.intent === "positive"
                          ? "text-emerald-600"
                          : "text-slate-500"
                    }`}
                  >
                    {k.delta}
                  </div>
                  <div className="-mx-1 mt-1 h-6">
                    <Sparkline
                      data={k.spark}
                      color={
                        k.intent === "negative"
                          ? "#f43f5e"
                          : k.intent === "positive"
                            ? "#10b981"
                            : "#64748b"
                      }
                      fill={
                        k.intent === "negative"
                          ? "rgba(244, 63, 94, 0.08)"
                          : k.intent === "positive"
                            ? "rgba(16, 185, 129, 0.10)"
                            : "rgba(100, 116, 139, 0.08)"
                      }
                      height={28}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Issue decomposition */}
        <SectionCard title="課題の分解" icon={<Sparkles size={16} />}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {insights.map((it) => (
              <IssueCard key={it.area} item={it} />
            ))}
          </div>
        </SectionCard>

        {/* Two cols: AI proposals + side info */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="AI改善提案"
            icon={<ListChecks size={16} />}
            action={
              <Link
                to="/app/action-board"
                className="text-sky-600 hover:text-sky-700"
              >
                すべての施策を施策ボードで管理する →
              </Link>
            }
            bodyClassName="!px-2 !py-2"
          >
            <table className="table-clean">
              <thead>
                <tr>
                  <th className="!w-8">#</th>
                  <th>施策名</th>
                  <th>狙い</th>
                  <th className="!w-16">想定インパクト</th>
                  <th className="!w-12">工数</th>
                  <th className="!w-14">優先度</th>
                  <th>担当領域</th>
                  <th className="!w-12">期限</th>
                  <th className="!w-20">状態</th>
                </tr>
              </thead>
              <tbody>
                {aiActions.map((a) => (
                  <tr key={a.id}>
                    <td className="text-slate-400">{a.id}</td>
                    <td className="font-medium text-slate-800">{a.title}</td>
                    <td className="text-slate-500">
                      {a.expected.replace(/^想定/, "")}
                    </td>
                    <td>
                      <Pill tone={impactTone(a.impact)} size="xs">
                        {a.impact}
                      </Pill>
                    </td>
                    <td>
                      <Pill tone={effortTone(a.effort)} size="xs">
                        {a.effort}
                      </Pill>
                    </td>
                    <td>
                      <Pill tone={priorityTone(a.priority)} size="xs">
                        {a.priority}
                      </Pill>
                    </td>
                    <td className="text-slate-600">{a.area}</td>
                    <td className="text-slate-500">{a.due}</td>
                    <td>
                      <Pill tone={statusTone(a.status)} size="xs">
                        {a.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <div className="space-y-5">
            <SectionCard title="レポート出力・実行" icon={<FileEdit size={16} />}>
              <div className="space-y-2">
                <button className="btn-primary w-full justify-center text-sm">
                  月次レポートとして出力
                </button>
                <button className="btn-secondary w-full justify-center text-sm">
                  <Plus size={14} /> 施策ボードへ追加
                </button>
                <button className="btn-secondary w-full justify-center text-sm">
                  <FileEdit size={14} /> 商品ページ改善案を作成
                </button>
                <button className="btn-secondary w-full justify-center text-sm">
                  <Megaphone size={14} /> 広告改善案を作成
                </button>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <CalendarClock size={12} /> 次回改善会議: 5月7日 10:00
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} /> 担当: EC Growth Studio Team
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} /> レビュー状態: 施策確認中
                </div>
              </div>
            </SectionCard>

            <SectionCard title="実行前チェック" icon={<AlertTriangle size={16} />}>
              <CheckRow
                tone="emerald"
                title="人間が確認すべき点"
                items={[
                  "商品Aの在庫確保",
                  "訴求変更のブランド整合",
                  "広告予算上限",
                ]}
              />
              <CheckRow
                tone="amber"
                title="データ不足"
                items={["GA4 LP別CVR未取込", "商品別粗利未入力"]}
              />
              <CheckRow
                tone="rose"
                title="リスク"
                items={[
                  "主力商品の訴求変更による一時的CVR低下",
                  "広告配分変更による学習リセット",
                ]}
              />
              <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <Database size={12} /> 次に必要な追加データ
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill tone="slate" size="xs">GA4 CSV</Pill>
                  <Pill tone="slate" size="xs">商品別粗利</Pill>
                  <Pill tone="slate" size="xs">キャンペーン別広告費</Pill>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy-950 px-5 py-4 text-white">
          <div className="text-sm">
            次月の改善サイクルに反映するには、施策ボードへ追加して担当・期限を設定してください。
          </div>
          <Link
            to="/app/action-board"
            className="btn px-3 py-1.5 text-xs bg-white/10 text-white hover:bg-white/20"
          >
            施策ボードへ移動
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}

const stateMeta = {
  要改善: { tone: "rose", icon: AlertTriangle },
  配分見直し: { tone: "gold", icon: TrendingUp },
  伸長余地: { tone: "mint", icon: TrendingUp },
  要確認: { tone: "sky", icon: AlertTriangle },
} as const;

const areaIcon = {
  商品ページ: FileEdit,
  "広告・流入": Megaphone,
  "CRM・リピート": Users,
  "在庫・SKU": Boxes,
} as const;

function IssueCard({ item }: { item: (typeof insights)[number] }) {
  const meta = stateMeta[item.state];
  const Icon = areaIcon[item.area];
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-slate-600" />
          <div className="text-sm font-semibold text-slate-900">
            {item.area}課題
          </div>
        </div>
        <Pill tone={meta.tone}>{item.state}</Pill>
      </div>
      <p className="mt-2 text-xs leading-6 text-slate-600">{item.summary}</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
        <span className="text-slate-500">
          売上影響:{" "}
          <span
            className={
              item.impact === "高"
                ? "font-semibold text-rose-600"
                : "font-semibold text-amber-600"
            }
          >
            {item.impact}
          </span>
        </span>
        <button className="text-sky-600 hover:text-sky-700">
          {item.next} →
        </button>
      </div>
    </div>
  );
}

function CheckRow({
  tone,
  title,
  items,
}: {
  tone: "emerald" | "amber" | "rose";
  title: string;
  items: string[];
}) {
  const colorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  };
  return (
    <div className="mt-2">
      <div
        className={`flex items-center gap-2 text-xs font-semibold ${colorMap[tone]}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {title}
      </div>
      <ul className="mt-1.5 space-y-0.5 pl-3.5 text-[11px] text-slate-600">
        {items.map((it) => (
          <li key={it} className="list-disc">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
