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

export type OrdersImport = {
  fileName: string;
  importedAt: Date;
  parseResult: ParseResult;
  aggregation: OrderAggregation;
};

type ImportContextValue = {
  ordersImport: OrdersImport | null;
  isImporting: boolean;
  importOrdersFile: (file: File) => Promise<OrdersImport>;
  clearOrdersImport: () => void;
};

const ImportContext = createContext<ImportContextValue | null>(null);

export function ImportProvider({ children }: { children: ReactNode }) {
  const [ordersImport, setOrdersImport] = useState<OrdersImport | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const importOrdersFile = useCallback(async (file: File) => {
    setIsImporting(true);
    try {
      const parseResult = await parseOrdersCsv(file);
      const aggregation = aggregateOrders(parseResult.rows);
      const next: OrdersImport = {
        fileName: file.name,
        importedAt: new Date(),
        parseResult,
        aggregation,
      };
      setOrdersImport(next);
      return next;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const clearOrdersImport = useCallback(() => {
    setOrdersImport(null);
  }, []);

  const value = useMemo<ImportContextValue>(
    () => ({ ordersImport, isImporting, importOrdersFile, clearOrdersImport }),
    [ordersImport, isImporting, importOrdersFile, clearOrdersImport],
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
