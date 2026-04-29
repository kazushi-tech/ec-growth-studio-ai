# Project Instructions for Claude Code — EC Growth Studio AI

このリポジトリは **月次EC改善BPaaS** の UIプロトタイプである。
Claude Code はこのファイルと `AGENTS.md` / `docs/` を出発点として作業すること。

## TL;DR

- React + TypeScript + Vite + Tailwind の **静的MVP**
- サンプルデータは `src/data/sample.ts` に集約。これを起点にUI改善を進める
- 高単価B2B SaaS / BPaaS のトーン: **Navy基調・余白・カード・落ち着き**
- **CSV-first / API-later** の世界観を絶対に崩さない
- 認証・実APIは未実装。実装計画は `docs/product-spec.md` の「次にやるべきこと」を参照

## 必読ドキュメント

1. `AGENTS.md` — 全エージェント向け運用ガイド（最重要）
2. `docs/product-spec.md` — プロダクト仕様 / 画面別要件 / 未実装範囲
3. `docs/ui-guidelines.md` — デザイン原則 / カラー / コンポーネント規約

迷ったら、まず上の3つを読み直す。

## 作業フロー

1. **目的確認**: 何を、どの画面で、どのデータを使って実現するのか言語化する
2. **既存資産の確認**: `components/ui/*` と `src/data/sample.ts` で実現できないか
3. **小さく実装**: ページ単位でレイアウトを完成させる
4. **`npm run build` で確認**: 型エラー / 未使用 import を残さない
5. **docs を同時更新**: 仕様変更があれば spec / ui-guidelines も追従させる

## やってよいこと

- 既存ページの情報設計改善・余白調整・コピー調整
- `components/ui/` への小さな共通コンポーネント追加
- `src/data/sample.ts` の拡充（既存型と整合する範囲で）
- ルート追加 / Sidebar項目追加（product-spec.md と同期する）
- インタラクション追加（フィルタ・モーダル・並び替え）

## やってはいけないこと

- 本番APIキー・認証情報のコミット
- 重量級依存の独断追加（chart.js / antd / mui / next 等）
- Tailwind 動的クラス名（`bg-${color}-500`）
- 静的MVPの根幹（Sidebar構成、ナビ色、メイン6画面）の独断破壊
- LPに書いてある **「CSVだけで開始OK」「Shopify APIは任意」** の打ち消し

## 命名・スタイル

- ファイル: PascalCase でコンポーネント、camelCase で関数・型
- 色は Tailwind トークン経由のみ（直書きHEXは index.css とfaviconのみ）
- アイコンは lucide-react のみ
- 文字色: 本文 `text-slate-700/800`、補足 `text-slate-500`、見出し `text-slate-900`
- 半端な絵文字は避ける（プレビュー領域の限定箇所のみOK）

## コミット粒度

- 1 PR / 1 コミットに「ひとつの目的」だけを乗せる
- 大きな機能追加は `docs/product-spec.md` 更新を同梱
- 自動生成と手作業を混ぜない（diffレビューしづらくなる）

## 詰まったら

- 既存ページの該当領域を読み直す（Dashboard / ActionBoard / DataImport が情報設計の指針になる）
- `Pill.tsx` の tone マップが「色 = 意味」のルール集
- `Sparkline.tsx` が「依存ナシで軽量を作る」テンプレート
- それでも詰まる場合は、ユーザに **AskUserQuestion** で確認する
