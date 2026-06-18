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
      <ArcadeHeader title="SETTINGS" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <PixelText size={9} color={theme.textDim} style={{ marginBottom: 12 }}>
          DISPLAY
        </PixelText>
        <Row
          testID="theme-row"
          icon={themeName === "dark" ? "moon" : "sunny"}
          label={themeName === "dark" ? "DARK MODE" : "LIGHT MODE"}
          hint="Toggle CRT dark / daylight gray"
          value={themeName === "dark"}
          onToggle={toggleTheme}
        />

        <View style={{ height: 8 }} />
        <PixelText size={9} color={theme.textDim} style={{ marginBottom: 12 }}>
          AUDIO & FEEL
        </PixelText>
        <Row
          testID="sound-row"
          icon={soundOn ? "volume-high" : "volume-mute"}
          label={soundOn ? "FX ON" : "FX OFF"}
          hint="Haptic + click feedback on game events"
          value={soundOn}
          onToggle={toggleSound}
        />

        <View style={{ height: 24 }} />
        <View
          style={[styles.about, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <PixelText size={9} color={theme.text}>
            ABOUT
          </PixelText>
          <View style={{ height: 8 }} />
          <PixelText size={8} color={theme.textDim}>
            Mini Arcade · v1.0.0
          </PixelText>
          <PixelText size={8} color={theme.textDim}>
            6 retro mini-games · 0 servers
          </PixelText>
          <PixelText size={8} color={theme.textDim}>
            All scores stored locally on device.
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
