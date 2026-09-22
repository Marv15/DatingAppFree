// Apps View and App Management Modals
// Handles app cards rendering, quick presets, swipe rate auto-calculation, and slip-up reset modal.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { formatStreak, formatDateShort } from '../utils/formatters.js';
import { escapeHtml, openModal, closeModal, sanitizeDecimalInput, parseDecimal, showToast } from '../utils/dom.js';
import { renderAppIconBadge, getAppIconConfig } from '../config/app-icons.js';
import { openAddStoryModal } from './stories.view.js';

let resettingAppId = null;
let userManuallyChangedRate = false;
let onAppChangeCallback = null;

export function setOnAppChangeCallback(cb) {
  onAppChangeCallback = cb;
}

function notifyAppChanged() {
  if (onAppChangeCallback) onAppChangeCallback();
}

export function createAppCardElement(app, showAllControls = true, onSwitchToStories = null) {
  const card = document.createElement('div');
  card.className = 'app-card';
  card.id = `card-${app.id}`;

  const now = Date.now();
  const appMs = Math.max(0, now - new Date(app.quitDate).getTime());
  const streakStr = formatStreak(appMs, t);
  const currency = storage.data.currency || '€';

  const motivationHtml = app.motivation ? `
    <div class="app-motivation-quote">
      <span class="app-motivation-label">${t('card_why_deleted', { app: escapeHtml(app.name) })}</span>
      "${escapeHtml(app.motivation)}"
    </div>
  ` : '';

  const appStories = storage.getStoriesForApp(app.id);
  const storyBadgeHtml = appStories.length > 0
    ? `<button type="button" class="app-action-btn app-action-link badge-btn" data-view-stories-app="${app.id}" title="${appStories.length} Reality Checks">📖 ${appStories.length}</button>`
    : '';

  const controlsHtml = showAllControls ? `
    <div class="app-card-footer">
      <div class="app-actions-primary">
        ${storyBadgeHtml}
        <button type="button" class="app-action-btn app-action-link primary" data-add-story-app="${app.id}">
          <span>✨</span> <span>+ Story</span>
        </button>
      </div>
      <div class="app-actions-secondary">
        <button type="button" class="app-action-btn app-action-link" data-edit-app="${app.id}" title="${t('card_btn_edit')}">
          <span>✏️</span> <span>${t('card_btn_edit')}</span>
        </button>
        <button type="button" class="app-action-btn app-action-link warning" data-reset-app="${app.id}" title="${t('card_btn_slip')}">
          <span>⚠️</span> <span>${t('card_btn_slip_short')}</span>
        </button>
        <button type="button" class="app-action-btn app-action-link danger" data-delete-app="${app.id}" title="${t('card_btn_delete')}">
          <span>🗑️</span> <span>${t('card_btn_delete')}</span>
        </button>
      </div>
    </div>
  ` : `
    <div class="app-card-footer dashboard-mode">
      <div class="app-actions-primary">
        ${storyBadgeHtml}
        <button type="button" class="app-action-btn app-action-link primary" data-add-story-app="${app.id}">
          <span>✨</span> <span>+ Story</span>
        </button>
      </div>
      <div class="app-actions-secondary">
        <button type="button" class="app-action-btn app-action-link warning" data-reset-app="${app.id}" title="${t('card_btn_slip')}">
          <span>⚠️</span> <span>${t('card_btn_slip_short')}</span>
        </button>
      </div>
    </div>
  `;

  const isFreeUser = Boolean(app.neverPaid || Number(app.monthlyCost) === 0);
  const costNum = Number(app.monthlyCost || 0);
  const costFormatted = (costNum % 1 === 0) ? costNum : costNum.toFixed(2);
  const savedRateStr = isFreeUser
    ? t('card_saved_rate_free', { min: app.dailyMinutes || 45 })
    : t('card_saved_rate', {
        min: app.dailyMinutes || 45,
        fee: `${currency}${costFormatted}`
      });

  const deletedDateStr = t('card_deleted_on', {
    date: formatDateShort(app.quitDate, storage.getLanguage())
  });

  card.innerHTML = `
    <div class="app-card-top">
      <div class="app-identity">
        ${renderAppIconBadge(app, 36)}
        <div>
          <div class="app-name">${escapeHtml(app.name)}</div>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${deletedDateStr}</span>
        </div>
      </div>
      <div class="app-streak-pill">${streakStr}</div>
    </div>

    ${motivationHtml}

    <div class="app-card-metrics-row">
      <span>💰 ${savedRateStr}</span>
      <span>⚡ ~${app.swipesPerDay || Math.round((app.dailyMinutes || 45) * (app.swipeMultiplier || 2.0))} ${t('card_metric_swipes_day')} (${(app.swipeMultiplier || 2.0).toFixed(1)}/min)</span>
    </div>

    ${controlsHtml}
  `;

  // Event listeners for card buttons
  const addStoryBtn = card.querySelector(`[data-add-story-app="${app.id}"]`);
  if (addStoryBtn) addStoryBtn.addEventListener('click', () => openAddStoryModal(app.id));

  const viewStoriesBtn = card.querySelector(`[data-view-stories-app="${app.id}"]`);
  if (viewStoriesBtn) {
    viewStoriesBtn.addEventListener('click', () => {
      if (onSwitchToStories) {
        onSwitchToStories(app.id);
      }
    });
  }

  const editBtn = card.querySelector(`[data-edit-app="${app.id}"]`);
  if (editBtn) editBtn.addEventListener('click', () => openEditAppModal(app.id));

  const resetBtn = card.querySelector(`[data-reset-app="${app.id}"]`);
  if (resetBtn) resetBtn.addEventListener('click', () => openResetModal(app.id));

  const deleteBtn = card.querySelector(`[data-delete-app="${app.id}"]`);
  if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteApp(app.id));

  return card;
}

