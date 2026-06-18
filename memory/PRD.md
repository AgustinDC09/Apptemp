# Mini Arcade Offline — PRD

## Vision
Una colección retro de arcade 100% offline en tu bolsillo. Seis clásicos en formato reducido, una interfaz con tinte CRT, sin servidores, sin cuentas, sin necesidad de internet.

## Usuario
Jugadores casuales que buscan diversión rápida y nostálgica durante viajes o momentos sin WiFi. Todas las sesiones de juego son anónimas y solo locales.

## Platform
- React Native + Expo (Expo SDK 54, enrutamiento basado en archivos con expo-router)
- objetivos: Android, iOS, vista previa en web
- 100% offline. Ninguna llamada de red en el código de la app. El backend (plantilla FastAPI) permanece intacto y sin uso.

## funcionalidades implementadas (v1.0.0)

### Juegos (6)
| ID         | Mecanica                  | modelo de puntaje                 |
|------------|---------------------------|-----------------------------------|
| serpiente  | cuadrícula 20x20, desliza | +1 por manzana, aumenta velocidad |
| flappy bird| tocar para volar          | +1 por tubo superado              |
| ping-pong  | mover paleta vs IA        | +1 por golpe con paleta           |
| 2048       | deslizar y fusionar fichas| suma de valores fusionados        |
| memoria    | encontrar pares           | máx(100, 1000 - movimientos*15)   |
| tateti     | 3x3 vs minimax CPU        | victorias por sesión              |

### Screens
- **Inicio (`/`)** — título, marquesina, cuadrícula bento de tarjetas de juego con HI por juego, CTAs EMPEZAR / MEJORES RECORDS / AJUSTES.
- **Jugar (`/play/[game]`)** — HUD universal (puntaje, mejor), lienzo del juego, overlay de Game-Over en pantalla completa con REINICIAR + LOBBY.
- **Mejores Records (`/scores`)** — op 5 partidas por juego (mejor fila resaltada), REINICIAR TODO.
- **Ajustes (`/settings`)** — alternar tema oscuro/claro, alternar FX (feedback háptico), bloque de información.

### aspectos transversales
- Tema: oscuro (por defecto) ↔ claro, intercambio completo de paleta. Persistente.
- FX: feedback táctil (expo-haptics) en eventos de salto / golpe / recogida / victoria. Toggle persistente.
- Persistencia: AsyncStorage vía `@/src/utils/storage`. Tema, sonido y puntajes sobreviven reinicios en frío.
- Estética: fuente pixel Press Start 2P, paleta neón, overlay de scanline CRT, botones neobrutalistas con sombra dura.

## Arquitectura Técnica
- **modelos / estado** — `/app/frontend/src/context/AppContext.tsx`
   (tema, sonido, puntajes).
- **catálogo de juegos** — `/app/frontend/src/games/catalog.ts` (fuente única de verdad para routing y display).
- **componentes de juego** — `/app/frontend/src/games/<Name>.tsx` — React Native puro, sin assets externos. Cada uno acepta
  `{ playKey, onScoreChange, onGameOver }`.
- **chrome compartido** — `PixelText`, `PixelButton`, `ArcadeHeader`,
  `ScanlineOverlay`.

## Non-Metas (v1)
- multijugador / tablas de líderes.
- archivos de audio personalizados (solo hápticos por diseño).
- nuevos tipos de juego más allá de los seis incluidos.
