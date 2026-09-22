// Dashboard View Component
// Handles apps preview, real connections showcase / slideshow, and real moments sparks.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { escapeHtml } from '../utils/dom.js';
import { formatDateShort, calculateAge, getDaysUntilBirthday } from '../utils/formatters.js';
import { STAGE_ORDER, getStageConfig, getMomentCategoryConfig } from '../config/constants.js';
import { createAppCardElement, openAddAppModal } from './apps.view.js';
import { openAddMomentModal } from './moments.view.js';
import { renderPeopleView } from './people.view.js';
import { switchJournalSubTab } from './journal.view.js';
import { switchTab } from '../services/navigation.js';

let currentPersonSlideIndex = 0;
let personTouchStartX = 0;
let personTouchStartY = 0;

let currentDashMomentIndex = 0;

// Minimum stage required for a connection to appear on the main page showcase
const MIN_SHOWCASE_STAGES = ['regular', 'close', 'romantic'];

export function getShowcasePeople() {
  const allPeople = storage.getPeople();
  return allPeople.filter(p => p.stage && MIN_SHOWCASE_STAGES.includes(p.stage));
}

export function nextPersonSlide() {
  const showcasePeople = getShowcasePeople();
  if (showcasePeople.length <= 1) return;
  currentPersonSlideIndex = (currentPersonSlideIndex + 1) % showcasePeople.length;
  renderDashboardShowcase('slide-in-right');
}

export function prevPersonSlide() {
  const showcasePeople = getShowcasePeople();
  if (showcasePeople.length <= 1) return;
  currentPersonSlideIndex = (currentPersonSlideIndex - 1 + showcasePeople.length) % showcasePeople.length;
  renderDashboardShowcase('slide-in-left');
}

export function nextDashMoment() {
  const unassociatedMoments = storage.getMoments('unassociated');
  const moments = unassociatedMoments.length > 0 ? unassociatedMoments : storage.getMoments();
  if (moments.length <= 1) return;
  currentDashMomentIndex = (currentDashMomentIndex + 1) % moments.length;
  renderDashboardShowcase('slide-in-right');
}

