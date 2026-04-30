# Phase 3A — 実装前 意思決定シート

> [`docs/phase3-ga4-bigquery-plan.md`](phase3-ga4-bigquery-plan.md) で合意した
> Phase 3 設計案（BigQuery 先行 / GA4 Data API は補助線 / 3A・3B・3C 分割）を踏まえ、
> **Phase 3A の実装に着手する前に「決め切るべきこと」を 1 枚に整理する**シート。
>
> このドキュメントは合意形成・チェックリスト用であり、ここでは **実装を一切行わない**。
> CSV-first / API-later の世界観、既存の `ImportContext` / `localStorage` / `sample.ts`
> フローを **絶対に壊さない** ことが前提。
>
> **進捗 (2026-04-30):** Phase 3A 第 1 PR で
> [`api/bq/health.ts`](../api/bq/health.ts) を導入し、サーバー側から BigQuery への
> 最小接続確認 (`SELECT 1` + dataset 存在チェック) のみを行えるようにした。
>
> **追記 (2026-04-30 第 2 PR):** 実 GCP 接続前の検証ステップとして、`BQ_MOCK_MODE=true`
> の **BigQuery デモ Mode** を導入。GCP 設定なし・課金なし・サービスアカウントなしで、
> [`api/bq/health.ts`](../api/bq/health.ts) と [`api/bq/orders-daily.ts`](../api/bq/orders-daily.ts) が
> `mode:"mock"` の固定 response を返す。Dashboard 上部の「BigQueryデモ」トグル ON で
> 売上 / 注文数 / AOV を mock summary に切り替え、データソース Pill が `BigQueryデモ`
> （emerald 系）に変わる。**実データ連携ではない / GCP コンソール未操作 / dataset・SA・
> Budget Alert は未設定**。上司デモ・社内動線確認専用。実顧客接続（パターンB）に
> 進む判断は引き続き本シート §1 を再合意してから行う。

---

## 1. Phase 3A の目的定義

Phase 3A は **目的によって実装範囲が大きく変わる** ため、最初に「どちらの目的か」を
明示的に決める。

### 1-1. パターンA: 上司デモ用の最小構成（**推奨**）

- **目的**: 上司・経営層に「BigQuery 自動取得に進むと数字が動く」動線を
  **デモデータで安全に**見せ、Phase 3 / 4 の予算と時間の合意を取る
- **接続先**: Insight Studio 既存 GCP プロジェクト内のデモ用 dataset
  （`ec_growth_demo`）に **既存サンプル CSV を BQ にロード** して使う
- **テナント**: 固定 `dummy_tenant_id`（マルチテナント不要）
- **接続先データの厳密性**: 不要（数値の整合性より「動いているように見える」を優先）
- **デモ動線**: `docs/demo-script.md` / `docs/demo-video-storyboard.md` の Phase 3A 差分
  ([phase3-ga4-bigquery-plan.md §3](phase3-ga4-bigquery-plan.md) 参照) に組み込み
- **完了条件（第2PRのデモ Mode）**:
  - Dashboard 上部の「BigQueryデモ」トグル ON で、売上 / 注文数 / AOV が mock summary に置換
  - データソース Pill が `BigQueryデモ` (緑) に切り替わる
  - UI / docs に `GCP未接続` / `デモデータ` / `mode:"mock"` を明示する
  - BQ 失敗時は CSV / サンプルへ静かにフォールバック
- **実装範囲**:
  - エンドポイント 2〜3 本（`/api/bq/health` / `/api/bq/orders-daily` / `/api/bq/orders-by-product`）
  - `orders_daily` / `orders_by_product` の 2 テーブルのみ
  - GA4 / 広告 / 統合ビューは Phase 3B 送り

### 1-2. パターンB: 実顧客接続の第一歩

- **目的**: 1 社の本番 GA4 BigQuery Export を読み、月次レポートに実値を流す
- **接続先**: 顧客 GCP プロジェクト（顧客側でサービスアカウントを発行してもらう）
- **テナント**: 最低でも **テナントID → GCPプロジェクト / dataset のマッピング層** が必要
- **接続先データの厳密性**: **必要**（数値が顧客提出物に出るため、誤差は信用問題）
- **完了条件**:
  - 顧客の本番 dataset に対してサービスアカウントから読み取り成立
  - GA4 Export 名寄せ（チャネル / 商品 / LP のゆらぎ）の運用設計が確定
  - 月次レポートの数値根拠として引用できる精度
