/**
 * Download Features Module
 *
 * Handles document download functionality (single file and ZIP)
 * File naming format: [{codProdotto}]{codCompagnia}-{numContratto}-{numDocumento}_{dataRiferimento}.txt
 */

import { documentsData, selectedDocs, sourceFiles } from '../core/state.js';
import { extractHeaderData } from '../core/parser.js';
import { logToConsole } from '../ui/dom.js';
import { removeEmptyLastLine } from '../utils/utils.js';

/**
 * Load complete document lines from source file (handles truncated docs)
 * @param {Object} doc - Document object
 * @param {string} docKey - Document key
 * @returns {Array<string>} Complete lines (with empty last line removed)
 */
async function loadCompleteDocumentLines(doc, docKey) {
    // If not truncated, return existing lines
    if (!doc.linesTruncated) {
        return removeEmptyLastLine(doc.lines);
    }

    // Reload complete lines from source file
    logToConsole(`📥 Caricamento righe complete per ${formatDocumentName(doc)}...`, 'info');

    const file = sourceFiles.get(doc.sourceFile);
    if (!file) {
        logToConsole(`✗ File sorgente non trovato: ${doc.sourceFile}`, 'error');
        return removeEmptyLastLine(doc.lines);
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
                const lineKey = `${header.codCompagnia}-${header.numContratto}-${header.prgContratto}-${header.numDocumento}`;
                if (lineKey === docKey) {
                    allLines.push(line);
                }
            }
        });

        offset += CHUNK_SIZE;
    }

    logToConsole(`✓ Caricate ${allLines.length} righe complete`, 'success', true);
    return removeEmptyLastLine(allLines);
}

/**
 * Format document filename
 * Format: [{codProdotto}]{codCompagnia}-{numContratto}-{numDocumento}_{dataRiferimento}.txt
 * @param {Object} doc - Document data
 * @returns {string} Formatted filename
 */
function formatFilename(doc) {
    const codProdotto = doc.header.codProdotto || 'XXX';
    const codCompagnia = doc.header.codCompagnia || '000';
    const numContratto = doc.header.numContratto || '0000000000000';
    const numDocumento = doc.header.numDocumento || '0000000000000';
    const dataRif = (doc.header.datRiferimento || '0000-00-00').replace(/-/g, '');

    return `[${codProdotto}]${codCompagnia}-${numContratto}-${numDocumento}_${dataRif}.txt`;
}

/**
 * Format document name for logging
 * @param {Object} doc - Document data
 * @returns {string} Human-readable document name
 */
function formatDocumentName(doc) {
    return `${doc.header.codCompagnia}-${doc.header.numContratto}-${doc.header.numDocumento}`;
}

/**
 * Download selected documents as separate text files
 */
export async function downloadSelectedSingle() {
    if (selectedDocs.size === 0) return;

    const count = selectedDocs.size;
    logToConsole(`📥 Preparazione download di ${count} tracciato${count > 1 ? 'i' : ''}...`, 'info');

    let downloaded = 0;
    for (const key of selectedDocs) {
        const doc = documentsData.get(key);
        if (doc) {
            // Reload complete lines if needed
            const completeLines = await loadCompleteDocumentLines(doc, key);
            const content = completeLines.join('\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = formatFilename(doc);
            a.click();
            URL.revokeObjectURL(url);
            downloaded++;
            logToConsole(`✓ Download: ${formatFilename(doc)} (${completeLines.length} righe)`, 'success');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    logToConsole(`✓ Download completati: ${downloaded} file`, 'success');
}

/**
 * Download selected documents as ZIP archive
 */
export async function downloadSelected() {
    if (selectedDocs.size === 0) return;

    const count = selectedDocs.size;

    // Check if JSZip is available
    if (typeof JSZip === 'undefined') {
        logToConsole('✗ Errore: JSZip non disponibile. Verificare che sia caricato.', 'error');
        return;
    }

    logToConsole(`📥 Creazione archivio ZIP di ${count} tracciato${count > 1 ? 'i' : ''}...`, 'info');

    try {
        const zip = new JSZip();
        let processed = 0;

        for (const key of selectedDocs) {
            const doc = documentsData.get(key);
            if (doc) {
                // Reload complete lines if needed
                const completeLines = await loadCompleteDocumentLines(doc, key);
                const content = completeLines.join('\n');
                const filename = formatFilename(doc);
                zip.file(filename, content);
                processed++;
                logToConsole(`⚙️ Aggiunto: ${filename} (${completeLines.length} righe) [${processed}/${count}]`, 'info', true);
            }
        }

        logToConsole('🔄 Generazione archivio ZIP...', 'info');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tracciati_export_${new Date().getTime()}.zip`;
        a.click();
        URL.revokeObjectURL(url);

        logToConsole(`✓ Download completato: ${count} tracciato${count > 1 ? 'i' : ''} in archivio ZIP`, 'success');
    } catch (error) {
        logToConsole(`✗ Errore durante il download: ${error.message}`, 'error');
    }
}

// Expose to window
window.downloadSelectedSingle = downloadSelectedSingle;
window.downloadSelected = downloadSelected;
