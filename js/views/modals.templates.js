// Modals HTML Templates
// Cleanly encapsulates all 10 modal sheets, dynamically injected into #modals-container.

import { translateDOM } from '../services/i18n.js';
import { setupModalDismissListeners } from '../utils/dom.js';

export function getModalsHtml() {
  return `
  <!-- Modal 1: URGE SHIELD / SOS -->
  <div id="modal-sos" class="modal-backdrop">
    <div class="modal-sheet urge-overlay-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title" data-i18n="sos_modal_title">Craving Shield</h3>
        <button class="close-btn" data-close="modal-sos">✕</button>
      </div>

      <div class="modal-sheet-content urge-overlay-container">
        <!-- App Selector -->
        <div class="urge-app-picker" style="width: 100%; margin-bottom: 12px;">
          <label class="form-label" for="sos-app-select" style="font-size: 0.8rem; margin-bottom: 4px;" data-i18n="sos_app_select_label">Which app are you tempted to download?</label>
          <select id="sos-app-select" class="form-control" style="width: 100%; font-weight: 500;">
            <!-- Populated dynamically -->
          </select>
        </div>

        <!-- Personal Motivation Showcase -->
        <div class="urge-motivation-showcase">
          <span id="sos-app-label" class="urge-showcase-app" data-i18n="sos_label_why_app">Why you deleted this app:</span>
          <p id="sos-motivation-text" class="urge-showcase-text">
            "Remember why you stepped away."
          </p>
        </div>

        <!-- Real Experience / Story Showcase (Anti-Craving Deterrent) -->
        <div id="sos-story-showcase" class="sos-story-box hidden">
          <div class="sos-story-header">
            <span class="sos-story-icon">⚡</span>
            <span id="sos-story-label" class="sos-story-label" data-i18n="sos_story_label">Real Story from this app:</span>
          </div>
          <div class="sos-story-content">
            <div id="sos-story-person" class="sos-story-person"></div>
            <p id="sos-story-text" class="sos-story-text"></p>
            <div class="sos-story-lesson">
              <strong data-i18n="sos_story_takeaway">Reality Check:</strong>
              <span id="sos-story-lesson-text"></span>
            </div>
          </div>
        </div>

        <!-- 2-Minute Guided Box Breathing -->
        <div id="breathing-circle" class="breathing-box">
          <span id="breathing-instruction" class="breathing-instruction">Breathe In</span>
          <span id="breathing-timer" class="breathing-countdown">4s</span>
        </div>

        <button id="btn-toggle-breathing" class="pill-btn" style="margin-bottom: 16px;">
          ⏸ Pause Breathing
        </button>

        <!-- 5 Real-Life Grounding Alternatives -->
        <div class="alternatives-list">
          <span class="alternatives-title" data-i18n="sos_grounding_title">5 Quick Grounding Alternatives</span>
          <div class="alternative-item" data-i18n="sos_grounding_1">💧 Drink a tall glass of cold water slowly</div>
          <div class="alternative-item" data-i18n="sos_grounding_2">🚶 Step outside for 3 minutes without looking at your screen</div>
          <div class="alternative-item" data-i18n="sos_grounding_3">📖 Read 5 pages of a physical book or magazine</div>
          <div class="alternative-item" data-i18n="sos_grounding_4">💬 Send an honest, caring text to an existing close friend</div>
          <div class="alternative-item" data-i18n="sos_grounding_5">🧘 Do 10 slow shoulder rolls and take 5 deep sighs</div>
        </div>

        <button class="pill-btn primary" data-close="modal-sos" style="width: 100%; justify-content: center; margin-top: 14px;" data-i18n="btn_grounded_done">
          I Feel Grounded Now
        </button>
      </div>
    </div>
  </div>

  <!-- Modal 2: ADD / EDIT APP -->
  <div id="modal-app" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 id="app-modal-title" class="sheet-title" data-i18n="app_modal_title_add">Add Tracked App</h3>
        <button class="close-btn" data-close="modal-app">✕</button>
      </div>

      <form id="form-app-edit">
        <div class="modal-sheet-content">
          <input type="hidden" id="app-edit-id" value="">

          <!-- Quick Presets -->
          <div class="form-group">
            <label class="form-label" data-i18n="app_form_presets">Quick Presets</label>
            <div class="preset-chips">
              <button type="button" class="preset-chip" data-preset="Hinge" data-color="#60221E" data-min="45" data-cost="29.99" data-rate="1.2">
                <img src="icons/hinge_logo.svg" class="preset-chip-icon" alt="Hinge">
                <span>Hinge</span>
              </button>
              <button type="button" class="preset-chip" data-preset="Tinder" data-color="#FD3A73" data-min="45" data-cost="24.99" data-rate="3.0">
                <img src="icons/tinder_logo.svg" class="preset-chip-icon" alt="Tinder">
                <span>Tinder</span>
              </button>
              <button type="button" class="preset-chip" data-preset="Bumble" data-color="#F4B400" data-min="30" data-cost="19.99" data-rate="2.2">
                <img src="icons/bumble_logo.svg" class="preset-chip-icon" alt="Bumble">
                <span>Bumble</span>
              </button>
              <button type="button" class="preset-chip" data-preset="Badoo" data-color="#783BF9" data-min="30" data-cost="14.99" data-rate="3.0">
                <img src="icons/badoo_logo.svg" class="preset-chip-icon" alt="Badoo">
                <span>Badoo</span>
              </button>
              <button type="button" class="preset-chip" data-preset="Grindr" data-color="#FFC700" data-min="45" data-cost="29.99" data-rate="2.5">
                <img src="icons/grindr_logo.svg" class="preset-chip-icon" alt="Grindr">
                <span>Grindr</span>
              </button>
              <button type="button" class="preset-chip" data-preset="Feeld" data-color="#000000" data-min="30" data-cost="19.99" data-rate="1.6">
                <span>Feeld</span>
              </button>
              <button type="button" class="preset-chip" data-preset="Other" data-color="#CC785C" data-min="30" data-cost="0" data-rate="2.0">
                <span>Custom</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="app-input-name" data-i18n="app_form_name">App Name</label>
            <input type="text" id="app-input-name" class="form-control" data-i18n-placeholder="app_form_name_placeholder" placeholder="e.g. Hinge" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="app-input-quitdate" data-i18n="app_form_quitdate">Quit Date & Time</label>
            <input type="datetime-local" id="app-input-quitdate" class="form-control" required>
            <span class="form-help" data-i18n="app_form_quitdate_help">When did you stop using or delete this app?</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="app-input-minutes" data-i18n="app_form_minutes">Minutes / Day</label>
              <input type="number" id="app-input-minutes" class="form-control" value="45" min="1" max="1440">
              <span class="form-help" data-i18n="app_form_minutes_help">Daily time spent</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="app-input-cost" data-i18n="app_form_cost">Monthly Fee</label>
              <input type="text" inputmode="decimal" id="app-input-cost" class="form-control" value="25" placeholder="e.g. 24.99">
              <span class="form-help" data-i18n="app_form_cost_help">Subscription avoided</span>
            </div>
          </div>

          <!-- Never Paid Option -->
          <div class="form-group" style="margin-top: -6px; margin-bottom: 12px;">
            <label class="checkbox-option" style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; padding: 6px 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); transition: background var(--transition-fast);">
              <input type="checkbox" id="app-input-never-paid" style="width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer;">
              <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-primary);" data-i18n="app_form_never_paid">I never paid for this app (Free account)</span>
            </label>
          </div>

          <!-- Realistic Swipe Rate & Avoided Swipes Preview -->
          <div class="form-row" style="margin-bottom: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="app-input-rate" data-i18n="app_form_swipe_rate">Swipe Speed</label>
              <input type="text" inputmode="decimal" id="app-input-rate" class="form-control" value="2.0" placeholder="e.g. 2.0">
              <span class="form-help" id="app-rate-hint" data-i18n="app_form_rate_help">Swipes/min (default 2.0)</span>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="app-input-swipes" data-i18n="app_form_swipes_preview">Swipes Avoided / Day</label>
              <input type="number" id="app-input-swipes" class="form-control" value="90" readonly style="background: var(--bg-subtle); cursor: default; font-weight: 600;">
              <span class="form-help" data-i18n="app_form_swipes_help">From minutes & speed</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="app-input-motivation" data-i18n="app_form_motivation">Why did you delete this app?</label>
            <textarea id="app-input-motivation" class="form-control" rows="2" data-i18n-placeholder="app_form_motivation_placeholder" placeholder="e.g. Tired of superficial swiping and endless pen-pals. I want real human connection." required></textarea>
            <span class="form-help" data-i18n="app_form_motivation_help">Shown whenever you feel tempted to redownload.</span>
          </div>
        </div>

        <div class="modal-sheet-footer">
          <button type="button" class="pill-btn" data-close="modal-app" style="flex: 1; justify-content: center;" data-i18n="btn_cancel">Cancel</button>
          <button type="submit" class="pill-btn primary" style="flex: 2; justify-content: center;" data-i18n="btn_save_app">Save App</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 3: RESET APP SLIP-UP -->
  <div id="modal-reset" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title" data-i18n="reset_modal_title">Reset App Streak</h3>
        <button class="close-btn" data-close="modal-reset">✕</button>
      </div>

      <div class="modal-sheet-content">
        <p id="reset-modal-explanation" style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 14px;">
          Did you redownload or browse <strong id="reset-app-name">this app</strong>? Slips happen during recovery. Your past streak will be preserved in history, and you can restart with compassion.
        </p>

        <div class="form-group">
          <label class="form-label" for="reset-reason-input" data-i18n="reset_form_reason">What triggered the slip? (Optional reflection)</label>
          <textarea id="reset-reason-input" class="form-control" rows="2" data-i18n-placeholder="reset_form_reason_placeholder" placeholder="e.g. Felt lonely on a Friday night..."></textarea>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 16px;">
          <button type="button" class="pill-btn" data-close="modal-reset" style="flex: 1; justify-content: center;" data-i18n="btn_keep_streak">Keep My Streak</button>
          <button type="button" id="btn-confirm-reset" class="pill-btn" style="flex: 1; justify-content: center; background: var(--danger); color: white; border-color: var(--danger);" data-i18n="btn_confirm_reset">Reset Counter</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 4: SETTINGS & BACKUP -->
  <div id="modal-settings" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title" data-i18n="settings_modal_title">Settings & Data Safety</h3>
        <button class="close-btn" data-close="modal-settings">✕</button>
      </div>

      <div class="modal-sheet-content">
        <!-- App Appearance -->
        <div class="settings-group">
          <div class="settings-group-title" data-i18n="settings_group_appearance">Appearance & Currency</div>
          <div class="settings-row">
            <div>
              <span class="settings-row-label" data-i18n="settings_theme_label">Theme</span>
              <span class="settings-row-sub" data-i18n="settings_theme_sub">Choose your favorite UI style</span>
            </div>
            <select id="settings-theme-select" class="form-control" style="width: auto; padding: 6px 12px; font-weight: 500;">
              <option value="claude-light">☀️ Claude Light</option>
              <option value="claude-dark">🌙 Claude Dark</option>
              <option value="gemini">✨ Google Gemini</option>
              <option value="chatgpt">🟢 ChatGPT</option>
              <option value="github">🐙 GitHub</option>
              <option value="steam">🎮 Steam</option>
            </select>
          </div>
          <div class="settings-row">
            <div>
              <span class="settings-row-label" data-i18n="settings_lang_label">Language</span>
              <span class="settings-row-sub" data-i18n="settings_lang_sub">Choose your interface language</span>
            </div>
            <select id="settings-lang-select" class="form-control" style="width: auto; padding: 6px 12px; font-weight: 500;">
              <option value="en">🇬🇧 English</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>
          <div class="settings-row">
            <div>
              <span class="settings-row-label" data-i18n="settings_currency_label">Currency Symbol</span>
              <span class="settings-row-sub" data-i18n="settings_currency_sub">For subscription savings</span>
            </div>
            <select id="settings-currency-select" class="form-control" style="width: auto; padding: 6px 10px;">
              <option value="€">EUR (€)</option>
              <option value="$">USD ($)</option>
              <option value="£">GBP (£)</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>

        <!-- Safe Updates & Persistence -->
        <div class="settings-group">
          <div class="settings-group-title" data-i18n="settings_group_updates">App Updates & Persistence</div>
          <div class="settings-row">
            <div>
              <span class="settings-row-label" data-i18n="settings_zero_loss_label">Zero Data Loss Guarantee</span>
              <span class="settings-row-sub" data-i18n="settings_zero_loss_sub">Streaks are saved on device; code updates never delete your data</span>
            </div>
            <span style="font-size: 1.1rem; color: var(--success);">🛡️</span>
          </div>
          <div class="settings-row">
            <div>
              <span class="settings-row-label" data-i18n="settings_check_updates_label">Check for App Updates</span>
              <span class="settings-row-sub" id="update-status-text" data-i18n="settings_status_up_to_date">Up to date</span>
            </div>
            <button id="btn-check-updates" class="pill-btn" data-i18n="btn_check_updates">Check</button>
          </div>
        </div>

        <!-- Backup & Restore -->
        <div class="settings-group">
          <div class="settings-group-title" data-i18n="settings_group_backup">Safe Backup & Restore</div>
          <p class="form-help" style="margin-bottom: 12px;" data-i18n="settings_backup_desc">
            Export your streaks, tracked apps, and notes to a file or copy them to your clipboard anytime.
          </p>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="btn-export-backup" class="pill-btn" style="width: 100%; justify-content: center;" data-i18n="btn_download_backup">
              📥 Download Backup File (JSON)
            </button>
            <button id="btn-copy-backup" class="pill-btn" style="width: 100%; justify-content: center;" data-i18n="btn_copy_backup">
              📋 Copy Backup to Clipboard
            </button>
            <button id="btn-restore-backup" class="pill-btn" style="width: 100%; justify-content: center;" data-i18n="btn_restore_backup">
              📤 Restore from Backup File
            </button>
            <input type="file" id="file-import-backup" accept=".json" style="position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none; top: -9999px; left: -9999px;">
          </div>
        </div>

        <!-- Mobile Home Screen Guide Trigger -->
        <div class="settings-group">
          <div class="settings-group-title" data-i18n="settings_group_mobile">Mobile Installation</div>
          <p class="form-help" style="margin-bottom: 8px;" data-i18n="settings_mobile_desc">
            Use as a full-screen app on iPhone or Android without browser URL bars.
          </p>
          <button id="btn-show-ios-guide" class="pill-btn" style="width: 100%; justify-content: center;" data-i18n="btn_show_mobile_guide">
            📱 How to Install on Mobile (iPhone & Android)
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal 5: MOBILE INSTALLATION GUIDE -->
  <div id="modal-ios-guide" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title" data-i18n="mobile_guide_title">Install on Mobile</h3>
        <button class="close-btn" data-close="modal-ios-guide">✕</button>
      </div>

      <div class="modal-sheet-content" style="display: flex; flex-direction: column; gap: 14px; padding: 6px 0;">
        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 1.4rem;">🍎</span>
          <div>
            <strong style="color: var(--text-primary); font-size: 0.92rem;" data-i18n="guide_iphone_title">On iPhone (Safari)</strong>
            <p class="form-help" data-i18n-html="guide_iphone_desc">Open in Safari &rarr; Tap the <strong>Share</strong> button (square with arrow) &rarr; Tap <strong>"Add to Home Screen"</strong>.</p>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 1.4rem;">🤖</span>
          <div>
            <strong style="color: var(--text-primary); font-size: 0.92rem;" data-i18n="guide_android_title">On Android (Chrome / Samsung)</strong>
            <p class="form-help" data-i18n-html="guide_android_desc">Open in Chrome &rarr; Tap the <strong>three dots (⋮)</strong> in the top right &rarr; Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 1.4rem;">✨</span>
          <div>
            <strong style="color: var(--text-primary); font-size: 0.92rem;" data-i18n="guide_standalone_title">Standalone Offline App</strong>
            <p class="form-help" data-i18n-html="guide_standalone_desc">Launch from your phone's home screen. It opens full-screen like a native app and works offline.</p>
          </div>
        </div>

        <button class="pill-btn primary" data-close="modal-ios-guide" style="width: 100%; justify-content: center; margin-top: 10px;" data-i18n="btn_got_it">
          Got It
        </button>
      </div>
    </div>
  </div>

  <!-- Modal 6: PHONE CONNECT & QR CODE -->
  <div id="modal-phone-connect" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 class="sheet-title" data-i18n="mobile_connect_title">Add to Mobile</h3>
        <button class="close-btn" data-close="modal-phone-connect">✕</button>
      </div>

      <div class="modal-sheet-content" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
        <p class="form-help" style="margin-bottom: 0;" data-i18n="mobile_connect_desc">
          Scan with your phone's Camera (iPhone or Android) to open this app directly:
        </p>

        <div id="phone-qr-container" style="display: flex; justify-content: center; margin: 4px 0;">
          <img src="icons/qr-code.png" width="240" height="240" alt="Mobile QR Code" style="border-radius: 14px; background: #FFFFFF; padding: 8px; box-shadow: 0 6px 24px rgba(0,0,0,0.12);">
        </div>

        <div style="width: 100%; display: flex; gap: 8px; align-items: center;">
          <input type="text" id="phone-url-display" class="form-control" readonly style="font-family: var(--font-mono); font-size: 0.82rem; text-align: center;">
          <button id="btn-copy-phone-url" class="pill-btn" style="flex-shrink: 0;" data-i18n="btn_copy">Copy</button>
        </div>

        <div class="settings-group" style="width: 100%; text-align: left; margin-bottom: 0;">
          <div class="settings-group-title" data-i18n="mobile_quick_steps">Quick Steps</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; display: flex; flex-direction: column; gap: 8px;">
            <div data-i18n-html="mobile_step_1">1. Make sure your phone is on the <strong>same Wi-Fi network</strong>.</div>
            <div data-i18n-html="mobile_step_2">2. Point your phone <strong>Camera</strong> at the QR code and tap the link.</div>
            <div data-i18n-html="mobile_step_3_ios">3. <strong>iPhone</strong>: Tap Share &rarr; <em>"Add to Home Screen"</em>.<br>
               &nbsp;&nbsp;&nbsp;<strong>Android</strong>: Tap Menu (⋮) &rarr; <em>"Install app"</em> or <em>"Add to Home screen"</em>.</div>
          </div>
        </div>

        <button class="pill-btn primary" data-close="modal-phone-connect" style="width: 100%; justify-content: center; margin-top: 4px;" data-i18n="btn_done">
          Done
        </button>
      </div>
    </div>
  </div>

  <!-- Modal 7: ADD / EDIT REALITY CHECK STORY -->
  <div id="modal-story" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 id="story-modal-title" class="sheet-title" data-i18n="story_modal_title_add">Log Reality Check</h3>
        <button class="close-btn" data-close="modal-story">✕</button>
      </div>

      <form id="form-story-edit">
        <div class="modal-sheet-content">
          <input type="hidden" id="story-edit-id" value="">

          <div class="form-group">
            <label class="form-label" for="story-input-app" data-i18n="story_form_app">Dating App</label>
            <select id="story-input-app" class="form-control" required></select>
          </div>

          <div class="form-group">
            <label class="form-label" for="story-input-person" data-i18n="story_form_person">Person / Nickname (Optional)</label>
            <input type="text" id="story-input-person" class="form-control" data-i18n-placeholder="story_form_person_placeholder" placeholder="e.g. Sarah, Hinge coffee date, Alex...">
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="story_form_incident_type">What kind of experience was it?</label>
            <div class="incident-selector" id="incident-selector-container">
              <div class="incident-pill selected" data-type="ghosting">
                <span>👻</span>
                <span data-i18n="incident_ghosted">Ghosted</span>
              </div>
              <div class="incident-pill" data-type="stood_up">
                <span>🚫</span>
                <span data-i18n="incident_stood_up">Stood Up / Flaked</span>
              </div>
              <div class="incident-pill" data-type="penpal">
                <span>💬</span>
                <span data-i18n="incident_penpal">Endless Pen-Pal</span>
              </div>
              <div class="incident-pill" data-type="catfish">
                <span>🎭</span>
                <span data-i18n="incident_catfish">Catfished / Deceptive</span>
              </div>
              <div class="incident-pill" data-type="toxic">
                <span>🚩</span>
                <span data-i18n="incident_toxic">Rude / Disrespectful</span>
              </div>
              <div class="incident-pill" data-type="burnout">
                <span>😮‍💨</span>
                <span data-i18n="incident_burnout">Superficial / Burnout</span>
              </div>
              <div class="incident-pill" data-type="other">
                <span>📝</span>
                <span data-i18n="incident_other">Other Encounter</span>
              </div>
            </div>
            <input type="hidden" id="story-input-incident" value="ghosting">
          </div>

          <div class="form-group">
            <label class="form-label" for="story-input-text" data-i18n="story_form_what_happened">What happened? (The Story)</label>
            <textarea id="story-input-text" class="form-control" rows="3" data-i18n-placeholder="story_form_what_happened_placeholder" placeholder="Describe the conversation, date, or sudden turn of events..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="story-input-lesson" data-i18n="story_form_lesson">Why did this make you tired of dating apps? (The Reality Check)</label>
            <textarea id="story-input-lesson" class="form-control" rows="2" data-i18n-placeholder="story_form_lesson_placeholder" placeholder="e.g. Tired of people treating human connection like a disposable catalog..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="story-input-date" data-i18n="story_form_date">Approximate Date</label>
            <input type="date" id="story-input-date" class="form-control">
          </div>
        </div>

        <div class="modal-sheet-footer">
          <button type="button" class="pill-btn" data-close="modal-story" style="flex: 1; justify-content: center;" data-i18n="btn_cancel">Cancel</button>
          <button type="submit" class="pill-btn primary" style="flex: 2; justify-content: center;" data-i18n="btn_save_story">Save Reality Check</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 8: ADD / EDIT REAL-WORLD MOMENT -->
  <div id="modal-moment" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 id="moment-modal-title" class="sheet-title" data-i18n="moment_modal_title_add">Log Real-World Interaction</h3>
        <button class="close-btn" data-close="modal-moment">✕</button>
      </div>

      <form id="form-moment-edit">
        <div class="modal-sheet-content">
          <input type="hidden" id="moment-edit-id" value="">

          <div class="form-group">
            <label class="form-label" for="moment-input-title" data-i18n="moment_form_title">Headline / What was it?</label>
            <input type="text" id="moment-input-title" class="form-control" data-i18n-placeholder="moment_form_title_placeholder" placeholder="e.g. Chat waiting for coffee, Bookstore laugh..." required>
          </div>

          <div class="form-group">
            <label class="form-label" for="moment-input-location" data-i18n="moment_form_location">Location / Setting</label>
            <input type="text" id="moment-input-location" class="form-control" data-i18n-placeholder="moment_form_location_placeholder" placeholder="e.g. Local café, Gym, Bookstore, Train, Park..." required>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="moment_form_category">What kind of interaction was it?</label>
            <div class="incident-selector" id="moment-category-selector-container">
              <div class="incident-pill selected" data-cat="spark">
                <span>✨</span>
                <span data-i18n="moment_cat_spark">Romantic Spark</span>
              </div>
              <div class="incident-pill" data-cat="conversation">
                <span>☕</span>
                <span data-i18n="moment_cat_conversation">Spontaneous Chat</span>
              </div>
              <div class="incident-pill" data-cat="kindness">
                <span>☀️</span>
                <span data-i18n="moment_cat_kindness">Warm Smile / Kindness</span>
              </div>
              <div class="incident-pill" data-cat="friendship">
                <span>🤝</span>
                <span data-i18n="moment_cat_friendship">Deep Connection</span>
              </div>
              <div class="incident-pill" data-cat="presence">
                <span>🌿</span>
                <span data-i18n="moment_cat_presence">Real-World Presence</span>
              </div>
            </div>
            <input type="hidden" id="moment-input-category" value="spark">
          </div>

          <div class="form-group">
            <label class="form-label" for="moment-input-story" data-i18n="moment_form_story">What happened? (The Real-World Experience)</label>
            <textarea id="moment-input-story" class="form-control" rows="3" data-i18n-placeholder="moment_form_story_placeholder" placeholder="Describe what took place, what you said, or the connection you felt..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="moment-input-feeling" data-i18n="moment_form_feeling">How did it feel compared to dating apps? (Your Motivation)</label>
            <textarea id="moment-input-feeling" class="form-control" rows="2" data-i18n-placeholder="moment_form_feeling_placeholder" placeholder="e.g. Felt 100x warmer and more genuine than 1,000 hollow swipes..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="moment-input-person" data-i18n="moment_form_person">Link to a Person (Optional)</label>
            <select id="moment-input-person" class="form-control"></select>
          </div>

          <div class="form-group">
            <label class="form-label" for="moment-input-date" data-i18n="moment_form_date">Date</label>
            <input type="date" id="moment-input-date" class="form-control">
          </div>
        </div>

        <div class="modal-sheet-footer">
          <button type="button" class="pill-btn" data-close="modal-moment" style="flex: 1; justify-content: center;" data-i18n="btn_cancel">Cancel</button>
          <button type="submit" class="pill-btn primary" style="flex: 2; justify-content: center;" data-i18n="btn_save_moment">Save Real-World Moment</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 9: ADD / EDIT REAL-LIFE CONNECTION -->
  <div id="modal-person" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 id="person-modal-title" class="sheet-title" data-i18n="person_modal_title_add">Add Real-Life Connection</h3>
        <button class="close-btn" data-close="modal-person">✕</button>
      </div>

      <form id="form-person-edit">
        <div class="modal-sheet-content">
          <input type="hidden" id="person-edit-id" value="">

          <div class="form-group">
            <label class="form-label" for="person-input-name" data-i18n="person_form_name">Name / Nickname *</label>
            <input type="text" id="person-input-name" class="form-control" data-i18n-placeholder="person_form_name_placeholder" placeholder="e.g. Maya, David from Climbing, Sarah..." required>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="person_form_stage">Relationship Progression Stage</label>
            <div class="incident-selector" id="person-stage-selector-container">
              <div class="incident-pill" data-stage="spontaneous">
                <span>⚡</span>
                <span data-i18n="stage_spontaneous">One-Time Spark</span>
              </div>
              <div class="incident-pill selected" data-stage="casual">
                <span>👋</span>
                <span data-i18n="stage_casual">Casual Acquaintance</span>
              </div>
              <div class="incident-pill" data-stage="regular">
                <span>☕</span>
                <span data-i18n="stage_regular">Regular Contact</span>
              </div>
              <div class="incident-pill" data-stage="close">
                <span>🤝</span>
                <span data-i18n="stage_close">Close Connection</span>
              </div>
              <div class="incident-pill" data-stage="romantic">
                <span>❤️</span>
                <span data-i18n="stage_romantic">Romantic Interest</span>
              </div>
            </div>
            <input type="hidden" id="person-input-stage" value="casual">
          </div>

          <div class="form-group">
            <label class="form-label" for="person-input-dob" data-i18n="person_form_dob">Date of Birth (Optional)</label>
            <input type="date" id="person-input-dob" class="form-control">
            <span class="form-help" data-i18n="person_form_dob_help">Leave blank if not known yet; can naturally emerge over time.</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="person-input-met-at" data-i18n="person_form_met_at">Where / How Did You Meet? (Optional)</label>
            <input type="text" id="person-input-met-at" class="form-control" data-i18n-placeholder="person_form_met_at_placeholder" placeholder="e.g. Local climbing gym, Bookstore photography section...">
          </div>

          <div class="form-group">
            <label class="form-label" for="person-input-contact" data-i18n="person_form_contact">Contact Info / Socials (Optional)</label>
            <input type="text" id="person-input-contact" class="form-control" data-i18n-placeholder="person_form_contact_placeholder" placeholder="e.g. @instagram, WhatsApp, +49 170...">
          </div>

          <div class="form-group">
            <label class="form-label" for="person-input-notes" data-i18n="person_form_notes">Notes, Interests & Memories (Optional)</label>
            <textarea id="person-input-notes" class="form-control" rows="3" data-i18n-placeholder="person_form_notes_placeholder" placeholder="e.g. Loves oat milk cappuccinos, plays tennis, dog named Luna..."></textarea>
          </div>
        </div>

        <div class="modal-sheet-footer">
          <button type="button" class="pill-btn" data-close="modal-person" style="flex: 1; justify-content: center;" data-i18n="btn_cancel">Cancel</button>
          <button type="submit" class="pill-btn primary" style="flex: 2; justify-content: center;" data-i18n="btn_save_person">Save Connection</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal 10: EDIT DAILY REFLECTION -->
  <div id="modal-checkin" class="modal-backdrop">
    <div class="modal-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h3 id="checkin-modal-title" class="sheet-title" data-i18n="checkin_modal_title_edit">Edit Daily Reflection</h3>
        <button class="close-btn" data-close="modal-checkin">✕</button>
      </div>

      <form id="form-checkin-edit">
        <div class="modal-sheet-content">
          <input type="hidden" id="checkin-edit-id" value="">

          <div class="form-group">
            <label class="form-label" data-i18n="checkin_form_mood">How did you feel?</label>
            <div class="mood-selector" id="edit-mood-selector-container">
              <div class="mood-pill selected" data-edit-mood="peaceful" data-emoji="🌿" data-label="Peaceful">
                <span class="mood-emoji">🌿</span>
                <span class="mood-name" data-i18n="mood_peaceful">Peaceful</span>
              </div>
              <div class="mood-pill" data-edit-mood="energized" data-emoji="⚡" data-label="Energized">
                <span class="mood-emoji">⚡</span>
                <span class="mood-name" data-i18n="mood_energized">Energized</span>
              </div>
              <div class="mood-pill" data-edit-mood="grounded" data-emoji="✨" data-label="Grounded">
                <span class="mood-emoji">✨</span>
                <span class="mood-name" data-i18n="mood_grounded">Grounded</span>
              </div>
              <div class="mood-pill" data-edit-mood="lonely" data-emoji="🌧️" data-label="Lonely">
                <span class="mood-emoji">🌧️</span>
                <span class="mood-name" data-i18n="mood_lonely">Lonely</span>
              </div>
              <div class="mood-pill" data-edit-mood="tempted" data-emoji="🔥" data-label="Tempted">
                <span class="mood-emoji">🔥</span>
                <span class="mood-name" data-i18n="mood_tempted">Tempted</span>
              </div>
            </div>
            <input type="hidden" id="edit-checkin-mood" value="peaceful">
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-checkin-date" data-i18n="checkin_form_date">Date & Time</label>
            <input type="datetime-local" id="edit-checkin-date" class="form-control" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-checkin-note" data-i18n="checkin_form_note">Reflection Note</label>
            <textarea id="edit-checkin-note" class="form-control" rows="3" data-i18n-placeholder="checkin_placeholder" placeholder="Optional reflection note... What did you notice today?"></textarea>
          </div>
        </div>

        <div class="modal-sheet-footer">
          <button type="button" class="pill-btn" data-close="modal-checkin" style="flex: 1; justify-content: center;" data-i18n="btn_cancel">Cancel</button>
          <button type="submit" class="pill-btn primary" style="flex: 2; justify-content: center;" data-i18n="btn_save_changes">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
  `;
}

export function injectModalTemplates(targetContainer = document.getElementById('modals-container')) {
  if (!targetContainer) {
    targetContainer = document.createElement('div');
    targetContainer.id = 'modals-container';
    document.body.appendChild(targetContainer);
  }
  targetContainer.innerHTML = getModalsHtml();
  translateDOM(targetContainer);
  setupModalDismissListeners(targetContainer);
}
