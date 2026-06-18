// Wrapper around <Text> that applies the loaded Press Start 2P font.
// Falls back gracefully to system monospace if the font failed to load.

import React from "react";
import { Text, TextProps, StyleSheet, TextStyle } from "react-native";

import { FONT } from "@/src/theme";

type Props = TextProps & {
  size?: number;
  color?: string;
  glow?: string; // color for text shadow "glow"
  style?: TextStyle | TextStyle[];
};

export default function PixelText({
  size = 12,
  color = "#fff",
  glow,
  style,
  children,
  ...rest
}: Props) {
  const composed: TextStyle = {
    fontFamily: FONT,
    fontSize: size,
    color,
    letterSpacing: 0.5,
    lineHeight: Math.round(size * 1.4),
    ...(glow
      ? {
          textShadowColor: glow,
          textShadowRadius: 8,
          textShadowOffset: { width: 0, height: 0 },
        }
      : null),
  };
  return (
    <Text {...rest} style={[styles.base, composed, style as TextStyle]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
