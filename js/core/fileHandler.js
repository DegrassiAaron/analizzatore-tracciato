/**
 * File Handler Module
 *
 * Handles file upload, processing, and chunk-based reading for large files
 */

import { MAX_FILES, MAX_TOTAL_SIZE, MAX_LINES_PER_DOC, SAVE_RAW_LINES } from '../config/config.js';
import { BLOCK_DEFINITIONS } from '../config/blockDefinitions.js';
import { extractBlockId, extractHeaderData, parseBlockData } from './parser.js';
import { selectedFiles, setSelectedFiles, documentsData, sourceFiles, selectedDocs } from './state.js';
import { logToConsole } from '../ui/dom.js';
import { formatSize, updateProgress } from '../utils/utils.js';
import * as dom from '../ui/dom.js';

/**
 * Handle uploaded files
 * @param {FileList} files - Files from input or drag-drop
 */
export function handleFiles(files) {
    const txtFiles = Array.from(files).filter(f => f.name.endsWith('.txt'));
    const availableSlots = MAX_FILES - selectedFiles.length;

    if (txtFiles.length > availableSlots) {
        logToConsole(`⚠️ Puoi aggiungere solo ${availableSlots} file. Limite massimo: ${MAX_FILES}`, 'warning');
        txtFiles.splice(availableSlots);
    }

    // Check total size
    const currentTotalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const newFilesSize = txtFiles.reduce((sum, f) => sum + f.size, 0);
    const totalSize = currentTotalSize + newFilesSize;

    if (totalSize > MAX_TOTAL_SIZE) {
        const maxSizeGB = (MAX_TOTAL_SIZE / (1024 * 1024 * 1024)).toFixed(1);
        const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
        logToConsole(`✗ Dimensione totale eccessiva: ${totalSizeGB}GB. Limite massimo: ${maxSizeGB}GB`, 'error');
        return;
    }

    const newFiles = [...selectedFiles, ...txtFiles].slice(0, MAX_FILES);
    setSelectedFiles(newFiles);
    logToConsole(`✓ Aggiunti ${txtFiles.length} file. Totale: ${selectedFiles.length}/${MAX_FILES}`, 'info');
    updateFileList();
}

/**
 * Update file list display
 */
export function updateFileList() {
    dom.fileList.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'background:#2d2d30;padding:10px 15px;border-radius:4px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;font-size:12px;';
        div.innerHTML = `
            <div>
                <span>📄 ${file.name}</span>
                <span style="color:#858585;margin-left:10px;">${formatSize(file.size)}</span>
            </div>
            <button onclick="removeFile(${index})" style="background:#f14c4c;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:11px;">×</button>
        `;
        dom.fileList.appendChild(div);
    });

    // Show total size
    if (selectedFiles.length > 0) {
        const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
        const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
        const maxSizeGB = (MAX_TOTAL_SIZE / (1024 * 1024 * 1024)).toFixed(0);
        const percentage = (totalSize / MAX_TOTAL_SIZE * 100).toFixed(1);

        const totalDiv = document.createElement('div');
        const isNearLimit = percentage > 80;
        totalDiv.style.cssText = `background:${isNearLimit ? '#5a3a1a' : '#2d2d30'};padding:10px 15px;border-radius:4px;margin-top:5px;font-size:11px;color:${isNearLimit ? '#dcdcaa' : '#858585'};text-align:center;`;
        totalDiv.innerHTML = `Dimensione totale: <strong>${totalSizeGB} GB</strong> / ${maxSizeGB} GB (${percentage}%)`;
        dom.fileList.appendChild(totalDiv);
    }

    dom.processBtn.disabled = selectedFiles.length === 0;
}

/**
 * Remove file from list
 * @param {number} index - File index to remove
 */
export function removeFile(index) {
    const fileName = selectedFiles[index].name;
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    logToConsole(`✗ Rimosso file: ${fileName}`, 'info');
    updateFileList();
}

// Expose removeFile to window for inline onclick
window.removeFile = removeFile;

/**
 * Process file in chunks (for large files up to 8GB)
 * @param {File} file - File to process
 * @param {Function} onProgress - Progress callback (0-1)
 * @returns {Object} Processing results
 */
