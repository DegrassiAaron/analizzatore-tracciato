/**
 * Modal UI Module
 *
 * Handles analysis modal display and block data visualization with:
 * - Tab-based navigation (Dati Tracciato, per-block tabs)
 * - Interactive block tables (sortable, filterable, column management)
 * - On-demand complete line loading for truncated documents
 * - Pagination and drag-and-drop column reordering
 */

import { documentsData, sourceFiles } from '../core/state.js';
import { MAX_LINES_PER_DOC } from '../config/config.js';
import { extractHeaderData } from '../core/parser.js';
import * as dom from './dom.js';
import { logToConsole } from './dom.js';
import { formatTableValue } from '../utils/utils.js';

/**
 * Load complete document lines from source file (for truncated documents)
 * @param {Object} doc - Document object
 * @param {string} docKey - Document key
 * @returns {Array<string>} Complete lines
 */
async function loadCompleteDocumentLines(doc, docKey) {
    // If not truncated, return existing lines
    if (!doc.linesTruncated) {
        return doc.lines;
    }

    // Reload complete lines from source file
    logToConsole(`📥 Caricamento righe complete per documento ${docKey}...`, 'info');

    const file = sourceFiles.get(doc.sourceFile);
    if (!file) {
        logToConsole(`✗ File sorgente non trovato: ${doc.sourceFile}`, 'error');
        return doc.lines;
    }

    const allLines = [];
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
    const fileSize = file.size;
    let offset = 0;
    let leftover = '';

    while (offset < fileSize) {
        const chunk = file.slice(offset, offset + CHUNK_SIZE);
        const text = await chunk.text();
        const fullText = leftover + text;
        const lines = fullText.split('\n');

        if (offset + CHUNK_SIZE < fileSize) {
            leftover = lines.pop() || '';
        } else {
            leftover = '';
        }

        // Filter lines belonging to this document
        lines.forEach(line => {
            if (line.trim().length === 0) return;
            const header = extractHeaderData(line);
            if (header) {
                const lineKey = `${header.codCompagnia}-${header.numContratto}-${header.prgContratto}`;
                if (lineKey === docKey) {
                    allLines.push(line);
                }
            }
        });

        offset += CHUNK_SIZE;
    }

    logToConsole(`✓ Caricate ${allLines.length} righe complete`, 'success');
    return allLines;
}

/**
 * Create "Dati Tracciato" tab content (general info + all blocks with accordion)
 * @param {Object} doc - Document data
 */
function createDatiTracciatoTab(doc) {
    const content = document.createElement('div');
    content.className = 'tab-content active';

    const truncationWarning = doc.linesTruncated ? `
        <div class="warning-banner show" style="margin-bottom:15px;">
            <div class="warning-icon">ℹ️</div>
            <div class="warning-text">
                <div class="warning-title">Ottimizzazione memoria</div>
                <div class="warning-desc">Questo documento ha ${doc.totalLinesProcessed} righe ma solo ${doc.lines.length} sono salvate in memoria (limite: ${MAX_LINES_PER_DOC}). I dati dei blocchi sono completi e le righe complete sono disponibili per analisi e download.</div>
            </div>
        </div>
    ` : '';

    // General info section
    let html = `
        <h3 style="color:#4ec9b0;margin-bottom:15px;">Informazioni Generali</h3>
        ${truncationWarning}
        <table style="margin-bottom:25px;">
            <tr><td style="font-weight:600;">Identificativo</td><td>${doc.header.identificativo}</td></tr>
            <tr><td style="font-weight:600;">Codice Compagnia</td><td>${doc.header.codCompagnia}</td></tr>
            <tr><td style="font-weight:600;">Numero Contratto</td><td>${doc.header.numContratto}</td></tr>
            <tr><td style="font-weight:600;">Progressivo Contratto</td><td>${doc.header.prgContratto}</td></tr>
            <tr><td style="font-weight:600;">Numero Documento</td><td>${doc.header.numDocumento}</td></tr>
            <tr><td style="font-weight:600;">Tipo Documento</td><td>${doc.header.tipDocumento}</td></tr>
            <tr><td style="font-weight:600;">Codice Prodotto</td><td>${doc.header.codProdotto}</td></tr>
            <tr><td style="font-weight:600;">Data 1</td><td>${doc.header.data1}</td></tr>
            <tr><td style="font-weight:600;">Data 2</td><td>${doc.header.data2}</td></tr>
            <tr><td style="font-weight:600;">Data Riferimento</td><td>${doc.header.datRiferimento}</td></tr>
            <tr><td style="font-weight:600;">Righe Processate</td><td>${doc.totalLinesProcessed}</td></tr>
            <tr><td style="font-weight:600;">Righe Salvate</td><td>${doc.lines.length}${doc.linesTruncated ? ' <span style="color:#dcdcaa;">⚠️ Troncate</span>' : ''}</td></tr>
            <tr><td style="font-weight:600;">Blocchi Trovati</td><td>${Object.keys(doc.blocks).join(', ')}</td></tr>
            <tr><td style="font-weight:600;">File Sorgente</td><td>${doc.sourceFile}</td></tr>
        </table>

        <h3 style="color:#4ec9b0;margin-bottom:15px;margin-top:25px;">Blocchi Dati</h3>
    `;

    content.innerHTML = html;

    // Add all block tables with accordion
    Object.keys(doc.blocks).forEach(blockId => {
        const blockContainer = document.createElement('div');
        blockContainer.style.marginBottom = '10px';
        createBlockAccordion(blockId, doc.blocks[blockId], blockContainer);
        content.appendChild(blockContainer);
    });

    dom.tabsContent.appendChild(content);
}

