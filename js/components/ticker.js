// Live sobriety countdown ticker engine
// Computes and updates the master timer from the most recently quit app in real time.

import { storage } from '../services/storage.js';
import { MilestoneManager } from '../services/milestones.js';
import { t } from '../services/i18n.js';
import { formatStreak } from '../utils/formatters.js';
import { escapeHtml } from '../utils/dom.js';
import { getAppIconConfig } from '../config/app-icons.js';

let tickerInterval = null;

export function initTicker() {
  updateTicker();
  if (tickerInterval) clearInterval(tickerInterval);
  tickerInterval = setInterval(updateTicker, 1000);
}

export function stopTicker() {
  if (tickerInterval) {
    clearInterval(tickerInterval);
    tickerInterval = null;
  }
}

export function updateTicker() {
  const activeApps = storage.getActiveApps();
  const stats = storage.getOverallStats();

  const timerDays = document.getElementById('timer-days');
  const timerHours = document.getElementById('timer-hours');
  const timerMinutes = document.getElementById('timer-minutes');
  const timerSeconds = document.getElementById('timer-seconds');
  const overallAppBadge = document.getElementById('overall-app-badge');
  const overallLastAppNote = document.getElementById('overall-last-app-note');
  const heroMilestoneIcon = document.getElementById('hero-milestone-icon');
  const heroMilestoneName = document.getElementById('hero-milestone-name');
  const heroMilestonePercent = document.getElementById('hero-milestone-percent');
  const heroProgressFill = document.getElementById('hero-progress-fill');

  if (activeApps.length === 0) {
    if (timerDays) timerDays.textContent = '0';
    if (timerHours) timerHours.textContent = '0';
    if (timerMinutes) timerMinutes.textContent = '0';
    if (timerSeconds) timerSeconds.textContent = '0';
    if (overallAppBadge) {
      overallAppBadge.textContent = t('hero_badge_zero');
      overallAppBadge.style.backgroundColor = 'var(--bg-subtle)';
      overallAppBadge.style.color = 'var(--text-muted)';
    }
    if (overallLastAppNote) {
      overallLastAppNote.innerHTML = t('hero_note_empty');
    }
    return;
  }

  // Time calculations
  const ms = stats.overallMs;
  const totalSecs = Math.floor(ms / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;

  if (timerDays) timerDays.textContent = d.toString();
  if (timerHours) timerHours.textContent = h.toString().padStart(2, '0');
  if (timerMinutes) timerMinutes.textContent = m.toString().padStart(2, '0');
  if (timerSeconds) timerSeconds.textContent = s.toString().padStart(2, '0');

  // Overall App Badge
  if (overallAppBadge) {
    if (activeApps.length === 1) {
      overallAppBadge.textContent = activeApps[0].name;
      overallAppBadge.style.backgroundColor = 'var(--accent-soft)';
      overallAppBadge.style.color = 'var(--accent)';
    } else {
      overallAppBadge.textContent = t('hero_badge_count', { count: activeApps.length });
      overallAppBadge.style.backgroundColor = 'var(--accent-soft)';
      overallAppBadge.style.color = 'var(--accent)';
    }
  }

  // Overall Last App Note
  if (overallLastAppNote) {
    const sortedByQuit = [...activeApps].sort((a, b) => new Date(b.quitDate) - new Date(a.quitDate));
    const lastApp = sortedByQuit[0];
    if (lastApp) {
      const lastAppMs = Math.max(0, Date.now() - new Date(lastApp.quitDate).getTime());
      const timeStr = formatStreak(lastAppMs, t);
      const iconConfig = getAppIconConfig(lastApp.name);
      const iconInline = iconConfig ? `
        <img src="${iconConfig.src}" alt="" style="width: 14px; height: 14px; vertical-align: -2px; margin-right: 3px; display: inline-block; border-radius: 3px;">
      ` : '';

      overallLastAppNote.innerHTML = t('hero_note_calc', {
        app: `${iconInline}${escapeHtml(lastApp.name)}`,
        time: timeStr
      });
    }
  }

  // Next Milestone
  const milestoneProgress = MilestoneManager.getProgress(ms, storage.getLanguage());
  if (heroMilestoneName && heroMilestonePercent && heroProgressFill) {
    if (milestoneProgress.nextMilestone) {
      const nextM = milestoneProgress.nextMilestone;
      const hoursLeft = milestoneProgress.hoursRemaining;
      const icon = nextM.badge || '🌱';
      if (heroMilestoneIcon) heroMilestoneIcon.textContent = icon;
      heroMilestoneName.textContent = t('hero_milestone_next', {
        title: nextM.title,
        hours: hoursLeft
      });
      heroMilestonePercent.textContent = `${milestoneProgress.progressPercent}%`;
      heroProgressFill.style.width = `${milestoneProgress.progressPercent}%`;
    } else {
      if (heroMilestoneIcon) heroMilestoneIcon.textContent = '👑';
      heroMilestoneName.textContent = t('hero_milestones_all_done');
      heroMilestonePercent.textContent = '100%';
      heroProgressFill.style.width = '100%';
    }
  }

  // Quantified Benefits (Smoke Free metrics)
  const currency = storage.data.currency || '€';
  const metricHoursSaved = document.getElementById('metric-hours-saved');
  const metricMoneySaved = document.getElementById('metric-money-saved');
  const metricSwipesAvoided = document.getElementById('metric-swipes-avoided');
  const insightContainer = document.getElementById('insight-container');

  if (metricHoursSaved) metricHoursSaved.textContent = `${stats.totalHoursSaved}h`;
  if (metricMoneySaved) metricMoneySaved.textContent = `${currency}${stats.totalMoneySaved}`;
  if (metricSwipesAvoided) metricSwipesAvoided.textContent = stats.totalSwipesAvoided.toLocaleString(storage.getLanguage() === 'de' ? 'de-DE' : 'en-US');

  if (insightContainer) {
    const booksStr = t('insight_books', { count: stats.booksReadEquivalent });
    const workoutsStr = t('insight_workouts', { count: stats.workoutsEquivalent });
    insightContainer.innerHTML = t('insight_text', {
      books: booksStr,
      workouts: workoutsStr
    });
  }
}
