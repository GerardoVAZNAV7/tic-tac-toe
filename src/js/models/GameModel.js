/* ===========================
   MODEL — Estado del juego
   Patrón: MVC / Observer
=========================== */

export const ICONS = [
  '✦','✿','★','♥','♦','⚡','🔥','🌙','🌸','🎯',
  '👾','🦊','🐉','🎸','🍀','🌈','💎','🚀','🦋','⚽'
];

const DEFAULT_STATE = {
  players: [
    { name: 'Jugador 1', icon: '✦', color: '#6EE7B7' },
    { name: 'Jugador 2', icon: '✿', color: '#F9A8D4' },
  ],
  board: Array(9).fill(null),   // null | 0 | 1
  currentPlayer: 0,             // índice 0 o 1
  gameActive: false,
  roundStarted: false,
  scores: [0, 0, 0],            // [p1, p2, draws]
  theme: 'dark',
  voiceEnabled: false,
  winner: null,                 // null | 0 | 1 | 'draw'
  winningCells: [],
};

export function createModel() {
  let state = structuredClone(DEFAULT_STATE);
  const listeners = new Set();

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  return {
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    getState() { return state; },

    setPlayer(idx, patch) {
      state.players[idx] = { ...state.players[idx], ...patch };
      notify();
    },

    setTheme(theme) {
      state.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      notify();
    },

    setVoice(enabled) {
      state.voiceEnabled = enabled;
      notify();
    },

    startRound(startingPlayer) {
      state.board = Array(9).fill(null);
      state.currentPlayer = startingPlayer;
      state.gameActive = true;
      state.roundStarted = true;
      state.winner = null;
      state.winningCells = [];
      notify();
    },

    markCell(cellIndex) {
      if (!state.gameActive) return false;
      if (state.board[cellIndex] !== null) return false;

      state.board[cellIndex] = state.currentPlayer;
      const result = checkWinner(state.board);

      if (result) {
        state.gameActive = false;
        if (result.winner === 'draw') {
          state.winner = 'draw';
          state.scores[2]++;
        } else {
          state.winner = result.winner;
          state.winningCells = result.cells;
          state.scores[result.winner]++;
        }
      } else {
        state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
      }

      notify();
      return true;
    },

    endRound() {
      if (!state.roundStarted) return;
      state.gameActive = false;
      if (state.winner === null) {
        // forzar empate si se finaliza manualmente
        state.winner = 'draw';
        state.scores[2]++;
        notify();
      }
    },

    resetScores() {
      state.scores = [0, 0, 0];
      notify();
    },
  };
}

/* --- LÓGICA GANADORA --- */
const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // filas
  [0,3,6],[1,4,7],[2,5,8], // columnas
  [0,4,8],[2,4,6],         // diagonales
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], cells: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== null)) return { winner: 'draw', cells: [] };
  return null;
}
