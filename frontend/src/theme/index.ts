// Arcade neon palette. Two themes — DARK is the canonical retro look,
// LIGHT is a "daylight" inversion that keeps neon accents but darkens
// them so contrast stays >= 4.5:1 against the gray background.

export type ThemeName = "dark" | "light";

export type ArcadeTheme = {
  name: ThemeName;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textDim: string;
  cyan: string;
  magenta: string;
  yellow: string;
  green: string;
  red: string;
  shadow: string;
};

export const DARK: ArcadeTheme = {
  name: "dark",
  bg: "#0A0A0C",
  surface: "#14141A",
  surfaceAlt: "#1F1F2A",
  border: "#FFFFFF",
  text: "#FFFFFF",
  textDim: "#A0A0B0",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  yellow: "#FFFF00",
  green: "#39FF14",
  red: "#FF003C",
  shadow: "#FFFFFF",
};

export const LIGHT: ArcadeTheme = {
  name: "light",
  bg: "#F0F0F0",
  surface: "#FFFFFF",
  surfaceAlt: "#E5E5EA",
  border: "#000000",
  text: "#000000",
  textDim: "#505050",
  cyan: "#008C8C",
  magenta: "#A300A3",
  yellow: "#9C8B00",
  green: "#1F9A0A",
  red: "#B5002A",
  shadow: "#000000",
};

export const FONT = "PressStart2P";
