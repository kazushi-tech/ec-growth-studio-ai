import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Sparkles,
  Users,
  KanbanSquare,
  LineChart,
  FileBarChart2,
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  Layers,
  Wand2,
  ChevronRight,
  LayoutDashboard,
  FileEdit,
  Mail,
} from "lucide-react";

const flow = [
  { no: 1, title: "CSV/API取込", desc: "注文・商品・広告・在庫などCSVから取込開始", icon: Database },
  { no: 2, title: "AI診断", desc: "AIが課題と機会を自動で整理", icon: Sparkles },
  { no: 3, title: "人間レビュー", desc: "担当者が内容を確認し優先順位を決定", icon: Users },
  { no: 4, title: "施策ボード", desc: "施策をタスク化し担当・期限を設定", icon: KanbanSquare },
  { no: 5, title: "効果検証", desc: "実行後の効果を数値で検証・改善", icon: LineChart },
  { no: 6, title: "月次レポート", desc: "顧客提出用レポートを作成・共有", icon: FileBarChart2 },
];

const painPoints = [
  {
    icon: Layers,
    title: "Shopify・GA4・広告・CRMが分断",
    body: "データが分散し、全体最適の判断ができない。",
  },
  {
    icon: LineChart,
    title: "CVR・ROAS・在庫を横断して見られない",
    body: "指標が別々で、課題の優先順位がつけづらい。",
  },
  {
    icon: Users,
    title: "改善施策が担当・期限まで落ちない",
    body: "施策がタスク化されず、実行が後回しになる。",
  },
  {
    icon: FileBarChart2,
    title: "月次報告が次月アクションにつながらない",
    body: "報告書で終わり、改善のサイクルが回らない。",
  },
];

// 実装済みの6画面に揃える
const screens = [
  {
    title: "EC売上改善ダッシュボード",
    body: "KPIと優先施策を一覧化",
    icon: LayoutDashboard,
    to: "/app",
  },
  {
    title: "AI考察レポート",
    body: "課題を4領域に分解",
    icon: Sparkles,
    to: "/app/ai-report",
  },
  {
    title: "商品ページ改善",
    body: "8項目診断と改善案",
    icon: FileEdit,
    to: "/app/product-page",
  },
  {
    title: "施策ボード",
    body: "実行・進捗・効果検証を管理",
    icon: KanbanSquare,
    to: "/app/action-board",
  },
  {
    title: "データ取込・連携",
    body: "CSVから開始、APIへ拡張",
    icon: Database,
    to: "/app/data-import",
  },
  {
    title: "月次レポート出力",
    body: "顧客提出用レポートを出力",
    icon: FileBarChart2,
    to: "/app/monthly-report",
  },
];

const apis = ["Shopify API", "GA4", "Google広告", "Meta広告", "BigQuery"];

const cases = [
  {
    icon: ShoppingBag,
    badge: "D2Cコスメ / 月次改善運用",
    body: "商品ページCVR低下をAI診断し、FVコピー・レビュー導線・広告配分を改善",
  },
  {
    icon: ShieldCheck,
    badge: "食品EC / CSV診断から開始",
    body: "注文CSVと広告CSVから売上機会を整理し、次月施策をレポート化",
  },
];

const faq = [
  {
    q: "Shopify API未接続でも始められますか？",
    a: "可能です。注文CSVと商品CSVがあれば、月次AI診断・主要KPI・商品別判断まで実行できます。",
  },
  {
    q: "AIが出した施策は誰が承認しますか？",
    a: "施策ボードで担当者が確認・優先度を調整し、社内承認後に顧客提出用月次レポートに反映します。",
  },
  {
    q: "GA4や広告データはどう連携できますか？",
    a: "CSVアップロード、もしくは将来的にAPI連携で取込できます。CSVから始めて段階的にAPI拡張する設計です。",
  },
];

