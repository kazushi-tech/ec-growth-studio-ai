# Phase 3 — GA4 / BigQuery 連携 設計案

> Phase 1 (注文CSV) / Phase 2 (GA4 CSV) / Phase 2.5 (広告CSV) が完了した状態から、
> 実データ接続に進むための **設計の叩き台**。本ドキュメントは合意形成用であり、
> ここに書かれた範囲の **実装はまだ行わない**。

---

## 0. 位置づけと前提

- **目的**: 売上要因分解 → AI考察 → 月次レポートの数値を、CSV のみではなく
  GA4 / BigQuery 実データで安定供給できる状態を作る
- **接続方針**: Insight Studio で本番稼働中の BigQuery 読み取り基盤を **技術転用** する
- **世界観の維持**: 主価値は「BigQuery に繋がること」ではなく
  **「売上変動の原因分解と次アクション化」**。BigQuery は入力チャネルにすぎない
  （[`docs/insight-studio-vs-ec-growth-studio.md`](insight-studio-vs-ec-growth-studio.md) §6 / §7 と整合）
- **CSV-first / API-later の維持**: 既存の `ImportContext` / `localStorage`
  ([`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx)) フローは絶対に壊さない。
  BigQuery / API は **追加データソース層** として並列に持つ

### Phase 3 の範囲外（明示）

- Shopify Admin API / GA4 Data API の本接続（GA4 Data API は Phase 3C で限定的に検討）
- AI 診断ロジック（Anthropic SDK / prompt cache）→ Phase 4
- 認証 / マルチテナント / 組織管理 → Phase 4
- Supabase 永続化 / PDF / PowerPoint → Phase 4 以降
- サービスアカウントキー / 認証情報の **コミット**

---

## 1. 検討事項への回答

### 1-1. BigQuery と GA4 Data API、どちらを先か

**結論: BigQuery を先**。GA4 Data API は Phase 3C で限定的に検討。

| 観点 | BigQuery 先行 | GA4 Data API 先行 |
| --- | --- | --- |
| Insight Studio 資産の転用 | ◎ FastAPI + クエリ層が本番稼働中 | × ほぼ流用なし |
| 認証の素直さ | ◎ サービスアカウント1本 | △ OAuth + GA4プロパティ単位の権限 |
| 履歴の深さ | ◎ Export 開始以降の全期間 | △ Data API 上限と quota |
| 拾える範囲 | ◎ GA4 / 広告 / Shopify Export を一括 | △ GA4 のみ |
| 顧客側の前提 | △ BigQuery Export の有効化が必要 | ◎ GA4 だけでよい |

→ Insight Studio の **「実データで動いている」** 説得力をそのまま EC Growth Studio AI に
  持ち込めるのが最大のメリット。BigQuery Export 未設定の顧客向けバックアップとして
  **Phase 3C で GA4 Data API を「補助線」として追加** する。

### 1-2. デモ用 BigQuery dataset の推奨スキーマ

Insight Studio 既存 GCP プロジェクト内に **`ec_growth_demo`** dataset を新設する想定。
カラム名・粒度を、既存の `aggregateOrders` / `aggregateGa4` / `aggregateAds`
([`src/lib/csv/`](../src/lib/csv/)) の出力に揃え、フロント側型を流用しやすくする。

| テーブル | 役割 | 主要カラム |
| --- | --- | --- |
| `orders_daily` | 日次注文集計 | `date`, `order_count`, `revenue`, `aov`, `unique_customers` |
| `orders_by_product` | 商品×日次 | `date`, `product_name`, `sku`, `quantity`, `revenue` |
| `ga4_sessions_daily` | GA4日次セッション | `date`, `sessions`, `users`, `purchases`, `total_revenue` |
| `ga4_by_channel` | GA4チャネル×日次 | `date`, `channel`, `sessions`, `purchases`, `revenue` |
| `ga4_by_landing` | GA4 LP×日次 | `date`, `landing_page`, `sessions`, `purchases`, `revenue` |
| `ads_daily` | 広告日次集計 | `date`, `channel`, `cost`, `impressions`, `clicks`, `conversions`, `revenue` |
| `ads_by_campaign` | 広告キャンペーン×日次 | `date`, `channel`, `campaign`, `cost`, `clicks`, `conversions`, `revenue` |
| `analytics_view_monthly` | 月次統合ビュー（3ソースLEFT JOIN） | `month`, `channel`, `sessions`, `purchases`, `revenue`, `ad_cost`, `roas`, `cvr`, `aov` |

#### スキーマ設計の意図

- **既存 CSV の集計結果カラムをそのまま BigQuery 化**。フロントの Aggregation 型を再利用できる
- `date` を共通キーにして 3 ソースを結合可能にする
- 名寄せ（チャネル名 / 商品名のゆらぎ）は **ETL 側で正規化**。フロントは正規化済み前提
- パーティショニング: `date` 列で日次パーティション必須（クエリ課金抑制）
- クラスタリング: `channel` / `product_name` を候補に

### 1-3. 注文 / GA4 / 広告データの結合

**結合キー: `date` × `channel` × `product_name`**

| 軸 | 月次比較 | チャネル比較 | 商品比較 |
| --- | --- | --- | --- |
| キー | `date` (月集計) | `channel` | `product_name` (or `sku`) |
| 用途 | RevenueAnalysis 売上ブリッジ / Dashboard KPI 推移 | RevenueAnalysis チャネル別CVR / 広告ROAS | Dashboard 商品別判断 / RevenueAnalysis 原因候補 |

#### 結合戦略

- BigQuery 側で `analytics_view_monthly` を **マテリアライズドビュー or 通常ビュー** として作成
- フロントは **ビューを 1 クエリで叩く**（複数テーブル直結は避ける = フロント実装の単純化 + クエリ計画最適化）
- 名寄せルールは ETL ドキュメントとして別途まとめる（このドキュメントの範囲外）

### 1-4. Dashboard / RevenueAnalysis / MonthlyReport にどの指標を反映するか

| 画面 | 指標 | 取得元テーブル | Phase |
| --- | --- | --- | --- |
| Dashboard | 売上 / 注文数 / AOV | `orders_daily` | 3A |
| Dashboard | セッション数 / CVR | `ga4_sessions_daily` | 3B |
| Dashboard | 広告ROAS | `ads_daily` | 3B |
| Dashboard | リピート率 | （Phase 4: 顧客IDが必要） | — |
| Dashboard | KPI Sparkline | 各 daily テーブルの日次系列 | 3B |
| RevenueAnalysis | 月次売上の前月比要因分解 | `analytics_view_monthly` | 3B |
| RevenueAnalysis | チャネル別 CVR / ROAS | `ga4_by_channel` + `ads_daily` | 3B |
| RevenueAnalysis | LP別 CVR | `ga4_by_landing` | 3B |
| RevenueAnalysis | 商品別売上TOP | `orders_by_product` | 3A |
| MonthlyReport | レポート本文の数値根拠 | 全ソース統合 | 3C |
| MonthlyReport | 前月比較・YoY | 月次集計テーブル | 3C |

#### 視覚化の方針

- Sparkline / ドーナツ / プログレスバーは **既存の自前 SVG 実装** を維持。
  グラフライブラリ（recharts / chart.js）は導入しない（[`AGENTS.md`](../AGENTS.md) §4 禁止事項と整合）
- `Pill` の tone マップに「BigQuery」「CSV取込」「サンプル」のソースラベル 3 段を追加

### 1-5. フロントエンドに認証情報を置かない安全な構成

**原則**: ブラウザに **GCP サービスアカウントキー / OAuth トークンを一切置かない**。

```
[ブラウザ (React SPA / Vercel Static)]
        ↓ HTTP/JSON (期間 + テナントID のみ)
[Vercel Serverless Functions / または Render FastAPI]
        ↓ サービスアカウント (環境変数で注入)
[BigQuery]
```

- フロントは **「期間」と「テナントID」だけ** を渡す
- バックエンドが GCP サービスアカウントキーを保持し、BigQuery クエリを実行
- フロントには **JSON 集計結果のみ** が返る
- バックエンド内で **読み取り専用ガード**: クエリ生成は固定パターンのみで、SQL を直接受け付けない

#### 環境変数（バックエンド）

| 変数 | 用途 | 置き場所 |
| --- | --- | --- |
| `GCP_PROJECT_ID` | GCP プロジェクトID | Vercel Env (or Render) |
| `GCP_SERVICE_ACCOUNT_JSON_BASE64` | SA キー (Base64) | Vercel Env (Sensitive) |
| `BQ_DATASET` | dataset 名 (例: `ec_growth_demo`) | Vercel Env |
| `ALLOWED_ORIGINS` | CORS 許可 Origin | Vercel Env |
| `MAX_QUERY_DAYS` | 1リクエストの期間上限 (例: `370`) | Vercel Env |

リポジトリへのコミット禁止項目は [`.gitignore`](../.gitignore) で `.env*` を既に除外済み。

### 1-6. Vercel Serverless Functions or 別バックエンド

**Phase 3A は Vercel Serverless Functions / Phase 4 で必要に応じ Render FastAPI に統合**。

| 項目 | Vercel Functions (Node) | Render FastAPI (Insight Studio 流用) |
| --- | --- | --- |
| デプロイ容易性 | ◎ 同一リポ・同一デプロイ | △ 別リポ・別ホスト |
| BigQuery クライアント | Node.js 公式 SDK | Python 公式 SDK (Insight Studio 既存) |
| 既存資産流用 | × | ◎ クエリ層・認証層がそのまま使える |
| Cold start | 1〜3秒（Pro なら抑制可） | 起動済みなら瞬時 |
| 料金 | Vercel 1本に集約 | Render 別課金 |
| Phase 4 (Anthropic prompt cache) との相性 | ○ Node SDK 対応 | ◎ Insight Studio で確立済み |

→ **Phase 3A**: Vercel Functions で 3 エンドポイント実装、最短で接続成立
→ **Phase 3B**: 検証で問題なければ継続。Insight Studio との二重実装が顕在化したら統合検討
→ **Phase 4**: AI 連携（Anthropic prompt cache 必須）が入る段階で **Render FastAPI 統合の選択肢** が現実味

#### Vercel Functions エンドポイント設計（案）

| メソッド | パス | 用途 | Phase |
| --- | --- | --- | --- |
| GET | `/api/bq/health` | 接続確認 | 3A |
| GET | `/api/bq/orders-daily?from=YYYY-MM-DD&to=YYYY-MM-DD` | 注文日次 | 3A |
| GET | `/api/bq/ga4-daily?from=&to=` | GA4日次 | 3B |
| GET | `/api/bq/ads-daily?from=&to=` | 広告日次 | 3B |
| GET | `/api/bq/analytics-monthly?month=YYYY-MM` | 月次統合 | 3B |
| GET | `/api/bq/orders-by-product?from=&to=` | 商品別売上 | 3A |
| GET | `/api/bq/ga4-by-channel?from=&to=` | GA4 チャネル別 | 3B |

- パラメータバリデーション厳密化（期間上限 / ISO 8601 のみ受理）
- レスポンス形式は **既存 `OrderAggregation` / `Ga4Aggregation` / `AdsAggregation`
  ([`src/lib/csv/aggregateOrders.ts`](../src/lib/csv/aggregateOrders.ts) 他) と互換**
- これでフロント側はソース選択を切り替えるだけになる

### 1-7. localStorage + CSV との共存方針

**3 つのデータソース層を並列に持ち、画面側で優先順位を決める**。

```
データソース優先順位（既定）:
1. ライブBQデータ (Phase 3 で接続成功時)
2. CSV取込 (localStorage)
3. 静的サンプル (src/data/sample.ts)
```

#### 実装方針

- 既存 [`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx) を **DataSourceContext** に拡張する形で BQ 層を追加
  - 追加フィールド例: `bqOrdersDaily`, `bqGa4Daily`, `bqAdsDaily`, `bqStatus`, `lastFetchedAt`
- 各画面（Dashboard / RevenueAnalysis 他）は次の優先順位で値を採用:
  1. `bqXxx` があれば使う（ソースラベル: BigQuery）
  2. なければ `xxxImport.aggregation` を使う（ソースラベル: CSV取込）
  3. なければ `sample.ts`（ソースラベル: サンプル）
- **既存 CSV 取込は破壊しない**: BQ 接続失敗・タイムアウト時は CSV 値が維持される
- localStorage の取込キー（[`src/lib/csv/storage.ts`](../src/lib/csv/storage.ts) の `ec-growth-studio:*-import:v1`）は **そのまま維持**

#### localStorage の扱い

- BQ クエリ結果は **localStorage に保存しない**（容量・鮮度・セキュリティ）
- メモリ内 SWR キャッシュ（5 分 TTL）で再クエリ抑制
- ページ再読込時は必ず BQ に問い合わせ（CSV 復元はそのまま継続）

#### ソースラベル（UI）

- `Pill` の tone マップに `live` / `csv` / `sample` を追加（emerald / sky / slate）
- ヘッダーに小さく **「データソース: BigQuery (live) / CSV取込済 / サンプル」** を常時表示

### 1-8. 上司デモ用「実接続している感」の最小実装範囲

**目標**: 上司に **「これは BigQuery につながった」「数字が動いた」** と認識させる。

#### 最小スコープ（= Phase 3A の範囲）

1. **`/api/bq/orders-daily` の 1 エンドポイント** を Vercel Functions で稼働
2. デモ用 `ec_growth_demo.orders_daily` に **直近 30 日分のサンプル数値** を投入
3. **Dashboard 上部に「BigQuery 接続: ON / OFF」トグル** を追加
4. ON にすると Dashboard の **売上 / 注文数 / AOV** が BQ 値に置換される
5. ソースラベル `Pill` が「BigQuery」緑色で表示される
6. フッター（または小バッジ）に **クエリ実行時刻 / 件数 / レイテンシ** を表示

#### デモ動線（30 秒で見せる例）

1. 「いま CSV を抜きました」 → 数字がサンプルに戻る
2. 「BigQuery トグル ON」 → BQ から数字が来る（カウントアップアニメ）
3. 「これは Insight Studio と同じ基盤です」 → スライド説明
4. 「Phase 3 / 4 で全画面に展開していきます」 → 締め

#### このスコープでやらないこと

- AI 連携（Phase 4）
- 月次レポートの実データ生成
- 認証（テナントは固定 `dummy_tenant_id`）
- 商品別 / チャネル別 / LP 別の全反映（時間がかかるため Phase 3B へ）
- GA4 Data API（Phase 3C へ）

---

## 2. Phase 3 の段階分け

### Phase 3A: BigQuery 読み取り基盤（最小実装 = 上司デモ用）

**目的**: 「BigQuery に繋がっている」を成立させる。世界観を壊さず最小本数で。

- [ ] Vercel Functions プロジェクト構成（`/api` ディレクトリ + Node.js 18+ ランタイム）
- [ ] サービスアカウント作成（権限: BigQuery Data Viewer のみ）
- [ ] Vercel Env 設定（`GCP_PROJECT_ID` / `GCP_SERVICE_ACCOUNT_JSON_BASE64` / `BQ_DATASET`）
- [ ] `ec_growth_demo` dataset 作成 + サンプルデータ投入（既存 `samples/csv/*.csv` を BQ にロード）
- [ ] `orders_daily` / `orders_by_product` テーブル + パーティション設定
- [ ] `/api/bq/health` + `/api/bq/orders-daily` + `/api/bq/orders-by-product` 実装
- [ ] バックエンド側 SQL ガード（クエリ生成は固定パターン / 期間上限）
- [ ] CORS 設定（自分の Vercel Preview / Production だけ許可）
- [ ] Dashboard に「BigQuery 接続」トグル + ソースラベル
- [ ] `ImportContext` を `DataSourceContext` に拡張（既存 CSV 機能は維持）
- [ ] エラーハンドリング（BQ 失敗時は CSV / サンプルへ自動フォールバック）
- [ ] ドキュメント更新: `product-spec.md` / `README.md` の Phase 表

→ **上司デモ用最小実装はここで完成**

### Phase 3B: GA4 / 広告 / 統合ビュー

**目的**: 売上要因分析を BigQuery 実データで動かす。

- [ ] `ga4_sessions_daily` / `ga4_by_channel` / `ga4_by_landing` テーブル
- [ ] `ads_daily` / `ads_by_campaign` テーブル
- [ ] `analytics_view_monthly` ビュー（3 ソース LEFT JOIN + 名寄せ）
- [ ] 対応 API エンドポイント（GA4 / 広告 / 統合）
- [ ] RevenueAnalysis 画面の BQ 反映（セッション × CVR × AOV を実値）
- [ ] チャネル別 CVR / LP 別 CVR テーブルを BQ 値で更新
- [ ] Dashboard の Sparkline 実値化（日次系列）
- [ ] フロント SWR キャッシュ層（5 分 TTL）
- [ ] ETL 自動化（手動投入から定期ロードへ）

### Phase 3C: 実顧客環境への接続（要件次第）

**目的**: 1 社の本番 GA4 Export に接続して、実値で月次レポートを出す。

- [ ] 顧客 GCP プロジェクトのサービスアカウント受け取り運用設計
- [ ] テナント分離の最小実装（リクエストパラメータでプロジェクト切替 / dataset 切替）
- [ ] GA4 Data API の限定追加（BigQuery Export 未設定の顧客向けバックアップ）
- [ ] MonthlyReport の実値反映
- [ ] 監視（Vercel ログ + 簡易アラート）
- [ ] 顧客向け接続準備チェックリスト（GA4 Export 有効化 / IAM ロール / dataset 公開設定）

---

## 3. 上司デモで見せる場合の最小構成（録画想定）

5 分版 ([`docs/demo-script.md`](demo-script.md) / [`docs/demo-video-storyboard.md`](demo-video-storyboard.md)) に Phase 3A の差分を組み込む例:

| 時刻 | 内容 | 状態 |
| --- | --- | --- |
| 0:00–0:30 | LP / 課題提起 | 既存 |
| 0:30–1:30 | DataImport で CSV 3 点取込 | 既存 |
| 1:30–2:30 | RevenueAnalysis 売上要因分解 | 既存 |
| 2:30–3:30 | **Dashboard で BigQuery トグル ON → 数字置換 + ソースラベル変化** | **Phase 3A 新規** |
| 3:30–4:30 | 「Insight Studio と同じ基盤」スライド | 既存（説明強化） |
| 4:30–5:00 | ActionBoard / MonthlyReport | 既存 |

→ **新規実装は Dashboard の BigQuery トグル + 1 〜 3 エンドポイントのみ**。
  既存の CSV-first 動線は壊さず、上に **「実接続レイヤーがある」** ことだけを見せる。

---

## 4. リスクと対応

| リスク | 影響 | 対応 |
| --- | --- | --- |
| BigQuery 課金が想定外に膨らむ | コスト | パーティション必須 / クエリ前のドライラン / 期間上限 / Budget Alert |
| サービスアカウントキー漏洩 | 重大セキュリティ | Vercel Env のみ / GitHub Secret Scanning / 鍵ローテーション運用 |
| Insight Studio 側のクエリ層と離れていく | 二重実装 | Phase 4 で Render FastAPI に統合する判断軸を持つ（接続クライアント数 / 月次レビュー） |
| Cold start でデモが遅く見える | デモ失敗 | デモ前の Warm-up リクエスト / Vercel Pro 検討 |
| 顧客 GCP 環境差異（dataset 名 / テーブル構造） | 接続失敗 | Phase 3C でテナント別マッピングテーブルを設計 |
| 既存 CSV フローが壊れる | プロダクト退化 | DataSourceContext は CSV 既存パスを最優先に温存 / 統合シナリオを画面ごとに手動確認 |
| サンプル数値と実値がデモ中に混在し誤解される | 商談信用問題 | ソースラベル `Pill` を画面ヘッダーで常時可視化 |

---

## 5. 実装に進む前のチェックリスト

実装着手前に、商談 / 上司 / 技術リードに **明示的に確認** すべき項目。

### 5-1. 商談・ビジネス側

- [ ] 本 Phase は **「上司デモ用」** か **「実顧客接続用」** か
- [ ] 上司デモなら Phase 3A で止めるか、3B まで作り込むか
- [ ] 実顧客接続が必要な場合、対象顧客と GCP プロジェクト所有者は誰か
- [ ] 「BigQuery 接続できます」を商談で売りにする必要が本当にあるか
  - 「主価値は売上要因分解、BigQuery は入力チャネル」の方針と矛盾しないか
- [ ] Phase 3 完了の **顧客視点での価値** を 1 文で定義できるか

### 5-2. 技術構成

- [ ] バックエンドは **Vercel Functions で開始** で問題ないか
- [ ] Insight Studio 側の BigQuery 読み取り基盤を **Phase 4 で統合** する将来計画に同意できるか
- [ ] GCP プロジェクトは Insight Studio と **同居 or 新規分離** か
- [ ] サービスアカウント鍵を Vercel Env に置く運用に問題はないか
- [ ] Node.js Runtime（Vercel）と Python Runtime（Insight Studio）の二重実装許容か

### 5-3. データ

- [ ] デモ用 dataset (`ec_growth_demo`) を Insight Studio 既存 GCP に置いてよいか
- [ ] サンプル数値の生成方針（既存 `samples/csv/*.csv` を BQ にロードするだけでよいか）
- [ ] 結合キー（`date` × `channel` × `product_name`）の名寄せルールはどこで管理するか
- [ ] Phase 3 完了時点で Dashboard Sparkline を **実値化** するか **静的維持** か
- [ ] 月次集計ビューはマテリアライズドビューにするか通常ビューにするか

### 5-4. UX

- [ ] 「BigQuery 接続」トグルの設置場所
  - 候補 A: Dashboard 上部
  - 候補 B: グローバル（Topbar）
  - 候補 C: DataImport 画面のみ
- [ ] CSV と BQ が両方ある時の優先順位
  - 候補 A: BQ 優先（推奨）
  - 候補 B: CSV 優先
  - 候補 C: ユーザー切替トグル
- [ ] ソースラベル（`Pill`）の色設計が既存 tone マップに収まるか
- [ ] BQ 接続失敗時のフォールバック挙動の見せ方（黙って CSV 値 / 明示的にエラーバナー）

### 5-5. セキュリティ・運用

- [ ] サービスアカウント権限は **BigQuery Data Viewer のみ** に絞れるか
- [ ] GCP Budget Alert の閾値（月額上限）
- [ ] バックエンドの SELECT 専用ガード設計のレビュー担当
- [ ] CORS / Origin 制限のテスト方法
- [ ] 監視・アラート（Phase 3C で必須化する基準）

---

## 6. 参考ドキュメント

- [`docs/product-spec.md`](product-spec.md) §4.2 接続スタンス / §6 次にやるべきこと
- [`docs/insight-studio-vs-ec-growth-studio.md`](insight-studio-vs-ec-growth-studio.md) §6 役割の違い / §7 説得材料の使い方
- [`docs/demo-script.md`](demo-script.md) — 5分版 / 10分版台本
- [`docs/demo-video-storyboard.md`](demo-video-storyboard.md) — 動画構成
- [`AGENTS.md`](../AGENTS.md) §4 編集時のルール / §5 段階的実装の優先順位
- [`src/lib/csv/ImportContext.tsx`](../src/lib/csv/ImportContext.tsx) — DataSourceContext 拡張のベース
- [`src/lib/csv/storage.ts`](../src/lib/csv/storage.ts) — localStorage 永続化レイヤー（Phase 3 でも維持）
