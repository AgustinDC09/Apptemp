# Mini Arcade Offline — PRD

## Vision
A 100% offline retro arcade collection in your pocket. Six bite-sized
classics, a CRT-tinted UI, no servers, no accounts, no internet required.

## User
Casual gamers who want quick, nostalgic fun on commute / WiFi-less moments.
All play sessions are anonymous and local-only.

## Platform
- React Native + Expo (Expo SDK 54, expo-router file-based routing)
- Targets: Android, iOS, Web preview
- 100% offline. Zero network calls in app code. Backend (FastAPI template)
  is untouched and unused.

## Implemented Features (v1.0.0)

### Games (6)
| ID         | Mechanic                  | Score model                       |
|------------|---------------------------|-----------------------------------|
| snake      | 20x20 grid, swipe to turn | +1 per apple, speeds up           |
| flappy     | Tap to flap, gravity      | +1 per pipe cleared               |
| pong       | Drag to move paddle vs AI | +1 per paddle hit                 |
| 2048       | Swipe to merge tiles      | Sum of merged values              |
| memory     | 4x4 grid, flip pairs      | max(100, 1000 - moves*15)         |
| tictactoe  | 3x3 vs minimax CPU        | Wins per session                  |

### Screens
- **Home (`/`)** — title, marquee, bento grid of game cards w/ HI per game,
  PLAY / HI-SCORES / SETTINGS CTAs.
- **Play (`/play/[game]`)** — universal HUD (score, best), game canvas,
  full-screen Game-Over overlay with RESTART + LOBBY.
- **Hi-Scores (`/scores`)** — top 5 runs per game (best row highlighted),
  RESET ALL.
- **Settings (`/settings`)** — dark/light theme toggle, FX (haptic
  feedback) toggle, about block.

### Cross-cutting
- Theme: dark (default) ↔ light, full palette swap. Persisted.
- FX: tactile feedback (expo-haptics) on jump / hit / pickup / win events.
  Persisted toggle.
- Persistence: AsyncStorage via `@/src/utils/storage`. Theme, sound, and
  scores survive cold restarts.
- Aesthetic: Press Start 2P pixel font, neon palette, CRT scanline
  overlay, neobrutalist hard-shadow buttons.

## Tech Architecture
- **Models / state** — `/app/frontend/src/context/AppContext.tsx`
  (theme, sound, scores).
- **Game catalog** — `/app/frontend/src/games/catalog.ts` (single
  source of truth for routing & display).
- **Game components** — `/app/frontend/src/games/<Name>.tsx` — pure
  React Native, no external assets. Each accepts
  `{ playKey, onScoreChange, onGameOver }`.
- **Shared chrome** — `PixelText`, `PixelButton`, `ArcadeHeader`,
  `ScanlineOverlay`.

## Non-Goals (v1)
- Multiplayer / leaderboards.
- Custom audio files (haptics-only by design).
- New game types beyond the six shipped.
