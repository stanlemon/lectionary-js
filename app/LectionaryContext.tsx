import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import lectionary1yr from "../data/lsb-1yr.json";
import lsb3yrA from "../data/lsb-3yr-a.json";
import lsb3yrB from "../data/lsb-3yr-b.json";
import lsb3yrC from "../data/lsb-3yr-c.json";
import commemorations from "../data/lsb-commemorations.json";
import daily from "../data/lsb-daily.json";
import festivals from "../data/lsb-festivals.json";
import { ThreeYearKeyLoader } from "../lib/3year/KeyLoader.js";
import { KeyLoader } from "../lib/KeyLoader";
import type { ProperDatasetMap } from "../lib/Loader.js";

export const LECTIONARY_1YR = "1yr";
export const LECTIONARY_3YR = "3yr";

export type LectionaryType = typeof LECTIONARY_1YR | typeof LECTIONARY_3YR;

export type AppLoader = {
  load(date: Date, weekOfLectionary: number | null): ProperDatasetMap;
};

type LectionaryContextValue = {
  lectionaryType: LectionaryType;
  toggleLectionary: () => void;
  loader: AppLoader;
};

function createLoader(type: LectionaryType): AppLoader {
  if (type === LECTIONARY_3YR) {
    return new ThreeYearKeyLoader({
      series: { A: lsb3yrA, B: lsb3yrB, C: lsb3yrC },
      festivals,
      daily,
      commemorations,
    });
  }
  return new KeyLoader({
    lectionary: lectionary1yr,
    festivals,
    daily,
    commemorations,
  });
}

const STORAGE_KEY = "lectionary-type";

const LectionaryContext = createContext<LectionaryContextValue | null>(null);

export function LectionaryProvider({ children }: { children: ReactNode }) {
  const [lectionaryType, setLectionaryType] = useState<LectionaryType>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === LECTIONARY_3YR ? LECTIONARY_3YR : LECTIONARY_1YR;
  });

  const loader = useMemo(() => createLoader(lectionaryType), [lectionaryType]);

  function toggleLectionary() {
    setLectionaryType((t: LectionaryType) => {
      const next = t === LECTIONARY_1YR ? LECTIONARY_3YR : LECTIONARY_1YR;
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <LectionaryContext.Provider
      value={{ lectionaryType, toggleLectionary, loader }}
    >
      {children}
    </LectionaryContext.Provider>
  );
}

export function useLectionary() {
  const ctx = useContext(LectionaryContext);
  if (!ctx) {
    throw new Error("useLectionary must be used within a LectionaryProvider");
  }
  return ctx;
}
