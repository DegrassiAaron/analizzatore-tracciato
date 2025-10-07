# Definizioni Blocchi Tracciato Assicurativo

Documentazione completa di tutti i blocchi supportati dall'Analizzatore Tracciati.

## 📋 Indice

- [Panoramica](#panoramica)
- [Blocchi Sistema (15)](#blocchi-sistema)
  - [CNT - Contratto](#cnt---contratto)
  - [SCH - Scheda](#sch---scheda)
  - [PRT - Partita](#prt---partita)
  - [PAX - Parametri](#pax---parametri)
  - [RIS - Risposte](#ris---risposte)
  - [DOC - Documento](#doc---documento)
  - [RIN - Risposte Rischio](#rin---risposte-rischio)
  - [SFO - Sforatura](#sfo---sforatura)
  - [AGE - Agenzia](#age---agenzia)
  - [COA - Coassicurazione](#coa---coassicurazione)
  - [CVP - Convenzione Particolare](#cvp---convenzione-particolare)
  - [COI - Dati Contratto Info](#coi---dati-contratto-info)
  - [PCE - Parametri Comunicazione](#pce---parametri-comunicazione)
  - [LPS - Loss Portfolio Statement](#lps---loss-portfolio-statement)
  - [PCB - Partita Contributo Base](#pcb---partita-contributo-base)
- [Blocchi Anagrafica (12)](#blocchi-anagrafica)
  - [CPERSONA - Persona Fisica](#cpersona---persona-fisica)
  - [CNATANTE - Natante](#cnatante---natante)
  - [CIMPRESA - Impresa](#cimpresa---impresa)
  - [CFABBRICATO - Fabbricato](#cfabbricato---fabbricato)
  - [CUBICAZIONE - Ubicazione](#cubicazione---ubicazione)
  - [CATTIVITA - Attività](#cattivita---attività)
  - [CVEICOLO - Veicolo](#cveicolo---veicolo)
  - [CENTITASTRINGA - Entità Stringa](#centitastringa---entità-stringa)
  - [CGRUPPOANAG - Gruppo Anagrafico](#cgruppoanag---gruppo-anagrafico)
  - [CAEROMOBILE - Aeromobile](#caeromobile---aeromobile)
  - [CUSISPECIALI - Usi Speciali](#cusispeciali---usi-speciali)
  - [CANIMALE - Animale](#canimale---animale)
- [Blocchi Relazione (3)](#blocchi-relazione)
  - [CRELAZIONERR - Relazione RR](#crelazionerr---relazione-rr)
  - [CRELAZIONEGR - Relazione Gruppo](#crelazionegr---relazione-gruppo)
  - [CRELAZIONECR - Relazione CR](#crelazionecr---relazione-cr)
- [Blocchi Varianti (non supportati)](#blocchi-varianti-non-supportati)

---

## Panoramica

Ogni blocco in un tracciato assicurativo segue la struttura:

```
[0-109: Header][109-200: Versione][200-230: Nome Blocco][230+: Dati Blocco]
```

**Tutte le posizioni dei campi in questo documento sono relative alla posizione 230** (inizio dati blocco), non assolute rispetto all'inizio della linea.

### Tipi di Blocchi

1. **Blocchi Sistema** (con prefisso variabile):
   - Formato: `[PREFISSO][ID][NUMERO]` (es. `WGRVBCNT0000`)
   - ID estratto: ultimi 3 caratteri prima del numero (es. `CNT`)
   - Contengono i dati operativi della polizza

2. **Blocchi Anagrafica** (nome completo):
   - Formato: Nome completo senza prefisso (es. `CPERSONA`)
   - Match esatto con il nome
   - Rappresentano entità fisiche o giuridiche

3. **Blocchi Relazione**:
   - Collegano entità tra loro o a schede/contratti
   - Formato: Nome completo (es. `CRELAZIONERR`)

---

## Blocchi Sistema

### CNT - Contratto

**Nome blocco**: `WGRVBCNT0000` (o `XGRABCNT0000` per prefissi futuri)
**ID estratto**: `CNT`
**Descrizione**: Dati principali del contratto assicurativo

**Campi** (60 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto (8 char, diverso da header) |
| DAT_FINE_VAL | 26 | 10 | Data fine validità |
| TIP_PORTAF | 36 | 1 | Tipo portafoglio |
| COD_STATO_PTF | 37 | 1 | Codice stato portafoglio |
| TIP_DOCUMENTO_MOD | 38 | 2 | Tipo documento modifica |
| NUM_DOCUMENTO_MOD | 40 | 14 | Numero documento modifica |
| DAT_DECORRENZA | 54 | 10 | Data decorrenza contratto |
| DAT_SCADENZA | 64 | 10 | Data scadenza contratto |
| NUM_DURATA | 74 | 8 | Durata contratto (mesi) |
| COD_FRAZIONAMENTO | 82 | 1 | Codice frazionamento premio |
| NUM_AGENZIA | 83 | 8 | Numero agenzia |
| COD_ESENZIONE | 91 | 1 | Codice esenzione fiscale |
| COD_ANNULL_CON | 92 | 3 | Codice annullamento contratto |
| DAT_ANNULL_CON | 95 | 10 | Data annullamento contratto |
| COD_ANNULL_SUB | 105 | 3 | Codice annullamento subentro |
| COD_ANNULL_USER | 108 | 8 | User annullamento |
| DAT_ANNULL_REG | 116 | 10 | Data annullamento regolamento |
| KEY_AUTOR | 126 | 10 | Chiave autorizzazione |
| COD_COASS | 136 | 1 | Codice coassicurazione |
| COD_VINCOLO | 137 | 1 | Codice vincolo |
| COD_RINNOVO | 138 | 1 | Codice rinnovo |
| TIP_CONVENZ | 139 | 1 | Tipo convenzione |
| COD_CONVERS | 140 | 2 | Codice conversione |
| COD_VALUTA | 142 | 4 | Codice valuta |
| ORA_DEC_IMMEDIATA | 146 | 5 | Ora decorrenza immediata (hh:mm) |
| COD_PER_RESCIND | 151 | 2 | Codice periodo rescissione |
| DAT_RESCINDIB | 153 | 10 | Data rescindibilità |
| TIP_STRUTTURA | 163 | 2 | Tipo struttura contratto |
| COD_DIR_CONTI | 165 | 2 | Codice direzione contabile |
| DAT_RIF_TABELLE | 167 | 10 | Data riferimento tabelle |
| COD_LINGUA | 177 | 2 | Codice lingua |
| COD_FRAZ_PROROG | 179 | 1 | Codice frazionamento proroghe |
| COD_CONGUAGLIO | 180 | 1 | Codice conguaglio |
| DAT_APPLIC_AR | 181 | 10 | Data applicazione autoriduzione |
| TIP_RISK | 191 | 1 | Tipo risk |
| DAT_RIATTIVAZ | 192 | 10 | Data riattivazione |
| COD_RIASS | 202 | 4 | Codice riassicurazione |
| COD_INDICIZZ | 206 | 1 | Codice indicizzazione |
| COD_BLOK_INDIC | 207 | 1 | Codice blocco indicizzazione |
| COD_TAB_INDIC | 208 | 2 | Codice tabella indicizzazione |
| COD_GEST_PROVV | 210 | 1 | Codice gestione provvigione |
| COD_RIPRESA | 211 | 2 | Codice ripresa |
| COD_PRODOTTO_GRV | 213 | 6 | Codice prodotto Gravistar |
| COD_PROD_SUPER | 219 | 4 | Codice prodotto super |
| COD_EDIZ_STAMPATO | 223 | 4 | Codice edizione stampato |
| COD_RAMOPOL | 227 | 4 | Codice ramo polizza |
| COD_CATEGORIA | 231 | 4 | Codice categoria |
| COD_STORNO_SIDA | 235 | 3 | Codice storno SIDA |
| PER_NS_QUOTA | 238 | 7 | Percentuale nostra quota |
| FLG_CONDELEGA | 245 | 1 | Flag con delega |
| COD_ACQUISITORE | 246 | 7 | Codice acquisitore |
| DAT_CONTAB_PROT | 253 | 10 | Data contabile protocollo |
| DAT_CONTAB_ANN | 263 | 10 | Data contabile annullamento |
| DAT_INIZ_VAL | 273 | 10 | Data inizio validità |
| COD_USER_INS | 283 | 8 | User inserimento |
| TMS_INS | 291 | 28 | Timestamp inserimento |
| COD_USER_MOD | 317 | 8 | User modifica |
| TMS_MOD | 325 | 28 | Timestamp modifica |
| COD_ADEGUAMENTO | 351 | 1 | Codice adeguamento |
| COD_COMP_C | 352 | 4 | Codice compagnia C |
| FLG_DIGITALE | 356 | 1 | Flag digitale |
| COD_PROPOSTA | 357 | 1 | Codice proposta |
| COD_MODULARE | 358 | 1 | Codice modulare |
| COD_ANTIMAFIA | 359 | 1 | Codice antimafia |

---

### SCH - Scheda

**Nome blocco**: `WGRVBSCH0000`
**ID estratto**: `SCH`
**Descrizione**: Dettagli delle schede/coperture associate al contratto

**Campi** (36 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| DAT_FINE_VAL | 34 | 10 | Data fine validità |
| COD_RAMO_ATOM | 44 | 5 | Codice ramo atomico |
| DAT_DECORRENZA | 49 | 10 | Data decorrenza scheda |
| DAT_SCADENZA | 59 | 10 | Data scadenza scheda |
| IMP_PREMIO | 69 | 16 | Importo premio |
| COD_ANN_SKE | 85 | 2 | Codice annullamento scheda |
| DAT_ANN_SKE | 87 | 10 | Data annullamento scheda |
| COD_ANNULL_USER | 97 | 8 | User annullamento |
| DAT_ANNULL_REG | 105 | 10 | Data annullamento regolamento |
| TIP_DOCUMENTO_MOD | 115 | 2 | Tipo documento modifica |
| NUM_DOCUMENTO_MOD | 117 | 14 | Numero documento modifica |
| COD_RICALCOLO | 131 | 1 | Codice ricalcolo |
| TIP_RINNOVO_SCHEDA | 132 | 2 | Tipo rinnovo scheda |
| COD_CONTAB | 134 | 1 | Codice contabilità |
| COD_RAMO_FORTE | 135 | 5 | Codice ramo forte |
| COD_RELAZIONE | 140 | 1 | Codice relazione |
| PRG_MADRE | 141 | 8 | Progressivo madre |
| TIP_RISK_PROVV | 149 | 3 | Tipo risk provvigione |
| COD_VALUTA | 152 | 4 | Codice valuta |
| COD_CONVERS | 156 | 2 | Codice conversione |
| DAT_APPLIC_DC | 158 | 10 | Data applicazione DC |
| COD_DIR_CONTI | 168 | 2 | Codice direzione contabile |
| COD_CONGUAGLIO | 170 | 1 | Codice conguaglio |
| COD_INDICIZZ | 171 | 1 | Codice indicizzazione |
| COD_BLOK_INDIC | 172 | 1 | Codice blocco indicizzazione |
| COD_TAB_INDIC | 173 | 2 | Codice tabella indicizzazione |
| DAT_ULT_INDIC | 175 | 10 | Data ultima indicizzazione |
| NUM_ISTAT | 185 | 5 | Numero ISTAT |
| PER_INCRE_ISTAT | 190 | 8 | Percentuale incremento ISTAT |
| PER_INCRE_ETA | 198 | 8 | Percentuale incremento età |
| COD_LANCIO_PVAG | 206 | 7 | Codice lancio PVAG |
| COD_RAMOGAR | 213 | 4 | Codice ramo garanzia |
| COD_CATEG_GAR | 217 | 4 | Codice categoria garanzia |
| DAT_INIZ_VAL | 221 | 10 | Data inizio validità |
| COD_USER_INS | 231 | 8 | User inserimento |
| TMS_INS | 239 | 28 | Timestamp inserimento |
| COD_USER_MOD | 265 | 8 | User modifica |
| TMS_MOD | 273 | 28 | Timestamp modifica |
| COD_ADEGUAMENTO | 299 | 1 | Codice adeguamento |
| DAT_ADEGUAMENTO | 300 | 10 | Data adeguamento |
| COD_LIVELLO_ADEG | 310 | 1 | Codice livello adeguamento |

---

### PRT - Partita

**Nome blocco**: `WGRVBPRT0000`
**ID estratto**: `PRT`
**Descrizione**: Dettagli di calcolo premio per singola partita/garanzia

**Campi** (26 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 6 | Progressivo partita |
| DAT_FINE_VAL | 40 | 10 | Data fine validità |
| COD_RAMO_ATOM | 50 | 5 | Codice ramo atomico |
| COD_GAR_LIV1 | 55 | 3 | Codice garanzia livello 1 |
| COD_GAR_LIV2 | 58 | 3 | Codice garanzia livello 2 |
| COD_GAR_LIV3 | 61 | 3 | Codice garanzia livello 3 |
| COD_GAR_SUB | 64 | 1 | Codice garanzia sub |
| COD_CLA_ID | 65 | 3 | Codice classe ID |
| COD_CLA_SUB | 68 | 1 | Codice classe sub |
| DAT_TARIFFA | 69 | 10 | Data tariffa |
| COD_TARIFFA | 79 | 3 | Codice tariffa |
| DAT_INGRESSO_TAR | 82 | 10 | Data ingresso tariffa |
| IMP_PREMIO | 92 | 14 | Importo premio |
| COD_VALUTA | 106 | 4 | Codice valuta |
| COD_TAR_PROVIN | 110 | 3 | Codice tariffa provincia |
| COD_TAR_ZONA | 113 | 3 | Codice tariffa zona |
| IMP_PREMIO_TECNICO | 116 | 14 | Importo premio tecnico |
| COD_FORZATURA | 130 | 1 | Codice forzatura |
| DAT_INIZ_VAL | 131 | 10 | Data inizio validità |
| COD_USER_INS | 141 | 8 | User inserimento |
| TMS_INS | 149 | 28 | Timestamp inserimento |
| COD_USER_MOD | 175 | 8 | User modifica |
| TMS_MOD | 183 | 28 | Timestamp modifica |

---

### PAX - Parametri

**Nome blocco**: `WGRVBPAX0000`
**ID estratto**: `PAX`
**Descrizione**: Parametri di copertura (fino a 10 parametri per riga)

**Campi** (46 campi totali - pattern ripetuto per 10 parametri):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 6 | Progressivo partita |
| PRG_RCD_PARAM | 40 | 2 | Progressivo record parametro |
| DAT_FINE_VAL | 42 | 10 | Data fine validità |
| COD_CLA_ID_01 | 52 | 3 | Codice classe ID parametro 1 |
| COD_CLA_SUB_01 | 55 | 1 | Codice classe sub parametro 1 |
| NUM_PVLS_01 | 56 | 8 | Numero PVLS parametro 1 |
| VAL_PARAMETRO_01 | 64 | 14 | Valore parametro 1 |
| COD_PRESTAZ_01 | 78 | 2 | Codice prestazione parametro 1 |
| ... | ... | ... | *Campi 02-10 seguono lo stesso pattern* |
| COD_CLA_ID_10 | 304 | 3 | Codice classe ID parametro 10 |
| COD_CLA_SUB_10 | 307 | 1 | Codice classe sub parametro 10 |
| NUM_PVLS_10 | 308 | 8 | Numero PVLS parametro 10 |
| VAL_PARAMETRO_10 | 316 | 14 | Valore parametro 10 |
| COD_PRESTAZ_10 | 330 | 2 | Codice prestazione parametro 10 |
| DAT_INIZ_VAL | 332 | 10 | Data inizio validità |
| COD_USER_INS | 342 | 8 | User inserimento |
| TMS_INS | 350 | 28 | Timestamp inserimento |
| COD_INDICIZZ_01 | 376 | 1 | Codice indicizzazione parametro 1 |
| COD_INDICIZZ_02 | 377 | 1 | Codice indicizzazione parametro 2 |
| ... | ... | ... | *Indicizzazioni 03-10* |
| COD_INDICIZZ_10 | 385 | 1 | Codice indicizzazione parametro 10 |

---

### RIS - Risposte

**Nome blocco**: `WGRVBRIS0000`
**ID estratto**: `RIS`
**Descrizione**: Risposte a questionari di polizza

**Campi** (17 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 6 | Progressivo partita |
| NUM_QUESTION | 40 | 8 | Numero questionario |
| NUM_DOMANDA | 48 | 6 | Numero domanda |
| PRG_RISPOSTA | 54 | 4 | Progressivo risposta |
| NUM_RIGA_RISP | 58 | 4 | Numero riga risposta |
| DAT_FINE_VAL | 62 | 10 | Data fine validità |
| TIP_RISPOSTA | 72 | 1 | Tipo risposta (N=numerico, T=testo, D=data) |
| TIP_DATA | 73 | 1 | Tipo data |
| VAL_RISPOSTA | 74 | 14 | Valore risposta numerica |
| TXT_RISPOSTA | 88 | 70 | Testo risposta |
| NUM_LISTA | 158 | 8 | Numero lista |
| COD_VALUTA | 166 | 4 | Codice valuta |
| DAT_INIZ_VAL | 170 | 10 | Data inizio validità |
| COD_USER_INS | 180 | 8 | User inserimento |
| TMS_INS | 188 | 28 | Timestamp inserimento |
| COD_USER_MOD | 214 | 8 | User modifica |
| TMS_MOD | 222 | 28 | Timestamp modifica |

---

### DOC - Documento

**Nome blocco**: `WGRVBDOC0000`
**ID estratto**: `DOC`
**Descrizione**: Documenti di polizza (appendici, quietanze, ecc.)

**Campi** (40 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| TIP_DOCUMENTO | 4 | 2 | Tipo documento |
| NUM_DOCUMENTO | 6 | 14 | Numero documento |
| NUM_CONTRATTO | 20 | 14 | Numero contratto |
| PRG_CONTRATTO | 34 | 8 | Progressivo contratto |
| COD_DOC_CLASSIF | 42 | 2 | Codice documento classificazione |
| DAT_EFFETTO_COP | 44 | 10 | Data effetto copertura |
| DAT_SCAD_COP | 54 | 10 | Data scadenza copertura |
| DAT_REGOLAZ | 64 | 10 | Data regolazione |
| TIP_DOCUMENTO_SOS | 74 | 2 | Tipo documento sostituto |
| NUM_DOCUMENTO_SOS | 76 | 14 | Numero documento sostituto |
| NUM_AGENZIA_EMISS | 90 | 8 | Numero agenzia emissione |
| DAT_EMISSIONE | 98 | 10 | Data emissione |
| COD_STATO | 108 | 1 | Codice stato |
| COD_ANNULL_DOC | 109 | 1 | Codice annullamento documento |
| NUM_DISTINTA | 110 | 14 | Numero distinta |
| NUM_OPERAZIONE | 124 | 6 | Numero operazione |
| NUM_QUESTION | 130 | 8 | Numero questionario |
| COD_SUB_CLASSIF | 138 | 1 | Codice sub classificazione |
| DAT_CONVALIDA | 139 | 10 | Data convalida |
| DAT_PAGAMENTO | 149 | 10 | Data pagamento |
| NUM_RIF_CATAL | 159 | 8 | Numero riferimento catalogo |
| COD_CONVERS | 167 | 2 | Codice conversione |
| COD_VALUTA | 169 | 4 | Codice valuta |
| NUM_STAMPE | 173 | 4 | Numero stampe |
| COD_DIR_CONTI | 177 | 2 | Codice direzione contabile |
| COD_FASE_CARTA | 179 | 1 | Codice fase carta |
| COD_TRASM | 180 | 2 | Codice trasmissione |
| COD_ADEGUA | 182 | 1 | Codice adeguamento |
| COD_CONGUA | 183 | 1 | Codice conguaglio |
| COD_FIRMA | 184 | 1 | Codice firma |
| NUM_VERSIONE | 185 | 6 | Numero versione |
| PER_APP_BERS_PI | 191 | 6 | Percentuale app bersaglio PI |
| PER_NUOVA_PROD_PA | 197 | 6 | Percentuale nuova prod PA |
| DAT_CONTAB_DOC | 203 | 10 | Data contabile documento |
| COD_USER_INS | 213 | 8 | User inserimento |
| TMS_INS | 221 | 26 | Timestamp inserimento |
| COD_USER_MOD | 247 | 8 | User modifica |
| TMS_MOD | 255 | 28 | Timestamp modifica |
| COD_COMP_C | 281 | 4 | Codice compagnia C |
| TIP_CM | 285 | 3 | Tipo CM |
| FLG_DIGITALE | 288 | 1 | Flag digitale |
| FLG_RIEMISSIONE | 289 | 1 | Flag riemissione |
| DAT_IMPOSTE | 290 | 10 | Data imposte |
| TIP_OPERAZIONE | 300 | 3 | Tipo operazione |
| COD_SUBPROCESSO | 303 | 3 | Codice subprocesso |
| COD_CONTABILITA | 306 | 1 | Codice contabilità |
| COD_MOD_PAGAMENTO | 307 | 2 | Codice modalità pagamento |

---

### RIN - Risposte Rischio

**Nome blocco**: `WGRVBRIN0000`
**ID estratto**: `RIN`
**Descrizione**: Risposte a questionari specifici dell'oggetto di rischio

**Campi** (19 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 6 | Progressivo partita |
| KEY_OGG_RISCHIO | 40 | 12 | Chiave oggetto rischio |
| COD_RUOLO | 52 | 3 | Codice ruolo |
| NUM_QUESTION | 55 | 8 | Numero questionario |
| NUM_DOMANDA | 63 | 6 | Numero domanda |
| PRG_RISPOSTA | 69 | 4 | Progressivo risposta |
| NUM_RIGA_RISP | 73 | 4 | Numero riga risposta |
| DAT_FINE_VAL | 77 | 10 | Data fine validità |
| TIP_RISPOSTA | 87 | 1 | Tipo risposta |
| TIP_DATA | 88 | 1 | Tipo data |
| VAL_RISPOSTA | 89 | 14 | Valore risposta numerica |
| TXT_RISPOSTA | 103 | 70 | Testo risposta |
| NUM_LISTA | 173 | 8 | Numero lista |
| COD_VALUTA | 181 | 4 | Codice valuta |
| DAT_INIZ_VAL | 185 | 10 | Data inizio validità |
| COD_USER_INS | 195 | 8 | User inserimento |
| TMS_INS | 203 | 28 | Timestamp inserimento |
| COD_USER_MOD | 229 | 8 | User modifica |
| TMS_MOD | 237 | 28 | Timestamp modifica |

---

### SFO - Sforatura

**Nome blocco**: `WGRVBSFO0000`
**ID estratto**: `SFO`
**Descrizione**: Sforature autorizzative

**Campi** (10 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| TIP_DOCUMENTO | 4 | 2 | Tipo documento |
| NUM_DOCUMENTO | 6 | 14 | Numero documento |
| PRG_SFORATURA | 20 | 8 | Progressivo sforatura |
| TIP_AUTOR | 28 | 3 | Tipo autorizzazione |
| KEY_REC_AUTOR | 31 | 24 | Chiave record autorizzazione |
| COD_LIV_AUTOR | 55 | 2 | Codice livello autorizzazione |
| COD_MOTIVO_AUTOR | 57 | 4 | Codice motivo autorizzazione |
| COD_STATO_SFO | 61 | 1 | Codice stato sforatura |
| TXT_CATAL | 62 | 70 | Testo catalogo |
| COD_USER_INS | 132 | 8 | User inserimento |
| TMS_INS | 140 | 28 | Timestamp inserimento |
| COD_USER_MOD | 166 | 8 | User modifica |
| TMS_MOD | 174 | 28 | Timestamp modifica |

---

### AGE - Agenzia

**Nome blocco**: `WGRVBAGE0000`
**ID estratto**: `AGE`
**Descrizione**: Dati di agenzia/broker

**Campi** (20 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| NUM_AGENZIA | 26 | 8 | Numero agenzia |
| DAT_FINE_VAL | 34 | 10 | Data fine validità |
| COD_SUBAGENZIA | 44 | 5 | Codice subagenzia |
| COD_SUBAGENTE | 49 | 4 | Codice subagente |
| COD_PRODUTTORE | 53 | 7 | Codice produttore |
| COD_CARICO | 60 | 1 | Codice carico |
| DAT_TRAS_SCOR | 61 | 10 | Data trasferimento scorrevole |
| DAT_EFF_COMPET | 71 | 10 | Data effetto competenza |
| DAT_REG_TRA_SCO | 81 | 10 | Data regolazione trasferimento scorrevole |
| NUM_AGENZIA_PREC | 91 | 8 | Numero agenzia precedente |
| DAT_SCAD_EFF_PREC | 99 | 10 | Data scadenza effetto precedente |
| PER_PROVV_ACQ | 109 | 6 | Percentuale provvigione acquisto |
| PER_PROVV_INC | 115 | 6 | Percentuale provvigione incasso |
| DAT_CONTAB_GIRO | 121 | 10 | Data contabile giro |
| DAT_INIZ_VAL | 131 | 10 | Data inizio validità |
| COD_USER_INS | 141 | 8 | User inserimento |
| TMS_INS | 149 | 28 | Timestamp inserimento |
| COD_USER_MOD | 175 | 8 | User modifica |
| TMS_MOD | 183 | 28 | Timestamp modifica |
| COD_COMP_C | 209 | 4 | Codice compagnia C |
| COD_COMP_C_PREC | 213 | 4 | Codice compagnia C precedente |

---

### COA - Coassicurazione

**Nome blocco**: `WGRVBCOA0000`
**ID estratto**: `COA`
**Descrizione**: Dati coassicurazione

**Campi** (12 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| COD_DELEGATARIA | 26 | 1 | Codice delegataria |
| COD_COMP_COASS | 27 | 4 | Codice compagnia coassicuratrice |
| NUM_AGENZIA_COASS | 31 | 8 | Numero agenzia coassicurazione |
| DAT_FINE_VAL | 39 | 10 | Data fine validità |
| PER_QUOTA | 49 | 6 | Percentuale quota |
| TXT_ULT_COMPAG | 55 | 70 | Testo ultima compagnia |
| COD_RIMBORSO | 125 | 2 | Codice rimborso |
| DAT_INIZ_VAL | 127 | 10 | Data inizio validità |
| COD_USER_INS | 137 | 8 | User inserimento |
| TMS_INS | 145 | 28 | Timestamp inserimento |
| COD_USER_MOD | 171 | 8 | User modifica |
| TMS_MOD | 179 | 28 | Timestamp modifica |
| PER_QUOTA_PREMIO | 205 | 6 | Percentuale quota premio |
| FLG_DELEGA_SIN | 211 | 1 | Flag delega sinistri |

---

### CVP - Convenzione Particolare

**Nome blocco**: `WGRVBCVP0000`
**ID estratto**: `CVP`
**Descrizione**: Convenzioni particolari

**Campi** (10 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| KEY_CONVENZIONE | 26 | 10 | Chiave convenzione |
| COD_CONVENZ_COMM | 36 | 6 | Codice convenzione commerciale |
| DAT_INGRESSO_CONV | 42 | 10 | Data ingresso convenzione |
| DAT_USCITA_CONV | 52 | 10 | Data uscita convenzione |
| COD_PROD_PARTIC | 62 | 1 | Codice prodotto particolare |
| COD_NAZIONALE | 63 | 1 | Codice nazionale |
| COD_AZIENDA | 64 | 1 | Codice azienda |
| TIP_ACCORDO_CONV | 65 | 1 | Tipo accordo convenzione |
| COD_USER_INS | 66 | 8 | User inserimento |
| TMS_INS | 74 | 28 | Timestamp inserimento |
| COD_USER_MOD | 100 | 8 | User modifica |
| TMS_MOD | 108 | 28 | Timestamp modifica |

---

### COI - Dati Contratto Info

**Nome blocco**: `WGRVBCOI0000`
**ID estratto**: `COI`
**Descrizione**: Dati informativi aggiuntivi del contratto

**Campi** (9 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| COD_DATO | 26 | 10 | Codice dato |
| COD_KEY_DATO | 36 | 30 | Codice chiave dato |
| DAT_FINE_VAL | 66 | 10 | Data fine validità |
| TIP_DATO | 76 | 3 | Tipo dato |
| TXT_DATO | 79 | 255 | Testo dato (campo lungo) |
| DAT_INIZ_VAL | 334 | 10 | Data inizio validità |
| COD_USER_INS | 344 | 8 | User inserimento |
| TMS_INS | 352 | 28 | Timestamp inserimento |
| COD_USER_MOD | 378 | 8 | User modifica |
| TMS_MOD | 386 | 28 | Timestamp modifica |

---

### PCE - Parametri Comunicazione

**Nome blocco**: `WGRVBPCE0000`
**ID estratto**: `PCE`
**Descrizione**: Parametri di comunicazione e note

**Campi** (17 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 8 | Progressivo partita |
| PRG_RCD_PARAM | 42 | 2 | Progressivo record parametro |
| NUM_PARAM | 44 | 3 | Numero parametro |
| DAT_RIFERIMENTO | 47 | 10 | Data riferimento |
| COD_COMUNICAZIONE | 57 | 1 | Codice comunicazione |
| DAT_FINE_VAL | 58 | 10 | Data fine validità |
| FLG_DECISIONALE | 68 | 4 | Flag decisionale |
| FLG_AUMENTO_SCONTO | 72 | 1 | Flag aumento/sconto |
| DES_NOTA_LEN | 73 | 5 | Lunghezza descrizione nota |
| DES_NOTA_TEXT | 78 | 200 | Testo descrizione nota (campo lungo) |
| DES_PAR | 278 | 20 | Descrizione parametro |
| IMP_PAR | 298 | 16 | Importo parametro |
| COD_USER_INS | 314 | 8 | User inserimento |
| TMS_INS | 322 | 28 | Timestamp inserimento |
| COD_USER_MOD | 348 | 8 | User modifica |
| TMS_MOD | 356 | 28 | Timestamp modifica |
| DAT_INIZ_VAL | 382 | 10 | Data inizio validità |
| PER_TASSO | 392 | 6 | Percentuale tasso |
| PER_INCRE | 398 | 6 | Percentuale incremento |
| IMP_PRE_MASSIMO | 404 | 14 | Importo premio massimo |

---

### LPS - Loss Portfolio Statement

**Nome blocco**: `WGRVBLPS0000`
**ID estratto**: `LPS`
**Descrizione**: Dati Loss Portfolio Statement (LPS)

**Campi** (9 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PCT_NSQUOTA | 26 | 7 | Percentuale nostra quota |
| DATA_RIFERIMENTO | 33 | 10 | Data riferimento |
| PAESE | 43 | 3 | Codice paese |
| DESCR_PAESE | 46 | 50 | Descrizione paese |
| VAL_ASSIC | 96 | 14 | Valore assicurato |
| VAL_ASSIC_DI | 110 | 14 | Valore assicurato DI |
| TAB_PARAM | 124 | 60 | Tabella parametri (strutturata) |
| TAB_GAR | 184 | 567 | Tabella garanzie (strutturata, campo molto lungo) |

---

### PCB - Partita Contributo Base

**Nome blocco**: `WGRVBPCB0000`
**ID estratto**: `PCB`
**Descrizione**: Partita contributo base

**Campi** (10 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 6 | Progressivo partita |
| PRG_RECORD | 40 | 4 | Progressivo record |
| DAT_FINE_VAL | 44 | 10 | Data fine validità |
| PER_RIPART | 54 | 8 | Percentuale ripartizione |
| COD_RAMO_FORTE | 62 | 5 | Codice ramo forte |
| DAT_INIZ_VAL | 67 | 10 | Data inizio validità |
| COD_USER_INS | 77 | 8 | User inserimento |
| TMS_INS | 85 | 28 | Timestamp inserimento |
| COD_USER_MOD | 111 | 8 | User modifica |
| TMS_MOD | 119 | 28 | Timestamp modifica |

---

## Blocchi Anagrafica

I blocchi anagrafica rappresentano entità fisiche o giuridiche. Hanno sempre **nome completo** (non abbreviato) e iniziano con la lettera 'C'.

### CPERSONA - Persona Fisica

**Nome blocco**: `CPERSONA` (match esatto)
**Descrizione**: Anagrafica persona fisica

**Campi** (29 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| COD_TITOLO | 15 | 5 | Codice titolo (Sig., Dott., ecc.) |
| TXT_COGNOME | 20 | 35 | Cognome |
| TXT_COGNOME2 | 55 | 35 | Secondo cognome |
| TXT_NOME | 90 | 35 | Nome |
| COD_SESSO | 125 | 1 | Codice sesso (M/F) |
| DAT_NASCITA | 126 | 10 | Data nascita |
| COD_NAZIONALI | 136 | 3 | Codice nazionalità |
| TXT_COMU_NASC | 139 | 40 | Comune di nascita |
| COD_PROV_NASC | 179 | 3 | Codice provincia nascita |
| COD_NAZI_NASC | 182 | 3 | Codice nazione nascita |
| COD_FISCALE | 185 | 16 | Codice fiscale |
| COD_STAT_CIVL | 201 | 2 | Codice stato civile |
| COD_UNIT_MERC | 204 | 4 | Codice unità mercato |
| COD_PROFESSIO | 209 | 6 | Codice professione |
| COD_SOTT_GRUP | 216 | 3 | Codice sottogruppo |
| COD_GRUP_ATCO | 220 | 3 | Codice gruppo ATECO |
| COD_TIPO_PERS | 224 | 1 | Codice tipo persona |
| NUM_MATRICOLA | 225 | 15 | Numero matricola |
| DAT_MORTE | 240 | 10 | Data morte |
| COD_MOTI_MORT | 250 | 4 | Codice motivo morte |
| COD_IMPERDIBI | 255 | 1 | Codice imperdibile |
| FLG_FORZ_CFIS | 256 | 1 | Flag forzatura codice fiscale |
| DAT_INIZ_VALI | 257 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 267 | 8 | Ora inizio validità |
| DAT_INSERT | 275 | 26 | Data/ora inserimento |
| COD_USER | 301 | 8 | Codice user |
| DAT_FINE_VALI | 309 | 10 | Data fine validità |

---

### CNATANTE - Natante

**Nome blocco**: `CNATANTE` (match esatto)
**Descrizione**: Anagrafica natante/imbarcazione

**Campi** (48 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| MATR | 15 | 20 | Matricola natante |
| CHIAVE | 35 | 1 | Chiave |
| DEST_USO | 37 | 6 | Destinazione d'uso |
| MODELLO | 44 | 70 | Modello imbarcazione |
| NOME | 114 | 20 | Nome natante |
| SIGL_COST | 134 | 20 | Sigla costruttore |
| BANDIERA | 154 | 15 | Bandiera |
| NATANTE | 169 | 1 | Tipo natante |
| TIPO_USO | 171 | 1 | Tipo uso |
| BAND_LPS | 173 | 3 | Bandiera LPS |
| NAZIONE | 176 | 6 | Nazione |
| PERIZIA | 183 | 1 | Perizia |
| MOTORI | 185 | 2 | Numero motori |
| ANNO_COST | 188 | 4 | Anno costruzione |
| MESE_COST | 193 | 2 | Mese costruzione |
| STAZ_LORD | 196 | 6 | Stazza lorda |
| LUNGHEZZA | 205 | 3 | Lunghezza (metri) |
| POSTI | 211 | 4 | Numero posti |
| NODI_VELO | 216 | 3 | Nodi velocità |
| MATE_COST | 220 | 2 | Materiale costruzione |
| SPEC_ALBE | 223 | 1 | Specifica alberatura |
| SATELLITARE | 225 | 2 | Satellitare |
| COLORE | 228 | 2 | Colore |
| LARGHEZZA | 231 | 3 | Larghezza (metri) |
| PESCAGGIO | 237 | 3 | Pescaggio (metri) |
| VELO_CROC | 243 | 3 | Velocità crociera |
| ARMAMENTO | 247 | 2 | Armamento |
| CONSUMO | 250 | 3 | Consumo |
| LITR_SERB | 256 | 5 | Litri serbatoio |
| ELETTRONICA | 262 | 2 | Elettronica |
| SAT1 | 265 | 15 | Satellitare 1 |
| SAT2 | 280 | 15 | Satellitare 2 |
| SAT3 | 295 | 15 | Satellitare 3 |
| GSM1 | 310 | 15 | GSM 1 |
| GSM2 | 325 | 15 | GSM 2 |
| GSM3 | 340 | 15 | GSM 3 |
| INDI_USO | 355 | 1 | Indicatore uso |
| PORTO | 357 | 6 | Porto |
| CAT_PORT | 364 | 3 | Categoria porto |
| RIFE_PORT | 368 | 6 | Riferimento porto |
| SETTORE | 375 | 1 | Settore |
| CLASSE | 376 | 2 | Classe |
| USO | 378 | 2 | Uso |
| DAT_INIZ_VALI | 380 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 390 | 10 | Ora inizio validità |
| TMS_INSERT | 400 | 26 | Timestamp inserimento |
| COD_USER | 426 | 8 | Codice user |
| DAT_FINE_VALI | 434 | 10 | Data fine validità |

---

### CIMPRESA - Impresa

**Nome blocco**: `CIMPRESA` (match esatto)
**Descrizione**: Anagrafica azienda/impresa

**Campi** (23 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| COD_RAGI_SOCI | 15 | 6 | Codice ragione sociale |
| TXT_RAGI_SOCI | 22 | 40 | Ragione sociale |
| TXT_RAGI_SOCI2 | 62 | 40 | Ragione sociale (continuazione) |
| COD_FORM_SOCI | 102 | 6 | Codice forma societaria |
| DAT_FONDAZIONE | 109 | 10 | Data fondazione |
| COD_FISCALE | 119 | 16 | Codice fiscale |
| COD_NAZI_PIVA | 135 | 2 | Codice nazione P.IVA |
| COD_PART_IVA | 137 | 12 | Partita IVA |
| COD_UNIT_MERC | 149 | 4 | Codice unità mercato |
| COD_SETT_ATTI | 154 | 6 | Codice settore attività |
| COD_SOTT_GRUP_ATCO | 161 | 3 | Codice sottogruppo ATECO |
| COD_GRUP_ATCO | 165 | 3 | Codice gruppo ATECO |
| DAT_SCIOGLIMENTO | 169 | 10 | Data scioglimento |
| COD_FASC_FATT | 179 | 2 | Codice fascicolo fatturato |
| COD_IMPERDIBILE | 182 | 1 | Codice imperdibile |
| FLG_FORZ_CFIS | 183 | 1 | Flag forzatura codice fiscale |
| COD_NUM_DIPE | 184 | 2 | Codice numero dipendenti |
| FLG_ENTE_PUBB | 187 | 1 | Flag ente pubblico |
| ORA_INIZ_VALI | 188 | 8 | Ora inizio validità |
| DAT_INSERT | 196 | 26 | Data/ora inserimento |
| COD_USER | 222 | 8 | Codice user |
| DAT_FINE_VALI | 230 | 10 | Data fine validità |
| PERSONA_RIF | 240 | 40 | Persona di riferimento |
| TIPO_ENTE | 280 | 1 | Tipo ente |
| FORZATURA | 281 | 1 | Forzatura |
| FATTURATO | 282 | 15 | Fatturato |
| NAZIONALITA | 298 | 3 | Nazionalità |
| DAT_INIZ_VALI | 301 | 10 | Data inizio validità |

---

### CFABBRICATO - Fabbricato

**Nome blocco**: `CFABBRICATO` (match esatto)
**Descrizione**: Anagrafica edificio/fabbricato

**Campi** (9 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| COD_CATALOGO | 15 | 3 | Codice catalogo |
| COD_DEST_USO | 19 | 6 | Codice destinazione d'uso |
| NUM_ANNO_EDIF | 26 | 4 | Anno edificazione |
| NUM_PIANI | 31 | 3 | Numero piani |
| DAT_INIZ_VALI | 35 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 45 | 8 | Ora inizio validità |
| DAT_INSERT | 53 | 26 | Data/ora inserimento |
| COD_USER | 79 | 8 | Codice user |
| DAT_FINE_VALI | 88 | 10 | Data fine validità |

---

### CUBICAZIONE - Ubicazione

**Nome blocco**: `CUBICAZIONE` (match esatto)
**Descrizione**: Anagrafica indirizzo/ubicazione

**Campi** (19 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| COD_PREF_TOP | 15 | 6 | Codice prefisso toponimo |
| TXT_PREF_BREV | 22 | 10 | Testo prefisso breve |
| TXT_INDIRIZZO | 32 | 35 | Indirizzo |
| NUM_CIVICO | 67 | 15 | Numero civico |
| NUM_SCALA | 82 | 1 | Numero scala |
| TXT_COMUNE | 83 | 40 | Comune |
| COD_PROVINCIA | 123 | 3 | Codice provincia |
| COD_CAP | 126 | 9 | CAP |
| COD_TERRITORIO | 135 | 6 | Codice territorio |
| TXT_LOCALITA | 142 | 40 | Località |
| COD_LOCALITA | 182 | 6 | Codice località |
| COD_NAZIONE | 189 | 3 | Codice nazione |
| TXT_TOPONIMO | 192 | 35 | Toponimo |
| DAT_INIZ_VALI | 227 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 237 | 8 | Ora inizio validità |
| DAT_INSERT | 245 | 26 | Data/ora inserimento |
| COD_USER | 271 | 8 | Codice user |
| DAT_FINE_VALI | 279 | 10 | Data fine validità |
| COD_PROV_MCZ | 289 | 3 | Codice provincia MCZ |
| COD_COMUNE_MCZ | 293 | 3 | Codice comune MCZ |
| COD_SEZIONE_MCZI | 297 | 7 | Codice sezione MCZI |

---

### CATTIVITA - Attività

**Nome blocco**: `CATTIVITA` (match esatto)
**Descrizione**: Anagrafica attività

**Campi** (12 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| COD_ATTIVITA | 15 | 2 | Codice attività |
| COD_CATALOGO | 18 | 3 | Codice catalogo |
| NUM_RIFE_ATTI | 22 | 6 | Numero riferimento attività |
| COD_CONTINUITA | 29 | 1 | Codice continuità |
| NUM_MESI_ATTI | 30 | 2 | Numero mesi attività |
| NUM_PERSONE | 33 | 5 | Numero persone |
| COD_PESO | 39 | 1 | Codice peso |
| PRC_PESO | 40 | 5 | Percentuale peso |
| DAT_INIZ_VALI | 46 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 56 | 8 | Ora inizio validità |
| DAT_INSERT | 64 | 26 | Data/ora inserimento |
| COD_USER | 90 | 8 | Codice user |
| DAT_FINE_VALI | 98 | 10 | Data fine validità |

---

### CVEICOLO - Veicolo

**Nome blocco**: `CVEICOLO` (match esatto)
**Descrizione**: Anagrafica veicolo

**Campi** (7 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| TXT_TARGA_TELA | 19 | 20 | Targa/telaio |
| COD_TIPO_VEIC | 68 | 6 | Codice tipo veicolo |
| COD_MARCA | 79 | 6 | Codice marca |
| COD_MODELLO | 86 | 6 | Codice modello |
| COD_VERSIONE | 93 | 6 | Codice versione |
| DAT_IMMATRICOLAZIO | 249 | 15 | Data immatricolazione |

---

### CENTITASTRINGA - Entità Stringa

**Nome blocco**: `CENTITASTRINGA` (match esatto)
**Descrizione**: Entità generica rappresentata da stringa

**Campi** (2 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| TXT_STRINGA | 15 | 255 | Testo stringa (campo lungo) |

---

### CGRUPPOANAG - Gruppo Anagrafico

**Nome blocco**: `CGRUPPOANAG` (match esatto)
**Descrizione**: Gruppo anagrafico

**Campi** (5 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| TXT_GRUPPO | 15 | 50 | Testo gruppo |
| COD_GRUPPO | 65 | 7 | Codice gruppo |
| TIPO_GRUPPO | 73 | 2 | Tipo gruppo |

---

### CAEROMOBILE - Aeromobile

**Nome blocco**: `CAEROMOBILE` (match esatto)
**Descrizione**: Anagrafica aeromobile

**Campi** (18 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| COD_TIPOL | 15 | 11 | Codice tipologia |
| COD_IDTARGA | 27 | 8 | Codice ID/targa |
| COD_NAZIONE | 35 | 3 | Codice nazione |
| TXT_MARCA | 38 | 40 | Marca |
| TXT_MODELLO | 78 | 40 | Modello |
| VAL_PESO | 118 | 7 | Peso |
| POSTI_PIL | 126 | 3 | Posti pilota |
| POSTI_TEC | 130 | 3 | Posti tecnici |
| POSTI_PAS | 134 | 3 | Posti passeggeri |
| NUM_ANNO_COST | 138 | 4 | Anno costruzione |
| NUM_COSTRUZ | 143 | 12 | Numero costruzione |
| COD_USO | 155 | 6 | Codice uso |
| INIZ_VALI | 162 | 10 | Inizio validità |
| ORA_INIZ_VALI | 172 | 8 | Ora inizio validità |
| DAT_INSERT | 180 | 26 | Data/ora inserimento |
| COD_USER | 206 | 8 | Codice user |
| DAT_FINE_VALI | 214 | 10 | Data fine validità |

---

### CUSISPECIALI - Usi Speciali

**Nome blocco**: `CUSISPECIALI` (match esatto)
**Descrizione**: Usi speciali

**Campi** (8 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| PRG_USO | 15 | 2 | Progressivo uso |
| COD_CATALOGO | 18 | 6 | Codice catalogo |
| ORA_INIZ_VALI | 25 | 8 | Ora inizio validità |
| DAT_INSERT | 33 | 26 | Data/ora inserimento |
| COD_USER | 59 | 8 | Codice user |
| DAT_FINE_VALI | 67 | 10 | Data fine validità |
| TXT_DES_ALTRO | 77 | 204 | Testo descrizione altro (campo lungo) |

---

### CANIMALE - Animale

**Nome blocco**: `CANIMALE` (match esatto)
**Descrizione**: Anagrafica animale

**Campi** (11 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_TIPO_EA | 0 | 2 | Codice tipo entità anagrafica |
| COD_KEY_EA | 3 | 11 | Codice chiave entità anagrafica |
| TXT_NOME | 15 | 60 | Nome animale |
| COD_SPECIE | 75 | 6 | Codice specie |
| COD_RAZZA | 82 | 6 | Codice razza |
| COD_MICROCHIP | 89 | 15 | Codice microchip |
| DAT_NASCITA | 104 | 10 | Data nascita |
| COD_SESSO | 114 | 1 | Codice sesso |
| DAT_INIZ_VALI | 115 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 125 | 8 | Ora inizio validità |
| DAT_INSERT | 133 | 26 | Data/ora inserimento |
| COD_USER | 159 | 8 | Codice user |
| DAT_FINE_VALI | 167 | 10 | Data fine validità |

---

## Blocchi Relazione

I blocchi relazione collegano entità anagrafiche tra loro o a schede/contratti con ruoli specifici.

### CRELAZIONERR - Relazione RR

**Nome blocco**: `CRELAZIONERR` (match esatto)
**Descrizione**: Relazione tra due entità anagrafiche

**Campi** (5 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_KEY_EASX | 0 | 11 | Codice chiave entità anagrafica sinistra |
| COD_KEY_EADX | 12 | 11 | Codice chiave entità anagrafica destra |
| COD_RUOL | 24 | 2 | Codice ruolo |
| DAT_INIZ_VALI | 26 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 36 | 8 | Ora inizio validità |

---

### CRELAZIONEGR - Relazione Gruppo

**Nome blocco**: `CRELAZIONEGR` (match esatto)
**Descrizione**: Relazione di gruppo tra entità

**Campi** (6 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_KEY_EASX | 0 | 11 | Codice chiave entità anagrafica sinistra |
| COD_KEY_EADX | 12 | 11 | Codice chiave entità anagrafica destra |
| COD_TIPL_LEGA | 24 | 2 | Codice tipo legame |
| COD_LEGAME | 27 | 2 | Codice legame |
| DAT_INIZ_VALI | 28 | 10 | Data inizio validità |
| ORA_INIZ_VALI | 38 | 8 | Ora inizio validità |

---

### CRELAZIONECR - Relazione CR

**Nome blocco**: `CRELAZIONECR` (match esatto)
**Descrizione**: Relazione incrocio anagrafico (entità ↔ scheda con ruolo)

**Campi** (11 campi totali):

| Campo | Pos | Len | Descrizione |
|-------|-----|-----|-------------|
| COD_COMP | 0 | 4 | Codice compagnia |
| NUM_CONTRATTO | 4 | 14 | Numero contratto |
| PRG_CONTRATTO | 18 | 8 | Progressivo contratto |
| PRG_SCHEDA | 26 | 8 | Progressivo scheda |
| PRG_PARTITA | 34 | 6 | Progressivo partita |
| TIP_PORTAF | 40 | 3 | Tipo portafoglio |
| COD_TIPO_EA | 43 | 3 | Codice tipo entità anagrafica |
| KEY_OGG_RISCHIO | 46 | 12 | Chiave oggetto rischio (codice chiave EA) |
| COD_RUOLO | 58 | 3 | Codice ruolo |
| DAT_INIZ_VALI | 61 | 10 | Data inizio validità |
| DAT_FINE_VALI | 71 | 10 | Data fine validità |

---

## Blocchi Varianti (non supportati)

I seguenti blocchi sono definiti ma **non sono attualmente supportati** (array vuoti nelle definizioni):

- **CPERSGRUP**: Persona gruppo (variante)
- **CPERSAERO**: Persona aeromobile (variante)
- **CUBICAZGRUP**: Ubicazione gruppo (variante)
- **CUBICAZAERO**: Ubicazione aeromobile (variante)
- **CIMPRESAGRUP**: Impresa gruppo (variante)
- **CRELAZRRAERO**: Relazione RR aeromobile (variante)
- **CRELAZRRGRUP**: Relazione RR gruppo (variante)

Questi blocchi sono riconosciuti dall'algoritmo di estrazione ma non hanno campi definiti.

---

## 📐 Convenzioni

### Formato Date

Tutte le date seguono il formato: **aaaa-mm-gg** (10 caratteri)

Esempio: `2025-01-07`

### Formato Timestamp

I timestamp seguono il formato ISO: **aaaa-mm-ggThh:mm:ss.ffffff** (26-28 caratteri)

Esempio: `2025-01-07T14:30:15.123456`

### Codici Numerici

- I codici numerici sono **left-padded con zeri** (es. `001`, `0000501655016`)
- I codici alfanumerici sono **right-padded con spazi** (es. `KPO `)

### Importi

Gli importi sono rappresentati come stringhe numeriche con:
- Parte intera e decimale separate
- Lunghezza fissa (14 o 16 caratteri)
- Formato: `+000000000.00` o simile

---

## 🔗 File Correlati

- [README.md](./README.md) - Documentazione generale
- [PARSING_STRUCTURE.md](./PARSING_STRUCTURE.md) - Struttura parsing dettagliata
- [CLAUDE.md](./CLAUDE.md) - Istruzioni per Claude Code
- `js/config/blockDefinitions.js` - Codice sorgente definizioni

---

**Versione documento**: 1.0.0
**Ultimo aggiornamento**: 2025-01-07