- **実装範囲**: パターンA に加えて以下が必須:
  - テナント別接続情報の管理（環境変数では足りない → Phase 4 の永続化が前倒しになりがち）
  - GA4 / 広告 / 統合ビュー（Phase 3B 相当）まで踏み込む必要が出やすい
  - 監査ログ・読み取りクエリのログ保全
  - 顧客側 IAM ロール変更の運用ドキュメント

### 1-3. 推奨

**「まず上司デモ用の最小構成」（パターンA）から始める**。

理由:

- Phase 3 設計書の方針（BigQuery 先行・3A は最小実装）と一致
- 「主価値は売上要因分解、BigQuery は入力チャネル」という世界観
  ([insight-studio-vs-ec-growth-studio.md §6 / §7](insight-studio-vs-ec-growth-studio.md)
  および [product-spec.md §4.2](product-spec.md)) を維持できる
- 顧客接続をいきなり踏むと、Phase 4（認証・テナント分離・永続化）が前倒しになり、
  プロトタイプが BPaaS UI から外れる
- 上司デモで合意を取ってから、Phase 3B / 3C の優先順位を決め直すほうが手戻りが少ない

→ 以降の本シートの記述は **パターンA前提** で書く。パターンBに進む決定をした場合は、
  本シート §1-2 の差分を別途レビューする。

---

## 2. BigQuery / GCP 構成の選択肢

Phase 3A で BigQuery / GCP プロジェクトをどこに置くか。3 案を比較する。

### 2-1. 選択肢

#### 案A. Insight Studio 既存 GCP プロジェクトに同居

- 既存 Insight Studio で稼働中の GCP プロジェクト内に `ec_growth_demo` dataset を新設
- サービスアカウントは既存運用に追加発行 or 既存を流用（ロールは Data Viewer に絞る）

#### 案B. EC Growth Studio AI 専用 GCP プロジェクトを新規作成

- 新規 GCP プロジェクトを切り、課金・IAM・dataset を完全に独立させる
- Insight Studio の運用と切り離す

#### 案C. 顧客 GCP プロジェクトを読む形にする

- 顧客の本番 GCP プロジェクトに対し、顧客発行のサービスアカウントを使って接続
- パターンB（実顧客接続）寄り。Phase 3A スコープでは原則対象外

### 2-2. 比較表

| 観点 | A. Insight Studio 同居 | B. EC Growth Studio 専用 | C. 顧客 GCP 直読み |
| --- | --- | --- | --- |
| デモの速さ | ◎ 既存プロジェクトに dataset 追加だけ | △ プロジェクト新設・課金・IAM・予算アラートまで一式必要 | × 顧客側調整が必要で最遅 |
| セキュリティ | ○ 既存運用に乗る（Data Viewer 限定） | ◎ 完全分離 / 影響範囲最小 | △ 顧客資産に触れるため事故時の影響大 |
| コスト管理 | △ Insight Studio と同居で按分が見えにくい | ◎ Budget Alert を本プロダクト単独で設定可能 | △ 顧客請求 / 自社請求の境界設計が必要 |
| 将来の顧客接続 | ○ パターンBへ進める時に dataset 切替で対応可 | ◎ テナント別 dataset 設計と相性が良い | ◎（実態としてこれ自体が顧客接続） |
| Insight Studio 資産流用 | ◎ クエリ層・サービスアカウント運用を流用しやすい | ○ 同じ手順を新規プロジェクトに展開すれば良い | △ 顧客プロジェクト固有設計が必要 |
| 運用負荷 | ◎ 1 プロジェクト管理 | △ 2 プロジェクト管理 | × N プロジェクト管理（顧客分） |

### 2-3. 推奨

**Phase 3A は 案A（Insight Studio 既存 GCP に同居）**。

理由:

- 上司デモ用最小構成に最適。dataset 追加とサービスアカウント発行のみで動き始められる
- Insight Studio の「BigQuery 読み取りで本番稼働している」資産がそのまま活きる
- ロールを Data Viewer に絞り、dataset を `ec_growth_demo` に限定すれば、
  Insight Studio 本番データとの混線リスクは小さい

将来の方針:

- **Phase 3C で顧客接続を始める段階で、案B（EC Growth Studio 専用 GCP）への移行 or
  テナント別 dataset 設計を再検討** する。Phase 3A 時点ではこの判断を保留してよい

### 2-4. このセクションで決めること

- [ ] Phase 3A は **案A（Insight Studio 同居）** で進めて良いか
- [ ] dataset 名は **`ec_growth_demo`** で良いか
- [ ] Insight Studio 既存プロジェクトの管理者は誰か（dataset 追加権限・SA 発行権限の保有者）

