# EC Growth Studio AI — Product Specification (MVP)

## 1. プロダクト概要

**EC Growth Studio AI** は、Shopify/EC事業者向けの **月次EC改善BPaaS** である。
レポートで終わらせるのではなく、AI診断 → 人間レビュー → 実行管理 → 月次報告まで
1つの運用ループに統合し、毎月の売上改善サイクルを回すことを目的とする。

- 対象顧客: 月商 100万〜5,000万円規模の EC / D2C 事業者
- 提供形態: SaaS UI ＋ BPaaS 伴走（人間レビュー・月次会議・効果検証）
- 価格帯: 初回診断 / 月次運用 / BPaaS伴走 の3段階で個別提案

### バリュープロポジション
1. **CSV-first / API-later** — Shopify API なしでも CSV だけで月次改善を開始できる
2. **AI診断 × 人間レビュー** — 自動診断は出発点で、最終判断は担当者がする運用設計
3. **実行管理が中心** — 施策ボードで担当・期限・進捗・効果検証まで管理
4. **月次レポートに直結** — AI診断と施策実行結果が月次報告書に自動反映

## 2. 月次運用ループ（コアプロセス）

```
CSV/API取込 → AI診断 → 人間レビュー → 施策ボード → 効果検証 → 月次レポート
                                                          ↑
                                                  翌月比較 / 次月会議
```

各ステップが本プロダクトの画面に対応する:

| Step | 画面 | 役割 |
| ---- | ---- | ---- |
| 1 | データ取込・連携 | CSV/API でEC全体のデータを集約 |
| 2 | 売上要因分析 | 売上 = セッション × CVR × AOV に分解し主因候補を特定 |
| 3 | AI考察レポート | 売上課題・改善機会・リスクを分解 |
| 4 | ダッシュボード | KPIと優先施策を一覧化（司令塔） |
| 5 | 商品ページ改善 / その他施策 | 個別領域の改善案を具体化 |
| 6 | 施策ボード | 担当・期限・進捗・効果検証を管理 |
| 7 | 月次レポート | 顧客提出用レポートに整理 |

## 3. 画面別仕様（MVP範囲）

### 3.1 Landing Page (`/`)
- ヒーロー: バリュー文 + 主要CTA（月次改善相談 / CSV診断）+ ダッシュボードのモック
- 課題提起 4枚: 「データ分散」「指標横断不可」「実行に落ちない」「報告が次に繋がらない」
- 月次運用フロー 6ステップの可視化
- 機能要約（6画面 / 連携API）/ ターゲット / 導入事例 / 料金プラン3種 / FAQ / フッターCTA

### 3.1.1 売上要因分析 (`/app/revenue-analysis`)

GA4 / BigQuery の本接続前段階として、売上変動を要因分解して「次に何を直すべきか」を判断する画面。
**分析者向けのワークベンチではなく、EC担当者向けの月次運用画面** という立ち位置で設計する。

#### 構造

- 上部サマリー: 前月売上 / 今月売上 / 売上差分（金額・%）+ 主因候補のヘッドライン
- 要因分解カード（3列）: セッション数 / CVR / AOV ごとに「前月」「今月」「変化率」「売上への影響」を表示
- 売上ブリッジ: 前月売上 → セッション影響 → CVR影響 → AOV影響 → 今月売上 を横棒で段階表示（`Tailwind + 軽量SVG/div` のみ）
- 原因候補: 流入 / 商品ページCVR / カート・決済 / AOV / 在庫・商品 のカテゴリ別 + 商品 / チャネル / 全体のスコープ
- 次の一手（推奨アクション候補）: 領域 / 工数 / 優先度 / 送り先（施策ボード or AI考察レポート）
- 分析に必要なデータ: 注文CSV（取込済み）/ GA4 CSV（取込済み）/ 広告CSV（取込済み）/ BigQuery（将来・読み取り）
- 「この画面の役割」コピー: GA4 / BigQuery を読む画面ではなく、判断する画面であることを明示

#### モデル

- `RevenueAnalysis` を `src/data/sample.ts` に追加
- `RevenueFactor` / `RevenueCause` / `RevenueNextAction` / `RevenueDataReadiness` を内包
- 売上 = セッション数 × CVR × AOV の構造を仮置きし、影響額は概算として表示

#### 未実装範囲

