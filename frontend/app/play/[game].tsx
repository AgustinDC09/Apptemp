// Dynamic game host. Routes /play/<id> to the right game component and
// provides the shared HUD (score, best, restart, back). Each game gets
// `onScoreChange(score)` and `onGameOver(finalScore)` callbacks plus a
// `playKey` it remounts on so RESTART works.

import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import PixelText from "@/src/components/PixelText";
import PixelButton from "@/src/components/PixelButton";
import ArcadeHeader from "@/src/components/ArcadeHeader";
import ScanlineOverlay from "@/src/components/ScanlineOverlay";
import { useApp } from "@/src/context/AppContext";
import { GameId } from "@/src/context/AppContext";
import { getGame } from "@/src/games/catalog";
import { playFx } from "@/src/utils/feedback";

import SnakeGame from "@/src/games/SnakeGame";
import FlappyGame from "@/src/games/FlappyGame";
import PongGame from "@/src/games/PongGame";
import Game2048 from "@/src/games/Game2048";
import MemoryGame from "@/src/games/MemoryGame";
import TicTacToeGame from "@/src/games/TicTacToeGame";

export type GameComponentProps = {
  playKey: number;
  onScoreChange: (score: number) => void;
  onGameOver: (finalScore: number) => void;
};

const REGISTRY: Record<GameId, React.FC<GameComponentProps>> = {
  snake: SnakeGame,
  flappy: FlappyGame,
  pong: PongGame,
  "2048": Game2048,
  memory: MemoryGame,
  tictactoe: TicTacToeGame,
};

export default function Play() {
  const { game } = useLocalSearchParams<{ game: string }>();
  const router = useRouter();
  const { theme, bestScore, recordScore, soundOn } = useApp();

  const meta = getGame(game ?? "");
  const Component = meta ? REGISTRY[meta.id] : null;

  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const onScoreChange = useCallback((s: number) => setScore(s), []);
  const onGameOver = useCallback(
    async (s: number) => {
      setFinalScore(s);
      setOver(true);
      playFx("hit", soundOn);
      const rec = await recordScore(meta!.id, s);
      setIsRecord(rec);
      if (rec) playFx("win", soundOn);
    },
    [meta, recordScore, soundOn],
  );

  const restart = () => {
    setScore(0);
    setOver(false);
    setIsRecord(false);
    setFinalScore(0);
    setPlayKey((k) => k + 1);
  };

  // Reset HUD when game route changes
  useEffect(() => {
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  if (!meta || !Component) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <ArcadeHeader title="UNKNOWN" />
        <View style={styles.center}>
          <PixelText size={12} color={theme.red}>
            GAME NOT FOUND
          </PixelText>
        </View>
      </SafeAreaView>
    );
  }

  const accent = {
    cyan: theme.cyan,
    magenta: theme.magenta,
    yellow: theme.yellow,
    green: theme.green,
    red: theme.red,
  }[meta.accent];

  const best = bestScore(meta.id);

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.bg }}
      testID={`play-screen-${meta.id}`}
    >
      <ArcadeHeader title={meta.name} />

      {/* HUD */}
      <View style={[styles.hud, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
        <View>
          <PixelText size={7} color={theme.textDim}>
            RECORD
          </PixelText>
          <PixelText size={14} color={accent} glow={accent} testID="hud-score">
            {String(score).padStart(5, "0")}
          </PixelText>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <PixelText size={7} color={theme.textDim}>
            MEJOR RECORD
          </PixelText>
          <PixelText size={14} color={theme.yellow} testID="hud-best">
            {String(Math.max(best, finalScore)).padStart(5, "0")}
          </PixelText>
        </View>
      </View>

      {/* Game canvas */}
      <View style={styles.canvas}>
        <Component
          key={playKey}
          playKey={playKey}
          onScoreChange={onScoreChange}
          onGameOver={onGameOver}
        />
      </View>

      {/* Game over overlay */}
      {over && (
        <View
          testID="game-over-overlay"
          style={[styles.over, { backgroundColor: "rgba(0,0,0,0.85)" }]}
        >
          <View
            style={{
              borderWidth: 3,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              padding: 22,
              minWidth: 260,
              alignItems: "center",
            }}
          >
            <PixelText
              size={16}
              color={isRecord ? theme.yellow : theme.red}
              glow={isRecord ? theme.yellow : theme.red}
            >
              {isRecord ? "NUEVO RECORD!" : "PERDISTE"}
            </PixelText>
            <View style={{ height: 14 }} />
            <PixelText size={9} color={theme.textDim}>
              RECORD
            </PixelText>
            <View style={{ height: 6 }} />
            <PixelText size={22} color={accent} glow={accent}>
              {String(finalScore).padStart(5, "0")}
            </PixelText>
            {isRecord && (
              <>
                <View style={{ height: 10 }} />
                <PixelText size={8} color={theme.yellow}>
                  ★ ★ ★  MEJOR RECORD  ★ ★ ★
                </PixelText>
              </>
            )}
            <View style={{ height: 20, alignSelf: "stretch" }} />
            <PixelButton
              testID="restart-button"
              label="▶ VOLVER A JUGAR"
              color={theme.green}
              onPress={restart}
            />
            <View style={{ height: 10 }} />
            <PixelButton
              testID="home-button"
              label="SALA"
              color={theme.cyan}
              size="sm"
              onPress={() => router.replace("/")}
            />
          </View>
        </View>
      )}

      <ScanlineOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 3,
  },
  canvas: { flex: 1, overflow: "hidden" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  over: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
