# Struttura Parsing Tracciati

Documentazione completa della struttura dei file tracciato e dell'algoritmo di parsing utilizzato dall'applicazione.

## 📐 Struttura Linea Tracciato

Ogni linea di un file tracciato segue una struttura fixed-width a 4 sezioni:

```
┌─────────────┬──────────────────┬────────────────────┬───────────────────┐
│   HEADER    │    VERSIONE      │   NOME BLOCCO      │   DATI BLOCCO     │
│   0-109     │    109-200       │     200-230        │      230+         │
│  (109 char) │    (91 char)     │    (30 char)       │    (variabile)    │
└─────────────┴──────────────────┴────────────────────┴───────────────────┘
```

**Lunghezza minima linea**: 230 caratteri

### Esempio Completo

```
GRADPANA  2025-10-042025-10-04000072300100005016550160000000...2025.10.3.1...WGRVBCNT0000+001+0000501655016+0000000...
│         │         │         │                                │             │           │
0         10        20        37                              109          200         230
│◄──────  HEADER (109 char)  ──────────────────────────────►│◄─VERSIONE──►│◄─BLOCCO──►│◄─DATI
```

---

## 📝 Sezione 1: HEADER (Posizioni 0-109)

L'header contiene i metadati comuni a tutte le righe di un documento. È **sempre presente** e identifica univocamente il documento.

### Mappa Posizioni Header

| Campo | Posizione | Lunghezza | Formato | Descrizione |
|-------|-----------|-----------|---------|-------------|
| **IDENTIFICATIVO** | 0-10 | 10 | Testo | Identificatore sistema (es. "GRADPANA  ") |
| **DATA_1** | 10-20 | 10 | aaaa-mm-gg | Prima data (es. "2025-10-04") |
| **DATA_2** | 20-30 | 10 | aaaa-mm-gg | Seconda data (es. "2025-10-04") |
| **CAMPO_7** | 30-37 | 7 | Numerico | Campo riservato |
| **COD_COMPAGNIA** | 37-40 | 3 | Numerico | Codice compagnia assicurativa (es. "001") |
| **NUM_CONTRATTO** | 40-53 | 13 | Alfanumerico | Numero contratto (es. "0000501655016") |
| **PRG_CONTRATTO** | 53-60 | 7 | Numerico | Progressivo contratto (es. "0000000") |
| **CAMPO_8** | 60-68 | 8 | Vario | Campo riservato |
| **DAT_RIFERIMENTO** | 68-78 | 10 | aaaa-mm-gg | Data di riferimento documento |
| **TIP_DOCUMENTO** | 78-81 | 3 | Alfanumerico | Tipo documento (es. "KPO", "DOC") |
| **CAMPO_2** | 81-83 | 2 | Vario | Campo riservato |
| **COD_PRODOTTO** | 83-86 | 3 | Alfanumerico | Codice prodotto (es. "061", "ABC") |
| **NUM_DOCUMENTO** | 86-99 | 13 | Alfanumerico | Numero documento (uguale a contratto) |
| **CAMPO_10** | 99-109 | 10 | Vario | Campo riservato |

### Chiave Documento

Un documento è identificato univocamente dalla combinazione:

```javascript
const documentKey = `${COD_COMPAGNIA}-${NUM_CONTRATTO}-${PRG_CONTRATTO}`
// Esempio: "001-0000501655016-0000000"
```

Tutte le righe con la stessa chiave appartengono allo stesso documento.

### Codice Estrazione Header

```javascript
function extractHeaderData(line) {
    if (line.length < 109) return null;

    return {
        identificativo: line.substring(0, 10).trim(),
        data1: line.substring(10, 20).trim(),
        data2: line.substring(20, 30).trim(),
        campo7: line.substring(30, 37).trim(),
        codCompagnia: line.substring(37, 40).trim(),
        numContratto: line.substring(40, 53).trim(),
        prgContratto: line.substring(53, 60).trim(),
        campo8: line.substring(60, 68).trim(),
        datRiferimento: line.substring(68, 78).trim(),
        tipDocumento: line.substring(78, 81).trim(),
        campo2: line.substring(81, 83).trim(),
        codProdotto: line.substring(83, 86).trim(),
        numDocumento: line.substring(86, 99).trim(),
        campo10: line.substring(99, 109).trim()
    };
}
```

---

## 🔖 Sezione 2: VERSIONE (Posizioni 109-200)

Contiene la versione del tracciato e metadati aggiuntivi.

- **Lunghezza**: 91 caratteri
- **Formato**: Stringa di versione (es. "2025.10.3.1") + padding con spazi
- **Parsing**: **Non utilizzata** dall'applicazione - ignorata

