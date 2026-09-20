// Milestones and psychological stages of dating-app freedom
// Bilingual support for English and German

const MILESTONES = [
  {
    id: 'm-1h',
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
    id: 'm-24h',
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
    id: 'm-3d',
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
  {
    id: 'm-7d',
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
    id: 'm-14d',
    hours: 336,
    badge: '🧠',
    title: 'Habit Rewiring',
    title_de: 'Neuronale Umprogrammierung',
    subtitle: '14 Days of Neural Recovery',
    subtitle_de: '14 Tage mentale Erholung',
    desc: 'Two full weeks. The automated micro-habit of pulling out your phone in elevators or waiting rooms is dissolving.',
    desc_de: 'Zwei volle Wochen. Die automatische Angewohnheit, im Aufzug oder Wartezimmer sofort das Handy zu zücken, löst sich auf.',
    insight: 'Synaptic connections tied to the swiping cue are pruning away. Your brain seeks healthier stimulation.',
    insight_de: 'Synaptische Verbindungen rund um den Swipe-Reiz werden abgebaut. Dein Gehirn sucht wieder nach gesünderen Reizen.'
  },
  {
    id: 'm-30d',
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
    id: 'm-60d',
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
  {
    id: 'm-180d',
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
  static getLocalizedMilestone(m, lang) {
    if (!m) return null;
    const currentLang = lang || (typeof window !== 'undefined' && window.i18n ? window.i18n.getLanguage() : 'en');
    const isDe = currentLang === 'de';

    return {
      id: m.id,
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
      const prevHours = currentMilestone ? currentMilestone.hours : 0;
      const targetHours = nextMilestone.hours;
      const segmentSpan = targetHours - prevHours;
      const progressInSegment = Math.max(0, hours - prevHours);
      progressPercent = Math.min(100, Math.max(0, (progressInSegment / segmentSpan) * 100));
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
