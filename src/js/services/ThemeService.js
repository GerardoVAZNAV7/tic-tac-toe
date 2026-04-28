/* ===========================
   SERVICE — Tema (dark / light)
   Animación de transición suave
=========================== */
export function createThemeService() {
  return {
    apply(theme) {
      // Flash overlay para animación de cambio de tema
      const overlay = document.createElement('div');
      overlay.className = 'theme-transition-overlay';
      document.body.appendChild(overlay);

      document.documentElement.setAttribute('data-theme', theme);

      overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
    },
  };
}
