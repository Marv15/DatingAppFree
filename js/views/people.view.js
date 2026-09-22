// Real-Life Connections & 5-Stage Relationship Progression View & Modal
// Manages real connections, stage advancements/demotions, birthday alerts, and linked encounter timelines.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { STAGE_ORDER, getStageConfig } from '../config/constants.js';
import { calculateAge, getDaysUntilBirthday, formatDateShort } from '../utils/formatters.js';
import { escapeHtml, openModal, closeModal, showToast } from '../utils/dom.js';
import { openAddMomentModal } from './moments.view.js';

let activePeopleFilter = 'all';
let onPeopleChangeCallback = null;

export function setOnPeopleChangeCallback(cb) {
  onPeopleChangeCallback = cb;
}

function notifyPeopleChanged() {
  if (onPeopleChangeCallback) onPeopleChangeCallback();
}

export function setActivePeopleFilter(filter) {
  activePeopleFilter = filter;
}

export function renderPeopleView() {
  const allPeople = storage.getPeople();
  const count = allPeople.length;

  const journalPeopleTabLabel = document.getElementById('journal-people-tab-label');
  if (journalPeopleTabLabel) {
    journalPeopleTabLabel.textContent = count > 0
      ? t('journal_tab_people', { count })
      : t('journal_tab_people_zero');
  }

  renderPeopleFilterBar(allPeople);

  const filteredPeople = storage.getPeople(activePeopleFilter);
  const peopleList = document.getElementById('people-list');
  if (!peopleList) return;
  peopleList.innerHTML = '';

  if (filteredPeople.length === 0) {
    peopleList.innerHTML = `
      <div class="checkin-entry-card text-center" style="padding: 32px 20px; grid-column: 1 / -1;">
        <p style="color: var(--text-secondary); margin-bottom: 14px; font-size: 0.9rem;">
          ${t('people_empty')}
        </p>
        <button class="pill-btn primary" id="btn-empty-add-person">
          ${t('btn_add_person')}
        </button>
      </div>
    `;
    const btn = document.getElementById('btn-empty-add-person');
    if (btn) btn.addEventListener('click', () => openAddPersonModal());
    return;
  }

  filteredPeople.forEach(person => {
    const card = createPersonCardElement(person);
    peopleList.appendChild(card);
  });
}

export function renderPeopleFilterBar(allPeople) {
  const bar = document.getElementById('people-filter-bar');
  if (!bar) return;
  bar.innerHTML = '';

  const allChip = document.createElement('button');
  allChip.type = 'button';
  allChip.className = `stories-filter-chip ${activePeopleFilter === 'all' ? 'active' : ''}`;
  allChip.innerHTML = `<span>${t('people_filter_all')}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${allPeople.length})</span>`;
  allChip.addEventListener('click', () => {
    activePeopleFilter = 'all';
    renderPeopleView();
  });
  bar.appendChild(allChip);

  STAGE_ORDER.forEach(stage => {
    const count = allPeople.filter(p => p.stage === stage).length;
    if (count === 0) return;

    const cfg = getStageConfig(stage, storage.getLanguage());
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `stories-filter-chip ${activePeopleFilter === stage ? 'active' : ''}`;
    chip.innerHTML = `<span>${cfg.icon} ${escapeHtml(cfg.name)}</span> <span style="opacity: 0.65; font-size: 0.72rem;">(${count})</span>`;
    chip.addEventListener('click', () => {
      activePeopleFilter = stage;
      renderPeopleView();
    });
    bar.appendChild(chip);
  });
}

export function advancePersonStage(personId) {
  const person = storage.getPerson(personId);
  if (!person) return;
  const currentIndex = STAGE_ORDER.indexOf(person.stage);
  if (currentIndex < STAGE_ORDER.length - 1) {
    const nextStage = STAGE_ORDER[currentIndex + 1];
    storage.setPersonStage(personId, nextStage);
    renderPeopleView();
    notifyPeopleChanged();
    const cfg = getStageConfig(nextStage, storage.getLanguage());
    showToast(t('toast_stage_advanced', { name: person.name, stage: cfg.name }), 'success');
  }
}

