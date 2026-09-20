// Main Application Logic for Dating App Free PWA
// Connects UI, storage, milestones, live countdown ticker, Urge SOS, and offline updates.

(function () {
  'use strict';

  // State
  let currentTab = 'dashboard';
  let tickerInterval = null;
  let breathingInterval = null;
  let breathingActive = true;
  let breathingPhaseIndex = 0;
  let breathingSecondsLeft = 4;
  let resettingAppId = null;
  let serviceWorkerRegistration = null;

  // Box Breathing phases (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s)
  const BREATHING_PHASES = [
    { name: 'Inhale Slowly', class: 'inhale', duration: 4, label: 'Breathe In' },
    { name: 'Hold Gently', class: 'hold', duration: 4, label: 'Hold Breath' },
    { name: 'Exhale Fully', class: 'exhale', duration: 4, label: 'Release' },
    { name: 'Rest in Silence', class: 'hold', duration: 4, label: 'Rest & Be' }
  ];

  // DOM Elements
  const els = {
    // Views
    viewDashboard: document.getElementById('view-dashboard'),
    viewApps: document.getElementById('view-apps'),
    viewMilestones: document.getElementById('view-milestones'),
    viewJournal: document.getElementById('view-journal'),
    navTabs: document.querySelectorAll('.nav-tab'),

    // Header & Theme
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    themeIcon: document.getElementById('theme-icon'),
    btnOpenSettings: document.getElementById('btn-open-settings'),
    themeColorMeta: document.getElementById('theme-color-meta'),

    // Update Banner
    updateBanner: document.getElementById('update-banner'),
    updateRefreshBtn: document.getElementById('update-refresh-btn'),

    // Hero Timer
    timerDays: document.getElementById('timer-days'),
    timerHours: document.getElementById('timer-hours'),
    timerMinutes: document.getElementById('timer-minutes'),
    timerSeconds: document.getElementById('timer-seconds'),
    overallAppBadge: document.getElementById('overall-app-badge'),
    overallLastAppNote: document.getElementById('overall-last-app-note'),

    // Hero Milestone
    heroMilestoneIcon: document.getElementById('hero-milestone-icon'),
    heroMilestoneName: document.getElementById('hero-milestone-name'),
    heroMilestonePercent: document.getElementById('hero-milestone-percent'),
    heroProgressFill: document.getElementById('hero-progress-fill'),

    // SOS Trigger
    btnOpenSos: document.getElementById('btn-open-sos'),

    // Metrics
    metricHoursSaved: document.getElementById('metric-hours-saved'),
    metricMoneySaved: document.getElementById('metric-money-saved'),
    metricSwipesAvoided: document.getElementById('metric-swipes-avoided'),
    insightBooks: document.getElementById('insight-books'),
    insightWorkouts: document.getElementById('insight-workouts'),

    // App Previews
    dashboardAppsPreview: document.getElementById('dashboard-apps-preview'),
    fullAppsList: document.getElementById('full-apps-list'),
    btnGotoApps: document.getElementById('btn-goto-apps'),
    btnAddApp: document.getElementById('btn-add-app'),

    // Milestones
    milestonesList: document.getElementById('milestones-list'),

    // Journal
    moodPills: document.querySelectorAll('.mood-pill'),
    checkinNote: document.getElementById('checkin-note'),
    btnSaveCheckin: document.getElementById('btn-save-checkin'),
    checkinHistoryList: document.getElementById('checkin-history-list'),

    // Modals
    modalSos: document.getElementById('modal-sos'),
    sosAppSelect: document.getElementById('sos-app-select'),
    sosAppLabel: document.getElementById('sos-app-label'),
    sosMotivationText: document.getElementById('sos-motivation-text'),
    breathingCircle: document.getElementById('breathing-circle'),
    breathingInstruction: document.getElementById('breathing-instruction'),
    breathingTimer: document.getElementById('breathing-timer'),
    btnToggleBreathing: document.getElementById('btn-toggle-breathing'),

    modalApp: document.getElementById('modal-app'),
    appModalTitle: document.getElementById('app-modal-title'),
    formAppEdit: document.getElementById('form-app-edit'),
    appEditId: document.getElementById('app-edit-id'),
    appInputName: document.getElementById('app-input-name'),
    appInputQuitdate: document.getElementById('app-input-quitdate'),
    appInputMinutes: document.getElementById('app-input-minutes'),
    appInputCost: document.getElementById('app-input-cost'),
    appInputMotivation: document.getElementById('app-input-motivation'),
    presetChips: document.querySelectorAll('.preset-chip'),

    modalReset: document.getElementById('modal-reset'),
    resetAppName: document.getElementById('reset-app-name'),
    resetReasonInput: document.getElementById('reset-reason-input'),
    btnConfirmReset: document.getElementById('btn-confirm-reset'),

    modalSettings: document.getElementById('modal-settings'),
    settingsThemeSelect: document.getElementById('settings-theme-select'),
    settingsCurrencySelect: document.getElementById('settings-currency-select'),
    updateStatusText: document.getElementById('update-status-text'),
    btnCheckUpdates: document.getElementById('btn-check-updates'),
    btnExportBackup: document.getElementById('btn-export-backup'),
    btnCopyBackup: document.getElementById('btn-copy-backup'),
    fileImportBackup: document.getElementById('file-import-backup'),
    btnShowIosGuide: document.getElementById('btn-show-ios-guide'),
    modalIosGuide: document.getElementById('modal-ios-guide'),

    // Phone Connect & QR
    btnPhoneConnect: document.getElementById('btn-phone-connect'),
    modalPhoneConnect: document.getElementById('modal-phone-connect'),
    phoneQrContainer: document.getElementById('phone-qr-container'),
    phoneUrlDisplay: document.getElementById('phone-url-display'),
    btnCopyPhoneUrl: document.getElementById('btn-copy-phone-url')
  };

  // --- INITIALIZATION ---
  function init() {
    applyTheme(window.storage.data.theme || 'claude-light');
    setupNavigation();
    setupModals();
    setupTicker();
    setupJournal();
    setupAppSettings();
    setupUrgeSos();
    setupPhoneConnect();
    setupServiceWorker();
    renderAll();
  }

  // --- THEME CONFIGURATION ---
  const THEMES_CONFIG = {
    'claude-light': { icon: '☀️', color: '#FAF8F5', name: 'Claude Light' },
    'claude-dark': { icon: '🌙', color: '#1A1917', name: 'Claude Dark' },
    'gemini': { icon: '✨', color: '#0F0F11', name: 'Google Gemini' },
    'chatgpt': { icon: '🟢', color: '#212121', name: 'ChatGPT' },
    'github': { icon: '🐙', color: '#0D1117', name: 'GitHub' },
    'steam': { icon: '🎮', color: '#171A21', name: 'Steam' }
  };
  const THEME_KEYS = Object.keys(THEMES_CONFIG);

  // --- THEME MANAGEMENT ---
  function applyTheme(theme) {
    if (!THEMES_CONFIG[theme]) theme = 'claude-light';
    document.documentElement.setAttribute('data-theme', theme);
    window.storage.setTheme(theme);

    const config = THEMES_CONFIG[theme];
    if (els.themeIcon) {
      els.themeIcon.textContent = config.icon;
    }
    if (els.btnThemeToggle) {
      els.btnThemeToggle.title = `Theme: ${config.name} (Click to switch)`;
    }
    if (els.settingsThemeSelect) {
      els.settingsThemeSelect.value = theme;
    }
    if (els.themeColorMeta) {
      els.themeColorMeta.setAttribute('content', config.color);
    }
  }

  // --- NAVIGATION TABS ---
  function setupNavigation() {
    els.navTabs.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const tab = tabBtn.dataset.tab;
        switchTab(tab);
      });
    });

    if (els.btnGotoApps) {
      els.btnGotoApps.addEventListener('click', () => switchTab('apps'));
    }

    if (els.btnThemeToggle) {
      els.btnThemeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'claude-light';
        const currentIndex = THEME_KEYS.indexOf(current);
        const nextIndex = (currentIndex + 1) % THEME_KEYS.length;
        const next = THEME_KEYS[nextIndex];
        applyTheme(next);
      });
    }

    if (els.btnOpenSettings) {
      els.btnOpenSettings.addEventListener('click', () => openModal(els.modalSettings));
    }
  }

  function switchTab(tab) {
    currentTab = tab;
    els.navTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

    els.viewDashboard.classList.toggle('hidden', tab !== 'dashboard');
    els.viewApps.classList.toggle('hidden', tab !== 'apps');
    els.viewMilestones.classList.toggle('hidden', tab !== 'milestones');
    els.viewJournal.classList.toggle('hidden', tab !== 'journal');

    if (tab === 'apps') renderAppsView();
    if (tab === 'milestones') renderMilestonesView();
    if (tab === 'journal') renderJournalView();
    if (tab === 'dashboard') renderDashboard();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- MODAL UTILITIES ---
  function setupModals() {
    // Backdrop click or close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.close;
        const modal = document.getElementById(targetId);
        if (modal) closeModal(modal);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    if (els.btnShowIosGuide) {
      els.btnShowIosGuide.addEventListener('click', () => {
        closeModal(els.modalSettings);
        openModal(els.modalIosGuide);
      });
    }
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- LIVE TICKER & METRICS ---
  function setupTicker() {
    updateTicker();
    if (tickerInterval) clearInterval(tickerInterval);
    tickerInterval = setInterval(updateTicker, 1000);
  }

  function updateTicker() {
    const activeApps = window.storage.getActiveApps();
    const stats = window.storage.getOverallStats();
    const overallQuitDate = stats.overallQuitDate;
    const now = Date.now();
    const diffMs = Math.max(0, now - new Date(overallQuitDate).getTime());

    // Calculate Days, Hours, Minutes, Seconds
    const totalSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    els.timerDays.textContent = days;
    els.timerHours.textContent = hours;
    els.timerMinutes.textContent = minutes;
    els.timerSeconds.textContent = seconds;

    // Find the most recently quit app (the last app that was used)
    let lastUsedApp = null;
    let maxTimestamp = 0;
    activeApps.forEach(app => {
      const t = new Date(app.quitDate).getTime();
      if (t >= maxTimestamp) {
        maxTimestamp = t;
        lastUsedApp = app;
      }
    });

    if (lastUsedApp) {
      const lastAppTimeAgo = formatShortTime(now - new Date(lastUsedApp.quitDate).getTime());
      els.overallLastAppNote.innerHTML = `Calculated from your last used app: <strong>${escapeHtml(lastUsedApp.name)}</strong> (${lastAppTimeAgo} free)`;
      els.overallAppBadge.textContent = `${activeApps.length} Apps Free`;
    } else {
      els.overallLastAppNote.innerHTML = `No apps tracked yet. Tap <strong>+ Add App</strong> to begin.`;
      els.overallAppBadge.textContent = `0 Apps`;
    }

    // Next Milestone Progress
    const milestoneProgress = window.MilestoneManager.getProgress(diffMs);
    if (milestoneProgress.nextMilestone) {
      els.heroMilestoneIcon.textContent = milestoneProgress.nextMilestone.badge;
      els.heroMilestoneName.textContent = `Next: ${milestoneProgress.nextMilestone.title} (${milestoneProgress.hoursRemaining}h left)`;
      els.heroMilestonePercent.textContent = `${milestoneProgress.progressPercent}%`;
      els.heroProgressFill.style.width = `${milestoneProgress.progressPercent}%`;
    } else {
      els.heroMilestoneIcon.textContent = '👑';
      els.heroMilestoneName.textContent = 'All Master Milestones Unlocked!';
      els.heroMilestonePercent.textContent = '100%';
      els.heroProgressFill.style.width = '100%';
    }

    // Quantified Benefits (Smoke Free metrics)
    const currency = window.storage.data.currency || '€';
    els.metricHoursSaved.textContent = `${stats.totalHoursSaved}h`;
    els.metricMoneySaved.textContent = `${currency}${stats.totalMoneySaved}`;
    els.metricSwipesAvoided.textContent = stats.totalSwipesAvoided.toLocaleString();

    els.insightBooks.textContent = `${stats.booksReadEquivalent} books`;
    els.insightWorkouts.textContent = `${stats.workoutsEquivalent} workouts`;
  }

  // --- RENDER VIEWS ---
  function renderAll() {
    renderDashboard();
    renderAppsView();
    renderMilestonesView();
    renderJournalView();
    updateTicker();
  }

  function renderDashboard() {
    const apps = window.storage.getActiveApps();
    els.dashboardAppsPreview.innerHTML = '';

    if (apps.length === 0) {
      els.dashboardAppsPreview.innerHTML = `
        <div class="app-card text-center" style="padding: 24px 16px;">
          <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.9rem;">No dating apps tracked yet.</p>
          <button class="pill-btn primary" id="btn-empty-add-app">+ Add Your First App</button>
        </div>
      `;
      const btn = document.getElementById('btn-empty-add-app');
      if (btn) btn.addEventListener('click', () => openAddAppModal());
      return;
    }

    // Show up to 3 apps on dashboard
    apps.slice(0, 3).forEach(app => {
      const card = createAppCardElement(app, false);
      els.dashboardAppsPreview.appendChild(card);
    });
  }

  function renderAppsView() {
    const apps = window.storage.getApps();
    els.fullAppsList.innerHTML = '';

    if (apps.length === 0) {
      els.fullAppsList.innerHTML = `
        <div class="app-card text-center" style="padding: 30px 16px;">
          <p style="color: var(--text-secondary); margin-bottom: 14px;">No apps tracked yet.</p>
          <button class="pill-btn primary" id="btn-empty-add-app-full">+ Add Tracked App</button>
        </div>
      `;
      const btn = document.getElementById('btn-empty-add-app-full');
      if (btn) btn.addEventListener('click', () => openAddAppModal());
      return;
    }

    apps.forEach(app => {
      const card = createAppCardElement(app, true);
      els.fullAppsList.appendChild(card);
    });
  }

  function createAppCardElement(app, showAllControls = true) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.id = `card-${app.id}`;

    const now = Date.now();
    const appMs = Math.max(0, now - new Date(app.quitDate).getTime());
    const streakStr = formatStreak(appMs);
    const currency = window.storage.data.currency || '€';

    const motivationHtml = app.motivation ? `
      <div class="app-motivation-quote">
        <span class="app-motivation-label">Why you deleted ${escapeHtml(app.name)}</span>
        "${escapeHtml(app.motivation)}"
      </div>
    ` : '';

    const controlsHtml = showAllControls ? `
      <div class="app-actions">
        <button class="app-action-link" data-edit-app="${app.id}">Edit</button>
        <button class="app-action-link" data-reset-app="${app.id}">Slip-up / Reset</button>
        <button class="app-action-link danger" data-delete-app="${app.id}">Delete</button>
      </div>
    ` : `
      <div class="app-actions">
        <button class="app-action-link" data-reset-app="${app.id}">Slip-up</button>
      </div>
    `;

    card.innerHTML = `
      <div class="app-card-top">
        <div class="app-identity">
          <div class="app-icon-badge" style="background-color: ${app.color || 'var(--accent)'};">
            ${escapeHtml(app.name.charAt(0).toUpperCase())}
          </div>
          <div>
            <div class="app-name">${escapeHtml(app.name)}</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Deleted ${formatDateShort(app.quitDate)}</span>
          </div>
        </div>
        <div class="app-streak-pill">${streakStr}</div>
      </div>

      ${motivationHtml}

      <div class="app-card-metrics">
        <span>Saved: ~${app.dailyMinutes || 45}m/day · ${currency}${app.monthlyCost || 0}/mo</span>
        ${controlsHtml}
      </div>
    `;

    // Event listeners for card buttons
    const editBtn = card.querySelector(`[data-edit-app="${app.id}"]`);
    if (editBtn) editBtn.addEventListener('click', () => openEditAppModal(app.id));

    const resetBtn = card.querySelector(`[data-reset-app="${app.id}"]`);
    if (resetBtn) resetBtn.addEventListener('click', () => openResetModal(app.id));

    const deleteBtn = card.querySelector(`[data-delete-app="${app.id}"]`);
    if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteApp(app.id));

    return card;
  }

  function renderMilestonesView() {
    const stats = window.storage.getOverallStats();
    const milestones = window.MilestoneManager.getAll();
    const currentHours = stats.overallMs / (1000 * 60 * 60);

    els.milestonesList.innerHTML = '';

    milestones.forEach(m => {
      const isUnlocked = currentHours >= m.hours;
      const item = document.createElement('div');
      item.className = `milestone-item ${isUnlocked ? 'unlocked' : 'locked'}`;

      item.innerHTML = `
        <div class="milestone-icon-wrapper">
          ${isUnlocked ? m.badge : '🔒'}
        </div>
        <div class="milestone-content">
          <div class="milestone-top-row">
            <h4 class="milestone-item-title">${m.title}</h4>
            <span class="milestone-target-time">${formatMilestoneHours(m.hours)}</span>
          </div>
          <p class="milestone-item-desc">${m.desc}</p>
          <div class="milestone-insight-box">
            <strong>Insight:</strong> ${m.insight}
          </div>
        </div>
      `;

      els.milestonesList.appendChild(item);
    });
  }

  function renderJournalView() {
    const entries = window.storage.getCheckIns();
    els.checkinHistoryList.innerHTML = '';

    if (entries.length === 0) {
      els.checkinHistoryList.innerHTML = `
        <div class="checkin-entry-card text-center" style="padding: 24px 16px;">
          <p style="color: var(--text-muted); font-size: 0.85rem;">No reflections logged yet. Record your first check-in above!</p>
        </div>
      `;
      return;
    }

    entries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'checkin-entry-card';

      const dateStr = formatDateTime(entry.timestamp);

      card.innerHTML = `
        <div class="checkin-entry-header">
          <div class="checkin-mood-tag">
            <span>${entry.emoji || '🌿'}</span>
            <span>${escapeHtml(entry.moodLabel || 'Peaceful')}</span>
          </div>
          <span class="checkin-date">${dateStr}</span>
        </div>
        ${entry.note ? `<p class="checkin-note-text">${escapeHtml(entry.note)}</p>` : ''}
      `;

      els.checkinHistoryList.appendChild(card);
    });
  }

  // --- APP MANAGEMENT MODAL ---
  function setupAppSettings() {
    if (els.btnAddApp) {
      els.btnAddApp.addEventListener('click', () => openAddAppModal());
    }

    // Presets click
    els.presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        els.presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const preset = chip.dataset.preset;
        if (preset !== 'Other') {
          els.appInputName.value = preset;
        } else {
          els.appInputName.value = '';
          els.appInputName.focus();
        }

        if (chip.dataset.min) els.appInputMinutes.value = chip.dataset.min;
        if (chip.dataset.cost) els.appInputCost.value = chip.dataset.cost;
      });
    });

    // Form submit
    if (els.formAppEdit) {
      els.formAppEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAppFromModal();
      });
    }

    // Reset streak submit
    if (els.btnConfirmReset) {
      els.btnConfirmReset.addEventListener('click', () => {
        if (!resettingAppId) return;
        const reason = els.resetReasonInput.value.trim() || 'Slip-up / re-downloaded';
        window.storage.resetApp(resettingAppId, reason);
        closeModal(els.modalReset);
        renderAll();
      });
    }

    // Settings modal inputs
    if (els.settingsThemeSelect) {
      els.settingsThemeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
      });
    }

    if (els.settingsCurrencySelect) {
      els.settingsCurrencySelect.value = window.storage.data.currency || '€';
      els.settingsCurrencySelect.addEventListener('change', (e) => {
        window.storage.setCurrency(e.target.value);
        renderAll();
      });
    }

    // Export Backup
    if (els.btnExportBackup) {
      els.btnExportBackup.addEventListener('click', () => {
        const jsonStr = window.storage.exportDataAsJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const nowStr = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `dating-free-backup-${nowStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    // Copy Backup
    if (els.btnCopyBackup) {
      els.btnCopyBackup.addEventListener('click', async () => {
        try {
          const jsonStr = window.storage.exportDataAsJSON();
          await navigator.clipboard.writeText(jsonStr);
          alert('Backup data copied to clipboard! Keep it safe.');
        } catch (err) {
          alert('Could not copy to clipboard automatically.');
        }
      });
    }

    // Import Backup
    if (els.fileImportBackup) {
      els.fileImportBackup.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const result = window.storage.importDataFromJSON(content);
          if (result.success) {
            alert(`Backup restored successfully! (${result.count} apps loaded)`);
            closeModal(els.modalSettings);
            renderAll();
          } else {
            alert(`Failed to restore backup: ${result.error}`);
          }
        };
        reader.readAsText(file);
      });
    }

    // Check updates manually in settings
    if (els.btnCheckUpdates) {
      els.btnCheckUpdates.addEventListener('click', async () => {
        if (!serviceWorkerRegistration) {
          els.updateStatusText.textContent = 'Offline ready. Checked just now.';
          return;
        }
        els.updateStatusText.textContent = 'Checking server...';
        try {
          await serviceWorkerRegistration.update();
          setTimeout(() => {
            els.updateStatusText.textContent = 'App is up to date.';
          }, 800);
        } catch (e) {
          els.updateStatusText.textContent = 'Checked just now.';
        }
      });
    }
  }

  function openAddAppModal() {
    els.appModalTitle.textContent = 'Add Tracked App';
    els.appEditId.value = '';
    els.appInputName.value = '';
    els.appInputMinutes.value = '45';
    els.appInputCost.value = '25';
    els.appInputMotivation.value = '';

    // Set default quit date to right now formatted for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    els.appInputQuitdate.value = now.toISOString().slice(0, 16);

    els.presetChips.forEach(c => c.classList.remove('active'));
    openModal(els.modalApp);
  }

  function openEditAppModal(appId) {
    const app = window.storage.getApp(appId);
    if (!app) return;

    els.appModalTitle.textContent = `Edit ${app.name}`;
    els.appEditId.value = app.id;
    els.appInputName.value = app.name;
    els.appInputMinutes.value = app.dailyMinutes || 45;
    els.appInputCost.value = app.monthlyCost || 0;
    els.appInputMotivation.value = app.motivation || '';

    // Format app quit date for datetime-local
    const quitD = new Date(app.quitDate);
    quitD.setMinutes(quitD.getMinutes() - quitD.getTimezoneOffset());
    els.appInputQuitdate.value = quitD.toISOString().slice(0, 16);

    openModal(els.modalApp);
  }

  function saveAppFromModal() {
    const id = els.appEditId.value || `app-${Date.now()}`;
    const name = els.appInputName.value.trim();
    const quitDateValue = els.appInputQuitdate.value;
    const dailyMinutes = parseFloat(els.appInputMinutes.value) || 45;
    const monthlyCost = parseFloat(els.appInputCost.value) || 0;
    const motivation = els.appInputMotivation.value.trim();

    if (!name || !quitDateValue) {
      alert('Please provide an app name and quit date.');
      return;
    }

    const quitDate = new Date(quitDateValue).toISOString();

    // Determine color
    let color = '#CC785C';
    const lower = name.toLowerCase();
    if (lower.includes('tinder')) color = '#FD3A73';
    else if (lower.includes('bumble')) color = '#F4B400';
    else if (lower.includes('hinge')) color = '#60221E';
    else if (lower.includes('badoo')) color = '#783BF9';
    else if (lower.includes('grindr')) color = '#FFC700';

    window.storage.saveApp({
      id,
      name,
      color,
      quitDate,
      dailyMinutes,
      monthlyCost,
      motivation
    });

    closeModal(els.modalApp);
    renderAll();
  }

  function openResetModal(appId) {
    const app = window.storage.getApp(appId);
    if (!app) return;

    resettingAppId = appId;
    els.resetAppName.textContent = app.name;
    els.resetReasonInput.value = '';
    openModal(els.modalReset);
  }

  function confirmDeleteApp(appId) {
    const app = window.storage.getApp(appId);
    if (!app) return;

    if (confirm(`Remove "${app.name}" from your tracked apps? Your streak data for this app will be deleted.`)) {
      window.storage.deleteApp(appId);
      renderAll();
    }
  }

  // --- URGE SOS / CRAVING SHIELD ---
  function setupUrgeSos() {
    if (els.btnOpenSos) {
      els.btnOpenSos.addEventListener('click', () => {
        populateSosApps();
        startBreathing();
        openModal(els.modalSos);
      });
    }

    if (els.sosAppSelect) {
      els.sosAppSelect.addEventListener('change', () => {
        updateSosMotivation();
      });
    }

    if (els.btnToggleBreathing) {
      els.btnToggleBreathing.addEventListener('click', () => {
        breathingActive = !breathingActive;
        els.btnToggleBreathing.textContent = breathingActive ? '⏸ Pause Breathing' : '▶ Resume Breathing';
      });
    }
  }

  function populateSosApps() {
    const apps = window.storage.getActiveApps();
    els.sosAppSelect.innerHTML = '';

    if (apps.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'All Apps';
      els.sosAppSelect.appendChild(opt);
    } else {
      apps.forEach(app => {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.textContent = app.name;
        els.sosAppSelect.appendChild(opt);
      });
    }

    updateSosMotivation();
  }

  function updateSosMotivation() {
    const selectedId = els.sosAppSelect.value;
    const app = window.storage.getApp(selectedId);

    if (app && app.motivation) {
      els.sosAppLabel.textContent = `Why you deleted ${app.name}:`;
      els.sosMotivationText.textContent = `"${app.motivation}"`;
    } else {
      els.sosAppLabel.textContent = `Why you chose freedom:`;
      els.sosMotivationText.textContent = `"Remember: Swiping is an algorithmic slot machine designed to keep you single and addicted to cheap dopamine. Real life is waiting outside."`;
    }
  }

  function startBreathing() {
    breathingActive = true;
    breathingPhaseIndex = 0;
    breathingSecondsLeft = 4;
    els.btnToggleBreathing.textContent = '⏸ Pause Breathing';
    updateBreathingUI();

    if (breathingInterval) clearInterval(breathingInterval);
    breathingInterval = setInterval(() => {
      if (!breathingActive) return;

      breathingSecondsLeft--;
      if (breathingSecondsLeft <= 0) {
        breathingPhaseIndex = (breathingPhaseIndex + 1) % BREATHING_PHASES.length;
        breathingSecondsLeft = BREATHING_PHASES[breathingPhaseIndex].duration;
      }
      updateBreathingUI();
    }, 1000);
  }

  function updateBreathingUI() {
    const current = BREATHING_PHASES[breathingPhaseIndex];
    els.breathingInstruction.textContent = current.label;
    els.breathingTimer.textContent = `${breathingSecondsLeft}s`;

    els.breathingCircle.className = `breathing-box ${current.class}`;
  }

  // --- JOURNAL / DAILY CHECK-IN ---
  function setupJournal() {
    let selectedMood = 'peaceful';
    let selectedEmoji = '🌿';
    let selectedLabel = 'Peaceful';

    els.moodPills.forEach(pill => {
      pill.addEventListener('click', () => {
        els.moodPills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedMood = pill.dataset.mood;
        selectedEmoji = pill.dataset.emoji;
        selectedLabel = pill.dataset.label;
      });
    });

    if (els.btnSaveCheckin) {
      els.btnSaveCheckin.addEventListener('click', () => {
        const note = els.checkinNote.value.trim();
        window.storage.addCheckIn({
          mood: selectedMood,
          emoji: selectedEmoji,
          moodLabel: selectedLabel,
          note
        });

        els.checkinNote.value = '';
        renderJournalView();
        alert('Reflection saved!');
      });
    }
  }

  // --- PHONE CONNECT & QR CODE GENERATOR ---
  async function setupPhoneConnect() {
    if (!els.btnPhoneConnect) return;

    let targetUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 8080}`;

    async function fetchNetworkUrl() {
      try {
        const res = await fetch('/api/info');
        if (res.ok) {
          const info = await res.json();
          if (info.phoneUrl) {
            targetUrl = info.phoneUrl;
          }
        }
      } catch (e) {
        // Fallback to current location
      }
      return targetUrl;
    }

    // Prefetch on load
    fetchNetworkUrl();

    els.btnPhoneConnect.addEventListener('click', async () => {
      openModal(els.modalPhoneConnect);
      const url = await fetchNetworkUrl();

      if (els.phoneUrlDisplay) {
        els.phoneUrlDisplay.value = url;
      }

      // Generate official ISO-compliant QR Code on Canvas with proper quiet-zone
      if (window.QRCode && els.phoneQrContainer) {
        els.phoneQrContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.borderRadius = '14px';
        canvas.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)';
        canvas.style.background = '#FFFFFF';
        canvas.style.padding = '8px';
        els.phoneQrContainer.appendChild(canvas);

        if (window.QRCode.toCanvas) {
          window.QRCode.toCanvas(canvas, url, {
            width: 260,
            margin: 4,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }, function (error) {
            if (error) {
              console.error('[QR] toCanvas error, falling back to SVG:', error);
              if (window.QRCode.toString) {
                window.QRCode.toString(url, { type: 'svg', width: 260, margin: 4 }, function (err, svg) {
                  if (!err) els.phoneQrContainer.innerHTML = svg;
                });
              }
            }
          });
        }
      }
    });

    if (els.btnCopyPhoneUrl) {
      els.btnCopyPhoneUrl.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(targetUrl);
          alert('Link copied! You can paste or send it to your iPhone: ' + targetUrl);
        } catch (e) {
          alert('URL to open on your iPhone: ' + targetUrl);
        }
      });
    }
  }

  // --- SERVICE WORKER & ZERO-DATA-LOSS UPDATE FLOW ---
  function setupServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((registration) => {
        serviceWorkerRegistration = registration;
        console.log('[SW] Registered successfully.');

        // If an update is already waiting, prompt user safely
        if (registration.waiting) {
          notifyUserOfUpdate(registration.waiting);
        }

        // Detect newly installed updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              notifyUserOfUpdate(newWorker);
            }
          });
        });
      }).catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });

      // Reload smoothly when new worker activates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });

    if (els.updateRefreshBtn) {
      els.updateRefreshBtn.addEventListener('click', () => {
        if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
          serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        } else {
          window.location.reload();
        }
      });
    }
  }

  function notifyUserOfUpdate(worker) {
    if (els.updateBanner) {
      els.updateBanner.classList.add('visible');
    }
    if (els.updateStatusText) {
      els.updateStatusText.textContent = 'New update ready!';
    }
  }

  // --- FORMATTING HELPERS ---
  function formatStreak(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);

    if (d > 0) return `${d}d ${h}h free`;
    if (h > 0) return `${h}h ${m}m free`;
    return `${m}m free`;
  }

  function formatShortTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);

    if (d > 0) return `${d} days`;
    if (h > 0) return `${h} hours`;
    return `less than 1 hour`;
  }

  function formatDateShort(isoDate) {
    const d = new Date(isoDate);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function formatDateTime(isoDate) {
    const d = new Date(isoDate);
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }

  function formatMilestoneHours(hours) {
    if (hours < 24) return `${hours}h`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days} Days`;
    const months = Math.round(days / 30);
    if (months < 12) return `${months} Months`;
    return `1 Year`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
