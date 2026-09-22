// Daily Reflection Journal View & Edit Check-in Modal
// Handles daily mood check-ins (Peaceful, Energized, Grounded, Lonely, Tempted) and reflection history.

import { storage } from '../services/storage.js';
import { t, has } from '../services/i18n.js';
import { formatDateTime } from '../utils/formatters.js';
import { escapeHtml, openModal, closeModal, showToast } from '../utils/dom.js';

let currentJournalSubTab = 'reflections';
let onSubTabChangeCallback = null;

export function setOnSubTabChangeCallback(cb) {
  onSubTabChangeCallback = cb;
}

export function switchJournalSubTab(subTab) {
  currentJournalSubTab = subTab;

  const segBtnReflections = document.getElementById('seg-btn-reflections');
  const segBtnStories = document.getElementById('seg-btn-stories');
  const segBtnMoments = document.getElementById('seg-btn-moments');
  const segBtnPeople = document.getElementById('seg-btn-people');

  const journalSubReflections = document.getElementById('journal-sub-reflections');
  const journalSubStories = document.getElementById('journal-sub-stories');
  const journalSubMoments = document.getElementById('journal-sub-moments');
  const journalSubPeople = document.getElementById('journal-sub-people');

  if (segBtnReflections) segBtnReflections.classList.toggle('active', subTab === 'reflections');
  if (segBtnStories) segBtnStories.classList.toggle('active', subTab === 'stories');
  if (segBtnMoments) segBtnMoments.classList.toggle('active', subTab === 'moments');
  if (segBtnPeople) segBtnPeople.classList.toggle('active', subTab === 'people');

  if (journalSubReflections) journalSubReflections.classList.toggle('hidden', subTab !== 'reflections');
  if (journalSubStories) journalSubStories.classList.toggle('hidden', subTab !== 'stories');
  if (journalSubMoments) journalSubMoments.classList.toggle('hidden', subTab !== 'moments');
  if (journalSubPeople) journalSubPeople.classList.toggle('hidden', subTab !== 'people');

  if (onSubTabChangeCallback) {
    onSubTabChangeCallback(subTab);
  }
}

export function renderJournalView() {
  const entries = storage.getCheckIns();
  const checkinHistoryList = document.getElementById('checkin-history-list');
  if (!checkinHistoryList) return;
  checkinHistoryList.innerHTML = '';

  if (entries.length === 0) {
    checkinHistoryList.innerHTML = `
      <div class="checkin-entry-card text-center" style="padding: 24px 16px;">
        <p style="color: var(--text-muted); font-size: 0.85rem;">${t('journal_empty')}</p>
      </div>
    `;
    return;
  }

  entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'checkin-entry-card';

    const dateStr = formatDateTime(entry.timestamp, storage.getLanguage());

    let moodDisplay = entry.moodLabel;
    if (typeof moodDisplay === 'string' && moodDisplay.startsWith('mood_')) {
      entry.mood = moodDisplay.replace('mood_', '');
      moodDisplay = '';
    }

    if (entry.mood) {
      let normalizedMood = entry.mood.toLowerCase();
      if (normalizedMood === 'calm') normalizedMood = 'peaceful';
      const key = `mood_${normalizedMood}`;
      if (has(key)) {
        moodDisplay = t(key);
      } else if (has(`mood_${entry.mood}`)) {
        moodDisplay = t(`mood_${entry.mood}`);
      }
    }

    if (!moodDisplay) {
      moodDisplay = entry.moodLabel || 'Peaceful';
    }

    card.innerHTML = `
      <div class="checkin-entry-header">
        <div class="checkin-mood-tag">
          <span>${entry.emoji || '🌿'}</span>
          <span>${escapeHtml(moodDisplay || 'Peaceful')}</span>
        </div>
        <span class="checkin-date">${dateStr}</span>
      </div>
      ${entry.note ? `<p class="checkin-note-text">${escapeHtml(entry.note)}</p>` : ''}
      <div class="checkin-card-footer">
        <button type="button" class="story-footer-btn" data-edit-checkin="${entry.id}">
          ✏️ ${t('checkin_btn_edit')}
        </button>
        <button type="button" class="story-footer-btn danger" data-delete-checkin="${entry.id}">
          🗑️ ${t('checkin_btn_delete')}
        </button>
      </div>
    `;

    const editBtn = card.querySelector(`[data-edit-checkin="${entry.id}"]`);
    if (editBtn) editBtn.addEventListener('click', () => openEditCheckInModal(entry.id));

    const deleteBtn = card.querySelector(`[data-delete-checkin="${entry.id}"]`);
    if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeleteCheckIn(entry.id));

    checkinHistoryList.appendChild(card);
  });
}

