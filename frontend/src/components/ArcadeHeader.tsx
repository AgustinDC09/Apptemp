// Reusable screen header with a back button + title in arcade style.

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import PixelText from "./PixelText";
import { useApp } from "@/src/context/AppContext";

type Props = {
  title: string;
  rightSlot?: React.ReactNode;
  testID?: string;
};

export default function ArcadeHeader({ title, rightSlot, testID }: Props) {
  const router = useRouter();
  const { theme } = useApp();
  return (
    <View
      testID={testID}
      style={[
        styles.row,
        {
          borderBottomColor: theme.border,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <Pressable
        testID="header-back-button"
        onPress={() => router.back()}
        hitSlop={12}
        style={[styles.iconBtn, { borderColor: theme.border }]}
      >
        <Ionicons name="chevron-back" size={20} color={theme.text} />
      </Pressable>
      <View style={styles.titleWrap}>
        <PixelText size={12} color={theme.text} glow={theme.cyan}>
          {title}
        </PixelText>
      </View>
      <View style={styles.right}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 3,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
  },
  right: {
    width: 40,
    alignItems: "flex-end",
  },
});
