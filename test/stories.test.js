// Unit tests for Reality Check Stories rendering

import test from 'node:test';
import assert from 'node:assert/strict';
import { createStoryCardElement } from '../js/views/stories.view.js';

// Setup minimal document mock for Node test environment if not present
if (typeof document === 'undefined') {
  global.document = {
    createElement(tag) {
      return {
        tagName: tag.toUpperCase(),
        className: '',
        id: '',
        innerHTML: '',
        querySelector() { return null; },
        querySelectorAll() { return []; },
        appendChild() {},
        addEventListener() {}
      };
    }
  };
}

test('createStoryCardElement renders compact story-app-tag and small icon', () => {
  const sampleStory = {
    id: 'story-123',
    appName: 'Tinder',
    incidentType: 'ghosting',
    date: '2026-03-01',
    personName: 'Alex',
    story: 'Talked for a few days, planned a coffee date, then unmatched right before.',
    lesson: 'Endless superficial matching is a waste of mental energy.'
  };

  const card = createStoryCardElement(sampleStory);
  assert.equal(card.id, 'story-card-story-123');
  assert.ok(card.innerHTML.includes('story-app-tag'), 'Should include .story-app-tag');
  assert.ok(card.innerHTML.includes('style="width: 13px; height: 13px;'), 'App logo should be constrained to 13px');
  assert.ok(card.innerHTML.includes('icons/tinder_logo.svg'), 'Should load Tinder logo icon');
  assert.ok(card.innerHTML.includes('Alex'), 'Should display person name');
  assert.ok(!card.innerHTML.includes('width: 100%; height: 100%;'), 'Should NOT have unconstrained 100% width on logo');
});
