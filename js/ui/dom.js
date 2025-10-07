/**
 * DOM References and Console Logging
 *
 * Centralized DOM element references and logging utilities
 */

// File upload elements
export const uploadArea = document.getElementById('uploadArea');
export const fileInput = document.getElementById('fileInput');
export const fileList = document.getElementById('fileList');
export const processBtn = document.getElementById('processBtn');

// Progress elements
export const progressContainer = document.getElementById('progressContainer');
export const progressFill = document.getElementById('progressFill');

// Statistics elements
export const statsContainer = document.getElementById('statsContainer');
export const stats = document.getElementById('stats');

// Results panel elements
export const resultsPanel = document.getElementById('resultsPanel');
export const tableBody = document.getElementById('tableBody');
export const docCount = document.getElementById('docCount');

// Modal elements
export const analysisModal = document.getElementById('analysisModal');
export const closeModal = document.getElementById('closeModal');
export const modalTitle = document.getElementById('modalTitle');
export const tabs = document.getElementById('tabs');
export const tabsContent = document.getElementById('tabsContent');

// Console elements
export const consolePanel = document.getElementById('consolePanel');
export const consoleEl = document.getElementById('console');
export const detailedLogCheckbox = document.getElementById('detailedLogCheckbox');

// Selection and download elements
export const warningBanner = document.getElementById('warningBanner');
export const selectionInfo = document.getElementById('selectionInfo');
export const downloadSelectedBtn = document.getElementById('downloadSelectedBtn');
export const downloadSelectedSingleBtn = document.getElementById('downloadSelectedSingleBtn');
export const selectAllCheckbox = document.getElementById('selectAllCheckbox');

/**
 * Log message to console panel
 * @param {string} message - Message to log
 * @param {string} type - Message type ('info', 'warning', 'error', 'success')
 * @param {boolean} detailed - If true, only show when detailed log is enabled
 */
export function logToConsole(message, type = 'info', detailed = false) {
    // Skip detailed logs if checkbox is not checked (lazy load checkbox)
    if (detailed) {
        const checkbox = document.getElementById('detailedLogCheckbox');
        if (checkbox && !checkbox.checked) {
            return;
        }
    }

    const time = new Date().toLocaleTimeString('it-IT');
    const line = document.createElement('div');
    line.className = 'console-line';
    line.innerHTML = `<span class="console-time">[${time}]</span><span class="console-${type}">${message}</span>`;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
    consolePanel.style.display = 'flex';
}

/**
 * Clear console log
 */
export function clearConsole() {
    consoleEl.innerHTML = '';
}

// Expose clearConsole to window for inline onclick handlers
window.clearConsole = clearConsole;
