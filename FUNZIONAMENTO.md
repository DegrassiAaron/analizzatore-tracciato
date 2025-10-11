# Funzionamento dell'Analizzatore Tracciati

## Panoramica
L'applicazione è interamente client-side: `index.html` carica `css/styles.css` e i moduli ES6 in `js/`. Serve solo un web server statico per permettere gli import.

## Flusso di Elaborazione
1. **Selezione file** - l'utente trascina o sceglie TXT; `handleFiles` filtra le estensioni e applica i limiti configurati in `js/config/config.js`.
2. **Accodamento** - gli elementi accettati vengono salvati nello stato reattivo (`js/core/state.js`) e mostrati nell'elenco file con dimensioni aggregate.
3. **Parsing chunk-based** - `processFileInChunks` legge i file a blocchi da 10 MB, ricompone le righe e invoca `extractHeaderData`/`parseBlockData` per trasformare i record fissi in strutture JSON.
4. **Indicizzazione documenti** - le righe vengono raggruppate per combinazione compagnia-contratto-documento e archiviate nella mappa `documentsData`, insieme ai blocchi riconosciuti (`BLOCK_DEFINITIONS`).
5. **Esposizione UI** - i dati popolano tabelle, modali e pannelli filtro tramite i componenti in `js/ui/` (DOM helpers, modale di dettaglio, filtri live).

## Componenti Principali
- `js/core/parser.js` identifica header, blocchi e campi secondo lo schema in `PARSING_STRUCTURE.md`.
- `js/features/download.js` genera estrazioni TXT o ZIP usando le righe raw conservate (se `SAVE_RAW_LINES` è true).
- `js/ui/filters.js` applica filtri incrementali sui documenti caricati e aggiorna indicatori di stato.
- `js/utils/utils.js` mette a disposizione utility condivise (`formatSize`, `updateProgress`).

## Gestione e Prestazioni
- Limiti predefiniti: massimo 8 file e 20 GB complessivi; parametri modificabili in `js/config/config.js`.
- Per evitare crash, ogni documento salva al più `MAX_LINES_PER_DOC` linee raw; oltre la soglia imposta `linesTruncated` e mantiene solo i dati strutturati.
- Il parser registra blocchi non riconosciuti così da facilitarne la definizione successiva in `BLOCK_DEFINITIONS.md`.

## Interfaccia e Logging
- `js/main.js` inizializza l'interfaccia ed espone funzioni globali richiamate dagli `onclick` in `index.html`.
- `logToConsole` popola il pannello console personalizzato con livelli `info`, `warning`, `error`, `success`.
- Upload, parsing e download aggiornano progress bar, badge e pulsanti per guidare l'utente.

## Procedure di Verifica Manuale
- Caricare un file campione ridotto e verificare nel modale Analisi la mappatura dei blocchi chiave.
- Testare un file voluminoso per osservare messaggi su limiti memoria e completamento.
- Applicare filtri combinati (compagnia, prodotto, data) e scaricare l'output per confrontarlo con la vista corrente.

## Allineamento Documentazione
- Aggiornare `PARSING_STRUCTURE.md` e `BLOCK_DEFINITIONS.md` quando cambiano i tracciati forniti dalle compagnie.
- Usare `settings.local.json` solo per preferenze locali (es. percorsi demo); non commitare dati reali o credenziali.
