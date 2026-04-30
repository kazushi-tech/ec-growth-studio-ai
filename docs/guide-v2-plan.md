# Guide Page v2 — 再設計計画 / UX・アクセシビリティ・グラフィカル改善

このドキュメントは [`/app/guide`](../src/pages/Guide.tsx) を中心とした主要画面
（[Dashboard](../src/pages/Dashboard.tsx) / [RevenueAnalysis](../src/pages/RevenueAnalysis.tsx) /
[ActionBoard](../src/pages/ActionBoard.tsx) / [MonthlyReport](../src/pages/MonthlyReport.tsx)）の
**改善計画** をまとめたもの。実装はまだ行わない。

このプロトタイプは [docs/ui-guidelines.md](./ui-guidelines.md) のトーンを保ちつつ、
**実 GCP / 実 API / 実 AI 接続なし** の状態で「初見の上司・社内関係者・クライアント候補が
5〜10分で世界観を理解できる」ことを上限品質とする。実装制約は本ドキュメント末尾「制約」を参照。

---

## TL;DR — 結論先出し

1. `/app/guide` は **画像カード中心 → 説明サイト風（hero + TOC + 章立て + sticky nav）に再設計** する。
2. GPT Image 2.0 は **ヒーロー1枚 + 概念ムード画像 1〜2枚に限定** し、現在 8 つある `imageSlot` の大半は
   **HTML/SVG/Tailwind で構成する live infographic** に置き換える（崩れない・data 駆動・崩しても直せる）。
3. Dashboard / RevenueAnalysis / ActionBoard / MonthlyReport は **グラフィカル要素が不足**
   している箇所が明確に存在する（ファネル / インパクト×工数マトリクス / シェアドーナツ /
   各KPIスパーク / ウォーターフォール正負配色）。重量級ライブラリなしで埋めるのが Phase B の主眼。
4. アクセシビリティの主弱点は **見出し階層スキップ・focus-visible 欠落・10px小文字・装飾以外の SVG に role/aria 無し・
   Topbar のダミーボタン**。Phase A で解消する。
5. 実装優先度は **Phase A: Guide v2 構造 + a11y 全体底上げ / Phase B: グラフィカル不足の補強 /
   Phase C: 演出・印刷・将来のヒーロー画像差込** の3段で進める。

---

## 1. 現状の `/app/guide` のレビュー

### 1-1. 構造

[`src/pages/Guide.tsx`](../src/pages/Guide.tsx) は

- イントロ3カード（目的 / 使い始め / 前提）
- `guideItems`（[`src/data/sample.ts:870`](../src/data/sample.ts) 以降）の8カードを `lg:grid-cols-12` で
  「左7: 説明テキスト / 右5: dashed border の画像予定地」と並べる
- フッターに `次に読むもの` 3リンク

の単一スクロールページ。`figure` 要素には現状 `slot: <imageSlot>` を表示するだけで画像は無い。

### 1-2. 良い点

- データ駆動（`guideItems`）になっており、Tailwind の static class map で tone が引かれている
- 「現MVPで担保していること」「上司・初見の方への前置き」など、誤認文言を防ぐ callout が組み込まれている
- 各カードが画面遷移リンク（`link.to`）を持っており、説明 → 画面体験の導線が用意されている

### 1-3. 課題

| # | 問題 | 詳細 |
| --- | --- | --- |
| G1 | **画像予定地が常時8枠分の縦スペースを占有** | `min-h-[180px]` × 8 = 視覚的に「未完成」感が強く、初見上司にプロトタイプの未熟さを印象づける |
| G2 | **TOC / 章番号 / アンカー無し** | 8カードが等価に並ぶだけで、5〜10分で読むべき骨格（導入 → ループ → 各画面 → デモ手順）が浮かない |
| G3 | **読者切替の枠がない** | 「上司向け / 社内向け / クライアント候補向け」など読者ごとの推奨ルートが文字情報でしか伝わらない |
| G4 | **「次に読むもの」がフッタ1か所のみ** | 関連画面・関連ドキュメントへの送り出しが弱い |
| G5 | **インライン callout の色覚差** | `tone` 6色を意味区分なく使い分けており、`navy/sky/gold/violet/mint/rose` が「重要度」「種類」のどれを示すか曖昧 |
| G6 | **見出し階層スキップ** | Topbar `h1` → SectionCard / GuideCard `h3` で `h2` が無い。スクリーンリーダーで構造が崩れる |
| G7 | **画像未差込時の `figcaption` が冗長** | 「インフォグラフィック予定地」テキスト + slot 名 + キャプション の3層は読者にとって意味が薄い |

### 1-4. 結論: 説明サイト風に再設計すべき

