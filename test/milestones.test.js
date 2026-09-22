import { test } from 'node:test';
import assert from 'node:assert';
import { MilestoneManager, MILESTONE_PHASES, MILESTONES } from '../js/services/milestones.js';

test('MilestoneManager getPhases returns 4 distinct phases', () => {
  const phasesEn = MilestoneManager.getPhases('en');
  assert.strictEqual(phasesEn.length, 4);
  assert.strictEqual(phasesEn[0].id, 'phase-1');
  assert.strictEqual(phasesEn[0].phaseNumber, 1);
  assert.strictEqual(phasesEn[0].title, 'Phase 1: Acute Withdrawal & Detox');

  const phasesDe = MilestoneManager.getPhases('de');
  assert.strictEqual(phasesDe[0].title, 'Phase 1: Akuter Entzug & Entgiftung');
});

test('MilestoneManager getAll returns all milestones with correct hours', () => {
  const milestones = MilestoneManager.getAll('en');
  assert.strictEqual(milestones.length, 17);
  assert.strictEqual(milestones[0].id, 'm-1h');
  assert.strictEqual(milestones[0].hours, 1);
  assert.strictEqual(milestones[milestones.length - 1].hours, 8760); // 1 Year
});

test('MilestoneManager getProgress calculates milestone transitions', () => {
  // 0 hours: Next is m-1h (1 hour)
  const p0 = MilestoneManager.getProgress(0, 'en');
  assert.strictEqual(p0.currentMilestone, null);
  assert.strictEqual(p0.nextMilestone.id, 'm-1h');
  assert.strictEqual(p0.progressPercent, 0);
  assert.strictEqual(p0.hoursRemaining, 1);

  // 10 hours: Current is m-1h (1h), Next is m-12h (12h)
  const tenHoursMs = 10 * 3600 * 1000;
  const p10 = MilestoneManager.getProgress(tenHoursMs, 'en');
  assert.strictEqual(p10.currentMilestone.id, 'm-1h');
  assert.strictEqual(p10.nextMilestone.id, 'm-12h');
  assert.strictEqual(p10.hoursRemaining, 2);

  // 10000 hours: Past all milestones
  const overYearMs = 10000 * 3600 * 1000;
  const pYear = MilestoneManager.getProgress(overYearMs, 'en');
  assert.strictEqual(pYear.currentMilestone.id, 'm-365d');
  assert.strictEqual(pYear.nextMilestone, null);
  assert.strictEqual(pYear.progressPercent, 100);
});

test('MilestoneManager getPhasesWithMilestones groups correctly', () => {
  const grouped = MilestoneManager.getPhasesWithMilestones('en');
  assert.strictEqual(grouped.length, 4);
  const totalGrouped = grouped.reduce((sum, p) => sum + p.milestones.length, 0);
  assert.strictEqual(totalGrouped, MILESTONES.length);
});
