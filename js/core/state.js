/**
 * Application State Management
 *
 * Centralized state for the application
 */

// Selected files for processing
export let selectedFiles = [];

// Processed documents data (Map: documentKey -> documentData)
export const documentsData = new Map();

// Filtered documents (Map: documentKey -> documentData)
export const filteredDocuments = new Map();

// Source files (Map: fileName -> File)
export const sourceFiles = new Map();

// Selected documents for download (Set of documentKeys)
export const selectedDocs = new Set();

/**
 * Update selected files array
 * @param {File[]} files - New files array
 */
export function setSelectedFiles(files) {
    selectedFiles = files;
}

/**
 * Clear all application state
 */
export function clearAllState() {
    selectedFiles = [];
    documentsData.clear();
    filteredDocuments.clear();
    sourceFiles.clear();
    selectedDocs.clear();
}