---

## 3. Phase 3A の最小 dataset / table 設計

Phase 3A で **最低限必要な 2 テーブルのみ** を設計する。GA4 / 広告 / 統合ビューは
Phase 3B 送り（[phase3-ga4-bigquery-plan.md §1-2](phase3-ga4-bigquery-plan.md) 参照）。

### 3-1. dataset

- 名前: `ec_growth_demo`
- ロケーション: Insight Studio 既存 dataset と同一リージョン（`asia-northeast1` 想定 / 要確認）
- パーティション: `date` 列で日次パーティション必須（クエリ課金抑制）
- ラベル: `app=ec-growth-studio`, `env=demo`

### 3-2. `orders_daily`（日次注文集計）

| カラム | 型 | NULL | 説明 | 用途 |
| --- | --- | --- | --- | --- |
| `date` | DATE | NO | 注文日（パーティションキー） | 日次系列のキー |
| `order_count` | INT64 | NO | 注文件数（distinct order_id 相当） | Dashboard 注文数 KPI |
| `revenue` | NUMERIC | NO | 売上合計 (JPY) | Dashboard 売上 KPI / RevenueAnalysis 売上ブリッジ |
| `aov` | NUMERIC | NO | 平均注文単価 = revenue / order_count | Dashboard AOV KPI |
| `unique_customers` | INT64 | YES | ユニーク顧客数 | Dashboard 補助情報（任意） |

- **主な用途**: Dashboard の売上 / 注文数 / AOV KPI カードを BQ 値で置換
- **反映先**: [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) の上部 KPI カード 3 枚
  （CVR / リピート率 / 広告ROAS は Phase 3B / Phase 4）
- **サンプル CSV からのロード**: ◎ 既存
  [`samples/csv/orders_sample.csv`](../samples/csv/orders_sample.csv) を
  [`src/lib/csv/aggregateOrders.ts`](../src/lib/csv/aggregateOrders.ts) と同等のロジックで
  日次集計して `bq load` または `INSERT` するだけで作れる
- **Pill ソースラベル**: 第2PRでは `BigQueryデモ` / `CSV取込` / `サンプル` のいずれか。
  `BigQuery (live)` は実接続 PR まで使わない（§7参照）

### 3-3. `orders_by_product`（商品×日次）

| カラム | 型 | NULL | 説明 | 用途 |
| --- | --- | --- | --- | --- |
| `date` | DATE | NO | 注文日（パーティションキー） | 日次集計のキー |
| `product_name` | STRING | NO | 商品名 | RevenueAnalysis 商品別売上 TOP / Dashboard 商品判断 |
| `sku` | STRING | YES | SKU（任意） | 将来の商品別判断詳細化 |
| `quantity` | INT64 | NO | 数量合計 | 商品別 KPI |
| `revenue` | NUMERIC | NO | 売上合計 (JPY) | 商品別売上 TOP / 商品別判断（伸ばす / 改善 / 維持 / 停止検討） |

- **主な用途**: RevenueAnalysis 画面の商品別売上 TOP / Dashboard の商品別改善判断テーブル
- **反映先**:
  - [`src/pages/RevenueAnalysis.tsx`](../src/pages/RevenueAnalysis.tsx) 商品別売上 TOP セクション
  - [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) 商品別改善判断テーブル
- **サンプル CSV からのロード**: ◎ 既存 `orders_sample.csv` から日次×商品別で集計可能
- **クラスタリング**: `product_name` を候補に（商品別フィルタ最適化）

### 3-4. Phase 3A 範囲外（Phase 3B 送り）

- `ga4_sessions_daily` / `ga4_by_channel` / `ga4_by_landing`
- `ads_daily` / `ads_by_campaign`
- `analytics_view_monthly`（3 ソース統合ビュー）

これらは Phase 3B のスコープであり、Phase 3A の上司デモで「セッション / CVR / ROAS が
BQ で動く」必要はない。

### 3-5. このセクションで決めること

- [ ] dataset 名 `ec_growth_demo` で良いか
- [ ] ロケーション（`asia-northeast1` か他か）
- [ ] サンプルデータ投入方法（`bq load` か `INSERT` か、誰がやるか）
- [ ] `orders_daily` / `orders_by_product` の 2 テーブルだけで Phase 3A の上司デモは成立するか

---

## 4. Vercel Functions と Render FastAPI の比較

Phase 3A のバックエンドをどちらで作るか。

### 4-1. 比較表

