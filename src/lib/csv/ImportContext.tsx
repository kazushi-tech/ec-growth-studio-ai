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
import { parseGa4Csv, type Ga4ParseResult } from "./parseGa4";
import {
  aggregateGa4,
  type Ga4Aggregation,
} from "./aggregateGa4";
import { parseAdsCsv, type AdsParseResult } from "./parseAds";
import {
  aggregateAds,
  type AdsAggregation,
} from "./aggregateAds";
import {
  clearStoredAdsImport,
  clearStoredGa4Import,
  clearStoredOrdersImport,
  loadAdsImport,
  loadGa4Import,
  loadOrdersImport,
  saveAdsImport,
  saveGa4Import,
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

export type Ga4Import = {
  fileName: string;
  importedAt: Date;
  parseResult: Ga4ParseResult;
  aggregation: Ga4Aggregation;
};

export type FailedGa4Import = {
  fileName: string;
  attemptedAt: Date;
  parseResult: Ga4ParseResult;
};

export type AdsImport = {
  fileName: string;
  importedAt: Date;
  parseResult: AdsParseResult;
  aggregation: AdsAggregation;
};

export type FailedAdsImport = {
  fileName: string;
  attemptedAt: Date;
  parseResult: AdsParseResult;
};

type ImportOutcome =
  | { kind: "success"; import: OrdersImport }
  | { kind: "failure"; failure: FailedImport };

type Ga4ImportOutcome =
  | { kind: "success"; import: Ga4Import }
  | { kind: "failure"; failure: FailedGa4Import };

type AdsImportOutcome =
  | { kind: "success"; import: AdsImport }
  | { kind: "failure"; failure: FailedAdsImport };

type ImportContextValue = {
  ordersImport: OrdersImport | null;
  lastFailure: FailedImport | null;
  isImporting: boolean;
  importOrdersFile: (file: File) => Promise<ImportOutcome>;
  clearOrdersImport: () => void;
  dismissFailure: () => void;

  ga4Import: Ga4Import | null;
  ga4Failure: FailedGa4Import | null;
  isImportingGa4: boolean;
  importGa4File: (file: File) => Promise<Ga4ImportOutcome>;
  clearGa4Import: () => void;
  dismissGa4Failure: () => void;

  adsImport: AdsImport | null;
  adsFailure: FailedAdsImport | null;
  isImportingAds: boolean;
  importAdsFile: (file: File) => Promise<AdsImportOutcome>;
  clearAdsImport: () => void;
  dismissAdsFailure: () => void;
};

const ImportContext = createContext<ImportContextValue | null>(null);

export function ImportProvider({ children }: { children: ReactNode }) {
  const [ordersImport, setOrdersImport] = useState<OrdersImport | null>(() =>
    loadOrdersImport(),
  );
  const [lastFailure, setLastFailure] = useState<FailedImport | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const [ga4Import, setGa4Import] = useState<Ga4Import | null>(() =>
    loadGa4Import(),
  );
  const [ga4Failure, setGa4Failure] = useState<FailedGa4Import | null>(null);
  const [isImportingGa4, setIsImportingGa4] = useState(false);

  const [adsImport, setAdsImport] = useState<AdsImport | null>(() =>
    loadAdsImport(),
  );
  const [adsFailure, setAdsFailure] = useState<FailedAdsImport | null>(null);
  const [isImportingAds, setIsImportingAds] = useState(false);

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

  const importGa4File = useCallback(
    async (file: File): Promise<Ga4ImportOutcome> => {
      setIsImportingGa4(true);
      try {
        const parseResult = await parseGa4Csv(file);
        if (parseResult.errors.length > 0) {
          const failure: FailedGa4Import = {
            fileName: file.name,
            attemptedAt: new Date(),
            parseResult,
          };
          setGa4Failure(failure);
          return { kind: "failure", failure };
        }
        const aggregation = aggregateGa4(parseResult.rows);
        const next: Ga4Import = {
          fileName: file.name,
          importedAt: new Date(),
          parseResult,
          aggregation,
        };
        setGa4Import(next);
        setGa4Failure(null);
        saveGa4Import(next);
        return { kind: "success", import: next };
      } finally {
        setIsImportingGa4(false);
      }
    },
    [],
  );

  const clearGa4Import = useCallback(() => {
    setGa4Import(null);
    setGa4Failure(null);
    clearStoredGa4Import();
  }, []);

  const dismissGa4Failure = useCallback(() => {
    setGa4Failure(null);
  }, []);

  const importAdsFile = useCallback(
    async (file: File): Promise<AdsImportOutcome> => {
      setIsImportingAds(true);
      try {
        const parseResult = await parseAdsCsv(file);
        if (parseResult.errors.length > 0) {
          const failure: FailedAdsImport = {
            fileName: file.name,
            attemptedAt: new Date(),
            parseResult,
          };
          setAdsFailure(failure);
          return { kind: "failure", failure };
        }
        const aggregation = aggregateAds(parseResult.rows);
        const next: AdsImport = {
          fileName: file.name,
          importedAt: new Date(),
          parseResult,
          aggregation,
        };
        setAdsImport(next);
        setAdsFailure(null);
        saveAdsImport(next);
        return { kind: "success", import: next };
      } finally {
        setIsImportingAds(false);
      }
    },
    [],
  );

  const clearAdsImport = useCallback(() => {
    setAdsImport(null);
    setAdsFailure(null);
    clearStoredAdsImport();
  }, []);

  const dismissAdsFailure = useCallback(() => {
    setAdsFailure(null);
  }, []);

  const value = useMemo<ImportContextValue>(
    () => ({
      ordersImport,
      lastFailure,
      isImporting,
      importOrdersFile,
      clearOrdersImport,
      dismissFailure,
      ga4Import,
      ga4Failure,
      isImportingGa4,
      importGa4File,
      clearGa4Import,
      dismissGa4Failure,
      adsImport,
      adsFailure,
      isImportingAds,
      importAdsFile,
      clearAdsImport,
      dismissAdsFailure,
    }),
    [
      ordersImport,
      lastFailure,
      isImporting,
      importOrdersFile,
      clearOrdersImport,
      dismissFailure,
      ga4Import,
      ga4Failure,
      isImportingGa4,
      importGa4File,
      clearGa4Import,
      dismissGa4Failure,
      adsImport,
      adsFailure,
      isImportingAds,
      importAdsFile,
      clearAdsImport,
      dismissAdsFailure,
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
