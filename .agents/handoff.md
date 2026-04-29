# .agents/handoff.md — EC Growth Studio AI

> 任意のAIエージェント（Claude Code / Codex / Cursor 等）共通の最小ハンドオフ。
> 詳細は `AGENTS.md` と `.claude/project-instructions.md` を参照。

## このリポジトリの正体

**月次EC改善BPaaS** の **静的MVPプロトタイプ**。
React 18 + TypeScript + Vite 5 + Tailwind 3。サンプルデータで全画面が動く。
バックエンド・本物のAI連携・認証・実APIは **意図的に未実装**。

## 守るべき3点

1. **CSV-first / API-later** の世界観を崩さない（LP・DataImport の文言を消さない）
2. **AI診断 × 人間レビュー × 月次運用** の3軸を弱めない
3. **高単価 B2B SaaS の質感**：Navy基調 / 余白 / 控えめなカード（`rounded-xl`）/ lucide アイコン / 過度な装飾NG

## 触ってよい場所

- `src/pages/*` — 既存6画面 + LP + NotFound
- `src/components/ui/*` — 共通プリミティブ
- `src/components/layout/*` — Sidebar / Topbar / AppLayout / MobileNav
- `src/data/sample.ts` — 型定義つきの単一サンプル供給源
- `docs/*.md` — 仕様とUIガイドラインを必ず同期更新

## やってはいけないこと

- 動的Tailwindクラス（`bg-${color}-500`）。Pillの tone マップで分岐する
- 重量級依存の独断追加（chart.js / recharts / antd / mui / next 等）
- 認証情報・APIキーのコミット
- 実装済みSidebar項目から外れる「未実装画面」へのリンク追加（NotFoundに飛ぶ壊れナビ禁止）

## 最低限のチェック

```sh
npm run build    # tsc --noEmit + vite build
npm run dev      # http://localhost:5173
```

ビルドが通る・LPと6画面が表示される・モバイル（< lg）でハンバーガーから主要ナビが開く、を満たすこと。

## 次にやるべきこと（凍結中）

1. 施策ボードのD&D
2. papaparse でCSV → KPI再計算
3. Anthropic SDK でAI考察生成（prompt cache 必須）
4. 永続化（Supabase）
5. PDF出力
6. API連携

→ 詳細は `docs/product-spec.md` の「次にやるべきこと」を参照。
