# EC Growth Studio AI

> **月次EC改善 BPaaS** — Shopify / EC事業者向けに、AI診断 × 人間レビュー × 実行管理 × 月次報告を1つの運用ループに統合する SaaS / BPaaS プロトタイプ。

CSVから始めて、商品ページ・広告・CRM・在庫を横断した改善を毎月回すための司令塔UIです。
本リポジトリは **静的MVPプロトタイプ**（サンプルデータで動作）です。

---

## 起動方法

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # 本番ビルド
npm run preview  # ビルド成果物のローカル確認
```

Node 18 以上推奨（開発は Node 24 で確認）。

## 実装済み画面

| URL | 画面 | 役割 |
| --- | ---- | ---- |
| `/` | LP | プロダクト紹介・価値訴求・CTA |
| `/app` | ダッシュボード | KPI / AI診断サマリー / 優先施策 / 商品別判断 |
| `/app/ai-report` | AI考察レポート | 課題分解・AI推奨施策・実行前チェック |
| `/app/product-page` | 商品ページ改善 | 8項目診断 / Before-After / スマホプレビュー |
| `/app/action-board` | 施策ボード | カンバン5列・効果検証・BPaaS運用情報 |
| `/app/data-import` | データ取込・連携 | CSV-firstの取込 / API連携 / AI診断充足率 |
| `/app/monthly-report` | 月次レポート出力 | レポート構成 / プレビュー / 出力形式 / 提出前チェック |

## アーキテクチャ概要

- **React 18 + TypeScript + Vite 5 + Tailwind 3**
- ルーティング: React Router DOM 6
- アイコン: lucide-react
- スパークライン / ドーナツ / プログレスバーは依存ライブラリなしの軽量SVG実装
- サンプルデータ: `src/data/sample.ts`（DTO の起点）

詳細は以下のドキュメントを参照:

- [`docs/product-spec.md`](docs/product-spec.md) — プロダクト仕様 / 画面別要件 / 未実装範囲
- [`docs/ui-guidelines.md`](docs/ui-guidelines.md) — デザイン原則 / カラー / コンポーネント規約
- [`AGENTS.md`](AGENTS.md) — エージェント向け運用ガイド
- [`.claude/project-instructions.md`](.claude/project-instructions.md) — Claude Code 用の指示

## 未実装範囲（明示）

- CSVパース・実データ取込
- Shopify / GA4 / 広告 / BigQuery API連携
- AI診断ロジック（Anthropic / OpenAI API 呼び出し）
- 認証・組織管理・マルチテナント
- 永続化バックエンド（DB / ストレージ）
- レポートPDF / PowerPoint 出力
- 効果検証の実データ計測

`docs/product-spec.md` の「次にやるべきこと」に段階的実装の優先順位を記載しています。

## サーバー側 環境変数（Phase 3A 着手中）

Phase 3A 第1PR で `/api/bq/health`（Vercel Functions）を追加した。
実値は **必ず Vercel Env (Sensitive)** に設定し、リポジトリにはコミットしない。
キー一覧は [`.env.example`](.env.example) を参照。

| Key | 用途 |
| --- | --- |
| `GCP_PROJECT_ID` | 接続先 GCP プロジェクトID |
| `GCP_SERVICE_ACCOUNT_JSON_BASE64` | サービスアカウント JSON を base64 化したもの（**Sensitive**） |
| `BQ_DATASET` | 参照する dataset 名（デフォルト `ec_growth_demo`） |
| `BQ_LOCATION` | dataset ロケーション（デフォルト `asia-northeast1`） |
| `ALLOWED_ORIGINS` | CORS で許可する Origin（カンマ区切り） |
| `MAX_QUERY_DAYS` | 1 リクエストあたりの最大期間（後続 PR で利用） |

> サービスアカウント JSON 本体・private_key・client_email を `.env.local` 含め
> どこにも平文で残さない。Base64 化した値のみを Vercel Env に登録すること。

## ライセンス

社内プロトタイプ。外部公開時は別途調整。
