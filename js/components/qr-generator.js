// Phone Connect & QR Code Generator
// Detects local network IP via /api/info and renders an ISO-standard QR code for iPhone/Android.

import { t } from '../services/i18n.js';
import { openModal, showToast } from '../utils/dom.js';

let cachedTargetUrl = null;

export async function fetchNetworkUrl() {
  if (typeof window === 'undefined') return '';
  let targetUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port || 8080}`;
  try {
    const res = await fetch('/api/info');
    if (res.ok) {
      const info = await res.json();
      if (info.phoneUrl) {
        targetUrl = info.phoneUrl;
      }
    }
  } catch (_) {
    // Fallback to origin
  }
  cachedTargetUrl = targetUrl;
  return targetUrl;
}

export function renderQrCode(container, url) {
  if (!container) return;
  container.innerHTML = '';

  const QRCodeLib = (typeof window !== 'undefined') ? window.QRCode : null;
  if (!QRCodeLib) return;

  const canvas = document.createElement('canvas');
  canvas.style.borderRadius = '14px';
  canvas.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)';
  canvas.style.background = '#FFFFFF';
  canvas.style.padding = '8px';
  container.appendChild(canvas);

  if (QRCodeLib.toCanvas) {
    QRCodeLib.toCanvas(canvas, url, {
      width: 260,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, function (error) {
      if (error) {
        console.error('[QR] toCanvas error, falling back to SVG:', error);
        if (QRCodeLib.toString) {
          QRCodeLib.toString(url, { type: 'svg', width: 260, margin: 4 }, function (err, svg) {
            if (!err) container.innerHTML = svg;
          });
        }
      }
    });
  }
}

export function setupPhoneConnect() {
  const btnPhoneConnect = document.getElementById('btn-phone-connect');
  const modalPhoneConnect = document.getElementById('modal-phone-connect');
  const phoneUrlDisplay = document.getElementById('phone-url-display');
  const phoneQrContainer = document.getElementById('phone-qr-container');
  const btnCopyPhoneUrl = document.getElementById('btn-copy-phone-url');

  if (!btnPhoneConnect) return;

  // Prefetch network URL
  fetchNetworkUrl();

  btnPhoneConnect.addEventListener('click', async () => {
    openModal(modalPhoneConnect);
    const url = await fetchNetworkUrl();
    if (phoneUrlDisplay) phoneUrlDisplay.value = url;
    if (phoneQrContainer) renderQrCode(phoneQrContainer, url);
  });

  if (btnCopyPhoneUrl) {
    btnCopyPhoneUrl.addEventListener('click', async () => {
      const url = cachedTargetUrl || window.location.href;
      try {
        await navigator.clipboard.writeText(url);
        showToast(t('link_copied_alert', { url }), 'success');
      } catch (_) {
        showToast('URL: ' + url, 'info');
      }
    });
  }
}
