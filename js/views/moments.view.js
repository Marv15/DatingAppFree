// Real-World Positive Moments & Encounters View & Modal
// Captures spontaneous interactions, smiles, and genuine connections outside screens.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { formatDateShort } from '../utils/formatters.js';
import { escapeHtml, openModal, closeModal, showToast } from '../utils/dom.js';
import { getMomentCategoryConfig } from '../config/constants.js';

let activeMomentFilter = 'unassociated';
let onMomentChangeCallback = null;

export function setOnMomentChangeCallback(cb) {
  onMomentChangeCallback = cb;
}

function notifyMomentChanged() {
  if (onMomentChangeCallback) onMomentChangeCallback();
}

export function setActiveMomentFilter(filter) {
  activeMomentFilter = filter;
}

export function renderMomentsView(onGotoPerson = null) {
  const allMoments = storage.getMoments();
  const count = allMoments.length;

  const journalMomentsTabLabel = document.getElementById('journal-moments-tab-label');
  if (journalMomentsTabLabel) {
    journalMomentsTabLabel.textContent = count > 0 
      ? t('journal_tab_moments', { count })
      : t('journal_tab_moments_zero');
  }

  renderMomentsFilterBar(allMoments);

  const filteredMoments = storage.getMoments(activeMomentFilter);
  const momentsList = document.getElementById('moments-list');
  if (!momentsList) return;
  momentsList.innerHTML = '';

  if (filteredMoments.length === 0) {
    const isUnassociated = activeMomentFilter === 'unassociated';
    const emptyMsg = (isUnassociated && allMoments.length > 0)
      ? t('moments_empty_unassociated')
      : t('moments_empty');

    momentsList.innerHTML = `
      <div class="checkin-entry-card text-center" style="padding: 32px 20px; grid-column: 1 / -1;">
        <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.9rem;">
          ${emptyMsg}
        </p>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button class="pill-btn primary" id="btn-empty-add-moment">
            ${t('btn_add_moment')}
          </button>
          ${isUnassociated && allMoments.length > 0 ? `
            <button class="pill-btn secondary" id="btn-empty-view-all-moments">
              ${t('moments_filter_all')} (${allMoments.length})
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
      renderMomentsView(onGotoPerson);
    });
    return;
  }

  filteredMoments.forEach(moment => {
    const card = createMomentCardElement(moment, onGotoPerson);
    momentsList.appendChild(card);
  });
}

export function renderMomentsFilterBar(allMoments) {
  const bar = document.getElementById('moments-filter-bar');
  if (!bar) return;
  bar.innerHTML = '';

  const unassociatedCount = allMoments.filter(m => !storage.isMomentAssociated(m)).length;
  const withPersonCount = allMoments.filter(m => storage.isMomentAssociated(m)).length;

  // "General Sparks"
  const unassociatedChip = document.createElement('button');
  unassociatedChip.type = 'button';
  unassociatedChip.className = `stories-filter-chip ${activeMomentFilter === 'unassociated' ? 'active' : ''}`;
  unassociatedChip.innerHTML = `<span>${t('moments_filter_unassociated')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${unassociatedCount})</span>`;
  unassociatedChip.addEventListener('click', () => {
    activeMomentFilter = 'unassociated';
    renderMomentsView();
  });
  bar.appendChild(unassociatedChip);

  // "With People" Chip
  if (withPersonCount > 0) {
    const withPersonChip = document.createElement('button');
    withPersonChip.type = 'button';
    withPersonChip.className = `stories-filter-chip ${activeMomentFilter === 'with_person' ? 'active' : ''}`;
    withPersonChip.innerHTML = `<span>${t('moments_filter_with_person')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${withPersonCount})</span>`;
    withPersonChip.addEventListener('click', () => {
      activeMomentFilter = 'with_person';
      renderMomentsView();
    });
    bar.appendChild(withPersonChip);
  }

  // "All Moments" Chip
  const allChip = document.createElement('button');
  allChip.type = 'button';
  allChip.className = `stories-filter-chip ${activeMomentFilter === 'all' ? 'active' : ''}`;
  allChip.innerHTML = `<span>${t('moments_filter_all')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${allMoments.length})</span>`;
  allChip.addEventListener('click', () => {
    activeMomentFilter = 'all';
    renderMomentsView();
  });
  bar.appendChild(allChip);
}

