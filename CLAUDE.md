# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a single-file HTML application for analyzing Italian insurance policy tracciati (trace files). The application runs entirely in the browser with no backend dependencies.

**Main file:** `analizzatore-tracciati.html`

## Purpose

The application parses fixed-width format TXT files containing insurance policy data and extracts structured information organized into different block types (CNT, SCH, PRT, PAX, RIS, DOC, RIN, SFO, AGE, COA, CVP, COI, PCE, LPS, PCB).

## Architecture

### Data Processing Flow

1. **File Upload**: Users can upload up to 20 TXT files via drag-and-drop or file picker (max 8GB total)
2. **Parsing**: Each line is parsed to extract:
   - **Header data** (positions 0-200): Contains `COD_COMP`, `NUM_CONTRATTO`, `PRG_CONTRATTO`, dates, etc.
   - **Block identifier** (positions 200-212): 12-character string with block type at positions 205-207
   - **Block data** (positions 212+): Field values based on block type definitions
3. **Document grouping**: Lines are grouped by unique key `${COD_COMP}-${NUM_CONTRATTO}-${PRG_CONTRATTO}`
4. **Display**: Results shown in interactive tables with filtering, sorting, pagination

### Key Components

**Block Definitions** (`BLOCK_DEFINITIONS` object, lines 557-1020):
- Contains field schemas for 15 block types
- Each field has: `name`, `pos` (position), `len` (length)
- Positions are relative to position 212 (after block identifier)

**Main Functions**:
- `extractHeaderData(line)` - Extracts header from positions 0-200
- `extractBlockId(line)` - Gets 3-character block ID from positions 205-207
- `parseBlockData(line, blockId)` - Parses field values using block definitions
- `processFiles()` - Main processing loop
- `openAnalysis(docKey)` - Opens modal with tabbed block data views

### State Management

- `selectedFiles`: Array of File objects
- `documentsData`: Map of document data keyed by `${COD_COMP}-${NUM_CONTRATTO}-${PRG_CONTRATTO}`
- `sourceFiles`: Map of original files by filename
- `selectedDocs`: Set of selected document keys for batch download
- `window.blockStates`: Per-block UI state (column visibility, sorting, pagination)

### UI Features

- Dark VS Code-inspired theme
- Console log panel for real-time processing feedback
- Statistics dashboard (files processed, lines, documents, block types)
- **Advanced filtering system** for documents:
  - By company code (COD_COMP)
  - By contract number (NUM_CONTRATTO)
  - By document number (NUM_DOCUMENTO from DOC block)
  - By document type (TIP_DOCUMENTO from DOC block)
  - By product code (COD_PRODOTTO_GRV from CNT block)
  - By reference date with 4 modes:
    - Exact date
    - Before date
    - After date
    - Date range
- Interactive data tables with:
  - Column show/hide
  - Column reordering (drag & drop)
  - Sorting (click headers)
  - Pagination (5 rows per page)
- Bulk export as individual TXT or ZIP archive
- Warning banner for bulk downloads >10 files
- On-demand complete line loading for truncated documents

## Data Format Details

### Fixed-Width Format

All lines follow this structure:
```
[0-109: Header data][109-121: Block identifier][121+: Block-specific data]
```

**Header structure (positions 0-109):**
- Position 0-10: Identificativo (10 chars)
- Position 10-20: Data 1 (10 chars, format: aaaa-mm-gg)
- Position 20-30: Data 2 (10 chars, format: aaaa-mm-gg)
- Position 30-37: Campo 7 (7 chars)
- Position 37-40: Codice Compagnia (3 chars)
- Position 40-53: Numero Contratto (13 chars)
- Position 53-60: Progressivo Contratto (7 chars)
- Position 60-68: Campo 8 (8 chars)
- Position 68-78: Data Riferimento (10 chars, format: aaaa-mm-gg)
- Position 78-81: Tipo Documento (3 chars)
- Position 81-83: Campo 2 (2 chars)
- Position 83-86: Codice Prodotto (3 chars)
- Position 86-99: Numero Documento (13 chars)
- Position 99-109: Campo 10 (10 chars)

