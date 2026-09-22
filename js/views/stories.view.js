// Anti-Craving Reality Check Stories View & Modal
// Captures experiences, ghosting incidents, and reality checks that remind users why they quit.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { formatDateShort } from '../utils/formatters.js';
import { escapeHtml, openModal, closeModal, showToast } from '../utils/dom.js';
import { getAppIconConfig } from '../config/app-icons.js';
import { getIncidentConfig } from '../config/constants.js';

let activeStoryFilter = 'all';

export function setActiveStoryFilter(filter) {
  activeStoryFilter = filter;
}

export function renderStoriesView() {
  const allStories = storage.getStories();
  const count = allStories.length;

  const journalStoriesTabLabel = document.getElementById('journal-stories-tab-label');
  if (journalStoriesTabLabel) {
    journalStoriesTabLabel.textContent = count > 0 
      ? t('journal_tab_stories', { count })
      : t('journal_tab_stories_zero');
  }

  renderStoriesFilterBar(allStories);

  const filteredStories = storage.getStories(activeStoryFilter);
  const storiesList = document.getElementById('stories-list');
  if (!storiesList) return;
  storiesList.innerHTML = '';

  if (filteredStories.length === 0) {
    storiesList.innerHTML = `
      <div class="checkin-entry-card text-center" style="padding: 32px 20px; grid-column: 1 / -1;">
        <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.9rem;">
          ${t('stories_empty')}
        </p>
        <button class="pill-btn primary" id="btn-empty-add-story">
          ${t('btn_add_story')}
        </button>
      </div>
    `;
    const btn = document.getElementById('btn-empty-add-story');
    if (btn) btn.addEventListener('click', () => openAddStoryModal());
    return;
  }

  filteredStories.forEach(story => {
    const card = createStoryCardElement(story);
    storiesList.appendChild(card);
  });
}

export function renderStoriesFilterBar(allStories) {
  const bar = document.getElementById('stories-filter-bar');
  if (!bar) return;
  bar.innerHTML = '';

  // "All Apps" Chip
  const allChip = document.createElement('button');
  allChip.type = 'button';
  allChip.className = `stories-filter-chip ${activeStoryFilter === 'all' ? 'active' : ''}`;
  allChip.innerHTML = `<span>${t('stories_filter_all')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${allStories.length})</span>`;
  allChip.addEventListener('click', () => {
    activeStoryFilter = 'all';
    renderStoriesView();
  });
  bar.appendChild(allChip);

  // App-specific chips
  const apps = storage.getApps();
  apps.forEach(app => {
    const count = allStories.filter(s => s.appId === app.id || (s.appName && s.appName.toLowerCase() === app.name.toLowerCase())).length;
    if (count === 0) return;

    const iconCfg = getAppIconConfig(app.name);
    const iconHtml = iconCfg 
      ? `<img src="${iconCfg.src}" style="width: 14px; height: 14px; vertical-align: -2px; border-radius: 3px; display: inline-block; margin-right: 4px;">`
      : '';

    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `stories-filter-chip ${activeStoryFilter === app.id ? 'active' : ''}`;
    chip.innerHTML = `${iconHtml}<span>${escapeHtml(app.name)}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${count})</span>`;
    chip.addEventListener('click', () => {
      activeStoryFilter = app.id;
      renderStoriesView();
    });
    bar.appendChild(chip);
  });
}

export function createStoryCardElement(story) {
  const card = document.createElement('div');
  card.className = 'story-card';
  card.id = `story-card-${story.id}`;

  const isDe = storage.getLanguage() === 'de';
  const incidentCfg = getIncidentConfig(story.incidentType, isDe);
  const formattedDate = story.date ? formatDateShort(story.date, storage.getLanguage()) : '';

  // App Badge with constrained 13px icon
  const iconConfig = getAppIconConfig(story.appName);
  const appIconHtml = iconConfig
    ? `<img src="${iconConfig.src}" alt="${escapeHtml(iconConfig.alt || '')}" style="width: 13px; height: 13px; object-fit: contain; border-radius: 2px; vertical-align: -2px; display: inline-block;">`
    : '📱';

  const personHtml = story.personName ? `
    <div class="story-person-row">
      <span>👤</span>
      <span>${t('story_person_label', { name: `<strong>${escapeHtml(story.personName)}</strong>` })}</span>
    </div>
  ` : '';

  card.innerHTML = `
    <div class="story-card-top">
      <div class="story-badge-group">
        <span class="story-app-tag">
          ${appIconHtml}
          <span>${escapeHtml(story.appName || 'General')}</span>
        </span>
        <span class="story-incident-tag ${incidentCfg.class}">
          <span>${incidentCfg.icon}</span>
          <span>${escapeHtml(incidentCfg.label || t(`incident_${story.incidentType}`) || story.incidentType)}</span>
        </span>
      </div>
      <div class="story-card-actions">
        ${formattedDate ? `<span class="story-date-badge">${formattedDate}</span>` : ''}
      </div>
    </div>

    ${personHtml}

    <p class="story-body-text">"${escapeHtml(story.story)}"</p>

    <div class="story-lesson-box">
      <div class="story-lesson-header">
        <span>💡</span>
        <span>${t('story_takeaway_label')}</span>
      </div>
      <div class="story-lesson-text">${escapeHtml(story.lesson)}</div>
    </div>

    <div class="story-card-footer">
      <button type="button" class="story-footer-btn" data-edit-story="${story.id}">
        ✏️ ${t('story_btn_edit')}
      </button>
      <button type="button" class="story-footer-btn danger" data-delete-story="${story.id}">
        🗑️ ${t('story_btn_delete')}
      </button>
    </div>
  `;

  const editBtn = card.querySelector(`[data-edit-story="${story.id}"]`);
  if (editBtn) editBtn.addEventListener('click', () => openEditStoryModal(story.id));

  const deleteBtn = card.querySelector(`[data-delete-story="${story.id}"]`);
  if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteStory(story.id));

  return card;
}