export function createMomentCardElement(moment, onGotoPerson = null) {
  const card = document.createElement('div');
  card.className = 'story-card moment-card';
  card.id = `moment-card-${moment.id}`;

  const catCfg = getMomentCategoryConfig(moment.category);
  const formattedDate = moment.date ? formatDateShort(moment.date, storage.getLanguage()) : '';

  let personBadgeHtml = '';
  if (moment.personId && moment.personName) {
    personBadgeHtml = `
      <div class="moment-person-badge" data-goto-person="${moment.personId}" style="cursor: pointer;" title="${t('btn_view_profile')}">
        <span>👤</span>
        <span>${t('moment_person_badge', { name: escapeHtml(moment.personName) })} &rarr;</span>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="story-card-header">
      <div class="story-header-left">
        <div class="story-app-badge moment-badge">
          <span>${catCfg.icon}</span>
        </div>
        <div>
          <h4 class="story-app-name">${escapeHtml(moment.title || 'Real-World Moment')}</h4>
          <span class="story-date">${t('moment_location_label', { loc: escapeHtml(moment.location || 'Real World') })} · ${formattedDate}</span>
        </div>
      </div>
      <div class="story-header-right">
        <span class="incident-badge ${catCfg.class}">
          <span>${catCfg.icon}</span>
          <span>${t(`moment_cat_${moment.category}`) || moment.category}</span>
        </span>
      </div>
    </div>

    ${personBadgeHtml}

    <p class="story-text">"${escapeHtml(moment.story)}"</p>

    <div class="story-lesson-box moment-feeling-box">
      <div class="story-lesson-label">${t('moment_feeling_label')}</div>
      <div class="story-lesson-text">${escapeHtml(moment.feeling)}</div>
    </div>

    <div class="story-card-footer">
      <button type="button" class="story-footer-btn" data-edit-moment="${moment.id}">
        ✏️ ${t('moment_btn_edit')}
      </button>
      <button type="button" class="story-footer-btn danger" data-delete-moment="${moment.id}">
        🗑️ ${t('moment_btn_delete')}
      </button>
    </div>
  `;

  const editBtn = card.querySelector(`[data-edit-moment="${moment.id}"]`);
  if (editBtn) editBtn.addEventListener('click', () => openEditMomentModal(moment.id));

  const deleteBtn = card.querySelector(`[data-delete-moment="${moment.id}"]`);
  if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteMoment(moment.id));

  const personLink = card.querySelector('[data-goto-person]');
  if (personLink && onGotoPerson) {
    personLink.addEventListener('click', () => onGotoPerson(moment.personId));
  }

  return card;
}

