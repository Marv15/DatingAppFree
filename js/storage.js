// Data storage and state management for Dating App Free
// Designed with persistence safeguards for iOS Safari and zero data loss across updates.

const STORAGE_KEY = 'dating_app_free_data_v2';
const BACKUP_KEY = 'dating_app_free_auto_backup';
const CURRENT_SCHEMA_VERSION = 2;

// Default initial state for new users
function getDefaultState() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
    currency: '€',
    theme: 'claude-light',
    language: (typeof window !== 'undefined' && window.i18n) ? window.i18n.detectDefaultLanguage() : 'en',
    apps: [
      {
        id: 'tinder',
        name: 'Tinder',
        color: '#FD3A73',
        icon: 'icons/tinder_logo.svg',
        quitDate: new Date(now - 14 * day - 8 * 3600 * 1000).toISOString(),
        dailyMinutes: 45,
        monthlyCost: 24.99,
        swipesPerDay: 120,
        motivation: 'Mindless dopamine scrolling and superficial snap judgments. Tired of feeling like a product on a catalog.',
        active: true,
        history: []
      },
      {
        id: 'bumble',
        name: 'Bumble',
        color: '#F4B400',
        icon: 'icons/bumble_logo.svg',
        quitDate: new Date(now - 7 * day - 4 * 3600 * 1000).toISOString(),
        dailyMinutes: 30,
        monthlyCost: 19.99,
        swipesPerDay: 70,
        motivation: 'Tired of 24h countdown anxiety and conversations that dry up after two exchanges.',
        active: true,
        history: []
      },
      {
        id: 'hinge',
        name: 'Hinge',
        color: '#60221E',
        icon: 'icons/hinge_logo.svg',
        quitDate: new Date(now - 3 * day - 12 * 3600 * 1000).toISOString(),
        dailyMinutes: 45,
        monthlyCost: 29.99,
        swipesPerDay: 60,
        motivation: 'Felt like a second unpaid job. Crafting prompt answers and scheduling dates with people who flake at the last minute.',
        active: true,
        history: []
      }
    ],
    checkIns: [
      {
        id: 'chk-1',
        timestamp: new Date(now - 2 * day).toISOString(),
        mood: 'peaceful',
        moodLabel: 'Peaceful',
        emoji: '🌿',
        note: 'Deleted the last app. Felt immediate relief when picking up my phone.'
      },
      {
        id: 'chk-2',
        timestamp: new Date(now - 1 * day).toISOString(),
        mood: 'proud',
        moodLabel: 'Proud',
        emoji: '✨',
        note: 'Had an urge to scroll while on the train, but read a book chapter instead.'
      }
    ]
  };
}

class StorageService {
  constructor() {
    this.data = this.loadData();
    this.initPersistence();
  }

