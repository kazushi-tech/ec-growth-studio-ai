# Guide Infographic Plan — EC Growth Studio AI

このドキュメントは [`/app/guide`](../src/pages/Guide.tsx) の各ガイドカードに差し込む
インフォグラフィック画像の **生成プロンプト案** をまとめたものである。

- 画像生成は **GPT Image 2.0** 利用を想定
- 本 PR では **画像生成は行わない**（プロトタイプ側は予定地のみ）
- 差込位置は `GuideItem.imageSlot`（[`src/data/sample.ts`](../src/data/sample.ts)）と
  1対1で対応する

実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続のプロトタイプであり、
**「BigQuery接続済み」「GCP連携完了」「実データ連携済み」のような誤認文言を画像にも入れない**。

---

## 共通スタイル指示（全カード共通の前置きとして付与）

```
Style: clean B2B SaaS infographic, soft flat illustration with subtle gradients.
Palette: navy (#0b1e3f) for primary, slate (#0f172a) for text,
emerald (#10b981) for growth/positive, sky (#0ea5e9) for in-progress,
amber (#f59e0b) for caution, rose (#f43f5e) for risk, violet (#8b5cf6) for review.
Typography: Inter / Noto Sans JP, tight tracking, no decorative fonts.
Composition: generous whitespace, centered layout, 16:9 aspect ratio.
Avoid: stock-photo people, 3D renders, neon colors, busy textures, drop shadows.

Forbidden text (English): do NOT include phrases like "BigQuery connected",
"GCP integrated", "production data", "live data" — they would mislead viewers
about real connectivity.

Forbidden text (Japanese): 以下の文言は画像内のどこにも含めない。
プロトタイプの接続状況を誤認させるため、ラベル・キャプション・吹き出しすべてで禁止:
  - 「BigQuery接続済み」
  - 「GCP連携完了」
  - 「実データ連携済み」
  - 「本番接続」
  - 「稼働中」

Language: 日本語ラベルを優先。英語ラベルは補助的に薄く配置可。

Japanese label length rule:
  - 画像内の日本語ラベルは **12文字以内** を目安にする（GPT Image 2.0 は
    長文の漢字を崩しやすいため、短いラベル中心の構成にする）。
  - 12文字を超える長文説明は **画像内に入れず**、ガイドカード側のリード文 /
    箇条書き / コールアウト側に置く（imageCaption は画像周辺の説明として扱う）。
  - 数字・記号（％ / pt / ¥ / pp / ↑↓）の併用は可。
```

---

## 1. `overview-loop` — 全体像 / 月次EC改善BPaaS とは

**目的**: 「AI診断 × 人間レビュー × 施策実行 × 月次報告」の循環を1枚で示す。

**プロンプト案**:

```
A circular loop diagram for a monthly EC improvement BPaaS product.
Four nodes arranged on a ring, connected by clockwise arrows:
  1) "AI診断" with a sparkle icon (violet)
  2) "人間レビュー" with a check-badge icon (emerald)
  3) "施策実行" with a kanban-board icon (sky)
  4) "月次報告" with a document icon (navy)
At the center: a small label "月次EC改善ループ" with a refresh icon.
Around the ring, place 3 light side-cards labeled
"CSV-first / API-later", "AI診断は出発点", "BPaaS伴走".
Bottom caption: "実 GCP / 実 API / 実 AI 未接続（CSV取込とデモMode で運用フローを再現）".
16:9, generous whitespace, soft gradients.
```

---

## 2. `monthly-loop` — 月次改善ループ 6ステップ

**目的**: 6ステップを順序付きで示し、各ステップが本プロダクトの画面に対応していることを伝える。

**プロンプト案**:

