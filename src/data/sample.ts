// Sample data used across the static MVP prototype.
// Replace with API/CSV-driven data later.

export type KpiTrend = "up" | "down" | "flat";

export type Kpi = {
  key: string;
  label: string;
  value: string;
  delta: string;
  deltaLabel: string;
  trend: KpiTrend;
  spark: number[];
  intent: "positive" | "negative" | "neutral";
};

export const kpis: Kpi[] = [
  {
    key: "sales",
    label: "売上",
    value: "¥12,400,000",
    delta: "+14.3%",
    deltaLabel: "前月比",
    trend: "up",
    intent: "positive",
    spark: [40, 45, 42, 50, 53, 58, 60, 65, 64, 70, 74, 78],
  },
  {
    key: "orders",
    label: "注文数",
    value: "3,284",
    delta: "+8.1%",
    deltaLabel: "前月比",
    trend: "up",
    intent: "positive",
    spark: [50, 53, 55, 58, 60, 62, 64, 65, 67, 70, 72, 73],
  },
  {
    key: "aov",
    label: "AOV",
    value: "¥3,776",
    delta: "+5.7%",
    deltaLabel: "前月比",
    trend: "up",
    intent: "positive",
    spark: [60, 58, 62, 64, 63, 65, 66, 68, 70, 71, 73, 75],
  },
  {
    key: "cvr",
    label: "CVR",
    value: "2.84%",
    delta: "-0.3pt",
    deltaLabel: "前月差",
    trend: "down",
    intent: "negative",
    spark: [78, 76, 74, 72, 70, 70, 68, 66, 64, 63, 62, 60],
  },
  {
    key: "repeat",
    label: "リピート率",
    value: "28.6%",
    delta: "+2.1pt",
    deltaLabel: "前月差",
    trend: "up",
    intent: "positive",
    spark: [50, 52, 53, 55, 56, 58, 60, 61, 62, 64, 66, 68],
  },
  {
    key: "roas",
    label: "広告ROAS",
    value: "312%",
    delta: "-18%",
    deltaLabel: "前月比",
    trend: "down",
    intent: "negative",
    spark: [80, 78, 75, 72, 70, 68, 65, 62, 60, 58, 55, 52],
  },
];

export type Action = {
  id: number;
  title: string;
  area: string;
  impact: "高" | "中" | "低";
  effort: "高" | "中" | "低";
  priority: "P1" | "P2";
  owner: string;
  due: string;
  status: "未着手" | "進行中" | "レビュー中" | "実装済み" | "効果検証中" | "完了";
  rationale: string;
  data: string;
  next: string;
  expected: string;
  product?: string;
  reviewComment?: string;
  reviewer?: string;
  reviewedAt?: string;
};

