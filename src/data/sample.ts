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
