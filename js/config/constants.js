// Configuration constants for Dating App Free
// Encapsulates default settings, realistic swipe rates, stage progressions, and categories.

export const STORAGE_KEY = 'dating_app_free_data_v2';
export const BACKUP_KEY = 'dating_app_free_auto_backup';
export const CURRENT_SCHEMA_VERSION = 2;

// Realistic swipe multipliers (swipes per active minute) based on app mechanics:
export const APP_SWIPE_RATES = {
  'tinder': 3.0,
  'badoo': 3.0,
  'grindr': 2.5,
  'bumble': 2.2,
  'lovoo': 2.5,
  'jaumo': 2.5,
  'fruitz': 2.2,
  'feeld': 1.6,
  'boo': 1.5,
  'okcupid': 1.4,
  'match': 1.4,
  'parship': 1.0,
  'elitepartner': 1.0,
  'hinge': 1.2
};

export const DEFAULT_SWIPE_RATE = 2.0;

export function getSwipeMultiplierForApp(name) {
  if (!name || typeof name !== 'string') return DEFAULT_SWIPE_RATE;
  const lower = name.trim().toLowerCase();
  for (const [key, rate] of Object.entries(APP_SWIPE_RATES)) {
    if (lower.includes(key)) {
      return rate;
    }
  }
  return DEFAULT_SWIPE_RATE;
}

export function calculateSwipesPerDay(dailyMinutes, customMultiplier, appName = '') {
  const minutes = Math.max(0, Number(dailyMinutes) || 0);
  const multiplier = (customMultiplier !== undefined && customMultiplier !== null && Number(customMultiplier) > 0)
    ? Number(customMultiplier)
    : getSwipeMultiplierForApp(appName);
  return Math.round(minutes * multiplier);
}

// Box Breathing phases helper (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s)
export function getBreathingPhases(t = (k) => k) {
  return [
    { name: 'Inhale Slowly', class: 'inhale', duration: 4, label: t('breath_inhale') },
    { name: 'Hold Gently', class: 'hold', duration: 4, label: t('breath_hold') },
    { name: 'Exhale Fully', class: 'exhale', duration: 4, label: t('breath_exhale') },
    { name: 'Rest in Silence', class: 'hold', duration: 4, label: t('breath_rest') }
  ];
}

// 5-Stage Relationship Progression
export const STAGE_ORDER = ['spontaneous', 'casual', 'regular', 'close', 'romantic'];

export function getStageConfig(stage, lang = 'en') {
  const isDe = lang === 'de';
  const configs = {
    spontaneous: {
      level: 1,
      percent: 20,
      icon: '⚡',
      class: 'spontaneous',
      colorClass: 'stage-spontaneous',
      name: isDe ? 'Einmaliger Funke' : 'One-Time Spark'
    },
    casual: {
      level: 2,
      percent: 40,
      icon: '👋',
      class: 'casual',
      colorClass: 'stage-casual',
      name: isDe ? 'Flüchtige Bekanntschaft' : 'Casual Acquaintance'
    },
    regular: {
      level: 3,
      percent: 60,
      icon: '☕',
      class: 'regular',
      colorClass: 'stage-regular',
      name: isDe ? 'Regelmäßiger Kontakt' : 'Regular Contact'
    },
    close: {
      level: 4,
      percent: 80,
      icon: '🤝',
      class: 'close',
      colorClass: 'stage-close',
      name: isDe ? 'Engere Verbindung' : 'Close Connection'
    },
    romantic: {
      level: 5,
      percent: 100,
      icon: '❤️',
      class: 'romantic',
      colorClass: 'stage-romantic',
      name: isDe ? 'Romantisches Interesse' : 'Romantic Interest'
    }
  };
  return configs[stage] || configs.casual;
}

// Anti-Craving Reality Check Story incident types
export function getIncidentConfig(type, isDe = false) {
  const configs = {
    ghosting: { icon: '👻', class: 'ghosting', label: isDe ? 'Geghostet' : 'Ghosted' },
    stood_up: { icon: '🚫', class: 'stood_up', label: isDe ? 'Versetzt / Abgesagt' : 'Stood Up / Flaked' },
    penpal: { icon: '💬', class: 'penpal', label: isDe ? 'Endlose Schreiberei' : 'Endless Pen-Pal' },
    catfish: { icon: '🎭', class: 'catfish', label: isDe ? 'Catfish / Falsche Angaben' : 'Catfished / Deceptive' },
    toxic: { icon: '🚩', class: 'toxic', label: isDe ? 'Respektlos / Toxisch' : 'Rude / Disrespectful' },
    burnout: { icon: '😮‍💨', class: 'burnout', label: isDe ? 'Oberflächlichkeit & Burnout' : 'Superficial / Burnout' },
    breadcrumbing: { icon: '🍞', class: 'breadcrumbing', label: isDe ? 'Breadcrumbing' : 'Breadcrumbing' },
    drained: { icon: '🔋', class: 'drained', label: isDe ? 'Energie geraubt' : 'Emotionally Drained' },
    superficial: { icon: '🪞', class: 'superficial', label: isDe ? 'Oberflächlich' : 'Superficial' },
    other: { icon: '📝', class: 'other', label: isDe ? 'Sonstige Erfahrung' : 'Other Encounter' }
  };
  return configs[type] || configs.other;
}

// Offline Moments & Encounters categories
export function getMomentCategoryConfig(cat) {
  const configs = {
    conversation: { icon: '💬', class: 'conversation' },
    smile: { icon: '✨', class: 'smile' },
    event: { icon: '☕', class: 'event' },
    hobby: { icon: '🎨', class: 'hobby' },
    serendipity: { icon: '🍀', class: 'serendipity' }
  };
  return configs[cat] || { icon: '🌿', class: 'other' };
}