export const actions: Action[] = [
  {
    id: 1,
    title: "商品A FVコピー改善",
    area: "商品ページ",
    product: "薬用スカルプエッセンス A",
    impact: "高",
    effort: "中",
    priority: "P1",
    owner: "制作担当",
    due: "5/3",
    status: "進行中",
    rationale: "広告訴求とFVコピー不一致",
    data: "商品画像、レビュー",
    next: "改善コピー確認",
    expected: "想定CVR +0.3〜0.5pt",
    reviewComment: "広告クリエイティブのキーメッセージとLP見出しの一貫性を最優先。レビュー文言は薬機法表現を要確認。",
    reviewer: "Growth Lead",
    reviewedAt: "2026/04/29",
  },
  {
    id: 2,
    title: "広告費を商品Bへ一部移行",
    area: "広告",
    product: "モイスチャーセラム B",
    impact: "高",
    effort: "低",
    priority: "P1",
    owner: "広告担当",
    due: "5/4",
    status: "未着手",
    rationale: "在庫十分・CVR安定",
    data: "広告CSV",
    next: "予算配分案を確認",
    expected: "想定売上 +¥720,000",
    reviewComment: "5/1 までに配分案を提示。商品A 在庫減リスクと整合させて在庫担当と要すり合わせ。",
    reviewer: "BPaaS PM",
    reviewedAt: "2026/04/28",
  },
  {
    id: 3,
    title: "初回購入者向けCRMシナリオ追加",
    area: "CRM",
    product: "商品B購入者",
    impact: "中",
    effort: "中",
    priority: "P2",
    owner: "CRM担当",
    due: "5/6",
    status: "レビュー中",
    rationale: "再購入導線不足",
    data: "顧客CSV",
    next: "配信文面レビュー",
    expected: "想定リピート率 +1.5pt",
    reviewComment: "件名と配信時間帯の A/B を5/3 までに用意。配信頻度はオプトアウト率を要モニタ。",
    reviewer: "Growth Lead",
    reviewedAt: "2026/04/29",
  },
  {
    id: 4,
    title: "低回転SKUの露出停止",
    area: "在庫",
    product: "商品D",
    impact: "中",
    effort: "低",
    priority: "P2",
    owner: "MD",
    due: "5/8",
    status: "実装済み",
    rationale: "在庫滞留と広告費過多",
    data: "在庫CSV",
    next: "次の改善提案を生成",
    expected: "在庫効率改善",
  },
  {
    id: 5,
    title: "GA4 LP別CVRの追加確認",
    area: "分析",
    product: "LP別流入",
    impact: "中",
    effort: "低",
    priority: "P2",
    owner: "分析担当",
    due: "5/2",
    status: "効果検証中",
    rationale: "CVR低下要因の特定",
    data: "GA4 CSV",
    next: "効果検証へ移動",
    expected: "原因特定",
  },
  {
    id: 6,
    title: "レビュー導線をFV直下に追加",
    area: "商品ページ",
    product: "商品A",
    impact: "中",
    effort: "低",
    priority: "P2",
    owner: "EC担当",
    due: "5/4",
    status: "レビュー中",
    rationale: "レビューが下部に偏在",
    data: "レビューCSV",
    next: "ワイヤー確認",
    expected: "想定CVR +0.2pt",
    reviewComment: "★平均 / レビュー件数の併記でデコレーション過多にならないよう注意。",
    reviewer: "BPaaS PM",
    reviewedAt: "2026/04/27",
  },
  {
    id: 7,
    title: "定期便オファー訴求改善",
    area: "商品ページ",
    product: "商品A",
    impact: "高",
    effort: "低",
    priority: "P1",
    owner: "EC担当",
    due: "5/4",
    status: "進行中",
    rationale: "定期便メリットが弱い",
    data: "定期便データ",
    next: "オファー文面確認",
    expected: "想定CVR +0.2pt",
  },
  {
    id: 8,
    title: "スマホFVのCTA表示改善",
    area: "商品ページ",
    product: "商品A",
    impact: "中",
    effort: "低",
    priority: "P2",
    owner: "開発担当",
    due: "5/6",
    status: "実装済み",
    rationale: "スマホFVでCTAが見切れ",
    data: "実機確認データ",
    next: "効果検証へ移動",
    expected: "想定CVR +0.2pt",
  },
  {
    id: 9,
    title: "商品A FVコピー改善 効果検証",
    area: "商品ページ",
    product: "商品A",
    impact: "高",
    effort: "低",
    priority: "P1",
    owner: "制作担当",
    due: "5/7",
    status: "効果検証中",
    rationale: "CVR回復施策の効果確認",
    data: "GA4・売上・広告データ",
    next: "効果レポート作成",
    expected: "効果検証中",
    reviewComment: "前後2週間でのCVR比較は 4/16 を境に。スマホ比率の偏りに注意して切り分け。",
    reviewer: "Growth Lead",
    reviewedAt: "2026/04/30",
  },
  {
    id: 10,
    title: "広告クリエイティブ刷新",
    area: "広告",
    product: "商品A・B",
    impact: "中",
    effort: "中",
    priority: "P2",
    owner: "広告担当",
    due: "5/7",
    status: "未着手",
    rationale: "CTR低下のため",
    data: "広告CSV、クリエイティブ一覧",
    next: "新クリエイティブ案確認",
    expected: "想定売上 +¥320,000",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  judgment: "伸ばす" | "改善" | "維持" | "停止検討" | "要調査";
  sales: string;
  cvr: string;
  cvrDelta: string;
  cvrTrend: "up" | "down" | "flat";
  stock: number;
  ad: string;
  recommendation: string;
};

export const products: Product[] = [
  {
    id: "A",
    name: "Product A",
    category: "ヘアケア",
    judgment: "改善",
    sales: "¥3,920,000",
    cvr: "2.1%",
    cvrDelta: "-0.7pt",
    cvrTrend: "down",
    stock: 420,
    ad: "¥880,000",
    recommendation: "FV訴求とレビュー導線を修正",
  },
  {
    id: "B",
    name: "Product B",
    category: "スキンケア",
    judgment: "伸ばす",
    sales: "¥2,480,000",
    cvr: "3.8%",
    cvrDelta: "+0.4pt",
    cvrTrend: "up",
    stock: 860,
    ad: "¥420,000",
    recommendation: "広告配分を増やす",
  },
  {
    id: "C",
    name: "Product C",
    category: "クレンジング",
    judgment: "維持",
    sales: "¥1,760,000",
    cvr: "3.1%",
    cvrDelta: "0.0pt",
    cvrTrend: "flat",
    stock: 240,
    ad: "¥210,000",
    recommendation: "現状維持",
  },
  {
    id: "D",
    name: "Product D",
    category: "サプリ",
    judgment: "停止検討",
    sales: "¥640,000",
    cvr: "1.2%",
    cvrDelta: "-0.5pt",
    cvrTrend: "down",
    stock: 980,
    ad: "¥360,000",
    recommendation: "広告停止と在庫消化施策",
  },
  {
    id: "E",
    name: "Product E",
    category: "ギフト",
    judgment: "要調査",
    sales: "¥520,000",
    cvr: "—",
    cvrDelta: "—",
    cvrTrend: "flat",
    stock: 120,
    ad: "未連携",
    recommendation: "GA4/広告CSV追加確認",
  },
];

export type DataSource = {
  name: string;
  status: "取込済み" | "要確認" | "未接続" | "任意";
  method: "CSV" | "アップロード" | "CSV/API";
  updated: string;
  count: string;
  impact: string;
  action: "再取込" | "確認" | "取込" | "接続" | "追加";
};

export const dataSources: DataSource[] = [
  {
    name: "Shopify注文データ",
    status: "取込済み",
    method: "CSV",
    updated: "2026/04/29",
    count: "3,284件",
    impact: "月売上診断に必須",
    action: "再取込",
  },
  {
    name: "Shopify商品データ",
    status: "取込済み",
    method: "CSV",
    updated: "2026/04/29",
    count: "186商品",
    impact: "商品別改善に使用",
    action: "確認",
  },
  {
    name: "在庫/SKUデータ",
    status: "要確認",
    method: "CSV",
    updated: "2026/04/27",
    count: "142 SKU",
    impact: "在庫判断の精度に影響",
    action: "確認",
  },
  {
    name: "商品画像",
    status: "任意",
    method: "アップロード",
    updated: "未取込",
    count: "0件",
    impact: "商品ページ改善に有効",
    action: "追加",
  },
  {
    name: "レビューCSV",
    status: "未接続",
    method: "CSV",
    updated: "未取込",
    count: "0件",
    impact: "信頼要素診断が保留",
    action: "取込",
  },
  {
    name: "GA4データ",
    status: "任意",
    method: "CSV/API",
    updated: "未取込",
    count: "0件",
    impact: "LP別CVR分析に有効",
    action: "接続",
  },
  {
    name: "広告データ",
    status: "取込済み",
    method: "CSV",
    updated: "2026/04/28",
    count: "42キャンペーン",
    impact: "ROAS診断に使用",
    action: "再取込",
  },
  {
    name: "キャンペーンデータ",
    status: "任意",
    method: "CSV/API",
    updated: "未取込",
    count: "0件",
    impact: "広告訴求整合に有効",
    action: "追加",
  },
  {
    name: "CRM/リピートデータ",
    status: "取込済み",
    method: "CSV",
    updated: "2026/04/25",
    count: "12,480顧客",
    impact: "リピート分析に使用",
    action: "確認",
  },
];

export type Insight = {
  area: "商品ページ" | "広告・流入" | "CRM・リピート" | "在庫・SKU";
  state: "要改善" | "配分見直し" | "伸長余地" | "要確認";
  summary: string;
  impact: "高" | "中" | "低";
  next: string;
};

export const insights: Insight[] = [
  {
    area: "商品ページ",
    state: "要改善",
    summary: "商品AのFV訴求とレビュー導線がCVR低下の主因候補。",
    impact: "高",
    next: "商品ページ改善案を作成",
  },
  {
    area: "広告・流入",
    state: "配分見直し",
    summary:
      "商品Aへの広告費集中に対してROASが悪化。商品Bは拡張余地あり。",
    impact: "高",
    next: "広告配分を再設計",
  },
  {
    area: "CRM・リピート",
    state: "伸長余地",
    summary:
      "初回購入者の再購入率は改善傾向。商品B購入者へのCRM強化が有効。",
    impact: "中",
    next: "再購入シナリオ追加",
  },
  {
    area: "在庫・SKU",
    state: "要確認",
    summary: "低回転SKUの在庫滞留が発生。広告停止と露出整理が必要。",
    impact: "中",
    next: "在庫消化施策を検討",
  },
];

export type ReportSection = {
  id: string;
  no: string;
  title: string;
  status: "AI生成済み" | "数値確認済み" | "担当者レビュー中" | "施策ボード反映済み" | "一部確認済み" | "要確認" | "表現リスク確認";
};

export const reportSections: ReportSection[] = [
  { id: "exec", no: "01", title: "エグゼクティブサマリー", status: "AI生成済み" },
  { id: "kpi", no: "02", title: "主要KPI", status: "数値確認済み" },
  { id: "diag", no: "03", title: "AI総合診断", status: "担当者レビュー中" },
  { id: "product", no: "04", title: "商品別改善判断", status: "AI生成済み" },
  { id: "actions", no: "05", title: "実行施策", status: "施策ボード反映済み" },
  { id: "results", no: "06", title: "効果検証", status: "一部確認済み" },
  { id: "next", no: "07", title: "次月アクション", status: "要確認" },
  {
    id: "data",
    no: "08",
    title: "データ不足/注意事項",
    status: "表現リスク確認",
  },
];

export const productPageDiagnosis = [
  { id: "1", title: "ファーストビュー", score: 62, label: "要改善", note: "ベネフィットが弱い" },
  { id: "2", title: "商品画像", score: 70, label: "改善余地", note: "使用シーン不足" },
  { id: "3", title: "商品説明", score: 66, label: "要改善", note: "根拠が分散" },
  { id: "4", title: "レビュー/信頼要素", score: 58, label: "要改善", note: "レビュー導線が下部に偏り" },
  { id: "5", title: "CTA", score: 64, label: "要改善", note: "購入ボタンの訴求が弱い" },
  { id: "6", title: "価格/オファー", score: 72, label: "確認", note: "定期便メリットが弱い" },
  { id: "7", title: "スマホ表示", score: 61, label: "要改善", note: "FV内CTAが見切れ" },
  { id: "8", title: "広告流入との整合性", score: 55, label: "要改善", note: "広告訴求とFVコピーが不一致" },
];

export const productPageActions = [
  {
    id: 1,
    title: "FVコピーと構成を広告訴求に合わせる",
    cvrLift: "+0.3〜0.5pt",
    impact: "高",
    effort: "中",
    priority: "P1",
    owner: "制作担当",
    due: "5/3",
  },
  {
    id: 2,
    title: "レビュー星と使用者の声をFV直下に移動",
    cvrLift: "+0.2pt",
    impact: "中",
    effort: "低",
    priority: "P1",
    owner: "EC担当",
    due: "5/4",
  },
  {
    id: 3,
    title: "定期便CTAと初回オファーを明確化",
    cvrLift: "+0.2〜0.4pt",
    impact: "高",
    effort: "低",
    priority: "P1",
    owner: "EC担当",
    due: "5/4",
  },
  {
    id: 4,
    title: "スマホFVのCTA表示を改善",
    cvrLift: "+0.2pt",
    impact: "中",
    effort: "中",
    priority: "P2",
    owner: "開発担当",
    due: "5/6",
  },
  {
    id: 5,
    title: "広告文とLP見出しの整合チェック",
    cvrLift: "離脱率改善",
    impact: "中",
    effort: "低",
    priority: "P2",
    owner: "広告担当",
    due: "5/2",
  },
];

export const cycleSteps = [
  { step: 1, title: "CSV/API取込", state: "完了", date: "完了" },
  { step: 2, title: "AI診断", state: "完了", date: "完了" },
  { step: 3, title: "施策レビュー中", state: "進行中", date: "進行中" },
  { step: 4, title: "実行管理", state: "未完了", date: "未完了" },
  { step: 5, title: "翌月比較", state: "待機", date: "待機" },
];

export const monthlyStats = {
  totalActions: 18,
  done: 6,
  inProgress: 5,
  review: 3,
  expectedSalesLift: "+¥2,450,000",
  monthlyGoal: { current: 6, target: 12, percent: 50 },
};

// --- Revenue variance / driver decomposition ---
// 売上 = セッション数 × CVR × AOV の構造で、前月との売上差分を要因に分解する。
// GA4 / BigQuery の本接続前の段階で、CSVと前提値だけで「何が原因で売上が動いたか」を
// 見せるための静的サンプル。実APIに接続したら、ここを置き換える。

export type RevenueFactorKey = "sessions" | "cvr" | "aov";

export type RevenueFactor = {
  key: RevenueFactorKey;
  label: string;
  unit: string;
  prevValue: string;
  currValue: string;
  changeLabel: string;
  changeIntent: "positive" | "negative" | "neutral";
  impactYen: number;
  impactLabel: string;
  driverNote: string;
};

export type RevenueCauseCategory =
  | "流入"
  | "商品ページCVR"
  | "カート/決済"
  | "AOV"
  | "在庫/商品";

export type RevenueCause = {
  id: string;
  category: RevenueCauseCategory;
  scope: "商品" | "チャネル" | "全体";
  target: string;
  summary: string;
  evidence: string;
  impact: "高" | "中" | "低";
};

export type RevenueNextActionArea =
  | "商品ページ"
  | "広告"
  | "CRM"
  | "在庫"
  | "オファー";

export type RevenueNextAction = {
  id: string;
  area: RevenueNextActionArea;
  title: string;
  why: string;
  expected: string;
  effort: "高" | "中" | "低";
  priority: "P1" | "P2";
  sendTo: "施策ボード" | "AI考察レポート";
};

export type RevenueDataReadiness = {
  label: string;
  state: "取込済み" | "次フェーズ" | "将来";
  note: string;
};

export type RevenueAnalysis = {
  month: string;
  prevMonth: string;
  prevRevenue: number;
  currRevenue: number;
  diffYen: number;
  diffPercent: string;
  intent: "positive" | "negative" | "neutral";
  primaryDriver: string;
  headline: string;
  factors: RevenueFactor[];
  causes: RevenueCause[];
  nextActions: RevenueNextAction[];
  dataReadiness: RevenueDataReadiness[];
};

export const revenueAnalysis: RevenueAnalysis = {
  month: "2026年4月",
  prevMonth: "2026年3月",
  prevRevenue: 14_150_000,
  currRevenue: 12_400_000,
  diffYen: -1_750_000,
  diffPercent: "-12.4%",
  intent: "negative",
  primaryDriver: "CVR低下と流入減（セッション数）がほぼ同量で寄与",
  headline:
    "売上は前月比 -12.4%（-¥1,750,000）。商品ページCVR低下と広告流入の縮小が主因候補。AOV はわずかに改善。",
  factors: [
    {
      key: "sessions",
      label: "セッション数",
      unit: "回",
      prevValue: "124,300",
      currValue: "115,600",
      changeLabel: "-7.0%",
      changeIntent: "negative",
      impactYen: -990_000,
      impactLabel: "-¥990,000",
      driverNote: "Google広告のクリック数減と SEO流入の縮小が中心。",
    },
    {
      key: "cvr",
      label: "CVR（購入率）",
      unit: "%",
      prevValue: "3.05%",
      currValue: "2.84%",
      changeLabel: "-0.21pt（-6.9%）",
      changeIntent: "negative",
      impactYen: -970_000,
      impactLabel: "-¥970,000",
      driverNote: "商品AのFV訴求とレビュー導線が低下要因の主因候補。",
    },
    {
      key: "aov",
      label: "AOV（平均注文単価）",
      unit: "円",
      prevValue: "¥3,732",
      currValue: "¥3,776",
      changeLabel: "+1.2%",
      changeIntent: "positive",
      impactYen: 210_000,
      impactLabel: "+¥210,000",
      driverNote: "セット販売とギフト商品の比率がわずかに増加。",
    },
  ],
  causes: [
    {
      id: "c1",
      category: "流入",
      scope: "チャネル",
      target: "Google広告",
      summary:
        "クリック単価上昇でクリック数 -14%。広告経由セッションがそのまま縮小。",
      evidence: "広告クリック -14% / 広告経由セッション -12%",
      impact: "高",
    },
    {
      id: "c2",
      category: "流入",
      scope: "チャネル",
      target: "オーガニック検索",
      summary: "新カテゴリ記事のインプレッションが減少傾向。",
      evidence: "SEO流入 -6%",
      impact: "中",
    },
    {
      id: "c3",
      category: "商品ページCVR",
      scope: "商品",
      target: "商品A",
      summary:
        "FV訴求と広告コピーの不一致でCVRが低下。レビューが下部にあり信頼形成も遅い。",
      evidence: "商品A CVR -0.7pt / 直帰率 +5pt",
      impact: "高",
    },
    {
      id: "c4",
      category: "カート/決済",
      scope: "全体",
      target: "決済導線",
      summary:
        "スマホでの決済離脱が増加。送料表示のタイミングが後ろ倒しの可能性。",
      evidence: "カート → 決済完了率 -3pt（スマホ）",
      impact: "中",
    },
    {
      id: "c5",
      category: "AOV",
      scope: "商品",
      target: "ギフトセット",
      summary: "ギフト商品比率の増加で平均単価がわずかに上昇（プラス要因）。",
      evidence: "ギフト商品比率 +2pt",
      impact: "低",
    },
    {
      id: "c6",
      category: "在庫/商品",
      scope: "商品",
      target: "商品D",
      summary: "低回転SKUへの広告露出が継続し、効率が悪い。",
      evidence: "商品D 広告比率高 / CVR低位",
      impact: "中",
    },
  ],
  nextActions: [
    {
      id: "n1",
      area: "商品ページ",
      title: "商品A FVコピーとレビュー導線をリニューアル",
      why: "CVR低下の主因候補を直接解消する。",
      expected: "想定CVR +0.3〜0.5pt / 売上回復 +¥420,000",
      effort: "中",
      priority: "P1",
      sendTo: "施策ボード",
    },
    {
      id: "n2",
      area: "広告",
      title: "Google広告の予算配分を 商品B 寄りへ調整",
      why: "ROAS安定の商品Bに予算を寄せ、流入効率を取り戻す。",
      expected: "想定売上 +¥320,000",
      effort: "低",
      priority: "P1",
      sendTo: "施策ボード",
    },
    {
      id: "n3",
      area: "CRM",
      title: "初回購入者向け再購入シナリオの強化",
      why: "購入頻度を底上げし、来月以降の売上安定に寄与。",
      expected: "想定リピート率 +1.5pt",
      effort: "中",
      priority: "P2",
      sendTo: "施策ボード",
    },
    {
      id: "n4",
      area: "オファー",
      title: "送料閾値の再設計（2点購入で送料無料）",
      why: "AOVのプラス傾向を強化し、CVR悪化分を一部相殺。",
      expected: "想定AOV +¥80",
      effort: "低",
      priority: "P2",
      sendTo: "AI考察レポート",
    },
  ],
  dataReadiness: [
    {
      label: "注文CSV",
      state: "取込済み",
      note: "売上 / 注文数 / AOV を確定。商品別売上も集計済み。",
    },
    {
      label: "GA4 CSV",
      state: "次フェーズ",
      note: "セッション数 / 流入チャネル別CVR を正確化するために必要。",
    },
    {
      label: "広告CSV",
      state: "次フェーズ",
      note: "広告経由セッションと CVR / ROAS を切り分けるために必要。",
    },
    {
      label: "BigQuery（読み取り）",
      state: "将来",
      note: "顧客が保有する BigQuery を読み取り専用で接続し、自動更新する想定。",
    },
  ],
};

// ガイド画面用データ (v2 = 説明サイト風)。
// /app/guide は Hero + Reading path + sticky TOC + 5章 の説明サイト構成で再設計する。
// 各章は HTML/SVG の live infographic で説明し、画像生成への依存を持たない。
// 計画書: docs/guide-v2-plan.md / 旧プラン: docs/guide-infographic-plan.md
export type GuideToneV2 = "navy" | "sky" | "mint" | "gold" | "violet" | "rose";

// Hero — ページ冒頭の枠
export type GuideHeroV2 = {
  eyebrow: string;
  title: string;
  lead: string;
  bullets: { label: string; body: string }[];
  caveat: { label: string; body: string };
};

// Reading path — 読者ペルソナごとの推奨ルート
export type GuideReadingPathV2 = {
  id: string;
  audience: string;
  estMin: string;
  description: string;
  route: { anchor: string; label: string }[];
  tone: GuideToneV2;
};

// 各章のインフォグラフィック種別 (live HTML/SVG)
export type LoopDiagramNodeV2 = {
  label: string;
  sublabel: string;
  tone: GuideToneV2;
};

export type StepPipelineStepV2 = {
  num: string;
  title: string;
  sub: string;
  to?: string;
  tone: GuideToneV2;
};

export type QuadrantCellV2 = {
  label: string;
  pillLabel: string;
  body: string;
  tone: GuideToneV2;
};

export type ScreenAnatomyV2 = {
  id: string;
  title: string;
  to: string;
  oneLiner: string;
  blocks: { label: string; tone: GuideToneV2 }[];
  reading: { phase: "Why" | "What" | "Action"; body: string }[];
  hint?: string;
};

export type ExecTimelineSegmentV2 = {
  from: number; // 経過分
  to: number;
  label: string;
  say: string;
  tone: GuideToneV2;
};

export type GuideAnatomyV2 =
  | { kind: "loop-diagram"; nodes: LoopDiagramNodeV2[] }
  | { kind: "step-pipeline"; steps: StepPipelineStepV2[] }
  | { kind: "quadrant-legend"; cells: QuadrantCellV2[] }
  | { kind: "screen-anatomy"; screens: ScreenAnatomyV2[] }
  | { kind: "exec-timeline"; segments: ExecTimelineSegmentV2[] };

// 章 (Chapter)
export type GuideChapterV2 = {
  id: string;
  number: string;
  title: string;
  estMin: number;
  intro: string;
  bullets: string[];
  tone: GuideToneV2;
  anatomy: GuideAnatomyV2;
  callout?: { tone: GuideToneV2; label: string; body: string };
  links?: { to: string; label: string }[];
};

// Hero
export const guideHeroV2: GuideHeroV2 = {
  eyebrow: "EC Growth Studio AI — ガイド",
  title: "月次EC改善BPaaS の使い方を5〜10分で理解する",
  lead: "EC Growth Studio AI は「レポートで終わらせず、AI診断 → 人間レビュー → 実行管理 → 月次報告を1ループで回す」プロトタイプ。本ページは初見の上司・社内関係者・候補顧客・運用担当向けに、世界観と使い方を1ページで読める説明サイトとして用意している。",
  bullets: [
    {
      label: "CSV-first / API-later",
      body: "注文 / GA4 / 広告 CSV をブラウザに取込めば、その場で売上・CVR・ROAS が実値で動く。API なしで月次運用フローを開始できる。",
    },
    {
      label: "AI診断 × 人間レビュー",
      body: "AI が課題候補と改善機会を量で出し、最終判断と優先順位は担当者が決める。境界は施策ボード化のタイミング。",
    },
    {
      label: "月次改善ループ",
      body: "毎月同じ順序で同じ画面を回す。属人性を抑え、担当が変わっても継続できる運用にする。",
    },
  ],
  caveat: {
    label: "必ず最初に伝える前提",
    body: "実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続。CSV取込（実値）と BigQueryデモ Mode（Preview 限定の見え方再現）の2系統で運用フローを示す。",
  },
};

// Reading path
export const guideReadingPathsV2: GuideReadingPathV2[] = [
  {
    id: "exec",
    audience: "上司 / 社内決裁者",
    estMin: "5分",
    description: "TL;DR → 全体像 → 上司デモの流れ の順で読むと最短で世界観が掴める。",
    tone: "navy",
    route: [
      { anchor: "ch-overview", label: "01 全体像" },
      { anchor: "ch-monthly-loop", label: "02 月次改善ループ" },
      { anchor: "ch-exec-demo", label: "05 上司デモの流れ" },
    ],
  },
  {
    id: "client",
    audience: "クライアント候補 (初見)",
    estMin: "7〜10分",
    description: "全体像 → 月次ループ → 月次レポートの使い方 を流すと提供価値が伝わりやすい。",
    tone: "sky",
    route: [
      { anchor: "ch-overview", label: "01 全体像" },
      { anchor: "ch-monthly-loop", label: "02 月次改善ループ" },
      { anchor: "ch-screens", label: "04 画面別の使い方" },
    ],
  },
  {
    id: "operator",
    audience: "社内オペレーター (運用担当)",
    estMin: "10〜15分",
    description: "月次ループ → データ取込 → 画面別の使い方 → 上司デモ の順で運用イメージを固める。",
    tone: "mint",
    route: [
      { anchor: "ch-monthly-loop", label: "02 月次改善ループ" },
      { anchor: "ch-data-import", label: "03 データ取込と未接続範囲" },
      { anchor: "ch-screens", label: "04 画面別の使い方" },
      { anchor: "ch-exec-demo", label: "05 上司デモの流れ" },
    ],
  },
];

// Chapters
export const guideChaptersV2: GuideChapterV2[] = [
  {
    id: "ch-overview",
    number: "01",
    title: "全体像 — 月次EC改善BPaaS の世界観",
    estMin: 2,
    tone: "navy",
    intro:
      "EC Growth Studio AI は、レポートで終わらせず「毎月の売上改善を1つの運用ループとして回す」ためのプロトタイプ。AI診断 → 人間レビュー → 施策実行 → 月次報告 までを1画面構成で繋ぐ。",
    bullets: [
      "対象は月商 100万〜5,000万円規模の EC / D2C 事業者",
      "提供形態は SaaS UI ＋ BPaaS 伴走（人間レビュー・月次会議・効果検証）",
      "CSV-first / API-later — Shopify API なしでも CSV だけで月次改善を開始できる",
      "AI診断は出発点で、最終判断は担当者が行う運用設計",
    ],
    anatomy: {
      kind: "loop-diagram",
      nodes: [
        { label: "AI診断", sublabel: "課題と機会を量で出す", tone: "violet" },
        { label: "人間レビュー", sublabel: "採用と優先順位を決める", tone: "sky" },
        { label: "施策実行", sublabel: "担当・期限・進捗を管理", tone: "mint" },
        { label: "月次報告", sublabel: "翌月会議の入口を作る", tone: "navy" },
      ],
    },
    callout: {
      tone: "navy",
      label: "現MVPで担保していること",
      body: "実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続。CSV取込（実値）と BigQueryデモ Mode（Preview 限定の見え方再現）の2系統で運用フローを示す。",
    },
    links: [{ to: "/app", label: "ダッシュボードを開く" }],
  },
  {
    id: "ch-monthly-loop",
    number: "02",
    title: "月次改善ループ — 6ステップ",
    estMin: 2,
    tone: "sky",
    intro:
      "「CSV/API取込 → 売上要因分析 → AI考察 → 施策ボード → 効果検証 → 月次レポート」を毎月回す。各ステップが本プロダクトの画面に1対1で対応する。",
    bullets: [
      "Step 1 データ取込 — 注文 / GA4 / 広告 CSV を取込み実値で計算",
      "Step 2 売上要因分析 — 売上 = セッション × CVR × AOV に分解",
      "Step 3 AI考察レポート — 商品 / 流入 / CRM / 在庫 の4領域で課題を整理",
      "Step 4 施策ボード — 担当 / 期限 / 進捗 / 効果検証を管理",
      "Step 5 効果検証 — 実装後の翌月KPIで突き合わせ",
      "Step 6 月次レポート — 顧客提出用に整え、次月会議へ繋ぐ",
    ],
    anatomy: {
      kind: "step-pipeline",
      steps: [
        { num: "1", title: "データ取込", sub: "注文 / GA4 / 広告 CSV", to: "/app/data-import", tone: "navy" },
        { num: "2", title: "売上要因分析", sub: "セッション×CVR×AOV", to: "/app/revenue-analysis", tone: "sky" },
        { num: "3", title: "AI考察", sub: "4領域の課題と機会", to: "/app/ai-report", tone: "violet" },
        { num: "4", title: "施策ボード", sub: "担当 / 期限 / 進捗", to: "/app/action-board", tone: "mint" },
        { num: "5", title: "効果検証", sub: "実装後の翌月KPI", to: "/app/action-board", tone: "gold" },
        { num: "6", title: "月次レポート", sub: "顧客提出用に整える", to: "/app/monthly-report", tone: "rose" },
      ],
    },
    callout: {
      tone: "sky",
      label: "ポイント",
      body: "毎月同じ順序で同じ画面を回すことで、属人性を抑え、担当が変わっても継続できる運用にする。",
    },
    links: [
      { to: "/app/data-import", label: "データ取込を開く" },
      { to: "/app/action-board", label: "施策ボードを開く" },
    ],
  },
  {
    id: "ch-data-import",
    number: "03",
    title: "データ取込と未接続範囲",
    estMin: 2,
    tone: "gold",
    intro:
      "本MVPは CSV取込（実値）で動かし、実 GCP / 実 API / 実 AI 生成には未接続。どの数字が実値で、どこが将来接続かを毎画面で明示する。",
    bullets: [
      "実値: 注文CSV / GA4 CSV / 広告CSV をブラウザ内で集計（売上・注文・AOV・CVR・ROAS）",
      "デモ: BigQuery デモ Mode は Preview 限定で mode:\"mock\" 応答を返す（実 GCP 接続ではない）",
      "未接続: GA4 Data API / Google広告 / Meta広告 / Shopify Admin API / 実 AI 生成",
      "将来予定: 実 BigQuery クエリ実行 / 認証 / 永続化 / マルチテナント",
    ],
    anatomy: {
      kind: "quadrant-legend",
      cells: [
        {
          label: "実値",
          pillLabel: "CSV取込",
          body: "注文 / GA4 / 広告 CSV をブラウザで集計。売上・注文・AOV・CVR・ROAS まで実値で計算。",
          tone: "mint",
        },
        {
          label: "デモ",
          pillLabel: "BigQuery mock (Preview)",
          body: "Preview の `BQ_MOCK_MODE=true` でのみ mode:\"mock\" の固定応答を返す。実 GCP 接続ではない。Production は安全停止し CSV / サンプル値にフォールバック。",
          tone: "sky",
        },
        {
          label: "未接続",
          pillLabel: "実 API / 実 AI",
          body: "GA4 Data API / Google広告 / Meta広告 / Shopify Admin API / 実 AI 生成 はいずれも未接続。",
          tone: "gold",
        },
        {
          label: "将来予定",
          pillLabel: "Phase 3 / 4",
          body: "実 BigQuery クエリ実行 / 認証 / 永続化 / マルチテナントは後続フェーズで実装予定。",
          tone: "violet",
        },
      ],
    },
    callout: {
      tone: "rose",
      label: "誤認文言の禁止",
      body: "BigQuery / GCP / 実データ などを使って実接続済みと誤認させる完了形の表現はデモでも資料でも使わない。常に「実値 / デモ / 未接続 / 将来予定」の4区分で話す。",
    },
    links: [{ to: "/app/data-import", label: "データ取込画面を開く" }],
  },
  {
    id: "ch-screens",
    number: "04",
    title: "画面別の使い方",
    estMin: 4,
    tone: "violet",
    intro:
      "5つの画面が「Why → What → Action」の順序で繋がる。司令塔の Dashboard から要因分析・AI考察・施策ボード・月次レポートへ降りていく。",
    bullets: [
      "Dashboard は司令塔。KPIと優先アクション・データ連携状態を1画面で俯瞰する",
      "売上要因分析は 売上 = セッション × CVR × AOV の分解で「次に直す場所」を決める",
      "AI考察は商品 / 流入 / CRM / 在庫 の4領域で課題と機会を提示する出発点",
      "施策ボードは担当 / 期限 / 進捗 / 効果検証を1ヶ所で管理する実行レイヤ",
      "月次レポートは Executive Summary / KPI推移 / AI考察 / 実行 / 効果検証 / 次月計画 を1枚で整える",
    ],
    anatomy: {
      kind: "screen-anatomy",
      screens: [
        {
          id: "screen-dashboard",
          title: "Dashboard (司令塔)",
          to: "/app",
          oneLiner: "KPI / AI月次診断サマリー / 月次改善サイクル / 優先アクションTOP5 を俯瞰する。",
          blocks: [
            { label: "データソースバー", tone: "sky" },
            { label: "KPI 6指標", tone: "navy" },
            { label: "AI月次診断サマリー", tone: "violet" },
            { label: "月次改善サイクル", tone: "mint" },
            { label: "優先アクションTOP5", tone: "gold" },
          ],
          reading: [
            { phase: "Why", body: "AI考察と KPI で重要度の根拠を確認する" },
            { phase: "What", body: "KPI / 商品別判断で現状をつかむ" },
            { phase: "Action", body: "優先アクションTOP5 から次の一手を決める" },
          ],
        },
        {
          id: "screen-revenue",
          title: "売上要因分析",
          to: "/app/revenue-analysis",
          oneLiner: "売上 = セッション × CVR × AOV に分解し、主因候補を特定する。",
          blocks: [
            { label: "Hero サマリー", tone: "navy" },
            { label: "要因カード3列", tone: "sky" },
            { label: "売上ブリッジ", tone: "mint" },
            { label: "GA4 チャネル別", tone: "violet" },
            { label: "効率悪化キャンペーン", tone: "rose" },
          ],
          reading: [
            { phase: "Why", body: "前月差をどの因子が動かしたか見る" },
            { phase: "What", body: "因子カードで影響額を比較する" },
            { phase: "Action", body: "推奨アクションを施策ボード or AI考察へ送る" },
          ],
        },
        {
          id: "screen-ai-report",
          title: "AI考察レポート",
          to: "/app/ai-report",
          oneLiner: "商品 / 流入 / CRM / 在庫 の4領域で課題と機会を分解する出発点。",
          blocks: [
            { label: "領域フィルタ", tone: "navy" },
            { label: "商品 / 流入 / CRM / 在庫", tone: "violet" },
            { label: "インパクト × 工数 × 優先度", tone: "gold" },
            { label: "施策ボードへ送る", tone: "mint" },
          ],
          reading: [
            { phase: "Why", body: "AIは気づきの量を担保し、人間が採用を決める" },
            { phase: "What", body: "各カードのインパクト / 工数 / 優先度を読む" },
            { phase: "Action", body: "採用するものを施策ボードに送る" },
          ],
          hint: "現MVPは静的サンプル文言。Phase 4 で Anthropic SDK + prompt cache に接続予定。",
        },
        {
          id: "screen-action-board",
          title: "施策ボード",
          to: "/app/action-board",
          oneLiner: "担当 / 期限 / 進捗 / 効果検証 を1ヶ所で管理する実行レイヤ。",
          blocks: [
            { label: "サマリー6タイル", tone: "navy" },
            { label: "担当別ロード", tone: "sky" },
            { label: "カンバン6レーン", tone: "mint" },
            { label: "効果検証", tone: "violet" },
            { label: "レビューコメント", tone: "gold" },
          ],
          reading: [
            { phase: "Why", body: "実行されない施策は無いのと同じ" },
            { phase: "What", body: "レーン位置とインパクト / 工数を確認する" },
            { phase: "Action", body: "担当・期限・期待値を必ず埋めて回す" },
          ],
        },
        {
          id: "screen-monthly-report",
          title: "月次レポート",
          to: "/app/monthly-report",
          oneLiner: "Executive Summary / KPI / AI考察 / 実行 / 効果検証 / 次月計画 を1枚で整える。",
          blocks: [
            { label: "Cover (KPI Snapshot)", tone: "navy" },
            { label: "Issues / 効果検証", tone: "rose" },
            { label: "Next Month 期待効果", tone: "mint" },
            { label: "Data Sources スコア", tone: "sky" },
            { label: "編集ステータス", tone: "violet" },
          ],
          reading: [
            { phase: "Why", body: "報告で終わらせず、翌月会議の入口にする" },
            { phase: "What", body: "各章は他画面のデータから自動反映される" },
            { phase: "Action", body: "末尾を「次月の優先施策3件」で締める" },
          ],
        },
      ],
    },
    callout: {
      tone: "violet",
      label: "Why → What → Action の流れ",
      body: "なぜ重要か（AI考察）→ 現状（KPI / 因子）→ 次の一手（施策） の順で読むと、画面が変わっても判断の流れが揃う。",
    },
    links: [
      { to: "/app", label: "ダッシュボード" },
      { to: "/app/revenue-analysis", label: "売上要因分析" },
      { to: "/app/ai-report", label: "AI考察レポート" },
      { to: "/app/action-board", label: "施策ボード" },
      { to: "/app/monthly-report", label: "月次レポート" },
    ],
  },
  {
    id: "ch-exec-demo",
    number: "05",
    title: "上司デモの流れ（5〜10分）",
    estMin: 2,
    tone: "rose",
    intro:
      "初見の上司・クライアント候補に、本プロトタイプの世界観を5〜10分で伝える推奨フロー。最初の1分で必ず「未接続範囲」を言い切ってから本編に入る。",
    bullets: [
      "0:00–1:00 前置き — 「実 GCP / 実 API / 実 AI には未接続」を最初に言い切る",
      "1:00–3:00 ダッシュボード — KPIとAI月次診断サマリーで世界観を伝える",
      "3:00–5:00 AI考察レポート — 4領域への分解と人間レビューの境界を示す",
      "5:00–7:00 施策ボード — 実行管理と効果検証のレーンを見せる",
      "7:00–9:00 月次レポート — 報告で終わらせない設計を強調する",
      "9:00–10:00 締め — Phase 3（実 BigQuery）/ Phase 4（実 AI）のロードマップ",
    ],
    anatomy: {
      kind: "exec-timeline",
      segments: [
        {
          from: 0,
          to: 1,
          label: "前置き",
          say: "実 GCP / 実 API / 実 AI には未接続。CSV取込（実値）と BigQueryデモ Mode の2系統。",
          tone: "navy",
        },
        {
          from: 1,
          to: 3,
          label: "ダッシュボード",
          say: "KPI 6指標 と AI月次診断サマリーで世界観を伝える。",
          tone: "sky",
        },
        {
          from: 3,
          to: 5,
          label: "AI考察",
          say: "商品 / 流入 / CRM / 在庫 への分解と「最終判断は担当者」の境界を強調。",
          tone: "violet",
        },
        {
          from: 5,
          to: 7,
          label: "施策ボード",
          say: "担当・期限・進捗・効果検証を1ヶ所で管理するレーンを見せる。",
          tone: "mint",
        },
        {
          from: 7,
          to: 9,
          label: "月次レポート",
          say: "報告で終わらせず、末尾の「次月優先施策3件」で翌月へ繋ぐ設計。",
          tone: "gold",
        },
        {
          from: 9,
          to: 10,
          label: "締め",
          say: "Phase 3（実 BigQuery）/ Phase 4（実 AI）のロードマップ。",
          tone: "rose",
        },
      ],
    },
    callout: {
      tone: "rose",
      label: "誤認文言の禁止",
      body: "実接続済みや本番運用と誤認させる完了形の表現（BigQuery / GCP / 実データ / 本番 / 連携 などの組み合わせ）をデモでも資料でも使わない。常に「実値 / デモ / 未接続 / 将来予定」の4区分で話す。",
    },
    links: [{ to: "/app/monthly-report", label: "月次レポートで締める" }],
  },
];