```
A horizontal 6-step pipeline infographic, left-to-right arrows between cards.
Each card has: step number (01–06), title, one-line goal, small icon.
  01 データ取込    — "注文 / GA4 / 広告 CSV 取込"        — database icon (slate)
  02 売上要因分析 — "売上 = セッション × CVR × AOV 分解" — bar-chart icon (sky)
  03 AI考察レポート — "課題4領域に整理"                  — sparkle icon (violet)
  04 施策ボード    — "担当・期限・進捗 管理"             — kanban icon (emerald)
  05 効果検証      — "翌月KPIで突き合わせ"               — line-chart icon (amber)
  06 月次レポート  — "顧客提出 / 次月会議へ"             — document icon (navy)
Below the pipeline: a curved arrow returning from 06 → 01 labeled "翌月へ".
Bottom note: "各ステップは本プロダクトの画面に1対1で対応".
16:9, B2B SaaS look.
```

---

## 3. `data-import-scope` — データ取込と未接続範囲

**目的**: 「実値 / デモ / 未接続 / 将来予定」の4区分を凡例として明示する。

**プロンプト案**:

```
A 2x2 quadrant legend infographic explaining data connectivity tiers
of the prototype.
Top-left  (emerald): "実値（CSV取込）"     — "注文 / GA4 / 広告 CSV をブラウザ内で集計"
Top-right (sky):     "デモ（BigQuery mock）" — "Preview のみ mode:'mock' を返す（実 GCP 接続ではない）"
Bottom-left (slate): "未接続（次フェーズ）" — "GA4 API / 広告API / Shopify Admin API / 実 AI 生成"
Bottom-right (amber):"将来予定"             — "実 BigQuery クエリ / 認証 / 永続化 / マルチテナント"
Center label: "本MVPで担保している4区分".
At the bottom, a single highlighted strip in red:
"避けるべき誤認: 『BigQuery接続済み』『GCP連携完了』『実データ連携済み』".
16:9, clean grid, no stock photography.
```

---

## 4. `dashboard-anatomy` — Dashboard の見方

**目的**: ダッシュボードの構成ブロックを矢印で説明する分解図。

**プロンプト案**:

```
An "anatomy of dashboard" infographic showing a stylized wireframe of the
EC Growth Studio AI dashboard on the left, and labeled callouts on the right.
Wireframe sections (top to bottom):
  - Top: "データソース切替バー（CSV / BigQueryデモ / サンプル）"
  - KPI row: 6 small cards labeled 売上 / 注文 / AOV / CVR / リピート / ROAS
  - Center-left: "AI月次診断サマリー（売上機会 / リスク / 優先施策の3カード）"
  - Center-right: "月次改善サイクル（6ステップ）"
  - Bottom-left: "優先アクションTOP5"
  - Bottom-right: "商品別改善判断"
  - Footer: "データ連携状態（実値 / デモ / 未接続 を明示）"
Right-side callouts arrow to each block.
Caption: "Why → What → Action の流れで読む".
16:9, navy + slate UI tones, soft.
```

---

## 5. `ai-review-flow` — AI考察レポートの扱い

**目的**: AI診断 → 人間レビュー → 施策ボード化 の3段階を強調する。

**プロンプト案**:

```
A 3-stage horizontal flow infographic with role separation.
Stage 1: "AI診断"
  - sparkle icon, violet
  - sub-label: "気づきの量を担保（商品 / 広告・流入 / CRM・リピート / 在庫・SKU の4領域）"
Stage 2: "人間レビュー"
  - check-badge icon, emerald
  - sub-label: "採用判断と優先順位は担当者が行う"
Stage 3: "施策ボード化"
  - kanban icon, sky
  - sub-label: "担当・期限・期待値を埋めた瞬間に運用に乗る"
Connecting arrows are labeled "出発点 → 最終判断 → 実行".
Below: a small badge "現MVPはサンプル文言（Phase 4 で Anthropic SDK + prompt cache に接続予定）".
16:9, clean B2B SaaS style.
```

---

## 6. `action-board-lanes` — 施策ボードの使い方

**目的**: カンバンレーンと、各カードに乗る情報項目を説明する。