  // Request persistent storage from iOS Safari / mobile browsers to prevent eviction
  async initPersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`[Storage] Persistent storage granted: ${isPersisted}`);
      }
    } catch (e) {
      console.warn('[Storage] Could not request persistence', e);
    }
  }

  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Check for v1 data to migrate
        const oldV1 = localStorage.getItem('dating_app_free_data_v1');
        if (oldV1) {
          const parsedV1 = JSON.parse(oldV1);
          const migrated = this.migrateV1toV2(parsedV1);
          this.saveData(migrated);
          return migrated;
        }

        // Fresh install
        const defaults = getDefaultState();
        this.saveData(defaults);
        return defaults;
      }

      const parsed = JSON.parse(raw);
      return this.validateAndMigrate(parsed);
    } catch (e) {
      console.error('[Storage] Error loading data, attempting backup recovery:', e);
      return this.recoverFromBackup() || getDefaultState();
    }
  }

  validateAndMigrate(data) {
    if (!data || typeof data !== 'object') {
      return getDefaultState();
    }

    // Ensure essential arrays exist
    if (!Array.isArray(data.apps)) data.apps = [];
    if (!Array.isArray(data.checkIns)) data.checkIns = [];
    if (!data.currency) data.currency = '€';
    if (!data.theme) data.theme = 'claude-light';
    if (!data.language || (data.language !== 'de' && data.language !== 'en')) {
      data.language = (typeof window !== 'undefined' && window.i18n) ? window.i18n.detectDefaultLanguage() : 'en';
    }

    // Sanitize any legacy mood labels
    if (Array.isArray(data.checkIns)) {
      data.checkIns.forEach(c => {
        if (c.mood === 'calm') c.mood = 'peaceful';
        if (c.moodLabel === 'mood_calm' || c.moodLabel === 'calm') c.moodLabel = 'Peaceful';
        if (c.moodLabel === 'mood_proud') c.moodLabel = 'Proud';
      });
    }

    // Upgrade schema if needed
    data.schemaVersion = CURRENT_SCHEMA_VERSION;
    data.lastUpdated = new Date().toISOString();

    return data;
  }

  migrateV1toV2(oldData) {
    const defaults = getDefaultState();
    if (oldData.quitDate) {
      defaults.apps[0].quitDate = oldData.quitDate;
    }
    if (oldData.reasons && Array.isArray(oldData.reasons)) {
      defaults.apps[0].motivation = oldData.reasons.join('. ');
    }
    return defaults;
  }

  saveData(data = this.data) {
    try {
      data.lastUpdated = new Date().toISOString();
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);

      // Keep redundant safety copy for recovery
      localStorage.setItem(BACKUP_KEY, serialized);
      this.data = data;
    } catch (e) {
      console.error('[Storage] Error saving data:', e);
    }
  }

  recoverFromBackup() {
    try {
      const backupRaw = localStorage.getItem(BACKUP_KEY);
      if (backupRaw) {
        const parsed = JSON.parse(backupRaw);
        console.warn('[Storage] Restored data successfully from backup snapshot.');
        return parsed;
      }
    } catch (e) {
      console.error('[Storage] Backup recovery failed:', e);
    }
    return null;
  }

  // --- App Management ---

  getApps() {
    return this.data.apps || [];
  }

  getActiveApps() {
    return (this.data.apps || []).filter(a => a.active);
  }

  getApp(id) {
    return (this.data.apps || []).find(a => a.id === id);
  }

  saveApp(appData) {
    const apps = [...(this.data.apps || [])];
    const index = apps.findIndex(a => a.id === appData.id);
    const isNeverPaid = Boolean(appData.neverPaid || Number(appData.monthlyCost) === 0);
    const resolvedCost = isNeverPaid ? 0 : (Number(appData.monthlyCost) || 0);

    if (index >= 0) {
      apps[index] = {
        ...apps[index],
        ...appData,
        monthlyCost: resolvedCost,
        neverPaid: isNeverPaid
      };
    } else {
      apps.push({
        id: appData.id || `app-${Date.now()}`,
        name: appData.name || 'Custom App',
        color: appData.color || '#CC785C',
        icon: appData.icon || null,
        quitDate: appData.quitDate || new Date().toISOString(),
        dailyMinutes: Number(appData.dailyMinutes) || 45,
        monthlyCost: resolvedCost,
        neverPaid: isNeverPaid,
        swipesPerDay: Number(appData.swipesPerDay) || 100,
        motivation: appData.motivation || '',
        active: true,
        history: []
      });
    }

    this.data.apps = apps;
    this.saveData();
    return this.data.apps;
  }

  deleteApp(id) {
    this.data.apps = (this.data.apps || []).filter(a => a.id !== id);
    this.saveData();
    return this.data.apps;
  }

  resetApp(id, reason = 'Slipped up') {
    const app = this.getApp(id);
    if (!app) return;

    const previousStreakDuration = Date.now() - new Date(app.quitDate).getTime();
    if (!app.history) app.history = [];
    app.history.push({
      quitDate: app.quitDate,
      resetDate: new Date().toISOString(),
      durationMs: Math.max(0, previousStreakDuration),
      reason
    });

    // Reset quit date to now
    app.quitDate = new Date().toISOString();
    this.saveData();
  }

  // --- Overall Calculation ---
  // The overall progress starts with the LAST app that was used / most recently quit.
  getOverallQuitDate() {
    const active = this.getActiveApps();
    if (active.length === 0) {
      return new Date().toISOString();
    }

    // Find the latest quit timestamp (the most recent date = max timestamp)
    const timestamps = active.map(a => new Date(a.quitDate).getTime());
    const latestTimestamp = Math.max(...timestamps);
    return new Date(latestTimestamp).toISOString();
  }

  getOverallStats() {
    const now = Date.now();
    const activeApps = this.getActiveApps();
    const overallQuitDate = this.getOverallQuitDate();
    const overallMs = Math.max(0, now - new Date(overallQuitDate).getTime());

    let totalMinutesSaved = 0;
    let totalMoneySaved = 0;
    let totalSwipesAvoided = 0;

    activeApps.forEach(app => {
      const appMs = Math.max(0, now - new Date(app.quitDate).getTime());
      const appDays = appMs / (1000 * 60 * 60 * 24);

      // Minutes saved = (dailyMinutes * appDays)
      totalMinutesSaved += (app.dailyMinutes || 0) * appDays;

      // Money saved = (monthlyCost / 30.44 * appDays)
      totalMoneySaved += ((app.monthlyCost || 0) / 30.4375) * appDays;

      // Swipes avoided
      totalSwipesAvoided += (app.swipesPerDay || 0) * appDays;
    });

    const totalHoursSaved = totalMinutesSaved / 60;
    const booksReadEquivalent = totalHoursSaved / 5; // 5 hours avg per book
    const workoutsEquivalent = totalHoursSaved / 1.25; // 1h 15m per gym workout

    return {
      overallQuitDate,
      overallMs,
      activeAppsCount: activeApps.length,
      totalHoursSaved: Math.round(totalHoursSaved * 10) / 10,
      totalMoneySaved: Math.round(totalMoneySaved * 100) / 100,
      totalSwipesAvoided: Math.round(totalSwipesAvoided),
      booksReadEquivalent: Math.round(booksReadEquivalent * 10) / 10,
      workoutsEquivalent: Math.round(workoutsEquivalent * 10) / 10,
      currency: this.data.currency || '€'
    };
  }

  // --- Check-Ins ---

  getCheckIns() {
    return (this.data.checkIns || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addCheckIn(entry) {
    const newEntry = {
      id: `chk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood: entry.mood,
      moodLabel: entry.moodLabel,
      emoji: entry.emoji,
      note: entry.note || ''
    };

    this.data.checkIns = [newEntry, ...(this.data.checkIns || [])];
    this.saveData();
    return newEntry;
  }

  deleteCheckIn(id) {
    this.data.checkIns = (this.data.checkIns || []).filter(c => c.id !== id);
    this.saveData();
  }

  // --- Backup & Safe Restore ---

  exportDataAsJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importDataFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.apps)) {
        throw new Error('Invalid backup data format. Missing apps list.');
      }

      // Snapshot current data just in case
      localStorage.setItem(`${BACKUP_KEY}_before_import`, JSON.stringify(this.data));

      this.data = this.validateAndMigrate(parsed);
      this.saveData();
      return { success: true, count: this.data.apps.length };
    } catch (e) {
      console.error('[Storage] Failed to import data:', e);
      return { success: false, error: e.message };
    }
  }

  setTheme(theme) {
    this.data.theme = theme;
    this.saveData();
  }

  setCurrency(currency) {
    this.data.currency = currency;
    this.saveData();
  }

  getLanguage() {
    return this.data.language || 'en';
  }

  setLanguage(lang) {
    this.data.language = (lang === 'de') ? 'de' : 'en';
    this.saveData();
  }
}

// Global singleton instance
window.storage = new StorageService();
