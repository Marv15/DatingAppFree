import { test } from 'node:test';
import assert from 'node:assert';
import { StorageService } from '../js/services/storage.js';

class MockStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.get(key) || null;
  }
  setItem(key, val) {
    this.map.set(key, String(val));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

test('StorageService initializes with valid default state', () => {
  const mock = new MockStorage();
  const service = new StorageService(mock);

  const apps = service.getApps();
  assert.strictEqual(apps.length, 3);
  assert.strictEqual(apps[0].id, 'tinder');
  assert.strictEqual(apps[1].id, 'bumble');
  assert.strictEqual(apps[2].id, 'hinge');

  const checkIns = service.getCheckIns();
  assert.strictEqual(checkIns.length, 2);

  const people = service.getPeople();
  assert.strictEqual(people.length, 1);
  assert.strictEqual(people[0].name, 'Elena');
});

test('StorageService saveApp adds and updates apps', () => {
  const mock = new MockStorage();
  const service = new StorageService(mock);

  // Add custom app
  service.saveApp({
    id: 'test-app',
    name: 'Test App',
    dailyMinutes: 30,
    monthlyCost: 15,
    motivation: 'Waste of time'
  });

  const app = service.getApp('test-app');
  assert.ok(app);
  assert.strictEqual(app.name, 'Test App');
  assert.strictEqual(app.dailyMinutes, 30);
  assert.strictEqual(app.monthlyCost, 15);
  // Default multiplier 2.0 * 30 = 60
  assert.strictEqual(app.swipesPerDay, 60);

  // Update existing app
  service.saveApp({
    id: 'test-app',
    name: 'Test App Renamed',
    dailyMinutes: 60,
    monthlyCost: 0,
    neverPaid: true
  });

  const updated = service.getApp('test-app');
  assert.strictEqual(updated.name, 'Test App Renamed');
  assert.strictEqual(updated.dailyMinutes, 60);
  assert.strictEqual(updated.monthlyCost, 0);
  assert.strictEqual(updated.neverPaid, true);
});

test('StorageService resetApp preserves history and restarts streak', () => {
  const mock = new MockStorage();
  const service = new StorageService(mock);

  const appBefore = service.getApp('tinder');
  const originalQuit = appBefore.quitDate;

  service.resetApp('tinder', 'Felt lonely');

  const appAfter = service.getApp('tinder');
  assert.notStrictEqual(appAfter.quitDate, originalQuit);
  assert.strictEqual(appAfter.history.length, 1);
  assert.strictEqual(appAfter.history[0].reason, 'Felt lonely');
});

test('StorageService people progression stages work correctly', () => {
  const mock = new MockStorage();
  const service = new StorageService(mock);

  const elena = service.getPerson('person-1');
  assert.strictEqual(elena.stage, 'close');

  service.setPersonStage('person-1', 'romantic');
  const updatedElena = service.getPerson('person-1');
  assert.strictEqual(updatedElena.stage, 'romantic');
});

test('StorageService export and import restore state', () => {
  const mock = new MockStorage();
  const service = new StorageService(mock);

  const exported = service.exportDataAsJSON();
  assert.ok(exported.includes('tinder'));

  const newMock = new MockStorage();
  const newService = new StorageService(newMock);
  const result = newService.importDataFromJSON(exported);

  assert.strictEqual(result.success, true);
  assert.strictEqual(newService.getApps().length, service.getApps().length);
});

test('StorageService reactive subscribe triggers on saveData', () => {
  const mock = new MockStorage();
  const service = new StorageService(mock);

  let notified = false;
  const unsubscribe = service.subscribe((event, data) => {
    if (event === 'change') notified = true;
  });

  service.setTheme('gemini');
  assert.strictEqual(notified, true);
  assert.strictEqual(service.data.theme, 'gemini');

  unsubscribe();
});
