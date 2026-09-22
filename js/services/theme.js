// Theme Management Service
// Supports 6 modern themes: Claude Light, Claude Dark, Google Gemini, ChatGPT, GitHub, Steam.

import { storage } from './storage.js';

export const THEMES_CONFIG = {
  'claude-light': { icon: '☀️', color: '#FAF8F5', name: 'Claude Light' },
  'claude-dark': { icon: '🌙', color: '#1A1917', name: 'Claude Dark' },
  'gemini': { icon: '✨', color: '#0F0F11', name: 'Google Gemini' },
  'chatgpt': { icon: '🟢', color: '#212121', name: 'ChatGPT' },
  'github': { icon: '🐙', color: '#0D1117', name: 'GitHub' },
  'steam': { icon: '🎮', color: '#171A21', name: 'Steam' }
};

export const THEME_KEYS = Object.keys(THEMES_CONFIG);

export function getCurrentTheme() {
  if (typeof document === 'undefined') return 'claude-light';
  return document.documentElement.getAttribute('data-theme') || 'claude-light';
}

export function applyTheme(theme) {
  if (!THEMES_CONFIG[theme]) theme = 'claude-light';
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);

    const config = THEMES_CONFIG[theme];
    const themeIcon = document.getElementById('theme-icon');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const settingsThemeSelect = document.getElementById('settings-theme-select');
    const themeColorMeta = document.getElementById('theme-color-meta');

    if (themeIcon) themeIcon.textContent = config.icon;
    if (btnThemeToggle) btnThemeToggle.title = `Theme: ${config.name} (Click to switch)`;
    if (settingsThemeSelect) settingsThemeSelect.value = theme;
    if (themeColorMeta) themeColorMeta.setAttribute('content', config.color);
  }

  storage.setTheme(theme);
}

export function toggleNextTheme() {
  const current = getCurrentTheme();
  const currentIndex = THEME_KEYS.indexOf(current);
  const nextIndex = (currentIndex + 1) % THEME_KEYS.length;
  const nextTheme = THEME_KEYS[nextIndex];
  applyTheme(nextTheme);
}

export function setupTheme() {
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', toggleNextTheme);
  }

  const settingsThemeSelect = document.getElementById('settings-theme-select');
  if (settingsThemeSelect) {
    settingsThemeSelect.value = storage.data.theme || 'claude-light';
    settingsThemeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }

  // Initialize theme from storage
  applyTheme(storage.data.theme || 'claude-light');
}

// Backward compatibility shim
if (typeof window !== 'undefined') {
  window.applyTheme = applyTheme;
}
