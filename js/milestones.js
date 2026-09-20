// Milestones and psychological stages of dating-app freedom
// Structured into 4 distinct cognitive & neurochemical phases
// Bilingual support for English and German

const MILESTONE_PHASES = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    icon: '⚡',
    title: 'Phase 1: Acute Withdrawal & Detox',
    title_de: 'Phase 1: Akuter Entzug & Entgiftung',
    timeframe: 'Hours 1 – 72 (Days 1–3)',
    timeframe_de: 'Stunde 1 – 72 (Tag 1–3)',
    desc: 'Conquering phantom phone reflexes, dopamine dips, and the vulnerable first evening.',
    desc_de: 'Phantom-Reflexe überwinden, Dopamin-Täler meistern und den ersten Abend ohne Swipen schaffen.'
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    icon: '🧠',
    title: 'Phase 2: Neural Rewiring & Routine',
    title_de: 'Phase 2: Neuronale Umstrukturierung',
    timeframe: 'Days 5 – 21 (Weeks 1–3)',
    timeframe_de: 'Tag 5 – 21 (Woche 1–3)',
    desc: 'Dissolving automated phone triggers and establishing a new 21-day neurological baseline.',
    desc_de: 'Automatische Griff-zum-Handy-Reflexe abbauen und ein stabiles 21-Tage-Fundament aufbauen.'
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    icon: '✨',
    title: 'Phase 3: Cognitive Clarity & Realignment',
    title_de: 'Phase 3: Kognitive Klarheit & Ausrichtung',
    timeframe: 'Days 30 – 90 (Months 1–3)',
    timeframe_de: 'Tag 30 – 90 (Monat 1–3)',
    desc: 'Dopamine receptor upregulation, freedom from algorithmic comparison, and vibrant presence.',
    desc_de: 'Regeneration der Dopaminrezeptoren, Befreiung von Vergleichsspiralen und lebendige Präsenz.'
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    icon: '👑',
    title: 'Phase 4: Authentic Mastery & Freedom',
    title_de: 'Phase 4: Dauerhafte Souveränität',
    timeframe: 'Months 4 – 12 (Day 120 – 1 Year)',
    timeframe_de: 'Monat 4 – 12 (Tag 120 – 1 Jahr)',
    desc: 'Unshakable emotional independence, holistic dating mindset, and natural social confidence.',
    desc_de: 'Unerschütterliche innere Freiheit und echte, unbeschwerte Begegnungen im realen Leben.'
  }
];

