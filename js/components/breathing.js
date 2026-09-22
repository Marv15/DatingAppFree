// Interactive box breathing visualizer for Craving Shield (Urge SOS)
// 4-Phase cycle: Inhale (4s), Hold (4s), Exhale (4s), Rest (4s)

import { getBreathingPhases } from '../config/constants.js';
import { t } from '../services/i18n.js';

let breathingInterval = null;
let breathingActive = true;
let breathingPhaseIndex = 0;
let breathingSecondsLeft = 4;

export function startBreathing() {
  breathingActive = true;
  breathingPhaseIndex = 0;
  breathingSecondsLeft = 4;

  const btnToggle = document.getElementById('btn-toggle-breathing');
  if (btnToggle) {
    btnToggle.textContent = t('btn_pause_breathing');
  }

  updateBreathingUI();

  if (breathingInterval) clearInterval(breathingInterval);
  breathingInterval = setInterval(() => {
    if (!breathingActive) return;

    const phases = getBreathingPhases(t);
    breathingSecondsLeft--;
    if (breathingSecondsLeft <= 0) {
      breathingPhaseIndex = (breathingPhaseIndex + 1) % phases.length;
      breathingSecondsLeft = phases[breathingPhaseIndex].duration;
    }
    updateBreathingUI();
  }, 1000);
}

export function stopBreathing() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
}

export function toggleBreathing() {
  breathingActive = !breathingActive;
  const btnToggle = document.getElementById('btn-toggle-breathing');
  if (btnToggle) {
    btnToggle.textContent = breathingActive 
      ? t('btn_pause_breathing') 
      : t('btn_resume_breathing');
  }
}

export function updateBreathingUI() {
  const phases = getBreathingPhases(t);
  const current = phases[breathingPhaseIndex] || phases[0];

  const instruction = document.getElementById('breathing-instruction');
  const timer = document.getElementById('breathing-timer');
  const circle = document.getElementById('breathing-circle');

  if (instruction) instruction.textContent = current.label;
  if (timer) timer.textContent = `${breathingSecondsLeft}s`;
  if (circle) circle.className = `breathing-box ${current.class}`;
}