「画像カード中心」は GPT Image 2.0 を **8枚生成し、12文字以下のラベル制約を守れる** 前提が成立して
初めて成立するレイアウト。生成前から場所だけ確保するのは visual debt が大きく、
画像を作っても「カードに小画像 + 大量文字」の B2B SaaS としては窮屈な構成になる。

**説明サイト風（docs/site 風）に作り直し**、

- ヒーロー（1画面で目的と前提を伝える）
- TOC（章節・所要時間の見える化）
- 章立て（章ごとに「説明 + live infographic + 実画面リンク」の3点セット）
- sticky aside（章内ナビ + 「上司デモ向け推奨ルート」）

の構造に切り替えるのが、**画像生成に依存せず、初見でも使い方が分かる Guide Page v2** に最も合う。

---

## 2. Guide v2 の情報設計

### 2-1. 想定読者と読み方

| ペルソナ | 読み方 | 滞在時間 |
| --- | --- | --- |
| 上司 / 社内決裁者 | TL;DR → 全体像 → デモ手順 | 5分以内 |
| クライアント候補（初見） | 全体像 → 月次ループ → 月次レポートの使い方 | 7〜10分 |
| 社内オペレーター（運用担当） | 月次ループ → データ取込 → 施策ボード → 効果検証 | 10〜15分 |

ペルソナごとに違うルートを「Reading path」コンポーネントで提示し、TOC と並べる。

### 2-2. 章立て案（v2）

```
[ Hero ]            このプロダクトは何で、何でないか（誤認文言の禁止を最初に）
[ Reading path ]    上司向け / 候補顧客向け / 運用担当向け（推定所要時間つき）
[ TOC ]             下記5章へのジャンプ（sticky aside にも複製）

01. 全体像 — 月次EC改善BPaaS の世界観
    - AI × 人間レビュー × 実行 × 報告 のループ図 (live SVG)
    - 「現MVPで担保していること」コールアウト

02. 月次改善ループ — 6ステップ
    - 6 Step Pipeline (live SVG with 折返し矢印)
    - 各ステップ → 実画面リンク + サムネイル

03. データ取込と未接続範囲
    - 4区分マトリクス（実値 / デモ / 未接続 / 将来予定）live grid
    - BigQuery デモ Mode の安全停止挙動の図解
    - 「BigQuery接続済み」「GCP連携完了」を禁ずる注意 banner

04. 画面別ガイド (Dashboard / 売上要因分析 / AI考察 / 施策ボード / 月次レポート)
    各画面サブセクション:
      - 何の画面か (1〜2文)
      - Anatomy (live mini-mockup / hot-spot 注釈)
      - 読み順 (Why → What → Action)
      - 実画面リンク

05. 上司デモの流れ（5〜10分）
    - 横タイムライン (live SVG)
    - 各ステージで「言うべきこと / 注意点」を併記
    - 「誤認文言の禁止」を太字赤帯で1段
```

### 2-3. レイアウト

```
┌──────────── Topbar (h1 = ガイド) ────────────┐
│                                                │
│  Hero (full width / no image dependency)       │
│                                                │
├────────────┬───────────────────────────────────┤
│ TOC (aside)│  Reading path                     │
│  - 01      │  ─────────────────────────────────│
│  - 02      │  Section 01 全体像                │
│  - 03      │  ...                              │
│  - 04      │  Section 02 月次改善ループ        │
│  - 05      │  ...                              │
│            │                                   │
│ sticky     │  ...                              │
└────────────┴───────────────────────────────────┘
```

- `lg:` で 2カラム（左 sticky aside 240px / 右 main）
- 1024px 未満は TOC を Hero 直下にコンパクトに表示し、本文は1カラム
- 各 section はスクロールスナップではなく `scroll-mt-20` で sticky topbar 分のオフセットを取る

---

## 3. 各画面のグラフィカル改善ポイント

実 GCP / 実 API 接続なし・依存追加なし・重量級チャートライブラリなし・`sample.ts` 起点を守る前提で、
**HTML/CSS と軽量 SVG だけで作れる** 改善案を列挙する。

### 3-1. Dashboard

[`src/pages/Dashboard.tsx`](../src/pages/Dashboard.tsx)

