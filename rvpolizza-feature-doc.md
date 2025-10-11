# Feature: Visualizzazione Struttura RVPolizza con Filtri Avanzati

## Indice
1. [Contesto](#contesto)
2. [Formato File Tracciato](#formato-file-tracciato)
3. [Struttura Dati RVPolizza](#struttura-dati-rvpolizza)
4. [Requisiti Funzionali](#requisiti-funzionali)
5. [Sistema di Filtri](#sistema-di-filtri)
6. [Specifiche Tecniche](#specifiche-tecniche)
7. [User Stories](#user-stories)
8. [Criteri di Accettazione](#criteri-di-accettazione)
9. [Riferimenti Codice](#riferimenti-codice)

---

## Contesto

Sviluppo di una feature per visualizzare la struttura gerarchica di una **RVPolizza** (polizza Rami Vari) analizzata da **file di testo in formato tracciato fisso**. 

### Caratteristiche File

- **Formato**: File di testo (.txt) con formato fixed-width
- **Contenuto**: Multipli documenti/polizze nello stesso file
- **Struttura linea**: `[0-109: Header][109-200: Versione][200-230: Nome Blocco][230+: Dati Blocco]`
- **Lunghezza minima linea**: 230 caratteri
- **Encoding**: UTF-8 (fallback Latin-1 per file legacy)
- **Dimensione**: Fino a 8GB per file

### Identificazione Documenti

Ogni documento (polizza) è identificato univocamente dalla chiave estratta dall'header:
```javascript
const docKey = `${COD_COMPAGNIA}-${NUM_CONTRATTO}-${PRG_CONTRATTO}-${NUM_DOCUMENTO}`;
// Esempio: "001-0000501655016-0000000-0000501655016"
```

**Tutte le righe con la stessa chiave appartengono allo stesso documento.**

Un singolo file può contenere:
- 1 documento con centinaia di righe
- Decine di documenti diversi (con NUM_DOCUMENTO differenti)
- Mix di prodotti diversi (es. 061, 205, 454, etc.)
- Variazioni dello stesso contratto (stesso NUM_CONTRATTO, NUM_DOCUMENTO diversi)

**Obiettivo principale:** Fornire una visualizzazione interattiva e completamente filtrabile della struttura della polizza per analisi, debugging e reporting.

---

## Formato File Tracciato

### Caratteristiche File

**Nome file**: Qualsiasi nome con estensione .txt
- Esempio: `tracciato_polizze.txt`, `export_2025.txt`, `dati.txt`
- Il nome file non segue convenzioni specifiche

**Contenuto**: 
- Formato fixed-width (posizioni fisse per ogni campo)
- Contiene **multipli documenti/polizze** nello stesso file
- Ogni documento identificato dalla chiave `${COD_COMP}-${NUM_CONTRATTO}-${PRG_CONTRATTO}`
- Può contenere mix di prodotti diversi (061, 205, 454, etc.)

**Esempio contenuto file:**
```
# Documento 1 - Polizza prodotto 061 (RCA Auto)
# Chiave: 001-0000501655016-0000000-0000501655016
GRADPANA  2025-10-04...001...0000501655016...0000000...061...0000501655016...WGRVBCNT0000...
GRADPANA  2025-10-04...001...0000501655016...0000000...061...0000501655016...WGRVBSCH0001...
GRADPANA  2025-10-04...001...0000501655016...0000000...061...0000501655016...WGRVBPRT0001...
GRADPANA  2025-10-04...001...0000501655016...0000000...061...0000501655016...CPERSONA...

# Documento 2 - Polizza prodotto 205 (Multirischio Casa)
# Chiave: 001-0000501655017-0000000-0000501655017
GRADPANA  2025-10-04...001...0000501655017...0000000...205...0000501655017...WGRVBCNT0000...
GRADPANA  2025-10-04...001...0000501655017...0000000...205...0000501655017...WGRVBSCH0001...
GRADPANA  2025-10-04...001...0000501655017...0000000...205...0000501655017...CFABBRICATO...

# Documento 3 - Variazione/Appendice polizza 061 (stesso contratto, documento diverso)
# Chiave: 001-0000501655016-0000000-0000501655018
GRADPANA  2025-10-05...001...0000501655016...0000000...061...0000501655018...WGRVBCNT0000...
...
```

### Struttura Linea Tracciato

Ogni linea segue una struttura fixed-width a 4 sezioni:

```
┌─────────────┬──────────────────┬────────────────────┬───────────────────┐
│   HEADER    │    VERSIONE      │   NOME BLOCCO      │   DATI BLOCCO     │
│   0-109     │    109-200       │     200-230        │      230+         │
│  (109 char) │    (91 char)     │    (30 char)       │    (variabile)    │
└─────────────┴──────────────────┴────────────────────┴───────────────────┘
```

**Esempio linea completa:**
```
GRADPANA  2025-10-042025-10-04000072300100005016550160000000...2025.10.3.1...WGRVBCNT0000+001+0000501655016...
│         │         │         │                                │             │           │
0         10        20        37                              109          200         230
```

### Sezione 1: HEADER (Posizioni 0-109)

Contiene i metadati identificativi del documento:

| Campo | Pos | Len | Formato | Descrizione |
|-------|-----|-----|---------|-------------|
| **IDENTIFICATIVO** | 0-10 | 10 | Testo | ID sistema (es. "GRADPANA  ") |
| **DATA_1** | 10-20 | 10 | aaaa-mm-gg | Prima data |
| **DATA_2** | 20-30 | 10 | aaaa-mm-gg | Seconda data |
| **CAMPO_7** | 30-37 | 7 | Numerico | Riservato |
| **COD_COMPAGNIA** | 37-40 | 3 | Numerico | Codice compagnia (es. "001") |
| **NUM_CONTRATTO** | 40-53 | 13 | Alfanum | Numero contratto |
| **PRG_CONTRATTO** | 53-60 | 7 | Numerico | Progressivo contratto |
| **CAMPO_8** | 60-68 | 8 | Vario | Riservato |
| **DAT_RIFERIMENTO** | 68-78 | 10 | aaaa-mm-gg | Data riferimento |
| **TIP_DOCUMENTO** | 78-81 | 3 | Alfanum | Tipo doc (KPO, DOC) |
| **CAMPO_2** | 81-83 | 2 | Vario | Riservato |
| **COD_PRODOTTO** | 83-86 | 3 | Alfanum | Codice prodotto (es. 061, 205, 454) |
| **NUM_DOCUMENTO** | 86-99 | 13 | Alfanum | Numero documento |
| **CAMPO_10** | 99-109 | 10 | Vario | Riservato |

**Chiave documento:**
```javascript
const docKey = `${COD_COMPAGNIA}-${NUM_CONTRATTO}-${PRG_CONTRATTO}-${NUM_DOCUMENTO}`;
// Esempio: "001-0000501655016-0000000-0000501655016"
```

**Importante**: NUM_DOCUMENTO fa parte della chiave identificativa perché:
- Lo stesso contratto può avere documenti multipli (emissione iniziale, appendici, variazioni)
- Ogni documento rappresenta uno stato/versione diversa del contratto
- Esempio: 
  - `001-0000501655016-0000000-0000501655016` → Emissione iniziale
  - `001-0000501655016-0000000-0000501655018` → Appendice/Variazione

**Codici Prodotto (esempi comuni):**
- **061**: RCA Autoveicoli
- **205**: Multirischio Casa
- **454**: Infortuni
- Altri codici a 3 cifre per diversi prodotti assicurativi

L'applicazione supporta **qualsiasi codice prodotto** presente nei tracciati, non è limitata a prodotti specifici.

### Sezione 2: VERSIONE (Posizioni 109-200)

- **Lunghezza**: 91 caratteri
- **Contenuto**: Stringa versione (es. "2025.10.3.1") + padding spazi
- **Uso**: Ignorata dal parser (non utilizzata)

### Sezione 3: NOME BLOCCO (Posizioni 200-230)

- **Lunghezza**: 30 caratteri
- **Formato**: Nome blocco allineato a sinistra + spazi
- **Esempi**: 
  - Sistema: `WGRVBCNT0000` (estratto → `CNT`)
  - Anagrafica: `CPERSONA` (match esatto)

**Algoritmo identificazione blocco (4 step):**
1. **Match esatto**: `CPERSONA` → trovato ✓
2. **Rimuovi numeri**: `WGRVBCNT0000` → `WGRVBCNT`
3. **Ultimi 3 char**: `WGRVBCNT` → `CNT` → trovato ✓
4. **Ultimi 2 char**: fallback per ID a 2 caratteri

### Sezione 4: DATI BLOCCO (Posizioni 230+)

- **Lunghezza**: Variabile per blocco
- **Posizioni**: Tutte relative a 230 (non assolute)
- **Formato**: Fixed-width per ogni campo

### Blocchi Supportati (30+ tipi)

#### Blocchi Sistema (15 tipi)
| Blocco | Nome | Descrizione |
|--------|------|-------------|
| **CNT** | Contratto | Dati principali polizza (43 campi) |
| **SCH** | Scheda | Dettagli coperture (24 campi) |
| **PRT** | Partita | Calcolo premio (23 campi) |
| **PAX** | Parametri | Parametri copertura (17 campi) |
| **DOC** | Documento | Documenti polizza (40 campi) |
| **RIS** | Risposte | Risposte questionari (9 campi) |
| **RIN** | Risposte Rischio | Risposte su rischio (10 campi) |
| **SFO** | Sforatura | Autorizzazioni (11 campi) |
| **AGE** | Agenzia | Agenzia/Broker (16 campi) |
| **COA** | Coassicurazione | Quote coassicurazione (15 campi) |
| **CVP** | Convenzione Particolare | Convenzioni (17 campi) |
| **COI** | Contratto Info | Dati aggiuntivi (16 campi) |
| **PCE** | Parametri Comunicazione | (13 campi) |
| **LPS** | Loss Portfolio | (19 campi) |
| **PCB** | Partita Contributo Base | (7 campi) |

#### Blocchi Anagrafica (12 tipi)
| Blocco | Nome Completo | Descrizione |
|--------|---------------|-------------|
| **CPERSONA** | Persona Fisica | Anagrafica persona (36 campi) |
| **CIMPRESA** | Impresa | Anagrafica azienda (23 campi) |
| **CVEICOLO** | Veicolo | Dati veicolo (26 campi) |
| **CFABBRICATO** | Fabbricato | Edificio (19 campi) |
| **CUBICAZIONE** | Ubicazione | Indirizzo (20 campi) |
| **CNATANTE** | Natante | Imbarcazione (50 campi) |
| **CATTIVITA** | Attività | Attività economica (8 campi) |
| **CENTITASTRINGA** | Entità Stringa | (11 campi) |
| **CGRUPPOANAG** | Gruppo Anagrafico | (14 campi) |
| **CAEROMOBILE** | Aeromobile | Aereo (21 campi) |
| **CUSISPECIALI** | Usi Speciali | (7 campi) |
| **CANIMALE** | Animale | (10 campi) |

#### Blocchi Relazione (3 tipi)
| Blocco | Descrizione |
|--------|-------------|
| **CRELAZIONERR** | Relazione Rischio-Rischio (7 campi) |
| **CRELAZIONEGR** | Relazione Gruppo (8 campi) |
| **CRELAZIONECR** | Relazione Contraente-Rischio con ruolo (17 campi) |

### Esempi Blocchi Chiave

#### Blocco CNT (Contratto)
```
Posizione 230+:
+001              → COD_COMP (4 char)
+0000501655016    → NUM_CONTRATTO (14 char)  
+0000000          → PRG_CONTRATTO (8 char)
KPO               → TIP_DOCUMENTO (3 char)
2025-10-04        → DAT_DECORRENZA (10 char)
2026-10-04        → DAT_SCADENZA (10 char)
... (37 campi aggiuntivi)
```

#### Blocco SCH (Scheda)
```
Posizione 230+:
+001              → COD_COMP (4 char)
+0000501655016    → NUM_CONTRATTO (14 char)
+0000000          → PRG_CONTRATTO (8 char)
+00000001         → PRG_SCHEDA (8 char)
+061              → COD_PRODOTTO (3 char) - esempio: 061, 205, 454, etc.
... (19 campi aggiuntivi)
```

#### Blocco PRT (Partita)
```
Posizione 230+:
+001              → COD_COMP (4 char)
+0000501655016    → NUM_CONTRATTO (14 char)
+0000000          → PRG_CONTRATTO (8 char)
+00000001         → PRG_SCHEDA (8 char)
+00000001         → PRG_PARTITA (8 char)
RCA01             → COD_GARANZIA (6 char)
+000000500.00     → IMP_PREMIO_NETTO (14 char)
... (16 campi aggiuntivi)
```

#### Blocco CPERSONA (Persona)
```
Posizione 230+:
P                 → COD_TIPO_EA (2 char)
+0000000123       → COD_KEY_EA (11 char)
ROSSI             → TXT_COGNOME (40 char)
MARIO             → TXT_NOME (40 char)
RSSMRA80A01H501Z  → COD_FISCALE (16 char)
... (31 campi aggiuntivi)
```

#### Blocco CRELAZIONECR (Relazione Contraente-Rischio)
```
Posizione 230+:
+0000000123       → COD_KEY_CR (11 char)
+0000000456       → COD_KEY_RR (11 char)
ICR_Contraente    → TIP_RELAZIONE (14 char)
+001              → COD_COMP (4 char)
+0000501655016    → NUM_CONTRATTO (14 char)
+00000001         → PRG_SCHEDA (8 char)
... (11 campi aggiuntivi)
```

---

## Struttura Dati RVPolizza

### Mapping Blocchi → Struttura Gerarchica

La RVPolizza viene costruita aggregando i blocchi del tracciato secondo questa gerarchia:

```
RVPolizza (documento)
│
├── 📋 Dati Contratto (da blocchi CNT + DOC)
│   └── Blocchi: CNT (principale), DOC (documenti correlati)
│
├── 👥 GruppoContraenti
│   ├── Entità (da blocchi CPERSONA, CIMPRESA via CRELAZIONECR)
│   │   └── Filtro: TIP_RELAZIONE = 'ICR_Contraente'
│   ├── RecapitoQuietanza (da CUBICAZIONE via CRELAZIONECR)
│   │   └── Filtro: TIP_RELAZIONE = 'ICR_RecapitoQuietanza'
│   └── IBAN (da CRELAZIONECR)
│       └── Filtro: TIP_RELAZIONE = 'ICR_ContoCorrente'
│
└── 👨‍👩‍👧‍👦 GruppiAssicurati[] (costruiti da blocchi SCH)
    └── Per ogni PRG_GRUPPO univoco:
        │
        ├── Entità Assicurate (da blocchi anagrafica via CRELAZIONECR)
        │   ├── Blocchi: CPERSONA, CIMPRESA, CVEICOLO, CFABBRICATO, etc.
        │   └── Filtro: TIP_RELAZIONE = 'ICR_Assicurato'
        │
        └── Schede[] (da blocchi SCH)
            └── Per ogni PRG_SCHEDA:
                │
                ├── Dati Scheda (da blocco SCH)
                │   ├── COD_PRODOTTO
                │   ├── Descrizione
                │   ├── Date validità
                │   └── Altri campi (24 totali)
                │
                └── Partite[] (da blocchi PRT)
                    └── Per ogni PRG_PARTITA:
                        │
                        ├── Dati Partita (da blocco PRT)
                        │   ├── COD_GARANZIA
                        │   ├── IMP_PREMIO_NETTO/LORDO
                        │   ├── IMP_SOMMA_ASS
                        │   └── Altri campi (23 totali)
                        │
                        └── Parametri (da blocchi PAX)
                            └── Parametri addizionali copertura
```

### Costruzione Documenti da File Tracciato

#### 1. Raggruppamento Righe
```javascript
// Durante il parsing del file
lines.forEach(line => {
    const header = extractHeaderData(line); // pos 0-109
    const docKey = `${header.codCompagnia}-${header.numContratto}-${header.prgContratto}-${header.numDocumento}`;
    
    // Crea documento se non esiste
    if (!documents[docKey]) {
        documents[docKey] = {
            header: header,
            blocks: {}
        };
    }
    
    // Estrai blocco
    const blockName = line.substring(200, 230).trim();
    const blockId = extractBlockId(blockName); // CNT, SCH, CPERSONA, etc.
    const blockData = parseBlockData(line, blockId); // pos 230+
    
    // Aggrega blocchi per tipo
    if (!documents[docKey].blocks[blockId]) {
        documents[docKey].blocks[blockId] = [];
    }
    documents[docKey].blocks[blockId].push(blockData);
});
```

#### 2. Costruzione Gerarchia
```javascript
function buildRVPolizza(document) {
    const polizza = {
        contratto: parseContratto(document.blocks['CNT']),
        gruppoContraenti: buildGruppoContraenti(document),
        gruppiAssicurati: buildGruppiAssicurati(document)
    };
    return polizza;
}

function buildGruppiAssicurati(document) {
    const gruppi = [];
    const schedeBlocks = document.blocks['SCH'] || [];
    
    // Raggruppa schede per PRG_GRUPPO
    const schedeByGruppo = _.groupBy(schedeBlocks, 'PRG_GRUPPO');
    
    Object.entries(schedeByGruppo).forEach(([prgGruppo, schede]) => {
        const gruppo = {
            progressivo: prgGruppo,
            entita: findEntitaForGruppo(document, prgGruppo),
            schede: schede.map(schedaBlock => ({
                progressivo: schedaBlock.PRG_SCHEDA,
                codiceProdotto: schedaBlock.COD_PRODOTTO,
                // ... altri campi da SCH
                partite: findPartiteForScheda(document, schedaBlock.PRG_SCHEDA)
            }))
        };
        gruppi.push(gruppo);
    });
    
    return gruppi;
}

function findPartiteForScheda(document, prgScheda) {
    const partiteBlocks = document.blocks['PRT'] || [];
    return partiteBlocks
        .filter(p => p.PRG_SCHEDA === prgScheda)
        .map(partitaBlock => ({
            progressivo: partitaBlock.PRG_PARTITA,
            codiceGaranzia: partitaBlock.COD_GARANZIA,
            premioNetto: parseFloat(partitaBlock.IMP_PREMIO_NETTO),
            premioLordo: parseFloat(partitaBlock.IMP_PREMIO_LORDO),
            sommaAssicurata: parseFloat(partitaBlock.IMP_SOMMA_ASS),
            // ... altri campi da PRT
        }));
}

function findEntitaForGruppo(document, prgGruppo) {
    const relazioni = document.blocks['CRELAZIONECR'] || [];
    const entita = [];
    
    // Trova relazioni per questo gruppo con ruolo Assicurato
    const relazioniGruppo = relazioni.filter(r => 
        r.PRG_GRUPPO === prgGruppo && 
        r.TIP_RELAZIONE === 'ICR_Assicurato'
    );
    
    relazioniGruppo.forEach(rel => {
        // Trova entità anagrafica corrispondente
        const keyEA = rel.COD_KEY_RR;
        const tipoEA = rel.COD_TIPO_EA;
        
        // Cerca nei blocchi anagrafica appropriati
        ['CPERSONA', 'CIMPRESA', 'CVEICOLO', 'CFABBRICATO', 'CUBICAZIONE'].forEach(blockType => {
            const blocks = document.blocks[blockType] || [];
            const match = blocks.find(b => b.COD_KEY_EA === keyEA);
            if (match) {
                entita.push({
                    tipo: blockType,
                    key: keyEA,
                    dati: match
                });
            }
        });
    });
    
    return entita;
}
```

### Gerarchia Completa con Campi Chiave

```
RVPolizza (root)
│
├── 📋 Dati Generali Contratto (BLOCCO CNT)
│   ├── COD_COMP (4 char)
│   ├── NUM_CONTRATTO (14 char)
│   ├── PRG_CONTRATTO (8 char)
│   ├── NUM_DOCUMENTO (14 char) ⭐ Parte chiave documento
│   ├── TIP_DOCUMENTO (3 char)
│   ├── DAT_DECORRENZA (10 char, aaaa-mm-gg)
│   ├── DAT_SCADENZA (10 char, aaaa-mm-gg)
│   ├── NUM_AGENZIA (8 char)
│   ├── COD_PRODOTTO (3 char)
│   ├── COD_VALUTA (4 char)
│   ├── TIP_CONVENZ (1 char, S/N)
│   ├── COD_STATO (1 char)
│   ├── FLG_PREVENT (1 char, S/N)
│   ├── TIP_STRUTTURA (2 char)
│   │   - SI: Standard
│   │   - PM/AM: Polizza Moduli
│   │   - CN: Cover Note
│   │   - CC: Conferma Copertura
│   │   - CF: Certificato
│   │   - CM: Convenzione MGEN
│   │   - PQ/AQ: Polizza Quadro
│   └── ... (33 campi aggiuntivi)
│
├── 👥 GruppoContraenti
│   ├── Lista Entità (BLOCCHI CPERSONA, CIMPRESA via CRELAZIONECR)
│   │   └── Filtro: TIP_RELAZIONE = 'ICR_Contraente'
│   │       ├── COD_KEY_EA (11 char) - Chiave entità
│   │       ├── Per CPERSONA:
│   │       │   ├── TXT_COGNOME (40 char)
│   │       │   ├── TXT_NOME (40 char)
│   │       │   ├── COD_FISCALE (16 char)
│   │       │   ├── DAT_NASCITA (10 char)
│   │       │   └── ... (32 campi aggiuntivi)
│   │       └── Per CIMPRESA:
│   │           ├── TXT_RAGI_SOCI (40 char) - Ragione sociale
│   │           ├── COD_FISCALE (16 char)
│   │           ├── PARTITA_IVA (11 char)
│   │           └── ... (20 campi aggiuntivi)
│   │
│   ├── RecapitoQuietanza (BLOCCO CUBICAZIONE via CRELAZIONECR)
│   │   └── Filtro: TIP_RELAZIONE = 'ICR_RecapitoQuietanza'
│   │       ├── TXT_INDIRIZZO (40 char)
│   │       ├── TXT_COMUNE (26 char)
│   │       ├── COD_CAP (5 char)
│   │       └── ... (17 campi aggiuntivi)
│   │
│   └── IBAN (da CRELAZIONECR con TIP_RELAZIONE = 'ICR_ContoCorrente')
│
└── 👨‍👩‍👧‍👦 GruppiAssicurati[] (BLOCCHI SCH raggruppati per PRG_GRUPPO)
    └── Per ogni Gruppo:
        │
        ├── PRG_GRUPPO (8 char) - da SCH
        ├── Categoria Rischio (dal tipo entità prevalente)
        │
        ├── Lista Entità (BLOCCHI anagrafica via CRELAZIONECR)
        │   └── Filtro: TIP_RELAZIONE = 'ICR_Assicurato'
        │       ├── CPERSONA - Persona fisica
        │       ├── CIMPRESA - Azienda
        │       ├── CVEICOLO - Veicolo
        │       │   ├── TXT_TARGA (12 char)
        │       │   ├── COD_MARCA (6 char)
        │       │   ├── COD_MODELLO (6 char)
        │       │   └── ... (23 campi aggiuntivi)
        │       ├── CFABBRICATO - Edificio
        │       │   ├── TIP_FABBR (6 char)
        │       │   ├── ANNO_COSTR (4 char)
        │       │   └── ... (17 campi aggiuntivi)
        │       ├── CUBICAZIONE - Indirizzo
        │       ├── CNATANTE - Natante
        │       │   ├── TXT_TARGA (15 char)
        │       │   ├── COD_MARCA (6 char)
        │       │   ├── ANNO_COST (4 char)
        │       │   └── ... (47 campi aggiuntivi)
        │       └── Altri blocchi anagrafica...
        │
        └── Schede[] (BLOCCHI SCH)
            └── Per ogni Scheda:
                │
                ├── PRG_SCHEDA (8 char)
                ├── COD_PRODOTTO (3 char)
                ├── TXT_DESCR_PRODOTTO (40 char)
                ├── COD_MODULO (opzionale se prodotto modulare)
                ├── COD_STATO_SCH (1 char)
                ├── DAT_INIZ_VALI (10 char)
                ├── DAT_FINE_VALI (10 char)
                ├── FLG_CARICATA (boolean, derivato)
                ├── FLG_EXTERNAL (boolean, derivato)
                └── ... (16 campi aggiuntivi)
                │
                └── Partite[] (BLOCCHI PRT)
                    └── Per ogni Partita:
                        │
                        ├── PRG_PARTITA (8 char)
                        ├── COD_GARANZIA (6 char)
                        ├── TXT_DESCR_GAR (40 char)
                        ├── TIP_GARANZIA (2 char)
                        │   - B: Base
                        │   - A: Accessoria
                        │   - C: Clausola
                        ├── IMP_SOMMA_ASS (14 char, formato +000000000.00)
                        ├── IMP_PREMIO_NETTO (14 char)
                        ├── IMP_PREMIO_LORDO (14 char)
                        ├── COD_RAMO_CONTABILE (2 char)
                        ├── DAT_INIZ_VALI (10 char)
                        ├── DAT_FINE_VALI (10 char)
                        └── ... (13 campi aggiuntivi)
                        │
                        └── Parametri (BLOCCHI PAX collegati)
                            └── Parametri aggiuntivi per la partita
```

### Entità Aggiuntive Correlate

#### Sforature (BLOCCO SFO)
```
- PRG_SFORATURA (8 char): Progressivo sforatura
- TIP_AUTOR (3 char): Tipo autorizzazione
  * CTL: Controllo
  * GAR: Garanzia
  * GRS: Griglia
  * PXA: Attributo Prodotto
  * QUE: Questionario
  * TAS: Tasso
  * FRA: Frazionamento
  * SCO: Sconto
- KEY_REC_AUTOR (24 char): Chiave record
  * Codifica gerarchica: contiene PRG_GRUPPO + PRG_SCHEDA + PRG_PARTITA
- COD_LIV_AUTOR (2 char): Livello autorizzazione
- COD_MOTIVO_AUTOR (4 char): Motivo autorizzazione
- COD_STATO_SFO (1 char): Stato sforatura
  * D: Da Autorizzare
  * A: Autorizzata
  * R: Rifiutata
  * S: Sospesa
- TXT_CATAL (70 char): Testo catalogo descrittivo
```

#### Coassicurazione (BLOCCO COA)
```
- COD_COMP_COASS (4 char): Compagnia coassicuratrice
- NUM_AGENZIA_COASS (8 char): Agenzia coassicuratrice
- PER_QUOTA (8 char): Quota rischio (%)
- PER_QUOTA_PREMIO (8 char): Quota premio (%)
- COD_DELEGATARIA (1 char): Flag delegataria (S/N)
- FLG_DELEGA_SIN (1 char): Flag delega sinistri (S/N)
- TXT_DESC_COMPAG (40 char): Descrizione compagnia
```

#### Documenti (BLOCCO DOC)
```
- TIP_DOCUMENTO (2 char): Tipo documento
- NUM_DOCUMENTO (14 char): Numero documento
- DAT_EFFETTO_COP (10 char): Data effetto copertura
- DAT_SCAD_COP (10 char): Data scadenza copertura
- DAT_EMISSIONE (10 char): Data emissione
- COD_STATO (1 char): Codice stato documento
- NUM_AGENZIA_EMISS (8 char): Agenzia emissione
```

---

### Gerarchia a 4 Livelli

```
RVPolizza (root)
│
├── 📋 Dati Generali Contratto
│   ├── Numero Polizza (NUM_CONTRATTO)
│   ├── Progressivo Contratto (PRG_CONTRATTO)
│   ├── Codice Compagnia (COD_COMP)
│   ├── Date (DAT_DECORRENZA, DAT_SCADENZA)
│   ├── Tipo Struttura (TIP_STRUTTURA)
│   │   - SI: Standard
│   │   - PM/AM: Polizza Moduli
│   │   - CN: Cover Note
│   │   - CC: Conferma Copertura
│   │   - CF: Certificato
│   │   - PQ/AQ: Polizza Quadro
│   ├── Numero Agenzia (NUM_AGENZIA)
│   ├── Codice Valuta (COD_VALUTA)
│   ├── Codice Rinnovo (COD_RINNOVO)
│   ├── Convenzione (TIP_CONVENZ)
│   └── Flag Preventivo (FLG_PREVENT)
│
├── 👥 GruppoContraenti
│   └── Lista Entità
│       ├── Contraenti (Ruolo: ICR_Contraente)
│       ├── Recapito Quietanza (Ruolo: ICR_RecapitoQuietanza)
│       └── Conto Corrente (Ruolo: ICR_ContoCorrente)
│           └── IBAN
│
└── 👨‍👩‍👧‍👦 GruppiAssicurati[] (array di gruppi)
    └── Per ogni Gruppo:
        ├── Progressivo Gruppo (PRG_GRUPPO)
        ├── Progressivo Assicurato (per UAA)
        ├── Categoria Rischio (TIP_RISK)
        └── Lista Entità (Ruolo: ICR_Assicurato)
            ├── Tipo Rischio:
            │   - Persona
            │   - NucleoPersone
            │   - PersonaDelNucleo
            │   - Veicolo
            │   - Ubicazione
            │   - Aeromobile
            │   - Natante
            │   - etc.
            └── Schede[] (array di schede)
                └── Per ogni Scheda:
                    ├── Progressivo Scheda (PRG_SCHEDA)
                    ├── Codice Prodotto (COD_PRODOTTO)
                    ├── Codice Modulo (se applicabile)
                    ├── Descrizione Prodotto
                    ├── Flag Caricata (Caricata)
                    ├── Flag External (IsExternal)
                    ├── Date Validità
                    └── Partite[] (array di partite)
                        └── Per ogni Partita:
                            ├── Progressivo Partita DB (PRG_PARTITA)
                            ├── Codice Garanzia/Clausola
                            ├── Descrizione Garanzia
                            ├── Tipo (Base/Accessoria/Clausola)
                            ├── Somma Assicurata (IMP_SOMMA_ASS)
                            ├── Premio Netto (IMP_PREMIO_NETTO)
                            ├── Premio Lordo (IMP_PREMIO_LORDO)
                            ├── Codice Ramo Contabile (COD_RAMO_CONTABILE)
                            ├── Date Validità (DAT_INIZ_VAL, DAT_FINE_VAL)
                            └── Dettagli Ripartizione Contabile
```

### Entità Aggiuntive Correlate

#### Sforature (SFORATURA)
```
- PRG_SFORATURA: Progressivo sforatura
- TIP_AUTOR: Tipo autorizzazione
  * CTL: Controllo
  * GAR: Garanzia
  * GRS: Griglia
  * PXA: Attributo Prodotto
  * QUE: Questionario
  * TAS: Tasso
  * FRA: Frazionamento
  * SCO: Sconto
- KEY_REC_AUTOR: Chiave record (24 char)
  * Codifica gerarchica: Gruppo + Scheda + Partita + Dettaglio
- COD_LIV_AUTOR: Livello autorizzazione
- COD_MOTIVO_AUTOR: Motivo autorizzazione
- COD_STATO_SFO: Stato sforatura
- TXT_CATAL: Testo catalogo
```

#### Coassicurazione (COASS_QUOTA)
```
- COD_COMP_COASS: Compagnia coassicuratrice
- NUM_AGENZIA_COASS: Agenzia coassicuratrice
- PER_QUOTA: Quota rischio (%)
- PER_QUOTA_PREMIO: Quota premio (%)
- COD_DELEGATARIA: Flag delegataria (S/N)
- FLG_DELEGA_SIN: Flag delega sinistri (S/N)
- TXT_ULT_COMPAG: Descrizione agenzia
```

#### Sostituzione (SOSTITUZIONE)
```
- COD_COMP_PREC: Compagnia precedente
- NUM_CONTRATTO_PREC: Numero contratto precedente
- PRG_CONTRATTO_PREC: Progressivo precedente
- COD_LEGAME: Tipo legame
  * S: Sostituzione standard
  * E: Sostituzione terremoto
  * F: Sostituzione non digital
- COD_NOVAZIONE: Flag novazione
- DAT_ANN_SOST: Data annullamento sostituita
- DAT_FINE_COP_SOST: Data fine copertura
```

#### Vincoli
```
- COD_VINCOLO: Flag presenza vincoli (S/N)
- RVListaVincoli: Lista oggetti vincolati
  * OggettoVincolato: Entità vincolata
  * CodiceOggettoVincolato: Chiave oggetto
  * Tipo vincolo
```

---

## Requisiti Funzionali

### 1. Pagina Master di Visualizzazione

#### Layout Principale
```
┌─────────────────────────────────────────────────────────┐
│  Header: Polizza 12345678/0 - Cover Note                │
├──────────┬──────────────────────────────────────────────┤
│          │  📊 Dashboard Riepilogo                      │
│  FILTRI  │  ├─ 3 Gruppi Assicurati                      │
│  (Side)  │  ├─ 15 Schede                                │
│          │  ├─ 42 Partite                               │
│          │  └─ Premio Totale: 12.450,00€                │
│  [...]   │                                               │
│          │  🌲 Vista Albero Gerarchica                  │
│  [Filtri]│  └─ Gruppo 1                                 │
│          │      ├─ 👤 Mario Rossi (Assicurato)          │
│  [Reset] │      └─ 📄 Scheda 1 (Prod: 101)              │
│          │          ├─ 💰 Partita 1: RCA                │
│  [Salva] │          └─ 💰 Partita 2: Furto              │
│          │                                               │
└──────────┴──────────────────────────────────────────────┘
```

#### Componenti Principali

**Vista ad Albero Collapsabile/Espandibile**
- Icone per tipo entità (👤 Persona, 🚗 Veicolo, 🏠 Ubicazione)
- Colori/Badge per stati (🟢 Attivo, 🔴 Scaduto, 🟡 Da Autorizzare)
- Expand/Collapse tutti i livelli
- Navigazione da tastiera (frecce, Enter, Esc)

**Breadcrumb Contestuale**
```
Home > Polizza 12345678 > Gruppo 2 > Scheda 5 > Partita 3
```

**Contatori Dinamici**
```
Totali: 3 Gruppi | 15 Schede | 42 Partite
Filtrati: 1 Gruppo | 5 Schede | 8 Partite
```

**Barra Azioni**
- 🔍 Ricerca rapida globale
- 📥 Esporta (JSON/Excel/CSV)
- 🔗 Condividi link con filtri
- ⚙️ Impostazioni visualizzazione

### 2. Livello 1: Dati Contratto

#### Card Informazioni Generali
```
┌─────────────────────────────────────────────────┐
│ 📋 CONTRATTO                              [Edit]│
├─────────────────────────────────────────────────┤
│ Numero:        12345678                         │
│ Progressivo:   0                                │
│ Compagnia:     001 - Allianz                    │
│ Agenzia:       123456                           │
│                                                 │
│ Decorrenza:    01/01/2024  ───────►  Scadenza: │
│                              365gg   31/12/2024 │
│                                                 │
│ Tipo:          🔵 Cover Note (CN)               │
│ Valuta:        EUR (978)                        │
│ Stato:         ✅ Attiva                        │
│                                                 │
│ 🏷️ Convenzione  ✅ Vincoli  ❌ Coassicurazione │
└─────────────────────────────────────────────────┘
```

#### Indicatori Visivi Speciali

**Badge per Tipo Struttura**
- 🔵 **CN** - Cover Note (evidenza prioritaria)
- 🟢 **CC** - Conferma Copertura
- 🟡 **SI** - Standard
- 🟣 **PM/AM** - Polizza Moduli
- 🟠 **PQ/AQ** - Polizza Quadro
- ⚪ **CF** - Certificato

**Alerting**
- ⚠️ Preventivo non perfezionato
- 🔴 Polizza scaduta
- 🔶 Sforature da autorizzare
- 🔷 Sostituzione attiva

### 3. Livello 2: Gruppi e Contraenti

#### Sezione GruppoContraenti
```
┌─────────────────────────────────────────────────┐
│ 👥 CONTRAENTI                                   │
├─────────────────────────────────────────────────┤
│ 📝 Contraente 1:                                │
│    Mario Rossi                                  │
│    CF: RSSMRA80A01H501Z                        │
│    Via Roma 1, Milano                          │
│                                                 │
│ 📮 Recapito Quietanza:                         │
│    Via Verdi 10, Milano                        │
│                                                 │
│ 💳 IBAN:                                        │
│    IT60X0542811101000000123456                 │
└─────────────────────────────────────────────────┘
```

#### Sezione GruppiAssicurati
```
┌─────────────────────────────────────────────────┐
│ 👨‍👩‍👧‍👦 GRUPPI ASSICURATI (3)                      │
├─────────────────────────────────────────────────┤
│ 📦 Gruppo 1 (Prg: 1)                [Espandi▼] │
│    👤 2 Entità | 📄 5 Schede | 💰 15 Partite   │
│    Rischio: Persona                             │
│                                                 │
│ 📦 Gruppo 2 (Prg: 2)                [Espandi▼] │
│    🚗 1 Entità | 📄 3 Schede | 💰 8 Partite    │
│    Rischio: Veicolo                             │
│                                                 │
│ 📦 Gruppo 3 (Prg: 3)                [Espandi▼] │
│    🏠 1 Entità | 📄 7 Schede | 💰 19 Partite   │
│    Rischio: Ubicazione                          │
└─────────────────────────────────────────────────┘
```

### 4. Livello 3: Schede

#### Vista Tabellare Schede
```
┌──────┬────────┬─────────────────────┬──────────┬─────────┬────────┐
│ Prg  │ Prodot │ Descrizione         │ Partite  │ Premio  │ Stato  │
├──────┼────────┼─────────────────────┼──────────┼─────────┼────────┤
│ 1    │ 101    │ RCA Auto            │ 5        │ 850,00€ │ ✅ OK  │
│ 2    │ 205    │ Multirischio Casa   │ 8        │ 1.200€  │ ✅ OK  │
│ 3    │ 454    │ Infortuni           │ 3        │ 450,00€ │ ⚠️ Sf  │
└──────┴────────┴─────────────────────┴──────────┴─────────┴────────┘

Legenda: ✅ Caricata | ⚠️ Sforature | 🔴 Non Caricata
```

#### Dettaglio Scheda Espansa
```
┌─────────────────────────────────────────────────┐
│ 📄 SCHEDA 1 - Prodotto 101: RCA Auto           │
├─────────────────────────────────────────────────┤
│ Progressivo:      1                             │
│ Prodotto:         101 - RCA Autoveicoli        │
│ Modulo:           -                             │
│                                                 │
│ Stato:            ✅ Caricata                   │
│ External:         ❌ No                          │
│                                                 │
│ Validità:         01/01/2024 - 31/12/2024      │
│                                                 │
│ Partite:          5                             │
│ Premio Totale:    850,00€                       │
│                                                 │
│ [Mostra Partite ▼]                             │
└─────────────────────────────────────────────────┘
```

### 5. Livello 4: Partite

#### Vista Tabellare Partite
```
┌─────┬───────┬──────────────────────┬─────────────┬────────────┬────────────┐
│ Prg │ Cod   │ Garanzia             │ Somma Ass.  │ Pr. Netto  │ Pr. Lordo  │
├─────┼───────┼──────────────────────┼─────────────┼────────────┼────────────┤
│ 1   │ RCA01 │ RCA Base             │ 5.000.000€  │ 500,00€    │ 610,00€    │
│ 2   │ FUR01 │ Furto                │ 25.000€     │ 150,00€    │ 183,00€    │
│ 3   │ INC01 │ Incendio             │ 25.000€     │ 100,00€    │ 122,00€    │
│ 4   │ KAS01 │ Kasko Parziale       │ 20.000€     │ 80,00€     │ 97,60€     │
│ 5   │ ASS01 │ Assistenza Stradale  │ -           │ 20,00€     │ 24,40€     │
├─────┴───────┴──────────────────────┴─────────────┼────────────┼────────────┤
│                                          TOTALI: │ 850,00€    │ 1.037,00€  │
└──────────────────────────────────────────────────┴────────────┴────────────┘
```

#### Dettaglio Partita Espansa
```
┌─────────────────────────────────────────────────┐
│ 💰 PARTITA 1 - RCA Base                        │
├─────────────────────────────────────────────────┤
│ Progressivo:      1                             │
│ Codice Garanzia:  RCA01                        │
│ Descrizione:      Responsabilità Civile Auto   │
│ Tipo:             Base                          │
│                                                 │
│ Importi:                                        │
│   Somma Assicurata:  5.000.000,00€             │
│   Premio Netto:          500,00€                │
│   Premio Lordo:          610,00€                │
│                                                 │
│ Ramo Contabile:   08 - RCA                     │
│                                                 │
│ Validità:                                       │
│   Inizio:         01/01/2024                    │
│   Fine:           31/12/2024                    │
│                                                 │
│ Ripartizione Contabile:                         │
│   [Visualizza Dettagli ▼]                      │
└─────────────────────────────────────────────────┘
```

### 6. Dettagli Aggiuntivi Opzionali

#### Sforature
```
┌─────────────────────────────────────────────────┐
│ ⚠️ SFORATURE (3)                                │
├─────────────────────────────────────────────────┤
│ 1. CTL - Controllo Limite Premio                │
│    Livello: 2 | Stato: Da Autorizzare          │
│    Contesto: Gruppo 1 > Scheda 2                │
│                                                 │
│ 2. GAR - Garanzia Fuori Catalogo               │
│    Livello: 1 | Stato: Autorizzata             │
│    Contesto: Gruppo 2 > Scheda 3 > Partita 5   │
│                                                 │
│ 3. PXA - Attributo Prodotto                     │
│    Livello: 2 | Stato: Rifiutata               │
│    Contesto: Gruppo 1 > Scheda 1                │
└─────────────────────────────────────────────────┘
```

#### Coassicurazione
```
┌─────────────────────────────────────────────────┐
│ 🤝 COASSICURAZIONE                              │
├─────────────────────────────────────────────────┤
│ Compagnia Delegataria: 001 - Allianz (80%)     │
│                                                 │
│ Coassicurate:                                   │
│ • 025 - Generali (15%) - Ag. 12345             │
│   Delega Sinistri: ✅                           │
│                                                 │
│ • 037 - UnipolSai (5%) - Ag. 67890             │
│   Delega Sinistri: ❌                           │
└─────────────────────────────────────────────────┘
```

#### Sostituzione
```
┌─────────────────────────────────────────────────┐
│ 🔄 SOSTITUZIONE                                 │
├─────────────────────────────────────────────────┤
│ Tipo Legame:      S - Sostituzione Standard    │
│                                                 │
│ Polizza Sostituita:                             │
│   Compagnia:      001                           │
│   Numero:         98765432                      │
│   Progressivo:    0                             │
│                                                 │
│ Date:                                           │
│   Annullamento:   31/12/2023                    │
│   Fine Copertura: 31/12/2023                    │
│                                                 │
│ Novazione:        ❌ No                          │
└─────────────────────────────────────────────────┘
```

---

## Sistema di Filtri

### 1. Pannello Filtri Globale

#### Posizione e Layout
```
┌─────────────────────────────────┐
│  🔍 FILTRI POLIZZA             │
│                                 │
│  Risultati: 15 di 42 elementi  │
├─────────────────────────────────┤
│                                 │
│  📋 Filtri Contratto       [▼] │
│  👥 Filtri Gruppi/Entità   [▼] │
│  📄 Filtri Schede          [▼] │
│  💰 Filtri Partite         [▼] │
│  📅 Filtri Date            [▼] │
│  🏷️  Filtri Stati/Flag     [▼] │
│                                 │
├─────────────────────────────────┤
│  [🔍 Applica]  [🔄 Reset]      │
│  [💾 Salva]    [📥 Carica]     │
└─────────────────────────────────┘
```

### 2. Filtri per Categoria

#### A) Filtri Livello Contratto

**Campi Input:**
```javascript
{
  // Identificativi
  numeroPolizza: {
    type: 'text',
    placeholder: 'Numero polizza...',
    example: '12345678'
  },
  
  progressivoContratto: {
    type: 'number',
    min: 0,
    max: 9999999
  },
  
  codiceCompagnia: {
    type: 'select',
    options: [
      { value: 1, label: '001 - Allianz' },
      { value: 25, label: '025 - Generali' },
      // ...
    ]
  },
  
  numeroAgenzia: {
    type: 'number',
    placeholder: 'Numero agenzia...'
  },
  
  // Dropdown Multi-Select
  tipoStruttura: {
    type: 'multiselect',
    options: [
      'SI - Standard',
      'PM - Polizza Moduli',
      'AM - Polizza Moduli Ultra',
      'CN - Cover Note',
      'CC - Conferma Copertura',
      'CF - Certificato',
      'CM - Convenzione MGEN',
      'PQ - Polizza Quadro',
      'AQ - Polizza Quadro Ultra'
    ],
    showChips: true
  },
  
  codiceValuta: {
    type: 'multiselect',
    options: [
      { value: 978, label: 'EUR - Euro' },
      { value: 840, label: 'USD - Dollaro USA' },
      { value: 826, label: 'GBP - Sterlina' },
      // ...
    ]
  },
  
  // Range Importi
  importoPremioRange: {
    type: 'range',
    min: 0,
    max: 1000000,
    step: 100,
    unit: '€'
  }
}
```

**UI Component:**
```jsx
<FilterSection title="📋 Filtri Contratto">
  <TextInput 
    label="Numero Polizza"
    value={filters.numeroPolizza}
    onChange={handleChange}
  />
  
  <MultiSelect
    label="Tipo Struttura"
    options={tipologieStruttura}
    selected={filters.tipoStruttura}
    renderChips={true}
  />
  
  <RangeSlider
    label="Premio Totale"
    min={0}
    max={100000}
    value={filters.importoRange}
    formatLabel={(v) => `${v.toLocaleString()}€`}
  />
</FilterSection>
```

#### B) Filtri Gruppi/Entità

**Campi Input:**
```javascript
{
  // Progressivi
  progressivoGruppo: {
    type: 'multiselect',
    options: [1, 2, 3, 4, 5], // dinamico da dati
    allowRange: true
  },
  
  // Tipo Entità
  tipoRischio: {
    type: 'multiselect',
    options: [
      { value: 'P', label: '👤 Persona' },
      { value: 'N', label: '👨‍👩‍👧‍👦 Nucleo Persone' },
      { value: 'V', label: '🚗 Veicolo' },
      { value: 'U', label: '🏠 Ubicazione' },
      { value: 'A', label: '✈️ Aeromobile' },
      { value: 'M', label: '⛵ Natante' },
      { value: 'R', label: '📦 Merci' }
    ]
  },
  
  ruolo: {
    type: 'multiselect',
    options: [
      'ICR_Contraente',
      'ICR_Assicurato',
      'ICR_RecapitoQuietanza',
      'ICR_ContoCorrente',
      'ICR_Amministratore',
      'ICR_Vincolatario'
    ]
  },
  
  // Anagrafica
  codiceFiscale: {
    type: 'text',
    placeholder: 'RSSMRA80A01H501Z',
    pattern: '^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$'
  },
  
  partitaIVA: {
    type: 'text',
    placeholder: '12345678901',
    pattern: '^[0-9]{11}$'
  },
  
  nominativo: {
    type: 'autocomplete',
    placeholder: 'Cerca per nome...',
    minChars: 2,
    searchFields: ['cognome', 'nome', 'ragioneSociale']
  },
  
  // Filtri Booleani
  hasVincoli: {
    type: 'tristate',
    labels: ['Con Vincoli', 'Senza Vincoli', 'Tutti']
  },
  
  hasNucleoFamiliare: {
    type: 'checkbox',
    label: 'Solo nuclei familiari'
  }
}
```

#### C) Filtri Schede

**Campi Input:**
```javascript
{
  // Progressivi
  progressivoScheda: {
    type: 'multiselect-range',
    allowMultiple: true,
    allowRange: true,
    placeholder: 'Es: 1,3,5-10'
  },
  
  // Prodotto
  codiceProdotto: {
    type: 'autocomplete-multiselect',
    fetchOptions: async (query) => {
      // Fetch da catalogo prodotti
      return await getProdotti(query);
    },
    displayFormat: (p) => `${p.codice} - ${p.descrizione}`,
    minChars: 1
  },
  
  descrizioneProdotto: {
    type: 'text',
    placeholder: 'Cerca nella descrizione...',
    debounce: 500
  },
  
  codiceModulo: {
    type: 'multiselect',
    options: [], // popolato dinamicamente
    dependsOn: 'codiceProdotto'
  },
  
  // Stati
  schedaCaricata: {
    type: 'tristate',
    labels: ['✅ Solo Caricate', '❌ Solo Non Caricate', '⚪ Tutte']
  },
  
  isExternal: {
    type: 'tristate',
    labels: ['External', 'Internal', 'Tutte']
  },
  
  // Contatori
  numeroPartite: {
    type: 'range',
    min: 0,
    max: 50,
    label: 'Numero Partite'
  }
}
```

**UI Component Avanzato:**
```jsx
<FilterSection title="📄 Filtri Schede">
  <AutocompleteMultiSelect
    label="Prodotto"
    searchPlaceholder="Cerca prodotto..."
    selectedValues={filters.codiceProdotto}
    onSearch={handleProdottoSearch}
    onSelect={handleProdottoSelect}
    renderOption={(prod) => (
      <div>
        <strong>{prod.codice}</strong> - {prod.descrizione}
        <Badge>{prod.categoria}</Badge>
      </div>
    )}
    renderChip={(prod) => `${prod.codice}`}
  />
  
  <TriStateCheckbox
    label="Stato Scheda"
    value={filters.schedaCaricata}
    states={[
      { value: true, label: '✅ Caricate', icon: 'check' },
      { value: false, label: '❌ Non Caricate', icon: 'x' },
      { value: null, label: '⚪ Tutte', icon: 'all' }
    ]}
  />
  
  <RangeSlider
    label="Numero Partite per Scheda"
    min={0}
    max={50}
    value={filters.numeroPartiteRange}
    marks={[0, 10, 20, 30, 40, 50]}
  />
</FilterSection>
```

#### D) Filtri Partite/Garanzie

**Campi Input:**
```javascript
{
  // Progressivi
  progressivoPartita: {
    type: 'multiselect-range',
    allowMultiple: true,
    allowRange: true
  },
  
  // Garanzie
  codiceGaranzia: {
    type: 'autocomplete-multiselect',
    fetchOptions: async (query) => {
      return await getGaranzie(query);
    },
    placeholder: 'Cerca garanzia...'
  },
  
  descrizioneGaranzia: {
    type: 'text',
    placeholder: 'Cerca nella descrizione...'
  },
  
  tipoGaranzia: {
    type: 'multiselect',
    options: [
      'Base',
      'Accessoria',
      'Clausola'
    ]
  },
  
  // Importi con Range
  sommaAssicurata: {
    type: 'double-range',
    min: 0,
    max: 10000000,
    step: 1000,
    unit: '€',
    presets: [
      { label: '< 10k', value: [0, 10000] },
      { label: '10k-50k', value: [10000, 50000] },
      { label: '50k-100k', value: [50000, 100000] },
      { label: '> 100k', value: [100000, 10000000] }
    ]
  },
  
  premioNetto: {
    type: 'double-range',
    min: 0,
    max: 50000,
    step: 50,
    unit: '€',
    logarithmic: true // per range grandi
  },
  
  premioLordo: {
    type: 'double-range',
    min: 0,
    max: 60000,
    step: 50,
    unit: '€'
  },
  
  // Rami
  codiceRamoContabile: {
    type: 'multiselect',
    options: [
      { value: 8, label: '08 - RCA' },
      { value: 3, label: '03 - Corpi Veicoli' },
      { value: 7, label: '07 - Merci Trasportate' },
      { value: 1, label: '01 - Incendio' },
      { value: 13, label: '13 - RC Generale' },
      // ...
    ],
    groupBy: 'categoria'
  }
}
```

**UI Component Range Doppio:**
```jsx
<FilterSection title="💰 Filtri Partite">
  <DoubleRangeSlider
    label="Somma Assicurata"
    min={0}
    max={10000000}
    value={filters.sommaAssicurataRange}
    step={1000}
    formatValue={(v) => formatCurrency(v)}
    presets={[
      { label: 'Fino a 10k€', range: [0, 10000] },
      { label: '10k - 50k€', range: [10000, 50000] },
      { label: '50k - 100k€', range: [50000, 100000] },
      { label: 'Oltre 100k€', range: [100000, 10000000] }
    ]}
  />
  
  <DoubleRangeSlider
    label="Premio Netto"
    min={0}
    max={50000}
    value={filters.premioNettoRange}
    step={50}
    formatValue={(v) => `${v.toLocaleString()}€`}
  />
  
  <MultiSelect
    label="Ramo Contabile"
    options={ramiContabili}
    groupBy="categoria"
    selected={filters.codiceRamoContabile}
    renderOption={(ramo) => (
      <div>
        <Badge>{ramo.value}</Badge> {ramo.label}
      </div>
    )}
  />
</FilterSection>
```

#### E) Filtri Date

**Campi Input:**
```javascript
{
  // Date Contratto
  dataDecorrenza: {
    type: 'daterange',
    from: Date,
    to: Date,
    label: 'Decorrenza'
  },
  
  dataScadenza: {
    type: 'daterange',
    from: Date,
    to: Date,
    label: 'Scadenza',
    presets: [
      { label: 'Scadute', value: 'expired' },
      { label: 'In Scadenza (30gg)', value: 'expiring-30' },
      { label: 'Future', value: 'future' }
    ]
  },
  
  // Date Partite
  validitaPartite: {
    type: 'daterange',
    from: Date,
    to: Date,
    label: 'Validità Partite'
  },
  
  // Preset rapidi
  periodoPreset: {
    type: 'buttons-group',
    options: [
      { value: 'today', label: 'Oggi' },
      { value: 'last-7', label: 'Ultimi 7gg' },
      { value: 'last-30', label: 'Ultimo mese' },
      { value: 'last-90', label: 'Ultimi 3 mesi' },
      { value: 'ytd', label: 'Anno corrente' },
      { value: 'last-year', label: 'Anno precedente' },
      { value: 'custom', label: 'Personalizzato' }
    ]
  }
}
```

**UI Component:**
```jsx
<FilterSection title="📅 Filtri Date">
  <PresetButtons
    options={periodoPresets}
    selected={filters.periodoPreset}
    onChange={handlePresetChange}
  />
  
  <DateRangePicker
    label="Decorrenza Polizza"
    from={filters.dataDecorrenzaDa}
    to={filters.dataDecorrenzaA}
    maxRange={365} // max 1 anno
    onChange={handleDateChange}
  />
  
  <DateRangePicker
    label="Scadenza Polizza"
    from={filters.dataScadenzaDa}
    to={filters.dataScadenzaA}
    quickFilters={[
      { label: '📛 Scadute', onClick: () => setExpired() },
      { label: '⚠️ In scadenza', onClick: () => setExpiring(30) }
    ]}
  />
</FilterSection>
```

#### F) Filtri Stati/Flag

**Campi Input:**
```javascript
{
  // Flag Booleani (Tri-state: true/false/null)
  isPreventivo: {
    type: 'tristate',
    field: 'FLG_PREVENT',
    labels: ['Solo Preventivi', 'Solo Definitive', 'Tutte']
  },
  
  isCoverNote: {
    type: 'boolean',
    computedFrom: (data) => data.tipoStruttura === 'CN',
    label: 'Solo Cover Note'
  },
  
  hasConvenzione: {
    type: 'tristate',
    field: 'TIP_CONVENZ',
    labels: ['Con Convenzione', 'Senza Convenzione', 'Tutte']
  },
  
  hasVincoli: {
    type: 'tristate',
    field: 'COD_VINCOLO',
    labels: ['Con Vincoli', 'Senza Vincoli', 'Tutte']
  },
  
  hasCoassicurazione: {
    type: 'boolean',
    label: 'Solo con Coassicurazione'
  },
  
  hasSforature: {
    type: 'boolean',
    label: 'Solo con Sforature',
    badge: (count) => count > 0 ? `${count}` : null
  },
  
  hasSostituzione: {
    type: 'boolean',
    label: 'Solo Sostituzioni'
  },
  
  hasIndicizzazione: {
    type: 'boolean',
    field: 'COD_INDICIZZ',
    label: 'Solo con Indicizzazione'
  },
  
  // Stati Sforature
  statoSforatura: {
    type: 'multiselect',
    options: [
      { value: 'D', label: '⏳ Da Autorizzare' },
      { value: 'A', label: '✅ Autorizzata' },
      { value: 'R', label: '❌ Rifiutata' },
      { value: 'S', label: '🔄 Sospesa' }
    ],
    dependsOn: 'hasSforature'
  },
  
  tipoSforatura: {
    type: 'multiselect',
    options: [
      { value: 'CTL', label: 'Controllo' },
      { value: 'GAR', label: 'Garanzia' },
      { value: 'GRS', label: 'Griglia' },
      { value: 'PXA', label: 'Attributo Prodotto' },
      { value: 'QUE', label: 'Questionario' },
      { value: 'TAS', label: 'Tasso' },
      { value: 'FRA', label: 'Frazionamento' },
      { value: 'SCO', label: 'Sconto' }
    ],
    dependsOn: 'hasSforature'
  }
}
```

**UI Component:**
```jsx
<FilterSection title="🏷️ Filtri Stati/Flag">
  <CheckboxGroup label="Caratteristiche Polizza">
    <TriStateCheckbox
      label="Preventivo"
      value={filters.isPreventivo}
      icon="📋"
    />
    <Checkbox
      label="Cover Note"
      checked={filters.isCoverNote}
      icon="🔵"
    />
    <TriStateCheckbox
      label="Convenzione"
      value={filters.hasConvenzione}
      icon="🤝"
    />
    <TriStateCheckbox
      label="Vincoli"
      value={filters.hasVincoli}
      icon="🔒"
    />
  </CheckboxGroup>
  
  <CheckboxGroup label="Elementi Complessi">
    <Checkbox
      label="Coassicurazione"
      checked={filters.hasCoassicurazione}
    />
    <Checkbox
      label="Sforature"
      checked={filters.hasSforature}
      badge={sforatureCount}
    />
    <Checkbox
      label="Sostituzione"
      checked={filters.hasSostituzione}
    />
    <Checkbox
      label="Indicizzazione"
      checked={filters.hasIndicizzazione}
    />
  </CheckboxGroup>
  
  {filters.hasSforatures && (
    <MultiSelect
      label="Stato Sforature"
      options={statiSforatura}
      selected={filters.statoSforatura}
    />
  )}
</FilterSection>
```

### 3. Logica Filtri e Comportamenti

#### Modalità di Applicazione Filtri

**1. Cascata Gerarchica (Default)**
```
Filtri Contratto (livello 0)
    ↓ Se matcha
Filtri Gruppi (livello 1)
    ↓ Se matcha
Filtri Schede (livello 2)
    ↓ Se matcha
Filtri Partite (livello 3)
```

**Comportamento:**
- Un filtro a livello superiore influenza tutti i livelli inferiori
- Se un elemento padre non matcha, i figli vengono nascosti/opacizzati
- Opzione UI: "Mostra path completo" per vedere gerarchia anche se padre non matcha

**Esempio:**
```javascript
// Utente filtra: Tipo Struttura = "CN" (Cover Note)
// Risultato: Solo polizze Cover Note con tutti i loro gruppi/schede/partite

// Utente aggiunge: Premio Netto > 1000€
// Risultato: Cover Note che contengono almeno una partita con premio > 1000€
//            (mostra solo quelle partite, ma mantiene visibile la struttura)
```

**2. Modalità Flat (Opzionale)**
```
Tutti i filtri applicati in parallelo
Ogni elemento valutato indipendentemente
```

**Comportamento:**
- Utile per trovare elementi specifici senza contesto
- Mostra solo gli elementi che matchano esattamente
- Perdita del contesto gerarchico

**Toggle UI:**
```jsx
<FilterModeSwitch>
  <RadioButton value="hierarchical" label="🌲 Gerarchica" />
  <RadioButton value="flat" label="📋 Flat" />
</FilterModeSwitch>
```

#### Operatori Logici

**Tra campi dello stesso gruppo: AND (default)**
```javascript
// Esempio: Filtri Schede
codiceProdotto = [101, 205] AND schedaCaricata = true
// Risultato: Solo schede con prodotto 101 O 205 E che sono caricate
```

**Valori multipli dello stesso campo: OR**
```javascript
// Esempio: Multi-select
codiceProdotto = [101, 205, 301]
// Risultato: Schede con prodotto 101 OR 205 OR 301
```

**Tra gruppi di filtri: AND (configurabile)**
```jsx
<FilterLogicSelector>
  <Checkbox checked={true} disabled label="Filtri Contratto" />
  <Select value="AND">
    <Option value="AND">E</Option>
    <Option value="OR">OPPURE</Option>
  </Select>
  <Checkbox checked={true} label="Filtri Schede" />
</FilterLogicSelector>
```

#### Indicatori Visivi Filtri Attivi

**Badge Filtri Attivi:**
```jsx
<FilterSummary>
  <Badge variant="filter" onRemove={() => removeFilter('tipoStruttura')}>
    ✕ Tipo: CN
  </Badge>
  <Badge variant="filter" onRemove={() => removeFilter('codiceProdotto')}>
    ✕ Prodotto: 101, 205
  </Badge>
  <Badge variant="filter" onRemove={() => removeFilter('premioNetto')}>
    ✕ Premio: 1.000€ - 5.000€
  </Badge>
</FilterSummary>

<ResultCounter>
  Visualizzati: <strong>15 elementi</strong> di 42 totali
</ResultCounter>
```

**Highlight Elementi Filtrati:**

```css
/* Elemento che matcha il filtro */
.matched {
  border-left: 4px solid #4CAF50;
  background: #E8F5E9;
  font-weight: 500;
}

/* Elemento che non matcha ma è nel path */
.parent-context {
  opacity: 0.6;
  background: #F5F5F5;
}

/* Elemento nascosto (opzionale) */
.hidden-by-filter {
  display: none;
}
```

**Esempio Visivo:**
```
┌─────────────────────────────────────────┐
│ 📦 Gruppo 1 (opacizzato - parent)      │
│   └─ 📄 Scheda 2 (⭐ MATCH - evidenziata) │
│       └─ 💰 Partita 1 (⭐ MATCH)        │
│       └─ 💰 Partita 2 (non match)      │
└─────────────────────────────────────────┘
```

### 4. UI/UX Avanzata

#### Preset Filtri (Filtri Salvati)

**Gestione Preset:**
```javascript
const filterPresets = [
  {
    id: 'cover-note-attive',
    nome: '🔵 Cover Note Attive',
    descrizione: 'Cover Note non scadute',
    filters: {
      tipoStruttura: ['CN'],
      dataScadenzaDa: new Date()
    },
    isPublic: true,
    creator: 'system'
  },
  {
    id: 'alto-valore',
    nome: '💎 Polizze Alto Valore',
    descrizione: 'Premio netto > 10.000€',
    filters: {
      premioNettoRange: { min: 10000, max: null }
    },
    isPublic: true,
    creator: 'system'
  },
  {
    id: 'sforature-pendenti',
    nome: '⚠️ Sforature da Autorizzare',
    descrizione: 'Con sforature in stato "Da Autorizzare"',
    filters: {
      hasSforature: true,
      statoSforatura: ['D']
    },
    isPublic: true,
    creator: 'system'
  },
  {
    id: 'preventivi-in-scadenza',
    nome: '⏰ Preventivi in Scadenza',
    descrizione: 'Preventivi che scadono nei prossimi 7 giorni',
    filters: {
      isPreventivo: true,
      dataScadenzaDa: new Date(),
      dataScadenzaA: addDays(new Date(), 7)
    },
    isPublic: true,
    creator: 'system'
  }
];
```

**UI Preset:**
```jsx
<PresetManager>
  <PresetList>
    {filterPresets.map(preset => (
      <PresetCard
        key={preset.id}
        title={preset.nome}
        description={preset.descrizione}
        onLoad={() => loadPreset(preset)}
        onEdit={() => editPreset(preset)}
        onDelete={() => deletePreset(preset)}
        isPublic={preset.isPublic}
      />
    ))}
  </PresetList>
  
  <Button onClick={handleSaveCurrentFilters}>
    💾 Salva Filtri Correnti
  </Button>
</PresetManager>

<SavePresetDialog>
  <Input label="Nome Preset" placeholder="Es: Mie Cover Note" />
  <Textarea label="Descrizione (opzionale)" />
  <Checkbox label="Condividi con team" />
  <ButtonGroup>
    <Button variant="primary">Salva</Button>
    <Button variant="secondary">Annulla</Button>
  </ButtonGroup>
</SavePresetDialog>
```

#### Pulsanti Azioni

```jsx
<FilterActions>
  <Button 
    variant="primary" 
    icon="🔍"
    onClick={applyFilters}
    disabled={!hasChanges}
  >
    Applica Filtri
  </Button>
  
  <Button 
    variant="secondary" 
    icon="🔄"
    onClick={resetFilters}
    disabled={!hasActiveFilters}
  >
    Reset Tutti
  </Button>
  
  <Dropdown label="Altro">
    <MenuItem icon="💾" onClick={openSaveDialog}>
      Salva Set Filtri
    </MenuItem>
    <MenuItem icon="📥" onClick={openLoadDialog}>
      Carica Set Filtri
    </MenuItem>
    <MenuItem icon="🔗" onClick={copyFilterLink}>
      Copia Link con Filtri
    </MenuItem>
    <MenuItem icon="📤" onClick={exportFiltered}>
      Esporta Dati Filtrati
    </MenuItem>
  </Dropdown>
</FilterActions>
```

#### Ricerca Full-Text Globale

```jsx
<GlobalSearch>
  <SearchBar
    placeholder="🔍 Cerca ovunque... (Ctrl+K)"
    value={searchQuery}
    onChange={handleGlobalSearch}
    debounce={300}
  />
  
  {searchResults && (
    <SearchResults>
      <ResultGroup title="Polizze">
        {searchResults.polizze.map(p => (
          <ResultItem 
            label={`Polizza ${p.numero}`}
            preview={p.preview}
            onClick={() => navigateTo(p)}
          />
        ))}
      </ResultGroup>
      
      <ResultGroup title="Contraenti">
        {searchResults.contraenti.map(c => (
          <ResultItem 
            label={c.nominativo}
            preview={c.codiceFiscale}
            onClick={() => navigateTo(c)}
          />
        ))}
      </ResultGroup>
      
      <ResultGroup title="Garanzie">
        {searchResults.garanzie.map(g => (
          <ResultItem 
            label={`${g.codice} - ${g.descrizione}`}
            preview={`Partita ${g.progressivo}`}
            onClick={() => navigateTo(g)}
          />
        ))}
      </ResultGroup>
    </SearchResults>
  )}
</GlobalSearch>
```

### 5. Performance e Ottimizzazioni

#### Gestione Dataset Grandi

**1. Virtualizzazione**
```javascript
import { FixedSizeList as VirtualList } from 'react-window';

<VirtualList
  height={600}
  itemCount={filteredData.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <PartitaRow data={filteredData[index]} />
    </div>
  )}
</VirtualList>
```

**2. Debouncing Input**
```javascript
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => {
    applyFilter('nominativo', value);
  },
  500 // 500ms delay
);

<Input
  onChange={(e) => debouncedSearch(e.target.value)}
  placeholder="Cerca nominativo..."
/>
```

**3. Indicizzazione Dati**
```javascript
// Pre-processing al caricamento polizza
const createIndexes = (polizza) => {
  const indexes = {
    byProgressivoScheda: new Map(),
    byCodiceProdotto: new Map(),
    byProgressivoGruppo: new Map(),
    byCodiceFiscale: new Map(),
    byCodiceGaranzia: new Map()
  };
  
  polizza.gruppi.forEach(gruppo => {
    indexes.byProgressivoGruppo.set(gruppo.progressivo, gruppo);
    
    gruppo.schede.forEach(scheda => {
      indexes.byProgressivoScheda.set(scheda.progressivo, scheda);
      
      if (!indexes.byCodiceProdotto.has(scheda.codiceProdotto)) {
        indexes.byCodiceProdotto.set(scheda.codiceProdotto, []);
      }
      indexes.byCodiceProdotto.get(scheda.codiceProdotto).push(scheda);
      
      scheda.partite.forEach(partita => {
        if (!indexes.byCodiceGaranzia.has(partita.codiceGaranzia)) {
          indexes.byCodiceGaranzia.set(partita.codiceGaranzia, []);
        }
        indexes.byCodiceGaranzia.get(partita.codiceGaranzia).push(partita);
      });
    });
    
    gruppo.entita.forEach(entita => {
      if (entita.codiceFiscale) {
        indexes.byCodiceFiscale.set(entita.codiceFiscale, entita);
      }
    });
  });
  
  return indexes;
};
```

**4. Memoization**
```javascript
import { useMemo } from 'react';

const filteredData = useMemo(() => {
  if (!hasActiveFilters) return polizzaData;
  
  return applyAllFilters(polizzaData, filters);
}, [polizzaData, filters, hasActiveFilters]);
```

#### Feedback Utente

**Loading States:**
```jsx
<FilterPanel>
  {isFiltering && (
    <LoadingOverlay>
      <Spinner />
      <Text>Applicazione filtri in corso...</Text>
      <ProgressBar value={filterProgress} max={100} />
    </LoadingOverlay>
  )}
  
  {/* Filter controls */}
</FilterPanel>
```

**Warning Large Results:**
```jsx
{filteredCount > 1000 && (
  <Alert type="warning" icon="⚠️">
    <AlertTitle>Troppi risultati ({filteredCount.toLocaleString()})</AlertTitle>
    <AlertDescription>
      Considera di raffinare i filtri per migliorare le performance.
      <Button size="small" onClick={suggestFilters}>
        Suggerisci Filtri
      </Button>
    </AlertDescription>
  </Alert>
)}
```

**Empty States:**
```jsx
{filteredCount === 0 && (
  <EmptyState>
    <Icon name="search-off" size={64} />
    <Title>Nessun risultato trovato</Title>
    <Description>
      Prova a modificare o rimuovere alcuni filtri.
    </Description>
    <Button onClick={resetFilters}>
      🔄 Reset Filtri
    </Button>
  </EmptyState>
)}
```

### 6. Esportazione Dati Filtrati

#### Formati Export

**1. JSON Strutturato**
```javascript
const exportJSON = (filteredData) => {
  const exportData = {
    metadata: {
      dataExport: new Date().toISOString(),
      filtriApplicati: getActiveFilters(),
      totaleElementi: {
        gruppi: filteredData.gruppi.length,
        schede: countSchede(filteredData),
        partite: countPartite(filteredData)
      }
    },
    contratto: {
      numero: polizza.numero,
      progressivo: polizza.progressivo,
      // ... altri campi contratto
    },
    gruppi: filteredData.gruppi.map(gruppo => ({
      progressivo: gruppo.progressivo,
      entita: gruppo.entita,
      schede: gruppo.schede.map(scheda => ({
        progressivo: scheda.progressivo,
        codiceProdotto: scheda.codiceProdotto,
        partite: scheda.partite
      }))
    }))
  };
  
  downloadFile(
    JSON.stringify(exportData, null, 2),
    `polizza_${polizza.numero}_${timestamp()}.json`,
    'application/json'
  );
};
```

**2. Excel con Sheets**
```javascript
import * as XLSX from 'xlsx';

const exportExcel = (filteredData) => {
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Riepilogo Contratto
  const wsContratto = XLSX.utils.json_to_sheet([{
    'Numero Polizza': polizza.numero,
    'Progressivo': polizza.progressivo,
    'Tipo Struttura': polizza.tipoStruttura,
    'Decorrenza': formatDate(polizza.dataDecorrenza),
    'Scadenza': formatDate(polizza.dataScadenza),
    // ...
  }]);
  XLSX.utils.book_append_sheet(workbook, wsContratto, 'Contratto');
  
  // Sheet 2: Gruppi
  const wsGruppi = XLSX.utils.json_to_sheet(
    filteredData.gruppi.map(g => ({
      'Progressivo Gruppo': g.progressivo,
      'Num. Entità': g.entita.length,
      'Num. Schede': g.schede.length,
      'Categoria Rischio': g.categoriaRischio
    }))
  );
  XLSX.utils.book_append_sheet(workbook, wsGruppi, 'Gruppi');
  
  // Sheet 3: Schede (flat)
  const schedeFlat = [];
  filteredData.gruppi.forEach(gruppo => {
    gruppo.schede.forEach(scheda => {
      schedeFlat.push({
        'Prg. Gruppo': gruppo.progressivo,
        'Prg. Scheda': scheda.progressivo,
        'Cod. Prodotto': scheda.codiceProdotto,
        'Descrizione': scheda.descrizione,
        'Num. Partite': scheda.partite.length,
        'Premio Totale': sumPremi(scheda.partite)
      });
    });
  });
  const wsSchede = XLSX.utils.json_to_sheet(schedeFlat);
  XLSX.utils.book_append_sheet(workbook, wsSchede, 'Schede');
  
  // Sheet 4: Partite (flat)
  const partiteFlat = [];
  filteredData.gruppi.forEach(gruppo => {
    gruppo.schede.forEach(scheda => {
      scheda.partite.forEach(partita => {
        partiteFlat.push({
          'Prg. Gruppo': gruppo.progressivo,
          'Prg. Scheda': scheda.progressivo,
          'Prg. Partita': partita.progressivo,
          'Cod. Garanzia': partita.codiceGaranzia,
          'Descrizione': partita.descrizione,
          'Somma Assicurata': partita.sommaAssicurata,
          'Premio Netto': partita.premioNetto,
          'Premio Lordo': partita.premioLordo,
          'Ramo': partita.codiceRamo
        });
      });
    });
  });
  const wsPartite = XLSX.utils.json_to_sheet(partiteFlat);
  XLSX.utils.book_append_sheet(workbook, wsPartite, 'Partite');
  
  // Download
  XLSX.writeFile(workbook, `polizza_${polizza.numero}_${timestamp()}.xlsx`);
};
```

**3. CSV Flat**
```javascript
const exportCSV = (filteredData) => {
  const rows = [];
  
  // Headers
  rows.push([
    'Prg.Gruppo', 'Prg.Scheda', 'Prg.Partita',
    'Cod.Prodotto', 'Desc.Prodotto',
    'Cod.Garanzia', 'Desc.Garanzia',
    'Somma Assicurata', 'Premio Netto', 'Premio Lordo',
    'Ramo Contabile'
  ].join(';'));
  
  // Data
  filteredData.gruppi.forEach(gruppo => {
    gruppo.schede.forEach(scheda => {
      scheda.partite.forEach(partita => {
        rows.push([
          gruppo.progressivo,
          scheda.progressivo,
          partita.progressivo,
          scheda.codiceProdotto,
          scheda.descrizione,
          partita.codiceGaranzia,
          partita.descrizione,
          partita.sommaAssicurata,
          partita.premioNetto,
          partita.premioLordo,
          partita.codiceRamo
        ].join(';'));
      });
    });
  });
  
  downloadFile(
    rows.join('\n'),
    `polizza_${polizza.numero}_${timestamp()}.csv`,
    'text/csv'
  );
};
```

**UI Export:**
```jsx
<ExportMenu>
  <MenuItem icon="📄" onClick={() => exportJSON(filteredData)}>
    Esporta JSON
  </MenuItem>
  <MenuItem icon="📊" onClick={() => exportExcel(filteredData)}>
    Esporta Excel
  </MenuItem>
  <MenuItem icon="📋" onClick={() => exportCSV(filteredData)}>
    Esporta CSV
  </MenuItem>
  <MenuDivider />
  <MenuItem icon="🖨️" onClick={() => printView()}>
    Stampa Vista
  </MenuItem>
</ExportMenu>
```

### 7. Condivisione e Persistenza

#### URL con Parametri Filtro

```javascript
// Encoding filtri in URL
const encodeFiltersToURL = (filters) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else if (typeof value === 'object') {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, value);
      }
    }
  });
  
  return params.toString();
};

// Esempio URL
const shareableURL = 
  `${window.location.origin}/polizza/${polizzaId}?${encodeFiltersToURL(filters)}`;

// Copia negli appunti
navigator.clipboard.writeText(shareableURL);
```

#### Persistenza Locale

```javascript
// LocalStorage per ultimo set di filtri
const saveFiltersToLocal = (filters) => {
  localStorage.setItem(
    `polizza_filters_${userId}`,
    JSON.stringify(filters)
  );
};

const loadFiltersFromLocal = () => {
  const stored = localStorage.getItem(`polizza_filters_${userId}`);
  return stored ? JSON.parse(stored) : null;
};

// Auto-save on change
useEffect(() => {
  if (hasActiveFilters) {
    saveFiltersToLocal(filters);
  }
}, [filters]);
```

---

## Specifiche Tecniche

### Architettura Dati

#### Interfacce TypeScript

```typescript
// Contratto
interface RVPolizzaView {
  contratto: {
    codComp: number;
    numContratto: number;
    prgContratto: number;
    numAgenzia: number;
    datDecorrenza: Date;
    datScadenza: Date;
    tipStruttura: TipoStruttura;
    codValuta: number;
    codRinnovo: string;
    tipConvenz: boolean;
    flgPrevent: boolean;
    // ... altri campi
  };
  
  gruppoContraenti: {
    entita: Entita[];
    recapitoQuietanza?: UbicazioneRV;
    iban?: string;
  };
  
  gruppiAssicurati: GruppoAssicurati[];
  
  // Entità correlate
  sforature?: Sforatura[];
  coassicurate?: Coassicurata[];
  sostituzione?: Sostituzione;
}

// Gruppo
interface GruppoAssicurati {
  progressivo: number;
  progressivoAssicurato: number;
  categoriaRischio: string;
  entita: EntitaRV[];
  schede: Scheda[];
}

// Scheda
interface Scheda {
  progressivo: number;
  codiceProdotto: number;
  descrizione: string;
  codiceModulo?: number;
  caricata: boolean;
  isExternal: boolean;
  datInizVal: Date;
  datFineVal: Date;
  partite: Partita[];
}

// Partita
interface Partita {
  progressivo: number;
  codiceGaranzia: string;
  descrizione: string;
  tipo: 'Base' | 'Accessoria' | 'Clausola';
  sommaAssicurata: number;
  premioNetto: number;
  premioLordo: number;
  codiceRamoContabile: number;
  datInizVal: Date;
  datFineVal: Date;
  dettagliRipartizione?: DettaglioRipartizione[];
}

// Entità
interface EntitaRV {
  key: number;
  tipo: TipoRischio;
  ruolo: RuoloICR;
  // Dati anagrafici
  cognome?: string;
  nome?: string;
  ragioneSociale?: string;
  codiceFiscale?: string;
  partitaIVA?: string;
}

// Sforatura
interface Sforatura {
  progressivo: number;
  tipoAutor: TipoSforatura;
  keyRecAutor: string;
  livelloAutor: number;
  motivoAutor: string;
  statoSfo: StatoSforatura;
  txtCatal: string;
}

// Enums
enum TipoStruttura {
  SI = 'SI',  // Standard
  PM = 'PM',  // Polizza Moduli
  AM = 'AM',  // Moduli Ultra
  CN = 'CN',  // Cover Note
  CC = 'CC',  // Conferma Copertura
  CF = 'CF',  // Certificato
  PQ = 'PQ',  // Polizza Quadro
  AQ = 'AQ'   // Quadro Ultra
}

enum TipoSforatura {
  CTL = 'CTL',  // Controllo
  GAR = 'GAR',  // Garanzia
  GRS = 'GRS',  // Griglia
  PXA = 'PXA',  // Attributo Prodotto
  QUE = 'QUE',  // Questionario
  TAS = 'TAS',  // Tasso
  FRA = 'FRA',  // Frazionamento
  SCO = 'SCO'   // Sconto
}

enum TipoRischio {
  Persona = 'P',
  NucleoPersone = 'N',
  Veicolo = 'V',
  Ubicazione = 'U',
  Aeromobile = 'A',
  Natante = 'M',
  Merci = 'R'
}
```

#### State Management

```typescript
// Redux Store Structure
interface AppState {
  polizza: {
    data: RVPolizzaView | null;
    loading: boolean;
    error: string | null;
  };
  
  filters: {
    contratto: ContrattoFilters;
    gruppi: GruppiFilters;
    schede: SchedeFilters;
    partite: PartiteFilters;
    date: DateFilters;
    flags: FlagsFilters;
    
    // Meta
    isActive: boolean;
    activeCount: number;
    presets: FilterPreset[];
    currentPreset: string | null;
  };
  
  ui: {
    expandedGroups: Set<number>;
    expandedSchede: Set<number>;
    selectedItems: SelectedItems;
    viewMode: 'tree' | 'table' | 'cards';
    filterPanelOpen: boolean;
  };
}

// Actions
const filterActions = {
  setFilter: (category: string, field: string, value: any) => {},
  resetFilter: (category: string) => {},
  resetAllFilters: () => {},
  applyFilters: () => {},
  savePreset: (name: string, filters: any) => {},
  loadPreset: (presetId: string) => {},
  toggleFilterPanel: () => {}
};
```

### Custom Hooks

```typescript
// Hook per gestione filtri
const usePolizzaFilters = (polizzaData: RVPolizzaView) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filteredData, setFilteredData] = useState<RVPolizzaView>(polizzaData);
  const [isFiltering, setIsFiltering] = useState(false);
  
  const setFilter = useCallback((category, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  }, []);
  
  const applyFilters = useCallback(async () => {
    setIsFiltering(true);
    
    try {
      const result = await filterPolizza(polizzaData, filters);
      setFilteredData(result);
    } finally {
      setIsFiltering(false);
    }
  }, [polizzaData, filters]);
  
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setFilteredData(polizzaData);
  }, [polizzaData]);
  
  const activeFilterCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);
  
  return {
    filters,
    setFilter,
    filteredData,
    applyFilters,
    resetFilters,
    activeFilterCount,
    isFiltering
  };
};
```

### Algoritmo Filtraggio

```typescript
const filterPolizza = (
  polizza: RVPolizzaView,
  filters: Filters
): RVPolizzaView => {
  
  // 1. Filtra a livello contratto
  if (!matchContrattoFilters(polizza.contratto, filters.contratto)) {
    return null; // Contratto escluso
  }
  
  // 2. Filtra gruppi
  const gruppiFilterd = polizza.gruppiAssicurati
    .map(gruppo => {
      if (!matchGruppoFilters(gruppo, filters.gruppi)) {
        return null; // Gruppo escluso
      }
      
      // 3. Filtra schede del gruppo
      const schedeFiltrate = gruppo.schede
        .map(scheda => {
          if (!matchSchedaFilters(scheda, filters.schede)) {
            return null;
          }
          
          // 4. Filtra partite della scheda
          const partiteFiltrate = scheda.partite.filter(partita =>
            matchPartitaFilters(partita, filters.partite)
          );
          
          // Se nessuna partita matcha, escludi scheda
          if (partiteFiltrate.length === 0 && hasPartiteFilters(filters)) {
            return null;
          }
          
          return {
            ...scheda,
            partite: partiteFiltrate
          };
        })
        .filter(Boolean);
      
      // Se nessuna scheda matcha, escludi gruppo
      if (schedeFiltrate.length === 0 && hasSchedeFilters(filters)) {
        return null;
      }
      
      return {
        ...gruppo,
        schede: schedeFiltrate
      };
    })
    .filter(Boolean);
  
  return {
    ...polizza,
    gruppiAssicurati: gruppiFiltrati
  };
};

// Match functions
const matchContrattoFilters = (
  contratto: Contratto,
  filters: ContrattoFilters
): boolean => {
  if (filters.numeroPolizza && 
      !contratto.numContratto.toString().includes(filters.numeroPolizza)) {
    return false;
  }
  
  if (filters.tipoStruttura.length > 0 &&
      !filters.tipoStruttura.includes(contratto.tipStruttura)) {
    return false;
  }
  
  if (filters.importoRange &&
      !isInRange(calcTotalePremio(contratto), filters.importoRange)) {
    return false;
  }
  
  // ... altri controlli
  
  return true;
};
```

### Stack Tecnologico Consigliato

```json
{
  "frontend": {
    "framework": "React 18+",
    "language": "TypeScript",
    "stateManagement": "Redux Toolkit / Zustand",
    "routing": "React Router v6",
    "styling": "TailwindCSS + CSS Modules"
  },
  
  "ui-components": {
    "library": "Ant Design / Material-UI / Radix UI",
    "dataGrid": "AG-Grid / TanStack Table",
    "virtualization": "react-window / react-virtual",
    "forms": "React Hook Form",
    "datePicker": "react-datepicker / date-fns"
  },
  
  "utilities": {
    "dateManagement": "date-fns / dayjs",
    "validation": "Zod / Yup",
    "export": "xlsx / jsPDF",
    "icons": "Lucide React / React Icons"
  },
  
  "testing": {
    "unit": "Vitest / Jest",
    "integration": "React Testing Library",
    "e2e": "Playwright / Cypress"
  },
  
  "build": {
    "bundler": "Vite / Webpack 5",
    "linter": "ESLint",
    "formatter": "Prettier"
  }
}
```

---

## User Stories

### US1: Visualizzazione Base
**Come utente**, voglio vedere la struttura completa della polizza in una vista gerarchica **per** comprendere l'organizzazione dei dati.

**Criteri di Accettazione:**
- ✅ Vista ad albero con 4 livelli (Contratto > Gruppi > Schede > Partite)
- ✅ Possibilità di espandere/collassare ogni livello
- ✅ Contatori visibili per ogni livello (N schede, M partite)
- ✅ Icone distintive per tipo entità

### US2: Filtro Cover Note
**Come utente**, voglio filtrare per tipo struttura "CN" **per** vedere solo le Cover Note attive.

**Criteri di Accettazione:**
- ✅ Filtro tipo struttura con opzione "CN"
- ✅ Possibilità di aggiungere filtro data scadenza
- ✅ Badge visivo "🔵 Cover Note" sulle polizze
- ✅ Contatore risultati in tempo reale
- ✅ Identificazione corretta per chiave completa (COD_COMP-NUM_CONTRATTO-PRG_CONTRATTO-NUM_DOCUMENTO)

### US3: Filtro Multi-Criterio
**Come utente**, voglio filtrare schede con prodotto specifico E premio > 5000€ **per** analisi commerciale.

**Criteri di Accettazione:**
- ✅ Filtro prodotto multi-select con autocomplete
- ✅ Filtro premio con range slider
- ✅ Logica AND tra filtri diversi
- ✅ Highlight elementi che matchano

### US4: Salvataggio Preset
**Come utente**, voglio salvare un set di filtri "Polizze da Controllare" **per** riutilizzarlo quotidianamente.

**Criteri di Accettazione:**
- ✅ Pulsante "Salva Filtri Correnti"
- ✅ Dialog per nome e descrizione preset
- ✅ Lista preset salvati
- ✅ Caricamento preset con 1 click

### US5: Esportazione Filtrata
**Come utente**, voglio esportare solo i dati filtrati in Excel **per** reportistica.

**Criteri di Accettazione:**
- ✅ Menu "Esporta" con opzioni JSON/Excel/CSV
- ✅ Excel con sheet separati (Contratto, Schede, Partite)
- ✅ Metadati export (filtri applicati, data, contatori)
- ✅ Download automatico file

### US6: Condivisione Link
**Come utente**, voglio condividere un link con filtri pre-impostati con un collega **per** collaborazione.

**Criteri di Accettazione:**
- ✅ Pulsante "Copia Link"
- ✅ URL contiene parametri filtro
- ✅ Apertura link applica filtri automaticamente
- ✅ Feedback visivo "Link copiato"

### US7: Ricerca Rapida
**Come utente**, voglio cercare "Mario Rossi" e trovare tutte le occorrenze **per** analisi veloce.

**Criteri di Accettazione:**
- ✅ Search bar globale (Ctrl+K)
- ✅ Ricerca in tutti i campi testuali
- ✅ Risultati raggruppati per tipo (Contraenti, Assicurati, etc.)
- ✅ Click su risultato naviga all'elemento

### US8: Analisi Sforature
**Come utente**, voglio filtrare polizze con sforature "Da Autorizzare" **per** gestione priorità.

**Criteri di Accettazione:**
- ✅ Filtro "Solo con Sforature"
- ✅ Filtro stato sforatura multi-select
- ✅ Badge ⚠️ su elementi con sforature
- ✅ Dettaglio sforature visualizzabile

### US9: Monitoraggio Scadenze
**Come utente**, voglio vedere preventivi che scadono nei prossimi 7 giorni **per** follow-up.

**Criteri di Accettazione:**
- ✅ Preset "Preventivi in Scadenza"
- ✅ Filtro data scadenza con quick filter "Prossimi 7gg"
- ✅ Alerting visivo 🔴 per scaduti
- ✅ Ordinamento per data scadenza

### US10: Analisi Alto Valore
**Come utente**, voglio identificare polizze con premio > 10.000€ **per** analisi portfolio.

**Criteri di Accettazione:**
- ✅ Filtro premio con range slider
- ✅ Preset "Alto Valore"
- ✅ Totali premi visibili
- ✅ Export con aggregati

---

## Criteri di Accettazione

### Funzionalità
- ✅ Tutti i campi chiave sono filtrabili secondo specifiche
- ✅ Filtri si applicano con logica gerarchica corretta
- ✅ Contatore risultati aggiornato in tempo reale
- ✅ Possibilità di salvare/caricare preset filtri
- ✅ Export dati filtrati funzionante (JSON/Excel/CSV)
- ✅ Filtri persistono in URL per condivisione
- ✅ Reset parziale (per categoria) e totale
- ✅ Ricerca full-text globale funzionante

### Performance
- ✅ Applicazione filtri < 500ms su dataset con 100+ schede
- ✅ Rendering lista virtualizzato per > 1000 elementi
- ✅ Debouncing su input testuali (500ms)
- ✅ Memoization su calcoli complessi
- ✅ Indicizzazione dati pre-processing

### UI/UX
- ✅ Interfaccia intuitiva e responsive
- ✅ Feedback visivo chiaro (loading, errori, successi)
- ✅ Accessibilità keyboard navigation
- ✅ Contrast ratio AA per elementi visivi
- ✅ Mobile-friendly (responsive design)
- ✅ Dark mode supportato (opzionale)

### Testing
- ✅ Unit test copertura > 80%
- ✅ Integration test scenari principali
- ✅ E2E test user stories critiche
- ✅ Performance test con dataset grandi
- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Documentazione
- ✅ README con istruzioni setup
- ✅ Documentazione API/componenti
- ✅ Guide utente per filtri avanzati
- ✅ Changelog versioni
- ✅ Troubleshooting common issues

---

## Riferimenti Codice

### File C# Esistenti

#### RVPolizzaReaderHelper.cs
```csharp
// Caricamento polizza da file o DB
public static RVPolizza GetRVPolizza(
    int codComp, 
    long NumPolizza, 
    int prgPolizza, 
    DateTime dataRiferimento, 
    ModalitaCaricamentoRVPolizza modalitaCaricamento
)

// Verifica presenza partite/schede
private static bool PartitePresenti(RVPolizza rvPolizza)
private static bool SchedePresenti(RVPolizza rvPolizza)

// Recupero partita specifica
public static Partita GetPartita(
    RVPolizza polizza, 
    int prgScheda, 
    int prgPartita
)
```

#### ContrattoWriter.cs
```csharp
// Scrittura tableholder CONTRATTO
protected virtual ITableHolder WriteContratto()

// Scrittura partite
private ITableHolder WritePartita(
    Partita partita, 
    int prgPartitaDB, 
    int prgScheda
)

// Scrittura sforature
private ITableHolder WriteSforatura(
    ISforatura sfo, 
    int prgGruppo, 
    int prgScheda, 
    int prgPartita
)

// Codifica key sforature
private string GetKeyRecAutor(
    ISforatura sfo, 
    int prgGruppo, 
    int prgScheda, 
    int prgPartita
)
```

#### TableDefinitions.cs
```csharp
// Definizioni tabelle e campi
public static class CONTRATTO {
    public static readonly Field NUM_CONTRATTO;
    public static readonly Field PRG_CONTRATTO;
    public static readonly Field TIP_STRUTTURA;
    // ... altri campi
}

public static class SEQUENZIALE {
    public static readonly Field TXT_REC_OUT;
    // Campo contenente i record serializzati
}

public static class SFORATURA {
    public static readonly Field TIP_AUTOR;
    public static readonly Field KEY_REC_AUTOR;
    public static readonly Field COD_STATO_SFO;
    // ... altri campi
}
```

#### ContrattoInitializer.cs
```csharp
// Caricamento gruppi assicurati
private void DoICR()

// Caricamento schede
private void DoScheda(IScheda scheda)

// Parsing sforature
private RVContestoPortafoglio GetContestoFromKeySforatura(
    TipoSforatura tipo, 
    string keyAutorRec
)
```

### Mapping Campi Chiave

```javascript
// Mapping C# → TypeScript/React
const fieldMapping = {
  // CONTRATTO
  'COD_COMP': 'codComp',
  'NUM_CONTRATTO': 'numContratto',
  'PRG_CONTRATTO': 'prgContratto',
  'TIP_STRUTTURA': 'tipStruttura',
  'DAT_DECORRENZA': 'datDecorrenza',
  'DAT_SCADENZA': 'datScadenza',
  'FLG_PREVENT': 'flgPrevent',
  
  // SCHEDA
  'PRG_SCHEDA': 'progressivoScheda',
  'COD_PRODOTTO': 'codiceProdotto',
  
  // PARTITA
  'PRG_PARTITA': 'progressivoPartita',
  'IMP_SOMMA_ASS': 'sommaAssicurata',
  'IMP_PREMIO_NETTO': 'premioNetto',
  'IMP_PREMIO_LORDO': 'premioLordo',
  'COD_RAMO_CONTABILE': 'codiceRamoContabile',
  
  // SFORATURA
  'TIP_AUTOR': 'tipoAutor',
  'KEY_REC_AUTOR': 'keyRecAutor',
  'COD_STATO_SFO': 'statoSfo'
};
```

---

## Domande Aperte e Decisioni

### Domande per Stakeholder

1. **Filtro Full-Text:**
   - Serve ricerca full-text globale su tutti i campi?
   - Quali campi devono avere priorità nei risultati?

2. **Storico Filtri:**
   - Serve storico degli ultimi N filtri applicati?
   - Quanto deve essere persistente (sessione/browser/utente)?

3. **Condivisione Preset:**
   - I preset devono essere personali o condivisi tra utenti?
   - Serve sistema di permessi per preset (pubblici/privati)?

4. **Analytics:**
   - Serve tracciamento su quali filtri vengono usati più spesso?
   - Dati analytics per migliorare UX?

5. **Editing Inline:**
   - Serve possibilità di modificare dati direttamente dalla vista?
   - O è solo visualizzazione read-only?

6. **Confronto Versioni:**
   - Serve confronto tra versioni diverse della stessa polizza?
   - Diff visivo per variazioni?

7. **Notifiche:**
   - Serve sistema notifiche per polizze filtrate (es: in scadenza)?
   - Push notifications / Email alerts?

8. **Mobile:**
   - Priorità mobile-first o desktop-first?
   - Serve app nativa o PWA sufficiente?

### Decisioni Tecniche da Prendere

- [ ] Framework UI: Ant Design vs Material-UI vs Radix UI
- [ ] State Management: Redux vs Zustand vs Context API
- [ ] Data Grid: AG-Grid (commercial) vs TanStack Table (free)
- [ ] Export PDF: jsPDF vs pdfmake vs backend generation
- [ ] Hosting: Cloud (AWS/Azure) vs On-Premise
- [ ] Database: Query diretta DB vs API middleware
- [ ] Caching: Redis vs In-Memory vs Browser Storage

---

## Roadmap Implementazione

### Fase 1: MVP (4-6 settimane)
- [ ] Setup progetto e architettura base
- [ ] Caricamento e parsing file [061]
- [ ] Vista gerarchica senza filtri
- [ ] Filtri base (Contratto, Schede)
- [ ] Export JSON

### Fase 2: Filtri Avanzati (3-4 settimane)
- [ ] Tutti i filtri specificati
- [ ] Preset filtri
- [ ] Ricerca full-text
- [ ] Export Excel/CSV

### Fase 3: Ottimizzazioni (2-3 settimane)
- [ ] Performance su dataset grandi
- [ ] Virtualizzazione
- [ ] Indicizzazione
- [ ] Caching intelligente

### Fase 4: Features Avanzate (3-4 settimane)
- [ ] URL sharing
- [ ] Analytics
- [ ] Notifiche
- [ ] Mobile optimization

### Fase 5: Testing & Deploy (2 settimane)
- [ ] Testing completo
- [ ] Fixing bugs
- [ ] Documentazione
- [ ] Deploy produzione

---

## Appendice

### Glossario Termini

- **RVPolizza**: Polizza Rami Vari
- **TableHolder**: Struttura dati contenente record DB
- **Tracciato [061]**: Formato file sequenziale polizze
- **ICR**: Incrocio Contraente/Rischio
- **Sforatura**: Eccezione autorizzativa
- **PXA**: Attributo Prodotto
- **GAR**: Garanzia
- **GRS**: Griglia tariffaria
- **CTL**: Controllo

### Risorse Utili

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ant Design Components](https://ant.design/components/overview/)
- [TanStack Table](https://tanstack.com/table)
- [Zod Validation](https://zod.dev)

---

**Versione Documento:** 1.0  
**Data Creazione:** 2025-01-10  
**Ultimo Aggiornamento:** 2025-01-10  
**Autore:** AI Assistant (Claude)  
**Status:** Draft / In Review