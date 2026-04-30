import {
  Sparkles,
  ListChecks,
  Plus,
  FileEdit,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Star,
  MousePointerClick,
  Tag,
  Smartphone,
  FileText,
  AlertOctagon,
  Target,
  ArrowRight,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill, {
  effortTone,
  impactTone,
  priorityTone,
} from "../components/ui/Pill";
import ScoreBar from "../components/ui/ScoreBar";
import { productPageActions, productPageDiagnosis } from "../data/sample";

const diagnosisIcon = [
  ImageIcon, // FV
  ImageIcon, // Image
  FileText,
  Star,
  MousePointerClick,
  Tag,
  Smartphone,
  Target,
];

export default function ProductPage() {
  return (
    <>
      <Topbar
        title="商品ページ改善"
        subtitle="商品ページ・広告流入・レビュー導線を横断し、CVR改善案をAIが具体化"
        actions={
          <>
            <button className="btn-primary px-3 py-1.5 text-xs">
              <Plus size={12} /> 改善案を施策ボードへ追加
            </button>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              商品ページ改善案を出力
            </button>
          </>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* Product summary */}
        <SectionCard title="対象商品サマリー" icon={<FileEdit size={16} />}>
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex gap-4">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white text-3xl">
                  🌿
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">SKU-HAIR-001</div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    薬用スカルプエッセンス A
                  </h3>
                  <div className="mt-0.5 text-xs text-slate-500">
                    カテゴリ: ヘアケア
                  </div>
                  <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50 p-2.5 text-[11px] leading-6 text-slate-700">
                    <b className="text-sky-700">AIメモ:</b>{" "}
                    主力商品だがCVR低下と広告効率悪化が同時発生。
                    商品ページ改善を最優先で実行。
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:col-span-8">
              {[
                { l: "売上", v: "¥3,920,000", d: "" },
                { l: "CVR", v: "2.1%", d: "-0.7pt", neg: true },
                { l: "AOV", v: "¥4,280", d: "" },
                { l: "在庫", v: "残 420", d: "" },
                { l: "広告費", v: "¥880,000", d: "" },
                { l: "ROAS", v: "268%", d: "-22%", neg: true },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-slate-100 bg-white p-3"
                >
                  <div className="text-[11px] text-slate-500">{s.l}</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">
                    {s.v}
                  </div>
                  {s.d && (
                    <div
                      className={`mt-0.5 text-[11px] font-semibold ${
                        s.neg ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {s.d}
                    </div>
                  )}
                </div>
              ))}
              <div className="col-span-3 mt-1 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                <div className="text-xs text-slate-600">改善優先度</div>
                <div className="text-2xl font-bold text-rose-600">
                  P1 / 高
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Diagnosis grid + Before/After */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-7"
            title="商品ページ診断"
            icon={<Sparkles size={16} />}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {productPageDiagnosis.map((d, i) => {
                const Icon = diagnosisIcon[i] ?? FileText;
                return (
                  <div
                    key={d.id}
                    className="rounded-xl border border-slate-100 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Icon size={14} className="text-slate-500" />
                        <span>{d.id}</span>
                        <span>{d.title}</span>
                      </div>
                      <Pill
                        tone={
                          d.label === "要改善"
                            ? "rose"
                            : d.label === "改善余地"
                              ? "gold"
                              : "sky"
                        }
                        size="xs"
                      >
                        {d.label}
                      </Pill>
                    </div>
                    <div className="mt-2 flex items-end gap-2">
                      <div className="text-2xl font-bold text-slate-900">
                        {d.score}
                      </div>
                      <div className="mb-1 text-xs text-slate-400">/100</div>
                    </div>
                    <ScoreBar score={d.score} />
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {d.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            className="lg:col-span-5"
            title="Before / After 改善案"
            icon={<FileEdit size={16} />}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3">
                <div className="text-xs font-semibold text-rose-700">
                  現状の課題
                </div>
                <ul className="mt-2 space-y-2 text-[11px] leading-6 text-slate-700">
                  {[
                    "広告では「抜け毛対策」を訴求しているが、FVでは成分説明が先行",
                    "レビュー評価が購入直前まで見えない",
                    "CTA文言が汎用的で、定期便メリットが伝わらない",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <AlertOctagon
                        size={12}
                        className="mt-0.5 shrink-0 text-rose-500"
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                <div className="text-xs font-semibold text-emerald-700">
                  改善後コピー案・構成
                </div>
                <ul className="mt-2 space-y-1.5 text-[11px] leading-6 text-slate-700">
                  <li className="rounded-lg bg-white px-2.5 py-2">
                    <div className="text-[11px] text-slate-500">
                      メインコピー (FV)
                    </div>
                    <div className="font-semibold text-slate-800">
                      抜け毛が気になり始めた30代からの薬用スカルプケア
                    </div>
                  </li>
                  <li className="rounded-lg bg-white px-2.5 py-2">
                    <div className="text-[11px] text-slate-500">サブコピー</div>
                    有効成分と継続しやすい定期便で、毎日の頭皮ケアを習慣化
                  </li>
                  <li className="rounded-lg bg-white px-2.5 py-2">
                    <div className="text-[11px] text-slate-500">
                      推奨FV構成
                    </div>
                    商品画像 + 悩み訴求 + レビュー星 + 定期便CTA
                  </li>
                  <li className="rounded-lg bg-emerald-600 px-2.5 py-2 text-white">
                    <div className="text-[11px] text-emerald-100">CTA文言</div>
                    まずは定期初回20%OFFで始める
                  </li>
                  <li className="rounded-lg bg-white px-2.5 py-2">
                    <div className="text-[11px] text-slate-500">
                      レビュー導線
                    </div>
                    FV直下にレビュー平均と使用者の声を配置
                  </li>
                </ul>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Recommended actions + side */}
        <div className="grid gap-5 lg:grid-cols-12">
          <SectionCard
            className="lg:col-span-8"
            title="AI推奨施策"
            icon={<ListChecks size={16} />}
            action={
              <a
                href="/app/action-board"
                className="text-sky-600 hover:text-sky-700"
              >
                すべての施策を施策ボードで管理する →
              </a>
            }
            bodyClassName="!px-2 !py-2"
          >
            <table className="table-clean">
              <thead>
                <tr>
                  <th className="!w-8">#</th>
                  <th>施策名</th>
                  <th className="!w-24">想定CVR改善</th>
                  <th className="!w-16">売上インパクト</th>
                  <th className="!w-12">工数</th>
                  <th className="!w-14">優先度</th>
                  <th>実装担当</th>
                  <th className="!w-12">期限</th>
                </tr>
              </thead>
              <tbody>
                {productPageActions.map((a) => (
                  <tr key={a.id}>
                    <td className="text-slate-400">{a.id}</td>
                    <td className="font-medium text-slate-800">{a.title}</td>
                    <td className="font-semibold text-emerald-600">
                      {a.cvrLift}
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
                    <td className="text-slate-600">{a.owner}</td>
                    <td className="text-slate-500">{a.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <div className="space-y-5 lg:col-span-4">
            <SectionCard
              title="実装タスク化"
              icon={<ListChecks size={16} />}
            >
              <div className="space-y-2">
                <button className="btn-primary w-full justify-center text-sm">
                  <Plus size={14} /> 施策ボードに追加
                </button>
                <button className="btn-secondary w-full justify-center text-sm">
                  <FileEdit size={14} /> LP/商品ページ改善案を出力
                </button>
                <button className="btn-secondary w-full justify-center text-sm">
                  <Megaphone size={14} /> 広告文と整合チェック
                </button>
                <button className="btn-secondary w-full justify-center text-sm">
                  月次レポートに反映
                </button>
              </div>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                <div>担当: EC Growth Studio Team</div>
                <div className="flex items-center gap-2">
                  <Pill tone="gold" size="xs">改善案確認中</Pill>
                  <span>次回確認: 5/7 10:00</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="注意点・確認事項"
              icon={<AlertTriangle size={16} />}
            >
              <CheckCol
                tone="amber"
                title="データ不足"
                items={[
                  "商品別粗利未入力",
                  "ヒートマップ未連携",
                  "レビュー詳細CSV未取込",
                ]}
              />
              <CheckCol
                tone="emerald"
                title="人間が確認すべき点"
                items={["在庫確保", "ブランドトーン", "定期便条件"]}
              />
              <CheckCol
                tone="rose"
                title="表現リスク"
                items={[
                  "薬機法/景表法チェックが必要",
                  "効果効能の断定表現を避ける",
                  "広告審査との整合確認",
                ]}
              />
            </SectionCard>
          </div>
        </div>

        {/* Mobile preview */}
        <SectionCard title="商品ページプレビュー（スマホ）" icon={<Smartphone size={16} />}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="mx-auto w-full max-w-[260px] rounded-[28px] border border-slate-200 bg-slate-50 p-3 shadow-card">
                <div className="rounded-[20px] bg-white p-3 text-[11px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-500">
                    <span>≡</span>
                    <span>Sample Store</span>
                    <span>🛒</span>
                  </div>
                  <div className="mt-3 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                    抜け毛・薄毛が気になる方へ
                  </div>
                  <div className="mt-2 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-white text-3xl">
                    🧴
                  </div>
                  <div className="mt-2 text-[12px] font-bold leading-tight text-slate-900">
                    抜け毛が気になり始めた
                    <br />
                    30代からの薬用スカルプケア
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600">
                    ★★★★☆ 4.6（1,248件のレビュー）
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    定期初回20%OFF / 送料無料 / いつでも解約OK
                  </div>
                  <button className="mt-2 w-full rounded-md bg-emerald-600 py-2 text-[11px] font-semibold text-white">
                    まずは定期初回20%OFFで始める
                  </button>
                  <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-700">
                    こんな悩みありませんか？
                  </div>
                  <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                    <li>・抜け毛が増えてきた</li>
                    <li>・髪のハリ・コシが気になる</li>
                    <li>・頭皮のべたつき・ニオイが気になる</li>
                  </ul>
                </div>
                <div className="mt-2 text-center text-[11px] text-slate-500">
                  広告: 抜け毛対策・頭皮ケアをはじめるなら今
                </div>
              </div>
            </div>
            <div className="space-y-3 lg:col-span-2">
              {[
                {
                  t: "FVコピー",
                  d: "広告訴求と整合",
                  tone: "sky" as const,
                  icon: <CheckCircle2 size={14} />,
                },
                {
                  t: "レビュー導線",
                  d: "FV直下へ移動",
                  tone: "gold" as const,
                  icon: <Star size={14} />,
                },
                {
                  t: "CTA",
                  d: "定期便訴求を強化",
                  tone: "mint" as const,
                  icon: <MousePointerClick size={14} />,
                },
                {
                  t: "広告との整合",
                  d: "メッセージ一致",
                  tone: "violet" as const,
                  icon: <Megaphone size={14} />,
                },
              ].map((p) => (
                <div
                  key={p.t}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <span className="text-slate-500">{p.icon}</span>
                    {p.t}
                  </div>
                  <Pill tone={p.tone}>{p.d}</Pill>
                </div>
              ))}
              <div className="flex items-center justify-end">
                <button className="btn-primary text-sm">
                  改善版プレビューを生成
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function CheckCol({
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
