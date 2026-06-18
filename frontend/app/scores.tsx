// Hi-scores screen. Per-game cards showing best run + the most recent
// 5 runs. Best-score row is highlighted in neon.

import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PixelText from "@/src/components/PixelText";
import PixelButton from "@/src/components/PixelButton";
import ArcadeHeader from "@/src/components/ArcadeHeader";
import ScanlineOverlay from "@/src/components/ScanlineOverlay";
import { useApp } from "@/src/context/AppContext";
import { GAMES } from "@/src/games/catalog";

export default function Scores() {
  const { theme, scores, resetScores } = useApp();
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.bg }}
      testID="scores-screen"
    >
      <ArcadeHeader title="MEJORES RECORDS" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {GAMES.map((g) => {
          const list = scores[g.id] ?? [];
          const accent = {
            cyan: theme.cyan,
            magenta: theme.magenta,
            yellow: theme.yellow,
            green: theme.green,
            red: theme.red,
          }[g.accent];
          const best = list[0]?.score ?? 0;
          return (
            <View
              key={g.id}
              testID={`scores-card-${g.id}`}
              style={{
                borderWidth: 3,
                borderColor: theme.border,
                backgroundColor: theme.surface,
                marginBottom: 16,
                padding: 14,
              }}
            >
              <View style={styles.cardHeader}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderWidth: 3,
                    borderColor: theme.border,
                    backgroundColor: accent,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={g.icon as any} size={18} color="#000" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <PixelText size={11} color={theme.text}>
                    {g.name}
                  </PixelText>
                  <View style={{ height: 4 }} />
                  <PixelText size={8} color={theme.textDim}>
                    MEJOR {String(best).padStart(5, "0")} {g.unit}
                  </PixelText>
                </View>
              </View>

              {list.length === 0 ? (
                <View
                  style={{
                    borderTopWidth: 2,
                    borderColor: theme.border,
                    marginTop: 12,
                    paddingTop: 12,
                  }}
                >
                  <PixelText size={9} color={theme.textDim}>
                    SIN RECORD TODAVIA — JUEGA PARA ESTABLECER RECORDS!
                  </PixelText>
                </View>
              ) : (
                <View
                  style={{
                    borderTopWidth: 2,
                    borderColor: theme.border,
                    marginTop: 12,
                    paddingTop: 8,
                  }}
                >
                  {list.slice(0, 5).map((entry, idx) => (
                    <View
                      key={idx}
                      testID={`score-row-${g.id}-${idx}`}
                      style={[
                        styles.row,
                        idx === 0 && {
                          backgroundColor: theme.surfaceAlt,
                        },
                      ]}
                    >
                      <PixelText
                        size={9}
                        color={idx === 0 ? accent : theme.textDim}
                        glow={idx === 0 ? accent : undefined}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </PixelText>
                      <PixelText
                        size={10}
                        color={idx === 0 ? accent : theme.text}
                        style={{ flex: 1, marginLeft: 12 }}
                        glow={idx === 0 ? accent : undefined}
                      >
                        {String(entry.score).padStart(5, "0")}
                      </PixelText>
                      <PixelText size={7} color={theme.textDim}>
                        {entry.date.slice(0, 10)}
                      </PixelText>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <PixelButton
          testID="reset-scores-button"
          label="REINICIAR TODOS"
          color={theme.red}
          textColor="#fff"
          size="sm"
          onPress={resetScores}
        />
      </ScrollView>
      <ScanlineOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardHeader: { flexDirection: "row", alignItems: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