| # | 場所 | 現状 | 改善案 |
| --- | --- | --- | --- |
| D1 | KPI 行 | `KpiCard` がスパークライン1本 | KPI tile 内に「目標 vs 実績」のミニゲージ（1本横棒）を追加。`monthlyStats.monthlyGoal` の発想を流用 |
| D2 | AI月次診断サマリー | テキストカード3枚のみ | カード内にミニアイコン + 「インパクト 高/中/低」のドット（既存 Pill 流用）。装飾は控えめ |
| D3 | 月次改善サイクル | `StepFlow` の縦リスト | ループを示せるように、最下段から最上段への戻り矢印を SVG で追加（「翌月へ」） |
| D4 | 優先アクション TOP5 | テーブル | 行の右端に micro impact bar（横6px）を追加 — 「インパクト ↔ 進捗」の同時可視化 |
| D5 | 商品別改善判断 | テーブル | 行内に「CVR トレンド」軽量スパークまたは ▲ / ▼ アイコン強化 |
| D6 | 最新インサイト | 色付きドット + テキスト | 4タイル化し、Tone（rose/mint/sky/amber）に意味（リスク/好調/参考/注意）を Pill で明記 |
| D7 | データ連携状態 | 5枚カード | 「実値 / デモ / 未接続 / 将来予定」の凡例マーカーを上段に1段だけ追加（4分類の世界観を可視化） |

### 3-2. RevenueAnalysis

[`src/pages/RevenueAnalysis.tsx`](../src/pages/RevenueAnalysis.tsx)

| # | 場所 | 現状 | 改善案 |
| --- | --- | --- | --- |
| R1 | Hero summary | 数字3枚 | 中央に「セッション × CVR × AOV」の式を視覚化（小カードの上に乗算記号 ×）し、3因子の影響額を比較できるよう統一 |
| R2 | 売上ブリッジ | 横棒バー | **正負配色を分離した本物のウォーターフォール**（前月→因子1→因子2→因子3→今月）。重量級ライブラリ不要、`flex` + `div` の絶対値幅で構築可 |
| R3 | GA4 チャネル別 | テーブル | チャネルセッションの **シェアドーナツ**（軽量SVG）+ ROAS と CVR のミニ横棒で「セッション量 / 効率」を同時に伝える |
| R4 | LP 別 CVR | テーブル | LP CVR を横棒（最大値 100%）で並べ、平均値ラインを 1 本オーバーレイ |
| R5 | 効率悪化キャンペーン | 文章リスト | カードの右端に「ROAS 倍率（全体平均比）」のミニメーター |
| R6 | 因子カード | 影響量バー1本 | 上下方向の差分矢印（前月値 → 今月値）を要因カードに追加し、変化が一目でわかる |

### 3-3. ActionBoard

[`src/pages/ActionBoard.tsx`](../src/pages/ActionBoard.tsx)

| # | 場所 | 現状 | 改善案 |
| --- | --- | --- | --- |
| A1 | 施策サマリー | 数字タイル6枚 | 「今月の完了目標」進捗バーは既に存在。**前月との差分ミニ trend** を各タイルに添える |
| A2 | 担当別ロード | 横棒（ロード率） | **担当者あたり 5件以下を目安** ラインを縦点線で重ね、超過時の警告色（rose）に切替 |
| A3 | レビューコメント | リスト | 経過日数 / SLA を Pill で添える（48h / 72h を超えたら gold→rose に切替） |
| A4 | カンバン | テキストカード | カードの上端に **インパクト×工数** をミニ4分割（高インパクト×低工数を強調） |
| A5 | （新規）インパクト×工数マトリクス | 無し | 横軸=工数 / 縦軸=インパクトの 4象限図を section 1つ追加。点は施策、サイズは P1/P2 |
| A6 | 効果検証 | スパーク1本 | 実装前/実装後の **2区間比較**：縦点線で「実装日」を打ち、グレー（前）+ エメラルド（後）の2系列に分ける |
| A7 | フィルタ | ボタン群 | 選択中のチップは aria-pressed と focus-visible の表現を整え、active 状態を Pill のトーン（navy）と統一 |

### 3-4. MonthlyReport

[`src/pages/MonthlyReport.tsx`](../src/pages/MonthlyReport.tsx)

| # | 場所 | 現状 | 改善案 |
| --- | --- | --- | --- |
| M1 | KPI Snapshot | タイル6枚（数字+デルタ） | **ミニスパーク** を各 KPI タイルに追加（既存 `Sparkline` を 80×24 で再利用） |
| M2 | Issues 表 | テーブル | 影響度を Pill ではなく **ミニ赤バー**（rose / gold / mint）で量を見せる |
| M3 | Next Month 表 | テーブル | 期待効果（円）を **横棒** で並べ、合計バー（=想定売上インパクト）を末尾に配置 |
| M4 | Data Sources | カード | 状態を Pill だけでなく **接続/未接続のチェック list**（CSV取込 / API / 認証 / 永続化）で4軸スコアカード化 |
| M5 | Cover | テキスト＋Pill | 月次レポートの「世代」（v1, v2, …）と「最終更新からの経過時間」を表示（ガイドの読者には更新感が伝わる） |
| M6 | Donut | あり | 中央に `%` 数字を配置（現状横並び）。ラベルとの紐付けを `aria-label` で明示 |
| M7 | Step（編集ステータス） | アイコン縦並び | ステップ間の縦線をシンプルな進行線（完了は emerald 実線、未着手は slate 点線）に揃える |