| 観点 | Vercel Functions (Node.js) | Render FastAPI (Insight Studio 流用) |
| --- | --- | --- |
| 実装速度 | ◎ `/api` ディレクトリに置くだけで動く | △ 別リポ・別ホスト・別デプロイパイプライン |
| 既存 Vercel デプロイとの相性 | ◎ 同一プロジェクト・同一 Preview URL | × 別ドメイン or リバースプロキシが必要 |
| BigQuery SDK | ○ `@google-cloud/bigquery` (Node.js 公式) | ◎ `google-cloud-bigquery` (Python 公式 / Insight Studio で本番稼働中) |
| 認証情報の置き場所 | ○ Vercel Env (Sensitive) に Base64 エンコードしたサービスアカウント JSON | ○ Render の環境変数 / Secret Files |
| Cold start | △ 1〜3 秒（Vercel Pro / Edge Region 設定で抑制可） | ◎ 起動済みインスタンスなら瞬時 / ✕ アイドル落ち時は遅い |
| Insight Studio との共通化 | × Node 実装の二重化が発生する | ◎ クエリ層・認証層をそのまま流用 |
| Phase 4 (AI API / prompt cache) との発展性 | ○ Anthropic Node SDK は対応 / prompt cache 対応 | ◎ Insight Studio で Anthropic + prompt cache 実績あり |
| デモ運用の手軽さ | ◎ Vercel Preview で `/api/bq/*` がそのまま叩ける | △ Render と Vercel の連携テストが必要 |
| デバッグ・観測 | ○ Vercel Logs で完結 | ○ Render Logs / 既存基盤 |
| コスト | ◎ Vercel 1 本に集約 | △ Render 別課金 |

### 4-2. 推奨

**Phase 3A は Vercel Functions で最小実装、Phase 4 で Render FastAPI 統合を再判断**。

理由:

- 上司デモを成立させる最短距離が「同一 Vercel Preview で `/api/bq/*` が動く」状態
- Insight Studio との二重実装は **Phase 4 で AI 連携が入る段階** で本格的に問題になるが、
  Phase 3A の段階ではエンドポイント 3 本程度で、二重化コストは小さい
- Render FastAPI への統合は **AI API（Anthropic SDK + prompt cache）が必須化する Phase 4**
  で再判断するのが、判断材料が揃ってからの意思決定になり後戻りが少ない

将来の方針:

- Phase 3B で Vercel Functions のままエンドポイントを足し、二重実装の摩擦が顕在化したら
  Phase 4 のタイミングで Render FastAPI に集約する
- Phase 4 の AI API 連携は **prompt cache 必須**（Insight Studio と同じく）。
  この時点で Render 側に集約するか、Vercel に Anthropic Node SDK で完結させるかを判断

### 4-3. このセクションで決めること

- [ ] Phase 3A は **Vercel Functions** で開始して良いか
- [ ] Vercel ランタイムは Node.js 18+ で良いか（`@google-cloud/bigquery` 動作確認）
- [ ] Vercel プランは Hobby / Pro どちらか（Cold start と Logs 保持期間に影響）

---

## 5. 認証情報・セキュリティ方針（必須遵守項目）

Phase 3A 実装中・実装後・運用中を通して **絶対に守る** 項目。違反は商談信用の毀損 /
GCP リソース漏洩につながるため、設計レビューでチェックする。

### 5-1. 鍵・認証情報の置き場所

- **フロントエンドに GCP サービスアカウントキーを置かない**
  （React SPA / Vercel Static にバンドルしない / `import.meta.env.VITE_*` に入れない）
- **サービスアカウントキーを Git にコミットしない**
- **`.env` / `.env.local` / サービスアカウント JSON ファイルを Git にコミットしない**
  （[`.gitignore`](../.gitignore) で `.env*` は既に除外済み。SA JSON も明示的に除外する）
- **Vercel Env (Sensitive) または Render の環境変数にのみ置く**
  - サービスアカウント JSON は Base64 エンコードして 1 変数に格納
  - `GCP_SERVICE_ACCOUNT_JSON_BASE64` を Sensitive 扱いに（ログ・Preview 環境変数表示でマスク）

### 5-2. GCP IAM 最小権限

- サービスアカウントには **BigQuery Data Viewer** 相当の **読み取り専用** 権限のみ付与
- ジョブ実行が必要な場合は `BigQuery Job User` を追加（クエリ実行権限）
- **Editor / Owner / Project Viewer** は付けない
- dataset 単位で IAM を設定し、`ec_growth_demo` 以外の dataset を読めないように絞る

