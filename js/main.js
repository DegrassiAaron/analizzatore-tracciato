/**
 * Main Application Entry Point
 *
 * Initializes the application and sets up event listeners
 */

// Import all modules
import { handleFiles, processFiles } from './core/fileHandler.js';
import * as dom from './ui/dom.js';
import './ui/table.js'; // Exposes functions to window
import './ui/modal.js'; // Exposes functions to window
import { initLiveFilters } from './ui/filters.js'; // Import initLiveFilters
import './features/download.js'; // Exposes functions to window

/**
 * Initialize application
 */
function init() {
    console.log('🚀 Analizzatore Tracciati inizializzato');

    // Initialize live filters
    initLiveFilters();

    // File upload area click handler
    dom.uploadArea.addEventListener('click', () => dom.fileInput.click());

    // File input change handler
    dom.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    // Drag and drop handlers
    dom.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dom.uploadArea.classList.add('dragover');
    });

    dom.uploadArea.addEventListener('dragleave', () => {
        dom.uploadArea.classList.remove('dragover');
    });

    dom.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dom.uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Process button handler
    dom.processBtn.addEventListener('click', processFiles);

    // Modal close handlers
    dom.closeModal.addEventListener('click', () => {
        dom.analysisModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === dom.analysisModal) {
            dom.analysisModal.style.display = 'none';
        }
    });

    dom.logToConsole('✓ Applicazione pronta', 'success');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
