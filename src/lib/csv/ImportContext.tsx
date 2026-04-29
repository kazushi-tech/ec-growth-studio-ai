import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { parseOrdersCsv, type ParseResult } from "./parseOrders";
import {
  aggregateOrders,
  type OrderAggregation,
} from "./aggregateOrders";
import {
  clearStoredOrdersImport,
  loadOrdersImport,
  saveOrdersImport,
} from "./storage";

export type OrdersImport = {
  fileName: string;
  importedAt: Date;
  parseResult: ParseResult;
  aggregation: OrderAggregation;
};

export type FailedImport = {
  fileName: string;
  attemptedAt: Date;
  parseResult: ParseResult;
};

type ImportOutcome =
  | { kind: "success"; import: OrdersImport }
  | { kind: "failure"; failure: FailedImport };

type ImportContextValue = {
  ordersImport: OrdersImport | null;
  lastFailure: FailedImport | null;
  isImporting: boolean;
  importOrdersFile: (file: File) => Promise<ImportOutcome>;
  clearOrdersImport: () => void;
  dismissFailure: () => void;
};

const ImportContext = createContext<ImportContextValue | null>(null);

export function ImportProvider({ children }: { children: ReactNode }) {
  const [ordersImport, setOrdersImport] = useState<OrdersImport | null>(() =>
    loadOrdersImport(),
  );
  const [lastFailure, setLastFailure] = useState<FailedImport | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const importOrdersFile = useCallback(
    async (file: File): Promise<ImportOutcome> => {
      setIsImporting(true);
      try {
        const parseResult = await parseOrdersCsv(file);
        // Treat any parse-level error (missing required column, empty CSV, etc.)
        // as a failed import — do NOT overwrite a previously successful import,
        // do NOT publish zero-aggregation values to the dashboard, and do NOT
        // persist the failure to localStorage.
        if (parseResult.errors.length > 0) {
          const failure: FailedImport = {
            fileName: file.name,
            attemptedAt: new Date(),
            parseResult,
          };
          setLastFailure(failure);
          return { kind: "failure", failure };
        }

        const aggregation = aggregateOrders(parseResult.rows);
        const next: OrdersImport = {
          fileName: file.name,
          importedAt: new Date(),
          parseResult,
          aggregation,
        };
        setOrdersImport(next);
        setLastFailure(null);
        saveOrdersImport(next);
        return { kind: "success", import: next };
      } finally {
        setIsImporting(false);
      }
    },
    [],
  );

  const clearOrdersImport = useCallback(() => {
    setOrdersImport(null);
    setLastFailure(null);
    clearStoredOrdersImport();
  }, []);

  const dismissFailure = useCallback(() => {
    setLastFailure(null);
  }, []);

  const value = useMemo<ImportContextValue>(
    () => ({
      ordersImport,
      lastFailure,
      isImporting,
      importOrdersFile,
      clearOrdersImport,
      dismissFailure,
    }),
    [
      ordersImport,
      lastFailure,
      isImporting,
      importOrdersFile,
      clearOrdersImport,
      dismissFailure,
    ],
  );

  return (
    <ImportContext.Provider value={value}>{children}</ImportContext.Provider>
  );
}

export function useImport(): ImportContextValue {
  const ctx = useContext(ImportContext);
  if (!ctx) throw new Error("useImport must be used within ImportProvider");
  return ctx;
}
