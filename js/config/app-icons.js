// App logo configurations and badge renderer
// Provides SVG logo paths, background colors, and badge generation for popular dating apps.

import { escapeHtml } from '../utils/dom.js';

export function getAppIconConfig(appName) {
  if (!appName) return null;
  const n = appName.toLowerCase().trim();
  if (n.includes('tinder')) {
    return {
      src: 'icons/tinder_logo.svg',
      bg: '#FFFFFF',
      padding: '5px',
      fit: 'contain',
      alt: 'Tinder'
    };
  }
  if (n.includes('bumble')) {
    return {
      src: 'icons/bumble_logo.svg',
      bg: '#F9B932',
      padding: '0',
      fit: 'cover',
      alt: 'Bumble'
    };
  }
  if (n.includes('hinge')) {
    return {
      src: 'icons/hinge_logo.svg',
      bg: '#FAF8F5',
      padding: '6px',
      fit: 'contain',
      alt: 'Hinge'
    };
  }
  if (n.includes('badoo')) {
    return {
      src: 'icons/badoo_logo.svg',
      bg: '#E9D8FF',
      padding: '0',
      fit: 'cover',
      alt: 'Badoo'
    };
  }
  if (n.includes('grindr')) {
    return {
      src: 'icons/grindr_logo.svg',
      bg: '#1A1917',
      padding: '5px',
      fit: 'contain',
      alt: 'Grindr'
    };
  }
  return null;
}

export function renderAppIconBadge(app, size = 36) {
  const iconConfig = getAppIconConfig(app.name);
  if (iconConfig) {
    return `
      <div class="app-icon-badge has-logo" style="width: ${size}px; height: ${size}px; background-color: ${iconConfig.bg}; padding: ${iconConfig.padding};">
        <img src="${iconConfig.src}" alt="${escapeHtml(iconConfig.alt)}" class="app-logo-img" style="object-fit: ${iconConfig.fit}; width: 100%; height: 100%;">
      </div>
    `;
  }
  return `
    <div class="app-icon-badge" style="width: ${size}px; height: ${size}px; background-color: ${app.color || 'var(--accent)'};">
      ${escapeHtml(app.name ? app.name.charAt(0).toUpperCase() : '?')}
    </div>
  `;
}
