I caratteri tra le "" rappresentano l'id del blocco
   BlockInfo("CNT", CONTRATTO.Table, false),
   BlockInfo("SCH",SCHEDA.Table, true),
   BlockInfo("PRT",PARTITA.Table, true),
   BlockInfo("PAX",PAR_PARTITA.Table, true),
   BlockInfo("RIS",RISPOSTA.Table, true),
   BlockInfo("DOC",DOCUMENTO.Table, true), // Multiplo ???
   BlockInfo("RIN",RISP_INCR.Table, true),
   BlockInfo("SFO",SFORATURA.Table, true),
   BlockInfo("AGE",AGENZIA_CONTR.Table, true), // Multiplo?
   BlockInfo("COA",COASS_QUOTA.Table, true),
   BlockInfo("CVP",CONVENZIONE.Table, true),
   BlockInfo("PCN", PAR_CONGUAGLIO_READ.Table,true),
   BlockInfo("COI", CONTRATTO_INTEGR.Table,false,true),
   BlockInfo("PCE", PAR_CONGUAGLIO_EST.Table, true, true),
   BlockInfo("LPS", TASSE_LPS.Table, false, true),
   BlockInfo("PCB", PARTITA_CONTAB.Table, false, true),
   
 
   Seguono la definizione dei blocchi,  con (0, "COD_COMP", 0, 3, 0) = (ordine,nome campo,posizione iniziale ,lunghezza ,precisione numerica) , ma possono avere meno campi
   Ogni riga del tracciato appartiene a un blocco e ci possono essere piu' righe per lo stesso blocco. 
   Le proprietà di una riga sono definite da uno delle classi seguenti,attraverso la proprietà Table Contratto.Table è associato al blocco CNT per esempio.
   Il tipo di Field definisce come valutare la stringa del tracciato. Se Signed la proprieta e' un + seguiti da un numero numero un certo numero di caratteri.Per esempio 
   Field.Signed(0, "COD_COMP", 0, 3, 0); sará +___ . Se Date sará una data, lungo 10 caratteri, YYYY-MM-DD. Se Text sara' una stringa, lunga N caratteri,TimeStamp sara' un timestamp	
	una stringa lunga 28 caratteri tipo 0001-01-01-00.00.00.000000 con YYYY-MM-DD-HH.MM.SS.000000
	public static class CONTRATTO
    {
        public static readonly Table Table = new Table(0, "CONTRATTO", false, 400);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(3, "DAT_FINE_VAL", 26);
        public static readonly Field TIP_PORTAF = Field.Text(4, "TIP_PORTAF", 36, 1);
        public static readonly Field COD_STATO_PTF = Field.Text(5, "COD_STATO_PTF", 37, 1);
        public static readonly Field TIP_DOCUMENTO_MOD = Field.Text(6, "TIP_DOCUMENTO_MOD", 38, 2);
        public static readonly Field NUM_DOCUMENTO_MOD = Field.Signed(7, "NUM_DOCUMENTO_MOD", 40, 13, 0);
        public static readonly Field DAT_DECORRENZA = Field.Date(8, "DAT_DECORRENZA", 54);
        public static readonly Field DAT_SCADENZA = Field.Date(9, "DAT_SCADENZA", 64);
        public static readonly Field NUM_DURATA = Field.Signed(10, "NUM_DURATA", 74, 7, 0);
        public static readonly Field COD_FRAZIONAMENTO = Field.Text(11, "COD_FRAZIONAMENTO", 82, 1);
        public static readonly Field NUM_AGENZIA = Field.Signed(12, "NUM_AGENZIA", 83, 7, 0);
        public static readonly Field COD_ESENZIONE = Field.Text(13, "COD_ESENZIONE", 91, 1);
        public static readonly Field COD_ANNULL_CON = Field.Signed(14, "COD_ANNULL_CON", 92, 2, 0);
        public static readonly Field DAT_ANNULL_CON = Field.Date(15, "DAT_ANNULL_CON", 95);
        public static readonly Field COD_ANNULL_SUB = Field.Signed(16, "COD_ANNULL_SUB", 105, 2, 0);
        public static readonly Field COD_ANNULL_USER = Field.Text(17, "COD_ANNULL_USER", 108, 8);
        public static readonly Field DAT_ANNULL_REG = Field.Date(18, "DAT_ANNULL_REG", 116);
        public static readonly Field KEY_AUTOR = Field.Text(19, "KEY_AUTOR", 126, 10);
        public static readonly Field COD_COASS = Field.Text(20, "COD_COASS", 136, 1);
        public static readonly Field COD_VINCOLO = Field.Text(21, "COD_VINCOLO", 137, 1);
        public static readonly Field COD_RINNOVO = Field.Text(22, "COD_RINNOVO", 138, 1);
        public static readonly Field TIP_CONVENZ = Field.Text(23, "TIP_CONVENZ", 139, 1);
        public static readonly Field COD_CONVERS = Field.Signed(24, "COD_CONVERS", 140, 1, 0);
        public static readonly Field COD_VALUTA = Field.Signed(25, "COD_VALUTA", 142, 3, 0);
        public static readonly Field ORA_DEC_IMMEDIATA = Field.Signed(26, "ORA_DEC_IMMEDIATA", 146, 4, 0);
        public static readonly Field COD_PER_RESCIND = Field.Signed(27, "COD_PER_RESCIND", 151, 1, 0);
        public static readonly Field DAT_RESCINDIB = Field.Date(28, "DAT_RESCINDIB", 153);
        public static readonly Field TIP_STRUTTURA = Field.Text(29, "TIP_STRUTTURA", 163, 2);
        public static readonly Field COD_DIR_CONTI = Field.Signed(30, "COD_DIR_CONTI", 165, 1, 0);
        public static readonly Field DAT_RIF_TABELLE = Field.Date(31, "DAT_RIF_TABELLE", 167);
        public static readonly Field COD_LINGUA = Field.Text(32, "COD_LINGUA", 177, 2);
        public static readonly Field COD_FRAZ_PROROG = Field.Text(33, "COD_FRAZ_PROROG", 179, 1);
        public static readonly Field COD_CONGUAGLIO = Field.Text(34, "COD_CONGUAGLIO", 180, 1);
        public static readonly Field DAT_APPLIC_AR = Field.Date(35, "DAT_APPLIC_AR", 181);
        public static readonly Field TIP_RISK = Field.Text(36, "TIP_RISK", 191, 1);
        public static readonly Field DAT_RIATTIVAZ = Field.Date(37, "DAT_RIATTIVAZ", 192);
        public static readonly Field COD_RIASS = Field.Signed(38, "COD_RIASS", 202, 3, 0);
        public static readonly Field COD_INDICIZZ = Field.Text(39, "COD_INDICIZZ", 206, 1);
        public static readonly Field COD_BLOK_INDIC = Field.Text(40, "COD_BLOK_INDIC", 207, 1);
        public static readonly Field COD_TAB_INDIC = Field.Text(41, "COD_TAB_INDIC", 208, 2);
        public static readonly Field COD_GEST_PROVV = Field.Text(42, "COD_GEST_PROVV", 210, 1);
        public static readonly Field COD_RIPRESA = Field.Signed(43, "COD_RIPRESA", 211, 1, 0);
        public static readonly Field COD_PRODOTTO_GRV = Field.Signed(44, "COD_PRODOTTO_GRV", 213, 5, 0);
        public static readonly Field COD_PROD_SUPER = Field.Signed(45, "COD_PROD_SUPER", 219, 3, 0);
        public static readonly Field COD_EDIZ_STAMPATO = Field.Text(46, "COD_EDIZ_STAMPATO", 223, 4);
        public static readonly Field COD_RAMOPOL = Field.Signed(47, "COD_RAMOPOL", 227, 3, 0);
        public static readonly Field COD_CATEGORIA = Field.Signed(48, "COD_CATEGORIA", 231, 3, 0);
        public static readonly Field COD_STORNO_SIDA = Field.Signed(49, "COD_STORNO_SIDA", 235, 2, 0);
        public static readonly Field PER_NS_QUOTA = Field.Signed(50, "PER_NS_QUOTA", 238, 6, 3);
        public static readonly Field FLG_CONDELEGA = Field.Text(51, "FLG_CONDELEGA", 245, 1);
        public static readonly Field COD_ACQUISITORE = Field.Text(52, "COD_ACQUISITORE", 246, 7);
        public static readonly Field DAT_CONTAB_PROT = Field.Date(53, "DAT_CONTAB_PROT", 253);
        public static readonly Field DAT_CONTAB_ANN = Field.Date(54, "DAT_CONTAB_ANN", 263);
        public static readonly Field DAT_INIZ_VAL = Field.Date(55, "DAT_INIZ_VAL", 273);
        public static readonly Field COD_USER_INS = Field.Text(56, "COD_USER_INS", 283, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(57, "TMS_INS", 291);
        public static readonly Field COD_USER_MOD = Field.Text(58, "COD_USER_MOD", 317, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(59, "TMS_MOD", 325);
        public static readonly Field COD_ADEGUAMENTO = Field.Text(60, "COD_ADEGUAMENTO", 351, 1);
        public static readonly Field COD_COMP_C = Field.Signed(61, "COD_COMP_C", 352, 3, 0);
        public static readonly Field FLG_DIGITALE = Field.Text(62, "FLG_DIGITALE", 356, 1);
        public static readonly Field COD_PROPOSTA = Field.Text(63, "COD_PROPOSTA", 357, 1);
        public static readonly Field COD_MODULARE = Field.Text(64, "COD_MODULARE", 358, 1);
        public static readonly Field COD_ANTIMAFIA = Field.Text(65, "COD_ANTIMAFIA", 359, 1);
    }
	
	 public static class SCHEDA
    {
        public static readonly Table Table = new Table(0, "SCHEDA", false, 400);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(4, "DAT_FINE_VAL", 34);
        public static readonly Field COD_RAMO_ATOM = Field.Signed(5, "COD_RAMO_ATOM", 44, 4, 0);
        public static readonly Field DAT_DECORRENZA = Field.Date(6, "DAT_DECORRENZA", 49);
        public static readonly Field DAT_SCADENZA = Field.Date(7, "DAT_SCADENZA", 59);
        public static readonly Field IMP_PREMIO = Field.Signed(8, "IMP_PREMIO", 69, 15, 0);
        public static readonly Field COD_ANN_SKE = Field.Signed(9, "COD_ANN_SKE", 85, 1, 0);
        public static readonly Field DAT_ANN_SKE = Field.Date(10, "DAT_ANN_SKE", 87);
        public static readonly Field COD_ANNULL_USER = Field.Text(11, "COD_ANNULL_USER", 97, 8);
        public static readonly Field DAT_ANNULL_REG = Field.Date(12, "DAT_ANNULL_REG", 105);
        public static readonly Field TIP_DOCUMENTO_MOD = Field.Text(13, "TIP_DOCUMENTO_MOD", 115, 2);
        public static readonly Field NUM_DOCUMENTO_MOD = Field.Signed(14, "NUM_DOCUMENTO_MOD", 117, 13, 0);
        public static readonly Field COD_RICALCOLO = Field.Text(15, "COD_RICALCOLO", 131, 1);
        public static readonly Field TIP_RINNOVO_SCHEDA = Field.Text(16, "TIP_RINNOVO_SCHEDA", 132, 2);
        public static readonly Field COD_CONTAB = Field.Text(17, "COD_CONTAB", 134, 1);
        public static readonly Field COD_RAMO_FORTE = Field.Signed(18, "COD_RAMO_FORTE", 135, 4, 0);
        public static readonly Field COD_RELAZIONE = Field.Text(19, "COD_RELAZIONE", 140, 1);
        public static readonly Field PRG_MADRE = Field.Signed(20, "PRG_MADRE", 141, 7, 0);
        public static readonly Field TIP_RISK_PROVV = Field.Signed(21, "TIP_RISK_PROVV", 149, 2, 0);
        public static readonly Field COD_VALUTA = Field.Signed(22, "COD_VALUTA", 152, 3, 0);
        public static readonly Field COD_CONVERS = Field.Signed(23, "COD_CONVERS", 156, 1, 0);
        public static readonly Field DAT_APPLIC_DC = Field.Date(24, "DAT_APPLIC_DC", 158);
        public static readonly Field COD_DIR_CONTI = Field.Signed(25, "COD_DIR_CONTI", 168, 1, 0);
        public static readonly Field COD_CONGUAGLIO = Field.Text(26, "COD_CONGUAGLIO", 170, 1);
        public static readonly Field COD_INDICIZZ = Field.Text(27, "COD_INDICIZZ", 171, 1);
        public static readonly Field COD_BLOK_INDIC = Field.Text(28, "COD_BLOK_INDIC", 172, 1);
        public static readonly Field COD_TAB_INDIC = Field.Text(29, "COD_TAB_INDIC", 173, 2);
        public static readonly Field DAT_ULT_INDIC = Field.Date(30, "DAT_ULT_INDIC", 175);
        public static readonly Field NUM_ISTAT = Field.Signed(31, "NUM_ISTAT", 185, 4, 1);
        public static readonly Field PER_INCRE_ISTAT = Field.Signed(32, "PER_INCRE_ISTAT", 190, 7, 4);
        public static readonly Field PER_INCRE_ETA = Field.Signed(33, "PER_INCRE_ETA", 198, 7, 4);
        public static readonly Field COD_LANCIO_PVAG = Field.Signed(34, "COD_LANCIO_PVAG", 206, 6, 0);
        public static readonly Field COD_RAMOGAR = Field.Signed(35, "COD_RAMOGAR", 213, 3, 0);
        public static readonly Field COD_CATEG_GAR = Field.Signed(36, "COD_CATEG_GAR", 217, 3, 0);
        public static readonly Field DAT_INIZ_VAL = Field.Date(37, "DAT_INIZ_VAL", 221);
        public static readonly Field COD_USER_INS = Field.Text(38, "COD_USER_INS", 231, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(39, "TMS_INS", 239);
        public static readonly Field COD_USER_MOD = Field.Text(40, "COD_USER_MOD", 265, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(41, "TMS_MOD", 273);
        public static readonly Field COD_ADEGUAMENTO = Field.Text(42, "COD_ADEGUAMENTO", 299, 1);
        public static readonly Field DAT_ADEGUAMENTO = Field.Date(43, "DAT_ADEGUAMENTO", 300);
        public static readonly Field COD_LIVELLO_ADEG = Field.Text(44, "COD_LIVELLO_ADEG", 310, 1);

    }
	
	 public static class PARTITA
    {
        public static readonly Table Table = new Table(0, "PARTITA", false, 300);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 5, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(5, "DAT_FINE_VAL", 40);
        public static readonly Field COD_RAMO_ATOM = Field.Signed(6, "COD_RAMO_ATOM", 50, 4, 0);
        public static readonly Field COD_GAR_LIV1 = Field.Signed(7, "COD_GAR_LIV1", 55, 2, 0);
        public static readonly Field COD_GAR_LIV2 = Field.Signed(8, "COD_GAR_LIV2", 58, 2, 0);
        public static readonly Field COD_GAR_LIV3 = Field.Signed(9, "COD_GAR_LIV3", 61, 2, 0);
        public static readonly Field COD_GAR_SUB = Field.Text(10, "COD_GAR_SUB", 64, 1);
        public static readonly Field COD_CLA_ID = Field.Signed(11, "COD_CLA_ID", 65, 2, 0);
        public static readonly Field COD_CLA_SUB = Field.Text(12, "COD_CLA_SUB", 68, 1);
        public static readonly Field DAT_TARIFFA = Field.Date(13, "DAT_TARIFFA", 69);
        public static readonly Field COD_TARIFFA = Field.Signed(14, "COD_TARIFFA", 79, 2, 0);
        public static readonly Field DAT_INGRESSO_TAR = Field.Date(15, "DAT_INGRESSO_TAR", 82);
        public static readonly Field IMP_PREMIO = Field.Signed(16, "IMP_PREMIO", 92, 13, 0);
        public static readonly Field COD_VALUTA = Field.Signed(17, "COD_VALUTA", 106, 3, 0);
        public static readonly Field COD_TAR_PROVIN = Field.Text(18, "COD_TAR_PROVIN", 110, 3);
        public static readonly Field COD_TAR_ZONA = Field.Signed(19, "COD_TAR_ZONA", 113, 2, 0);
        public static readonly Field IMP_PREMIO_TECNICO = Field.Signed(20, "IMP_PREMIO_TECNICO", 116, 13, 0);
        public static readonly Field COD_FORZATURA = Field.Text(21, "COD_FORZATURA", 130, 1);
        public static readonly Field DAT_INIZ_VAL = Field.Date(22, "DAT_INIZ_VAL", 131);
        public static readonly Field COD_USER_INS = Field.Text(23, "COD_USER_INS", 141, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(24, "TMS_INS", 149);
        public static readonly Field COD_USER_MOD = Field.Text(25, "COD_USER_MOD", 175, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(26, "TMS_MOD", 183);

    }
public static class PAR_PARTITA
    {
        public static readonly Table Table = new Table(0, "PAR_PARTITA", false, 400);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 5, 0);
        public static readonly Field PRG_RCD_PARAM = Field.Signed(5, "PRG_RCD_PARAM", 40, 1, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(6, "DAT_FINE_VAL", 42);
        public static readonly Field COD_CLA_ID_01 = Field.Signed(7, "COD_CLA_ID_01", 52, 2, 0);
        public static readonly Field COD_CLA_SUB_01 = Field.Text(8, "COD_CLA_SUB_01", 55, 1);
        public static readonly Field NUM_PVLS_01 = Field.Signed(9, "NUM_PVLS_01", 56, 7, 0);
        public static readonly Field VAL_PARAMETRO_01 = Field.Signed(10, "VAL_PARAMETRO_01", 64, 13, 0);
        public static readonly Field COD_PRESTAZ_01 = Field.Text(11, "COD_PRESTAZ_01", 78, 2);
        public static readonly Field COD_CLA_ID_02 = Field.Signed(12, "COD_CLA_ID_02", 80, 2, 0);
        public static readonly Field COD_CLA_SUB_02 = Field.Text(13, "COD_CLA_SUB_02", 83, 1);
        public static readonly Field NUM_PVLS_02 = Field.Signed(14, "NUM_PVLS_02", 84, 7, 0);
        public static readonly Field VAL_PARAMETRO_02 = Field.Signed(15, "VAL_PARAMETRO_02", 92, 13, 0);
        public static readonly Field COD_PRESTAZ_02 = Field.Text(16, "COD_PRESTAZ_02", 106, 2);
        public static readonly Field COD_CLA_ID_03 = Field.Signed(17, "COD_CLA_ID_03", 108, 2, 0);
        public static readonly Field COD_CLA_SUB_03 = Field.Text(18, "COD_CLA_SUB_03", 111, 1);
        public static readonly Field NUM_PVLS_03 = Field.Signed(19, "NUM_PVLS_03", 112, 7, 0);
        public static readonly Field VAL_PARAMETRO_03 = Field.Signed(20, "VAL_PARAMETRO_03", 120, 13, 0);
        public static readonly Field COD_PRESTAZ_03 = Field.Text(21, "COD_PRESTAZ_03", 134, 2);
        public static readonly Field COD_CLA_ID_04 = Field.Signed(22, "COD_CLA_ID_04", 136, 2, 0);
        public static readonly Field COD_CLA_SUB_04 = Field.Text(23, "COD_CLA_SUB_04", 139, 1);
        public static readonly Field NUM_PVLS_04 = Field.Signed(24, "NUM_PVLS_04", 140, 7, 0);
        public static readonly Field VAL_PARAMETRO_04 = Field.Signed(25, "VAL_PARAMETRO_04", 148, 13, 0);
        public static readonly Field COD_PRESTAZ_04 = Field.Text(26, "COD_PRESTAZ_04", 162, 2);
        public static readonly Field COD_CLA_ID_05 = Field.Signed(27, "COD_CLA_ID_05", 164, 2, 0);
        public static readonly Field COD_CLA_SUB_05 = Field.Text(28, "COD_CLA_SUB_05", 167, 1);
        public static readonly Field NUM_PVLS_05 = Field.Signed(29, "NUM_PVLS_05", 168, 7, 0);
        public static readonly Field VAL_PARAMETRO_05 = Field.Signed(30, "VAL_PARAMETRO_05", 176, 13, 0);
        public static readonly Field COD_PRESTAZ_05 = Field.Text(31, "COD_PRESTAZ_05", 190, 2);
        public static readonly Field COD_CLA_ID_06 = Field.Signed(32, "COD_CLA_ID_06", 192, 2, 0);
        public static readonly Field COD_CLA_SUB_06 = Field.Text(33, "COD_CLA_SUB_06", 195, 1);
        public static readonly Field NUM_PVLS_06 = Field.Signed(34, "NUM_PVLS_06", 196, 7, 0);
        public static readonly Field VAL_PARAMETRO_06 = Field.Signed(35, "VAL_PARAMETRO_06", 204, 13, 0);
        public static readonly Field COD_PRESTAZ_06 = Field.Text(36, "COD_PRESTAZ_06", 218, 2);
        public static readonly Field COD_CLA_ID_07 = Field.Signed(37, "COD_CLA_ID_07", 220, 2, 0);
        public static readonly Field COD_CLA_SUB_07 = Field.Text(38, "COD_CLA_SUB_07", 223, 1);
        public static readonly Field NUM_PVLS_07 = Field.Signed(39, "NUM_PVLS_07", 224, 7, 0);
        public static readonly Field VAL_PARAMETRO_07 = Field.Signed(40, "VAL_PARAMETRO_07", 232, 13, 0);
        public static readonly Field COD_PRESTAZ_07 = Field.Text(41, "COD_PRESTAZ_07", 246, 2);
        public static readonly Field COD_CLA_ID_08 = Field.Signed(42, "COD_CLA_ID_08", 248, 2, 0);
        public static readonly Field COD_CLA_SUB_08 = Field.Text(43, "COD_CLA_SUB_08", 251, 1);
        public static readonly Field NUM_PVLS_08 = Field.Signed(44, "NUM_PVLS_08", 252, 7, 0);
        public static readonly Field VAL_PARAMETRO_08 = Field.Signed(45, "VAL_PARAMETRO_08", 260, 13, 0);
        public static readonly Field COD_PRESTAZ_08 = Field.Text(46, "COD_PRESTAZ_08", 274, 2);
        public static readonly Field COD_CLA_ID_09 = Field.Signed(47, "COD_CLA_ID_09", 276, 2, 0);
        public static readonly Field COD_CLA_SUB_09 = Field.Text(48, "COD_CLA_SUB_09", 279, 1);
        public static readonly Field NUM_PVLS_09 = Field.Signed(49, "NUM_PVLS_09", 280, 7, 0);
        public static readonly Field VAL_PARAMETRO_09 = Field.Signed(50, "VAL_PARAMETRO_09", 288, 13, 0);
        public static readonly Field COD_PRESTAZ_09 = Field.Text(51, "COD_PRESTAZ_09", 302, 2);
        public static readonly Field COD_CLA_ID_10 = Field.Signed(52, "COD_CLA_ID_10", 304, 2, 0);
        public static readonly Field COD_CLA_SUB_10 = Field.Text(53, "COD_CLA_SUB_10", 307, 1);
        public static readonly Field NUM_PVLS_10 = Field.Signed(54, "NUM_PVLS_10", 308, 7, 0);
        public static readonly Field VAL_PARAMETRO_10 = Field.Signed(55, "VAL_PARAMETRO_10", 316, 13, 0);
        public static readonly Field COD_PRESTAZ_10 = Field.Text(56, "COD_PRESTAZ_10", 330, 2);
        public static readonly Field DAT_INIZ_VAL = Field.Date(57, "DAT_INIZ_VAL", 332);
        public static readonly Field COD_USER_INS = Field.Text(58, "COD_USER_INS", 342, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(59, "TMS_INS", 350);
        public static readonly Field COD_INDICIZZ_01 = Field.Text(60, "COD_INDICIZZ_01", 376, 1);
        public static readonly Field COD_INDICIZZ_02 = Field.Text(61, "COD_INDICIZZ_02", 377, 1);
        public static readonly Field COD_INDICIZZ_03 = Field.Text(62, "COD_INDICIZZ_03", 378, 1);
        public static readonly Field COD_INDICIZZ_04 = Field.Text(63, "COD_INDICIZZ_04", 379, 1);
        public static readonly Field COD_INDICIZZ_05 = Field.Text(64, "COD_INDICIZZ_05", 380, 1);
        public static readonly Field COD_INDICIZZ_06 = Field.Text(65, "COD_INDICIZZ_06", 381, 1);
        public static readonly Field COD_INDICIZZ_07 = Field.Text(66, "COD_INDICIZZ_07", 382, 1);
        public static readonly Field COD_INDICIZZ_08 = Field.Text(67, "COD_INDICIZZ_08", 383, 1);
        public static readonly Field COD_INDICIZZ_09 = Field.Text(68, "COD_INDICIZZ_09", 384, 1);
        public static readonly Field COD_INDICIZZ_10 = Field.Text(69, "COD_INDICIZZ_10", 385, 1);
    }
	
	    public static class RISPOSTA
    {
        public static readonly Table Table = new Table(0, "RISPOSTA", false, 300);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 5, 0);
        public static readonly Field NUM_QUESTION = Field.Signed(5, "NUM_QUESTION", 40, 7, 0);
        public static readonly Field NUM_DOMANDA = Field.Signed(6, "NUM_DOMANDA", 48, 5, 0);
        public static readonly Field PRG_RISPOSTA = Field.Signed(7, "PRG_RISPOSTA", 54, 3, 0);
        public static readonly Field NUM_RIGA_RISP = Field.Signed(8, "NUM_RIGA_RISP", 58, 3, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(9, "DAT_FINE_VAL", 62);
        public static readonly Field TIP_RISPOSTA = Field.Text(10, "TIP_RISPOSTA", 72, 1);
        public static readonly Field TIP_DATA = Field.Text(11, "TIP_DATA", 73, 1);
        public static readonly Field VAL_RISPOSTA = Field.Signed(12, "VAL_RISPOSTA", 74, 13, 0);
        public static readonly Field TXT_RISPOSTA = Field.Text(13, "TXT_RISPOSTA", 88, 70);
        public static readonly Field NUM_LISTA = Field.Signed(14, "NUM_LISTA", 158, 7, 0);
        public static readonly Field COD_VALUTA = Field.Signed(15, "COD_VALUTA", 166, 3, 0);
        public static readonly Field DAT_INIZ_VAL = Field.Date(16, "DAT_INIZ_VAL", 170);
        public static readonly Field COD_USER_INS = Field.Text(17, "COD_USER_INS", 180, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(18, "TMS_INS", 188);
        public static readonly Field COD_USER_MOD = Field.Text(19, "COD_USER_MOD", 214, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(20, "TMS_MOD", 222);

    }
    public static class DOCUMENTO
    {
        public static readonly Table Table = new Table(0, "DOCUMENTO", false, 400);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field TIP_DOCUMENTO = Field.Text(1, "TIP_DOCUMENTO", 4, 2);
        public static readonly Field NUM_DOCUMENTO = Field.Signed(2, "NUM_DOCUMENTO", 6, 13, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(3, "NUM_CONTRATTO", 20, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(4, "PRG_CONTRATTO", 34, 7, 0);
        public static readonly Field COD_DOC_CLASSIF = Field.Text(5, "COD_DOC_CLASSIF", 42, 2);
        public static readonly Field DAT_EFFETTO_COP = Field.Date(6, "DAT_EFFETTO_COP", 44);
        public static readonly Field DAT_SCAD_COP = Field.Date(7, "DAT_SCAD_COP", 54);
        public static readonly Field DAT_REGOLAZ = Field.Date(8, "DAT_REGOLAZ", 64);
        public static readonly Field TIP_DOCUMENTO_SOS = Field.Text(9, "TIP_DOCUMENTO_SOS", 74, 2);
        public static readonly Field NUM_DOCUMENTO_SOS = Field.Signed(10, "NUM_DOCUMENTO_SOS", 76, 13, 0);
        public static readonly Field NUM_AGENZIA_EMISS = Field.Signed(11, "NUM_AGENZIA_EMISS", 90, 7, 0);
        public static readonly Field DAT_EMISSIONE = Field.Date(12, "DAT_EMISSIONE", 98);
        public static readonly Field COD_STATO = Field.Text(13, "COD_STATO", 108, 1);
        public static readonly Field COD_ANNULL_DOC = Field.Text(14, "COD_ANNULL_DOC", 109, 1);
        public static readonly Field NUM_DISTINTA = Field.Signed(15, "NUM_DISTINTA", 110, 13, 0);
        public static readonly Field NUM_OPERAZIONE = Field.Signed(16, "NUM_OPERAZIONE", 124, 5, 0);
        public static readonly Field NUM_QUESTION = Field.Signed(17, "NUM_QUESTION", 130, 7, 0);
        public static readonly Field COD_SUB_CLASSIF = Field.Text(18, "COD_SUB_CLASSIF", 138, 1);
        public static readonly Field DAT_CONVALIDA = Field.Date(19, "DAT_CONVALIDA", 139);
        public static readonly Field DAT_PAGAMENTO = Field.Date(20, "DAT_PAGAMENTO", 149);
        public static readonly Field NUM_RIF_CATAL = Field.Signed(21, "NUM_RIF_CATAL", 159, 7, 0);
        public static readonly Field COD_CONVERS = Field.Signed(22, "COD_CONVERS", 167, 1, 0);
        public static readonly Field COD_VALUTA = Field.Signed(23, "COD_VALUTA", 169, 3, 0);
        public static readonly Field NUM_STAMPE = Field.Signed(24, "NUM_STAMPE", 173, 3, 0);
        public static readonly Field COD_DIR_CONTI = Field.Signed(25, "COD_DIR_CONTI", 177, 1, 0);
        public static readonly Field COD_FASE_CARTA = Field.Text(26, "COD_FASE_CARTA", 179, 1);
        public static readonly Field COD_TRASM = Field.Text(27, "COD_TRASM", 180, 2);
        public static readonly Field COD_ADEGUA = Field.Text(28, "COD_ADEGUA", 182, 1);
        public static readonly Field COD_CONGUA = Field.Text(29, "COD_CONGUA", 183, 1);
        public static readonly Field COD_FIRMA = Field.Text(30, "COD_FIRMA", 184, 1);
        public static readonly Field NUM_VERSIONE = Field.Signed(31, "NUM_VERSIONE", 185, 5, 0);
        public static readonly Field PER_APP_BERS_PI = Field.Signed(32, "PER_APP_BERS_PI", 191, 5, 2);
        public static readonly Field PER_NUOVA_PROD_PA = Field.Signed(33, "PER_NUOVA_PROD_PA", 197, 5, 2);
        public static readonly Field DAT_CONTAB_DOC = Field.Date(34, "DAT_CONTAB_DOC", 203);
        public static readonly Field COD_USER_INS = Field.Text(35, "COD_USER_INS", 213, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(36, "TMS_INS", 221, length: 26);
        public static readonly Field COD_USER_MOD = Field.Text(37, "COD_USER_MOD", 247, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(38, "TMS_MOD", 255);
        public static readonly Field COD_COMP_C = Field.Signed(39, "COD_COMP_C", 281, 3, 0);
        public static readonly Field TIP_CM = Field.Text(40, "TIP_CM", 285, 3);
        public static readonly Field FLG_DIGITALE = Field.Text(41, "FLG_DIGITALE", 288, 1);
        public static readonly Field FLG_RIEMISSIONE = Field.Text(42, "FLG_RIEMISSIONE", 289, 1);
        public static readonly Field DAT_IMPOSTE = Field.Date(43, "DAT_IMPOSTE", 290);
        public static readonly Field TIP_OPERAZIONE = Field.Text(44, "TIP_OPERAZIONE", 300, 3);
        public static readonly Field COD_SUBPROCESSO = Field.Text(45, "COD_SUBPROCESSO", 303, 3);
        public static readonly Field COD_CONTABILITA = Field.Text(46, "COD_CONTABILITA", 306, 1);
        public static readonly Field COD_MOD_PAGAMENTO = Field.Text(47, "COD_MOD_PAGAMENTO", 307, 2);

    }
	    public static class RISP_INCR
    {
        public static readonly Table Table = new Table(0, "RISP_INCR", false, 300);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 5, 0);
        public static readonly Field KEY_OGG_RISCHIO = Field.Signed(5, "KEY_OGG_RISCHIO", 40, 11, 0);
        public static readonly Field COD_RUOLO = Field.Signed(6, "COD_RUOLO", 52, 2, 0);
        public static readonly Field NUM_QUESTION = Field.Signed(7, "NUM_QUESTION", 55, 7, 0);
        public static readonly Field NUM_DOMANDA = Field.Signed(8, "NUM_DOMANDA", 63, 5, 0);
        public static readonly Field PRG_RISPOSTA = Field.Signed(9, "PRG_RISPOSTA", 69, 3, 0);
        public static readonly Field NUM_RIGA_RISP = Field.Signed(10, "NUM_RIGA_RISP", 73, 3, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(11, "DAT_FINE_VAL", 77);
        public static readonly Field TIP_RISPOSTA = Field.Text(12, "TIP_RISPOSTA", 87, 1);
        public static readonly Field TIP_DATA = Field.Text(13, "TIP_DATA", 88, 1);
        public static readonly Field VAL_RISPOSTA = Field.Signed(14, "VAL_RISPOSTA", 89, 13, 0);
        public static readonly Field TXT_RISPOSTA = Field.Text(15, "TXT_RISPOSTA", 103, 70);
        public static readonly Field NUM_LISTA = Field.Signed(16, "NUM_LISTA", 173, 7, 0);
        public static readonly Field COD_VALUTA = Field.Signed(17, "COD_VALUTA", 181, 3, 0);
        public static readonly Field DAT_INIZ_VAL = Field.Date(18, "DAT_INIZ_VAL", 185);
        public static readonly Field COD_USER_INS = Field.Text(19, "COD_USER_INS", 195, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(20, "TMS_INS", 203);
        public static readonly Field COD_USER_MOD = Field.Text(21, "COD_USER_MOD", 229, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(22, "TMS_MOD", 237);

    }
	    public static class SFORATURA
    {
        public static readonly Table Table = new Table(0, "SFORATURA", false, 300);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field TIP_DOCUMENTO = Field.Text(1, "TIP_DOCUMENTO", 4, 2);
        public static readonly Field NUM_DOCUMENTO = Field.Signed(2, "NUM_DOCUMENTO", 6, 13, 0);
        public static readonly Field PRG_SFORATURA = Field.Signed(3, "PRG_SFORATURA", 20, 7, 0);
        public static readonly Field TIP_AUTOR = Field.Text(4, "TIP_AUTOR", 28, 3);
        public static readonly Field KEY_REC_AUTOR = Field.Text(5, "KEY_REC_AUTOR", 31, 24);
        public static readonly Field COD_LIV_AUTOR = Field.Signed(6, "COD_LIV_AUTOR", 55, 1, 0);
        public static readonly Field COD_MOTIVO_AUTOR = Field.Text(7, "COD_MOTIVO_AUTOR", 57, 4);
        public static readonly Field COD_STATO_SFO = Field.Text(8, "COD_STATO_SFO", 61, 1);
        public static readonly Field TXT_CATAL = Field.Text(9, "TXT_CATAL", 62, 70);
        public static readonly Field COD_USER_INS = Field.Text(10, "COD_USER_INS", 132, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(11, "TMS_INS", 140);
        public static readonly Field COD_USER_MOD = Field.Text(12, "COD_USER_MOD", 166, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(13, "TMS_MOD", 174);
    }
	    public static class AGENZIA_CONTR
    {
        public static readonly Table Table = new Table(0, "AGENZIA_CONTR", false, 300);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field NUM_AGENZIA = Field.Signed(3, "NUM_AGENZIA", 26, 7, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(4, "DAT_FINE_VAL", 34);
        public static readonly Field COD_SUBAGENZIA = Field.Signed(5, "COD_SUBAGENZIA", 44, 4, 0);
        public static readonly Field COD_SUBAGENTE = Field.Signed(6, "COD_SUBAGENTE", 49, 3, 0);
        public static readonly Field COD_PRODUTTORE = Field.Text(7, "COD_PRODUTTORE", 53, 7);
        public static readonly Field COD_CARICO = Field.Text(8, "COD_CARICO", 60, 1);
        public static readonly Field DAT_TRAS_SCOR = Field.Date(9, "DAT_TRAS_SCOR", 61);
        public static readonly Field DAT_EFF_COMPET = Field.Date(10, "DAT_EFF_COMPET", 71);
        public static readonly Field DAT_REG_TRA_SCO = Field.Date(11, "DAT_REG_TRA_SCO", 81);
        public static readonly Field NUM_AGENZIA_PREC = Field.Signed(12, "NUM_AGENZIA_PREC", 91, 7, 0);
        public static readonly Field DAT_SCAD_EFF_PREC = Field.Date(13, "DAT_SCAD_EFF_PREC", 99);
        public static readonly Field PER_PROVV_ACQ = Field.Signed(14, "PER_PROVV_ACQ", 109, 5, 2);
        public static readonly Field PER_PROVV_INC = Field.Signed(15, "PER_PROVV_INC", 115, 5, 2);
        public static readonly Field DAT_CONTAB_GIRO = Field.Date(16, "DAT_CONTAB_GIRO", 121);
        public static readonly Field DAT_INIZ_VAL = Field.Date(17, "DAT_INIZ_VAL", 131);
        public static readonly Field COD_USER_INS = Field.Text(18, "COD_USER_INS", 141, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(19, "TMS_INS", 149);
        public static readonly Field COD_USER_MOD = Field.Text(20, "COD_USER_MOD", 175, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(21, "TMS_MOD", 183);
        public static readonly Field COD_COMP_C = Field.Signed(22, "COD_COMP_C", 209, 3, 0);
        public static readonly Field COD_COMP_C_PREC = Field.Signed(23, "COD_COMP_C_PREC", 213, 3, 0);

    }
	    public static class COASS_QUOTA
    {
        public static readonly Table Table = new Table(0, "COASS_QUOTA", false, 300);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field COD_DELEGATARIA = Field.Text(3, "COD_DELEGATARIA", 26, 1);
        public static readonly Field COD_COMP_COASS = Field.Signed(4, "COD_COMP_COASS", 27, 3, 0);
        public static readonly Field NUM_AGENZIA_COASS = Field.Signed(5, "NUM_AGENZIA_COASS", 31, 7, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(6, "DAT_FINE_VAL", 39);
        public static readonly Field PER_QUOTA = Field.Signed(7, "PER_QUOTA", 49, 5, 3);
        public static readonly Field TXT_ULT_COMPAG = Field.Text(8, "TXT_ULT_COMPAG", 55, 70);
        public static readonly Field COD_RIMBORSO = Field.Signed(9, "COD_RIMBORSO", 125, 1, 0);
        public static readonly Field DAT_INIZ_VAL = Field.Date(10, "DAT_INIZ_VAL", 127);
        public static readonly Field COD_USER_INS = Field.Text(11, "COD_USER_INS", 137, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(12, "TMS_INS", 145);
        public static readonly Field COD_USER_MOD = Field.Text(13, "COD_USER_MOD", 171, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(14, "TMS_MOD", 179);
        //**coass 
        public static readonly Field PER_QUOTA_PREMIO = Field.Signed(15, "PER_QUOTA_PREMIO", 205, 5, 3);
        public static readonly Field FLG_DELEGA_SIN = Field.Text(16, "FLG_DELEGA_SIN", 211, 1);
    }
	    public static class CONVENZIONE
    {
        public static readonly Table Table = new Table(0, "CONVENZIONE", false, 200);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field KEY_CONVENZIONE = Field.Signed(3, "KEY_CONVENZIONE", 26, 9, 0);
        public static readonly Field COD_CONVENZ_COMM = Field.Text(4, "COD_CONVENZ_COMM", 36, 6);
        public static readonly Field DAT_INGRESSO_CONV = Field.Date(5, "DAT_INGRESSO_CONV", 42);
        public static readonly Field DAT_USCITA_CONV = Field.Date(6, "DAT_USCITA_CONV", 52);
        public static readonly Field COD_PROD_PARTIC = Field.Text(7, "COD_PROD_PARTIC", 62, 1);
        public static readonly Field COD_NAZIONALE = Field.Text(8, "COD_NAZIONALE", 63, 1);
        public static readonly Field COD_AZIENDA = Field.Text(9, "COD_AZIENDA", 64, 1);
        public static readonly Field TIP_ACCORDO_CONV = Field.Text(10, "TIP_ACCORDO_CONV", 65, 1);
        public static readonly Field COD_USER_INS = Field.Text(11, "COD_USER_INS", 66, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(12, "TMS_INS", 74);
        public static readonly Field COD_USER_MOD = Field.Text(13, "COD_USER_MOD", 100, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(14, "TMS_MOD", 108);
    }
	
    public static class PAR_CONGUAGLIO_READ  // NO COMMENT
    {
        public static readonly Table Table = new Table(0, "PAR_CONGUAGLIO", false, 400);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 7, 0);   // campo definito DECIMAL(7,0) diversamente da PARTITA e tutte le altre che hanno DECIMAL(5,0)
        public static readonly Field PRG_RCD_PARAM = Field.Signed(5, "PRG_RCD_PARAM", 42, 1, 0);
        public static readonly Field NUM_PARAM = Field.Signed(6, "NUM_PARAM", 44, 2, 0);
        public static readonly Field DAT_RIFERIMENTO = Field.Date(7, "DAT_RIFERIMENTO", 47);
        public static readonly Field COD_COMUNICAZIONE = Field.Text(8, "COD_COMUNICAZIONE", 57, 1);
        public static readonly Field DAT_FINE_VAL = Field.Date(9, "DAT_FINE_VAL", 58);
        public static readonly Field VAL_PARAMETRO = Field.Signed(10, "VAL_PARAMETRO", 68, 13, 0);
        public static readonly Field VAL_TAS_REALE = Field.Signed(11, "VAL_TAS_REALE", 82, 11, 0);
        public static readonly Field VAL_TAS_SCALA = Field.Signed(12, "VAL_TAS_SCALA", 94, 11, 0);
        public static readonly Field IMP_PRE_EFFETTIVO = Field.Signed(13, "IMP_PRE_EFFETTIVO", 106, 13, 0);
        public static readonly Field IMP_PRE_TEORICO = Field.Signed(14, "IMP_PRE_TEORICO", 120, 13, 0);
        public static readonly Field VAL_STA_SCALA = Field.Signed(15, "VAL_STA_SCALA", 134, 11, 0);
        public static readonly Field NUM_LISTA = Field.Signed(16, "NUM_LISTA", 146, 5, 0);
        public static readonly Field NUM_LISTA_STAMP = Field.Signed(17, "NUM_LISTA_STAMP", 152, 5, 0);
        public static readonly Field COD_PRESTAZIONE = Field.Text(18, "COD_PRESTAZIONE", 158, 2);
        public static readonly Field COD_VALUTA = Field.Signed(19, "COD_VALUTA", 160, 3, 0);
        public static readonly Field DAT_INIZ_VAL = Field.Date(20, "DAT_INIZ_VAL", 164);
        public static readonly Field COD_USER_INS = Field.Text(21, "COD_USER_INS", 174, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(22, "TMS_INS", 182);
        public static readonly Field COD_USER_MOD = Field.Text(23, "COD_USER_MOD", 208, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(24, "TMS_MOD", 216);
        public static readonly Field IMP_PRE_MINIMO = Field.Signed(25, "IMP_PRE_MINIMO", 242, 13, 0);
        public static readonly Field IMP_CONG_NETTO = Field.Signed(26, "IMP_CONG_NETTO", 256, 13, 0);
        public static readonly Field IMP_CONG_LORDO = Field.Signed(27, "IMP_CONG_LORDO", 270, 13, 0);
        public static readonly Field COD_RAMO_CONTAB = Field.Signed(28, "COD_RAMO_CONTAB", 284, 4, 0);
        public static readonly Field PER_SCONTO = Field.Signed(29, "PER_SCONTO", 289, 5, 0);
        public static readonly Field IMP_PRE_MIN_PARZ = Field.Signed(30, "IMP_PRE_MIN_PARZ", 295, 13, 0);
    }

    public static class CONTRATTO_INTEGR
    {
        public static readonly Table Table = new Table(0, "CONTRATTO_INTEGR", true, 800);

        public static readonly Field COD_COMP = Field.Signed(0, "COI-COD-COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "COI-NUM-CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "COI-PRG-CONTRATTO", 18, 7, 0);
        public static readonly Field COD_DATO = Field.Text(3, "COI-COD-DATO", 26, 10);
        public static readonly Field COD_KEY_DATO = Field.Text(4, "COI-COD-KEY-DATO", 36, 30);
        public static readonly Field DAT_FINE_VAL = Field.Date(5, "COI-DAT-FINE-VAL", 66);
        public static readonly Field TIP_DATO = Field.Text(6, "COI-TIP-DATO", 76, 3);
        public static readonly Field TXT_DATO = Field.Text(7, "COI-TXT-DATO", 79, 255);
        public static readonly Field DAT_INIZ_VAL = Field.Date(8, "COI-DAT-INIZ-VAL", 334);
        public static readonly Field COD_USER_INS = Field.Text(9, "COI-COD-USER-INS", 344, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(10, "COI-TMS-INS", 352);
        public static readonly Field COD_USER_MOD = Field.Text(11, "COI-COD-USER-MOD", 378, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(12, "COI-TMS-MOD", 386);

    }
	    public static class PAR_CONGUAGLIO_EST
    {
        public static readonly Table Table = new Table(0, "PAR_CONGUAGLIO_EST", false, 800);

        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3, 0);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13, 0);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7, 0);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 7, 0);
        public static readonly Field PRG_RCD_PARAM = Field.Signed(5, "PRG_RCD_PARAM", 42, 1, 0);
        public static readonly Field NUM_PARAM = Field.Signed(6, "NUM_PARAM", 44, 2, 0);
        public static readonly Field DAT_RIFERIMENTO = Field.Date(7, "DAT_RIFERIMENTO", 47);
        public static readonly Field COD_COMUNICAZIONE = Field.Text(8, "COD_COMUNICAZIONE", 57, 1);
        public static readonly Field DAT_FINE_VAL = Field.Date(9, "DAT_FINE_VAL", 58);
        public static readonly Field FLG_DECISIONALE = Field.Signed(10, "FLG_DECISIONALE", 68, 3, 0);
        public static readonly Field FLG_AUMENTO_SCONTO = Field.Text(11, "FLG_AUMENTO_SCONTO", 72, 1);
        public static readonly Field DES_NOTA_LEN = Field.Signed(12, "DES_NOTA_LEN", 73, 4, 0);
        public static readonly Field DES_NOTA_TEXT = Field.Text(13, "DES_NOTA_TEXT", 78, 200);
        public static readonly Field DES_PAR = Field.Text(14, "DES_PAR", 278, 20);
        public static readonly Field IMP_PAR = Field.Signed(15, "IMP_PAR", 298, 15, 0);
        public static readonly Field COD_USER_INS = Field.Text(16, "COD_USER_INS", 314, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(17, "TMS_INS", 322);
        public static readonly Field COD_USER_MOD = Field.Text(18, "COD_USER_MOD", 348, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(19, "TMS_MOD", 356);
        public static readonly Field DAT_INIZ_VAL = Field.Date(20, "DAT_INIZ_VAL", 382);
        public static readonly Field PER_TASSO = Field.Signed(21, "PER_TASSO", 392, 5, 2);
        public static readonly Field PER_INCRE = Field.Signed(22, "PER_INCRE", 398, 5, 2);
        public static readonly Field IMP_PRE_MASSIMO = Field.Signed(23, "IMP_PRE_MASSIMO", 404, 13, 0);
    }
	
	    public static class TASSE_LPS
    {
        public static readonly Table Table = new Table(0, "TASSE_LPS", false, 800);
        public static readonly Field COD_COMP = Field.Signed(1, "COD-COMP", 0, 3);
        public static readonly Field CONTRATTO = Field.Signed(2, "NUM-CONTRATTO", 4, 13);
        public static readonly Field PRG_CONTRATTO = Field.Signed(3, "PRG-CONTRATTO", 18, 7);
        public static readonly Field NSQUOTA = Field.Text(4, "PCT-NSQUOTA", 26, 7);
        public static readonly Field DAT_RIFERIMENTO = Field.Text(7, "DATA-RIFERIMENTO", 33, 10);
        public static readonly Field PAESE = Field.Text(0, "PAESE", 43, 3);
        public static readonly Field DESCR_PAESE = Field.Text(8, "DESCR-PAESE", 46, 50);
        public static readonly Field VAL_ASSIC = Field.Signed(9, "VAL-ASSIC", 96, 13);
        public static readonly Field VAL_ASSIC_DI = Field.Signed(9, "VAL-ASSIC-DI", 110, 13);
        public static readonly Field TAB_PARAM = Field.Text(10, "TAB-PARAM", 124, 60);
        public static readonly Field TAB_GAR = Field.Text(11, "TAB-GAR", 184, 567); // INIZ '0'
    }
	    public static class PARTITA_CONTAB
    {
        public static readonly Table Table = new Table(0, "PARTITA_CONTAB", false, 200);
        public static readonly Field COD_COMP = Field.Signed(0, "COD_COMP", 0, 3);
        public static readonly Field NUM_CONTRATTO = Field.Signed(1, "NUM_CONTRATTO", 4, 13);
        public static readonly Field PRG_CONTRATTO = Field.Signed(2, "PRG_CONTRATTO", 18, 7);
        public static readonly Field PRG_SCHEDA = Field.Signed(3, "PRG_SCHEDA", 26, 7, 0);
        public static readonly Field PRG_PARTITA = Field.Signed(4, "PRG_PARTITA", 34, 5, 0);
        public static readonly Field PRG_RECORD = Field.Signed(5, "PRG_RECORD", 40, 3, 0);
        public static readonly Field DAT_FINE_VAL = Field.Date(6, "DAT_FINE_VAL", 44);
        public static readonly Field PER_RIPART = Field.Signed(7, "PER_RIPART", 54, 7, 0);
        public static readonly Field COD_RAMO_FORTE = Field.Signed(8, "COD_RAMO_FORTE", 62, 4, 0);
        public static readonly Field DAT_INIZ_VAL = Field.Date(9, "DAT_INIZ_VAL", 67);
        public static readonly Field COD_USER_INS = Field.Text(10, "COD_USER_INS", 77, 8);
        public static readonly Field TMS_INS = Field.TimeStamp(11, "TMS_INS", 85);
        public static readonly Field COD_USER_MOD = Field.Text(12, "COD_USER_MOD", 111, 8);
        public static readonly Field TMS_MOD = Field.TimeStamp(13, "TMS_MOD", 119);
    }
	
	
	Crea una lista 
	- Nome blocco 1
		- Proprietà 1 blocco, nome proprietà, posizione, lunghezza
		- Proprietà 2 blocco, nome proprietà, posizione, lunghezza
		.....
		- Proprietà 23 blocco, nome proprietà, posizione, lunghezza
	- Nome blocco 2
		- Proprietà 1 blocco, nome proprietà, posizione, lunghezza