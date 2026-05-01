import { useState } from "react";
import type { GuideImageRefV3 } from "../../data/sample";

type Props = {
  image: GuideImageRefV3;
};

/**
 * ガイド用の画像枠。
 * - 画像が public/guide/ 配下に存在しない場合は、淡い図解プレースホルダーを表示する。
 * - 画像内テキストには頼らず、隣接する HTML 本文に同じ意味の説明を置く前提。
 * - alt は意味のある日本語ラベルを必ず付ける。
 */
export default function GuideImage({ image }: Props) {
  const [errored, setErrored] = useState(false);

  return (
    <figure className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-4">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-white to-slate-100">
        <div className="aspect-[16/9] w-full">
          {!errored ? (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              onError={() => setErrored(true)}
              className="h-full w-full object-contain"
            />
          ) : (
            <GuideImagePlaceholder image={image} />
          )}
        </div>
      </div>
      <figcaption className="mt-2 px-1 text-xs leading-6 text-slate-500">
        {image.caption}
      </figcaption>
    </figure>
  );
}

function GuideImagePlaceholder({ image }: { image: GuideImageRefV3 }) {
  const nodes = getPlaceholderNodes(image);

  return (
    <div
      role="img"
      aria-label={image.alt}
      className="flex h-full w-full flex-col justify-center gap-5 px-5 py-6 sm:px-8"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold text-slate-700">
          {image.placeholderTitle}
        </p>
        <p className="mt-1 text-xs leading-6 text-slate-500">
          図解画像が未配置でも、本文・表・補足で同じ内容を読めるようにしておる。
        </p>
      </div>

      <ol className="mx-auto grid w-full max-w-2xl gap-2 sm:grid-cols-4">
        {nodes.map((node, index) => (
          <li key={node.label} className="relative">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 top-1/2 hidden h-px w-2 bg-slate-300 sm:block"
              />
            ) : null}
            <div
              className={`rounded-xl border px-3 py-3 text-center ring-1 ${node.className}`}
            >
              <div className="text-sm font-semibold">{node.label}</div>
              <div className="mt-1 text-xs leading-5 opacity-80">{node.sub}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function getPlaceholderNodes(image: GuideImageRefV3) {
  if (image.src.includes("data-scope")) {
    return [
      { label: "実値", sub: "CSV取込", className: "border-emerald-200 bg-emerald-50 text-emerald-800 ring-emerald-100" },
      { label: "デモ", sub: "Preview限定", className: "border-sky-200 bg-sky-50 text-sky-800 ring-sky-100" },
      { label: "未接続", sub: "実APIなし", className: "border-amber-200 bg-amber-50 text-amber-800 ring-amber-100" },
      { label: "将来予定", sub: "Phase 3/4", className: "border-violet-200 bg-violet-50 text-violet-800 ring-violet-100" },
    ];
  }

  if (image.src.includes("screen-map")) {
    return [
      { label: "状態を見る", sub: "Dashboard", className: "border-navy-200 bg-navy-50 text-navy-900 ring-navy-100" },
      { label: "原因を見る", sub: "要因分析", className: "border-sky-200 bg-sky-50 text-sky-800 ring-sky-100" },
      { label: "実行する", sub: "施策ボード", className: "border-emerald-200 bg-emerald-50 text-emerald-800 ring-emerald-100" },
      { label: "次月へ", sub: "月次報告", className: "border-rose-200 bg-rose-50 text-rose-800 ring-rose-100" },
    ];
  }

  return [
    { label: "AI診断", sub: "候補を出す", className: "border-violet-200 bg-violet-50 text-violet-800 ring-violet-100" },
    { label: "人間レビュー", sub: "採用を決める", className: "border-emerald-200 bg-emerald-50 text-emerald-800 ring-emerald-100" },
    { label: "施策実行", sub: "担当を持つ", className: "border-sky-200 bg-sky-50 text-sky-800 ring-sky-100" },
    { label: "月次報告", sub: "翌月へ", className: "border-navy-200 bg-navy-50 text-navy-900 ring-navy-100" },
  ];
}
