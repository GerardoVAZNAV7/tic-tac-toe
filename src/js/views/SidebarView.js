/* ===========================
   VIEW — Sidebar de configuración
=========================== */
import { ICONS } from '../models/GameModel.js';

export function createSidebarView(els, onApply, onThemeChange, onVoiceChange) {
  const {
    sidebar, overlay, menuBtn, closeBtn,
    iconGridP1, iconGridP2,
    colorP1, colorP2,
    nameP1, nameP2,
    themeCheck, voiceCheck, voiceHint,
    applyBtn, voiceIndicator,
  } = els;

  let selectedIconP1 = ICONS[0];
  let selectedIconP2 = ICONS[1];

  // Construir grillas de iconos
  function buildIconGrid(container, playerIdx) {
    container.innerHTML = '';
    ICONS.forEach(icon => {
      const btn = document.createElement('button');
      btn.className = 'icon-btn';
      btn.textContent = icon;
      btn.title = icon;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (playerIdx === 0) selectedIconP1 = icon;
        else selectedIconP2 = icon;
      });
      if (playerIdx === 0 && icon === selectedIconP1) btn.classList.add('selected');
      if (playerIdx === 1 && icon === selectedIconP2) btn.classList.add('selected');
      container.appendChild(btn);
    });
  }

  buildIconGrid(iconGridP1, 0);
  buildIconGrid(iconGridP2, 1);

  // Abrir / cerrar sidebar
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  menuBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Tema
  themeCheck.addEventListener('change', () => {
    const theme = themeCheck.checked ? 'dark' : 'light';
    onThemeChange(theme);
  });

  // Voz
  voiceCheck.addEventListener('change', () => {
    const enabled = voiceCheck.checked;
    voiceHint.style.display = enabled ? 'block' : 'none';
    voiceIndicator.style.display = enabled ? 'grid' : 'none';
    onVoiceChange(enabled);
  });

  // Aplicar configuración
  applyBtn.addEventListener('click', () => {
    onApply({
      p1: { name: nameP1.value || 'Jugador 1', icon: selectedIconP1, color: colorP1.value },
      p2: { name: nameP2.value || 'Jugador 2', icon: selectedIconP2, color: colorP2.value },
    });
    closeSidebar();
  });

  return {
    syncFromState(state) {
      const { players, theme, voiceEnabled } = state;
      nameP1.value = players[0].name;
      nameP2.value = players[1].name;
      colorP1.value = players[0].color;
      colorP2.value = players[1].color;
      selectedIconP1 = players[0].icon;
      selectedIconP2 = players[1].icon;
      themeCheck.checked = theme === 'dark';
      voiceCheck.checked = voiceEnabled;
      voiceHint.style.display = voiceEnabled ? 'block' : 'none';
      voiceIndicator.style.display = voiceEnabled ? 'grid' : 'none';
      buildIconGrid(iconGridP1, 0);
      buildIconGrid(iconGridP2, 1);
    },
  };
}
