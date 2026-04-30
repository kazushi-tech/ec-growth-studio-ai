import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import SectionCard from "../components/ui/SectionCard";
import GuideHero from "../components/guide/GuideHero";
import GuideReadingPath from "../components/guide/GuideReadingPath";
import GuideToc from "../components/guide/GuideToc";
import GuideSection from "../components/guide/GuideSection";
import {
  guideHeroV2,
  guideReadingPathsV2,
  guideChaptersV2,
} from "../data/sample";

/**
 * /app/guide — Guide Page v2 (説明サイト風)。
 * 構造: Hero / Reading path / sticky TOC / 5章 (live infographic 入り) / 次に読むもの。
 * 計画書: docs/guide-v2-plan.md
 */
export default function Guide() {
  return (
    <>
      <Topbar
        title="ガイド"
        subtitle="初見の上司・社内関係者・候補顧客・運用担当が、月次EC改善BPaaS の世界観と使い方を5〜10分で理解できるようにする"
        actions={
          <Link to="/app" className="btn-primary px-3 py-1.5 text-xs">
            ダッシュボードへ
          </Link>
        }
      />

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <GuideHero hero={guideHeroV2} />

        <div className="mt-5">
          <GuideReadingPath paths={guideReadingPathsV2} />
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <GuideToc chapters={guideChaptersV2} />
          </aside>

          <div className="mt-5 space-y-6 lg:mt-0">
            {guideChaptersV2.map((c) => (
              <GuideSection key={c.id} chapter={c} />
            ))}

            {/* フッター案内 — 次に読むもの */}
            <SectionCard title="次に読むもの" icon={<ChevronRight size={16} />}>
              <ul
                className="grid gap-3 text-sm text-slate-700 md:grid-cols-3"
                aria-label="関連ドキュメント"
              >
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
                    Guide v2 再設計計画
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    docs/guide-v2-plan.md
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-600">
                    本ページの章立てとアクセシビリティ改善の根拠。
                  </p>
                </li>
              </ul>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  );
}
