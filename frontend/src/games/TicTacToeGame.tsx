// Tic-Tac-Toe vs CPU. Player is X, CPU is O. CPU uses minimax for perfect
// play. Score increments per WIN (draws don't count). Game ends on win/loss/draw;
// "score" delivered to HUD is total wins this session.

import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";
import PixelText from "@/src/components/PixelText";
import PixelButton from "@/src/components/PixelButton";
import type { GameComponentProps } from "../../app/play/[game]";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(b: Cell[]): "X" | "O" | "draw" | null {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]!;
  }
  if (b.every((v) => v !== null)) return "draw";
  return null;
}

// minimax — X maximizes, O minimizes; called as CPU = "O"
function minimax(b: Cell[], turn: "X" | "O"): number {
  const w = winner(b);
  if (w === "X") return 10;
  if (w === "O") return -10;
  if (w === "draw") return 0;
  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (b[i] === null) {
      const nb = [...b];
      nb[i] = turn;
      scores.push(minimax(nb, turn === "X" ? "O" : "X"));
    }
  }
  return turn === "X" ? Math.max(...scores) : Math.min(...scores);
}

function bestCpuMove(b: Cell[]): number {
  let best = Infinity;
  let pick = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i] === null) {
      const nb = [...b];
      nb[i] = "O";
      const val = minimax(nb, "X");
      if (val < best) {
        best = val;
        pick = i;
      }
    }
  }
  return pick;
}

export default function TicTacToeGame({ onScoreChange, onGameOver }: GameComponentProps) {
  const { theme, soundOn } = useApp();
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 48, 320);
  const cellSize = (boardSize - 8) / 3;

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [wins, setWins] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost" | "draw">("playing");
  const winsRef = useRef(0);

  // CPU plays after player's move
  useEffect(() => {
    if (status !== "playing") return;
    if (turn !== "O") return;
    const t = setTimeout(() => {
      const move = bestCpuMove(board);
      if (move < 0) return;
      const nb = [...board];
      nb[move] = "O";
      setBoard(nb);
      playFx("tick", soundOn);
      setTurn("X");
    }, 350);
    return () => clearTimeout(t);
  }, [turn, board, status, soundOn]);

  // detect end-of-round
  useEffect(() => {
    const w = winner(board);
    if (!w) return;
    if (w === "X") {
      winsRef.current += 1;
      setWins(winsRef.current);
      onScoreChange(winsRef.current);
      setStatus("won");
      playFx("win", soundOn);
    } else if (w === "O") {
      setStatus("lost");
      playFx("hit", soundOn);
    } else {
      setStatus("draw");
      playFx("tick", soundOn);
    }
  }, [board, onScoreChange, soundOn]);

  const tap = (i: number) => {
    if (status !== "playing" || board[i] || turn !== "X") return;
    const nb = [...board];
    nb[i] = "X";
    setBoard(nb);
    playFx("jump", soundOn);
    setTurn("O");
  };

  const playAgain = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setStatus("playing");
  };

  const endSession = () => {
    onGameOver(winsRef.current);
  };

  const result =
    status === "won"
      ? { label: "YOU WIN!", color: theme.green }
      : status === "lost"
        ? { label: "CPU WINS", color: theme.red }
        : status === "draw"
          ? { label: "DRAW", color: theme.yellow }
          : null;

  return (
    <View style={styles.wrap}>
      <PixelText size={8} color={theme.textDim}>
        YOU ARE X · WINS: {wins}
      </PixelText>
      <View style={{ height: 12 }} />
      <View
        testID="ttt-board"
        style={{
          width: boardSize,
          height: boardSize,
          borderWidth: 3,
          borderColor: theme.border,
          backgroundColor: theme.surface,
          padding: 4,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {board.map((v, i) => (
          <Pressable
            key={i}
            testID={`ttt-cell-${i}`}
            onPress={() => tap(i)}
            style={{
              width: cellSize,
              height: cellSize,
              borderWidth: 2,
              borderColor: theme.border,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.surfaceAlt,
            }}
          >
            {v && (
              <PixelText
                size={Math.floor(cellSize * 0.5)}
                color={v === "X" ? theme.cyan : theme.magenta}
                glow={v === "X" ? theme.cyan : theme.magenta}
              >
                {v}
              </PixelText>
            )}
          </Pressable>
        ))}
      </View>

      <View style={{ height: 20 }} />

      {result ? (
        <View style={{ alignItems: "center", gap: 12, alignSelf: "stretch" }}>
          <PixelText size={14} color={result.color} glow={result.color}>
            {result.label}
          </PixelText>
          <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20 }}>
            <PixelButton
              testID="ttt-next-round"
              label="NEXT ROUND"
              color={theme.green}
              onPress={playAgain}
              style={{ flex: 1 }}
            />
            <PixelButton
              testID="ttt-end-session"
              label="END"
              color={theme.red}
              textColor="#fff"
              onPress={endSession}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      ) : (
        <PixelText size={9} color={theme.textDim}>
          {turn === "X" ? "YOUR MOVE" : "CPU THINKING..."}
        </PixelText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
});
