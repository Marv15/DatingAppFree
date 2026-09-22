// Settings Modal Component
// Manages language, currency, update check, theme, and backup/restore controls.

import { storage } from '../services/storage.js';
import { t, setLanguage } from '../services/i18n.js';
import { openModal, closeModal } from '../utils/dom.js';
import { setupBackupListeners } from './backup.js';
import { getServiceWorkerRegistration } from '../services/pwa.js';

export function setupSettings(onDataOrLanguageChanged) {
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const modalSettings = document.getElementById('modal-settings');
  const modalIosGuide = document.getElementById('modal-ios-guide');
  const btnShowIosGuide = document.getElementById('btn-show-ios-guide');
  const settingsLangSelect = document.getElementById('settings-lang-select');
  const settingsCurrencySelect = document.getElementById('settings-currency-select');
  const btnCheckUpdates = document.getElementById('btn-check-updates');
  const updateStatusText = document.getElementById('update-status-text');

  if (btnOpenSettings && modalSettings) {
    btnOpenSettings.addEventListener('click', () => {
      // Sync values with current storage
      if (settingsLangSelect) settingsLangSelect.value = storage.getLanguage();
      if (settingsCurrencySelect) settingsCurrencySelect.value = storage.data.currency || '€';
      openModal(modalSettings);
    });
  }

  if (btnShowIosGuide && modalIosGuide) {
    btnShowIosGuide.addEventListener('click', () => {
      if (modalSettings) closeModal(modalSettings);
      openModal(modalIosGuide);
    });
  }

  // Language selection
  if (settingsLangSelect) {
    settingsLangSelect.value = storage.getLanguage();
    settingsLangSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      storage.setLanguage(newLang);
      setLanguage(newLang);
      if (onDataOrLanguageChanged) onDataOrLanguageChanged(true);
    });
  }

  // Currency selection
  if (settingsCurrencySelect) {
    settingsCurrencySelect.value = storage.data.currency || '€';
    settingsCurrencySelect.addEventListener('change', (e) => {
      storage.setCurrency(e.target.value);
      if (onDataOrLanguageChanged) onDataOrLanguageChanged(false);
    });
  }

  // Backup & Restore
  setupBackupListeners(() => {
    if (onDataOrLanguageChanged) onDataOrLanguageChanged(true);
  });

  // Service Worker Update check
  if (btnCheckUpdates) {
    btnCheckUpdates.addEventListener('click', async () => {
      const reg = getServiceWorkerRegistration();
      if (!reg) {
        if (updateStatusText) updateStatusText.textContent = t('settings_status_checked');
        return;
      }
      if (updateStatusText) updateStatusText.textContent = t('settings_status_checking');
      try {
        await reg.update();
        setTimeout(() => {
          if (updateStatusText) updateStatusText.textContent = t('settings_status_up_to_date');
        }, 800);
      } catch (_) {
        if (updateStatusText) updateStatusText.textContent = t('settings_status_checked');
      }
    });
  }
}
