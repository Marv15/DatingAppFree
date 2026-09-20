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
      card_metric_swipes_day: 'swipes/day',
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
      checkin_btn_edit: 'Edit',
      checkin_btn_delete: 'Delete',
      confirm_delete_checkin: 'Delete this reflection?',
      checkin_modal_title_edit: 'Edit Daily Reflection',
      checkin_form_mood: 'How did you feel?',
      checkin_form_date: 'Date & Time',
      checkin_form_note: 'Reflection Note',
      checkin_updated_alert: 'Reflection updated!',
      checkin_deleted_alert: 'Reflection deleted.',
      btn_cancel: 'Cancel',
      btn_save_changes: 'Save Changes',

      // Journal: Segmented View & Reality Check Stories
      journal_tab_checkin: '🌿 Daily Reflections',
      journal_tab_stories: '📖 Reality Checks ({count})',
      journal_tab_stories_zero: '📖 Reality Checks',
      journal_stories_desc: 'Specific people, bad dates, and ghosting incidents that remind you why algorithmic dating is soul-draining.',
      btn_add_story: '+ Add Reality Check',
      stories_filter_all: 'All Apps',
      stories_empty: 'No reality check stories logged yet. Record a real person or encounter that made you tired of dating apps.',
      story_person_label: 'Person: {name}',
      story_takeaway_label: 'Why I’m done with it:',
      story_btn_edit: 'Edit',
      story_btn_delete: 'Delete',
      confirm_delete_story: 'Delete this reality check story?',
      story_saved_alert: 'Reality check saved!',

      // Incident Types
      incident_ghosted: 'Ghosted',
      incident_stood_up: 'Stood Up / Flaked',
      incident_penpal: 'Endless Pen-Pal',
      incident_catfish: 'Catfished / Deceptive',
      incident_toxic: 'Rude / Disrespectful',
      incident_burnout: 'Superficial / Burnout',
      incident_other: 'Other Encounter',

      // Modal: Add / Edit Story
      story_modal_title_add: 'Add Reality Check / Story',
      story_modal_title_edit: 'Edit Reality Check',
      story_form_app: 'Dating App',
      story_form_general: 'General Dating Fatigue',
      story_form_person: 'Person / Nickname (Optional)',
      story_form_person_placeholder: 'e.g. Sarah, Hinge coffee date, Alex...',
      story_form_incident_type: 'What kind of experience was it?',
      story_form_what_happened: 'What happened? (The Story)',
      story_form_what_happened_placeholder: 'Describe the conversation, date, or sudden turn of events...',
      story_form_lesson: 'Why did this make you tired of dating apps? (The Reality Check)',
      story_form_lesson_placeholder: 'e.g. Tired of people treating human connection like a disposable catalog...',
      story_form_date: 'Approximate Date',
      btn_save_story: 'Save Reality Check',
      alert_story_missing_fields: 'Please provide what happened and your reality check lesson.',

      // Urge SOS Story Showcase
      sos_story_label: 'Real Story from {app}:',
      sos_story_general_label: 'Real Experience from Dating Apps:',
      sos_story_takeaway: 'Reality Check:',

      // Real-World Positive Moments & Interactions
      dash_moment_badge: 'Real-World Spark',
      dash_moment_badge_sub: 'Offline Life Motivation',
      dash_moment_empty: 'No real-life moments recorded yet. Compliment someone, share a smile, or chat with a stranger!',
      dash_moment_btn_add: '+ Log Real Moment',
      dash_moment_btn_next: '🔄 Next Spark',
      dash_moment_btn_view_all: 'View All ({count})',
      dash_moment_how_felt: 'How it felt compared to apps:',
      journal_tab_moments: '✨ Real Sparks ({count})',
      journal_tab_moments_zero: '✨ Real Sparks',
      journal_moments_desc: 'Genuine real-world interactions, romantic sparks, and spontaneous conversations that remind you why offline life is vibrant.',
      btn_add_moment: '+ Add Real-World Moment',
      moments_filter_unassociated: '✨ General Sparks',
      moments_filter_with_person: '👥 With People',
      moments_filter_all: 'All Moments',
      moments_empty: 'No real-world moments recorded yet. Step outside, make eye contact, and capture your first authentic moment outside of screens!',
      moments_empty_unassociated: 'No standalone real-world sparks recorded yet. Compliment a stranger or share a smile to log one!',
      moment_location_label: '📍 {loc}',
      moment_feeling_label: 'Why real life wins:',
      moment_btn_edit: 'Edit',
      moment_btn_delete: 'Delete',
      confirm_delete_moment: 'Delete this real-world moment?',
      moment_saved_alert: 'Real-world moment saved!',

      // Moment Categories
      moment_cat_spark: 'Romantic Spark',
      moment_cat_conversation: 'Spontaneous Chat',
      moment_cat_kindness: 'Warm Smile / Kindness',
      moment_cat_friendship: 'Deep Connection',
      moment_cat_presence: 'Real-World Presence',

      // Modal: Add / Edit Moment
      moment_modal_title_add: 'Log Real-World Interaction',
      moment_modal_title_edit: 'Edit Real-World Moment',
      moment_form_title: 'Headline / What was it?',
      moment_form_title_placeholder: 'e.g. Chat waiting for coffee, Bookstore laugh, Compliment on train...',
      moment_form_location: 'Location / Setting',
      moment_form_location_placeholder: 'e.g. Local café, Gym, Bookstore, Train, Park...',
      moment_form_category: 'What kind of interaction was it?',
      moment_form_story: 'What happened? (The Real-World Experience)',
      moment_form_story_placeholder: 'Describe what took place, what you said, or the connection you felt...',
      moment_form_feeling: 'How did it feel compared to dating apps? (Your Motivation)',
      moment_form_feeling_placeholder: 'e.g. Felt 100x warmer and more genuine than 1,000 hollow swipes...',
      moment_form_date: 'Date',
      btn_save_moment: 'Save Real-World Moment',
      alert_moment_missing_fields: 'Please provide what happened and how it felt.',
      moment_form_person: 'Link to a Person (Optional)',
      moment_form_person_none: '🌟 One-Time Encounter (No profile)',
      moment_form_person_new: '➕ Quick Add New Person...',
      moment_person_badge: 'With {name}',
      dash_person_showcase_badge: 'Connection Spotlight',
      dash_person_slide_count: '{current} of {total}',
      dash_person_single_count: '1 connection',
      dash_person_btn_view_connections: 'View in Connections',
      dash_person_latest_encounter: 'Latest Shared Moment',
      dash_person_first_encounter: '+ Log an encounter with {name}',
      dash_moment_connected_badge: 'With {name}',
      dash_moment_connected_title: 'Connected Person',
      dash_moment_connected_sub: 'Real-world connection with {name}',
      btn_view_profile: 'View Connection',
      btn_prev: 'Previous',
      btn_next: 'Next',

      // Real-Life People & Relationship Progression
      journal_tab_people: '👥 Connections ({count})',
      journal_tab_people_zero: '👥 Connections',
      journal_people_desc: 'Track the organic progression of people you meet in the real world — from one-time sparks to close connections.',
      btn_add_person: '+ Add Connection',
      people_filter_all: 'All Connections',
      people_filter_spontaneous: 'Spontaneous',
      people_filter_casual: 'Casual',
      people_filter_regular: 'Regular',
      people_filter_close: 'Close',
      people_filter_romantic: 'Romantic',
      people_empty: 'No connections recorded yet. Add someone you’ve met in the real world!',

      // Relationship Stages
      stage_spontaneous: 'One-Time Spark',
      stage_casual: 'Casual Acquaintance',
      stage_regular: 'Regular Contact',
      stage_close: 'Close Connection',
      stage_romantic: 'Romantic Interest',
      progression_level: 'Stage {level} of 5 · {stage} ({percent}%)',
      btn_advance_stage: 'Deepen',
      btn_demote_stage: 'Decrease',
      toast_stage_advanced: '✨ Connection with {name} deepened to {stage}!',

      // Person Card
      person_dob_label: '{dob}',
      person_age_label: '({age} yrs)',
      person_upcoming_bday: '🎂 Birthday in {days} days!',
      person_met_at_label: 'Met at: {loc}',
      person_contact_label: '{contact}',
      person_notes_label: 'Notes & Interests:',
      person_encounters_count: '{count} encounters shared',
      person_encounters_count_single: '1 encounter shared',
      person_encounters_count_zero: 'No encounters logged yet',
      person_btn_add_encounter: '+ Log Encounter',
      person_btn_edit: 'Edit',
      person_btn_delete: 'Delete',
      confirm_delete_person: 'Delete this person profile? (Any linked encounters will be preserved)',
      person_saved_alert: 'Connection profile saved!',
      person_quick_add_dob: '+ Add Birthday',
      person_quick_add_contact: '+ Add Contact',
      person_quick_add_notes: '+ Add Notes',
      person_timeline_toggle: 'Encounter History ({count})',
      person_timeline_hide: 'Hide History',

      // Modal: Add / Edit Person
      person_modal_title_add: 'Add Real-Life Connection',
      person_modal_title_edit: 'Edit Connection Profile',
      person_form_name: 'Name / Nickname *',
      person_form_name_placeholder: 'e.g. Maya, David from Climbing, Sarah...',
      person_form_stage: 'Relationship Progression Stage',
      person_form_dob: 'Date of Birth (Optional)',
      person_form_dob_help: 'Leave blank if not known yet; can naturally emerge over time.',
      person_form_met_at: 'Where / How Did You Meet? (Optional)',
      person_form_met_at_placeholder: 'e.g. Local climbing gym, Bookstore photography section, Friend’s dinner...',
      person_form_contact: 'Contact Info / Socials (Optional)',
      person_form_contact_placeholder: 'e.g. @instagram, WhatsApp, +49 170...',
      person_form_notes: 'Notes, Interests & Memories (Optional)',
      person_form_notes_placeholder: 'e.g. Loves oat milk cappuccinos, plays tennis, dog named Luna...',
      btn_save_person: 'Save Connection',
      alert_person_missing_name: 'Please enter a name or nickname.',

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
      app_form_swipe_rate: 'Swipe Speed',
      app_form_rate_help: 'Swipes/min (default 2.0)',
      app_form_swipes_preview: 'Swipes Avoided / Day',
      app_form_swipes_help: 'From minutes & speed',
      app_form_motivation: 'Why did you delete this app?',
      app_form_motivation_placeholder: 'e.g. Tired of superficial swiping and endless pen-pals. I want real human connection.',
      app_form_motivation_help: 'Shown whenever you feel tempted to redownload.',
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
      card_metric_swipes_day: 'Swipes/Tag',
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
      checkin_btn_edit: 'Bearbeiten',
      checkin_btn_delete: 'Löschen',
      confirm_delete_checkin: 'Diese Reflexion löschen?',
      checkin_modal_title_edit: 'Tägliche Reflexion bearbeiten',
      checkin_form_mood: 'Wie hast du dich gefühlt?',
      checkin_form_date: 'Datum & Uhrzeit',
      checkin_form_note: 'Reflexionsnotiz',
      checkin_updated_alert: 'Reflexion aktualisiert!',
      checkin_deleted_alert: 'Reflexion gelöscht.',
      btn_cancel: 'Abbrechen',
      btn_save_changes: 'Änderungen speichern',

      // Journal: Segmented View & Reality Check Stories
      journal_tab_checkin: '🌿 Tägliche Reflexion',
      journal_tab_stories: '📖 Realitätschecks ({count})',
      journal_tab_stories_zero: '📖 Realitätschecks',
      journal_stories_desc: 'Konkrete Personen, geplatzte Dates und Ghosting-Erlebnisse, die dich daran erinnern, warum Dating-Apps dich erschöpft haben.',
      btn_add_story: '+ Realitätscheck festhalten',
      stories_filter_all: 'Alle Apps',
      stories_empty: 'Noch keine Erlebnisse erfasst. Halte ein Date, Ghosting oder eine Person fest, die dir die Augen über Dating-Apps geöffnet hat.',
      story_person_label: 'Person: {name}',
      story_takeaway_label: 'Warum ich genug davon habe:',
      story_btn_edit: 'Bearbeiten',
      story_btn_delete: 'Löschen',
      confirm_delete_story: 'Möchtest du dieses Erlebnis wirklich löschen?',
      story_saved_alert: 'Realitätscheck gespeichert!',

      // Incident Types
      incident_ghosted: 'Geghostet',
      incident_stood_up: 'Versetzt / Abgesagt',
      incident_penpal: 'Endlose Schreiberei',
      incident_catfish: 'Catfish / Falsche Angaben',
      incident_toxic: 'Respektlos / Toxisch',
      incident_burnout: 'Oberflächlichkeit & Burnout',
      incident_other: 'Sonstige Erfahrung',

      // Modal: Add / Edit Story
      story_modal_title_add: 'Realitätscheck / Story hinzufügen',
      story_modal_title_edit: 'Realitätscheck bearbeiten',
      story_form_app: 'Dating-App',
      story_form_general: 'Allgemeine Dating-App-Müdigkeit',
      story_form_person: 'Person / Spitzname (Optional)',
      story_form_person_placeholder: 'z.B. Sarah, Date vom Freitag, Alex...',
      story_form_incident_type: 'Was für eine Erfahrung war es?',
      story_form_what_happened: 'Was ist passiert? (Die Story)',
      story_form_what_happened_placeholder: 'Beschreibe die Unterhaltung, das Treffen oder was vorgefallen ist...',
      story_form_lesson: 'Warum hat dich das müde von Dating-Apps gemacht? (Die Erkenntnis)',
      story_form_lesson_placeholder: 'z.B. Gemerkt, dass Menschen durch Apps wie austauschbare Ware behandelt werden...',
      story_form_date: 'Ungefähres Datum',
      btn_save_story: 'Realitätscheck speichern',
      alert_story_missing_fields: 'Bitte beschreibe kurz was passiert ist und deine Erkenntnis daraus.',

      // Urge SOS Story Showcase
      sos_story_label: 'Echtes Erlebnis auf {app}:',
      sos_story_general_label: 'Echte Erfahrung mit Dating-Apps:',
      sos_story_takeaway: 'Realitätscheck:',

      // Real-World Positive Moments & Interactions
      dash_moment_badge: 'Echte Begegnung',
      dash_moment_badge_sub: 'Offline-Lebensfreude',
      dash_moment_empty: 'Noch keine echten Begegnungen erfasst. Geh raus, schenk jemandem ein Lächeln oder beginne ein spontanes Gespräch!',
      dash_moment_btn_add: '+ Moment erfassen',
      dash_moment_btn_next: '🔄 Nächster Funke',
      dash_moment_btn_view_all: 'Alle ansehen ({count})',
      dash_moment_how_felt: 'Wie es sich im Vergleich zu Apps anfühlte:',
      journal_tab_moments: '✨ Echte Funken ({count})',
      journal_tab_moments_zero: '✨ Echte Funken',
      journal_moments_desc: 'Echte Begegnungen, spontane Gespräche und Blicke im Alltag, die dir zeigen, wie lebendig und warm das echte Leben offline ist.',
      btn_add_moment: '+ Echte Begegnung erfassen',
      moments_filter_unassociated: '✨ Allgemeine Funken',
      moments_filter_with_person: '👥 Mit Kontakten',
      moments_filter_all: 'Alle Momente',
      moments_empty: 'Noch keine echten Begegnungen festgehalten. Halte dein erstes Lächeln, Gespräch oder Kennenlernen abseits von Bildschirmen fest!',
      moments_empty_unassociated: 'Noch keine allgemeinen echten Funken erfasst. Schenke jemandem ein Lächeln oder mache ein Kompliment!',
      moment_location_label: '📍 {loc}',
      moment_feeling_label: 'Warum das echte Leben gewinnt:',
      moment_btn_edit: 'Bearbeiten',
      moment_btn_delete: 'Löschen',
      confirm_delete_moment: 'Möchtest du diese echte Begegnung wirklich löschen?',
      moment_saved_alert: 'Echte Begegnung gespeichert!',

      // Moment Categories
      moment_cat_spark: 'Romantischer Funke',
      moment_cat_conversation: 'Spontanes Gespräch',
      moment_cat_kindness: 'Freundlichkeit & Lächeln',
      moment_cat_friendship: 'Echte Verbindung',
      moment_cat_presence: 'Achtsame Präsenz',

      // Modal: Add / Edit Moment
      moment_modal_title_add: 'Echte Begegnung festhalten',
      moment_modal_title_edit: 'Echte Begegnung bearbeiten',
      moment_form_title: 'Titel / Was war es?',
      moment_form_title_placeholder: 'z.B. Gespräch beim Kaffeeholen, Lachen in der Buchhandlung...',
      moment_form_location: 'Ort / Situation',
      moment_form_location_placeholder: 'z.B. Café um die Ecke, Bahn, Fitnessstudio, Park...',
      moment_form_category: 'Art der Begegnung',
      moment_form_story: 'Was ist passiert? (Das reale Erlebnis)',
      moment_form_story_placeholder: 'Beschreibe die Situation, das Gespräch oder den Funken, den du gespürt hast...',
      moment_form_feeling: 'Wie fühlte es sich im Vergleich zu Apps an? (Deine Motivation)',
      moment_form_feeling_placeholder: 'z.B. Fühlte sich 100-mal echter und erfüllender an als 1.000 hohle Swipes...',
      moment_form_date: 'Datum',
      btn_save_moment: 'Echten Moment speichern',
      alert_moment_missing_fields: 'Bitte beschreibe kurz was passiert ist und wie es sich anfühlte.',
      moment_form_person: 'Mit einer Person verknüpfen (Optional)',
      moment_form_person_none: '🌟 Einmalige Begegnung (Kein Profil)',
      moment_form_person_new: '➕ Neuen Kontakt schnell anlegen...',
      moment_person_badge: 'Mit {name}',
      dash_person_showcase_badge: 'Verbindungs-Fokus',
      dash_person_slide_count: '{current} von {total}',
      dash_person_single_count: '1 Verbindung',
      dash_person_btn_view_connections: 'In Begegnungen ansehen',
      dash_person_latest_encounter: 'Letztes gemeinsames Erlebnis',
      dash_person_first_encounter: '+ Erlebnis mit {name} erfassen',
      dash_moment_connected_badge: 'Mit {name}',
      dash_moment_connected_title: 'Verbundene Person',
      dash_moment_connected_sub: 'Echte Verbindung mit {name}',
      btn_view_profile: 'Profil ansehen',
      btn_prev: 'Vorherige',
      btn_next: 'Nächste',

      // Real-Life People & Relationship Progression
      journal_tab_people: '👥 Kontakte ({count})',
      journal_tab_people_zero: '👥 Kontakte',
      journal_people_desc: 'Verfolge das echte, organische Wachsen deiner Begegnungen im echten Leben — vom ersten Funken bis zur echten Freundschaft oder Partnerschaft.',
      btn_add_person: '+ Kontakt hinzufügen',
      people_filter_all: 'Alle Kontakte',
      people_filter_spontaneous: 'Spontan',
      people_filter_casual: 'Flüchtig',
      people_filter_regular: 'Regelmäßig',
      people_filter_close: 'Eng',
      people_filter_romantic: 'Romantisch',
      people_empty: 'Noch keine Kontakte festgehalten. Füge jemanden hinzu, den du im echten Leben kennengelernt hast!',

      // Relationship Stages
      stage_spontaneous: 'Einmaliger Funke',
      stage_casual: 'Flüchtige Bekanntschaft',
      stage_regular: 'Regelmäßiger Kontakt',
      stage_close: 'Engere Verbindung',
      stage_romantic: 'Romantisches Interesse',
      progression_level: 'Stufe {level} von 5 · {stage} ({percent}%)',
      btn_advance_stage: 'Vertiefen',
      btn_demote_stage: 'Verringern',
      toast_stage_advanced: '✨ Verbindung mit {name} vertieft zu: {stage}!',

      // Person Card
      person_dob_label: '{dob}',
      person_age_label: '({age} J.)',
      person_upcoming_bday: '🎂 Geburtstag in {days} Tagen!',
      person_met_at_label: 'Kennengelernt: {loc}',
      person_contact_label: '{contact}',
      person_notes_label: 'Notizen & Interessen:',
      person_encounters_count: '{count} Begegnungen erlebt',
      person_encounters_count_single: '1 Begegnung erlebt',
      person_encounters_count_zero: 'Noch keine Begegnungen erfasst',
      person_btn_add_encounter: '+ Begegnung erfassen',
      person_btn_edit: 'Bearbeiten',
      person_btn_delete: 'Löschen',
      confirm_delete_person: 'Diesen Kontakt wirklich löschen? (Bereits erfasste Erlebnisse bleiben erhalten)',
      person_saved_alert: 'Kontaktprofil gespeichert!',
      person_quick_add_dob: '+ Geburtstag hinzufügen',
      person_quick_add_contact: '+ Kontaktinfo hinzufügen',
      person_quick_add_notes: '+ Notizen hinzufügen',
      person_timeline_toggle: 'Erlebnisse anzeigen ({count})',
      person_timeline_hide: 'Erlebnisse verbergen',

      // Modal: Add / Edit Person
      person_modal_title_add: 'Echten Kontakt hinzufügen',
      person_modal_title_edit: 'Kontaktprofil bearbeiten',
      person_form_name: 'Name / Spitzname *',
      person_form_name_placeholder: 'z.B. Maya, David aus der Kletterhalle, Sarah...',
      person_form_stage: 'Beziehungsstufe / Vertrautheit',
      person_form_dob: 'Geburtsdatum (Optional)',
      person_form_dob_help: 'Freilassen, falls noch nicht bekannt; ergibt sich oft mit der Zeit von selbst.',
      person_form_met_at: 'Wo / Wie kennengelernt? (Optional)',
      person_form_met_at_placeholder: 'z.B. Kletterhalle, Buchhandlung Fotografie-Ecke, Abendessen bei Freunden...',
      person_form_contact: 'Kontaktinfo / Socials (Optional)',
      person_form_contact_placeholder: 'z.B. @instagram, WhatsApp, +49 170...',
      person_form_notes: 'Notizen, Interessen & Erinnerungen (Optional)',
      person_form_notes_placeholder: 'z.B. Trinkt Hafer-Cappuccino, spielt Tennis, Hund namens Luna...',
      btn_save_person: 'Kontakt speichern',
      alert_person_missing_name: 'Bitte gib einen Namen oder Spitznamen an.',

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
      app_form_swipe_rate: 'Swipe-Tempo',
      app_form_rate_help: 'Swipes/Min (Standard 2.0)',
      app_form_swipes_preview: 'Swipes gespart / Tag',
      app_form_swipes_help: 'Aus Minuten & Tempo',
      app_form_motivation: 'Warum hast du die App gelöscht?',
      app_form_motivation_placeholder: 'z.B. Genug von oberflächlichem Swipen und Ghosting. Ich will echte zwischenmenschliche Nähe.',
      app_form_motivation_help: 'Wird bei Drang nach Neuinstallation gezeigt.',
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
