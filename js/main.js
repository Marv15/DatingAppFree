// Main Application Bootstrap & Controller
// Orchestrates modular views, services, state management, PWA lifecycle, and themes.

import { storage } from './services/storage.js';
import { t, setLanguage, translateDOM } from './services/i18n.js';
import { setupTheme, applyTheme } from './services/theme.js';
import { initPWA } from './services/pwa.js';
import { initTicker, updateTicker } from './components/ticker.js';
import { updateBreathingUI } from './components/breathing.js';
import { setupPhoneConnect } from './components/qr-generator.js';
import { setupSettings } from './components/settings.js';
import { injectModalTemplates } from './views/modals.templates.js';
import { setupAppsEvents, renderAppsView } from './views/apps.view.js';
import { renderMilestonesView } from './views/milestones.view.js';
import { setupStoriesEvents, renderStoriesView } from './views/stories.view.js';
import { setupMomentsEvents, renderMomentsView } from './views/moments.view.js';
import { setupPeopleEvents, renderPeopleView } from './views/people.view.js';
import { setupJournalEvents, renderJournalView, switchJournalSubTab } from './views/journal.view.js';
import { setupUrgeSos } from './views/urge-sos.view.js';
import { renderDashboard } from './views/dashboard.view.js';
import { setupNavigation, switchTab, registerTabRenderer } from './services/navigation.js';
import { setupModalDismissListeners, initGlobalKeyboardShortcuts } from './utils/dom.js';

export function renderAll() {
  translateDOM();
  updateTicker();
  renderDashboard();
  renderAppsView(() => {
    switchTab('journal');
    switchJournalSubTab('stories');
  });
  renderMilestonesView();
  renderJournalView();
  renderStoriesView();
  renderMomentsView();
  renderPeopleView();
  updateBreathingUI();
}

export function init() {
  // 1. Inject modular modal sheets dynamically into #modals-container
  injectModalTemplates();

  // 2. Initialize Theme (defaults to claude-light or persisted preference)
  setupTheme();

  // 3. Initialize Language & translate DOM
  const initialLang = storage.getLanguage();
  setLanguage(initialLang);
  translateDOM();

  // 4. Setup modal dismissal listeners & keyboard shortcuts (Escape key)
  setupModalDismissListeners();
  initGlobalKeyboardShortcuts();

  // 5. Setup Navigation router and register on-demand tab renderers
  registerTabRenderer('dashboard', () => renderDashboard());
  registerTabRenderer('apps', () => renderAppsView(() => {
    switchTab('journal');
    switchJournalSubTab('stories');
  }));
  registerTabRenderer('milestones', () => renderMilestonesView());
  registerTabRenderer('journal', () => {
    renderJournalView();
    renderStoriesView();
    renderMomentsView();
    renderPeopleView();
  });
  setupNavigation();

  // 6. Connect Quick Action Buttons in Shell
  const btnGotoApps = document.getElementById('btn-goto-apps');
  if (btnGotoApps) {
    btnGotoApps.addEventListener('click', () => switchTab('apps'));
  }

  // 7. Setup component and view event handlers
  setupAppsEvents();
  setupStoriesEvents();
  setupMomentsEvents();
  setupPeopleEvents();
  setupJournalEvents();
  setupUrgeSos();
  setupPhoneConnect();
  setupSettings((isFullRefresh) => {
    renderAll();
    if (isFullRefresh) {
      applyTheme(storage.data.theme || 'claude-light');
    }
  });

  // 8. Reactive Storage subscription: re-render UI whenever data changes
  storage.subscribe(() => {
    updateTicker();
  });

  // 9. Start live ticking interval (1s update for freedom counter, countdown, money saved)
  initTicker();

  // 10. Initialize Service Worker & PWA lifecycle
  initPWA();

  // 11. Initial complete UI render
  renderAll();
  switchTab('dashboard');
}

// Start application when DOM content is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Global backward-compatibility references for developer console and debugging
if (typeof window !== 'undefined') {
  window.renderAll = renderAll;
  window.switchTab = switchTab;
  window.storage = storage;
}
