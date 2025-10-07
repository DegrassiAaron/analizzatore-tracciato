# Analizzatore Tracciati Assicurativi

Applicazione web per l'analisi di file tracciato in formato fisso utilizzati nel settore assicurativo italiano.

## 📋 Panoramica

Analizzatore Tracciati è un'applicazione browser-based (nessun backend richiesto) che permette di:

- 📂 Caricare e analizzare file TXT con tracciati assicurativi in formato fisso
- 🔍 Visualizzare e filtrare documenti per codice compagnia, contratto, prodotto, data
- 📊 Esplorare i dati organizzati per blocchi con tabelle interattive
- 💾 Scaricare tracciati filtrati singolarmente o in archivio ZIP
- 🎯 Gestire file di grandi dimensioni (fino a 8GB) con elaborazione a chunk
- 🌙 Interfaccia dark mode ispirata a VS Code

## 🚀 Come Usare

### Avvio Locale

L'applicazione richiede un server HTTP locale per il supporto dei moduli ES6:

**Opzione 1 - Python HTTP Server:**
```bash
cd analizzatore-tracciato
python -m http.server 8080
```
Poi apri: http://localhost:8080

**Opzione 2 - VS Code Live Server:**
1. Installa l'estensione "Live Server"
2. Apri `index.html`
3. Click destro → "Open with Live Server"

**Opzione 3 - npx serve:**
```bash
npx serve
```

### Workflow Tipico

1. **Carica File**: Trascina file TXT o clicca per selezionarli (max 8 file, ognuno fino a 8GB)
2. **Elabora**: Click su "Elabora File" - l'app parserà i tracciati
3. **Filtra**: Usa i filtri per codice compagnia, contratto, prodotto, data, tipo documento
4. **Analizza**: Click su "Analisi" per esplorare i dati nel modal
5. **Esporta**: Seleziona documenti e scarica singolarmente o in ZIP

## 📁 Formato Tracciato

I file devono seguire il formato fisso:

```
[0-109: Header][109-200: Versione][200-230: Nome Blocco][230+: Dati Blocco]
```

**Esempio di riga:**
```
GRADPANA  2025-10-042025-10-04000072300100005016550160000000...WGRVBCNT0000+001+0000501655016...
```

### Struttura Header (0-109)

- **0-10**: Identificativo
- **10-20**: Data 1 (aaaa-mm-gg)
- **20-30**: Data 2 (aaaa-mm-gg)
- **37-40**: Codice Compagnia (3 chars)
- **40-53**: Numero Contratto (13 chars)
- **53-60**: Progressivo Contratto (7 chars)
- **68-78**: Data Riferimento (10 chars)
- **78-81**: Tipo Documento (3 chars)
- **83-86**: Codice Prodotto (3 chars)
- **86-99**: Numero Documento (13 chars)

Vedi [PARSING_STRUCTURE.md](./PARSING_STRUCTURE.md) per dettagli completi.

## 🧩 Blocchi Supportati

L'applicazione riconosce oltre 30 tipi di blocchi:

### Blocchi Sistema
- **CNT**: Contratto - Dati principali polizza
- **SCH**: Scheda - Dettagli coperture
- **PRT**: Partita - Calcolo premio
- **PAX**: Parametri - Parametri copertura
- **DOC**: Documenti
- **AGE**: Agenzia/Broker
- **RIS/RIN**: Risposte questionari
- **COI**: Altri dati sistema

### Blocchi Anagrafica
- **CPERSONA**: Persona fisica
- **CIMPRESA**: Azienda
- **CVEICOLO**: Veicolo
- **CFABBRICATO**: Edificio
- **CUBICAZIONE**: Indirizzo
- **CNATANTE**: Imbarcazione
- E altri...

### Blocchi Relazione
- **CRELAZIONERR**: Relazioni tra entità
- **CRELAZIONECR**: Relazioni incrociate (entità ↔ scheda con ruolo)

