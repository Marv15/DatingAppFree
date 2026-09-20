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
    ],
    stories: [
      {
        id: 'story-1',
        appId: 'hinge',
        appName: 'Hinge',
        personName: 'Sarah',
        incidentType: 'stood_up',
        date: new Date(now - 6 * day).toISOString().slice(0, 10),
        story: 'Texted back and forth for nearly three weeks. Planned dinner on a Friday night, and 45 minutes before meeting she unmatched without a word.',
        lesson: 'Dating apps turn real humans into disposable notifications with zero accountability.'
      },
      {
        id: 'story-2',
        appId: 'tinder',
        appName: 'Tinder',
        personName: 'Alex',
        incidentType: 'ghosting',
        date: new Date(now - 16 * day).toISOString().slice(0, 10),
        story: 'Had a great 3-hour first date, talked about our favorite music, and said we would meet again next weekend. Sent one follow-up text and never heard back.',
        lesson: 'The endless illusion of "someone slightly better just one swipe away" kills genuine appreciation.'
      }
    ],
    moments: [
      {
        id: 'moment-1',
        title: 'Spontaneous chat waiting for coffee',
        location: 'Local Café',
        category: 'conversation',
        personId: null,
        personName: '',
        date: new Date(now - 1 * day).toISOString().slice(0, 10),
        story: 'Instead of staring down at my phone while waiting for my flat white, I smiled and complimented someone on their vintage coat. We ended up having a lovely 5-minute chat about secondhand shops.',
        feeling: 'A spontaneous 5-minute real conversation gave me more genuine warmth than hundreds of matches on an app.'
      },
      {
        id: 'moment-2',
        title: 'Shared laugh in the bookstore',
        location: 'Bookstore',
        category: 'spark',
        personId: 'person-1',
        personName: 'Elena',
        date: new Date(now - 4 * day).toISOString().slice(0, 10),
        story: 'We both reached for the same photography art book at the same time and laughed. We exchanged names and talked about film cameras for 15 minutes before parting with a genuine smile.',
        feeling: 'Real eye contact and shared laughter can never be simulated by an algorithm.'
      }
    ],
    people: [
      {
        id: 'person-1',
        name: 'Elena',
        stage: 'close', // 'spontaneous' | 'casual' | 'regular' | 'close' | 'romantic'
        dob: '1997-06-15',
        metAt: 'City Center Bookstore',
        contact: '@elena_film',
        notes: 'Met by the photography book section. Loves 35mm film cameras, vintage art books, and iced oat matcha. Has a rescue cat named Oliver.',
        createdAt: new Date(now - 4 * day).toISOString(),
        updatedAt: new Date(now - 1 * day).toISOString()
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
    if (!Array.isArray(data.stories)) {
      data.stories = getDefaultState().stories || [];
    }
    if (!Array.isArray(data.moments)) {
      data.moments = getDefaultState().moments || [];
    }
    if (!Array.isArray(data.people)) {
      data.people = getDefaultState().people || [];
    }
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

  // --- Dating App Stories & Reality Checks ---

  getStories(filterAppId = null) {
    const list = this.data.stories || [];
    if (filterAppId && filterAppId !== 'all') {
      return list.filter(s => s.appId === filterAppId || (s.appName && s.appName.toLowerCase() === filterAppId.toLowerCase()));
    }
    return [...list];
  }

  getStory(id) {
    return (this.data.stories || []).find(s => s.id === id);
  }

  getStoriesForApp(appId) {
    if (!appId) return [];
    return (this.data.stories || []).filter(s => 
      s.appId === appId || 
      (s.appName && s.appName.toLowerCase() === appId.toLowerCase())
    );
  }

  saveStory(storyData) {
    const stories = [...(this.data.stories || [])];
    const index = stories.findIndex(s => s.id === storyData.id);

    const record = {
      id: storyData.id || `story-${Date.now()}`,
      appId: storyData.appId || 'general',
      appName: storyData.appName || 'General',
      personName: storyData.personName ? storyData.personName.trim() : '',
      incidentType: storyData.incidentType || 'ghosting',
      date: storyData.date || new Date().toISOString().slice(0, 10),
      story: storyData.story ? storyData.story.trim() : '',
      lesson: storyData.lesson ? storyData.lesson.trim() : '',
      createdAt: storyData.createdAt || new Date().toISOString()
    };

    if (index >= 0) {
      stories[index] = { ...stories[index], ...record };
    } else {
      stories.unshift(record); // newest first
    }

    this.data.stories = stories;
    this.saveData();
    return record;
  }

  deleteStory(id) {
    this.data.stories = (this.data.stories || []).filter(s => s.id !== id);
    this.saveData();
    return this.data.stories;
  }

  // --- Real-Life Moments & Positive Motivation ---

  isMomentAssociated(moment) {
    if (!moment) return false;
    const hasId = moment.personId && String(moment.personId).trim() !== '' && moment.personId !== 'none';
    const hasName = moment.personName && String(moment.personName).trim() !== '';
    return Boolean(hasId || hasName);
  }

  getMoments(filterCategory = null) {
    const list = this.data.moments || [];
    if (!filterCategory || filterCategory === 'all') {
      return [...list];
    }
    if (filterCategory === 'unassociated' || filterCategory === 'standalone') {
      return list.filter(m => !this.isMomentAssociated(m));
    }
    if (filterCategory === 'with_person' || filterCategory === 'linked') {
      return list.filter(m => this.isMomentAssociated(m));
    }
    return list.filter(m => m.category === filterCategory);
  }

  getMoment(id) {
    return (this.data.moments || []).find(m => m.id === id);
  }

  saveMoment(momentData) {
    const moments = [...(this.data.moments || [])];
    const index = moments.findIndex(m => m.id === momentData.id);

    const record = {
      id: momentData.id || `moment-${Date.now()}`,
      title: momentData.title ? momentData.title.trim() : 'Real-World Moment',
      location: momentData.location ? momentData.location.trim() : 'Real World',
      category: momentData.category || 'conversation',
      personId: momentData.personId || null,
      personName: momentData.personName ? momentData.personName.trim() : '',
      date: momentData.date || new Date().toISOString().slice(0, 10),
      story: momentData.story ? momentData.story.trim() : '',
      feeling: momentData.feeling ? momentData.feeling.trim() : '',
      createdAt: momentData.createdAt || new Date().toISOString()
    };

    if (index >= 0) {
      moments[index] = { ...moments[index], ...record };
    } else {
      moments.unshift(record); // newest first
    }

    this.data.moments = moments;
    this.saveData();
    return record;
  }

  deleteMoment(id) {
    this.data.moments = (this.data.moments || []).filter(m => m.id !== id);
    this.saveData();
    return this.data.moments;
  }

  getRandomMoment(filterCategory = null) {
    const moments = this.getMoments(filterCategory);
    if (moments.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * moments.length);
    return moments[randomIndex];
  }

  // --- Real-Life People & Relationship Progression ---

  getPeople(filterStage = 'all') {
    const people = this.data.people || [];
    if (!filterStage || filterStage === 'all') {
      return [...people];
    }
    return people.filter(p => p.stage === filterStage);
  }

  getPerson(id) {
    if (!id) return null;
    return (this.data.people || []).find(p => p.id === id) || null;
  }

  savePerson(personData) {
    if (!this.data.people) this.data.people = [];
    const now = new Date().toISOString();
    const existingIndex = this.data.people.findIndex(p => p.id === personData.id);

    if (existingIndex >= 0) {
      this.data.people[existingIndex] = {
        ...this.data.people[existingIndex],
        ...personData,
        updatedAt: now
      };
      // Keep moment.personName synchronized if person is renamed
      if (personData.name && this.data.moments) {
        this.data.moments.forEach(m => {
          if (m.personId === personData.id) {
            m.personName = personData.name.trim();
          }
        });
      }
    } else {
      const newPerson = {
        id: personData.id || `person-${Date.now()}`,
        name: personData.name || 'Unnamed Connection',
        stage: personData.stage || 'casual',
        dob: personData.dob || '',
        metAt: personData.metAt || '',
        contact: personData.contact || '',
        notes: personData.notes || '',
        createdAt: now,
        updatedAt: now
      };
      this.data.people.unshift(newPerson);
    }

    this.saveData();
    return this.data.people;
  }

  deletePerson(id) {
    this.data.people = (this.data.people || []).filter(p => p.id !== id);
    // Disconnect linked moments so they don't break, keep them as one-time memories
    if (this.data.moments) {
      this.data.moments.forEach(m => {
        if (m.personId === id) {
          m.personId = null;
          m.personName = '';
        }
      });
    }
    this.saveData();
    return this.data.people;
  }

  setPersonStage(id, newStage) {
    const person = this.getPerson(id);
    if (!person) return null;
    person.stage = newStage;
    person.updatedAt = new Date().toISOString();
    this.saveData();
    return person;
  }

  getMomentsForPerson(personId) {
    if (!personId) return [];
    return (this.data.moments || []).filter(m => m.personId === personId);
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
