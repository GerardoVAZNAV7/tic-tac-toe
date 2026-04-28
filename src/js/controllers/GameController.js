/* ===========================
   CONTROLLER — Orquestador
   Conecta Model ↔ Views ↔ Services
=========================== */
import { createModel } from '../models/GameModel.js';
import { createBoardView } from '../views/BoardView.js';
import { createScoreView } from '../views/ScoreView.js';
import { createSidebarView } from '../views/SidebarView.js';
import { createModalView } from '../views/ModalView.js';
import { createVoiceService } from '../services/VoiceService.js';
import { createThemeService } from '../services/ThemeService.js';

export function createGameController() {
  const model       = createModel();
  const themeService = createThemeService();

  /* --- BOARD VIEW --- */
  const boardView = createBoardView(document.getElementById('board'));

  /* --- SCORE VIEW --- */
  const scoreView = createScoreView({
    scoreNumP1:  document.getElementById('scoreNumP1'),
    scoreNumP2:  document.getElementById('scoreNumP2'),
    scoreDraws:  document.getElementById('scoreDraws'),
    scoreNameP1: document.getElementById('scoreNameP1'),
    scoreNameP2: document.getElementById('scoreNameP2'),
    scoreIconP1: document.getElementById('scoreIconP1'),
    scoreIconP2: document.getElementById('scoreIconP2'),
    scoreCardP1: document.getElementById('scoreP1'),
    scoreCardP2: document.getElementById('scoreP2'),
    turnBanner:  document.getElementById('turnBanner'),
    turnIcon:    document.getElementById('turnIcon'),
    turnText:    document.getElementById('turnText'),
  });

  /* --- MODAL VIEW --- */
  const modalView = createModalView({
    modalWhoStarts: document.getElementById('modalWhoStarts'),
    pickP1:         document.getElementById('pickP1'),
    pickP2:         document.getElementById('pickP2'),
    pickIconP1:     document.getElementById('pickIconP1'),
    pickIconP2:     document.getElementById('pickIconP2'),
    pickNameP1:     document.getElementById('pickNameP1'),
    pickNameP2:     document.getElementById('pickNameP2'),
    btnCloseSession: document.getElementById('btnCloseSession'),
    modalResult:    document.getElementById('modalResult'),
    resultIcon:     document.getElementById('resultIcon'),
    resultTitle:    document.getElementById('resultTitle'),
    resultSub:      document.getElementById('resultSub'),
    btnNextRound:   document.getElementById('btnNextRound'),
    modalSession:   document.getElementById('modalSession'),
    sessionTrophy:  document.getElementById('sessionTrophy'),
    sessionTitle:   document.getElementById('sessionTitle'),
    sessionSub:     document.getElementById('sessionSub'),
    sessionStats:   document.getElementById('sessionStats'),
    btnNewSession:  document.getElementById('btnNewSession'),
    confettiCanvas:  document.getElementById('confettiCanvas'),
    confettiCanvas2: document.getElementById('confettiCanvas2'),
  });

  /* --- SIDEBAR VIEW --- */
  const sidebarView = createSidebarView(
    {
      sidebar:       document.getElementById('sidebar'),
      overlay:       document.getElementById('sidebarOverlay'),
      menuBtn:       document.getElementById('menuBtn'),
      closeBtn:      document.getElementById('sidebarClose'),
      iconGridP1:    document.getElementById('iconGridP1'),
      iconGridP2:    document.getElementById('iconGridP2'),
      colorP1:       document.getElementById('colorP1'),
      colorP2:       document.getElementById('colorP2'),
      nameP1:        document.getElementById('nameP1'),
      nameP2:        document.getElementById('nameP2'),
      themeCheck:    document.getElementById('themeCheck'),
      voiceCheck:    document.getElementById('voiceCheck'),
      voiceHint:     document.getElementById('voiceHint'),
      applyBtn:      document.getElementById('applyConfig'),
      voiceIndicator: document.getElementById('voiceIndicator'),
    },
    // onApply
    ({ p1, p2 }) => {
      model.setPlayer(0, p1);
      model.setPlayer(1, p2);
      updateCSSColors(model.getState());
    },
    // onThemeChange
    (theme) => {
      model.setTheme(theme);
      themeService.apply(theme);
    },
    // onVoiceChange
    (enabled) => {
      model.setVoice(enabled);
      if (enabled) {
        voiceService?.start();
        document.getElementById('voiceIndicator').classList.add('voice-active');
      } else {
        voiceService?.stop();
        document.getElementById('voiceIndicator').classList.remove('voice-active');
      }
      updateVoiceLabels(model.getState());
    }
  );

  /* --- VOICE SERVICE --- */
  const voiceService = createVoiceService((cellIndex) => {
    const state = model.getState();
    if (!state.gameActive) return;
    handleCellMark(cellIndex);
  });

  if (!voiceService) {
    document.getElementById('voiceCheck').disabled = true;
    document.getElementById('voiceCheck').parentElement.title = 'Tu navegador no soporta reconocimiento de voz';
  }

  /* --- BOARD EVENTS --- */
  boardView.onCellClick((index) => handleCellMark(index));

  /* --- END ROUND BUTTON --- */
  document.getElementById('btnEnd').addEventListener('click', () => {
    const state = model.getState();
    if (!state.roundStarted) return;
    if (!state.gameActive && state.winner !== null) {
      // Ya tiene resultado, mostrar modal
      showResultModal();
      return;
    }
    model.endRound();
    showResultModal();
  });

  /* --- MODEL SUBSCRIPTION --- */
  model.subscribe((state) => {
    boardView.render(state);
    scoreView.render(state);
    updateVoiceLabels(state);
    updateCSSColors(state);

    if (state.winner !== null && state.gameActive === false && state.roundStarted) {
      const prev = _prevWinner;
      if (prev !== state.winner) {
        _prevWinner = state.winner;
        const bumpIdx = state.winner === 'draw' ? 2 : state.winner;
        scoreView.bumpScore(bumpIdx);
        setTimeout(() => showResultModal(), 500);
      }
    }
  });

  let _prevWinner = null;

  function handleCellMark(index) {
    const state = model.getState();
    if (!state.gameActive) return;
    if (state.board[index] !== null) {
      // Celda ocupada — shake board
      const cell = document.querySelector(`[data-index="${index}"]`);
      if (cell) { cell.classList.remove('shake'); void cell.offsetWidth; cell.classList.add('shake'); }
      return;
    }
    const marked = model.markCell(index);
    if (marked) boardView.animateCell(index);
  }

  function showResultModal() {
    modalView.showResult(model.getState(), () => {
      modalView.hideResult();
      _prevWinner = null;
      askWhoStarts();
    });
  }

  function askWhoStarts() {
    modalView.showWhoStarts(
      model.getState(),
      // onStart
      (playerIdx) => {
        _prevWinner = null;
        modalView.hideWhoStarts();
        model.startRound(playerIdx);
      },
      // onCloseSession
      () => {
        modalView.hideWhoStarts();
        modalView.showSession(model.getState(), () => {
          modalView.hideSession();
          model.resetScores();
          askWhoStarts();
        });
      }
    );
  }

  function updateCSSColors(state) {
    document.documentElement.style.setProperty('--accent-p1', state.players[0].color);
    document.documentElement.style.setProperty('--accent-p2', state.players[1].color);
    const hex1 = state.players[0].color;
    const hex2 = state.players[1].color;
    document.documentElement.style.setProperty('--accent-p1-glow', hexToRgba(hex1, .22));
    document.documentElement.style.setProperty('--accent-p2-glow', hexToRgba(hex2, .22));
  }

  function updateVoiceLabels(state) {
    const colLabels = document.getElementById('colLabels');
    const rowLabels = document.getElementById('rowLabels');
    const show = state.voiceEnabled;
    colLabels.style.display = show ? 'grid' : 'none';
    rowLabels.style.display = show ? 'flex' : 'none';
  }

  /* --- INIT --- */
  function init() {
    const state = model.getState();
    updateCSSColors(state);
    sidebarView.syncFromState(state);
    boardView.render(state);
    scoreView.render(state);
    askWhoStarts();
  }

  return { init };
}

/* --- UTILS --- */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
