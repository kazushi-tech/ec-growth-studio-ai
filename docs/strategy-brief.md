# Strategy Brief — EC Growth Studio AI

> 上司・経営層・社内関係者に **「これは何で、なぜやるのか / どこまで自走してよく、どこからが上司確認か」**
> を一発で伝えるための **戦略要約** ドキュメントである。
>
> 関連ドキュメント:
>
> - プロダクト仕様の正本: [product-spec.md](product-spec.md)
> - デモ台本: [demo-script.md](demo-script.md)
> - Insight Studio との比較: [insight-studio-vs-ec-growth-studio.md](insight-studio-vs-ec-growth-studio.md)
> - 動画版構成: [demo-video-storyboard.md](demo-video-storyboard.md)
> - Phase 3 計画: [phase3-ga4-bigquery-plan.md](phase3-ga4-bigquery-plan.md) / [phase3a-decision-sheet.md](phase3a-decision-sheet.md)

---

## 1. プロダクトの目的

EC Growth Studio AI は **月次EC改善 BPaaS の UIプロトタイプ** である。

- 対象顧客: 月商 100万〜5,000万円規模の EC / D2C 事業者
- 提供形態: **SaaS UI ＋ BPaaS 伴走**（人間レビュー / 月次会議 / 効果検証）
- 提供価値: 「レポートで終わらせない」 — AI診断 → 人間レビュー → 施策実行 → 月次提出 を1ループに統合

### コアメッセージ（毎回ここから話す）

1. **CSV-first / API-later** — 手元のCSVだけで月次運用を始められる
2. **AI診断 × 人間レビュー** — AIは出発点、最終判断は担当者が担う
3. **月次運用ループ** — 単月のレポートではなく、毎月の改善サイクルを回す装置

---

## 2. 現状できること（実装済み）

| 領域 | 状態 | 補足 |
| --- | --- | --- |
| 注文CSV取込で 売上 / 注文数 / AOV を実値化 | 実装済み | `Phase 1 / 1.5` |
| GA4 CSV取込で セッション / CVR / 流入チャネルを半実データ化 | 実装済み | `Phase 2` |
| 広告CSV取込で ROAS / CPC / 効率悪化キャンペーンを反映 | 実装済み | `Phase 2.5` |
| 売上要因分析（売上 = セッション × CVR × AOV の連鎖法分解） | 実装済み | `/app/revenue-analysis` |
| AI考察レポート / 施策ボード / 月次レポートのレイアウト | 実装済み | 静的サンプル文言＋実値で構成 |
| BigQueryデモ Mode（`BQ_MOCK_MODE=true` の Preview 環境のみ） | 実装済み | 実 GCP 接続ではない `mode:"mock"` 固定応答 |
| Production の `/api/bq/*` 安全停止 | 実装済み | `501 / NOT_IMPLEMENTED` で返す。誤って実GCPに繋がない設計 |
| 取込状態の `localStorage` 永続化 | 実装済み | 外部送信なし |

> **ポイント**: 上司に見せる時の主役は **CSV取込で実値化された売上要因分析** と
> **施策ボード → 月次レポートの月次運用ループ**。

---

## 3. 未接続範囲（意図的に未実装）

> 「画面に並んでいるが、まだ繋がっていない」項目を整理。
> **誤って『接続済み』と説明しないこと**。

| 区分 | 項目 | 状態 |
| --- | --- | --- |
| 実 GCP / 実 BigQuery | クエリ実行 / dataset / サービスアカウント / 課金 / Budget Alert | 未設定 |
| 実 GA4 Data API | OAuth / GCP認証 / API直叩き | 未接続 |
| 実 Google広告 / Meta広告 | API直接連携 | 未接続 |
| 実 Shopify Admin API | 注文 / 商品 / 在庫の自動同期 | 未接続 |
| 実 AI 生成 | Anthropic SDK + prompt cache | 未接続（静的サンプル文言のまま） |
| 認証 / 永続化 | Clerk / Supabase Auth / Edge Functions | 未実装 |
| 出力 | PDF / PowerPoint / Google Docs 自動生成 | レイアウト設計のみ |

### UI 上の表記ルール（誤認防止）

| ラベル | 意味 |
| --- | --- |
| `注文CSV実値` / `GA4実値` / `広告CSV実値` | CSV取込由来で、実値で再計算された数字 |
| `推定値` | 静的サンプル（前月分など、CSV未対応の値） |
| `BigQueryデモ` | `mode:"mock"` の固定 response（Preview 環境専用 / 実 GCP 接続ではない） |
| `サンプル文言` | AI生成想定テキストの静的サンプル |

### 言ってはいけない言い回し（NG リスト）