- BigQuery 直接接続による実データ反映（GA4 / 広告は CSV 取込で半実データ化済み。Phase 3 で BigQuery に置き換え予定）
- 影響額の厳密な対数分解（現状は近似表示）
- 推奨アクションを施策ボードに送る実装（UIはあるがロジックは未実装）

### 3.2 ダッシュボード (`/app`)
- 上部: 6つのKPIカード（売上・注文・AOV・CVR・リピート率・広告ROAS）+ Sparkline
- AI月次診断サマリー（売上機会 / リスク / 優先施策の3カラム）+ 月次改善サイクルのStep可視化
- 優先アクションTOP5 のテーブル + 商品別改善判断テーブル（伸ばす / 改善 / 維持 / 停止検討）
- 最新インサイト + 次に実行すべきこと + データ連携状態

### 3.3 AI考察レポート (`/app/ai-report`)
- AI総合診断 + 数値根拠（KPI＋スパークライン）
- 課題の分解（商品ページ / 広告 / CRM / 在庫の4領域）
- AI改善提案テーブル（インパクト/工数/優先度/担当領域/期限/状態）
- 出力サイドバー（月次レポート出力・施策追加・ページ改善案・広告改善案）
- 実行前チェック（人間が確認すべき点 / データ不足 / リスク）

### 3.4 商品ページ改善 (`/app/product-page`)
- 対象商品サマリー（KPI + AIメモ + 改善優先度）
- 商品ページ診断 8項目（FV / 画像 / 説明 / レビュー / CTA / 価格 / スマホ / 広告整合）
- Before / After 改善案
- AI推奨施策テーブル
- スマホプレビュー + 注意点（薬機法/景表法）

### 3.5 施策ボード (`/app/action-board`)
- 施策サマリー（施策数 / 完了 / 進行中 / レビュー中 / 想定インパクト / 完了目標）
- フィルタバー（領域 / 優先度 / 担当者 / 検索）
- カンバン 5列（未着手 / 進行中 / レビュー中 / 実装済み / 効果検証中）
- 各カードに領域・対象商品・優先度・担当・期限・想定効果・AI考察・必要データ・次アクション
- 効果検証パネル（実装前後CVR比較 + 推移チャート + AI判定）
- BPaaS運用情報（次回定例 / 顧客確認待ち / 社内対応中）

### 3.6 データ取込・連携 (`/app/data-import`)
- ECサイト連携の考え方（ECサイトはお客さまが保有する Shopify 等を想定。当サービスは保有しない分析・運用レイヤー）
- GA4 / BigQuery 接続準備（必要権限・GCPプロジェクトID・dataset 名・読み取り専用権限のチェックリスト）
- データ接続サマリー（接続済み / 未接続 / 最新取込 / AI診断データ充足率 / 診断ステータス）
- データソース一覧テーブル（Shopify注文 / 商品 / 在庫 / 商品画像 / レビュー / GA4 / 広告 / キャンペーン / CRM）
- AI診断への影響（現在可能な分析 / 追加データで広がる分析 / 不足で保留される分析）
- CSVアップロードゾーン + テンプレート取得 + 取込履歴
- API連携カード（Shopify / GA4 / Google広告 / Meta広告 / BigQuery）
- 「CSVだけで月次診断可能」を強調する CSV-first の思想を明示

### 3.7 月次レポート出力 (`/app/monthly-report`)
- レポートサマリー（対象月 / 対象ストア / 完成度 / 提出ステータス）
- レポート構成プレビュー 8セクション
- 編集・確認ステータス（AI生成 → 担当レビュー → 顧客提出可 → 提出）
- レポート本文プレビュー（結論 / 影響 / 主要施策 / 次月アクション）
- 出力形式（PDF / PowerPoint / Google Slides / 共有リンク / Notion / Google Docs）
- 顧客提出前チェック（数値 / 表現 / 薬機法 / データ不足注記 / 担当者承認）

## 4. データモデル（プロトタイプ範囲）

`src/data/sample.ts` に静的サンプルとして定義:

- `Kpi` — 月次主要指標 + Sparkline
- `Action` — 施策（領域/インパクト/工数/優先度/担当/期限/状態/AI考察/必要データ/次アクション）
- `Product` — 商品別判断（伸ばす/改善/維持/停止検討/要調査）
- `DataSource` — データ接続状態
- `Insight` — 課題領域とAI考察
- `ReportSection` — 月次レポートのセクションと進捗
- `productPageDiagnosis` / `productPageActions` / `cycleSteps` / `monthlyStats`

