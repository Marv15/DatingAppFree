// Integration & Network Verification Test
// Verifies HTTP 200 on all modular assets, MIME types, and ES module resolution.

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function fetchUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:8080${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

test('HTTP Server serves root index.html with 200 OK and UTF-8 charset', async () => {
  const res = await fetchUrl('/');
  assert.equal(res.statusCode, 200);
  assert.ok(res.headers['content-type'].includes('text/html'));
  assert.ok(res.body.includes('id="modals-container"'));
  assert.ok(res.body.includes('type="module" src="js/main.js"'));
  // Ensure no inline <style> block remains
  assert.ok(!res.body.includes('iOS Safari PWA Modal Scrolling Fix'));
});

test('HTTP Server serves /api/info with network addresses', async () => {
  const res = await fetchUrl('/api/info');
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.ok(data.phoneUrl);
  assert.ok(data.localIp);
  assert.ok(data.localUrl);
});

test('All modular JS and CSS files are served with 200 OK and correct MIME types', async () => {
  const filesToVerify = [
    { path: '/css/styles.css', expectedMime: 'text/css' },
    { path: '/css/themes.css', expectedMime: 'text/css' },
    { path: '/css/base.css', expectedMime: 'text/css' },
    { path: '/js/main.js', expectedMime: 'application/javascript' },
    { path: '/js/app.js', expectedMime: 'application/javascript' },
    { path: '/js/qrcode.js', expectedMime: 'application/javascript' },
    { path: '/js/config/constants.js', expectedMime: 'application/javascript' },
    { path: '/js/config/app-icons.js', expectedMime: 'application/javascript' },
    { path: '/js/utils/dom.js', expectedMime: 'application/javascript' },
    { path: '/js/utils/formatters.js', expectedMime: 'application/javascript' },
    { path: '/js/services/i18n.js', expectedMime: 'application/javascript' },
    { path: '/js/services/milestones.js', expectedMime: 'application/javascript' },
    { path: '/js/services/storage.js', expectedMime: 'application/javascript' },
    { path: '/js/services/navigation.js', expectedMime: 'application/javascript' },
    { path: '/js/services/theme.js', expectedMime: 'application/javascript' },
    { path: '/js/services/pwa.js', expectedMime: 'application/javascript' },
    { path: '/js/components/ticker.js', expectedMime: 'application/javascript' },
    { path: '/js/components/breathing.js', expectedMime: 'application/javascript' },
    { path: '/js/components/backup.js', expectedMime: 'application/javascript' },
    { path: '/js/components/settings.js', expectedMime: 'application/javascript' },
    { path: '/js/components/qr-generator.js', expectedMime: 'application/javascript' },
    { path: '/js/views/modals.templates.js', expectedMime: 'application/javascript' },
    { path: '/js/views/apps.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/dashboard.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/journal.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/milestones.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/moments.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/people.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/stories.view.js', expectedMime: 'application/javascript' },
    { path: '/js/views/urge-sos.view.js', expectedMime: 'application/javascript' },
    { path: '/sw.js', expectedMime: 'application/javascript' },
    { path: '/manifest.webmanifest', expectedMime: 'application/manifest+json' }
  ];

  for (const item of filesToVerify) {
    const res = await fetchUrl(item.path);
    assert.equal(res.statusCode, 200, `Failed to load ${item.path}: status was ${res.statusCode}`);
    assert.ok(
      res.headers['content-type'].includes(item.expectedMime),
      `Expected ${item.expectedMime} for ${item.path}, got ${res.headers['content-type']}`
    );
    assert.ok(res.body.length > 0, `${item.path} returned empty body`);
  }
});

test('Modals template HTML contains all 10 modal sheets', async () => {
  const { getModalsHtml } = await import('../js/views/modals.templates.js');
  const html = getModalsHtml();
  assert.ok(html.includes('id="modal-sos"'), 'Missing modal-sos');
  assert.ok(html.includes('id="modal-app"'), 'Missing modal-app');
  assert.ok(html.includes('id="modal-reset"'), 'Missing modal-reset');
  assert.ok(html.includes('id="modal-settings"'), 'Missing modal-settings');
  assert.ok(html.includes('id="modal-ios-guide"'), 'Missing modal-ios-guide');
  assert.ok(html.includes('id="modal-phone-connect"'), 'Missing modal-phone-connect');
  assert.ok(html.includes('id="modal-story"'), 'Missing modal-story');
  assert.ok(html.includes('id="modal-moment"'), 'Missing modal-moment');
  assert.ok(html.includes('id="modal-person"'), 'Missing modal-person');
  assert.ok(html.includes('id="modal-checkin"'), 'Missing modal-checkin');
});

test('Theme service contains 6 configured themes', async () => {
  const { THEMES_CONFIG, THEME_KEYS } = await import('../js/services/theme.js');
  assert.equal(THEME_KEYS.length, 6);
  assert.deepEqual(THEME_KEYS, ['claude-light', 'claude-dark', 'gemini', 'chatgpt', 'github', 'steam']);
  for (const key of THEME_KEYS) {
    assert.ok(THEMES_CONFIG[key].icon);
    assert.ok(THEMES_CONFIG[key].color);
    assert.ok(THEMES_CONFIG[key].name);
  }
});

test('Service Worker ASSETS_TO_CACHE lists all critical modular files', () => {
  const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
  assert.ok(swContent.includes("'./css/themes.css'"));
  assert.ok(swContent.includes("'./css/base.css'"));
  assert.ok(swContent.includes("'./js/main.js'"));
  assert.ok(swContent.includes("'./js/services/storage.js'"));
  assert.ok(swContent.includes("'./js/views/modals.templates.js'"));
  assert.ok(swContent.includes("'dating-free-v2.0.0'"));
});