**プロンプト案**:

```
A kanban-board infographic with 6 vertical lanes labeled left-to-right:
  "未着手" (slate) / "進行中" (sky) / "レビュー中" (amber) /
  "実装済み" (emerald) / "効果検証中" (violet) / "完了" (slate dark).
Place 1–2 sample cards in each lane. Each card shows:
  - title (e.g. "商品A FVコピー改善")
  - small badges: 担当 / 期限 / インパクト
  - footer line: 効果検証メモ
On the right, a callout box explaining:
  "AI考察レポート / 売上要因分析 / 商品ページ改善 から1クリックで送り込み、
   完了レーンのカードは月次レポートの素材になる。"
Bottom caption: "実行されない施策は無いのと同じ — 担当・期限・期待値を必ず埋める".
16:9, soft color tints per lane.
```

---

## 7. `monthly-report-anatomy` — 月次レポートの使い方

**目的**: 1ページレポートのレイアウトと、各ブロックがどの画面のデータから自動反映されるかを示す。

**プロンプト案**:

```
A "report anatomy" infographic. Left side: a stylized 1-page monthly report
with stacked sections labeled top-to-bottom:
  01 / Executive Summary
  02 / KPI推移
  03 / AI考察
  04 / 実行施策
  05 / 効果検証
  06 / 次月計画
Right side: source-of-truth icons connected to each section by dashed arrows:
  - 01 ← Dashboard
  - 02 ← KPI（CSV取込実値）
  - 03 ← AI考察レポート（現MVPはサンプル文言）
  - 04 ← 施策ボード
  - 05 ← 施策ボード「効果検証中」レーン
  - 06 ← 次月の優先施策3件（運用ループの入口）
Bottom caption: "報告で終わらせない — 月次レポートの最後を次月の優先施策3件で締める".
16:9, navy + slate.
```

---

## 8. `exec-demo-flow` — 上司デモの流れ（5〜10分）

**目的**: 5〜10分の推奨フローを所要時間つきで示す。

**プロンプト案**:

```
A horizontal timeline infographic for a 5–10 minute executive demo.
Tick marks at 0:00, 1:00, 3:00, 5:00, 7:00, 9:00, 10:00.
Stages plotted on the timeline:
  0:00–1:00 前置き         — "実 GCP / 実 API / 実 AI 未接続を必ず最初に明示" (rose)
  1:00–3:00 ダッシュボード — "KPI と AI月次診断サマリー" (navy)
  3:00–5:00 AI考察レポート — "課題4領域への分解と人間レビュー境界" (violet)
  5:00–7:00 施策ボード     — "実行管理と効果検証のレーン" (emerald)
  7:00–9:00 月次レポート   — "報告で終わらせない設計" (sky)
  9:00–10:00 締め          — "Phase 3（実 BigQuery）/ Phase 4（実 AI）ロードマップ" (slate)
A red banner across the top: "誤認文言の禁止 — 『BigQuery接続済み』『GCP連携完了』『実データ連携済み』は使わない".
16:9, B2B SaaS.
```

---

## 差込手順（後続 PR で行う）

1. GPT Image 2.0 で各プロンプトを実行（共通スタイル指示を先頭に連結）
2. 1280×720 (16:9) で書き出し、`public/guide/<imageSlot>.png` に配置
3. [`src/pages/Guide.tsx`](../src/pages/Guide.tsx) の `figure` 予定地を `<img>` に差し替え
4. 画像の `alt` には `imageCaption` を再利用
5. `docs/demo-script.md` 側のスクショ参照と整合を取る

## 注意事項

- 画像内に **`mock` / `デモ` / `予定` のラベルを必ず併記**し、誤認を避ける
- 人物写真・実在ロゴ・実 GCP / Shopify / Google ロゴは使わない
- 画像化が間に合わないカードは、本ガイドの予定地（点線枠）を残しておくこと