const plans = [
  {
    badge: "初回診断",
    name: "CSV診断トライアル",
    desc: "まず1回、既存CSVで改善余地を診断",
  },
  {
    badge: "月次運用",
    name: "Growth Studio",
    desc: "月次AI診断、施策管理、レポート出力",
  },
  {
    badge: "個別提案",
    name: "BPaaS伴走",
    desc: "月次会議、人間レビュー、効果検証で支援",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-sky-500">
              <TrendingUp size={16} className="text-navy-950" />
            </div>
            <div className="text-[15px] font-semibold tracking-tight text-navy-900">
              EC Growth Studio AI
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#features">機能</a>
            <a href="#flow">導入メリット</a>
            <a href="#plans">料金プラン</a>
            <a href="#cases">導入事例</a>
            <a href="#faq">よくある質問</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact" className="btn-secondary px-3 py-2 text-xs">
              CSV診断を依頼する
            </a>
            <a href="#contact" className="btn-primary px-3 py-2 text-xs">
              月次改善相談を予約する
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Wand2 size={12} /> AI × 人間レビュー × 月次BPaaS
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-[1.18] tracking-tight text-navy-950 sm:text-4xl lg:text-5xl">
              EC売上改善を、
              <br />
              毎月回すAI運用BPaaS
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              CSVから始めて、AI診断・人間レビュー・実行管理・月次報告まで。
              商品ページ、広告、CRM、在庫を横断して、
              <br className="hidden md:block" />
              今月直すべき改善を整理します。
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#contact" className="btn-primary px-5 py-3 text-sm">
                月次改善相談を予約する
                <ArrowRight size={16} />
              </a>
              <Link to="/app" className="btn-secondary px-5 py-3 text-sm">
                サンプルダッシュボードを見る
                <ChevronRight size={16} />
              </Link>
            </div>
            <ul className="mt-7 grid grid-cols-2 gap-2 text-sm text-slate-700 md:max-w-md">
              {[
                "CSVだけで開始OK",
                "Shopify APIは任意",
                "AI診断 × 人間レビュー",
                "実行管理 × 月次報告",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
                >
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <HeroMock />
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy-950">
            レポートはあるのに、売上改善が回らない
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((p) => (
              <div key={p.title} className="card p-5">
                <p.icon size={20} className="text-navy-700" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section id="flow" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              AI診断から実行・報告まで、月次改善を運用化
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              分析で終わらず、担当・期限・進捗・検証結果まで管理します。
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {flow.map((s) => (
              <div key={s.no} className="card p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white">
                  <s.icon size={16} />
                </div>
                <div className="mt-3 text-xs font-semibold tracking-wider text-emerald-600">
                  STEP {s.no}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {s.title}
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6つの画面（実装済みに揃える） */}
      <section id="features" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid items-end gap-3 sm:flex sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-navy-950">
              EC改善の司令塔になる6つの画面
            </h2>
            <p className="text-xs text-slate-500">
              すべてサンプルデータで体験できます
            </p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {screens.map((s) => (
              <Link
                key={s.title}
                to={s.to}
                className="card card-hover flex items-start gap-3 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy-900 text-white">
                  <s.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    {s.title}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">{s.body}</div>
                </div>
                <ChevronRight size={14} className="mt-1 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-base font-semibold text-navy-950">
                CSV-first / API-later
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                注文CSVだけで月次AI診断・主要KPI・商品別判断を始められます。
                Shopify / GA4 / 広告 API は任意で、後から段階的に拡張できます。
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span>連携:</span>
                {apis.map((a) => (
                  <span
                    key={a}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-base font-semibold text-navy-950">
                AI診断 × 人間レビュー × 月次運用
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Sparkles, t: "月次AI改善診断", d: "課題と機会を整理" },
                  { icon: KanbanSquare, t: "実行施策ボード", d: "担当・期限・効果検証" },
                  { icon: FileBarChart2, t: "顧客提出レポート", d: "月次資料を出力" },
                ].map((f) => (
                  <div
                    key={f.t}
                    className="rounded-md border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <f.icon size={16} className="text-navy-700" />
                    <div className="mt-2 text-xs font-semibold text-slate-900">
                      {f.t}
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      {f.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section id="cases" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-navy-950">
                こんなShopify/EC事業者に
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {[
                  "月商100万〜5,000万円のEC/D2C",
                  "広告費を使っているがROAS改善が職人的",
                  "商品ページ改善が後回しになっている",
                  "CRM・リピート施策を強化したい",
                  "少人数で月次改善を回したい",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-navy-950">
                導入イメージ
              </h2>
              {cases.map((c) => (
                <div key={c.badge} className="card flex gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-900 text-white">
                    <c.icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {c.badge}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy-950">
            料金は店舗規模と運用範囲に応じて個別提案
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className="card p-6">
                <div className="pill-slate w-fit">{p.badge}</div>
                <h3 className="mt-3 text-lg font-bold text-navy-950">{p.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            店舗規模・データ連携範囲・運用体制に応じてご提案します。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy-950">
            よくある質問
          </h2>
          <div className="mt-8 space-y-3">
            {faq.map((f) => (
              <details
                key={f.q}
                className="card group p-5 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  {f.q}
                  <ChevronRight
                    size={16}
                    className="text-slate-400 transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-navy-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs">
                <Mail size={12} /> 問い合わせ
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                今月のEC改善、
                <br className="md:hidden" />
                どこから直すべきかを見える化しませんか
              </h2>
              <p className="mt-4 text-sm leading-7 text-navy-200">
                CSV診断（1回）または月次改善相談からお選びいただけます。
                既存のCSVを起点に、Shopify API未接続でも始められます。
              </p>
              <ul className="mt-5 space-y-2 text-sm text-navy-100">
                {[
                  "CSVだけで開始OK",
                  "Shopify APIは任意",
                  "AI診断 × 人間レビュー",
                  "月次レポートまで対応",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card !rounded-xl bg-white p-6 text-slate-800 shadow-cardLg">
              <h3 className="text-base font-semibold text-navy-950">
                ご相談・診断のご依頼
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                所要 3分。担当より2営業日以内にご連絡します。
              </p>

              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="会社名" placeholder="株式会社○○" />
                  <Field label="ご担当者名" placeholder="山田 太郎" />
                </div>
                <Field
                  label="メールアドレス"
                  type="email"
                  placeholder="name@example.com"
                />
                <Field label="ストアURL（任意）" placeholder="https://..." />
                <div>
                  <label className="text-xs font-medium text-slate-700">
                    ご希望
                  </label>
                  <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
                    <Choice label="CSV診断を依頼する" defaultChecked />
                    <Choice label="月次改善相談を予約する" />
                  </div>
                </div>
                <div className="pt-1">
                  <button type="submit" className="btn-primary w-full text-sm">
                    送信する
                    <ArrowRight size={16} />
                  </button>
                  <p className="mt-2 text-xs text-slate-400">
                    送信内容は問い合わせ目的のみに使用します。
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-navy-300 sm:px-6">
            <div>© 2026 EC Growth Studio AI</div>
            <div className="flex flex-wrap gap-3">
              <a href="#features" className="hover:text-white">
                機能
              </a>
              <a href="#plans" className="hover:text-white">
                料金プラン
              </a>
              <a href="#faq" className="hover:text-white">
                よくある質問
              </a>
              <Link to="/app" className="hover:text-white">
                サンプル
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-navy-400"
      />
    </label>
  );
}

function Choice({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">
      <input
        type="radio"
        name="purpose"
        defaultChecked={defaultChecked}
        className="accent-navy-900"
      />
      {label}
    </label>
  );
}

/* ----------------------------- Hero Mock ----------------------------- */

function HeroMock() {
  return (
    <div className="relative">
      <div className="card overflow-hidden !rounded-xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </div>
          <span>EC売上改善ダッシュボード</span>
          <span>2026年4月</span>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4">
          {[
            { l: "売上", v: "¥12.4M", d: "+14.3%", up: true },
            { l: "CVR", v: "2.84%", d: "-0.3pt", up: false },
            { l: "リピート率", v: "28.6%", d: "+2.1pt", up: true },
          ].map((k) => (
            <div key={k.l} className="rounded-md border border-slate-100 p-3">
              <div className="text-xs text-slate-500">{k.l}</div>
              <div className="mt-1 text-lg font-bold text-slate-900">{k.v}</div>
              <div
                className={`text-xs font-semibold ${
                  k.up ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {k.d}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-slate-100 px-4 py-3 text-xs">
          <div className="font-semibold text-slate-700">優先アクションTOP5</div>
          {[
            ["商品AのFV改善", "P1", "5/3"],
            ["広告費を商品Bに配分", "P1", "5/4"],
            ["初回購入者CRM追加", "P2", "5/6"],
          ].map(([t, p, d]) => (
            <div
              key={t}
              className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5"
            >
              <span className="text-slate-700">{t}</span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded bg-rose-100 px-1.5 py-0.5 font-semibold text-rose-700">
                  {p}
                </span>
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
