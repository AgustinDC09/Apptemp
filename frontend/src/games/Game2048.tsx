// 2048. 4x4 grid. Swipe to slide all tiles in that direction; equal
// adjacent tiles merge once per move. New random "2" (or rare "4") spawns
// after each successful move. Game ends when no moves remain. Score is
// the running sum of merged values.

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";
import PixelText from "@/src/components/PixelText";
import type { GameComponentProps } from "../../app/play/[game]";

type Board = number[][];

const SIZE = 4;

function empty(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}
function clone(b: Board): Board {
  return b.map((r) => [...r]);
}
function spawn(b: Board): Board {
  const empties: { r: number; c: number }[] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (b[r][c] === 0) empties.push({ r, c });
  if (!empties.length) return b;
  const pick = empties[Math.floor(Math.random() * empties.length)];
  const val = Math.random() < 0.9 ? 2 : 4;
  const nb = clone(b);
  nb[pick.r][pick.c] = val;
  return nb;
}
function rotateCW(b: Board): Board {
  const nb = empty();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) nb[c][SIZE - 1 - r] = b[r][c];
  return nb;
}
function rotateCCW(b: Board): Board {
  return rotateCW(rotateCW(rotateCW(b)));
}
// slide left + merge; returns new row and score gained
function slideRow(row: number[]): { row: number[]; gained: number; moved: boolean } {
  const compact = row.filter((v) => v !== 0);
  let gained = 0;
  for (let i = 0; i < compact.length - 1; i++) {
    if (compact[i] === compact[i + 1]) {
      compact[i] *= 2;
      gained += compact[i];
      compact.splice(i + 1, 1);
    }
  }
  while (compact.length < SIZE) compact.push(0);
  const moved = compact.some((v, i) => v !== row[i]);
  return { row: compact, gained, moved };
}
function transpose(b: Board): Board {
  const nb = empty();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      nb[c][r] = b[r][c];
    }
  }
  return nb;
}

function move(b: Board, dir: "L" | "R" | "U" | "D") {
  let work = clone(b);
  let gained = 0;
  let moved = false;

  if (dir === "U") {
    work = transpose(work); // convertir columnas en filas
    for (let r = 0; r < SIZE; r++) {
      const out = slideRow(work[r]);
      work[r] = out.row;
      gained += out.gained;
      if (out.moved) moved = true;
    }
    work = transpose(work); // volver a la forma original
  } else if (dir === "D") {
    work = transpose(work);
    // invertir cada fila para simular "slide right"
    work = work.map(row => row.reverse());
    for (let r = 0; r < SIZE; r++) {
      const out = slideRow(work[r]);
      work[r] = out.row;
      gained += out.gained;
      if (out.moved) moved = true;
    }
    // volver a invertir y transponer
    work = work.map(row => row.reverse());
    work = transpose(work);
  } else if (dir === "L" || dir === "R") {
    if (dir === "R") {
      work = work.map(row => row.reverse());
    }
    for (let r = 0; r < SIZE; r++) {
      const out = slideRow(work[r]);
      work[r] = out.row;
      gained += out.gained;
      if (out.moved) moved = true;
    }
    if (dir === "R") {
      work = work.map(row => row.reverse());
    }
  }

  return { board: work, gained, moved };
}

function canMove(b: Board): boolean {
  for (const d of ["L", "R", "U", "D"] as const) {
    if (move(b, d).moved) return true;
  }
  return false;
}

const TILE_COLORS: Record<number, [string, string]> = {
  // [bg, fg]
  2: ["#FFFFFF", "#000000"],
  4: ["#FFEE99", "#000000"],
  8: ["#FFCC44", "#000000"],
  16: ["#FF9933", "#000000"],
  32: ["#FF5533", "#FFFFFF"],
  64: ["#FF003C", "#FFFFFF"],
  128: ["#39FF14", "#000000"],
  256: ["#00FFFF", "#000000"],
  512: ["#FF00FF", "#FFFFFF"],
  1024: ["#FFFF00", "#000000"],
  2048: ["#FF00FF", "#000000"],
};

export default function Game2048({ onScoreChange, onGameOver }: GameComponentProps) {
  const { theme, soundOn } = useApp();
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 32, 340);
  const cell = (boardSize - 12) / SIZE;

  const [board, setBoard] = useState<Board>(() => spawn(spawn(empty())));
  const overRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (!canMove(board) && !overRef.current) {
      overRef.current = true;
      onGameOver(scoreRef.current);
    }
  }, [board, onGameOver]);

  const doMove = (dir: "L" | "R" | "U" | "D") => {
    if (overRef.current) return;
    setBoard((prev) => {
      const out = move(prev, dir);
      if (!out.moved) return prev;
      scoreRef.current += out.gained;
      onScoreChange(scoreRef.current);
      if (out.gained > 0) playFx("pickup", soundOn);
      else playFx("tick", soundOn);
      return spawn(out.board);
    });
  };

  const pan = Gesture.Pan()
    .minDistance(20)
    .onEnd((e) => {
      const ax = Math.abs(e.translationX);
      const ay = Math.abs(e.translationY);
      if (ax > ay) runOnJS(doMove)(e.translationX > 0 ? "R" : "L");
      else runOnJS(doMove)(e.translationY > 0 ? "D" : "U");
    });

  return (
    <View style={styles.wrap}>
      <PixelText size={8} color={theme.textDim}>
        DESLIZA PARA COMBINAR
      </PixelText>
      <View style={{ height: 12 }} />
      <GestureDetector gesture={pan}>
        <View
          testID="2048-board"
          style={{
            width: boardSize,
            height: boardSize,
            borderWidth: 3,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            padding: 6,
          }}
        >
          {board.map((row, r) =>
            row.map((v, c) => {
              const colors = TILE_COLORS[v] ?? [theme.surfaceAlt, theme.textDim];
              return (
                <View
                  key={`${r}-${c}`}
                  style={{
                    position: "absolute",
                    left: 6 + c * cell,
                    top: 6 + r * cell,
                    width: cell - 4,
                    height: cell - 4,
                    backgroundColor: v === 0 ? theme.surfaceAlt : colors[0],
                    borderWidth: 2,
                    borderColor: theme.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {v !== 0 && (
                    <PixelText
                      size={v < 100 ? 14 : v < 1000 ? 12 : 10}
                      color={colors[1]}
                    >
                      {String(v)}
                    </PixelText>
                  )}
                </View>
              );
            }),
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
});
