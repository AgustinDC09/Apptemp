// Flappy Bird. Tap anywhere to flap. Bird falls under gravity. Pipes scroll
// left; score++ when the bird passes a pipe pair. Hitting a pipe / floor /
// ceiling ends the game.

import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";
import PixelText from "@/src/components/PixelText";
import type { GameComponentProps } from "../../app/play/[game]";

type Pipe = { x: number; gapY: number; passed: boolean };

const GRAVITY = 0.55;
const FLAP_V = -8.5;
const PIPE_W = 56;
const GAP = 150;
const PIPE_SPACING = 200; // horizontal distance between pipe pairs
const SCROLL = 2.4;
const BIRD_SIZE = 28;

export default function FlappyGame({ onScoreChange, onGameOver }: GameComponentProps) {
  const { theme, soundOn } = useApp();
  const { width } = useWindowDimensions();
  const fieldW = Math.min(width - 24, 420);
  const fieldH = 480;

  const [tick, setTick] = useState(0);
  const yRef = useRef(fieldH / 2);
  const vRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([
    { x: fieldW + 40, gapY: 200, passed: false },
    { x: fieldW + 40 + PIPE_SPACING, gapY: 260, passed: false },
    { x: fieldW + 40 + PIPE_SPACING * 2, gapY: 180, passed: false },
  ]);
  const scoreRef = useRef(0);
  const overRef = useRef(false);
  const [, force] = useState(0);

  useEffect(() => {
    let raf: any;
    let last = Date.now();
    const loop = () => {
      const now = Date.now();
      const dt = Math.min(2, (now - last) / 16); // normalized ~ 60fps frames
      last = now;
      if (overRef.current) return;

      // physics
      vRef.current += GRAVITY * dt;
      yRef.current += vRef.current * dt;

      // pipes
      pipesRef.current.forEach((p) => {
        p.x -= SCROLL * dt;
      });
      // recycle
      pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_W > -10);
      while (pipesRef.current.length < 3) {
        const last = pipesRef.current[pipesRef.current.length - 1];
        const baseX = last ? last.x + PIPE_SPACING : fieldW + 40;
        pipesRef.current.push({
          x: baseX,
          gapY: 80 + Math.random() * (fieldH - GAP - 160),
          passed: false,
        });
      }

      // score: pipe passed bird
      const birdX = 60;
      pipesRef.current.forEach((p) => {
        if (!p.passed && p.x + PIPE_W < birdX) {
          p.passed = true;
          scoreRef.current += 1;
          onScoreChange(scoreRef.current);
          playFx("pickup", soundOn);
        }
      });

      // collisions
      const by = yRef.current;
      if (by < 0 || by + BIRD_SIZE > fieldH) {
        overRef.current = true;
        onGameOver(scoreRef.current);
        return;
      }
      for (const p of pipesRef.current) {
        const overlapX = birdX + BIRD_SIZE > p.x && birdX < p.x + PIPE_W;
        if (!overlapX) continue;
        const inGap = by > p.gapY && by + BIRD_SIZE < p.gapY + GAP;
        if (!inGap) {
          overRef.current = true;
          onGameOver(scoreRef.current);
          return;
        }
      }

      setTick((t) => (t + 1) % 1_000_000);
      force((x) => x + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flap = () => {
    if (overRef.current) return;
    vRef.current = FLAP_V;
    playFx("jump", soundOn);
  };

  return (
    <View style={styles.wrap}>
      <PixelText size={8} color={theme.textDim}>
        TAP TO FLAP
      </PixelText>
      <View style={{ height: 12 }} />
      <Pressable
        testID="flappy-canvas"
        onPress={flap}
        style={{
          width: fieldW,
          height: fieldH,
          borderWidth: 3,
          borderColor: theme.border,
          backgroundColor: theme.surface,
          overflow: "hidden",
        }}
      >
        {/* stars */}
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: (i * 53) % fieldW,
              top: (i * 97) % fieldH,
              width: 2,
              height: 2,
              backgroundColor: theme.textDim,
            }}
          />
        ))}
        {/* pipes */}
        {pipesRef.current.map((p, i) => (
          <React.Fragment key={i}>
            <View
              style={{
                position: "absolute",
                left: p.x,
                top: 0,
                width: PIPE_W,
                height: p.gapY,
                backgroundColor: theme.green,
                borderRightWidth: 3,
                borderLeftWidth: 3,
                borderBottomWidth: 3,
                borderColor: theme.border,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: p.x,
                top: p.gapY + GAP,
                width: PIPE_W,
                height: fieldH - (p.gapY + GAP),
                backgroundColor: theme.green,
                borderRightWidth: 3,
                borderLeftWidth: 3,
                borderTopWidth: 3,
                borderColor: theme.border,
              }}
            />
          </React.Fragment>
        ))}
        {/* bird */}
        <View
          style={{
            position: "absolute",
            left: 60,
            top: yRef.current,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            backgroundColor: theme.yellow,
            borderWidth: 3,
            borderColor: theme.border,
            transform: [{ rotate: `${Math.max(-25, Math.min(70, vRef.current * 4))}deg` }],
          }}
        >
          <View
            style={{
              position: "absolute",
              right: 4,
              top: 6,
              width: 4,
              height: 4,
              backgroundColor: theme.border,
            }}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 12 },
});
