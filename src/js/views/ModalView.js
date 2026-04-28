/* ===========================
   VIEW — Modales
=========================== */
export function createModalView(els) {
  const {
    modalWhoStarts, pickP1, pickP2,
    pickIconP1, pickIconP2, pickNameP1, pickNameP2,
    btnCloseSession,
    modalResult, resultIcon, resultTitle, resultSub, btnNextRound,
    modalSession, sessionTrophy, sessionTitle, sessionSub, sessionStats, btnNewSession,
    confettiCanvas, confettiCanvas2,
  } = els;

  let startCallback = null;
  let nextRoundCallback = null;
  let closeSessionCallback = null;
  let newSessionCallback = null;

  pickP1.addEventListener('click', () => startCallback && startCallback(0));
  pickP2.addEventListener('click', () => startCallback && startCallback(1));
  btnNextRound.addEventListener('click', () => nextRoundCallback && nextRoundCallback());
  btnCloseSession.addEventListener('click', () => closeSessionCallback && closeSessionCallback());
  btnNewSession.addEventListener('click', () => newSessionCallback && newSessionCallback());

  return {
    showWhoStarts(state, onStart, onCloseSession) {
      startCallback = onStart;
      closeSessionCallback = onCloseSession;
      pickIconP1.textContent = state.players[0].icon;
      pickIconP2.textContent = state.players[1].icon;
      pickNameP1.textContent = state.players[0].name;
      pickNameP2.textContent = state.players[1].name;
      pickP1.style.color = state.players[0].color;
      pickP2.style.color = state.players[1].color;

      // Mostrar botón cerrar solo si hay partidas jugadas
      const totalPlayed = state.scores[0] + state.scores[1] + state.scores[2];
      btnCloseSession.style.display = totalPlayed > 0 ? 'flex' : 'none';

      modalWhoStarts.style.display = 'grid';
    },

    hideWhoStarts() {
      modalWhoStarts.style.display = 'none';
    },

    showResult(state, onNextRound) {
      nextRoundCallback = onNextRound;
      const { winner, players } = state;

      if (winner === 'draw') {
        resultIcon.textContent = '🤝';
        resultTitle.textContent = '¡Empate!';
        resultSub.textContent = 'Nadie ganó esta vez. ¡Intenten de nuevo!';
      } else {
        const p = players[winner];
        resultIcon.textContent = p.icon;
        resultTitle.textContent = `¡${p.name} ganó!`;
        resultSub.textContent = 'Fantástica partida 🎉';
        launchConfetti(confettiCanvas, p.color);
      }

      modalResult.style.display = 'grid';
    },

    hideResult() {
      modalResult.style.display = 'none';
      stopConfetti(confettiCanvas);
    },

    showSession(state, onNewSession) {
      newSessionCallback = onNewSession;
      const { players, scores } = state;
      const [s0, s1, draws] = scores;
      const total = s0 + s1 + draws;

      // Determinar ganador de sesión
      let trophy, title, sub;
      if (s0 > s1) {
        trophy = players[0].icon;
        title  = `¡${players[0].name} domina la sesión!`;
        sub    = `Con ${s0} victoria${s0 !== 1 ? 's' : ''} en ${total} partida${total !== 1 ? 's' : ''}`;
        launchConfetti(confettiCanvas2, players[0].color);
      } else if (s1 > s0) {
        trophy = players[1].icon;
        title  = `¡${players[1].name} domina la sesión!`;
        sub    = `Con ${s1} victoria${s1 !== 1 ? 's' : ''} en ${total} partida${total !== 1 ? 's' : ''}`;
        launchConfetti(confettiCanvas2, players[1].color);
      } else if (total === 0) {
        trophy = '🎮';
        title  = 'Sin partidas jugadas';
        sub    = 'No se registraron partidas en esta sesión.';
      } else {
        trophy = '🤝';
        title  = '¡Sesión empatada!';
        sub    = `Ambos terminaron igual en ${total} partida${total !== 1 ? 's' : ''}`;
      }

      sessionTrophy.textContent = trophy;
      sessionTitle.textContent  = title;
      sessionSub.textContent    = sub;

      // Construir stats visuales
      const maxWins = Math.max(s0, s1, 1);
      sessionStats.innerHTML = `
        ${buildStatRow(players[0], s0, total, maxWins, true)}
        ${buildStatRow(players[1], s1, total, maxWins, false)}
        <div class="stat-row">
          <div class="stat-row-left">
            <span class="stat-icon">🤝</span>
            <span>Empates</span>
          </div>
          <span class="stat-count" style="color:var(--accent-draw)">${draws}</span>
        </div>
      `;

      // Animar barras con delay
      setTimeout(() => {
        sessionStats.querySelectorAll('.stat-bar').forEach(bar => {
          bar.style.width = bar.dataset.target;
        });
      }, 80);

      modalSession.style.display = 'grid';
    },

    hideSession() {
      modalSession.style.display = 'none';
      stopConfetti(confettiCanvas2);
    },
  };
}

function buildStatRow(player, wins, total, maxWins, isFirst) {
  const pct = total > 0 ? Math.round((wins / total) * 100) : 0;
  const barW = maxWins > 0 ? Math.round((wins / maxWins) * 100) : 0;
  return `
    <div class="stat-row">
      <div class="stat-row-left">
        <span class="stat-icon">${player.icon}</span>
        <div>
          <div>${player.name}</div>
          <div class="stat-bar-wrap">
            <div class="stat-bar" style="background:${player.color}; width:0%" data-target="${barW}%"></div>
          </div>
        </div>
      </div>
      <span class="stat-count" style="color:${player.color}">${wins}</span>
    </div>
  `;
}

/* ===========================
   CONFETTI
=========================== */
const _confettiState = new WeakMap();

function launchConfetti(canvas, accentColor) {
  const state = { af: null, ctx: null, particles: [] };
  _confettiState.set(canvas, state);

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  state.ctx     = canvas.getContext('2d');

  const COLORS = [accentColor, '#FBBF24', '#60A5FA', '#F9A8D4', '#6EE7B7', '#C4B5FD', '#FCA5A5'];
  state.particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 2.5 + Math.random() * 3.5,
    spin: (Math.random() - .5) * .18,
    angle: Math.random() * Math.PI * 2,
    drift: (Math.random() - .5) * 1.5,
    opacity: 1,
  }));

  function draw() {
    state.ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.particles.forEach(p => {
      state.ctx.save();
      state.ctx.translate(p.x, p.y);
      state.ctx.rotate(p.angle);
      state.ctx.globalAlpha = p.opacity;
      state.ctx.fillStyle = p.color;
      state.ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      state.ctx.restore();
      p.y += p.speed; p.x += p.drift; p.angle += p.spin;
      if (p.y > canvas.height + 20) { p.y = -10; p.x = Math.random() * canvas.width; p.opacity = 1; }
      if (p.y > canvas.height * .7) p.opacity = Math.max(0, p.opacity - .01);
    });
    state.af = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti(canvas) {
  const state = _confettiState.get(canvas);
  if (!state) return;
  if (state.af) { cancelAnimationFrame(state.af); state.af = null; }
  if (state.ctx) state.ctx.clearRect(0, 0, canvas.width, canvas.height);
  state.particles = [];
}