将来的に Supabase / Postgres 等のバックエンドへ移行する際は、これらの型をそのまま
DTO の起点として利用する想定。

## 4.1 CSV-first MVP（注文CSV取込）

CSV-first / API-later の世界観を本物にするため、注文CSVをアップロードして
売上・注文数・AOV を実値で再計算する最小フローをプロトタイプに同梱する。
取込結果はブラウザ内 `localStorage` に保存し、ページ再読込後も直前の成功取込を復元する。
AI API・Shopify API・DB永続化はまだ含めない。

### 対応カラム（最小セット）

注文CSVは以下のカラムを必須／任意で要求する。カラム名は表記ゆれを許容し、
パース時に正規化（小文字 + アンダースコア化）してマッピングする。

| 内部キー | 役割 | 受理する列名（例） |
| --- | --- | --- |
| `order_id` | 注文番号（必須） | order_id / orderid / order / 注文id / 注文番号 / 受注番号 |
| `order_date` | 注文日（必須） | order_date / date / 注文日 / 受注日 / purchased_at / created_at |
| `customer_id` | 顧客ID（任意） | customer_id / customerid / customer / 顧客id / 顧客番号 |
| `product_name` | 商品名（必須） | product_name / product / item / 商品名 / アイテム名 / title |
| `quantity` | 数量（必須） | quantity / qty / 数量 / 個数 / count |
| `total_sales` | 売上（必須） | total_sales / total / sales / 売上 / amount / price / subtotal |

- 数値は `¥`, `￥`, `,`, 全角スペース, `円` を除去してから `Number` で解釈
- 日付は `YYYY-MM-DD` / `YYYY/MM/DD` / ISO8601 を許容（`/` を `-` に正規化）
- ヘッダー前後の `BOM` / 空白はトリムする

### 計算

取込が成功したら以下を計算し、ダッシュボードKPIに反映する。

- **売上合計** = `Σ total_sales`
- **注文数** = `distinct(order_id)` 件数
- **AOV** = 売上合計 ÷ 注文数
- **ユニーク顧客数** = `distinct(customer_id)` 件数（任意項目があるときのみ意味を持つ）
- **商品別売上 上位** = `product_name` 単位で集計、売上降順で TOP5

### バリデーションと警告

| 種類 | 取扱 |
| --- | --- |
| 必須カラム不足 | エラーとして表示し取込を停止 |
| `order_id` / `product_name` が空 | その行をスキップし警告 |
| 日付不正・数値不正・負の値 | その行をスキップし警告 |
| Papa Parse の構文エラー | 行番号付きで警告 |
| CSVが空 / ヘッダーが取れない | エラー扱い（取込結果は0件） |

### UI

- `/app/data-import` の CSVアップロードゾーンが、ドラッグ&ドロップ + クリック選択の両方に対応
- 取込が成功すると **「注文CSV 取込結果」** セクションが現れ、売上 / 注文数 / AOV / 取込件数 / 商品別売上TOP / 警告 / エラー / 検出カラム一覧を表示
- 「サンプルデータに戻す」または下部アクションバーの「サンプルデータで試す」で取込状態をクリア
- ダッシュボード上部に「CSV取込済み: ファイル名」のバナーを表示し、KPIカードの売上 / 注文数 / AOV を取込値に置換
- KPIカードの CVR / リピート率 / 広告ROAS は注文CSVから導出できないため、サンプルのまま「CSV未対応」と表示
- CSVテンプレートは `/samples/orders_sample.csv` からダウンロード可能（リポジトリ内 `samples/csv/orders_sample.csv` と同一）

### 永続化と将来拡張

- 取込結果は React Context（`ImportProvider`）で画面間共有し、成功取込のみ `localStorage` に保存する
- 失敗取込（必須カラム不足 / 空CSV 等）は `lastFailure` として画面表示するが、Dashboardや `localStorage` には反映しない
- DB永続化（Supabase 等）、商品CSV / 在庫CSV、AI診断 API、Shopify API は次フェーズ（GA4 CSV / 広告CSV は Phase 2 / 2.5 で取込済み）