export function openEditCheckInModal(checkinId) {
  const entry = storage.getCheckIn(checkinId);
  if (!entry) return;

  const modal = document.getElementById('modal-checkin');
  const editId = document.getElementById('checkin-edit-id');
  const editMood = document.getElementById('edit-checkin-mood');
  const editDate = document.getElementById('edit-checkin-date');
  const editNote = document.getElementById('edit-checkin-note');

  if (editId) editId.value = entry.id;

  let currentMood = (entry.mood || 'peaceful').toLowerCase();
  if (currentMood === 'calm') currentMood = 'peaceful';
  if (editMood) editMood.value = currentMood;

  document.querySelectorAll('#edit-mood-selector-container .mood-pill').forEach(pill => {
    pill.classList.toggle('selected', pill.dataset.editMood === currentMood);
  });

  if (entry.timestamp && editDate) {
    const d = new Date(entry.timestamp);
    if (!isNaN(d.getTime())) {
      const pad = (n) => String(n).padStart(2, '0');
      editDate.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } else {
      editDate.value = '';
    }
  }

  if (editNote) editNote.value = entry.note || '';

  openModal(modal);
}

export function confirmDeleteCheckIn(checkinId) {
  if (confirm(t('confirm_delete_checkin'))) {
    storage.deleteCheckIn(checkinId);
    renderJournalView();
    showToast(t('checkin_deleted_alert'), 'warning');
  }
}

export function setupJournalEvents() {
  let selectedMood = 'peaceful';
  let selectedEmoji = '🌿';
  let selectedLabel = 'Peaceful';

  const moodPills = document.querySelectorAll('.mood-selector:not(#edit-mood-selector-container) .mood-pill');
  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      moodPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedMood = pill.dataset.mood;
      selectedEmoji = pill.dataset.emoji;
      selectedLabel = pill.dataset.label;
    });
  });

  const btnSave = document.getElementById('btn-save-checkin');
  const noteInput = document.getElementById('checkin-note');
  if (btnSave && noteInput) {
    btnSave.addEventListener('click', () => {
      const note = noteInput.value.trim();
      storage.addCheckIn({
        mood: selectedMood,
        emoji: selectedEmoji,
        moodLabel: selectedLabel,
        note
      });

      noteInput.value = '';
      renderJournalView();
      showToast(t('journal_saved_alert'), 'success');
    });
  }

  const editMoodPills = document.querySelectorAll('#edit-mood-selector-container .mood-pill');
  const editCheckinMood = document.getElementById('edit-checkin-mood');
  editMoodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      editMoodPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (editCheckinMood) {
        editCheckinMood.value = pill.dataset.editMood;
      }
    });
  });

  const formCheckinEdit = document.getElementById('form-checkin-edit');
  const modalCheckin = document.getElementById('modal-checkin');
  const editId = document.getElementById('checkin-edit-id');
  const editNote = document.getElementById('edit-checkin-note');
  const editDate = document.getElementById('edit-checkin-date');

  if (formCheckinEdit) {
    formCheckinEdit.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editId ? editId.value : null;
      if (!id) return;

      const mood = editCheckinMood ? editCheckinMood.value : 'peaceful';
      const selectedPill = document.querySelector(`#edit-mood-selector-container .mood-pill[data-edit-mood="${mood}"]`);
      const emoji = selectedPill ? selectedPill.dataset.emoji : '🌿';
      const moodLabel = selectedPill ? selectedPill.dataset.label : 'Peaceful';
      const note = editNote ? editNote.value.trim() : '';
      const dateVal = editDate ? editDate.value : '';
      const timestamp = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();

      storage.updateCheckIn(id, {
        mood,
        emoji,
        moodLabel,
        note,
        timestamp
      });

      closeModal(modalCheckin);
      renderJournalView();
      showToast(t('checkin_updated_alert'), 'success');
    });
  }

  // Segment buttons
  const segBtnReflections = document.getElementById('seg-btn-reflections');
  const segBtnStories = document.getElementById('seg-btn-stories');
  const segBtnMoments = document.getElementById('seg-btn-moments');
  const segBtnPeople = document.getElementById('seg-btn-people');

  if (segBtnReflections) segBtnReflections.addEventListener('click', () => switchJournalSubTab('reflections'));
  if (segBtnStories) segBtnStories.addEventListener('click', () => switchJournalSubTab('stories'));
  if (segBtnMoments) segBtnMoments.addEventListener('click', () => switchJournalSubTab('moments'));
  if (segBtnPeople) segBtnPeople.addEventListener('click', () => switchJournalSubTab('people'));
}
