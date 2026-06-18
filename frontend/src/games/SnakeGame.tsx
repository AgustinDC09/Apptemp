// Snake on a 20x20 grid. Swipe to steer. Eat the apple; +1 each apple.
// Wall or self-collision ends the game. Speed ramps up every 5 apples.

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";
import PixelText from "@/src/components/PixelText";
import type { GameComponentProps } from "../../app/play/[game]";

type Cell = { x: number; y: number };
type Dir = "U" | "D" | "L" | "R";

const COLS = 20;
const ROWS = 20;

function eq(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}
function randCell(occupied: Cell[]): Cell {
  while (true) {
    const c = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!occupied.some((o) => eq(o, c))) return c;
  }
}

export default function SnakeGame({
  onScoreChange,
  onGameOver,
}: GameComponentProps) {
  const { theme, soundOn } = useApp();
  const { width } = useWindowDimensions();
  const board = Math.min(width - 32, 360);
  const cell = Math.floor(board / COLS);
  const size = cell * COLS;

  const [snake, setSnake] = useState<Cell[]>([
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]);
  const [food, setFood] = useState<Cell>({ x: 14, y: 10 });
  const [dir, setDir] = useState<Dir>("R");
  const dirRef = useRef<Dir>("R");
  const queuedDir = useRef<Dir | null>(null);
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const overRef = useRef(false);

  // sync ref
  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  // game loop
  useEffect(() => {
    if (overRef.current) return;
    const speed = Math.max(70, 180 - Math.floor(score / 5) * 12);
    const t = setTimeout(() => setTick((x) => x + 1), speed);
    return () => clearTimeout(t);
  }, [tick, score]);

  // step
  useEffect(() => {
    if (tick === 0) return;
    if (overRef.current) return;

    // apply queued direction (single step)
    if (queuedDir.current) {
      const nd = queuedDir.current;
      const cur = dirRef.current;
      const opposite =
        (nd === "U" && cur === "D") ||
        (nd === "D" && cur === "U") ||
        (nd === "L" && cur === "R") ||
        (nd === "R" && cur === "L");
      if (!opposite) {
        dirRef.current = nd;
        setDir(nd);
      }
      queuedDir.current = null;
    }

    setSnake((prev) => {
      const head = prev[0];
      const d = dirRef.current;
      const next: Cell = {
        x: head.x + (d === "L" ? -1 : d === "R" ? 1 : 0),
        y: head.y + (d === "U" ? -1 : d === "D" ? 1 : 0),
      };
      // walls
      if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
        overRef.current = true;
        onGameOver(score);
        return prev;
      }
      // self collision
      if (prev.some((c) => eq(c, next))) {
        overRef.current = true;
        onGameOver(score);
        return prev;
      }
      const ate = eq(next, food);
      const newSnake = [next, ...prev];
      if (!ate) newSnake.pop();
      if (ate) {
        const ns = score + 1;
        setScore(ns);
        onScoreChange(ns);
        playFx("pickup", soundOn);
        setFood(randCell(newSnake));
      }
      return newSnake;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const setDirSafe = (nd: Dir) => {
    queuedDir.current = nd;
  };

  const pan = Gesture.Pan()
    .minDistance(15)
    .onEnd((e) => {
      const ax = Math.abs(e.translationX);
      const ay = Math.abs(e.translationY);
      if (ax > ay) {
        runOnJS(setDirSafe)(e.translationX > 0 ? "R" : "L");
      } else {
        runOnJS(setDirSafe)(e.translationY > 0 ? "D" : "U");
      }
    });

  return (
    <View style={styles.wrap}>
      <PixelText size={8} color={theme.textDim}>
        DESLIZA PARA MOVER
      </PixelText>
      <View style={{ height: 12 }} />
      <GestureDetector gesture={pan}>
        <View
          testID="snake-board"
          style={{
            width: size,
            height: size,
            borderWidth: 3,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            position: "relative",
          }}
        >
          {/* grid pattern */}
          {snake.map((c, i) => (
            <View
              key={`s-${i}`}
              style={{
                position: "absolute",
                left: c.x * cell,
                top: c.y * cell,
                width: cell,
                height: cell,
                backgroundColor: i === 0 ? theme.green : theme.cyan,
                borderWidth: 1,
                borderColor: theme.bg,
              }}
            />
          ))}
          <View
            style={{
              position: "absolute",
              left: food.x * cell,
              top: food.y * cell,
              width: cell,
              height: cell,
              backgroundColor: theme.red,
              borderWidth: 1,
              borderColor: theme.bg,
            }}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
});