const MILESTONES = [
  // --- PHASE 1: ACUTE WITHDRAWAL & DETOX (Hours 1 - 72) ---
  {
    id: 'm-1h',
    phaseId: 'phase-1',
    hours: 1,
    badge: '🌱',
    title: 'The Decision',
    title_de: 'Der Entschluss',
    subtitle: 'The first hour of real presence',
    subtitle_de: 'Die erste Stunde echte Präsenz',
    desc: 'You made the deliberate choice to step off the dopamine hamster wheel. The notification silence feels distinct.',
    desc_de: 'Du hast die bewusste Entscheidung getroffen, das Dopamin-Hamsterrad zu verlassen. Die Stille ohne Push-Nachrichten ist spürbar.',
    insight: 'The brain immediately registers the absence of the red badge trigger. A brief window of calm begins.',
    insight_de: 'Das Gehirn registriert sofort das Ausbleiben der roten Notification-Reize. Ein erstes Fenster der Ruhe öffnet sich.'
  },
  {
    id: 'm-12h',
    phaseId: 'phase-1',
    hours: 12,
    badge: '🌙',
    title: 'The First Evening',
    title_de: 'Der erste Abend',
    subtitle: '12 Hours Free — The Bedtime Reflex',
    subtitle_de: '12 Stunden frei — Der Sofa-Reflex',
    desc: 'You navigated the most vulnerable window of the day: winding down and resting without mindless bedtime swiping.',
    desc_de: 'Du hast das verletzlichste Zeitfenster gemeistert: Den Feierabend und das Einschlafen ohne gedankenloses Swipen im Bett.',
    insight: 'Evening screen routines are strong habitual loops. Replacing swiping with rest protects your circadian rhythm immediately.',
    insight_de: 'Abendliche Bildschirm-Gewohnheiten sind tief verankert. Das Swipen durch Ruhe zu ersetzen schützt deinen zirkadianen Rhythmus sofort.'
  },
  {
    id: 'm-24h',
    phaseId: 'phase-1',
    hours: 24,
    badge: '🌤️',
    title: 'Day One Clean',
    title_de: 'Tag 1 geschafft',
    subtitle: '24 Hours Dating-App Free',
    subtitle_de: '24 Stunden frei von Dating-Apps',
    desc: 'You completed your first full cycle of waking, living, and resting without swiping on strangers.',
    desc_de: 'Du hast einen kompletten Tag und eine Nacht gemeistert, ohne fremde Menschen auf einem Bildschirm zu bewerten.',
    insight: 'Phantom phone checking peaks today. Notice when your thumb naturally moves to where the app used to be.',
    insight_de: 'Der Phantom-Reflex ist heute am stärksten. Beobachte bewusst, wie dein Daumen automatisch dorthin wandert, wo die App war.'
  },
  {
    id: 'm-48h',
    phaseId: 'phase-1',
    hours: 48,
    badge: '🛡️',
    title: 'The 48-Hour Threshold',
    title_de: 'Die 48-Stunden-Schwelle',
    subtitle: '2 Days — Intentionality Prevails',
    subtitle_de: '2 Tage — Entschlossenheit siegt',
    desc: 'Day one was no fluke. You held strong through the second day when curiosity and phantom boredom try to bargain with you.',
    desc_de: 'Tag 1 war keine Eintagsfliege. Du bist auch am zweiten Tag standhaft geblieben, als Neugier und die alte Gewohnheit anklopften.',
    insight: 'The initial novelty of quitting meets the first wave of boredom. Standing firm directly strengthens prefrontal self-control.',
    insight_de: 'Der anfängliche Elan trifft auf erste Langeweile. Jetzt standhaft zu bleiben trainiert direkt die Impulskontrolle im präfrontalen Kortex.'
  },
  {
    id: 'm-3d',
    phaseId: 'phase-1',
    hours: 72,
    badge: '⚡',
    title: 'Dopamine Peak Cleared',
    title_de: 'Dopamin-Peak überstanden',
    subtitle: '3 Days Dating-App Free',
    subtitle_de: '3 Tage frei von Dating-Apps',
    desc: 'The initial withdrawal impulse has crested. The reflex to swipe out of boredom begins to weaken.',
    desc_de: 'Der erste Entzugsimpuls hat seinen Höhepunkt überschritten. Das automatische Swipen aus Langeweile lässt spürbar nach.',
    insight: 'Variable-ratio reward withdrawal peaks at ~72 hours. From here on, cravings get progressively gentler.',
    insight_de: 'Der Entzug variabler Belohnungsreize gipfelt nach ca. 72 Stunden. Ab jetzt werden die Impulse spürbar sanfter.'
  },

  // --- PHASE 2: NEURAL REWIRING & ROUTINE (Days 5 - 21) ---
  {
    id: 'm-5d',
    phaseId: 'phase-2',
    hours: 120,
    badge: '🔋',
    title: 'Focus Restored',
    title_de: 'Fokus zurückgewonnen',
    subtitle: '5 Days — Uninterrupted Flow',
    subtitle_de: '5 Tage — Ungestörter Alltag',
    desc: 'Nearly a full week. You no longer fragment your workday or leisure time by constantly checking for match notifications.',
    desc_de: 'Fast eine ganze Woche. Du unterbrichst deinen Tag nicht mehr ständig durch das nervöse Warten auf Match-Benachrichtigungen.',
    insight: 'Task switching fatigue drops substantially. Freeing up working memory brings back sustained concentration and calm.',
    insight_de: 'Mentale Erschöpfung durch ständiges Multitasking sinkt messbar. Dein Arbeitsgedächtnis wird spürbar entlastet.'
  },
  {
    id: 'm-7d',
    phaseId: 'phase-2',
    hours: 168,
    badge: '🌿',
    title: 'One Week Free',
    title_de: 'Eine Woche frei',
    subtitle: '7 Days of Real-World Focus',
    subtitle_de: '7 Tage Fokus auf die reale Welt',
    desc: 'One entire week reclaimed. You have saved hundreds of mindless swipes and hours of mental fatigue.',
    desc_de: 'Eine ganze Woche zurückgewonnen. Du hast hunderte sinnlose Swipes und Stunden mentaler Erschöpfung vermieden.',
    insight: 'Your natural attention span begins expanding. You can engage with books, conversations, and deep work longer.',
    insight_de: 'Deine natürliche Aufmerksamkeitsspanne wächst. Du kannst dich wieder länger auf Bücher, Gespräche und fokussierte Arbeit einlassen.'
  },
  {
    id: 'm-10d',
    phaseId: 'phase-2',
    hours: 240,
    badge: '🎯',
    title: 'Double Digits',
    title_de: 'Zweistellige Stärke',
    subtitle: '10 Days — A Solid Habit Base',
    subtitle_de: '10 Tage — Ein solides Fundament',
    desc: 'Ten solid days without algorithmic dating. The compulsive twitch to reach for your pocket during pauses is fading away.',
    desc_de: 'Zehn volle Tage ohne Dating-Apps. Der Zwang, im Aufzug oder an der roten Ampel blind in die Tasche zu greifen, verblasst zusehends.',
    insight: 'Reaching double digits reinforces self-efficacy: your brain realizes it does not require digital tokens to feel validated.',
    insight_de: 'Das Erreichen des zweistelligen Bereichs stärkt das Vertrauen in die eigene Willenskraft: Du brauchst keine digitale Bestätigung.'
  },
  {
    id: 'm-14d',
    phaseId: 'phase-2',
    hours: 336,
    badge: '🧠',
    title: 'Habit Rewiring',
    title_de: 'Neuronale Umprogrammierung',
    subtitle: '14 Days of Neural Recovery',
    subtitle_de: '14 Tage neuronale Erholung',
    desc: 'Two full weeks. The automated micro-habit of pulling out your phone in elevators or waiting rooms is dissolving.',
    desc_de: 'Zwei volle Wochen. Die automatische Angewohnheit, im Wartezimmer sofort das Handy zu zücken, löst sich auf.',
    insight: 'Synaptic connections tied to the swiping cue are pruning away. Your brain seeks healthier stimulation.',
    insight_de: 'Synaptische Verbindungen rund um den Swipe-Reiz werden abgebaut. Dein Gehirn sucht wieder nach gesünderen Reizen.'
  },
  {
    id: 'm-21d',
    phaseId: 'phase-2',
    hours: 504,
    badge: '💎',
    title: 'The 21-Day Habit Loop',
    title_de: 'Das 21-Tage-Fundament',
    subtitle: '3 Weeks of New Neural Pathways',
    subtitle_de: '3 Wochen neue Gewohnheiten',
    desc: 'Three full weeks! Behavioral science marks 21 days as the threshold where deliberate restraint turns into a natural routine.',
    desc_de: 'Drei volle Wochen! In der Verhaltenspsychologie gilt Tag 21 als Meilenstein, an dem bewusster Verzicht in eine selbstverständliche Routine übergeht.',
    insight: 'Basal ganglia circuits have re-encoded your boredom response. Real hobbies and curiosity replace digital slot machines.',
    insight_de: 'Die Basalganglien haben deine Reaktion auf Langeweile neu gelernt. Hobbys, Spaziergänge und echte Neugier ersetzen den digitalen Spielautomaten.'
  },

  // --- PHASE 3: COGNITIVE CLARITY & REALIGNMENT (Days 30 - 90) ---
  {
    id: 'm-30d',
    phaseId: 'phase-3',
    hours: 720,
    badge: '✨',
    title: 'One Month Clarity',
    title_de: 'Ein Monat Klarheit',
    subtitle: '30 Days Dating-App Free',
    subtitle_de: '30 Tage frei von Dating-Apps',
    desc: 'A full calendar month! Your self-worth is no longer pegged to an algorithm or stranger match rates.',
    desc_de: 'Ein voller Kalendermonat! Dein Selbstwertgefühl hängt nicht mehr an Algorithmen oder Match-Quoten fremder Personen.',
    insight: 'Dopamine baseline receptors are substantially upregulated. Real-life encounters feel significantly more vivid.',
    insight_de: 'Die Dichte deiner Dopaminrezeptoren hat sich normalisiert. Echte Begegnungen im Alltag fühlen sich wieder viel lebendiger an.'
  },
  {
    id: 'm-45d',
    phaseId: 'phase-3',
    hours: 1080,
    badge: '🧭',
    title: 'The Real-Life Shift',
    title_de: 'Reale Lebensfreude',
    subtitle: '45 Days — Authentic Social Radar',
    subtitle_de: '45 Tage — Echter Sozialradar',
    desc: 'Halfway to 90 days! You look up, hold warm eye contact in daily life, and experience zero ghosting or chatting stress.',
    desc_de: 'Halbzeit zu 90 Tagen! Du schaust hoch, hältst echten Blickkontakt im Alltag und hast null Stress durch Ghosting oder oberflächliche Chats.',
    insight: 'The mirror neuron system activates more keenly during face-to-face interaction when no longer blunted by catalog swiping.',
    insight_de: 'Das Spiegelneuronensystem reagiert bei echten Interaktionen wieder viel feiner, wenn es nicht mehr durch ständiges Katalog-Swipen abgestumpft ist.'
  },
  {
    id: 'm-60d',
    phaseId: 'phase-3',
    hours: 1440,
    badge: '🏔️',
    title: 'Grounded Presence',
    title_de: 'Geerdete Gelassenheit',
    subtitle: '60 Days of Authenticity',
    subtitle_de: '60 Tage Authentizität',
    desc: 'Two months of living without the constant illusion of infinite romantic options. Deep inner peace settled in.',
    desc_de: 'Zwei Monate ohne die ständige Illusion endloser Partnersuche-Optionen. Eine tiefe innere Ruhe hat sich eingestellt.',
    insight: 'Decision fatigue is largely gone. You view people in the real world as holistic humans rather than digital cards.',
    insight_de: 'Die chronische Entscheidungsmüdigkeit ist verschwunden. Du siehst Menschen im echten Leben wieder als ganze Persönlichkeiten.'
  },
  {
    id: 'm-90d',
    phaseId: 'phase-3',
    hours: 2160,
    badge: '🌟',
    title: 'Dopamine Reset',
    title_de: 'Dopamin-Reset',
    subtitle: '90 Days (Quarter Clean)',
    subtitle_de: '90 Tage (Ein Quartal frei)',
    desc: 'The gold standard of digital addiction recovery. Your reward neurochemistry has reset to its natural state.',
    desc_de: 'Der Goldstandard der digitalen Entwöhnung. Deine Belohnungs-Neurochemie ist wieder in ihrem natürlichen Gleichgewicht.',
    insight: 'Neuroplasticity has rebuilt your baseline mood stability. You no longer depend on micro-hits of validation.',
    insight_de: 'Dank Neuroplastizität hat sich deine Grundstimmung stabilisiert. Du bist nicht mehr auf digitale Bestätigungskicks angewiesen.'
  },

  // --- PHASE 4: AUTHENTIC MASTERY & FREEDOM (Months 4 - 12) ---
  {
    id: 'm-120d',
    phaseId: 'phase-4',
    hours: 2880,
    badge: '🌲',
    title: 'Seasonal Resilience',
    title_de: 'Saisonale Standfestigkeit',
    subtitle: '4 Months of Inner Peace',
    subtitle_de: '4 Monate innere Stabilität',
    desc: 'Four full months. You navigated season shifts, social peer pressure, and lonely weekends with steady self-respect.',
    desc_de: 'Vier volle Monate. Du hast Jahreszeitenwechsel, Gruppendruck und einsamere Wochenenden mit solider Selbstachtung gemeistert.',
    insight: 'Emotional resilience is now deeply anchored inside you. You no longer reach for a phone when feeling low; you take meaningful action.',
    insight_de: 'Emotionale Stabilität kommt von innen. Du greifst bei Tiefs nicht mehr reflexartig zum Handy, sondern gestaltest dein Leben aktiv.'
  },
  {
    id: 'm-180d',
    phaseId: 'phase-4',
    hours: 4320,
    badge: '🦅',
    title: 'Unshakable Peace',
    title_de: 'Unerschütterliche Freiheit',
    subtitle: '6 Months of Complete Freedom',
    subtitle_de: '6 Monate vollkommene Unabhängigkeit',
    desc: 'Half a year unbound. You have created an entirely new rhythm of life filled with authentic real-world connections.',
    desc_de: 'Ein halbes Jahr unabhängig. Du hast einen ganz neuen Lebensrhythmus mit authentischen Kontakten in der echten Welt geschaffen.',
    insight: 'The algorithmic dating culture feels completely foreign. You are immune to artificial romantic scarcity.',
    insight_de: 'Die Dating-App-Kultur fühlt sich mittlerweile völlig fremd an. Du bist immun gegen künstlich erzeugte Verknappung.'
  },
  {
    id: 'm-365d',
    phaseId: 'phase-4',
    hours: 8760,
    badge: '👑',
    title: '1 Year Unbound',
    title_de: '1 Jahr in wahrer Freiheit',
    subtitle: '365 Days of Real Connection',
    subtitle_de: '365 Tage echte Verbindungen',
    desc: 'A full year of true independence. You took your time, mental clarity, and dating life back into your own hands.',
    desc_de: 'Ein ganzes Jahr echte Selbstbestimmung. Du hast deine Zeit, mentale Klarheit und dein Liebesleben wieder selbst in die Hand genommen.',
    insight: 'Complete mastery over digital compulsion. You have proven you can thrive with genuine presence and self-respect.',
    insight_de: 'Vollständige Befreiung von digitalem Zwang. Du hast bewiesen, dass du mit wahrer Präsenz und Selbstachtung aufblühst.'
  }
];