export function renderAppsView(onSwitchToStories = null) {
  const fullAppsList = document.getElementById('full-apps-list');
  if (!fullAppsList) return;
  const apps = storage.getApps();
  fullAppsList.innerHTML = '';

  if (apps.length === 0) {
    fullAppsList.innerHTML = `
      <div class="app-card text-center" style="padding: 30px 16px;">
        <p style="color: var(--text-secondary); margin-bottom: 14px;">${t('apps_preview_empty')}</p>
        <button class="pill-btn primary" id="btn-empty-add-app-full">${t('btn_add_app')}</button>
      </div>
    `;
    const btn = document.getElementById('btn-empty-add-app-full');
    if (btn) btn.addEventListener('click', () => openAddAppModal());
    return;
  }

  apps.forEach(app => {
    const card = createAppCardElement(app, true, onSwitchToStories);
    fullAppsList.appendChild(card);
  });
}

function updateModalSwipesPreview() {
  const minsEl = document.getElementById('app-input-minutes');
  const rateEl = document.getElementById('app-input-rate');
  const swipesEl = document.getElementById('app-input-swipes');
  if (!minsEl || !rateEl || !swipesEl) return;
  const mins = parseDecimal(minsEl.value, 0);
  const rate = parseDecimal(rateEl.value, 0);
  const est = Math.round(mins * rate);
  swipesEl.value = est.toString();
}

export function openAddAppModal() {
  const modalApp = document.getElementById('modal-app');
  const title = document.getElementById('app-modal-title');
  const editId = document.getElementById('app-edit-id');
  const name = document.getElementById('app-input-name');
  const mins = document.getElementById('app-input-minutes');
  const cost = document.getElementById('app-input-cost');
  const neverPaid = document.getElementById('app-input-never-paid');
  const rate = document.getElementById('app-input-rate');
  const motivation = document.getElementById('app-input-motivation');
  const quitDate = document.getElementById('app-input-quitdate');

  if (title) title.textContent = t('app_modal_title_add');
  if (editId) editId.value = '';
  if (name) name.value = '';
  if (mins) mins.value = '45';
  if (cost) {
    cost.value = '25';
    cost.disabled = false;
    cost.style.opacity = '1';
  }
  if (neverPaid) neverPaid.checked = false;
  userManuallyChangedRate = false;
  if (rate) rate.value = (storage.DEFAULT_SWIPE_RATE || 2.0).toString();
  updateModalSwipesPreview();
  if (motivation) motivation.value = '';

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  if (quitDate) quitDate.value = now.toISOString().slice(0, 16);

  document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
  openModal(modalApp);
}

