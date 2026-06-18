// CRT scanline overlay. Pure View stripes layered above content with
// pointerEvents="none". Cheap to render and gives the retro vibe instantly.

import React, { useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

type Props = {
  opacity?: number;
  spacing?: number; // px between lines
};

export default function ScanlineOverlay({
  opacity = 0.08,
  spacing = 4,
}: Props) {
  const { height } = useWindowDimensions();
  const lines = useMemo(() => {
    const count = Math.ceil(height / spacing) + 4;
    return new Array(count).fill(0).map((_, i) => i);
  }, [height, spacing]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {lines.map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: i * spacing,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "#000",
            opacity,
          }}
        />
      ))}
    </View>
  );
}
