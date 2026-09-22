// Milestones View
// Renders the 4 recovery phases and psychological milestone timeline cards.

import { storage } from '../services/storage.js';
import { MilestoneManager } from '../services/milestones.js';
import { t } from '../services/i18n.js';
import { formatMilestoneHours } from '../utils/formatters.js';
import { escapeHtml } from '../utils/dom.js';

export function renderMilestonesView() {
  const stats = storage.getOverallStats();
  const currentLang = storage.getLanguage();
  const phasesWithMilestones = MilestoneManager.getPhasesWithMilestones(currentLang);
  const currentHours = stats.overallMs / (1000 * 60 * 60);
  const isDe = currentLang === 'de';

  const milestonesList = document.getElementById('milestones-list');
  if (!milestonesList) return;
  milestonesList.innerHTML = '';

  phasesWithMilestones.forEach(phase => {
    const totalInPhase = phase.milestones.length;
    const unlockedInPhase = phase.milestones.filter(m => currentHours >= m.hours).length;
    const isPhaseCompleted = unlockedInPhase === totalInPhase && totalInPhase > 0;
    const isPhaseActive = unlockedInPhase > 0 && !isPhaseCompleted;

    const phaseCard = document.createElement('div');
    phaseCard.className = `milestone-phase-card ${isPhaseCompleted ? 'phase-completed' : (isPhaseActive ? 'phase-active' : 'phase-locked')}`;

    let statusLabel = '';
    if (isPhaseCompleted) {
      statusLabel = isDe ? '✓ Abgeschlossen' : '✓ Completed';
    } else if (isPhaseActive) {
      statusLabel = isDe ? `${unlockedInPhase} / ${totalInPhase} Aktiv` : `${unlockedInPhase} / ${totalInPhase} Active`;
    } else {
      statusLabel = isDe ? `0 / ${totalInPhase} Bereit` : `0 / ${totalInPhase} Queued`;
    }

    phaseCard.innerHTML = `
      <div class="milestone-phase-header">
        <div class="milestone-phase-badge">${phase.icon}</div>
        <div class="milestone-phase-details">
          <div class="milestone-phase-top">
            <h3 class="milestone-phase-title">${escapeHtml(phase.title)}</h3>
            <span class="milestone-phase-status-pill ${isPhaseCompleted ? 'pill-completed' : (isPhaseActive ? 'pill-active' : 'pill-locked')}">${statusLabel}</span>
          </div>
          <div class="milestone-phase-timeframe">${escapeHtml(phase.timeframe)}</div>
          <p class="milestone-phase-desc">${escapeHtml(phase.desc)}</p>
        </div>
      </div>
      <div class="milestone-phase-items"></div>
    `;

    const itemsContainer = phaseCard.querySelector('.milestone-phase-items');

    phase.milestones.forEach(m => {
      const isUnlocked = currentHours >= m.hours;
      const item = document.createElement('div');
      item.className = `milestone-item ${isUnlocked ? 'unlocked' : 'locked'}`;

      item.innerHTML = `
        <div class="milestone-icon-wrapper">
          ${isUnlocked ? m.badge : '🔒'}
        </div>
        <div class="milestone-content">
          <div class="milestone-top-row">
            <h4 class="milestone-item-title">${escapeHtml(m.title)}</h4>
            <span class="milestone-target-time">${formatMilestoneHours(m.hours, currentLang)}</span>
          </div>
          ${m.subtitle ? `<div class="milestone-subtitle-row">${escapeHtml(m.subtitle)}</div>` : ''}
          <p class="milestone-item-desc">${escapeHtml(m.desc)}</p>
          <div class="milestone-insight-box">
            <strong>${t('milestone_insight_label')}</strong> ${escapeHtml(m.insight)}
          </div>
        </div>
      `;

      itemsContainer.appendChild(item);
    });

    milestonesList.appendChild(phaseCard);
  });
}