## 4.1.1 GA4 CSV Phase 2（半実データ化）

注文CSVに加えて GA4 CSV を取込み、売上要因分析（`/app/revenue-analysis`）の
セッション数・CVR・チャネル別 / LP別 内訳を実値で反映する。
本フェーズでも BigQuery / GA4 Data API / OAuth / GCP認証 / AI API には進まない。
GA4 CSV は **BigQuery 本接続前の検証ステップ** として位置づける。

### 対応カラム（最小セット）

GA4 CSV は以下のカラムを必須／任意で要求する。`date` と `sessions` のみ必須。
カラム名は表記ゆれを許容し、注文CSVと同じ正規化（小文字 + アンダースコア化）でマッピングする。

| 内部キー | 役割 | 受理する列名（例） |
| --- | --- | --- |
| `date` | 日付（必須） | date / event_date / 日付 |
| `sessions` | セッション数（必須） | sessions / セッション / セッション数 |
| `users` | ユーザー数（任意） | users / active_users / ユーザー / ユーザー数 |
| `purchases` | 購入数（任意・CVR算出に使用） | purchases / transactions / purchase / 購入 / 購入数 |
| `total_revenue` | GA4売上（任意） | total_revenue / revenue / purchase_revenue / 売上 |
| `channel` | 流入チャネル（任意） | channel / session_default_channel_group / source_medium / 流入元 |
| `landing_page` | ランディングページ（任意） | landing_page / page_path / lp / ランディングページ |

- GA4 BigQuery export 由来の `YYYYMMDD` 文字列を含む `event_date` も日付として解釈する
- 数値列は注文CSVと同じく `¥` `,` 全角スペース `円` を除去してから `Number` で解釈
- `sessions` が不正値・負値の行はスキップして警告を出す

### 集計

取込が成功したら以下を計算し、売上要因分析画面に反映する。

- `totalSessions` = Σ sessions
- `totalUsers` = Σ users（列があれば）
- `totalPurchases` = Σ purchases（列があれば）
- `totalRevenue` = Σ total_revenue（列があれば）
- `cvr` = totalPurchases ÷ totalSessions（purchases 列があるときのみ）
- `topChannels` = channel 単位で集計、セッション降順 TOP5
- `topLandingPages` = landing_page 単位で集計、セッション降順 TOP5
- `periodStart` / `periodEnd` = 取込CSVの日付範囲

### 売上要因分析への反映ルール

`/app/revenue-analysis` 画面では、取込状態に応じて以下のとおり「実値」「推定値」を切り替える:

| 状態 | セッション | CVR | AOV | 主因候補/ヘッドライン |
| --- | --- | --- | --- | --- |
| GA4 CSV のみ取込 | GA4実値 | GA4実値（purchases 列あり時） | 推定値（静的サンプル） | ルールベースで再計算 |
| 注文CSV のみ取込 | 推定値 | 推定値 | 注文CSV実値 | ルールベースで再計算 |
| 注文CSV + GA4 CSV 取込 | GA4実値 | GA4実値 | 注文CSV実値 | ルールベースで再計算 |
| いずれも未取込 | 推定値 | 推定値 | 推定値 | 静的サンプル文言を維持 |

- 前月値は静的サンプルのみ（前月分のCSVは扱わない）→ UI上「推定」ラベルを併記
- 売上 = セッション × CVR × AOV を **連鎖法** で要因分解し、3要因の影響額の合計が
  売上差分にちょうど一致するように計算する
- 「主因候補」は最も売上を押し下げた（押し上げた）要因に応じて以下のルールベース文言を出力:
  - セッション最大マイナス → 流入チャネル見直し
  - CVR最大マイナス → 商品ページ・カート/決済導線見直し
  - AOV最大マイナス → オファー設計・単価ミックス見直し
- 各要因カードに「GA4実値 / 注文CSV実値 / 推定値」のソースラベル（Pill）を付与する
- GA4 CSV に channel / landing_page 列があれば、画面下部にチャネル別 / LP別 CVR テーブルを表示

### バリデーションと永続化

- 必須カラム（`date` / `sessions`）不足は **エラーとして表示** し、売上要因分析には反映しない
- 直前に成功した GA4 取込があれば、失敗があっても上書きしない（注文CSV取込と同じ挙動）
- 成功取込のみ `localStorage`（key: `ec-growth-studio:ga4-import:v1`）に保存し、再読込で復元
- 注文CSV / GA4 CSV はそれぞれ独立した取込状態として保持し、個別に解除可能

