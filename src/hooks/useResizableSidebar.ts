import { useCallback, useEffect, useState } from "react";

// Desktop Sidebar の可変幅。
// min/max は「ナビ文字が読めて、main が極端に狭くならない」範囲で選んだ実用域。
// default は従来の w-64 (256px) より少しゆとりのある 280px。
export const SIDEBAR_WIDTH_DEFAULT = 280;
export const SIDEBAR_WIDTH_MIN = 232;
export const SIDEBAR_WIDTH_MAX = 380;
export const SIDEBAR_WIDTH_STEP = 16;

const STORAGE_KEY = "ec-growth-sidebar-width";

const clampWidth = (value: number): number => {
  if (!Number.isFinite(value)) return SIDEBAR_WIDTH_DEFAULT;
  return Math.max(
    SIDEBAR_WIDTH_MIN,
    Math.min(SIDEBAR_WIDTH_MAX, Math.round(value)),
  );
};

const readStoredWidth = (): number => {
  if (typeof window === "undefined") return SIDEBAR_WIDTH_DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return SIDEBAR_WIDTH_DEFAULT;
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return SIDEBAR_WIDTH_DEFAULT;
    return clampWidth(parsed);
  } catch {
    return SIDEBAR_WIDTH_DEFAULT;
  }
};

const writeStoredWidth = (value: number): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage 不可 (private mode 等) では永続化を諦める。
  }
};

export type UseResizableSidebar = {
  width: number;
  setWidth: (next: number) => void;
  resetWidth: () => void;
};

export function useResizableSidebar(): UseResizableSidebar {
  // 初回レンダーで保存値を読む (lazy initializer)。SPA なので window は存在する。
  const [width, setWidthState] = useState<number>(() => readStoredWidth());

  // タブ間で localStorage が更新された場合に追随する。
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setWidthState(readStoredWidth());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setWidth = useCallback((next: number) => {
    const clamped = clampWidth(next);
    setWidthState(clamped);
    writeStoredWidth(clamped);
  }, []);

  const resetWidth = useCallback(() => {
    setWidthState(SIDEBAR_WIDTH_DEFAULT);
    writeStoredWidth(SIDEBAR_WIDTH_DEFAULT);
  }, []);

  return { width, setWidth, resetWidth };
}
