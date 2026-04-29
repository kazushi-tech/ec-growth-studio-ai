import {
  Upload,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  ChevronRight,
  Plug,
  Beaker,
  Download,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Box,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill from "../components/ui/Pill";
import { dataSources } from "../data/sample";
import type { DataSource } from "../data/sample";

const sourceIcon = (name: string) => {
  if (name.includes("注文") || name.includes("商品データ"))
    return <ShoppingBag size={14} className="text-emerald-600" />;
  if (name.includes("在庫") || name.includes("画像"))
    return <Box size={14} className="text-emerald-600" />;
  if (name.includes("レビュー"))
    return <Sparkles size={14} className="text-amber-500" />;
  if (name.includes("GA4"))
    return <BarChart3 size={14} className="text-sky-600" />;
  if (name.includes("広告") || name.includes("キャンペーン"))
    return <Megaphone size={14} className="text-rose-500" />;
  if (name.includes("CRM"))
    return <Sparkles size={14} className="text-violet-500" />;
  return <Database size={14} className="text-slate-500" />;
};

const stateTone = (s: DataSource["status"]) => {
  switch (s) {
    case "取込済み":
      return "mint";
    case "要確認":
      return "gold";
    case "未接続":
      return "rose";
    case "任意":
      return "slate";
  }
};

export default function DataImport() {
  return (
    <>
      <Topbar
        title="データ取込・連携"
        subtitle="CSVから始めて、Shopify・GA4・広告APIへ段階的に拡張"
        actions={
          <>
            <button className="btn-primary px-3 py-1.5 text-xs">
              <Upload size={12} /> CSVをアップロード
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              <Sparkles size={12} /> AI診断を開始
            </button>
          </>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* Connection summary */}
        <SectionCard title="データ接続サマリー" icon={<Database size={16} />}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <SummaryItem label="接続済みデータ" value="6" sub="前月比 +1" tone="emerald" />
            <SummaryItem label="未接続データ" value="3" sub="前月比 -1" tone="amber" />
            <SummaryItem
              label="最新取込"
              value="2026/04/29 09:42"
              sub="前回: 2026/04/28 18:31"
            />
            <SummaryItem
              label="AI診断データ充足率"
              value="78%"
              sub="前月比 +8pt"
              tone="emerald"
              progress={78}
            />
            <SummaryItem
              label="今月の診断ステータス"
              value="診断可能"
              sub="全体の78%のデータを確保"
              tone="emerald"
            />
          </div>
        </SectionCard>

        {/* Two cols: data source list / AI diagnosis influence */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SectionCard
            className="lg:col-span-2"
            title="データソース一覧"
            icon={<Database size={16} />}
            bodyClassName="!px-2 !py-2"
          >
            <table className="table-clean">
              <thead>
                <tr>
                  <th>データソース</th>
                  <th className="!w-20">状態</th>
                  <th className="!w-20">方式</th>
                  <th>最終更新</th>
                  <th>件数</th>
                  <th>AI診断への影響</th>
                  <th className="!w-16">操作</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((d) => (
                  <tr key={d.name}>
                    <td>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                        {sourceIcon(d.name)}
                        {d.name}
                      </div>
                    </td>
                    <td>
                      <Pill tone={stateTone(d.status)} size="xs">
                        {d.status}
                      </Pill>
                    </td>
                    <td className="text-slate-600">{d.method}</td>
                    <td className="text-slate-500">{d.updated}</td>
                    <td className="text-slate-700">{d.count}</td>
                    <td className="text-slate-500">{d.impact}</td>
                    <td>
                      <button className="text-xs text-sky-600 hover:text-sky-700">
                        {d.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 px-3 pb-1 text-[10px] text-slate-400">
              ※ 状態の説明: 取込済み=データが最新、要確認=差分/不整合の可能性、未接続=データ未連携、任意=より高度な分析に有効
            </p>
          </SectionCard>

          <SectionCard
            title="AI診断への影響"
            icon={<Sparkles size={16} />}
          >
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                このデータだけで月次診断可能
              </div>
              <p className="mt-1 text-[11px] leading-6 text-slate-600">
                主要な診断は現在のデータで実施できます。
              </p>
            </div>

            <Section
              title="現在可能な分析"
              tone="emerald"
              items={[
                "売上診断",
                "商品別改善判断",
                "広告ROAS診断",
                "リピート分析",
              ]}
              icon
            />
            <Section
              title="精度向上に必要な追加データ"
              tone="amber"
              items={["GA4 LP別CVR", "レビューCSV", "商品別粗利"]}
            />
            <Section
              title="データ不足で保留される分析"
              tone="rose"
              items={[
                "商品ページ詳細診断",
                "LP別離脱要因",
                "粗利ベース優先度",
              ]}
            />

            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-700">
                次に取り込むべきデータ
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                レビューCSVを追加すると信頼要素診断が可能になります。
              </p>
              <button className="btn-secondary mt-2 w-full justify-center text-xs">
                レビューCSVを取込む
              </button>
            </div>
          </SectionCard>
        </div>

        {/* Upload + Flow + API */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-5"
            title="CSVアップロード"
            icon={<Upload size={16} />}
          >
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
              <Cloud size={28} className="mx-auto text-slate-400" />
              <div className="mt-2 text-sm font-semibold text-slate-700">
                CSVファイルをドラッグ＆ドロップ
              </div>
              <div className="text-[11px] text-slate-500">
                またはボタンからファイルを選択
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {["注文CSV", "商品CSV", "在庫CSV", "レビューCSV", "広告CSV", "GA4 CSV", "CRM CSV"].map(
                  (t) => (
                    <Pill key={t} tone="slate" size="xs">
                      {t}
                    </Pill>
                  )
                )}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button className="btn-primary px-3 py-1.5 text-xs">
                  <Upload size={12} /> CSVをアップロード
                </button>
                <button className="btn-secondary px-3 py-1.5 text-xs">
                  <Download size={12} /> CSVテンプレートを取得
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            className="lg:col-span-4"
            title="取込の流れ"
            icon={<ChevronRight size={16} />}
          >
            <ol className="grid grid-cols-4 gap-2 text-center text-[11px]">
              {[
                { l: "アップロード", c: "bg-sky-100 text-sky-700" },
                { l: "カラムマッピング", c: "bg-amber-100 text-amber-700" },
                { l: "エラー確認", c: "bg-rose-100 text-rose-700" },
                { l: "取込完了", c: "bg-emerald-100 text-emerald-700" },
              ].map((s) => (
                <li key={s.l} className="space-y-1">
                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${s.c}`}
                  >
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="text-slate-700">{s.l}</div>
                </li>
              ))}
            </ol>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold text-slate-700">
                アップロード履歴（直近）
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px]">
                {[
                  ["orders_202604.csv", "取込済み", "mint", "2026/04/29 09:42"],
                  ["products_202604.csv", "取込済み", "mint", "2026/04/29 09:39"],
                  ["inventory_202604.csv", "要確認", "gold", "2026/04/27 18:21"],
                ].map(([n, s, t, d]) => (
                  <li
                    key={n}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-2.5 py-1.5"
                  >
                    <span className="truncate font-mono text-[11px] text-slate-700">
                      {n}
                    </span>
                    <span className="flex items-center gap-2">
                      <Pill tone={t as "mint" | "gold"} size="xs">
                        {s}
                      </Pill>
                      <span className="text-[10px] text-slate-400">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <button className="mt-2 text-[11px] text-sky-600 hover:text-sky-700">
                すべての履歴を見る
              </button>
            </div>
          </SectionCard>

          <SectionCard
            className="lg:col-span-3"
            title="API連携（任意・将来的に拡張可能）"
            icon={<Plug size={16} />}
          >
            <p className="text-[11px] leading-6 text-slate-500">
              API連携なしでもCSVで月次診断を開始できます。
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { l: "Shopify", s: "任意・未接続" },
                { l: "GA4", s: "任意・未接続" },
                { l: "Google広告", s: "未接続" },
                { l: "Meta広告", s: "未接続" },
                { l: "BigQuery", s: "任意" },
              ].map((x) => (
                <div
                  key={x.l}
                  className="rounded-xl border border-slate-100 p-2.5"
                >
                  <div className="text-xs font-semibold text-slate-800">
                    {x.l}
                  </div>
                  <div className="text-[10px] text-slate-500">{x.s}</div>
                  <button className="mt-1.5 w-full rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50">
                    接続する
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bottom action bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-white">
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            <Upload size={14} /> CSVをアップロード
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            <Plug size={14} /> Shopify APIに接続
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            <Beaker size={14} /> サンプルデータで試す
          </button>
          <button className="btn-success ml-auto px-3 py-1.5 text-sm">
            <Sparkles size={14} /> AI診断を開始
          </button>
          <button className="btn px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20">
            <Download size={14} /> データテンプレートを取得
          </button>
        </div>
      </div>
    </>
  );
}

function SummaryItem({
  label,
  value,
  sub,
  tone,
  progress,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "emerald" | "amber";
  progress?: number;
}) {
  const dotColor =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "amber"
        ? "bg-amber-500"
        : "bg-slate-300";
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <div className="text-[11px] text-slate-500">{label}</div>
      </div>
      <div className="mt-1 text-lg font-bold tracking-tight text-slate-900">
        {value}
      </div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
      {progress !== undefined && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  tone,
  items,
  icon,
}: {
  title: string;
  tone: "emerald" | "amber" | "rose";
  items: string[];
  icon?: boolean;
}) {
  const colorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  };
  const Icon = tone === "emerald" ? CheckCircle2 : AlertTriangle;
  return (
    <div className="mt-3">
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${colorMap[tone]}`}>
        {icon ? <CheckCircle2 size={13} /> : <Icon size={13} />}
        {title}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Pill key={it} tone="slate" size="xs">
            {it}
          </Pill>
        ))}
      </div>
    </div>
  );
}
