// Milestones and psychological stages of dating-app freedom

const MILESTONES = [
  {
    id: 'm-1h',
    hours: 1,
    title: 'The Decision',
    badge: '🌱',
    subtitle: 'The first hour of real presence',
    desc: 'You made the deliberate choice to step off the dopamine hamster wheel. The notification silence feels distinct.',
    insight: 'The brain immediately registers the absence of the red badge trigger. A brief window of calm begins.'
  },
  {
    id: 'm-24h',
    hours: 24,
    title: 'Day One Clean',
    badge: '🌤️',
    subtitle: '24 Hours Dating-App Free',
    desc: 'You completed your first full cycle of waking, living, and resting without swiping on strangers.',
    insight: 'Phantom phone checking peaks today. Notice when your thumb naturally moves to where the app used to be.'
  },
  {
    id: 'm-3d',
    hours: 72,
    title: 'Dopamine Peak Cleared',
    badge: '⚡',
    subtitle: '3 Days Dating-App Free',
    desc: 'The initial withdrawal impulse has crested. The reflex to swipe out of boredom begins to weaken.',
    insight: 'Variable-ratio reward withdrawal peaks at ~72 hours. From here on, cravings get progressively gentler.'
  },
  {
    id: 'm-7d',
    hours: 168,
    title: 'One Week Free',
    badge: '🌿',
    subtitle: '7 Days of Real-World Focus',
    desc: 'One entire week reclaimed. You have saved hundreds of mindless swipes and hours of mental fatigue.',
    insight: 'Your natural attention span begins expanding. You can engage with books, conversations, and deep work longer.'
  },
  {
    id: 'm-14d',
    hours: 336,
    title: 'Habit Rewiring',
    badge: '🧠',
    subtitle: '14 Days of Neural Recovery',
    desc: 'Two full weeks. The automated micro-habit of pulling out your phone in elevators or waiting rooms is dissolving.',
    insight: 'Synaptic connections tied to the swiping cue are pruning away. Your brain seeks healthier stimulation.'
  },
  {
    id: 'm-30d',
    hours: 720,
    title: 'One Month Clarity',
    badge: '✨',
    subtitle: '30 Days Dating-App Free',
    desc: 'A full calendar month! Your self-worth is no longer pegged to an algorithm or stranger match rates.',
    insight: 'Dopamine baseline receptors are substantially upregulated. Real-life encounters feel significantly more vivid.'
  },
  {
    id: 'm-60d',
    hours: 1440,
    title: 'Grounded Presence',
    badge: '🏔️',
    subtitle: '60 Days of Authenticity',
    desc: 'Two months of living without the constant illusion of infinite romantic options. Deep inner peace settled in.',
    insight: 'Decision fatigue is largely gone. You view people in the real world as holistic humans rather than digital cards.'
  },
  {
    id: 'm-90d',
    hours: 2160,
    title: 'Dopamine Reset',
    badge: '🌟',
    subtitle: '90 Days (Quarter Clean)',
    desc: 'The gold standard of digital addiction recovery. Your reward neurochemistry has reset to its natural state.',
    insight: 'Neuroplasticity has rebuilt your baseline mood stability. You no longer depend on micro-hits of validation.'
  },
  {
    id: 'm-180d',
    hours: 4320,
    title: 'Unshakable Peace',
    badge: '🦅',
    subtitle: '6 Months of Complete Freedom',
    desc: 'Half a year unbound. You have created an entirely new rhythm of life filled with authentic real-world connections.',
    insight: 'The algorithmic dating culture feels completely foreign. You are immune to artificial romantic scarcity.'
  },
  {
    id: 'm-365d',
    hours: 8760,
    title: '1 Year Unbound',
    badge: '👑',
    subtitle: '365 Days of Real Connection',
    desc: 'A full year of true independence. You took your time, mental clarity, and dating life back into your own hands.',
    insight: 'Complete mastery over digital compulsion. You have proven you can thrive with genuine presence and self-respect.'
  }
];

class MilestoneManager {
  static getAll() {
    return MILESTONES;
  }

  static getProgress(msDuration) {
    const hours = msDuration / (1000 * 60 * 60);

    let currentMilestone = null;
    let nextMilestone = MILESTONES[0];

    for (let i = 0; i < MILESTONES.length; i++) {
      if (hours >= MILESTONES[i].hours) {
        currentMilestone = MILESTONES[i];
        nextMilestone = MILESTONES[i + 1] || null;
      } else {
        if (!nextMilestone) nextMilestone = MILESTONES[i];
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