### 5-3. SQL インジェクション対策

- **SQL 文字列をフロントから受け取らない**
  （`?sql=...` のような API 設計は禁止）
- **API 側で固定クエリ + パラメータバリデーション**
  - クエリは Node 側のコード内に固定文字列で持つ
  - フロントから受けるのは `from`, `to`, `month`, `tenantId` 等の **パラメータのみ**
  - パラメータ化クエリ（`@from`, `@to`）で渡す

### 5-4. リクエスト制限

- **期間上限を設ける**
  - 例: `MAX_QUERY_DAYS=370`（1 リクエストあたり最大 370 日 = 約 1 年）
  - 上限超過時は 400 エラーで返す
- **CORS / allowed origins を制限**
  - 環境変数 `ALLOWED_ORIGINS` で Vercel Preview / Production の URL のみ許可
  - `*` は禁止
- **ISO 8601 (`YYYY-MM-DD`) のみ受理**。それ以外の文字列は 400

### 5-5. 監査・コスト管理

- BigQuery 側の **クエリ実行ログ** は 30 日以上保持（GCP デフォルト）
- **GCP Budget Alert** を設定（月額上限・75% / 100% 通知）
- **クエリ前のドライラン**（`dryRun: true`）でスキャンサイズを取得し、
  上限超過時はクエリを実行しない（オプション、Phase 3B 以降で導入検討）

### 5-6. このセクションで決めること

- [ ] サービスアカウントの管理者・ローテーション運用責任者は誰か
- [ ] Vercel Env (Sensitive) の編集権限を持つメンバーは誰か
- [ ] BigQuery Budget Alert の月額上限と通知先メール
- [ ] CORS で許可する Origin（Vercel Preview の動的ドメインをどう扱うか）

---

## 6. CSV / localStorage との共存方針

既存フロー（[`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx) /
[`src/lib/csv/storage.ts`](../src/lib/csv/storage.ts) /
[`src/data/sample.ts`](../src/data/sample.ts)）を **絶対に壊さない**。

### 6-1. データ優先順位（既定）

```
1. BigQuery live data        (Phase 3A で接続成功時)
2. CSV 取込 (localStorage)    (既存 Phase 1〜2.5)
3. 静的サンプル (sample.ts)    (既存)
```

### 6-2. 状態別の挙動

| 状態 | KPI / グラフに表示する値 | Pill ソースラベル | フォールバック挙動 |
| --- | --- | --- | --- |
| BigQueryデモ ON + mock 取得成功 | mock summary（売上 / 注文数 / AOV のみ） | `BigQueryデモ` (緑) | `mode:"mock"` / `GCP未接続` を表示。実接続とは扱わない |
| BigQueryデモ ON + mock 取得失敗 | CSV 取込値 → 無ければサンプル | 失敗をユーザーに **明示**（赤バナー）したうえで `CSV取込` または `サンプル` Pill | エラーバナーからデモ OFF に戻せる。CSV があれば自動でフォールバック |
| BigQueryデモ OFF / 未設定 | CSV 取込値 → 無ければサンプル | `CSV取込` または `サンプル` | 既存 Phase 2.5 と同じ |
| CSV 取込済み + BQ 未接続 | CSV 取込値 | `CSV取込` (青系) | 既存 Phase 2.5 と同じ |
| CSV 未取込 + BQ 未接続 | サンプル | `サンプル` (灰) | 既存と同じ |
| 「サンプルデータに戻す」操作後 | サンプル | `サンプル` | 既存と同じ。BigQueryデモは Dashboard ローカル state のため CSV localStorage を変更しない |

### 6-3. 既存 CSV 取込との分離

- BQ / mock 結果は **localStorage に保存しない**（容量・鮮度・セキュリティ）
- 第2PRでは Dashboard ローカル state + 小さな fetch helper に留め、SWR キャッシュは入れない
- ページ再読込時はデモトグル OFF から始める。CSV 復元はそのまま継続
- localStorage キー（`ec-growth-studio:orders-import:v1` など）は **そのまま維持**

### 6-4. 将来的な切替 UI の必要性

- 上司デモ・初期顧客接続では **「BQ あれば BQ を見る」** で十分
- ただし、商談で以下のニーズが出る可能性が高い:
  - 「CSV と BQ の差分を見たい」（数値ずれの検証）
  - 「過去の取込 CSV を再表示したい」（BQ に履歴がない期間）
  - 「サンプルでデモ録画したい」（顧客提出用）
- → **Phase 3B 以降で Pill またはセレクタによる手動切替 UI を追加検討**
  （Phase 3A では BQ トグル ON/OFF のみで足りる）

### 6-5. このセクションで決めること

- [ ] 優先順位「BQ → CSV → サンプル」で合意できるか
- [ ] BQ 失敗時のフォールバック表示は **明示（赤バナー）** か **静かに（Pill だけ変える）** か
- [ ] Phase 3A 完了時に手動切替 UI が必要か / Phase 3B 送りで良いか

---

## 7. Dashboard に出す UI の最小案

Phase 3A 第2PRで導入した **最小 UI**。実接続ではなく、GCP 実接続前の検証ステップとして扱う。

### 7-1. 候補要素

| 要素 | 役割 | 必須度 |
| --- | --- | --- |
| Dashboard 上部「BigQueryデモ」トグル | mock summary と CSV / サンプル値の切替 | 必須 |
| データソース Pill（`BigQueryデモ` / `CSV取込` / `サンプル`） | 現在表示中のソースを明示 | 必須 |
| 最終取得時刻（"取得: 12:34:56"） | キャッシュ鮮度の可視化 | 推奨 |
| 取得件数（"レコード: 30 件"） | 想定通りに引けたかの確認 | 推奨 |
| レイテンシ（"レスポンス: 240ms"） | デモでの「速い感」演出 | 任意 |
| 失敗時のフォールバック表示（赤バナー） | BQ 失敗を明示しつつ CSV / サンプルへ降りる | 必須 |

### 7-2. 設置場所の候補

- **トグル + Pill**: Dashboard 画面上部（[`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx)
  の KPI カード行の直前）