Vedi [BLOCK_DEFINITIONS.md](./BLOCK_DEFINITIONS.md) per l'elenco completo con tutti i campi.

## 🎨 Funzionalità

### Elaborazione File
- ✅ Caricamento fino a 8 file (ognuno max 8GB)
- ✅ Elaborazione chunk-based (10MB) per file grandi
- ✅ Gestione memoria ottimizzata con limite righe configurabile
- ✅ Caricamento on-demand per documenti con molte righe

### Visualizzazione
- ✅ Tabella documenti con ordinamento e filtri
- ✅ Modal di analisi con 4 tab:
  - **Dati Tracciato**: Info generali + tutti i blocchi con accordion
  - **Dati Contratto**: (stub - da implementare)
  - **Dati Schede**: (stub - da implementare)
  - **Dati Anagrafici**: (stub - da implementare)
- ✅ Tabelle blocchi interattive:
  - Ordinamento click su colonna (▲▼)
  - Filtri per colonna con input ricerca
  - Nascondi/mostra colonne (menu ☰)
  - Drag & drop per riordinare colonne
  - Paginazione (5 righe per pagina)

### Filtri Documenti
- Codice Compagnia
- Numero Contratto
- Numero Documento
- Tipo Documento
- Codice Prodotto
- Data Riferimento (4 modalità):
  - Data esatta
  - Prima di
  - Dopo
  - Intervallo

### Download
- ✅ Scarica tracciati selezionati singolarmente
- ✅ Scarica tracciati selezionati in ZIP
- ✅ Formato nome file: `[{codProdotto}]{codCompagnia}-{numContratto}-{numDocumento}_{dataRiferimento}.txt`
- ✅ Rimozione automatica ultima riga vuota
- ✅ Ricarica automatica righe complete per documenti troncati

### Logging
- ✅ Console log con checkbox "Log dettagliato"
- ✅ Log normale: solo operazioni principali
- ✅ Log dettagliato: debug parsing, blocchi non riconosciuti, dettagli per file

## 🏗️ Architettura

### Struttura Modular ES6

```
analizzatore-tracciato/
├── index.html                    # Entry point HTML
├── css/
│   └── styles.css               # Tutti gli stili
├── js/
│   ├── main.js                  # Inizializzazione app
│   ├── config/
│   │   ├── blockDefinitions.js  # Schemi blocchi (30+ tipi)
│   │   └── config.js            # Costanti configurazione
│   ├── core/
│   │   ├── parser.js            # Parsing linee e blocchi
│   │   ├── state.js             # Stato applicazione
│   │   └── fileHandler.js       # Upload e elaborazione file
│   ├── ui/
│   │   ├── dom.js               # Riferimenti DOM e logging
│   │   ├── table.js             # Tabella documenti
│   │   ├── modal.js             # Modal analisi
│   │   └── filters.js           # Filtri documenti
│   ├── features/
│   │   └── download.js          # Download singolo/ZIP
│   └── utils/
│       └── utils.js             # Funzioni utility
├── README.md                     # Questo file
├── CLAUDE.md                     # Istruzioni per Claude Code
├── BLOCK_DEFINITIONS.md          # Definizioni blocchi completi
├── PARSING_STRUCTURE.md          # Struttura parsing dettagliata
├── tracciato.md                  # Doc formato tracciato
├── tracciato2.md                 # Doc struttura blocchi
└── tracciato3.md                 # Doc definizioni campi
```

### Gestione Memoria

Ottimizzata per file fino a 8GB:

**Configurazione** (`js/config/config.js`):
```javascript
MAX_FILES = 8               // Max file caricabili
MAX_LINES_PER_DOC = 10000   // Limite righe salvate in RAM
SAVE_RAW_LINES = true       // Salva righe raw (disabilita per file enormi)
```

**Strategia**:
1. Elaborazione chunk-based (10MB per volta)
2. Salvataggio dati blocchi sempre completo
3. Righe raw troncate sopra `MAX_LINES_PER_DOC`
4. Ricarica automatica on-demand quando necessario (analisi, download)

