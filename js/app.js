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

    // Journal Sub-views, Reality Checks, Real-World Moments & People Connections
    journalSubReflections: document.getElementById('journal-sub-reflections'),
    journalSubStories: document.getElementById('journal-sub-stories'),
    journalSubMoments: document.getElementById('journal-sub-moments'),
    journalSubPeople: document.getElementById('journal-sub-people'),
    segBtnReflections: document.getElementById('seg-btn-reflections'),
    segBtnStories: document.getElementById('seg-btn-stories'),
    segBtnMoments: document.getElementById('seg-btn-moments'),
    segBtnPeople: document.getElementById('seg-btn-people'),
    journalStoriesTabLabel: document.getElementById('journal-stories-tab-label'),
    journalMomentsTabLabel: document.getElementById('journal-moments-tab-label'),
    journalPeopleTabLabel: document.getElementById('journal-people-tab-label'),
    btnAddStory: document.getElementById('btn-add-story'),
    storiesFilterBar: document.getElementById('stories-filter-bar'),
    storiesList: document.getElementById('stories-list'),
    btnAddMoment: document.getElementById('btn-add-moment'),
    momentsFilterBar: document.getElementById('moments-filter-bar'),
    momentsList: document.getElementById('moments-list'),
    btnAddPerson: document.getElementById('btn-add-person'),
    peopleFilterBar: document.getElementById('people-filter-bar'),
    peopleList: document.getElementById('people-list'),

    // Dashboard Real-World Spark Showcase
    dashMomentContainer: document.getElementById('dash-moment-container'),
    dashMomentCategory: document.getElementById('dash-moment-category'),
    btnNextDashMoment: document.getElementById('btn-next-dash-moment'),
    btnAddDashMoment: document.getElementById('btn-add-dash-moment'),
    dashMomentLocation: document.getElementById('dash-moment-location'),
    dashMomentDate: document.getElementById('dash-moment-date'),
    dashMomentStory: document.getElementById('dash-moment-story'),
    dashMomentFeeling: document.getElementById('dash-moment-feeling'),
    dashMomentCountLabel: document.getElementById('dash-moment-count-label'),
    btnGotoMoments: document.getElementById('btn-goto-moments'),

    // Modals
    modalSos: document.getElementById('modal-sos'),
    sosAppSelect: document.getElementById('sos-app-select'),
    sosAppLabel: document.getElementById('sos-app-label'),
    sosMotivationText: document.getElementById('sos-motivation-text'),
    sosStoryShowcase: document.getElementById('sos-story-showcase'),
    sosStoryLabel: document.getElementById('sos-story-label'),
    sosStoryPerson: document.getElementById('sos-story-person'),
    sosStoryText: document.getElementById('sos-story-text'),
    sosStoryLessonText: document.getElementById('sos-story-lesson-text'),
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

    modalStory: document.getElementById('modal-story'),
    storyModalTitle: document.getElementById('story-modal-title'),
    formStoryEdit: document.getElementById('form-story-edit'),
    storyEditId: document.getElementById('story-edit-id'),
    storyInputApp: document.getElementById('story-input-app'),
    storyInputPerson: document.getElementById('story-input-person'),
    storyInputIncident: document.getElementById('story-input-incident'),
    storyInputText: document.getElementById('story-input-text'),
    storyInputLesson: document.getElementById('story-input-lesson'),
    storyInputDate: document.getElementById('story-input-date'),
    incidentPills: document.querySelectorAll('#incident-selector-container .incident-pill'),

    modalMoment: document.getElementById('modal-moment'),
    momentModalTitle: document.getElementById('moment-modal-title'),
    formMomentEdit: document.getElementById('form-moment-edit'),
    momentEditId: document.getElementById('moment-edit-id'),
    momentInputTitle: document.getElementById('moment-input-title'),
    momentInputLocation: document.getElementById('moment-input-location'),
    momentInputCategory: document.getElementById('moment-input-category'),
    momentCategoryPills: document.querySelectorAll('#moment-category-selector-container .incident-pill'),
    momentInputStory: document.getElementById('moment-input-story'),
    momentInputFeeling: document.getElementById('moment-input-feeling'),
    momentInputPerson: document.getElementById('moment-input-person'),
    momentInputDate: document.getElementById('moment-input-date'),

    modalPerson: document.getElementById('modal-person'),
    personModalTitle: document.getElementById('person-modal-title'),
    formPersonEdit: document.getElementById('form-person-edit'),
    personEditId: document.getElementById('person-edit-id'),
    personInputName: document.getElementById('person-input-name'),
    personInputStage: document.getElementById('person-input-stage'),
    personStagePills: document.querySelectorAll('#person-stage-selector-container .incident-pill'),
    personInputDob: document.getElementById('person-input-dob'),
    personInputMetAt: document.getElementById('person-input-met-at'),
    personInputContact: document.getElementById('person-input-contact'),
    personInputNotes: document.getElementById('person-input-notes'),

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
    btnRestoreBackup: document.getElementById('btn-restore-backup'),
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
    setupStories();
    setupMoments();
    setupPeople();
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
    if (tab === 'journal') {
      renderJournalView();
      renderStoriesView();
      renderMomentsView();
    }
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
    renderStoriesView();
    renderMomentsView();
    renderPeopleView();
    renderDashboardMoment();
    updateTicker();
  }

  function renderDashboard() {
    renderDashboardMoment();
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

    const appStories = window.storage.getStoriesForApp(app.id);
    const storyBadgeHtml = appStories.length > 0
      ? `<button class="app-action-link" data-view-stories-app="${app.id}" title="${appStories.length} Reality Checks">📖 ${appStories.length}</button>`
      : '';

    const controlsHtml = showAllControls ? `
      <div class="app-actions">
        ${storyBadgeHtml}
        <button class="app-action-link" data-add-story-app="${app.id}">+ Story</button>
        <button class="app-action-link" data-edit-app="${app.id}">${window.i18n.t('card_btn_edit')}</button>
        <button class="app-action-link" data-reset-app="${app.id}">${window.i18n.t('card_btn_slip')}</button>
        <button class="app-action-link danger" data-delete-app="${app.id}">${window.i18n.t('card_btn_delete')}</button>
      </div>
    ` : `
      <div class="app-actions">
        ${storyBadgeHtml}
        <button class="app-action-link" data-add-story-app="${app.id}">+ Story</button>
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
    const addStoryBtn = card.querySelector(`[data-add-story-app="${app.id}"]`);
    if (addStoryBtn) addStoryBtn.addEventListener('click', () => openAddStoryModal(app.id));

    const viewStoriesBtn = card.querySelector(`[data-view-stories-app="${app.id}"]`);
    if (viewStoriesBtn) viewStoriesBtn.addEventListener('click', () => {
      switchTab('journal');
      switchJournalSubTab('stories');
      activeStoryFilter = app.id;
      renderStoriesView();
    });

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

  // --- DATING APP STORIES & REALITY CHECKS ---
  let currentJournalSubTab = 'reflections';
  let activeStoryFilter = 'all';

  function getIncidentConfig(type) {
    const isDe = window.storage.getLanguage() === 'de';
    const configs = {
      ghosting: { icon: '👻', class: 'ghosting', label: isDe ? 'Geghostet' : 'Ghosted' },
      stood_up: { icon: '🚫', class: 'stood_up', label: isDe ? 'Versetzt / Abgesagt' : 'Stood Up / Flaked' },
      penpal: { icon: '💬', class: 'penpal', label: isDe ? 'Endlose Schreiberei' : 'Endless Pen-Pal' },
      catfish: { icon: '🎭', class: 'catfish', label: isDe ? 'Catfish / Falsche Angaben' : 'Catfished / Deceptive' },
      toxic: { icon: '🚩', class: 'toxic', label: isDe ? 'Respektlos / Toxisch' : 'Rude / Disrespectful' },
      burnout: { icon: '😮‍💨', class: 'burnout', label: isDe ? 'Oberflächlichkeit & Burnout' : 'Superficial / Burnout' },
      other: { icon: '📝', class: 'other', label: isDe ? 'Sonstige Erfahrung' : 'Other Encounter' }
    };
    return configs[type] || configs.other;
  }

  function setupStories() {
    // Segment buttons (Daily Reflections vs Reality Checks)
    if (els.segBtnReflections) {
      els.segBtnReflections.addEventListener('click', () => switchJournalSubTab('reflections'));
    }
    if (els.segBtnStories) {
      els.segBtnStories.addEventListener('click', () => switchJournalSubTab('stories'));
    }

    // Add Story Button
    if (els.btnAddStory) {
      els.btnAddStory.addEventListener('click', () => openAddStoryModal());
    }

    // Incident Selector in Modal
    if (els.incidentPills) {
      els.incidentPills.forEach(pill => {
        pill.addEventListener('click', () => {
          els.incidentPills.forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          if (els.storyInputIncident) {
            els.storyInputIncident.value = pill.dataset.type;
          }
        });
      });
    }

    // Form submit
    if (els.formStoryEdit) {
      els.formStoryEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        saveStoryFromModal();
      });
    }
  }

  function switchJournalSubTab(subTab) {
    currentJournalSubTab = subTab;
    if (els.segBtnReflections) els.segBtnReflections.classList.toggle('active', subTab === 'reflections');
    if (els.segBtnStories) els.segBtnStories.classList.toggle('active', subTab === 'stories');
    if (els.segBtnMoments) els.segBtnMoments.classList.toggle('active', subTab === 'moments');
    if (els.segBtnPeople) els.segBtnPeople.classList.toggle('active', subTab === 'people');

    if (els.journalSubReflections) els.journalSubReflections.classList.toggle('hidden', subTab !== 'reflections');
    if (els.journalSubStories) els.journalSubStories.classList.toggle('hidden', subTab !== 'stories');
    if (els.journalSubMoments) els.journalSubMoments.classList.toggle('hidden', subTab !== 'moments');
    if (els.journalSubPeople) els.journalSubPeople.classList.toggle('hidden', subTab !== 'people');

    if (subTab === 'stories') {
      renderStoriesView();
    }
    if (subTab === 'moments') {
      renderMomentsView();
    }
    if (subTab === 'people') {
      renderPeopleView();
    }
  }

  function renderStoriesView() {
    const allStories = window.storage.getStories();
    const count = allStories.length;

    // Update segment button label with count
    if (els.journalStoriesTabLabel) {
      els.journalStoriesTabLabel.textContent = count > 0 
        ? window.i18n.t('journal_tab_stories', { count })
        : window.i18n.t('journal_tab_stories_zero');
    }

    // Render Filter Bar
    renderStoriesFilterBar(allStories);

    // Filter stories based on active filter
    const filteredStories = window.storage.getStories(activeStoryFilter);

    if (!els.storiesList) return;
    els.storiesList.innerHTML = '';

    if (filteredStories.length === 0) {
      els.storiesList.innerHTML = `
        <div class="checkin-entry-card text-center" style="padding: 32px 20px; grid-column: 1 / -1;">
          <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.9rem;">
            ${window.i18n.t('stories_empty')}
          </p>
          <button class="pill-btn primary" id="btn-empty-add-story">
            ${window.i18n.t('btn_add_story')}
          </button>
        </div>
      `;
      const btn = document.getElementById('btn-empty-add-story');
      if (btn) btn.addEventListener('click', () => openAddStoryModal());
      return;
    }

    filteredStories.forEach(story => {
      const card = createStoryCardElement(story);
      els.storiesList.appendChild(card);
    });
  }

  function renderStoriesFilterBar(allStories) {
    if (!els.storiesFilterBar) return;
    els.storiesFilterBar.innerHTML = '';

    const trackedApps = window.storage.getActiveApps();
    const appMap = new Map();

    trackedApps.forEach(a => appMap.set(a.id, a.name));
    allStories.forEach(s => {
      if (s.appId && s.appName && !appMap.has(s.appId)) {
        appMap.set(s.appId, s.appName);
      }
    });

    // "All Apps" Chip
    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = `stories-filter-chip ${activeStoryFilter === 'all' ? 'active' : ''}`;
    allChip.innerHTML = `<span>${window.i18n.t('stories_filter_all')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${allStories.length})</span>`;
    allChip.addEventListener('click', () => {
      activeStoryFilter = 'all';
      renderStoriesView();
    });
    els.storiesFilterBar.appendChild(allChip);

    // Each App Chip
    appMap.forEach((name, id) => {
      const count = allStories.filter(s => s.appId === id || (s.appName && s.appName.toLowerCase() === id.toLowerCase())).length;
      if (count === 0 && !trackedApps.some(a => a.id === id)) return;

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `stories-filter-chip ${activeStoryFilter === id ? 'active' : ''}`;
      
      const iconConfig = getAppIconConfig(name);
      const iconHtml = iconConfig 
        ? `<img src="${iconConfig.src}" alt="" style="width: 14px; height: 14px; object-fit: contain; border-radius: 3px; vertical-align: -2px; margin-right: 4px;">`
        : '';

      chip.innerHTML = `${iconHtml}<span>${escapeHtml(name)}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${count})</span>`;
      chip.addEventListener('click', () => {
        activeStoryFilter = id;
        renderStoriesView();
      });
      els.storiesFilterBar.appendChild(chip);
    });
  }

  function createStoryCardElement(story) {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.id = `story-card-${story.id}`;

    const incident = getIncidentConfig(story.incidentType);
    const dateFormatted = story.date ? formatDateShort(story.date) : '';

    // App Badge
    const iconConfig = getAppIconConfig(story.appName);
    const appIconHtml = iconConfig
      ? `<img src="${iconConfig.src}" alt="" style="width: 13px; height: 13px; object-fit: contain; border-radius: 2px;">`
      : '📱';

    const personHtml = story.personName ? `
      <div class="story-person-row">
        <span>👤</span>
        <span>${window.i18n.t('story_person_label', { name: `<strong>${escapeHtml(story.personName)}</strong>` })}</span>
      </div>
    ` : '';

    card.innerHTML = `
      <div class="story-card-top">
        <div class="story-badge-group">
          <span class="story-app-tag">
            ${appIconHtml}
            <span>${escapeHtml(story.appName || 'General')}</span>
          </span>
          <span class="story-incident-tag ${incident.class}">
            <span>${incident.icon}</span>
            <span>${escapeHtml(incident.label)}</span>
          </span>
        </div>
        <div class="story-card-actions">
          ${dateFormatted ? `<span class="story-date-badge">${dateFormatted}</span>` : ''}
        </div>
      </div>

      ${personHtml}

      <p class="story-body-text">"${escapeHtml(story.story)}"</p>

      <div class="story-lesson-box">
        <div class="story-lesson-header">
          <span>💡</span>
          <span>${window.i18n.t('story_takeaway_label')}</span>
        </div>
        <div class="story-lesson-text">${escapeHtml(story.lesson)}</div>
      </div>

      <div class="story-card-footer">
        <button type="button" class="story-footer-btn" data-edit-story="${story.id}">
          ✏️ ${window.i18n.t('story_btn_edit')}
        </button>
        <button type="button" class="story-footer-btn danger" data-delete-story="${story.id}">
          🗑️ ${window.i18n.t('story_btn_delete')}
        </button>
      </div>
    `;

    const editBtn = card.querySelector(`[data-edit-story="${story.id}"]`);
    if (editBtn) editBtn.addEventListener('click', () => openEditStoryModal(story.id));

    const deleteBtn = card.querySelector(`[data-delete-story="${story.id}"]`);
    if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteStory(story.id));

    return card;
  }

  function openAddStoryModal(preselectAppId = null) {
    if (!els.modalStory) return;

    els.storyModalTitle.textContent = window.i18n.t('story_modal_title_add');
    els.storyEditId.value = '';

    // Populate app selector
    populateStoryAppSelect(preselectAppId);

    els.storyInputPerson.value = '';
    els.storyInputText.value = '';
    els.storyInputLesson.value = '';
    els.storyInputDate.value = new Date().toISOString().slice(0, 10);

    // Reset incident pill
    if (els.storyInputIncident) els.storyInputIncident.value = 'ghosting';
    if (els.incidentPills) {
      els.incidentPills.forEach(p => p.classList.toggle('selected', p.dataset.type === 'ghosting'));
    }

    openModal(els.modalStory);
  }

  function openEditStoryModal(storyId) {
    const story = window.storage.getStory(storyId);
    if (!story) return;

    els.storyModalTitle.textContent = window.i18n.t('story_modal_title_edit');
    els.storyEditId.value = story.id;

    populateStoryAppSelect(story.appId);

    els.storyInputPerson.value = story.personName || '';
    els.storyInputText.value = story.story || '';
    els.storyInputLesson.value = story.lesson || '';
    els.storyInputDate.value = story.date || new Date().toISOString().slice(0, 10);

    const incidentType = story.incidentType || 'ghosting';
    if (els.storyInputIncident) els.storyInputIncident.value = incidentType;
    if (els.incidentPills) {
      els.incidentPills.forEach(p => p.classList.toggle('selected', p.dataset.type === incidentType));
    }

    openModal(els.modalStory);
  }

  function populateStoryAppSelect(selectedAppId = null) {
    if (!els.storyInputApp) return;
    els.storyInputApp.innerHTML = '';

    const apps = window.storage.getApps();
    apps.forEach(app => {
      const opt = document.createElement('option');
      opt.value = app.id;
      opt.textContent = app.name;
      opt.dataset.name = app.name;
      if (selectedAppId && selectedAppId.toLowerCase() === app.id.toLowerCase()) {
        opt.selected = true;
      }
      els.storyInputApp.appendChild(opt);
    });

    // General Dating Fatigue option
    const genOpt = document.createElement('option');
    genOpt.value = 'general';
    genOpt.textContent = `🌍 ${window.i18n.t('story_form_general')}`;
    genOpt.dataset.name = 'General';
    if (selectedAppId === 'general') genOpt.selected = true;
    els.storyInputApp.appendChild(genOpt);
  }

  function saveStoryFromModal() {
    const id = els.storyEditId.value || `story-${Date.now()}`;
    const selectedOpt = els.storyInputApp.options[els.storyInputApp.selectedIndex];
    const appId = els.storyInputApp.value;
    const appName = selectedOpt ? (selectedOpt.dataset.name || selectedOpt.textContent.trim()) : 'General';
    const personName = els.storyInputPerson.value.trim();
    const incidentType = els.storyInputIncident.value || 'ghosting';
    const story = els.storyInputText.value.trim();
    const lesson = els.storyInputLesson.value.trim();
    const date = els.storyInputDate.value || new Date().toISOString().slice(0, 10);

    if (!story || !lesson) {
      showToast(window.i18n.t('alert_story_missing_fields'), 'warning');
      return;
    }

    window.storage.saveStory({
      id,
      appId,
      appName,
      personName,
      incidentType,
      story,
      lesson,
      date
    });

    closeModal(els.modalStory);
    renderStoriesView();
    showToast(window.i18n.t('story_saved_alert'), 'success');
  }

  function confirmDeleteStory(storyId) {
    if (confirm(window.i18n.t('confirm_delete_story'))) {
      window.storage.deleteStory(storyId);
      renderStoriesView();
    }
  }

  // --- REAL-WORLD POSITIVE MOMENTS & SPARK SHOWCASE ---
  let activeMomentFilter = 'unassociated';
  let currentDashMomentIndex = 0;

  function getMomentCategoryConfig(cat) {
    const isDe = window.storage.getLanguage() === 'de';
    const configs = {
      spark: { icon: '✨', class: 'spark', label: isDe ? 'Romantischer Funke' : 'Romantic Spark' },
      conversation: { icon: '☕', class: 'conversation', label: isDe ? 'Spontanes Gespräch' : 'Spontaneous Chat' },
      kindness: { icon: '☀️', class: 'kindness', label: isDe ? 'Freundlichkeit & Lächeln' : 'Warm Smile / Kindness' },
      friendship: { icon: '🤝', class: 'friendship', label: isDe ? 'Echte Verbindung' : 'Deep Connection' },
      presence: { icon: '🌿', class: 'presence', label: isDe ? 'Achtsame Präsenz' : 'Real-World Presence' },
      other: { icon: '💫', class: 'other', label: isDe ? 'Schöner Moment' : 'Pleasant Moment' }
    };
    return configs[cat] || configs.other;
  }

  function setupMoments() {
    // Segment button
    if (els.segBtnMoments) {
      els.segBtnMoments.addEventListener('click', () => switchJournalSubTab('moments'));
    }

    // Add Moment buttons
    if (els.btnAddMoment) {
      els.btnAddMoment.addEventListener('click', () => openAddMomentModal());
    }
    if (els.btnAddDashMoment) {
      els.btnAddDashMoment.addEventListener('click', () => openAddMomentModal());
    }

    // Next Spark Button on Dashboard
    if (els.btnNextDashMoment) {
      els.btnNextDashMoment.addEventListener('click', () => nextDashMoment());
    }

    // Goto Moments link on Dashboard
    if (els.btnGotoMoments) {
      els.btnGotoMoments.addEventListener('click', () => {
        switchTab('journal');
        switchJournalSubTab('moments');
      });
    }

    // Category Selector in Modal
    if (els.momentCategoryPills) {
      els.momentCategoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          els.momentCategoryPills.forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          if (els.momentInputCategory) {
            els.momentInputCategory.value = pill.dataset.cat;
          }
        });
      });
    }

    // Form submit
    if (els.formMomentEdit) {
      els.formMomentEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        saveMomentFromModal();
      });
    }
  }

  let currentPersonSlideIndex = 0;
  let personTouchStartX = 0;
  let personTouchStartY = 0;

  // Minimum stage required for a connection to appear on the main page showcase
  const MIN_SHOWCASE_STAGES = ['regular', 'close', 'romantic'];

  function getShowcasePeople() {
    const allPeople = window.storage.getPeople();
    return allPeople.filter(p => p.stage && MIN_SHOWCASE_STAGES.includes(p.stage));
  }

  function nextPersonSlide() {
    const showcasePeople = getShowcasePeople();
    if (showcasePeople.length <= 1) return;
    currentPersonSlideIndex = (currentPersonSlideIndex + 1) % showcasePeople.length;
    renderDashboardShowcase('slide-in-right');
  }

  function prevPersonSlide() {
    const showcasePeople = getShowcasePeople();
    if (showcasePeople.length <= 1) return;
    currentPersonSlideIndex = (currentPersonSlideIndex - 1 + showcasePeople.length) % showcasePeople.length;
    renderDashboardShowcase('slide-in-left');
  }

  function nextDashMoment() {
    const unassociatedMoments = window.storage.getMoments('unassociated');
    const moments = unassociatedMoments.length > 0 ? unassociatedMoments : window.storage.getMoments();
    if (moments.length <= 1) return;
    currentDashMomentIndex = (currentDashMomentIndex + 1) % moments.length;
    renderDashboardShowcase('slide-in-right');
  }

  function gotoPersonProfile(personId) {
    switchTab('journal');
    switchJournalSubTab('people');
    if (personId) {
      setTimeout(() => {
        const card = document.getElementById(`person-card-${personId}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlight-pulse');
          setTimeout(() => card.classList.remove('highlight-pulse'), 1800);
        }
      }, 160);
    }
  }

  function renderDashboardShowcase(animationClass = '') {
    if (!els.dashMomentContainer) return;

    // Connections on the main page are only shown when minimum "regular contact" (regular, close, romantic)
    const showcasePeople = getShowcasePeople();

    if (showcasePeople.length > 0) {
      renderDashboardPeopleSlideshow(showcasePeople, animationClass);
    } else {
      renderDashboardMomentShowcase(animationClass);
    }
  }

  // Alias for compatibility with all existing callers
  function renderDashboardMoment(animationClass = '') {
    renderDashboardShowcase(animationClass);
  }

  function renderDashboardPeopleSlideshow(people, animationClass = '') {
    if (currentPersonSlideIndex >= people.length) currentPersonSlideIndex = 0;
    if (currentPersonSlideIndex < 0) currentPersonSlideIndex = people.length - 1;

    const person = people[currentPersonSlideIndex];
    const stageConfig = getStageConfig(person.stage);
    const initial = (person.name || '?').charAt(0).toUpperCase();
    const isMultiple = people.length > 1;

    const age = calculateAge(person.dob);
    const ageStr = age !== null ? window.i18n.t('person_age_label', { age }) : '';
    const daysUntil = getDaysUntilBirthday(person.dob);
    const upcomingBadge = daysUntil !== null
      ? `<span class="person-bday-badge">${window.i18n.t('person_upcoming_bday', { days: daysUntil })}</span>`
      : '';

    const encounters = window.storage.getMomentsForPerson(person.id);
    const latestEncounter = encounters.length > 0 ? encounters[0] : null;

    const stepDotsHtml = STAGE_ORDER.map(stg => {
      const stepCfg = getStageConfig(stg);
      const isActive = stg === person.stage;
      return `
        <button type="button" class="progression-dot ${isActive ? 'active' : ''}" data-dash-set-stage="${stg}" data-person="${person.id}" title="${escapeHtml(stepCfg.name)}" aria-label="${escapeHtml(stepCfg.name)}">
          <span class="prog-dot-icon">${stepCfg.icon}</span>
          <span class="prog-dot-text">${escapeHtml(stepCfg.name)}</span>
        </button>
      `;
    }).join('');

    els.dashMomentContainer.className = 'dash-showcase-card mode-person';
    els.dashMomentContainer.innerHTML = `
      <div class="dash-moment-header">
        <div class="dash-moment-badge-group">
          <span class="dash-person-badge">
            <span>👥</span>
            <span>${window.i18n.t('dash_person_showcase_badge')}</span>
          </span>
          <span class="person-stage-badge ${person.stage}">
            <span>${stageConfig.icon}</span>
            <span>${stageConfig.name}</span>
          </span>
        </div>
        <div class="dash-moment-actions">
          ${isMultiple ? `
            <button type="button" id="btn-prev-person-slide" class="dash-action-icon-btn" title="${window.i18n.t('btn_prev')}">
              ◀
            </button>
            <button type="button" id="btn-next-person-slide" class="dash-action-icon-btn" title="${window.i18n.t('btn_next')}">
              ▶
            </button>
          ` : ''}
          <button type="button" class="dash-action-icon-btn" data-add-encounter="${person.id}" title="${window.i18n.t('person_btn_add_encounter')}">
            ➕
          </button>
        </div>
      </div>

      <div class="dash-person-slide ${animationClass}" id="dash-person-slide-content">
        <!-- Person Identity -->
        <div class="person-identity" style="cursor: pointer;" data-goto-person="${person.id}">
          <div class="person-avatar">${escapeHtml(initial)}</div>
          <div class="person-title-wrap">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 class="person-name" style="font-size: 1.25rem;">${escapeHtml(person.name)}</h3>
              ${upcomingBadge}
            </div>
            <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 500;">
              ${stageConfig.name} ${ageStr ? `· ${ageStr}` : ''}
            </div>
          </div>
        </div>

        <!-- Relationship Progression Track -->
        <div class="progression-card-box">
          <div class="progression-header-row">
            <span class="progression-label">
              ${window.i18n.t('progression_level', { level: stageConfig.level, stage: stageConfig.name, percent: stageConfig.percent })}
            </span>
          </div>
          <div class="progression-track">
            <div class="progression-fill ${stageConfig.colorClass}" style="width: ${stageConfig.percent}%;"></div>
          </div>
          <div class="progression-steps-dots">
            ${stepDotsHtml}
          </div>
        </div>

        <!-- Details (Met at & Notes) -->
        ${person.metAt ? `
          <div class="person-detail-row">
            <span>📍</span>
            <span>${window.i18n.t('person_met_at_label', { loc: escapeHtml(person.metAt) })}</span>
          </div>
        ` : ''}

        ${person.notes ? `
          <div class="person-notes-box">"${escapeHtml(person.notes)}"</div>
        ` : ''}

        <!-- Latest Encounter Spotlight -->
        ${latestEncounter ? `
          <div class="dash-person-encounter-box">
            <div class="dash-person-encounter-header">
              <span>✨</span>
              <span>${window.i18n.t('dash_person_latest_encounter')} (${formatDateShort(latestEncounter.date)})</span>
            </div>
            <p class="dash-person-encounter-text">"${escapeHtml(latestEncounter.story)}"</p>
          </div>
        ` : `
          <div style="margin-top: 4px;">
            <button type="button" class="person-quick-add-link" data-add-encounter="${person.id}">
              ${window.i18n.t('dash_person_first_encounter', { name: escapeHtml(person.name) })}
            </button>
          </div>
        `}
      </div>

      <div class="dash-moment-footer">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${isMultiple ? `
            <div class="dash-carousel-dots">
              ${people.map((p, idx) => `
                <button type="button" class="carousel-dot ${idx === currentPersonSlideIndex ? 'active' : ''}" data-goto-slide="${idx}" title="${escapeHtml(p.name)}" aria-label="Slide ${idx+1}"></button>
              `).join('')}
            </div>
            <span class="dash-moment-count">${window.i18n.t('dash_person_slide_count', { current: currentPersonSlideIndex + 1, total: people.length })}</span>
          ` : `
            <span class="dash-moment-count">${window.i18n.t('dash_person_single_count')}</span>
          `}
        </div>
        <button type="button" id="btn-goto-connections" class="dash-moment-link">
          <span>${window.i18n.t('dash_person_btn_view_connections')}</span> &rarr;
        </button>
      </div>
    `;

    // Event listeners
    const btnPrev = els.dashMomentContainer.querySelector('#btn-prev-person-slide');
    if (btnPrev) btnPrev.addEventListener('click', () => prevPersonSlide());

    const btnNext = els.dashMomentContainer.querySelector('#btn-next-person-slide');
    if (btnNext) btnNext.addEventListener('click', () => nextPersonSlide());

    const btnGoto = els.dashMomentContainer.querySelector('#btn-goto-connections');
    if (btnGoto) {
      btnGoto.addEventListener('click', () => {
        switchTab('journal');
        switchJournalSubTab('people');
      });
    }

    const addEncBtns = els.dashMomentContainer.querySelectorAll('[data-add-encounter]');
    addEncBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAddMomentModal(btn.dataset.addEncounter);
      });
    });

    const gotoPersonEls = els.dashMomentContainer.querySelectorAll('[data-goto-person]');
    gotoPersonEls.forEach(el => {
      el.addEventListener('click', () => gotoPersonProfile(el.dataset.gotoPerson));
    });

    const dotBtns = els.dashMomentContainer.querySelectorAll('[data-goto-slide]');
    dotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = parseInt(btn.dataset.gotoSlide, 10);
        if (!isNaN(targetIdx) && targetIdx !== currentPersonSlideIndex) {
          const anim = targetIdx > currentPersonSlideIndex ? 'slide-in-right' : 'slide-in-left';
          currentPersonSlideIndex = targetIdx;
          renderDashboardShowcase(anim);
        }
      });
    });

    const stageBtns = els.dashMomentContainer.querySelectorAll('[data-dash-set-stage]');
    stageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const stg = btn.dataset.dashSetStage;
        const pId = btn.dataset.person;
        if (stg && pId) {
          window.storage.setPersonStage(pId, stg);
          renderDashboardShowcase();
          renderPeopleView();
        }
      });
    });

    // Touch & Mouse Swipe Gestures
    els.dashMomentContainer.ontouchstart = (e) => {
      if (e.touches && e.touches.length === 1) {
        personTouchStartX = e.touches[0].clientX;
        personTouchStartY = e.touches[0].clientY;
      }
    };

    els.dashMomentContainer.ontouchend = (e) => {
      if (!isMultiple) return;
      if (e.changedTouches && e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - personTouchStartX;
        const diffY = e.changedTouches[0].clientY - personTouchStartY;
        if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            nextPersonSlide();
          } else {
            prevPersonSlide();
          }
        }
      }
    };

    // Desktop Mouse Drag / Swipe
    let mouseStartX = 0;
    let mouseStartY = 0;
    let isMouseDown = false;
    els.dashMomentContainer.onmousedown = (e) => {
      if (e.target.closest('button, a, input, select, textarea, [data-goto-person], [data-dash-set-stage]')) return;
      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
    };
    els.dashMomentContainer.onmouseup = (e) => {
      if (!isMouseDown || !isMultiple) {
        isMouseDown = false;
        return;
      }
      isMouseDown = false;
      const diffX = e.clientX - mouseStartX;
      const diffY = e.clientY - mouseStartY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextPersonSlide();
        } else {
          prevPersonSlide();
        }
      }
    };
    els.dashMomentContainer.onmouseleave = () => {
      isMouseDown = false;
    };
  }

  function renderDashboardMomentShowcase(animationClass = '') {
    const unassociatedMoments = window.storage.getMoments('unassociated');
    // By default, only show real sparks that aren't associated with a specific person
    const moments = unassociatedMoments.length > 0 ? unassociatedMoments : window.storage.getMoments();
    if (moments.length === 0) {
      els.dashMomentContainer.className = 'dash-showcase-card mode-spark';
      els.dashMomentContainer.innerHTML = `
        <div class="dash-moment-header">
          <div class="dash-moment-badge-group">
            <span class="dash-moment-badge">
              <span>✨</span>
              <span>${window.i18n.t('dash_moment_badge')}</span>
            </span>
          </div>
          <div class="dash-moment-actions">
            <button type="button" id="btn-add-dash-moment" class="dash-action-icon-btn" title="${window.i18n.t('dash_moment_btn_add')}">
              ➕
            </button>
          </div>
        </div>
        <div class="dash-moment-body">
          <p class="dash-moment-story">"${window.i18n.t('dash_moment_empty')}"</p>
        </div>
        <div class="dash-moment-footer">
          <span class="dash-moment-count">0</span>
          <button type="button" id="btn-add-dash-moment-link" class="dash-moment-link">
            <span>${window.i18n.t('btn_add_moment')}</span> &rarr;
          </button>
        </div>
      `;

      const addBtn = els.dashMomentContainer.querySelector('#btn-add-dash-moment');
      if (addBtn) addBtn.addEventListener('click', () => openAddMomentModal());
      const addLink = els.dashMomentContainer.querySelector('#btn-add-dash-moment-link');
      if (addLink) addLink.addEventListener('click', () => openAddMomentModal());
      return;
    }

    if (currentDashMomentIndex >= moments.length) {
      currentDashMomentIndex = 0;
    }

    const moment = moments[currentDashMomentIndex];
    const catConfig = getMomentCategoryConfig(moment.category);

    let linkedPerson = null;
    if (moment.personId) {
      linkedPerson = window.storage.getPerson(moment.personId);
    }
    const personDisplayName = linkedPerson ? linkedPerson.name : (moment.personName || '');
    const personInitial = personDisplayName ? personDisplayName.charAt(0).toUpperCase() : '?';

    els.dashMomentContainer.className = 'dash-showcase-card mode-spark';
    els.dashMomentContainer.innerHTML = `
      <div class="dash-moment-header">
        <div class="dash-moment-badge-group">
          <span class="dash-moment-badge">
            <span>✨</span>
            <span>${window.i18n.t('dash_moment_badge')}</span>
          </span>
          <span class="dash-moment-category-tag ${catConfig.class}">
            <span>${catConfig.icon}</span>
            <span>${escapeHtml(catConfig.label)}</span>
          </span>
          ${personDisplayName ? `
            <span class="dash-moment-person-badge" ${linkedPerson ? `data-goto-person="${linkedPerson.id}"` : ''} title="${window.i18n.t('btn_view_profile')}">
              👤 ${window.i18n.t('dash_moment_connected_badge', { name: escapeHtml(personDisplayName) })}
            </span>
          ` : ''}
        </div>
        <div class="dash-moment-actions">
          ${moments.length > 1 ? `
            <button type="button" id="btn-next-dash-moment" class="dash-action-icon-btn" title="${window.i18n.t('dash_moment_btn_next')}">
              🔄
            </button>
          ` : ''}
          <button type="button" id="btn-add-dash-moment" class="dash-action-icon-btn" title="${window.i18n.t('dash_moment_btn_add')}">
            ➕
          </button>
        </div>
      </div>

      <div class="dash-moment-body ${animationClass}">
        <div class="dash-moment-meta">
          ${moment.location ? `<span class="dash-moment-location">📍 ${escapeHtml(moment.location)}</span>` : ''}
          ${moment.date ? `<span class="dash-moment-date">${formatDateShort(moment.date)}</span>` : ''}
        </div>

        <!-- Prominently Highlight Connected Person if linked -->
        ${personDisplayName ? `
          <div class="dash-moment-connected-person-card" ${linkedPerson ? `data-goto-person="${linkedPerson.id}"` : ''}>
            <div class="dash-person-mini-avatar">${escapeHtml(personInitial)}</div>
            <div class="dash-person-mini-info">
              <div class="dash-person-mini-name">
                <span>${escapeHtml(personDisplayName)}</span>
                ${linkedPerson ? `<span class="person-stage-badge ${linkedPerson.stage}">${getStageConfig(linkedPerson.stage).name}</span>` : ''}
              </div>
              <div class="dash-person-mini-sub">
                ${window.i18n.t('dash_moment_connected_sub', { name: escapeHtml(personDisplayName) })}
              </div>
            </div>
            ${linkedPerson ? `
              <button type="button" class="dash-person-mini-link" data-goto-person="${linkedPerson.id}">
                ${window.i18n.t('btn_view_profile')} &rarr;
              </button>
            ` : ''}
          </div>
        ` : ''}

        ${moment.title ? `<h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-top: 2px;">${escapeHtml(moment.title)}</h4>` : ''}

        <p class="dash-moment-story">"${escapeHtml(moment.story)}"</p>

        ${moment.feeling ? `
          <div class="dash-moment-feeling-box">
            <div class="dash-moment-feeling-header">
              <span>💡</span>
              <span>${window.i18n.t('dash_moment_how_felt')}</span>
            </div>
            <div class="dash-moment-feeling-text">
              ${escapeHtml(moment.feeling)}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="dash-moment-footer">
        <span class="dash-moment-count">${currentDashMomentIndex + 1} / ${moments.length}</span>
        <button type="button" id="btn-goto-moments" class="dash-moment-link">
          <span>${window.i18n.t('dash_moment_btn_view_all', { count: moments.length })}</span> &rarr;
        </button>
      </div>
    `;

    // Event listeners
    const btnNext = els.dashMomentContainer.querySelector('#btn-next-dash-moment');
    if (btnNext) btnNext.addEventListener('click', () => nextDashMoment());

    const btnAdd = els.dashMomentContainer.querySelector('#btn-add-dash-moment');
    if (btnAdd) btnAdd.addEventListener('click', () => openAddMomentModal());

    const btnGoto = els.dashMomentContainer.querySelector('#btn-goto-moments');
    if (btnGoto) {
      btnGoto.addEventListener('click', () => {
        switchTab('journal');
        switchJournalSubTab('moments');
      });
    }

    const gotoPersonEls = els.dashMomentContainer.querySelectorAll('[data-goto-person]');
    gotoPersonEls.forEach(el => {
      el.addEventListener('click', () => gotoPersonProfile(el.dataset.gotoPerson));
    });

    // Touch Swipe Gestures for Moments
    els.dashMomentContainer.ontouchstart = (e) => {
      if (e.touches && e.touches.length === 1) {
        personTouchStartX = e.touches[0].clientX;
        personTouchStartY = e.touches[0].clientY;
      }
    };

    els.dashMomentContainer.ontouchend = (e) => {
      if (moments.length <= 1) return;
      if (e.changedTouches && e.changedTouches.length === 1) {
        const diffX = e.changedTouches[0].clientX - personTouchStartX;
        const diffY = e.changedTouches[0].clientY - personTouchStartY;
        if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY)) {
          nextDashMoment();
        }
      }
    };
  }

  function renderMomentsView() {
    const allMoments = window.storage.getMoments();
    const count = allMoments.length;

    // Update segment button label with count
    if (els.journalMomentsTabLabel) {
      els.journalMomentsTabLabel.textContent = count > 0 
        ? window.i18n.t('journal_tab_moments', { count })
        : window.i18n.t('journal_tab_moments_zero');
    }

    // Render Filter Bar
    renderMomentsFilterBar(allMoments);

    // Filter moments based on active filter
    const filteredMoments = window.storage.getMoments(activeMomentFilter);

    if (!els.momentsList) return;
    els.momentsList.innerHTML = '';

    if (filteredMoments.length === 0) {
      const isUnassociated = activeMomentFilter === 'unassociated';
      const emptyMsg = (isUnassociated && allMoments.length > 0)
        ? window.i18n.t('moments_empty_unassociated')
        : window.i18n.t('moments_empty');

      els.momentsList.innerHTML = `
        <div class="checkin-entry-card text-center" style="padding: 32px 20px; grid-column: 1 / -1;">
          <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.9rem;">
            ${emptyMsg}
          </p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button class="pill-btn primary" id="btn-empty-add-moment">
              ${window.i18n.t('btn_add_moment')}
            </button>
            ${isUnassociated && allMoments.length > 0 ? `
              <button class="pill-btn secondary" id="btn-empty-view-all-moments">
                ${window.i18n.t('moments_filter_all')} (${allMoments.length})
              </button>
            ` : ''}
          </div>
        </div>
      `;
      const btn = document.getElementById('btn-empty-add-moment');
      if (btn) btn.addEventListener('click', () => openAddMomentModal());
      const btnAll = document.getElementById('btn-empty-view-all-moments');
      if (btnAll) btnAll.addEventListener('click', () => {
        activeMomentFilter = 'all';
        renderMomentsView();
      });
      return;
    }

    filteredMoments.forEach(moment => {
      const card = createMomentCardElement(moment);
      els.momentsList.appendChild(card);
    });
  }

  function renderMomentsFilterBar(allMoments) {
    if (!els.momentsFilterBar) return;
    els.momentsFilterBar.innerHTML = '';

    const unassociatedCount = allMoments.filter(m => !window.storage.isMomentAssociated(m)).length;
    const withPersonCount = allMoments.filter(m => window.storage.isMomentAssociated(m)).length;

    // "General Sparks" (Default) Chip
    const unassociatedChip = document.createElement('button');
    unassociatedChip.type = 'button';
    unassociatedChip.className = `stories-filter-chip ${activeMomentFilter === 'unassociated' ? 'active' : ''}`;
    unassociatedChip.innerHTML = `<span>${window.i18n.t('moments_filter_unassociated')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${unassociatedCount})</span>`;
    unassociatedChip.addEventListener('click', () => {
      activeMomentFilter = 'unassociated';
      renderMomentsView();
    });
    els.momentsFilterBar.appendChild(unassociatedChip);

    // "With People" Chip (if any exist)
    if (withPersonCount > 0) {
      const withPersonChip = document.createElement('button');
      withPersonChip.type = 'button';
      withPersonChip.className = `stories-filter-chip ${activeMomentFilter === 'with_person' ? 'active' : ''}`;
      withPersonChip.innerHTML = `<span>${window.i18n.t('moments_filter_with_person')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${withPersonCount})</span>`;
      withPersonChip.addEventListener('click', () => {
        activeMomentFilter = 'with_person';
        renderMomentsView();
      });
      els.momentsFilterBar.appendChild(withPersonChip);
    }

    // "All Moments" Chip
    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = `stories-filter-chip ${activeMomentFilter === 'all' ? 'active' : ''}`;
    allChip.innerHTML = `<span>${window.i18n.t('moments_filter_all')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${allMoments.length})</span>`;
    allChip.addEventListener('click', () => {
      activeMomentFilter = 'all';
      renderMomentsView();
    });
    els.momentsFilterBar.appendChild(allChip);

    // Categories
    const standardCats = ['spark', 'conversation', 'kindness', 'friendship', 'presence'];
    standardCats.forEach(cat => {
      const count = allMoments.filter(m => m.category === cat).length;
      if (count === 0) return;

      const config = getMomentCategoryConfig(cat);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `stories-filter-chip ${activeMomentFilter === cat ? 'active' : ''}`;
      chip.innerHTML = `<span>${config.icon} ${escapeHtml(config.label)}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${count})</span>`;
      chip.addEventListener('click', () => {
        activeMomentFilter = cat;
        renderMomentsView();
      });
      els.momentsFilterBar.appendChild(chip);
    });
  }

  function createMomentCardElement(moment) {
    const card = document.createElement('div');
    card.className = 'moment-card';
    card.id = `moment-card-${moment.id}`;

    const catConfig = getMomentCategoryConfig(moment.category);
    const dateFormatted = moment.date ? formatDateShort(moment.date) : '';
    const locHtml = moment.location ? `<span class="moment-location-tag">📍 ${escapeHtml(moment.location)}</span>` : '';
    let personName = moment.personName;
    if (moment.personId) {
      const p = window.storage.getPerson(moment.personId);
      if (p) personName = p.name;
    }
    const personHtml = personName 
      ? `<span class="moment-location-tag" style="background: rgba(217, 119, 87, 0.12); color: var(--accent-text);">👤 ${window.i18n.t('moment_person_badge', { name: escapeHtml(personName) })}</span>` 
      : '';

    const feelingHtml = moment.feeling ? `
      <div class="moment-feeling-box">
        <div class="moment-feeling-header">
          <span>✨</span>
          <span>${window.i18n.t('moment_feeling_label')}</span>
        </div>
        <div class="moment-feeling-text">${escapeHtml(moment.feeling)}</div>
      </div>
    ` : '';

    const titleHtml = moment.title ? `<h4 class="moment-title-text">${escapeHtml(moment.title)}</h4>` : '';

    card.innerHTML = `
      <div class="moment-card-top">
        <div class="moment-badge-group">
          <span class="moment-category-tag ${catConfig.class}">
            <span>${catConfig.icon}</span>
            <span>${escapeHtml(catConfig.label)}</span>
          </span>
          ${locHtml}
          ${personHtml}
        </div>
        <div class="moment-card-actions">
          ${dateFormatted ? `<span class="moment-date-badge">${dateFormatted}</span>` : ''}
        </div>
      </div>

      ${titleHtml}
      <p class="moment-body-text">"${escapeHtml(moment.story)}"</p>

      ${feelingHtml}

      <div class="moment-card-footer">
        <button type="button" class="story-footer-btn" data-edit-moment="${moment.id}">
          ✏️ ${window.i18n.t('moment_btn_edit')}
        </button>
        <button type="button" class="story-footer-btn danger" data-delete-moment="${moment.id}">
          🗑️ ${window.i18n.t('moment_btn_delete')}
        </button>
      </div>
    `;

    const editBtn = card.querySelector(`[data-edit-moment="${moment.id}"]`);
    if (editBtn) editBtn.addEventListener('click', () => openEditMomentModal(moment.id));

    const deleteBtn = card.querySelector(`[data-delete-moment="${moment.id}"]`);
    if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteMoment(moment.id));

    return card;
  }

  function populateMomentPersonSelect(selectedPersonId = null) {
    if (!els.momentInputPerson) return;
    els.momentInputPerson.innerHTML = '';

    // Standalone One-Time Option
    const optNone = document.createElement('option');
    optNone.value = '';
    optNone.textContent = window.i18n.t('moment_form_person_none');
    if (!selectedPersonId) optNone.selected = true;
    els.momentInputPerson.appendChild(optNone);

    // People options
    const people = window.storage.getPeople();
    let hasMatched = false;
    people.forEach(p => {
      const stageConfig = getStageConfig(p.stage);
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `👤 ${p.name} (${stageConfig.name})`;
      opt.dataset.name = p.name;
      if (selectedPersonId && String(selectedPersonId) === String(p.id)) {
        opt.selected = true;
        hasMatched = true;
      }
      els.momentInputPerson.appendChild(opt);
    });

    // Quick add new person option
    const optNew = document.createElement('option');
    optNew.value = '__new__';
    optNew.textContent = window.i18n.t('moment_form_person_new');
    els.momentInputPerson.appendChild(optNew);

    if (selectedPersonId && hasMatched) {
      els.momentInputPerson.value = String(selectedPersonId);
    } else if (!selectedPersonId) {
      els.momentInputPerson.value = '';
    }
  }

  function openAddMomentModal(preselectPersonId = null) {
    if (!els.modalMoment) return;

    els.momentModalTitle.textContent = window.i18n.t('moment_modal_title_add');
    els.momentEditId.value = '';
    els.momentInputTitle.value = '';
    els.momentInputLocation.value = '';
    els.momentInputStory.value = '';
    els.momentInputFeeling.value = '';
    els.momentInputDate.value = new Date().toISOString().slice(0, 10);

    if (els.momentInputCategory) els.momentInputCategory.value = 'spark';
    if (els.momentCategoryPills) {
      els.momentCategoryPills.forEach(p => p.classList.toggle('selected', p.dataset.cat === 'spark'));
    }

    populateMomentPersonSelect(preselectPersonId);

    openModal(els.modalMoment);
  }

  function openEditMomentModal(momentId) {
    const moment = window.storage.getMoment(momentId);
    if (!moment) return;

    els.momentModalTitle.textContent = window.i18n.t('moment_modal_title_edit');
    els.momentEditId.value = moment.id;
    els.momentInputTitle.value = moment.title || '';
    els.momentInputLocation.value = moment.location || '';
    els.momentInputStory.value = moment.story || '';
    els.momentInputFeeling.value = moment.feeling || '';
    els.momentInputDate.value = moment.date || new Date().toISOString().slice(0, 10);

    const cat = moment.category || 'spark';
    if (els.momentInputCategory) els.momentInputCategory.value = cat;
    if (els.momentCategoryPills) {
      els.momentCategoryPills.forEach(p => p.classList.toggle('selected', p.dataset.cat === cat));
    }

    populateMomentPersonSelect(moment.personId);

    openModal(els.modalMoment);
  }

  function saveMomentFromModal() {
    const id = els.momentEditId.value || `moment-${Date.now()}`;
    const title = els.momentInputTitle.value.trim();
    const location = els.momentInputLocation.value.trim();
    const category = els.momentInputCategory.value || 'spark';
    const story = els.momentInputStory.value.trim();
    const feeling = els.momentInputFeeling.value.trim();
    const date = els.momentInputDate.value || new Date().toISOString().slice(0, 10);

    if (!story || !feeling) {
      showToast(window.i18n.t('alert_moment_missing_fields'), 'warning');
      return;
    }

    let personId = null;
    let personName = '';
    if (els.momentInputPerson) {
      const selectedVal = els.momentInputPerson.value;
      if (selectedVal && selectedVal !== '__new__') {
        personId = selectedVal;
        const p = window.storage.getPerson(personId);
        if (p) {
          personName = p.name;
        } else {
          const opt = els.momentInputPerson.selectedOptions && els.momentInputPerson.selectedOptions[0];
          if (opt && opt.dataset.name) {
            personName = opt.dataset.name;
          }
        }
      }
    }

    window.storage.saveMoment({
      id,
      title,
      location,
      category,
      personId,
      personName,
      story,
      feeling,
      date
    });

    closeModal(els.modalMoment);
    renderMomentsView();
    renderPeopleView();
    renderDashboardMoment();
    showToast(window.i18n.t('moment_saved_alert'), 'success');
  }

  function confirmDeleteMoment(momentId) {
    if (confirm(window.i18n.t('confirm_delete_moment'))) {
      window.storage.deleteMoment(momentId);
      renderMomentsView();
      renderPeopleView();
      renderDashboardMoment();
    }
  }

  // --- REAL-LIFE CONNECTIONS & RELATIONSHIP PROGRESSION ---
  let activePeopleFilter = 'all';
  const STAGE_ORDER = ['spontaneous', 'casual', 'regular', 'close', 'romantic'];

  function getStageConfig(stage) {
    const isDe = window.storage.getLanguage() === 'de';
    const configs = {
      spontaneous: { level: 1, percent: 20, icon: '⚡', class: 'spontaneous', name: isDe ? 'Einmaliger Funke' : 'One-Time Spark' },
      casual: { level: 2, percent: 40, icon: '👋', class: 'casual', name: isDe ? 'Flüchtige Bekanntschaft' : 'Casual Acquaintance' },
      regular: { level: 3, percent: 60, icon: '☕', class: 'regular', name: isDe ? 'Regelmäßiger Kontakt' : 'Regular Contact' },
      close: { level: 4, percent: 80, icon: '🤝', class: 'close', name: isDe ? 'Engere Verbindung' : 'Close Connection' },
      romantic: { level: 5, percent: 100, icon: '❤️', class: 'romantic', name: isDe ? 'Romantisches Interesse' : 'Romantic Interest' }
    };
    return configs[stage] || configs.casual;
  }

  function calculateAge(dobStr) {
    if (!dobStr) return null;
    const birth = new Date(dobStr);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  }

  function getDaysUntilBirthday(dobStr) {
    if (!dobStr) return null;
    const birth = new Date(dobStr);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisYearBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    let diffMs = thisYearBday.getTime() - today.getTime();
    if (diffMs < 0) {
      const nextYearBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
      diffMs = nextYearBday.getTime() - today.getTime();
    }
    const days = Math.ceil(diffMs / (24 * 3600 * 1000));
    return (days >= 0 && days <= 30) ? days : null;
  }

  function setupPeople() {
    // Segment button
    if (els.segBtnPeople) {
      els.segBtnPeople.addEventListener('click', () => switchJournalSubTab('people'));
    }

    // Add Person button
    if (els.btnAddPerson) {
      els.btnAddPerson.addEventListener('click', () => openAddPersonModal());
    }

    // Moment person select change (handle quick create)
    if (els.momentInputPerson) {
      els.momentInputPerson.addEventListener('change', () => {
        if (els.momentInputPerson.value === '__new__') {
          openAddPersonModal();
          els.momentInputPerson.value = '';
        }
      });
    }

    // Stage Selector in Modal
    if (els.personStagePills) {
      els.personStagePills.forEach(pill => {
        pill.addEventListener('click', () => {
          els.personStagePills.forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          if (els.personInputStage) {
            els.personInputStage.value = pill.dataset.stage;
          }
        });
      });
    }

    // Form submit
    if (els.formPersonEdit) {
      els.formPersonEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        savePersonFromModal();
      });
    }
  }

  function advancePersonStage(personId) {
    const person = window.storage.getPerson(personId);
    if (!person) return;
    const currentIndex = STAGE_ORDER.indexOf(person.stage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1];
      window.storage.setPersonStage(personId, nextStage);
      renderPeopleView();
      renderDashboardShowcase();
    }
  }

  function demotePersonStage(personId) {
    const person = window.storage.getPerson(personId);
    if (!person) return;
    const currentIndex = STAGE_ORDER.indexOf(person.stage);
    if (currentIndex > 0) {
      const prevStage = STAGE_ORDER[currentIndex - 1];
      window.storage.setPersonStage(personId, prevStage);
      renderPeopleView();
      renderDashboardShowcase();
    }
  }

  function setPersonExactStage(personId, newStage) {
    const person = window.storage.getPerson(personId);
    if (!person) return;
    window.storage.setPersonStage(personId, newStage);
    renderPeopleView();
    renderDashboardShowcase();
  }

  function renderPeopleView() {
    const allPeople = window.storage.getPeople();
    const count = allPeople.length;

    // Update segment button label
    if (els.journalPeopleTabLabel) {
      els.journalPeopleTabLabel.textContent = count > 0
        ? window.i18n.t('journal_tab_people', { count })
        : window.i18n.t('journal_tab_people_zero');
    }

    // Render Filter Bar
    renderPeopleFilterBar(allPeople);

    // Filter people
    const filteredPeople = window.storage.getPeople(activePeopleFilter);

    if (!els.peopleList) return;
    els.peopleList.innerHTML = '';

    if (filteredPeople.length === 0) {
      els.peopleList.innerHTML = `
        <div class="checkin-entry-card text-center" style="padding: 32px 20px; grid-column: 1 / -1;">
          <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.9rem;">
            ${window.i18n.t('people_empty')}
          </p>
          <button class="pill-btn primary" id="btn-empty-add-person">
            ${window.i18n.t('btn_add_person')}
          </button>
        </div>
      `;
      const btn = document.getElementById('btn-empty-add-person');
      if (btn) btn.addEventListener('click', () => openAddPersonModal());
      return;
    }

    filteredPeople.forEach(person => {
      const card = createPersonCardElement(person);
      els.peopleList.appendChild(card);
    });
  }

  function renderPeopleFilterBar(allPeople) {
    if (!els.peopleFilterBar) return;
    els.peopleFilterBar.innerHTML = '';

    // "All Connections" Chip
    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = `stories-filter-chip ${activePeopleFilter === 'all' ? 'active' : ''}`;
    allChip.innerHTML = `<span>${window.i18n.t('people_filter_all')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${allPeople.length})</span>`;
    allChip.addEventListener('click', () => {
      activePeopleFilter = 'all';
      renderPeopleView();
    });
    els.peopleFilterBar.appendChild(allChip);

    // Stage Chips
    STAGE_ORDER.forEach(stage => {
      const count = allPeople.filter(p => p.stage === stage).length;
      if (count === 0) return;

      const cfg = getStageConfig(stage);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `stories-filter-chip ${activePeopleFilter === stage ? 'active' : ''}`;
      chip.innerHTML = `<span>${cfg.icon} ${escapeHtml(cfg.name)}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${count})</span>`;
      chip.addEventListener('click', () => {
        activePeopleFilter = stage;
        renderPeopleView();
      });
      els.peopleFilterBar.appendChild(chip);
    });
  }

  function createPersonCardElement(person) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.id = `person-card-${person.id}`;

    const cfg = getStageConfig(person.stage);
    const initial = (person.name || '?').charAt(0).toUpperCase();

    // Birthday & Age
    let bdayHtml = '';
    if (person.dob) {
      const formattedBday = formatDateShort(person.dob);
      const age = calculateAge(person.dob);
      const ageStr = age !== null ? window.i18n.t('person_age_label', { age }) : '';
      const daysUntil = getDaysUntilBirthday(person.dob);
      const upcomingBadge = daysUntil !== null
        ? `<span class="person-bday-badge">${window.i18n.t('person_upcoming_bday', { days: daysUntil })}</span>`
        : '';

      bdayHtml = `
        <div class="person-detail-row">
          <span>🎂</span>
          <span>${window.i18n.t('person_dob_label', { dob: formattedBday })} ${ageStr}</span>
          ${upcomingBadge}
        </div>
      `;
    } else {
      bdayHtml = `
        <div class="person-detail-row">
          <button type="button" class="person-quick-add-link" data-quick-edit="${person.id}" data-focus="dob">
            ${window.i18n.t('person_quick_add_dob')}
          </button>
        </div>
      `;
    }

    // Met At
    const metHtml = person.metAt ? `
      <div class="person-detail-row">
        <span>📍</span>
        <span>${window.i18n.t('person_met_at_label', { loc: escapeHtml(person.metAt) })}</span>
      </div>
    ` : '';

    // Contact
    let contactHtml = '';
    if (person.contact) {
      contactHtml = `
        <div class="person-detail-row">
          <span>📱</span>
          <span>${escapeHtml(person.contact)}</span>
        </div>
      `;
    } else {
      contactHtml = `
        <div class="person-detail-row">
          <button type="button" class="person-quick-add-link" data-quick-edit="${person.id}" data-focus="contact">
            ${window.i18n.t('person_quick_add_contact')}
          </button>
        </div>
      `;
    }

    // Notes
    let notesHtml = '';
    if (person.notes) {
      notesHtml = `
        <div class="person-notes-box">
          "${escapeHtml(person.notes)}"
        </div>
      `;
    } else {
      notesHtml = `
        <div class="person-detail-row">
          <button type="button" class="person-quick-add-link" data-quick-edit="${person.id}" data-focus="notes">
            ${window.i18n.t('person_quick_add_notes')}
          </button>
        </div>
      `;
    }

    // Encounters history
    const encounters = window.storage.getMomentsForPerson(person.id);
    let encountersToggleHtml = '';
    if (encounters.length > 0) {
      const countText = encounters.length === 1
        ? window.i18n.t('person_encounters_count_single')
        : window.i18n.t('person_encounters_count', { count: encounters.length });

      encountersToggleHtml = `
        <div class="person-timeline-wrap">
          <button type="button" class="person-timeline-toggle" data-toggle-timeline="${person.id}">
            ✨ ${countText} ▾
          </button>
          <div class="person-encounters-mini-list hidden" id="timeline-${person.id}">
            ${encounters.map(e => `
              <div class="person-mini-encounter">
                <div class="person-mini-encounter-date">${formatDateShort(e.date)} · ${escapeHtml(e.location || 'Offline')}</div>
                <div>"${escapeHtml(e.story)}"</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      encountersToggleHtml = `
        <div class="person-timeline-wrap" style="opacity: 0.7; font-size: 0.75rem;">
          ${window.i18n.t('person_encounters_count_zero')}
        </div>
      `;
    }

    // Progression level label
    const progLabel = window.i18n.t('progression_level', {
      level: cfg.level,
      stage: cfg.name,
      percent: cfg.percent
    });

    card.innerHTML = `
      <div class="person-card-header">
        <div class="person-identity">
          <div class="person-avatar">${escapeHtml(initial)}</div>
          <div class="person-title-wrap">
            <h4 class="person-name">${escapeHtml(person.name)}</h4>
            <span class="person-stage-badge ${cfg.class}">
              <span>${cfg.icon}</span>
              <span>${escapeHtml(cfg.name)}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Progression Meter -->
      <div class="progression-card-box">
        <div class="progression-header-row">
          <span class="progression-label">${progLabel}</span>
          <div class="progression-quick-actions">
            ${cfg.level > 1 ? `<button type="button" class="progression-step-btn" data-demote-person="${person.id}" title="Adjust Stage">▼</button>` : ''}
            ${cfg.level < 5 ? `<button type="button" class="progression-step-btn" data-advance-person="${person.id}" title="Deepen Stage">▲ ${window.i18n.t('btn_advance_stage')}</button>` : ''}
          </div>
        </div>
        <div class="progression-track">
          <div class="progression-fill stage-${person.stage}"></div>
        </div>
        <div class="progression-steps-dots">
          ${STAGE_ORDER.map((stg) => {
            const stepCfg = getStageConfig(stg);
            const isActive = stg === person.stage;
            return `<button type="button" class="progression-dot ${isActive ? 'active' : ''}" data-set-stage="${stg}" data-person="${person.id}" title="${escapeHtml(stepCfg.name)}" aria-label="${escapeHtml(stepCfg.name)}">
              <span class="prog-dot-icon">${stepCfg.icon}</span>
              <span class="prog-dot-text">${escapeHtml(stepCfg.name)}</span>
            </button>`;
          }).join('')}
        </div>
      </div>

      <!-- Evolving Details -->
      <div class="person-details-grid">
        ${bdayHtml}
        ${metHtml}
        ${contactHtml}
        ${notesHtml}
        ${encountersToggleHtml}
      </div>

      <!-- Card Footer -->
      <div class="person-card-footer">
        <div class="person-footer-left">
          <button type="button" class="pill-btn primary" style="font-size: 0.78rem; padding: 6px 14px;" data-log-moment-person="${person.id}">
            ${window.i18n.t('person_btn_add_encounter')}
          </button>
        </div>
        <div class="person-footer-right">
          <button type="button" class="story-footer-btn" data-edit-person="${person.id}">
            ✏️ ${window.i18n.t('person_btn_edit')}
          </button>
          <button type="button" class="story-footer-btn danger" data-delete-person="${person.id}">
            🗑️ ${window.i18n.t('person_btn_delete')}
          </button>
        </div>
      </div>
    `;

    // Event listeners on card elements
    const advanceBtn = card.querySelector(`[data-advance-person="${person.id}"]`);
    if (advanceBtn) advanceBtn.addEventListener('click', () => advancePersonStage(person.id));

    const demoteBtn = card.querySelector(`[data-demote-person="${person.id}"]`);
    if (demoteBtn) demoteBtn.addEventListener('click', () => demotePersonStage(person.id));

    card.querySelectorAll(`[data-set-stage][data-person="${person.id}"]`).forEach(dot => {
      dot.addEventListener('click', () => setPersonExactStage(person.id, dot.dataset.setStage));
    });

    const editBtn = card.querySelector(`[data-edit-person="${person.id}"]`);
    if (editBtn) editBtn.addEventListener('click', () => openEditPersonModal(person.id));

    const deleteBtn = card.querySelector(`[data-delete-person="${person.id}"]`);
    if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeletePerson(person.id));

    const logEncounterBtn = card.querySelector(`[data-log-moment-person="${person.id}"]`);
    if (logEncounterBtn) logEncounterBtn.addEventListener('click', () => openAddMomentModal(person.id));

    const toggleBtn = card.querySelector(`[data-toggle-timeline="${person.id}"]`);
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const miniList = document.getElementById(`timeline-${person.id}`);
        if (miniList) {
          const isHidden = miniList.classList.toggle('hidden');
          toggleBtn.textContent = isHidden
            ? `✨ ${encounters.length} encounter(s) ▾`
            : `✨ ${encounters.length} encounter(s) ▴`;
        }
      });
    }

    card.querySelectorAll(`[data-quick-edit="${person.id}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        openEditPersonModal(person.id, btn.dataset.focus);
      });
    });

    return card;
  }

  function openAddPersonModal() {
    if (!els.modalPerson) return;

    els.personModalTitle.textContent = window.i18n.t('person_modal_title_add');
    els.personEditId.value = '';
    els.personInputName.value = '';
    els.personInputDob.value = '';
    els.personInputMetAt.value = '';
    els.personInputContact.value = '';
    els.personInputNotes.value = '';

    if (els.personInputStage) els.personInputStage.value = 'casual';
    if (els.personStagePills) {
      els.personStagePills.forEach(p => p.classList.toggle('selected', p.dataset.stage === 'casual'));
    }

    openModal(els.modalPerson);
  }

  function openEditPersonModal(personId, focusField = null) {
    const person = window.storage.getPerson(personId);
    if (!person) return;

    els.personModalTitle.textContent = window.i18n.t('person_modal_title_edit');
    els.personEditId.value = person.id;
    els.personInputName.value = person.name || '';
    els.personInputDob.value = person.dob || '';
    els.personInputMetAt.value = person.metAt || '';
    els.personInputContact.value = person.contact || '';
    els.personInputNotes.value = person.notes || '';

    const stage = person.stage || 'casual';
    if (els.personInputStage) els.personInputStage.value = stage;
    if (els.personStagePills) {
      els.personStagePills.forEach(p => p.classList.toggle('selected', p.dataset.stage === stage));
    }

    openModal(els.modalPerson);

    if (focusField === 'dob' && els.personInputDob) setTimeout(() => els.personInputDob.focus(), 150);
    if (focusField === 'contact' && els.personInputContact) setTimeout(() => els.personInputContact.focus(), 150);
    if (focusField === 'notes' && els.personInputNotes) setTimeout(() => els.personInputNotes.focus(), 150);
  }

  function savePersonFromModal() {
    const id = els.personEditId.value || `person-${Date.now()}`;
    const name = els.personInputName.value.trim();
    const stage = els.personInputStage.value || 'casual';
    const dob = els.personInputDob.value || '';
    const metAt = els.personInputMetAt.value.trim();
    const contact = els.personInputContact.value.trim();
    const notes = els.personInputNotes.value.trim();

    if (!name) {
      showToast(window.i18n.t('alert_person_missing_name'), 'warning');
      return;
    }

    window.storage.savePerson({
      id,
      name,
      stage,
      dob,
      metAt,
      contact,
      notes
    });

    closeModal(els.modalPerson);
    renderPeopleView();
    renderDashboardShowcase();
    showToast(window.i18n.t('person_saved_alert'), 'success');
  }

  function confirmDeletePerson(personId) {
    if (confirm(window.i18n.t('confirm_delete_person'))) {
      window.storage.deletePerson(personId);
      renderPeopleView();
      renderMomentsView();
      renderDashboardShowcase();
    }
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
          showToast(window.i18n.t('backup_copied_alert'), 'success');
        } catch (err) {
          showToast(window.i18n.t('backup_copy_fail_alert'), 'warning');
        }
      });
    }

    // Restore Backup — button programmatically triggers the hidden file input
    // (iOS Safari PWA blocks label+display:none pattern; programmatic .click() works instead)
    if (els.btnRestoreBackup && els.fileImportBackup) {
      els.btnRestoreBackup.addEventListener('click', () => {
        els.fileImportBackup.click();
      });

      els.fileImportBackup.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const result = window.storage.importDataFromJSON(content);

          // Reset so the same file can be re-selected next time
          els.fileImportBackup.value = '';

          if (result.success) {
            // Re-render entire UI with restored data
            renderAll();

            // Re-apply language & theme from the imported backup
            const restoredLang = window.storage.getLanguage();
            const restoredTheme = window.storage.data.theme || 'claude-light';
            applyLanguage(restoredLang, true);
            applyTheme(restoredTheme);

            closeModal(els.modalSettings);
            showToast(window.i18n.t('backup_restored_alert', { count: result.count }), 'success');
          } else {
            showToast(window.i18n.t('backup_restore_error_alert', { error: result.error }), 'warning');
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
      showToast(window.i18n.t('alert_app_missing_fields'), 'warning');
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

    // Anti-Craving Reality Check Story Showcase
    if (els.sosStoryShowcase) {
      let stories = [];
      if (selectedId) {
        stories = window.storage.getStoriesForApp(selectedId);
      }
      if (stories.length === 0) {
        stories = window.storage.getStories();
      }

      if (stories.length > 0) {
        const story = stories[0];
        els.sosStoryShowcase.classList.remove('hidden');

        if (els.sosStoryLabel) {
          els.sosStoryLabel.textContent = (story.appName && story.appName !== 'General')
            ? window.i18n.t('sos_story_label', { app: story.appName })
            : window.i18n.t('sos_story_general_label');
        }

        if (els.sosStoryPerson) {
          if (story.personName) {
            els.sosStoryPerson.innerHTML = window.i18n.t('story_person_label', { name: `<strong>${escapeHtml(story.personName)}</strong>` });
            els.sosStoryPerson.style.display = 'block';
          } else {
            els.sosStoryPerson.style.display = 'none';
          }
        }

        if (els.sosStoryText) {
          els.sosStoryText.textContent = `"${story.story}"`;
        }

        if (els.sosStoryLessonText) {
          els.sosStoryLessonText.textContent = story.lesson;
        }
      } else {
        els.sosStoryShowcase.classList.add('hidden');
      }
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
        showToast(window.i18n.t('journal_saved_alert'), 'success');
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
          showToast(window.i18n.t('link_copied_alert', { url: targetUrl }), 'success');
        } catch (e) {
          showToast('URL: ' + targetUrl, 'info');
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

  let toastTimer = null;
  function showToast(message, type = 'info') {
    if (!message) return;
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    container.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    let icon = '✨';
    if (type === 'success') icon = '✓';
    else if (type === 'warning') icon = '⚠️';
    else if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    }, 2200);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
