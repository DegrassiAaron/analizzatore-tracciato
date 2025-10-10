# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a modular HTML/JavaScript application for analyzing Italian insurance policy tracciati (trace files). The application runs entirely in the browser with no backend dependencies.

**Main entry point:** `index.html`

## Purpose

The application parses fixed-width format TXT files containing insurance policy data and extracts structured information organized into different block types (CNT, SCH, PRT, PAX, RIS, DOC, RIN, SFO, AGE, COA, CVP, COI, PCE, LPS, PCB, and anagrafica blocks).

## Architecture

### Modular Structure

The application is organized into ES6 modules for maintainability and scalability:

```
analizzatore-tracciato/
├── index.html                          # Main HTML entry point
├── css/
│   └── styles.css                      # All application styles
├── js/
│   ├── config/
│   │   ├── blockDefinitions.js         # BLOCK_DEFINITIONS (all block schemas)
│   │   └── config.js                   # Configuration constants
│   ├── core/
│   │   ├── parser.js                   # Line parsing functions
│   │   ├── state.js                    # Application state management
│   │   └── fileHandler.js              # File upload and processing
│   ├── ui/
│   │   ├── dom.js                       # DOM references and console logging
│   │   ├── table.js                     # Documents table rendering
│   │   ├── modal.js                     # Analysis modal (stub)
│   │   └── filters.js                   # Document filtering (stub)
│   ├── features/
│   │   └── download.js                  # Document download functionality (stub)
│   ├── utils/
│   │   └── utils.js                     # Utility functions
│   └── main.js                          # Application initialization
├── CLAUDE.md                            # This file
├── README.md                            # Repository information
├── tracciato.md                         # Trace file format documentation
├── tracciato2.md                        # Block structure documentation
├── tracciato3.md                        # Field definitions documentation
└── analizzatore-tracciati.html         # Original monolithic version (legacy)
```

### Module Responsibilities

**config/blockDefinitions.js**
- Exports `BLOCK_DEFINITIONS` object
- Contains field schemas for 30+ block types
- Each field: `{ name, pos, len }` (pos relative to position 200)

**config/config.js**
- Exports memory management constants
- `MAX_FILES`, `MAX_LINES_PER_DOC`, `SAVE_RAW_LINES`

**core/parser.js**
- `extractBlockId(line, debug, logToConsole)` - 4-step block ID extraction
- `extractHeaderData(line)` - Parses header (positions 0-109)
- `parseBlockData(line, blockId)` - Parses block fields (positions 230+)

**core/state.js**
- Centralized application state
- `selectedFiles`, `documentsData`, `filteredDocuments`, `sourceFiles`, `selectedDocs`

**core/fileHandler.js**
- `handleFiles(files)` - File upload handler
- `processFileInChunks(file, onProgress)` - Chunk-based reader (10MB chunks)
- `processFiles()` - Main processing orchestrator
- `updateFileList()`, `removeFile(index)`

**ui/dom.js**
- All DOM element references (exported as named exports)
- `logToConsole(message, type)` - Console logging
- `clearConsole()` - Clear console log

**ui/table.js**
- `renderDocumentsTable(dataSource)` - Render documents table
- `toggleSelectAll()`, `selectAll()`, `deselectAll()`, `updateSelection()`

**ui/modal.js** (Stub - to be completed)
- `openAnalysis(docKey)` - Open analysis modal
- `switchTab(tabName, doc)` - Tab switching

**ui/filters.js** (Stub - to be completed)
- `toggleFilters()`, `applyFilters()`, `clearFilters()`

**features/download.js** (Stub - to be completed)
- `downloadSelectedSingle()` - Download as single TXT
- `downloadSelected()` - Download as ZIP

**utils/utils.js**
- `formatSize(bytes)` - Format file sizes
- `updateProgress(progressFill, percent)` - Update progress bar
- `parseDate(dateStr)` - Parse date strings
- `formatDateFromHeader(headerDate)` - Format header dates

