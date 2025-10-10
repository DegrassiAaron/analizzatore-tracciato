/**
 * Trace File Parser Module
 *
 * Handles parsing of Italian insurance trace file lines:
 * - extractBlockId: Identifies block type from line
 * - extractHeaderData: Extracts header information (positions 0-109)
 * - parseBlockData: Parses block data fields (positions 200+)
 */

import { BLOCK_DEFINITIONS } from '../config/blockDefinitions.js';

/**
 * Extract block ID from a trace line
 *
 * Line structure: [0-109: Header][109-200: Version][200-230: Block name][230+: Block data]
 *
 * Algorithm:
 * 1. Try exact match (anagrafica blocks like "CPERSONA")
 * 2. Remove trailing numbers (e.g., "WGRVBCNT0000" → "WGRVBCNT")
 * 3. Extract last 3 chars (e.g., "WGRVBCNT" → "CNT")
 * 4. Extract last 2 chars as fallback
 *
 * @param {string} line - Trace file line
 * @param {boolean} debug - Enable debug logging
 * @param {Function} logToConsole - Logging function (optional, for debug mode)
 * @returns {string|null} Block ID or null if not recognized
 */
export function extractBlockId(line, debug = false, logToConsole = null) {
    // Block name is at position 200-230 (30 characters)
    if (line.length < 230) return null;

    const blockName = line.substring(200, 230).trim();
    if (!blockName) return null;

    if (debug && logToConsole) {
        logToConsole(`   🔹 Step 1: Exact match "${blockName}" → ${BLOCK_DEFINITIONS[blockName] ? '✓ FOUND' : '✗ not found'}`, 'info');
    }

    // 1. Try exact match (for anagrafica blocks like CPERSONA, CRELAZIONERR)
    if (BLOCK_DEFINITIONS[blockName]) {
        return blockName;
    }

    // 2. Remove trailing numbers (e.g., WGRVBCNT0000 -> WGRVBCNT)
    const withoutNumbers = blockName.replace(/\d+$/, '');

    if (debug && withoutNumbers !== blockName && logToConsole) {
        logToConsole(`   🔹 Step 2: Remove numbers "${blockName}" → "${withoutNumbers}"`, 'info');
    }

    // 3. Extract last 3 characters (for system blocks WGRVB, XGRAB, etc.)
    //    Example: WGRVBCNT0000 -> CNT, XGRABDOC0123 -> DOC
    const blockCode = withoutNumbers.slice(-3);

    if (debug && logToConsole) {
        logToConsole(`   🔹 Step 3: Extract last 3 chars "${withoutNumbers}" → "${blockCode}" → ${BLOCK_DEFINITIONS[blockCode] ? '✓ FOUND' : '✗ not found'}`, 'info');
    }

    if (BLOCK_DEFINITIONS[blockCode]) {
        return blockCode;
    }

    // 4. Try with last 2 characters (fallback)
    const blockCode2 = withoutNumbers.slice(-2);

    if (debug && logToConsole) {
        logToConsole(`   🔹 Step 4: Extract last 2 chars "${withoutNumbers}" → "${blockCode2}" → ${BLOCK_DEFINITIONS[blockCode2] ? '✓ FOUND' : '✗ not found'}`, 'info');
    }

    if (BLOCK_DEFINITIONS[blockCode2]) {
        return blockCode2;
    }

    return null; // Block not recognized
}

/**
 * Extract header data from trace line
 *
 * Header structure (positions 0-109):
 * - identificativo: 0-10
 * - data1: 10-20
 * - data2: 20-30
 * - campo7: 30-37
 * - codCompagnia: 37-40
 * - numContratto: 40-53
 * - prgContratto: 53-60 (7 digits)
 * - campo8: 60-68
 * - datRiferimento: 68-78
 * - tipDocumento: 78-81
 * - campo2: 81-83
 * - codProdotto: 83-86
 * - numDocumento: 86-99
 * - campo10: 99-109
 *
 * @param {string} line - Trace file line
 * @returns {Object|null} Header data object or null if invalid
 */
export function extractHeaderData(line) {
    if (line.length < 109) return null;

    return {
        identificativo: line.substring(0, 10).trim(),
        data1: line.substring(10, 20).trim(),
        data2: line.substring(20, 30).trim(),
        campo7: line.substring(30, 37).trim(),
        codCompagnia: line.substring(37, 40).trim(),
        numContratto: line.substring(40, 53).trim(),
        prgContratto: line.substring(53, 60).trim(), // 7 digits
        campo8: line.substring(60, 68).trim(),
        datRiferimento: line.substring(68, 78).trim(),
        tipDocumento: line.substring(78, 81).trim(),
        campo2: line.substring(81, 83).trim(),
        codProdotto: line.substring(83, 86).trim(),
        numDocumento: line.substring(86, 99).trim(),
        campo10: line.substring(99, 109).trim()
    };
}

/**
 * Parse block data fields from trace line
 *
 * Line structure: [0-109: Header][109-200: Version][200-230: Block name][230+: Block data]
 * Block data starts at position 230
 * All positions in BLOCK_DEFINITIONS are relative to position 230
 *
 * @param {string} line - Trace file line
 * @param {string} blockId - Block identifier
 * @returns {Object|null} Parsed block data or null if invalid
 */
export function parseBlockData(line, blockId) {
    const definition = BLOCK_DEFINITIONS[blockId];
    if (!definition) return null;
    if (line.length < 230) return null;

    const dataStart = 230;
    const result = {};

    definition.forEach(field => {
        const startPos = dataStart + field.pos;
        const endPos = startPos + field.len;
        if (line.length >= endPos) {
            const value = line.substring(startPos, endPos).trim();
            result[field.name] = value;
        }
    });

    return result;
}
