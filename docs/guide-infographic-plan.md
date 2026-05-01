# Guide v3 Infographic Plan — EC Growth Studio AI

このドキュメントは [`/app/guide`](../src/pages/Guide.tsx) の Guide v3「利用者オンボーディング」に差し込む、GPT Image 2 用インフォグラフィック案をまとめたものである。

今回の方針:

- 画像は最大3枚までに絞る
- 本PRでは画像生成を必須にしない
- 画像が未配置でも、Guide本文・表・detailsだけで意味が伝わる設計にする
- 画像内に重要説明を閉じ込めない
- 実接続済みと誤認させる文言は画像にも本文にも入れない

対応する画像枠:

| 画像パス | Guide内の位置 | 目的 |
| --- | --- | --- |
| `/guide/overview-loop.png` | 01 全体像 | AI診断 → 人間レビュー → 施策実行 → 月次報告 の月次改善ループを示す |
| `/guide/data-scope.png` | 04 データ状態の見方 | 実値 / デモ / 未接続 / 将来予定 の4区分を示す |
| `/guide/screen-map.png` | 03 画面別の使い方 | ダッシュボードを起点に各画面へ進む読み順を示す |

実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続のプロトタイプであり、画像内でも「BigQuery を接続済みと見せる」「GCP 連携が完了したように見せる」「実データと連携済みのように見せる」などの完了形表現は禁止する。

## 共通スタイル指示

以下を各プロンプトの先頭に付与する。

```text
Style: clean B2B SaaS infographic for a Japanese EC operations dashboard.
Palette: navy (#0b1e3f), slate (#0f172a), emerald (#10b981), sky (#0ea5e9), amber (#f59e0b), rose (#f43f5e), violet (#8b5cf6).
Typography: Inter / Noto Sans JP style, readable labels, no decorative fonts.
Composition: 16:9 aspect ratio, generous whitespace, clear hierarchy, not crowded.
Visual language: flat UI diagram, soft tints, simple icons, thin arrows, no photos, no real brand logos.
Language: Japanese labels only. Keep each label short, ideally within 12 Japanese characters.
Avoid: long paragraphs inside the image, stock-photo people, 3D renders, neon colors, busy textures, heavy shadows.
Do not include misleading connection-complete phrases in English or Japanese.
Forbidden Japanese meaning: do not imply BigQuery is connected, GCP integration is complete, real data integration is complete, production connection is enabled, or the integration is currently operating.
Forbidden English text: BigQuery connected, GCP integrated, production data, live data.
```

## 1. `/guide/overview-loop.png` — 月次改善ループ

目的: 初見の利用者が「このツールは何を回すものか」を1枚で理解できるようにする。

```text
Create a circular loop diagram for EC Growth Studio AI.
Four nodes arranged clockwise on a ring:
1. "AI診断" with a sparkle icon, violet accent
2. "人間レビュー" with a check icon, emerald accent
3. "施策実行" with a kanban icon, sky accent
4. "月次報告" with a document icon, navy accent

At the center, place the short label "月次EC改善".
Add a subtle clockwise arrow connecting all nodes.
Add three small side labels:
- "CSV-first"
- "人が最終判断"
- "毎月くり返す"

Bottom small note:
"実API・実AIは未接続 / CSVとデモで流れを確認"

Make it spacious and easy to understand at a glance.
```

隣接HTMLで必ず補う内容:

- AI診断は課題候補を量で出す
- 人間レビューで採用と優先順位を決める
- 施策ボードで担当・期限・期待値を管理する
- 月次レポートで翌月会議へつなぐ

## 2. `/guide/data-scope.png` — データ状態の4区分

目的: 数字の出どころを「実値 / デモ / 未接続 / 将来予定」で誤解なく示す。

```text
Create a 2x2 data scope matrix infographic.
Title: "データ状態の見方"

Quadrants:
Top-left emerald: "実値" / "CSV取込"
Top-right sky: "デモ" / "Preview限定"
Bottom-left amber: "未接続" / "実APIなし"
Bottom-right violet: "将来予定" / "Phase 3/4"

Use simple icons:
- CSV file for 実値
- database mock card for デモ
- unplugged plug for 未接続
- roadmap flag for 将来予定

Bottom note:
"Productionは安全停止 / CSV・サンプル値に戻る"

Do not imply real BigQuery, GCP, GA4, ads API, Shopify API, or AI API connection.
```

隣接HTMLで必ず補う内容:

- 実値はCSV取込で計算される
- BigQueryデモはPreview限定の固定応答であり実GCP接続ではない
- GA4 Data API / 広告API / Shopify Admin API / 実AI生成は未接続
- 実BigQueryクエリ / 認証 / 永続化 / マルチテナントは将来予定

## 3. `/guide/screen-map.png` — 画面の読み順

目的: どの画面をどの順番で見ればよいかを、初見でも迷わないように示す。

```text
Create a screen map infographic for EC Growth Studio AI.
Place "ダッシュボード" as the main starting node at the top-left or center-left.
From it, show arrows to:
- "売上要因分析"
- "AI考察"

Then show both flowing into:
- "施策ボード"

Finally show an arrow into:
- "月次レポート"

Add a loop arrow from 月次レポート back to ダッシュボード labeled "翌月へ".

Use short helper tags:
- ダッシュボード: "状態を見る"
- 売上要因分析: "原因を見る"
- AI考察: "候補を見る"
- 施策ボード: "実行する"
- 月次レポート: "次月へ"

Make the map simple, with large labels and clear arrows.
```

隣接HTMLで必ず補う内容:

- ダッシュボードは司令塔
- 売上要因分析は前月差の原因を見る
- AI考察は採用候補を見る出発点
- 施策ボードは担当・期限・期待値を埋める実行レイヤ
- 月次レポートは翌月会議の入口

## 後続PRでの差込手順

1. GPT Image 2 で上記3枚を生成する
2. 16:9 PNGとして `public/guide/` 配下へ配置する
3. ファイル名を `overview-loop.png` / `data-scope.png` / `screen-map.png` に揃える
4. `src/data/sample.ts` の `guideImagesV3` の `alt` と `caption` が画像内容と一致しているか確認する
5. `/app/guide` を desktop 1280 / 1440 / 1920 と mobile 360 で確認する

## 注意事項

- 画像がなくてもGuide本文で理解できる状態を正とする
- 画像内テキストは短くし、詳細説明はHTML本文・表・detailsに置く
- 未配置時のプレースホルダーは淡い図解枠として扱い、未完成感を強く出さない
- 実在ロゴ、実データ、認証済み風のUI、完了形の接続表現は使わない