**main.js**
- Application initialization
- Event listener setup
- Module orchestration

### Data Processing Flow

1. **File Upload**: Users can upload up to 8 TXT files via drag-and-drop or file picker (max 20GB total, each file up to 8GB)
2. **Parsing**: Each line is parsed to extract:
   - **Header data** (positions 0-109): Contains compagnia, contratto, progressivo, dates, etc.
   - **Block name** (positions 200-230): Block name string (30 chars, left-aligned)
   - **Block data** (positions 230+): Field values based on block type definitions
3. **Document grouping**: Lines are grouped by unique key `${COD_COMP}-${NUM_CONTRATTO}-${PRG_CONTRATTO}`
4. **Display**: Results shown in interactive tables with filtering, sorting, and bulk operations

### State Management

All state is centralized in `core/state.js`:
- `selectedFiles`: Array of File objects
- `documentsData`: Map of document data keyed by `${COD_COMP}-${NUM_CONTRATTO}-${PRG_CONTRATTO}`
- `sourceFiles`: Map of original files by filename
- `selectedDocs`: Set of selected document keys for batch download
- `filteredDocuments`: Filtered view of documents

### UI Features

- Dark VS Code-inspired theme
- Console log panel for real-time processing feedback
- Statistics dashboard (files processed, lines, documents, block types)
- **Advanced filtering system** for documents:
  - By company code (Codice Compagnia)
  - By contract number (Numero Contratto)
  - By document number (Numero Documento)
  - By document type (Tipo Documento)
  - By product code (Codice Prodotto)
  - By reference date with 4 modes:
    - Exact date
    - Before date
    - After date
    - Date range
- Interactive data tables with:
  - Checkbox selection
  - Block type display
  - Line count display
  - Analysis modal access
- Bulk export as individual TXT or ZIP archive
- Warning banner for bulk downloads >10 files
- On-demand complete line loading for truncated documents

## Data Format Details

### Fixed-Width Format

All lines follow this structure:
```
[0-109: Header][109-200: Versione/Info][200-230: Block name][230+: Block data]
```

**Header structure (positions 0-109):**
- Position 0-10: Identificativo (10 chars)
- Position 10-20: Data 1 (10 chars, format: aaaa-mm-gg)
- Position 20-30: Data 2 (10 chars, format: aaaa-mm-gg)
- Position 30-37: Campo 7 (7 chars)
- Position 37-40: Codice Compagnia (3 chars)
- Position 40-53: Numero Contratto (13 chars)
- Position 53-60: Progressivo Contratto (**7 chars**)
- Position 60-68: Campo 8 (8 chars)
- Position 68-78: Data Riferimento (10 chars, format: aaaa-mm-gg)
- Position 78-81: Tipo Documento (3 chars)
- Position 81-83: Campo 2 (2 chars)
- Position 83-86: Codice Prodotto (3 chars)
- Position 86-99: Numero Documento (13 chars)
- Position 99-109: Campo 10 (10 chars)

**Versione/Info (positions 109-200, 91 chars):**
- Contains version string (e.g., "2025.10.3.1") padded with spaces
- Not parsed by the application (ignored)

**Block name (positions 200-230, 30 chars):**
- Block name aligned left, padded with trailing spaces
- Examples: "WGRVBCNT0000", "CPERSONA", "CRELAZIONERR", "CUBICAZIONE"

**Block data (positions 230+):**
- All field positions in `BLOCK_DEFINITIONS` are relative to position 230
- Length varies by block type

**Important field lengths:**
- Header `PRG_CONTRATTO` (position 53-60): **7 characters**
- Block `PRG_CONTRATTO` (all system blocks): **8 characters**

Note: The header and block definitions use different lengths for the same logical field.

### Block Name Patterns

