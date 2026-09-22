import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateSwipesPerDay,
  getSwipeMultiplierForApp,
  getStageConfig
} from '../js/config/constants.js';
import {
  formatStreak,
  formatShortTime,
  calculateAge,
  getDaysUntilBirthday,
  formatMilestoneHours
} from '../js/utils/formatters.js';

test('getSwipeMultiplierForApp returns correct rates', () => {
  assert.strictEqual(getSwipeMultiplierForApp('Tinder Gold'), 3.0);
  assert.strictEqual(getSwipeMultiplierForApp('Bumble Boost'), 2.2);
  assert.strictEqual(getSwipeMultiplierForApp('Hinge'), 1.2);
  assert.strictEqual(getSwipeMultiplierForApp('Unknown App'), 2.0);
});

test('calculateSwipesPerDay calculates correctly with minutes and multiplier', () => {
  // 45 mins * 3.0 = 135
  assert.strictEqual(calculateSwipesPerDay(45, null, 'Tinder'), 135);
  // Custom multiplier takes precedence
  assert.strictEqual(calculateSwipesPerDay(60, 1.5, 'Tinder'), 90);
  // Zero or invalid minutes
  assert.strictEqual(calculateSwipesPerDay(-10, 2.0), 0);
});

test('formatStreak formats days, hours, and minutes', () => {
  const dummyT = (key, params) => {
    if (key === 'streak_days_hours') return `${params.d}d ${params.h}h`;
    if (key === 'streak_hours_mins') return `${params.h}h ${params.m}m`;
    if (key === 'streak_mins') return `${params.m}m`;
    return key;
  };

  const dayAndHalf = (1 * 86400 + 5 * 3600) * 1000;
  assert.strictEqual(formatStreak(dayAndHalf, dummyT), '1d 5h');

  const twoHours = 2 * 3600 * 1000 + 15 * 60 * 1000;
  assert.strictEqual(formatStreak(twoHours, dummyT), '2h 15m');

  const twentyMins = 20 * 60 * 1000;
  assert.strictEqual(formatStreak(twentyMins, dummyT), '20m');
});

test('calculateAge calculates accurate completed age', () => {
  const now = new Date('2026-09-22T12:00:00Z');
  assert.strictEqual(calculateAge('1995-05-10', now), 31);
  assert.strictEqual(calculateAge('1995-10-15', now), 30); // Birthday hasn't happened yet in 2026
  assert.strictEqual(calculateAge('invalid-date', now), null);
  assert.strictEqual(calculateAge('', now), null);
});

test('getDaysUntilBirthday detects upcoming birthdays within 30 days', () => {
  const now = new Date('2026-09-22T00:00:00');
  // Birthday in 5 days
  assert.strictEqual(getDaysUntilBirthday('1998-09-27', now), 5);
  // Birthday today
  assert.strictEqual(getDaysUntilBirthday('2000-09-22', now), 0);
  // Birthday far away (> 30 days) returns null
  assert.strictEqual(getDaysUntilBirthday('1998-03-15', now), null);
});

test('formatMilestoneHours outputs human readable strings', () => {
  assert.strictEqual(formatMilestoneHours(12, 'en'), '12h');
  assert.strictEqual(formatMilestoneHours(12, 'de'), '12 Std.');
  assert.strictEqual(formatMilestoneHours(48, 'en'), '2 Days');
  assert.strictEqual(formatMilestoneHours(48, 'de'), '2 Tage');
  assert.strictEqual(formatMilestoneHours(720, 'en'), '30 Days');
  assert.strictEqual(formatMilestoneHours(2160, 'en'), '3 Months');
});

test('getStageConfig returns valid progression config', () => {
  const cfg = getStageConfig('romantic', 'en');
  assert.strictEqual(cfg.level, 5);
  assert.strictEqual(cfg.percent, 100);
  assert.strictEqual(cfg.name, 'Romantic Interest');

  const cfgDe = getStageConfig('spontaneous', 'de');
  assert.strictEqual(cfgDe.level, 1);
  assert.strictEqual(cfgDe.name, 'Einmaliger Funke');
});