### UI

- データ取込・連携画面（`/app/data-import`）でアップロード前に **「注文CSV / GA4 CSV」をトグル** で選択
- GA4 CSV テンプレートを `/samples/ga4_sample.csv` から取得可能
- 取込結果として **セッション数 / ユーザー数 / 購入数 / CVR / GA4売上 / 上位チャネル / 上位LP / 警告 / 検出カラム** を表示
- 「外部送信なし / メモリ・ブラウザ保存のみ」の注記を維持

### 未実装範囲（Phase 2 時点）

- BigQuery / GA4 Data API / Google広告 API / Shopify Admin API への直接接続
- OAuth / GCP認証 / サービスアカウント
- AI診断ロジック（Claude/GPT 等）
- 永続化バックエンド・マルチテナント・PDF出力

GA4 CSV 取込で「セッション × CVR × AOV」を実値化したのちは、Phase 2.5 で
広告CSVを足してチャネル別 ROAS / CVR を組み合わせ済み。次フェーズ（Phase 3）で
BigQuery 直接接続による自動更新化に進む想定。

## 4.1.2 広告CSV Phase 2.5（広告効率の半実データ化）

注文CSV / GA4 CSV に続いて、広告CSVを取込み、売上要因分析の原因候補と
施策候補に **チャネル別 ROAS / CPC / CVR** を組み込む。
本フェーズでも Google広告 / Meta広告 API / OAuth / GCP認証 / AI API には進まない。
広告CSVは **媒体管理画面のエクスポート** を直接受け取る位置づけ。

### 対応カラム（最小セット）

広告CSVは以下のカラムを必須／任意で要求する。表記ゆれは注文CSV / GA4 CSV と
同じ正規化（小文字 + アンダースコア化）でマッピングする。

| 内部キー | 役割 | 受理する列名（例） |
| --- | --- | --- |
| `campaign` | キャンペーン名（必須） | campaign / campaign_name / ad_group / キャンペーン / キャンペーン名 |
| `channel` | 媒体（必須） | channel / platform / media / source / 媒体 / 媒体名 |
| `date` | 配信日（必須） | date / day / 日付 / 配信日 |
| `cost` | 広告費（必須） | cost / spend / amount_spent / 広告費 / 費用 / 消化金額 |
| `impressions` | 表示回数（任意） | impressions / imp / 表示回数 |
| `clicks` | クリック数（任意） | clicks / click / クリック / クリック数 |
| `conversions` | コンバージョン（任意） | conversions / conv / purchases / transactions / 購入 / 購入数 |
| `revenue` | 広告経由売上（任意・ROAS算出に使用） | revenue / conversion_value / value / 売上 / 広告経由売上 |
| `product_name` | 紐付け商品（任意） | product_name / product / item / 商品名 |

- `cost` は注文CSV / GA4 CSV と同じ正規化（`¥` / `,` / 全角スペース / `円` を除去）で `Number` に変換
- 日付は `YYYY-MM-DD` / `YYYY/MM/DD` / ISO8601 / `YYYYMMDD` を許容
- `campaign` または `channel` が空の行はスキップして警告

### 集計

取込が成功したら以下を計算し、売上要因分析画面 / DataImport に反映する。

- `totalCost` / `totalImpressions` / `totalClicks` / `totalConversions` / `totalRevenue`
- 全体 `cpc` = totalCost ÷ totalClicks（clicks 列ありの時のみ）
- 全体 `ctr` = totalClicks ÷ totalImpressions（両列ありの時のみ）
- 全体 `cvr` = totalConversions ÷ totalClicks（両列ありの時のみ）
- 全体 `roas` = totalRevenue ÷ totalCost（revenue 列ありの時のみ）
- `topChannels` / `topCampaigns` = それぞれ広告費降順 TOP5
- `inefficientCampaigns` = 効率悪化キャンペーン候補 (最大3件)
  - revenue 列ありの場合: ROAS &lt; 全体平均 × 0.7 のキャンペーンを抽出
  - revenue 列無し / clicks/conversions ありの場合: クリックCVR &lt; 全体平均 × 0.5 のキャンペーンを抽出

### 売上要因分析への反映ルール

