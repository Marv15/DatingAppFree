// Main Application Logic for Dating App Free PWA
// Connects UI, storage, milestones, live countdown ticker, Urge SOS, offline updates, and i18n.

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

  // Box Breathing phases helper (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s)
  function getBreathingPhases() {
    const t = window.i18n ? window.i18n.t : (k => k);
    return [
      { name: 'Inhale Slowly', class: 'inhale', duration: 4, label: t('breath_inhale') },
      { name: 'Hold Gently', class: 'hold', duration: 4, label: t('breath_hold') },
      { name: 'Exhale Fully', class: 'exhale', duration: 4, label: t('breath_exhale') },
      { name: 'Rest in Silence', class: 'hold', duration: 4, label: t('breath_rest') }
    ];
  }

  // App Logos Configuration
  function getAppIconConfig(appName) {
    if (!appName) return null;
    const n = appName.toLowerCase().trim();
    if (n.includes('tinder')) {
      return {
        src: 'icons/tinder_logo.svg',
        bg: '#FFFFFF',
        padding: '5px',
        fit: 'contain',
        alt: 'Tinder'
      };
    }
    if (n.includes('bumble')) {
      return {
        src: 'icons/bumble_logo.svg',
        bg: '#F9B932',
        padding: '0',
        fit: 'cover',
        alt: 'Bumble'
      };
    }
    if (n.includes('hinge')) {
      return {
        src: 'icons/hinge_logo.svg',
        bg: '#FAF8F5',
        padding: '6px',
        fit: 'contain',
        alt: 'Hinge'
      };
    }
    if (n.includes('badoo')) {
      return {
        src: 'icons/badoo_logo.svg',
        bg: '#E9D8FF',
        padding: '0',
        fit: 'cover',
        alt: 'Badoo'
      };
    }
    if (n.includes('grindr')) {
      return {
        src: 'icons/grindr_logo.svg',
        bg: '#1A1917',
        padding: '5px',
        fit: 'contain',
        alt: 'Grindr'
      };
    }
    return null;
  }

  function renderAppIconBadge(app, size = 36) {
    const iconConfig = getAppIconConfig(app.name);
    if (iconConfig) {
      return `
        <div class="app-icon-badge has-logo" style="width: ${size}px; height: ${size}px; background-color: ${iconConfig.bg}; padding: ${iconConfig.padding};">
          <img src="${iconConfig.src}" alt="${escapeHtml(iconConfig.alt)}" class="app-logo-img" style="object-fit: ${iconConfig.fit}; width: 100%; height: 100%;">
        </div>
      `;
    }
    return `
      <div class="app-icon-badge" style="width: ${size}px; height: ${size}px; background-color: ${app.color || 'var(--accent)'};">
        ${escapeHtml(app.name.charAt(0).toUpperCase())}
      </div>
    `;
  }

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
    insightContainer: document.getElementById('insight-container'),
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
    appInputNeverPaid: document.getElementById('app-input-never-paid'),
    appInputMotivation: document.getElementById('app-input-motivation'),
    presetChips: document.querySelectorAll('.preset-chip'),

    modalReset: document.getElementById('modal-reset'),
    resetAppName: document.getElementById('reset-app-name'),
    resetReasonInput: document.getElementById('reset-reason-input'),
    btnConfirmReset: document.getElementById('btn-confirm-reset'),

    modalSettings: document.getElementById('modal-settings'),
    settingsThemeSelect: document.getElementById('settings-theme-select'),
    settingsLangSelect: document.getElementById('settings-lang-select'),
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
    // 1. Language initialization
    const initialLang = window.storage.getLanguage() || (window.i18n ? window.i18n.detectDefaultLanguage() : 'en');
    applyLanguage(initialLang, false);

    // 2. Theme initialization
    applyTheme(window.storage.data.theme || 'claude-light');

    // 3. Components
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

  // --- LANGUAGE / I18N MANAGEMENT ---
  function applyLanguage(lang, shouldReRender = true) {
    if (window.i18n) {
      window.i18n.setLanguage(lang);
    }
    window.storage.setLanguage(lang);

    if (els.settingsLangSelect) {
      els.settingsLangSelect.value = lang;
    }

    if (shouldReRender) {
      renderAll();
      updateBreathingUI();
      if (els.btnToggleBreathing) {
        els.btnToggleBreathing.textContent = breathingActive 
          ? window.i18n.t('btn_pause_breathing') 
          : window.i18n.t('btn_resume_breathing');
      }
    }
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
      const iconConfig = getAppIconConfig(lastUsedApp.name);
      const iconInline = iconConfig ? `
        <img src="${iconConfig.src}" alt="" style="width: 15px; height: 15px; vertical-align: -2px; margin-right: 4px; display: inline-block; border-radius: 3px;">
      ` : '';

      els.overallLastAppNote.innerHTML = window.i18n.t('hero_note_calc', {
        app: `${iconInline}${escapeHtml(lastUsedApp.name)}`,
        time: lastAppTimeAgo
      });
      els.overallAppBadge.textContent = window.i18n.t('hero_badge_count', { count: activeApps.length });
    } else {
      els.overallLastAppNote.innerHTML = window.i18n.t('hero_note_empty');
      els.overallAppBadge.textContent = window.i18n.t('hero_badge_zero');
    }

    // Next Milestone Progress
    const milestoneProgress = window.MilestoneManager.getProgress(diffMs, window.storage.getLanguage());
    if (milestoneProgress.nextMilestone) {
      els.heroMilestoneIcon.textContent = milestoneProgress.nextMilestone.badge;
      els.heroMilestoneName.textContent = window.i18n.t('hero_milestone_next', {
        title: milestoneProgress.nextMilestone.title,
        hours: milestoneProgress.hoursRemaining
      });
      els.heroMilestonePercent.textContent = `${milestoneProgress.progressPercent}%`;
      els.heroProgressFill.style.width = `${milestoneProgress.progressPercent}%`;
    } else {
      els.heroMilestoneIcon.textContent = '👑';
      els.heroMilestoneName.textContent = window.i18n.t('hero_milestones_all_done');
      els.heroMilestonePercent.textContent = '100%';
      els.heroProgressFill.style.width = '100%';
    }

    // Quantified Benefits (Smoke Free metrics)
    const currency = window.storage.data.currency || '€';
    els.metricHoursSaved.textContent = `${stats.totalHoursSaved}h`;
    els.metricMoneySaved.textContent = `${currency}${stats.totalMoneySaved}`;
    els.metricSwipesAvoided.textContent = stats.totalSwipesAvoided.toLocaleString(getLocaleString());

    const booksStr = window.i18n.t('insight_books', { count: stats.booksReadEquivalent });
    const workoutsStr = window.i18n.t('insight_workouts', { count: stats.workoutsEquivalent });
    if (els.insightContainer) {
      els.insightContainer.innerHTML = window.i18n.t('insight_text', {
        books: booksStr,
        workouts: workoutsStr
      });
    }
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
          <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.9rem;">${window.i18n.t('apps_preview_empty')}</p>
          <button class="pill-btn primary" id="btn-empty-add-app">${window.i18n.t('btn_add_first_app')}</button>
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
          <p style="color: var(--text-secondary); margin-bottom: 14px;">${window.i18n.t('apps_preview_empty')}</p>
          <button class="pill-btn primary" id="btn-empty-add-app-full">${window.i18n.t('btn_add_app')}</button>
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
        <span class="app-motivation-label">${window.i18n.t('card_why_deleted', { app: escapeHtml(app.name) })}</span>
        "${escapeHtml(app.motivation)}"
      </div>
    ` : '';

    const controlsHtml = showAllControls ? `
      <div class="app-actions">
        <button class="app-action-link" data-edit-app="${app.id}">${window.i18n.t('card_btn_edit')}</button>
        <button class="app-action-link" data-reset-app="${app.id}">${window.i18n.t('card_btn_slip')}</button>
        <button class="app-action-link danger" data-delete-app="${app.id}">${window.i18n.t('card_btn_delete')}</button>
      </div>
    ` : `
      <div class="app-actions">
        <button class="app-action-link" data-reset-app="${app.id}">${window.i18n.t('card_btn_slip_short')}</button>
      </div>
    `;

    const isFreeUser = Boolean(app.neverPaid || Number(app.monthlyCost) === 0);
    const savedRateStr = isFreeUser
      ? window.i18n.t('card_saved_rate_free', { min: app.dailyMinutes || 45 })
      : window.i18n.t('card_saved_rate', {
          min: app.dailyMinutes || 45,
          fee: `${currency}${app.monthlyCost || 0}`
        });

    const deletedDateStr = window.i18n.t('card_deleted_on', {
      date: formatDateShort(app.quitDate)
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

      <div class="app-card-metrics">
        <span>${savedRateStr}</span>
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
    const currentLang = window.storage.getLanguage();
    const milestones = window.MilestoneManager.getAll(currentLang);
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
            <strong>${window.i18n.t('milestone_insight_label')}</strong> ${m.insight}
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
          <p style="color: var(--text-muted); font-size: 0.85rem;">${window.i18n.t('journal_empty')}</p>
        </div>
      `;
      return;
    }

    entries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'checkin-entry-card';

      const dateStr = formatDateTime(entry.timestamp);

      // Localize mood label if possible
      let moodDisplay = entry.moodLabel;
      if (typeof moodDisplay === 'string' && moodDisplay.startsWith('mood_')) {
        entry.mood = moodDisplay.replace('mood_', '');
        moodDisplay = '';
      }

      if (entry.mood && window.i18n) {
        let normalizedMood = entry.mood.toLowerCase();
        if (normalizedMood === 'calm') normalizedMood = 'peaceful';
        const key = `mood_${normalizedMood}`;
        if (window.i18n.has && window.i18n.has(key)) {
          moodDisplay = window.i18n.t(key);
        } else if (window.i18n.has && window.i18n.has(`mood_${entry.mood}`)) {
          moodDisplay = window.i18n.t(`mood_${entry.mood}`);
        }
      }

      if (!moodDisplay) {
        moodDisplay = entry.moodLabel || 'Peaceful';
      }

      card.innerHTML = `
        <div class="checkin-entry-header">
          <div class="checkin-mood-tag">
            <span>${entry.emoji || '🌿'}</span>
            <span>${escapeHtml(moodDisplay || 'Peaceful')}</span>
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
        if (chip.dataset.cost) {
          if (els.appInputNeverPaid && els.appInputNeverPaid.checked) {
            els.appInputCost.value = '0';
          } else {
            els.appInputCost.value = chip.dataset.cost;
          }
        }
      });
    });

    // Never paid toggle listener
    if (els.appInputNeverPaid) {
      els.appInputNeverPaid.addEventListener('change', (e) => {
        if (e.target.checked) {
          els.appInputCost.value = '0';
          els.appInputCost.disabled = true;
          els.appInputCost.style.opacity = '0.5';
        } else {
          els.appInputCost.disabled = false;
          els.appInputCost.style.opacity = '1';
          if (parseFloat(els.appInputCost.value) === 0) {
            els.appInputCost.value = '25';
          }
        }
      });
    }

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

    // Settings Theme select
    if (els.settingsThemeSelect) {
      els.settingsThemeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
      });
    }

    // Settings Language select
    if (els.settingsLangSelect) {
      els.settingsLangSelect.value = window.storage.getLanguage();
      els.settingsLangSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value, true);
      });
    }

    // Settings Currency select
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
          alert(window.i18n.t('backup_copied_alert'));
        } catch (err) {
          alert(window.i18n.t('backup_copy_fail_alert'));
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
            alert(window.i18n.t('backup_restored_alert', { count: result.count }));
            closeModal(els.modalSettings);
            // Re-apply language if stored in imported backup
            const restoredLang = window.storage.getLanguage();
            applyLanguage(restoredLang, true);
          } else {
            alert(window.i18n.t('backup_restore_error_alert', { error: result.error }));
          }
        };
        reader.readAsText(file);
      });
    }

    // Check updates manually in settings
    if (els.btnCheckUpdates) {
      els.btnCheckUpdates.addEventListener('click', async () => {
        if (!serviceWorkerRegistration) {
          els.updateStatusText.textContent = window.i18n.t('settings_status_checked');
          return;
        }
        els.updateStatusText.textContent = window.i18n.t('settings_status_checking');
        try {
          await serviceWorkerRegistration.update();
          setTimeout(() => {
            els.updateStatusText.textContent = window.i18n.t('settings_status_up_to_date');
          }, 800);
        } catch (e) {
          els.updateStatusText.textContent = window.i18n.t('settings_status_checked');
        }
      });
    }
  }

  function openAddAppModal() {
    els.appModalTitle.textContent = window.i18n.t('app_modal_title_add');
    els.appEditId.value = '';
    els.appInputName.value = '';
    els.appInputMinutes.value = '45';
    els.appInputCost.value = '25';
    els.appInputCost.disabled = false;
    els.appInputCost.style.opacity = '1';
    if (els.appInputNeverPaid) {
      els.appInputNeverPaid.checked = false;
    }
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

    const iconConfig = getAppIconConfig(app.name);
    const iconInline = iconConfig ? `
      <img src="${iconConfig.src}" alt="" style="width: 18px; height: 18px; vertical-align: -3px; margin-right: 6px; display: inline-block; border-radius: 4px;">
    ` : '';

    els.appModalTitle.innerHTML = `${iconInline}${window.i18n.t('app_modal_title_edit', { name: escapeHtml(app.name) })}`;
    els.appEditId.value = app.id;
    els.appInputName.value = app.name;
    els.appInputMinutes.value = app.dailyMinutes || 45;
    const isNeverPaid = Boolean(app.neverPaid || Number(app.monthlyCost) === 0);
    if (els.appInputNeverPaid) {
      els.appInputNeverPaid.checked = isNeverPaid;
    }
    if (isNeverPaid) {
      els.appInputCost.value = '0';
      els.appInputCost.disabled = true;
      els.appInputCost.style.opacity = '0.5';
    } else {
      els.appInputCost.value = app.monthlyCost || 25;
      els.appInputCost.disabled = false;
      els.appInputCost.style.opacity = '1';
    }
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
    const neverPaid = els.appInputNeverPaid ? els.appInputNeverPaid.checked : false;
    const monthlyCost = neverPaid ? 0 : (parseFloat(els.appInputCost.value) || 0);
    const motivation = els.appInputMotivation.value.trim();

    if (!name || !quitDateValue) {
      alert(window.i18n.t('alert_app_missing_fields'));
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
      neverPaid,
      motivation
    });

    closeModal(els.modalApp);
    renderAll();
  }

  function openResetModal(appId) {
    const app = window.storage.getApp(appId);
    if (!app) return;

    resettingAppId = appId;
    const iconConfig = getAppIconConfig(app.name);
    const iconInline = iconConfig ? `
      <img src="${iconConfig.src}" alt="" style="width: 16px; height: 16px; vertical-align: -2px; margin-right: 4px; display: inline-block; border-radius: 3px;">
    ` : '';
    const resetExpl = document.getElementById('reset-modal-explanation');
    if (resetExpl) {
      resetExpl.innerHTML = window.i18n.t('reset_modal_desc', { name: `${iconInline}${escapeHtml(app.name)}` });
    }
    els.resetReasonInput.value = '';
    openModal(els.modalReset);
  }

  function confirmDeleteApp(appId) {
    const app = window.storage.getApp(appId);
    if (!app) return;

    if (confirm(window.i18n.t('confirm_delete_app', { name: app.name }))) {
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
        els.btnToggleBreathing.textContent = breathingActive 
          ? window.i18n.t('btn_pause_breathing') 
          : window.i18n.t('btn_resume_breathing');
      });
    }
  }

  function populateSosApps() {
    const apps = window.storage.getActiveApps();
    els.sosAppSelect.innerHTML = '';

    if (apps.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = window.i18n.t('sos_app_select_all');
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
      const iconConfig = getAppIconConfig(app.name);
      const iconInline = iconConfig ? `
        <img src="${iconConfig.src}" alt="" style="width: 16px; height: 16px; vertical-align: -2px; margin-right: 5px; display: inline-block; border-radius: 3px;">
      ` : '';
      els.sosAppLabel.innerHTML = `${iconInline}${window.i18n.t('sos_label_why_app')}`;
      els.sosMotivationText.textContent = `"${app.motivation}"`;
    } else {
      els.sosAppLabel.textContent = window.i18n.t('sos_label_why_freedom');
      els.sosMotivationText.textContent = `"${window.i18n.t('sos_default_motivation')}"`;
    }
  }

  function startBreathing() {
    breathingActive = true;
    breathingPhaseIndex = 0;
    breathingSecondsLeft = 4;
    els.btnToggleBreathing.textContent = window.i18n.t('btn_pause_breathing');
    updateBreathingUI();

    if (breathingInterval) clearInterval(breathingInterval);
    breathingInterval = setInterval(() => {
      if (!breathingActive) return;

      const phases = getBreathingPhases();
      breathingSecondsLeft--;
      if (breathingSecondsLeft <= 0) {
        breathingPhaseIndex = (breathingPhaseIndex + 1) % phases.length;
        breathingSecondsLeft = phases[breathingPhaseIndex].duration;
      }
      updateBreathingUI();
    }, 1000);
  }

  function updateBreathingUI() {
    const phases = getBreathingPhases();
    const current = phases[breathingPhaseIndex] || phases[0];
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
        alert(window.i18n.t('journal_saved_alert'));
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
          alert(window.i18n.t('link_copied_alert', { url: targetUrl }));
        } catch (e) {
          alert('URL: ' + targetUrl);
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
      els.updateStatusText.textContent = window.i18n.t('update_ready');
    }
  }

  // --- FORMATTING HELPERS ---
  function getLocaleString() {
    return window.storage.getLanguage() === 'de' ? 'de-DE' : 'en-US';
  }

  function formatStreak(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);

    if (d > 0) return window.i18n.t('streak_days_hours', { d, h });
    if (h > 0) return window.i18n.t('streak_hours_mins', { h, m });
    return window.i18n.t('streak_mins', { m });
  }

  function formatShortTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);

    if (d > 0) return window.i18n.t('time_ago_days', { d });
    if (h > 0) return window.i18n.t('time_ago_hours', { h });
    return window.i18n.t('time_ago_less_hour');
  }

  function formatDateShort(isoDate) {
    const d = new Date(isoDate);
    const locale = getLocaleString();
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }

  function formatDateTime(isoDate) {
    const d = new Date(isoDate);
    const locale = getLocaleString();
    return `${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
  }

  function formatMilestoneHours(hours) {
    const isDe = window.storage.getLanguage() === 'de';
    if (hours < 24) return isDe ? `${hours} Std.` : `${hours}h`;
    const days = Math.round(hours / 24);
    if (days < 30) return isDe ? `${days} Tage` : `${days} Days`;
    const months = Math.round(days / 30);
    if (months < 12) return isDe ? `${months} Monate` : `${months} Months`;
    return isDe ? `1 Jahr` : `1 Year`;
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