- **最終取得時刻 / 件数 / レイテンシ**: Dashboard 上部の小バッジ or フッター
- **失敗バナー**: KPI カード行の直上

### 7-3. 触る候補ファイル（実装は今回しない）

- [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) — KPI カード上部に切替 UI / Pill / バナーを実装済み
- [`src/components/ui/Pill.tsx`](../src/components/ui/Pill.tsx) — 既存 tone（`mint` / `sky` / `slate`）を再利用。tone 追加なし
- [`src/lib/bq/`](../src/lib/bq/) — Dashboard 用の小さな fetch helper / DTO / KPI変換を追加
- 必要に応じて Topbar に小さくソース表示を出す検討

### 7-4. このセクションで決めること

- [ ] トグルの設置場所は Dashboard 上部か Topbar か
- [ ] Pill の tone マップに `live` / `csv` / `sample` を足す配色（既存 emerald / sky / slate と整合するか）
- [ ] レイテンシ表示は出すか出さないか（出すと毎回チラつく副作用あり）

---

## 8. Phase 3A 実装時のファイル変更候補

Phase 3A 第2PR時点で触ったファイル / ディレクトリの一覧。

### 8-1. 新規作成（API側）

- [`api/bq/health.ts`](../api/bq/health.ts) ✅ **第1PRで実装済み**
  — Vercel Functions エンドポイント。BQ 接続確認用（`SELECT 1` 相当）。
  dataset 存在確認 / projectId マスク / レイテンシ計測 / CORS / CONFIG_MISSING フォールバック対応。
- [`api/bq/orders-daily.ts`](../api/bq/orders-daily.ts) ✅ **第2PRで mock mode 実装**
  — `BQ_MOCK_MODE=true` の場合のみ mock 注文日次データを返す。実 BigQuery クエリは未実装
- `api/bq/orders-by-product.ts` 🟡 後続PR
  — `orders_by_product` テーブルから期間指定で取得（Phase 3A スコープに含めるかは要判断）

### 8-2. 新規作成（共通ロジック）

- [`src/lib/bq/client.ts`](../src/lib/bq/client.ts)
  — フロント側 fetch ラッパー（`/api/bq/orders-daily` のみ。タイムアウト / リトライ / SWR は未導入）
- [`src/lib/bq/types.ts`](../src/lib/bq/types.ts)
  — `BqOrdersDaily` の DTO 型
- [`src/lib/bq/buildKpisFromBqDemo.ts`](../src/lib/bq/buildKpisFromBqDemo.ts)
  — mock summary を Dashboard KPI（売上 / 注文数 / AOV）に流し込む
- `src/lib/data-source/DataSourceContext.tsx` (新規) または既存
  [`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx) の **拡張**
  — どちらにするかは §8-5 参照

### 8-3. 既存ファイルの変更

- [`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx) — BigQueryデモトグル / Pill / エラーバナー追加。
  Dashboard ローカル state で mock / CSV / サンプルを切替
