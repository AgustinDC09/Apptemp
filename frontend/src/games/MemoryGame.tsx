// Memory Match. 4x4 grid (8 pairs). Tap two cards, if they match they stay
// face up. Game ends when all pairs are found; score = max(1000 - moves*15, 100)
// — fewer flips = bigger score. Each card is a colored arcade glyph.

import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";
import PixelText from "@/src/components/PixelText";
import type { GameComponentProps } from "../../app/play/[game]";

type Card = {
  id: number;
  symbol: number; // 0..7
  flipped: boolean;
  matched: boolean;
};

const SYMBOLS: { icon: any; color: keyof ReturnType<typeof useApp>["theme"] }[] = [
  { icon: "heart", color: "red" },
  { icon: "star", color: "yellow" },
  { icon: "flash", color: "cyan" },
  { icon: "skull", color: "magenta" },
  { icon: "rocket", color: "green" },
  { icon: "diamond", color: "cyan" },
  { icon: "musical-notes", color: "yellow" },
  { icon: "game-controller", color: "red" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(): Card[] {
  const pairs: Card[] = [];
  for (let s = 0; s < 8; s++) {
    pairs.push({ id: s * 2, symbol: s, flipped: false, matched: false });
    pairs.push({ id: s * 2 + 1, symbol: s, flipped: false, matched: false });
  }
  return shuffle(pairs);
}

export default function MemoryGame({ onScoreChange, onGameOver }: GameComponentProps) {
  const { theme, soundOn } = useApp();
  const { width } = useWindowDimensions();
  const cardSize = Math.min((width - 32 - 24) / 4, 72);

  const [cards, setCards] = useState<Card[]>(makeDeck);
  const [picks, setPicks] = useState<number[]>([]); // indices currently flipped (max 2)
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const scoreFor = useCallback(
    (mv: number) => Math.max(100, 1000 - mv * 15),
    [],
  );

  // when all matched -> game over
  useEffect(() => {
    if (cards.every((c) => c.matched) && !done) {
      setDone(true);
      const final = scoreFor(moves);
      onScoreChange(final);
      playFx("win", soundOn);
      setTimeout(() => onGameOver(final), 400);
    }
  }, [cards, moves, done, onGameOver, scoreFor, onScoreChange, soundOn]);

  const flip = (idx: number) => {
    if (busy || done) return;
    if (cards[idx].flipped || cards[idx].matched) return;
    const next = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    const newPicks = [...picks, idx];
    setCards(next);
    setPicks(newPicks);
    playFx("tick", soundOn);

    if (newPicks.length === 2) {
      setBusy(true);
      setMoves((m) => {
        const nm = m + 1;
        onScoreChange(scoreFor(nm));
        return nm;
      });
      const [a, b] = newPicks;
      const isMatch = next[a].symbol === next[b].symbol;
      setTimeout(() => {
        if (isMatch) {
          setCards((cs) =>
            cs.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c,
            ),
          );
          playFx("pickup", soundOn);
        } else {
          setCards((cs) =>
            cs.map((c, i) =>
              i === a || i === b ? { ...c, flipped: false } : c,
            ),
          );
        }
        setPicks([]);
        setBusy(false);
      }, 650);
    }
  };

  const accentMap = {
    cyan: theme.cyan,
    magenta: theme.magenta,
    yellow: theme.yellow,
    green: theme.green,
    red: theme.red,
  } as const;

  return (
    <View style={styles.wrap}>
      <PixelText size={8} color={theme.textDim}>
        MATCH ALL PAIRS · MOVES: {moves}
      </PixelText>
      <View style={{ height: 16 }} />
      <View
        testID="memory-board"
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          width: cardSize * 4 + 24,
          justifyContent: "center",
        }}
      >
        {cards.map((c, i) => {
          const sym = SYMBOLS[c.symbol];
          const accent = accentMap[sym.color as keyof typeof accentMap];
          const showFace = c.flipped || c.matched;
          return (
            <Pressable
              key={c.id}
              testID={`memory-card-${i}`}
              onPress={() => flip(i)}
              style={{
                width: cardSize,
                height: cardSize,
                borderWidth: 3,
                borderColor: theme.border,
                backgroundColor: showFace ? accent : theme.surface,
                alignItems: "center",
                justifyContent: "center",
                opacity: c.matched ? 0.6 : 1,
              }}
            >
              {showFace ? (
                <Ionicons name={sym.icon} size={Math.floor(cardSize * 0.5)} color="#000" />
              ) : (
                <PixelText size={12} color={theme.textDim}>
                  ?
                </PixelText>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
});
