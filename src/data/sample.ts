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

// ガイド画面用データ。
// 上司・社内関係者・クライアント候補の初見向けに、本プロトタイプの世界観と使い方を
// 短時間で把握できるように 8 項目で整理する。
// `imageSlot` は将来 GPT Image 2.0 で生成したインフォグラフィックを差し込む位置の予約名。
// 画像生成プロンプトは docs/guide-infographic-plan.md 側で管理する。
export type GuideTone = "navy" | "sky" | "mint" | "gold" | "violet" | "rose";

export type GuideItem = {
  id: string;
  step: string;
  title: string;
  lead: string;
  imageSlot: string;
  imageCaption: string;
  bullets: string[];
  callout?: { tone: GuideTone; label: string; body: string };
  link?: { to: string; label: string };
  tone: GuideTone;
};

export const guideItems: GuideItem[] = [
  {
    id: "overview",
    step: "01",
    title: "全体像 — 月次EC改善BPaaSとは",
    lead: "EC Growth Studio AI は、レポートで終わらせず「毎月の売上改善を1つの運用ループとして回す」ためのプロトタイプ。AI診断 → 人間レビュー → 実行管理 → 月次報告までを1画面構成で繋ぐ。",
    imageSlot: "overview-loop",
    imageCaption: "AI診断 × 人間レビュー × 施策実行 × 月次報告 の循環を1枚で示すインフォグラフィック予定地",
    bullets: [
      "対象は月商 100万〜5,000万円規模の EC / D2C 事業者",
      "提供形態は SaaS UI ＋ BPaaS 伴走（人間レビュー・月次会議・効果検証）",
      "CSV-first / API-later — Shopify API なしでも CSV だけで月次改善を開始できる",
      "AI診断は出発点で、最終判断は担当者が行う運用設計",
    ],
    callout: {
      tone: "navy",
      label: "現MVPで担保していること",
      body: "実 GCP / 実 BigQuery / 実 GA4 API / 実 広告 API / 実 AI API には未接続。CSV取込（実値）と BigQueryデモ Mode（接続後の見え方の再現）の2系統で運用フローを示す。",
    },
    link: { to: "/app", label: "ダッシュボードを開く" },
    tone: "navy",
  },
  {
    id: "monthly-loop",
    step: "02",
    title: "月次改善ループ — 6ステップ",
    lead: "「CSV/API取込 → AI診断 → 人間レビュー → 施策ボード → 効果検証 → 月次レポート」を毎月回す。各ステップが本プロダクトの画面に1対1で対応する。",
    imageSlot: "monthly-loop",
    imageCaption: "6ステップのリングと、各ステップの担当者・成果物を示すループ図の予定地",
    bullets: [
      "Step 1 データ取込 — 注文 / GA4 / 広告 CSV を取込み実値で計算",
      "Step 2 売上要因分析 — 売上 = セッション × CVR × AOV に分解",
      "Step 3 AI考察レポート — 売上課題・改善機会・リスクを4領域で整理",
      "Step 4 施策ボード — 担当 / 期限 / 進捗 / 効果検証を管理",
      "Step 5 効果検証 — 実行結果を翌月のKPIで突き合わせ",
      "Step 6 月次レポート — 顧客提出用に整え次月会議へ繋ぐ",
    ],
    callout: {
      tone: "sky",
      label: "ポイント",
      body: "毎月同じ順序で同じ画面を回すことで、属人性を抑え、担当が変わっても継続できる運用にする。",
    },
    link: { to: "/app/action-board", label: "施策ボードを見る" },
    tone: "sky",
  },
  {
    id: "data-import",
    step: "03",
    title: "データ取込と未接続範囲",
    lead: "本MVPは CSV取込（実値）で動かし、実 GCP / 実 API / 実 AI 生成には未接続。どの数字が実値で、どこが将来接続かを毎画面で明示する。",
    imageSlot: "data-import-scope",
    imageCaption: "実値（CSV）/ デモ（BigQuery mock）/ 未接続（実API・実AI）/ 将来予定 の4区分を示す凡例図の予定地",
    bullets: [
      "実値: 注文CSV / GA4 CSV / 広告CSV をブラウザ内で集計（売上・注文・AOV・CVR・ROAS）",
      "デモ: BigQuery デモ Mode は Preview 限定で `mode:\"mock\"` 応答を返す（実 GCP 接続ではない）",
      "未接続: GA4 Data API / Google広告 / Meta広告 / Shopify Admin API / 実 AI 生成",
      "将来予定: 実 BigQuery クエリ実行 / 認証 / 永続化 / マルチテナント",
    ],
    callout: {
      tone: "gold",
      label: "上司・初見の方への前置き",
      body: "「BigQuery / Shopify と本物で繋がっているのか」と勘違いされやすい。デモ前に必ず未接続範囲を明示してから本編に入る。",
    },
    link: { to: "/app/data-import", label: "データ取込画面を開く" },
    tone: "gold",
  },
  {
    id: "dashboard",
    step: "04",
    title: "Dashboard の見方",
    lead: "ダッシュボードは「司令塔」。KPI / AI月次診断サマリー / 月次改善サイクル / 優先アクションTOP5 / 商品別判断 / データ連携状態 を1画面で俯瞰する。",
    imageSlot: "dashboard-anatomy",
    imageCaption: "Dashboard 上の各ブロック（KPI行・AIサマリー・施策TOP5・データ状態バー）を矢印で説明する分解図の予定地",
    bullets: [
      "上部のデータソースバーで「CSV取込 / BigQueryデモ / サンプル」を切替可能",
      "KPI行は 売上 / 注文 / AOV / CVR / リピート / ROAS の6指標",
      "AI月次診断サマリーは「売上機会・リスク・優先施策」の3カードで提示",
      "優先アクションTOP5 と 商品別改善判断 でその月の意思決定材料が揃う",
    ],
    callout: {
      tone: "sky",
      label: "Why → What → Action の流れ",
      body: "なぜ重要か（AI考察）→ 現状（KPIと商品別判断）→ 次の一手（優先アクション）の順で読むと迷いが少ない。",
    },
    link: { to: "/app", label: "ダッシュボードを開く" },
    tone: "navy",
  },
  {
    id: "ai-report",
    step: "05",
    title: "AI考察レポートの扱い",
    lead: "AI考察レポートは「商品 / 広告・流入 / CRM・リピート / 在庫・SKU」の4領域で課題と機会を分解する。現MVPの文言はサンプル固定で、Phase 4 で実 AI 生成に接続する予定。",
    imageSlot: "ai-review-flow",
    imageCaption: "AI診断 → 人間レビュー → 施策ボード化 の3段階フローと「最終判断は担当者」を強調する図の予定地",
    bullets: [
      "AI生成は出発点で、採用判断と優先順位は担当者が行う",
      "各カードに「インパクト / 工数 / 優先度」が付き施策ボードへ送れる",
      "現MVPは静的サンプル文言（数値はサンプル / 文言は固定）",
      "Phase 4 で Anthropic SDK + prompt cache に接続予定",
    ],
    callout: {
      tone: "violet",
      label: "AIと人間の役割分担",
      body: "AIは「気づきの量」を担保し、人間は「採用と優先順位」を担う。その境界が施策ボード化のタイミング。",
    },
    link: { to: "/app/ai-report", label: "AI考察レポートを開く" },
    tone: "violet",
  },
  {
    id: "action-board",
    step: "06",
    title: "施策ボードの使い方",
    lead: "施策ボードは「未着手 / 進行中 / レビュー中 / 実装済み / 効果検証中 / 完了」のレーンで、担当・期限・進捗・効果検証まで1ヶ所で管理する。",
    imageSlot: "action-board-lanes",
    imageCaption: "カンバンレーンと、各カードに乗る情報（担当 / 期限 / インパクト / 効果検証メモ）の説明図の予定地",
    bullets: [
      "AI考察レポート / 売上要因分析 / 商品ページ改善 から施策を1クリックで送り込む",
      "P1 / P2 の優先度・インパクト・工数で並べ替え可能",
      "実装後は「効果検証中」レーンで翌月KPIと突き合わせる",
      "完了レーンに残るカードがそのまま月次レポートの素材になる",
    ],
    callout: {
      tone: "mint",
      label: "運用のコツ",
      body: "「実行されない施策は無いのと同じ」。ボード上で必ず担当・期限・期待値を埋めるルールにすると、月次会議で議論する材料が揃う。",
    },
    link: { to: "/app/action-board", label: "施策ボードを開く" },
    tone: "mint",
  },
  {
    id: "monthly-report",
    step: "07",
    title: "月次レポートの使い方",
    lead: "月次レポートは Executive Summary / KPI推移 / AI考察 / 実行施策 / 効果検証 / 次月計画 を1枚にまとめる。顧客提出用 PDF や次月会議のたたき台になる。",
    imageSlot: "monthly-report-anatomy",
    imageCaption: "1ページレポートのレイアウトと、各ブロックがどの画面のデータから自動反映されるかを矢印で示す図の予定地",
    bullets: [
      "ダッシュボード / AI考察 / 施策ボード のデータが自動で章立てに反映",
      "「数値確認 / レビュー / 反映 / リスク」のステータスで進捗を可視化",
      "顧客提出だけでなく、次月会議のアジェンダとしても使える",
      "AI生成テキストはサンプル固定（Phase 4 で実 AI 接続予定）",
    ],
    callout: {
      tone: "sky",
      label: "BPaaS としての価値",
      body: "報告で終わらせず、月次レポートの最後を「次月の優先施策3件」で締めることで、翌月の運用ループの入口にする。",
    },
    link: { to: "/app/monthly-report", label: "月次レポートを開く" },
    tone: "sky",
  },
  {
    id: "exec-demo",
    step: "08",
    title: "上司デモの流れ（5〜10分）",
    lead: "初見の上司・クライアント候補に、本プロトタイプの世界観を5〜10分で伝える推奨フロー。最初に未接続範囲を1分で明示してから本編に入る。",
    imageSlot: "exec-demo-flow",
    imageCaption: "デモ導入 → ダッシュボード → AI考察 → 施策ボード → 月次レポート の所要時間つきフロー図の予定地",
    bullets: [
      "0:00–1:00 前置き — 「実 GCP / 実 API / 実 AI には未接続」を必ず最初に言い切る",
      "1:00–3:00 ダッシュボード — KPIとAI月次診断サマリーで世界観を伝える",
      "3:00–5:00 AI考察レポート — 課題4領域への分解と人間レビューの境界",
      "5:00–7:00 施策ボード — 実行管理と効果検証のレーンを見せる",
      "7:00–9:00 月次レポート — 報告で終わらせない設計を強調",
      "9:00–10:00 締め — Phase 3（実 BigQuery）/ Phase 4（実 AI）のロードマップ",
    ],
    callout: {
      tone: "rose",
      label: "誤認文言の禁止",
      body: "「BigQuery接続済み」「GCP連携完了」「実データ連携済み」のような誤認を招く言い方はデモでも資料でも使わない。常に「実値 / デモ / 未接続 / 将来予定」の4区分で話す。",
    },
    link: { to: "/app/monthly-report", label: "月次レポートで締める" },
    tone: "rose",
  },
];
