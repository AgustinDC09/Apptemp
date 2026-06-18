// Neobrutalist arcade button: thick border, hard offset "shadow" (just a
// second View stacked behind), no border radius. Press translates the front
// face onto the shadow for a satisfying click.

import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";

import PixelText from "./PixelText";
import { useApp } from "@/src/context/AppContext";
import { playFx } from "@/src/utils/feedback";

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  color?: string;
  textColor?: string;
  size?: "lg" | "md" | "sm";
  testID?: string;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function PixelButton({
  label,
  onPress,
  color,
  textColor,
  size = "md",
  testID,
  style,
  disabled,
}: Props) {
  const { theme, soundOn } = useApp();
  const [pressed, setPressed] = useState(false);

  const bg = color ?? theme.yellow;
  const txt = textColor ?? "#000";

  const sizes = {
    lg: { padV: 18, padH: 24, font: 16 },
    md: { padV: 14, padH: 20, font: 13 },
    sm: { padV: 10, padH: 14, font: 10 },
  }[size];

  const OFFSET = 6;

  return (
    <View style={[{ alignSelf: "stretch" }, style]}>
      {/* Hard shadow block behind */}
      <View
        style={{
          position: "absolute",
          left: OFFSET,
          top: OFFSET,
          right: -0,
          bottom: -0,
          backgroundColor: theme.shadow,
          borderWidth: 3,
          borderColor: theme.border,
          pointerEvents: "none",
        }}
      />
      <Pressable
        testID={testID}
        disabled={disabled}
        onPressIn={() => {
          setPressed(true);
          playFx("tick", soundOn);
        }}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={{
          backgroundColor: disabled ? theme.surfaceAlt : bg,
          borderWidth: 3,
          borderColor: theme.border,
          paddingVertical: sizes.padV,
          paddingHorizontal: sizes.padH,
          alignItems: "center",
          justifyContent: "center",
          transform: [
            { translateX: pressed ? OFFSET : 0 },
            { translateY: pressed ? OFFSET : 0 },
          ],
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <PixelText size={sizes.font} color={txt}>
          {label}
        </PixelText>
      </Pressable>
    </View>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _styles = StyleSheet.create({});
