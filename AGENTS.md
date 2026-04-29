# AGENTS.md — EC Growth Studio AI

> このファイルは、コードベースで作業する **AIエージェント（Claude Code / Codex / Cursor / 自律エージェント等）** が
> 一貫した判断をするための運用ガイドである。

## 0. 立ち位置

EC Growth Studio AI は **月次EC改善 BPaaS** の **UIプロトタイプ**。
本実装は **静的サンプルデータで動く React + TS + Vite + Tailwind の MVP**。
実データ・API連携・本番バックエンドは **意図的に未実装**。

エージェントの仕事は次の3つ:

1. **MVPの世界観を崩さない**: CSV-first / API-later、AI診断 × 人間レビュー、月次運用ループ。
2. **UI品質を維持する**: 高単価B2B SaaS / BPaaSの質感（ナビ基調・余白・カード構成・配色）。
3. **段階的に実装を厚くする**: サンプル→CSVパース→API→AI連携 の順で「価値→精度→自動化」と進める。

## 1. リポジトリ構造

```
ec-growth-studio-ai/
├─ src/
│  ├─ App.tsx                # ルーティング
│  ├─ main.tsx               # エントリ + BrowserRouter
│  ├─ index.css              # Tailwindトークン & ユーティリティ
│  ├─ components/
│  │  ├─ layout/             # Sidebar / Topbar / AppLayout
│  │  └─ ui/                 # KpiCard / SectionCard / Pill / Sparkline / ScoreBar / StepFlow
│  ├─ pages/
│  │  ├─ Landing.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ AiReport.tsx
│  │  ├─ ProductPage.tsx
│  │  ├─ ActionBoard.tsx
│  │  ├─ DataImport.tsx
│  │  ├─ MonthlyReport.tsx
│  │  └─ NotFound.tsx
│  └─ data/sample.ts         # 静的サンプルデータ（DTOの起点）
├─ docs/
│  ├─ product-spec.md        # プロダクト仕様 / 画面別要件 / 未実装範囲
│  └─ ui-guidelines.md       # デザイン原則 / カラー / コンポーネント
├─ .claude/project-instructions.md
├─ AGENTS.md                 # このファイル
├─ tailwind.config.js
├─ vite.config.ts
├─ tsconfig.json
├─ tsconfig.node.json
├─ index.html
├─ package.json
└─ public/favicon.svg
```

## 2. 技術スタック

- React 18 + TypeScript（strict）
- Vite 5（dev / build）
- Tailwind CSS 3.4（`tailwind.config.js` でNavyトークン拡張）
- React Router DOM 6
- lucide-react（線アイコンのみ）
- Sparkline は **依存ナシで自前のSVG描画**（軽量・カスタマイズ容易）

依存を追加する前に必ず: 既存コンポーネントで実現できないか、軽量実装で代替できないか確認すること。

## 3. 起動・確認

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # 本番ビルド
npm run lint     # tsc --noEmit
```

UIが見られる主要URL:
- `/` — LP
- `/app` — ダッシュボード
- `/app/ai-report` — AI考察レポート
- `/app/product-page` — 商品ページ改善
- `/app/action-board` — 施策ボード
- `/app/data-import` — データ取込・連携
- `/app/monthly-report` — 月次レポート出力

## 4. 編集時のルール

### 必ず守ること
- **`src/data/sample.ts` を単一のサンプル供給源として扱う**。各ページ内に値を直書きしない（小さなUI文字列を除く）。
- **新しい色は使わない**。`tailwind.config.js` の navy/slate/emerald/rose/amber/sky/violet パレットで完結させる。
- **動的クラス名禁止**（`bg-${tone}-500` のような書き方）。Tailwindパージで消える。`Pill.tsx` のように静的マップで分岐する。
- **アイコンは lucide-react のみ**。絵文字は限定箇所のみ（プレビュー枠の中など）。
- **Pill / KpiCard / SectionCard / ScoreBar / Sparkline は再利用する**。新規ローカル実装を作らない。
- **CSV-first / API-later の文言を消さない**。LPやDataImport画面の核となるメッセージ。

### 推奨
- セクションは **`SectionCard` でラップ** + アイコン + 右肩アクションを揃える。
- テーブルは `.table-clean` ユーティリティに統一。
- 状態は **Pill の tone マップ** に集約（Pill.tsx の `judgmentTone` / `impactTone` / `effortTone` / `priorityTone` / `statusTone`）。
- 小さなセクション（FAQ / Bullet）は `<details>` や `<ul>` の素朴な構造で表現する。
- 大きな新コンポーネントを作る前に、既存の組み合わせで足りないか検討する。

### 禁止
- 本番バックエンドや外部APIへの接続コードのコミット（環境変数なし、認証なしのMVP段階）。
- 認証情報・トークンを含むファイルの追加。
- `package.json` への重量級依存追加（chart.js / recharts / antd 等）— 議論なしには追加しない。
- 既存のサンプル数値の意味なき変更（LP・スクリーンショット・docsとの整合が崩れる）。

## 5. 段階的実装の優先順位

1. **インタラクション補強**
   - 施策ボードのカードドラッグ（`@dnd-kit/core`）
   - フィルタ・検索の動作
   - 各テーブル行クリックで詳細パネル表示
2. **CSV取込の最初の1本**
   - `papaparse` で注文CSVを読み、`Kpi` を実値で再計算
   - 列マッピング UI（候補から選択）
3. **AI考察の生成**
   - Anthropic SDK で月次データから AI考察レポートを生成
   - レポートのキャッシュ（Anthropic prompt cache）を必ず有効化
4. **永続化**
   - Supabase でテナント / レポート / 施策を永続化
   - Edge Functions で AI生成と取込ジョブをバックグラウンド化
5. **出力**
   - 月次レポートPDF（@react-pdf/renderer or print stylesheet）
6. **API連携**
   - Shopify Admin API（注文・商品・在庫）
   - GA4 Data API
   - Meta / Google 広告

## 6. ブランチ・コミット運用

- main = 動く状態を維持。`npm run build` が通ること。
- ブランチは `feat/xxx` `fix/xxx` `docs/xxx` のプレフィックス推奨。
- コミットメッセージは「なぜ」を1文で。"add" "update" "fix" の使い分けを守る。
- 大きな変更（新画面・新依存）は **docs/product-spec.md と docs/ui-guidelines.md を同時更新**。

## 7. レビュー観点（自己チェックリスト）

- [ ] サンプルデータ起点でレンダリングできているか
- [ ] 既存の `SectionCard` / `Pill` / `KpiCard` を再利用しているか
- [ ] 動的Tailwindクラスを使っていないか
- [ ] `npm run build` が通るか
- [ ] レスポンシブ崩れがないか（特に lg / xl ブレイクポイント）
- [ ] CSV-first / AI診断×人間レビュー / 月次運用 の世界観を強化しているか

## 8. 質問が必要な場合

エージェントが自動実装で迷う典型シーン:

- **新しい指標カードを追加してよいか** → `src/data/sample.ts` の `kpis` 配列に追加し、Dashboard と AiReport の両方に反映するかを確認する。
- **API連携の取込タイミング** → 本MVPでは行わない。`docs/product-spec.md` の「未実装範囲」を更新する。
- **AI生成テキストの自動化** → 段階的実装の優先順位3に該当。先に2（CSV取込）を済ませてから着手する。
- **画面の追加** → product-spec.md にエントリを追加し、Sidebar に項目を追加する。