**Important field lengths:**
- Header `PRG_CONTRATTO` (position 53-60): **7 characters**
- Block `PRG_CONTRATTO` (all blocks): **8 characters**

Note: The header and block definitions use different lengths for the same logical field.

### Block Identifier Format

Position 109-121 contains a 12-character string:
```
[5 chars prefix][3 chars block type][4 digits]
Example: WGRVBCNT0000
         ^^^^^   ^^^
         prefix  CNT (block type)
```

### Common Block Types

- **CNT**: Contract (Contratto) - Main policy info
- **SCH**: Card (Scheda) - Policy coverage details
- **PRT**: Match (Partita) - Premium calculation details
- **PAX**: Parameters (Parametri) - Coverage parameters
- **DOC**: Document - Policy documents
- **AGE**: Agency (Agenzia) - Agency/broker info
- **RIS**: Answers (Risposte) - Questionnaire responses
- **RIN**: Risk answers (Risposte Rischio) - Risk-specific responses

## Common Development Tasks

### Running the Application

Open `analizzatore-tracciati.html` directly in a web browser. No build step or server required.

### Testing with Sample Data

Create TXT files with lines at least 212 characters long containing:
- Valid header data at positions 0-61
- Block identifier at positions 200-212 (e.g., `WGRVBCNt0001` for CNT block)
- Block-specific data starting at position 212

### Modifying Block Definitions

To add/modify block types, edit the `BLOCK_DEFINITIONS` object (lines 557-1020). Each field needs:
```javascript
{ name: 'FIELD_NAME', pos: 0, len: 10 }  // pos relative to position 212
```

### Debugging Parse Issues

The console log shows detailed parsing info for the first 3 lines of each file:
- Block string extracted (positions 200-212)
- Detected block ID
- Line length
- Parsing errors

## Memory Management for Large Files

The application is optimized to handle files up to 8GB through several mechanisms:

### Chunk-based File Reading

- Files are processed in 10MB chunks (configurable via `CHUNK_SIZE`)
- Function `processFileInChunks()` implements streaming file reader
- Incomplete lines between chunks are buffered in `leftover` variable
- Progress bar updates in real-time during chunk processing

### Memory Limits

Three configurable constants control memory usage:

```javascript
MAX_FILES = 8              // Maximum files to load at once
MAX_LINES_PER_DOC = 20000   // Max raw lines saved per document
SAVE_RAW_LINES = true       // Whether to save raw lines or only parsed data
```

**When raw lines are truncated:**
- Block data (parsed fields) is always saved completely
- Only raw line strings in memory are limited to prevent initial memory overflow
- UI shows optimization indicator (💾) in table for truncated documents
- **Complete lines are automatically reloaded on-demand** when:
  - Opening document analysis modal
  - Downloading single or ZIP exports
- Lines are reloaded by re-scanning the source file (chunk-based, memory-efficient)
- User can analyze and download documents with unlimited lines
- Document metadata tracks `totalLinesProcessed` vs `lines.length`

**Recommended settings by file size:**
- <1GB: Default settings work fine
- 1-5GB: Consider `MAX_LINES_PER_DOC = 5000`
- 5-20GB: `MAX_LINES_PER_DOC = 1000`
- >20GB: Set `SAVE_RAW_LINES = false` (blocks only)

## Important Implementation Notes

- All positions in `BLOCK_DEFINITIONS` are **relative to position 121**, not absolute line positions
- Header extraction: positions 0-109
- Block ID extraction: `line.substring(109, 121).substring(5, 8)` → gets 3-char block ID
- Block data starts at position 121
- Header already contains: tipo documento, numero documento, and codice prodotto (no need to extract from blocks)
- The application uses JSZip (CDN: jszip 3.10.1) for ZIP export functionality
- No external dependencies besides JSZip CDN

## File Structure

```
analizzatore-tracciato/
├── README.md                      # Empty, just repo name
└── analizzatore-tracciati.html    # Complete application (1740 lines)
```

## Language & Localization

All UI text is in Italian. Field names follow Italian insurance industry conventions.