| NG | 代替 |
| --- | --- |
| 「BigQuery 接続済み」 | 「BigQuery接続後の見え方を Preview 環境のみで再現中（実 GCP 未接続）」 |
| 「GCP連携完了」 | 「GCP連携は Phase 3 後続 PR で実装予定。現状は未接続」 |
| 「実データ連携済み」 | 「**CSV取込ぶんは実値**。API・BigQuery 連携は次フェーズ」 |
| 「AIが生成しています（断定）」 | 「現MVPは **AI生成想定の静的サンプル文言**。Phase 4 で Anthropic SDK 接続」 |

---

## 4. EC Direct / NetSDL / ペタビットEC支援との関係

> 「既存の EC支援サービスを置き換えるのではなく、**月次運用ループ の中核として補完する**」 が基本方針。

| 既存サービス | 主な役割 | EC Growth Studio AI との関係 |
| --- | --- | --- |
| **EC Direct**（EC構築・運用代行） | Shopify / 楽天 / 自社カート の構築・受注・出荷・CS | 構築や日次運用は EC Direct が継続。本プロダクトは **その上に乗る月次の改善・提案レイヤー**。EC Direct 顧客の月次会議の "中身" を作る装置として併売できる |
| **NetSDL**（広告運用 / クリエイティブ） | 広告配信運用・クリエイティブ制作 | 広告CSV取込で **NetSDL 側のキャンペーン効率を月次運用ループに取り込み**、施策ボードで「広告クリエイティブ刷新」「予算配分見直し」を可視化。NetSDL の月次提案資料の代替・補強として使える |
| **ペタビット EC支援**（伴走 / 代行 / コンサル） | EC事業者への伴走・運用代行 | 本プロダクトは **伴走サービスの "月次成果物" を作る共通フォーマット**。担当者ごとにバラバラだった月次レポートを、AI診断 × 人間レビュー × 月次運用ループ という統一フォーマットに集約できる |

### ポジショニングの一文

> 「EC Growth Studio AI は **新しい単独サービスではなく、ペタビットの既存EC支援を BPaaS として束ねるための月次運用ループの司令塔**。
> EC Direct / NetSDL / 伴走代行で蓄積した知見を、毎月の改善サイクルに落とし込む装置として位置づける。」

---

## 5. 将来ロードマップ（Phase 別）

| Phase | 状態 | 主要項目 |
| --- | --- | --- |
| **Phase 1 / 1.5** | 完了 | 注文CSV取込 + `localStorage` 永続化 |
| **Phase 2** | 完了 | GA4 CSV取込（セッション / CVR / 流入） |
| **Phase 2.5** | 完了 | 広告CSV取込（ROAS / CPC / 効率悪化キャンペーン） |
| **Phase 3A** | 完了 | BigQueryデモ Mode（`BQ_MOCK_MODE=true` の Preview のみ）/ Production 安全停止 |
| **Phase 3B** | 未着手 | 実 BigQuery 読み取り接続 / GA4 BigQuery Export 連携 |
| **Phase 3C** | 未着手 | 実顧客の GCP プロジェクトへの読み取り専用接続 |
| **Phase 4 前半** | 未着手 | AI実接続（Anthropic SDK + prompt cache 必須） |
| **Phase 4 後半** | 未着手 | Supabase 永続化 / 認証 / マルチテナント / PDF・PowerPoint 出力 |
| **将来** | 未着手 | Shopify Admin API / Google広告 / Meta広告 / GA4 Data API の読み取り専用直接連携 |

### 売り方の段階移行

| ステージ | 売り物 | 価格構造 |
| --- | --- | --- |
| 現在地（Phase 3A） | **BPaaS伴走サービス**（人＋現UI） | 初回診断 / 月次運用 / 伴走の3段階 |
| 〜3ヶ月（Phase 3B / 4 前半） | 上記 + 一部自動化（BigQuery実接続 / AI実生成） | 月次運用枠を増やす |
| 6〜12ヶ月（Phase 4 後半） | **SaaS + BPaaS のハイブリッド契約** | テナント単位 SaaS 利用料 + 伴走オプション |

---

## 6. 勝手に進めてよい範囲（自走ライン）

以下は **上司確認なし** で進めて構わない。

- `src/data/sample.ts` の数値・コピー調整（既存の意味を壊さない範囲）
- 既存コンポーネント（SectionCard / Pill / KpiCard / Sparkline / ScoreBar / StepFlow）の組み合わせで作れる UI 改善
- `docs/` 配下のドキュメント追加・更新（`product-spec.md` 整合は維持）
- CSV取込のバリデーション強化・警告メッセージ改善
- 既存画面のレイアウト整え / 文言ブラッシュアップ
- BigQueryデモ Mode の **mock データ** や UI 表示の改善（`BQ_MOCK_MODE=true` Preview のみ）
- 既存 lucide-react アイコンの差し替え
- `tailwind.config.js` 内の **既存パレット** を使った配色微調整
- `samples/csv/*` のサンプルデータ追加
- ローカルでの動作確認 / `npm run build` / `npm run lint`

