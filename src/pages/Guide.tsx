import {
  BookOpen,
  Image as ImageIcon,
  ChevronRight,
  Info,
  Compass,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import Pill from "../components/ui/Pill";
import { guideItems } from "../data/sample";
import type { GuideTone } from "../data/sample";

// Tailwind は動的クラス生成を許さないため、tone → 固定クラス文字列の対応表を持つ。
const toneStyles: Record<
  GuideTone,
  {
    headerBar: string;
    stepBadge: string;
    imageBorder: string;
    calloutBorder: string;
    bulletDot: string;
  }
> = {
  navy: {
    headerBar: "bg-navy-900",
    stepBadge: "bg-navy-900 text-white",
    imageBorder: "border-navy-200 bg-navy-50/40",
    calloutBorder: "border-navy-200 bg-navy-50/40 text-navy-900",
    bulletDot: "bg-navy-700",
  },
  sky: {
    headerBar: "bg-sky-500",
    stepBadge: "bg-sky-500 text-white",
    imageBorder: "border-sky-200 bg-sky-50/40",
    calloutBorder: "border-sky-200 bg-sky-50/40 text-sky-900",
    bulletDot: "bg-sky-500",
  },
  mint: {
    headerBar: "bg-emerald-500",
    stepBadge: "bg-emerald-500 text-white",
    imageBorder: "border-emerald-200 bg-emerald-50/40",
    calloutBorder: "border-emerald-200 bg-emerald-50/40 text-emerald-900",
    bulletDot: "bg-emerald-500",
  },
  gold: {
    headerBar: "bg-amber-500",
    stepBadge: "bg-amber-500 text-white",
    imageBorder: "border-amber-200 bg-amber-50/40",
    calloutBorder: "border-amber-200 bg-amber-50/40 text-amber-900",
    bulletDot: "bg-amber-500",
  },
  violet: {
    headerBar: "bg-violet-500",
    stepBadge: "bg-violet-500 text-white",
    imageBorder: "border-violet-200 bg-violet-50/40",
    calloutBorder: "border-violet-200 bg-violet-50/40 text-violet-900",
    bulletDot: "bg-violet-500",
  },
  rose: {
    headerBar: "bg-rose-500",
    stepBadge: "bg-rose-500 text-white",
    imageBorder: "border-rose-200 bg-rose-50/40",
    calloutBorder: "border-rose-200 bg-rose-50/40 text-rose-900",
    bulletDot: "bg-rose-500",
  },
};

export default function Guide() {
  return (
    <>
      <Topbar
        title="ガイド"
        subtitle="初見の上司・社内関係者・クライアント候補が、月次EC改善BPaaS としての世界観と使い方を5〜10分で理解できるようにする"
        actions={
          <Link to="/app" className="btn-primary px-3 py-1.5 text-xs">
            ダッシュボードへ
          </Link>
        }
      />

      <div className="space-y-5 px-6 py-5">
        {/* イントロ — ガイドの目的と前提 */}
        <SectionCard
          title="このガイドの目的"
          icon={<BookOpen size={16} />}
          action={
            <Pill tone="gold">
              <AlertCircle size={11} /> 画像差込前 / GPT Imageで生成予定
            </Pill>
          }
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Compass size={14} className="text-navy-700" />
                何ができるツールか
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Shopify / EC 事業者向けの「月次EC改善 BPaaS」を、
                AI診断 → 人間レビュー → 実行管理 → 月次報告の運用ループとして体感できるプロトタイプ。
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Sparkles size={14} className="text-violet-600" />
                どう使い始めるか
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                CSV-first 設計のため、注文 / GA4 / 広告 CSV
                をブラウザに取込めば、その場で売上 / CVR / ROAS が実値で動く。
                API なしで月次運用フローを開始できる。
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
                <Info size={14} />
                必ず最初に伝える前提
              </div>
              <p className="mt-2 text-xs leading-6 text-amber-900">
                実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続。
                CSV取込（実値）と BigQueryデモ Mode（接続後の見え方の再現）の2系統で運用フローを示す。
              </p>
            </div>
          </div>
        </SectionCard>

        {/* 8 つのガイドカード */}
        <div className="grid gap-5">
          {guideItems.map((item) => (
            <GuideCard key={item.id} item={item} />
          ))}
        </div>

        {/* フッター案内 */}
        <SectionCard title="次に読むもの" icon={<ChevronRight size={16} />}>
          <ul className="grid gap-3 text-sm text-slate-700 md:grid-cols-3">
            <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="text-xs font-semibold text-slate-700">
                プロダクト仕様の正本
              </div>
              <p className="mt-1 font-mono text-[11px] text-slate-500">
                docs/product-spec.md
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                画面別仕様 / データ接続状況 / Phase ロードマップ。
              </p>
            </li>
            <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="text-xs font-semibold text-slate-700">
                上司デモ台本
              </div>
              <p className="mt-1 font-mono text-[11px] text-slate-500">
                docs/demo-script.md
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                5〜10分で説明する場合の話す内容と注意点。
              </p>
            </li>
            <li className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="text-xs font-semibold text-slate-700">
                ガイドのインフォグラフィック計画
              </div>
              <p className="mt-1 font-mono text-[11px] text-slate-500">
                docs/guide-infographic-plan.md
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                各カードに差し込む画像の生成プロンプト案を整理。
              </p>
            </li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}

function GuideCard({ item }: { item: (typeof guideItems)[number] }) {
  const styles = toneStyles[item.tone];
  const callout = item.callout;
  const calloutStyles = callout ? toneStyles[callout.tone] : null;

  return (
    <section className="card overflow-hidden">
      <div className={`h-1 w-full ${styles.headerBar}`} aria-hidden />
      <div className="grid gap-5 px-5 py-5 lg:grid-cols-12">
        {/* 左: ヘッダ + リード + 箇条書き + コールアウト */}
        <div className="space-y-4 lg:col-span-7">
          <header className="flex flex-wrap items-start gap-3">
            <span
              className={`inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold ${styles.stepBadge}`}
            >
              {item.step}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                {item.lead}
              </p>
            </div>
          </header>

          <ul className="space-y-2">
            {item.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2.5 text-sm leading-6 text-slate-700"
              >
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${styles.bulletDot}`}
                  aria-hidden
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {callout && calloutStyles && (
            <div
              className={`rounded-xl border px-4 py-3 text-xs leading-6 ${calloutStyles.calloutBorder}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
                <Info size={12} />
                {callout.label}
              </div>
              <p className="mt-1.5">{callout.body}</p>
            </div>
          )}

          {item.link && (
            <Link
              to={item.link.to}
              className="inline-flex items-center gap-1 text-xs font-medium text-navy-700 hover:text-navy-900"
            >
              {item.link.label}
              <ChevronRight size={12} />
            </Link>
          )}
        </div>

        {/* 右: 画像差込予定地（インフォグラフィック未差込） */}
        <div className="lg:col-span-5">
          <figure
            className={`flex h-full min-h-[180px] flex-col justify-between rounded-xl border border-dashed p-4 text-[11px] ${styles.imageBorder}`}
          >
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <ImageIcon size={14} />
              インフォグラフィック予定地
            </div>
            <div className="mt-3 flex flex-1 items-center justify-center text-center text-slate-500">
              <span className="font-mono text-[10px] uppercase tracking-wide">
                slot: {item.imageSlot}
              </span>
            </div>
            <figcaption className="mt-3 text-[11px] leading-5 text-slate-500">
              {item.imageCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
