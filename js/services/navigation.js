// Navigation Router Service
// Manages active tab state, tab switching, and view visibility.

let currentTab = 'dashboard';
const tabRenderHandlers = {};

export function getCurrentTab() {
  return currentTab;
}

export function registerTabRenderer(tab, callback) {
  if (!tabRenderHandlers[tab]) {
    tabRenderHandlers[tab] = [];
  }
  tabRenderHandlers[tab].push(callback);
}

export function switchTab(tab) {
  currentTab = tab;

  // Update navigation buttons
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

  // Toggle view containers
  const viewDashboard = document.getElementById('view-dashboard');
  const viewApps = document.getElementById('view-apps');
  const viewMilestones = document.getElementById('view-milestones');
  const viewJournal = document.getElementById('view-journal');

  if (viewDashboard) viewDashboard.classList.toggle('hidden', tab !== 'dashboard');
  if (viewApps) viewApps.classList.toggle('hidden', tab !== 'apps');
  if (viewMilestones) viewMilestones.classList.toggle('hidden', tab !== 'milestones');
  if (viewJournal) viewJournal.classList.toggle('hidden', tab !== 'journal');

  // Trigger registered tab renderers
  if (tabRenderHandlers[tab]) {
    tabRenderHandlers[tab].forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error(`Error rendering tab ${tab}:`, err);
      }
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });
}

// Global backward compatibility shim
if (typeof window !== 'undefined') {
  window.switchTab = switchTab;
}
