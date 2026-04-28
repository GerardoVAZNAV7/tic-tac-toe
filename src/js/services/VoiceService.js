/* ===========================
   SERVICE — Control por Voz
   Coordenadas: A1-A3, B1-B3, C1-C3
=========================== */

// Mapa de coordenadas a índice de celda
const COORD_MAP = {
  'A1':0,'A2':1,'A3':2,
  'B1':3,'B2':4,'B3':5,
  'C1':6,'C2':7,'C3':8,
};

// Variantes comunes (reconocimiento puede devolver distintas formas)
const ALIASES = {
  'a uno':0,'a dos':1,'a tres':2,
  'b uno':3,'b dos':4,'b tres':5,
  'c uno':6,'c dos':7,'c tres':8,
  'alpha 1':0,'alpha 2':1,'alpha 3':2,
  'be 1':3,'be 2':4,'be 3':5,
};

export function createVoiceService(onCoord) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous   = true;
  recognition.interimResults = false;
  recognition.lang = 'es-MX';

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (!event.results[i].isFinal) continue;
      const raw = event.results[i][0].transcript.trim().toUpperCase();
      // Intentar coincidencia directa: e.g. "A2", "B 3", "C1"
      const clean = raw.replace(/\s+/g,'');
      if (COORD_MAP[clean] !== undefined) {
        onCoord(COORD_MAP[clean]);
        return;
      }
      // Intentar alias
      const lower = raw.toLowerCase().trim();
      if (ALIASES[lower] !== undefined) {
        onCoord(ALIASES[lower]);
        return;
      }
    }
  };

  recognition.onerror = (e) => {
    if (e.error === 'no-speech') return;
    console.warn('Voice error:', e.error);
  };

  let active = false;

  return {
    start() {
      if (active) return;
      try { recognition.start(); active = true; } catch(_) {}
    },
    stop() {
      if (!active) return;
      try { recognition.stop(); active = false; } catch(_) {}
    },
    isActive() { return active; },
    isSupported() { return true; },
  };
}
