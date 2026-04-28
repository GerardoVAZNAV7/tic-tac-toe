/* ===========================
   VIEW — Tablero
=========================== */
export function createBoardView(boardEl) {
  // Crear 9 celdas
  boardEl.innerHTML = '';
  const cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  let clickHandler = null;
  boardEl.addEventListener('click', e => {
    const cell = e.target.closest('.cell');
    if (!cell || !clickHandler) return;
    clickHandler(Number(cell.dataset.index));
  });
  boardEl.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cell') && clickHandler) {
      clickHandler(Number(e.target.dataset.index));
    }
  });

  return {
    onCellClick(fn) { clickHandler = fn; },

    render(state) {
      const { board, players, winner, winningCells, gameActive, currentPlayer, voiceEnabled } = state;

      cells.forEach((cell, i) => {
        const owner = board[i];
        cell.className = 'cell';
        cell.textContent = '';
        cell.style.color = '';
        cell.style.cursor = '';

        if (owner !== null) {
          const p = players[owner];
          cell.classList.add('filled', `filled-p${owner + 1}`);
          cell.textContent = p.icon;
          cell.style.color = p.color;
          if (winningCells.includes(i)) {
            cell.classList.add('winning');
          }
        } else if (!gameActive || winner !== null) {
          cell.style.cursor = 'default';
        }
      });

      // Coordenadas voz en aria-label
      const ROW_LABELS = ['A','B','C'];
      cells.forEach((cell, i) => {
        const row = ROW_LABELS[Math.floor(i/3)];
        const col = (i % 3) + 1;
        cell.setAttribute('aria-label', voiceEnabled ? `Celda ${row}${col}` : `Celda ${i+1}`);
      });
    },

    animateCell(index) {
      const cell = cells[index];
      cell.classList.remove('pop');
      void cell.offsetWidth; // reflow
      cell.classList.add('pop');
    },

    showHoverPreview(index, playerClass) {
      cells.forEach(c => c.classList.remove('hover-preview-p1','hover-preview-p2'));
      if (index !== null) cells[index].classList.add(playerClass);
    },
  };
}