---

## 4. アクセシビリティ監査

### 4-1. 見出し階層

現状（典型ページ、Dashboard / Guide）:

```
<h1> Topbar.title
  <h3> SectionCard.title (× n)
    （h2 が抜けている）
```

[`src/components/layout/Topbar.tsx:26`](../src/components/layout/Topbar.tsx#L26) は `<h1>`、
[`src/components/ui/SectionCard.tsx:24`](../src/components/ui/SectionCard.tsx#L24) は `<h3>`。
スクリーンリーダーで章構造が表現されない。

**推奨**:

- ページ大セクション（Hero / 各章）は `<h2>`
- セクションカード見出しは `<h3>`
- カード内の小見出しは `<h4>`
- 単純に `SectionCard` の `<h3>` を `<h2 || h3>` 切り替え可能にする props を追加する手もあるが、
  既存ページへの影響が大きい。Guide v2 のみ独自セクション見出しを `<h2>` で書き、
  共通カードは `<h3>` のままに固定するのが副作用が小さい。

### 4-2. キーボード操作

| 場所 | 問題 |
| --- | --- |
| Topbar の Store/Calendar/月次BPaaS ボタン | 機能していないが `<button>` でフォーカス可能 → ダミー UI として読まれる。`aria-disabled` か `<div>` 化、または「未実装ですが UI のみ」と aria-label で明示 |
| Sidebar `nav-item` | `:focus` リングの定義が無く、Tailwind reset で外側リングが消えがち |
| BigQuery デモトグル | `role="switch"` はあるが、フォーカスリングが暗背景で見えにくい |
| ActionBoard フィルタチップ | `<button>` だが `aria-pressed` 無し |
| 検索 input | `<label>` 無し、placeholder のみ |
| Skip-to-content リンク | 無し（Topbar をスキップして main に飛ぶ手段が無い） |

### 4-3. フォーカス表示

- 全 `<button>` `<a>` `<input>` に共通の `focus-visible:ring-2 focus-visible:ring-navy-500
  focus-visible:ring-offset-2` を `index.css` で1か所追加するのが最小コスト
- Sidebar のような暗背景は `focus-visible:ring-emerald-300` などコントラストを担保

### 4-4. コントラスト

| 箇所 | 課題 | 推奨 |
| --- | --- | --- |
| `text-slate-400` 本文 / 補足 | 白地で WCAG AA 未達（特に 11–12px） | 補足は `text-slate-500` 以上 |
| `text-[10px]` 多用 | 10px は実質可読限度ライン | 補足は `text-[11px]` 以上、装飾説明は `text-xs` (12px) |
| `text-amber-700/80` 等の透明度 | 背景と相まって 4.5:1 を割る可能性 | 透明度を外し純色 |
| 暗背景の `text-navy-200` | Sidebar のサブテキストのみ。`navy-300` 以上に上げる |
| 選択中チップ navy-900 / white | OK |

### 4-5. alt / aria

| 対象 | 課題 | 推奨 |
| --- | --- | --- |
| `Sparkline` の SVG | `role` `aria-label` 無し | `role="img"` + `aria-label="売上 過去12週推移"` 等 |
| Donut SVG (MonthlyReport `DonutItem`) | 同上 | `role="img"` + `aria-label="レポート完成度 86%"` |
| Topbar の絞り込みボタン | `aria-haspopup` 無し（実機能無いため） | 実装するか aria-disabled |
| ガイドカードの `figure` | キャプションは `<figcaption>` で OK | 画像差込時は `<img alt={imageCaption}>` を必ず付ける |
| カンバン列の状態色ドット | `aria-hidden` 付き OK | 維持 |
| `lucide-react` icon 内 | デフォルトで `<svg>` のみ。装飾なら `aria-hidden` を付与 | 全ページで decorative icon に `aria-hidden` |
| ActionBoard 検索 input | `<label>` 無し | `<label className="sr-only">施策を検索</label>` |
| Notif/重要メッセージ banner | role 無し | `role="status"` または `role="alert"` を文脈で使い分け |

### 4-6. モバイル表示

| 画面 | 課題 | 推奨 |
| --- | --- | --- |
| Topbar | actions が幅を圧迫し折返す | <`sm` ではアイコンのみに縮退、ラベルは `sr-only` |
| Dashboard DataSourceBar | `ml-auto` の説明文が見切れる | sm で 2 段組に折返す flex / `flex-col` |
| RevenueAnalysis Bridge | `sm:grid-cols-[160px_1fr_140px]` 未満で縦並び | mobile では「ラベル ＋ 値」を上段、バーを下段に分ける構造を許容 |
| ActionBoard カンバン | `grid-cols-1 md:grid-cols-2 lg:grid-cols-5` | 1024px 以上前提で 5列。もっと早く 5 列を諦め、`xl:grid-cols-5` にする方が縦長カードのまま見やすい |
| MonthlyReport Cover | 16:9 KPI 6列が `lg:` から | 中間 `md:` で 3 列に明示 |
| Guide v2 TOC | sticky aside は `lg:` 以上のみ。それ未満は in-flow 折りたたみ | `<details><summary>` で開閉可能に |

---

## 5. GPT Image 2.0 を使う箇所 / HTML+CSS で作る箇所の切り分け

### 5-1. 原則

- **データ駆動 / クリック可能 / 高解像対応 / 数値が変わる** → HTML + Tailwind + 軽量 SVG
- **静止画でよい / 抽象的な世界観の表現 / 数値が固定 / 一覧の中で1〜2点アクセント** → GPT Image 2.0

### 5-2. 既存 8 imageSlot の切り分け

[`docs/guide-infographic-plan.md`](./guide-infographic-plan.md) の8枠を、Guide v2 では下表で扱う。

| imageSlot | 元用途 | v2での扱い | 理由 |
| --- | --- | --- | --- |
| `overview-loop` | ループ図 | **HTML/SVG live infographic** | 4ノードの円配置は SVG `<circle>` `<path>` で十分。差し替えやすく崩れない |
| `monthly-loop` | 6ステップパイプライン | **HTML/SVG live infographic** | 6 step + 折返し矢印は CSS grid + 矢印 SVG で構築。`guideItems` の文言と紐付け可能 |
| `data-import-scope` | 4区分凡例 | **HTML grid 2x2 (live)** | 静的画像にすると凡例の色が他画面と微妙にズレる。Tailwind tone で揃える方が一貫 |
| `dashboard-anatomy` | Dashboard 分解図 | **HTML mini-mockup + ホットスポット注釈** | 実画面と同じパーツを縮小して並べ、矢印で説明。実装に追従できる |
| `ai-review-flow` | AI→人間→施策 3段 | **HTML/SVG flow** | 3つの簡単なボックス + ラベル付き矢印で十分 |
| `action-board-lanes` | カンバン解説 | **HTML mini-kanban (live)** | 既存 ActionBoard コンポーネントを 30% スケールで再利用してそのまま貼る |
| `monthly-report-anatomy` | 月次レポート分解 | **HTML mini-mockup + ホットスポット注釈** | 実画面と同じパーツを縮小 |
| `exec-demo-flow` | 5〜10分タイムライン | **HTML/SVG horizontal timeline** | tick mark + bar の純 CSS で十分 |

→ **8 枠中 8 枠を HTML 化**。GPT Image 2.0 への依存を Guide v2 では持ち込まない。

### 5-3. GPT Image 2.0 の役割（v2 で残すなら）

| 場所 | 用途 | プロンプト方針 |
| --- | --- | --- |
| Guide v2 Hero 背景 | 抽象的な BPaaS 世界観のムード画像（オプション） | `clean B2B SaaS hero, abstract dashboard silhouette, navy + emerald gradient, no text, no people, 16:9` |
| `/` Landing ヒーロー | 既存 [Landing.tsx](../src/pages/Landing.tsx) の差替え候補 | 別 PR で扱う |

**禁止文言ルール**は [`docs/guide-infographic-plan.md`](./guide-infographic-plan.md) と同じ：

- 「BigQuery接続済み」「GCP連携完了」「実データ連携済み」「本番接続」「稼働中」を画像に入れない
- 人物写真・実在ロゴ・実 GCP / Shopify / Google ロゴを使わない

---

## 6. 実装優先度（Phase A / B / C）

### Phase A — Guide v2 構造 + a11y 全体底上げ（最優先 / 1 PR で実施可能）

スコープ: **Guide.tsx の再設計と、全画面に効くアクセシビリティ底上げ**。

実装単位:

1. `src/pages/Guide.tsx` を v2 構造に置換（Hero / Reading path / TOC / 5 章 / 各章内 anchor）
2. `src/data/sample.ts` の `guideItems` を v2 章立てに合わせて再構成
   - `imageSlot` フィールドは廃止せず、`anatomy: "live" | "image"` のような切替フィールドを追加
   - 章番号と所要時間（`estMin: number`）を持たせる
3. `src/components/guide/` 以下に v2 専用コンポーネントを作成（既存共通コンポーネントは触らない）
   - `GuideHero.tsx`
   - `GuideToc.tsx`（sticky aside / モバイルは `<details>`）
   - `GuideReadingPath.tsx`
   - `GuideSection.tsx`
   - `LoopDiagram.tsx` (SVG 4ノード)
   - `StepPipeline.tsx` (横6ステップ)
   - `QuadrantLegend.tsx` (4区分)
   - `MiniMockup.tsx`（live mini Dashboard / ActionBoard / MonthlyReport snippet）
   - `ExecTimeline.tsx`（5〜10分タイムライン）
4. アクセシビリティ全体修正
   - `index.css` に共通 `:focus-visible` ユーティリティ
   - `Topbar` の絞り込みボタンに `aria-disabled="true"` + tooltip 文言
   - `Sparkline` `DonutItem` に `role="img"` + `aria-label` props を追加
   - lucide icon の decorative 使用箇所に `aria-hidden`
   - Skip-to-content リンクを `AppLayout` 直下に追加
5. 文字サイズの底上げ
   - `text-[10px]` 全置換 → `text-[11px]`（`grep -n "text-\[10px\]" src` で当たる箇所のみ）
   - `text-slate-400` の本文（補足以外）を `text-slate-500` 以上に上げる

成果物:
- 新 Guide v2 ページ
- a11y 修正（Topbar / Sparkline / Donut / focus / skip-link / 文字サイズ）

QA:
- 主要5ページ（Dashboard / RevenueAnalysis / ActionBoard / MonthlyReport / Guide）を Tab だけで一周
- VoiceOver / NVDA で見出しジャンプが章立て通りに動くか
- 360px 幅のモバイルで Topbar / DataSourceBar / Bridge が破綻しないか

### Phase B — グラフィカル不足の補強（Phase A 着地後 / 画面ごとに小 PR で）

実装単位（PR を画面別に切る想定）:

| PR | スコープ |
| --- | --- |
| B-1 Dashboard | KPI ゲージ追加 / インサイト4タイル化 / データ連携凡例 / monthly cycle ループ矢印 |
| B-2 RevenueAnalysis | 本物のウォーターフォール / チャネル share donut / LP CVR 横棒 / 因子カード差分矢印 |
| B-3 ActionBoard | インパクト×工数マトリクス / 担当者ロード閾値ライン / 効果検証 2区間比較 / カードのインパクト×工数ミニ4分割 |
| B-4 MonthlyReport | KPI ミニスパーク / Issues 影響度バー / Next Month 期待効果横棒 / Data Sources スコアカード |

すべて **依存追加なし / 重量級チャート無し**。既存 `Sparkline` `ScoreBar` の発想を踏襲する。

QA:
- 画面ごとに「数値が `sample.ts` の値とズレない」ことを確認
- CSV取込時 / 未取込時で表示崩れが無いこと

### Phase C — 演出・印刷・将来のヒーロー差込（任意 / 後回し可）

| # | 内容 |
| --- | --- |
| C-1 | `prefers-reduced-motion` を尊重した entry animation（Hero / 各 section） |
| C-2 | MonthlyReport 用 print stylesheet（A4縦 / 章区切り / カラーモード非依存） |
| C-3 | Guide v2 Hero に GPT Image 2.0 で生成したムード画像を差し込む（任意） |
| C-4 | Landing ページ（`/`）のヒーロー画像差替え |
| C-5 | Theme tokens を CSS variables に出してダーク版下準備 |

---

## 7. 実装制約（Claude が触る前のチェックリスト）

実装担当 Claude は **タスク開始前に下記を必ず確認** すること。

- [ ] 実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API へ新規接続を**作らない**
- [ ] 画像生成（GPT Image 2.0）を**呼ばない**（Phase C-3 の差込時に user 指示のもと別 PR で実施）
- [ ] `package.json` に **依存追加しない**（chart.js / recharts / d3 / framer-motion などは禁止）
- [ ] 重量級チャートライブラリは禁止。SVG / div / Tailwind ユーティリティで構築
- [ ] 数値・文言は `src/data/sample.ts` の既存型を起点にする（CSV 取込時の hook も既存ロジックを温存）
- [ ] 「BigQuery接続済み」「GCP連携完了」「実データ連携済み」「本番接続」「稼働中」を **新規に書き加えない**
- [ ] `tone` 6色のうち、新色を作らない（[ui-guidelines.md](./ui-guidelines.md) の token に従う）
- [ ] Tailwind 動的クラス（`bg-${color}-500`）禁止。固定 class map で吸収
- [ ] `Topbar` のダミーボタンは Phase A で `aria-disabled` を付ける程度に留め、機能を作らない（プロトタイプの嘘を増やさない）

---

## 8. Claude 実装プロンプト（Phase A 用 / そのまま貼って使う）

新セッションで Claude に投げるための、自己完結プロンプトを下記に置く。
不要部分（Phase B / Phase C）は別セッションで投げる。

### 8-1. Phase A プロンプト

```
あなたは EC Growth Studio AI（Vite + React + Tailwind の静的MVPプロトタイプ）の
フロントエンド実装担当です。次の作業を行ってください。

# 背景
- このプロトタイプは「月次EC改善BPaaS の世界観を初見の上司・社内・候補顧客に
  5〜10分で伝える」ことを目的にした静的MVPです。
- 実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続。
  CSV取込（実値）と BigQueryデモ Mode（Preview 限定）の2系統で運用フローを示します。
- 設計指針は docs/ui-guidelines.md、改善計画は docs/guide-v2-plan.md にあります。
  作業前に両方を読んでください。

# やること
docs/guide-v2-plan.md の「Phase A」を実装してください。具体的には:

1. /app/guide ページ（src/pages/Guide.tsx）を v2 構造に置き換える:
   - Hero / Reading path / sticky TOC / 5 章 / 章ごとの anchor
   - 章構成: 01 全体像 / 02 月次改善ループ / 03 データ取込と未接続範囲 /
     04 画面別ガイド（Dashboard / 売上要因分析 / AI考察 / 施策ボード / 月次レポート）/
     05 上司デモの流れ
   - 各章の中に live infographic（HTML/SVG）を入れる:
     LoopDiagram / StepPipeline / QuadrantLegend / MiniMockup / ExecTimeline
   - 既存の dashed-border の imageSlot 予定地は撤去する

2. src/data/sample.ts の guideItems を v2 章立てに合わせて作り直す:
   - chapter 番号 / estMin（推定所要時間, 分）/ anchor id を持たせる
   - imageSlot は廃止、各セクションに anatomy: "live" を持たせる
   - 既存の bullets / callout / link は構造を保ったまま、文言を Phase A に必要な分だけ調整可

3. 新規コンポーネントを src/components/guide/ に作る:
   - GuideHero.tsx / GuideToc.tsx / GuideReadingPath.tsx / GuideSection.tsx
   - LoopDiagram.tsx (4ノードのループ図, 軽量SVG)
   - StepPipeline.tsx (6ステップ横並び, 折返し矢印付き)
   - QuadrantLegend.tsx (4区分凡例 grid)
   - MiniMockup.tsx (Dashboard / ActionBoard / MonthlyReport の縮小版)
   - ExecTimeline.tsx (5〜10分の横タイムライン)

4. アクセシビリティの全体底上げ:
   - src/index.css に共通 focus-visible ユーティリティを追加
   - Sparkline / DonutItem の SVG に role="img" と aria-label プロパティを足す
   - Topbar の Store / Calendar / 月次BPaaS バッジの非機能ボタンに
     aria-disabled="true" と tooltip 用 title 属性を付与
   - AppLayout 直下に Skip-to-content リンクを追加
   - 装飾用 lucide icon（テキスト同伴のもの）に aria-hidden を付与
   - text-[10px] の本文用途を text-[11px] に上げる
   - 本文に使われている text-slate-400 を text-slate-500 以上に上げる
     （補足的なメタ情報の灰色は残してOK、判定が難しい場合は変えない）

# 制約（必ず守る）
- 実 GCP / 実 API / 実 AI に新規接続しない
- GPT Image 2.0 を呼ばない、画像生成しない
- package.json への依存追加禁止（chart.js / recharts / d3 / framer-motion すべて NG）
- 重量級チャートライブラリ禁止、軽量 SVG / div / Tailwind で構築
- src/data/sample.ts を起点にし、CSV 取込時の動作を壊さない
- 「BigQuery接続済み」「GCP連携完了」「実データ連携済み」「本番接続」「稼働中」を
  新規文言に追加しない
- Tailwind 動的クラス（bg-${var}-500）を使わない、static class map で吸収
- ui-guidelines.md の tone 6色 / token 体系から逸脱しない

# 作業の進め方
- 着手前に docs/ui-guidelines.md / docs/guide-v2-plan.md / docs/guide-infographic-plan.md を必ず読む
- 既存の SectionCard / Pill / Sparkline / KpiCard / StepFlow / ScoreBar の振る舞いは変更しない
- 完了後に主要5画面（Dashboard / RevenueAnalysis / ActionBoard / MonthlyReport / Guide）を Tab だけで
  操作してフォーカスが見えるか確認、360px 幅で破綻しないか確認
- 完了後に PR 説明文を書き、変更点を箇条書きで列挙する

# 完了条件
- /app/guide が Hero + Reading path + TOC + 5 章 + 5 つの live infographic で構成されている
- imageSlot 依存の dashed-border placeholder が画面から消えている
- 主要5画面で focus-visible リングが視認できる
- Topbar のダミーボタンに aria-disabled が付いている
- Sparkline / Donut SVG に aria-label が付いている
- npm run typecheck / npm run lint （存在するもの）が通る
- npm run build が通る
```

### 8-2. Phase B プロンプト（B-2 RevenueAnalysis 例）

B-1〜B-4 を1つずつ独立 PR で出す前提。下記は B-2 の雛形。他の B-1 / B-3 / B-4 も
docs/guide-v2-plan.md「3. 各画面のグラフィカル改善ポイント」の該当節を貼って同じ形で投げる。

```
あなたは EC Growth Studio AI のフロントエンド実装担当です。
docs/guide-v2-plan.md「3-2. RevenueAnalysis」を実装してください（Phase B-2）。

# 対象ファイル
- src/pages/RevenueAnalysis.tsx
- 必要なら src/components/ui/ 以下に新規コンポーネント追加可
- src/data/sample.ts の revenueAnalysis 構造は変更しない（追加 derive のみ可）

# 改善内容（docs/guide-v2-plan.md 3-2 を実装する）
R1: Hero summary に「セッション × CVR × AOV」の式を視覚化
R2: 売上ブリッジを正負配色のウォーターフォール（前月→因子1→因子2→因子3→今月）に置換
R3: GA4 チャネル別をテーブル＋シェアドーナツ（軽量SVG）+ ROAS / CVR ミニ横棒に拡張
R4: LP 別 CVR を平均値ライン付きの横棒比較に置換
R5: 効率悪化キャンペーンに「ROAS 倍率（全体平均比）」のミニメーター追加
R6: 因子カードに前月→今月の差分矢印を追加

# 制約
- 依存追加禁止 / 重量級チャートライブラリ禁止 / 軽量 SVG・div・Tailwind で構築
- ui-guidelines.md の影響度色ルール（プラス=emerald / マイナス=rose / 中立=slate）に従う
- 既存の resolveFactors / buildHeadline / buildAdsCauses ロジックは温存する
- CSV 未取込時 / GA4 取込時 / 広告取込時 / 全部取込時 の4状態で破綻しないこと

# 完了条件
- 視覚要素が docs/guide-v2-plan.md の R1〜R6 すべてを満たす
- npm run typecheck / npm run build が通る
- 360px 幅で各セクションが破綻しない
```

### 8-3. Phase C プロンプト（C-3 ヒーロー画像差込 例）

```
あなたは EC Growth Studio AI のフロントエンド実装担当です。
Phase C-3「Guide v2 Hero に GPT Image 2.0 で生成したムード画像を差し込む」を実施します。

# 前提
- Phase A で Guide v2 が live infographic ベースで完成済み
- これから Hero に**1枚だけ** GPT Image 2.0 のムード画像を差し込む

# やること
1. public/guide/hero.png を 1280x640 (2:1) の想定でスロットだけ用意（画像はユーザが後で配置）
2. src/components/guide/GuideHero.tsx に <img> を追加
   - alt は「月次EC改善 BPaaS の世界観を表す抽象画像（装飾）」
   - 画像が存在しない場合は CSS グラデーションのフォールバックを表示
3. docs/guide-infographic-plan.md に hero 用プロンプト案を 1 ブロック追記
   - clean B2B SaaS hero, abstract dashboard silhouette, navy + emerald gradient, no text, no people, 16:9

# 制約
- 画像を実際には生成しない（プロンプト案を残すだけ）
- 「BigQuery接続済み」等の禁止文言を入れない
- 文字情報を画像に依存しない（テキストは <h1> <p> 側で出す）

# 完了条件
- public/guide/hero.png が無くても画面が崩れない
- 配置された場合に Hero の上に違和感なく合成される（rounded / shadow / blend）
```

---

## 9. 関連ドキュメントと整合

- [`docs/ui-guidelines.md`](./ui-guidelines.md) — トーン / 色 / Pill / 影響度色ルール（本計画と矛盾しない）
- [`docs/guide-infographic-plan.md`](./guide-infographic-plan.md) — 画像生成プロンプト（v2 では使用しないが
  Phase C-3 の Hero 用プロンプトを追記する想定）
- [`docs/product-spec.md`](./product-spec.md) — 画面別仕様。本計画は仕様改変ではなく
  既存仕様の上に「説明レイヤ」を作る位置づけ
- [`docs/demo-script.md`](./demo-script.md) — Guide v2 「05 上司デモの流れ」と整合させる

## 10. 計画書のレビュー

`/codex-review docs/guide-v2-plan.md` を実行してから着手すること（CLAUDE.md のワークフロー規約）。
