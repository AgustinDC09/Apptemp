// Pong vs CPU. Drag your finger anywhere on the field to move the
// bottom paddle horizontally. The ball bounces off walls + paddles. Miss
// the ball and game ends. CPU tracks the ball with a smoothing factor.

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";
import PixelText from "@/src/components/PixelText";
import type { GameComponentProps } from "../../app/play/[game]";

const PAD_W = 80;
const PAD_H = 14;
const BALL = 12;

export default function PongGame({ onScoreChange, onGameOver }: GameComponentProps) {
  const { theme, soundOn } = useApp();
  const { width } = useWindowDimensions();
  const fieldW = Math.min(width - 24, 360);
  const fieldH = 520;

  const playerX = useRef((fieldW - PAD_W) / 2);
  const cpuX = useRef((fieldW - PAD_W) / 2);
  const ballX = useRef(fieldW / 2 - BALL / 2);
  const ballY = useRef(fieldH / 2 - BALL / 2);
  const vx = useRef(3 * (Math.random() > 0.5 ? 1 : -1));
  const vy = useRef(3);
  const overRef = useRef(false);
  const scoreRef = useRef(0);
  const [, force] = useState(0);

  useEffect(() => {
    let raf: any;
    const loop = () => {
      if (overRef.current) return;
      ballX.current += vx.current;
      ballY.current += vy.current;

      // walls
      if (ballX.current <= 0) {
        ballX.current = 0;
        vx.current *= -1;
        playFx("tick", soundOn);
      }
      if (ballX.current + BALL >= fieldW) {
        ballX.current = fieldW - BALL;
        vx.current *= -1;
        playFx("tick", soundOn);
      }

      // CPU tracking
      const cpuTarget = ballX.current + BALL / 2 - PAD_W / 2;
      cpuX.current += (cpuTarget - cpuX.current) * 0.07;
      cpuX.current = Math.max(0, Math.min(fieldW - PAD_W, cpuX.current));

      // paddle collisions
      // CPU paddle at top (y between 16 and 16+PAD_H)
      if (
        ballY.current <= 16 + PAD_H &&
        ballY.current >= 16 &&
        ballX.current + BALL >= cpuX.current &&
        ballX.current <= cpuX.current + PAD_W
      ) {
        ballY.current = 16 + PAD_H;
        vy.current = Math.abs(vy.current);
        // english based on hit position
        const rel = (ballX.current + BALL / 2 - (cpuX.current + PAD_W / 2)) / (PAD_W / 2);
        vx.current = 3.4 * rel + vx.current * 0.4;
        playFx("jump", soundOn);
      }
      // player paddle at bottom
      const pY = fieldH - 16 - PAD_H;
      if (
        ballY.current + BALL >= pY &&
        ballY.current + BALL <= pY + PAD_H &&
        ballX.current + BALL >= playerX.current &&
        ballX.current <= playerX.current + PAD_W
      ) {
        ballY.current = pY - BALL;
        vy.current = -Math.abs(vy.current);
        const rel = (ballX.current + BALL / 2 - (playerX.current + PAD_W / 2)) / (PAD_W / 2);
        vx.current = 3.4 * rel + vx.current * 0.4;
        scoreRef.current += 1;
        onScoreChange(scoreRef.current);
        // speed up a touch every 3 hits
        if (scoreRef.current % 3 === 0) {
          vy.current *= 1.06;
          vx.current *= 1.04;
        }
        playFx("pickup", soundOn);
      }

      // miss
      if (ballY.current > fieldH) {
        overRef.current = true;
        onGameOver(scoreRef.current);
        return;
      }
      if (ballY.current + BALL < 0) {
        // CPU missed — also give player point and bounce
        ballY.current = 0;
        vy.current = Math.abs(vy.current);
        scoreRef.current += 1;
        onScoreChange(scoreRef.current);
        playFx("win", soundOn);
      }

      force((x) => x + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPlayerX = (xRaw: number) => {
    const clamped = Math.max(0, Math.min(fieldW - PAD_W, xRaw));
    playerX.current = clamped;
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .onStart((e) => {
      runOnJS(setPlayerX)(e.x - PAD_W / 2);
    })
    .onUpdate((e) => {
      runOnJS(setPlayerX)(e.x - PAD_W / 2);
    });

  return (
    <View style={styles.wrap}>
      <PixelText size={8} color={theme.textDim}>
        ARRASTRA PARA MOVER LA BARRA
      </PixelText>
      <View style={{ height: 12 }} />
      <GestureDetector gesture={pan}>
        <View
          testID="pong-field"
          style={{
            width: fieldW,
            height: fieldH,
            borderWidth: 3,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            position: "relative",
          }}
        >
          {/* mid line */}
          {[...Array(14)].map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                left: fieldW / 2 - 2,
                top: i * (fieldH / 14) + 4,
                width: 4,
                height: 14,
                backgroundColor: theme.textDim,
              }}
            />
          ))}
          {/* cpu paddle */}
          <View
            style={{
              position: "absolute",
              left: cpuX.current,
              top: 16,
              width: PAD_W,
              height: PAD_H,
              backgroundColor: theme.red,
              borderWidth: 2,
              borderColor: theme.border,
            }}
          />
          {/* player paddle */}
          <View
            style={{
              position: "absolute",
              left: playerX.current,
              bottom: 16,
              width: PAD_W,
              height: PAD_H,
              backgroundColor: theme.cyan,
              borderWidth: 2,
              borderColor: theme.border,
            }}
          />
          {/* ball */}
          <View
            style={{
              position: "absolute",
              left: ballX.current,
              top: ballY.current,
              width: BALL,
              height: BALL,
              backgroundColor: theme.yellow,
              borderWidth: 2,
              borderColor: theme.border,
            }}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 12 },
});