**System blocks** (with variable prefix):
```
[PREFIX][ID][NUMERO]
Examples:
  WGRVBCNT0000 → ID: CNT
  WGRVBDOC0123 → ID: DOC
  XGRABSCH9999 → ID: SCH (future prefix)
```
- PREFIX can be `WGRVB`, `XGRAB`, or other future prefixes
- ID is always 2-3 characters (CNT, DOC, SCH, PRT, etc.)
- NUMERO is 4 digits (can vary: 0000, 0001, 0123, etc.)

**Anagrafica blocks** (full name, no prefix):
```
Examples:
  CPERSONA
  CNATANTE
  CRELAZIONERR
  CUBICAZIONE
```
- Complete name, no numeric suffix
- Always start with 'C'

### Supported Block Types

**System blocks** (ID extracted from name):
- **CNT**: Contract (Contratto) - Main policy info
- **SCH**: Card (Scheda) - Policy coverage details
- **PRT**: Match (Partita) - Premium calculation details
- **PAX**: Parameters (Parametri) - Coverage parameters
- **DOC**: Document - Policy documents
- **AGE**: Agency (Agenzia) - Agency/broker info
- **RIS**: Answers (Risposte) - Questionnaire responses
- **RIN**: Risk answers (Risposte Rischio) - Risk-specific responses
- **SFO**, **COA**, **CVP**, **COI**, **PCE**, **LPS**, **PCB**: Other system blocks

**Anagrafica blocks** (entity types):
- **CPERSONA**: Person (Persona)
- **CNATANTE**: Boat (Natante)
- **CIMPRESA**: Company (Impresa)
- **CFABBRICATO**: Building (Fabbricato)
- **CUBICAZIONE**: Location/Address (Ubicazione)
- **CATTIVITA**: Activity (Attività)
- **CVEICOLO**: Vehicle (Veicolo)
- **CENTITASTRINGA**: String entity
- **CGRUPPOANAG**: Anagrafica group
- **CAEROMOBILE**: Aircraft (Aeromobile)
- **CUSISPECIALI**: Special uses
- **CANIMALE**: Animal (Animale)

**Relation blocks**:
- **CRELAZIONERR**: Relation between two entities
- **CRELAZIONEGR**: Group relation
- **CRELAZIONECR**: Incrocio anagrafico (entity ↔ scheda with role)

**Variant blocks** (not yet supported - empty arrays):
- CPERSGRUP, CPERSAERO, CUBICAZGRUP, CUBICAZAERO, CIMPRESAGRUP, CRELAZRRAERO, CRELAZRRGRUP

### Block ID Extraction Algorithm

The application uses a 4-step algorithm (`core/parser.js: extractBlockId`) to extract the block ID:

1. **Exact match**: If block name exists in `BLOCK_DEFINITIONS` → use it
   - Example: "CPERSONA" → ID: "CPERSONA"

2. **Remove numbers**: Strip trailing digits
   - Example: "WGRVBCNT0000" → "WGRVBCNT" → continue

3. **Extract last 3 chars**: Take last 3 characters before numbers
   - Example: "WGRVBCNT0000" → "CNT" → found → use "CNT"
   - Example: "XGRABDOC0123" → "DOC" → found → use "DOC"

4. **Extract last 2 chars**: Take last 2 characters (fallback)
   - Fallback for 2-char IDs

This algorithm supports:
- Current prefix: WGRVB
- Future prefixes: XGRAB, or any other
- Anagrafica blocks with full names
- Variable numeric suffixes (0000, 0001, 0123, etc.)

## Memory Management for Large Files

The application is optimized to handle files up to 8GB through several mechanisms:

### Chunk-based File Reading

- Files are processed in 10MB chunks (configurable via `CHUNK_SIZE`)
- Function `processFileInChunks()` implements streaming file reader
- Incomplete lines between chunks are buffered in `leftover` variable
- Progress bar updates in real-time during chunk processing

### Memory Limits

Three configurable constants in `config/config.js` control memory usage:

```javascript
MAX_FILES = 8               // Maximum files to load at once
MAX_TOTAL_SIZE = 20GB       // Maximum total size of all files combined
MAX_LINES_PER_DOC = 10000   // Max raw lines saved per document
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

**Recommended settings by file size:**
- <1GB: Default settings work fine
- 1-5GB: Consider `MAX_LINES_PER_DOC = 5000`
- 5-8GB: `MAX_LINES_PER_DOC = 1000`

## Common Development Tasks

### Running the Application

1. Open `index.html` in a web browser (no build step required)
2. The application auto-initializes via `js/main.js` (ES6 module)
3. All modules are loaded dynamically

### Development Workflow

**Adding New Features:**
1. Identify the appropriate module (ui/, core/, features/, utils/)
2. Add function to relevant module
3. Export function if needed by other modules
4. Import in consuming modules
5. For UI functions, expose to `window` if needed for inline handlers

**Modifying Block Definitions:**
1. Edit `js/config/blockDefinitions.js`
2. Add/modify block in `BLOCK_DEFINITIONS` object
3. Each field needs: `{ name: 'FIELD_NAME', pos: 0, len: 10 }` (pos relative to 230)

**Debugging Parse Issues:**
- Console log shows detailed parsing for first 10 lines:
  - Block string extracted (positions 200-230)
  - Detected block ID (step-by-step algorithm)
  - Line length
  - Parsing errors
- Set debug=true in extractBlockId for verbose output

### Testing with Sample Data

Create TXT files with lines at least 230 characters long containing:
- Valid header data at positions 0-109
- Block name at positions 200-230 (e.g., "WGRVBCNT0000" for CNT block)
- Block-specific data starting at position 230

## Important Implementation Notes

- All positions in `BLOCK_DEFINITIONS` are **relative to position 230**, not absolute line positions
- **Header extraction**: positions 0-109
- **Versione/Info**: positions 109-200 (ignored, not parsed)
- **Block name extraction**: positions 200-230 (trim trailing spaces)
- **Block data starts**: position 230
- **Block ID extraction**: 4-step algorithm (see above)
- Header already contains: tipo documento, numero documento, and codice prodotto
- The application uses JSZip (CDN: jszip 3.10.1) for ZIP export functionality
- Uses ES6 modules (`<script type="module">`)

### Adding New Block Types

To add support for a new block type:

1. Edit `js/config/blockDefinitions.js`
2. Add block definition with appropriate key:
   - For system blocks: use short ID (e.g., `'CNT'`, `'DOC'`)
   - For anagrafica blocks: use full name (e.g., `'CPERSONA'`)

3. Define fields with positions relative to 200:
   ```javascript
   'NEWBLOCK': [
       { name: 'FIELD_NAME', pos: 0, len: 10 },
       { name: 'ANOTHER_FIELD', pos: 10, len: 5 }
   ]
   ```

4. The extraction algorithm will automatically recognize:
   - System blocks: `[PREFIX]NEWBLOCK[DIGITS]` → extracts `NEWBLOCK`
   - Anagrafica blocks: `NEWBLOCK` → exact match

## Module Dependencies

```
main.js
├── core/fileHandler.js
│   ├── config/config.js
│   ├── config/blockDefinitions.js
│   ├── core/parser.js
│   │   └── config/blockDefinitions.js
│   ├── core/state.js
│   ├── ui/dom.js
│   ├── ui/table.js (dynamic import)
│   └── utils/utils.js
├── ui/dom.js
├── ui/table.js
│   ├── core/state.js
│   └── ui/dom.js
├── ui/modal.js (stub)
├── ui/filters.js (stub)
└── features/download.js (stub)
```

## Migration Notes

The original monolithic file (`analizzatore-tracciati.html`) has been refactored into modules. Key modules (modal, filters, download) are currently stubs and need full implementation migrated from the original file.

**To complete migration:**
1. Implement full `modal.js` (lines 2031-2330 from original)
2. Implement full `filters.js` (lines 2333-2490 from original)
3. Implement full `download.js` (lines 1883-2030 from original)

## Language & Localization

All UI text is in Italian. Field names follow Italian insurance industry conventions.