---

## 🏷️ Sezione 3: NOME BLOCCO (Posizioni 200-230)

Identifica il tipo di blocco della riga corrente.

- **Lunghezza**: 30 caratteri
- **Allineamento**: Sinistra (left-aligned)
- **Padding**: Spazi trailing a destra

### Formati Supportati

#### Blocchi Sistema (con prefisso variabile)

Formato: `[PREFISSO][ID][NUMERO]`

Esempi:
```
WGRVBCNT0000    → ID: CNT (contratto)
WGRVBSCH0001    → ID: SCH (scheda)
WGRVBDOC0123    → ID: DOC (documento)
XGRABPAX9999    → ID: PAX (parametri - prefisso futuro)
```

- **PREFISSO**: può essere `WGRVB`, `XGRAB`, o altri futuri (5-6 char)
- **ID**: identificatore blocco (2-3 caratteri)
- **NUMERO**: suffisso numerico (4 cifre, può variare)

#### Blocchi Anagrafica (nome completo)

Formato: Nome completo senza prefisso

Esempi:
```
CPERSONA        → Persona fisica
CIMPRESA        → Azienda
CVEICOLO        → Veicolo
CFABBRICATO     → Edificio
CUBICAZIONE     → Indirizzo/Ubicazione
CNATANTE        → Imbarcazione
```

- Sempre iniziano con 'C'
- Nome completo (non abbreviato)
- Nessun suffisso numerico

#### Blocchi Relazione

Esempi:
```
CRELAZIONERR    → Relazione tra due entità
CRELAZIONEGR    → Relazione di gruppo
CRELAZIONECR    → Incrocio anagrafico (entità ↔ scheda con ruolo)
```

---

## 🔍 Algoritmo Estrazione Block ID

L'applicazione usa un algoritmo a **4 step** per estrarre l'ID del blocco dal nome:

### Step 1: Match Esatto

Cerca il nome completo nelle definizioni.

```javascript
if (BLOCK_DEFINITIONS[blockName]) {
    return blockName;  // Es: "CPERSONA" → "CPERSONA"
}
```

**Casi d'uso**: Blocchi anagrafica e relazione (nome completo)

### Step 2: Rimozione Numeri

Rimuove i numeri trailing dal nome.

```javascript
const withoutNumbers = blockName.replace(/\d+$/, '');
// "WGRVBCNT0000" → "WGRVBCNT"
// "XGRABSCH9999" → "XGRABSCH"
```

### Step 3: Estrazione Ultimi 3 Caratteri

Prende gli ultimi 3 caratteri del nome senza numeri.

```javascript
if (withoutNumbers.length >= 3) {
    const blockCode = withoutNumbers.slice(-3);
    if (BLOCK_DEFINITIONS[blockCode]) {
        return blockCode;  // "WGRVBCNT" → "CNT" ✓
    }
}
```

**Casi d'uso**: Blocchi sistema con ID a 3 caratteri (CNT, SCH, DOC, PAX, ecc.)

### Step 4: Estrazione Ultimi 2 Caratteri (Fallback)

Prende gli ultimi 2 caratteri come fallback per ID corti.

```javascript
if (withoutNumbers.length >= 2) {
    const blockCode2 = withoutNumbers.slice(-2);
    if (BLOCK_DEFINITIONS[blockCode2]) {
        return blockCode2;  // Fallback per ID a 2 char
    }
}
```

### Esempio Completo

```
Input: "WGRVBCNT0000"

Step 1: "WGRVBCNT0000" non in BLOCK_DEFINITIONS
Step 2: Remove numbers → "WGRVBCNT"
Step 3: Last 3 chars → "CNT" → FOUND in BLOCK_DEFINITIONS ✓
Result: "CNT"
```

```
Input: "CPERSONA    " (con spazi)

Step 1: "CPERSONA" in BLOCK_DEFINITIONS ✓
Result: "CPERSONA"
```

### Supporto Prefissi Futuri

L'algoritmo è **agnostico al prefisso**, quindi supporta automaticamente:

- **WGRVB** (attuale)
- **XGRAB** (futuro)
- Qualsiasi altro prefisso
- Suffissi numerici variabili (0000, 0001, 9999, ecc.)

---

## 📦 Sezione 4: DATI BLOCCO (Posizioni 230+)

Contiene i dati specifici del blocco, in formato fixed-width.

- **Inizio**: Posizione 230
- **Lunghezza**: Variabile per tipo blocco
- **Formato**: Fixed-width fields definiti in `BLOCK_DEFINITIONS`

