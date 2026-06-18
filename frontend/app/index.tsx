// Home / arcade lobby. Bento-style grid lists every game with its best
// score. Big PLAY, SCORES, SETTINGS chrome at the bottom.

import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import PixelText from "@/src/components/PixelText";
import PixelButton from "@/src/components/PixelButton";
import ScanlineOverlay from "@/src/components/ScanlineOverlay";
import { useApp } from "@/src/context/AppContext";
import { GAMES, GameMeta } from "@/src/games/catalog";

export default function Home() {
  const { theme, bestScore } = useApp();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const colW = Math.min(width, 520);
  const tileW = (colW - 24 * 2 - 12) / 2;

  const accent = (g: GameMeta) =>
    ({
      cyan: theme.cyan,
      magenta: theme.magenta,
      yellow: theme.yellow,
      green: theme.green,
      red: theme.red,
    })[g.accent];

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.bg }}
      testID="home-screen"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Title bar */}
        <View style={[styles.titleBar, { borderBottomColor: theme.border }]}>
          <PixelText size={10} color={theme.textDim}>
            INSERTAR MONEDA ▸
          </PixelText>
          <View style={{ height: 8 }} />
          <PixelText size={22} color={theme.yellow} glow={theme.magenta}>
            MINI ARCADE
          </PixelText>
          <View style={{ height: 6 }} />
          <PixelText size={10} color={theme.cyan}>
            JUEGOS RETRO SIN INTERNET
          </PixelText>
        </View>


        {/* Marquee strip */}
        <View
          style={[styles.marquee, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={[styles.dot, { backgroundColor: theme.red }]} />
          <View style={[styles.dot, { backgroundColor: theme.yellow }]} />
          <View style={[styles.dot, { backgroundColor: theme.green }]} />
          <View style={[styles.dot, { backgroundColor: theme.cyan }]} />
          <View style={[styles.dot, { backgroundColor: theme.magenta }]} />
          <View style={{ flex: 1 }} />
          <PixelText size={8} color={theme.textDim}>
            {GAMES.length} GAMES
          </PixelText>
        </View>

        {/* Game tiles */}
        <View style={[styles.grid, { paddingHorizontal: 24 }]}>
          {GAMES.map((g) => (
            <Pressable
              key={g.id}
              testID={`game-card-${g.id}`}
              onPress={() => router.push(`/play/${g.id}`)}
              style={{ width: tileW, marginBottom: 12 }}
            >
              <View
                style={{
                  position: "absolute",
                  left: 5,
                  top: 5,
                  right: -0,
                  bottom: -0,
                  backgroundColor: theme.shadow,
                  borderWidth: 3,
                  borderColor: theme.border,
                }}
              />
              <View
                style={{
                  borderWidth: 3,
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                  padding: 14,
                  minHeight: 150,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderWidth: 3,
                    borderColor: theme.border,
                    backgroundColor: accent(g),
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name={g.icon as any} size={22} color="#000" />
                </View>
                <PixelText size={11} color={theme.text}>
                  {g.name}
                </PixelText>
                <View style={{ height: 6 }} />
                <PixelText size={8} color={theme.textDim}>
                  {g.control.toUpperCase()}
                </PixelText>
                <View style={{ flex: 1 }} />
                <View style={styles.tileFoot}>
                  <PixelText size={8} color={theme.textDim}>
                    HI
                  </PixelText>
                  <PixelText size={10} color={accent(g)} glow={accent(g)}>
                    {String(bestScore(g.id)).padStart(4, "0")}
                  </PixelText>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Bottom CTAs */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8, gap: 12 }}>
          <PixelButton
            testID="play-button"
            label="▶  EMPEZAR"
            color={theme.green}
            size="lg"
            onPress={() => router.push(`/play/${GAMES[0].id}`)}
          />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <PixelButton
              testID="scores-button"
              label="RECORDS"
              color={theme.cyan}
              onPress={() => router.push("/scores")}
              style={{ flex: 1 }}
            />
            <PixelButton
              testID="settings-button"
              label="AJUSTES"
              color={theme.magenta}
              textColor="#fff"
              onPress={() => router.push("/settings")}
              style={{ flex: 1 }}
            />
          </View>
          <View style={{ height: 8 }} />
        </View>
      </ScrollView>
      <ScanlineOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
    borderBottomWidth: 3,
    alignItems: "center",
  },
  marquee: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderBottomWidth: 3,
    gap: 8,
  },
  dot: { width: 10, height: 10, borderWidth: 1, borderColor: "#000" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  tileFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
