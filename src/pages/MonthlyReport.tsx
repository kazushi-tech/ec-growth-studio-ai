import {
  FileText,
  FileBarChart2,
  Sparkles,
  ListChecks,
  Calendar,
  Store,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  Plus,
  Download,
  AlertTriangle,
  Maximize2,
  Presentation,
  RefreshCw,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill from "../components/ui/Pill";
import { reportSections } from "../data/sample";

const statusTone = (s: string) => {
  if (s.includes("AI生成") || s.includes("数値確認") || s.includes("反映"))
    return "mint";
  if (s.includes("レビュー")) return "gold";
  if (s.includes("一部")) return "sky";
  if (s.includes("要")) return "rose";
  if (s.includes("リスク")) return "rose";
  return "slate";
};

export default function MonthlyReport() {
  return (
    <>
      <Topbar
        title="月次レポート出力"
        subtitle="売上分析・AI考察・改善施策・効果検証を顧客提出用レポートに整理"
        actions={
          <>
            <button className="btn-primary px-3 py-1.5 text-xs">
              <FileBarChart2 size={12} /> 月次レポートを生成
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              <LinkIcon size={12} /> 顧客共有リンクを作成
            </button>
          </>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* Summary */}
        <SectionCard title="レポートサマリー" icon={<FileText size={16} />}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-7">
            <SummaryItem icon={<Calendar size={14} />} label="対象月" value="2026年4月" />
            <SummaryItem icon={<Store size={14} />} label="対象ストア" value="Sample Shopify Store" />
            <DonutItem percent={86} label="レポート完成度" />
            <SummaryItem icon={<Sparkles size={14} />} label="AI診断" value="完了" tone="mint" />
            <SummaryItem icon={<ListChecks size={14} />} label="施策反映" value="12件" />
            <SummaryItem icon={<CheckCircle2 size={14} />} label="効果検証済み" value="4件" />
            <SummaryItem icon={<Users size={14} />} label="顧客提出ステータス" value="レビュー中" tone="gold" />
          </div>
        </SectionCard>

        {/* Composition + Status + Preview + Output */}
        <div className="grid gap-5 xl:grid-cols-12">
          <SectionCard
            className="xl:col-span-2"
            title="レポート構成プレビュー"
            icon={<FileText size={16} />}
          >
            <ol className="space-y-2">
              {reportSections.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-slate-500">
                      {s.no}
                    </div>
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {s.title}
                  </div>
                  <div className="mt-1.5">
                    <Pill tone={statusTone(s.status)} size="xs">
                      {s.status}
                    </Pill>
                  </div>
                </li>
              ))}
              <li>
                <button className="w-full rounded-xl border border-dashed border-slate-300 px-2 py-2 text-[11px] text-slate-500 hover:bg-slate-50">
                  <Plus size={11} className="mr-1 inline" /> セクションを追加
                </button>
              </li>
            </ol>
          </SectionCard>

          <SectionCard
            className="xl:col-span-2"
            title="編集・確認ステータス"
            icon={<RefreshCw size={16} />}
          >
            <Step
              dotColor="bg-emerald-500"
              title="AI生成済み"
              sub={`AIがレポートを生成 / 2026/04/29 09:10`}
              icon={<Sparkles size={14} />}
              completed
            />
            <StepArrow />
            <Step
              dotColor="bg-amber-500"
              title="担当者レビュー中"
              sub="Growth Team が内容を確認中"
              icon={<Users size={14} />}
            />
            <StepArrow />
            <Step
              dotColor="bg-sky-500"
              title="顧客提出可"
              sub="社内承認後に提出可能"
              icon={<CheckCircle2 size={14} />}
              hint
            />
            <div className="mt-2 space-y-1.5">
              <Pill tone="rose">
                <AlertTriangle size={11} /> 要確認
              </Pill>
              <div />
              <Pill tone="rose">
                <AlertTriangle size={11} /> データ不足
              </Pill>
              <div />
              <Pill tone="rose">
                <AlertTriangle size={11} /> 表現リスク確認
              </Pill>
            </div>
            <StepArrow />
            <Step
              dotColor="bg-violet-500"
              title="顧客提出"
              sub="クライアントに共有・提出"
              icon={<Presentation size={14} />}
            />
          </SectionCard>

          <SectionCard
            className="xl:col-span-5"
            title="レポート本文プレビュー"
            icon={<FileText size={16} />}
            action={
              <button className="text-slate-500 hover:text-slate-700">
                <Maximize2 size={14} className="inline" /> 全画面でプレビュー
              </button>
            }
          >
            <article className="space-y-4 text-sm leading-7 text-slate-700">
              <div>
                <h4 className="mb-1 border-l-4 border-navy-900 pl-2 text-[13px] font-semibold text-slate-800">
                  今月の結論
                </h4>
                <p>
                  売上は前月比 <b>+14.3%</b> で成長。一方で主力商品AのCVR低下と
                  広告ROAS悪化が次月の重点課題です。
                </p>
              </div>
              <div>
                <h4 className="mb-1 border-l-4 border-navy-900 pl-2 text-[13px] font-semibold text-slate-800">
                  売上への影響
                </h4>
                <p>
                  改善余地は約 <b>+8〜12%</b>。商品ページ改善と広告配分見直しにより、
                  月間 <b>+¥1,200,000</b> 前後の売上機会があります。
                </p>
              </div>
              <div>
                <h4 className="mb-1 border-l-4 border-navy-900 pl-2 text-[13px] font-semibold text-slate-800">
                  主要な改善施策（上位3件）
                </h4>
                <ol className="space-y-2">
                  <ReportItem
                    no={1}
                    title="商品AのFV改善"
                    badge="P1"
                    metric="想定インパクト CVR +0.3〜0.5pt"
                  />
                  <ReportItem
                    no={2}
                    title="商品Bへの広告配分移行"
                    badge="P1"
                    metric="想定インパクト 売上 +¥720,000"
                  />
                  <ReportItem
                    no={3}
                    title="初回購入者CRM強化"
                    badge="P2"
                    metric="想定インパクト リピート率 +1.5pt"
                  />
                </ol>
              </div>
              <div>
                <h4 className="mb-1 border-l-4 border-navy-900 pl-2 text-[13px] font-semibold text-slate-800">
                  次月の優先アクション
                </h4>
                <p>
                  P1施策3件を5月第1週に実行し、5月7日の定例で効果確認を開始。
                </p>
              </div>
            </article>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-500">
                人間が追記するコメント（顧客向け補足）
              </div>
              <textarea
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700 outline-none focus:border-navy-400"
                placeholder="顧客向け補足コメントを入力"
                rows={2}
              />
              <div className="mt-1 text-right text-[10px] text-slate-400">
                0 / 500
              </div>
            </div>
          </SectionCard>

          <div className="space-y-5 xl:col-span-3">
            <SectionCard title="出力形式" icon={<Download size={16} />}>
              <div className="grid grid-cols-3 gap-2">
                <FormatCard label="PDF" tone="primary" />
                <FormatCard label="PowerPoint" />
                <FormatCard label="Google Slides" />
                <FormatCard label="共有リンク" />
                <FormatCard label="Notion連携" muted="近日対応" />
                <FormatCard label="Google Docs連携" muted="近日対応" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="btn-primary px-3 py-2 text-xs">
                  PDFで出力
                </button>
                <button className="btn-secondary px-3 py-2 text-xs">
                  PowerPointで出力
                </button>
              </div>
            </SectionCard>

            <SectionCard
              title="顧客提出前チェック"
              icon={<CheckCircle2 size={16} />}
            >
              <CheckRow icon="ok" label="数値確認" status="完了" tone="mint" />
              <CheckRow icon="ok" label="表現チェック" status="完了" tone="mint" />
              <CheckRow
                icon="warn"
                label="薬機法/景表法などの注意"
                status="要確認"
                tone="gold"
                detail="効果効能の断定表現を確認してください"
              />
              <CheckRow
                icon="warn"
                label="データ不足の注記"
                status="要確認"
                tone="gold"
                detail="商品別粗利未入力のため利益評価は注記が必要"
              />
              <CheckRow icon="todo" label="担当者承認" status="未完了" tone="slate" />
              <CheckRow
                icon="todo"
                label="顧客向けコメント確認"
                status="未完了"
                tone="slate"
              />
            </SectionCard>

            <SectionCard
              title="出力・共有アクション"
              icon={<Download size={16} />}
            >
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-primary px-3 py-2 text-xs">
                  <Sparkles size={12} /> 月次レポートを生成
                </button>
                <button className="btn-secondary px-3 py-2 text-xs">
                  <LinkIcon size={12} /> 顧客共有リンクを作成
                </button>
                <button className="btn-secondary px-3 py-2 text-xs">
                  PDFで出力
                </button>
                <button className="btn-secondary px-3 py-2 text-xs">
                  施策ボードから再反映
                </button>
                <button className="btn-secondary px-3 py-2 text-xs">
                  PowerPointで出力
                </button>
                <button className="btn-secondary px-3 py-2 text-xs">
                  次月アクションを作成
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div>
                  <div className="text-slate-400">次回報告会</div>
                  <div className="text-slate-700">📅 5月7日 10:00</div>
                </div>
                <div>
                  <div className="text-slate-400">共有範囲</div>
                  <div className="text-slate-700">クライアント閲覧可</div>
                </div>
                <div>
                  <div className="text-slate-400">承認者</div>
                  <div className="text-slate-700">EC Growth Studio Team</div>
                </div>
                <div>
                  <div className="text-slate-400">最終更新</div>
                  <div className="text-slate-700">2026/04/29 09:42</div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-400">
          ※ 数値や表現は自動生成されています。提出前に必ず内容をご確認ください。
        </p>
      </div>
    </>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  tone?: "mint" | "gold";
}) {
  const valueColor =
    tone === "mint"
      ? "text-emerald-600"
      : tone === "gold"
        ? "text-amber-600"
        : "text-slate-900";
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>
      <div className={`mt-1 text-sm font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}

function DonutItem({ percent, label }: { percent: number; label: string }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c * (1 - percent / 100);
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={r}
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r={r}
            stroke="#10b981"
            strokeWidth="5"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={off}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
          />
        </svg>
        <div className="text-xl font-bold text-slate-900">{percent}%</div>
      </div>
    </div>
  );
}

function ReportItem({
  no,
  title,
  badge,
  metric,
}: {
  no: number;
  title: string;
  badge: string;
  metric: string;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[11px] font-bold text-white">
          {no}
        </span>
        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Pill tone="rose" size="xs">
          {badge}
        </Pill>
        <span className="text-[11px] text-slate-500">{metric}</span>
      </div>
    </li>
  );
}

function Step({
  dotColor,
  title,
  sub,
  icon,
  completed,
  hint,
}: {
  dotColor: string;
  title: string;
  sub?: string;
  icon?: React.ReactNode;
  completed?: boolean;
  hint?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-2.5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${dotColor} text-white`}
        >
          {icon}
        </span>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        {completed && (
          <CheckCircle2 size={14} className="ml-auto text-emerald-500" />
        )}
        {hint && (
          <Pill tone="sky" size="xs" >
            次のステップ
          </Pill>
        )}
      </div>
      {sub && <p className="mt-1 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

function StepArrow() {
  return (
    <div className="flex justify-center py-1">
      <span className="h-3 w-px bg-slate-300" />
    </div>
  );
}

function FormatCard({
  label,
  tone,
  muted,
}: {
  label: string;
  tone?: "primary";
  muted?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-2.5 text-center ${
        tone === "primary"
          ? "border-navy-900 bg-navy-50 text-navy-800"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <div className="text-xs font-semibold">{label}</div>
      {muted && (
        <div className="mt-0.5 text-[10px] text-slate-400">{muted}</div>
      )}
    </div>
  );
}

function CheckRow({
  icon,
  label,
  status,
  tone,
  detail,
}: {
  icon: "ok" | "warn" | "todo";
  label: string;
  status: string;
  tone: "mint" | "gold" | "slate";
  detail?: string;
}) {
  const Icon =
    icon === "ok" ? CheckCircle2 : icon === "warn" ? AlertTriangle : Plus;
  const color =
    icon === "ok"
      ? "text-emerald-500"
      : icon === "warn"
        ? "text-amber-500"
        : "text-slate-400";
  return (
    <div className="mt-2 flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-white p-2.5">
      <div className="flex items-start gap-2">
        <Icon size={14} className={`mt-0.5 ${color}`} />
        <div>
          <div className="text-xs font-medium text-slate-800">{label}</div>
          {detail && (
            <div className="text-[10px] text-slate-500">{detail}</div>
          )}
        </div>
      </div>
      <Pill tone={tone} size="xs">
        {status}
      </Pill>
    </div>
  );
}
