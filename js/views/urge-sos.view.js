// Urge SOS / Craving Shield View Component
// Helps users overcome compulsive dating app re-downloads via grounded breathing,
// custom motivation triggers, and past deterrent stories.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { openModal, escapeHtml } from '../utils/dom.js';
import { getAppIconConfig } from '../config/app-icons.js';
import { startBreathing, toggleBreathing, stopBreathing } from '../components/breathing.js';

export function setupUrgeSos() {
  const btnOpenSos = document.getElementById('btn-open-sos');
  const modalSos = document.getElementById('modal-sos');
  const sosAppSelect = document.getElementById('sos-app-select');
  const btnToggleBreathing = document.getElementById('btn-toggle-breathing');

  if (btnOpenSos && modalSos) {
    btnOpenSos.addEventListener('click', () => {
      populateSosApps();
      startBreathing();
      openModal(modalSos);
    });
  }

  if (sosAppSelect) {
    sosAppSelect.addEventListener('change', () => {
      updateSosMotivation();
    });
  }

  if (btnToggleBreathing) {
    btnToggleBreathing.addEventListener('click', () => {
      toggleBreathing();
    });
  }

  // Stop breathing timer when modal is closed
  if (modalSos) {
    const closeButtons = modalSos.querySelectorAll('[data-close]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => stopBreathing());
    });
    modalSos.addEventListener('click', (e) => {
      if (e.target === modalSos) stopBreathing();
    });
  }
}

export function populateSosApps() {
  const sosAppSelect = document.getElementById('sos-app-select');
  if (!sosAppSelect) return;

  const apps = storage.getActiveApps();
  sosAppSelect.innerHTML = '';

  if (apps.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = t('sos_app_select_all');
    sosAppSelect.appendChild(opt);
  } else {
    apps.forEach(app => {
      const opt = document.createElement('option');
      opt.value = app.id;
      opt.textContent = app.name;
      sosAppSelect.appendChild(opt);
    });
  }

  updateSosMotivation();
}

export function updateSosMotivation() {
  const sosAppSelect = document.getElementById('sos-app-select');
  const sosAppLabel = document.getElementById('sos-app-label');
  const sosMotivationText = document.getElementById('sos-motivation-text');
  const sosStoryShowcase = document.getElementById('sos-story-showcase');
  const sosStoryLabel = document.getElementById('sos-story-label');
  const sosStoryPerson = document.getElementById('sos-story-person');
  const sosStoryText = document.getElementById('sos-story-text');
  const sosStoryLessonText = document.getElementById('sos-story-lesson-text');

  if (!sosAppSelect || !sosMotivationText) return;

  const selectedId = sosAppSelect.value;
  const app = storage.getApp(selectedId);

  if (app && app.motivation) {
    const iconConfig = getAppIconConfig(app.name);
    const iconInline = iconConfig ? `
      <img src="${iconConfig.src}" alt="" style="width: 16px; height: 16px; vertical-align: -2px; margin-right: 5px; display: inline-block; border-radius: 3px;">
    ` : '';
    if (sosAppLabel) {
      sosAppLabel.innerHTML = `${iconInline}${t('sos_label_why_app')}`;
    }
    sosMotivationText.textContent = `"${app.motivation}"`;
  } else {
    if (sosAppLabel) {
      sosAppLabel.textContent = t('sos_label_why_freedom');
    }
    sosMotivationText.textContent = `"${t('sos_default_motivation')}"`;
  }

  // Anti-Craving Reality Check Story Showcase
  if (sosStoryShowcase) {
    let stories = [];
    if (selectedId) {
      stories = storage.getStoriesForApp(selectedId);
    }
    if (stories.length === 0) {
      stories = storage.getStories();
    }

    if (stories.length > 0) {
      const story = stories[0];
      sosStoryShowcase.classList.remove('hidden');

      if (sosStoryLabel) {
        sosStoryLabel.textContent = (story.appName && story.appName !== 'General')
          ? t('sos_story_label', { app: story.appName })
          : t('sos_story_general_label');
      }

      if (sosStoryPerson) {
        if (story.personName) {
          sosStoryPerson.innerHTML = t('story_person_label', { name: `<strong>${escapeHtml(story.personName)}</strong>` });
          sosStoryPerson.style.display = 'block';
        } else {
          sosStoryPerson.style.display = 'none';
        }
      }

      if (sosStoryText) {
        sosStoryText.textContent = `"${story.story}"`;
      }

      if (sosStoryLessonText) {
        sosStoryLessonText.textContent = story.lesson;
      }
    } else {
      sosStoryShowcase.classList.add('hidden');
    }
  }
}