export function openEditAppModal(appId) {
  const app = storage.getApp(appId);
  if (!app) return;

  const modalApp = document.getElementById('modal-app');
  const title = document.getElementById('app-modal-title');
  const editId = document.getElementById('app-edit-id');
  const name = document.getElementById('app-input-name');
  const mins = document.getElementById('app-input-minutes');
  const cost = document.getElementById('app-input-cost');
  const neverPaid = document.getElementById('app-input-never-paid');
  const rate = document.getElementById('app-input-rate');
  const swipes = document.getElementById('app-input-swipes');
  const motivation = document.getElementById('app-input-motivation');
  const quitDate = document.getElementById('app-input-quitdate');

  const iconConfig = getAppIconConfig(app.name);
  const iconInline = iconConfig ? `
    <img src="${iconConfig.src}" alt="" style="width: 18px; height: 18px; vertical-align: -3px; margin-right: 6px; display: inline-block; border-radius: 4px;">
  ` : '';

  if (title) title.innerHTML = `${iconInline}${t('app_modal_title_edit', { name: escapeHtml(app.name) })}`;
  if (editId) editId.value = app.id;
  if (name) name.value = app.name;
  if (mins) mins.value = app.dailyMinutes || 45;

  const isNeverPaid = Boolean(app.neverPaid || Number(app.monthlyCost) === 0);
  if (neverPaid) neverPaid.checked = isNeverPaid;
  if (cost) {
    if (isNeverPaid) {
      cost.value = '0';
      cost.disabled = true;
      cost.style.opacity = '0.5';
    } else {
      cost.value = (app.monthlyCost !== undefined) ? String(app.monthlyCost) : '25';
      cost.disabled = false;
      cost.style.opacity = '1';
    }
  }

  userManuallyChangedRate = false;
  const currentRate = app.swipeMultiplier || storage.getSwipeMultiplierForApp(app.name) || 2.0;
  if (rate) rate.value = currentRate.toString();
  if (swipes) swipes.value = (app.swipesPerDay || Math.round((app.dailyMinutes || 45) * currentRate)).toString();
  if (motivation) motivation.value = app.motivation || '';

  if (quitDate) {
    const quitD = new Date(app.quitDate);
    quitD.setMinutes(quitD.getMinutes() - quitD.getTimezoneOffset());
    quitDate.value = quitD.toISOString().slice(0, 16);
  }

  openModal(modalApp);
}

export function saveAppFromModal() {
  const editId = document.getElementById('app-edit-id');
  const nameEl = document.getElementById('app-input-name');
  const quitdateEl = document.getElementById('app-input-quitdate');
  const minsEl = document.getElementById('app-input-minutes');
  const neverPaidEl = document.getElementById('app-input-never-paid');
  const costEl = document.getElementById('app-input-cost');
  const rateEl = document.getElementById('app-input-rate');
  const motivationEl = document.getElementById('app-input-motivation');
  const modalApp = document.getElementById('modal-app');

  const id = editId.value || `app-${Date.now()}`;
  const name = nameEl.value.trim();
  const quitDateValue = quitdateEl.value;
  const dailyMinutes = parseDecimal(minsEl.value, 45);
  const neverPaid = neverPaidEl ? neverPaidEl.checked : false;
  const monthlyCost = neverPaid ? 0 : parseDecimal(costEl.value, 0);
  const motivation = motivationEl.value.trim();
  const swipeMultiplier = (rateEl && parseDecimal(rateEl.value, 0) > 0)
    ? parseDecimal(rateEl.value, 0)
    : storage.getSwipeMultiplierForApp(name);
  const swipesPerDay = Math.round(dailyMinutes * swipeMultiplier);

  if (!name || !quitDateValue) {
    showToast(t('alert_app_missing_fields'), 'warning');
    return;
  }

  const quitDate = new Date(quitDateValue).toISOString();

  let color = '#CC785C';
  const lower = name.toLowerCase();
  if (lower.includes('tinder')) color = '#FD3A73';
  else if (lower.includes('bumble')) color = '#F4B400';
  else if (lower.includes('hinge')) color = '#60221E';
  else if (lower.includes('badoo')) color = '#783BF9';
  else if (lower.includes('grindr')) color = '#FFC700';

  storage.saveApp({
    id,
    name,
    color,
    quitDate,
    dailyMinutes,
    monthlyCost,
    neverPaid,
    swipeMultiplier,
    swipesPerDay,
    motivation
  });

  closeModal(modalApp);
  notifyAppChanged();
}

