// DOM helpers, modal sheet controller, input sanitization, and toast notifications.

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function parseDecimal(val, fallback = 0) {
  if (val === undefined || val === null) return fallback;
  const str = String(val).trim().replace(',', '.');
  if (str === '') return fallback;
  const num = parseFloat(str);
  return isNaN(num) ? fallback : num;
}

export function sanitizeDecimalInput(inputEl, callback) {
  if (!inputEl) return;
  inputEl.addEventListener('input', (e) => {
    const orig = e.target.value;
    let cleaned = orig.replace(/[^0-9.,]/g, '');
    const match = cleaned.match(/[.,]/);
    if (match) {
      const firstIndex = match.index;
      const sep = match[0];
      const before = cleaned.slice(0, firstIndex);
      const after = cleaned.slice(firstIndex + 1).replace(/[.,]/g, '');
      cleaned = before + sep + after;
    }
    if (cleaned !== orig) {
      e.target.value = cleaned;
    }
    if (callback) callback();
  });
}

// Modal Management
export function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.classList.add('modal-open');
}

export function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  if (!document.querySelector('.modal-backdrop.active')) {
    document.body.classList.remove('modal-open');
  }
}

export function setupModalDismissListeners(container = document) {
  // Close buttons with [data-close="modal-id"]
  container.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        closeModal(targetModal);
      }
    });
  });

  // Click outside on backdrop to close
  container.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
}

// Escape key listener (registered once on window)
let escapeListenerInitialized = false;
export function initGlobalKeyboardShortcuts() {
  if (escapeListenerInitialized) return;
  escapeListenerInitialized = true;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

// Toast Notifications
let toastTimer = null;
export function showToast(message, type = 'info') {
  if (!message) return;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  container.innerHTML = '';
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;

  let icon = '✨';
  if (type === 'success') icon = '✓';
  else if (type === 'warning') icon = '⚠️';
  else if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 250);
  }, 2200);
}
