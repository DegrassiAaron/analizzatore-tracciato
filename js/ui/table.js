/**
 * Table UI Module
 *
 * Handles documents table rendering and selection
 */

import { documentsData, selectedDocs } from '../core/state.js';
import * as dom from './dom.js';
import { formatTableValue, formatDateForTable } from '../utils/utils.js';

/**
 * Render documents table
 * @param {Map} dataSource - Optional data source (defaults to documentsData)
 */
export function renderDocumentsTable(dataSource = null) {
    dom.tableBody.innerHTML = '';
    const dataToRender = dataSource || documentsData;

    dataToRender.forEach((doc, key) => {
        const row = document.createElement('tr');
        const blockTypes = Object.keys(doc.blocks);

        const linesDisplay = doc.linesTruncated
            ? `${doc.totalLinesProcessed} <span style="color:#4ec9b0;" title="Ottimizzato: solo ${doc.lines.length} righe in memoria. Tutte le righe disponibili per analisi e download.">💾</span>`
            : doc.totalLinesProcessed;

        row.innerHTML = `
            <td>
                <input type="checkbox" class="checkbox doc-checkbox" data-key="${key}" onchange="updateSelection()">
            </td>
            <td>${formatTableValue(doc.header.codCompagnia)}</td>
            <td>${formatTableValue(doc.header.numContratto)}</td>
            <td>${formatTableValue(doc.header.prgContratto)}</td>
            <td>${formatTableValue(doc.codProdotto)}</td>
            <td>${formatTableValue(doc.numDocumento)}</td>
            <td>${formatTableValue(doc.tipDocumento)}</td>
            <td>${formatDateForTable(doc.header.datRiferimento)}</td>
            <td>${blockTypes.join(', ') || 'Nessuno'}</td>
            <td>${linesDisplay}</td>
            <td>
                <button class="btn btn-small" onclick="openAnalysis('${key}')">
                    📊 Analisi
                </button>
            </td>
        `;
        dom.tableBody.appendChild(row);
    });
}

/**
 * Toggle select all checkboxes
 */
export function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.doc-checkbox');
    const isChecked = dom.selectAllCheckbox.checked;

    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        const key = cb.dataset.key;
        if (isChecked) {
            selectedDocs.add(key);
            cb.closest('tr').classList.add('selected');
        } else {
            selectedDocs.delete(key);
            cb.closest('tr').classList.remove('selected');
        }
    });

    updateSelection();
}

/**
 * Select all documents
 */
export function selectAll() {
    dom.selectAllCheckbox.checked = true;
    toggleSelectAll();
}

/**
 * Deselect all documents
 */
export function deselectAll() {
    dom.selectAllCheckbox.checked = false;
    toggleSelectAll();
}

/**
 * Update selection state and UI
 */
export function updateSelection() {
    const checkboxes = document.querySelectorAll('.doc-checkbox');
    selectedDocs.clear();

    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedDocs.add(cb.dataset.key);
            cb.closest('tr').classList.add('selected');
        } else {
            cb.closest('tr').classList.remove('selected');
        }
    });

    const count = selectedDocs.size;
    dom.selectionInfo.textContent = count === 0
        ? 'Nessun tracciato selezionato'
        : `${count} tracciato${count > 1 ? 'i' : ''} selezionato${count > 1 ? 'i' : ''}`;
    dom.downloadSelectedBtn.disabled = count === 0;
    dom.downloadSelectedSingleBtn.disabled = count === 0;

    if (count > 10) {
        dom.warningBanner.classList.add('show');
    } else {
        dom.warningBanner.classList.remove('show');
    }

    dom.selectAllCheckbox.checked = count === checkboxes.length && count > 0;
}

// Expose functions to window for inline onclick handlers
window.toggleSelectAll = toggleSelectAll;
window.selectAll = selectAll;
window.deselectAll = deselectAll;
window.updateSelection = updateSelection;
