// Service Worker Registration and Zero-Data-Loss Update Management

import { t } from './i18n.js';

let serviceWorkerRegistration = null;

export function getServiceWorkerRegistration() {
  return serviceWorkerRegistration;
}

export function initPWA() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      serviceWorkerRegistration = registration;
      console.log('[SW] Registered successfully.');

      // If an update is already waiting, prompt user safely
      if (registration.waiting) {
        notifyUserOfUpdate();
      }

      // Detect newly installed updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            notifyUserOfUpdate();
          }
        });
      });
    }).catch((err) => {
      console.warn('[SW] Registration failed:', err);
    });

    // Reload smoothly when new worker activates
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });

  const updateRefreshBtn = document.getElementById('update-refresh-btn');
  if (updateRefreshBtn) {
    updateRefreshBtn.addEventListener('click', () => {
      triggerPwaUpdate();
    });
  }
}

export function notifyUserOfUpdate() {
  const updateBanner = document.getElementById('update-banner');
  if (updateBanner) {
    updateBanner.classList.add('visible');
  }
  const updateStatusText = document.getElementById('update-status-text');
  if (updateStatusText) {
    updateStatusText.textContent = t('update_ready');
  }
}

export function triggerPwaUpdate() {
  if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
    serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}

export async function checkForPwaUpdates() {
  if (!serviceWorkerRegistration) {
    return { status: 'offline_or_unregistered' };
  }
  try {
    await serviceWorkerRegistration.update();
    return { status: 'checked' };
  } catch (err) {
    return { status: 'error', error: err };
  }
}
