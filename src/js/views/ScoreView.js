/* ===========================
   VIEW — Marcador y turno
=========================== */
export function createScoreView(els) {
  const {
    scoreNumP1, scoreNumP2, scoreDraws,
    scoreNameP1, scoreNameP2,
    scoreIconP1, scoreIconP2,
    scoreCardP1, scoreCardP2,
    turnBanner, turnIcon, turnText,
  } = els;

  return {
    render(state) {
      const { players, scores, currentPlayer, gameActive, winner, roundStarted } = state;

      // Nombres e iconos en scoreboard
      scoreNameP1.textContent = players[0].name;
      scoreNameP2.textContent = players[1].name;
      scoreIconP1.textContent = players[0].icon;
      scoreIconP2.textContent = players[1].icon;

      // Scores
      scoreNumP1.textContent = scores[0];
      scoreNumP2.textContent = scores[1];
      scoreDraws.textContent = scores[2];

      // Active player highlight
      scoreCardP1.classList.toggle('active-player', gameActive && currentPlayer === 0);
      scoreCardP2.classList.toggle('active-player', gameActive && currentPlayer === 1);

      // Turn banner
      if (!roundStarted) {
        turnText.textContent = 'Selecciona quién inicia';
        turnIcon.textContent = '⚡';
        return;
      }
      if (winner !== null) {
        if (winner === 'draw') {
          turnIcon.textContent = '🤝';
          turnText.textContent = '¡Empate!';
        } else {
          turnIcon.textContent = players[winner].icon;
          turnText.textContent = `${players[winner].name} ganó 🎉`;
        }
        return;
      }
      const cp = players[currentPlayer];
      turnIcon.style.color = cp.color;
      turnIcon.textContent = cp.icon;
      turnText.textContent = `Turno de ${cp.name}`;
      turnBanner.classList.remove('turn-anim');
      void turnBanner.offsetWidth;
      turnBanner.classList.add('turn-anim');
    },

    bumpScore(playerIdx) {
      const el = playerIdx === 0 ? scoreNumP1 : (playerIdx === 1 ? scoreNumP2 : scoreDraws);
      el.classList.remove('score-bump');
      void el.offsetWidth;
      el.classList.add('score-bump');
    },
  };
}
