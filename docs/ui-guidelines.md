# UI / UX Guidelines — EC Growth Studio AI

高単価 B2B SaaS / BPaaS にふさわしい質感を、最小限のコンポーネントで表現する。
**「正確・落ち着き・迷いがない」** が基本トーン。装飾より情報設計を優先する。

## 1. デザイン原則

1. **情報密度は高く、ノイズは低く**: 数字とラベルが主役。装飾はそれらを支えるだけ。
2. **ナビは Navy、本文は White**: ダーク/ライトの対比で「司令塔→作業エリア」を分離する。
3. **意味を持つ色**: 色は装飾ではなく状態を表す。緑=好調/完了、赤=リスク/低下、橙=要確認、青=進行中、紫=効果検証。
4. **AIと人間レビューを区別**: AI生成は ✨ アイコンと冷色、人間判断は ✅ や担当者名で温色側に寄せる。
5. **Why → What → Action の流れ**: 各セクションで「なぜ重要か」「現状」「次の一手」をこの順で提示。

## 2. カラーパレット

### Navy（ナビ・ヘッダ・主要CTA）
- `navy-950` `#06122a` — Sidebar 背景
- `navy-900` `#0b1e3f` — Primary CTA / 黒背景セクション
- `navy-800` `#13244a` — Hover / Border

### Surface（本文）
- `slate-50` `#f6f8fc` — App 背景
- `white` — Card 背景
- `slate-200` — Card Border
- `slate-500` — 補足ラベル
- `slate-700/800/900` — 本文・見出し

### Status / Accent
- `emerald-500/600` — 成長・完了・好調
- `rose-500/600` — リスク・低下・優先度P1（強）
- `amber-400/500` — 注意・レビュー中
- `sky-500/600` — 進行中・参考リンク
- `violet-500/600` — 効果検証・他カテゴリ

すべて Tailwind tokens で定義（`tailwind.config.js` を参照）。

## 3. タイポグラフィ

- フォント: `Inter` + `Noto Sans JP` フォールバック
- 見出し: tight tracking（`tracking-tight`）
- 本文: 14–15px / line-height 1.6–1.75
- 数値（KPI値）は `font-semibold tracking-tight` で安定感を出す
- 数字とラベルの密度差で「ヘッドライン」をつくる（小ラベル → 大数字 → 補足）

## 4. レイアウト

- App は **Sidebar (256px) + Main** の2カラム
- Topbar は sticky、24px のサイド余白
- カードは `rounded-2xl border border-slate-200/80 bg-white shadow-card`
- Section ヘッダは小さなアイコン + 14pxラベル + 右肩アクション
- Grid 推奨: 12 カラム or 5 カラムカンバン
- Spacing scale は Tailwind 標準（4 / 8 / 12 / 16 / 20 / 24）

## 5. コンポーネント

### Pill（状態バッジ）
- 11px / `rounded-full` / 軽量 ring
- 状態 → 色のマッピングは `Pill.tsx` に集約。色を直書きしない

### KpiCard
- ラベル → 値 → 増減 → スパークライン の順
- 増減は ↑↓ アイコン + 色で意味づけ
- `Sparkline` は依存ライブラリを使わず軽量SVGで描画

### SectionCard
- 共通セクションラッパ。タイトル / アイコン / 右肩アクション / 本文 padding を統一
- `bodyClassName="!px-2 !py-2"` でテーブル系はパディング調整

### Table
- `.table-clean` ユーティリティで揃える
- `thead` は uppercase tracking-wide、`tbody` は `border-b border-slate-100`
- 行 hover で `bg-slate-50/60`

### Button
- Primary: `bg-navy-900 text-white`
- Secondary: 白＋border
- Success: emerald
- Ghost: 透過

### Kanban Card
- 12px ラベル + 14px タイトル + 数字メタ
- 左上に領域、右上に優先度

## 6. アイコン

- `lucide-react` のみ使用（線が細く B2B SaaS と相性が良い）
- サイズ: 14 (inline) / 16 (section title) / 20+ (decorative)
- 色は周辺テキストに合わせる。アイコン単独で目立たせない

## 7. データの欠落と CSV-first 思想の表現

- 未取込データは「任意・未取込」「未接続」のラベルで明示する
- 不足が分析を保留する場合は **rose** タグで明示（隠さず明示が誠実）
- 「CSVだけで月次診断可能」のメッセージは Data Import / Dashboard / LP の3箇所で繰り返す
- API は「将来的に拡張可能」「任意」と書き、CSVから始める導線を主にする

## 8. AI 表現のルール

- AI生成: ✨ Sparkles アイコン + sky/violet 系の薄い背景
- 信頼度: Pill で「高/中/低」を明示
- AIが断定しすぎない: 「〜の主因候補」「〜が見込めます」のように余白を残す
- 担当者がレビューする前提を文言で明示する（"レビュー中" "確認中"）

## 9. アクセシビリティ最低ライン

- 文字色は最低 WCAG AA を目標（slate-500/700 を本文に使う）
- focus state は Tailwind 標準のリングを残す（後で `focus-visible` を整備）
- アイコン単独ボタンには `aria-label` 必須（追加実装時のチェック項目）

## 10. 余白とリズム

- カード内: 16–20px
- カード間: 16–20px (`gap-5`)
- セクション間: 20–24px (`space-y-5` / `space-y-6`)
- 上下リズムを揃えると「整っている」印象が出るので、勝手にずらさない

## 11. Don't

- グラデやドロップシャドウの過剰使用（B2B 感が崩れる）
- 蛍光色や100%彩度の原色（500番台までに留める）
- 絵文字を意味的に使わない（プロトタイプの限定箇所のみOK）
- 1ページに3つ以上の Primary CTA を置かない
- 動的クラス名（`bg-${color}-500`）— Tailwind パージで消える
