/**
 * Filters UI Module
 *
 * Handles document filtering functionality with live filtering
 */

import { documentsData, filteredDocuments } from '../core/state.js';
import { formatDateFromHeader } from '../utils/utils.js';
import { renderDocumentsTable } from './table.js';
import { logToConsole } from './dom.js';

// Debounce timer for text input filters
let debounceTimer = null;

/**
 * Debounce function to limit filter execution rate
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
function debounce(func, delay = 300) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

/**
 * Initialize live filter event listeners
 */
export function initLiveFilters() {
    // Text inputs with debouncing
    const textInputs = [
        'filterCompagnia',
        'filterContratto',
        'filterDocumento',
        'filterTipoDoc',
        'filterProdotto'
    ];

    textInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                debounce(() => applyFilters(true));
            });
        }
    });

    // Date inputs (no debouncing needed)
    const dateInputs = ['filterData1', 'filterData2'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', () => applyFilters(true));
        }
    });

    // Date filter type selector
    const dateTypeSelect = document.getElementById('filterDataTipo');
    if (dateTypeSelect) {
        dateTypeSelect.addEventListener('change', () => {
            toggleDateFields();
            applyFilters(true);
        });
    }
}

/**
 * Toggle date filter fields based on selected type
 */
export function toggleDateFields() {
    const tipoFiltro = document.getElementById('filterDataTipo').value;
    const dateFieldsContainer = document.getElementById('dateFieldsContainer');
    const dataField1Container = document.getElementById('dataField1Container');
    const dataField2Container = document.getElementById('dataField2Container');
    const dataField1Label = document.getElementById('dataField1Label');

    if (!tipoFiltro) {
        dateFieldsContainer.style.display = 'none';
        return;
    }

    dateFieldsContainer.style.display = 'block';

    // Configure fields based on filter type
    switch (tipoFiltro) {
        case 'esatta':
            dataField1Label.textContent = 'Data';
            dataField2Container.style.display = 'none';
            break;
        case 'prima':
            dataField1Label.textContent = 'Prima di';
            dataField2Container.style.display = 'none';
            break;
        case 'dopo':
            dataField1Label.textContent = 'Dopo';
            dataField2Container.style.display = 'none';
            break;
        case 'intervallo':
            dataField1Label.textContent = 'Data Inizio';
            dataField2Container.style.display = 'block';
            break;
    }
}

/**
 * Parse date from HTML5 datepicker (yyyy-MM-dd format)
 * @param {string} dateStr - Date string from datepicker
 * @returns {Date|null} Parsed Date object or null if invalid
 */
function parseDateFromPicker(dateStr) {
    if (!dateStr) return null;

    // HTML5 date input returns yyyy-MM-dd format
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    return new Date(year, month, day);
}

/**
 * Check if document matches date filter
 * @param {Object} doc - Document data
 * @returns {boolean} True if matches filter
 */
function matchesDateFilter(doc) {
    const tipoFiltro = document.getElementById('filterDataTipo').value;
    if (!tipoFiltro) return true;

    const data1Str = document.getElementById('filterData1').value.trim();
    if (!data1Str) return true;

    const data1 = parseDateFromPicker(data1Str);
    if (!data1) return true;

    const docDateStr = doc.header.datRiferimento;
    const docDate = formatDateFromHeader(docDateStr);
    if (!docDate) return true;

    // Reset time to compare only dates
    data1.setHours(0, 0, 0, 0);
    docDate.setHours(0, 0, 0, 0);

    switch (tipoFiltro) {
        case 'esatta':
            return docDate.getTime() === data1.getTime();
        case 'prima':
            return docDate.getTime() < data1.getTime();
        case 'dopo':
            return docDate.getTime() > data1.getTime();
        case 'intervallo':
            const data2Str = document.getElementById('filterData2').value.trim();
            if (!data2Str) return true;
            const data2 = parseDateFromPicker(data2Str);
            if (!data2) return true;
            data2.setHours(0, 0, 0, 0);
            return docDate.getTime() >= data1.getTime() && docDate.getTime() <= data2.getTime();
        default:
            return true;
    }
}

/**
 * Apply filters to documents
 * @param {boolean} silent - If true, don't log to console
 */
export function applyFilters(silent = false) {
    const filterCompagnia = document.getElementById('filterCompagnia').value.trim().toLowerCase();
    const filterContratto = document.getElementById('filterContratto').value.trim().toLowerCase();
    const filterDocumento = document.getElementById('filterDocumento').value.trim().toLowerCase();
    const filterTipoDoc = document.getElementById('filterTipoDoc').value.trim().toLowerCase();
    const filterProdotto = document.getElementById('filterProdotto').value.trim().toLowerCase();

    // Check if any filter is active
    const hasActiveFilters = filterCompagnia || filterContratto || filterDocumento ||
                            filterTipoDoc || filterProdotto ||
                            document.getElementById('filterDataTipo').value;

    // If no filters active, show all documents
    if (!hasActiveFilters) {
        filteredDocuments.clear();
        renderDocumentsTable();
        document.getElementById('filterResultCount').textContent = '';
        return;
    }

    filteredDocuments.clear();

    // Filter documents
    documentsData.forEach((doc, key) => {
        let matches = true;

        // Check text filters
        if (filterCompagnia && !doc.header.codCompagnia.toLowerCase().includes(filterCompagnia)) {
            matches = false;
        }
        if (filterContratto && !doc.header.numContratto.toLowerCase().includes(filterContratto)) {
            matches = false;
        }
        if (filterDocumento && !doc.numDocumento.toLowerCase().includes(filterDocumento)) {
            matches = false;
        }
        if (filterTipoDoc && !doc.tipDocumento.toLowerCase().includes(filterTipoDoc)) {
            matches = false;
        }
        if (filterProdotto && !doc.codProdotto.toLowerCase().includes(filterProdotto)) {
            matches = false;
        }

        // Check date filter
        if (matches && !matchesDateFilter(doc)) {
            matches = false;
        }

        if (matches) {
            filteredDocuments.set(key, doc);
        }
    });

    // Render filtered results
    renderDocumentsTable(filteredDocuments);

    // Update result count
    const resultCount = filteredDocuments.size;
    const totalCount = documentsData.size;
    const filterResultCount = document.getElementById('filterResultCount');
    filterResultCount.textContent = `${resultCount} di ${totalCount} documenti`;
    filterResultCount.style.color = resultCount === 0 ? '#f48771' : '#4ec9b0';

    if (!silent) {
        logToConsole(`✓ Filtri applicati: ${resultCount} di ${totalCount} documenti`, 'success');
    }
}

/**
 * Clear all filters
 */
export function clearFilters() {
    // Clear all filter inputs
    document.getElementById('filterCompagnia').value = '';
    document.getElementById('filterContratto').value = '';
    document.getElementById('filterDocumento').value = '';
    document.getElementById('filterTipoDoc').value = '';
    document.getElementById('filterProdotto').value = '';
    document.getElementById('filterDataTipo').value = '';
    document.getElementById('filterData1').value = '';
    document.getElementById('filterData2').value = '';

    // Hide date fields
    document.getElementById('dateFieldsContainer').style.display = 'none';

    // Clear result count
    document.getElementById('filterResultCount').textContent = '';

    // Clear filtered data and render all documents
    filteredDocuments.clear();
    renderDocumentsTable();

    logToConsole('✓ Filtri rimossi', 'success');
}

// Expose to window
window.toggleDateFields = toggleDateFields;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.initLiveFilters = initLiveFilters;
