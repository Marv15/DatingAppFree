// Safe Backup & Restore Component
// Handles JSON export download, clipboard copying, and schema-validated file restoration.

import { storage } from '../services/storage.js';
import { t } from '../services/i18n.js';
import { showToast, closeModal } from '../utils/dom.js';

export function exportBackup() {
  const jsonStr = storage.exportDataAsJSON();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const nowStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dating-free-backup-${nowStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyBackupToClipboard() {
  try {
    const jsonStr = storage.exportDataAsJSON();
    await navigator.clipboard.writeText(jsonStr);
    showToast(t('backup_copied_alert'), 'success');
  } catch (_) {
    showToast(t('backup_copy_fail_alert'), 'warning');
  }
}

export function handleFileRestore(file, onRestoreSuccess) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    const result = storage.importDataFromJSON(content);

    if (result.success) {
      if (onRestoreSuccess) onRestoreSuccess();
      const modalSettings = document.getElementById('modal-settings');
      if (modalSettings) closeModal(modalSettings);
      showToast(t('backup_restored_alert', { count: result.count }), 'success');
    } else {
      showToast(t('backup_restore_error_alert', { error: result.error }), 'warning');
    }
  };
  reader.readAsText(file);
}

export function setupBackupListeners(onRestoreSuccess) {
  const btnExport = document.getElementById('btn-export-backup');
  if (btnExport) {
    btnExport.addEventListener('click', exportBackup);
  }

  const btnCopy = document.getElementById('btn-copy-backup');
  if (btnCopy) {
    btnCopy.addEventListener('click', copyBackupToClipboard);
  }

  const btnRestore = document.getElementById('btn-restore-backup');
  const fileImport = document.getElementById('file-import-backup');

  if (btnRestore && fileImport) {
    btnRestore.addEventListener('click', () => {
      fileImport.click();
    });

    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      handleFileRestore(file, onRestoreSuccess);
      fileImport.value = '';
    });
  }
}
