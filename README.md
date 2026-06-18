# MiniArcade 
MiniArcade es una plataforma de juegos retro estilo arcade desarrollada para dispositivos móviles. El proyecto se centra en ofrecer una experiencia clásica, fluida y totalmente offline, permitiendo disfrutar de 6 minijuegos icónicos en cualquier lugar, sin necesidad de conexión a internet ni bases de datos externas.
# Características Principales
100% Offline: No requiere conexión a internet para jugar
.
Gestión de Récords Locales: Los puntajes se guardan automáticamente en el dispositivo con la fecha de obtención
.
# Personalización:
Modo Oscuro/Claro: Elige la estética que prefieras desde los ajustes
.
Control de Audio: Opción para activar/desactivar efectos de sonido y vibración (FX ON/OFF)
.
Privacidad: Sin bases de datos externas; toda la información reside en tu teléfono.
Control Total: Posibilidad de reiniciar todos los récords almacenados desde el panel de ajustes
.
# Minijuegos Incluidos
La aplicación cuenta con 6 clásicos recreados fielmente:
Serpiente (Snake): El clásico juego de habilidad y reflejos (SnakeGame.tsx)
.
Flappy Bird: Esquiva los obstáculos tocando la pantalla (FlappyGame.tsx)
.
Ping-Pong: El legendario duelo de paletas (PongGame.tsx)
.
2048: Desliza los números para alcanzar la cifra máxima (Game2048.tsx)
.
Memoria: Encuentra los pares en el menor número de movimientos (MemoryGame.tsx)
.
Tateti (Tic-Tac-Toe): El clásico juego de estrategia por turnos (TicTacToeGame.tsx)
.
# Tecnologías Utilizadas
Frontend: React Native con TypeScript
.
Backend (Auxiliar): Python y JavaScript
.
Framework de Despliegue: Expo
.
# Estilos: Pixel Art UI.
    Estructura del Proyecto
El repositorio está organizado de la siguiente manera
:
├── backend/             # Lógica de servidor (Python/requirements.txt)
├── frontend/            # Código fuente de la App (React Native/Expo)
│   ├── assets/          # Imágenes, sonidos y recursos visuales
│   └── src/
│       └── games/       # Componentes individuales de cada juego
├── app.json             # Configuración de Expo
└── package.json         # Dependencias del proyecto
 Instalación y Ejecución
Para correr este proyecto localmente, asegúrate de tener instalado Node.js y el CLI de Expo.

# Instrucciones: 

* Clonar el repositorio:
* Instalar dependencias:
* Iniciar el proyecto:
*Escanea el código QR generado con la app Expo Go en tu dispositivo móvil