class MilestoneManager {
  static getPhases(lang) {
    const currentLang = lang || (typeof window !== 'undefined' && window.i18n ? window.i18n.getLanguage() : 'en');
    const isDe = currentLang === 'de';

    return MILESTONE_PHASES.map(p => ({
      id: p.id,
      phaseNumber: p.phaseNumber,
      icon: p.icon,
      title: isDe && p.title_de ? p.title_de : p.title,
      timeframe: isDe && p.timeframe_de ? p.timeframe_de : p.timeframe,
      desc: isDe && p.desc_de ? p.desc_de : p.desc
    }));
  }

  static getLocalizedMilestone(m, lang) {
    if (!m) return null;
    const currentLang = lang || (typeof window !== 'undefined' && window.i18n ? window.i18n.getLanguage() : 'en');
    const isDe = currentLang === 'de';

    return {
      id: m.id,
      phaseId: m.phaseId,
      hours: m.hours,
      badge: m.badge,
      title: isDe && m.title_de ? m.title_de : m.title,
      subtitle: isDe && m.subtitle_de ? m.subtitle_de : m.subtitle,
      desc: isDe && m.desc_de ? m.desc_de : m.desc,
      insight: isDe && m.insight_de ? m.insight_de : m.insight
    };
  }

  static getAll(lang) {
    return MILESTONES.map(m => MilestoneManager.getLocalizedMilestone(m, lang));
  }