export function demotePersonStage(personId) {
  const person = storage.getPerson(personId);
  if (!person) return;
  const currentIndex = STAGE_ORDER.indexOf(person.stage);
  if (currentIndex > 0) {
    const prevStage = STAGE_ORDER[currentIndex - 1];
    storage.setPersonStage(personId, prevStage);
    renderPeopleView();
    notifyPeopleChanged();
  }
}

export function setPersonExactStage(personId, newStage) {
  const person = storage.getPerson(personId);
  if (!person) return;
  storage.setPersonStage(personId, newStage);
  renderPeopleView();
  notifyPeopleChanged();
}

export function createPersonCardElement(person) {
  const card = document.createElement('div');
  card.className = 'person-card';
  card.id = `person-card-${person.id}`;

  const lang = storage.getLanguage();
  const cfg = getStageConfig(person.stage, lang);
  const initial = (person.name || '?').charAt(0).toUpperCase();

  let bdayHtml = '';
  if (person.dob) {
    const formattedBday = formatDateShort(person.dob, lang);
    const age = calculateAge(person.dob);
    const ageStr = age !== null ? t('person_age_label', { age }) : '';
    const daysUntil = getDaysUntilBirthday(person.dob);
    const upcomingBadge = daysUntil !== null
      ? `<span class="person-bday-badge">${t('person_upcoming_bday', { days: daysUntil })}</span>`
      : '';

    bdayHtml = `
      <div class="person-detail-row">
        <span>🎂</span>
        <span>${t('person_dob_label', { dob: formattedBday })} ${ageStr}</span>
        ${upcomingBadge}
      </div>
    `;
  } else {
    bdayHtml = `
      <div class="person-detail-row">
        <button type="button" class="person-quick-add-link" data-quick-edit="${person.id}" data-focus="dob">
          ${t('person_quick_add_dob')}
        </button>
      </div>
    `;
  }

  const metHtml = person.metAt ? `
    <div class="person-detail-row">
      <span>📍</span>
      <span>${t('person_met_at_label', { loc: escapeHtml(person.metAt) })}</span>
    </div>
  ` : '';

  let contactHtml = '';
  if (person.contact) {
    contactHtml = `
      <div class="person-detail-row">
        <span>📱</span>
        <span>${escapeHtml(person.contact)}</span>
      </div>
    `;
  } else {
    contactHtml = `
      <div class="person-detail-row">
        <button type="button" class="person-quick-add-link" data-quick-edit="${person.id}" data-focus="contact">
          ${t('person_quick_add_contact')}
        </button>
      </div>
    `;
  }

  let notesHtml = '';
  if (person.notes) {
    notesHtml = `
      <div class="person-notes-box">
        "${escapeHtml(person.notes)}"
      </div>
    `;
  } else {
    notesHtml = `
      <div class="person-detail-row">
        <button type="button" class="person-quick-add-link" data-quick-edit="${person.id}" data-focus="notes">
          ${t('person_quick_add_notes')}
        </button>
      </div>
    `;
  }

  const encounters = storage.getMomentsForPerson(person.id);
  let encountersToggleHtml = '';
  if (encounters.length > 0) {
    const countText = encounters.length === 1
      ? t('person_encounters_count_single')
      : t('person_encounters_count', { count: encounters.length });

    encountersToggleHtml = `
      <div class="person-timeline-wrap">
        <button type="button" class="person-timeline-toggle" data-toggle-timeline="${person.id}">
          ✨ ${countText} ▾
        </button>
        <div class="person-encounters-mini-list hidden" id="timeline-${person.id}">
          ${encounters.map(e => `
            <div class="person-mini-encounter">
              <div class="person-mini-encounter-date">${formatDateShort(e.date, lang)} · ${escapeHtml(e.location || 'Offline')}</div>
              <div>"${escapeHtml(e.story)}"</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    encountersToggleHtml = `
      <div class="person-timeline-wrap" style="opacity: 0.7; font-size: 0.75rem;">
        ${t('person_encounters_count_zero')}
      </div>
    `;
  }

  const progLabel = t('progression_level', {
    level: cfg.level,
    stage: cfg.name,
    percent: cfg.percent
  });

  card.innerHTML = `
    <div class="person-card-header">
      <div class="person-identity">
        <div class="person-avatar">${escapeHtml(initial)}</div>
        <div class="person-title-wrap">
          <h4 class="person-name">${escapeHtml(person.name)}</h4>
          <span class="person-stage-badge ${cfg.class}">
            <span>${cfg.icon}</span>
            <span>${escapeHtml(cfg.name)}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Progression Meter -->
    <div class="progression-card-box">
      <div class="progression-header-row">
        <span class="progression-label">${progLabel}</span>
        <div class="progression-quick-actions">
          ${cfg.level > 1 ? `<button type="button" class="progression-step-btn" data-demote-person="${person.id}" title="${t('btn_demote_stage')}">▼ ${t('btn_demote_stage')}</button>` : ''}
          ${cfg.level < 5 ? `<button type="button" class="progression-step-btn" data-advance-person="${person.id}" title="${t('btn_advance_stage')}">▲ ${t('btn_advance_stage')}</button>` : ''}
        </div>
      </div>
      <div class="progression-track">
        <div class="progression-fill stage-${person.stage}"></div>
      </div>
      <div class="progression-steps-dots">
        ${STAGE_ORDER.map((stg) => {
          const stepCfg = getStageConfig(stg, lang);
          const isActive = stg === person.stage;
          return `<button type="button" class="progression-dot ${isActive ? 'active' : ''}" data-set-stage="${stg}" data-person="${person.id}" title="${escapeHtml(stepCfg.name)}" aria-label="${escapeHtml(stepCfg.name)}">
            <span class="prog-dot-icon">${stepCfg.icon}</span>
            <span class="prog-dot-text">${escapeHtml(stepCfg.name)}</span>
          </button>`;
        }).join('')}
      </div>
    </div>

    <!-- Details Grid -->
    <div class="person-details-grid">
      ${bdayHtml}
      ${metHtml}
      ${contactHtml}
      ${notesHtml}
      ${encountersToggleHtml}
    </div>

    <!-- Card Footer -->
    <div class="person-card-footer">
      <div class="person-footer-left">
        <button type="button" class="pill-btn primary" style="font-size: 0.78rem; padding: 6px 14px;" data-log-moment-person="${person.id}">
          ${t('person_btn_add_encounter')}
        </button>
      </div>
      <div class="person-footer-right">
        <button type="button" class="story-footer-btn" data-edit-person="${person.id}">
          ✏️ ${t('person_btn_edit')}
        </button>
        <button type="button" class="story-footer-btn danger" data-delete-person="${person.id}">
          🗑️ ${t('person_btn_delete')}
        </button>
      </div>
    </div>
  `;

  // Listeners
  const advanceBtn = card.querySelector(`[data-advance-person="${person.id}"]`);
  if (advanceBtn) advanceBtn.addEventListener('click', () => advancePersonStage(person.id));

  const demoteBtn = card.querySelector(`[data-demote-person="${person.id}"]`);
  if (demoteBtn) demoteBtn.addEventListener('click', () => demotePersonStage(person.id));

  card.querySelectorAll(`[data-set-stage][data-person="${person.id}"]`).forEach(dot => {
    dot.addEventListener('click', () => setPersonExactStage(person.id, dot.dataset.setStage));
  });

  const editBtn = card.querySelector(`[data-edit-person="${person.id}"]`);
  if (editBtn) editBtn.addEventListener('click', () => openEditPersonModal(person.id));

  const deleteBtn = card.querySelector(`[data-delete-person="${person.id}"]`);
  if (deleteBtn) deleteBtn.addEventListener('click', () => confirmDeletePerson(person.id));

  const logEncounterBtn = card.querySelector(`[data-log-moment-person="${person.id}"]`);
  if (logEncounterBtn) logEncounterBtn.addEventListener('click', () => openAddMomentModal(person.id));

  const toggleBtn = card.querySelector(`[data-toggle-timeline="${person.id}"]`);
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const miniList = document.getElementById(`timeline-${person.id}`);
      if (miniList) {
        const isHidden = miniList.classList.toggle('hidden');
        toggleBtn.textContent = isHidden
          ? `✨ ${encounters.length} encounter(s) ▾`
          : `✨ ${encounters.length} encounter(s) ▴`;
      }
    });
  }

  card.querySelectorAll(`[data-quick-edit="${person.id}"]`).forEach(btn => {
    btn.addEventListener('click', () => {
      openEditPersonModal(person.id, btn.dataset.focus);
    });
  });

  return card;
}