## 🔧 Configurazione

### Costanti Memoria

Modifica `js/config/config.js` in base alla dimensione dei tuoi file:

- **< 1GB**: Impostazioni default OK
- **1-5GB**: `MAX_LINES_PER_DOC = 5000`
- **5-8GB**: `MAX_LINES_PER_DOC = 1000`, considera `SAVE_RAW_LINES = false`

### Aggiungere Nuovi Blocchi

1. Apri `js/config/blockDefinitions.js`
2. Aggiungi definizione blocco:

```javascript
'NUOVO_BLOCCO': [
    { name: 'CAMPO1', pos: 0, len: 10 },   // pos relativo a 230
    { name: 'CAMPO2', pos: 10, len: 5 },
    // ...
]
```

3. L'algoritmo di estrazione riconoscerà automaticamente:
   - Blocchi sistema: `WGRVBNUOVO0000` → estrae `NUOVO`
   - Blocchi anagrafica: `CNUOVO` → match esatto

## 📊 Algoritmo Parsing Blocchi

L'app usa un algoritmo a 4 step per identificare i blocchi:

1. **Match esatto**: es. `CPERSONA` → trovato in definizioni
2. **Rimuovi numeri**: `WGRVBCNT0000` → `WGRVBCNT`
3. **Ultimi 3 char**: `WGRVBCNT` → `CNT` → trovato ✓
4. **Ultimi 2 char**: fallback per ID a 2 caratteri

Supporta prefissi variabili (WGRVB, XGRAB, futuri) e suffissi numerici variabili.

## 🛠️ Tecnologie

- **Vanilla JavaScript** (ES6 modules)
- **JSZip** 3.10.1 (per export ZIP)
- **No framework** - puro HTML/CSS/JS
- **No backend** - tutto client-side

## 📄 Licenza

Questo progetto è distribuito senza alcuna licenza specifica. Usa a tuo rischio.

## 🤝 Contributi

Questo è un progetto interno. Per modifiche:

1. Leggi `CLAUDE.md` per convenzioni architetturali
2. Segui la struttura modulare esistente
3. Aggiungi test per nuovi blocchi

## 🐛 Risoluzione Problemi

### L'applicazione non si carica
- **Causa**: CORS policy - i moduli ES6 richiedono HTTP server
- **Soluzione**: Usa un server HTTP locale (vedi sezione "Come Usare")

### Blocchi non riconosciuti
- **Causa**: Posizioni blocco errate o blocco non in definizioni
- **Debug**: Abilita "Log dettagliato" per vedere parsing step-by-step
- **Soluzione**: Aggiungi blocco in `blockDefinitions.js`

### File troppo grande
- **Causa**: Memoria insufficiente
- **Soluzione**: Riduci `MAX_LINES_PER_DOC` in `config/config.js`

### Accordion non si apre
- **Causa**: Errore JavaScript
- **Debug**: Apri Console browser (F12) e cerca errori
- **Soluzione**: Ricarica pagina (Ctrl+F5) e verifica Console

## 📞 Supporto

Per problemi, verifica prima:
1. Console browser (F12) per errori JavaScript
2. Network tab per errori di caricamento moduli
3. Log dettagliato nell'applicazione

## 🗺️ Roadmap

Funzionalità future:
- [ ] Implementare tab "Dati Contratto" (raggruppamento CNT)
- [ ] Implementare tab "Dati Schede" (raggruppamento SCH)
- [ ] Implementare tab "Dati Anagrafici" (entità e relazioni)
- [ ] Ricerca full-text nei dati
- [ ] Export in formato JSON/CSV
- [ ] Validazione tracciati con regole business
- [ ] Confronto tra tracciati (diff)
- [ ] Statistiche e grafici

---

**Versione**: 1.0.0
**Ultimo aggiornamento**: 2025-01-07
