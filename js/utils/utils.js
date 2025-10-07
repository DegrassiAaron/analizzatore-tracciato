/**
 * Utility Functions
 *
 * General-purpose helper functions used throughout the application
 */

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export function formatSize(bytes) {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1024).toFixed(2) + ' KB';
}

/**
 * Update progress bar
 * @param {HTMLElement} progressFill - Progress bar fill element
 * @param {number} percent - Progress percentage (0-100)
 */
export function updateProgress(progressFill, percent) {
    progressFill.style.width = percent + '%';
}

/**
 * Parse date string in multiple formats
 * Supports: gg/mm/aaaa or aaaa-mm-gg
 * @param {string} dateStr - Date string to parse
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export function parseDate(dateStr) {
    if (!dateStr) return null;

    // Try format: aaaa-mm-gg
    let parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return new Date(year, month, day);
        }
    }

    // Try format: gg/mm/aaaa
    parts = dateStr.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return new Date(year, month, day);
        }
    }

    return null;
}

/**
 * Format date from header (aaaa-mm-gg format)
 * @param {string} headerDate - Date string from header
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export function formatDateFromHeader(headerDate) {
    if (!headerDate || headerDate.length < 10) return null;

    const parts = headerDate.trim().split('-');
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    return new Date(year, month, day);
}

/**
 * Remove empty last line from array
 * @param {Array<string>} lines - Array of lines
 * @returns {Array<string>} Lines without empty last line
 */
export function removeEmptyLastLine(lines) {
    if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        return lines.slice(0, -1);
    }
    return lines;
}

/**
 * Format table cell values for display
 * Removes leading '+' and zero-padding from numeric values
 * @param {string} value - Raw value from block data
 * @returns {string} Formatted value for display
 *
 * Examples:
 * - "+001" → "1"
 * - "+00012345" → "12345"
 * - "2021-02-04" → "2021-02-04" (unchanged)
 * - "+ABC123" → "ABC123" (removed +, not purely numeric)
 * - "" → "-"
 */
export function formatTableValue(value) {
    // Handle empty/null/undefined
    if (value == null || value === '') {
        return '-';
    }

    // Convert to string if not already
    const strValue = String(value).trim();

    // If starts with '+', remove it and check if rest is numeric
    if (strValue.startsWith('+')) {
        const withoutPlus = strValue.substring(1);

        // Check if it's purely numeric (only digits, possibly with leading zeros)
        if (/^\d+$/.test(withoutPlus)) {
            // Convert to number to remove leading zeros, then back to string
            const numValue = parseInt(withoutPlus, 10);
            return String(numValue);
        }

        // If not purely numeric, return without the '+'
        return withoutPlus;
    }

    // Check if it's a numeric string with leading zeros (without +)
    if (/^0+\d+$/.test(strValue)) {
        const numValue = parseInt(strValue, 10);
        return String(numValue);
    }

    // Return as-is if no '+' prefix and no leading zeros
    return strValue;
}

/**
 * Format date for table display (aaaa-mm-gg → gg/mm/aaaa)
 * @param {string} dateStr - Date string in format aaaa-mm-gg
 * @returns {string} Formatted date string or "-" if invalid
 *
 * Examples:
 * - "2021-02-04" → "04/02/2021"
 * - "" → "-"
 */
export function formatDateForTable(dateStr) {
    if (!dateStr || dateStr.trim() === '') {
        return '-';
    }

    const trimmed = dateStr.trim();
    const parts = trimmed.split('-');

    if (parts.length === 3) {
        const [year, month, day] = parts;
        // Remove leading zeros from day and month
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        return `${dayNum}/${monthNum}/${year}`;
    }

    return trimmed;
}
