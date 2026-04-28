# 🎮 Gato — Juego Interactivo UX/UI

> Proyecto desarrollado para la materia de **UX/UI**. Un juego de Gato (Tic-Tac-Toe) moderno, personalizable y con múltiples modos de juego, construido con **HTML, CSS y JavaScript puro** usando **Vite** como bundler.

---

## ✨ Características

- 🎨 **Iconos personalizables** — Elige entre 20 íconos distintos para cada jugador (emojis y símbolos)
- 🎨 **Color por jugador** — Selecciona el color de cada jugador con un color picker
- 🌙 **Modo oscuro / claro** — Cambia el tema con animación de transición suave
- ⚡ **Selección de turno** — Antes de cada ronda el juego pregunta quién empieza
- 📊 **Marcador de sesión** — Lleva la cuenta de victorias de cada jugador y empates
- 🏆 **Resumen de sesión** — Al cerrar el marcador muestra estadísticas con barras de progreso y confeti
- 🎙️ **Modo de voz** — Juega usando comandos de voz con coordenadas tipo `A1`, `B2`, `C3`
- 🎉 **Confeti animado** — Celebración visual al ganar una ronda o la sesión
- 📱 **Responsive** — Compatible con móvil, tablet y desktop

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Variables, animaciones, layout responsive |
| JavaScript ES6+ | Lógica de juego con patrón MVC |
| [Vite](https://vitejs.dev/) | Dev server y bundler |
| Web Speech API | Reconocimiento de voz |

---

## 📁 Estructura del Proyecto

```
tic-tac-toe/
├── index.html                  # Punto de entrada HTML
├── package.json
├── vite.config.js
└── src/
    ├── css/
    │   ├── variables.css       # Tokens de diseño (colores, radios, tipografía)
    │   ├── base.css            # Reset y estilos base
    │   ├── layout.css          # Estructura general de la app
    │   ├── components.css      # Botones, cards, toggles, inputs
    │   ├── board.css           # Tablero y celdas
    │   ├── sidebar.css         # Panel lateral de configuración
    │   ├── animations.css      # Keyframes y animaciones
    │   ├── modal.css           # Modales y confeti
    │   └── responsive.css      # Media queries
    └── js/
        ├── main.js             # Entry point JS
        ├── models/
        │   └── GameModel.js    # Estado del juego y lógica de victoria
        ├── views/
        │   ├── BoardView.js    # Renderizado del tablero
        │   ├── ScoreView.js    # Marcador y banner de turno
        │   ├── SidebarView.js  # Panel de configuración
        │   └── ModalView.js    # Modales + confeti animado
        ├── controllers/
        │   └── GameController.js  # Orquesta Model ↔ Views ↔ Services
        └── services/
            ├── VoiceService.js    # Reconocimiento de voz (A1–C3)
            └── ThemeService.js    # Transición de tema dark/light
```

---

## 🚀 Cómo clonar y correr el proyecto

### Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- npm (viene incluido con Node.js)

Puedes verificar tu versión con:
```bash
node -v
npm -v
```

---

### Pasos

**1. Clona el repositorio**

```bash
git clone https://github.com/GerardoVAZNAV7/tic-tac-toe.git
```

**2. Entra a la carpeta del proyecto**

```bash
cd tic-tac-toe
```

**3. Instala las dependencias**

```bash
npm install
```

**4. Inicia el servidor de desarrollo**

```bash
npm run dev
```

El proyecto se abrirá automáticamente en tu navegador en:
```
http://localhost:3000
```

---

### Otros comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con hot reload |
| `npm run build` | Genera la versión optimizada para producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción localmente |

---

## 🎙️ Modo de juego por voz

Al activar el modo voz desde el panel de configuración (ícono ☰), el tablero muestra coordenadas:

- Las **columnas** se numeran: `1`, `2`, `3`
- Las **filas** se etiquetan: `A`, `B`, `C`

Di en voz alta una coordenada para marcar la celda:

```
"A1" → celda superior izquierda
"B2" → celda central
"C3" → celda inferior derecha
```

> ⚠️ El modo voz requiere permiso de micrófono en el navegador. Funciona mejor en **Google Chrome**.

---

## 🎨 Capturas

| Modo Oscuro | Modo Claro |
|---|---|
| Panel lateral de configuración con selección de íconos y colores | Cambio de tema con animación flash |

---

## 👤 Autor

**Gerardo VAZNAV7**  
Proyecto para la materia de UX/UI  
[github.com/GerardoVAZNAV7](https://github.com/GerardoVAZNAV7)

---

## 📄 Licencia

Este proyecto es de uso académico. Libre para consulta y aprendizaje.