export function openResetModal(appId) {
  const app = storage.getApp(appId);
  if (!app) return;

  resettingAppId = appId;
  const modalReset = document.getElementById('modal-reset');
  const resetExpl = document.getElementById('reset-modal-explanation');
  const reasonInput = document.getElementById('reset-reason-input');

  const iconConfig = getAppIconConfig(app.name);
  const iconInline = iconConfig ? `
    <img src="${iconConfig.src}" alt="" style="width: 16px; height: 16px; vertical-align: -2px; margin-right: 4px; display: inline-block; border-radius: 3px;">
  ` : '';

  if (resetExpl) {
    resetExpl.innerHTML = t('reset_modal_desc', { name: `${iconInline}${escapeHtml(app.name)}` });
  }
  if (reasonInput) reasonInput.value = '';
  openModal(modalReset);
}

export function confirmDeleteApp(appId) {
  const app = storage.getApp(appId);
  if (!app) return;

  if (confirm(t('confirm_delete_app', { name: app.name }))) {
    storage.deleteApp(appId);
    notifyAppChanged();
  }
}

export function setupAppsEvents() {
  const btnAddApp = document.getElementById('btn-add-app');
  if (btnAddApp) btnAddApp.addEventListener('click', openAddAppModal);

  const presetChips = document.querySelectorAll('.preset-chip');
  const nameEl = document.getElementById('app-input-name');
  const minsEl = document.getElementById('app-input-minutes');
  const costEl = document.getElementById('app-input-cost');
  const neverPaidEl = document.getElementById('app-input-never-paid');
  const rateEl = document.getElementById('app-input-rate');

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const preset = chip.dataset.preset;
      if (preset !== 'Other') {
        if (nameEl) nameEl.value = preset;
      } else {
        if (nameEl) {
          nameEl.value = '';
          nameEl.focus();
        }
      }

      if (chip.dataset.min && minsEl) minsEl.value = chip.dataset.min;
      if (chip.dataset.cost && costEl) {
        if (neverPaidEl && neverPaidEl.checked) {
          costEl.value = '0';
        } else {
          costEl.value = chip.dataset.cost;
        }
      }
      if (chip.dataset.rate && rateEl) {
        rateEl.value = chip.dataset.rate;
        userManuallyChangedRate = false;
      }
      updateModalSwipesPreview();
    });
  });

  if (nameEl) {
    nameEl.addEventListener('input', (e) => {
      if (!userManuallyChangedRate && rateEl) {
        const val = e.target.value.trim();
        const rateVal = storage.getSwipeMultiplierForApp(val);
        rateEl.value = rateVal.toString();
        updateModalSwipesPreview();
      }
    });
  }

  if (minsEl) {
    minsEl.addEventListener('input', updateModalSwipesPreview);
  }

  sanitizeDecimalInput(costEl);
  sanitizeDecimalInput(rateEl, () => {
    userManuallyChangedRate = true;
    updateModalSwipesPreview();
  });

  if (neverPaidEl) {
    neverPaidEl.addEventListener('change', (e) => {
      if (e.target.checked && costEl) {
        costEl.value = '0';
        costEl.disabled = true;
        costEl.style.opacity = '0.5';
      } else if (costEl) {
        costEl.disabled = false;
        costEl.style.opacity = '1';
        if (parseDecimal(costEl.value, 0) === 0) {
          costEl.value = '25';
        }
      }
    });
  }

  const formApp = document.getElementById('form-app-edit');
  if (formApp) {
    formApp.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAppFromModal();
    });
  }

  const btnConfirmReset = document.getElementById('btn-confirm-reset');
  const reasonInput = document.getElementById('reset-reason-input');
  const modalReset = document.getElementById('modal-reset');

  if (btnConfirmReset) {
    btnConfirmReset.addEventListener('click', () => {
      if (!resettingAppId) return;
      const reason = (reasonInput && reasonInput.value.trim()) || 'Slip-up / re-downloaded';
      storage.resetApp(resettingAppId, reason);
      closeModal(modalReset);
      notifyAppChanged();
    });
  }
}
