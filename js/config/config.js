/**
 * Application Configuration
 *
 * Memory management and file processing constants
 */

// Maximum number of files that can be uploaded simultaneously
export const MAX_FILES = 8;

// Maximum raw lines saved per document in memory
// For 8GB files with many documents, this limit prevents browser crashes
// Structured block data is always saved completely
// Recommended values: 5000-20000 (depending on available RAM)
export const MAX_LINES_PER_DOC = 10000;

// If false, doesn't save raw lines but only structured block data
// This drastically reduces memory usage but prevents downloading original lines
// For analysis-only mode, set to false to save memory
// For full functionality (download + analysis), set to true
export const SAVE_RAW_LINES = true;
