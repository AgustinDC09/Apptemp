// Static catalog of all games in the arcade. Used by the home grid, the
// scores screen, and routing into /play/[game].

import { GameId } from "@/src/context/AppContext";

export type GameMeta = {
  id: GameId;
  name: string;
  tagline: string;
  icon: string; // Ionicons name
  accent: "cyan" | "magenta" | "yellow" | "green" | "red";
  control: string;
  unit: string; // score units shown after the number, e.g. "PTS"
};

export const GAMES: GameMeta[] = [
  {
    id: "snake",
    name: "SNAKE",
    tagline: "Eat. Grow. Don't bite yourself.",
    icon: "infinite",
    accent: "green",
    control: "Swipe",
    unit: "PTS",
  },
  {
    id: "flappy",
    name: "FLAPPY",
    tagline: "Tap to flap. Mind the pipes.",
    icon: "airplane",
    accent: "yellow",
    control: "Tap",
    unit: "PTS",
  },
  {
    id: "pong",
    name: "PONG",
    tagline: "Out-rally the CPU.",
    icon: "tennisball",
    accent: "cyan",
    control: "Drag",
    unit: "PTS",
  },
  {
    id: "2048",
    name: "2048",
    tagline: "Merge tiles. Reach 2048.",
    icon: "grid",
    accent: "magenta",
    control: "Swipe",
    unit: "PTS",
  },
  {
    id: "memory",
    name: "MEMORY",
    tagline: "Match every pair. Fast.",
    icon: "albums",
    accent: "red",
    control: "Tap",
    unit: "PTS",
  },
  {
    id: "tictactoe",
    name: "TIC-TAC-TOE",
    tagline: "Three in a row vs CPU.",
    icon: "close-circle",
    accent: "cyan",
    control: "Tap",
    unit: "WINS",
  },
];

export function getGame(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}