> 判断基準: **「サンプル世界観を壊さない / 実接続を増やさない / 重量級依存を増やさない」** なら自走 OK。

---

## 7. 上司確認が必要な範囲（停止ライン）

以下は **必ず上司・関係者に相談** してから進める。

### 技術系

- 実 GCP プロジェクトへの接続（dataset / サービスアカウント / 課金 / Budget Alert を伴うもの）
- 実 BigQuery クエリ実行の有効化（`BQ_MOCK_MODE` を外して本番接続に切り替えるもの）
- 実 GA4 Data API / 実広告 API / 実 Shopify Admin API への接続
- 実 Anthropic API キーの埋め込みや AI 実生成
- Supabase / 認証 / Edge Functions の導入
- PDF / PowerPoint / Google Docs の実出力ライブラリ追加
- D&D / chart.js / recharts / antd など **重量級依存** の追加
- Vercel Production 環境変数の追加・変更（特に `BQ_MOCK_MODE` を Production に入れる判断）
- サービスアカウント JSON / API キー / 認証トークンのコミット

### サービス系

- 「BigQuery接続済み」「GCP連携完了」「実データ連携済み」など **誤認させる文言** の追加
- 既存 EC Direct / NetSDL / ペタビット EC支援 サービスとの **役割再定義** や合併・置換の表明
- 価格表 / 提供形態 / 契約モデルの正式化
- 顧客向け公開資料（営業資料 / 公開LP / プレスリリース等）の確定版作成
- 顧客の本番データを取込んだままのデモ実施（必ず事前確認＋取込解除を徹底）

### 判断基準

> 「**戻せない・お金が動く・社外に出る・実接続が発生する・サービス間の役割を変える**」のいずれかに該当するなら、必ず上司確認。

---

## 8. 上司向け説明文（コピペで使える1分版）

> 「EC Growth Studio AI は **月次EC改善 BPaaS の UIプロトタイプ** です。
> CSV-first / API-later の方針で、注文 / GA4 / 広告 CSV をブラウザに取込んで
> **売上要因分解 → AI考察（静的サンプル）→ 施策ボード → 月次レポート** までを 1ループで見せます。
>
> 現状は **実 GCP / 実 BigQuery / 実 GA4 API / 実広告 API / 実 AI API には未接続** で、
> 認証・永続化・PDF出力も意図的に未実装です。BigQueryデモも `BQ_MOCK_MODE=true` の
> Preview 環境でだけ mock 表示する建付けで、Production では `/api/bq/*` を安全停止しています。
>
> ねらいは **EC Direct / NetSDL / ペタビット EC支援を BPaaS として束ねる月次運用ループの司令塔**
> をつくること。実APIや実AI 連携は Phase 3 / 4 で段階的に厚くしますが、
> **現状でも CSV ベースの月次BPaaS伴走サービスとしては開始できる** のが特徴です。」

---

## 9. クライアント向け説明文（コピペで使える1分版）

> 「EC Growth Studio AI は、毎月のEC売上改善を **CSVベースで運用ループとして回す** プロダクトです。
> お手元の **注文 / GA4 / 広告 CSV** を取込むだけで、売上が前月とどう変わったかを
> **セッション × CVR × AOV** に分解し、商品ページ・広告・CRM・在庫の各領域で
> 次に何を直せば一番効くかをご提案します。
>
> AI診断は **出発点** で、最終判断は弊社の伴走担当が一緒にレビューします。
> 月次レポートは顧客提出可能な体裁でご用意し、施策ボードで担当・期限・効果検証まで
> 月次運用ループとして回します。
>
> APIや BigQuery への直接接続は **読み取り専用で段階的に追加** していきます。
> 認証情報やAPIキーを当社で扱う前提はありません。
> CSVがあれば来月の運用から開始可能です。」

---

## 10. このドキュメントの使い方

- **デモ前** に Section 8（上司向け） / Section 9（クライアント向け）を1分で読み返してから話し始める
- **Section 6 / 7** を読み返してから勝手に手を動かす（特にPRやコード変更を入れる前）
- **Section 3** の NG リストはレビューや営業資料を作るときに必ず確認
- **新しい依存・実接続・公開資料** を入れる時は Section 7 を満たすか自問してから上司確認