export async function processFileInChunks(file, onProgress) {
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
    const fileSize = file.size;
    let offset = 0;
    let leftover = '';
    const docMap = new Map();
    let blocksFound = new Set();
    let blocksNotFound = 0;
    const unrecognizedBlocks = new Set();
    let totalLinesInFile = 0;

    while (offset < fileSize) {
        const chunk = file.slice(offset, offset + CHUNK_SIZE);
        const text = await chunk.text();

        const fullText = leftover + text;
        const lines = fullText.split('\n');

        // Save incomplete last line for next chunk
        if (offset + CHUNK_SIZE < fileSize) {
            leftover = lines.pop() || '';
        } else {
            leftover = '';
        }

        // Process complete lines
        lines.forEach((line) => {
            if (line.trim().length === 0) return;
            totalLinesInFile++;

            const header = extractHeaderData(line);
            if (!header) {
                if (totalLinesInFile <= 10) logToConsole(`⚠️ Riga ${totalLinesInFile}: Header non valido`, 'warning', true);
                return;
            }

            // Debug logging for first 10 lines (detailed)
            const enableDebug = totalLinesInFile <= 10;
            if (enableDebug) {
                const blockString = line.length >= 230 ? line.substring(200, 230).trim() : 'TROPPO CORTA';
                logToConsole(`🔍 Riga ${totalLinesInFile}: BlockName="${blockString}", Length=${line.length}`, 'info', true);
            }

            const blockId = extractBlockId(line, enableDebug, (msg, type) => logToConsole(msg, type, true));

            if (enableDebug) {
                logToConsole(`   ➜ Result: BlockID="${blockId || 'NULL'}"`, blockId ? 'success' : 'error', true);
            }

            if (blockId && BLOCK_DEFINITIONS[blockId]) {
                blocksFound.add(blockId);
            } else {
                blocksNotFound++;
                if (line.length >= 230) {
                    const blockString = line.substring(200, 230).trim();
                    unrecognizedBlocks.add(blockString);
                    if (enableDebug) {
                        logToConsole(`❌ Riga ${totalLinesInFile}: Blocco "${blockString}" non riconosciuto`, 'error', true);
                    }
                }
            }

            const key = `${header.codCompagnia}-${header.numContratto}-${header.prgContratto}`;

            if (!docMap.has(key)) {
                docMap.set(key, {
                    header: header,
                    blocks: {},
                    lines: [],
                    sourceFile: file.name,
                    totalLinesProcessed: 0,
                    linesTruncated: false,
                    numDocumento: header.numDocumento,
                    tipDocumento: header.tipDocumento,
                    codProdotto: header.codProdotto
                });
            }

            const doc = docMap.get(key);
            doc.totalLinesProcessed++;

            // Save raw lines if enabled and under limit
            if (SAVE_RAW_LINES && doc.lines.length < MAX_LINES_PER_DOC) {
                doc.lines.push(line);
            } else if (SAVE_RAW_LINES && !doc.linesTruncated) {
                doc.linesTruncated = true;
                logToConsole(`⚠️ Documento ${key}: limite di ${MAX_LINES_PER_DOC} righe raggiunto`, 'warning', true);
            }

            if (blockId && BLOCK_DEFINITIONS[blockId]) {
                if (!doc.blocks[blockId]) {
                    doc.blocks[blockId] = [];
                }
                const blockData = parseBlockData(line, blockId);
                if (blockData) {
                    doc.blocks[blockId].push(blockData);
                }
            }
        });

        offset += CHUNK_SIZE;
        onProgress(Math.min(offset / fileSize, 1));
    }

    // Log unrecognized blocks summary (detailed)
    if (unrecognizedBlocks.size > 0) {
        logToConsole(`⚠️ Riepilogo blocchi non riconosciuti (${unrecognizedBlocks.size} tipi unici):`, 'warning', true);
        Array.from(unrecognizedBlocks).sort().forEach(blockName => {
            logToConsole(`   • "${blockName}"`, 'warning', true);
        });
    }

    return {
        docMap,
        blocksFound,
        blocksNotFound,
        unrecognizedBlocks,
        totalLinesInFile
    };
}

/**
 * Process all selected files
 */
export async function processFiles() {
    dom.processBtn.disabled = true;
    dom.progressContainer.style.display = 'block';
    documentsData.clear();
    sourceFiles.clear();
    selectedDocs.clear();

    logToConsole('🚀 Inizio elaborazione file...', 'info');

    let totalLines = 0;
    let totalDocs = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        logToConsole(`⚙️ Elaborazione: ${file.name} (${formatSize(file.size)})`, 'info');

        try {
            const result = await processFileInChunks(file, (chunkProgress) => {
                const fileProgress = (i + chunkProgress) / selectedFiles.length * 100;
                updateProgress(dom.progressFill, fileProgress);
            });

            const { docMap, blocksFound, blocksNotFound, totalLinesInFile } = result;
            totalLines += totalLinesInFile;

            if (blocksFound.size > 0) {
                logToConsole(`✓ Blocchi trovati in ${file.name}: ${Array.from(blocksFound).join(', ')}`, 'success');
            } else {
                logToConsole(`⚠️ Nessun blocco trovato in ${file.name} (${blocksNotFound} righe non riconosciute)`, 'warning');
            }

            docMap.forEach((doc, key) => {
                documentsData.set(key, doc);
                totalDocs++;
            });

            sourceFiles.set(file.name, file);
            logToConsole(`✓ ${file.name}: ${docMap.size} documenti, ${totalLinesInFile} righe elaborate`, 'success');

        } catch (error) {
            logToConsole(`✗ Errore elaborando ${file.name}: ${error.message}`, 'error');
        }
    }

    updateProgress(dom.progressFill, 100);

    dom.stats.innerHTML = `
        <div class="stat-box">
            <div class="stat-value">${selectedFiles.length}</div>
            <div class="stat-label">File processati</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${totalLines}</div>
            <div class="stat-label">Righe totali</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${totalDocs}</div>
            <div class="stat-label">Documenti trovati</div>
        </div>
        <div class="stat-box">
            <div class="stat-value">${Object.keys(BLOCK_DEFINITIONS).length}</div>
            <div class="stat-label">Tipi di blocco</div>
        </div>
    `;

    logToConsole(`✓ Elaborazione completata: ${totalDocs} documenti da ${totalLines} righe`, 'success');

    dom.statsContainer.style.display = 'block';

    // Import and call renderDocumentsTable
    const { renderDocumentsTable } = await import('../ui/table.js');
    renderDocumentsTable();

    dom.progressContainer.style.display = 'none';
    updateProgress(dom.progressFill, 0);
    dom.processBtn.disabled = false;
    dom.resultsPanel.style.display = 'flex';
    dom.docCount.textContent = `${totalDocs} documenti`;
}