  static getPhasesWithMilestones(lang) {
    const phases = MilestoneManager.getPhases(lang);
    const milestones = MilestoneManager.getAll(lang);

    return phases.map(phase => ({
      ...phase,
      milestones: milestones.filter(m => m.phaseId === phase.id)
    }));
  }

  static getProgress(msDuration, lang) {
    const hours = msDuration / (1000 * 60 * 60);
    const localizedMilestones = MilestoneManager.getAll(lang);

    let currentMilestone = null;
    let nextMilestone = localizedMilestones[0];

    for (let i = 0; i < localizedMilestones.length; i++) {
      if (hours >= localizedMilestones[i].hours) {
        currentMilestone = localizedMilestones[i];
        nextMilestone = localizedMilestones[i + 1] || null;
      } else {
        if (!nextMilestone) nextMilestone = localizedMilestones[i];
        break;
      }
    }

    let progressPercent = 0;
    let hoursRemaining = 0;

    if (nextMilestone) {
      const targetHours = nextMilestone.hours;
      const progressInSegment = Math.max(0, hours);
      progressPercent = Math.min(100, Math.max(0, (progressInSegment / targetHours) * 100));
      hoursRemaining = Math.max(0, targetHours - hours);
    } else {
      progressPercent = 100;
    }

    return {
      currentMilestone,
      nextMilestone,
      progressPercent: Math.round(progressPercent * 10) / 10,
      hoursRemaining: Math.ceil(hoursRemaining)
    };
  }
}

window.MilestoneManager = MilestoneManager;

