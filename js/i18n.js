// Internationalization (i18n) Module for Dating App Free
// Supports English (en) and German (de) with dynamic switching and DOM interpolation.

(function () {
  'use strict';

  const TRANSLATIONS = {
    en: {
      // Header & Navigation
      app_title: 'Dating App Free',
      app_tagline: 'Real-World Presence',
      nav_overview: 'Overview',
      nav_apps: 'Apps',
      nav_stages: 'Stages',
      nav_journal: 'Journal',
      btn_add_to_mobile: 'Add to Mobile',
      btn_toggle_theme: 'Toggle theme',
      btn_settings: 'Settings & Backup',

      // Update Banner
      update_ready: 'A new version is ready (data preserved)',
      update_btn: 'Update Now',

      // Dashboard: Hero Counter
      hero_label: 'Total Time Free',
      hero_badge_all_free: 'All Apps Free',
      hero_badge_count: '{count} Apps Free',
      hero_badge_zero: '0 Apps',
      timer_days: 'Days',
      timer_hours: 'Hours',
      timer_mins: 'Mins',
      timer_secs: 'Secs',
      hero_note_calc: 'Calculated from your last used app: <strong>{app}</strong> ({time} free)',
      hero_note_empty: 'No apps tracked yet. Tap <strong>+ Add App</strong> to begin.',
      hero_milestone_next: 'Next: {title} ({hours}h left)',
      hero_milestones_all_done: 'All Master Milestones Unlocked!',
      btn_sos_trigger: 'Feeling Tempted? (Urge Shield)',

      // Dashboard: Reclaimed Life Metrics
      section_reclaimed: 'Reclaimed Life',
      metric_time_saved: 'Time Saved',
      metric_fees_avoided: 'Fees Avoided',
      metric_swipes_skipped: 'Swipes Skipped',
      insight_books: '{count} books',
      insight_workouts: '{count} gym workouts',
      insight_text: 'Your saved time is equivalent to reading <strong id="insight-books">{books}</strong> or completing <strong id="insight-workouts">{workouts}</strong> in the real world.',

      // Dashboard: Tracked Apps Preview
      section_tracked_apps: 'Tracked Apps',
      btn_manage_all: 'Manage All',
      apps_preview_empty: 'No dating apps tracked yet.',
      btn_add_first_app: '+ Add Your First App',
      btn_add_app: '+ Add App',
      apps_view_desc: 'Each app maintains its own streak and motivation. The master streak tracks your last used app.',

      // App Cards
      card_why_deleted: 'Why you deleted {app}:',
      card_deleted_on: 'Deleted {date}',
      card_saved_rate: 'Saved: ~{min}m/day · {fee}/mo',
      card_saved_rate_free: 'Saved: ~{min}m/day · Free account (never paid)',
      card_btn_edit: 'Edit',
      card_btn_slip: 'Slip-up / Reset',
      card_btn_slip_short: 'Slip-up',
      card_btn_delete: 'Delete',
      streak_days_hours: '{d}d {h}h free',
      streak_hours_mins: '{h}h {m}m free',
      streak_mins: '{m}m free',
      time_ago_days: '{d} days',
      time_ago_hours: '{h} hours',
      time_ago_less_hour: 'less than 1 hour',

      // Milestones View
      section_milestones: 'Recovery Milestones',
      milestones_desc: 'Cognitive and neurochemical stages of disconnecting from algorithmic dating.',
      milestone_insight_label: 'Insight:',

      // Journal View
      section_daily_checkin: 'Daily Check-In',
      checkin_prompt: 'How is your mind feeling today without dating apps?',
      mood_peaceful: 'Peaceful',
      mood_calm: 'Peaceful',
      mood_energized: 'Energized',
      mood_grounded: 'Grounded',
      mood_proud: 'Proud',
      mood_lonely: 'Lonely',
      mood_tempted: 'Tempted',
      checkin_placeholder: 'Optional reflection note... What did you notice today?',
      btn_save_checkin: "Log Today's Reflection",
      section_reflection_history: 'Reflection History',
      journal_empty: 'No reflections logged yet. Record your first check-in above!',
      journal_saved_alert: 'Reflection saved!',

      // Modal: Craving Shield / Urge SOS
      sos_modal_title: 'Craving Shield',
      sos_app_select_label: 'Which app are you tempted to download?',
      sos_app_select_all: 'All Apps',
      sos_label_why_app: 'Why you deleted this app:',
      sos_label_why_freedom: 'Why you chose freedom:',
      sos_default_motivation: 'Remember: Swiping is an algorithmic slot machine designed to keep you single and addicted to cheap dopamine. Real life is waiting outside.',
      breath_inhale: 'Breathe In',
      breath_hold: 'Hold Breath',
      breath_exhale: 'Release',
      breath_rest: 'Rest & Be',
      btn_pause_breathing: '⏸ Pause Breathing',
      btn_resume_breathing: '▶ Resume Breathing',
      sos_grounding_title: '5 Quick Grounding Alternatives',
      sos_grounding_1: '💧 Drink a tall glass of cold water slowly',
      sos_grounding_2: '🚶 Step outside for 3 minutes without looking at your screen',
      sos_grounding_3: '📖 Read 5 pages of a physical book or magazine',
      sos_grounding_4: '💬 Send an honest, caring text to an existing close friend',
      sos_grounding_5: '🧘 Do 10 slow shoulder rolls and take 5 deep sighs',
      btn_grounded_done: 'I Feel Grounded Now',

      // Modal: Add / Edit App
      app_modal_title_add: 'Add Tracked App',
      app_modal_title_edit: 'Edit {name}',
      app_form_presets: 'Quick Presets',
      app_form_name: 'App Name',
      app_form_name_placeholder: 'e.g. Hinge',
      app_form_quitdate: 'Quit Date & Time',
      app_form_quitdate_help: 'When did you stop using or delete this app?',
      app_form_minutes: 'Minutes / Day',
      app_form_minutes_help: 'Daily time spent',
      app_form_cost: 'Monthly Fee',
      app_form_cost_help: 'Subscription avoided',
      app_form_never_paid: 'I never paid for this app (Free account)',
      app_form_motivation: 'Why did you delete this app? (Personal Motivation)',
      app_form_motivation_placeholder: 'e.g. Tired of superficial swiping and endless pen-pals. I want real human connection.',
      app_form_motivation_help: 'This will be shown to you whenever you feel tempted to redownload it.',
      btn_cancel: 'Cancel',
      btn_save_app: 'Save App',
      alert_app_missing_fields: 'Please provide an app name and quit date.',
      confirm_delete_app: 'Remove "{name}" from your tracked apps? Your streak data for this app will be deleted.',

      // Modal: Reset Slip-Up
      reset_modal_title: 'Reset App Streak',
      reset_modal_desc: 'Did you redownload or browse <strong id="reset-app-name">{name}</strong>? Slips happen during recovery. Your past streak will be preserved in history, and you can restart with compassion.',
      reset_form_reason: 'What triggered the slip? (Optional reflection)',
      reset_form_reason_placeholder: 'e.g. Felt lonely on a Friday night...',
      btn_keep_streak: 'Keep My Streak',
      btn_confirm_reset: 'Reset Counter',

      // Modal: Settings & Backup
      settings_modal_title: 'Settings & Data Safety',
      settings_group_appearance: 'Appearance & Currency',
      settings_theme_label: 'Theme',
      settings_theme_sub: 'Choose your favorite UI style',
      settings_lang_label: 'Language',
      settings_lang_sub: 'Choose your interface language',
      settings_currency_label: 'Currency Symbol',
      settings_currency_sub: 'For subscription savings',
      settings_group_updates: 'App Updates & Persistence',
      settings_zero_loss_label: 'Zero Data Loss Guarantee',
      settings_zero_loss_sub: 'Streaks are saved on device; code updates never delete your data',
      settings_check_updates_label: 'Check for App Updates',
      settings_status_up_to_date: 'Up to date',
      settings_status_checking: 'Checking server...',
      settings_status_checked: 'Offline ready. Checked just now.',
      btn_check_updates: 'Check',
      settings_group_backup: 'Safe Backup & Restore',
      settings_backup_desc: 'Export your streaks, tracked apps, and notes to a file or copy them to your clipboard anytime.',
      btn_download_backup: '📥 Download Backup File (JSON)',
      btn_copy_backup: '📋 Copy Backup to Clipboard',
      btn_restore_backup: '📤 Restore from Backup File',
      backup_copied_alert: 'Backup data copied to clipboard! Keep it safe.',
      backup_copy_fail_alert: 'Could not copy to clipboard automatically.',
      backup_restored_alert: 'Backup restored successfully! ({count} apps loaded)',
      backup_restore_error_alert: 'Failed to restore backup: {error}',
      settings_group_mobile: 'Mobile Installation',
      settings_mobile_desc: 'Use as a full-screen app on iPhone or Android without browser URL bars.',
      btn_show_mobile_guide: '📱 How to Install on Mobile (iPhone & Android)',

      // Modal: Mobile Guide
      mobile_guide_title: 'Install on Mobile',
      guide_iphone_title: 'On iPhone (Safari)',
      guide_iphone_desc: 'Open in Safari &rarr; Tap the <strong>Share</strong> button (square with arrow) &rarr; Tap <strong>"Add to Home Screen"</strong>.',
      guide_android_title: 'On Android (Chrome / Samsung)',
      guide_android_desc: 'Open in Chrome &rarr; Tap the <strong>three dots (⋮)</strong> in the top right &rarr; Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.',
      guide_standalone_title: 'Standalone Offline App',
      guide_standalone_desc: "Launch from your phone's home screen. It opens full-screen like a native app and works offline.",
      btn_got_it: 'Got It',

      // Modal: Add to Mobile (QR Code)
      mobile_connect_title: 'Add to Mobile',
      mobile_connect_desc: "Scan with your phone's Camera (iPhone or Android) to open this app directly:",
      btn_copy: 'Copy',
      mobile_quick_steps: 'Quick Steps',
      mobile_step_1: '1. Make sure your phone is on the <strong>same Wi-Fi network</strong>.',
      mobile_step_2: '2. Point your phone <strong>Camera</strong> at the QR code and tap the link.',
      mobile_step_3_ios: '3. <strong>iPhone</strong>: Tap Share &rarr; <em>"Add to Home Screen"</em>.<br>&nbsp;&nbsp;&nbsp;<strong>Android</strong>: Tap Menu (⋮) &rarr; <em>"Install app"</em> or <em>"Add to Home screen"</em>.',
      btn_done: 'Done',
      link_copied_alert: 'Link copied! You can paste or send it to your phone: {url}'
    },

    de: {
      // Header & Navigation
      app_title: 'Dating App Free',
      app_tagline: 'Echtes Leben statt Algorithmen',
      nav_overview: 'Übersicht',
      nav_apps: 'Apps',
      nav_stages: 'Phasen',
      nav_journal: 'Tagebuch',
      btn_add_to_mobile: 'Auf Smartphone',
      btn_toggle_theme: 'Design umschalten',
      btn_settings: 'Einstellungen & Backup',

      // Update Banner
      update_ready: 'Eine neue Version ist verfügbar (Daten bleiben erhalten)',
      update_btn: 'Jetzt aktualisieren',

      // Dashboard: Hero Counter
      hero_label: 'Gesamte abstinente Zeit',
      hero_badge_all_free: 'Frei von allen Apps',
      hero_badge_count: '{count} Apps frei',
      hero_badge_zero: '0 Apps',
      timer_days: 'Tage',
      timer_hours: 'Std.',
      timer_mins: 'Min.',
      timer_secs: 'Sek.',
      hero_note_calc: 'Berechnet ab deiner zuletzt genutzten App: <strong>{app}</strong> ({time} frei)',
      hero_note_empty: 'Noch keine Apps erfasst. Tippe auf <strong>+ App hinzufügen</strong>, um zu starten.',
      hero_milestone_next: 'Nächstes Ziel: {title} (noch {hours}h)',
      hero_milestones_all_done: 'Alle Meilensteine erreicht!',
      btn_sos_trigger: 'Suchtdruck? (Schutz-Schild)',

      // Dashboard: Reclaimed Life Metrics
      section_reclaimed: 'Zurückgewonnene Lebenszeit',
      metric_time_saved: 'Gesparte Zeit',
      metric_fees_avoided: 'Eingespartes Geld',
      metric_swipes_skipped: 'Vermiedene Swipes',
      insight_books: '{count} Bücher',
      insight_workouts: '{count} Gym-Workouts',
      insight_text: 'Deine gesparte Zeit entspricht dem Lesen von <strong id="insight-books">{books}</strong> oder <strong id="insight-workouts">{workouts}</strong> im echten Leben.',

      // Dashboard: Tracked Apps Preview
      section_tracked_apps: 'Erfasste Apps',
      btn_manage_all: 'Alle verwalten',
      apps_preview_empty: 'Noch keine Dating-Apps erfasst.',
      btn_add_first_app: '+ Erste App erfassen',
      btn_add_app: '+ App hinzufügen',
      apps_view_desc: 'Jede App hat ihren eigenen Zähler und Grund. Der Gesamtzähler richtet sich nach der zuletzt genutzten App.',

      // App Cards
      card_why_deleted: 'Warum du {app} gelöscht hast:',
      card_deleted_on: 'Gelöscht am {date}',
      card_saved_rate: 'Gespart: ~{min}m/Tag · {fee}/Monat',
      card_saved_rate_free: 'Gespart: ~{min}m/Tag · Kostenlos genutzt (nie bezahlt)',
      card_btn_edit: 'Bearbeiten',
      card_btn_slip: 'Rückfall melden',
      card_btn_slip_short: 'Rückfall',
      card_btn_delete: 'Löschen',
      streak_days_hours: '{d}T {h}Std frei',
      streak_hours_mins: '{h}Std {m}Min frei',
      streak_mins: '{m}Min frei',
      time_ago_days: '{d} Tage',
      time_ago_hours: '{h} Stunden',
      time_ago_less_hour: 'weniger als 1 Stunde',

      // Milestones View
      section_milestones: 'Erholungs-Meilensteine',
      milestones_desc: 'Kognitive und neurobiologische Phasen der Entwöhnung von Dating-Apps.',
      milestone_insight_label: 'Hintergrund:',

      // Journal View
      section_daily_checkin: 'Tägliche Reflexion',
      checkin_prompt: 'Wie fühlt sich dein Kopf heute ohne Dating-Apps an?',
      mood_peaceful: 'Gelassen',
      mood_calm: 'Gelassen',
      mood_energized: 'Voller Energie',
      mood_grounded: 'Geerdet',
      mood_proud: 'Stolz',
      mood_lonely: 'Einsam',
      mood_tempted: 'In Versuchung',
      checkin_placeholder: 'Optionale Notiz... Was ist dir heute aufgefallen?',
      btn_save_checkin: 'Heutige Reflexion speichern',
      section_reflection_history: 'Vergangene Reflexionen',
      journal_empty: 'Noch keine Einträge vorhanden. Halte deine erste Reflexion oben fest!',
      journal_saved_alert: 'Reflexion gespeichert!',

      // Modal: Craving Shield / Urge SOS
      sos_modal_title: 'Schutz bei Suchtdruck',
      sos_app_select_label: 'Welche App reizt dich gerade?',
      sos_app_select_all: 'Alle Apps',
      sos_label_why_app: 'Warum du diese App gelöscht hast:',
      sos_label_why_freedom: 'Warum du dich für Freiheit entschieden hast:',
      sos_default_motivation: 'Erinnere dich: Swipen ist ein algorithmischer Spielautomat, der dich einsam und süchtig nach schnellem Dopamin halten soll. Das echte Leben wartet draußen.',
      breath_inhale: 'Einatmen',
      breath_hold: 'Atem anhalten',
      breath_exhale: 'Langsam ausatmen',
      breath_rest: 'In Ruhe verweilen',
      btn_pause_breathing: '⏸ Atmung pausieren',
      btn_resume_breathing: '▶ Atmung fortsetzen',
      sos_grounding_title: '5 schnelle Erdungs-Übungen',
      sos_grounding_1: '💧 Trinke langsam ein großes Glas kaltes Wasser',
      sos_grounding_2: '🚶 Geh für 3 Minuten nach draußen, ohne aufs Handy zu schauen',
      sos_grounding_3: '📖 Lies 5 Seiten in einem physischen Buch oder Magazin',
      sos_grounding_4: '💬 Schreibe einer echten Freundin oder einem Freund eine nette Nachricht',
      sos_grounding_5: '🧘 Kreise 10-mal bewusst die Schultern und seufze tief aus',
      btn_grounded_done: 'Ich fühle mich wieder gefestigt',

      // Modal: Add / Edit App
      app_modal_title_add: 'App hinzufügen',
      app_modal_title_edit: '{name} bearbeiten',
      app_form_presets: 'Schnellauswahl',
      app_form_name: 'App-Name',
      app_form_name_placeholder: 'z.B. Hinge',
      app_form_quitdate: 'Aufhör-Datum & Uhrzeit',
      app_form_quitdate_help: 'Wann hast du diese App gelöscht oder aufgehört?',
      app_form_minutes: 'Minuten / Tag',
      app_form_minutes_help: 'Täglich verbrachte Zeit',
      app_form_cost: 'Monatliche Kosten',
      app_form_cost_help: 'Eingespartes Abo',
      app_form_never_paid: 'Ich habe nie dafür bezahlt (Kostenloser Account)',
      app_form_motivation: 'Warum hast du diese App gelöscht? (Persönlicher Grund)',
      app_form_motivation_placeholder: 'z.B. Genug von oberflächlichem Swipen und Ghosting. Ich will echte zwischenmenschliche Nähe.',
      app_form_motivation_help: 'Das wird dir angezeigt, sobald du den Drang spürst, sie wieder zu installieren.',
      btn_cancel: 'Abbrechen',
      btn_save_app: 'App speichern',
      alert_app_missing_fields: 'Bitte gib einen App-Namen und ein Aufhör-Datum an.',
      confirm_delete_app: 'Möchtest du "{name}" wirklich aus deinen erfassten Apps entfernen? Die Zählerdaten werden gelöscht.',

      // Modal: Reset Slip-Up
      reset_modal_title: 'Zähler zurücksetzen',
      reset_modal_desc: 'Hast du <strong id="reset-app-name">{name}</strong> wieder installiert oder geswipt? Rückfälle können vorkommen. Dein bisheriger Rekord bleibt im Verlauf erhalten und du startest ohne Vorwürfe neu.',
      reset_form_reason: 'Was war der Auslöser? (Optionale Reflexion)',
      reset_form_reason_placeholder: 'z.B. Fühlte mich am Freitagabend einsam...',
      btn_keep_streak: 'Zähler behalten',
      btn_confirm_reset: 'Zähler neu starten',

      // Modal: Settings & Backup
      settings_modal_title: 'Einstellungen & Datensicherheit',
      settings_group_appearance: 'Erscheinungsbild & Währung',
      settings_theme_label: 'Design',
      settings_theme_sub: 'Wähle dein bevorzugtes Farbschema',
      settings_lang_label: 'Sprache',
      settings_lang_sub: 'Wähle deine Benutzeroberfläche',
      settings_currency_label: 'Währungssymbol',
      settings_currency_sub: 'Für die Abo-Berechnung',
      settings_group_updates: 'App-Aktualisierungen & Sicherheit',
      settings_zero_loss_label: 'Kein Datenverlust-Garantie',
      settings_zero_loss_sub: 'Daten werden lokal gespeichert; Code-Updates löschen niemals deine Erfolge',
      settings_check_updates_label: 'Nach Updates suchen',
      settings_status_up_to_date: 'Aktuell',
      settings_status_checking: 'Server wird geprüft...',
      settings_status_checked: 'Offline bereit. Gerade eben geprüft.',
      btn_check_updates: 'Prüfen',
      settings_group_backup: 'Sicheres Backup & Wiederherstellung',
      settings_backup_desc: 'Exportiere deine Zähler, Apps und Notizen jederzeit in eine Datei oder die Zwischenablage.',
      btn_download_backup: '📥 Backup-Datei herunterladen (JSON)',
      btn_copy_backup: '📋 In die Zwischenablage kopieren',
      btn_restore_backup: '📤 Aus Backup-Datei wiederherstellen',
      backup_copied_alert: 'Backup in die Zwischenablage kopiert! Sicher aufbewahren.',
      backup_copy_fail_alert: 'Konnte nicht automatisch kopiert werden.',
      backup_restored_alert: 'Backup erfolgreich wiederhergestellt! ({count} Apps geladen)',
      backup_restore_error_alert: 'Wiederherstellung fehlgeschlagen: {error}',
      settings_group_mobile: 'Smartphone-Installation',
      settings_mobile_desc: 'Als Vollbild-App auf iPhone oder Android ohne Browser-Adressleiste nutzen.',
      btn_show_mobile_guide: '📱 Anleitung zur Smartphone-Installation',

      // Modal: Mobile Guide
      mobile_guide_title: 'Auf Smartphone installieren',
      guide_iphone_title: 'Auf dem iPhone (Safari)',
      guide_iphone_desc: 'In Safari öffnen &rarr; <strong>Teilen-Button</strong> (Quadrat mit Pfeil) &rarr; <strong>"Zum Home-Bildschirm"</strong> wählen.',
      guide_android_title: 'Auf Android (Chrome / Samsung)',
      guide_android_desc: 'In Chrome öffnen &rarr; <strong>Drei Punkte (⋮)</strong> oben rechts &rarr; <strong>"App installieren"</strong> oder <strong>"Zum Startbildschirm"</strong>.',
      guide_standalone_title: 'Eigenständige Offline-App',
      guide_standalone_desc: 'Direkt vom Startbildschirm öffnen. Läuft im Vollbildmodus und funktioniert komplett offline.',
      btn_got_it: 'Verstanden',

      // Modal: Add to Mobile (QR Code)
      mobile_connect_title: 'Auf Smartphone öffnen',
      mobile_connect_desc: 'Scanne den Code mit deiner Smartphone-Kamera (iPhone oder Android), um die App direkt zu öffnen:',
      btn_copy: 'Kopieren',
      mobile_quick_steps: 'Kurzanleitung',
      mobile_step_1: '1. Stelle sicher, dass dein Smartphone im <strong>selben WLAN</strong> ist.',
      mobile_step_2: '2. Halte die <strong>Kamera</strong> auf den QR-Code und tippe auf den angezeigten Link.',
      mobile_step_3_ios: '3. <strong>iPhone</strong>: Teilen &rarr; <em>"Zum Home-Bildschirm"</em>.<br>&nbsp;&nbsp;&nbsp;<strong>Android</strong>: Menü (⋮) &rarr; <em>"App installieren"</em> oder <em>"Zum Startbildschirm"</em>.',
      btn_done: 'Fertig',
      link_copied_alert: 'Link kopiert! Du kannst ihn auf dein Smartphone senden: {url}'
    }
  };

  let currentLang = 'en';

  function detectDefaultLanguage() {
    try {
      const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (navLang.startsWith('de')) {
        return 'de';
      }
    } catch (e) {
      // Fallback to en
    }
    return 'en';
  }

  function getLanguage() {
    return currentLang;
  }

  function setLanguage(lang) {
    if (lang !== 'de' && lang !== 'en') {
      lang = 'en';
    }
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    translateDOM();
    return currentLang;
  }

  function t(key, params = {}) {
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    let str = langDict[key] || TRANSLATIONS.en[key] || key;

    // Interpolate params: e.g. {count}, {name}
    Object.keys(params).forEach(param => {
      str = str.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });

    return str;
  }

  function translateDOM(root = document) {
    // Translate textContent for elements with data-i18n
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // Translate innerHTML for elements with data-i18n-html
    root.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = t(key);
      }
    });

    // Translate placeholder for inputs/textareas with data-i18n-placeholder
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', t(key));
      }
    });

    // Translate titles for buttons/icons with data-i18n-title
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', t(key));
      }
    });
  }

  function has(key) {
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return Boolean(langDict && langDict[key] !== undefined);
  }

  // Export to global window object
  window.i18n = {
    t,
    has,
    getLanguage,
    setLanguage,
    detectDefaultLanguage,
    translateDOM,
    TRANSLATIONS
  };

})();