### Esempio: Blocco CNT (Contratto)

```javascript
'CNT': [
    { name: 'COD_COMP', pos: 0, len: 4 },          // Posizione 230-234
    { name: 'NUM_CONTRATTO', pos: 4, len: 14 },    // Posizione 234-248
    { name: 'PRG_CONTRATTO', pos: 18, len: 8 },    // Posizione 248-256
    { name: 'DAT_DECORRENZA', pos: 26, len: 10 },  // Posizione 256-266
    // ...
]
```

**IMPORTANTE**: Tutte le posizioni in `BLOCK_DEFINITIONS` sono **relative alla posizione 230**, non assolute.

### Parsing Dati Blocco

```javascript
function parseBlockData(line, blockId) {
    const definition = BLOCK_DEFINITIONS[blockId];
    if (!definition || line.length < 230) return null;

    const dataStart = 230;  // Inizio dati blocco
    const blockData = {};

    for (const field of definition) {
        const start = dataStart + field.pos;
        const end = start + field.len;
        blockData[field.name] = line.substring(start, end).trim();
    }

    return blockData;
}
```

---

## 🔄 Workflow Parsing Completo

### 1. Lettura File

```javascript
// Lettura chunk-based (10MB per volta)
const CHUNK_SIZE = 10 * 1024 * 1024;
const chunk = file.slice(offset, offset + CHUNK_SIZE);
const text = await chunk.text();
const lines = text.split('\n');
```

### 2. Parsing Linea

Per ogni linea:

```javascript
// 1. Verifica lunghezza minima
if (line.length < 230) continue;

// 2. Estrai header
const header = extractHeaderData(line);
if (!header) continue;

// 3. Crea chiave documento
const key = `${header.codCompagnia}-${header.numContratto}-${header.prgContratto}`;

// 4. Estrai block ID
const blockName = line.substring(200, 230).trim();
const blockId = extractBlockId(blockName);

// 5. Parsa dati blocco
if (blockId) {
    const blockData = parseBlockData(line, blockId);
    // Salva in doc.blocks[blockId]
}
```

### 3. Raggruppamento Documenti

Tutte le righe con la stessa chiave `${codCompagnia}-${numContratto}-${prgContratto}` vengono raggruppate in un unico documento.

```javascript
const doc = {
    header: extractHeaderData(firstLine),
    blocks: {
        'CNT': [ {...}, {...} ],  // Array di righe CNT
        'SCH': [ {...}, {...} ],  // Array di righe SCH
        'CPERSONA': [ {...} ]     // Array di righe CPERSONA
    },
    lines: [...],                  // Righe raw (opzionale)
    totalLinesProcessed: 150,
    linesTruncated: false
};
```

---

## ⚡ Ottimizzazioni

### Gestione Memoria

1. **Parsing a chunk**: File letti 10MB alla volta
2. **Limite righe raw**: Solo prime `MAX_LINES_PER_DOC` righe salvate in memoria
3. **Dati blocchi sempre completi**: Parsing incrementale durante lettura
4. **Ricarica on-demand**: Righe complete ricaricate quando necessario

### Performance

- **Stream processing**: Elaborazione incrementale senza caricare tutto in RAM
- **Early skip**: Righe troppo corte ignorate immediatamente
- **Cache header**: Header parsato una sola volta per riga
- **Batch updates**: Aggiornamento UI ogni chunk, non per riga

---

## 📋 Note Implementative

### Differenze Header vs Blocco

Alcuni campi appaiono sia nell'header che nei blocchi con **lunghezze diverse**:

| Campo | Header | Blocco CNT |
|-------|--------|------------|
| `PRG_CONTRATTO` | 7 char (pos 53-60) | 8 char (pos relativa 18, len 8) |

Questa è una caratteristica del formato, non un bug.

### Gestione Spazi

- **Header**: Campi trimmed (spazi trailing rimossi)
- **Block name**: Trimmed
- **Block data**: Trimmed field per field

### Encoding

- **Supportato**: UTF-8
- **Fallback**: Latin-1 per file legacy

---

## 🔗 File Correlati

- [BLOCK_DEFINITIONS.md](./BLOCK_DEFINITIONS.md) - Definizioni complete di tutti i blocchi
- [README.md](./README.md) - Documentazione generale dell'applicazione
- `js/core/parser.js` - Implementazione parsing
- `js/config/blockDefinitions.js` - Definizioni blocchi (codice)

---

**Versione documento**: 1.0.0
**Ultimo aggiornamento**: 2025-01-07
