// Global app state: theme (dark/light), sound on/off, and high-score table
// for every game. All persisted via @/src/utils/storage (AsyncStorage).
// No network, no backend — pure local persistence.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storage } from "@/src/utils/storage";
import { ArcadeTheme, DARK, LIGHT, ThemeName } from "@/src/theme";

export type GameId =
  | "snake"
  | "flappy"
  | "pong"
  | "2048"
  | "memory"
  | "tictactoe";

export type ScoreEntry = {
  score: number;
  date: string; // ISO
};

export type ScoreTable = Record<GameId, ScoreEntry[]>;

const STORAGE_KEYS = {
  theme: "arcade:theme",
  sound: "arcade:sound",
  scores: "arcade:scores",
};

const EMPTY_SCORES: ScoreTable = {
  snake: [],
  flappy: [],
  pong: [],
  "2048": [],
  memory: [],
  tictactoe: [],
};

type Ctx = {
  theme: ArcadeTheme;
  themeName: ThemeName;
  toggleTheme: () => void;
  soundOn: boolean;
  toggleSound: () => void;
  scores: ScoreTable;
  recordScore: (game: GameId, score: number) => Promise<boolean>; // true if new record
  bestScore: (game: GameId) => number;
  resetScores: () => Promise<void>;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("dark");
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [scores, setScores] = useState<ScoreTable>(EMPTY_SCORES);

  // Hydrate from disk once on mount.
  useEffect(() => {
    (async () => {
      const t = await storage.getItem<string>(STORAGE_KEYS.theme, "dark");
      const s = await storage.getItem<boolean>(STORAGE_KEYS.sound, true);
      const sc = await storage.getItem<string>(
        STORAGE_KEYS.scores,
        JSON.stringify(EMPTY_SCORES),
      );
      if (t === "light" || t === "dark") setThemeName(t);
      if (typeof s === "boolean") setSoundOn(s);
      try {
        const parsed = sc ? (JSON.parse(sc) as ScoreTable) : EMPTY_SCORES;
        setScores({ ...EMPTY_SCORES, ...parsed });
      } catch {
        setScores(EMPTY_SCORES);
      }
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName((prev) => {
      const next: ThemeName = prev === "dark" ? "light" : "dark";
      storage.setItem(STORAGE_KEYS.theme, next);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      storage.setItem(STORAGE_KEYS.sound, next);
      return next;
    });
  }, []);

  const recordScore = useCallback(
    async (game: GameId, score: number) => {
      let isRecord = false;
      setScores((prev) => {
        const list = prev[game] ?? [];
        const prevBest = list.reduce((m, e) => Math.max(m, e.score), 0);
        isRecord = score > prevBest && score > 0;
        const next: ScoreTable = {
          ...prev,
          [game]: [
            { score, date: new Date().toISOString() },
            ...list,
          ]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10), // keep top 10 per game
        };
        storage.setItem(STORAGE_KEYS.scores, JSON.stringify(next));
        return next;
      });
      return isRecord;
    },
    [],
  );

  const bestScore = useCallback(
    (game: GameId) => {
      const list = scores[game] ?? [];
      return list.reduce((m, e) => Math.max(m, e.score), 0);
    },
    [scores],
  );

  const resetScores = useCallback(async () => {
    setScores(EMPTY_SCORES);
    await storage.setItem(STORAGE_KEYS.scores, JSON.stringify(EMPTY_SCORES));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      theme: themeName === "dark" ? DARK : LIGHT,
      themeName,
      toggleTheme,
      soundOn,
      toggleSound,
      scores,
      recordScore,
      bestScore,
      resetScores,
    }),
    [themeName, soundOn, scores, toggleTheme, toggleSound, recordScore, bestScore, resetScores],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