export function gotoPersonProfile(personId) {
  switchTab('journal');
  switchJournalSubTab('people');
  if (personId) {
    setTimeout(() => {
      const card = document.getElementById(`person-card-${personId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight-pulse');
        setTimeout(() => card.classList.remove('highlight-pulse'), 1800);
      }
    }, 160);
  }
}

export function renderDashboard() {
  renderDashboardShowcase();

  const dashboardAppsPreview = document.getElementById('dashboard-apps-preview');
  if (!dashboardAppsPreview) return;

  const apps = storage.getActiveApps();
  dashboardAppsPreview.innerHTML = '';

  if (apps.length === 0) {
    dashboardAppsPreview.innerHTML = `
      <div class="app-card text-center" style="padding: 24px 16px;">
        <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.9rem;">${t('apps_preview_empty')}</p>
        <button class="pill-btn primary" id="btn-empty-add-app">${t('btn_add_first_app')}</button>
      </div>
    `;
    const btn = document.getElementById('btn-empty-add-app');
    if (btn) btn.addEventListener('click', () => openAddAppModal());
    return;
  }

  // Show up to 3 apps on dashboard
  apps.slice(0, 3).forEach(app => {
    const card = createAppCardElement(app, false, () => {
      switchTab('journal');
      switchJournalSubTab('stories');
    });
    dashboardAppsPreview.appendChild(card);
  });
}

export function renderDashboardShowcase(animationClass = '') {
  const dashMomentContainer = document.getElementById('dash-moment-container');
  if (!dashMomentContainer) return;

  const showcasePeople = getShowcasePeople();

  if (showcasePeople.length > 0) {
    renderDashboardPeopleSlideshow(showcasePeople, animationClass);
  } else {
    renderDashboardMomentShowcase(animationClass);
  }
}

export function renderDashboardMoment(animationClass = '') {
  renderDashboardShowcase(animationClass);
}

export function renderDashboardPeopleSlideshow(people, animationClass = '') {
  const dashMomentContainer = document.getElementById('dash-moment-container');
  if (!dashMomentContainer) return;

  if (currentPersonSlideIndex >= people.length) currentPersonSlideIndex = 0;
  if (currentPersonSlideIndex < 0) currentPersonSlideIndex = people.length - 1;

  const person = people[currentPersonSlideIndex];
  const stageConfig = getStageConfig(person.stage);
  const initial = (person.name || '?').charAt(0).toUpperCase();
  const isMultiple = people.length > 1;

  const age = calculateAge(person.dob);
  const ageStr = age !== null ? t('person_age_label', { age }) : '';
  const daysUntil = getDaysUntilBirthday(person.dob);
  const upcomingBadge = daysUntil !== null
    ? `<span class="person-bday-badge">${t('person_upcoming_bday', { days: daysUntil })}</span>`
    : '';

  const encounters = storage.getMomentsForPerson(person.id);
  const latestEncounter = encounters.length > 0 ? encounters[0] : null;

  const stepDotsHtml = STAGE_ORDER.map(stg => {
    const stepCfg = getStageConfig(stg);
    const isActive = stg === person.stage;
    return `
      <button type="button" class="progression-dot ${isActive ? 'active' : ''}" data-dash-set-stage="${stg}" data-person="${person.id}" title="${escapeHtml(stepCfg.name)}" aria-label="${escapeHtml(stepCfg.name)}">
        <span class="prog-dot-icon">${stepCfg.icon}</span>
        <span class="prog-dot-text">${escapeHtml(stepCfg.name)}</span>
      </button>
    `;
  }).join('');

  dashMomentContainer.className = 'dash-showcase-card mode-person';
  dashMomentContainer.innerHTML = `
    <div class="dash-moment-header">
      <div class="dash-moment-badge-group">
        <span class="dash-person-badge">
          <span>👥</span>
          <span>${t('dash_person_showcase_badge')}</span>
        </span>
        <span class="person-stage-badge ${person.stage}">
          <span>${stageConfig.icon}</span>
          <span>${stageConfig.name}</span>
        </span>
      </div>
      <div class="dash-moment-actions">
        ${isMultiple ? `
          <button type="button" id="btn-prev-person-slide" class="dash-action-icon-btn" title="${t('btn_prev')}">
            ◀
          </button>
          <button type="button" id="btn-next-person-slide" class="dash-action-icon-btn" title="${t('btn_next')}">
            ▶
          </button>
        ` : ''}
        <button type="button" class="dash-action-icon-btn" data-add-encounter="${person.id}" title="${t('person_btn_add_encounter')}">
          ➕
        </button>
      </div>
    </div>

    <div class="dash-person-slide ${animationClass}" id="dash-person-slide-content">
      <!-- Person Identity -->
      <div class="person-identity" style="cursor: pointer;" data-goto-person="${person.id}">
        <div class="person-avatar">${escapeHtml(initial)}</div>
        <div class="person-title-wrap">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <h3 class="person-name" style="font-size: 1.25rem;">${escapeHtml(person.name)}</h3>
            ${upcomingBadge}
          </div>
          <div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 500;">
            ${stageConfig.name} ${ageStr ? `· ${ageStr}` : ''}
          </div>
        </div>
      </div>

      <!-- Relationship Progression Track -->
      <div class="progression-card-box">
        <div class="progression-header-row">
          <span class="progression-label">
            ${t('progression_level', { level: stageConfig.level, stage: stageConfig.name, percent: stageConfig.percent })}
          </span>
        </div>
        <div class="progression-track">
          <div class="progression-fill ${stageConfig.colorClass || `stage-${stageConfig.class}`}" style="width: ${stageConfig.percent}%;"></div>
        </div>
        <div class="progression-steps-dots">
          ${stepDotsHtml}
        </div>
      </div>

      <!-- Details (Met at & Notes) -->
      ${person.metAt ? `
        <div class="person-detail-row">
          <span>📍</span>
          <span>${t('person_met_at_label', { loc: escapeHtml(person.metAt) })}</span>
        </div>
      ` : ''}

      ${person.notes ? `
        <div class="person-notes-box">"${escapeHtml(person.notes)}"</div>
      ` : ''}

      <!-- Latest Encounter Spotlight -->
      ${latestEncounter ? `
        <div class="dash-person-encounter-box">
          <div class="dash-person-encounter-header">
            <span>✨</span>
            <span>${t('dash_person_latest_encounter')} (${formatDateShort(latestEncounter.date)})</span>
          </div>
          <p class="dash-person-encounter-text">"${escapeHtml(latestEncounter.story)}"</p>
        </div>
      ` : `
        <div style="margin-top: 4px;">
          <button type="button" class="person-quick-add-link" data-add-encounter="${person.id}">
            ${t('dash_person_first_encounter', { name: escapeHtml(person.name) })}
          </button>
        </div>
      `}
    </div>

    <div class="dash-moment-footer">
      <div style="display: flex; align-items: center; gap: 10px;">
        ${isMultiple ? `
          <div class="dash-carousel-dots">
            ${people.map((p, idx) => `
              <button type="button" class="carousel-dot ${idx === currentPersonSlideIndex ? 'active' : ''}" data-goto-slide="${idx}" title="${escapeHtml(p.name)}" aria-label="Slide ${idx+1}"></button>
            `).join('')}
          </div>
          <span class="dash-moment-count">${t('dash_person_slide_count', { current: currentPersonSlideIndex + 1, total: people.length })}</span>
        ` : `
          <span class="dash-moment-count">${t('dash_person_single_count')}</span>
        `}
      </div>
      <button type="button" id="btn-goto-connections" class="dash-moment-link">
        <span>${t('dash_person_btn_view_connections')}</span> &rarr;
      </button>
    </div>
  `;

  // Event listeners
  const btnPrev = dashMomentContainer.querySelector('#btn-prev-person-slide');
  if (btnPrev) btnPrev.addEventListener('click', () => prevPersonSlide());

  const btnNext = dashMomentContainer.querySelector('#btn-next-person-slide');
  if (btnNext) btnNext.addEventListener('click', () => nextPersonSlide());

  const btnGoto = dashMomentContainer.querySelector('#btn-goto-connections');
  if (btnGoto) {
    btnGoto.addEventListener('click', () => {
      switchTab('journal');
      switchJournalSubTab('people');
    });
  }

  const addEncBtns = dashMomentContainer.querySelectorAll('[data-add-encounter]');
  addEncBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openAddMomentModal(btn.dataset.addEncounter);
    });
  });

  const gotoPersonEls = dashMomentContainer.querySelectorAll('[data-goto-person]');
  gotoPersonEls.forEach(el => {
    el.addEventListener('click', () => gotoPersonProfile(el.dataset.gotoPerson));
  });

  const dotBtns = dashMomentContainer.querySelectorAll('[data-goto-slide]');
  dotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.dataset.gotoSlide, 10);
      if (!isNaN(targetIdx) && targetIdx !== currentPersonSlideIndex) {
        const anim = targetIdx > currentPersonSlideIndex ? 'slide-in-right' : 'slide-in-left';
        currentPersonSlideIndex = targetIdx;
        renderDashboardShowcase(anim);
      }
    });
  });

  const stageBtns = dashMomentContainer.querySelectorAll('[data-dash-set-stage]');
  stageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const stg = btn.dataset.dashSetStage;
      const pId = btn.dataset.person;
      if (stg && pId) {
        storage.setPersonStage(pId, stg);
        renderDashboardShowcase();
        renderPeopleView();
      }
    });
  });

  // Touch Swipe Gestures
  dashMomentContainer.ontouchstart = (e) => {
    if (e.touches && e.touches.length === 1) {
      personTouchStartX = e.touches[0].clientX;
      personTouchStartY = e.touches[0].clientY;
    }
  };

  dashMomentContainer.ontouchend = (e) => {
    if (!isMultiple) return;
    if (e.changedTouches && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - personTouchStartX;
      const diffY = e.changedTouches[0].clientY - personTouchStartY;
      if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextPersonSlide();
        } else {
          prevPersonSlide();
        }
      }
    }
  };

  // Desktop Mouse Drag / Swipe
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isMouseDown = false;
  dashMomentContainer.onmousedown = (e) => {
    if (e.target.closest('button, a, input, select, textarea, [data-goto-person], [data-dash-set-stage]')) return;
    isMouseDown = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
  };
  dashMomentContainer.onmouseup = (e) => {
    if (!isMouseDown || !isMultiple) {
      isMouseDown = false;
      return;
    }
    isMouseDown = false;
    const diffX = e.clientX - mouseStartX;
    const diffY = e.clientY - mouseStartY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextPersonSlide();
      } else {
        prevPersonSlide();
      }
    }
  };
  dashMomentContainer.onmouseleave = () => {
    isMouseDown = false;
  };
}

export function renderDashboardMomentShowcase(animationClass = '') {
  const dashMomentContainer = document.getElementById('dash-moment-container');
  if (!dashMomentContainer) return;

  const unassociatedMoments = storage.getMoments('unassociated');
  // By default, only show real sparks that aren't associated with a specific person
  const moments = unassociatedMoments.length > 0 ? unassociatedMoments : storage.getMoments();
  
  if (moments.length === 0) {
    dashMomentContainer.className = 'dash-showcase-card mode-spark';
    dashMomentContainer.innerHTML = `
      <div class="dash-moment-header">
        <div class="dash-moment-badge-group">
          <span class="dash-moment-badge">
            <span>✨</span>
            <span>${t('dash_moment_badge')}</span>
          </span>
        </div>
        <div class="dash-moment-actions">
          <button type="button" id="btn-add-dash-moment" class="dash-action-icon-btn" title="${t('dash_moment_btn_add')}">
            ➕
          </button>
        </div>
      </div>
      <div class="dash-moment-body">
        <p class="dash-moment-story">"${t('dash_moment_empty')}"</p>
      </div>
      <div class="dash-moment-footer">
        <span class="dash-moment-count">0</span>
        <button type="button" id="btn-add-dash-moment-link" class="dash-moment-link">
          <span>${t('btn_add_moment')}</span> &rarr;
        </button>
      </div>
    `;

    const addBtn = dashMomentContainer.querySelector('#btn-add-dash-moment');
    if (addBtn) addBtn.addEventListener('click', () => openAddMomentModal());
    const addLink = dashMomentContainer.querySelector('#btn-add-dash-moment-link');
    if (addLink) addLink.addEventListener('click', () => openAddMomentModal());
    return;
  }

  if (currentDashMomentIndex >= moments.length) {
    currentDashMomentIndex = 0;
  }

  const moment = moments[currentDashMomentIndex];
  const catConfig = getMomentCategoryConfig(moment.category);

  let linkedPerson = null;
  if (moment.personId) {
    linkedPerson = storage.getPerson(moment.personId);
  }
  const personDisplayName = linkedPerson ? linkedPerson.name : (moment.personName || '');
  const personInitial = personDisplayName ? personDisplayName.charAt(0).toUpperCase() : '?';

  dashMomentContainer.className = 'dash-showcase-card mode-spark';
  dashMomentContainer.innerHTML = `
    <div class="dash-moment-header">
      <div class="dash-moment-badge-group">
        <span class="dash-moment-badge">
          <span>✨</span>
          <span>${t('dash_moment_badge')}</span>
        </span>
        <span class="dash-moment-category-tag ${catConfig.class}">
          <span>${catConfig.icon}</span>
          <span>${escapeHtml(catConfig.label)}</span>
        </span>
        ${personDisplayName ? `
          <span class="dash-moment-person-badge" ${linkedPerson ? `data-goto-person="${linkedPerson.id}"` : ''} title="${t('btn_view_profile')}">
            👤 ${t('dash_moment_connected_badge', { name: escapeHtml(personDisplayName) })}
          </span>
        ` : ''}
      </div>
      <div class="dash-moment-actions">
        ${moments.length > 1 ? `
          <button type="button" id="btn-next-dash-moment" class="dash-action-icon-btn" title="${t('dash_moment_btn_next')}">
            🔄
          </button>
        ` : ''}
        <button type="button" id="btn-add-dash-moment" class="dash-action-icon-btn" title="${t('dash_moment_btn_add')}">
          ➕
        </button>
      </div>
    </div>

    <div class="dash-moment-body ${animationClass}">
      <div class="dash-moment-meta">
        ${moment.location ? `<span class="dash-moment-location">📍 ${escapeHtml(moment.location)}</span>` : ''}
        ${moment.date ? `<span class="dash-moment-date">${formatDateShort(moment.date)}</span>` : ''}
      </div>

      <!-- Prominently Highlight Connected Person if linked -->
      ${personDisplayName ? `
        <div class="dash-moment-connected-person-card" ${linkedPerson ? `data-goto-person="${linkedPerson.id}"` : ''}>
          <div class="dash-person-mini-avatar">${escapeHtml(personInitial)}</div>
          <div class="dash-person-mini-info">
            <div class="dash-person-mini-name">
              <span>${escapeHtml(personDisplayName)}</span>
              ${linkedPerson ? `<span class="person-stage-badge ${linkedPerson.stage}">${getStageConfig(linkedPerson.stage).name}</span>` : ''}
            </div>
            <div class="dash-person-mini-sub">
              ${t('dash_moment_connected_sub', { name: escapeHtml(personDisplayName) })}
            </div>
          </div>
          ${linkedPerson ? `
            <button type="button" class="dash-person-mini-link" data-goto-person="${linkedPerson.id}">
              ${t('btn_view_profile')} &rarr;
            </button>
          ` : ''}
        </div>
      ` : ''}

      ${moment.title ? `<h4 style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-top: 2px;">${escapeHtml(moment.title)}</h4>` : ''}

      <p class="dash-moment-story">"${escapeHtml(moment.story)}"</p>

      ${moment.feeling ? `
        <div class="dash-moment-feeling-box">
          <div class="dash-moment-feeling-header">
            <span>💡</span>
            <span>${t('dash_moment_how_felt')}</span>
          </div>
          <div class="dash-moment-feeling-text">
            ${escapeHtml(moment.feeling)}
          </div>
        </div>
      ` : ''}
    </div>

    <div class="dash-moment-footer">
      <span class="dash-moment-count">${currentDashMomentIndex + 1} / ${moments.length}</span>
      <button type="button" id="btn-goto-moments" class="dash-moment-link">
        <span>${t('dash_moment_btn_view_all', { count: moments.length })}</span> &rarr;
      </button>
    </div>
  `;

  // Event listeners
  const btnNext = dashMomentContainer.querySelector('#btn-next-dash-moment');
  if (btnNext) btnNext.addEventListener('click', () => nextDashMoment());

  const btnAdd = dashMomentContainer.querySelector('#btn-add-dash-moment');
  if (btnAdd) btnAdd.addEventListener('click', () => openAddMomentModal());

  const btnGoto = dashMomentContainer.querySelector('#btn-goto-moments');
  if (btnGoto) {
    btnGoto.addEventListener('click', () => {
      switchTab('journal');
      switchJournalSubTab('moments');
    });
  }

  const gotoPersonEls = dashMomentContainer.querySelectorAll('[data-goto-person]');
  gotoPersonEls.forEach(el => {
    el.addEventListener('click', () => gotoPersonProfile(el.dataset.gotoPerson));
  });

  // Touch Swipe Gestures for Moments
  dashMomentContainer.ontouchstart = (e) => {
    if (e.touches && e.touches.length === 1) {
      personTouchStartX = e.touches[0].clientX;
      personTouchStartY = e.touches[0].clientY;
    }
  };

  dashMomentContainer.ontouchend = (e) => {
    if (moments.length <= 1) return;
    if (e.changedTouches && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - personTouchStartX;
      const diffY = e.changedTouches[0].clientY - personTouchStartY;
      if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY)) {
        nextDashMoment();
      }
    }
  };
}