export function populateMomentPersonSelect(selectedPersonId = null) {
  const select = document.getElementById('moment-input-person');
  if (!select) return;
  select.innerHTML = '';

  const noneOpt = document.createElement('option');
  noneOpt.value = '';
  noneOpt.textContent = t('moment_form_person_none');
  select.appendChild(noneOpt);

  const people = storage.getPeople();
  people.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${t(`stage_${p.stage}`) || p.stage})`;
    opt.dataset.personName = p.name;
    if (selectedPersonId && selectedPersonId === p.id) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

export function openAddMomentModal(preselectPersonId = null) {
  const modalMoment = document.getElementById('modal-moment');
  if (!modalMoment) return;

  const title = document.getElementById('moment-modal-title');
  const editId = document.getElementById('moment-edit-id');
  const inputTitle = document.getElementById('moment-input-title');
  const location = document.getElementById('moment-input-location');
  const story = document.getElementById('moment-input-story');
  const feeling = document.getElementById('moment-input-feeling');
  const date = document.getElementById('moment-input-date');
  const category = document.getElementById('moment-input-category');

  if (title) title.textContent = t('moment_modal_title_add');
  if (editId) editId.value = '';
  if (inputTitle) inputTitle.value = '';
  if (location) location.value = '';
  if (story) story.value = '';
  if (feeling) feeling.value = '';
  if (date) date.value = new Date().toISOString().slice(0, 10);

  populateMomentPersonSelect(preselectPersonId);

  if (category) category.value = 'spark';
  document.querySelectorAll('#moment-category-selector-container .incident-pill').forEach(pill => {
    pill.classList.toggle('selected', pill.dataset.cat === 'spark');
  });

  openModal(modalMoment);
}

export function openEditMomentModal(momentId) {
  const moment = storage.getMoment(momentId);
  if (!moment) return;

  const modalMoment = document.getElementById('modal-moment');
  const title = document.getElementById('moment-modal-title');
  const editId = document.getElementById('moment-edit-id');
  const inputTitle = document.getElementById('moment-input-title');
  const location = document.getElementById('moment-input-location');
  const story = document.getElementById('moment-input-story');
  const feeling = document.getElementById('moment-input-feeling');
  const date = document.getElementById('moment-input-date');
  const category = document.getElementById('moment-input-category');

  if (title) title.textContent = t('moment_modal_title_edit');
  if (editId) editId.value = moment.id;
  if (inputTitle) inputTitle.value = moment.title || '';
  if (location) location.value = moment.location || '';
  if (story) story.value = moment.story || '';
  if (feeling) feeling.value = moment.feeling || '';
  if (date) date.value = moment.date || '';

  populateMomentPersonSelect(moment.personId);

  const catVal = moment.category || 'spark';
  if (category) category.value = catVal;
  document.querySelectorAll('#moment-category-selector-container .incident-pill').forEach(pill => {
    pill.classList.toggle('selected', pill.dataset.cat === catVal);
  });

  openModal(modalMoment);
}

export function saveMomentFromModal() {
  const editId = document.getElementById('moment-edit-id');
  const inputTitle = document.getElementById('moment-input-title');
  const location = document.getElementById('moment-input-location');
  const category = document.getElementById('moment-input-category');
  const personSelect = document.getElementById('moment-input-person');
  const story = document.getElementById('moment-input-story');
  const feeling = document.getElementById('moment-input-feeling');
  const date = document.getElementById('moment-input-date');
  const modalMoment = document.getElementById('modal-moment');

  const id = editId.value || `moment-${Date.now()}`;
  const titleVal = inputTitle ? inputTitle.value.trim() : 'Real-World Moment';
  const locationVal = location ? location.value.trim() : 'Real World';
  const catVal = category ? category.value : 'conversation';
  const personIdVal = (personSelect && personSelect.value) ? personSelect.value : null;
  const personOption = personSelect ? personSelect.options[personSelect.selectedIndex] : null;
  const personNameVal = (personOption && personOption.dataset.personName) ? personOption.dataset.personName : '';
  const storyVal = story ? story.value.trim() : '';
  const feelingVal = feeling ? feeling.value.trim() : '';
  const dateVal = date ? (date.value || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10);

  if (!storyVal || !feelingVal) {
    showToast(t('alert_moment_missing_fields'), 'warning');
    return;
  }

  storage.saveMoment({
    id,
    title: titleVal,
    location: locationVal,
    category: catVal,
    personId: personIdVal,
    personName: personNameVal,
    date: dateVal,
    story: storyVal,
    feeling: feelingVal
  });

  closeModal(modalMoment);
  renderMomentsView();
  notifyMomentChanged();
  showToast(t('moment_saved_alert'), 'success');
}

export function confirmDeleteMoment(momentId) {
  if (confirm(t('confirm_delete_moment'))) {
    storage.deleteMoment(momentId);
    renderMomentsView();
    notifyMomentChanged();
  }
}

export function setupMomentsEvents() {
  const btnAdd = document.getElementById('btn-add-moment');
  if (btnAdd) btnAdd.addEventListener('click', () => openAddMomentModal());

  const pills = document.querySelectorAll('#moment-category-selector-container .incident-pill');
  const categoryInput = document.getElementById('moment-input-category');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (categoryInput) {
        categoryInput.value = pill.dataset.cat;
      }
    });
  });

  const form = document.getElementById('form-moment-edit');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveMomentFromModal();
    });
  }
}