`/app/revenue-analysis` 画面では、広告CSV取込状態に応じて以下を **追加** する
（注文CSV / GA4 CSV の反映ロジックは 4.1.1 と同じ）:

| 状態 | 追加されるもの |
| --- | --- |
| 広告CSV 未取込 | 静的サンプルの原因候補 / 次の一手のみ |
| 広告CSV のみ取込 | 広告効率の原因候補 + 広告配分の次の一手を上部に追加。GA4 / 注文の要因分解は静的サンプル |
| 注文CSV + 広告CSV | 売上 / AOV を実値化。広告効率の原因候補 / 配分施策が原因候補リスト先頭に追加 |
| GA4 + 広告CSV | セッション / CVR を実値化。広告効率の原因候補 / 配分施策が追加 |
| 注文CSV + GA4 + 広告CSV | セッション × CVR × AOV を実値化 + 広告効率まで原因に展開（フル反映） |

- 「流入減」だけでなく **「広告効率悪化」「予算配分見直し」** のカテゴリで原因候補を出す
- 「次の一手」には **広告配分の見直し / 効率悪化キャンペーン停止 / ROAS最良チャネル拡張** を追加
- 期待値（想定 ROAS / 広告費削減額）はルールベース概算
- 広告CSV取込時のみ、広告チャネル別効率テーブル + 効率悪化キャンペーンセクションを画面下部に追加

### バリデーションと永続化

- 必須カラム（`campaign` / `channel` / `date` / `cost`）不足は **エラーとして表示** し、
  売上要因分析には反映しない
- 直前に成功した広告取込があれば、失敗があっても上書きしない
- 成功取込のみ `localStorage`（key: `ec-growth-studio:ads-import:v1`）に保存し、再読込で復元
- 注文CSV / GA4 CSV / 広告CSV はそれぞれ独立した取込状態として保持し、個別に解除可能

### UI

- データ取込・連携画面（`/app/data-import`）で **「注文CSV / GA4 CSV / 広告CSV」を3トグル** で選択
- 広告CSV テンプレートを `/samples/ads_sample.csv` から取得可能
- 取込結果として **広告費 / クリック数 / CPC / CVR / ROAS / チャネル別TOP / キャンペーン別TOP / 効率悪化キャンペーン / 警告 / 検出カラム** を表示
- 「外部送信なし / メモリ・ブラウザ保存のみ」の注記を維持

### 未実装範囲（Phase 2.5 時点）

- Google広告 API / Meta広告 API / Shopify Admin API への直接接続
- OAuth / GCP認証 / サービスアカウント
- BigQuery 直接接続（次フェーズ）
- AI診断ロジック（Claude/GPT 等）
- 永続化バックエンド・マルチテナント・PDF出力
- D&D（注文CSV / GA4 CSV と同じくクリック&ドラッグの両方は対応済みだが、ファイル並列処理は未対応）

## 4.2 接続スタンス（Shopify / GA4 / BigQuery / 広告）

本サービスは **EC事業者が保有する EC基盤を分析・運用する月次改善レイヤー** であり、
ECサイト自体（Shopify ストア・楽天店舗・自社カート等）を当サービス側で保有・構築することはない。
顧客が既に運用しているEC基盤に対し、注文CSV / GA4 / 広告 / BigQuery を **読み取り専用** で受け取り、
売上要因分解 → AI考察 → 施策ボード → 月次レポートに変換する。

### 主価値の置き場所

ユーザーに見せる主価値は **「GA4 / BigQuery に接続できること」ではない**。
主価値は **「売上変動の原因分解と次アクション化」** にある。
GA4 / BigQuery は **そのための入力チャネル** として位置づけ、UIではセカンダリな扱いにする。

### GA4 / BigQuery 接続準備（実装範囲外）

将来の連携に向けて、UI上は接続準備を可視化するに留める。本MVPでは
**実API接続 / OAuth / GCP認証 / BigQuery クエリ実行 は行わない**。
顧客側で事前に揃えていただくべき項目を、接続準備チェックリストとして UIで明示する:

- GA4プロパティの **閲覧権限**（サービスアカウント想定）
- GA4の **BigQuery Export を有効化**
- **GCPプロジェクトID**
- **BigQuery dataset 名**（例: `analytics_xxxxxxxxx`）
- 上記すべてに対して **読み取り専用** の権限のみ付与