/**
 * Create accordion block section
 * @param {string} blockId - Block identifier
 * @param {Array<Object>} blockData - Block data rows
 * @param {HTMLElement} container - Container element
 */
function createBlockAccordion(blockId, blockData, container) {
    if (!blockData || blockData.length === 0) {
        container.innerHTML = `
            <div class="block-section">
                <div class="block-header" style="cursor:default;">
                    <div class="block-title">Blocco ${blockId} (0 righe)</div>
                </div>
            </div>
        `;
        return;
    }

    const fields = Object.keys(blockData[0]);
    const stateKey = `blockState_${blockId}_accordion`;
    const accordionId = `accordion_${blockId}`;
    const tableContainerId = `table_${blockId}`;

    // State for this specific block
    const state = {
        hiddenColumns: new Set(),
        sortColumn: null,
        sortDirection: 'asc',
        currentPage: 0,
        rowsPerPage: 10,
        columnOrder: [...fields],
        draggedColumnIndex: null,
        isExpanded: false,
        columnFilters: {} // New: filters for each column
    };

    function toggleAccordion() {
        state.isExpanded = !state.isExpanded;
        const body = document.getElementById(accordionId);
        const header = document.getElementById(`accordion_header_${blockId}`);
        const icon = header ? header.querySelector('.accordion-icon') : null;

        if (!body) {
            console.error(`Body not found: ${accordionId}`);
            return;
        }
        if (!icon) {
            console.error(`Icon not found for blockId: ${blockId}`);
            return;
        }

        if (state.isExpanded) {
            body.style.display = 'block';
            icon.textContent = '▼';
        } else {
            body.style.display = 'none';
            icon.textContent = '▶';
        }
    }

    function applyFilters(data) {
        return data.filter(row => {
            return Object.keys(state.columnFilters).every(field => {
                const filterValue = state.columnFilters[field];
                if (!filterValue) return true;
                const cellValue = (row[field] || '').toString().toLowerCase();
                return cellValue.includes(filterValue.toLowerCase());
            });
        });
    }

    function renderTable() {
        // Save focus state before re-rendering
        const activeElement = document.activeElement;
        let focusedField = null;
        let cursorPosition = null;

        if (activeElement && activeElement.tagName === 'INPUT' && activeElement.placeholder === '🔍 Filtra...') {
            const filterInputs = Array.from(document.querySelectorAll(`#${tableContainerId} .filter-row input`));
            const activeIndex = filterInputs.indexOf(activeElement);
            if (activeIndex !== -1) {
                const visibleCols = state.columnOrder.filter(f => !state.hiddenColumns.has(f));
                focusedField = visibleCols[activeIndex];
                cursorPosition = activeElement.selectionStart;
            }
        }

        const visibleColumns = state.columnOrder.filter(f => !state.hiddenColumns.has(f));

        // Apply filters first
        let filteredData = applyFilters([...blockData]);

        // Then apply sorting
        if (state.sortColumn) {
            filteredData.sort((a, b) => {
                const valA = a[state.sortColumn] || '';
                const valB = b[state.sortColumn] || '';
                const comparison = valA.localeCompare(valB);
                return state.sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        // Handle "all" case
        const effectiveRowsPerPage = state.rowsPerPage === -1 ? filteredData.length : state.rowsPerPage;
        const totalPages = state.rowsPerPage === -1 ? 1 : Math.ceil(filteredData.length / state.rowsPerPage);
        const startIdx = state.currentPage * effectiveRowsPerPage;
        const endIdx = Math.min(startIdx + effectiveRowsPerPage, filteredData.length);
        const pageData = filteredData.slice(startIdx, endIdx);

        // Update only the table container, not the whole block
        const tableContainer = document.getElementById(tableContainerId);
        if (!tableContainer) {
            console.error(`Table container not found: ${tableContainerId}`);
            return;
        }

        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        ${visibleColumns.map((field, idx) => `
                            <th draggable="true"
                                ondragstart="window.blockStates['${stateKey}'].dragStart(event, ${idx})"
                                ondragover="window.blockStates['${stateKey}'].dragOver(event)"
                                ondrop="window.blockStates['${stateKey}'].drop(event, ${idx})"
                                style="cursor:move;user-select:none;"
                                onclick="window.blockStates['${stateKey}'].sortByColumn('${field}')">
                                ${field} ${state.sortColumn === field ? (state.sortDirection === 'asc' ? '▲' : '▼') : ''}
                            </th>
                        `).join('')}
                    </tr>
                    <tr class="filter-row">
                        ${visibleColumns.map(field => `
                            <th>
                                <input type="text"
                                    placeholder="🔍 Filtra..."
                                    value="${state.columnFilters[field] || ''}"
                                    oninput="window.blockStates['${stateKey}'].setFilter('${field}', this.value)"
                                    onclick="event.stopPropagation()"
                                    style="width:100%;padding:4px;background:#1e1e1e;border:1px solid #3e3e42;color:#cccccc;font-size:11px;border-radius:3px;">
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${pageData.length > 0 ? pageData.map(row => `
                        <tr>
                            ${visibleColumns.map(field => `<td>${formatTableValue(row[field])}</td>`).join('')}
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="${visibleColumns.length}" style="text-align:center;color:#858585;padding:20px;">
                                Nessun risultato trovato
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
            <div class="pagination">
                <button ${state.currentPage === 0 ? 'disabled' : ''} onclick="window.blockStates['${stateKey}'].prevPage()">← Precedente</button>
                <span>Pagina ${state.currentPage + 1} di ${Math.max(1, totalPages)} (${filteredData.length} righe)</span>
                <button ${state.currentPage >= totalPages - 1 ? 'disabled' : ''} onclick="window.blockStates['${stateKey}'].nextPage()">Successiva →</button>
                <span style="margin-left:15px;">
                    Righe per pagina:
                    <select onchange="window.blockStates['${stateKey}'].changeRowsPerPage(this.value)" style="padding:5px;background:#1e1e1e;border:1px solid #3e3e42;color:#cccccc;border-radius:3px;margin-left:5px;">
                        <option value="10" ${state.rowsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="25" ${state.rowsPerPage === 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${state.rowsPerPage === 50 ? 'selected' : ''}>50</option>
                        <option value="-1" ${state.rowsPerPage === -1 ? 'selected' : ''}>Tutti</option>
                    </select>
                </span>
            </div>
        `;

        // Restore focus after re-rendering
        if (focusedField) {
            setTimeout(() => {
                const filterInputs = Array.from(document.querySelectorAll(`#${tableContainerId} .filter-row input`));
                const newVisibleCols = state.columnOrder.filter(f => !state.hiddenColumns.has(f));
                const focusIndex = newVisibleCols.indexOf(focusedField);
                if (focusIndex !== -1 && filterInputs[focusIndex]) {
                    filterInputs[focusIndex].focus();
                    if (cursorPosition !== null) {
                        filterInputs[focusIndex].setSelectionRange(cursorPosition, cursorPosition);
                    }
                }
            }, 0);
        }
    }

    // Create object with all functions for this block
    const blockFunctions = {
        toggleAccordion: toggleAccordion,

        toggleColumnMenu: function(event) {
            event.stopPropagation();
            const menu = document.getElementById(`columnMenu_${blockId}`);
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        },

        toggleColumn: function(field) {
            if (state.hiddenColumns.has(field)) {
                state.hiddenColumns.delete(field);
            } else {
                state.hiddenColumns.add(field);
            }
            renderTable();
        },

        setFilter: function(field, value) {
            if (value && value.trim()) {
                state.columnFilters[field] = value.trim();
            } else {
                delete state.columnFilters[field];
            }
            state.currentPage = 0; // Reset to first page when filtering
            renderTable();
        },

        resetColumns: function() {
            state.hiddenColumns.clear();
            state.columnOrder = [...fields];
            state.sortColumn = null;
            state.sortDirection = 'asc';
            state.currentPage = 0;
            state.columnFilters = {};
            renderTable();
        },

        sortByColumn: function(field) {
            if (state.sortColumn === field) {
                state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortColumn = field;
                state.sortDirection = 'asc';
            }
            renderTable();
        },

        nextPage: function() {
            const filteredData = applyFilters([...blockData]);
            const effectiveRowsPerPage = state.rowsPerPage === -1 ? filteredData.length : state.rowsPerPage;
            const totalPages = state.rowsPerPage === -1 ? 1 : Math.ceil(filteredData.length / state.rowsPerPage);
            if (state.currentPage < totalPages - 1) {
                state.currentPage++;
                renderTable();
            }
        },

        prevPage: function() {
            if (state.currentPage > 0) {
                state.currentPage--;
                renderTable();
            }
        },

        changeRowsPerPage: function(value) {
            state.rowsPerPage = parseInt(value, 10);
            state.currentPage = 0; // Reset to first page
            renderTable();
        },

        dragStart: function(event, index) {
            state.draggedColumnIndex = index;
            event.dataTransfer.effectAllowed = 'move';
        },

        dragOver: function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        },

        drop: function(event, targetIndex) {
            event.preventDefault();
            if (state.draggedColumnIndex === null || state.draggedColumnIndex === targetIndex) return;

            const visibleColumns = state.columnOrder.filter(f => !state.hiddenColumns.has(f));
            const draggedField = visibleColumns[state.draggedColumnIndex];
            const targetField = visibleColumns[targetIndex];

            const draggedOriginalIdx = state.columnOrder.indexOf(draggedField);
            const targetOriginalIdx = state.columnOrder.indexOf(targetField);

            state.columnOrder.splice(draggedOriginalIdx, 1);
            const newTargetIdx = state.columnOrder.indexOf(targetField);
            state.columnOrder.splice(targetOriginalIdx > draggedOriginalIdx ? newTargetIdx + 1 : newTargetIdx, 0, draggedField);

            state.draggedColumnIndex = null;
            renderTable();
        }
    };

    // Save functions globally for this block
    if (!window.blockStates) window.blockStates = {};
    window.blockStates[stateKey] = blockFunctions;

    // Create static accordion structure (won't be recreated)
    container.innerHTML = `
        <div class="block-section">
            <div id="accordion_header_${blockId}" class="block-header" onclick="window.blockStates['${stateKey}'].toggleAccordion()" style="cursor:pointer;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span class="accordion-icon">▶</span>
                    <div class="block-title">Blocco ${blockId} (${blockData.length} righe)</div>
                </div>
                <div style="display:flex;gap:10px;position:relative;" onclick="event.stopPropagation();">
                    <button class="btn btn-small" onclick="window.blockStates['${stateKey}'].toggleColumnMenu(event)">☰ Colonne</button>
                    <button class="btn btn-small" onclick="window.blockStates['${stateKey}'].resetColumns()">🔄 Reset</button>
                    <div id="columnMenu_${blockId}" style="display:none;position:absolute;background:#323233;border:1px solid #3e3e42;border-radius:4px;padding:10px;z-index:100;max-height:300px;overflow-y:auto;right:0;top:35px;">
                        ${fields.map(field => `
                            <label style="display:block;padding:5px;cursor:pointer;font-size:11px;white-space:nowrap;">
                                <input type="checkbox" ${state.hiddenColumns.has(field) ? '' : 'checked'} onchange="window.blockStates['${stateKey}'].toggleColumn('${field}')" style="margin-right:5px;">
                                ${field}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div id="${accordionId}" class="block-body" style="display:none;">
                <div id="${tableContainerId}">
                    <!-- Table content will be rendered here -->
                </div>
            </div>
        </div>
    `;

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            const menu = document.getElementById(`columnMenu_${blockId}`);
            if (menu && !menu.contains(e.target) && !e.target.closest('.btn-small')) {
                menu.style.display = 'none';
            }
        });
    }, 100);

    // Initial render (wait for DOM to be ready)
    setTimeout(() => renderTable(), 0);
}

/**
 * Create block tab content with interactive table
 * @param {string} blockId - Block identifier
 * @param {Array<Object>} blockData - Block data rows
 */
function createBlockTab(blockId, blockData) {
    if (!blockData || blockData.length === 0) {
        dom.tabsContent.innerHTML = '<div style="text-align:center;padding:60px;color:#666;">Nessun dato disponibile per questo blocco</div>';
        return;
    }

    const content = document.createElement('div');
    content.className = 'tab-content active';

    const fields = Object.keys(blockData[0]);
    const stateKey = `blockState_${blockId}`;

    // State for this specific block
    const state = {
        hiddenColumns: new Set(),
        sortColumn: null,
        sortDirection: 'asc',
        currentPage: 0,
        rowsPerPage: 10,
        columnOrder: [...fields],
        draggedColumnIndex: null
    };

    function renderTable() {
        const visibleColumns = state.columnOrder.filter(f => !state.hiddenColumns.has(f));

        let sortedData = [...blockData];
        if (state.sortColumn) {
            sortedData.sort((a, b) => {
                const valA = a[state.sortColumn] || '';
                const valB = b[state.sortColumn] || '';
                const comparison = valA.localeCompare(valB);
                return state.sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        // Handle "all" case
        const effectiveRowsPerPage = state.rowsPerPage === -1 ? sortedData.length : state.rowsPerPage;
        const totalPages = state.rowsPerPage === -1 ? 1 : Math.ceil(sortedData.length / state.rowsPerPage);
        const startIdx = state.currentPage * effectiveRowsPerPage;
        const endIdx = Math.min(startIdx + effectiveRowsPerPage, sortedData.length);
        const pageData = sortedData.slice(startIdx, endIdx);

        let tableHTML = `
            <div class="block-section">
                <div class="block-header">
                    <div class="block-title">Blocco ${blockId} (${blockData.length} righe)</div>
                    <div style="display:flex;gap:10px;position:relative;">
                        <button class="btn btn-small" onclick="window.blockStates['${stateKey}'].toggleColumnMenu(event)">☰ Colonne</button>
                        <button class="btn btn-small" onclick="window.blockStates['${stateKey}'].resetColumns()">🔄 Reset</button>
                        <div id="columnMenu_${blockId}" style="display:none;position:absolute;background:#323233;border:1px solid #3e3e42;border-radius:4px;padding:10px;z-index:100;max-height:300px;overflow-y:auto;right:0;top:35px;">
                            ${fields.map(field => `
                                <label style="display:block;padding:5px;cursor:pointer;font-size:11px;white-space:nowrap;">
                                    <input type="checkbox" ${state.hiddenColumns.has(field) ? '' : 'checked'} onchange="window.blockStates['${stateKey}'].toggleColumn('${field}')" style="margin-right:5px;">
                                    ${field}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="block-body">
                    <table>
                        <thead>
                            <tr>
                                ${visibleColumns.map((field, idx) => `
                                    <th draggable="true"
                                        ondragstart="window.blockStates['${stateKey}'].dragStart(event, ${idx})"
                                        ondragover="window.blockStates['${stateKey}'].dragOver(event)"
                                        ondrop="window.blockStates['${stateKey}'].drop(event, ${idx})"
                                        style="cursor:move;user-select:none;"
                                        onclick="window.blockStates['${stateKey}'].sortByColumn('${field}')">
                                        ${field} ${state.sortColumn === field ? (state.sortDirection === 'asc' ? '▲' : '▼') : ''}
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${pageData.map(row => `
                                <tr>
                                    ${visibleColumns.map(field => `<td>${row[field] || '-'}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="pagination">
                    <button ${state.currentPage === 0 ? 'disabled' : ''} onclick="window.blockStates['${stateKey}'].prevPage()">← Precedente</button>
                    <span>Pagina ${state.currentPage + 1} di ${totalPages} (${sortedData.length} righe)</span>
                    <button ${state.currentPage >= totalPages - 1 ? 'disabled' : ''} onclick="window.blockStates['${stateKey}'].nextPage()">Successiva →</button>
                    <span style="margin-left:15px;">
                        Righe per pagina:
                        <select onchange="window.blockStates['${stateKey}'].changeRowsPerPage(this.value)" style="padding:5px;background:#1e1e1e;border:1px solid #3e3e42;color:#cccccc;border-radius:3px;margin-left:5px;">
                            <option value="10" ${state.rowsPerPage === 10 ? 'selected' : ''}>10</option>
                            <option value="25" ${state.rowsPerPage === 25 ? 'selected' : ''}>25</option>
                            <option value="50" ${state.rowsPerPage === 50 ? 'selected' : ''}>50</option>
                            <option value="-1" ${state.rowsPerPage === -1 ? 'selected' : ''}>Tutti</option>
                        </select>
                    </span>
                </div>
            </div>
        `;

        content.innerHTML = tableHTML;
    }

    // Create object with all functions for this block
    const blockFunctions = {
        toggleColumnMenu: function(event) {
            event.stopPropagation();
            const menu = document.getElementById(`columnMenu_${blockId}`);
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        },

        toggleColumn: function(field) {
            if (state.hiddenColumns.has(field)) {
                state.hiddenColumns.delete(field);
            } else {
                state.hiddenColumns.add(field);
            }
            renderTable();
        },

        resetColumns: function() {
            state.hiddenColumns.clear();
            state.columnOrder = [...fields];
            state.sortColumn = null;
            state.sortDirection = 'asc';
            state.currentPage = 0;
            renderTable();
        },

        sortByColumn: function(field) {
            if (state.sortColumn === field) {
                state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortColumn = field;
                state.sortDirection = 'asc';
            }
            renderTable();
        },

        nextPage: function() {
            const effectiveRowsPerPage = state.rowsPerPage === -1 ? blockData.length : state.rowsPerPage;
            const totalPages = state.rowsPerPage === -1 ? 1 : Math.ceil(blockData.length / state.rowsPerPage);
            if (state.currentPage < totalPages - 1) {
                state.currentPage++;
                renderTable();
            }
        },

        prevPage: function() {
            if (state.currentPage > 0) {
                state.currentPage--;
                renderTable();
            }
        },

        changeRowsPerPage: function(value) {
            state.rowsPerPage = parseInt(value, 10);
            state.currentPage = 0; // Reset to first page
            renderTable();
        },

        dragStart: function(event, index) {
            state.draggedColumnIndex = index;
            event.dataTransfer.effectAllowed = 'move';
        },

        dragOver: function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        },

        drop: function(event, targetIndex) {
            event.preventDefault();
            if (state.draggedColumnIndex === null || state.draggedColumnIndex === targetIndex) return;

            const visibleColumns = state.columnOrder.filter(f => !state.hiddenColumns.has(f));
            const draggedField = visibleColumns[state.draggedColumnIndex];
            const targetField = visibleColumns[targetIndex];

            const draggedOriginalIdx = state.columnOrder.indexOf(draggedField);
            const targetOriginalIdx = state.columnOrder.indexOf(targetField);

            state.columnOrder.splice(draggedOriginalIdx, 1);
            const newTargetIdx = state.columnOrder.indexOf(targetField);
            state.columnOrder.splice(targetOriginalIdx > draggedOriginalIdx ? newTargetIdx + 1 : newTargetIdx, 0, draggedField);

            state.draggedColumnIndex = null;
            renderTable();
        }
    };

    // Save functions globally for this block
    if (!window.blockStates) window.blockStates = {};
    window.blockStates[stateKey] = blockFunctions;

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            const menu = document.getElementById(`columnMenu_${blockId}`);
            if (menu && !menu.contains(e.target) && !e.target.closest('.btn-small')) {
                menu.style.display = 'none';
            }
        });
    }, 100);

    renderTable();
    dom.tabsContent.appendChild(content);
}

/**
 * Create "Dati Contratto" tab (stub for future implementation)
 * @param {Object} doc - Document data
 */
function createDatiContrattoTab(doc) {
    dom.tabsContent.innerHTML = `
        <div class="tab-content active" style="text-align:center;padding:60px;color:#858585;">
            <h3 style="color:#4ec9b0;margin-bottom:15px;">Dati Contratto</h3>
            <p>Questa sezione verrà implementata successivamente</p>
        </div>
    `;
}

/**
 * Create "Dati Schede" tab (stub for future implementation)
 * @param {Object} doc - Document data
 */
function createDatiSchedeTab(doc) {
    dom.tabsContent.innerHTML = `
        <div class="tab-content active" style="text-align:center;padding:60px;color:#858585;">
            <h3 style="color:#4ec9b0;margin-bottom:15px;">Dati Schede</h3>
            <p>Questa sezione verrà implementata successivamente</p>
        </div>
    `;
}

/**
 * Create "Dati Anagrafici" tab (stub for future implementation)
 * @param {Object} doc - Document data
 */
function createDatiAnagraficiTab(doc) {
    dom.tabsContent.innerHTML = `
        <div class="tab-content active" style="text-align:center;padding:60px;color:#858585;">
            <h3 style="color:#4ec9b0;margin-bottom:15px;">Dati Anagrafici</h3>
            <p>Questa sezione verrà implementata successivamente</p>
        </div>
    `;
}

/**
 * Switch between modal tabs
 * @param {string} tabName - Tab name to switch to
 * @param {Object} doc - Document data
 */
export function switchTab(tabName, doc) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    dom.tabsContent.innerHTML = '';

    switch (tabName) {
        case 'Dati Tracciato':
            createDatiTracciatoTab(doc);
            break;
        case 'Dati Contratto':
            createDatiContrattoTab(doc);
            break;
        case 'Dati Schede':
            createDatiSchedeTab(doc);
            break;
        case 'Dati Anagrafici':
            createDatiAnagraficiTab(doc);
            break;
        default:
            dom.tabsContent.innerHTML = '<div style="text-align:center;padding:60px;color:#666;">Tab non trovata</div>';
    }
}

/**
 * Open analysis modal for a document
 * @param {string} docKey - Document key
 */
export async function openAnalysis(docKey) {
    const doc = documentsData.get(docKey);
    if (!doc) return;

    dom.modalTitle.textContent = `Analisi Tracciato - ${doc.header.numContratto}`;

    // Fixed tabs list
    const tabList = ['Dati Tracciato', 'Dati Contratto', 'Dati Schede', 'Dati Anagrafici'];

    // Show modal with loading if document is truncated
    if (doc.linesTruncated) {
        dom.tabs.innerHTML = '';
        dom.tabsContent.innerHTML = '<div style="text-align:center;padding:60px;color:#4ec9b0;">⏳ Caricamento righe complete...</div>';
        dom.analysisModal.style.display = 'block';

        // Load complete lines in background
        const completeLines = await loadCompleteDocumentLines(doc, docKey);

        // Create temporary copy of document with all lines
        const completeDoc = { ...doc, lines: completeLines, linesTruncated: false, totalLinesProcessed: completeLines.length };

        // Update modal with complete data
        dom.tabs.innerHTML = '';
        dom.tabsContent.innerHTML = '';

        tabList.forEach((tabName, index) => {
            const tab = document.createElement('button');
            tab.className = 'tab' + (index === 0 ? ' active' : '');
            tab.textContent = tabName;
            tab.onclick = () => switchTab(tabName, completeDoc);
            dom.tabs.appendChild(tab);
        });

        createDatiTracciatoTab(completeDoc);
    } else {
        dom.tabs.innerHTML = '';
        dom.tabsContent.innerHTML = '';

        tabList.forEach((tabName, index) => {
            const tab = document.createElement('button');
            tab.className = 'tab' + (index === 0 ? ' active' : '');
            tab.textContent = tabName;
            tab.onclick = () => switchTab(tabName, doc);
            dom.tabs.appendChild(tab);
        });

        createDatiTracciatoTab(doc);

        dom.analysisModal.style.display = 'block';
    }
}

// Expose to window for inline onclick handlers
window.openAnalysis = openAnalysis;