export function openAddPersonModal() {
  const modalPerson = document.getElementById('modal-person');
  if (!modalPerson) return;

  const title = document.getElementById('person-modal-title');
  const editId = document.getElementById('person-edit-id');
  const name = document.getElementById('person-input-name');
  const dob = document.getElementById('person-input-dob');
  const metAt = document.getElementById('person-input-met-at');
  const contact = document.getElementById('person-input-contact');
  const notes = document.getElementById('person-input-notes');
  const stage = document.getElementById('person-input-stage');

  if (title) title.textContent = t('person_modal_title_add');
  if (editId) editId.value = '';
  if (name) name.value = '';
  if (dob) dob.value = '';
  if (metAt) metAt.value = '';
  if (contact) contact.value = '';
  if (notes) notes.value = '';

  if (stage) stage.value = 'casual';
  document.querySelectorAll('#person-stage-selector-container .incident-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.stage === 'casual');
  });

  openModal(modalPerson);
}

export function openEditPersonModal(personId, focusField = null) {
  const person = storage.getPerson(personId);
  if (!person) return;

  const modalPerson = document.getElementById('modal-person');
  const title = document.getElementById('person-modal-title');
  const editId = document.getElementById('person-edit-id');
  const name = document.getElementById('person-input-name');
  const dob = document.getElementById('person-input-dob');
  const metAt = document.getElementById('person-input-met-at');
  const contact = document.getElementById('person-input-contact');
  const notes = document.getElementById('person-input-notes');
  const stageInput = document.getElementById('person-input-stage');

  if (title) title.textContent = t('person_modal_title_edit');
  if (editId) editId.value = person.id;
  if (name) name.value = person.name || '';
  if (dob) dob.value = person.dob || '';
  if (metAt) metAt.value = person.metAt || '';
  if (contact) contact.value = person.contact || '';
  if (notes) notes.value = person.notes || '';

  const stage = person.stage || 'casual';
  if (stageInput) stageInput.value = stage;
  document.querySelectorAll('#person-stage-selector-container .incident-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.stage === stage);
  });

  openModal(modalPerson);

  if (focusField === 'dob' && dob) {
    setTimeout(() => {
      dob.focus();
      dob.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }
  if (focusField === 'contact' && contact) {
    setTimeout(() => {
      contact.focus();
      contact.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }
  if (focusField === 'notes' && notes) {
    setTimeout(() => {
      notes.focus();
      notes.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  }
}

export function savePersonFromModal() {
  const editId = document.getElementById('person-edit-id');
  const nameInput = document.getElementById('person-input-name');
  const stageInput = document.getElementById('person-input-stage');
  const dobInput = document.getElementById('person-input-dob');
  const metAtInput = document.getElementById('person-input-met-at');
  const contactInput = document.getElementById('person-input-contact');
  const notesInput = document.getElementById('person-input-notes');
  const modalPerson = document.getElementById('modal-person');

  const id = editId.value || `person-${Date.now()}`;
  const name = nameInput ? nameInput.value.trim() : '';
  const stage = stageInput ? (stageInput.value || 'casual') : 'casual';
  const dob = dobInput ? (dobInput.value || '') : '';
  const metAt = metAtInput ? metAtInput.value.trim() : '';
  const contact = contactInput ? contactInput.value.trim() : '';
  const notes = notesInput ? notesInput.value.trim() : '';

  if (!name) {
    showToast(t('alert_person_missing_name'), 'warning');
    return;
  }

  storage.savePerson({
    id,
    name,
    stage,
    dob,
    metAt,
    contact,
    notes
  });

  closeModal(modalPerson);
  renderPeopleView();
  notifyPeopleChanged();
  showToast(t('person_saved_alert'), 'success');
}

export function confirmDeletePerson(personId) {
  if (confirm(t('confirm_delete_person'))) {
    storage.deletePerson(personId);
    renderPeopleView();
    notifyPeopleChanged();
  }
}

export function setupPeopleEvents() {
  const btnAdd = document.getElementById('btn-add-person');
  if (btnAdd) btnAdd.addEventListener('click', () => openAddPersonModal());

  const pills = document.querySelectorAll('#person-stage-selector-container .incident-pill');
  const stageInput = document.getElementById('person-input-stage');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (stageInput) {
        stageInput.value = pill.dataset.stage;
      }
    });
  });

  const form = document.getElementById('form-person-edit');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      savePersonFromModal();
    });
  }
}