### 段階的に厚くする計画

- **Phase 1（完了）**: CSV-first MVP。注文CSVで売上 / 注文数 / AOV を実値化
- **Phase 1.5（完了）**: 注文CSV取込結果を `localStorage` に永続化し、再読込で復元可能に
- **Phase 2（完了）**: GA4 CSVエクスポートを取り込み、セッション × CVR × AOV を半実データ化
- **Phase 2.5（完了）**: 広告CSVを取り込み、チャネル別 ROAS / CVR / 広告費効率を要因分解に接続
- **Phase 3（未着手 / 設計案あり）**: BigQuery 読み取り接続。Insight Studio で構築済みの BigQuery分析基盤を、
  EC向けの売上要因分解にそのまま接続して自動更新化する。設計案は
  [`docs/phase3-ga4-bigquery-plan.md`](phase3-ga4-bigquery-plan.md) を参照。
  Phase 3A（最小実装 = 上司デモ用）/ 3B（GA4・広告・統合ビュー）/ 3C（実顧客接続）に分割
- **Phase 4（未着手）**: GA4 Data API / 広告API / Shopify Admin API の直接連携、
  AI診断ロジック（Anthropic SDK + prompt cache）、Supabase永続化、認証、PDF / PowerPoint出力

## 5. 未実装範囲（プロトタイプ時点）

- 注文CSV / GA4 CSV / 広告CSV 以外（商品 / 在庫 / レビュー / CRM）のパース・マッピング
- 取込結果のDB永続化（現在はブラウザ内 `localStorage` のみ）
- Shopify Admin API / GA4 Data API / Google広告 API / Meta広告 API / BigQuery 直接接続（OAuth / GCP認証 / クエリ実行を含む）
- AI診断ロジック（Anthropic SDK / GPT 等への委譲含む。prompt cache 必須で設計予定）
- 認証・認可・マルチテナント・組織管理
- 永続化バックエンド（Supabase / Edge Functions など）
- レポート PDF / PowerPoint / Google Docs 生成
- 効果検証の実データ計測
- 通知・Slack / メール連携
- 施策カードの D&D 並び替え
- モバイル最適化レイアウトの全面対応（一部のみ最適化済）

## 6. 次にやるべきこと

CSV-first MVP の Phase 1 〜 Phase 2.5 が完了したため、当面の優先順位は
**プロダクトを「売れる状態」にする** ための導線整理と上司デモ・初回商談支援に置く。
本格的なバックエンド実装（Phase 3 / Phase 4）は商談で得られた優先項目を踏まえてから着手する。

1. **上司デモ・商談導線整理（最優先）**
   - `docs/demo-script.md` の 5分版 / 10分版台本に沿った画面遷移リハーサル
   - LP / `/app/data-import` / `/app/revenue-analysis` の文言統一（CSV-first / API-later が常に伝わる状態に）
   - 「未実装の質問」への回答テンプレートを最新化（Phase 表と整合）
2. **デモ用CSV / サンプル整備**
   - `samples/csv/orders_sample.csv` / `ga4_sample.csv` / `ads_sample.csv` の3点を最新版で同梱
   - 取込デモ後に「サンプルデータで試す」で確実にクリアできることの動作確認
3. **インタラクション補強（商談で要望が出やすい順）**
   - 施策カードのドラッグ移動（`@dnd-kit/core`）
   - 施策ボード / 商品テーブルのフィルタ動作・並び替え
   - 各リスト項目から詳細パネル / モーダルへの遷移
4. **AI連携の最初の1本（Phase 4 着手の最有力候補）**
   - Anthropic SDK で AI考察レポートを生成（**prompt cache を必須**で実装）
   - 生成内容のキャッシュ・人間レビュー前提の UI を維持
5. **月次レポート出力（PDF / PowerPoint）**
   - `@react-pdf/renderer` または print stylesheet による試験実装
   - 顧客提出前チェックの UI と組み合わせる
6. **永続化バックエンド**
   - Supabase + Edge Functions でテナント / レポート / 施策を永続化
7. **認証**
   - Clerk / Supabase Auth で組織アカウント / 役割管理 / 操作ログを導入
8. **API直接連携（読み取り専用）**
   - BigQuery → GA4 Data API → Google広告 / Meta広告 → Shopify Admin API の順
