// Settings screen: theme toggle, sound toggle, about.

import React from "react";
import { ScrollView, StyleSheet, View, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import PixelText from "@/src/components/PixelText";
import ArcadeHeader from "@/src/components/ArcadeHeader";
import ScanlineOverlay from "@/src/components/ScanlineOverlay";
import { useApp } from "@/src/context/AppContext";

function Row({
  icon,
  label,
  hint,
  value,
  onToggle,
  testID,
}: {
  icon: any;
  label: string;
  hint: string;
  value: boolean;
  onToggle: () => void;
  testID: string;
}) {
  const { theme } = useApp();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 3,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        padding: 14,
        marginBottom: 12,
      }}
      testID={testID}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderWidth: 3,
          borderColor: theme.border,
          backgroundColor: value ? theme.green : theme.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={value ? "#000" : theme.textDim} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <PixelText size={10} color={theme.text}>
          {label}
        </PixelText>
        <View style={{ height: 4 }} />
        <PixelText size={7} color={theme.textDim}>
          {hint}
        </PixelText>
      </View>
      <Switch
        testID={`${testID}-switch`}
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.surfaceAlt, true: theme.green }}
        thumbColor={Platform.OS === "android" ? theme.border : undefined}
      />
    </View>
  );
}

export default function Settings() {
  const { theme, themeName, toggleTheme, soundOn, toggleSound } = useApp();

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.bg }}
      testID="settings-screen"
    >
      <ArcadeHeader title="AJUSTES" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <PixelText size={9} color={theme.textDim} style={{ marginBottom: 12 }}>
          PANTALLA
        </PixelText>
        <Row
          testID="theme-row"
          icon={themeName === "dark" ? "moon" : "sunny"}
          label={themeName === "dark" ? "DARK MODE" : "LIGHT MODE"}
          hint="Cambiar entre modo oscuro y claro"
          value={themeName === "dark"}
          onToggle={toggleTheme}
        />

        <View style={{ height: 8 }} />
        <PixelText size={9} color={theme.textDim} style={{ marginBottom: 12 }}>
          AUDIO
        </PixelText>
        <Row
          testID="sound-row"
          icon={soundOn ? "volume-high" : "volume-mute"}
          label={soundOn ? "FX ON" : "FX OFF"}
          hint="Vibración y clic en eventos del juego"
          value={soundOn}
          onToggle={toggleSound}
        />

        <View style={{ height: 24 }} />
        <View
          style={[styles.about, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <PixelText size={9} color={theme.text}>
            ACERCA DE
          </PixelText>
          <View style={{ height: 8 }} />
          <PixelText size={8} color={theme.textDim}>
            Mini Arcade · v1.0.0
          </PixelText>
          <PixelText size={8} color={theme.textDim}>
            6 minijuegos retro locales, sin internet
          </PixelText>
          <PixelText size={8} color={theme.textDim}>
            Todos los records se guardan de manera local
          </PixelText>
        </View>
      </ScrollView>
      <ScanlineOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  about: {
    borderWidth: 3,
    padding: 14,
  },
});