- [`src/components/ui/Pill.tsx`](../src/components/ui/Pill.tsx) — 変更なし
- [`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx) — 変更なし（CSV localStorage key を維持）

### 8-4. 設定・ドキュメント

- [`.env.example`](../.env.example) — `BQ_MOCK_MODE=true` と既存 GCP キーの扱いを追記。
  `BQ_MOCK_MODE` は `VITE_` を付けないサーバー側 env
- `vercel.json` — `/api/bq/*` ルーティング、ランタイム指定（必要なら）
- [`docs/product-spec.md`](product-spec.md) — Phase 3A 完了状況を §4.2 / §6 に追記
- `README.md` — Phase 表 / 環境変数セクションを更新

### 8-5. ImportContext を拡張するか / DataSourceContext を新設するか

両方の方針を比較してから決める。

| 方針 | メリット | デメリット |
| --- | --- | --- |
| 既存 [`ImportContext`](../src/lib/csv/ImportContext.tsx) を拡張して `bqOrdersDaily` などを足す | 1 Context で完結 / 既存 hook が動き続ける | CSV と BQ の関心が混ざる / 名前が CSV 寄りで意味が変わる |
| 新しい `DataSourceContext` を新設し、`ImportContext` を内部で参照する | 関心が分離 / Phase 3B 以降の拡張がきれい | 1 Context 増える / Provider のネストが深くなる |

→ **第2PRの判断**: まず Dashboard ローカル state + `src/lib/bq/*` の小さな helper に留める。
  `ImportContext` は CSV 取込状態だけを引き続き持つ。Phase 3B で画面横断の必要が出た時に
  `DataSourceContext` 新設を再検討する。

### 8-6. このセクションで決めること

- [ ] DataSourceContext 新設方針で良いか
- [ ] Phase 3A で `orders-by-product` まで踏むか、`orders-daily` の 1 本だけに絞るか

---

## 9. 実装前チェックリスト

Phase 3A の実装着手 **直前** に、以下を 1 項目ずつ確認する。

### 9-1. GCP / BigQuery

- [ ] GCP プロジェクトが決まっている（推奨: 案A = Insight Studio 同居）
- [ ] dataset `ec_growth_demo` のロケーションが決定済み（`asia-northeast1` 等）
- [ ] サービスアカウントが発行済み（Data Viewer + Job User、Owner 等は付けていない）
- [ ] サービスアカウント JSON が **Base64 エンコード** されている
- [ ] `orders_daily` / `orders_by_product` のテーブルが作成済み
- [ ] サンプルデータ（`samples/csv/orders_sample.csv` 由来）が投入済み
- [ ] パーティション（`date`）が設定済み

### 9-2. Vercel Env

- [ ] `GCP_PROJECT_ID` が Production / Preview / Development に設定済み
- [ ] `GCP_SERVICE_ACCOUNT_JSON_BASE64` が **Sensitive** で設定済み
- [ ] `BQ_DATASET=ec_growth_demo` が設定済み
- [ ] `ALLOWED_ORIGINS` に Preview / Production の URL が設定済み
- [ ] `MAX_QUERY_DAYS=370` 等の上限が設定済み

### 9-3. セキュリティ

- [ ] フロントエンドに **GCP サービスアカウントキーを置いていない**
- [ ] `.env` / `.env.local` / SA JSON ファイルが **Git にコミットされていない**
  （`git status` / `git ls-files` で確認）
- [ ] [`.gitignore`](../.gitignore) で `.env*` / `*service-account*.json` 等が除外されている
- [ ] サービスアカウント権限が **読み取り専用** に絞られている
- [ ] API 側で SQL 文字列をフロントから受け取らない設計になっている
- [ ] 期間バリデーション（ISO 8601 / 上限日数）が実装されている
- [ ] CORS が `ALLOWED_ORIGINS` のみ許可になっている
- [ ] GitHub Secret Scanning / Vercel Logs にキーが漏れていない

### 9-4. UI / UX

- [ ] BQ トグルの設置場所が決定済み（推奨: Dashboard 上部）
- [ ] データソース Pill の配色が既存 tone マップと整合
- [ ] BQ 失敗時のフォールバック表示（バナー / Pill）の文言が決定済み
- [ ] 「サンプルデータに戻す」操作で BQ トグルが OFF に戻るか

### 9-5. CSV fallback

- [ ] BQ 失敗時に CSV 取込値が自動で表示されるか（既存 [`ImportContext`](../src/lib/csv/ImportContext.tsx) を壊していないか）
- [ ] CSV 未取込 + BQ 失敗時にサンプル ([`src/data/sample.ts`](../src/data/sample.ts)) が表示されるか
- [ ] localStorage キーが既存と互換（`ec-growth-studio:*-import:v1`）

### 9-6. デモ運用

- [ ] 上司デモの動線が `docs/demo-script.md` / `docs/demo-video-storyboard.md` に追記済み
- [ ] デモ前の Warm-up リクエスト手順がある（Cold start 対策）
- [ ] デモ録画用にサンプル数値が「動いて見える」値域になっている

### 9-7. コスト

- [ ] GCP Budget Alert が月額上限で設定済み（75% / 100%）
- [ ] Vercel プランの Function 実行時間 / 帯域に余裕があるか
- [ ] BQ クエリのスキャンサイズ想定が記録されている（パーティション利用前提）

### 9-8. Production smoke

- [ ] Vercel Production / Preview で `/api/bq/health` が 200 を返す
- [ ] Vercel Production / Preview で `/api/bq/orders-daily?from=...&to=...` が想定 JSON を返す
- [ ] Dashboard でトグル ON → 数字が BQ 値に置換、Pill が緑になる
- [ ] BQ をわざと失敗させた時 (例: dataset 名を一時的に間違える) に CSV / サンプルへ自動フォールバックする
- [ ] CSV 取込が破壊されていない（既存 Phase 1〜2.5 の動線を一通り再確認）

---

## 10. Go / No-Go 判断

**以下がすべて満たされた時のみ Phase 3A 実装に着手する**。

### 10-1. Go 条件

- [ ] **デモ目的が「上司デモ用」（パターンA）と確認済み**
- [ ] **dataset の置き場所が決定済み**（推奨: 案A / `ec_growth_demo` / Insight Studio 同居）
- [ ] **サービスアカウントの管理者・ローテーション責任者が決定済み**
- [ ] **Vercel Env に置く情報が決定済み**（§5-1 / §9-2 のキー一覧）
- [ ] **BigQuery の月額上限 / Budget Alert 方針が決定済み**
- [ ] **CSV fallback を壊さない方針で合意済み**（§6 の優先順位 / §9-5 のチェック）
- [ ] **エンドポイント本数が決定済み**（推奨: `/api/bq/health` + `/api/bq/orders-daily`、
  `orders-by-product` を含めるか判断済み）
- [ ] **DataSourceContext の方針が決定済み**（§8-5 / 推奨は新設）
- [ ] **デモ動線が `docs/demo-script.md` 等で文章化済み**（実装後の差し替え原稿でも可）

### 10-2. No-Go 条件（1 つでも該当する場合は実装に進まない）

- 目的が「実顧客接続」（パターンB）でブレている → §1 を再合意
- GCP プロジェクト / dataset の所有者が不明 → §2 を再決定
- サービスアカウントキーをフロントに置こうとしている兆候 → §5 を即時是正
- Budget Alert 未設定 → §5-5 を先に対応
- 既存 CSV / localStorage / sample.ts のフローを壊す方針が混入している
  → §6 を再確認、AGENTS.md §4 の「禁止事項」を再読

### 10-3. 着手後の Review gate

- 実装第 1 PR で `/api/bq/health` が動いた段階で **codex-review** をかける
  （`/.claude/CLAUDE.md` の「Review gate」ルール準拠）
  → 2026-04-30 第1PR 提出済み（`feat/phase3a-bq-health`）。次のステップは codex review。
- Phase 3A 完了 PR の前にもう 1 度レビュー → 必要なら再修正

---

## 付録. 参考リンク

- [`docs/phase3-ga4-bigquery-plan.md`](phase3-ga4-bigquery-plan.md) — Phase 3 全体設計案
- [`docs/product-spec.md`](product-spec.md) §4.2 接続スタンス / §6 次にやるべきこと
- [`docs/insight-studio-vs-ec-growth-studio.md`](insight-studio-vs-ec-growth-studio.md) §6 / §7
- [`docs/demo-script.md`](demo-script.md) / [`docs/demo-video-storyboard.md`](demo-video-storyboard.md)
- [`AGENTS.md`](../AGENTS.md) §4 編集時のルール / §5 段階的実装の優先順位
- [`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx) — DataSourceContext 拡張ベース
- [`src/lib/csv/storage.ts`](../src/lib/csv/storage.ts) — localStorage 永続化レイヤー
- [`src/data/sample.ts`](../src/data/sample.ts) — 静的サンプルデータ