export function openAddStoryModal(preselectAppId = null) {
  const modalStory = document.getElementById('modal-story');
  if (!modalStory) return;

  const title = document.getElementById('story-modal-title');
  const editId = document.getElementById('story-edit-id');
  const person = document.getElementById('story-input-person');
  const text = document.getElementById('story-input-text');
  const lesson = document.getElementById('story-input-lesson');
  const date = document.getElementById('story-input-date');
  const incident = document.getElementById('story-input-incident');

  if (title) title.textContent = t('story_modal_title_add');
  if (editId) editId.value = '';
  populateStoryAppSelect(preselectAppId);
  if (person) person.value = '';
  if (text) text.value = '';
  if (lesson) lesson.value = '';
  if (date) date.value = new Date().toISOString().slice(0, 10);

  if (incident) incident.value = 'ghosting';
  document.querySelectorAll('#incident-selector-container .incident-pill').forEach(pill => {
    pill.classList.toggle('selected', pill.dataset.type === 'ghosting');
  });

  openModal(modalStory);
}

export function openEditStoryModal(storyId) {
  const story = storage.getStory(storyId);
  if (!story) return;

  const modalStory = document.getElementById('modal-story');
  const title = document.getElementById('story-modal-title');
  const editId = document.getElementById('story-edit-id');
  const person = document.getElementById('story-input-person');
  const text = document.getElementById('story-input-text');
  const lesson = document.getElementById('story-input-lesson');
  const date = document.getElementById('story-input-date');
  const incident = document.getElementById('story-input-incident');

  if (title) title.textContent = t('story_modal_title_edit');
  if (editId) editId.value = story.id;
  populateStoryAppSelect(story.appId);
  if (person) person.value = story.personName || '';
  if (text) text.value = story.story || '';
  if (lesson) lesson.value = story.lesson || '';
  if (date) date.value = story.date || '';

  const incType = story.incidentType || 'ghosting';
  if (incident) incident.value = incType;
  document.querySelectorAll('#incident-selector-container .incident-pill').forEach(pill => {
    pill.classList.toggle('selected', pill.dataset.type === incType);
  });

  openModal(modalStory);
}

export function populateStoryAppSelect(selectedAppId = null) {
  const select = document.getElementById('story-input-app');
  if (!select) return;
  select.innerHTML = '';

  const apps = storage.getApps();
  apps.forEach(app => {
    const opt = document.createElement('option');
    opt.value = app.id;
    opt.textContent = app.name;
    opt.dataset.appName = app.name;
    if (selectedAppId && (selectedAppId === app.id || selectedAppId.toLowerCase() === app.name.toLowerCase())) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  const generalOpt = document.createElement('option');
  generalOpt.value = 'general';
  generalOpt.textContent = t('story_form_general');
  generalOpt.dataset.appName = 'General Fatigue';
  if (selectedAppId === 'general') {
    generalOpt.selected = true;
  }
  select.appendChild(generalOpt);
}

export function saveStoryFromModal() {
  const editId = document.getElementById('story-edit-id');
  const appSelect = document.getElementById('story-input-app');
  const person = document.getElementById('story-input-person');
  const incident = document.getElementById('story-input-incident');
  const text = document.getElementById('story-input-text');
  const lesson = document.getElementById('story-input-lesson');
  const date = document.getElementById('story-input-date');
  const modalStory = document.getElementById('modal-story');

  const id = editId.value || `story-${Date.now()}`;
  const selectedOption = appSelect.options[appSelect.selectedIndex];
  const appId = appSelect.value;
  const appName = selectedOption ? (selectedOption.dataset.appName || selectedOption.text) : 'General';
  const personName = person ? person.value.trim() : '';
  const incidentType = incident ? incident.value : 'ghosting';
  const storyText = text ? text.value.trim() : '';
  const lessonText = lesson ? lesson.value.trim() : '';
  const dateVal = date ? (date.value || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10);

  if (!storyText || !lessonText) {
    showToast(t('alert_story_missing_fields'), 'warning');
    return;
  }

  storage.saveStory({
    id,
    appId,
    appName,
    personName,
    incidentType,
    date: dateVal,
    story: storyText,
    lesson: lessonText
  });

  closeModal(modalStory);
  renderStoriesView();
  showToast(t('story_saved_alert'), 'success');
}

export function confirmDeleteStory(storyId) {
  if (confirm(t('confirm_delete_story'))) {
    storage.deleteStory(storyId);
    renderStoriesView();
  }
}

export function setupStoriesEvents() {
  const btnAdd = document.getElementById('btn-add-story');
  if (btnAdd) btnAdd.addEventListener('click', () => openAddStoryModal());

  const pills = document.querySelectorAll('#incident-selector-container .incident-pill');
  const incidentInput = document.getElementById('story-input-incident');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (incidentInput) {
        incidentInput.value = pill.dataset.type;
      }
    });
  });

  const form = document.getElementById('form-story-edit');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveStoryFromModal();
    });
  }
}
